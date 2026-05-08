import React, { useState } from 'react';
import { useSchoolStore } from '@/store/useSchoolStore';
import { CreditCard, History, User, Wallet, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';

export const Payments = () => {
  const { students, payments, addPayment } = useSchoolStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const studentPayments = payments.filter(p => p.studentId === selectedStudentId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const remaining = selectedStudent ? selectedStudent.totalFee - selectedStudent.paidAmount : 0;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !amount) return;

    const success = addPayment({
      studentId: selectedStudentId,
      amount: Number(amount),
      date: new Date().toISOString(),
    });

    if (success) {
      showSuccess('تم تسجيل الدفعة بنجاح');
      setAmount('');
    } else {
      showError('المبلغ يتجاوز الرصيد المتبقي!');
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">المدفوعات والرسوم</h1>
        <p className="text-slate-500">تسجيل دفعات الطلاب ومتابعة السجل المالي</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <Card className="lg:col-span-1 p-6 border-none shadow-sm h-fit">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <CreditCard className="text-[#eab308]" />
            تسجيل دفعة جديدة
          </h3>
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">اختر الطالب</label>
              <Select onValueChange={setSelectedStudentId} value={selectedStudentId}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="ابحث عن طالب..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedStudent && (
              <div className="bg-slate-50 p-4 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">إجمالي الرسوم:</span>
                  <span className="font-bold">{selectedStudent.totalFee.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">المسدد:</span>
                  <span className="font-bold text-emerald-600">{selectedStudent.paidAmount.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                  <span className="text-slate-500">المتبقي:</span>
                  <span className="font-bold text-rose-600">{remaining.toLocaleString()} ر.س</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">المبلغ المراد دفعه</label>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00" 
                className="h-12 rounded-xl"
                disabled={!selectedStudentId || remaining === 0}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#1e293b] text-white h-12 rounded-xl font-bold"
              disabled={!selectedStudentId || !amount || remaining === 0}
            >
              تأكيد الدفع
            </Button>
          </form>
        </Card>

        {/* Payment History */}
        <Card className="lg:col-span-2 p-6 border-none shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <History className="text-blue-500" />
            سجل المدفوعات
          </h3>
          
          {!selectedStudentId ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <User size={48} className="mb-4 opacity-20" />
              <p>يرجى اختيار طالب لعرض سجل مدفوعاته</p>
            </div>
          ) : studentPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Wallet size={48} className="mb-4 opacity-20" />
              <p>لا توجد مدفوعات مسجلة لهذا الطالب</p>
            </div>
          ) : (
            <div className="space-y-4">
              {studentPayments.map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{payment.amount.toLocaleString()} ر.س</div>
                      <div className="text-xs text-slate-500">{new Date(payment.date).toLocaleDateString('ar-SA')}</div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    عملية ناجحة
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Payments;