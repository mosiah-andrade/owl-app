"use client";
import { Aula } from "../types";

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

  const aulasFiltradas = aulas.filter((aula) => {
    return disciplinaFiltro === "Todas" || aula.disciplina === disciplinaFiltro;
  });

  if (aulasFiltradas.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-6">Nenhum estudo encontrado nesta disciplina.</p>;
  }

  return (
    <ul className="space-y-4">
      {aulasFiltradas.map((aula) => {
        const progressoIndividual = Math.round(((aula.estagioAtual ?? 0) / 4) * 100);
        
        // Helper único e limpo para pegar a data
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

        return (
          <li key={aula.id} onClick={() => onAbrirDetalhes(aula)} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-2 transition-all cursor-pointer hover:bg-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-800 leading-tight">{aula.nomeAula}</h4>
                <span className="text-xs font-semibold text-pink-500">{aula.disciplina}</span>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${aula.estagioAtual >= 3 ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                {aula.estagioAtual >= 3 ? "Concluído 🏆" : `Estágio ${aula.estagioAtual}/3`}
              </span>
            </div>

            <div className="w-full mt-1">
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-pink-400 rounded-full transition-all duration-500" style={{ width: `${progressoIndividual}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1 pt-2 border-t border-gray-200/40 text-[11px] text-gray-500">
              <div><span className="font-medium">Estudo:</span> {formatarDataBR(aula.dataEstudo)}</div>
              {[1, 2, 3].map((etapa) => (
                <div key={etapa}>
                  <span className="font-medium">R{etapa}:</span> {formatarDataBR(getRevData(etapa))}
                </div>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}