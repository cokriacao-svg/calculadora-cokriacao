import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

import { useNavigate } from 'react-router-dom';
import { safeSetItem } from '../utils/storage';

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fixedCosts: '',
    revenueGoal: '',
    emergencyMonths: '6',
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleFinish = () => {
    safeSetItem('arquitetura_setup_completed', 'true');
    if (formData.fixedCosts) safeSetItem('arquitetura_custos_fixos', formData.fixedCosts.toString());
    safeSetItem('arquitetura_meta_faturamento', formData.revenueGoal.toString() || '20000');
    navigate('/dashboard');
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      
      <div className="max-w-xl w-full">
        {/* Header Progress */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-serif text-graphite mb-3">
            Base Financeira do Negócio
          </h1>
          <p className="text-gray-500 font-sans">
            "Entenda quanto custa manter sua operação ativa e tome decisões mais seguras sobre preço, margem e lucro."
          </p>
          
          <div className="flex justify-center gap-2 mt-8">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? 'w-12 bg-accentGold' : i < step ? 'w-8 bg-accentNavy' : 'w-8 bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Steps Content */}
        <Card className="min-h-[320px] flex flex-col justify-between">
          <div className="mb-8">
            {step === 1 && (
              <div className="animation-fade-in">
                <h2 className="text-xl font-serif text-graphite mb-6">Base Financeira do Negócio</h2>
                <p className="text-sm text-gray-500 mb-6 font-sans">
                  Entenda quanto custa manter sua operação ativa e tome decisões mais seguras sobre preço, margem e lucro.
                </p>
                <div className="relative">
                  <span className="absolute left-4 top-[42px] text-gray-400 font-medium">R$</span>
                  <Input 
                    label="Valor Total de Custos Básicos" 
                    placeholder="0,00"
                    type="number"
                    className="pl-12"
                    value={formData.fixedCosts}
                    onChange={(e) => setFormData({...formData, fixedCosts: e.target.value})}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animation-fade-in">
                <h2 className="text-xl font-serif text-graphite mb-6">Meta de faturamento</h2>
                <p className="text-sm text-gray-500 mb-6 font-sans">
                  Defina quanto seu negócio precisa faturar para cobrir a estrutura, gerar lucro e crescer com mais clareza.
                </p>
                <div className="relative">
                  <span className="absolute left-4 top-[42px] text-gray-400 font-medium">R$</span>
                  <Input 
                    label="Faturamento Mensal Alvo" 
                    placeholder="0,00"
                    type="number"
                    className="pl-12"
                    value={formData.revenueGoal}
                    onChange={(e) => setFormData({...formData, revenueGoal: e.target.value})}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animation-fade-in">
                <h2 className="text-xl font-serif text-graphite mb-6">Margem de segurança</h2>
                <p className="text-sm text-gray-500 mb-6 font-sans">
                  Estabeleça uma reserva de emergência para manter o negócio saudável mesmo nos meses mais desafiadores.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setFormData({...formData, emergencyMonths: '4'})}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      formData.emergencyMonths === '4' ? 'border-accentGold bg-accentGold/5' : 'border-gray-100'
                    }`}
                  >
                    <div className="font-serif text-lg text-graphite mb-1">4 Meses</div>
                    <div className="text-xs text-gray-500 font-sans">Reserva Mínima</div>
                  </button>

                  <button 
                    onClick={() => setFormData({...formData, emergencyMonths: '6'})}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      formData.emergencyMonths === '6' ? 'border-accentGold bg-accentGold/5' : 'border-gray-100'
                    }`}
                  >
                    <div className="font-serif text-lg text-graphite mb-1">6 Meses</div>
                    <div className="text-xs text-gray-500 font-sans">Ideal e Seguro</div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-auto">
            {step > 1 ? (
              <button 
                onClick={handleBack}
                className="px-6 py-2.5 text-gray-500 font-medium font-sans hover:text-graphite transition-colors"
              >
                Voltar
              </button>
            ) : (
              <div></div>
            )}
            
            <button 
              onClick={step === 3 ? handleFinish : handleNext}
              className="px-8 py-2.5 bg-accentNavy text-white rounded-xl font-medium font-sans hover:bg-graphite transition-colors shadow-sm"
            >
              {step === 3 ? 'Finalizar Setup' : 'Avançar'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
