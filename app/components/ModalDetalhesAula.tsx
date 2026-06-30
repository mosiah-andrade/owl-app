"use client";
import { useState, useEffect } from "react";
import { Aula } from "../types";
import { X, Trash2, ExternalLink, Plus, Save } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  aula: Aula | null;
  onAtualizar: (aula: Aula) => void;
  onExcluir: (id: string) => void;
}

export default function ModalDetalhesAula({ isOpen, onClose, aula, onAtualizar, onExcluir }: Props) {
  const [dados, setDados] = useState<Aula | null>(null);
  const [novoLink, setNovoLink] = useState("");

  useEffect(() => {
    if (aula) setDados(aula);
  }, [aula]);

  if (!isOpen || !dados) return null;

  const handleSalvar = () => { onAtualizar(dados); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-800">Editar Aula</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto space-y-6 pr-2">
          {/* Inputs Principais */}
          <div className="space-y-4">
            <input 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:border-pink-300 transition-all font-bold text-slate-800" 
              value={dados.nomeAula}
              onChange={(e) => setDados({...dados, nomeAula: e.target.value})}
            />
            <textarea 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 min-h-[100px] outline-none focus:border-pink-300 transition-all text-sm" 
              placeholder="Adicione suas anotações..."
              value={dados.conteudo || ""}
              onChange={(e) => setDados({...dados, conteudo: e.target.value})}
            />
          </div>

          {/* Links e Materiais */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Materiais</label>
            <div className="flex gap-2">
              <input 
                className="flex-1 bg-slate-50 rounded-2xl p-4 outline-none border border-slate-100 focus:border-pink-300 text-sm" 
                placeholder="https://..."
                value={novoLink}
                onChange={(e) => setNovoLink(e.target.value)}
              />
              <button 
                onClick={() => {
                  if(!novoLink.trim()) return;
                  setDados({ ...dados, linksMateriais: [...(dados.linksMateriais || []), novoLink] });
                  setNovoLink("");
                }} 
                className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800"
              >
                <Plus size={20} />
              </button>
            </div>
            
            {/* Lista de links renderizada */}
            <div className="space-y-2">
              {(dados.linksMateriais || []).map((link, i) => (
                <div key={i} className="flex items-center gap-2 bg-pink-50 text-pink-600 p-3 rounded-xl text-xs font-medium">
                  <ExternalLink size={14} />
                  <span className="truncate flex-1">{link}</span>
                  <button onClick={() => setDados({...dados, linksMateriais: dados.linksMateriais?.filter((_, idx) => idx !== i)})} className="text-pink-400 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-6 mt-2 border-t border-slate-100">
          <button onClick={() => { onExcluir(dados.id); onClose(); }} className="flex items-center gap-2 text-red-500 text-sm font-bold p-2">
            <Trash2 size={16} /> Excluir
          </button>
          <button 
            onClick={handleSalvar} 
            className="flex items-center gap-2 bg-pink-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all"
          >
            <Save size={18} /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}