
import { useState, useEffect } from 'react';
import { supabase, Championship } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export const useDashboardData = () => {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [recentChampionship, setRecentChampionship] = useState<Championship | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      setUserProfile(profile);
      
      const { data: champData, error: champError } = await supabase
        .from('championships')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (champError) {
        throw champError;
      }
      
      setChampionships(champData || []);
      
      if (champData && champData.length > 0) {
        setRecentChampionship(champData[0]);
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    championships,
    recentChampionship,
    loading,
    userProfile,
    refreshData: fetchDashboardData
  };
};
