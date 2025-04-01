
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Championship } from '@/lib/supabaseClient';

interface RecentChampionshipsProps {
  championships: Championship[];
}

const RecentChampionships: React.FC<RecentChampionshipsProps> = ({ championships }) => {
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

  if (championships.length === 0) {
    return (
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
    );
  }

  return (
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
  );
};

export default RecentChampionships;
