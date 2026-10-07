import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  FileSpreadsheet,
  FileText,
  CreditCard,
  Plus,
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Sparkles,
  Lightbulb,
  Download,
} from 'lucide-react';
import { exportSingleInvoicePdf, exportFinancialQuarterReportPdf } from '../../utils/pdfGenerator';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { InvoiceItem } from '../../types';

interface FinancialsTabProps {
  invoices: InvoiceItem[];
  onOpenInvoiceModal: (invoice: InvoiceItem) => void;
  onRecordPaymentForInvoice: (invoice: InvoiceItem) => void;
  onOpenNewExpense: () => void;
}

// 6-month historical & forecast trend data for accountant decision-making
const MONTHLY_FINANCIAL_DATA = [
  { month: 'يناير', sales: 38000, expenses: 18500, profit: 19500 },
  { month: 'فبراير', sales: 42000, expenses: 19800, profit: 22200 },
  { month: 'مارس', sales: 45500, expenses: 20200, profit: 25300 },
  { month: 'أبريل', sales: 52000, expenses: 21400, profit: 30600 },
  { month: 'مايو (الحالي)', sales: 64800, expenses: 22100, profit: 42700 },
  { month: 'يونيو (توقع)', sales: 69000, expenses: 23500, profit: 45500 },
];

// Operational expense distribution breakdown
const EXPENSE_BREAKDOWN_DATA = [
  { name: 'أقمشة وطاقات مستوردة', value: 9945, color: '#2563eb' },
  { name: 'أجور ورواتب الخياطين', value: 6630, color: '#60a5fa' },
  { name: 'خيوط وأزرار وبطانات', value: 2652, color: '#f59e0b' },
  { name: 'إيجار المشغل والمرافق', value: 2873, color: '#f43f5e' },
];

