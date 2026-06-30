"use client";
import { Prova } from "../types";
import { Calendar, Trash2, GraduationCap } from "lucide-react";

interface Props {
  provas: Prova[];
  onExcluir: (id: string) => void;
  onAbrirDetalhes: (prova: Prova) => void;
}

export default function ListaProvas({ provas, onExcluir, onAbrirDetalhes }: Props) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-3">
      {provas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
          <GraduationCap size={40} className="mb-3 opacity-20" />
          <p className="text-sm font-medium">Nenhuma prova agendada.</p>
        </div>
      ) : (
        provas.map((p) => {
          const dataProva = new Date(p.dataProva);
          const isPassada = dataProva < hoje;

          return (
            <div 
              key={p.id} 
              // O clique principal abre os detalhes
              onClick={() => onAbrirDetalhes(p)} 
              className={`group bg-white p-4 rounded-2xl border transition-all flex justify-between items-center cursor-pointer ${
                isPassada 
                  ? "border-slate-100 opacity-60" 
                  : "border-slate-100 shadow-sm hover:border-pink-200 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`p-3 rounded-2xl transition-colors ${
                  isPassada ? "bg-slate-50 text-slate-300" : "bg-slate-50 text-slate-400 group-hover:bg-pink-50 group-hover:text-pink-500"
                }`}>
                  <GraduationCap size={20} />
                </div>
                
                <div className="min-w-0">
                  <h4 className={`font-bold truncate ${isPassada ? "text-slate-400 line-through" : "text-slate-800"}`}>
                    {p.nomeProva}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="font-bold uppercase tracking-wide bg-slate-50 px-2 py-0.5 rounded-md">
                      {p.disciplina}
                    </span>
                    <span className={`flex items-center gap-1 ${isPassada ? "text-red-300" : "text-slate-500"}`}>
                      <Calendar size={10} />
                      {new Date(p.dataProva).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão de Excluir com e.stopPropagation para evitar conflito com o clique do card */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onExcluir(p.id);
                }} 
                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Excluir prova"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}