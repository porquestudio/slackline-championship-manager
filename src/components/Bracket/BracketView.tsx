
import React from 'react';
import { Link } from 'react-router-dom';
import { supabase, Match, Athlete } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface BracketViewProps {
  championshipId: string;
}

const BracketView: React.FC<BracketViewProps> = ({ championshipId }) => {
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [athletes, setAthletes] = React.useState<Record<string, Athlete>>({});
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  
  React.useEffect(() => {
    fetchData();
  }, [championshipId]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // First fetch all athletes in this championship
      const { data: athletesData, error: athletesError } = await supabase
        .from('athletes')
        .select('*')
        .eq('championship_id', championshipId);
        
      if (athletesError) throw athletesError;
      
      // Convert to a map for easy lookup
      const athletesMap: Record<string, Athlete> = {};
      athletesData?.forEach(athlete => {
        athletesMap[athlete.id] = athlete;
      });
      setAthletes(athletesMap);
      
      // Fetch matches
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .eq('championship_id', championshipId)
        .order('round', { ascending: true });
        
      if (matchesError) throw matchesError;
      
      setMatches(matchesData || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar o chaveamento",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMatchesByRound = () => {
    const rounds: Record<number, Match[]> = {};
    
    matches.forEach(match => {
      if (!rounds[match.round]) {
        rounds[match.round] = [];
      }
      rounds[match.round].push(match);
    });
    
    return rounds;
  };
  
  const roundsWithMatches = getMatchesByRound();
  const maxRound = matches.length > 0 ? Math.max(...matches.map(m => m.round)) : 0;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline">Pendente</Badge>;
      case 'in_progress':
        return <Badge className="bg-slackline-blue">Em andamento</Badge>;
      case 'completed':
        return <Badge className="bg-slackline-green">Concluído</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const generateBrackets = () => {
    // This is a simplified function to demonstrate bracket creation
    // In a real application, you'd have more complex logic to seed participants
    const createMatches = async () => {
      try {
        // Get all athletes for this championship
        const { data: athletes, error: athletesError } = await supabase
          .from('athletes')
          .select('*')
          .eq('championship_id', championshipId);
          
        if (athletesError) throw athletesError;
        
        if (!athletes || athletes.length < 2) {
          toast({
            title: "Erro",
            description: "É necessário pelo menos 2 atletas para criar o chaveamento",
            variant: "destructive",
          });
          return;
        }
        
        // Shuffle athletes to randomize seeding
        const shuffled = [...athletes].sort(() => 0.5 - Math.random());
        
        // Calculate the number of rounds needed
        const numAthletes = shuffled.length;
        const numRounds = Math.ceil(Math.log2(numAthletes));
        const totalMatches = Math.pow(2, numRounds) - 1;
        
        // Create all matches (including byes)
        const newMatches = [];
        
        // Create the first round with actual athletes
        const firstRoundMatches = Math.ceil(numAthletes / 2);
        for (let i = 0; i < firstRoundMatches; i++) {
          const athlete1 = shuffled[i * 2];
          const athlete2 = i * 2 + 1 < numAthletes ? shuffled[i * 2 + 1] : null;
          
          newMatches.push({
            championship_id: championshipId,
            round: 1,
            athlete1_id: athlete1.id,
            athlete2_id: athlete2?.id || null,
            status: athlete2 ? 'pending' : 'completed', // If no opponent, it's a bye
            winner_id: athlete2 ? null : athlete1.id, // If no opponent, athlete1 automatically advances
          });
        }
        
        // Add matches for subsequent rounds (these will be filled as the tournament progresses)
        let matchesInCurrentRound = firstRoundMatches;
        for (let round = 2; round <= numRounds; round++) {
          const matchesInThisRound = Math.ceil(matchesInCurrentRound / 2);
          
          for (let i = 0; i < matchesInThisRound; i++) {
            newMatches.push({
              championship_id: championshipId,
              round: round,
              athlete1_id: null, // To be filled later
              athlete2_id: null, // To be filled later
              status: 'pending'
            });
          }
          
          matchesInCurrentRound = matchesInThisRound;
        }
        
        // Insert all matches into the database
        const { error } = await supabase
          .from('matches')
          .insert(newMatches);
          
        if (error) throw error;
        
        // Update the matches state
        fetchData();
        
        toast({
          title: "Chaveamento criado",
          description: "O chaveamento foi gerado com sucesso!",
        });
      } catch (error: any) {
        toast({
          title: "Erro",
          description: error.message || "Falha ao criar chaveamento",
          variant: "destructive",
        });
      }
    };
    
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-4">Criar Chaveamento</h3>
        <p className="text-muted-foreground mb-6">
          Gere automaticamente o chaveamento para este campeonato.
          Certifique-se de que todos os atletas já estão cadastrados.
        </p>
        <Button onClick={createMatches}>Gerar Chaveamento</Button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-slackline-blue">Carregando chaveamento...</div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <Card className="p-6">
        {generateBrackets()}
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[600px] flex gap-4">
        {Array.from({ length: maxRound }, (_, i) => i + 1).map(round => {
          const matchesInRound = roundsWithMatches[round] || [];
          const roundName = round === maxRound ? "Final" : round === maxRound - 1 ? "Semifinal" : `Rodada ${round}`;
          
          return (
            <div key={round} className="flex-1">
              <h3 className="text-center font-semibold mb-4">{roundName}</h3>
              
              <div className="space-y-4">
                {matchesInRound.map(match => (
                  <Card key={match.id} className="p-4">
                    <div className="text-xs text-right mb-2">
                      {getStatusBadge(match.status)}
                    </div>
                    
                    {/* First athlete */}
                    <div className="mb-2 text-sm">
                      {match.athlete1_id ? (
                        <div className={`p-2 rounded ${match.winner_id === match.athlete1_id ? 'bg-slackline-blue bg-opacity-10' : ''}`}>
                          {athletes[match.athlete1_id]?.name || 'Atleta desconhecido'}
                        </div>
                      ) : (
                        <div className="p-2 text-muted-foreground italic">Aguardando...</div>
                      )}
                    </div>
                    
                    <Separator className="my-2" />
                    
                    {/* Second athlete */}
                    <div className="mb-4 text-sm">
                      {match.athlete2_id ? (
                        <div className={`p-2 rounded ${match.winner_id === match.athlete2_id ? 'bg-slackline-blue bg-opacity-10' : ''}`}>
                          {athletes[match.athlete2_id]?.name || 'Atleta desconhecido'}
                        </div>
                      ) : (
                        <div className="p-2 text-muted-foreground italic">Aguardando...</div>
                      )}
                    </div>
                    
                    {match.status !== 'completed' && match.athlete1_id && match.athlete2_id && (
                      <Link to={`/championship/${championshipId}/match/${match.id}`}>
                        <Button size="sm" className="w-full">Avaliar</Button>
                      </Link>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BracketView;
