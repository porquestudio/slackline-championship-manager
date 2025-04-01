
import React from 'react';
import { Trick } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { getTypeBadge } from './TrickTypeUtils';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TrickTableProps {
  tricks: Trick[];
  isSelectable?: boolean;
  onSelectTrick?: (trick: Trick) => void;
}

const TrickTable: React.FC<TrickTableProps> = ({ 
  tricks, 
  isSelectable = false,
  onSelectTrick 
}) => {
  if (tricks.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">
          Nenhuma manobra encontrada
        </p>
      </div>
    );
  }

  return (
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
          {tricks.map((trick) => (
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
  );
};

export default TrickTable;
