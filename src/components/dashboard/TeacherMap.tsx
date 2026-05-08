import React from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { Progress } from '@/components/ui/progress';
import { UserCheck, AlertCircle } from 'lucide-react';

export const TeacherMap = () => {
  const { teachers } = useDashboardStore();

  const getPressureColor = (count: number) => {
    if (count > 10) return 'text-rose-600 bg-rose-50 border-rose-100';
    if (count > 7) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-emerald-600 bg-emerald-50 border-emerald-100';
  };

  const getProgressColor = (count: number) => {
    if (count > 10) return 'bg-rose-500';
    if (count > 7) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <UserCheck className="text-primary" />
          مؤشر الضغط التعليمي للمدرسين
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="space-y-3 p-4 rounded-2xl border border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 transition-colors">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700 dark:text-slate-200">{teacher.name}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getPressureColor(teacher.classesCount)}`}>
                {teacher.classesCount} حصة / أسبوع
              </span>
            </div>
            <div className="relative pt-1">
              <Progress 
                value={(teacher.classesCount / 15) * 100} 
                className="h-2 bg-slate-100"
                indicatorClassName={getProgressColor(teacher.classesCount)}
              />
            </div>
            {teacher.classesCount > 10 && (
              <p className="text-[11px] text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle size={12} />
                تنبيه: حمل تعليمي زائد
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};