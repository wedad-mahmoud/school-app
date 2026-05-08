import React from 'react';
import { useSchoolStore } from '@/store/useSchoolStore';
import { Users, Wallet, TrendingDown, UserSquare2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const Dashboard = () => {
  const { students, payments, teachers, classes } = useSchoolStore();

  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalFees = students.reduce((acc, s) => acc + s.totalFee, 0);
  const remainingDebt = totalFees - totalRevenue;

  const stats = [
    { title: 'إجمالي الطلاب', value: students.length, icon: Users, color: 'bg-blue-500' },
    { title: 'إجمالي المحصل', value: `${totalRevenue.toLocaleString()} ر.س`, icon: Wallet, color: 'bg-emerald-500' },
    { title: 'الديون المتبقية', value: `${remainingDebt.toLocaleString()} ر.س`, icon: TrendingDown, color: 'bg-rose-500' },
    { title: 'إجمالي المدرسين', value: teachers.length, icon: UserSquare2, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">لوحة القيادة</h1>
        <p className="text-slate-500 mt-1">ملخص أداء النظام والمؤشرات المالية</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group">
            <div className={cn("absolute top-0 right-0 w-1.5 h-full", stat.color)} />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
              <div className={cn("p-3 rounded-2xl bg-slate-50 text-slate-600 group-hover:scale-110 transition-transform")}>
                <stat.icon size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 border-none shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="text-amber-500" size={20} />
            تنبيهات إشغال القاعات
          </h3>
          <div className="space-y-4">
            {classes.map(cls => {
              const count = students.filter(s => s.classId === cls.id).length;
              const percentage = Math.min((count / 30) * 100, 100);
              return (
                <div key={cls.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{cls.name}</span>
                    <span className={cn(percentage > 80 ? "text-rose-500 font-bold" : "text-slate-500")}>
                      {count} / 30 طالب
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-500", percentage > 80 ? "bg-rose-500" : "bg-blue-500")}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';
export default Dashboard;