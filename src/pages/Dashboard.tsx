import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { getOrcamentos, deleteOrcamento, updateOrcamentoStatus, type Orcamento, safeGetItem, safeSetItem } from '../utils/storage';

// Componentes estáticos de UX
import { Briefcase, TrendingUp, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>(() => getOrcamentos());
  
  // States para Faturamento
  const [metaFaturamento, setMetaFaturamento] = useState<number>(() => {
    const savedMeta = safeGetItem('arquitetura_meta_faturamento');
    return savedMeta ? Number(savedMeta) : 20000;
  });
  const [isEditingMeta, setIsEditingMeta] = useState(false);

  const handleSaveMeta = () => {
    safeSetItem('arquitetura_meta_faturamento', metaFaturamento.toString());
    setIsEditingMeta(false);
  };

  const handleStatusUpdate = (id: string, novoStatus: Orcamento['status']) => {
    updateOrcamentoStatus(id, novoStatus);
    setOrcamentos(getOrcamentos());
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja apagar este orçamento?')) {
      deleteOrcamento(id);
      setOrcamentos(getOrcamentos());
    }
  };

  const crmStatus = {
    prospeccao: orcamentos.filter(o => o.status === 'Prospecção').length,
    qualificacao: orcamentos.filter(o => o.status === 'Qualificação').length,
    apresentacao: orcamentos.filter(o => o.status === 'Apresentação').length,
    negociacao: orcamentos.filter(o => o.status === 'Negociação').length,
    fechamento: orcamentos.filter(o => o.status === 'Fechamento').length,
  };

  // Cálculos de Faturamento Integrado
  const faturamentoAtual = orcamentos
    .filter(o => o.status === 'Fechamento')
    .reduce((acc, curr) => acc + (curr.valorFechado || curr.valorFinal), 0);
  
  const progressoFaturamento = metaFaturamento > 0 ? Math.min((faturamentoAtual / metaFaturamento) * 100, 100) : 0;
  const faltam = metaFaturamento - faturamentoAtual;

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar minimalista */}
      <aside className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-accentNavy rounded-full flex items-center justify-center">
            <span className="text-accentGold font-serif text-xl font-bold">C</span>
          </div>
          <span className="font-serif text-lg text-graphite font-medium">Koressawa</span>
        </div>

        <nav className="flex-1 space-y-2">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="flex items-center gap-3 px-4 py-3 bg-surface text-accentNavy rounded-xl font-medium font-sans">
            <TrendingUp size={20} /> Dashboard
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/onboarding'); }} className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-surface hover:text-graphite rounded-xl font-medium font-sans transition-colors">
            <Wallet size={20} /> Ajustar Base Financeira
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          <header className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-3xl font-serif text-graphite mb-2">Visão Geral</h1>
              <p className="text-gray-500 font-sans">Acompanhe sua jornada de ofertas e vendas.</p>
            </div>
            <button 
              onClick={() => navigate('/new-project')}
              className="bg-accentNavy text-white px-6 py-2.5 rounded-xl font-medium font-sans hover:bg-graphite transition-colors shadow-sm flex items-center gap-2"
            >
              <span className="text-xl leading-none">+</span> Nova Prospecção
            </button>
          </header>

          {/* Cards Financeiros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <div className="flex items-center gap-3 mb-4 text-gray-500">
                <TrendingUp size={20} />
                <h3 className="font-sans font-medium text-sm text-graphite flex-1">Meta de faturamento</h3>
                <button 
                  onClick={() => setIsEditingMeta(!isEditingMeta)}
                  className="text-xs text-accentNavy hover:text-accentGold transition-colors font-medium border border-gray-200 px-2 py-1 rounded-md bg-white"
                >
                  {isEditingMeta ? 'Cancelar' : 'Ajustar Meta'}
                </button>
              </div>
              
              <div className="text-3xl font-serif text-graphite mb-2">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(faturamentoAtual)}
              </div>
              
              {isEditingMeta ? (
                <div className="flex items-center gap-2 mt-2 mb-2 bg-surface p-2 rounded-lg border border-gray-200">
                  <span className="text-gray-400 text-sm font-medium pl-2">R$</span>
                  <input 
                    type="number"
                    className="w-full bg-white border border-gray-200 rounded py-1 px-2 text-sm focus:outline-none focus:border-accentGold font-medium"
                    value={metaFaturamento}
                    onChange={(e) => setMetaFaturamento(Number(e.target.value) || 0)}
                    placeholder="Nova Meta"
                  />
                  <button onClick={handleSaveMeta} className="bg-accentNavy text-white px-3 py-1 rounded text-sm hover:bg-graphite">Salvar</button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 font-sans mt-2">
                  Meta: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metaFaturamento)} 
                  <span className="text-gray-300 mx-2">•</span> 
                  {faltam > 0 ? (
                    <span className="text-accentGold font-medium">Faltam {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(faltam)}</span>
                  ) : (
                    <span className="text-green-600 font-medium">Meta Atingida! 🏆</span>
                  )}
                </p>
              )}
              
              <div className="w-full bg-gray-100 rounded-full h-2 mt-4 relative overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-700 ${faltam > 0 ? 'bg-graphite' : 'bg-green-500'}`} 
                  style={{ width: `${progressoFaturamento}%` }}
                ></div>
              </div>
            </Card>

            <Card className="flex flex-col h-full bg-surface/50 border-gray-100">
              <div className="flex items-center gap-3 mb-4 text-gray-500">
                <Wallet size={20} />
                <h3 className="font-sans font-medium text-sm text-graphite flex-1">Margem de segurança</h3>
              </div>
              <div className="text-3xl font-serif text-green-700 mb-2">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(faturamentoAtual)}
              </div>
              <p className="text-sm text-gray-500 font-sans mt-2">
                Total de valores em "Fechamento".
              </p>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex-1 overflow-auto max-h-[140px] pr-2">
                <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wide">Recebimentos atrelados</p>
                {orcamentos.filter(o => o.status === 'Fechamento').length === 0 ? (
                   <div className="text-sm text-gray-400 italic">Nenhum contrato fechado ainda.</div>
                ) : (
                  orcamentos.filter(o => o.status === 'Fechamento').map(orc => (
                    <div key={orc.id} className="flex justify-between items-center mb-2 text-sm bg-white border border-gray-100 shadow-sm p-2 rounded-lg">
                      <span className="font-medium text-gray-600 truncate max-w-[120px]" title={orc.nomeProjeto}>
                        {orc.nomeProjeto}
                      </span>
                      <span className="text-accentNavy font-bold text-[10px] bg-accentNavy/5 px-2 py-1 rounded border border-accentNavy/10 uppercase">
                        {orc.formaPagamento || 'À Vista'}
                      </span>
                      <span className="font-medium text-green-700">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orc.valorFechado || orc.valorFinal)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* CRM Pipeline Horizontal */}
          <Card className="mb-8 overflow-x-auto">
            <div className="flex items-center gap-3 mb-8 text-gray-500">
              <Briefcase size={20} />
              <h3 className="font-sans font-medium text-sm text-graphite">CRM de Vendas (Pipeline)</h3>
            </div>
            <p className="text-sm text-gray-500 font-sans mb-6">Acompanhe sua prospecção</p>
            
            <div className="flex justify-between items-start min-w-[600px] px-4">
              {[
                { label: 'Prospecção', count: crmStatus.prospeccao, color: 'bg-gray-100 text-gray-500 border-gray-200', barCol: 'bg-gray-200' },
                { label: 'Qualificação', count: crmStatus.qualificacao, color: 'bg-blue-50 text-blue-600 border-blue-200', barCol: 'bg-blue-200' },
                { label: 'Apresentação', count: crmStatus.apresentacao, color: 'bg-yellow-50 text-accentGold border-yellow-200', barCol: 'bg-yellow-200' },
                { label: 'Negociação', count: crmStatus.negociacao, color: 'bg-orange-50 text-orange-600 border-orange-200', barCol: 'bg-orange-200' },
                { label: 'Fechamento', count: crmStatus.fechamento, color: 'bg-green-50 text-green-700 border-green-200', barCol: 'bg-green-200' },
              ].map((fase, idx) => (
                <div 
                  key={idx} 
                  className="flex-1 flex flex-col items-center relative cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    const row = document.getElementById('history-table');
                    if (row) row.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {/* Linha conectora */}
                  {idx < 4 && (
                    <div className={`absolute top-5 left-[50%] right-[-50%] h-1 z-0 ${fase.count > 0 ? fase.barCol : 'bg-gray-100'}`}></div>
                  )}
                  
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold z-10 border-2 shadow-sm ${fase.color} ${fase.count > 0 ? 'ring-4 ring-white' : ''}`}>
                    {fase.count}
                  </div>
                  <span className="font-medium text-xs text-graphite mt-3 text-center px-2">{fase.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Histórico de Orçamentos */}
          <div className="mt-10" id="history-table">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl font-serif text-graphite mb-1">Histórico de Orçamentos</h2>
              <button 
                className="text-sm font-sans font-medium text-accentGold hover:text-yellow-600 transition-colors"
                onClick={() => {
                  const row = document.getElementById('history-table');
                  if (row) row.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Ver Relatório Completo &rarr;
              </button>
            </div>
            
            <Card className="!p-0 overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-sm">
                  <thead className="bg-surface/50 text-gray-500 uppercase tracking-wider text-xs border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 font-medium">Projeto / Cliente</th>
                      <th className="px-6 py-4 font-medium">Data</th>
                      <th className="px-6 py-4 font-medium">Valor Total</th>
                      <th className="px-6 py-4 font-medium">Margem Calculada</th>
                      <th className="px-6 py-4 font-medium text-center">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    
                    {orcamentos.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          Nenhum orçamento gerado ainda. Clique em "Nova Prospecção".
                        </td>
                      </tr>
                    ) : (
                      orcamentos.map((orc) => (
                        <tr key={orc.id} className="hover:bg-surface/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-graphite">{orc.nomeProjeto}</div>
                            <div className="text-xs text-gray-500 mt-1">{orc.cliente}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{orc.data}</td>
                          <td className="px-6 py-4 font-medium text-graphite">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orc.valorFinal)}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {orc.margemLucro}% ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orc.lucro)})
                          </td>
                          <td className="px-6 py-4 text-center">
                            <select
                              value={orc.status}
                              onChange={(e) => handleStatusUpdate(orc.id, e.target.value as Orcamento['status'])}
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-accentGold/20 transition-all
                                ${orc.status === 'Prospecção' ? 'bg-gray-100 text-gray-600 border-gray-200' : ''}
                                ${orc.status === 'Qualificação' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                ${orc.status === 'Apresentação' ? 'bg-yellow-50 text-accentGold border-yellow-200' : ''}
                                ${orc.status === 'Negociação' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                                ${orc.status === 'Fechamento' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                ${orc.status === 'Perdido' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                              `}
                            >
                              <option value="Prospecção">Prospecção</option>
                              <option value="Qualificação">Qualificação</option>
                              <option value="Apresentação">Apresentação</option>
                              <option value="Negociação">Negociação</option>
                              <option value="Fechamento">Fechamento</option>
                              <option value="Perdido">Perdido</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => navigate(`/new-project?edit=${orc.id}`)}
                              className="text-xs font-medium text-accentNavy hover:text-accentGold mr-3 transition-colors"
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => handleDelete(orc.id)}
                              className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))
                    )}

                  </tbody>
                </table>
              </div>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
