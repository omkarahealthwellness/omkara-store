// ============================================================
// OMKARA — Shared Type Definitions
// ============================================================

export type { Category } from './category';
export type { 
  Product, 
  ProductVariant, 
  ProductAddon, 
  ProductNotesConfig,
  AddonSelectionType 
} from './product';
export type { CartItem, Cart } from './cart';
export type { 
  SiteConfig, 
  ContactInfo, 
  WhatsAppConfig, 
  HeroConfig, 
  FooterConfig,
  FooterLinkGroup,
  NavigationItem,
  SocialLink,
  AnnouncementConfig
} from './config';
export type { ContentPage } from './content';
export type { Order, OrderItem } from './order';

// Re-export const objects and their types
export { AvailabilityState, ORDERABLE_STATES, isOrderable } from './availability';
export type { AvailabilityState as AvailabilityStateType } from './availability';
export { OrderStatus } from './order';
export type { OrderStatus as OrderStatusType } from './order';
