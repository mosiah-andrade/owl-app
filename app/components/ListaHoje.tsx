"use client";
import { Aula } from "../types";
import { Check, BookOpen, Clock } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-slate-50 p-4 rounded-full mb-3">
            <span className="text-3xl">🎉</span>
        </div>
        <p className="text-sm text-slate-500 font-medium">Tudo limpo por hoje!</p>
        <p className="text-xs text-slate-400">Aproveite seu tempo livre.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {aulas.map((aula) => (
        <li 
          key={aula.id} 
          className="group relative flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-pink-200 transition-all duration-300"
        >
          {/* Container clicável para detalhes */}
          <div 
            onClick={() => onAbrirDetalhes(aula)} 
            className="flex-1 flex items-center gap-4 cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 font-bold mb-1">
                {aula.estagioAtual === 0 ? "Novo" : `R${aula.estagioAtual}`}
              </span>
            </div>
            
            <div className="min-w-0">
              <h4 className="font-bold text-slate-800 truncate">{aula.nomeAula}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-pink-500 bg-pink-50 px-2 py-0.5 rounded-md">
                    {aula.disciplina}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> {obterTextoBadge(aula)}
                </span>
              </div>
            </div>
          </div>

          {/* Botão de Ação (Afastado para não ser clicado por acidente) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConcluir(aula.id);
            }}
            className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 cursor-pointer ${
              isPomodoroFinished 
                ? "bg-pink-500 text-white shadow-lg shadow-pink-200 animate-bounce scale-110" 
                : "bg-slate-50 text-slate-400 hover:bg-green-100 hover:text-green-600"
            }`}
          >
            <Check size={24} strokeWidth={3} />
          </button>
        </li>
      ))}
    </ul>
  );
}