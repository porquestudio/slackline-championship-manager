
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import AuthForm from '@/components/Auth/AuthForm';
import { Trophy, CheckCircle, Zap, TrendingUp } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // If logged in, redirect to dashboard
        navigate('/dashboard');
      }
      setLoading(false);
    });

    // Set up listener for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slackline-blue">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 to-indigo-50"></div>
        <div className="container mx-auto px-4 pt-16 pb-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 hero-text">
                Gerencie Campeonatos de Slackline com Facilidade
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Organize competições, avalie manobras e compartilhe resultados com uma plataforma completa para campeonatos de slackline
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="slackline-gradient">
                  <Link to="/register">
                    Começar Agora
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#features">
                    Saiba Mais
                  </a>
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 lg:pl-12 flex justify-center">
              <div className="w-full max-w-md">
                <AuthForm />
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,122.7C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Recursos Completos</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar seus campeonatos de slackline do início ao fim
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 card-hover">
              <div className="p-2 rounded-full bg-blue-50 inline-block mb-4">
                <Trophy className="h-6 w-6 text-slackline-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gerenciamento de Campeonatos</h3>
              <p className="text-gray-600">
                Crie e organize campeonatos facilmente. Defina regras, categorias e gerencie participantes.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 card-hover">
              <div className="p-2 rounded-full bg-purple-50 inline-block mb-4">
                <Zap className="h-6 w-6 text-slackline-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Avaliação de Manobras</h3>
              <p className="text-gray-600">
                Sistema completo para registro e pontuação de manobras, com histórico e cálculo automático.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 card-hover">
              <div className="p-2 rounded-full bg-green-50 inline-block mb-4">
                <CheckCircle className="h-6 w-6 text-slackline-green" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Chaveamento Inteligente</h3>
              <p className="text-gray-600">
                Crie chaveamentos automaticamente ou manualmente, organizando os atletas por nível e modalidade.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 card-hover">
              <div className="p-2 rounded-full bg-orange-50 inline-block mb-4">
                <TrendingUp className="h-6 w-6 text-slackline-yellow" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Resultados em Tempo Real</h3>
              <p className="text-gray-600">
                Acompanhe os resultados em tempo real, com página pública para espectadores.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <Trophy className="h-6 w-6 text-slackline-blue mr-2" />
                <span className="font-bold text-xl">Slackline Championship</span>
              </div>
              <p className="text-gray-400 mt-2">
                A melhor plataforma para gestão de campeonatos de slackline
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="font-semibold mb-3 text-lg">Plataforma</h3>
                <ul className="space-y-2">
                  <li><Link to="/login" className="text-gray-400 hover:text-white">Login</Link></li>
                  <li><Link to="/register" className="text-gray-400 hover:text-white">Cadastro</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-lg">Recursos</h3>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-gray-400 hover:text-white">Funcionalidades</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            &copy; {new Date().getFullYear()} Slackline Championship Manager. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
