"use client";
import { Aula } from "../types";

interface BarraProgressoProps {
  aulas: Aula[];
}

export default function BarraProgresso({ aulas }: BarraProgressoProps) {
  if (aulas.length === 0) return null;

  const pontosMaximosPossiveis = aulas.length * 4;
  const pontosAtuais = aulas.reduce((acumulador, aula) => acumulador + (aula.estagioAtual ?? 0), 0);
  const porcentagem = Math.min(Math.round((pontosAtuais / pontosMaximosPossiveis) * 100), 100);

  return (
    <div className="w-full bg-white border border-pink-100 rounded-3xl p-5 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-black text-pink-700 uppercase tracking-[0.2em]">
          Progresso de Conquistas
        </span>
        <span className="text-xs font-bold text-pink-900 bg-pink-100 px-3 py-1 rounded-full">
          {porcentagem}%
        </span>
      </div>
      
      {/* Trilha da Barra */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
        <div 
          className="h-full bg-pink-500 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative overflow-hidden"
          style={{ width: `${porcentagem}%` }}
        >
          {/* Animação de Loop (Brilho passando) */}
          <div className="absolute inset-0 w-full h-full animate-[shimmer_2s_infinite_linear] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]" />
        </div>
      </div>
      
      <p className="text-[10px] text-slate-600 mt-2 text-right font-bold tracking-wide">
        {pontosAtuais} / {pontosMaximosPossiveis} etapas concluídas ✨
      </p>

      {/* Definição da animação (se não estiver no seu global.css) */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}