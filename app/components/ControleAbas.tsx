interface ControleAbasProps {
  abaAtiva: "hoje" | "painel" | "provas";
  setAbaAtiva: (aba: "hoje" | "painel" | "provas") => void;
  qtdHoje: number;
  qtdTotal: number;
  qtdProvas: number;
}

export default function ControleAbas({ abaAtiva, setAbaAtiva, qtdHoje, qtdTotal, qtdProvas }: ControleAbasProps) {
  
  // Função auxiliar para simplificar os estilos
  const getButtonClass = (aba: "hoje" | "painel" | "provas") => {
    const isActive = abaAtiva === aba;
    return `flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer ${
      isActive 
        ? "bg-white text-[var(--color-rosa-500)] shadow-sm ring-1 ring-black/5" 
        : "text-slate-400 hover:text-slate-600"
    }`;
  };

  return (
    <div className="flex w-full bg-slate-100/80 p-1 rounded-2xl mb-6 shadow-inner">
      <button onClick={() => setAbaAtiva("hoje")} className={getButtonClass("hoje")}>
        Hoje <span className="opacity-70">({qtdHoje})</span>
      </button>
      <button onClick={() => setAbaAtiva("painel")} className={getButtonClass("painel")}>
        Aulas <span className="opacity-70">({qtdTotal})</span>
      </button>
      <button onClick={() => setAbaAtiva("provas")} className={getButtonClass("provas")}>
        Provas <span className="opacity-70">({qtdProvas})</span>
      </button>
    </div>
  );
}