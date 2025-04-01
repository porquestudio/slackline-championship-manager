
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { supabase, Championship as ChampionshipType, Athlete } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AthleteForm from '@/components/Athlete/AthleteForm';
import TrickList from '@/components/Trick/TrickList';
import BracketView from '@/components/Bracket/BracketView';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trophy, Calendar, MapPin, Users, PlusCircle } from 'lucide-react';

const Championship = () => {
  const { id } = useParams<{ id: string }>();
  const [championship, setChampionship] = useState<ChampionshipType | null>(null);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [athleteDialogOpen, setAthleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchChampionshipData(id);
    }
  }, [id]);

  const fetchChampionshipData = async (championshipId: string) => {
    try {
      setLoading(true);
      
      // Fetch championship details
      const { data: champData, error: champError } = await supabase
        .from('championships')
        .select('*')
        .eq('id', championshipId)
        .single();
        
      if (champError) throw champError;
      
      setChampionship(champData);
      
      // Fetch athletes in this championship
      const { data: athletesData, error: athletesError } = await supabase
        .from('athletes')
        .select('*')
        .eq('championship_id', championshipId)
        .order('name');
        
      if (athletesError) throw athletesError;
      
      setAthletes(athletesData || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar o campeonato",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAthleteAdded = () => {
    setAthleteDialogOpen(false);
    if (id) {
      fetchChampionshipData(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Rascunho</Badge>;
      case 'active':
        return <Badge variant="default" className="bg-slackline-blue">Ativo</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-slackline-green">Concluído</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  if (!id) {
    return <Navigate to="/dashboard" />;
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse text-slackline-blue">Carregando campeonato...</div>
        </div>
      </MainLayout>
    );
  }

  if (!championship) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Campeonato não encontrado</h2>
          <p className="text-muted-foreground mb-8">
            O campeonato solicitado não existe ou você não tem permissão para acessá-lo.
          </p>
          <Button asChild>
            <a href="/championships">Ver todos os campeonatos</a>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{championship.name}</h1>
              {getStatusBadge(championship.status)}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(championship.date), 'PPP', { locale: ptBR })}</span>
              </div>
              {championship.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{championship.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{athletes.length} atletas</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="athletes">
          <TabsList className="mb-6">
            <TabsTrigger value="athletes">Atletas</TabsTrigger>
            <TabsTrigger value="bracket">Chaveamento</TabsTrigger>
            <TabsTrigger value="tricks">Manobras</TabsTrigger>
          </TabsList>

          <TabsContent value="athletes">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Atletas</h2>
              <Dialog open={athleteDialogOpen} onOpenChange={setAthleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    <span>Adicionar Atleta</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Atleta</DialogTitle>
                  </DialogHeader>
                  <AthleteForm championshipId={id} onSuccess={handleAthleteAdded} />
                </DialogContent>
              </Dialog>
            </div>

            {athletes.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum atleta cadastrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Adicione atletas para começar a montar seu campeonato
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Adicionar Atleta</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Atleta</DialogTitle>
                      </DialogHeader>
                      <AthleteForm championshipId={id} onSuccess={handleAthleteAdded} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {athletes.map((athlete) => (
                  <Card key={athlete.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-slackline-blue bg-opacity-10 flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-slackline-blue" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{athlete.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {athlete.category === 'trickline' ? 'Trickline' : 'Speedline'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {athlete.level === 'beginner' ? 'Iniciante' :
                               athlete.level === 'amateur' ? 'Amador' :
                               athlete.level === 'professional' ? 'Profissional' : 'Feminino'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {athlete.bio && (
                        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                          {athlete.bio}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bracket">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Chaveamento</h2>
              <p className="text-muted-foreground">
                Organize os confrontos e acompanhe o progresso do campeonato
              </p>
            </div>
            <BracketView championshipId={id} />
          </TabsContent>

          <TabsContent value="tricks">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Manobras</h2>
              <p className="text-muted-foreground">
                Lista de manobras disponíveis para avaliação
              </p>
            </div>
            <TrickList />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Championship;
