"use client";
import { useState, useEffect } from "react";

interface SeletorDisciplinaProps {
  value: string;
  onChange: (disciplina: string) => void;
}

export default function SeletorDisciplina({ value, onChange }: SeletorDisciplinaProps) {
  const [disciplinas, setDisciplinas] = useState<string[]>([
    "Farmacologia 💊",
    "Fisiologia 🧠",
    "Anatomia 🦴",
    "Bioquímica 🧪"
  ]);
  const [isCriando, setIsCriando] = useState(false);
  const [novaDisciplina, setNovaDisciplina] = useState("");

  // Carrega as disciplinas salvas ao montar o componente
  useEffect(() => {
    const disciplinasSalvas = localStorage.getItem("@owl:disciplinas");
    if (disciplinasSalvas) {
      const lista = JSON.parse(disciplinasSalvas);
      setDisciplinas(lista);
    }
  }, []);

  const handleAdicionar = () => {
    if (!novaDisciplina.trim()) return;

    const listaAtualizada = [...disciplinas, novaDisciplina.trim()];
    setDisciplinas(listaAtualizada);
    onChange(novaDisciplina.trim()); // Seleciona a nova matéria automaticamente
    localStorage.setItem("@owl:disciplinas", JSON.stringify(listaAtualizada));
    
    setNovaDisciplina("");
    setIsCriando(false);
  };

  if (isCriando) {
    return (
      <div className="flex gap-2 animate-fade-in">
        <input 
          type="text"
          value={novaDisciplina}
          onChange={(e) => setNovaDisciplina(e.target.value)}
          className="flex-1 border border-pink-200 p-3 rounded-xl bg-white focus:outline-none focus:border-[var(--color-rosa-500)] text-gray-700 placeholder-gray-300"
          placeholder="Ex: Patologia 🦠"
          autoFocus
        />
        <button 
          onClick={handleAdicionar}
          className="px-4 h-12 bg-pink-500 text-white font-bold rounded-xl text-sm hover:bg-pink-600 cursor-pointer transition-colors"
        >
          Salvar
        </button>
        <button 
          onClick={() => setIsCriando(false)}
          className="px-3 h-12 border border-gray-200 text-gray-400 rounded-xl text-sm hover:bg-gray-50 cursor-pointer transition-colors"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="flex-1 border border-pink-100/80 p-3 rounded-xl bg-pink-50/10 focus:outline-none focus:border-[var(--color-rosa-500)] text-gray-700 font-medium cursor-pointer"
      >
        {disciplinas.map((disc, idx) => (
          <option key={idx} value={disc}>{disc}</option>
        ))}
      </select>
      <button 
        onClick={() => setIsCriando(true)}
        className="w-12 h-12 flex items-center justify-center border border-pink-100/80 rounded-xl bg-pink-50/20 text-[var(--color-rosa-500)] text-xl font-light hover:bg-pink-50 cursor-pointer transition-colors"
      >
        +
      </button>
    </div>
  );
}