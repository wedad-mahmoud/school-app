import { create } from 'zustand';

interface Student {
  id: string;
  name: string;
  financialStatus: string;
  grades: string;
}

interface Teacher {
  id: string;
  name: string;
  classesCount: number;
}

interface DashboardState {
  totalRevenue: number;
  remainingDebt: number;
  newStudents: number;
  roomOccupancy: number;
  students: Student[];
  teachers: Teacher[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  totalRevenue: 125400,
  remainingDebt: 15200,
  newStudents: 48,
  roomOccupancy: 85,
  students: [
    { id: '1', name: 'أحمد محمد', financialStatus: 'تم الدفع', grades: 'امتياز' },
    { id: '2', name: 'سارة أحمد', financialStatus: 'متبقي 500', grades: 'جيد جداً' },
    { id: '3', name: 'خالد علي', financialStatus: 'متأخر', grades: 'مقبول' },
  ],
  teachers: [
    { id: '1', name: 'د. محمد إبراهيم', classesCount: 4 },
    { id: '2', name: 'أ. ليلى حسن', classesCount: 9 },
    { id: '3', name: 'د. ياسر محمود', classesCount: 6 },
    { id: '4', name: 'أ. نورة علي', classesCount: 12 },
  ],
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));