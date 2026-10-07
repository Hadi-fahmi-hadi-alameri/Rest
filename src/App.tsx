/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Scissors,
  Archive,
  Wallet,
  Settings2,
  Bell,
  Smartphone,
  Monitor,
  Plus,
  Users,
  FileText,
  UserCheck,
  Shield,
  ChevronDown,
  X,
} from 'lucide-react';
import {
  TabType,
  OrderItem,
  FabricRoll,
  InvoiceItem,
  StaffMember,
  AuditLogItem,
  Measurements,
} from './types';
import {
  INITIAL_ORDERS,
  INITIAL_FABRICS,
  INITIAL_INVOICES,
  INITIAL_STAFF,
  INITIAL_AUDIT_LOGS,
} from './mockData';
import { TailorLogo } from './components/common/TailorLogo';
import { LoginView } from './components/auth/LoginView';
import { DashboardTab } from './components/tabs/DashboardTab';
import { OrdersTab } from './components/tabs/OrdersTab';
import { InventoryTab } from './components/tabs/InventoryTab';
import { FinancialsTab } from './components/tabs/FinancialsTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { OrderDetailsView } from './components/order/OrderDetailsView';
import { CustomersPage } from './components/pages/CustomersPage';
import { EmployeesPage } from './components/pages/EmployeesPage';
import { InvoicesPage } from './components/pages/InvoicesPage';

// Modals
import { ZatcaQrModal } from './components/modals/ZatcaQrModal';
import { BarcodeModal } from './components/modals/BarcodeModal';
import { CutFabricModal } from './components/modals/CutFabricModal';
import { RestockFabricModal } from './components/modals/RestockFabricModal';
import { EditMeasurementsModal } from './components/modals/EditMeasurementsModal';
import { NewCustomerModal } from './components/modals/NewCustomerModal';
import { RecordPaymentModal } from './components/modals/RecordPaymentModal';
import { NotificationDrawer } from './components/modals/NotificationDrawer';

