import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export function ProjectDetails() {
  const navigate = useNavigate();
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Navigation */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-graphite font-medium font-sans mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Voltar para Dashboard
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Main Content - Timeline Visual */}
          <div className="flex-1">
            <h1 className="text-3xl font-serif text-graphite mb-2">Casa Alphaville</h1>
            <p className="text-gray-500 font-sans mb-8">Cliente: Roberto Carlos • Início: 10/02/2026</p>

            <h2 className="text-xl font-serif text-graphite mb-6">Timeline do Projeto</h2>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              
              {/* Etapa Concluída */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-accentGold text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <CheckCircle2 size={20} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-calc(50%-2.5rem) p-4 rounded-xl shadow-sm bg-white border border-gray-100">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-serif font-bold text-graphite">Briefing & Medidas</div>
                    <time className="font-sans text-xs font-medium text-accentGold">10 Fev</time>
                  </div>
                  <div className="text-sm text-gray-500 font-sans">Contrato assinado. 30% do pagamento recebido.</div>
                </div>
              </div>

              {/* Etapa Concluída */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-accentGold text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <CheckCircle2 size={20} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-calc(50%-2.5rem) p-4 rounded-xl shadow-sm bg-white border border-gray-100">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-serif font-bold text-graphite">Estudo Preliminar</div>
                    <time className="font-sans text-xs font-medium text-accentGold">25 Fev</time>
                  </div>
                  <div className="text-sm text-gray-500 font-sans">Apresentação aprovada com louvor.</div>
                </div>
              </div>

              {/* Etapa Atual - Atrasada */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-red-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <AlertTriangle size={18} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-calc(50%-2.5rem) p-4 rounded-xl shadow-sm bg-red-50 border border-red-100">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-serif font-bold text-red-700">Projeto Executivo</div>
                    <time className="font-sans text-xs font-medium text-red-500">Atrasado (12 dias)</time>
                  </div>
                  <div className="text-sm text-red-600 font-sans">
                    Aguardando cliente aprovar o orçamento da marcenaria para detalhar. Cliente não responde Whatsapp há 10 dias.
                  </div>
                </div>
              </div>

              {/* Etapa Futura */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-gray-100 text-gray-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Clock size={20} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-calc(50%-2.5rem) p-4 rounded-xl shadow-sm bg-surface border border-dashed border-gray-200 opacity-60">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-serif font-bold text-gray-500">Entrega Final</div>
                    <time className="font-sans text-xs font-medium text-gray-400">Pendente</time>
                  </div>
                  <div className="text-sm text-gray-400 font-sans">Mão na massa na obra e entrega de cadernos.</div>
                </div>
              </div>

            </div>
          </div>

          {/* Sidebar - Dados Financeiros & Ações */}
          <div className="w-full md:w-80 space-y-6">
            <Card>
              <h3 className="font-serif font-medium text-graphite mb-4">Resumo Financeiro</h3>
              <div className="space-y-3 font-sans">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Valor Total:</span>
                  <span className="font-medium">R$ 35.000</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Recebido (60%):</span>
                  <span className="font-medium text-accentGold">R$ 21.000</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Saldo a Receber:</span>
                  <span className="font-medium text-graphite">R$ 14.000</span>
                </div>
              </div>
            </Card>

            <Card className="bg-graphite text-white">
              <h3 className="font-serif font-medium text-white mb-2">Painel de Ações</h3>
              <p className="text-sm text-gray-400 font-sans mb-6">Proteja seu tempo e seu caixa contra atrasos.</p>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-colors font-sans text-sm text-left">
                  <FileText size={18} className="text-accentGold" />
                  Gerar Ata de Reunião
                </button>
                <button className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-colors font-sans text-sm text-left">
                  <Clock size={18} className="text-accentGold" />
                  Estender Prazo Oficial
                </button>
                <button 
                  onClick={() => setShowNotificationModal(true)}
                  className="w-full flex items-center gap-3 bg-red-500 hover:bg-red-600 px-4 py-3 rounded-xl transition-colors font-sans text-sm text-left"
                >
                  <AlertTriangle size={18} className="text-white" />
                  Emitir Notificação Extrajudicial
                </button>
              </div>
            </Card>
          </div>

        </div>

        {/* Modal de Confirmação Jurídica */}
        {showNotificationModal && (
          <div className="fixed inset-0 bg-graphite/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full relative">
              <h3 className="text-2xl font-serif text-graphite mb-2">Notificar Cliente?</h3>
              <p className="text-gray-500 font-sans text-sm mb-6">
                Não tenha medo de cobrar pelo serviço que já foi executado. O cliente está atrasado <strong>12 dias</strong>. O sistema irá gerar um PDF formal baseado na Cláusula 5.2 do seu contrato, alertando sobre a possível rescisão com multa de 20% do saldo devedor.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowNotificationModal(false)}
                  className="flex-1 py-3 text-gray-500 font-medium font-sans hover:bg-surface rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  className="flex-1 py-3 bg-red-600 text-white font-medium font-sans rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                  onClick={() => {
                    alert('PDF de Notificação Extrajudicial Gerado com Sucesso!');
                    setShowNotificationModal(false);
                  }}
                >
                  Sim, Gerar PDF
                </button>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
