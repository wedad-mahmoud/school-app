import React, { useState } from 'react';
import { useSchoolStore, Student } from '@/store/useSchoolStore';
import { Plus, Search, Edit2, Trash2, Phone, Languages, Heart, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Students = () => {
  const { students, classes, sections, languages, religions, addStudent, updateStudent, deleteStudent } = useSchoolStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State to fix Select issues with native FormData
  const [formState, setFormState] = useState({
    classId: '',
    section: '',
    language: '',
    religion: ''
  });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    classes.find(c => c.id === s.classId)?.name.includes(search) ||
    s.section.includes(search)
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const classId = formState.classId || editingStudent?.classId;
    const section = formState.section || editingStudent?.section;
    const language = formState.language || editingStudent?.language;
    const religion = formState.religion || editingStudent?.religion;
    
    if (!name || !classId || !section) {
      showError('يرجى إكمال البيانات الأساسية');
      return;
    }

    const selectedClass = classes.find(c => c.id === classId);
    const totalFeeInput = formData.get('totalFee') as string;
    const totalFee = totalFeeInput ? Number(totalFeeInput) : (selectedClass?.fee || 0);

    const data = { name, classId, section, language, religion, phone, totalFee };

    try {
      if (editingStudent) {
        updateStudent(editingStudent.id, data);
        showSuccess('تم تحديث بيانات الطالب');
      } else {
        addStudent(data);
        showSuccess('تم إضافة الطالب بنجاح');
      }
      setIsModalOpen(false);
      setEditingStudent(null);
      setFormState({ classId: '', section: '', language: '', religion: '' });
    } catch (err) {
      showError('حدث خطأ أثناء حفظ البيانات');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">إدارة الطلاب</h1>
          <p className="text-slate-500">إضافة وتعديل بيانات الطلاب والبحث عنهم</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={(val) => { setIsModalOpen(val); if(!val) setEditingStudent(null); }}>
          <DialogTrigger asChild>
            <Button className="bg-[#eab308] hover:bg-[#d4a007] text-[#1e293b] font-bold h-12 px-6 rounded-xl gap-2 shadow-lg shadow-yellow-500/20 transition-all hover:scale-105">
              <UserPlus size={20} />
              إضافة طالب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-3xl" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right text-xl font-bold">
                {editingStudent ? 'تعديل بيانات طالب' : 'إضافة طالب جديد'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">الاسم الكامل</label>
                <Input name="name" defaultValue={editingStudent?.name} required className="rounded-xl h-11" placeholder="أدخل اسم الطالب" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">الصف</label>
                  <Select 
                    onValueChange={(v) => setFormState(s => ({...s, classId: v}))} 
                    defaultValue={editingStudent?.classId}
                  >
                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="اختر الصف" /></SelectTrigger>
                    <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الشعبة</label>
                  <Select 
                    onValueChange={(v) => setFormState(s => ({...s, section: v}))} 
                    defaultValue={editingStudent?.section}
                  >
                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="اختر الشعبة" /></SelectTrigger>
                    <SelectContent>{sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">اللغة الإضافية</label>
                  <Select 
                    onValueChange={(v) => setFormState(s => ({...s, language: v}))} 
                    defaultValue={editingStudent?.language}
                  >
                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="اختر اللغة" /></SelectTrigger>
                    <SelectContent>{languages.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الديانة</label>
                  <Select 
                    onValueChange={(v) => setFormState(s => ({...s, religion: v}))} 
                    defaultValue={editingStudent?.religion}
                  >
                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="اختر الديانة" /></SelectTrigger>
                    <SelectContent>{religions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">رقم الهاتف</label>
                  <Input name="phone" defaultValue={editingStudent?.phone} required className="rounded-xl h-11" placeholder="05xxxxxxxx" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الرسوم السنوية</label>
                  <Input name="totalFee" type="number" defaultValue={editingStudent?.totalFee} className="rounded-xl h-11" placeholder="رسوم الصف تلقائياً" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#1e293b] hover:bg-slate-800 text-white h-12 rounded-xl mt-4 font-bold text-lg">
                {editingStudent ? 'حفظ التعديلات' : 'إضافة الطالب'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative group">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#eab308] transition-colors" size={20} />
        <Input 
          placeholder="ابحث بالاسم، الصف، أو الشعبة..." 
          className="pr-12 h-14 bg-white border-none shadow-sm rounded-2xl focus-visible:ring-2 focus-visible:ring-[#eab308]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100">
        <table className="w-full text-right">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-5 font-bold text-slate-600">الطالب</th>
              <th className="px-6 py-5 font-bold text-slate-600">الصف/الشعبة</th>
              <th className="px-6 py-5 font-bold text-slate-600">اللغة/الديانة</th>
              <th className="px-6 py-5 font-bold text-slate-600">المتبقي</th>
              <th className="px-6 py-5 font-bold text-slate-600">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout">
              {filteredStudents.map((student, idx) => (
                <motion.tr 
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 group-hover:text-[#1e293b]">{student.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Phone size={12} /> {student.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{classes.find(c => c.id === student.classId)?.name}</div>
                    <div className="text-xs text-slate-500">شعبة: {student.section}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm flex items-center gap-1"><Languages size={14} className="text-blue-500" /> {student.language}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1"><Heart size={14} className="text-rose-500" /> {student.religion}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold",
                      (student.totalFee - student.paidAmount) > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                    )}>
                      {(student.totalFee - student.paidAmount).toLocaleString()} ر.س
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="hover:bg-blue-50 rounded-xl" onClick={() => { setEditingStudent(student); setIsModalOpen(true); }}>
                        <Edit2 size={18} className="text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-rose-50 rounded-xl" onClick={() => { if(confirm('هل أنت متأكد؟')) deleteStudent(student.id); }}>
                        <Trash2 size={18} className="text-rose-500" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredStudents.map((student, idx) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="p-5 border-none shadow-md space-y-4 rounded-3xl overflow-hidden relative">
              <div className={cn("absolute top-0 right-0 w-1.5 h-full", (student.totalFee - student.paidAmount) > 0 ? "bg-rose-500" : "bg-emerald-500")} />
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl text-slate-900">{student.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{classes.find(c => c.id === student.classId)?.name} - شعبة {student.section}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="bg-slate-50 rounded-xl" onClick={() => { setEditingStudent(student); setIsModalOpen(true); }}>
                    <Edit2 size={18} className="text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="bg-slate-50 rounded-xl" onClick={() => { if(confirm('هل أنت متأكد؟')) deleteStudent(student.id); }}>
                    <Trash2 size={18} className="text-rose-500" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">اللغة</span>
                  <span className="font-bold text-slate-700">{student.language}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">الديانة</span>
                  <span className="font-bold text-slate-700">{student.religion}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-sm text-slate-500 font-medium">المتبقي للدفع:</span>
                <span className={cn("font-black text-lg", (student.totalFee - student.paidAmount) > 0 ? "text-rose-600" : "text-emerald-600")}>
                  {(student.totalFee - student.paidAmount).toLocaleString()} ر.س
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Students;