import React from 'react';
import { useSchoolStore } from '@/store/useSchoolStore';
import { Users, Wallet, TrendingDown, UserSquare2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Dashboard = () => {
  const { students, payments, teachers, classes } = useSchoolStore();

  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalFees = students.reduce((acc, s) => acc + s.totalFee, 0);
  const remainingDebt = totalFees - totalRevenue;

  const stats = [
    { title: 'إجمالي الطلاب', value: students.length, icon: Users, color: 'bg-blue-500', textColor: 'text-blue-600' },
    { title: 'إجمالي المحصل', value: `${totalRevenue.toLocaleString()} ر.س`, icon: Wallet, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
    { title: 'الديون المتبقية', value: `${remainingDebt.toLocaleString()} ر.س`, icon: TrendingDown, color: 'bg-rose-500', textColor: 'text-rose-600' },
    { title: 'إجمالي المدرسين', value: teachers.length, icon: UserSquare2, color: 'bg-amber-500', textColor: 'text-amber-600' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">لوحة القيادة</h1>
          <p className="text-slate-500 mt-2 text-lg">نظرة عامة على الأداء المالي والأكاديمي</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <span className="font-bold text-slate-700">النظام متصل ومحدث</span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-7 border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative group rounded-[2rem] bg-white">
              <div className={cn("absolute top-0 right-0 w-2 h-full opacity-80", stat.color)} />
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                </div>
                <div className={cn("p-4 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform duration-500", stat.textColor)}>
                  <stat.icon size={28} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-full">
                <ArrowUpRight size={12} />
                تحديث لحظي
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 border-none shadow-sm rounded-[2.5rem] bg-white">
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
              <AlertCircle size={24} />
            </div>
            توزيع الطلاب وإشغال القاعات
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {classes.map((cls, idx) => {
              const count = students.filter(s => s.classId === cls.id).length;
              const percentage = Math.min((count / 30) * 100, 100);
              return (
                <motion.div 
                  key={cls.id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="space-y-3 p-5 rounded-3xl bg-slate-50/50 border border-slate-100"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">{cls.name}</span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-black",
                      percentage > 80 ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"
                    )}>
                      {count} / 30 طالب
                    </span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn("h-full rounded-full", percentage > 80 ? "bg-rose-500" : "bg-blue-500")}
                    />
                  </div>
                  {percentage > 80 && (
                    <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                      <AlertCircle size={10} /> تنبيه: القاعة تقترب من الحد الأقصى
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </Card>

        <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-[#1e293b] text-white overflow-hidden relative">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#eab308] rounded-full opacity-10 blur-3xl" />
          <h3 className="text-xl font-black mb-6">ملخص سريع</h3>
          <div className="space-y-6 relative z-10">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-slate-400 text-xs mb-1">نسبة التحصيل المالي</p>
              <div className="text-2xl font-black text-[#eab308]">
                {totalFees > 0 ? Math.round((totalRevenue / totalFees) * 100) : 0}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-slate-400 text-xs mb-1">متوسط الطلاب لكل صف</p>
              <div className="text-2xl font-black text-blue-400">
                {classes.length > 0 ? Math.round(students.length / classes.length) : 0}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Dashboard;