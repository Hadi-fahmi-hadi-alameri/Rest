import React, { useState } from 'react';
import {
  Search,
  ScanBarcode,
  Phone,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  Clock,
  Send,
  Receipt,
  Star,
  Check,
} from 'lucide-react';
import { OrderItem } from '../../types';

interface OrdersTabProps {
  orders: OrderItem[];
  onOpenOrder: (order: OrderItem) => void;
  onOpenInvoiceModal: (order: OrderItem) => void;
  onOpenBarcodeModal: (order: OrderItem) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  onOpenOrder,
  onOpenInvoiceModal,
  onOpenBarcodeModal,
}) => {
  const [filter, setFilter] = useState<'all' | 'ready' | 'new' | 'tailoring' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'delivery'>('newest');
  const [notificationSent, setNotificationSent] = useState<string | null>(null);

  // Filter criteria
  const filteredOrders = orders.filter((o) => {
    if (filter === 'ready' && o.status !== 'ready') return false;
    if (filter === 'new' && o.status !== 'new') return false;
    if (filter === 'tailoring' && o.status !== 'tailoring') return false;
    if (filter === 'delivered' && o.status !== 'delivered') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      return matchName || matchPhone || matchNum;
    }

    return true;
  });

  const handleSendReadyNotification = (order: OrderItem) => {
    setNotificationSent(order.id);
    const msg = `مرحباً بك يا سيد ${order.customerName}، نفيدك بأن ثوبك رقم (${order.orderNumber}) في مشغل الخياطة الملكية أصبح جاهزاً للاستلام!`;
    const encoded = encodeURIComponent(msg);
    // WhatsApp URL or alert
    window.open(`https://wa.me/966${order.customerPhone.replace(/^0/, '')}?text=${encoded}`, '_blank');
    setTimeout(() => setNotificationSent(null), 3000);
  };

  const handleCallCustomer = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="space-y-3 pb-24">
      {/* Search Bar with Barcode Scanner Button */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث برقم الطلب، اسم العميل، أو رقم الجوال..."
          className="w-full pl-12 pr-10 py-3 text-xs bg-white border border-slate-200 rounded-2xl shadow-2xs focus:border-blue-500 focus:outline-none placeholder:text-slate-400"
        />
        <Search className="absolute right-3.5 w-4 h-4 text-slate-400" />
        <button
          onClick={() => {
            if (orders[0]) onOpenBarcodeModal(orders[0]);
          }}
          title="مسح الباركود"
          className="absolute left-2.5 p-1.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <ScanBarcode className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          الكل (34)
        </button>
        <button
          onClick={() => setFilter('ready')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            filter === 'ready'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          جاهز للاستلام (14)
        </button>
        <button
          onClick={() => setFilter('new')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            filter === 'new'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          جديد (8)
        </button>
        <button
          onClick={() => setFilter('tailoring')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            filter === 'tailoring'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          قيد التفصيل (6)
        </button>
        <button
          onClick={() => setFilter('delivered')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            filter === 'delivered'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          تم التسليم (6)
        </button>
      </div>

      {/* Sort and Count Sub-bar */}
      <div className="flex items-center justify-between text-xs py-1">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>المعروض: {filteredOrders.length} طلبات نشطة</span>
        </div>
        <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200 text-[11px]">
          <button
            onClick={() => setSortBy('newest')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              sortBy === 'newest' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            الأحدث
          </button>
          <button
            onClick={() => setSortBy('delivery')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              sortBy === 'delivery' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            موعد التسليم
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => {
          const isReady = order.status === 'ready';
          const isDelivered = order.status === 'delivered';
          const isNew = order.status === 'new';

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3 relative hover:border-blue-300 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center ${
                      isReady
                        ? 'bg-emerald-100 text-emerald-800'
                        : isDelivered
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {order.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm">{order.customerName}</h4>
                      {order.isVip && (
                        <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          عميل مميز
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="font-mono text-blue-600 font-medium">{order.orderNumber}</span>
                      {order.priority === 'urgent' && (
                        <span className="text-rose-600 font-bold text-[11px]">• طلب مستعجل</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {isReady && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      جاهز للاستلام
                    </span>
                  )}
                  {isNew && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      جديد
                    </span>
                  )}
                  {order.status === 'tailoring' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                      قيد التفصيل
                    </span>
                  )}
                  {isDelivered && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-bold">
                      <Check className="w-3.5 h-3.5" />
                      تم التسليم
                    </span>
                  )}
                </div>
              </div>

              {/* Garment Details Box */}
              <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{order.garmentTitle}</span>
                  <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    قطعة {order.piecesCount}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{order.garmentSubtitle}</p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-600 font-medium">{order.currentStageName}</span>
                  <span className="font-bold text-slate-800 tabular-nums">%{order.progressPercent}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isReady ? 'bg-emerald-500' : isDelivered ? 'bg-slate-400' : 'bg-blue-600'
                    }`}
                    style={{ width: `${order.progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Date & Balance Info */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {isDelivered ? `تم التسليم: ${order.deliveredTime || 'أمس'}` : `الموعد: ${order.deliveryDateLabel}`}
                  </span>
                </div>
                <div>
                  {order.remainingAmount > 0 ? (
                    <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-xs">
                      المتبقي: {order.remainingAmount} ر.س
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      خالص بالكامل
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onOpenOrder(order)}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <span>التفاصيل الكاملة</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleCallCustomer(order.customerPhone)}
                  title="اتصال هاتفي"
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                </button>

                {isReady && (
                  <button
                    onClick={() => handleSendReadyNotification(order)}
                    title="إرسال إشعار الجاهزية واتساب"
                    className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إشعار الجاهزية</span>
                  </button>
                )}

                {isDelivered && (
                  <button
                    onClick={() => onOpenInvoiceModal(order)}
                    title="عرض الفاتورة الضريبية"
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>الفاتورة</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
