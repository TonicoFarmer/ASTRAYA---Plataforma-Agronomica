import React, { useState } from 'react';
import { KnfJadamRecipe } from '../types';
import { Leaf, Calculator, Sparkles, Check, ChevronRight, BookOpen } from 'lucide-react';

interface KnfJadamSectionProps {
  recipes: KnfJadamRecipe[];
}

export const KnfJadamSection: React.FC<KnfJadamSectionProps> = ({ recipes }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [targetVolumeLiters, setTargetVolumeLiters] = useState<number>(10);
  const [expandedId, setExpandedId] = useState<string | null>(recipes[0]?.id || null);

  const filtered = recipes.filter(
    (r) => selectedMethod === 'all' || r.method === selectedMethod
  );

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-green-950 p-4 rounded-2xl border border-emerald-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-800/80 rounded-xl text-emerald-300 shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-base text-emerald-100">
              1.3 Métodos KNF (Korean Natural Farming), KYUSEI e JADAM
            </h2>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              Técnicas agroecológicas de alta eficiência, bioinsumos produzidos na própria associação e sem insumos sintéticos de petróleo.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Volume Batch Calculator Bar */}
      <div className="bg-slate-900 border border-emerald-800/80 rounded-2xl p-4 text-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-emerald-300">
                Calculadora de Dosagem para Pulverização / Fertirrigação
              </h3>
              <p className="text-xs text-slate-400">
                Insira o volume do tanque ou pulverizador em Litros para dosar automaticamente:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-medium text-slate-300 whitespace-nowrap">Volume Tanque:</span>
            <input
              type="number"
              min="1"
              max="1000"
              value={targetVolumeLiters}
              onChange={(e) => setTargetVolumeLiters(Math.max(1, Number(e.target.value)))}
              className="w-24 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-center font-bold text-emerald-400 text-sm focus:outline-none focus:border-emerald-500"
            />
            <span className="text-xs text-slate-400">Litros</span>
          </div>
        </div>
      </div>

      {/* Method Filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {['all', 'KNF', 'JADAM', 'KYUSEI EM'].map((method) => (
          <button
            key={method}
            onClick={() => setSelectedMethod(method)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedMethod === method
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            {method === 'all' ? 'Todos os Métodos' : method}
          </button>
        ))}
      </div>

      {/* Recipe List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((recipe) => {
          const isExpanded = expandedId === recipe.id;

          // Calculate dosage for target volume
          // Extract ratio e.g., 1:1000 or 1:500
          let dosageMl = targetVolumeLiters * 1; // Default 1ml/L
          if (recipe.applicationDosage.includes('1:500')) dosageMl = targetVolumeLiters * 2;
          if (recipe.applicationDosage.includes('10 a 15 mL')) dosageMl = targetVolumeLiters * 12.5;
          if (recipe.applicationDosage.includes('2 mL a 5 mL')) dosageMl = targetVolumeLiters * 3.5;

          return (
            <div
              key={recipe.id}
              className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
                isExpanded ? 'border-emerald-500 ring-1 ring-emerald-500/40' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : recipe.id)}
                className="p-4 cursor-pointer flex items-center justify-between gap-3 select-none"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                      {recipe.method}
                    </span>
                    <h3 className="font-bold text-sm text-slate-100">{recipe.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{recipe.description}</p>
                </div>

                <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-950 rounded-lg border border-emerald-800 shrink-0">
                  {isExpanded ? 'Recolher' : 'Ver Receita'}
                </span>
              </div>

              {isExpanded && (
                <div className="p-4 bg-slate-950/90 border-t border-slate-800 text-xs space-y-4">
                  {/* Dosagem Calculada */}
                  <div className="p-3 bg-emerald-950/80 border border-emerald-600/60 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider block">
                        Dosagem Calculada para {targetVolumeLiters} Litros de Água
                      </span>
                      <span className="text-sm font-bold text-white mt-0.5 block">
                        Adicionar ~ <span className="text-amber-300 text-base">{dosageMl.toFixed(1)} mL</span> de {recipe.name.split(' - ')[0]}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-200/80 italic font-medium">
                      Padrão: {recipe.applicationDosage}
                    </span>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h4 className="font-bold text-emerald-400 text-xs uppercase mb-1.5">
                      Ingredientes e Proporção de Preparo
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {recipe.ingredients.map((ing, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                          <span className="text-slate-200 font-medium">{ing.name}</span>
                          <span className="text-emerald-300 font-bold ml-2 shrink-0">{ing.ratio}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Steps */}
                  <div>
                    <h4 className="font-bold text-emerald-400 text-xs uppercase mb-1.5">
                      Passo a Passo de Fermentação & Extração
                    </h4>
                    <ol className="list-decimal pl-4 space-y-1.5 text-slate-300">
                      {recipe.steps.map((st, idx) => (
                        <li key={idx} className="leading-relaxed">{st}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Benefits */}
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                    <h4 className="font-bold text-emerald-300 text-xs mb-1">
                      Benefícios no Cultivo de Cannabis
                    </h4>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
                      {recipe.benefits.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
