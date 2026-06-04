export interface Product {
  product_id: string | number;
  name: string;
  generic_name?: string;
  brand_name?: string;
  salt?: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage?: number;
  image?: string;
  description?: string;
  manufacturer?: string;
  pack_size?: string;
  composition?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  alternatives?: Product[];
  rating?: number;
  reviews_count?: number;
}

export interface Category {
  category_id: string | number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subcategories?: Category[];
}

export interface Blog {
  blog_id: string | number;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  image?: string;
  author?: string;
  date_published: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserProfile {
  customer_id: string;
  customer_name?: string;
  email?: string;
  phone_number: string;
  location?: string;
  profile_picture?: string;
  isLoggedIn: boolean;
}

export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface OrderSummary {
  totalAmount: number;
  totalMRP: number;
  totalSavings: number;
  total_selling_price: number;
  total_shipping_charge: number;
  total_cod_charge: number;
}

export interface Order {
  order_id: string | number;
  custom_order_id: string;
  items: Array<{
    name: string;
    salt: string;
    quantity: number;
    price_per_unit: number;
    total_price: number;
  }>;
  address: Address;
  orderSummary: OrderSummary;
  payment_done_date: string;
}
