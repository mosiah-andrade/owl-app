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
  // Novos campos para os requisitos obrigatórios:
  estagioAtual: number; // 0 = Novo, 1 = 1d, 2 = 7d, 3 = 21d, 4 = 60d (Concluído)
  revisoesConcluidas: string[]; // Salva os estágios feitos, ex: ["estudo", "r1"]
}