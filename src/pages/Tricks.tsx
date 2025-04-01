
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import TrickList from '@/components/Trick/TrickList';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tricks = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Voltar</span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Manobras</h1>
        <p className="text-muted-foreground">
          Visualize todas as manobras disponíveis para campeonatos
        </p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <TrickList />
      </div>
    </MainLayout>
  );
};

export default Tricks;
