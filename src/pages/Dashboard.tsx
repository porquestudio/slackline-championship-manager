import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { supabase, Championship } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Calendar, PlusCircle, ArrowRight, Database } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { seedData } from '@/lib/seedData';

const Dashboard = () => {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [recentChampionship, setRecentChampionship] = useState<Championship | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [seeding, setSeeding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      setUserProfile(profile);
      
      const { data: champData, error: champError } = await supabase
        .from('championships')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (champError) {
        throw champError;
      }
      
      setChampionships(champData || []);
      
      if (champData && champData.length > 0) {
        setRecentChampionship(champData[0]);
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'border-l-4 border-gray-300';
      case 'active':
        return 'border-l-4 border-slackline-blue';
      case 'completed':
        return 'border-l-4 border-slackline-green';
      default:
        return '';
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const result = await seedData();
      if (result.success) {
        toast({
          title: "Dados criados",
          description: "Dados fictícios inseridos com sucesso!",
        });
        fetchDashboardData();
      } else {
        toast({
          title: "Erro",
          description: "Falha ao inserir dados fictícios",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao inserir dados fictícios",
        variant: "destructive",
      });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao gerenciador de campeonatos de slackline
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-lg bg-gray-100 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Campeonatos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 text-slackline-blue mr-2" />
                  <span className="text-3xl font-bold">{championships.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Campeonato Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentChampionship ? (
                  <div className="flex items-center justify-between">
                    <div className="truncate">
                      <p className="font-semibold truncate">{recentChampionship.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(recentChampionship.date), 'P', { locale: ptBR })}
                      </p>
                    </div>
                    <Link to={`/championship/${recentChampionship.id}`}>
                      <Button size="sm" variant="ghost">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum campeonato criado</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2 flex-wrap">
                <Link to="/championships/new">
                  <Button size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    <span>Novo Campeonato</span>
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1" 
                  onClick={handleSeedData}
                  disabled={seeding}
                >
                  <Database className="h-4 w-4" />
                  <span>{seeding ? "Inserindo..." : "Inserir Dados Fictícios"}</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Campeonatos Recentes</h2>
              <Link to="/championships">
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </Link>
            </div>

            {championships.length === 0 ? (
              <Card className="text-center p-6">
                <CardContent>
                  <div className="flex flex-col items-center gap-4 py-6">
                    <Trophy className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Nenhum campeonato encontrado</h3>
                      <p className="text-muted-foreground mb-6">
                        Crie seu primeiro campeonato para começar
                      </p>
                      <Link to="/championships/new">
                        <Button>Criar Campeonato</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {championships.map((championship) => (
                  <Card 
                    key={championship.id} 
                    className={`overflow-hidden ${getStatusColor(championship.status)}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{championship.name}</h3>
                          <div className="flex text-sm text-muted-foreground">
                            <div className="flex items-center mr-4">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{format(new Date(championship.date), 'P', { locale: ptBR })}</span>
                            </div>
                            {championship.location && (
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                <span>0 atletas</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Link to={`/championship/${championship.id}`}>
                          <Button size="sm">Gerenciar</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Dashboard;
