import React, { useState } from 'react';
import { X, CreditCard, Check } from 'lucide-react';
import { OrderItem, InvoiceItem } from '../../types';

interface RecordPaymentModalProps {
  orders: OrderItem[];
  invoices: InvoiceItem[];
  onRecordPayment: (orderId: string, amount: number, method: 'مدى' | 'تحويل بنكي' | 'نقد') => void;
  onClose: () => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  orders,
  invoices,
  onRecordPayment,
  onClose,
}) => {
  const unpaidOrders = orders.filter((o) => o.remainingAmount > 0);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(unpaidOrders[0]?.id || orders[0]?.id || '');
  const [amount, setAmount] = useState<number>(unpaidOrders[0]?.remainingAmount || 150);
  const [method, setMethod] = useState<'مدى' | 'تحويل بنكي' | 'نقد'>('مدى');

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const handleOrderChange = (id: string) => {
    setSelectedOrderId(id);
    const ord = orders.find((o) => o.id === id);
    if (ord) {
      setAmount(ord.remainingAmount || ord.totalPrice);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || amount <= 0) return;
    onRecordPayment(selectedOrderId, amount, method);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">تسجيل دفعة وسداد</h3>
              <p className="text-xs text-slate-500">سند قبض مالي إلكتروني فوري</p>
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
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                اختر الطلب / العميل
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => handleOrderChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.customerName} - {o.orderNumber} (المتبقي: {o.remainingAmount} ر.س)
                  </option>
                ))}
              </select>
            </div>

            {selectedOrder && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">إجمالي قيمة الطلب:</span>
                  <span className="font-bold text-slate-800">{selectedOrder.totalPrice} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">المبلغ المدفوع مسبقاً:</span>
                  <span className="text-emerald-700 font-semibold">{selectedOrder.paidAmount} ر.س</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1">
                  <span className="text-slate-600 font-bold">المتبقي للتحصيل:</span>
                  <span className="text-rose-600 font-bold">{selectedOrder.remainingAmount} ر.س</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                مبلغ الدفعة الحالية (ر.س)
              </label>
              <input
                type="number"
                min="1"
                max={selectedOrder ? selectedOrder.remainingAmount || selectedOrder.totalPrice : 10000}
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-bold bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                طريقة الدفع
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['مدى', 'تحويل بنكي', 'نقد'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                      method === m
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
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
              className="py-2.5 px-5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              تأكيد سداد الدفعة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
