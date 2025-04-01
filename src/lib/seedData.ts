
import { supabase } from './supabaseClient';

// Dados de exemplo para perfis de usuários
const sampleProfiles = [
  {
    id: '1',
    name: 'João Silva',
    avatar_url: 'https://i.pravatar.cc/150?img=1',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    avatar_url: 'https://i.pravatar.cc/150?img=5',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Pedro Santos',
    avatar_url: 'https://i.pravatar.cc/150?img=3',
    created_at: new Date().toISOString()
  }
];

// Dados de exemplo para campeonatos
const sampleChampionships = [
  {
    id: '1',
    name: 'Campeonato Brasileiro de Slackline 2024',
    description: 'A maior competição de slackline do Brasil, reunindo os melhores atletas do país.',
    date: new Date(2024, 5, 15).toISOString(),
    location: 'Praia de Copacabana, Rio de Janeiro',
    created_by: '1',
    created_at: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '2',
    name: 'Copa São Paulo de Trickline',
    description: 'Competição regional focada em manobras técnicas e acrobáticas.',
    date: new Date(2024, 7, 10).toISOString(),
    location: 'Parque Ibirapuera, São Paulo',
    created_by: '1',
    created_at: new Date().toISOString(),
    status: 'draft'
  },
  {
    id: '3',
    name: 'Circuito Mineiro de Slackline',
    description: 'Série de competições em diferentes cidades de Minas Gerais.',
    date: new Date(2024, 9, 22).toISOString(),
    location: 'Praça da Liberdade, Belo Horizonte',
    created_by: '2',
    created_at: new Date().toISOString(),
    status: 'completed'
  }
];

// Dados de exemplo para atletas
const sampleAthletes = [
  {
    id: '1',
    name: 'Lucas Oliveira',
    championship_id: '1',
    category: 'trickline',
    level: 'professional',
    bio: 'Campeão brasileiro de trickline por 3 anos consecutivos.',
    avatar_url: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: '2',
    name: 'Juliana Costa',
    championship_id: '1',
    category: 'trickline',
    level: 'female',
    bio: 'Representante brasileira em competições internacionais desde 2019.',
    avatar_url: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: '3',
    name: 'Fernando Almeida',
    championship_id: '1',
    category: 'trickline',
    level: 'amateur',
    bio: 'Praticante de slackline há 5 anos com foco em manobras técnicas.',
    avatar_url: 'https://i.pravatar.cc/150?img=13'
  },
  {
    id: '4',
    name: 'Carolina Lima',
    championship_id: '1',
    category: 'speedline',
    level: 'professional',
    bio: 'Recordista nacional de speedline com tempo de 1:45.',
    avatar_url: 'https://i.pravatar.cc/150?img=14'
  },
  {
    id: '5',
    name: 'Matheus Santos',
    championship_id: '2',
    category: 'trickline',
    level: 'beginner',
    bio: 'Iniciante promissor com grande potencial para manobras aéreas.',
    avatar_url: 'https://i.pravatar.cc/150?img=15'
  },
  {
    id: '6',
    name: 'Laura Pereira',
    championship_id: '2',
    category: 'trickline',
    level: 'female',
    bio: 'Especialista em combos e manobras consecutivas.',
    avatar_url: 'https://i.pravatar.cc/150?img=16'
  }
];

// Dados de exemplo para manobras
const sampleTricks = [
  {
    id: '1',
    name: 'Backflip',
    type: 'height',
    base_points: 8,
    description: 'Mortal para trás completo.'
  },
  {
    id: '2',
    name: 'Buddha',
    type: 'technique',
    base_points: 5,
    description: 'Postura sentada com equilíbrio na fita.'
  },
  {
    id: '3',
    name: 'Chest Bounce',
    type: 'technique',
    base_points: 4,
    description: 'Quicar na fita com o peito e voltar para posição em pé.'
  },
  {
    id: '4',
    name: '360 Spin',
    type: 'spin',
    base_points: 6,
    description: 'Giro completo de 360 graus.'
  },
  {
    id: '5',
    name: 'Buttbounce',
    type: 'technique',
    base_points: 3,
    description: 'Quicar na fita sentado e voltar para posição em pé.'
  },
  {
    id: '6',
    name: 'Frontflip',
    type: 'height',
    base_points: 8,
    description: 'Mortal para frente completo.'
  },
  {
    id: '7',
    name: 'Double Backflip',
    type: 'combo',
    base_points: 12,
    description: 'Dois mortais para trás consecutivos.'
  },
  {
    id: '8',
    name: '720 Spin',
    type: 'spin',
    base_points: 9,
    description: 'Dois giros completos de 360 graus consecutivos.'
  }
];

