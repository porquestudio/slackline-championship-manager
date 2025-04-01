
import React from 'react';
import { supabase, Trick } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TrickListProps {
  onSelectTrick?: (trick: Trick) => void;
  isSelectable?: boolean;
}

const TrickList: React.FC<TrickListProps> = ({ onSelectTrick, isSelectable = false }) => {
  const [tricks, setTricks] = React.useState<Trick[]>([]);
  const [filteredTricks, setFilteredTricks] = React.useState<Trick[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchTricks();
  }, []);

  React.useEffect(() => {
    // Filter tricks based on search query and type filter
    let filtered = [...tricks];
    
    if (searchQuery) {
      filtered = filtered.filter(trick => 
        trick.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedType) {
      filtered = filtered.filter(trick => trick.type === selectedType);
    }
    
    setFilteredTricks(filtered);
  }, [searchQuery, selectedType, tricks]);

  const fetchTricks = async () => {
    try {
      const { data, error } = await supabase
        .from('tricks')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      setTricks(data || []);
      setFilteredTricks(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as manobras",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'technique':
        return <Badge variant="outline" className="bg-slackline-blue bg-opacity-10 text-slackline-blue">Técnica</Badge>;
      case 'height':
        return <Badge variant="outline" className="bg-slackline-green bg-opacity-10 text-slackline-green">Altura</Badge>;
      case 'spin':
        return <Badge variant="outline" className="bg-slackline-yellow bg-opacity-10 text-slackline-yellow">Giro</Badge>;
      case 'combo':
        return <Badge variant="outline" className="bg-slackline-accent bg-opacity-10 text-slackline-accent">Combo</Badge>;
      default:
        return <Badge variant="outline">Outro</Badge>;
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-slackline-blue">Carregando manobras...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="relative w-full sm:w-auto">
          <Input
            placeholder="Buscar manobra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-80"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filtrar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedType(null)}>
                Todos os tipos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType('technique')}>
                Técnica
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType('height')}>
                Altura
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType('spin')}>
                Giro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType('combo')}>
                Combo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {(searchQuery || selectedType) && (
            <Button variant="ghost" onClick={clearFilters}>
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      {filteredTricks.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">
            Nenhuma manobra encontrada
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableCaption>Lista de manobras disponíveis</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Pontos Base</TableHead>
                {isSelectable && <TableHead className="w-[50px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTricks.map((trick) => (
                <TableRow 
                  key={trick.id}
                  className={isSelectable ? "cursor-pointer hover:bg-muted" : ""}
                  onClick={isSelectable ? () => onSelectTrick && onSelectTrick(trick) : undefined}
                >
                  <TableCell className="font-medium">{trick.name}</TableCell>
                  <TableCell>{getTypeBadge(trick.type)}</TableCell>
                  <TableCell className="text-right">{trick.base_points}</TableCell>
                  {isSelectable && (
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">
                        Selecionar
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TrickList;
