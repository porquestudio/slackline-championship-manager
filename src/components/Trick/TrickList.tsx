
import React from 'react';
import { Trick } from '@/lib/supabaseClient';
import TrickFilters from './TrickFilters';
import TrickTable from './TrickTable';
import { useTricks } from './useTricks';

interface TrickListProps {
  onSelectTrick?: (trick: Trick) => void;
  isSelectable?: boolean;
}

const TrickList: React.FC<TrickListProps> = ({ onSelectTrick, isSelectable = false }) => {
  const {
    filteredTricks,
    loading,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    clearFilters
  } = useTricks();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-slackline-blue">Carregando manobras...</div>
      </div>
    );
  }

  return (
    <div>
      <TrickFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        onClearFilters={clearFilters}
      />

      <TrickTable 
        tricks={filteredTricks}
        isSelectable={isSelectable}
        onSelectTrick={onSelectTrick}
      />
    </div>
  );
};

export default TrickList;
