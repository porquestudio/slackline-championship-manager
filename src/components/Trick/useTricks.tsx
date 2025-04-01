
import { useState, useEffect } from 'react';
import { supabase, Trick } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export const useTricks = () => {
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [filteredTricks, setFilteredTricks] = useState<Trick[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTricks();
  }, []);

  useEffect(() => {
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

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType(null);
  };

  return {
    tricks,
    filteredTricks,
    loading,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    clearFilters
  };
};
