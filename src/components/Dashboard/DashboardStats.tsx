
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Championship } from '@/lib/supabaseClient';

interface DashboardStatsProps {
  championships: Championship[];
  recentChampionship: Championship | null;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ championships, recentChampionship }) => {
  return (
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
    </div>
  );
};

export default DashboardStats;
