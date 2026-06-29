import Image from "next/image";


interface CabecalhoProps {
  onAbrirCadastro: () => void;
  streak: number;
}

export default function Cabecalho({ onAbrirCadastro, streak }: CabecalhoProps) {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Image src="/Owl-icon.png" alt="Owl logo" width={48} height={48} priority className="h-auto w-auto drop-shadow-sm" />   
          <div>
            <h1 className="text-2xl font-extrabold text-[#ec4899] tracking-tight">Owl</h1>
            <p className="text-xs text-gray-400 font-medium">Estudos Inteligentes</p>
          </div>
        </div>

        {/* Badge Minimalista da Ofensiva */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm border transition-all ${streak > 0 ? "bg-orange-50 border-orange-100" : "bg-gray-50 border-gray-100"}`}>
            <span className="text-lg">🔥</span>
            <span className={`text-sm font-bold ${streak > 0 ? "text-orange-600" : "text-gray-400"}`}>
                {streak}
            </span>
        </div>
      </div>

      <button 
        onClick={onAbrirCadastro} 
        className="w-full bg-white border-2 border-dashed border-pink-200 text-pink-500 py-3 rounded-xl font-bold hover:bg-pink-50 transition-all cursor-pointer"
        >
        + Novo Registro
      </button>
    </div>
  );
}