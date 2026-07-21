export interface NavItemConfig {
  key: string;
  title?: string;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  icon?: string;
  href?: string;
  items?: NavItemConfig[];
  children?: NavItemConfig[];
  type?: string;
  // Matcher cannot be a function in order
  // to be able to use it on the server.
  // If you need to match multiple paths,
  // can extend it to accept multiple matchers.
  matcher?: { type: 'startsWith' | 'equals'; href: string };
}

export interface ChurnReport {
  msisdn: string;
  full_name: string;
  gender: string;
  age: number;
  nationality: string;
  marital_status: string;
  date_of_joining: string;
  days_active: number;
  subscriber_type: string;
  total_revenue_generated_2: string;
  average_monthly_spending_2: string;
  churn_probability: string;
  churn_risk: string;
  revenue_margin_category: string;
  data_price: string;
  sms_price: string;
  voice_price: string;
  current_pack_price: string;
  new_offer_provided: string;
  new_offer_price: string;
}
