import React from 'react';
import { X, Bell, AlertTriangle, CheckCircle2, Clock, Check } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'تنبيه نقص حرج في المخزون',
      time: 'منذ 15 دقيقة',
      desc: 'قماش تويوبو ياباني فاخر (أبيض) وصل للحد الحرج (12 متراً متبقية فقط).',
      type: 'warning',
      actionTab: 'inventory',
      actionLabel: 'فحص المستودع',
    },
    {
      id: '2',
      title: 'طلب جاهز للاستلام والتسليم',
      time: 'منذ 35 دقيقة',
      desc: 'الطلب ORD-9842# للعميل سعود الدوسري اجتاز الفحص والكي النهائي.',
      type: 'success',
      actionTab: 'orders',
      actionLabel: 'معاينة الطلب',
    },
    {
      id: '3',
      title: 'سداد دفعة نقدية مسجلة',
      time: 'منذ ساعتين',
      desc: 'تم تسجيل دفعة بقيمة 250 ر.س للفاتورة INV-2049# عبر شبكة مدى.',
      type: 'info',
      actionTab: 'financials',
      actionLabel: 'عرض المالية',
    },
    {
      id: '4',
      title: 'اكتمال النسخ الاحتياطي السحابي',
      time: 'أمس 03:00 ص',
      desc: 'تم حفظ وتشفير نسخة احتياطية آمنة لقواعد البيانات (256-bit).',
      type: 'neutral',
      actionTab: 'settings',
      actionLabel: 'الإعدادات',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-2xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col border-r border-slate-200 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Bell className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">مركز التنبيهات والإشعارات</h3>
              <p className="text-[11px] text-slate-500">4 إشعارات تشغيلية نشطة اليوم</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-all text-xs space-y-1.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                  {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  {n.type === 'info' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  {n.type === 'neutral' && <Clock className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{n.title}</span>
                </div>
                <span className="text-[10px] text-slate-400">{n.time}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{n.desc}</p>
              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => {
                    onNavigateToTab(n.actionTab);
                    onClose();
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-[11px] hover:underline"
                >
                  {n.actionLabel} &larr;
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
          >
            تحديد الكل كمقروء
          </button>
        </div>
      </div>
    </div>
  );
};
