import React, { useState } from 'react';
import { X, Sparkles, Send, Image as ImageIcon, RefreshCw, CheckCircle2, Copy, Check, AlertCircle } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  'Como identificar e corrigir deficiência de Nitrogênio e Magnésio?',
  'Como preparar e aplicar JMS e JWA (JADAM) no cultivo orgânico?',
  'Manejo integrado de pragas contra ácaros rajados na floração',
  'Qual a faixa ideal de VPD e umidade para evitar Botrytis em floração?',
  'Como calcular a relação Ca:Mg:K ideal na análise de solo?',
];

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState('');
  const [plantStage, setPlantStage] = useState('Vegetativo');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAsk = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const query = (customPrompt ?? prompt).trim();
    if (!query) return;

    if (customPrompt) {
      setPrompt(customPrompt);
    }

    setLoading(true);
    setResponse(null);
    setErrorMessage(null);
    setCopied(false);

    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'Diagnóstico Agronômico Especializado ASTRAYA',
          prompt: query,
          plantStage,
          imageBase64: selectedImage,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMessage(data.error || 'Erro na comunicação com a IA Agronômica.');
      } else {
        setResponse(data.text);
      }
    } catch (err: any) {
      setErrorMessage('Erro de conexão com o servidor. Verifique sua rede e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-700/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0 my-8 text-slate-100">
        {/* Header */}
        <div className="p-4 bg-emerald-950 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-800 rounded-xl text-amber-300 shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">IA Agronômica ASTRAYA</h3>
                <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-semibold">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80">
                Assistente Especializado em Cannabis Medicinal, Nutrição, MIP & Agricultura Natural
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Quick Prompts Chips */}
          <div>
            <label className="block text-slate-400 text-[11px] font-medium mb-1.5">
              Sugestões rápidas de consulta:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAsk(undefined, qp)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-950/80 border border-slate-700 hover:border-emerald-500 text-[11px] text-slate-300 hover:text-emerald-200 transition text-left"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAsk} className="space-y-3 pt-1 border-t border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Fase Fenológica da Planta</label>
                <select
                  value={plantStage}
                  onChange={(e) => setPlantStage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Mudas / Clones">Clones / Mudas</option>
                  <option value="Vegetativo">Vegetativo</option>
                  <option value="Floração Inicial">Floração Inicial (Semanas 1-3)</option>
                  <option value="Floração Avançada">Floração Avançada (Semanas 4-7)</option>
                  <option value="Maturação / Flush">Maturação / Flush</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Foto da Folha / Praga / Solo</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                    id="modal-img-upload"
                  />
                  <label
                    htmlFor="modal-img-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-slate-950 text-slate-200 rounded-xl border border-slate-700 font-medium transition hover:border-emerald-500"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>{selectedImage ? 'Alterar Foto' : 'Carregar Imagem'}</span>
                  </label>
                  {selectedImage && (
                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="text-rose-400 hover:text-rose-300 font-semibold text-xs"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail Preview if selected */}
            {selectedImage && (
              <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
                <img
                  src={selectedImage}
                  alt="Pré-visualização"
                  className="w-16 h-16 object-cover rounded-lg border border-slate-700"
                />
                <div className="text-slate-300 text-xs">
                  <span className="font-semibold text-emerald-400">Imagem anexada para diagnose visual</span>
                  <p className="text-[11px] text-slate-400">A IA analisará padrões de clorose, necrose ou infestação na imagem.</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-medium mb-1">Qual a sua dúvida técnica ou sintoma observado?</label>
              <textarea
                rows={3}
                required
                placeholder="Exemplo: Folhas inferiores com amarelecimento intervenal e pontas queimadas em solo vivo, regado a pH 6.3..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition border border-emerald-400/30 disabled:border-slate-700 disabled:text-slate-500"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                  <span>Processando Diagnóstico com IA...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Consultar IA Agronômica ASTRAYA</span>
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-700/80 rounded-2xl flex items-start gap-2.5 text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <p className="font-semibold">Falha ao obter diagnóstico:</p>
                <p className="text-rose-300 text-[11px]">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => handleAsk()}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-rose-900/80 hover:bg-rose-800 text-rose-100 rounded-lg text-[11px] font-semibold transition"
                >
                  <RefreshCw className="w-3 h-3" />
                  Tentar Novamente
                </button>
              </div>
            </div>
          )}

          {/* AI Response output */}
          {response && (
            <div className="p-4 bg-slate-950 border border-emerald-700/80 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-bold text-emerald-300 flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Diagnóstico e Parecer Técnico ASTRAYA:
                </h4>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] transition"
                  title="Copiar resposta"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <div className="text-slate-200 whitespace-pre-wrap leading-relaxed space-y-2 pt-2">
                {response}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
