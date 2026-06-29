"use client";
import { Aula } from "../types";

interface ListaHojeProps {
  aulas: Aula[];
  onConcluir: (id: string) => void;
  obterTextoBadge: (aula: Aula) => string;
  onAbrirDetalhes: (aula: Aula) => void;
  isPomodoroFinished?: boolean;
}

export default function ListaHoje({ aulas, onConcluir, obterTextoBadge, onAbrirDetalhes, isPomodoroFinished }: ListaHojeProps) {
  if (aulas.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-3xl">🎉</span>\
        <p className="text-sm text-gray-400 mt-2">Tudo limpo! Nenhuma tarefa pendente para hoje.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {aulas.map((aula) => (
        <li 
          key={aula.id} 
          onClick={() => onAbrirDetalhes(aula)} 
          className="group flex flex-col p-4 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConcluir(aula.id);
                }}
                className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold transition-all ${
                  isPomodoroFinished 
                    ? "bg-[var(--color-rosa-500)] text-white animate-pulse ring-4 ring-pink-100" 
                    : "bg-green-50 text-green-600 hover:bg-green-100"
                }`}
              >
                {isPomodoroFinished ? "!" : "✓"}
              </button>
              
              <div>
                <h4 className="font-bold text-slate-800">{aula.nomeAula}</h4>
                <p className="text-xs text-slate-400 font-medium">{aula.disciplina}</p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-3 py-1 bg-slate-50 text-slate-500 rounded-full">
              {obterTextoBadge(aula)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}