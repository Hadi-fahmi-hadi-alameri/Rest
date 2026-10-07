import React, { useState } from 'react';
import { X, Scissors, AlertTriangle, Check } from 'lucide-react';
import { FabricRoll } from '../../types';

interface CutFabricModalProps {
  fabric: FabricRoll | null;
  onCut: (fabricId: string, meters: number, note: string) => void;
  onClose: () => void;
}

export const CutFabricModal: React.FC<CutFabricModalProps> = ({
  fabric,
  onCut,
  onClose,
}) => {
  const [meters, setMeters] = useState<number>(3.5);
  const [note, setNote] = useState<string>('قص تفصيل ثوب جديد');

  if (!fabric) return null;

  const isExcess = meters > fabric.remainingMeters;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExcess || meters <= 0) return;
    onCut(fabric.id, meters, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Scissors className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">قص أمتار من الطاقة</h3>
              <p className="text-xs text-slate-500">{fabric.name} ({fabric.code})</p>
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
            {/* Status box */}
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="text-xs text-slate-500 block">المتبقي حالياً في الرول</span>
                <span className="text-lg font-bold text-slate-900">{fabric.remainingMeters} م</span>
              </div>
              <div className="text-left">
                <span className="text-xs text-slate-500 block">عرض الطاقة</span>
                <span className="text-sm font-semibold text-slate-700">{fabric.widthInches} إنش</span>
              </div>
            </div>

            {/* Meter amount selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                عدد الأمتار المراد قصها (م)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max={fabric.remainingMeters}
                  value={meters}
                  onChange={(e) => setMeters(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-base font-bold bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  required
                />
                <div className="flex gap-1">
                  {[3.5, 4.0, 7.0].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setMeters(preset)}
                      className={`px-2.5 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                        meters === preset
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {preset}م
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {isExcess && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>الكمية المطلوبة تتجاوز المتبقي في الرول ({fabric.remainingMeters} م)!</span>
              </div>
            )}

            {/* After cut estimation */}
            {!isExcess && (
              <div className="flex justify-between items-center text-xs p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-900">
                <span>المتبقي في الرول بعد عملية القص:</span>
                <span className="font-bold text-sm">{(fabric.remainingMeters - meters).toFixed(1)} متر</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                بيان الصرف أو الملاحظة
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                placeholder="مثال: تفصيل ثوب للطلب ORD-9842#"
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
              disabled={isExcess || meters <= 0}
              className="py-2.5 px-5 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              تأكيد صرف وقص القماش
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
