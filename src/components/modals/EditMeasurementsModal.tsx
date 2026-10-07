import React, { useState } from 'react';
import { X, Check, Ruler } from 'lucide-react';
import { Measurements } from '../../types';

interface EditMeasurementsModalProps {
  initialMeasurements: Measurements;
  customerName: string;
  onSave: (measurements: Measurements) => void;
  onClose: () => void;
}

export const EditMeasurementsModal: React.FC<EditMeasurementsModalProps> = ({
  initialMeasurements,
  customerName,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Measurements>({ ...initialMeasurements });

  const handleChange = (field: keyof Measurements, val: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Ruler className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">تعديل مقاسات الزبون</h3>
              <p className="text-xs text-slate-500">العميل: {customerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <p className="text-xs text-slate-500">
              جميع المقاسات تُسجل بالسنتيمتر (سم) بدقة متناهية لتفصيل دقيق متطابق مع دفتر القياسات.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  الطول الكلي (سم)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.length}
                  onChange={(e) => handleChange('length', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  عرض الكتف (سم)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.shoulder}
                  onChange={(e) => handleChange('shoulder', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  محيط الصدر (سم)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.chest}
                  onChange={(e) => handleChange('chest', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  طول اليد / الكم (سم)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.arm}
                  onChange={(e) => handleChange('arm', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  محيط الرقبة (سم)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.neck}
                  onChange={(e) => handleChange('neck', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  محيط المعصم / الكبك (سم)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.cuff || 24}
                  onChange={(e) => handleChange('cuff', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200/60 rounded-xl">
              <label className="block text-xs font-semibold text-blue-900 mb-1">
                توسيع إضافي اختياري (سم)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={formData.expansion || 0}
                  onChange={(e) => handleChange('expansion', parseFloat(e.target.value) || 0)}
                  className="flex-1 accent-blue-600"
                />
                <span className="text-sm font-bold text-blue-700 min-w-12 text-center">
                  +{formData.expansion || 0} سم
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
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
              حفظ القياسات الجديدة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
