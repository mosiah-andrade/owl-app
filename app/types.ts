// app/types.ts

export interface Prova {
  id: string;
  disciplina: string;
  nomeProva: string;
  dataProva: string; // formato YYYY-MM-DD
  informacoes?: string; // campo opcional para informações adicionais
}
export interface DatasRevisao {
  r1: string;
  r7: string;
  r21: string;
  r60: string;
}

export interface Aula {
  id: string;
  disciplina: string;
  nomeAula: string;
  topico?: string;
  dataEstudo: string;
  descricao?: string;
  // CORREÇÃO: Agora é um array de Revisao
  datasRevisao?: Revisao[]; 
  estagioAtual: number; 
  revisoesConcluidas: string[]; 
  conteudo?: string;
  linksMateriais?: string[];
}
export interface Revisao {
  etapa: number; // 1, 2, 3...
  data: string;   // YYYY-MM-DD
  concluida: boolean;
}