
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TrickFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
  onClearFilters: () => void;
}

const TrickFilters: React.FC<TrickFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  onClearFilters,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
      <div className="relative w-full sm:w-auto">
        <Input
          placeholder="Buscar manobra..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
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
            <DropdownMenuItem onClick={() => onTypeChange(null)}>
              Todos os tipos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTypeChange('technique')}>
              Técnica
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTypeChange('height')}>
              Altura
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTypeChange('spin')}>
              Giro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTypeChange('combo')}>
              Combo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {(searchQuery || selectedType) && (
          <Button variant="ghost" onClick={onClearFilters}>
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default TrickFilters;
