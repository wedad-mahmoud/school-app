import React, { useState } from 'react';
import { useSchoolStore, Teacher } from '@/store/useSchoolStore';
import { Plus, Search, Edit2, Trash2, Phone, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { showSuccess } from '@/utils/toast';

export const Teachers = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useSchoolStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      subject: formData.get('subject') as string,
      phone: formData.get('phone') as string,
      sections: formData.get('sections') as string,
    };

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, data);
      showSuccess('تم تحديث بيانات المدرس');
    } else {
      addTeacher(data);
      showSuccess('تم إضافة المدرس بنجاح');
    }
    setIsModalOpen(false);
    setEditingTeacher(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">إدارة المدرسين</h1>
          <p className="text-slate-500">إدارة الكادر التعليمي وتوزيع الحصص</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={(val) => { setIsModalOpen(val); if(!val) setEditingTeacher(null); }}>
          <DialogTrigger asChild>
            <Button className="bg-[#eab308] hover:bg-[#d4a007] text-[#1e293b] font-bold h-12 px-6 rounded-xl gap-2">
              <Plus size={20} />
              إضافة مدرس جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">{editingTeacher ? 'تعديل بيانات مدرس' : 'إضافة مدرس جديد'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">الاسم الكامل</label>
                <Input name="name" defaultValue={editingTeacher?.name} required placeholder="اسم المدرس" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">المادة الدراسية</label>
                <Input name="subject" defaultValue={editingTeacher?.subject} required placeholder="مثلاً: رياضيات" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">رقم الهاتف</label>
                <Input name="phone" defaultValue={editingTeacher?.phone} required placeholder="05xxxxxxxx" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">الشعب المسندة</label>
                <Input name="sections" defaultValue={editingTeacher?.sections} placeholder="مثلاً: أ، ب، ج" />
              </div>
              <Button type="submit" className="w-full bg-[#1e293b] text-white h-12 rounded-xl mt-4">
                {editingTeacher ? 'حفظ التعديلات' : 'إضافة المدرس'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <Input 
          placeholder="ابحث باسم المدرس أو المادة..." 
          className="pr-12 h-12 bg-white border-none shadow-sm rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map(teacher => (
          <Card key={teacher.id} className="p-6 border-none shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center group-hover:bg-[#eab308] group-hover:text-[#1e293b] transition-colors">
                <BookOpen size={24} />
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditingTeacher(teacher); setIsModalOpen(true); }}>
                  <Edit2 size={18} className="text-blue-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { if(confirm('هل أنت متأكد؟')) deleteTeacher(teacher.id); }}>
                  <Trash2 size={18} className="text-rose-500" />
                </Button>
              </div>
            </div>
            <h3 className="font-bold text-lg text-slate-900">{teacher.name}</h3>
            <p className="text-sm text-blue-600 font-medium mb-4">{teacher.subject}</p>
            <div className="space-y-2 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Phone size={14} />
                {teacher.phone}
              </div>
              <div className="text-xs text-slate-400">
                الشعب: {teacher.sections || 'غير محدد'}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Teachers;