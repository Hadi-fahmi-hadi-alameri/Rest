import React, { useState } from 'react';
import { X, Truck, Check, PackagePlus } from 'lucide-react';
import { FabricRoll } from '../../types';

interface RestockFabricModalProps {
  fabric?: FabricRoll | null;
  fabrics: FabricRoll[];
  onRestock: (fabricId: string, addedMeters: number) => void;
  onClose: () => void;
}

export const RestockFabricModal: React.FC<RestockFabricModalProps> = ({
  fabric,
  fabrics,
  onRestock,
  onClose,
}) => {
  if (!fabric) return null;

  const [selectedId, setSelectedId] = useState<string>(fabric?.id || fabrics[0]?.id || '');
  const [metersToAdd, setMetersToAdd] = useState<number>(50);

  const targetFabric = fabrics.find((f) => f.id === selectedId) || fabric || fabrics[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetFabric) return;
    onRestock(targetFabric.id, metersToAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-amber-50/50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Truck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">طلب توريد سريع للمستودع</h3>
              <p className="text-xs text-slate-500">شحن وتزويد طاقات الأقمشة للمشغل</p>
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
                اختر صنف القماش المطلوب
              </label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
              >
                {fabrics.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.code}) - المتبقي {f.remainingMeters} م
                  </option>
                ))}
              </select>
            </div>

            {targetFabric && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">حالة المخزون الحالي:</span>
                  <span className={targetFabric.remainingMeters < 15 ? 'text-rose-600 font-bold' : 'text-slate-700 font-medium'}>
                    {targetFabric.remainingMeters} / {targetFabric.totalMeters} متر
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">بلد المنشأ:</span>
                  <span className="font-semibold text-slate-800">{targetFabric.origin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">سعر تكلفة المتر:</span>
                  <span className="font-bold text-slate-900">{targetFabric.costPrice} ر.س</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                كمية التوريد (أمتار الرول)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  step="5"
                  value={metersToAdd}
                  onChange={(e) => setMetersToAdd(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-base font-bold bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  required
                />
                <div className="flex gap-1">
                  {[30, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setMetersToAdd(preset)}
                      className={`px-2.5 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                        metersToAdd === preset
                          ? 'bg-amber-700 text-white border-amber-700'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      +{preset}م
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {targetFabric && (
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-1 text-amber-900">
                <div className="flex justify-between">
                  <span>إجمالي تكلفة أمر التوريد:</span>
                  <span className="font-bold">{(metersToAdd * targetFabric.costPrice).toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span>الرصيد بعد التوريد:</span>
                  <span className="font-bold text-emerald-700">{(targetFabric.remainingMeters + metersToAdd).toFixed(1)} متر</span>
                </div>
              </div>
            )}
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
              className="py-2.5 px-5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <PackagePlus className="w-4 h-4" />
              تأكيد أمر التوريد الفوري
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
