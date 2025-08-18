import { 
  integer, 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  boolean, 
  decimal, 
  json,
  uuid,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const orderStatusEnum = pgEnum('order_status', ['pending', 'approved', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'verified', 'failed']);

export const adminsTable = pgTable('admins', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const categoriesTable = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  slug: text('slug').notNull().unique(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const productsTable = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
  sku: text('sku').notNull().unique(),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categoriesTable.id, { onDelete: 'cascade' }),
  images: json('images').$type<string[]>(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const offersTable = pgTable('offers', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  discountPercentage: decimal('discount_percentage', { precision: 5, scale: 2 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const productOffersTable = pgTable('product_offers', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .notNull()
    .references(() => productsTable.id, { onDelete: 'cascade' }),
  offerId: integer('offer_id')
    .notNull()
    .references(() => offersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password'), // Optional for OTP-only users
  name: text('name').notNull(),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zipCode: text('zip_code'),
  country: text('country').notNull().default('US'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const cartTable = pgTable('cart', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const cartItemsTable = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  cartId: uuid('cart_id')
    .notNull()
    .references(() => cartTable.id, { onDelete: 'cascade' }),
  productId: integer('product_id')
    .notNull()
    .references(() => productsTable.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const ordersTable = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  status: orderStatusEnum('status').notNull().default('pending'),
  paymentStatus: paymentStatusEnum('payment_status').notNull().default('pending'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  tax: decimal('tax', { precision: 10, scale: 2 }).notNull().default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  shippingAddress: json('shipping_address').$type<{
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  }>(),
  billingAddress: json('billing_address').$type<{
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>(),
  paymentDetails: json('payment_details').$type<{
    method: string;
    reference?: string;
    notes?: string;
  }>(),
  adminNotes: text('admin_notes'),
  emailSent: boolean('email_sent').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const orderItemsTable = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .notNull()
    .references(() => ordersTable.id, { onDelete: 'cascade' }),
  productId: integer('product_id')
    .notNull()
    .references(() => productsTable.id, { onDelete: 'cascade' }),
  productName: text('product_name').notNull(),
  productSku: text('product_sku').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const orderStatusHistoryTable = pgTable('order_status_history', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .notNull()
    .references(() => ordersTable.id, { onDelete: 'cascade' }),
  status: orderStatusEnum('status').notNull(),
  paymentStatus: paymentStatusEnum('payment_status').notNull(),
  notes: text('notes'),
  changedBy: text('changed_by').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  products: many(productsTable),
}));

export const productsRelations = relations(productsTable, ({ one, many }) => ({
  category: one(categoriesTable, {
    fields: [productsTable.categoryId],
    references: [categoriesTable.id],
  }),
  cartItems: many(cartItemsTable),
  orderItems: many(orderItemsTable),
  productOffers: many(productOffersTable),
}));

export const offersRelations = relations(offersTable, ({ many }) => ({
  productOffers: many(productOffersTable),
}));

export const productOffersRelations = relations(productOffersTable, ({ one }) => ({
  product: one(productsTable, {
    fields: [productOffersTable.productId],
    references: [productsTable.id],
  }),
  offer: one(offersTable, {
    fields: [productOffersTable.offerId],
    references: [offersTable.id],
  }),
}));

export const usersRelations = relations(usersTable, ({ many }) => ({
  orders: many(ordersTable),
  cart: many(cartTable),
}));

export const cartRelations = relations(cartTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [cartTable.userId],
    references: [usersTable.id],
  }),
  items: many(cartItemsTable),
}));

export const cartItemsRelations = relations(cartItemsTable, ({ one }) => ({
  cart: one(cartTable, {
    fields: [cartItemsTable.cartId],
    references: [cartTable.id],
  }),
  product: one(productsTable, {
    fields: [cartItemsTable.productId],
    references: [productsTable.id],
  }),
}));

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [ordersTable.userId],
    references: [usersTable.id],
  }),
  items: many(orderItemsTable),
  statusHistory: many(orderStatusHistoryTable),
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.orderId],
    references: [ordersTable.id],
  }),
  product: one(productsTable, {
    fields: [orderItemsTable.productId],
    references: [productsTable.id],
  }),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistoryTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderStatusHistoryTable.orderId],
    references: [ordersTable.id],
  }),
}));

export type Admin = typeof adminsTable.$inferSelect;
export type InsertAdmin = typeof adminsTable.$inferInsert;

export type Category = typeof categoriesTable.$inferSelect;
export type InsertCategory = typeof categoriesTable.$inferInsert;

export type Product = typeof productsTable.$inferSelect;
export type InsertProduct = typeof productsTable.$inferInsert;

export type Offer = typeof offersTable.$inferSelect;
export type InsertOffer = typeof offersTable.$inferInsert;

export type ProductOffer = typeof productOffersTable.$inferSelect;
export type InsertProductOffer = typeof productOffersTable.$inferInsert;

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

export type Cart = typeof cartTable.$inferSelect;
export type InsertCart = typeof cartTable.$inferInsert;

export type CartItem = typeof cartItemsTable.$inferSelect;
export type InsertCartItem = typeof cartItemsTable.$inferInsert;

export type Order = typeof ordersTable.$inferSelect;
export type InsertOrder = typeof ordersTable.$inferInsert;

export type OrderItem = typeof orderItemsTable.$inferSelect;
export type InsertOrderItem = typeof orderItemsTable.$inferInsert;

export type OrderStatusHistory = typeof orderStatusHistoryTable.$inferSelect;
export type InsertOrderStatusHistory = typeof orderStatusHistoryTable.$inferInsert;
