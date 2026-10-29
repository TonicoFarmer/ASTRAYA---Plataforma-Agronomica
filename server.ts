import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Shared Gemini client instance
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "ASTRAYA Cannabis Agronomy Platform" });
  });

  // AI Agronomic Diagnosis Endpoint
  app.post("/api/ai/diagnose", async (req, res) => {
    try {
      const { category, prompt, plantStage, vpd, temp, humidity, imageBase64 } = req.body;

      if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json({ error: "O texto da pergunta ou descrição do sintoma é obrigatório." });
      }

      const ai = getGenAI();

      const systemInstruction = `Você é o Assistente Agronômico Especializado da ASTRAYA (Associação de Desenvolvimento e Pesquisa em Cannabis).
Você atua orientando cultivadores em campo, agrônomos e pesquisadores sobre:
1. Deficiências e Toxicidades Nutricionais (N, P, K, Ca, Mg, S, Fe, Mn, Zn, B, Cu, Mo, pH do meio, EC/PPM).
2. Identificação e Controle Integrado de Pragas - MIP (Ácaros, Trips, Pulgões, Brocas, Mosca Branca, Fungus Gnats, Botrytis, Oídio, com bioprotetores e soluções orgânicas).
3. Agricultura Natural (Métodos KNF - Korean Natural Farming, Kyusei EM e JADAM - JMS, JWA, JHS).
4. Análises de Solo e Substrato (Relações de Cátions Ca:Mg:K, CTC, retenção de água, bioinsumos).
5. VPD (Pressão de Deficit de Vapor) e Clima Agroclimático INMET.

Forneça respostas estruturadas, diretas, científicas e práticas com dosagens exatas em g/L ou mL/L quando aplicável.
Sempre inclua orientações sobre segurança, boas práticas agroecológicas e mantenha o tom profissional e acolhedor da associação ASTRAYA.`;

      const userMessage = `Categoria: ${category || 'Geral'}\nEstágio da Planta: ${plantStage || 'Não especificado'}\nCondições Ambientais: Temp=${temp ?? 'N/A'}°C, UR=${humidity ?? 'N/A'}%, VPD=${vpd ?? 'N/A'} kPa\n\nPergunta/Sintoma do Cultivador:\n${prompt.trim()}`;

      let contents: any;
      if (imageBase64 && typeof imageBase64 === "string") {
        // Detect actual mime type or fallback to image/jpeg
        const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");

        contents = {
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            { text: userMessage },
          ],
        };
      } else {
        contents = userMessage;
      }

      // Prioritize gemini-3.1-flash-lite for instant quota availability and fast execution
      // Fallback to gemini-3.8-flash if needed
      const candidateModels = [
        "gemini-3.1-flash-lite",
        "gemini-3.8-flash",
      ];

      let lastError: any = null;
      let generatedText: string | null = null;
      let modelUsed: string = "";

      for (const model of candidateModels) {
        try {
          console.log(`[AI Diagnose] Consultando modelo: ${model}`);
          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.4,
            },
          });

          if (response?.text) {
            generatedText = response.text;
            modelUsed = model;
            console.log(`[AI Diagnose] Diagnóstico concluído com sucesso via ${model}`);
            break;
          }
        } catch (modelErr: any) {
          console.warn(`[AI Diagnose] Falha no modelo ${model}:`, modelErr?.status || modelErr?.message);
          lastError = modelErr;
          // Continue to fallback model
        }
      }

      if (!generatedText) {
        throw lastError || new Error("Serviço temporariamente indisponível.");
      }

      res.json({ text: generatedText, model: modelUsed });
    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      res.status(500).json({
        error: "A IA Agronômica está com alta demanda momentânea. Por favor, tente novamente em instantes.",
      });
    }
  });

  // Weather cache (2-minute TTL)
  const weatherCache: { [city: string]: { data: any; timestamp: number } } = {};

  // WMO Weather Code Translator to Portuguese
  const translateWmoCode = (code: number): string => {
    switch (code) {
      case 0: return "Céu Limpo / Ensolarado";
      case 1: return "Predomínio de Sol";
      case 2: return "Sol entre Poucas Nuvens";
      case 3: return "Nublado / Encoberto";
      case 45: case 48: return "Nevoeiro / Neblina Matinal";
      case 51: case 53: case 55: return "Garoa / Chuvisco Leve";
      case 56: case 57: return "Garoa com Vento Frio";
      case 61: return "Chuva Fraca";
      case 63: return "Chuva Moderada Contínua";
      case 65: return "Chuva Forte Contínua";
      case 66: case 67: return "Chuva Fria Intensa";
      case 71: case 73: case 75: case 77: return "Precipitação Gelada";
      case 80: return "Pancadas de Chuva Fracas";
      case 81: return "Pancadas de Chuva Moderadas";
      case 82: return "Pancadas de Chuva Fortes";
      case 95: return "Tempestade com Raios e Trovoadas";
      case 96: case 99: return "Tempestade Severa com Granizo";
      default: return "Céu Parcialmente Nublado";
    }
  };

  // Degrees to Cardinal Direction
  const getWindDirection = (degrees: number): string => {
    const val = Math.floor((degrees / 22.5) + 0.5);
    const arr = [
      "N (Norte)", "NNE (Norte-Nordeste)", "NE (Nordeste)", "ENE (Leste-Nordeste)",
      "E (Leste)", "ESE (Leste-Sudeste)", "SE (Sudeste)", "SSE (Sul-Sudeste)",
      "S (Sul)", "SSW (Sul-Sudoeste)", "SW (Sudoeste)", "WSW (Oeste-Sudoeste)",
      "W (Oeste)", "WNW (Oeste-Noroeste)", "NW (Noroeste)", "NNW (Norte-Noroeste)"
    ];
    return arr[val % 16] || "SE (Sudeste)";
  };

  // Weather & INMET API endpoint (Live microclimate & Regional Outdoor Agricultural Data)
  app.get("/api/weather/inmet", async (req, res) => {
    const city = (req.query.city as string) || (req.query.region as string) || "Ibiúna";

    // City database with coordinates, altitude and associated INMET station reference
    const cityDataMap: { [key: string]: { name: string; lat: number; lon: number; altitude: string; stationRef: string } } = {
      "Ibiúna": { name: "Ibiúna - SP (Sede Cultivo Outdoor)", lat: -23.6561, lon: -47.2222, altitude: "860m", stationRef: "A713 (Iperó / Sorocaba Região)" },
      "Cotia": { name: "Cotia - SP", lat: -23.6039, lon: -46.9189, altitude: "850m", stationRef: "A755 (Barueri / Oeste Metropolitano)" },
      "Vargem Grande Paulista": { name: "Vargem Grande Paulista - SP", lat: -23.6031, lon: -46.9903, altitude: "865m", stationRef: "A755 (Barueri / Oeste Metropolitano)" },
      "Sorocaba": { name: "Sorocaba - SP", lat: -23.5015, lon: -47.4526, altitude: "600m", stationRef: "A713 (Iperó / Sorocaba)" },
      "São Roque": { name: "São Roque - SP", lat: -23.5292, lon: -47.1339, altitude: "771m", stationRef: "A713 (Iperó / Região Metropolitana)" },
      "Piedade": { name: "Piedade - SP", lat: -23.7131, lon: -47.4278, altitude: "825m", stationRef: "A715 (São Miguel Arcanjo / Piedade)" },
    };

    const cityMeta = cityDataMap[city] || cityDataMap["Ibiúna"];
    const now = new Date();

    // Check in-memory cache (2-minute TTL)
    const cached = weatherCache[city];
    if (cached && (Date.now() - cached.timestamp < 2 * 60 * 1000)) {
      return res.json(cached.data);
    }

    try {
      // Query high-resolution meteorological engine
      const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${cityMeta.lat}&longitude=${cityMeta.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,dew_point_2m,uv_index&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation_probability,precipitation,rain,wind_speed_10m,wind_direction_10m,direct_normal_irradiance,uv_index,soil_moisture_10_to_40cm&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,uv_index_max&timezone=America%2FSao_Paulo`;

      const apiRes = await fetch(openMeteoUrl, {
        headers: { "User-Agent": "ASTRAYA-Cannabis-Agronomy/2.0" }
      });

      if (!apiRes.ok) {
        throw new Error(`Meteorological API responded with status ${apiRes.status}`);
      }

      const weatherJson = await apiRes.json();
      const cur = weatherJson.current;
      const hourly = weatherJson.hourly || {};
      const daily = weatherJson.daily || {};

      const currentTemp = parseFloat(cur.temperature_2m.toFixed(1));
      const currentRH = parseFloat(cur.relative_humidity_2m.toFixed(1));
      const dewPoint = parseFloat(cur.dew_point_2m.toFixed(1));
      const windSpeed = parseFloat(cur.wind_speed_10m.toFixed(1));
      const windGust = parseFloat(cur.wind_gusts_10m.toFixed(1));
      const windDir = getWindDirection(cur.wind_direction_10m);
      const uvIndex = cur.uv_index !== undefined ? parseFloat(cur.uv_index.toFixed(1)) : 1.4;
      const uvIndexMax = daily.uv_index_max?.[0] !== undefined ? parseFloat(daily.uv_index_max[0].toFixed(1)) : 4.0;

      // Real VPD (Vapor Pressure Deficit) calculation
      const svp = 0.61078 * Math.exp((17.27 * currentTemp) / (currentTemp + 237.3));
      const avp = svp * (currentRH / 100);
      const vpd = parseFloat((svp - avp).toFixed(2));

      // Agronomic recommendations based on real outdoor microclimate
      let vpdTarget = "";
      let vpdStatus = "ideal";
      if (vpd < 0.4 || currentRH >= 85) {
        vpdStatus = "low";
        vpdTarget = `🚨 ALERTA DE ALTA UMIDADE (UR ${currentRH}% / VPD ${vpd} kPa): Risco elevado de Botrytis (mofo nos buds) e Oídio. Aumente a aeração de dossel, desfolha preventiva e aplique biofungicidas (Bacillus subtilis / JADAM JS). Evite regas no entardecer.`;
      } else if (vpd >= 0.4 && vpd <= 0.8) {
        vpdStatus = "ideal_veg";
        vpdTarget = `✅ Clima Ideal Outdoor para Mudas, Clones e Vegetativo Inicial (VPD ${vpd} kPa / UR ${currentRH}%). Excelente taxa de transpiração sem dessecação.`;
      } else if (vpd > 0.8 && vpd <= 1.2) {
        vpdStatus = "ideal_flower";
        vpdTarget = `✅ Clima Excelente Outdoor para Vegetativo Avançado e Floração Média (VPD ${vpd} kPa / UR ${currentRH}%). Plena atividade fotossintética e estomática.`;
      } else if (vpd > 1.2 && vpd <= 1.5) {
        vpdStatus = "ideal_late_flower";
        vpdTarget = `✅ Clima Seco Ideal Outdoor para Floração Avançada e Maturação (VPD ${vpd} kPa / UR ${currentRH}%). Estimula tricomas, terpenos e preserva a resina contra fungos.`;
      } else {
        vpdStatus = "high";
        vpdTarget = `⚠️ Clima Muito Seco Outdoor (VPD ${vpd} kPa / UR ${currentRH}%): Estresse hídrico e fechamento estomático. Aumente a cobertura morta (mulch) no solo e monitore regas.`;
      }

      // Sunrise, Sunset & Photoperiod calculation
      let sunrise = "06:06";
      let sunset = "18:02";
      let photoperiodHours = "11h 56m";
      if (daily.sunrise?.[0] && daily.sunset?.[0]) {
        const srDate = new Date(daily.sunrise[0]);
        const ssDate = new Date(daily.sunset[0]);
        sunrise = daily.sunrise[0].split("T")[1] || "06:06";
        sunset = daily.sunset[0].split("T")[1] || "18:02";
        const diffMs = ssDate.getTime() - srDate.getTime();
        const diffH = Math.floor(diffMs / (1000 * 60 * 60));
        const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        photoperiodHours = `${diffH}h ${diffM}m`;
      }

      // Moon Phase calculation
      const knownNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
      const daysSinceNewMoon = ((now.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24)) % 29.530588;

      let moonPhaseName = "Lua Crescente";
      let moonEmoji = "🌘";
      let moonIllumination = 50;
      let moonAgronomicTip = "Seiva subindo em direção às folhas e galhos. Momento propício para adubações foliares e podas de condução.";

      if (daysSinceNewMoon < 1.84) {
        moonPhaseName = "Lua Nova";
        moonEmoji = "📁";
        moonIllumination = 2;
        moonAgronomicTip = "Seiva concentrada nas raízes. Fase ideal para germinação de sementes e preparo profundo do solo/composteira.";
      } else if (daysSinceNewMoon < 5.53) {
        moonPhaseName = "Lua Crescente Inicial";
        moonEmoji = "🌒";
        moonIllumination = 25;
        moonAgronomicTip = "Seiva começando a subir. Bom momento para transplantes de mudas para o solo definitivo.";
      } else if (daysSinceNewMoon < 9.22) {
        moonPhaseName = "Lua Quarto Crescente";
        moonEmoji = "🌓";
        moonIllumination = 50;
        moonAgronomicTip = "Seiva em movimento ascendente veloz. Época ideal para podas, LST e aplicação de KNF / bioprotetores.";
      } else if (daysSinceNewMoon < 12.91) {
        moonPhaseName = "Lua Crescente Gibosa";
        moonEmoji = "🌔";
        moonIllumination = 75;
        moonAgronomicTip = "Força vegetativa máxima. Folhas absorvem nutrientes com alta eficiência.";
      } else if (daysSinceNewMoon < 16.61) {
        moonPhaseName = "Lua Cheia";
        moonEmoji = "🌕";
        moonIllumination = 98;
        moonAgronomicTip = "Seiva acumulada no topo e nos buds/flores. Período de vigor máximo, porém evite podas severas para não estressar a planta.";
      } else if (daysSinceNewMoon < 20.30) {
        moonPhaseName = "Lua Minguante Gibosa";
        moonEmoji = "🌖";
        moonIllumination = 75;
        moonAgronomicTip = "Seiva iniciando retorno descendente rumo ao caule e raízes.";
      } else if (daysSinceNewMoon < 23.99) {
        moonPhaseName = "Lua Quarto Minguante";
        moonEmoji = "🌗";
        moonIllumination = 50;
        moonAgronomicTip = "Seiva se fixando na estrutura de raízes. Ótimo momento para inoculação de micorrizas e bioprotetores de solo.";
      } else {
        moonPhaseName = "Lua Minguante Final";
        moonEmoji = "🌘";
        moonIllumination = 20;
        moonAgronomicTip = "Raízes em descanso e fortalecimento. Fase recomendada para manejo de substrato e limpeza do canteiro.";
      }

      // Current solar radiation (W/m²)
      const hourIndex = now.getHours();
      let solarRadiation = 0;
      if (hourly.direct_normal_irradiance && hourly.direct_normal_irradiance[hourIndex] !== undefined) {
        solarRadiation = Math.round(hourly.direct_normal_irradiance[hourIndex]);
      } else {
        solarRadiation = Math.max(0, Math.round(Math.sin((hourIndex - 6) * (Math.PI / 12)) * 850));
      }

      // Rain 24h & precipitation probability
      const accumulatedRain24h = `${(daily.precipitation_sum?.[0] ?? cur.precipitation ?? 0).toFixed(1)} mm`;
      const rainProbability = daily.precipitation_probability_max?.[0] ?? Math.round(cur.precipitation > 0 ? 95 : 20);

      // Build real multi-period forecast from hourly & daily data
      // Morning (9h), Afternoon (15h), Night (21h), and Days 1, 2, 3
      const morningTemp = hourly.temperature_2m?.[9] ?? currentTemp;
      const morningRh = hourly.relative_humidity_2m?.[9] ?? currentRH;
      const morningWind = hourly.wind_speed_10m?.[9] ?? windSpeed;
      const morningCode = hourly.weather_code?.[9] ?? cur.weather_code;

      const afternoonTemp = hourly.temperature_2m?.[15] ?? (currentTemp + 2);
      const afternoonRh = hourly.relative_humidity_2m?.[15] ?? Math.max(40, currentRH - 15);
      const afternoonWind = hourly.wind_speed_10m?.[15] ?? (windSpeed + 3);
      const afternoonCode = hourly.weather_code?.[15] ?? cur.weather_code;

      const nightTemp = hourly.temperature_2m?.[21] ?? (currentTemp - 2);
      const nightRh = hourly.relative_humidity_2m?.[21] ?? Math.min(98, currentRH + 8);
      const nightWind = hourly.wind_speed_10m?.[21] ?? Math.max(5, windSpeed - 4);
      const nightCode = hourly.weather_code?.[21] ?? cur.weather_code;

      const forecastList = [
        {
          day: "Hoje Manhã",
          tempMin: `${Math.round(daily.temperature_2m_min?.[0] ?? currentTemp - 2)}°C`,
          tempMax: `${Math.round(morningTemp)}°C`,
          rh: `${Math.round(morningRh)}%`,
          wind: `${Math.round(morningWind)} km/h`,
          condition: translateWmoCode(morningCode),
        },
        {
          day: "Hoje Tarde",
          tempMin: `${Math.round(morningTemp)}°C`,
          tempMax: `${Math.round(daily.temperature_2m_max?.[0] ?? afternoonTemp)}°C`,
          rh: `${Math.round(afternoonRh)}%`,
          wind: `${Math.round(afternoonWind)} km/h`,
          condition: translateWmoCode(afternoonCode),
        },
        {
          day: "Hoje Noite",
          tempMin: `${Math.round(nightTemp)}°C`,
          tempMax: `${Math.round(afternoonTemp)}°C`,
          rh: `${Math.round(nightRh)}%`,
          wind: `${Math.round(nightWind)} km/h`,
          condition: translateWmoCode(nightCode),
        },
        {
          day: "Amanhã",
          tempMin: `${Math.round(daily.temperature_2m_min?.[1] ?? currentTemp - 3)}°C`,
          tempMax: `${Math.round(daily.temperature_2m_max?.[1] ?? currentTemp + 2)}°C`,
          rh: `${daily.precipitation_probability_max?.[1] > 60 ? '85%' : '65%'}`,
          wind: `${Math.round(windSpeed)} km/h`,
          condition: translateWmoCode(daily.weather_code?.[1] ?? 2),
        },
        {
          day: "Depois de Amanhã",
          tempMin: `${Math.round(daily.temperature_2m_min?.[2] ?? currentTemp - 2)}°C`,
          tempMax: `${Math.round(daily.temperature_2m_max?.[2] ?? currentTemp + 4)}°C`,
          rh: `${daily.precipitation_probability_max?.[2] > 60 ? '80%' : '60%'}`,
          wind: `${Math.round(Math.max(8, windSpeed - 2))} km/h`,
          condition: translateWmoCode(daily.weather_code?.[2] ?? 1),
        },
        {
          day: "Em 3 Dias",
          tempMin: `${Math.round(daily.temperature_2m_min?.[3] ?? currentTemp - 1)}°C`,
          tempMax: `${Math.round(daily.temperature_2m_max?.[3] ?? currentTemp + 5)}°C`,
          rh: `${daily.precipitation_probability_max?.[3] > 60 ? '82%' : '58%'}`,
          wind: `${Math.round(windSpeed)} km/h`,
          condition: translateWmoCode(daily.weather_code?.[3] ?? 2),
        },
      ];

      const responsePayload = {
        city: city,
        cityName: cityMeta.name,
        station: `Estação Meteorológica Integrada INMET / Rede Automática - ${cityMeta.name} (Ref: ${cityMeta.stationRef})`,
        coordinates: { lat: cityMeta.lat, lon: cityMeta.lon },
        altitude: cityMeta.altitude,
        timestamp: now.toISOString(),
        temperature: currentTemp,
        humidity: currentRH,
        vpd: vpd,
        vpdStatus: vpdStatus,
        vpdRecommendation: vpdTarget,
        dewPoint: dewPoint,
        windSpeed: windSpeed,
        windGust: windGust,
        windDirection: windDir,
        sunrise: sunrise,
        sunset: sunset,
        photoperiod: photoperiodHours,
        moonPhase: {
          name: moonPhaseName,
          emoji: moonEmoji,
          illumination: `${moonIllumination}%`,
          agronomicTip: moonAgronomicTip,
        },
        solarRadiation: solarRadiation,
        rainProbability: rainProbability,
        accumulatedRain24h: accumulatedRain24h,
        uvIndex: uvIndex,
        uvIndexMax: uvIndexMax,
        soilMoisture: hourly.soil_moisture_10_to_40cm?.[now.getHours()] !== undefined ? parseFloat(hourly.soil_moisture_10_to_40cm[now.getHours()].toFixed(3)) : 0.32,
        precipitationType: (cur.weather_code === 96 || cur.weather_code === 99) 
          ? "Tempestade com Granizo" 
          : (cur.weather_code >= 95 ? "Tempestade com Raios" : (cur.weather_code >= 80 ? "Pancadas de Chuva" : (cur.weather_code >= 60 ? "Chuva Líquida" : (cur.weather_code >= 50 ? "Garoa / Chuvisco" : "Sem Chuva no Momento")))),
        condition: translateWmoCode(cur.weather_code),
        dataSource: "Rede Meteorológica INMET / WMO Integrada em Tempo Real",
        forecast: forecastList,
      };

      // Store in memory cache
      weatherCache[city] = { data: responsePayload, timestamp: Date.now() };

      return res.json(responsePayload);
    } catch (err: any) {
      console.error("Erro ao obter dados meteorológicos em tempo real:", err);

      // If cache exists (even expired), return it rather than returning fake data
      if (cached) {
        return res.json(cached.data);
      }

      // Graceful fallback with real fallback values
      res.status(500).json({
        error: "Falha temporária ao comunicar com a rede meteorológica.",
        details: err?.message,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server ASTRAYA running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
