import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Onboarding } from './pages/Onboarding';
import { Config } from './pages/Config';
import { Dashboard } from './pages/Dashboard';
import { ProjectDetails } from './pages/ProjectDetails';
import { NewProject } from './pages/NewProject';
import { safeGetItem, safeSetItem } from './utils/storage';

function Home() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [hasLead, setHasLead] = useState(() => {
    return !!safeGetItem('arquitetura_lead');
  });
  
  const hasSetupComplete = !!safeGetItem('arquitetura_setup_completed');

  const handleAcessar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasLead) {
      if (!nome || !email || !telefone) {
        alert('Por favor, preencha todos os campos para continuar.');
        return;
      }
      
      const leadData = {
        nome,
        email,
        telefone,
        data: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR')
      };
      
      safeSetItem('arquitetura_lead', JSON.stringify(leadData));
      
      // Enviando para a Planilha do Google via SheetDB
      fetch('https://sheetdb.io/api/v1/st6ng7s2ztxs9', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              data: [leadData]
          })
      })
      .then((response) => response.json())
      .catch((error) => console.error('Erro ao salvar lead offline:', error));
      
      setHasLead(true);
    }
    if (hasSetupComplete) {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-surface relative">
      <div className="bg-white p-10 rounded-2xl shadow-xl shadow-black/5 border border-gray-100 max-w-2xl w-full text-center z-10 my-10">
        <div className="w-16 h-16 bg-accentNavy rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-accentGold font-serif text-2xl font-bold">C</span>
        </div>
        
        <h1 className="text-3xl font-serif text-graphite mb-3">
          Calculadora Eficiente para Designers, Arquitetos e Gestores
        </h1>
        
        <p className="text-gray-500 mb-8 font-sans text-lg">
          Definitivo para transformar a forma como você precifica seus projetos e gerencia seu negócio.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-10">
          <div className="bg-surface/50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-semibold text-graphite mb-1 flex items-center gap-2">🎯 Precificação Precisa</h3>
            <p className="text-sm text-gray-500">Mapeamento exato de horas técnicas por etapa (Estudo, Executivo, Obra) para orçamentos sem prejuízo.</p>
          </div>
          <div className="bg-surface/50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-semibold text-graphite mb-1 flex items-center gap-2">📊 Custos e Lucratividade</h3>
            <p className="text-sm text-gray-500">Integração de despesas operacionais e margens de lucro claras em cada proposta enviada.</p>
          </div>
          <div className="bg-surface/50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-semibold text-graphite mb-1 flex items-center gap-2">🗂️ Histórico de Funil</h3>
            <p className="text-sm text-gray-500">Acompanhamento visual de projetos abertos, ganhos e perdidos com valores totalmente editáveis.</p>
          </div>
          <div className="bg-surface/50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-semibold text-graphite mb-1 flex items-center gap-2">💰 Inteligência Financeira</h3>
            <p className="text-sm text-gray-500">Metas de faturamento dinâmicas e planejamento de fluxo de caixa para a saúde do escritório.</p>
          </div>
        </div>
        
        {!hasLead && showForm ? (
          <form onSubmit={handleAcessar} className="mt-8 bg-surface/80 p-6 rounded-xl border border-gray-200 text-left w-full max-w-md mx-auto animation-fade-in">
            <h4 className="font-serif text-xl text-graphite mb-4 text-center">Identifique-se para acessar</h4>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input 
                type="text" 
                required
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: Roberto Carlos"
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:border-accentNavy font-sans text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Telefone</label>
              <input 
                type="tel" 
                required
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                placeholder="(11) 90000-0000"
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:border-accentNavy font-sans text-sm"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Seu Melhor E-mail</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Ex: roberto@arquitetura.com"
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:border-accentNavy font-sans text-sm"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-accentGold text-white font-sans font-bold py-3 px-12 rounded-xl hover:bg-yellow-600 transition-colors duration-200 shadow-sm text-lg"
            >
              Liberar Meu Acesso Grátis
            </button>
          </form>
        ) : (
          <button 
            onClick={() => {
              if (hasLead) {
                if (hasSetupComplete) navigate('/dashboard');
                else navigate('/onboarding');
              }
              else setShowForm(true);
            }}
            className="w-full md:w-auto bg-accentNavy text-white font-sans font-medium py-3 px-12 rounded-xl hover:bg-graphite transition-colors duration-200 shadow-sm text-lg"
          >
            Acessar o Sistema
          </button>
        )}

      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center text-sm font-sans text-gray-400">
        Aplicativo criado por <span className="font-medium text-gray-500">Cris Koressawa</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-project" element={<NewProject />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/config" element={<Config />} />
      </Routes>
    </BrowserRouter>
  )
}
