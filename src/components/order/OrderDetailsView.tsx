import React, { useState } from 'react';
import {
  ArrowRight,
  Phone,
  Ruler,
  Scissors,
  Check,
  Printer,
  Share2,
  Calendar,
  Save,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';
import { OrderItem, GarmentType, Measurements, FabricRoll } from '../../types';
import { GarmentThumbnail } from '../common/GarmentThumbnail';
import { INITIAL_GARMENTS } from '../../mockData';

interface OrderDetailsViewProps {
  order: OrderItem;
  fabrics: FabricRoll[];
  onBack: () => void;
  onUpdateOrder: (updated: OrderItem) => void;
  onOpenBarcodeModal: (order: OrderItem) => void;
  onOpenEditMeasurements: () => void;
}

export const OrderDetailsView: React.FC<OrderDetailsViewProps> = ({
  order,
  fabrics,
  onBack,
  onUpdateOrder,
  onOpenBarcodeModal,
  onOpenEditMeasurements,
}) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'garment' | 'fabric' | 'payment'>('garment');
  const [selectedGarment, setSelectedGarment] = useState<GarmentType>(order.garmentType);
  const [notes, setNotes] = useState<string>(order.notes);
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Associated fabric
  const assignedFabric = fabrics.find((f) => f.id === order.fabricRollId) || fabrics[0];

  const handleSave = () => {
    const updated: OrderItem = {
      ...order,
      garmentType: selectedGarment,
      garmentTitle: INITIAL_GARMENTS.find((g) => g.id === selectedGarment)?.title || order.garmentTitle,
      notes,
    };
    onUpdateOrder(updated);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2500);
  };

  const handleSendWhatsApp = () => {
    const text = `السلام عليكم ورحمة الله وبركاته،\nأهلاً بك يا ${order.customerName} في مشغل الخياطة الملكية.\n\nتفاصيل طلبك رقم (${order.orderNumber}):\n- الصنف: ${order.garmentTitle}\n- القماش: ${order.fabricName}\n- موعد التسليم: ${order.deliveryDateLabel}\n- إجمالي القيمة: ${order.totalPrice} ر.س\n- المدفوع: ${order.paidAmount} ر.س\n- المتبقي: ${order.remainingAmount} ر.س\n\nشاكرين ومقدرين ثقتكم الغالية.`;
    const url = `https://wa.me/966${order.customerPhone.replace(/^0/, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Top Details Bar */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBack}
          className="p-2 -mr-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1 font-bold text-xs"
        >
          <ArrowRight className="w-5 h-5" />
          <span>العودة للطلبات</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {order.orderNumber}
          </span>
        </div>
      </div>

      {/* Main Order Header Card (Matching Screenshot 7) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900">طلب رقم {order.orderNumber}</h2>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">
                {order.statusLabel}
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-md">
                الأولوية: {order.priority === 'urgent' ? 'مستعجل' : 'عادية'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>تسليم متوقع: {order.deliveryDateLabel}</span>
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Scissors className="w-5 h-5" />
          </div>
        </div>

        {/* 4 Interactive Sub-Tabs */}
        <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('customer')}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all ${
              activeTab === 'customer'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            بيانات العميل
          </button>
          <button
            onClick={() => setActiveTab('garment')}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all ${
              activeTab === 'garment'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            نوع الثوب
          </button>
          <button
            onClick={() => setActiveTab('fabric')}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all ${
              activeTab === 'fabric'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            طاقة القماش
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all ${
              activeTab === 'payment'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            المدفوعات
          </button>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
            {order.customerName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-xs">{order.customerName}</h4>
              {order.isVip && (
                <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 font-bold">
                  عميل مميز
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-slate-500 mt-0.5">{order.customerPhone}</p>
          </div>
        </div>

        <button
          onClick={() => (window.location.href = `tel:${order.customerPhone}`)}
          title="اتصال هاتفي"
          className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
        >
          <Phone className="w-4 h-4" />
        </button>
      </div>

      {/* Section 1: Garment Type Selection (Matching Screenshot 7) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-xs">نوع الثوب والملابس</h4>
          <span className="text-[10px] text-slate-400">مطلوب اختيار صنف واحد</span>
        </div>

        <div className="space-y-2">
          {INITIAL_GARMENTS.map((garment) => {
            const isSelected = selectedGarment === garment.id;

            return (
              <div
                key={garment.id}
                onClick={() => setSelectedGarment(garment.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-xs">{garment.title}</span>
                      {isSelected && (
                        <span className="px-1.5 py-0.2 bg-blue-600 text-white text-[9px] font-bold rounded">
                          محدد
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{garment.description}</p>
                  </div>
                </div>

                <GarmentThumbnail type={garment.id} className="w-12 h-12 rounded-lg shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Customer Measurements Summary (Matching Screenshot 7) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Ruler className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-slate-900 text-xs">ملخص قياسات الزبون</h4>
          </div>
          <button
            onClick={onOpenEditMeasurements}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 hover:underline cursor-pointer"
          >
            <span>تعديل القياس</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5-Column Measurements Grid */}
        <div className="grid grid-cols-5 gap-2 text-center">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block">الطول</span>
            <span className="text-sm font-bold text-slate-900 tabular-nums">{order.measurements.length}</span>
            <span className="text-[9px] text-slate-400 block">سم</span>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block">الكتف</span>
            <span className="text-sm font-bold text-slate-900 tabular-nums">{order.measurements.shoulder}</span>
            <span className="text-[9px] text-slate-400 block">سم</span>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block">الصدر</span>
            <span className="text-sm font-bold text-slate-900 tabular-nums">{order.measurements.chest}</span>
            <span className="text-[9px] text-slate-400 block">سم</span>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block">اليد</span>
            <span className="text-sm font-bold text-slate-900 tabular-nums">{order.measurements.arm}</span>
            <span className="text-[9px] text-slate-400 block">سم</span>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block">الرقبة</span>
            <span className="text-sm font-bold text-slate-900 tabular-nums">{order.measurements.neck}</span>
            <span className="text-[9px] text-slate-400 block">سم</span>
          </div>
        </div>
      </div>

      {/* Section 3: Fabric Roll Assigned (Matching Screenshot 7) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-xs">طاقة القماش المخصصة</h4>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200">
            تم الحجز
          </span>
        </div>

        <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 space-y-2.5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-xs">رول {order.fabricCode}</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded">
                  {assignedFabric.origin === 'اليابان' ? 'ياباني فاخر' : 'أصلي'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">{order.fabricName}</p>
            </div>

            <button
              onClick={() => alert('يمكنك اختيار رول بديل من تبويب المخزون.')}
              className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-100"
            >
              تغيير
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 text-slate-600">
            <span>الأمتار المطلوبة للطلب: <strong className="text-blue-700">{order.metersRequired} م</strong></span>
            <span>المتبقي في الرول: <strong className="text-slate-900">{assignedFabric.remainingMeters} م</strong></span>
          </div>

          <div className="space-y-1">
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{
                  width: `${Math.min(100, (assignedFabric.remainingMeters / assignedFabric.totalMeters) * 100)}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>سعة الطاقة الكلية: {assignedFabric.totalMeters} م</span>
              <span>مخزون وافر متاح للقص</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Payments and Balance Breakdown (Matching Screenshot 7) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-xs">المدفوعات والمتبقي</h4>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            {order.remainingAmount > 0 ? 'دفعة جزئية' : 'خالص بالكامل'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block">إجمالي الطلب</span>
            <span className="text-base font-black text-slate-900 tabular-nums">{order.totalPrice}</span>
            <span className="text-[9px] text-slate-400 block">ر.س</span>
          </div>

          <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/70">
            <span className="text-[10px] text-emerald-700 font-bold block">عربون مدفوع</span>
            <span className="text-base font-black text-emerald-700 tabular-nums">{order.paidAmount}</span>
            <span className="text-[9px] text-emerald-600 block">{order.paymentMethod || 'شبكة مدى'}</span>
          </div>

          <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-200/70">
            <span className="text-[10px] text-rose-700 font-bold block">المتبقي للتحصيل</span>
            <span className="text-base font-black text-rose-700 tabular-nums">{order.remainingAmount}</span>
            <span className="text-[9px] text-rose-600 block">عند الاستلام</span>
          </div>
        </div>
      </div>

      {/* Section 5: Tailor Notes */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
        <label className="block text-xs font-bold text-slate-900">ملاحظات الخياط الخاصة</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
          placeholder="أدخل أي ملاحظات تفصيل إضافية..."
        />
      </div>

      {/* Alert toast when saved */}
      {isSavedAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>تم حفظ وتحديث بيانات الطلب بنجاح في قاعدة البيانات.</span>
        </div>
      )}

      {/* Actions Section */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleSave}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>حفظ وتحديث الطلب</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenBarcodeModal(order)}
            className="py-3 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span>طباعة الباركود والوصل</span>
          </button>

          <button
            onClick={handleSendWhatsApp}
            className="py-3 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>إرسال فاتورة واتساب</span>
          </button>
        </div>
      </div>
    </div>
  );
};