// Dados de exemplo para disputas
const sampleMatches = [
  {
    id: '1',
    championship_id: '1',
    round: 1,
    athlete1_id: '1',
    athlete2_id: '3',
    winner_id: '1',
    next_match_id: '3',
    status: 'completed'
  },
  {
    id: '2',
    championship_id: '1',
    round: 1,
    athlete1_id: '2',
    athlete2_id: '4',
    winner_id: '2',
    next_match_id: '3',
    status: 'completed'
  },
  {
    id: '3',
    championship_id: '1',
    round: 2,
    athlete1_id: '1',
    athlete2_id: '2',
    winner_id: null,
    next_match_id: null,
    status: 'in_progress'
  }
];

// Dados de exemplo para performances
const samplePerformances = [
  {
    id: '1',
    athlete_id: '1',
    championship_id: '1',
    match_id: '1',
    tricks: [
      { trick_id: '1', execution_score: 8.5 },
      { trick_id: '4', execution_score: 9.0 },
      { trick_id: '7', execution_score: 7.5 }
    ],
    total_score: 25.0,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    athlete_id: '3',
    championship_id: '1',
    match_id: '1',
    tricks: [
      { trick_id: '2', execution_score: 8.0 },
      { trick_id: '5', execution_score: 7.5 },
      { trick_id: '6', execution_score: 6.5 }
    ],
    total_score: 22.0,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    athlete_id: '2',
    championship_id: '1',
    match_id: '2',
    tricks: [
      { trick_id: '3', execution_score: 9.5 },
      { trick_id: '5', execution_score: 8.5 },
      { trick_id: '8', execution_score: 7.0 }
    ],
    total_score: 25.0,
    created_at: new Date().toISOString()
  }
];

// Função para inserir os dados
export const seedData = async () => {
  try {
    console.log('Iniciando inserção de dados fictícios...');
    
    // Inserir perfis
    const { error: profilesError } = await supabase
      .from('profiles')
      .upsert(sampleProfiles);
      
    if (profilesError) throw profilesError;
    console.log('✅ Perfis inseridos com sucesso');
    
    // Inserir campeonatos
    const { error: championshipsError } = await supabase
      .from('championships')
      .upsert(sampleChampionships);
      
    if (championshipsError) throw championshipsError;
    console.log('✅ Campeonatos inseridos com sucesso');
    
    // Inserir atletas
    const { error: athletesError } = await supabase
      .from('athletes')
      .upsert(sampleAthletes);
      
    if (athletesError) throw athletesError;
    console.log('✅ Atletas inseridos com sucesso');
    
    // Inserir manobras
    const { error: tricksError } = await supabase
      .from('tricks')
      .upsert(sampleTricks);
      
    if (tricksError) throw tricksError;
    console.log('✅ Manobras inseridas com sucesso');
    
    // Inserir disputas
    const { error: matchesError } = await supabase
      .from('matches')
      .upsert(sampleMatches);
      
    if (matchesError) throw matchesError;
    console.log('✅ Disputas inseridas com sucesso');
    
    // Inserir performances
    const { error: performancesError } = await supabase
      .from('performances')
      .upsert(samplePerformances);
      
    if (performancesError) throw performancesError;
    console.log('✅ Performances inseridas com sucesso');
    
    return { success: true, message: 'Todos os dados fictícios foram inseridos com sucesso!' };
  } catch (error) {
    console.error('Erro ao inserir dados:', error);
    return { success: false, error };
  }
};
