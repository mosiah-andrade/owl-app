import { Prova } from "../types";

interface Props {
  provas: Prova[];
  onExcluir: (id: string) => void;
}

export default function ListaProvas({ provas, onExcluir }: Props) {
  return (
    <div className="space-y-3">
      {provas.length === 0 && <p className="text-center text-slate-400 py-4 text-sm">Nenhuma prova agendada.</p>}
      {provas.map((p) => (
        <div key={p.id} className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex justify-between items-center">
          <div>
            <h4 className="font-bold text-slate-800">{p.nomeProva}</h4>
            <p className="text-xs text-slate-400">{p.disciplina} • {new Date(p.dataProva).toLocaleDateString('pt-BR')}</p>
          </div>
          <button onClick={() => onExcluir(p.id)} className="text-red-400 hover:text-red-600 text-xs font-bold">Excluir</button>
        </div>
      ))}
    </div>
  );
}