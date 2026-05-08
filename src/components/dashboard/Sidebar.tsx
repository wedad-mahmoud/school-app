import React from 'react';
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const NavItems = () => (
  <nav className="space-y-2 mt-8">
    {[
      { icon: LayoutDashboard, label: 'الرئيسية', active: true },
      { icon: Users, label: 'الطلاب' },
      { icon: BookOpen, label: 'المدرسين' },
      { icon: Settings, label: 'الإعدادات' },
    ].map((item, i) => (
      <a
        key={i}
        href="#"
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
          item.active 
            ? 'bg-primary text-white shadow-lg shadow-primary/20' 
            : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <item.icon size={20} />
        <span className="font-medium">{item.label}</span>
      </a>
    ))}
  </nav>
);

export const Sidebar = () => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
          <h1 className="text-xl font-black tracking-tight">نظام سمارت</h1>
        </div>
        <NavItems />
        <div className="mt-auto">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
            <LogOut size={20} />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Drawer */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <span className="font-bold">سمارت</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold">القائمة</h2>
            </div>
            <NavItems />
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
};