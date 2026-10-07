import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Truck,
  UserPlus,
  Receipt,
  CheckCircle2,
  ChevronLeft,
  Check,
  Award,
  Sparkles,
  Zap,
  PackageCheck,
  CheckCircle,
} from 'lucide-react';
import { OrderItem, FabricRoll } from '../../types';
import { FabricThumbnail } from '../common/FabricThumbnail';

interface DashboardTabProps {
  orders: OrderItem[];
  fabrics: FabricRoll[];
  onOpenOrder: (order: OrderItem) => void;
  onOpenNewCustomer: () => void;
  onOpenRecordPayment: () => void;
  onOpenRestock: (fabric?: FabricRoll) => void;
  onQuickRestock?: (fabricId: string, addedMeters: number) => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  orders,
  fabrics,
  onOpenOrder,
  onOpenNewCustomer,
  onOpenRecordPayment,
  onOpenRestock,
  onQuickRestock,
  onNavigateToTab,
}) => {
  const [restockToast, setRestockToast] = useState<string | null>(null);

  // Dynamic calculation of critical fabrics (remaining < 20 meters or marked critical)
  const criticalFabrics = fabrics.filter(
    (f) => f.remainingMeters < 20 || f.stockStatus === 'critical'
  );

  // Handle single item quick restock
  const handleQuickRestockItem = (fabric: FabricRoll, meters = 50) => {
    if (onQuickRestock) {
      onQuickRestock(fabric.id, meters);
      setRestockToast(`تم توريد +${meters}م لطاقة "${fabric.name}" بنجاح! الرصيد الآن: ${(fabric.remainingMeters + meters).toFixed(1)}م`);
      setTimeout(() => setRestockToast(null), 3500);
    } else {
      onOpenRestock(fabric);
    }
  };

  // Handle batch restock of all critical items
  const handleBatchRestock = () => {
    if (criticalFabrics.length === 0) return;
    if (onQuickRestock) {
      criticalFabrics.forEach((f) => onQuickRestock(f.id, 50));
      setRestockToast(`تم توريد +50م لجميع الأصناف الحرجة (${criticalFabrics.length} طاقات) بنجاح!`);
      setTimeout(() => setRestockToast(null), 3500);
    } else {
      onOpenRestock(criticalFabrics[0]);
    }
  };

  // Urgent & ongoing orders for the dashboard view
  const urgentOrders = orders.filter(
    (o) => o.orderNumber === 'ORD-4921#' || o.orderNumber === 'ORD-4918#' || o.priority === 'urgent'
  ).slice(0, 2);

  return (
    <div className="space-y-4 pb-20">
      {/* Restock Success Toast */}
      {restockToast && (
        <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 shrink-0" />
            <span>{restockToast}</span>
          </div>
          <button
            onClick={() => setRestockToast(null)}
            className="text-white/80 hover:text-white p-1"
          >
            &times;
          </button>
        </div>
      )}

      {/* Top Welcome Section */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
          <span>مرحباً، أ. عبد الرحمن</span>
          <span className="text-xl">👋</span>
        </h2>
        <p className="text-xs text-slate-500">مؤشرات الأداء والخياطة الميدانية اليوم.</p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Sales */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">إجمالي المبيعات</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 tabular-nums">48,500</span>
              <span className="text-xs text-slate-500">ر.س</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>+12.5% مقارنة بالأسبوع الماضي</span>
            </div>
          </div>
        </div>

        {/* Net Profits */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">صافي الأرباح</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 tabular-nums">19,200</span>
              <span className="text-xs text-slate-500">ر.س</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-600">
              <span>+8.3% هامش ربح ممتاز</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Low Stock Alert Banner (Smart Alert Feature) */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-slate-900 text-xs">تنبيهات نقص المخزون الذكية</h4>
                {criticalFabrics.length > 0 ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-md border border-rose-200">
                    {criticalFabrics.length} أصناف وصلت للمستوى الحرج
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                    المخزون آمن
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {criticalFabrics.length > 0
                  ? 'بعض الأقمشة الأكثر طلباً وصلت إلى الحد الحرج للتفصيل وبحاجة لإعادة التوريد فوراً.'
                  : 'جميع الأقمشة متوفرة بكميات تلبي أوامر التفصيل الحالية.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('inventory')}
            className="text-xs font-bold text-amber-900 flex items-center gap-0.5 hover:underline shrink-0"
          >
            <span>إدارة</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Critical Fabrics List with Quick Re-supply Buttons */}
        {criticalFabrics.length > 0 ? (
          <div className="space-y-2.5">
            {criticalFabrics.map((fabric) => {
              const thobesRemaining = Math.max(0, Math.floor(fabric.remainingMeters / 3.5));
              const isExtremelyLow = fabric.remainingMeters < 10;

              return (
                <div
                  key={fabric.id}
                  className="p-3 bg-white rounded-xl border border-amber-200/70 shadow-2xs space-y-2 hover:border-amber-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h5 className="font-bold text-slate-900 text-xs">{fabric.name}</h5>
                        {isExtremelyLow && (
                          <span className="px-1.5 py-0.2 bg-rose-50 text-rose-700 text-[9px] font-bold rounded border border-rose-200">
                            حرج جداً
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] flex-wrap mt-0.5">
                        <span className="text-slate-400 font-mono text-[10px]">{fabric.code}</span>
                        <span className="text-rose-600 font-bold">
                          المتبقي: {fabric.remainingMeters} م فقط
                        </span>
                        <span className="text-slate-400">
                          (سعة الرول: {fabric.totalMeters} م)
                        </span>
                      </div>
                      {/* Smart Insight: how many thobes can be tailored */}
                      <p className="text-[10px] text-amber-800 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>يكفي لتفصيل {thobesRemaining} {thobesRemaining === 1 ? 'ثوب' : thobesRemaining === 2 ? 'ثوبين' : 'أثواب'} فقط!</span>
                      </p>
                    </div>

                    <FabricThumbnail
                      flag={fabric.flag}
                      type={fabric.flag === 'KR' ? 'silk_navy' : fabric.flag === 'UK' ? 'wool_navy' : fabric.flag === 'SA' ? 'cream' : 'white'}
                      className="w-12 h-10 rounded-md shrink-0"
                    />
                  </div>

                  {/* Quick Action Button for this specific fabric */}
                  <div className="flex items-center gap-2 pt-1.5 border-t border-slate-100">
                    <button
                      onClick={() => handleQuickRestockItem(fabric, 50)}
                      className="flex-1 py-1.5 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>إعادة توريد فورية (+50م)</span>
                    </button>

                    <button
                      onClick={() => onOpenRestock(fabric)}
                      className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>طلب مخصص</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-3 bg-white rounded-xl border border-emerald-200 text-center text-xs text-emerald-800 flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>ممتاز! جميع طاقات الأقمشة متوفرة بكميات كافية ولا توجد نواقص حرجة.</span>
          </div>
        )}

        {/* Batch Re-supply Button */}
        {criticalFabrics.length > 0 && (
          <button
            onClick={handleBatchRestock}
            className="w-full py-2.5 px-4 bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>طلب توريد سريع لجميع الأصناف الحرجة ({criticalFabrics.length} طاقات)</span>
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">إجراءات سريعة</h3>
          <span className="text-[11px] text-slate-400">وصول فوري</span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={onOpenNewCustomer}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:bg-slate-50 transition-all text-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">إضافة عميل جديد</span>
          </button>

          <button
            onClick={onOpenRecordPayment}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:bg-slate-50 transition-all text-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">تسجيل دفعة</span>
          </button>

          <button
            onClick={() => onNavigateToTab('orders')}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:bg-slate-50 transition-all text-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">فحص الجاهز</span>
          </button>
        </div>
      </div>

      {/* Urgent & In-Progress Orders */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-slate-900 text-sm">الطلبات المستعجلة والجارية</h3>
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center justify-center">
              4
            </span>
          </div>
          <button
            onClick={() => onNavigateToTab('orders')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            <span>عرض الكل</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Order 1: ORD-4921# */}
        <div
          onClick={() => {
            const ord = orders.find((o) => o.orderNumber === 'ORD-4921#') || orders[0];
            onOpenOrder(ord);
          }}
          className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs space-y-3 cursor-pointer hover:border-blue-300 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
                س
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">سعود بن فيصل المقرن</h4>
                  <span className="text-slate-400 font-mono text-xs">ORD-4921#</span>
                </div>
                <p className="text-xs text-slate-500">ثوب شتوي صوف إنجليزي • رقبة قلاب</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
              تسليم غداً
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-4 gap-1 text-[11px] text-center font-semibold">
              <span className="text-blue-700">القص</span>
              <span className="text-blue-700">الدرز</span>
              <span className="text-blue-700 font-bold bg-blue-50 py-0.5 rounded">البروفة</span>
              <span className="text-slate-400">الكي والتسليم</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="w-1/4 bg-blue-600 border-l border-white"></div>
              <div className="w-1/4 bg-blue-600 border-l border-white"></div>
              <div className="w-1/4 bg-blue-600 border-l border-white animate-pulse"></div>
              <div className="w-1/4 bg-slate-200"></div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1 text-slate-600">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>الخياط المسؤول: المعلم سراج</span>
            </div>
            <span className="font-bold text-slate-900 tabular-nums">1,250 ر.س</span>
          </div>
        </div>

        {/* Order 2: ORD-4918# */}
        <div
          onClick={() => {
            const ord = orders.find((o) => o.orderNumber === 'ORD-4918#') || orders[1];
            onOpenOrder(ord);
          }}
          className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs space-y-3 cursor-pointer hover:border-blue-300 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
                م
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">م. إبراهيم الخالدي</h4>
                  <span className="text-slate-400 font-mono text-xs">ORD-4918#</span>
                </div>
                <p className="text-xs text-slate-500">بشت حساوي مقصب ذهبي يدوي (قصب ملكي)</p>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10px] font-bold">
              بقي 4 أيام
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-4 gap-1 text-[11px] text-center font-semibold">
              <span className="text-blue-700">القماش</span>
              <span className="text-blue-700 font-bold bg-blue-50 py-0.5 rounded">تطريز القصب</span>
              <span className="text-slate-400">التجميع</span>
              <span className="text-slate-400">التسليم</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="w-1/4 bg-blue-600 border-l border-white"></div>
              <div className="w-1/4 bg-blue-600 border-l border-white animate-pulse"></div>
              <div className="w-1/4 bg-slate-200 border-l border-white"></div>
              <div className="w-1/4 bg-slate-200"></div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1 text-slate-600">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>الخياط المسؤول: الأستاذ هاني</span>
            </div>
            <span className="font-bold text-slate-900 tabular-nums">4,800 ر.س</span>
          </div>
        </div>
      </div>

      {/* Promo Card: New Season Fabrics Catalog */}
      <div
        onClick={() => onNavigateToTab('inventory')}
        className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-blue-100/70 transition-colors"
      >
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900 text-xs">كتالوج أقمشة الموسم الجديد</h4>
          <p className="text-[11px] text-slate-600">
            وصلت دفعة أقمشة شتوية يابانية وسويسرية فاخرة.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FabricThumbnail flag="JP" type="wool_navy" className="w-14 h-11 rounded-lg shrink-0" />
          <div className="w-7 h-7 rounded-full bg-white shadow-2xs flex items-center justify-center text-blue-700">
            <ChevronLeft className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
