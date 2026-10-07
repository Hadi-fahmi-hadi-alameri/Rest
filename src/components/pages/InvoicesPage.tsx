import React, { useState } from 'react';
import {
  Search,
  Filter,
  Printer,
  FileCheck2,
  FileSpreadsheet,
  CheckCircle,
  CreditCard,
  Plus,
  Download,
  FileText,
} from 'lucide-react';
import { InvoiceItem } from '../../types';
import { exportSingleInvoicePdf, exportFinancialQuarterReportPdf } from '../../utils/pdfGenerator';

interface InvoicesPageProps {
  invoices: InvoiceItem[];
  onOpenZatcaModal: (invoice: InvoiceItem) => void;
  onRecordPayment: (invoice: InvoiceItem) => void;
  onAddNewInvoice: () => void;
}

export const InvoicesPage: React.FC<InvoicesPageProps> = ({
  invoices,
  onOpenZatcaModal,
  onRecordPayment,
  onAddNewInvoice,
}) => {
  const [filter, setFilter] = useState<'all' | 'paid' | 'partial'>('all');
  const [search, setSearch] = useState('');
  const [pdfToast, setPdfToast] = useState<string | null>(null);

  const handleDownloadInvoice = (inv: InvoiceItem) => {
    exportSingleInvoicePdf(inv);
    setPdfToast(`تم تصدير فاتورة ${inv.customerName} (${inv.invoiceNumber}) كملف PDF بنجاح!`);
    setTimeout(() => setPdfToast(null), 3500);
  };

  const handleDownloadQuarterReport = () => {
    exportFinancialQuarterReportPdf(invoices);
    setPdfToast('تم تصدير سجل الفواتير الشامل كملف PDF رسمي بنجاح!');
    setTimeout(() => setPdfToast(null), 3500);
  };

  const filtered = invoices.filter((i) => {
    if (filter === 'paid' && i.status !== 'paid') return false;
    if (filter === 'partial' && i.status !== 'partial') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        i.invoiceNumber.toLowerCase().includes(q) ||
        i.customerName.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalVat = invoices.reduce((acc, i) => acc + i.vatAmount, 0);

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header */}
      {pdfToast && (
        <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 shrink-0" />
            <span>{pdfToast}</span>
          </div>
          <button onClick={() => setPdfToast(null)} className="text-white/80 hover:text-white p-1">
            &times;
          </button>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">الفواتير الضريبية (ZATCA)</h2>
          <p className="text-xs text-slate-500">الفواتير الإلكترونية المعتمدة لضريبة القيمة المضافة 15%</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadQuarterReport}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="تصدير السجل الضريبي كملف PDF"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            <span>سجل PDF</span>
          </button>
          <button
            onClick={onAddNewInvoice}
            className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>فاتورة جديدة</span>
          </button>
        </div>
      </div>

      {/* Tax Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500">إجمالي المبالغ المحصلة</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900 tabular-nums">
              {totalCollected.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">ر.س</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500">ضريبة القيمة المضافة (15%)</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-blue-700 tabular-nums">
              {totalVat.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">ر.س</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث برقم الفاتورة أو اسم العميل..."
            className="w-full pl-3 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl shadow-2xs focus:border-blue-500 focus:outline-none"
          />
          <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>

        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
              filter === 'paid' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            مسددة
          </button>
          <button
            onClick={() => setFilter('partial')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
              filter === 'partial' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            جزئية
          </button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        {filtered.map((inv) => (
          <div
            key={inv.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3 hover:border-blue-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{inv.customerName}</h4>
                  <span className="font-mono text-xs text-blue-600 font-semibold">{inv.invoiceNumber}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {inv.dateLabel} • {inv.timeLabel} • {inv.description}
                </p>
              </div>

              <div className="text-left">
                <span className="text-base font-black text-slate-900 tabular-nums">
                  {inv.amount} ر.س
                </span>
                <span className="block text-[10px] text-slate-500">
                  شامل ضريبة 15% ({inv.vatAmount} ر.س)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
              <span className="font-semibold text-slate-600">
                طريقة السداد: <strong className="text-blue-700">{inv.paymentMethod}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadInvoice(inv)}
                  className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="تحميل كملف PDF"
                >
                  <Download className="w-3.5 h-3.5 text-rose-600" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => onOpenZatcaModal(inv)}
                  className="py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة ZATCA</span>
                </button>
                {inv.status === 'partial' && (
                  <button
                    onClick={() => onRecordPayment(inv)}
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>تحصيل ({inv.remainingAmount} ر.س)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
