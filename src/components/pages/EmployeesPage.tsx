import React, { useState } from 'react';
import {
  Users,
  Shield,
  Plus,
  CheckCircle,
  X,
  Phone,
  Briefcase,
  Scissors,
} from 'lucide-react';
import { StaffMember } from '../../types';

interface EmployeesPageProps {
  staff: StaffMember[];
  onAddStaffMember: (newStaff: StaffMember) => void;
}

export const EmployeesPage: React.FC<EmployeesPageProps> = ({
  staff,
  onAddStaffMember,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'مدير النظام' | 'مدير الفرع' | 'محاسب' | 'خياط' | 'موظف استقبال'>('خياط');
  const [department, setDepartment] = useState('قسم التفصيل والقص');

  const rolePermissionsMap: Record<string, string[]> = {
    'مدير النظام': ['صلاحيات شاملة', 'إدارة المخزون والتوريد', 'التقارير المالية والضريبية', 'تعديل أسعار الأقمشة'],
    'مدير الفرع': ['متابعة أداء المشغل', 'توزيع الطلبات على الخياطين', 'التحقق النهائي قبل التسليم'],
    'محاسب': ['إصدار الفواتير الضريبية ZATCA', 'تسجيل المقبوضات والمصروفات', 'تصدير التقارير المحاسبية'],
    'خياط': ['استلام بطاقات التفصيل', 'تحديث مراحل الإنجاز (القص، الدرز، البروفة)', 'تسجيل صرف أمتار الأقمشة'],
    'موظف استقبال': ['استقبال الزبائن وأخذ المقاسات', 'إنشاء طلبات جديدة', 'تسليم الثياب للعملاء وإرسال الإشعارات'],
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newStaff: StaffMember = {
      id: `st-${Date.now()}`,
      name,
      role,
      department,
      active: true,
      initials: name.trim().charAt(0),
      assignedOrdersCount: role === 'خياط' ? 0 : undefined,
    };

    onAddStaffMember(newStaff);
    setIsAddOpen(false);
    setName('');
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">طاقم العمل والصلاحيات</h2>
          <p className="text-xs text-slate-500">إدارة الخياطين والمحاسبين وتوزيع الأدوار الإدارية</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة موظف</span>
        </button>
      </div>

      {/* Roles Breakdown Box */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <h4 className="font-bold text-slate-900 text-xs">الأدوار المعتمدة في المشغل (RBAC)</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {Object.entries(rolePermissionsMap).map(([r, perms]) => (
            <div key={r} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-blue-900 block">{r}</span>
              <ul className="text-[11px] text-slate-500 space-y-0.5 list-disc list-inside">
                {perms.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Members List */}
      <div className="space-y-2.5">
        <h4 className="font-bold text-slate-900 text-xs">قائمة موظفي المشغل النشطين ({staff.length})</h4>
        {staff.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs flex items-center justify-between hover:border-blue-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-bold text-sm flex items-center justify-center">
                {member.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-slate-900 text-xs">{member.name}</h5>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.2 rounded border border-blue-200">
                    {member.role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{member.department}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {member.assignedOrdersCount !== undefined && (
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Scissors className="w-3 h-3 text-blue-600" />
                  {member.assignedOrdersCount} طلبات
                </span>
              )}
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs"></span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm">إضافة موظف جديد</h3>
              <button onClick={() => setIsAddOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">اسم الموظف</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: يوسف المنصوري"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">المسمى الوظيفي والدور</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl"
                >
                  <option value="مدير النظام">مدير النظام</option>
                  <option value="مدير الفرع">مدير الفرع</option>
                  <option value="محاسب">محاسب</option>
                  <option value="خياط">خياط</option>
                  <option value="موظف استقبال">موظف استقبال</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">القسم أو الوردية</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="مثال: قسم التفصيل والقص"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2 text-xs bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs bg-blue-600 text-white font-bold rounded-xl"
                >
                  حفظ الموظف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
