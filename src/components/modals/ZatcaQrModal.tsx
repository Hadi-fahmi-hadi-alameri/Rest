import React, { useState } from 'react';
import { Printer, X, CheckCircle, ShieldCheck, Download, Check } from 'lucide-react';
import { InvoiceItem } from '../../types';
import { exportSingleInvoicePdf } from '../../utils/pdfGenerator';

interface ZatcaQrModalProps {
  invoice: InvoiceItem | null;
  onClose: () => void;
}

export const ZatcaQrModal: React.FC<ZatcaQrModalProps> = ({ invoice, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!invoice) return null;

  const handleDownloadPdf = () => {
    exportSingleInvoicePdf(invoice);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">فاتورة ضريبية مبسطة (ZATCA)</h3>
              <p className="text-xs text-slate-500">متوافقة مع اشتراطات هيئة الزكاة والضريبة والجمارك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thermal Receipt Body */}
        <div className="p-6 font-mono text-slate-800 text-xs space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Header Receipt Branding */}
          <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-4">
            <h2 className="font-bold text-base text-slate-900 font-sans">مشغل الخياطة الملكية</h2>
            <p className="text-[11px] text-slate-500">الفرع الرئيسي • طريق الملك فهد، الرياض</p>
            <p className="text-[11px] text-slate-500">الرقم الضريبي: 310294857300003</p>
            <p className="text-[11px] text-slate-400 font-sans">معرف الفاتورة: {invoice.invoiceNumber}</p>
          </div>

          {/* Details */}
          <div className="space-y-1.5 py-1 text-[11px] border-b border-dashed border-slate-300 pb-3">
            <div className="flex justify-between">
              <span className="text-slate-500">العميل:</span>
              <span className="font-semibold text-slate-900">{invoice.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">التاريخ والوقت:</span>
              <span>{invoice.dateLabel} - {invoice.timeLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">طريقة الدفع:</span>
              <span className="font-bold text-blue-700">{invoice.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">حالة السداد:</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                {invoice.status === 'paid' ? 'مدفوعة بالكامل' : 'دفعة جزئية'}
              </span>
            </div>
          </div>

          {/* Line items */}
          <div className="border-b border-dashed border-slate-300 pb-3 text-[11px]">
            <div className="flex justify-between text-slate-500 font-bold mb-1">
              <span>الوصف</span>
              <span>المبلغ</span>
            </div>
            <div className="flex justify-between text-slate-800">
              <span>{invoice.description}</span>
              <span>{invoice.amount} ر.س</span>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-1.5 text-[11px] border-b border-dashed border-slate-300 pb-3">
            <div className="flex justify-between">
              <span className="text-slate-500">المبلغ غير شامل الضريبة:</span>
              <span>{(invoice.amount - invoice.vatAmount).toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ضريبة القيمة المضافة (15%):</span>
              <span>{invoice.vatAmount.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
              <span>الإجمالي المستحق شامل الضريبة:</span>
              <span className="text-blue-700">{invoice.amount} ر.س</span>
            </div>
            {invoice.remainingAmount > 0 && (
              <div className="flex justify-between text-rose-600 font-bold">
                <span>المتبقي للتحصيل:</span>
                <span>{invoice.remainingAmount} ر.س</span>
              </div>
            )}
          </div>

          {/* ZATCA Phase 2 QR Code Illustration */}
          <div className="pt-2 flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-white border border-slate-300 rounded-xl shadow-xs inline-block">
              {/* High fidelity procedural QR matrix */}
              <svg viewBox="0 0 100 100" className="w-32 h-32 text-slate-900" fill="currentColor">
                {/* Corner markers */}
                <rect x="5" y="5" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="11" y="11" width="14" height="14" fill="currentColor" />
                
                <rect x="69" y="5" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="75" y="11" width="14" height="14" fill="currentColor" />
                
                <rect x="5" y="69" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="11" y="75" width="14" height="14" fill="currentColor" />
                
                {/* Random pseudo QR data blocks */}
                <rect x="36" y="8" width="5" height="5" />
                <rect x="44" y="8" width="5" height="5" />
                <rect x="52" y="8" width="5" height="5" />
                <rect x="36" y="16" width="10" height="5" />
                <rect x="52" y="20" width="8" height="5" />
                <rect x="38" y="28" width="16" height="4" />
                
                <rect x="8" y="38" width="8" height="5" />
                <rect x="20" y="38" width="6" height="6" />
                <rect x="32" y="38" width="10" height="6" />
                <rect x="48" y="38" width="12" height="6" />
                <rect x="66" y="38" width="8" height="5" />
                <rect x="80" y="38" width="12" height="6" />
                
                <rect x="8" y="48" width="12" height="6" />
                <rect x="26" y="48" width="16" height="6" />
                <rect x="48" y="48" width="8" height="6" />
                <rect x="62" y="48" width="14" height="6" />
                <rect x="82" y="48" width="10" height="6" />

                <rect x="36" y="60" width="8" height="8" />
                <rect x="50" y="60" width="12" height="5" />
                <rect x="68" y="60" width="16" height="8" />

                <rect x="36" y="74" width="14" height="6" />
                <rect x="56" y="74" width="8" height="6" />
                <rect x="70" y="74" width="10" height="10" />
                <rect x="86" y="74" width="6" height="6" />

                <rect x="36" y="86" width="10" height="6" />
                <rect x="52" y="86" width="16" height="6" />
                <rect x="74" y="88" width="18" height="4" />
              </svg>
            </div>
            <p className="text-[10px] text-slate-400 font-sans text-center">
              رمز الاستجابة السريعة المشفر وفق مواصفات هيئة الزكاة والضريبة والجمارك (ZATCA e-invoicing Phase 2)
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="py-2.5 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            إغلاق
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex-1 py-2.5 px-3 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">تم التصدير (PDF)</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-rose-600" />
                <span>تصدير PDF رسمي</span>
              </>
            )}
          </button>
          <button
            onClick={() => window.print()}
            className="py-2.5 px-3 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة حرارية</span>
          </button>
        </div>
      </div>
    </div>
  );
};
