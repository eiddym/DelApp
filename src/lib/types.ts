export interface MesaDetails {
  departamento: string;
  provincia: string;
  municipio: string;
  recinto: string;
  circunscripcion: string;
  numeroMesa: string;
}

export interface VoteData {
  presidenteVotos: (number | string)[];
  diputadoVotos: (number | string)[];
  votosNulos: number | string;
  votosBlancos: number | string;
  totalVotosValidos: number | string;
  totalVotosEmitidos: number | string;
  votantesHabilitados: number | string;
  isSpecialCircunscription: boolean;
}
