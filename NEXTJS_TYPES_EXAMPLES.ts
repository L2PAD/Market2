// TypeScript типы для Next.js проекта
// Файл: types/api.ts

// ============= AUTH =============

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'seller' | 'admin';
  phone?: string;
  address?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  delivery_method?: 'nova_poshta' | 'ukrposhta' | 'courier' | 'self_pickup';
  np_department?: string;
  created_at: string;
  verified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role?: 'customer' | 'seller';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ============= PRODUCTS =============

export interface Specification {
  group: string;
  key: string;
  value: string;
}

export interface Product {
  id: string;
  seller_id: string;
  title: string;
  slug: string;
  description: string;
  description_html?: string;
  short_description?: string;
  category_id: string;
  category_name?: string;
  price: number;
  compare_price?: number;
  currency: string;
  stock_level: number;
  images: string[];
  videos?: string[];
  specifications?: Specification[];
  status: 'published' | 'draft';
  rating: number;
  reviews_count: number;
  installment_months?: number;
  installment_available: boolean;
  views_count: number;
  is_bestseller: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCreateRequest {
  title: string;
  description: string;
  category_id: string;
  price: number;
  stock_level: number;
  images: string[];
  specifications?: Specification[];
}

// ============= CATEGORIES =============

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  image_url?: string;
  created_at: string;
}

// ============= CART =============

export interface CartItem {
  product_id: string;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

// ============= ORDERS =============

export interface OrderItem {
  product_id: string;
  title: string;
  quantity: number;
  price: number;
  seller_id: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  shipping_address: ShippingAddress;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  payment_method?: string;
  created_at: string;
  updated_at: string;
}

// ============= HERO SLIDES =============

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  type: 'banner' | 'product';
  product_id?: string;
  image_url?: string;
  background_gradient?: string;
  promo_text?: string;
  button_text?: string;
  button_link?: string;
  countdown_enabled: boolean;
  countdown_end_date?: string;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// ============= POPULAR CATEGORIES =============

export interface PopularCategory {
  id: string;
  name: string;
  icon: string;  // emoji
  order: number;
  active: boolean;
  created_at: string;
}

// ============= ACTUAL OFFERS =============

export interface ActualOffer {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  description_html?: string;
  image_url: string;
  banner_image_url?: string;
  link_url: string;
  product_ids: string[];
  background_color: string;
  text_color: string;
  position: number;
  order: number;
  active: boolean;
  created_at: string;
}

export interface ActualOfferDetail extends ActualOffer {
  products: Product[];
}

// ============= CRM =============

export type CustomerSegment = 'VIP' | 'Active' | 'Regular' | 'At Risk' | 'Inactive' | 'New';

export interface CRMCustomer {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  city?: string;
  total_orders: number;
  total_spent: number;
  avg_order_value: number;
  last_order_date?: string;
  days_since_last_order?: number;
  segment: CustomerSegment;
  notes_count: number;
  tasks_count: number;
  pending_tasks: number;
  has_abandoned_cart: boolean;
}

export interface CustomerNote {
  id: string;
  customer_id: string;
  author_id: string;
  author_name: string;
  note: string;
  type: 'general' | 'call' | 'email' | 'meeting' | 'complaint' | 'order_update';
  created_at: string;
}

export interface CRMTask {
  id: string;
  title: string;
  description?: string;
  customer_id?: string;
  assigned_to: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  type: 'follow_up' | 'call' | 'email' | 'meeting';
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: 'website' | 'referral' | 'social' | 'ads' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  interest?: string;
  notes?: string;
  assigned_to?: string;
  converted_to_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CRMDashboard {
  sales_funnel: {
    total_users: number;
    users_with_cart: number;
    users_with_orders: number;
    repeat_customers: number;
    cart_conversion: number;
    overall_conversion: number;
    repeat_rate: number;
  };
  customer_segments: Record<CustomerSegment, number>;
  customer_activity: {
    new_customers: number;
    orders_placed: number;
    active_customers: number;
    period_days: number;
  };
  pending_tasks: number;
  overdue_tasks: number;
  new_customers_week: number;
}

// ============= ANALYTICS =============

export interface AdminStats {
  total_revenue: number;
  total_orders: number;
  total_users: number;
  total_products: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface TopProduct {
  product_id: string;
  product_name: string;
  total_sold: number;
  revenue: number;
}

// ============= API RESPONSE WRAPPERS =============

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface ApiError {
  detail: string;
  status: number;
}

// ============= QUERY PARAMS =============

export interface ProductsQueryParams {
  limit?: number;
  skip?: number;
  category_id?: string;
  sort_by?: 'popularity' | 'newest' | 'price_asc' | 'price_desc';
  search?: string;
  bestsellers?: boolean;
}
