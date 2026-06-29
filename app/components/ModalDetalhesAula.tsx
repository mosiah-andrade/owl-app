import { useState, useEffect } from "react";
import { Aula } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  aula: Aula | null;
  onAtualizar: (aula: Aula) => void;
  onExcluir: (id: string) => void;
}

export default function ModalDetalhesAula({ isOpen, onClose, aula, onAtualizar, onExcluir }: Props) {
  const [dadosEditados, setDadosEditados] = useState<Aula | null>(null);
  const [novoLink, setNovoLink] = useState("");

  // Quando o modal abrir, preenche o estado com a aula selecionada
  useEffect(() => {
    if (aula) setDadosEditados(aula);
  }, [aula]);

  if (!isOpen || !dadosEditados) return null;

  const handleSalvar = () => {
    onAtualizar(dadosEditados);
  };

  const handleAdicionarLink = () => {
    if (!novoLink.trim()) return;
    const linksAtuais = dadosEditados.linksMateriais || [];
    setDadosEditados({ ...dadosEditados, linksMateriais: [...linksAtuais, novoLink] });
    setNovoLink("");
  };

  const handleRemoverLink = (index: number) => {
    const linksAtualizados = [...(dadosEditados.linksMateriais || [])];
    linksAtualizados.splice(index, 1);
    setDadosEditados({ ...dadosEditados, linksMateriais: linksAtualizados });
  };

  return (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl flex flex-col gap-6">
      
      {/* Título */}
      <h2 className="text-2xl font-extrabold text-slate-800">Detalhes da Aula</h2>
      
      {/* Formulário */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Nome da Aula</label>
          <input 
            className="w-full bg-slate-50 border border-transparent focus:border-[var(--color-rosa-500)] rounded-2xl p-4 transition-all outline-none" 
            value={dadosEditados.nomeAula}
            onChange={(e) => setDadosEditados({...dadosEditados, nomeAula: e.target.value})}
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Anotações</label>
          <textarea 
            className="w-full bg-slate-50 border border-transparent focus:border-[var(--color-rosa-500)] rounded-2xl p-4 min-h-[120px] transition-all outline-none" 
            value={dadosEditados.conteudo || ""}
            onChange={(e) => setDadosEditados({...dadosEditados, conteudo: e.target.value})}
          />
        </div>
      </div>

      {/* Seção de Links */}
      <div className="border-t border-slate-100 pt-6">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Links e Materiais</label>
        <div className="flex gap-2">
          <input 
            className="flex-1 bg-slate-50 rounded-2xl p-4 outline-none border border-transparent focus:border-[var(--color-rosa-500)]" 
            placeholder="Cole o link aqui..."
            value={novoLink}
            onChange={(e) => setNovoLink(e.target.value)}
          />
          <button onClick={handleAdicionarLink} className="bg-slate-900 text-white px-6 rounded-2xl font-bold hover:bg-slate-800 transition-colors">+</button>
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-between items-center mt-2">
        <button onClick={() => onExcluir(dadosEditados.id)} className="text-red-500 font-bold text-sm hover:underline">Excluir</button>
        <div className="flex gap-3">
          <button onClick={onClose} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-colors">Cancelar</button>
          <button onClick={handleSalvar} className="bg-[var(--color-rosa-500)] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-pink-200 hover:scale-105 transition-transform">Salvar</button>
        </div>
      </div>
    </div>
  </div>
);
}