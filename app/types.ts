// app/types.ts

export interface Prova {
  id: string;
  disciplina: string;
  nomeProva: string;
  dataProva: string; // formato YYYY-MM-DD
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
  datasRevisao: DatasRevisao;
  estagioAtual: number; 
  revisoesConcluidas: string[]; 
  
  // NOVOS CAMPOS:
  conteudo?: string;         // Suas anotações ou resumo da aula
  linksMateriais?: string[]; // Array com links de PDFs, vídeos, Notion, etc.
}