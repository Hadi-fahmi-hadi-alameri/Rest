export type TabType = 'dashboard' | 'orders' | 'inventory' | 'financials' | 'settings';

export interface Measurements {
  length: number;    // الطول
  shoulder: number;  // الكتف
  chest: number;     // الصدر
  arm: number;       // اليد
  neck: number;      // الرقبة
  cuff?: number;     // المعصم
  expansion?: number;// التوسيع
}

export type GarmentType = 'traditional_thobe' | 'formal_shirt' | 'luxury_blazer';

export interface GarmentOption {
  id: GarmentType;
  title: string;
  badge?: string;
  description: string;
  details: string;
  basePrice: number;
}

export interface FabricRoll {
  id: string;
  code: string;
  name: string;
  origin: string;
  flag: 'JP' | 'SA' | 'UK' | 'CH' | 'KR' | 'IT';
  widthInches: number;
  colorName: string;
  remainingMeters: number;
  totalMeters: number;
  costPrice: number;
  retailPrice: number;
  stockStatus: 'available' | 'critical' | 'good' | 'medium';
  alertMessage?: string;
}

export type OrderStatus = 'new' | 'tailoring' | 'ready' | 'delivered';
export type OrderPriority = 'normal' | 'urgent';

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  isVip: boolean;
  status: OrderStatus;
  statusLabel: string;
  priority: OrderPriority;
  deliveryDate: string;
  deliveryDateLabel: string;
  garmentType: GarmentType;
  garmentTitle: string;
  garmentSubtitle: string;
  piecesCount: number;
  progressPercent: number;
  currentStageName: string;
  tailorName: string;
  tailorVerified?: boolean;
  measurements: Measurements;
  fabricRollId: string;
  fabricName: string;
  fabricCode: string;
  metersRequired: number;
  totalPrice: number;
  paidAmount: number;
  remainingAmount: number;
  notes: string;
  paymentMethod?: string;
  deliveredTime?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  dateLabel: string;
  timeLabel: string;
  description: string;
  amount: number;
  vatAmount: number;
  status: 'paid' | 'partial' | 'pending';
  paymentMethod: 'مدى' | 'تحويل بنكي' | 'نقد' | 'فيزا';
  paidAmount: number;
  remainingAmount: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  active: boolean;
  assignedOrdersCount?: number;
  initials: string;
}

export interface AuditLogItem {
  id: string;
  category: 'orders' | 'financials' | 'inventory' | 'system';
  title: string;
  timeAgo: string;
  description: string;
  actor: string;
}
