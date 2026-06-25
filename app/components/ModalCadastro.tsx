"use client";
import { useState } from "react";
import { Aula } from "../types";
import SeletorDisciplina from "./SeletorDisciplina";

interface ModalCadastroProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvar: (aulaDados: Omit<Aula, "id" | "datasRevisao" | "estagioAtual" | "revisoesConcluidas">) => void;
}

export default function ModalCadastro({ isOpen, onClose, onSalvar }: ModalCadastroProps) {
  const [disciplina, setDisciplina] = useState("Farmacologia 💊");
  const [nomeAula, setNomeAula] = useState("");
  const [topico, setTopico] = useState("");
  const [dataEstudo, setDataEstudo] = useState(() => new Date().toISOString().split("T")[0]);
  const [descricao, setDescricao] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!nomeAula.trim()) return alert("Por favor, digite o nome da aula!");
    
    onSalvar({ disciplina, nomeAula, topico, dataEstudo, descricao });
    
    setNomeAula("");
    setTopico("");
    setDescricao("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl border border-pink-100 overflow-hidden max-h-[92vh] flex flex-col font-alan">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center bg-pink-50/50 px-6 py-5 border-b border-pink-100/60">
          <h3 className="text-xl font-bold text-gray-700 font-display">Cadastrar Novo Estudo</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-white text-gray-400 hover:text-gray-600 rounded-full shadow-sm border border-gray-100 text-lg cursor-pointer">
            &times;
          </button>
        </div>

        {/* Formulário */}
        <div className="p-6 overflow-y-auto space-y-5 text-left">
          
          {/* DISCIPLINA COMPONENTIZADA */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Disciplina</label>
            <SeletorDisciplina value={disciplina} onChange={setDisciplina} />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Nome da Aula</label>
            <input value={nomeAula} onChange={(e) => setNomeAula(e.target.value)} className="w-full border border-pink-100/80 p-3 rounded-xl bg-pink-50/10 focus:outline-none focus:border-[var(--color-rosa-500)] text-gray-700 placeholder-gray-300" placeholder="Ex: Aula 01 - Farmacocinética Geral" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tópico ou Subtópico (Opcional)</label>
            <input type="text" value={topico} onChange={(e) => setTopico(e.target.value)} className="w-full border border-pink-100/80 p-3 rounded-xl bg-pink-50/10 focus:outline-none focus:border-[var(--color-rosa-500)] text-gray-700 placeholder-gray-300" placeholder="Ex: Absorção de fármacos e biodisponibilidade" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Data de Estudo</label>
            <input type="date" value={dataEstudo} onChange={(e) => setDataEstudo(e.target.value)} className="w-full border border-pink-100/80 p-3 rounded-xl bg-pink-50/10 focus:outline-none focus:border-[var(--color-rosa-500)] text-gray-600 cursor-pointer" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Anotações / Destaque de Prova</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full border border-pink-100/80 p-3 rounded-xl h-28 resize-none bg-pink-50/10 focus:outline-none focus:border-[var(--color-rosa-500)] text-gray-700 placeholder-gray-300" placeholder="Escreva pontos de atenção ou fórmulas importantes..." />
          </div>

          <div className="pt-2">
            <button onClick={handleSubmit} className="w-full py-4 bg-pink-400/90 hover:bg-pink-400 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all text-center tracking-wide cursor-pointer">
              Confirmar e Agendar Revisões
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}