"use client";
import { Aula } from "../types";

interface ListaHojeProps {
  aulas: Aula[];
  onConcluir: (id: string) => void;
  obterTextoBadge: (aula: Aula) => string;
}

export default function ListaHoje({ aulas, onConcluir, obterTextoBadge }: ListaHojeProps) {
  if (aulas.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-3xl">🎉</span>
        <p className="text-sm text-gray-400 mt-2">Tudo limpo! Nenhuma tarefa pendente para hoje.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {aulas.map((aula, index) => (
        <li key={aula.id} className="flex flex-col p-3 bg-gray-50 rounded-xl border border-gray-100 shadow-xs">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                onChange={() => onConcluir(aula.id)} 
                className="w-5 h-5 rounded border-gray-300 text-pink-500 focus:ring-pink-400 mt-0.5 cursor-pointer accent-pink-500" 
              />
              <div>
                <span className="font-semibold text-gray-800 block leading-tight">{aula.nomeAula}</span>
                {aula.topico && <span className="text-xs text-gray-400 block mt-0.5">{aula.topico}</span>}
              </div>
            </div>
            <span className="text-[9px] font-bold px-2 py-1 bg-pink-50 text-pink-600 rounded-full h-fit">
              {obterTextoBadge(aula)}
            </span>
          </div>
          <div className="text-[11px] text-gray-400 mt-2 flex justify-between items-center pl-8 border-t border-gray-100 pt-1.5">
            <span>{aula.disciplina}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}