export const FinancialsTab: React.FC<FinancialsTabProps> = ({
  invoices,
  onOpenInvoiceModal,
  onRecordPaymentForInvoice,
  onOpenNewExpense,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'expenses' | 'reports'>('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChartsSection, setShowChartsSection] = useState(true);

  const filteredInvoices = invoices.filter((inv) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      inv.description.toLowerCase().includes(q)
    );
  });

  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);

  const handleExportPdf = () => {
    try {
      exportFinancialQuarterReportPdf(invoices);
      setPdfSuccessMessage('تم توليد وتحميل التقرير المالي الضريبي (PDF) بنجاح!');
      setTimeout(() => setPdfSuccessMessage(null), 4000);
    } catch (err) {
      console.error(err);
      window.print();
    }
  };

  const handleDownloadInvoicePdf = (inv: InvoiceItem) => {
    try {
      exportSingleInvoicePdf(inv);
      setPdfSuccessMessage(`تم تصدير فاتورة ${inv.customerName} (${inv.invoiceNumber}) كملف PDF رسمي!`);
      setTimeout(() => setPdfSuccessMessage(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportExcel = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'رقم الفاتورة,العميل,التاريخ,الوصف,المبلغ,الضريبة,طريقة الدفع,الحالة\n' +
      invoices
        .map(
          (i) =>
            `${i.invoiceNumber},${i.customerName},${i.dateLabel},${i.description},${i.amount},${i.vatAmount},${i.paymentMethod},${i.status}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `كشف_فواتير_مشغل_الخياطة_الملكية_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* PDF Generation Success Notification */}
      {pdfSuccessMessage && (
        <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 shrink-0" />
            <span>{pdfSuccessMessage}</span>
          </div>
          <button
            onClick={() => setPdfSuccessMessage(null)}
            className="text-white/80 hover:text-white p-1"
          >
            &times;
          </button>
        </div>
      )}

      {/* Top Financial Hero Card (Blue Gradient matching Screenshot 3) */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden space-y-4">
        {/* Subtle decorative curves */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-x-12 -translate-y-12 pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-blue-200">الملخص المالي لشهر مايو</span>
            <h3 className="text-base font-bold text-white">ميزانية المشغل التقديرية</h3>
          </div>
          <span className="px-2.5 py-1 bg-blue-500/30 border border-blue-400/40 text-blue-100 rounded-xl text-xs font-bold flex items-center gap-1">
            <span>+18% نمو</span>
          </span>
        </div>

        {/* Net Profit Display */}
        <div className="text-center py-1">
          <span className="text-xs text-blue-200 block mb-1">صافي الربح التقديري</span>
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-3xl font-black tabular-nums tracking-tight">42,700</span>
            <span className="text-sm font-medium text-blue-200">ر.س</span>
          </div>
        </div>

        {/* Revenues vs Expenses 2-Column Split */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* Revenues */}
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 flex flex-col">
            <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
              <span>الإيرادات الإجمالية</span>
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1 mt-auto">
              <span className="text-lg font-black tabular-nums">64,800</span>
              <span className="text-[10px] text-blue-200">ر.س</span>
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 flex flex-col">
            <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
              <span>إجمالي المصروفات</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-300" />
            </div>
            <div className="flex items-baseline gap-1 mt-auto">
              <span className="text-lg font-black tabular-nums">22,100</span>
              <span className="text-[10px] text-blue-200">ر.س</span>
            </div>
          </div>
        </div>

        {/* Profit Margin Gauge */}
        <div className="space-y-1.5 pt-1 border-t border-white/10">
          <div className="flex justify-between items-center text-xs text-blue-200">
            <span>مؤشر الهامش الربحي للمشاغل</span>
            <span className="font-bold text-white tabular-nums">%65.9</span>
          </div>
          <div className="h-1.5 bg-blue-950/60 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full w-[65.9%]"></div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setActiveSubTab('invoices')}
          className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'invoices'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>الفواتير والمقبوضات</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('expenses');
            onOpenNewExpense();
          }}
          className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeSubTab === 'expenses'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>تسجيل المصروفات</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reports')}
          className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'reports'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>التقارير والرسوم</span>
        </button>
      </div>

      {/* Recharts Analytics Dashboard: Visible in Reports or Toggleable */}
      {(activeSubTab === 'reports' || showChartsSection) && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-4 animate-in fade-in duration-200">
          {/* Header of Chart Panel */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-xl">
                <BarChart3 className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">
                  التحليل المالي للمبيعات والمصروفات (Recharts)
                </h4>
                <p className="text-[11px] text-slate-500">
                  مقارنة شهرية لاتخاذ قرارات التسعير والإنفاق للمحاسب
                </p>
              </div>
            </div>

            {activeSubTab !== 'reports' && (
              <button
                onClick={() => setShowChartsSection(!showChartsSection)}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800"
              >
                {showChartsSection ? 'طي المخطط' : 'عرض المخطط'}
              </button>
            )}
          </div>

          {/* 1. Monthly Sales & Expenses Bar/Line Composed Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                تطور المبيعات والمصروفات وصافي الربح (ر.س)
              </span>
              <span className="text-[11px] text-slate-400">آخر 6 أشهر</span>
            </div>

            <div className="h-60 w-full pt-1" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={MONTHLY_FINANCIAL_DATA}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'IBM Plex Sans Arabic' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '11px',
                      direction: 'rtl',
                      textAlign: 'right',
                      fontFamily: 'IBM Plex Sans Arabic',
                    }}
                    formatter={(value: any, name: any) => {
                      const labels: Record<string, string> = {
                        sales: 'إجمالي المبيعات',
                        expenses: 'المصروفات',
                        profit: 'صافي الأرباح',
                      };
                      return [`${Number(value).toLocaleString()} ر.س`, labels[name] || name];
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '8px', direction: 'rtl' }}
                    formatter={(value) => {
                      const labels: Record<string, string> = {
                        sales: 'المبيعات',
                        expenses: 'المصروفات',
                        profit: 'صافي الربح',
                      };
                      return labels[value] || value;
                    }}
                  />
                  <Bar
                    dataKey="sales"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                    barSize={14}
                  />
                  <Bar
                    dataKey="expenses"
                    fill="#f43f5e"
                    radius={[6, 6, 0, 0]}
                    barSize={14}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#10b981' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Expense Distribution Donut Chart & Accountant Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            {/* Donut Chart */}
            <div className="space-y-1 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <PieChartIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>توزيع بنود المصروفات لشهر مايو</span>
              </div>
              <div className="h-44 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={EXPENSE_BREAKDOWN_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {EXPENSE_BREAKDOWN_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        fontSize: '11px',
                        direction: 'rtl',
                        textAlign: 'right',
                        fontFamily: 'IBM Plex Sans Arabic',
                      }}
                      formatter={(value: any) => [`${Number(value).toLocaleString()} ر.س`, 'المبلغ']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend Badges */}
              <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                {EXPENSE_BREAKDOWN_DATA.map((item) => (
                  <div key={item.name} className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accountant Decision Recommendation Box */}
            <div className="bg-blue-50/70 border border-blue-200/80 p-3.5 rounded-2xl space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950 mb-1">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>توصية محاسبية وقرار مالي استراتيجي</span>
                </div>
                <p className="text-[11px] text-blue-900/90 leading-relaxed">
                  بناءً على تحقيق هامش ربح <strong>%65.9</strong> في مايو ونمو المبيعات بـ <strong>%18</strong>، يُوصى المحاسب بطلب توريد استباقي لـ <strong>100 متر</strong> من قماش تويوبو الياباني والحرير الكوري قبل ذروة الطلب، للحفاظ على هامش ربح قياسي وتفادي تعطل خطوط القص.
                </p>
              </div>

              <div className="p-2 bg-white/90 rounded-xl border border-blue-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-600">متوسط تكلفة تفصيل الثوب:</span>
                <span className="font-bold text-blue-800">78.5 ر.س / ثوب</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث برقم الفاتورة أو اسم العميل..."
            className="w-full pl-3 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl shadow-2xs focus:border-blue-500 focus:outline-none"
          />
          <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>
        <button
          title="فلترة"
          className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 shadow-2xs"
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-sm">آخر الفواتير الصادرة</h4>
          <span className="text-[11px] text-slate-400">{filteredInvoices.length} فواتير حديثة</span>
        </div>

        {filteredInvoices.map((inv) => {
          const isPaid = inv.status === 'paid';
          const isPartial = inv.status === 'partial';

          return (
            <div
              key={inv.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3 hover:border-blue-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
                    {inv.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-slate-900 text-sm">{inv.customerName}</h5>
                      <span className="font-mono text-xs text-slate-400">{inv.invoiceNumber}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {inv.dateLabel} • {inv.timeLabel} • {inv.description}
                    </p>
                  </div>
                </div>

                <div className="text-left">
                  <div className="text-base font-black text-slate-900 tabular-nums">
                    {inv.amount} <span className="text-xs font-normal text-slate-500">ر.س</span>
                  </div>
                  <div className="mt-0.5">
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        مدفوعة ({inv.paymentMethod})
                      </span>
                    ) : isPartial ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        دفعة جزئية (متبقي {inv.remainingAmount} ر.س)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        معلقة
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tax & Breakdown */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                <span className="text-slate-500 text-[11px]">
                  الضريبة المضافة (15%): {inv.vatAmount} ر.س
                </span>

                {isPaid ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadInvoicePdf(inv)}
                      className="text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      title="تحميل كملف PDF"
                    >
                      <Download className="w-3 h-3 text-rose-600" />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={() => onOpenInvoiceModal(inv)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>طباعة الفاتورة</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadInvoicePdf(inv)}
                      className="text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      title="تحميل كملف PDF"
                    >
                      <Download className="w-3 h-3 text-rose-600" />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={() => onRecordPaymentForInvoice(inv)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>تحصيل الباقي</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Export Financial Ledgers & ZATCA Card (Matching Screenshot 3 bottom card) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-xs">تصدير الدفاتر والتقارير المالية</h4>
              <span className="text-[10px] text-slate-400 font-sans">إقرار الربع الثاني</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              تحميل نسخة مفصلة تشمل سجل الفواتير والمصروفات والضريبة المحصلة لتقديمها للمحاسب القانوني.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExportPdf}
            className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            <span>تقرير PDF ضريبي</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>جدول Excel مفصل</span>
          </button>
        </div>
      </div>
    </div>
  );
};
