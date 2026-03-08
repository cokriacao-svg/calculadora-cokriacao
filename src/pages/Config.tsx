import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, ShieldAlert, FileSignature } from 'lucide-react';

export function Config() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('legal');

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Navigation */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-graphite font-medium font-sans mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Voltar para Dashboard
        </button>

        <h1 className="text-3xl font-serif text-graphite mb-2">Configurações Base</h1>
        <p className="text-gray-500 font-sans mb-8">Defina as regras do jogo antes dele começar.</p>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Menu Lateral */}
          <div className="w-full md:w-64 space-y-2">
            <button 
              onClick={() => setActiveTab('legal')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium font-sans transition-colors ${
                activeTab === 'legal' ? 'bg-accentNavy text-white' : 'text-gray-500 hover:bg-surface border border-transparent'
              }`}
            >
              <Scale size={20} /> Jurídico & Multas
            </button>
            <button 
              onClick={() => setActiveTab('contracts')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium font-sans transition-colors ${
                activeTab === 'contracts' ? 'bg-accentNavy text-white' : 'text-gray-500 hover:bg-surface border border-transparent'
              }`}
            >
              <FileSignature size={20} /> Modelos de Contrato
            </button>
            <button 
              onClick={() => setActiveTab('risks')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium font-sans transition-colors ${
                activeTab === 'risks' ? 'bg-accentNavy text-white' : 'text-gray-500 hover:bg-surface border border-transparent'
              }`}
            >
              <ShieldAlert size={20} /> Proteção de Arquivos
            </button>
          </div>

          {/* Área de Conteúdo */}
          <div className="flex-1">
            {activeTab === 'legal' && (
              <div className="space-y-6 animation-fade-in">
                
                <Card>
                  <h3 className="font-serif text-lg text-graphite mb-1">Cláusulas de Atraso e Rescisão</h3>
                  <p className="text-sm text-gray-500 font-sans mb-6">Bloqueios automáticos contra "pausas indeterminadas" de projeto.</p>
                  
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        label="Dias máximos de ausência do cliente"
                        defaultValue="15"
                        type="number"
                      />
                      <Input 
                        label="Multa sobre o Saldo Remanescente (%)"
                        defaultValue="20"
                        type="number"
                      />
                    </div>
                    <div className="p-4 bg-surface rounded-xl border border-gray-100 text-sm font-sans text-graphite/80">
                      <strong>Texto Padrão (Pré-visualização do Contrato):</strong><br/>
                      "Em caso de ausência de respostas, aprovações ou entrega de materiais por parte do CONTRATANTE superior a 15 dias, o projeto será considerado pausado compulsoriamente, ensejando rescisão com multa de 20% do saldo devedor para sua retomada."
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="font-serif text-lg text-graphite mb-1">Inadimplência</h3>
                  <p className="text-sm text-gray-500 font-sans mb-6">Regras automáticas para cálculos de atraso financeiro.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Multa Fixa (Atraso de Boleto)"
                      defaultValue="2"
                      placeholder="%"
                      type="number"
                    />
                    <Input 
                      label="Juros de Mora ao Mês (%)"
                      defaultValue="1"
                      type="number"
                    />
                  </div>
                </Card>

              </div>
            )}

            {activeTab === 'contracts' && (
              <Card className="animation-fade-in">
                <div className="text-center py-12">
                  <FileSignature size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-serif text-graphite mb-2">Gerador de Contratos</h3>
                  <p className="text-gray-500 font-sans text-sm max-w-sm mx-auto">
                    Seus contratos inteligentes serão gerados baseados nestas configurações assim que um orçamento for fechado.
                  </p>
                </div>
              </Card>
            )}

            {activeTab === 'risks' && (
              <Card className="animation-fade-in">
                <h3 className="font-serif text-lg text-graphite mb-1">Proteção e Direitos Autorais</h3>
                <p className="text-sm text-gray-500 font-sans mb-6">Controle sobre a entrega de arquivos brutos (DWG/RVT/SKP/MAX).</p>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 p-4 border border-accentGold bg-accentGold/5 rounded-xl cursor-pointer">
                    <input type="radio" name="fileRules" defaultChecked className="mt-1" />
                    <div>
                      <div className="font-medium text-graphite font-sans">Bloquear Arquivos Editáveis</div>
                      <div className="text-sm text-gray-500 mt-1">O cliente recebe apenas PDF e imagens. Os arquivos editáveis não são entregues, sob pena de violação de direitos autorais segundo a lei.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border border-gray-200 hover:border-accentNavy/50 rounded-xl cursor-pointer transition-colors">
                    <input type="radio" name="fileRules" className="mt-1" />
                    <div>
                      <div className="font-medium text-graphite font-sans">Vender Arquivos Editáveis (+30%)</div>
                      <div className="text-sm text-gray-500 mt-1">O cliente pode solicitar os arquivos brutos mediante o pagamento de uma taxa extra calculada automaticamente no orçamento.</div>
                    </div>
                  </label>
                </div>
              </Card>
            )}

            <div className="mt-6 flex justify-end">
              <button className="px-8 py-2.5 bg-accentNavy text-white rounded-xl font-medium font-sans hover:bg-graphite transition-colors shadow-sm">
                Salvar Configurações
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
