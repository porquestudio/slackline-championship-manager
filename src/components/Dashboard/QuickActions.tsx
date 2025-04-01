
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Database } from 'lucide-react';
import { seedData } from '@/lib/seedData';
import { useToast } from '@/hooks/use-toast';

interface QuickActionsProps {
  onDataSeeded: () => Promise<void>;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onDataSeeded }) => {
  const [seeding, setSeeding] = useState(false);
  const { toast } = useToast();

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const result = await seedData();
      if (result.success) {
        toast({
          title: "Dados criados",
          description: "Dados fictícios inseridos com sucesso!",
        });
        await onDataSeeded();
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
  );
};

export default QuickActions;
