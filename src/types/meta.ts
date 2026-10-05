export interface Meta {
  id: string;
  nome: string;
  valorAlvo: number;
  valorGuardado: number;
  // "AAAA-MM-DD" ou "" quando a meta não tem prazo
  prazo: string;
}
