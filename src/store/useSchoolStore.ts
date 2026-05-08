import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Student {
  id: string;
  name: string;
  classId: string;
  section: string;
  language: string;
  religion: string;
  phone: string;
  totalFee: number;
  paidAmount: number;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  phone: string;
  sections: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  fee: number;
}

interface SchoolState {
  students: Student[];
  payments: Payment[];
  teachers: Teacher[];
  classes: SchoolClass[];
  sections: string[];
  languages: string[];
  religions: string[];
  
  // Actions
  addStudent: (student: Omit<Student, 'id' | 'paidAmount'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  addPayment: (payment: Omit<Payment, 'id'>) => boolean;
  
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, data: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  
  addClass: (cls: Omit<SchoolClass, 'id'>) => void;
  updateClass: (id: string, data: Partial<SchoolClass>, updateStudents: boolean) => void;
  deleteClass: (id: string) => void;
  
  addSettingItem: (type: 'sections' | 'languages' | 'religions', item: string) => void;
  deleteSettingItem: (type: 'sections' | 'languages' | 'religions', item: string) => void;
}

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set, get) => ({
      students: [],
      payments: [],
      teachers: [],
      classes: [
        { id: '1', name: 'الصف الأول', fee: 5000 },
        { id: '2', name: 'الصف الثاني', fee: 5500 }
      ],
      sections: ['أ', 'ب', 'ج'],
      languages: ['فرنسي', 'إنجليزي', 'ألماني'],
      religions: ['مسلم', 'مسيحي'],

      addStudent: (data) => set((state) => ({
        students: [...state.students, { ...data, id: crypto.randomUUID(), paidAmount: 0 }]
      })),

      updateStudent: (id, data) => set((state) => ({
        students: state.students.map(s => s.id === id ? { ...s, ...data } : s)
      })),

      deleteStudent: (id) => set((state) => ({
        students: state.students.filter(s => s.id !== id),
        payments: state.payments.filter(p => p.studentId !== id)
      })),

      addPayment: (data) => {
        const student = get().students.find(s => s.id === data.studentId);
        if (!student) return false;
        
        const remaining = student.totalFee - student.paidAmount;
        if (data.amount > remaining) return false;

        set((state) => ({
          payments: [...state.payments, { ...data, id: crypto.randomUUID() }],
          students: state.students.map(s => 
            s.id === data.studentId ? { ...s, paidAmount: s.paidAmount + data.amount } : s
          )
        }));
        return true;
      },

      addTeacher: (data) => set((state) => ({
        teachers: [...state.teachers, { ...data, id: crypto.randomUUID() }]
      })),

      updateTeacher: (id, data) => set((state) => ({
        teachers: state.teachers.map(t => t.id === id ? { ...t, ...data } : t)
      })),

      deleteTeacher: (id) => set((state) => ({
        teachers: state.teachers.filter(t => t.id !== id)
      })),

      addClass: (data) => set((state) => ({
        classes: [...state.classes, { ...data, id: crypto.randomUUID() }]
      })),

      updateClass: (id, data, updateStudents) => set((state) => {
        const newClasses = state.classes.map(c => c.id === id ? { ...c, ...data } : c);
        let newStudents = state.students;
        if (updateStudents && data.fee !== undefined) {
          newStudents = state.students.map(s => s.classId === id ? { ...s, totalFee: data.fee! } : s);
        }
        return { classes: newClasses, students: newStudents };
      }),

      deleteClass: (id) => set((state) => ({
        classes: state.classes.filter(c => c.id !== id)
      })),

      addSettingItem: (type, item) => set((state) => ({
        [type]: [...state[type], item]
      })),

      deleteSettingItem: (type, item) => set((state) => ({
        [type]: state[type].filter(i => i !== item)
      })),
    }),
    { name: 'school-system-storage' }
  )
);