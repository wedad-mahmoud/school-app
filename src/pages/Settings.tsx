import React, { useState } from 'react';
import { useSchoolStore } from '@/store/useSchoolStore';
import { Settings as SettingsIcon, Plus, Trash2, GraduationCap, Layers, Languages, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { showSuccess } from '@/utils/toast';

export const Settings = () => {
  const { 
    classes, addClass, updateClass, deleteClass,
    sections, languages, religions, addSettingItem, deleteSettingItem 
  } = useSchoolStore();

  const [newClass, setNewClass] = useState({ name: '', fee: '' });
  const [newItem, setNewItem] = useState({ type: 'sections' as any, value: '' });

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.name || !newClass.fee) return;
    addClass({ name: newClass.name, fee: Number(newClass.fee) });
    setNewClass({ name: '', fee: '' });
    showSuccess('تم إضافة الصف بنجاح');
  };

  const handleUpdateClassFee = (id: string, currentFee: number) => {
    const newFee = prompt('أدخل الرسوم الجديدة:', currentFee.toString());
    if (newFee && !isNaN(Number(newFee))) {
      const updateAll = confirm('هل تريد تحديث الرسوم لجميع الطلاب المسجلين في هذا الصف أيضاً؟');
      updateClass(id, { fee: Number(newFee) }, updateAll);
      showSuccess('تم تحديث الرسوم بنجاح');
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">الإعدادات</h1>
        <p className="text-slate-500">إدارة الصفوف، الشعب، والخيارات العامة للنظام</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Classes Management */}
        <Card className="p-6 border-none shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <GraduationCap className="text-blue-500" />
            إدارة الصفوف والرسوم
          </h3>
          <form onSubmit={handleAddClass} className="flex gap-2 mb-6">
            <Input 
              placeholder="اسم الصف" 
              value={newClass.name} 
              onChange={e => setNewClass({...newClass, name: e.target.value})}
              className="rounded-xl"
            />
            <Input 
              type="number" 
              placeholder="الرسوم" 
              value={newClass.fee} 
              onChange={e => setNewClass({...newClass, fee: e.target.value})}
              className="w-32 rounded-xl"
            />
            <Button type="submit" className="bg-[#1e293b] text-white rounded-xl">
              <Plus size={20} />
            </Button>
          </form>
          <div className="space-y-2">
            {classes.map(cls => (
              <div key={cls.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold">{cls.name}</div>
                  <div className="text-xs text-slate-500">{cls.fee.toLocaleString()} ر.س</div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleUpdateClassFee(cls.id, cls.fee)} className="text-blue-500 text-xs">تعديل الرسوم</Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteClass(cls.id)} className="text-rose-500"><Trash2 size={16} /></Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* General Settings */}
        <div className="space-y-8">
          {[
            { title: 'الشعب الدراسية', type: 'sections', icon: Layers, items: sections, color: 'text-amber-500' },
            { title: 'اللغات الإضافية', type: 'languages', icon: Languages, items: languages, color: 'text-emerald-500' },
            { title: 'الديانات', type: 'religions', icon: Heart, items: religions, color: 'text-rose-500' },
          ].map(setting => (
            <Card key={setting.type} className="p-6 border-none shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <setting.icon className={setting.color} size={20} />
                {setting.title}
              </h3>
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder={`إضافة ${setting.title}...`} 
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value;
                      if (val) {
                        addSettingItem(setting.type as any, val);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                  className="rounded-xl"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {setting.items.map(item => (
                  <div key={item} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full text-sm font-medium">
                    {item}
                    <button onClick={() => deleteSettingItem(setting.type as any, item)} className="text-slate-400 hover:text-rose-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;