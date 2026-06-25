"use client";
import { Aula } from "../types";

interface BarraProgressoProps {
  aulas: Aula[];
}

export default function BarraProgresso({ aulas }: BarraProgressoProps) {
  // Se não houver aulas, o progresso é 0%
  if (aulas.length === 0) return null;

  // Cada aula pode evoluir até o estágio 4
  const pontosMaximosPossiveis = aulas.length * 4;
  
  // Soma os estágios atuais de todas as aulas cadastradas
  const pontosAtuais = aulas.reduce((acumulador, aula) => acumulador + (aula.estagioAtual ?? 0), 0);
  
  // Calcula a porcentagem arredondada
  const porcentagem = Math.min(Math.round((pontosAtuais / pontosMaximosPossiveis) * 100), 100);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-4 animate-fade-in font-alan">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Progresso de Revisões 📈
        </span>
        <span className="text-sm font-bold text-[var(--color-rosa-500)] bg-pink-50 px-2.5 py-0.5 rounded-full">
          {porcentagem}% Concluído
        </span>
      </div>
      
      {/* Trilha da Barra */}
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        {/* Preenchimento com Transição Suave */}
        <div 
          className="h-full bg-gradient-to-r from-pink-300 to-[var(--color-rosa-500)] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${porcentagem}%` }}
        />
      </div>
      <p className="text-[10px] text-gray-400 mt-1.5 text-right font-light">
        {pontosAtuais} de {pontosMaximosPossiveis} etapas de revisão concluídas
      </p>
    </div>
  );
}