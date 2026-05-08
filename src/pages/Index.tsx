import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { CommandBar } from '@/components/dashboard/CommandBar';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { TeacherMap } from '@/components/dashboard/TeacherMap';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col lg:flex-row" dir="rtl">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        <header className="mb-12 text-center lg:text-right">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
            لوحة القيادة الذكية
          </h1>
          <p className="text-muted-foreground text-lg">
            مرحباً بك مجدداً، إليك ملخص أداء النظام اليوم.
          </p>
        </header>

        <CommandBar />
        
        <section className="space-y-12">
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-primary rounded-full" />
              المؤشرات المالية والطلابية
            </h2>
            <StatsCards />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-primary rounded-full" />
              إدارة الموارد البشرية
            </h2>
            <TeacherMap />
          </div>
        </section>

        <footer className="mt-20 opacity-50">
          <MadeWithDyad />
        </footer>
      </main>
    </div>
  );
};

export default Index;