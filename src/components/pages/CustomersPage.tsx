import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Phone,
  Ruler,
  ShoppingBag,
  Star,
  ChevronLeft,
} from 'lucide-react';
import { OrderItem } from '../../types';

interface CustomersPageProps {
  orders: OrderItem[];
  onSelectCustomerOrders: (customerName: string) => void;
  onOpenNewCustomerModal: () => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({
  orders,
  onSelectCustomerOrders,
  onOpenNewCustomerModal,
}) => {
  const [search, setSearch] = useState('');

  // Extract unique customers from orders
  const customerMap = new Map<string, {
    name: string;
    phone: string;
    isVip: boolean;
    ordersCount: number;
    measurements: any;
    lastOrderDate: string;
  }>();

  orders.forEach((o) => {
    if (!customerMap.has(o.customerName)) {
      customerMap.set(o.customerName, {
        name: o.customerName,
        phone: o.customerPhone,
        isVip: o.isVip,
        ordersCount: 1,
        measurements: o.measurements,
        lastOrderDate: o.deliveryDateLabel,
      });
    } else {
      const existing = customerMap.get(o.customerName)!;
      existing.ordersCount += 1;
    }
  });

  const customersList = Array.from(customerMap.values()).filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">سجل العملاء ودفتر القياسات</h2>
          <p className="text-xs text-slate-500">إدارة بيانات الزبائن وتاريخ التفصيل والمقاسات</p>
        </div>
        <button
          onClick={onOpenNewCustomerModal}
          className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>عميل جديد</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث باسم الزبون أو رقم الجوال..."
          className="w-full pl-3 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl shadow-2xs focus:border-blue-500 focus:outline-none"
        />
        <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
      </div>

      {/* Customer Cards List */}
      <div className="space-y-3">
        {customersList.map((customer) => (
          <div
            key={customer.name}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3 hover:border-blue-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">{customer.name}</h4>
                    {customer.isVip && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">{customer.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => (window.location.href = `tel:${customer.phone}`)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Measurements Preview */}
            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Ruler className="w-3 h-3 text-blue-600" />
                  القياسات المسجلة (سم):
                </span>
                <span>آخر تحديث: {customer.lastOrderDate}</span>
              </div>
              <div className="grid grid-cols-5 gap-1 text-center text-xs">
                <div className="bg-white p-1 rounded border border-slate-200">
                  <span className="block text-[9px] text-slate-400">الطول</span>
                  <span className="font-bold text-slate-900">{customer.measurements?.length || 152}</span>
                </div>
                <div className="bg-white p-1 rounded border border-slate-200">
                  <span className="block text-[9px] text-slate-400">الكتف</span>
                  <span className="font-bold text-slate-900">{customer.measurements?.shoulder || 46}</span>
                </div>
                <div className="bg-white p-1 rounded border border-slate-200">
                  <span className="block text-[9px] text-slate-400">الصدر</span>
                  <span className="font-bold text-slate-900">{customer.measurements?.chest || 108}</span>
                </div>
                <div className="bg-white p-1 rounded border border-slate-200">
                  <span className="block text-[9px] text-slate-400">اليد</span>
                  <span className="font-bold text-slate-900">{customer.measurements?.arm || 61}</span>
                </div>
                <div className="bg-white p-1 rounded border border-slate-200">
                  <span className="block text-[9px] text-slate-400">الرقبة</span>
                  <span className="font-bold text-slate-900">{customer.measurements?.neck || 42}</span>
                </div>
              </div>
            </div>

            {/* Orders summary */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500 flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                <span>إجمالي الطلبات: {customer.ordersCount}</span>
              </span>

              <button
                onClick={() => onSelectCustomerOrders(customer.name)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 hover:underline"
              >
                <span>عرض طلبات العميل</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
