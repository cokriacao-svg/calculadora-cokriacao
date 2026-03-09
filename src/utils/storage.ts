export interface Orcamento {
  id: string;
  cliente: string;
  nomeProjeto: string;
  data: string;
  status: 'Prospecção' | 'Qualificação' | 'Apresentação' | 'Negociação' | 'Fechamento' | 'Perdido';
  
  // Detalhes da Precificação
  valorHora: number;
  despesasGlobais: number;
  margemLucro: number;
  
  // Etapas
  etapas: {
    nome: string;
    ativa: boolean;
    horas: number;
  }[];

  // Resultados
  subtotalBase: number;
  lucro: number;
  valorFinal: number;
  
  // Condições Comerciais & CRM
  formaPagamento?: string;
  valorFechado?: number; // Valor real que foi negociado/fechado
  notasCRM?: string; // Anotações do funil
}

export const getOrcamentos = (): Orcamento[] => {
  const data = localStorage.getItem('arquitetura_orcamentos');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveOrcamento = (orcamento: Orcamento) => {
  const orcamentos = getOrcamentos();
  const index = orcamentos.findIndex(o => o.id === orcamento.id);
  if (index >= 0) {
    orcamentos[index] = orcamento;
  } else {
    orcamentos.push(orcamento);
  }
  localStorage.setItem('arquitetura_orcamentos', JSON.stringify(orcamentos));
};

export const deleteOrcamento = (id: string) => {
  const orcamentos = getOrcamentos();
  const filtrados = orcamentos.filter(o => o.id !== id);
  localStorage.setItem('arquitetura_orcamentos', JSON.stringify(filtrados));
};

export const updateOrcamentoStatus = (id: string, novoStatus: Orcamento['status']) => {
  const orcamentos = getOrcamentos();
  const index = orcamentos.findIndex(o => o.id === id);
  if (index >= 0) {
    orcamentos[index].status = novoStatus;
    localStorage.setItem('arquitetura_orcamentos', JSON.stringify(orcamentos));
  }
};
