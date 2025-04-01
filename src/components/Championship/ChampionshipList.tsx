
import React from 'react';
import { Link } from 'react-router-dom';
import { supabase, Championship } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trophy, CalendarDays, MapPin, Users } from 'lucide-react';

const ChampionshipList: React.FC = () => {
  const [championships, setChampionships] = React.useState<Championship[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchChampionships();
  }, []);

  const fetchChampionships = async () => {
    try {
      const { data, error } = await supabase
        .from('championships')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setChampionships(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os campeonatos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Rascunho</Badge>;
      case 'active':
        return <Badge variant="default" className="bg-slackline-green">Ativo</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-slackline-blue">Concluído</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-slackline-blue">Carregando campeonatos...</div>
      </div>
    );
  }

  if (championships.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <Trophy className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-medium">Nenhum campeonato encontrado</h3>
            <p className="text-muted-foreground">
              Crie seu primeiro campeonato para começar.
            </p>
            <Link to="/championships/new">
              <Button>Criar Campeonato</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {championships.map((championship) => (
        <Card key={championship.id} className="card-hover overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg line-clamp-1">{championship.name}</CardTitle>
              {getStatusBadge(championship.status)}
            </div>
            <CardDescription className="line-clamp-2">
              {championship.description || 'Sem descrição'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slackline-blue" />
                <span>
                  {format(new Date(championship.date), 'PPP', { locale: ptBR })}
                </span>
              </div>
              {championship.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slackline-blue" />
                  <span className="line-clamp-1">{championship.location}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex justify-between">
            <Button variant="outline" size="sm" className="gap-1">
              <Users className="h-4 w-4" />
              <span>0 Atletas</span>
            </Button>
            <Link to={`/championship/${championship.id}`}>
              <Button size="sm">Gerenciar</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ChampionshipList;
