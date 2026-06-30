"use client";
import { useState, useEffect } from "react";
import { X, GraduationCap, Calendar, Tag, Save, Trash2 } from "lucide-react";
import { Prova } from "../types"; 

interface ModalProvaProps {
  isOpen: boolean;
  onClose: () => void;
  prova: Prova | null; // null = novo cadastro, preenchido = edição
  onSalvar: (prova: any) => void;
  onExcluir?: (id: string) => void;
}

export default function ModalProva({ isOpen, onClose, prova, onSalvar, onExcluir }: ModalProvaProps) {
  const [nomeProva, setNomeProva] = useState("");
  const [disciplina, setDisciplina] = useState("Farmacologia 💊");
  const [dataProva, setDataProva] = useState(() => new Date().toISOString().split("T")[0]);
  const [informacoes, setInformacoes] = useState("");

  // Preenche o formulário se estivermos editando uma prova existente
  useEffect(() => {
    if (prova) {
      setNomeProva(prova.nomeProva);
      setDisciplina(prova.disciplina);
      setDataProva(prova.dataProva);
      setInformacoes(prova.informacoes || "")
    } else {
      setNomeProva("");
      setDisciplina("Farmacologia 💊");
      setDataProva(new Date().toISOString().split("T")[0]);
    }
  }, [prova, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!nomeProva.trim()) return;
    onSalvar({ ...prova, nomeProva, disciplina, dataProva, informacoes });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-800">
            {prova ? "Editar Prova" : "Agendar Prova"}
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Disciplina */}
          <div className="relative">
            <Tag size={20} className="absolute left-4 top-4 text-slate-400" />
            <input 
              className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-slate-800 outline-none focus:ring-2 focus:ring-pink-200 transition-all"
              value={disciplina}
              onChange={(e) => setDisciplina(e.target.value)}
              placeholder="Disciplina"
            />
          </div>

          {/* Nome */}
          <div className="relative">
            <GraduationCap size={20} className="absolute left-4 top-4 text-slate-400" />
            <input 
              className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-slate-800 outline-none focus:ring-2 focus:ring-pink-200 transition-all"
              value={nomeProva}
              onChange={(e) => setNomeProva(e.target.value)}
              placeholder="Nome da prova"
            />
          </div>

          {/* Data */}
          <div className="relative">
            <Calendar size={20} className="absolute left-4 top-4 text-slate-400" />
            <input 
              type="date"
              className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-slate-800 outline-none focus:ring-2 focus:ring-pink-200 transition-all"
              value={dataProva}
              onChange={(e) => setDataProva(e.target.value)}
            />
          </div>
          <div className="relative">
            <Tag size={20} className="absolute left-4 top-4 text-slate-400" />
            <textarea 
                className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-slate-800 outline-none focus:ring-2 focus:ring-pink-200 transition-all min-h-[100px]"
                value={informacoes}
                onChange={(e) => setInformacoes(e.target.value)}
                placeholder="Informações adicionais (ex: local, conteúdo, peso...)"
            />
        </div>

          {/* Ações */}
          <div className="flex gap-3 mt-4">
            {prova && onExcluir && (
              <button 
                onClick={() => { onExcluir(prova.id); onClose(); }}
                className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button 
              onClick={handleSubmit} 
              className="flex-1 py-4 bg-pink-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all"
            >
              <Save size={18} /> {prova ? "Atualizar" : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}