"use client";
import { Aula } from "../types";

interface CronogramaGeralProps {
  aulas: Aula[];
  disciplinaFiltro: string; // Nova prop para o filtro
}

export default function CronogramaGeral({ aulas, disciplinaFiltro }: CronogramaGeralProps) {
  const formatarDataBR = (dataStr: string) => {
    if (!dataStr) return "";
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Aplica o filtro de disciplina se não for a opção padrão "Todas"
  const aulasFiltradas = aulas.filter((aula) => {
    if (disciplinaFiltro === "Todas") return true;
    return aula.disciplina === disciplinaFiltro;
  });

  if (aulasFiltradas.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-6">Nenhum estudo encontrado nesta disciplina.</p>;
  }

  return (
    <ul className="space-y-4">
      {aulasFiltradas.map((aula) => {
        // Calcula a porcentagem individual da aula (estagioAtual vai de 0 a 4)
        const progressoIndividual = Math.round(((aula.estagioAtual ?? 0) / 4) * 100);

        return (
          <li key={aula.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-2 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-800 leading-tight">{aula.nomeAula}</h4>
                <span className="text-xs font-semibold text-pink-500">{aula.disciplina}</span>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${aula.estagioAtual >= 4 ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                {aula.estagioAtual >= 4 ? "Concluído 🏆" : `Estágio ${aula.estagioAtual}/4`}
              </span>
            </div>

            {/* BARRA DE PROGRESSO INDIVIDUAL DA AULA */}
            <div className="w-full mt-1">
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-pink-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressoIndividual}%` }}
                />
              </div>
              <span className="text-[9px] text-gray-400 text-right block mt-0.5 font-medium">
                {progressoIndividual}% dominado
              </span>
            </div>

            {/* Linha do Cronograma das Próximas Revisões */}
            <div className="grid grid-cols-2 gap-2 mt-1 pt-2 border-t border-gray-200/40 text-[11px] text-gray-500">
              <div><span className="font-medium">Estudo:</span> {formatarDataBR(aula.dataEstudo)}</div>
              <div className={aula.revisoesConcluidas?.includes("r1") ? "line-through text-gray-300" : ""}><span className="font-medium">R1 (1d):</span> {formatarDataBR(aula.datasRevisao?.r1)}</div>
              <div className={aula.revisoesConcluidas?.includes("r7") ? "line-through text-gray-300" : ""}><span className="font-medium">R2 (7d):</span> {formatarDataBR(aula.datasRevisao?.r7)}</div>
              <div className={aula.revisoesConcluidas?.includes("r21") ? "line-through text-gray-300" : ""}><span className="font-medium">R3 (21d):</span> {formatarDataBR(aula.datasRevisao?.r21)}</div>
              <div className={`col-span-2 ${aula.revisoesConcluidas?.includes("r60") ? "line-through text-gray-300" : ""}`}><span className="font-medium">R4 (60d):</span> {formatarDataBR(aula.datasRevisao?.r60)}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}