import React, { useState } from 'react';
import {
  Store,
  ShieldCheck,
  Users,
  UserCheck,
  CheckCircle,
  Database,
  Cloud,
  FileCheck2,
  LogOut,
  RefreshCw,
  Plus,
  Shield,
  Edit3,
} from 'lucide-react';
import { StaffMember, AuditLogItem } from '../../types';

interface SettingsTabProps {
  staff: StaffMember[];
  auditLogs: AuditLogItem[];
  currentUserRole: string;
  onChangeRole: (role: string) => void;
  onLogout: () => void;
  onAddNewStaff: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  staff,
  auditLogs,
  currentUserRole,
  onChangeRole,
  onLogout,
  onAddNewStaff,
}) => {
  const [logFilter, setLogFilter] = useState<'all' | 'orders' | 'financials' | 'inventory'>('all');
  const [backupStatus, setBackupStatus] = useState<string>('اليوم 03:00 ص - ناجحة ومكتملة');
  const [isBackingUp, setIsBackingUp] = useState(false);

  const filteredLogs = auditLogs.filter((log) => {
    if (logFilter === 'all') return true;
    return log.category === logFilter;
  });

  const handleInstantBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setBackupStatus(`الآن (${new Date().toLocaleTimeString('ar-SA')}) - تم بنجاح`);
      setIsBackingUp(false);
    }, 1200);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Store Profile Card (Matching Screenshot 6) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">مشغل الخياطة الملكية</h3>
                <span className="px-2 py-0.2 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200">
                  مفعل وموثق
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                الفرع الرئيسي • طريق الملك فهد، الرياض
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                <span>معرّف المتجر: RYD-104#</span>
                <span>• حساب المدير العام</span>
              </div>
            </div>
          </div>

          <button
            title="تعديل بيانات المتجر"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Metrics Block */}
        <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-100">
          <div className="bg-slate-50 p-2 rounded-xl">
            <span className="text-base font-black text-slate-900 block tabular-nums">8</span>
            <span className="text-[10px] text-slate-500">طاقم العمل</span>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl">
            <span className="text-base font-black text-emerald-600 block tabular-nums">%99.9</span>
            <span className="text-[10px] text-slate-500">جاهزية النظام</span>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl">
            <span className="text-base font-black text-blue-700 block">آمن</span>
            <span className="text-[10px] text-slate-500">سحابة فاتورة</span>
          </div>
        </div>
      </div>

      {/* Role Switcher Toolbar (Interactive Role-Based Access Control) */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-blue-950 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-600" />
            الدور النشط الحالي (صلاحيات المنظومة):
          </span>
          <span className="font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200 text-[11px]">
            {currentUserRole}
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {(['مدير النظام', 'مدير الفرع', 'محاسب', 'خياط', 'موظف استقبال'] as const).map((r) => (
            <button
              key={r}
              onClick={() => onChangeRole(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                currentUserRole === r
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-slate-900 text-sm">إدارة المستخدمين والموظفين</h4>
          </div>
          <span className="text-[11px] text-slate-400">3 متصلين بالمنظومة</span>
        </div>

        {/* Staff List */}
        <div className="space-y-2.5">
          {staff.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-100"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                  {member.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-bold text-slate-900 text-xs">{member.name}</h5>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{member.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs"></span>
                <UserCheck className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Actions Row */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
          <button
            onClick={onAddNewStaff}
            className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة موظف جديد</span>
          </button>

          <button
            onClick={() => alert('تم تحديث جدول الصلاحيات والأدوار.')}
            className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>تعديل الصلاحيات والأدوار</span>
          </button>
        </div>
      </div>

      {/* System & Audit Log Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-slate-900 text-sm">سجل تدقيق النظام والمخزون</h4>
          </div>
          <span className="text-[10px] text-slate-400">تصفية بالسجل</span>
        </div>

        {/* Audit Filter Tabs */}
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setLogFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              logFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setLogFilter('orders')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              logFilter === 'orders'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الطلبات والمقاسات
          </button>
          <button
            onClick={() => setLogFilter('financials')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              logFilter === 'financials'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            المالية والفواتير
          </button>
          <button
            onClick={() => setLogFilter('inventory')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              logFilter === 'inventory'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            المستودع والأقمشة
          </button>
        </div>

        {/* Timeline Events */}
        <div className="space-y-3 pt-2 relative border-r-2 border-slate-200 pr-4 mr-2">
          {filteredLogs.map((log) => (
            <div key={log.id} className="relative text-xs space-y-1">
              <span className="absolute -right-5.5 top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white"></span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{log.title}</span>
                <span className="text-[10px] text-slate-400">{log.timeAgo}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{log.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cloud Backup Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600" />
          <h4 className="font-bold text-slate-900 text-sm">النسخ الاحتياطي وإدارة النظام</h4>
        </div>

        <div className="flex items-center justify-between p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-xs block">حالة النسخ المتزامن</span>
              <span className="text-[11px] text-slate-600">آخر نسخة: {backupStatus}</span>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleInstantBackup}
            disabled={isBackingUp}
            className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
            <span>نسخ احتياطي فوري</span>
          </button>

          <button
            onClick={() => alert('تم استعادة آخر نسخة متطابقة بنجاح.')}
            className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            <span>استعادة البيانات</span>
          </button>
        </div>
      </div>

      {/* ZATCA Phase 2 Badge (Matching Screenshot 6) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h5 className="font-bold text-slate-900 text-xs">الربط مع هيئة الزكاة (فاتورة)</h5>
              <span className="px-2 py-0.2 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200">
                مرحلة 2 متصل
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              إصدار أختام التشفير الرقمي والباركود الذكي (QR)
            </p>
          </div>
        </div>
        <span className="text-slate-400 text-xs">&rsaquo;</span>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>تسجيل الخروج الآمن من المنظومة</span>
      </button>

      {/* Security Footer */}
      <div className="text-center text-[11px] text-slate-400 space-y-0.5">
        <p className="flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>اتصال مشفر 256 بت • نظام خياطة ملكي الإصدار 3.4.1</span>
        </p>
      </div>
    </div>
  );
};
