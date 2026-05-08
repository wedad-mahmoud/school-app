import React, { useState } from 'react';
import { useSchoolStore, Student } from '@/store/useSchoolStore';
import { Plus, Search, Edit2, Trash2, Phone, GraduationCap, Languages, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';

export const Students = () => {
  const { students, classes, sections, languages, religions, addStudent, updateStudent, deleteStudent } = useSchoolStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    classes.find(c => c.id === s.classId)?.name.includes(search) ||
    s.section.includes(search)
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const classId = formData.get('classId') as string;
    const selectedClass = classes.find(c => c.id === classId);

    const data = {
      name: formData.get('name') as string,
      classId,
      section: formData.get('section') as string,
      language: formData.get('language') as string,
      religion: formData.get('religion') as string,
      phone: formData.get('phone') as string,
      totalFee: Number(formData.get('totalFee')) || selectedClass?.fee || 0,
    };

    if (editingStudent) {
      updateStudent(editingStudent.id, data);
      showSuccess('تم تحديث بيانات الطالب بنجاح');
    } else {
      addStudent(data);
      showSuccess('تم إضافة الطالب بنجاح');
    }
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">إدارة الطلاب</h1>
          <p className="text-slate-500">إضافة وتعديل بيانات الطلاب والبحث عنهم</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={(val) => { setIsModalOpen(val); if(!val) setEditingStudent(null); }}>
          <DialogTrigger asChild>
            <Button className="bg-[#eab308] hover:bg-[#d4a007] text-[#1e293b] font-bold h-12 px-6 rounded-xl gap-2">
              <Plus size={20} />
              إضافة طالب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">{editingStudent ? 'تعديل بيانات طالب' : 'إضافة طالب جديد'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">الاسم الكامل</label>
                <Input name="name" defaultValue={editingStudent?.name} required placeholder="أدخل اسم الطالب" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">الصف</label>
                  <Select name="classId" defaultValue={editingStudent?.classId} required>
                    <SelectTrigger><SelectValue placeholder="اختر الصف" /></SelectTrigger>
                    <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الشعبة</label>
                  <Select name="section" defaultValue={editingStudent?.section} required>
                    <SelectTrigger><SelectValue placeholder="اختر الشعبة" /></SelectTrigger>
                    <SelectContent>{sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">اللغة الإضافية</label>
                  <Select name="language" defaultValue={editingStudent?.language} required>
                    <SelectTrigger><SelectValue placeholder="اختر اللغة" /></SelectTrigger>
                    <SelectContent>{languages.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الديانة</label>
                  <Select name="religion" defaultValue={editingStudent?.religion} required>
                    <SelectTrigger><SelectValue placeholder="اختر الديانة" /></SelectTrigger>
                    <SelectContent>{religions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">رقم الهاتف</label>
                  <Input name="phone" defaultValue={editingStudent?.phone} required placeholder="05xxxxxxxx" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الرسوم السنوية</label>
                  <Input name="totalFee" type="number" defaultValue={editingStudent?.totalFee} placeholder="اتركه فارغاً لاستخدام رسوم الصف" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#1e293b] text-white h-12 rounded-xl mt-4">
                {editingStudent ? 'حفظ التعديلات' : 'إضافة الطالب'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <Input 
          placeholder="ابحث بالاسم، الصف، أو الشعبة..." 
          className="pr-12 h-12 bg-white border-none shadow-sm rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-600">الطالب</th>
              <th className="px-6 py-4 font-bold text-slate-600">الصف/الشعبة</th>
              <th className="px-6 py-4 font-bold text-slate-600">اللغة/الديانة</th>
              <th className="px-6 py-4 font-bold text-slate-600">المتبقي</th>
              <th className="px-6 py-4 font-bold text-slate-600">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredStudents.map(student => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{student.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Phone size={12} /> {student.phone}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">{classes.find(c => c.id === student.classId)?.name}</div>
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
                    <Button variant="ghost" size="icon" onClick={() => { setEditingStudent(student); setIsModalOpen(true); }}>
                      <Edit2 size={18} className="text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { if(confirm('هل أنت متأكد؟')) deleteStudent(student.id); }}>
                      <Trash2 size={18} className="text-rose-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredStudents.map(student => (
          <Card key={student.id} className="p-4 border-none shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{student.name}</h3>
                <p className="text-sm text-slate-500">{classes.find(c => c.id === student.classId)?.name} - شعبة {student.section}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditingStudent(student); setIsModalOpen(true); }}>
                  <Edit2 size={18} className="text-blue-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { if(confirm('هل أنت متأكد؟')) deleteStudent(student.id); }}>
                  <Trash2 size={18} className="text-rose-500" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-slate-500 block text-xs">اللغة</span>
                <span className="font-medium">{student.language}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-slate-500 block text-xs">الديانة</span>
                <span className="font-medium">{student.religion}</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-slate-500">المتبقي:</span>
              <span className="font-bold text-rose-600">{(student.totalFee - student.paidAmount).toLocaleString()} ر.س</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Students;