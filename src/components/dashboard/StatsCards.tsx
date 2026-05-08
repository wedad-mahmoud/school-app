import React from 'react';
import { Wallet, Users, TrendingDown, DoorOpen, AlertTriangle } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';

export const StatsCards = () => {
  const { totalRevenue, remainingDebt, newStudents, roomOccupancy } = useDashboardStore();

  const cards = [
    {
      title: 'إجمالي المحصل المالي',
      value: `${totalRevenue.toLocaleString()} ر.س`,
      icon: Wallet,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      lightColor: 'bg-emerald-50'
    },
    {
      title: 'إجمالي الديون المتبقية',
      value: `${remainingDebt.toLocaleString()} ر.س`,
      icon: TrendingDown,
      color: 'bg-rose-500',
      textColor: 'text-rose-600',
      lightColor: 'bg-rose-50'
    },
    {
      title: 'الطلاب الجدد',
      value: newStudents,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      lightColor: 'bg-blue-50'
    },
    {
      title: 'إشغال القاعات',
      value: `%${roomOccupancy}`,
      icon: DoorOpen,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      lightColor: 'bg-amber-50',
      alert: roomOccupancy > 80 ? 'ازدحام مرتفع!' : null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className={`absolute top-0 right-0 w-2 h-full ${card.color}`} />
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${card.lightColor} ${card.textColor}`}>
              <card.icon size={24} />
            </div>
            {card.alert && (
              <span className="flex items-center gap-1 text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-1 rounded-full animate-pulse">
                <AlertTriangle size={12} />
                {card.alert}
              </span>
            )}
          </div>
          <h4 className="text-muted-foreground text-sm font-medium mb-1">{card.title}</h4>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{card.value}</p>
        </div>
      ))}
    </div>
  );
};