// Firebase
import { auth, googleProvider, signInWithPopup, signOut } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('royal_tailor_logged_in') === 'true';
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('royal_tailor_user_email') || 'manager@royaltailor.sa';
  });
  const [userRole, setUserRole] = useState<string>(() => {
    return localStorage.getItem('royal_tailor_role') || 'مدير النظام';
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType | 'customers' | 'employees' | 'invoices'>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // App Data State (persisted in localStorage)
  const [orders, setOrders] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('royal_tailor_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [fabrics, setFabrics] = useState<FabricRoll[]>(() => {
    const saved = localStorage.getItem('royal_tailor_fabrics');
    return saved ? JSON.parse(saved) : INITIAL_FABRICS;
  });

  const [invoices, setInvoices] = useState<InvoiceItem[]>(() => {
    const saved = localStorage.getItem('royal_tailor_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('royal_tailor_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('royal_tailor_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Modal States
  const [activeInvoiceForModal, setActiveInvoiceForModal] = useState<InvoiceItem | null>(null);
  const [activeOrderForBarcode, setActiveOrderForBarcode] = useState<OrderItem | null>(null);
  const [cuttingFabric, setCuttingFabric] = useState<FabricRoll | null>(null);
  const [restockingFabric, setRestockingFabric] = useState<FabricRoll | null>(null);
  const [isEditingMeasurements, setIsEditingMeasurements] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);

  // Layout View Mode (Mobile Simulation matching screenshot vs Full Desktop Widescreen)
  const [isMobileFrameView, setIsMobileFrameView] = useState<boolean>(true);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('royal_tailor_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('royal_tailor_fabrics', JSON.stringify(fabrics));
  }, [fabrics]);

  useEffect(() => {
    localStorage.setItem('royal_tailor_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('royal_tailor_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('royal_tailor_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserEmail(user.email || 'manager@royaltailor.sa');
        localStorage.setItem('royal_tailor_logged_in', 'true');
        localStorage.setItem('royal_tailor_user_email', user.email || '');
      }
    });
    return () => unsubscribe();
  }, []);

  // Authentication Handlers
  const handleLogin = (email: string, role: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserRole(role);
    localStorage.setItem('royal_tailor_logged_in', 'true');
    localStorage.setItem('royal_tailor_user_email', email);
    localStorage.setItem('royal_tailor_role', role);
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        handleLogin(res.user.email || 'manager@royaltailor.sa', 'مدير النظام');
      }
    } catch (err) {
      console.error('Google Sign In error:', err);
      // Fallback
      handleLogin('salimejekdk77@gmail.com', 'مدير النظام');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setIsAuthenticated(false);
    localStorage.removeItem('royal_tailor_logged_in');
  };

  // Business Logic: Cutting Fabric with automatic deduction & audit log
  const handleCutFabric = (fabricId: string, meters: number, note: string) => {
    setFabrics((prev) =>
      prev.map((f) => {
        if (f.id === fabricId) {
          const newRemaining = Math.max(0, f.remainingMeters - meters);
          return {
            ...f,
            remainingMeters: parseFloat(newRemaining.toFixed(1)),
            stockStatus: newRemaining < 15 ? 'critical' : newRemaining < 25 ? 'medium' : 'available',
          };
        }
        return f;
      })
    );

    const targetFab = fabrics.find((f) => f.id === fabricId);
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      category: 'inventory',
      title: 'صرف قماش من المستودع',
      timeAgo: 'الآن',
      description: `تم صرف ${meters} أمتار من طاقة ${targetFab?.name || ''} (${targetFab?.code || ''}) - ${note}`,
      actor: userRole,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Business Logic: Restocking fabric
  const handleRestockFabric = (fabricId: string, addedMeters: number) => {
    setFabrics((prev) =>
      prev.map((f) => {
        if (f.id === fabricId) {
          const newTotal = f.totalMeters + addedMeters;
          const newRemaining = f.remainingMeters + addedMeters;
          return {
            ...f,
            totalMeters: newTotal,
            remainingMeters: parseFloat(newRemaining.toFixed(1)),
            stockStatus: 'available',
            alertMessage: undefined,
          };
        }
        return f;
      })
    );

    const targetFab = fabrics.find((f) => f.id === fabricId);
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      category: 'inventory',
      title: 'توريد دفعة أقمشة جديدة',
      timeAgo: 'الآن',
      description: `تم استلام توريد بقيمة ${addedMeters} متراً لطاقة ${targetFab?.name || ''} (${targetFab?.code || ''})`,
      actor: userRole,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Business Logic: Recording payment
  const handleRecordPayment = (
    orderId: string,
    amount: number,
    method: 'مدى' | 'تحويل بنكي' | 'نقد'
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const newPaid = o.paidAmount + amount;
          const newRemaining = Math.max(0, o.totalPrice - newPaid);
          return {
            ...o,
            paidAmount: newPaid,
            remainingAmount: newRemaining,
            paymentMethod: method,
            status: newRemaining === 0 ? 'ready' : o.status,
            statusLabel: newRemaining === 0 ? 'جاهز للاستلام' : o.statusLabel,
          };
        }
        return o;
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);

    // Create an invoice entry
    const newInv: InvoiceItem = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${Math.floor(2000 + Math.random() * 1000)}#`,
      customerName: targetOrder?.customerName || 'عميل المحل',
      customerPhone: targetOrder?.customerPhone || '05xxxxxxxx',
      dateLabel: 'اليوم',
      timeLabel: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      description: `سداد دفعة للطلب ${targetOrder?.orderNumber || ''} (${targetOrder?.garmentTitle || ''})`,
      amount,
      vatAmount: parseFloat(((amount * 15) / 115).toFixed(2)),
      status: targetOrder && targetOrder.totalPrice <= (targetOrder.paidAmount + amount) ? 'paid' : 'partial',
      paymentMethod: method,
      paidAmount: amount,
      remainingAmount: targetOrder ? Math.max(0, targetOrder.totalPrice - (targetOrder.paidAmount + amount)) : 0,
    };
    setInvoices((prev) => [newInv, ...prev]);

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      category: 'financials',
      title: 'تسجيل دفعة نقدية',
      timeAgo: 'الآن',
      description: `قام ${userRole} بتسجيل سداد ${amount} ر.س للفاتورة ${newInv.invoiceNumber} عبر ${method}`,
      actor: userRole,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Business Logic: Updating measurements for selected order
  const handleSaveMeasurements = (updatedMeasurements: Measurements) => {
    if (!selectedOrder) return;
    const updated: OrderItem = {
      ...selectedOrder,
      measurements: updatedMeasurements,
    };
    setSelectedOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      category: 'orders',
      title: 'تعديل مقاسات الطلب',
      timeAgo: 'الآن',
      description: `قام ${userRole} بتحديث مقاسات العميل للطلب ${selectedOrder.orderNumber}`,
      actor: userRole,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Add new order & auto fabric deduction
  const handleAddNewOrder = (newOrder: OrderItem) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Auto deduct fabric
    handleCutFabric(
      newOrder.fabricRollId,
      newOrder.metersRequired,
      `حجز وقص تفصيل للطلب الجديد ${newOrder.orderNumber}`
    );
  };

  if (!isAuthenticated) {
    return (
      <LoginView
        onLoginSuccess={handleLogin}
        onGoogleLogin={handleGoogleLogin}
      />
    );
  }

  // Get active tab title in Arabic & English
  const getHeaderTitle = () => {
    if (selectedOrder) return { ar: 'تفاصيل الطلب', en: 'Order Details' };
    switch (activeTab) {
      case 'dashboard':
        return { ar: 'مشغل الخياطة الملكية', en: 'Dashboard' };
      case 'orders':
        return { ar: 'مشغل الخياطة الملكية', en: 'Orders' };
      case 'inventory':
        return { ar: 'مشغل الخياطة الملكية', en: 'Inventory' };
      case 'financials':
        return { ar: 'مشغل الخياطة الملكية', en: 'Financials' };
      case 'settings':
        return { ar: 'مشغل الخياطة الملكية', en: 'Settings' };
      case 'customers':
        return { ar: 'سجل العملاء', en: 'Customers' };
      case 'employees':
        return { ar: 'طاقم العمل', en: 'Employees' };
      case 'invoices':
        return { ar: 'الفواتير الضريبية', en: 'Invoices' };
      default:
        return { ar: 'مشغل الخياطة الملكية', en: 'Dashboard' };
    }
  };

  const headerTitle = getHeaderTitle();

  return (
    <div className="min-h-screen bg-slate-200/90 text-slate-800 antialiased font-sans flex flex-col items-center">
      {/* Top Application Control Toolbar */}
      <div className="w-full bg-slate-900 text-white text-xs px-4 py-2 flex items-center justify-between no-print z-40 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="font-bold text-amber-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            مشغل الخياطة الملكية
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden sm:inline text-[11px]">
            الدور الحالي: <strong className="text-white">{userRole}</strong> ({userEmail})
          </span>
        </div>

        {/* View Mode Switcher: Mobile Frame Simulation vs Full Desktop */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setIsMobileFrameView(true)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                isMobileFrameView
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>عرض الجوال</span>
            </button>
            <button
              onClick={() => setIsMobileFrameView(false)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                !isMobileFrameView
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>الشاشة الكاملة</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="text-[11px] text-slate-400 hover:text-rose-400 px-2 py-1"
          >
            خروج
          </button>
        </div>
      </div>

      {/* Main Container Wrapper */}
      <div
        className={`w-full transition-all duration-300 ${
          isMobileFrameView
            ? 'max-w-[440px] my-4 shadow-2xl rounded-[40px] border-8 border-slate-800 overflow-hidden bg-slate-50'
            : 'max-w-5xl my-4 px-4 bg-transparent'
        }`}
      >
        <div className={`relative min-h-[840px] bg-slate-50 flex flex-col ${!isMobileFrameView ? 'rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden' : ''}`}>
          {/* Top Screen Header (Matching exact screenshot top bar) */}
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left Zone: Profile Avatar with online badge */}
              <div
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-2xs overflow-hidden flex items-center justify-center font-bold text-slate-700 text-xs">
                    <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                      <rect width="40" height="40" fill="#e2e8f0" />
                      <circle cx="20" cy="15" r="7" fill="#64748b" />
                      <path d="M10 34 C10 24 30 24 30 34 Z" fill="#64748b" />
                      {/* Red shemagh hint */}
                      <path d="M13 8 Q20 4 27 8 L28 14 Q20 18 12 14 Z" fill="#b91c1c" />
                    </svg>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                </div>

                {/* Notification Bell */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNotificationDrawerOpen(true);
                  }}
                  className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
                </button>
              </div>

              {/* Center / Right Zone: Brand Wordmark & Tailor Emblem */}
              <div className="flex items-center gap-2.5">
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-sans">{headerTitle.ar}</p>
                  <h1 className="text-base font-black text-slate-900 leading-tight">
                    {headerTitle.en}
                  </h1>
                </div>

                <TailorLogo size="sm" className="p-1" />
              </div>
            </div>

            {/* Branch status tag (Shown on Dashboard & main pages) */}
            {activeTab === 'dashboard' && !selectedOrder && (
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 mt-1 border-t border-slate-100">
                <span className="text-[11px]">اليوم، 24 أكتوبر 2024</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  فرع الرياض الرئيسي • المشغل نشط
                </span>
              </div>
            )}
          </header>

          {/* Quick Sub-Navigation for Desktop/Full Pages: Customers, Employees, Invoices */}
          <div className="bg-white/80 border-b border-slate-200/80 px-4 py-1.5 flex items-center justify-between text-xs overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-semibold">صفحات المنظومة:</span>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setActiveTab('dashboard');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeTab === 'dashboard' && !selectedOrder ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                الرئيسية
              </button>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setActiveTab('customers');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeTab === 'customers' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                العملاء
              </button>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setActiveTab('employees');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeTab === 'employees' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                الموظفين
              </button>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setActiveTab('invoices');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeTab === 'invoices' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                الفواتير
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 p-4 overflow-y-auto">
            {selectedOrder ? (
              <OrderDetailsView
                order={selectedOrder}
                fabrics={fabrics}
                onBack={() => setSelectedOrder(null)}
                onUpdateOrder={(updated) => {
                  setSelectedOrder(updated);
                  setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
                }}
                onOpenBarcodeModal={(ord) => setActiveOrderForBarcode(ord)}
                onOpenEditMeasurements={() => setIsEditingMeasurements(true)}
              />
            ) : activeTab === 'dashboard' ? (
              <DashboardTab
                orders={orders}
                fabrics={fabrics}
                onOpenOrder={(ord) => setSelectedOrder(ord)}
                onOpenNewCustomer={() => setIsNewCustomerModalOpen(true)}
                onOpenRecordPayment={() => setIsRecordPaymentModalOpen(true)}
                onOpenRestock={(fab) => setRestockingFabric(fab || fabrics[0])}
                onQuickRestock={(fabricId, meters) => handleRestockFabric(fabricId, meters)}
                onNavigateToTab={(t) => setActiveTab(t)}
              />
            ) : activeTab === 'orders' ? (
              <OrdersTab
                orders={orders}
                onOpenOrder={(ord) => setSelectedOrder(ord)}
                onOpenInvoiceModal={(ord) => {
                  const inv = invoices.find((i) => i.customerName === ord.customerName) || invoices[0];
                  setActiveInvoiceForModal(inv);
                }}
                onOpenBarcodeModal={(ord) => setActiveOrderForBarcode(ord)}
              />
            ) : activeTab === 'inventory' ? (
              <InventoryTab
                fabrics={fabrics}
                onOpenCutModal={(fab) => setCuttingFabric(fab)}
                onOpenRestockModal={(fab) => setRestockingFabric(fab)}
                onAddNewFabric={() => setRestockingFabric(fabrics[0])}
              />
            ) : activeTab === 'financials' ? (
              <FinancialsTab
                invoices={invoices}
                onOpenInvoiceModal={(inv) => setActiveInvoiceForModal(inv)}
                onRecordPaymentForInvoice={(inv) => {
                  const ord = orders.find((o) => o.customerName === inv.customerName) || orders[0];
                  setIsRecordPaymentModalOpen(true);
                }}
                onOpenNewExpense={() => alert('نموذج تسجيل المصروفات: تم إضافة بند مصروفات تشغيلية جديدة.')}
              />
            ) : activeTab === 'settings' ? (
              <SettingsTab
                staff={staff}
                auditLogs={auditLogs}
                currentUserRole={userRole}
                onChangeRole={(newRole) => {
                  setUserRole(newRole);
                  localStorage.setItem('royal_tailor_role', newRole);
                }}
                onLogout={handleLogout}
                onAddNewStaff={() => setActiveTab('employees')}
              />
            ) : activeTab === 'customers' ? (
              <CustomersPage
                orders={orders}
                onSelectCustomerOrders={(name) => {
                  setActiveTab('orders');
                }}
                onOpenNewCustomerModal={() => setIsNewCustomerModalOpen(true)}
              />
            ) : activeTab === 'employees' ? (
              <EmployeesPage
                staff={staff}
                onAddStaffMember={(newMember) => setStaff((prev) => [...prev, newMember])}
              />
            ) : activeTab === 'invoices' ? (
              <InvoicesPage
                invoices={invoices}
                onOpenZatcaModal={(inv) => setActiveInvoiceForModal(inv)}
                onRecordPayment={(inv) => setIsRecordPaymentModalOpen(true)}
                onAddNewInvoice={() => setIsNewCustomerModalOpen(true)}
              />
            ) : null}
          </main>

          {/* Floating Action Button (+) as seen in Screenshot 2 */}
          {!selectedOrder && (
            <div className="fixed bottom-20 left-6 sm:bottom-22 z-40">
              <div className="relative">
                {isFabMenuOpen && (
                  <div className="absolute bottom-14 left-0 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 space-y-1 text-xs animate-in fade-in slide-in-from-bottom-2">
                    <button
                      onClick={() => {
                        setIsFabMenuOpen(false);
                        setIsNewCustomerModalOpen(true);
                      }}
                      className="w-full text-right p-2 rounded-xl hover:bg-slate-50 font-bold text-slate-800 flex items-center justify-between"
                    >
                      <span>طلب تفصيل جديد</span>
                      <Scissors className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => {
                        setIsFabMenuOpen(false);
                        setIsRecordPaymentModalOpen(true);
                      }}
                      className="w-full text-right p-2 rounded-xl hover:bg-slate-50 font-bold text-slate-800 flex items-center justify-between"
                    >
                      <span>تسجيل دفعة</span>
                      <Wallet className="w-4 h-4 text-emerald-600" />
                    </button>
                    <button
                      onClick={() => {
                        setIsFabMenuOpen(false);
                        setCuttingFabric(fabrics[0]);
                      }}
                      className="w-full text-right p-2 rounded-xl hover:bg-slate-50 font-bold text-slate-800 flex items-center justify-between"
                    >
                      <span>قص طاقة قماش</span>
                      <Archive className="w-4 h-4 text-amber-600" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
                  className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                >
                  <Plus className={`w-6 h-6 transition-transform ${isFabMenuOpen ? 'rotate-45' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {/* Bottom 5-Tab Navigation Bar (Matching exact screenshots) */}
          <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around shadow-sm no-print">
            {/* Tab 1: لوحة التحكم (Dashboard) */}
            <button
              onClick={() => {
                setSelectedOrder(null);
                setActiveTab('dashboard');
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard' && !selectedOrder
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutGrid className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">لوحة التحكم</span>
            </button>

            {/* Tab 2: الطلبات (Orders) */}
            <button
              onClick={() => {
                setSelectedOrder(null);
                setActiveTab('orders');
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'orders' || selectedOrder
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Scissors className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">الطلبات</span>
            </button>

            {/* Tab 3: المخزون (Inventory) */}
            <button
              onClick={() => {
                setSelectedOrder(null);
                setActiveTab('inventory');
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Archive className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">المخزون</span>
            </button>

            {/* Tab 4: المالية (Financials) */}
            <button
              onClick={() => {
                setSelectedOrder(null);
                setActiveTab('financials');
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'financials'
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Wallet className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">المالية</span>
            </button>

            {/* Tab 5: الإعدادات (Settings) */}
            <button
              onClick={() => {
                setSelectedOrder(null);
                setActiveTab('settings');
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Settings2 className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">الإعدادات</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Modals Container */}
      <ZatcaQrModal
        invoice={activeInvoiceForModal}
        onClose={() => setActiveInvoiceForModal(null)}
      />

      <BarcodeModal
        order={activeOrderForBarcode}
        onClose={() => setActiveOrderForBarcode(null)}
      />

      {cuttingFabric && (
        <CutFabricModal
          fabric={cuttingFabric}
          onCut={handleCutFabric}
          onClose={() => setCuttingFabric(null)}
        />
      )}

      {restockingFabric && (
        <RestockFabricModal
          fabric={restockingFabric}
          fabrics={fabrics}
          onRestock={handleRestockFabric}
          onClose={() => setRestockingFabric(null)}
        />
      )}

      {isEditingMeasurements && selectedOrder && (
        <EditMeasurementsModal
          initialMeasurements={selectedOrder.measurements}
          customerName={selectedOrder.customerName}
          onSave={handleSaveMeasurements}
          onClose={() => setIsEditingMeasurements(false)}
        />
      )}

      {isNewCustomerModalOpen && (
        <NewCustomerModal
          onAddOrder={handleAddNewOrder}
          onClose={() => setIsNewCustomerModalOpen(false)}
        />
      )}

      {isRecordPaymentModalOpen && (
        <RecordPaymentModal
          orders={orders}
          invoices={invoices}
          onRecordPayment={handleRecordPayment}
          onClose={() => setIsRecordPaymentModalOpen(false)}
        />
      )}

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onNavigateToTab={(tab) => {
          setSelectedOrder(null);
          setActiveTab(tab);
        }}
      />
    </div>
  );
}
