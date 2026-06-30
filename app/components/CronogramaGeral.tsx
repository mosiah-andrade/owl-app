"use client";
import { Aula } from "../types";
import { Calendar, CheckCircle2, ChevronRight } from "lucide-react";

interface CronogramaGeralProps {
  aulas: Aula[];
  disciplinaFiltro: string;
  onAbrirDetalhes: (aula: Aula) => void;
}

export default function CronogramaGeral({ aulas, disciplinaFiltro, onAbrirDetalhes }: CronogramaGeralProps) {
  const formatarDataBR = (dataStr?: string) => {
    if (!dataStr) return "--/--/--";
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const aulasFiltradas = aulas.filter((aula) => 
    disciplinaFiltro === "Todas" || aula.disciplina === disciplinaFiltro
  );

  if (aulasFiltradas.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-sm">Nenhum estudo encontrado nesta disciplina.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {aulasFiltradas.map((aula) => {
        const progressoIndividual = Math.round(((aula.estagioAtual ?? 0) / 3) * 100);
        
        const getRevData = (etapa: number) => {
          if (Array.isArray(aula.datasRevisao)) {
            return aula.datasRevisao.find(r => r.etapa === etapa)?.data;
          }
          const formatoAntigo = aula.datasRevisao as any;
          if (etapa === 1) return formatoAntigo?.r1;
          if (etapa === 2) return formatoAntigo?.r7;
          if (etapa === 3) return formatoAntigo?.r21;
          return undefined;
        };

        const isConcluido = aula.estagioAtual >= 3;

        return (
          <li 
            key={aula.id} 
            onClick={() => onAbrirDetalhes(aula)} 
            className="group p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-pink-200 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="min-w-0">
                <h4 className="font-bold text-slate-800 truncate mb-1">{aula.nomeAula}</h4>
                <span className="text-[10px] uppercase tracking-wider font-bold text-pink-500 bg-pink-50 px-2 py-0.5 rounded-md">
                  {aula.disciplina}
                </span>
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${isConcluido ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"}`}>
                {isConcluido ? <CheckCircle2 size={12} /> : null}
                {isConcluido ? "Concluído" : `Estágio ${aula.estagioAtual}/3`}
              </div>
            </div>

            {/* Barra de Progresso Customizada */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-pink-400 rounded-full transition-all duration-500" style={{ width: `${progressoIndividual}%` }} />
            </div>

            {/* Grid de Datas */}
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-50">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Estudo</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">R1</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">R2</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">R3</div>
              
              <div className="text-xs font-medium text-slate-700">{formatarDataBR(aula.dataEstudo)}</div>
              {[1, 2, 3].map((etapa) => (
                <div key={etapa} className="text-xs font-medium text-slate-700">
                  {formatarDataBR(getRevData(etapa))}
                </div>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}