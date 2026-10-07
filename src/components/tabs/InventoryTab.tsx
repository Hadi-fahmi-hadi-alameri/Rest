import React, { useState } from 'react';
import {
  Search,
  ScanBarcode,
  Plus,
  Scissors,
  Truck,
  TrendingUp,
  FileText,
  AlertTriangle,
  QrCode,
  Edit2,
  SlidersHorizontal,
} from 'lucide-react';
import { FabricRoll } from '../../types';
import { FabricThumbnail } from '../common/FabricThumbnail';

interface InventoryTabProps {
  fabrics: FabricRoll[];
  onOpenCutModal: (fabric: FabricRoll) => void;
  onOpenRestockModal: (fabric: FabricRoll) => void;
  onAddNewFabric: () => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  fabrics,
  onOpenCutModal,
  onOpenRestockModal,
  onAddNewFabric,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQrFabric, setSelectedQrFabric] = useState<FabricRoll | null>(null);

  // Filters
  const filteredFabrics = fabrics.filter((f) => {
    if (filter === 'white' && !f.colorName.includes('أبيض') && !f.colorName.includes('سكري')) return false;
    if (filter === 'dark' && !f.colorName.includes('كحلي') && !f.colorName.includes('ملون')) return false;
    if (filter === 'japanese' && f.origin !== 'اليابان') return false;
    if (filter === 'wool' && !f.name.includes('صوف')) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q) ||
        f.colorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalMeters = fabrics.reduce((acc, f) => acc + f.remainingMeters, 0);
  const criticalCount = fabrics.filter((f) => f.remainingMeters < 15).length;

  return (
    <div className="space-y-4 pb-24">
      {/* Top Warehouse Header Banner (Matching Screenshot 5) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm">مستودع الأقمشة والطاقات</h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              تحديث لحظي
            </span>
          </div>
        </div>

        {/* 3 Metric Stats Blocks */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">إجمالي الطاقات</span>
            <div className="flex items-baseline justify-center gap-1 mt-0.5">
              <span className="text-lg font-black text-slate-900 tabular-nums">48</span>
              <span className="text-[10px] text-slate-400">رول</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">المجموع الكلي</span>
            <div className="flex items-baseline justify-center gap-1 mt-0.5">
              <span className="text-lg font-black text-slate-900 tabular-nums">{totalMeters.toFixed(0)}</span>
              <span className="text-[10px] text-slate-400">متر</span>
            </div>
          </div>

          <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-200/70">
            <span className="text-[11px] text-rose-700 font-semibold block">تنبيه النقص</span>
            <div className="flex items-baseline justify-center gap-1 mt-0.5">
              <span className="text-lg font-black text-rose-700 tabular-nums">{criticalCount}</span>
              <span className="text-[10px] text-rose-500">طاقات</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onAddNewFabric}
            className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة طاقة جديدة</span>
          </button>

          <button
            onClick={() => window.print()}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>جرد وتسوية المخزون</span>
          </button>
        </div>
      </div>

      {/* Weekly Consumption Trend Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">معدل الاستهلاك الأسبوعي</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
              +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">قص 165 متراً خلال الـ 7 أيام الماضية</p>
        </div>

        {/* Mini SVG Trend Line */}
        <div className="w-24 h-9">
          <svg viewBox="0 0 100 35" className="w-full h-full text-blue-600" fill="none">
            <path
              d="M 5 25 Q 25 30 40 18 T 75 12 T 95 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="95" cy="6" r="3" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Search Bar + Scanner */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="البحث برقم الطاقة، الكود، أو اسم القماش..."
          className="w-full pl-12 pr-10 py-3 text-xs bg-white border border-slate-200 rounded-2xl shadow-2xs focus:border-blue-500 focus:outline-none placeholder:text-slate-400"
        />
        <Search className="absolute right-3.5 w-4 h-4 text-slate-400" />
        <button
          onClick={() => setSelectedQrFabric(fabrics[0])}
          title="مسح QR الطاقة"
          className="absolute left-2.5 p-1.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <ScanBarcode className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          الكل (48)
        </button>
        <button
          onClick={() => setFilter('white')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            filter === 'white'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          أبيض سكري
        </button>
        <button
          onClick={() => setFilter('dark')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            filter === 'dark'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          ملون وداكن
        </button>
        <button
          onClick={() => setFilter('japanese')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            filter === 'japanese'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          ياباني أصلي
        </button>
        <button
          onClick={() => setFilter('wool')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            filter === 'wool'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          صوف إنجليزي
        </button>
      </div>

      {/* Fabric Rolls Cards List */}
      <div className="space-y-3">
        {filteredFabrics.map((fabric) => {
          const percent = Math.round((fabric.remainingMeters / fabric.totalMeters) * 100);
          const isCritical = fabric.remainingMeters < 15;
          const isExcellent = percent >= 90;

          return (
            <div
              key={fabric.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3 hover:border-blue-300 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{fabric.name}</h4>
                    {isCritical ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.2 rounded border border-rose-200">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        منخفض جداً
                      </span>
                    ) : isExcellent ? (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                        ممتاز
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.2 rounded border border-blue-200">
                        متوفر
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    كود: <span className="font-mono text-slate-700 font-semibold">{fabric.code}</span> • عرض {fabric.widthInches} إنش • {fabric.colorName}
                  </p>
                </div>

                <FabricThumbnail
                  flag={fabric.flag}
                  type={fabric.flag === 'KR' ? 'silk_navy' : fabric.flag === 'UK' ? 'wool_navy' : fabric.flag === 'SA' ? 'cream' : 'white'}
                  className="w-14 h-12 rounded-xl shrink-0"
                />
              </div>

              {/* Critical Warning Callout if low */}
              {isCritical && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{fabric.alertMessage || 'المخزون قارب على النفاد! يتبقى ما يكفي لـ 3 أثواب فقط.'}</span>
                </div>
              )}

              {/* Meters Gauge */}
              <div className="space-y-1">
                <div className="flex justify-between items-baseline text-xs">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-slate-900 tabular-nums">
                      {fabric.remainingMeters.toFixed(1)}
                    </span>
                    <span className="text-slate-500 text-[11px]">/ {fabric.totalMeters.toFixed(1)} متر</span>
                  </div>
                  <span className={`text-[11px] font-bold ${isCritical ? 'text-rose-600' : 'text-blue-700'}`}>
                    {percent}% متبقي
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCritical ? 'bg-rose-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>

              {/* Cost & Tailoring Price */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50/70 p-2 rounded-xl border border-slate-100">
                <span>تكلفة المتر: <strong className="text-slate-800">{fabric.costPrice} ر.س</strong></span>
                <span>سعر التفصيل: <strong className="text-blue-700 font-bold">{fabric.retailPrice} ر.س</strong></span>
              </div>

              {/* Actions Row */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  onClick={() => setSelectedQrFabric(fabric)}
                  title="عرض باركود الطاقة"
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenCutModal(fabric)}
                  title="تعديل بيانات الطاقة"
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {isCritical ? (
                  <button
                    onClick={() => onOpenRestockModal(fabric)}
                    className="flex-1 py-2 px-3 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>طلب توريد طاقة</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenCutModal(fabric)}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>قص طاقة / متر</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Export PDF Button */}
      <button
        onClick={() => window.print()}
        className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
      >
        <FileText className="w-4 h-4 text-blue-600" />
        <span>طباعة كشوفات الجرد والمخزن (تصدير PDF)</span>
      </button>

      {/* QR Code Modal for specific fabric roll */}
      {selectedQrFabric && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm">{selectedQrFabric.name}</h4>
            <p className="text-xs text-slate-500">كود الرول: {selectedQrFabric.code}</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-block">
              <QrCode className="w-36 h-36 text-slate-800" />
            </div>
            <p className="text-[11px] text-slate-400">
              امسح الكود عبر الماسح الضوئي لتسجيل قص الأمتار فوراً
            </p>
            <button
              onClick={() => setSelectedQrFabric(null)}
              className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
