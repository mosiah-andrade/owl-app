import Image from "next/image";
import { Plus } from "lucide-react";

interface CabecalhoProps {
  onAbrirCadastro: () => void;
  streak: number;
}

export default function Cabecalho({ onAbrirCadastro, streak }: CabecalhoProps) {
  return (
    <header className="w-full mb-8 pt-4">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <Image src="/Owl-icon.png" alt="Owl logo" width={40} height={40} priority className="h-auto w-auto" />   
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tighter">Owl</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Estudos Inteligentes</p>
          </div>
        </div>

        {/* Badge da Ofensiva com Animação sutil */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl shadow-sm border ${streak > 0 ? "bg-orange-50 border-orange-200" : "bg-gray-100 border-gray-200"}`}>
            <span className="text-xl animate-pulse">🔥</span>
            <span className={`text-lg font-black ${streak > 0 ? "text-orange-600" : "text-gray-400"}`}>
                {streak}
            </span>
        </div>
      </div>

      {/* Botão de Ação Principal (CTA) */}
      <button 
        onClick={onAbrirCadastro} 
        className="group w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-500/20 hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer"
      >
        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        Novo Registro
      </button>
    </header>
  );
}