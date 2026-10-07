import React from 'react';
import { Printer, X, Tag, Scissors } from 'lucide-react';
import { OrderItem } from '../../types';

interface BarcodeModalProps {
  order: OrderItem | null;
  onClose: () => void;
}

export const BarcodeModal: React.FC<BarcodeModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Tag className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">بطاقة تفصيل وثوب (Rack Tag)</h3>
              <p className="text-xs text-slate-500">باركود تتبع المشغل وقسم القص والكي</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tag Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="border-2 border-slate-800 rounded-xl p-4 bg-amber-50/20 space-y-3 font-mono">
            {/* Tag Header */}
            <div className="flex justify-between items-start border-b border-slate-300 pb-2">
              <div>
                <p className="text-xs font-sans text-slate-500">مشغل الخياطة الملكية</p>
                <h4 className="text-lg font-bold font-sans text-slate-900">{order.customerName}</h4>
                <p className="text-xs text-slate-600 font-sans">{order.customerPhone}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded">
                  {order.orderNumber}
                </span>
                <p className="text-[10px] text-slate-500 mt-1 font-sans">{order.deliveryDateLabel}</p>
              </div>
            </div>

            {/* Garment and Fabric */}
            <div className="text-xs font-sans space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">الصنف:</span>
                <span className="font-bold text-slate-800">{order.garmentTitle} ({order.piecesCount} قطعة)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">القماش:</span>
                <span className="text-slate-800">{order.fabricName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">كود الطاقة:</span>
                <span className="font-bold text-blue-700">{order.fabricCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الخياط المسؤول:</span>
                <span className="font-semibold text-slate-800">{order.tailorName}</span>
              </div>
            </div>

            {/* Measurements Grid */}
            <div>
              <p className="text-xs font-bold font-sans text-slate-700 mb-1 flex items-center gap-1">
                <Scissors className="w-3.5 h-3.5 text-blue-600" />
                جدول القياسات الفعلي (سم)
              </p>
              <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="block text-[10px] text-slate-400 font-sans">الطول</span>
                  <span className="font-bold text-slate-900">{order.measurements.length}</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="block text-[10px] text-slate-400 font-sans">الكتف</span>
                  <span className="font-bold text-slate-900">{order.measurements.shoulder}</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="block text-[10px] text-slate-400 font-sans">الصدر</span>
                  <span className="font-bold text-slate-900">{order.measurements.chest}</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="block text-[10px] text-slate-400 font-sans">اليد</span>
                  <span className="font-bold text-slate-900">{order.measurements.arm}</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="block text-[10px] text-slate-400 font-sans">الرقبة</span>
                  <span className="font-bold text-slate-900">{order.measurements.neck}</span>
                </div>
              </div>
            </div>

            {/* Tailor Note */}
            {order.notes && (
              <div className="text-[11px] font-sans bg-amber-100/60 p-2 rounded text-amber-900 border border-amber-200">
                <span className="font-bold">ملاحظة الخياط: </span>
                {order.notes}
              </div>
            )}

            {/* Printable Barcode */}
            <div className="pt-2 text-center flex flex-col items-center">
              <svg viewBox="0 0 240 60" className="w-48 h-12 text-slate-900" fill="currentColor">
                <rect x="5" y="0" width="3" height="48" />
                <rect x="10" y="0" width="2" height="48" />
                <rect x="15" y="0" width="5" height="48" />
                <rect x="23" y="0" width="2" height="48" />
                <rect x="28" y="0" width="4" height="48" />
                <rect x="36" y="0" width="3" height="48" />
                <rect x="42" y="0" width="6" height="48" />
                <rect x="52" y="0" width="2" height="48" />
                <rect x="58" y="0" width="5" height="48" />
                <rect x="66" y="0" width="3" height="48" />
                <rect x="73" y="0" width="4" height="48" />
                <rect x="80" y="0" width="2" height="48" />
                <rect x="86" y="0" width="6" height="48" />
                <rect x="96" y="0" width="2" height="48" />
                <rect x="102" y="0" width="5" height="48" />
                <rect x="110" y="0" width="4" height="48" />
                <rect x="117" y="0" width="2" height="48" />
                <rect x="123" y="0" width="6" height="48" />
                <rect x="133" y="0" width="3" height="48" />
                <rect x="139" y="0" width="5" height="48" />
                <rect x="148" y="0" width="2" height="48" />
                <rect x="154" y="0" width="4" height="48" />
                <rect x="162" y="0" width="3" height="48" />
                <rect x="168" y="0" width="6" height="48" />
                <rect x="178" y="0" width="2" height="48" />
                <rect x="184" y="0" width="5" height="48" />
                <rect x="193" y="0" width="3" height="48" />
                <rect x="200" y="0" width="4" height="48" />
                <rect x="208" y="0" width="2" height="48" />
                <rect x="214" y="0" width="6" height="48" />
                <rect x="224" y="0" width="3" height="48" />
                <rect x="231" y="0" width="2" height="48" />
              </svg>
              <span className="text-xs font-mono tracking-widest text-slate-700 mt-1">
                *{order.orderNumber.replace('#', '')}*
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            إغلاق
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            طباعة الباركود والملصق
          </button>
        </div>
      </div>
    </div>
  );
};
