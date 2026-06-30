"use client";
import { useState, useEffect } from "react";
import { Plus, X, BookOpen, Check } from "lucide-react";

interface SeletorDisciplinaProps {
  value: string;
  onChange: (disciplina: string) => void;
}

export default function SeletorDisciplina({ value, onChange }: SeletorDisciplinaProps) {
  const [disciplinas, setDisciplinas] = useState<string[]>(["Farmacologia 💊", "Fisiologia 🧠", "Anatomia 🦴", "Bioquímica 🧪"]);
  const [isCriando, setIsCriando] = useState(false);
  const [novaDisciplina, setNovaDisciplina] = useState("");

  useEffect(() => {
    const salvo = localStorage.getItem("@owl:disciplinas");
    if (salvo) setDisciplinas(JSON.parse(salvo));
  }, []);

  const handleAdicionar = () => {
    if (!novaDisciplina.trim()) return;
    const listaAtualizada = [...disciplinas, novaDisciplina.trim()];
    setDisciplinas(listaAtualizada);
    onChange(novaDisciplina.trim());
    localStorage.setItem("@owl:disciplinas", JSON.stringify(listaAtualizada));
    setNovaDisciplina("");
    setIsCriando(false);
  };

  if (isCriando) {
    return (
      <div className="flex gap-2 animate-in fade-in zoom-in-95 duration-200">
        <div className="relative flex-1">
          <BookOpen className="absolute left-4 top-4 text-pink-400" size={18} />
          <input 
            type="text"
            value={novaDisciplina}
            onChange={(e) => setNovaDisciplina(e.target.value)}
            className="w-full bg-slate-50 border border-pink-200 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-pink-200"
            placeholder="Nova matéria..."
            autoFocus
          />
        </div>
        <button onClick={handleAdicionar} className="bg-pink-500 text-white px-6 rounded-2xl font-bold hover:bg-pink-600">
          <Check size={20} />
        </button>
        <button onClick={() => setIsCriando(false)} className="bg-slate-100 text-slate-500 px-4 rounded-2xl">
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="w-full appearance-none bg-slate-50 border border-slate-100 p-4 pl-4 pr-10 rounded-2xl outline-none focus:border-pink-300 font-bold text-slate-700 cursor-pointer"
        >
          {disciplinas.map((disc, idx) => (
            <option key={idx} value={disc}>{disc}</option>
          ))}
        </select>
        {/* Ícone de seta personalizado para esconder o padrão do navegador */}
        <div className="absolute right-4 top-5 pointer-events-none text-slate-400">
          ▼
        </div>
      </div>
      
      <button 
        onClick={() => setIsCriando(true)}
        className="w-14 h-14 flex items-center justify-center rounded-2xl bg-pink-50 text-pink-500 hover:bg-pink-100 transition-all active:scale-95"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}