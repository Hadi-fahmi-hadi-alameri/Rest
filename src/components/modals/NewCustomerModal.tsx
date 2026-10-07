import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';
import { OrderItem } from '../../types';

interface NewCustomerModalProps {
  onAddOrder: (order: OrderItem) => void;
  onClose: () => void;
}

export const NewCustomerModal: React.FC<NewCustomerModalProps> = ({
  onAddOrder,
  onClose,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('05');
  const [isVip, setIsVip] = useState(false);
  const [garmentType, setGarmentType] = useState<'traditional_thobe' | 'formal_shirt' | 'luxury_blazer'>('traditional_thobe');
  const [totalPrice, setTotalPrice] = useState(450);
  const [paidDeposit, setPaidDeposit] = useState(250);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const newOrderNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}#`;
    const newOrder: OrderItem = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNum,
      customerName,
      customerPhone,
      isVip,
      status: 'new',
      statusLabel: 'جديد • قيد التفصيل',
      priority: 'normal',
      deliveryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      deliveryDateLabel: 'بعد 5 أيام',
      garmentType,
      garmentTitle: garmentType === 'traditional_thobe' ? 'ثوب تفصيل كويتي/سعودي' : garmentType === 'formal_shirt' ? 'قميص رجالي فاخر' : 'بليزر كلاسيكي',
      garmentSubtitle: 'قماش ياباني قطن ممتاز - مقاس الزبون الخاص',
      piecesCount: 1,
      progressPercent: 15,
      currentStageName: 'مرحلة أخذ القياسات وقص الباترون',
      tailorName: 'المعلم سراج',
      tailorVerified: true,
      measurements: {
        length: 152,
        shoulder: 46,
        chest: 108,
        arm: 61,
        neck: 42,
        cuff: 24,
        expansion: 0,
      },
      fabricRollId: 'fab-1',
      fabricName: 'قماش تويوبو ملكي ياباني أصلي',
      fabricCode: 'TY-88#',
      metersRequired: 3.5,
      totalPrice,
      paidAmount: paidDeposit,
      remainingAmount: totalPrice - paidDeposit,
      notes: notes || 'عميل جديد تم تسجيل مقاساته في المنظومة.',
      paymentMethod: 'شبكة مدى',
    };

    onAddOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <UserPlus className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">إضافة عميل وطلب تفصيل جديد</h3>
              <p className="text-xs text-slate-500">تسجيل بيانات الزبون وفتح بطاقة مقاسات</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                اسم العميل الثلاثي
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="مثال: سلطان عبد الله الدوسري"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم الجوال (لإشعارات الواتساب)
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="05xxxxxxxx"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="vipCheckbox"
                checked={isVip}
                onChange={(e) => setIsVip(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <label htmlFor="vipCheckbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
                تصنيف كـ "عميل مميز VIP" (خدمة كبار الشخصيات)
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                نوع الثوب المطلوب
              </label>
              <select
                value={garmentType}
                onChange={(e) => setGarmentType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
              >
                <option value="traditional_thobe">ثوب تقليدي / كويتي / قطري</option>
                <option value="formal_shirt">قميص رسمي كاجوال</option>
                <option value="luxury_blazer">جاكيت / بليزر كلاسيكي</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  سعر التفصيل الإجمالي (ر.س)
                </label>
                <input
                  type="number"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  العربون المدفوع (ر.س)
                </label>
                <input
                  type="number"
                  value={paidDeposit}
                  onChange={(e) => setPaidDeposit(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ملاحظات أو مواصفات خاصة
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="تفضيلات الياقة، الكبك، الأزرار..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              حفظ وفتح ملف الطلب
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
