"use client";
import { useState } from "react";
import { Aula } from "../types";
import { Prova } from "../types"; // Certifica-te que Prova está exportada no types.ts
import SeletorDisciplina from "./SeletorDisciplina";

interface ModalCadastroProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvar: (dados: any, tipo: "aula" | "prova") => void; // Ajustado para aceitar tipo
}

export default function ModalCadastro({ isOpen, onClose, onSalvar }: ModalCadastroProps) {
  const [tipo, setTipo] = useState<"aula" | "prova">("aula");
  
  // Estados comuns
  const [disciplina, setDisciplina] = useState("Farmacologia 💊");
  const [nome, setNome] = useState("");
  const [data, setData] = useState(() => new Date().toISOString().split("T")[0]);
  
  // Estado específico Aula
  const [topico, setTopico] = useState("");


  const handleSubmit = () => {
    if (!nome.trim()) return alert("Preencha o nome!");
    
    if (tipo === "aula") {
      onSalvar({ disciplina, nomeAula: nome, topico, dataEstudo: data }, "aula");
    } else {
      onSalvar({ disciplina, nomeProva: nome, dataProva: data }, "prova");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    // O clique nesta div fecha o modal
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* A div interna evita que o clique dentro dela feche o modal */}
      <div 
        className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-6 font-alan max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* Toggle Aula / Prova */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
          <button onClick={() => setTipo("aula")} className={`flex-1 py-2 rounded-xl font-bold ${tipo === "aula" ? "bg-white text-pink-500 shadow-sm" : "text-gray-400"}`}>Aula</button>
          <button onClick={() => setTipo("prova")} className={`flex-1 py-2 rounded-xl font-bold ${tipo === "prova" ? "bg-white text-pink-500 shadow-sm" : "text-gray-400"}`}>Prova</button>
        </div>

        <div className="space-y-4">
          <SeletorDisciplina value={disciplina} onChange={setDisciplina} />
          
          <input 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            className="w-full border-none bg-gray-100 p-4 rounded-2xl appearance-none text-gray-800 placeholder-gray-500 outline-none" 
            placeholder={tipo === "aula" ? "Nome da Aula" : "Nome da Prova"} 
            style={{ WebkitAppearance: 'none' }}
          />

          {tipo === "aula" && (
            <input 
              value={topico} 
              onChange={(e) => setTopico(e.target.value)} 
              className="w-full border-none bg-gray-100 p-4 rounded-2xl appearance-none text-gray-800 placeholder-gray-500" 
              placeholder="Tópico" 
              style={{ WebkitAppearance: 'none' }}
            />
          )}

          <input 
            type="date" 
            value={data} 
            onChange={(e) => setData(e.target.value)} 
            className="w-full border-none bg-gray-100 p-4 rounded-2xl appearance-none text-gray-800"
            style={{ WebkitAppearance: 'none', minHeight: '56px' }}
          />

          <button onClick={handleSubmit} className="w-full py-4 bg-pink-500 text-white font-bold rounded-2xl mt-4">
            Salvar {tipo === "aula" ? "Aula" : "Prova"}
          </button>
        </div>
      </div>
    </div>
  );
}