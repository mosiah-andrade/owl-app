"use client";
import { X, Trash2, BookOpen } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  disciplinas: string[];
  onExcluir: (nome: string) => void;
}

export default function ModalGerenciarMaterias({ isOpen, onClose, disciplinas, onExcluir }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-800">Suas Matérias</h2>
          <button 
            onClick={onClose} 
            className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Lista */}
        {disciplinas.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-slate-400">Nenhuma matéria cadastrada.</p>
          </div>
        ) : (
          <ul className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {disciplinas.map((disc, idx) => (
              <li 
                key={idx} 
                className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-pink-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-pink-400 shadow-sm">
                    <BookOpen size={16} />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">{disc}</span>
                </div>
                
                <button 
                  onClick={() => onExcluir(disc)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Excluir matéria"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Footer info */}
        <p className="text-[10px] text-center text-slate-400 mt-6 uppercase tracking-widest font-bold">
            Gerenciamento de Disciplinas
        </p>
      </div>
    </div>
  );
}