import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calculator, User, MapPin, Layers } from 'lucide-react';
import { saveOrcamento, getOrcamentos, safeGetItem, type Orcamento } from '../utils/storage';

const ETAPAS_PADRAO = [
  { nome: 'Levantamento Arquitetônico e Cadastral', ativa: true, horas: 10 },
  { nome: 'Estudo Preliminar (Conceito e Layout)', ativa: true, horas: 20 },
  { nome: 'Anteprojeto (Volumetria e Aprovação Cliente)', ativa: true, horas: 15 },
  { nome: 'Projeto Legal (Aprovação Prefeitura/Condomínio)', ativa: false, horas: 15 },
  { nome: 'Projeto Executivo (Arquitetura)', ativa: true, horas: 30 },
  { nome: 'Detalhamento de Marcenaria e Interiores', ativa: true, horas: 30 },
  { nome: 'Compatibilização de Projetos Complementares', ativa: false, horas: 8 },
  { nome: 'Acompanhamento / Gestão de Obras', ativa: false, horas: 40 },
];

export function NewProject() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [step, setStep] = useState(1);
  
  // States do Formulário
  const [cliente, setCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  
  const [nomeProjeto, setNomeProjeto] = useState('');
  const [endereco, setEndereco] = useState('');
  const [area, setArea] = useState<number | ''>('');
  const [tipoProjeto, setTipoProjeto] = useState('');

  // States de Precificação
  const [etapas, setEtapas] = useState(ETAPAS_PADRAO);
  const [valorHora, setValorHora] = useState<number | ''>('');
  const [despesasGlobais, setDespesasGlobais] = useState<number>(() => {
    const savedCustos = safeGetItem('arquitetura_custos_fixos');
    return savedCustos ? Number(savedCustos) : 0;
  });
  const [margemLucro, setMargemLucro] = useState<number>(25);

  const [statusOrcamento, setStatusOrcamento] = useState<'Prospecção' | 'Qualificação' | 'Apresentação' | 'Negociação' | 'Fechamento' | 'Perdido'>('Apresentação');
  const [formaPagamento, setFormaPagamento] = useState<string>('À Vista');
  const [valorFechado, setValorFechado] = useState<number | ''>('');
  const [notasCRM, setNotasCRM] = useState<string>('');

  // Carregar dados se for Edição
  useEffect(() => {
    if (editId) {
      const orcamentos = getOrcamentos();
      const orc = orcamentos.find(o => o.id === editId);
      if (orc) {
        setCliente(orc.cliente);
        setNomeProjeto(orc.nomeProjeto);
        setEtapas(orc.etapas.length > 0 ? orc.etapas : ETAPAS_PADRAO);
        setValorHora(orc.valorHora);
        setDespesasGlobais(orc.despesasGlobais);
        setMargemLucro(orc.margemLucro);
        setStatusOrcamento(orc.status);
        if(orc.formaPagamento) setFormaPagamento(orc.formaPagamento);
        if(orc.valorFechado) setValorFechado(orc.valorFechado);
        if(orc.notasCRM) setNotasCRM(orc.notasCRM);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  // Cálculos Automáticos
  const horasTotais = etapas.filter(e => e.ativa).reduce((acc, e) => acc + (e.horas || 0), 0);
  const custoHoras = horasTotais * (typeof valorHora === 'number' ? valorHora : 0);
  const subtotalBase = custoHoras + despesasGlobais;
  const lucroAcrescimo = subtotalBase * (margemLucro / 100);
  const valorIdeal = subtotalBase + lucroAcrescimo;

  const handleToggleEtapa = (index: number) => {
    const novasEtapas = [...etapas];
    novasEtapas[index].ativa = !novasEtapas[index].ativa;
    setEtapas(novasEtapas);
  };

  const handleHorasEtapa = (index: number, valor: string) => {
    const novasEtapas = [...etapas];
    novasEtapas[index].horas = Number(valor) || 0;
    setEtapas(novasEtapas);
  };

  const handleSalvar = () => {
    if (!nomeProjeto) {
      alert('Por favor, defina um Nome para o Projeto.');
      return;
    }

    const payload: Orcamento = {
      id: editId || Date.now().toString(),
      cliente: cliente || 'Cliente Anônimo',
      nomeProjeto: nomeProjeto,
      data: new Date().toLocaleDateString('pt-BR'),
      status: statusOrcamento,
      valorHora: Number(valorHora) || 0,
      despesasGlobais: despesasGlobais,
      margemLucro: margemLucro,
      etapas: etapas,
      subtotalBase: subtotalBase,
      lucro: lucroAcrescimo,
      valorFinal: valorIdeal,
      formaPagamento: formaPagamento,
      valorFechado: valorFechado === '' ? undefined : Number(valorFechado),
      notasCRM: notasCRM
    };

    saveOrcamento(payload);
    alert(editId ? 'Orçamento Atualizado!' : 'Orçamento gerado e salvo com sucesso!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-4xl mx-auto">
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-graphite font-medium font-sans mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Voltar para Dashboard
        </button>

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-serif text-graphite mb-3">
            {editId ? 'Editar Prospecção' : 'Nova Prospecção Inteligente'}
          </h1>
          <p className="text-gray-500 font-sans max-w-2xl mx-auto">
            Mapeie com precisão todas as etapas do escopo de arquitetura/interiores e calcule honorários que garantem a sustentabilidade do seu escritório.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-accentGold -z-10 -translate-y-1/2 rounded-full transition-all duration-300" 
               style={{ width: step === 1 ? '15%' : step === 2 ? '50%' : '100%' }}></div>
          
          {[1, 2, 3].map(num => (
            <div key={num} onClick={() => setStep(num)} 
                 className={`w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer transition-colors border-2
                 ${step >= num ? 'bg-accentGold text-white border-accentGold shadow-md' : 'bg-surface text-gray-400 border-gray-200'}
            `}>
              {num}
            </div>
          ))}
        </div>

        <Card className="p-8">
          
          {step === 1 && (
            <div className="animation-fade-in space-y-6">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <User size={24} className="text-accentGold" />
                <h2 className="text-xl font-serif text-graphite">Dados Gerais</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input 
                    label="Nome Curto da Prospecção / Orçamento *" 
                    placeholder="Ex: Residência Alphaville - Lote 42" 
                    value={nomeProjeto} onChange={e => setNomeProjeto(e.target.value)}
                  />
                </div>
                <Input label="Nome do Cliente" placeholder="Ex: Roberto Carlos" value={cliente} onChange={e => setCliente(e.target.value)} />
                <Input label="WhatsApp / Telefone" placeholder="(11) 90000-0000" value={telefone} onChange={e => setTelefone(e.target.value)} />
              </div>

              <div className="flex items-center gap-3 mb-6 mt-10 border-b border-gray-100 pb-4">
                <MapPin size={24} className="text-accentGold" />
                <h2 className="text-xl font-serif text-graphite">Detalhes Físicos Focais</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input label="Endereço Completo" placeholder="Localização da Obra/Projeto" value={endereco} onChange={e => setEndereco(e.target.value)} />
                </div>
                <Input label="Área de Intervenção (m²)" placeholder="Ex: 250" type="number" value={area} onChange={e => setArea(Number(e.target.value) || '')} />
                <Input label="Tipo de Projeto" placeholder="Residencial, Comercial, Corporativo..." value={tipoProjeto} onChange={e => setTipoProjeto(e.target.value)} />
              </div>

              <div className="flex justify-end pt-8 mt-4 border-t border-gray-100">
                <button onClick={() => setStep(2)} className="px-8 py-2.5 bg-accentNavy text-white rounded-xl font-medium font-sans hover:bg-graphite transition-colors shadow-sm">
                  Avançar para Escopo
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animation-fade-in space-y-6">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <Layers size={24} className="text-accentGold" />
                  <h2 className="text-xl font-serif text-graphite">Escopo da Prospecção (Fases a apresentar)</h2>
                </div>
                <div className="text-sm font-medium text-accentNavy bg-accentNavy/5 px-3 py-1.5 rounded-lg border border-accentNavy/10">
                  Total Estimado: <span className="font-bold">{horasTotais}h</span>
                </div>
              </div>

              <p className="text-sm text-gray-500 font-sans mb-6">
                Marque quais serviços farão parte do contrato. Estime as horas brutas que sua equipe ou você dedicará em cada fase. As horas ditam a precificação base do escritório.
              </p>

              <div className="space-y-3">
                {etapas.map((etapa, idx) => (
                  <div key={idx} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${etapa.ativa ? 'bg-white border-accentGold/40 shadow-sm' : 'bg-surface border-gray-100 opacity-60'}`}>
                    <input 
                      type="checkbox" 
                      checked={etapa.ativa}
                      onChange={() => handleToggleEtapa(idx)}
                      className="w-5 h-5 accent-accentGold cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className={`font-medium font-sans text-sm ${etapa.ativa ? 'text-graphite' : 'text-gray-400'}`}>
                        {etapa.nome}
                      </div>
                      {etapa.nome === 'Acompanhamento / Gestão de Obras' && etapa.ativa && (
                        <div className="text-xs text-accentNavy mt-2 font-sans bg-accentNavy/5 p-2 rounded-lg border border-accentNavy/10">
                          <strong>Cris Koressawa e sua equipe</strong>, realizam obras, reformas e gestão completa do seu projeto com acompanhamento em tempo real por aplicativo, garantindo mais controle, agilidade e segurança em todas as etapas. Entre em contato (61) 98417-8856.
                        </div>
                      )}
                    </div>
                    {etapa.ativa && (
                      <div className="w-32">
                        <div className="relative">
                          <input 
                            type="number" 
                            className="w-full bg-surface border border-gray-200 rounded-lg py-1.5 pr-8 pl-3 text-sm focus:outline-none focus:border-accentGold focus:ring-1 focus:ring-accentGold/20 font-medium"
                            value={etapa.horas === 0 ? '' : etapa.horas}
                            onChange={(e) => handleHorasEtapa(idx, e.target.value)}
                            placeholder="0"
                          />
                          <span className="absolute right-3 top-1.5 text-gray-400 text-sm font-medium">h</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-8 mt-4 border-t border-gray-100">
                <button onClick={() => setStep(1)} className="px-6 py-2.5 text-gray-500 font-medium font-sans hover:text-graphite transition-colors">Voltar</button>
                <button onClick={() => setStep(3)} className="px-8 py-2.5 bg-accentNavy text-white rounded-xl font-medium font-sans hover:bg-graphite transition-colors shadow-sm">
                  Calcular Honorários
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animation-fade-in space-y-6">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <Calculator size={24} className="text-accentGold" />
                <h2 className="text-xl font-serif text-graphite">Precificação Financeira</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                
                <div className="space-y-5">
                  <div className="bg-surface rounded-xl p-5 border border-gray-200">
                    <h3 className="text-sm font-semibold text-graphite mb-1 uppercase tracking-wider font-sans">1. Custos de Produção (Intelecto)</h3>
                    <p className="text-xs text-gray-500 mb-4">Base de cálculo pelas <strong className="text-graphite">{horasTotais} horas</strong> estimadas na etapa de escopo.</p>
                    <div className="relative">
                      <span className="absolute left-4 top-[10px] text-gray-400 font-medium">R$</span>
                      <input 
                        className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-12 pr-4 focus:outline-none focus:border-accentGold focus:ring-2 focus:ring-accentGold/20 font-medium"
                        type="number" 
                        placeholder="Valor Base da sua Hora (Técnica)"
                        value={valorHora}
                        onChange={(e) => setValorHora(Number(e.target.value) || '')}
                      />
                    </div>
                  </div>

                  <div className="bg-surface rounded-xl p-5 border border-gray-200">
                    <h3 className="text-sm font-semibold text-graphite mb-1 uppercase tracking-wider font-sans">2. Custo Operacional Fixo (Despesas)</h3>
                    <p className="text-xs text-gray-500 mb-4">Custos indiretos, propostas, plotagens iniciais, RRT, gasolina. Tudo que debita do caixa.</p>
                    <div className="relative">
                      <span className="absolute left-4 top-[10px] text-gray-400 font-medium">R$</span>
                      <input 
                        className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-12 pr-4 focus:outline-none focus:border-accentGold focus:ring-2 focus:ring-accentGold/20 font-medium"
                        type="number" 
                        value={despesasGlobais === 0 ? '' : despesasGlobais}
                        onChange={(e) => setDespesasGlobais(Number(e.target.value) || 0)}
                        placeholder="Total Estimado (Fixo)"
                      />
                    </div>
                  </div>

                  <div className="bg-surface rounded-xl p-5 border border-gray-200">
                    <h3 className="text-sm font-semibold text-graphite mb-1 uppercase tracking-wider font-sans">3. Margem de Lucro Bruta</h3>
                    <p className="text-xs text-gray-500 mb-4">A gordura de segurança ou lucro real da empresa em cima do contrato inteiro.</p>
                    <div className="relative w-1/2">
                      <span className="absolute right-4 top-[10px] text-gray-400 font-medium">%</span>
                      <input 
                        className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pr-10 pl-4 focus:outline-none focus:border-accentGold focus:ring-2 focus:ring-accentGold/20 font-medium"
                        type="number" 
                        value={margemLucro}
                        onChange={(e) => setMargemLucro(Number(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-accentGold/5 border border-accentGold/30 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                  <div>
                    <h3 className="font-serif text-lg text-graphite mb-6">Diagnóstico do Contrato</h3>
                    
                    <div className="space-y-4 font-sans text-sm border-b border-accentGold/20 pb-6 mb-6">
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Horas Mapeadas x R$ {valorHora || 0}</span>
                        <span className="font-medium text-graphite">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(custoHoras)}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Despesas Alocadas</span>
                        <span className="font-medium text-graphite">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(despesasGlobais)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-accentGold/10">
                        <span className="font-medium text-graphite">Subtotal de Custos</span>
                        <span className="font-bold text-graphite">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotalBase)}</span>
                      </div>
                      <div className="flex justify-between items-center text-green-700 bg-green-50 p-2 rounded-lg mt-2">
                        <span className="font-medium">Lucro Líquido ({margemLucro}%)</span>
                        <span className="font-bold">+{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lucroAcrescimo)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 font-sans uppercase tracking-widest font-semibold mb-2">Valor Justo Recomendado</div>
                      <div className="text-5xl font-serif text-accentGold mb-2">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorIdeal)}
                      </div>
                      <div className="text-xs text-gray-400 max-w-[80%]">Este é o valor a repassar para o cliente com base nas particularidades do escritório.</div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-accentGold/20">
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Status CRM:</label>
                         <select 
                            value={statusOrcamento}
                            onChange={(e) => setStatusOrcamento(e.target.value as 'Prospecção' | 'Qualificação' | 'Apresentação' | 'Negociação' | 'Fechamento' | 'Perdido')}
                            className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:border-accentNavy font-sans text-sm bg-white"
                         >
                            <option value="Prospecção">Prospecção</option>
                            <option value="Qualificação">Qualificação</option>
                            <option value="Apresentação">Apresentação da Proposta</option>
                            <option value="Negociação">Negociação</option>
                            <option value="Fechamento">Fechamento (Ganho)</option>
                            <option value="Perdido">Perdido</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagto:</label>
                         <select 
                            value={formaPagamento}
                            onChange={(e) => setFormaPagamento(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:border-accentNavy font-sans text-sm bg-white"
                         >
                            <option value="À Vista">À Vista</option>
                            <option value="2x (50/50)">2x (50% Entr / 50% Fim)</option>
                            <option value="3x Sem Juros">3x Sem Juros</option>
                            <option value="Parcelado Excedente">Parcelado Excedente</option>
                         </select>
                       </div>
                       {statusOrcamento === 'Fechamento' && (
                         <div className="col-span-2 mt-2">
                           <label className="block text-sm font-medium text-gray-700 mb-2">Valor EXATO Fechado com o Cliente (R$):</label>
                           <input 
                             type="number"
                             value={valorFechado}
                             onChange={(e) => setValorFechado(Number(e.target.value))}
                             placeholder={`Sugerido: ${valorIdeal}`}
                             className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:border-green-600 font-sans text-sm bg-green-50/50"
                           />
                           <p className="text-xs text-gray-400 mt-1">Isso alimentará o gráfico de "Caixa" no Dashboard.</p>
                         </div>
                       )}
                       <div className="col-span-2 mt-4">
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Anotações do CRM (Ex: Objeções, acordos, descontos dados)
                         </label>
                         <textarea 
                           className="w-full border border-gray-300 rounded-lg p-3 text-sm font-sans focus:outline-none focus:border-accentNavy resize-y min-h-[100px]"
                           placeholder="Ex: Cliente chorou desconto de 5%. Fechamos em x vezes, vai me mandar a planta amanhã."
                           value={notasCRM}
                           onChange={(e) => setNotasCRM(e.target.value)}
                         />
                       </div>
                     </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-between pt-8 mt-4 border-t border-gray-100">
                <button onClick={() => setStep(2)} className="px-6 py-2.5 text-gray-500 font-medium font-sans hover:text-graphite transition-colors">Revisar Escopo</button>
                <button onClick={handleSalvar} className="px-8 py-2.5 bg-accentNavy text-white rounded-xl font-medium font-sans hover:bg-graphite transition-colors shadow-sm text-lg">
                  Finalizar Proposta
                </button>
              </div>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
}
