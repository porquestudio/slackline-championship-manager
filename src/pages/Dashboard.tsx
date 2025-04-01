
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import QuickActions from '@/components/Dashboard/QuickActions';
import RecentChampionships from '@/components/Dashboard/RecentChampionships';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard = () => {
  const { championships, recentChampionship, loading, refreshData } = useDashboardData();

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao gerenciador de campeonatos de slackline
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-lg bg-gray-100 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardStats
              championships={championships}
              recentChampionship={recentChampionship}
            />
            <QuickActions onDataSeeded={refreshData} />
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Campeonatos Recentes</h2>
              <Link to="/championships">
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </Link>
            </div>

            <RecentChampionships championships={championships} />
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Dashboard;
