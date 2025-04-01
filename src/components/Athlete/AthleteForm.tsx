
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

const athleteFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  category: z.enum(['trickline', 'speedline']),
  level: z.enum(['beginner', 'amateur', 'professional', 'female']),
  bio: z.string().optional(),
});

type AthleteFormValues = z.infer<typeof athleteFormSchema>;

interface AthleteFormProps {
  championshipId: string;
  onSuccess?: () => void;
}

const AthleteForm: React.FC<AthleteFormProps> = ({ championshipId, onSuccess }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<AthleteFormValues>({
    resolver: zodResolver(athleteFormSchema),
    defaultValues: {
      name: '',
      category: 'trickline',
      level: 'amateur',
      bio: '',
    },
  });

  const onSubmit = async (values: AthleteFormValues) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('athletes')
        .insert([
          { 
            name: values.name,
            championship_id: championshipId,
            category: values.category,
            level: values.level,
            bio: values.bio || '',
          }
        ]);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Atleta adicionado",
        description: "O atleta foi adicionado com sucesso!",
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao adicionar atleta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'trickline':
        return 'Trickline';
      case 'speedline':
        return 'Speedline';
      default:
        return category;
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Iniciante';
      case 'amateur':
        return 'Amador';
      case 'professional':
        return 'Profissional';
      case 'female':
        return 'Feminino';
      default:
        return level;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Atleta</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do atleta" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modalidade</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma modalidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="trickline">Trickline</SelectItem>
                    <SelectItem value="speedline">Speedline</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Modalidade em que o atleta vai competir
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um nível" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Iniciante</SelectItem>
                    <SelectItem value="amateur">Amador</SelectItem>
                    <SelectItem value="professional">Profissional</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Nível de experiência do atleta
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografia</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Uma breve descrição sobre o atleta" 
                  className="resize-none h-24" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Adicionando..." : "Adicionar Atleta"}
        </Button>
      </form>
    </Form>
  );
};

export default AthleteForm;
