import React, { useState, useEffect } from 'react';
import { Search, FileText, X } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const CommandBar = () => {
  const { searchQuery, setSearchQuery, students } = useDashboardStore();
  const [showResult, setShowResult] = useState(false);

  const filteredStudent = students.find(s => s.name.includes(searchQuery));

  useEffect(() => {
    setShowResult(searchQuery.length > 0 && !!filteredStudent);
  }, [searchQuery, filteredStudent]);

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8 z-50">
      <div className="relative group">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
        <input
          type="text"
          placeholder="ابحث عن طالب (مثلاً: أحمد)..."
          className="w-full pr-12 pl-4 py-4 bg-white dark:bg-slate-900 border-2 border-transparent focus:border-primary rounded-2xl shadow-xl outline-none transition-all text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showResult && filteredStudent && (
        <Card className="absolute top-full mt-4 w-full p-6 shadow-2xl border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300 bg-white/95 backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">{filteredStudent.name}</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">الحالة المالية: <span className="font-semibold text-foreground">{filteredStudent.financialStatus}</span></p>
                <p className="text-sm text-muted-foreground">الدرجات الأكاديمية: <span className="font-semibold text-foreground">{filteredStudent.grades}</span></p>
              </div>
            </div>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <FileText size={18} />
              تصدير PDF
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};