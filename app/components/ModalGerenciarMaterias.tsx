import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  disciplinas: string[];
  onExcluir: (nome: string) => void;
}

export default function ModalGerenciarMaterias({ isOpen, onClose, disciplinas, onExcluir }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-sm">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold text-[var(--color-rosa-500)]">Gerenciar Matérias</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer">✕</button>
        </div>
        
        {disciplinas.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Nenhuma matéria cadastrada.</p>
        ) : (
          <ul className="max-h-[60vh] overflow-y-auto pr-1">
            {disciplinas.map((disc, idx) => (
              <li key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-2 border border-gray-100">
                <span className="font-semibold text-gray-700 text-sm">{disc}</span>
                <button 
                  onClick={() => onExcluir(disc)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded text-xs font-bold transition-colors cursor-pointer"
                  title="Excluir matéria"
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}