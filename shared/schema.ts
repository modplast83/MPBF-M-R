import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  doublePrecision,
  numeric,
  unique,
  varchar,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Cliché (Plate) Price Calculations related schemas

// Categories table
export const categories = pgTable("categories", {
  id: text("id").primaryKey(), // CID in the provided schema
  name: text("name").notNull(), // Category Name
  code: text("code").notNull().unique(), // Category Code
});

export const insertCategorySchema = createInsertSchema(categories);
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Items table
export const items = pgTable("items", {
  id: text("id").primaryKey(), // ItemID
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id), // CategoriesID
  name: text("name").notNull(), // Items Name
  fullName: text("full_name").notNull(), // Item Full Name
});

export const insertItemSchema = createInsertSchema(items);
export type InsertItem = z.infer<typeof insertItemSchema>;
export type Item = typeof items.$inferSelect;

// Sections table
export const sections = pgTable("sections", {
  id: text("id").primaryKey(), // Section ID
  name: text("name").notNull(), // Section Name
});

export const insertSectionSchema = createInsertSchema(sections);
export type InsertSection = z.infer<typeof insertSectionSchema>;
export type Section = typeof sections.$inferSelect;

// Master Batch table
export const masterBatches = pgTable("master_batches", {
  id: text("id").primaryKey(), // MasterBatch ID
  name: text("name").notNull(), // Master Batch
});

export const insertMasterBatchSchema = createInsertSchema(masterBatches);
export type InsertMasterBatch = z.infer<typeof insertMasterBatchSchema>;
export type MasterBatch = typeof masterBatches.$inferSelect;

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table with employee profile data
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(), // UID
  username: varchar("username").unique().notNull(), // Username
  password: text("password"), // Password - hashed
  email: varchar("email").unique(), // Email
  firstName: varchar("first_name"), // First name
  lastName: varchar("last_name"), // Last name
  bio: text("bio"), // Bio
  profileImageUrl: varchar("profile_image_url"), // Profile image URL
  isAdmin: boolean("is_admin").default(false).notNull(), // True for administrators, false for regular users
  phone: text("phone"),
  isActive: boolean("is_active").default(true),
  sectionId: text("section_id").references(() => sections.id), // UserSection

  // Employee profile fields (moved from employee_profiles table)
  position: text("position"), // Job position
  hireDate: timestamp("hire_date"), // Hire date
  contractType: text("contract_type").default("full_time"), // full_time, part_time, contract, intern
  workSchedule: jsonb("work_schedule"), // working hours, days off, shift patterns
  emergencyContact: jsonb("emergency_contact"), // Emergency contact information
  bankDetails: jsonb("bank_details"), // Banking information
  allowances: jsonb("allowances"), // transport, housing, etc.

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const upsertUserSchema = createInsertSchema(users);
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true })
  .extend({
    hireDate: z
      .union([
        z.date(),
        z.string().transform((str) => (str ? new Date(str) : null)),
        z.null(),
      ])
      .optional(),
  });
export type UpsertUser = typeof users.$inferInsert;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Customers table
export const customers = pgTable("customers", {
  id: text("id").primaryKey(), // CID
  code: text("code").notNull().unique(), // Customer Code
  name: text("name").notNull(), // Customer Name
  nameAr: text("name_ar"), // Customer Name Ar
  userId: text("user_id").references(() => users.id), // UserID (Sales)
  plateDrawerCode: text("plate_drawer_code"), // Plate Drawer Code
});

export const insertCustomerSchema = createInsertSchema(customers);
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

// Customer Products table
export const customerProducts = pgTable(
  "customer_products",
  {
    id: serial("id").primaryKey(), // CPID
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id), // Customer ID
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id), // CategoryID
    itemId: text("item_id")
      .notNull()
      .references(() => items.id), // ItemID
    sizeCaption: text("size_caption"), // Size Caption
    width: doublePrecision("width"), // Width
    leftF: doublePrecision("left_f"), // Left F
    rightF: doublePrecision("right_f"), // Right F
    thickness: doublePrecision("thickness"), // Thickness
    thicknessOne: doublePrecision("thickness_one"), // Thickness One
    printingCylinder: doublePrecision("printing_cylinder"), // Printing Cylinder (Inch)
    lengthCm: doublePrecision("length_cm"), // Length (Cm)
    cuttingLength: doublePrecision("cutting_length_cm"), // Cutting Length (CM)
    rawMaterial: text("raw_material"), // Raw Material
    masterBatchId: text("master_batch_id").references(() => masterBatches.id), // Master Batch ID
    printed: text("printed"), // Printed
    cuttingUnit: text("cutting_unit"), // Cutting Unit
    unitWeight: doublePrecision("unit_weight_kg"), // Unit Weight (Kg)
    unitQty: doublePrecision("unit_qty"), // Unit Qty
    packageKg: doublePrecision("package_kg"), // Package Kg (auto-calculated)
    packing: text("packing"), // Packing
    punching: text("punching"), // Punching
    cover: text("cover"), // Cover
    volum: text("volum"), // Volum
    knife: text("knife"), // Knife
    notes: text("notes"), // Notes
  },
  (table) => {
    return {
      customerProductUnique: unique().on(table.customerId, table.itemId),
    };
  },
);

export const insertCustomerProductSchema = createInsertSchema(customerProducts)
  .omit({ id: true })
  .extend({
    width: z
      .union([z.number(), z.string()])
      .transform((val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      )
      .nullable(),
    leftF: z
      .union([z.number(), z.string()])
      .transform((val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      )
      .nullable(),
    rightF: z
      .union([z.number(), z.string()])
      .transform((val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      )
      .nullable(),
    thickness: z
      .union([z.number(), z.string()])
      .transform((val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      )
      .nullable(),
    thicknessOne: z
      .union([z.number(), z.string()])
      .transform((val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      )
      .nullable(),
    printingCylinder: z
      .union([z.number(), z.string()])
      .transform((val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      )
      .nullable(),
    lengthCm: z
      .union([z.number(), z.string()])
      .transform((val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      )
      .nullable(),
    cuttingLength: z
      .union([z.number(), z.string()])
      .transform((val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      )
      .nullable(),
    unitWeight: z
      .union([z.number(), z.string()])
      .transform((val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      )
      .nullable(),
    unitQty: z
      .union([z.number(), z.string()])
      .transform((val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      )
      .nullable(),
    packageKg: z
      .union([z.number(), z.string()])
      .transform((val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      )
      .nullable(),
    volum: z
      .union([z.number(), z.string()])
      .transform((val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      )
      .nullable(),
  });
export type InsertCustomerProduct = z.infer<typeof insertCustomerProductSchema>;
export type CustomerProduct = typeof customerProducts.$inferSelect;

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(), // ID
  date: timestamp("date").defaultNow().notNull(), // Order Date
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id), // Customer ID
  note: text("note"), // Order Note
  status: text("status").notNull().default("pending"), // Status (pending, processing, completed)
  userId: text("user_id").references(() => users.id), // Created by
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  date: true,
  status: true,
  userId: true,
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Job Orders table
export const jobOrders = pgTable(
  "job_orders",
  {
    id: serial("id").primaryKey(), // ID
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }), // Order ID
    customerProductId: integer("customer_product_id")
      .notNull()
      .references(() => customerProducts.id), // Customer Product No
    quantity: doublePrecision("quantity").notNull(), // Qty Kg
    finishedQty: doublePrecision("finished_qty").default(0).notNull(), // Finished quantity (kg)
    receivedQty: doublePrecision("received_qty").default(0).notNull(), // Received quantity (kg)
    status: text("status").default("pending").notNull(), // Status (pending, in_progress, extrusion_completed, completed, cancelled, received, partially_received)
    customerId: text("customer_id").references(() => customers.id), // Customer ID
    receiveDate: timestamp("receive_date"), // Date when received in warehouse
    receivedBy: text("received_by").references(() => users.id), // User who received the job order
  },
  (table) => {
    return {
      jobOrderUnique: unique().on(table.orderId, table.customerProductId),
    };
  },
);

export const insertJobOrderSchema = createInsertSchema(jobOrders).omit({
  id: true,
});
export type InsertJobOrder = z.infer<typeof insertJobOrderSchema>;
export type JobOrder = typeof jobOrders.$inferSelect;

// Job Order Updates for Desktop Notifications
export const jobOrderUpdates = pgTable("job_order_updates", {
  id: serial("id").primaryKey(),
  jobOrderId: integer("job_order_id")
    .notNull()
    .references(() => jobOrders.id, { onDelete: "cascade" }),
  updateType: text("update_type").notNull(), // 'status_change', 'priority_change', 'assigned', 'completed', 'delayed', 'quality_issue'
  title: text("title").notNull(),
  message: text("message").notNull(),
  priority: text("priority").notNull().default("medium"), // 'low', 'medium', 'high', 'urgent', 'critical'
  metadata: jsonb("metadata"), // Additional data for the update
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertJobOrderUpdateSchema = createInsertSchema(jobOrderUpdates).omit({
  id: true,
  createdAt: true,
});
export type InsertJobOrderUpdate = z.infer<typeof insertJobOrderUpdateSchema>;
export type JobOrderUpdate = typeof jobOrderUpdates.$inferSelect;

// Rolls table
export const rolls = pgTable("rolls", {
  id: text("id").primaryKey(), // ID
  jobOrderId: integer("job_order_id")
    .notNull()
    .references(() => jobOrders.id, { onDelete: "cascade" }), // Job Order ID
  serialNumber: text("roll_serial").notNull(), // Roll Serial
  extrudingQty: doublePrecision("extruding_qty").default(0), // Extruding Qty
  printingQty: doublePrecision("printing_qty").default(0), // Printing Qty
  cuttingQty: doublePrecision("cutting_qty").default(0), // Cutting Qty
  currentStage: text("current_stage").notNull().default("extrusion"), // Current stage (extrusion, printing, cutting, completed)
  status: text("status").notNull().default("pending"), // Status (pending, processing, completed)
  wasteQty: doublePrecision("waste_qty").default(0), // Waste quantity in kg (difference between printing and cutting)
  wastePercentage: doublePrecision("waste_percentage").default(0), // Waste percentage
  createdById: text("created_by_id").references(() => users.id), // User who created the roll (extrusion)
  printedById: text("printed_by_id").references(() => users.id), // User who printed the roll
  cutById: text("cut_by_id").references(() => users.id), // User who cut the roll
  createdAt: timestamp("created_at").defaultNow(), // Creation timestamp
  printedAt: timestamp("printed_at"), // Printing timestamp
  cutAt: timestamp("cut_at"), // Cutting timestamp
});

export const insertRollSchema = createInsertSchema(rolls);

// Create a custom schema for roll creation API that makes id and serialNumber optional
// since they'll be auto-generated on the server
export const createRollSchema = insertRollSchema.omit({
  id: true,
  serialNumber: true,
});

export type InsertRoll = z.infer<typeof insertRollSchema>;
export type CreateRoll = z.infer<typeof createRollSchema>;
export type Roll = typeof rolls.$inferSelect;

// Modules table for system modules
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'setup', 'production', 'quality', 'warehouse', 'system', etc.
  route: text("route"), // URL route for the module
  icon: text("icon"), // Icon name for UI
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

// Section-based permissions table
export const permissions = pgTable(
  "permissions",
  {
    id: serial("id").primaryKey(),
    sectionId: text("section_id")
      .notNull()
      .references(() => sections.id),
    moduleId: integer("module_id")
      .notNull()
      .references(() => modules.id),
    canView: boolean("can_view").default(false),
    canCreate: boolean("can_create").default(false),
    canEdit: boolean("can_edit").default(false),
    canDelete: boolean("can_delete").default(false),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    uniqueIndex: unique().on(table.sectionId, table.moduleId),
  }),
);

export const insertPermissionSchema = createInsertSchema(permissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertPermission = z.infer<typeof insertPermissionSchema>;
export type Permission = typeof permissions.$inferSelect;

// Machines table
export const machines = pgTable("machines", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  sectionId: text("section_id").references(() => sections.id),
  serialNumber: text("serial_number"),
  supplier: text("supplier"),
  dateOfManufacturing: timestamp("date_of_manufacturing"),
  modelNumber: text("model_number"),
  isActive: boolean("is_active").default(true),
});

export const insertMachineSchema = createInsertSchema(machines);
export type InsertMachine = z.infer<typeof insertMachineSchema>;
export type Machine = typeof machines.$inferSelect;

// Machine Parts table
export const machineParts = pgTable("machine_parts", {
  id: serial("id").primaryKey(),
  machineName: text("machine_name").notNull(), // Machine name (not FK for flexibility)
  sectionId: text("section_id").references(() => sections.id),
  partType: text("part_type").notNull(), // Mechanic / Electronic
  name: text("name").notNull(), // Part name
  code: text("code").notNull().unique(), // Part code
  serialNumber: text("serial_number"), // S/N
  size: text("size"), // Size description
  sizeUnit: text("size_unit"), // cm / inch / mm
  sizeValue: doublePrecision("size_value"), // Size numeric value
  note: text("note"), // Notes
  lastMaintenanceDate: timestamp("last_maintenance_date"), // Last maintenance date
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMachinePartSchema = createInsertSchema(machineParts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertMachinePart = z.infer<typeof insertMachinePartSchema>;
export type MachinePart = typeof machineParts.$inferSelect;

// Machine Parts to Machines relation table (many-to-many)
export const machinePartsToMachines = pgTable("machine_parts_to_machines", {
  id: serial("id").primaryKey(),
  machineId: text("machine_id")
    .notNull()
    .references(() => machines.id, { onDelete: "cascade" }),
  machinePartId: integer("machine_part_id")
    .notNull()
    .references(() => machineParts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueIndex: unique().on(table.machineId, table.machinePartId),
}));

export const insertMachinePartToMachineSchema = createInsertSchema(machinePartsToMachines).omit({
  id: true,
  createdAt: true,
});
export type InsertMachinePartToMachine = z.infer<typeof insertMachinePartToMachineSchema>;
export type MachinePartToMachine = typeof machinePartsToMachines.$inferSelect;

// Raw Materials table
export const rawMaterials = pgTable("raw_materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  quantity: doublePrecision("quantity").default(0),
  unit: text("unit").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertRawMaterialSchema = createInsertSchema(rawMaterials).omit({
  id: true,
  lastUpdated: true,
});
export type InsertRawMaterial = z.infer<typeof insertRawMaterialSchema>;
export type RawMaterial = typeof rawMaterials.$inferSelect;

// Final Products table
export const finalProducts = pgTable("final_products", {
  id: serial("id").primaryKey(),
  jobOrderId: integer("job_order_id")
    .notNull()
    .references(() => jobOrders.id),
  quantity: doublePrecision("quantity").notNull(),
  completedDate: timestamp("completed_date").defaultNow(),
  status: text("status").notNull().default("in-stock"),
});

export const insertFinalProductSchema = createInsertSchema(finalProducts).omit({
  id: true,
  completedDate: true,
});
export type InsertFinalProduct = z.infer<typeof insertFinalProductSchema>;
export type FinalProduct = typeof finalProducts.$inferSelect;

// Quality Check Types
export const qualityCheckTypes = pgTable("quality_check_types", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  checklistItems: text("checklist_items").array(),
  parameters: text("parameters").array(),
  targetStage: text("target_stage").notNull(), // extrusion, printing, cutting, final
  isActive: boolean("is_active").default(true),
});

export const insertQualityCheckTypeSchema =
  createInsertSchema(qualityCheckTypes);
export type InsertQualityCheckType = z.infer<
  typeof insertQualityCheckTypeSchema
>;
export type QualityCheckType = typeof qualityCheckTypes.$inferSelect;

// Quality Checks
export const qualityChecks = pgTable("quality_checks", {
  id: serial("id").primaryKey(),
  checkTypeId: text("check_type_id")
    .notNull()
    .references(() => qualityCheckTypes.id),
  rollId: text("roll_id").references(() => rolls.id, { onDelete: "cascade" }),
  jobOrderId: integer("job_order_id").references(() => jobOrders.id, { onDelete: "cascade" }),
  checkedBy: text("checked_by").references(() => users.id),
  checkedAt: timestamp("checked_at").defaultNow(),
  status: text("status").notNull().default("pending"), // pending, passed, failed
  result: text("result"), // passed, failed
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQualityCheckSchema = createInsertSchema(qualityChecks).omit({
  id: true,
  timestamp: true,
});
export type InsertQualityCheck = z.infer<typeof insertQualityCheckSchema>;
export type QualityCheck = typeof qualityChecks.$inferSelect;

// Corrective Actions
export const correctiveActions = pgTable("corrective_actions", {
  id: serial("id").primaryKey(),
  qualityCheckId: integer("quality_check_id")
    .notNull()
    .references(() => qualityChecks.id),
  createdAt: timestamp("created_at"),
  completedAt: timestamp("completed_at"),
  assignedTo: text("assigned_to").references(() => users.id),
  completedBy: text("completed_by").references(() => users.id),
  action: text("action"),
  status: text("status").notNull().default("open"), // open, in-progress, completed, verified
});

export const insertCorrectiveActionSchema = createInsertSchema(
  correctiveActions,
).omit({ id: true });
export type InsertCorrectiveAction = z.infer<
  typeof insertCorrectiveActionSchema
>;
export type CorrectiveAction = typeof correctiveActions.$inferSelect;

// SMS Messages with Professional Notifications
export const smsMessages = pgTable("sms_messages", {
  id: serial("id").primaryKey(),
  recipientPhone: text("recipient_phone").notNull(),
  recipientName: text("recipient_name"),
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"), // pending, sent, failed, delivered
  orderId: integer("order_id").references(() => orders.id),
  jobOrderId: integer("job_order_id").references(() => jobOrders.id),
  customerId: text("customer_id").references(() => customers.id),
  sentBy: text("sent_by").references(() => users.id),
  sentAt: timestamp("sent_at").defaultNow(),
  deliveredAt: timestamp("delivered_at"),
  errorMessage: text("error_message"),
  messageType: text("message_type").notNull(), // order_notification, status_update, custom, bottleneck_alert, quality_alert, maintenance_alert, hr_notification
  twilioMessageId: text("twilio_message_id"),
  priority: text("priority").notNull().default("normal"), // low, normal, high, urgent
  category: text("category").notNull().default("general"), // general, production, quality, maintenance, hr, management
  templateId: text("template_id"), // Reference to message template
  scheduledFor: timestamp("scheduled_for"), // For scheduled messages
  isScheduled: boolean("is_scheduled").default(false),
  retryCount: integer("retry_count").default(0),
  lastRetryAt: timestamp("last_retry_at"),
  metadata: jsonb("metadata"), // Additional data like order details, alert info, etc.
});

export const insertSmsMessageSchema = createInsertSchema(smsMessages)
  .omit({
    id: true,
    sentAt: true,
    lastRetryAt: true,
  })
  .extend({
    twilioMessageId: z.string().nullable().optional(),
    deliveredAt: z.date().nullable().optional(),
  });
export type InsertSmsMessage = z.infer<typeof insertSmsMessageSchema>;
export type SmsMessage = typeof smsMessages.$inferSelect;

// SMS Templates for Professional Notifications
export const smsTemplates = pgTable("sms_templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // production, quality, maintenance, hr, management, custom
  messageType: text("message_type").notNull(),
  template: text("template").notNull(), // Message template with placeholders
  variables: text("variables").array(), // Available variables for template
  isActive: boolean("is_active").default(true),
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSmsTemplateSchema = createInsertSchema(smsTemplates);
export type InsertSmsTemplate = z.infer<typeof insertSmsTemplateSchema>;
export type SmsTemplate = typeof smsTemplates.$inferSelect;

// SMS Notification Rules
export const smsNotificationRules = pgTable("sms_notification_rules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  triggerEvent: text("trigger_event").notNull(), // order_created, order_completed, bottleneck_detected, etc.
  conditions: jsonb("conditions"), // JSON conditions for when to trigger
  templateId: text("template_id").references(() => smsTemplates.id),
  recipientRoles: text("recipient_roles").array(), // Which roles should receive notifications
  recipientUsers: text("recipient_users").array(), // Specific users to notify
  isActive: boolean("is_active").default(true),
  priority: text("priority").default("normal"),
  cooldownMinutes: integer("cooldown_minutes").default(0), // Prevent spam
  workingHoursOnly: boolean("working_hours_only").default(false),
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSmsNotificationRuleSchema = createInsertSchema(
  smsNotificationRules,
).omit({ id: true });
export type InsertSmsNotificationRule = z.infer<
  typeof insertSmsNotificationRuleSchema
>;
export type SmsNotificationRule = typeof smsNotificationRules.$inferSelect;

// Notification Center with Priority Management
export const notificationCenter = pgTable("notification_center", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // system, alert, warning, info, success, quality, production, maintenance, hr
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical, urgent
  category: text("category").notNull(), // production, quality, maintenance, hr, system, order, inventory
  source: text("source").notNull(), // module that generated the notification
  userId: text("user_id").references(() => users.id), // specific user (null for broadcast)
  userRole: text("user_role"), // role-based notifications
  isRead: boolean("is_read").default(false),
  isArchived: boolean("is_archived").default(false),
  isDismissed: boolean("is_dismissed").default(false),
  actionRequired: boolean("action_required").default(false),
  actionUrl: text("action_url"), // URL to navigate for action
  actionData: jsonb("action_data"), // Additional data for action
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  readAt: timestamp("read_at"),
  dismissedAt: timestamp("dismissed_at"),
  metadata: jsonb("metadata"), // Additional context data
});

export const insertNotificationSchema = createInsertSchema(
  notificationCenter,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  readAt: true,
  dismissedAt: true,
});
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notificationCenter.$inferSelect;

// Notification Preferences for Users
export const notificationPreferences = pgTable("notification_preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  category: text("category").notNull(), // production, quality, maintenance, hr, system
  enabled: boolean("enabled").default(true),
  priority: text("priority").notNull().default("medium"), // minimum priority to receive
  emailEnabled: boolean("email_enabled").default(false),
  smsEnabled: boolean("sms_enabled").default(false),
  pushEnabled: boolean("push_enabled").default(true),
  soundEnabled: boolean("sound_enabled").default(true),
  quietHours: jsonb("quiet_hours"), // {start: "22:00", end: "06:00"}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertNotificationPreferenceSchema = createInsertSchema(
  notificationPreferences,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertNotificationPreference = z.infer<
  typeof insertNotificationPreferenceSchema
>;
export type NotificationPreference =
  typeof notificationPreferences.$inferSelect;

// Notification Templates for Auto-Generation
export const notificationTemplates = pgTable("notification_templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(),
  priority: text("priority").notNull().default("medium"),
  title: text("title").notNull(), // Template with placeholders
  message: text("message").notNull(), // Template with placeholders
  actionRequired: boolean("action_required").default(false),
  actionUrl: text("action_url"), // URL template
  isActive: boolean("is_active").default(true),
  triggerEvent: text("trigger_event"), // Event that triggers this notification
  conditions: jsonb("conditions"), // Conditions for triggering
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertNotificationTemplateSchema = createInsertSchema(
  notificationTemplates,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertNotificationTemplate = z.infer<
  typeof insertNotificationTemplateSchema
>;
export type NotificationTemplate = typeof notificationTemplates.$inferSelect;

// Mix Materials table
export const mixMaterials = pgTable("mix_materials", {
  id: serial("id").primaryKey(),
  mixDate: timestamp("mix_date").defaultNow().notNull(),
  mixPerson: text("mix_person")
    .notNull()
    .references(() => users.id),
  orderId: integer("order_id").references(() => orders.id),
  totalQuantity: doublePrecision("total_quantity").default(0),
  mixScrew: text("mix_screw"), // A or B for the screw type
  createdAt: timestamp("created_at").defaultNow(),
});

// Mix Machines junction table
export const mixMachines = pgTable(
  "mix_machines",
  {
    id: serial("id").primaryKey(),
    mixId: integer("mix_id")
      .notNull()
      .references(() => mixMaterials.id, { onDelete: "cascade" }),
    machineId: text("machine_id")
      .notNull()
      .references(() => machines.id),
  },
  (table) => ({
    uniqueIndex: unique().on(table.mixId, table.machineId),
  }),
);

export const insertMixMaterialSchema = createInsertSchema(mixMaterials).omit({
  id: true,
  createdAt: true,
});

export const insertMixMachineSchema = createInsertSchema(mixMachines).omit({
  id: true,
});

export type InsertMixMaterial = z.infer<typeof insertMixMaterialSchema>;
export type InsertMixMachine = z.infer<typeof insertMixMachineSchema>;
export type MixMaterial = typeof mixMaterials.$inferSelect;
export type MixMachine = typeof mixMachines.$inferSelect;

// Mix Items table
export const mixItems = pgTable("mix_items", {
  id: serial("id").primaryKey(),
  mixId: integer("mix_id")
    .notNull()
    .references(() => mixMaterials.id, { onDelete: "cascade" }),
  rawMaterialId: integer("raw_material_id")
    .notNull()
    .references(() => rawMaterials.id),
  quantity: doublePrecision("quantity").notNull(),
  percentage: doublePrecision("percentage").default(0),
});

export const insertMixItemSchema = createInsertSchema(mixItems).omit({
  id: true,
  percentage: true,
});
export type InsertMixItem = z.infer<typeof insertMixItemSchema>;
export type MixItem = typeof mixItems.$inferSelect;

// Material Inputs table
export const materialInputs = pgTable("material_inputs", {
  id: serial("id").primaryKey(),
  date: timestamp("date").defaultNow().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id), // User who performed the input
  notes: text("notes"),
});

export const insertMaterialInputSchema = createInsertSchema(
  materialInputs,
).omit({
  id: true,
  date: true,
});
export type InsertMaterialInput = z.infer<typeof insertMaterialInputSchema>;
export type MaterialInput = typeof materialInputs.$inferSelect;

// Material Input Items table
export const materialInputItems = pgTable("material_input_items", {
  id: serial("id").primaryKey(),
  inputId: integer("input_id")
    .notNull()
    .references(() => materialInputs.id, { onDelete: "cascade" }),
  rawMaterialId: integer("raw_material_id")
    .notNull()
    .references(() => rawMaterials.id),
  quantity: doublePrecision("quantity").notNull(),
});

export const insertMaterialInputItemSchema = createInsertSchema(
  materialInputItems,
).omit({
  id: true,
});
export type InsertMaterialInputItem = z.infer<
  typeof insertMaterialInputItemSchema
>;
export type MaterialInputItem = typeof materialInputItems.$inferSelect;

// ================== WAREHOUSE MANAGEMENT SYSTEM ==================

// Suppliers table
export const suppliers = pgTable("suppliers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  taxNumber: text("tax_number"),
  paymentTerms: text("payment_terms"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;

// Stock movements table for tracking all inventory changes
export const stockMovements = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "in", "out", "adjustment", "transfer"
  referenceType: text("reference_type"), // "supplier_receipt", "customer_delivery", "production_use", "manual_adjustment"
  referenceId: text("reference_id"), // ID of the related entity (purchase order, delivery, etc.)
  rawMaterialId: integer("raw_material_id").references(() => rawMaterials.id),
  finalProductId: integer("final_product_id").references(() => finalProducts.id),
  quantity: doublePrecision("quantity").notNull(),
  unitCost: doublePrecision("unit_cost"),
  totalCost: doublePrecision("total_cost"),
  userId: text("user_id").notNull().references(() => users.id),
  notes: text("notes"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertStockMovementSchema = createInsertSchema(stockMovements).omit({
  id: true,
  timestamp: true,
});
export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;
export type StockMovement = typeof stockMovements.$inferSelect;

// Purchase orders for receiving raw materials from suppliers
export const purchaseOrders = pgTable("purchase_orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  supplierId: text("supplier_id").notNull().references(() => suppliers.id),
  orderDate: timestamp("order_date").defaultNow().notNull(),
  expectedDeliveryDate: timestamp("expected_delivery_date"),
  actualDeliveryDate: timestamp("actual_delivery_date"),
  status: text("status").notNull().default("pending"), // pending, ordered, received, cancelled
  totalAmount: doublePrecision("total_amount").default(0),
  notes: text("notes"),
  createdBy: text("created_by").notNull().references(() => users.id),
  receivedBy: text("received_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertPurchaseOrder = z.infer<typeof insertPurchaseOrderSchema>;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;

// Purchase order items
export const purchaseOrderItems = pgTable("purchase_order_items", {
  id: serial("id").primaryKey(),
  purchaseOrderId: integer("purchase_order_id").notNull().references(() => purchaseOrders.id, { onDelete: "cascade" }),
  rawMaterialId: integer("raw_material_id").notNull().references(() => rawMaterials.id),
  orderedQuantity: doublePrecision("ordered_quantity").notNull(),
  receivedQuantity: doublePrecision("received_quantity").default(0),
  unitPrice: doublePrecision("unit_price").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  notes: text("notes"),
});

export const insertPurchaseOrderItemSchema = createInsertSchema(purchaseOrderItems).omit({
  id: true,
});
export type InsertPurchaseOrderItem = z.infer<typeof insertPurchaseOrderItemSchema>;
export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;

// Delivery orders for sending final products to customers
export const deliveryOrders = pgTable("delivery_orders", {
  id: serial("id").primaryKey(),
  deliveryNumber: text("delivery_number").notNull().unique(),
  customerId: text("customer_id").notNull().references(() => customers.id),
  orderId: integer("order_id").references(() => orders.id, { onDelete: "cascade" }),
  deliveryDate: timestamp("delivery_date").defaultNow().notNull(),
  scheduledDeliveryDate: timestamp("scheduled_delivery_date"),
  status: text("status").notNull().default("pending"), // pending, prepared, shipped, delivered, cancelled
  driverName: text("driver_name"),
  vehicleNumber: text("vehicle_number"),
  trackingNumber: text("tracking_number"),
  deliveryAddress: text("delivery_address"),
  notes: text("notes"),
  createdBy: text("created_by").notNull().references(() => users.id),
  deliveredBy: text("delivered_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDeliveryOrderSchema = createInsertSchema(deliveryOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDeliveryOrder = z.infer<typeof insertDeliveryOrderSchema>;
export type DeliveryOrder = typeof deliveryOrders.$inferSelect;

// Delivery order items
export const deliveryOrderItems = pgTable("delivery_order_items", {
  id: serial("id").primaryKey(),
  deliveryOrderId: integer("delivery_order_id").notNull().references(() => deliveryOrders.id, { onDelete: "cascade" }),
  finalProductId: integer("final_product_id").notNull().references(() => finalProducts.id),
  quantity: doublePrecision("quantity").notNull(),
  notes: text("notes"),
});

export const insertDeliveryOrderItemSchema = createInsertSchema(deliveryOrderItems).omit({
  id: true,
});
export type InsertDeliveryOrderItem = z.infer<typeof insertDeliveryOrderItemSchema>;
export type DeliveryOrderItem = typeof deliveryOrderItems.$inferSelect;

// Stock adjustments for manual inventory corrections
export const stockAdjustments = pgTable("stock_adjustments", {
  id: serial("id").primaryKey(),
  adjustmentNumber: text("adjustment_number").notNull().unique(),
  adjustmentDate: timestamp("adjustment_date").defaultNow().notNull(),
  reason: text("reason").notNull(),
  notes: text("notes"),
  approvedBy: text("approved_by").references(() => users.id),
  createdBy: text("created_by").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertStockAdjustmentSchema = createInsertSchema(stockAdjustments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertStockAdjustment = z.infer<typeof insertStockAdjustmentSchema>;
export type StockAdjustment = typeof stockAdjustments.$inferSelect;

// Stock adjustment items
export const stockAdjustmentItems = pgTable("stock_adjustment_items", {
  id: serial("id").primaryKey(),
  adjustmentId: integer("adjustment_id").notNull().references(() => stockAdjustments.id, { onDelete: "cascade" }),
  rawMaterialId: integer("raw_material_id").references(() => rawMaterials.id),
  finalProductId: integer("final_product_id").references(() => finalProducts.id),
  currentQuantity: doublePrecision("current_quantity").notNull(),
  adjustedQuantity: doublePrecision("adjusted_quantity").notNull(),
  difference: doublePrecision("difference").notNull(),
  reason: text("reason"),
});

export const insertStockAdjustmentItemSchema = createInsertSchema(stockAdjustmentItems).omit({
  id: true,
});
export type InsertStockAdjustmentItem = z.infer<typeof insertStockAdjustmentItemSchema>;
export type StockAdjustmentItem = typeof stockAdjustmentItems.$inferSelect;

// Warehouse locations for better organization
export const warehouseLocations = pgTable("warehouse_locations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // "raw_materials", "final_products", "staging", "shipping"
  capacity: doublePrecision("capacity"),
  currentUtilization: doublePrecision("current_utilization").default(0),
  isActive: boolean("is_active").default(true),
});

export const insertWarehouseLocationSchema = createInsertSchema(warehouseLocations);
export type InsertWarehouseLocation = z.infer<typeof insertWarehouseLocationSchema>;
export type WarehouseLocation = typeof warehouseLocations.$inferSelect;

// ================== END WAREHOUSE MANAGEMENT SYSTEM ==================

// Cliché (Plate) Pricing Parameters
export const platePricingParameters = pgTable("plate_pricing_parameters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Parameter name (e.g., "Base price per cm²")
  value: doublePrecision("value").notNull(), // Value of the parameter
  description: text("description"), // Description of the parameter
  type: text("type").notNull(), // Type of parameter (base_price, multiplier, etc.)
  isActive: boolean("is_active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertPlatePricingParameterSchema = createInsertSchema(
  platePricingParameters,
).omit({ id: true, lastUpdated: true });
export type InsertPlatePricingParameter = z.infer<
  typeof insertPlatePricingParameterSchema
>;
export type PlatePricingParameter = typeof platePricingParameters.$inferSelect;

// Plate Calculations
export const plateCalculations = pgTable("plate_calculations", {
  id: serial("id").primaryKey(),
  customerId: text("customer_id").references(() => customers.id),
  width: doublePrecision("width").notNull(), // Width in cm
  height: doublePrecision("height").notNull(), // Height in cm
  area: doublePrecision("area").notNull(), // Area in cm²
  colors: integer("colors").notNull().default(1), // Number of colors
  plateType: text("plate_type").notNull(), // Type of plate (standard, premium, etc.)
  thickness: doublePrecision("thickness"), // Thickness in mm
  calculatedPrice: doublePrecision("calculated_price").notNull(), // Final calculated price
  basePricePerUnit: doublePrecision("base_price_per_unit"), // Base price per cm²
  colorMultiplier: doublePrecision("color_multiplier"), // Multiplier based on colors
  thicknessMultiplier: doublePrecision("thickness_multiplier"), // Multiplier based on thickness
  customerDiscount: doublePrecision("customer_discount"), // Customer specific discount percentage
  notes: text("notes"), // Additional notes
  createdById: text("created_by_id").references(() => users.id), // User who created the calculation
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPlateCalculationSchema = createInsertSchema(
  plateCalculations,
).omit({ id: true, area: true, calculatedPrice: true, createdAt: true });
export type InsertPlateCalculation = z.infer<
  typeof insertPlateCalculationSchema
>;
export type PlateCalculation = typeof plateCalculations.$inferSelect;

// Cliché Calculation Request Schema (for the frontend)
export const plateCalculationRequestSchema = z.object({
  customerId: z.string().optional(),
  width: z.number().positive("Width must be positive"),
  height: z.number().positive("Height must be positive"),
  colors: z
    .number()
    .int()
    .positive("Number of colors must be positive")
    .default(1),
  plateType: z.string(),
  thickness: z.number().optional(),
  customerDiscount: z.number().optional(),
  notes: z.string().optional(),
});

export type PlateCalculationRequest = z.infer<
  typeof plateCalculationRequestSchema
>;

// IoT Integration Module - Machine Sensors
export const machineSensors = pgTable("machine_sensors", {
  id: text("id").primaryKey(),
  machineId: text("machine_id")
    .notNull()
    .references(() => machines.id),
  sensorType: text("sensor_type").notNull(), // temperature, pressure, speed, vibration, energy, status
  name: text("name").notNull(),
  unit: text("unit"), // °C, bar, rpm, Hz, kW, boolean
  minValue: doublePrecision("min_value"),
  maxValue: doublePrecision("max_value"),
  warningThreshold: doublePrecision("warning_threshold"),
  criticalThreshold: doublePrecision("critical_threshold"),
  isActive: boolean("is_active").default(true),
  calibrationDate: timestamp("calibration_date"),
  nextCalibrationDate: timestamp("next_calibration_date"),
});

export const insertMachineSensorSchema = createInsertSchema(machineSensors);
export type InsertMachineSensor = z.infer<typeof insertMachineSensorSchema>;
export type MachineSensor = typeof machineSensors.$inferSelect;

// IoT Sensor Data
export const sensorData = pgTable("sensor_data", {
  id: serial("id").primaryKey(),
  sensorId: text("sensor_id")
    .notNull()
    .references(() => machineSensors.id),
  value: doublePrecision("value").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  status: text("status").notNull().default("normal"), // normal, warning, critical
  metadata: jsonb("metadata"), // Additional sensor-specific data
});

export const insertSensorDataSchema = createInsertSchema(sensorData).omit({
  id: true,
  timestamp: true,
});
export type InsertSensorData = z.infer<typeof insertSensorDataSchema>;
export type SensorData = typeof sensorData.$inferSelect;

// IoT Alerts
export const iotAlerts = pgTable("iot_alerts", {
  id: serial("id").primaryKey(),
  sensorId: text("sensor_id")
    .notNull()
    .references(() => machineSensors.id),
  alertType: text("alert_type").notNull(), // threshold_exceeded, sensor_offline, anomaly_detected
  severity: text("severity").notNull(), // warning, critical, emergency
  message: text("message").notNull(),
  currentValue: doublePrecision("current_value"),
  thresholdValue: doublePrecision("threshold_value"),
  isActive: boolean("is_active").default(true),
  acknowledgedBy: text("acknowledged_by").references(() => users.id),
  acknowledgedAt: timestamp("acknowledged_at"),
  resolvedBy: text("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertIotAlertSchema = createInsertSchema(iotAlerts).omit({
  id: true,
  createdAt: true,
});
export type InsertIotAlert = z.infer<typeof insertIotAlertSchema>;
export type IotAlert = typeof iotAlerts.$inferSelect;

// HR Module Tables

// Employee profile data is now part of the users table (removed separate employee_profiles table)

// Geofences for automatic check-out
export const geofences = pgTable("geofences", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  centerLatitude: doublePrecision("center_latitude").notNull(),
  centerLongitude: doublePrecision("center_longitude").notNull(),
  radius: doublePrecision("radius").notNull(), // in meters
  isActive: boolean("is_active").default(true),
  sectionIds: text("section_ids")
    .array()
    .default(sql`'{}'`), // which sections this geofence applies to
  geofenceType: text("geofence_type").default("factory"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertGeofenceSchema = createInsertSchema(geofences).omit({
  id: true,
  createdAt: true,
});
export type InsertGeofence = z.infer<typeof insertGeofenceSchema>;
export type Geofence = typeof geofences.$inferSelect;

// Time Attendance with enhanced tracking
export const timeAttendance = pgTable("time_attendance", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  date: timestamp("date").notNull(),
  checkInTime: timestamp("check_in_time"),
  checkOutTime: timestamp("check_out_time"),
  breakStartTime: timestamp("break_start_time"),
  breakEndTime: timestamp("break_end_time"),
  scheduledStartTime: timestamp("scheduled_start_time"),
  scheduledEndTime: timestamp("scheduled_end_time"),
  workingHours: doublePrecision("working_hours").default(0),
  overtimeHours: doublePrecision("overtime_hours").default(0),
  breakDuration: doublePrecision("break_duration").default(0), // in hours
  checkInLocation: text("check_in_location"),
  checkOutLocation: text("check_out_location"),
  breakStartLocation: text("break_start_location"),
  breakEndLocation: text("break_end_location"),
  status: text("status").notNull().default("present"), // present, absent, late, early_leave, sick, vacation
  isAutoCheckedOut: boolean("is_auto_checked_out").default(false),
  autoCheckOutReason: text("auto_check_out_reason"),
  overtimeApproved: boolean("overtime_approved").default(false),
  overtimeApprovedBy: text("overtime_approved_by").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTimeAttendanceSchema = createInsertSchema(
  timeAttendance,
).omit({ id: true, createdAt: true });
export type InsertTimeAttendance = z.infer<typeof insertTimeAttendanceSchema>;
export type TimeAttendance = typeof timeAttendance.$inferSelect;

// Leave Management
export const leaveRequests = pgTable("leave_requests", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  leaveType: text("leave_type").notNull(), // sick, vacation, personal, emergency, maternity, paternity
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalDays: doublePrecision("total_days").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, cancelled
  approvedBy: text("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  attachments: jsonb("attachments"), // medical certificates, etc.
  requestedAt: timestamp("requested_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeaveRequestSchema = createInsertSchema(leaveRequests).omit({
  id: true,
  createdAt: true,
  requestedAt: true,
});
export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;
export type LeaveRequest = typeof leaveRequests.$inferSelect;

// Overtime Requests
export const overtimeRequests = pgTable("overtime_requests", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  date: timestamp("date").notNull(),
  requestedHours: doublePrecision("requested_hours").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  approvedBy: text("approved_by").references(() => users.id),
  approvedHours: doublePrecision("approved_hours"),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  actualHours: doublePrecision("actual_hours"), // filled after work is done
  requestedAt: timestamp("requested_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOvertimeRequestSchema = createInsertSchema(
  overtimeRequests,
).omit({ id: true, createdAt: true, requestedAt: true });
export type InsertOvertimeRequest = z.infer<typeof insertOvertimeRequestSchema>;
export type OvertimeRequest = typeof overtimeRequests.$inferSelect;

// Payroll Records
export const payrollRecords = pgTable("payroll_records", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  payPeriodStart: timestamp("pay_period_start").notNull(),
  payPeriodEnd: timestamp("pay_period_end").notNull(),
  baseSalary: doublePrecision("base_salary").notNull(),
  overtimePay: doublePrecision("overtime_pay").default(0),
  allowances: doublePrecision("allowances").default(0),
  bonuses: doublePrecision("bonuses").default(0),
  deductions: doublePrecision("deductions").default(0),
  grossPay: doublePrecision("gross_pay").notNull(),
  netPay: doublePrecision("net_pay").notNull(),
  workingDays: integer("working_days").notNull(),
  absentDays: integer("absent_days").default(0),
  lateDays: integer("late_days").default(0),
  overtimeHours: doublePrecision("overtime_hours").default(0),
  status: text("status").notNull().default("draft"), // draft, approved, paid
  processedBy: text("processed_by").references(() => users.id),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPayrollRecordSchema = createInsertSchema(
  payrollRecords,
).omit({ id: true, createdAt: true });
export type InsertPayrollRecord = z.infer<typeof insertPayrollRecordSchema>;
export type PayrollRecord = typeof payrollRecords.$inferSelect;

// Employee Performance Reviews
export const performanceReviews = pgTable("performance_reviews", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  reviewerId: text("reviewer_id")
    .notNull()
    .references(() => users.id),
  reviewPeriodStart: timestamp("review_period_start").notNull(),
  reviewPeriodEnd: timestamp("review_period_end").notNull(),
  attendanceScore: doublePrecision("attendance_score").default(0),
  qualityScore: doublePrecision("quality_score").default(0),
  productivityScore: doublePrecision("productivity_score").default(0),
  teamworkScore: doublePrecision("teamwork_score").default(0),
  overallScore: doublePrecision("overall_score").default(0),
  strengths: text("strengths"),
  improvements: text("improvements"),
  goals: text("goals"),
  status: text("status").notNull().default("draft"), // draft, submitted, approved
  reviewDate: timestamp("review_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPerformanceReviewSchema = createInsertSchema(
  performanceReviews,
).omit({ id: true, createdAt: true });
export type InsertPerformanceReview = z.infer<
  typeof insertPerformanceReviewSchema
>;
export type PerformanceReview = typeof performanceReviews.$inferSelect;

// Employee of the Month
export const employeeOfMonth = pgTable(
  "employee_of_month",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    month: integer("month").notNull(), // 1-12
    year: integer("year").notNull(),
    obligationPoints: integer("obligation_points").notNull().default(0),
    qualityScore: doublePrecision("quality_score").default(0),
    attendanceScore: doublePrecision("attendance_score").default(0),
    productivityScore: doublePrecision("productivity_score").default(0),
    totalScore: doublePrecision("total_score").default(0),
    rank: integer("rank"),
    reward: text("reward"),
    rewardAmount: doublePrecision("reward_amount"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniqueUserMonth: unique().on(table.userId, table.month, table.year),
  }),
);

export const insertEmployeeOfMonthSchema = createInsertSchema(
  employeeOfMonth,
).omit({ id: true, createdAt: true });
export type InsertEmployeeOfMonth = z.infer<typeof insertEmployeeOfMonthSchema>;
export type EmployeeOfMonth = typeof employeeOfMonth.$inferSelect;

// Professional HR Violations System
export const hrViolations = pgTable("hr_violations", {
  id: serial("id").primaryKey(),
  violationNumber: text("violation_number").notNull().unique(), // Auto-generated: VIO-YYYY-NNNN
  userId: text("user_id")
    .notNull()
    .references(() => users.id), // Employee involved
  reportedBy: text("reported_by")
    .notNull()
    .references(() => users.id), // Who reported it

  // Comprehensive violation types
  violationType: text("violation_type").notNull(), // "attendance", "production", "conduct", "safety", "policy", "damage"
  violationSubtype: text("violation_subtype").notNull(), // Specific subtypes based on main type

  severity: text("severity").notNull(), // "minor", "major", "critical"
  title: text("title").notNull(),
  description: text("description").notNull(),

  // Repeat offense tracking
  previousViolationCount: integer("previous_violation_count").default(0),
  isRepeatOffense: boolean("is_repeat_offense").default(false),
  relatedViolationIds: text("related_violation_ids")
    .array()
    .default(sql`'{}'`),

  // Action taken details
  actionTaken: text("action_taken").notNull(), // "warning", "written_warning", "suspension", "termination", "training", "counseling"
  actionDetails: text("action_details"),
  disciplinaryPoints: integer("disciplinary_points").default(0),

  // Financial impact (for damage violations)
  estimatedCost: doublePrecision("estimated_cost").default(0),
  actualCost: doublePrecision("actual_cost").default(0),
  costRecovered: boolean("cost_recovered").default(false),

  // Status and resolution
  status: text("status").notNull().default("open"), // "open", "investigating", "resolved", "appealed", "dismissed"
  resolutionDate: timestamp("resolution_date"),
  resolutionNotes: text("resolution_notes"),

  // Evidence and documentation
  evidenceFiles: jsonb("evidence_files"), // File attachments
  witnessIds: text("witness_ids")
    .array()
    .default(sql`'{}'`), // Other employees who witnessed

  // Follow-up tracking
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  followUpNotes: text("follow_up_notes"),

  // Timestamps
  incidentDate: timestamp("incident_date").notNull(),
  reportDate: timestamp("report_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHrViolationSchema = createInsertSchema(hrViolations).omit({
  id: true,
  violationNumber: true,
  previousViolationCount: true,
  isRepeatOffense: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertHrViolation = z.infer<typeof insertHrViolationSchema>;
export type HrViolation = typeof hrViolations.$inferSelect;

// HR Complaints
export const hrComplaints = pgTable("hr_complaints", {
  id: serial("id").primaryKey(),
  complainantId: text("complainant_id")
    .notNull()
    .references(() => users.id), // Who filed the complaint
  againstUserId: text("against_user_id").references(() => users.id), // Who the complaint is against (can be null for general complaints)
  complaintType: text("complaint_type").notNull(), // "harassment", "discrimination", "work_environment", "management", "safety", "other"
  priority: text("priority").notNull().default("medium"), // "low", "medium", "high", "urgent"
  title: text("title").notNull(),
  description: text("description").notNull(),
  desiredOutcome: text("desired_outcome"),
  isAnonymous: boolean("is_anonymous").default(false),
  status: text("status").notNull().default("submitted"), // "submitted", "under_review", "investigating", "resolved", "closed"
  submittedDate: timestamp("submitted_date").defaultNow(),
  assignedTo: text("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHrComplaintSchema = createInsertSchema(hrComplaints).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertHrComplaint = z.infer<typeof insertHrComplaintSchema>;
export type HrComplaint = typeof hrComplaints.$inferSelect;

// Training Module - Enhanced for General Employee Training
export const trainings = pgTable("trainings", {
  id: serial("id").primaryKey(),
  trainingId: text("training_id").notNull().unique(), // Custom training ID
  title: text("title"), // Training title
  description: text("description"), // Training description
  instructor: text("instructor"), // Instructor name
  location: text("location"), // Training location
  scheduledDate: timestamp("scheduled_date"), // When training is scheduled
  duration: doublePrecision("duration"), // Duration in hours
  maxParticipants: integer("max_participants"), // Maximum participants
  category: text("category"), // Training category
  priority: text("priority").default("medium"), // Priority level
  certificationRequired: boolean("certification_required").default(false),
  qualityCheckTypes: text("quality_check_types")
    .array()
    .default(sql`'{}'`), // Related quality check types
  equipmentIds: text("equipment_ids")
    .array()
    .default(sql`'{}'`), // Related equipment
  prerequisites: text("prerequisites")
    .array()
    .default(sql`'{}'`), // Prerequisites
  learningObjectives: text("learning_objectives")
    .array()
    .default(sql`'{}'`), // Learning objectives
  type: text("type").default("general"), // "general" or "quality"
  // General Training fields
  trainingCategory: text("training_category"), // "Extrusion", "Printing", "Cutting", "Maintenance", "Warehouse", "Safety"
  trainingFields: text("training_fields")
    .array()
    .default(sql`'{}'`), // Array of specific training fields
  notes: text("notes"), // Training notes
  // Legacy fields for backward compatibility
  date: timestamp("date"),
  traineeId: text("trainee_id").references(() => users.id),
  trainingSection: text("training_section"), // "extrusion", "printing", "cutting", "safety"
  numberOfDays: integer("number_of_days"),
  supervisorId: text("supervisor_id").references(() => users.id),
  supervisorSignature: text("supervisor_signature"), // Base64 encoded signature
  report: text("report"),
  status: text("status").notNull().default("scheduled"), // "draft", "scheduled", "in_progress", "completed", "cancelled"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTrainingSchema = createInsertSchema(trainings)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    date: z
      .union([z.string(), z.date()])
      .transform((val) => (typeof val === "string" ? new Date(val) : val))
      .optional(),
    scheduledDate: z
      .union([z.string(), z.date()])
      .transform((val) => (typeof val === "string" ? new Date(val) : val))
      .optional(),
    traineeId: z.string().optional(),
    trainingSection: z.string().optional(),
    trainingCategory: z.string().optional(),
    trainingFields: z.array(z.string()).optional(),
    numberOfDays: z.number().optional(),
    supervisorId: z.string().optional(),
  });
export type InsertTraining = z.infer<typeof insertTrainingSchema>;
export type Training = typeof trainings.$inferSelect;

// Training Points (available training points)
export const trainingPoints = pgTable("training_points", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // "machine_operation", "safety", "setup"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTrainingPointSchema = createInsertSchema(
  trainingPoints,
).omit({ id: true, createdAt: true });
export type InsertTrainingPoint = z.infer<typeof insertTrainingPointSchema>;
export type TrainingPoint = typeof trainingPoints.$inferSelect;

// Training Field Evaluations (for general training system)
export const trainingFieldEvaluations = pgTable(
  "training_field_evaluations",
  {
    id: serial("id").primaryKey(),
    trainingId: integer("training_id")
      .notNull()
      .references(() => trainings.id, { onDelete: "cascade" }),
    trainingField: text("training_field").notNull(), // Specific training field being evaluated
    status: text("status").notNull(), // "Pass", "Not Pass", "Not Evaluated"
    notes: text("notes"),
    evaluatedAt: timestamp("evaluated_at"),
    evaluatedBy: text("evaluated_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueTrainingField: unique().on(table.trainingId, table.trainingField),
  }),
);

export const insertTrainingFieldEvaluationSchema = createInsertSchema(
  trainingFieldEvaluations,
).omit({ id: true, createdAt: true });
export type InsertTrainingFieldEvaluation = z.infer<
  typeof insertTrainingFieldEvaluationSchema
>;
export type TrainingFieldEvaluation =
  typeof trainingFieldEvaluations.$inferSelect;

// Training Evaluations (linking trainings to training points with evaluations) - Legacy support
export const trainingEvaluations = pgTable(
  "training_evaluations",
  {
    id: serial("id").primaryKey(),
    trainingId: integer("training_id")
      .notNull()
      .references(() => trainings.id, { onDelete: "cascade" }),
    trainingPointId: integer("training_point_id")
      .notNull()
      .references(() => trainingPoints.id),
    status: text("status").notNull(), // "pass", "not_pass", "pending"
    notes: text("notes"),
    evaluatedAt: timestamp("evaluated_at"),
    evaluatedBy: text("evaluated_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueTrainingPoint: unique().on(table.trainingId, table.trainingPointId),
  }),
);

export const insertTrainingEvaluationSchema = createInsertSchema(
  trainingEvaluations,
).omit({ id: true, createdAt: true });
export type InsertTrainingEvaluation = z.infer<
  typeof insertTrainingEvaluationSchema
>;
export type TrainingEvaluation = typeof trainingEvaluations.$inferSelect;

// Training Certificates
export const trainingCertificates = pgTable("training_certificates", {
  id: serial("id").primaryKey(),
  trainingId: integer("training_id")
    .notNull()
    .references(() => trainings.id, { onDelete: "cascade" }),
  certificateNumber: text("certificate_number").notNull().unique(),
  templateId: text("template_id").notNull().default("default"),
  customDesign: jsonb("custom_design"), // Stores design configuration
  issuedDate: timestamp("issued_date").defaultNow().notNull(),
  validUntil: timestamp("valid_until"), // Optional expiration date
  issuerName: text("issuer_name").notNull(),
  issuerTitle: text("issuer_title").notNull(),
  companyName: text("company_name")
    .notNull()
    .default("Production Management Factory"),
  logoUrl: text("logo_url"), // Optional company logo
  status: text("status").notNull().default("active"), // "active", "revoked", "expired"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCertificateSchema = createInsertSchema(
  trainingCertificates,
).omit({ id: true, createdAt: true });
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type TrainingCertificate = typeof trainingCertificates.$inferSelect;

// Production Bottleneck Detection System
export const productionMetrics = pgTable("production_metrics", {
  id: serial("id").primaryKey(),
  sectionId: text("section_id")
    .notNull()
    .references(() => sections.id),
  machineId: text("machine_id").references(() => machines.id),
  jobOrderId: integer("job_order_id").references(() => jobOrders.id),
  stage: text("stage").notNull(), // "extruding", "printing", "cutting", "mixing"
  targetRate: doublePrecision("target_rate").notNull(), // Expected production rate per hour
  actualRate: doublePrecision("actual_rate").notNull(), // Actual production rate
  efficiency: doublePrecision("efficiency").notNull(), // Percentage efficiency
  downtime: integer("downtime_minutes").default(0), // Downtime in minutes
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  shift: text("shift").notNull().default("day"), // "day", "night", "morning"
  operator: text("operator").references(() => users.id),
  notes: text("notes"),
});

export const insertProductionMetricsSchema = createInsertSchema(
  productionMetrics,
).omit({ id: true, timestamp: true });
export type InsertProductionMetrics = z.infer<
  typeof insertProductionMetricsSchema
>;
export type ProductionMetrics = typeof productionMetrics.$inferSelect;

// Bottleneck Alerts
export const bottleneckAlerts = pgTable("bottleneck_alerts", {
  id: serial("id").primaryKey(),
  alertType: text("alert_type").notNull(), // "efficiency_drop", "downtime_exceeded", "rate_below_target", "queue_buildup"
  severity: text("severity").notNull().default("medium"), // "low", "medium", "high", "critical"
  sectionId: text("section_id")
    .notNull()
    .references(() => sections.id),
  machineId: text("machine_id").references(() => machines.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  affectedJobOrders: integer("affected_job_orders").array(), // Array of job order IDs
  estimatedDelay: integer("estimated_delay_hours"), // Estimated delay in hours
  suggestedActions: text("suggested_actions").array(), // Array of suggested actions
  status: text("status").notNull().default("active"), // "active", "acknowledged", "resolved", "ignored"
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
  acknowledgedAt: timestamp("acknowledged_at"),
  acknowledgedBy: text("acknowledged_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: text("resolved_by").references(() => users.id),
  resolutionNotes: text("resolution_notes"),
});

export const insertBottleneckAlertSchema = createInsertSchema(
  bottleneckAlerts,
).omit({ id: true, detectedAt: true });
export type InsertBottleneckAlert = z.infer<typeof insertBottleneckAlertSchema>;
export type BottleneckAlert = typeof bottleneckAlerts.$inferSelect;

// Notification Settings
export const notificationSettings = pgTable("notification_settings", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  alertType: text("alert_type").notNull(), // "efficiency_drop", "downtime_exceeded", etc.
  enabled: boolean("enabled").default(true),
  minSeverity: text("min_severity").notNull().default("medium"), // Minimum severity to notify
  notificationMethods: text("notification_methods").array().notNull(), // ["email", "sms", "push", "in_app"]
  workingHoursOnly: boolean("working_hours_only").default(false),
  departments: text("departments").array(), // If empty, all departments
  machines: text("machines").array(), // If empty, all machines
});

export const insertNotificationSettingsSchema = createInsertSchema(
  notificationSettings,
).omit({ id: true });
export type InsertNotificationSettings = z.infer<
  typeof insertNotificationSettingsSchema
>;
export type NotificationSettings = typeof notificationSettings.$inferSelect;

// Production Targets
export const productionTargets = pgTable("production_targets", {
  id: serial("id").primaryKey(),
  sectionId: text("section_id")
    .notNull()
    .references(() => sections.id),
  machineId: text("machine_id").references(() => machines.id),
  stage: text("stage").notNull(),
  targetRate: doublePrecision("target_rate").notNull(), // Units per hour
  minEfficiency: doublePrecision("min_efficiency").notNull().default(75), // Minimum acceptable efficiency %
  maxDowntime: integer("max_downtime_minutes").notNull().default(30), // Maximum acceptable downtime per shift
  shift: text("shift").notNull().default("day"),
  effectiveFrom: timestamp("effective_from").defaultNow().notNull(),
  effectiveTo: timestamp("effective_to"),
  isActive: boolean("is_active").default(true),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
});

// Maintenance Module Tables

// Maintenance Requests
export const maintenanceRequests = pgTable("maintenance_requests", {
  id: serial("id").primaryKey(),
  requestNumber: text("request_number"),
  machineId: text("machine_id")
    .notNull()
    .references(() => machines.id),
  damageType: text("damage_type").notNull(),
  severity: text("severity").notNull().default("Normal"), // High, Normal, Low
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, cancelled
  priority: integer("priority").default(2), // 1=High, 2=Normal, 3=Low
  estimatedRepairTime: integer("estimated_repair_time"), // in hours
  actualRepairTime: integer("actual_repair_time"), // in hours
  requestedBy: text("requested_by")
    .notNull()
    .references(() => users.id),
  reportedBy: text("reported_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  assignedTo: text("assigned_to").references(() => users.id),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
});

export const insertMaintenanceRequestSchema = createInsertSchema(
  maintenanceRequests,
).omit({ id: true, createdAt: true });
export type InsertMaintenanceRequest = z.infer<
  typeof insertMaintenanceRequestSchema
>;
export type MaintenanceRequest = typeof maintenanceRequests.$inferSelect;

// Maintenance Actions
export const maintenanceActions = pgTable("maintenance_actions", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id")
    .notNull()
    .references(() => maintenanceRequests.id, { onDelete: "cascade" }),
  machineId: text("machine_id")
    .notNull()
    .references(() => machines.id),
  actionDate: timestamp("action_date").defaultNow().notNull(),
  actionType: text("action_type").notNull(),
  partReplaced: text("part_replaced"),
  partId: integer("part_id"), // Legacy field for backward compatibility
  machinePartId: integer("machine_part_id").references(() => machineParts.id), // New reference to machine parts
  description: text("description").notNull(),
  performedBy: text("performed_by")
    .notNull()
    .references(() => users.id),
  hours: doublePrecision("hours").default(0),
  cost: doublePrecision("cost").default(0),
  status: text("status").notNull().default("completed"), // pending, in_progress, completed
});

export const insertMaintenanceActionSchema = createInsertSchema(
  maintenanceActions,
).omit({ id: true, actionDate: true });
export type InsertMaintenanceAction = z.infer<
  typeof insertMaintenanceActionSchema
>;
export type MaintenanceAction = typeof maintenanceActions.$inferSelect;

// Maintenance Schedule (for preventive maintenance)
export const maintenanceSchedule = pgTable("maintenance_schedule", {
  id: serial("id").primaryKey(),
  machineId: text("machine_id")
    .notNull()
    .references(() => machines.id),
  taskName: text("task_name").notNull(),
  maintenanceType: text("maintenance_type"),
  description: text("description"),
  frequency: text("frequency").notNull(), // daily, weekly, monthly, quarterly, yearly
  lastCompleted: timestamp("last_completed"),
  nextDue: timestamp("next_due").notNull(),
  assignedTo: text("assigned_to").references(() => users.id),
  priority: text("priority").default("medium"), // low, medium, high, critical
  estimatedHours: doublePrecision("estimated_hours").default(1),
  instructions: text("instructions"),
  status: text("status").default("active"), // active, inactive, completed
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
});

export const insertMaintenanceScheduleSchema = createInsertSchema(
  maintenanceSchedule,
).omit({ id: true });
export type InsertMaintenanceSchedule = z.infer<
  typeof insertMaintenanceScheduleSchema
>;
export type MaintenanceSchedule = typeof maintenanceSchedule.$inferSelect;

export const insertProductionTargetsSchema = createInsertSchema(
  productionTargets,
).omit({ id: true, effectiveFrom: true });
export type InsertProductionTargets = z.infer<
  typeof insertProductionTargetsSchema
>;
export type ProductionTargets = typeof productionTargets.$inferSelect;

// SMS Provider Settings for fallback configuration
export const smsProviderSettings = pgTable("sms_provider_settings", {
  id: serial("id").primaryKey(),
  primaryProvider: text("primary_provider").notNull().default("taqnyat"),
  fallbackProvider: text("fallback_provider").notNull().default("twilio"),
  retryAttempts: integer("retry_attempts").notNull().default(3),
  retryDelay: integer("retry_delay").notNull().default(5000), // milliseconds
  isActive: boolean("is_active").notNull().default(true),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  updatedBy: text("updated_by"),
});

// SMS Provider Health Status for monitoring
export const smsProviderHealth = pgTable("sms_provider_health", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull(), // 'taqnyat' or 'twilio'
  status: text("status").notNull().default("healthy"), // 'healthy', 'degraded', 'down'
  lastSuccessfulSend: timestamp("last_successful_send"),
  lastFailedSend: timestamp("last_failed_send"),
  successCount: integer("success_count").notNull().default(0),
  failureCount: integer("failure_count").notNull().default(0),
  lastError: text("last_error"),
  checkedAt: timestamp("checked_at").notNull().defaultNow(),
});

export const insertSmsProviderSettingsSchema = createInsertSchema(
  smsProviderSettings,
).omit({ id: true, lastUpdated: true });
export type InsertSmsProviderSettings = z.infer<
  typeof insertSmsProviderSettingsSchema
>;
export type SmsProviderSettings = typeof smsProviderSettings.$inferSelect;

export const insertSmsProviderHealthSchema = createInsertSchema(
  smsProviderHealth,
).omit({ id: true, checkedAt: true });
export type InsertSmsProviderHealth = z.infer<
  typeof insertSmsProviderHealthSchema
>;
export type SmsProviderHealth = typeof smsProviderHealth.$inferSelect;

// Dashboard Widgets and Layouts
export const dashboardWidgets = pgTable("dashboard_widgets", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  widgetType: text("widget_type").notNull(),
  widgetConfig: jsonb("widget_config").notNull(),
  position: jsonb("position").notNull(), // { x: number, y: number, w: number, h: number }
  isVisible: boolean("is_visible").default(true),
  dashboardLayout: text("dashboard_layout").default("default"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dashboardLayouts = pgTable("dashboard_layouts", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  layoutName: text("layout_name").notNull(),
  layoutConfig: jsonb("layout_config").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDashboardWidgetSchema = createInsertSchema(
  dashboardWidgets,
).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDashboardWidget = z.infer<typeof insertDashboardWidgetSchema>;
export type DashboardWidget = typeof dashboardWidgets.$inferSelect;

export const insertDashboardLayoutSchema = createInsertSchema(
  dashboardLayouts,
).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDashboardLayout = z.infer<typeof insertDashboardLayoutSchema>;
export type DashboardLayout = typeof dashboardLayouts.$inferSelect;

// ABA Formulas Schema
export const abaFormulas = pgTable("aba_formulas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  abRatio: text("ab_ratio").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
});

export const abaFormulaMaterials = pgTable("aba_formula_materials", {
  id: serial("id").primaryKey(),
  formulaId: integer("formula_id")
    .notNull()
    .references(() => abaFormulas.id, { onDelete: "cascade" }),
  materialId: integer("material_id")
    .notNull()
    .references(() => rawMaterials.id),
  screwAPercentage: doublePrecision("screw_a_percentage").notNull().default(0),
  screwBPercentage: doublePrecision("screw_b_percentage").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const abaFormulasRelations = relations(abaFormulas, ({ many, one }) => ({
  materials: many(abaFormulaMaterials),
  creator: one(users, {
    fields: [abaFormulas.createdBy],
    references: [users.id],
  }),
}));

export const abaFormulaMaterialsRelations = relations(
  abaFormulaMaterials,
  ({ one }) => ({
    formula: one(abaFormulas, {
      fields: [abaFormulaMaterials.formulaId],
      references: [abaFormulas.id],
    }),
    material: one(rawMaterials, {
      fields: [abaFormulaMaterials.materialId],
      references: [rawMaterials.id],
    }),
  }),
);

export const insertAbaFormulaSchema = createInsertSchema(abaFormulas).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAbaFormula = z.infer<typeof insertAbaFormulaSchema>;
export type AbaFormula = typeof abaFormulas.$inferSelect;

export const insertAbaFormulaMaterialSchema = createInsertSchema(
  abaFormulaMaterials,
).omit({ id: true, createdAt: true });
export type InsertAbaFormulaMaterial = z.infer<
  typeof insertAbaFormulaMaterialSchema
>;
export type AbaFormulaMaterial = typeof abaFormulaMaterials.$inferSelect;

// JO Mix table - for tracking mixing sessions
export const joMixes = pgTable("jo_mixes", {
  id: serial("id").primaryKey(),
  abaFormulaId: integer("aba_formula_id")
    .notNull()
    .references(() => abaFormulas.id),
  mixNumber: text("mix_number").notNull().unique(), // Auto-generated mix number
  totalQuantity: doublePrecision("total_quantity").notNull(), // Total quantity of this mix
  screwType: text("screw_type").notNull(), // 'A' or 'B'
  status: text("status").default("pending").notNull(), // pending, in_progress, completed
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertJoMixSchema = createInsertSchema(joMixes).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});
export type InsertJoMix = z.infer<typeof insertJoMixSchema>;
export type JoMix = typeof joMixes.$inferSelect;

// JO Mix Items table - for tracking which job orders are included in each mix
export const joMixItems = pgTable("jo_mix_items", {
  id: serial("id").primaryKey(),
  joMixId: integer("jo_mix_id")
    .notNull()
    .references(() => joMixes.id, { onDelete: "cascade" }),
  jobOrderId: integer("job_order_id")
    .notNull()
    .references(() => jobOrders.id),
  quantity: doublePrecision("quantity").notNull(), // Quantity from this job order used in the mix
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertJoMixItemSchema = createInsertSchema(joMixItems).omit({
  id: true,
  createdAt: true,
});
export type InsertJoMixItem = z.infer<typeof insertJoMixItemSchema>;
export type JoMixItem = typeof joMixItems.$inferSelect;

// Professional Documents Module - Enhanced Document Management System
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  documentNumber: text("document_number").notNull().unique(), // Auto-generated unique document S/N
  documentType: text("document_type").notNull(), // "policy", "procedure", "instruction", "form", "contract", "agreement", "report", "memo", "letter", "manual", "specification", "guideline"
  title: text("title").notNull(),
  content: text("content").notNull(), // Rich text content
  templateId: integer("template_id").references(() => documentTemplates.id),
  
  // Status and workflow
  status: text("status").notNull().default("draft"), // "draft", "under_review", "approved", "published", "archived", "obsolete"
  version: text("version").notNull().default("1.0"), // Version tracking (1.0, 1.1, 2.0, etc.)
  parentDocumentId: integer("parent_document_id").references(() => documents.id), // For revisions
  
  // Author and permissions
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  reviewedBy: text("reviewed_by").references(() => users.id),
  approvedBy: text("approved_by").references(() => users.id),
  publishedBy: text("published_by").references(() => users.id),
  
  // Document metadata
  effectiveDate: timestamp("effective_date"),
  expiryDate: timestamp("expiry_date"),
  reviewDate: timestamp("review_date"),
  priority: text("priority").notNull().default("medium"), // "low", "medium", "high", "urgent"
  category: text("category"), // Additional categorization
  department: text("department"), // Department/section ownership
  tags: text("tags").array().default(sql`'{}'`), // Searchable tags
  
  // Recipients and visibility
  recipientIds: text("recipient_ids").array().default(sql`'{}'`), // Specific users
  sectionIds: text("section_ids").array().default(sql`'{}'`), // Specific sections
  isPublic: boolean("is_public").default(false), // Public visibility
  accessLevel: text("access_level").notNull().default("standard"), // "public", "standard", "confidential", "restricted"
  
  // Workflow and approval
  requiresApproval: boolean("requires_approval").default(false),
  approvalWorkflow: text("approval_workflow").array().default(sql`'{}'`), // Array of user IDs for approval chain
  
  // Document properties
  isTemplate: boolean("is_template").default(false),
  isActive: boolean("is_active").default(true),
  
  // Attachments and references
  attachments: jsonb("attachments").default(sql`'[]'`), // File attachments metadata
  references: jsonb("document_references").default(sql`'[]'`), // Related documents, orders, etc.
  
  // Tracking and analytics
  viewCount: integer("view_count").default(0),
  downloadCount: integer("download_count").default(0),
  lastViewedAt: timestamp("last_viewed_at"),
  
  // Archival and deletion
  isArchived: boolean("is_archived").default(false),
  archivedAt: timestamp("archived_at"),
  archivedBy: text("archived_by").references(() => users.id),
  archiveReason: text("archive_reason"),
  
  // Compliance and audit
  complianceRequired: boolean("compliance_required").default(false),
  auditTrail: jsonb("audit_trail").default(sql`'[]'`), // JSON array of changes
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  approvedAt: timestamp("approved_at"),
  publishedAt: timestamp("published_at"),
});

// Professional Document Templates for different document types
export const documentTemplates = pgTable("document_templates", {
  id: serial("id").primaryKey(),
  templateName: text("template_name").notNull(),
  documentType: text("document_type").notNull(), // Same types as documents
  templateContent: text("template_content").notNull(), // HTML template with placeholders
  templateVariables: jsonb("template_variables").default(sql`'{}'`), // Available variables/placeholders
  
  // Template metadata
  description: text("description"),
  category: text("category"), // Template category
  department: text("department"), // Department/section ownership
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  
  // Versioning
  version: text("version").notNull().default("1.0"),
  parentTemplateId: integer("parent_template_id").references(() => documentTemplates.id),
  
  // Access control
  accessLevel: text("access_level").notNull().default("standard"), // "public", "standard", "confidential", "restricted"
  
  // Usage tracking
  usageCount: integer("usage_count").default(0),
  lastUsedAt: timestamp("last_used_at"),
  
  // Creation tracking
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Document Views tracking for analytics
export const documentViews = pgTable("document_views", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  viewedBy: text("viewed_by")
    .notNull()
    .references(() => users.id),
  viewedAt: timestamp("viewed_at").defaultNow(),
  viewDuration: integer("view_duration"), // in seconds
  deviceType: text("device_type"), // "desktop", "mobile", "tablet"
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

// Document Approval Workflow
export const documentApprovals = pgTable("document_approvals", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  approverId: text("approver_id")
    .notNull()
    .references(() => users.id),
  approvalLevel: integer("approval_level").notNull(), // 1, 2, 3, etc.
  status: text("status").notNull().default("pending"), // "pending", "approved", "rejected", "skipped"
  comments: text("comments"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Document Comments and Feedback
export const documentComments = pgTable("document_comments", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  commentBy: text("comment_by")
    .notNull()
    .references(() => users.id),
  comment: text("comment").notNull(),
  commentType: text("comment_type").notNull().default("general"), // "general", "suggestion", "correction", "approval"
  isInternal: boolean("is_internal").default(false), // Internal comments vs public
  parentCommentId: integer("parent_comment_id").references(() => documentComments.id), // For replies
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Document Subscriptions for notifications
export const documentSubscriptions = pgTable("document_subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  documentId: integer("document_id").references(() => documents.id, { onDelete: "cascade" }),
  documentType: text("document_type"), // Subscribe to all docs of a type
  category: text("category"), // Subscribe to all docs in a category
  subscriptionType: text("subscription_type").notNull(), // "document", "type", "category"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for Documents
export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  documentNumber: true,
  version: true,
  viewCount: true,
  downloadCount: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  effectiveDate: z.string().nullish().transform(val => val && val.trim() !== '' ? new Date(val) : undefined),
  expiryDate: z.string().nullish().transform(val => val && val.trim() !== '' ? new Date(val) : undefined),
  reviewDate: z.string().nullish().transform(val => val && val.trim() !== '' ? new Date(val) : undefined),
});
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export const insertDocumentTemplateSchema = createInsertSchema(documentTemplates).omit({
  id: true,
  version: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDocumentTemplate = z.infer<typeof insertDocumentTemplateSchema>;
export type DocumentTemplate = typeof documentTemplates.$inferSelect;

export const insertDocumentViewSchema = createInsertSchema(documentViews).omit({
  id: true,
  viewedAt: true,
});
export type InsertDocumentView = z.infer<typeof insertDocumentViewSchema>;
export type DocumentView = typeof documentViews.$inferSelect;

export const insertDocumentApprovalSchema = createInsertSchema(documentApprovals).omit({
  id: true,
  createdAt: true,
});
export type InsertDocumentApproval = z.infer<typeof insertDocumentApprovalSchema>;
export type DocumentApproval = typeof documentApprovals.$inferSelect;

export const insertDocumentCommentSchema = createInsertSchema(documentComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDocumentComment = z.infer<typeof insertDocumentCommentSchema>;
export type DocumentComment = typeof documentComments.$inferSelect;

export const insertDocumentSubscriptionSchema = createInsertSchema(documentSubscriptions).omit({
  id: true,
  createdAt: true,
});
export type InsertDocumentSubscription = z.infer<typeof insertDocumentSubscriptionSchema>;
export type DocumentSubscription = typeof documentSubscriptions.$inferSelect;

// JO Mix Materials table - for tracking actual material quantities in each mix
export const joMixMaterials = pgTable("jo_mix_materials", {
  id: serial("id").primaryKey(),
  joMixId: integer("jo_mix_id")
    .notNull()
    .references(() => joMixes.id, { onDelete: "cascade" }),
  materialId: integer("material_id")
    .notNull()
    .references(() => rawMaterials.id),
  quantity: doublePrecision("quantity").notNull(), // Calculated quantity for this material
  percentage: doublePrecision("percentage").notNull(), // Percentage of this material in the mix
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertJoMixMaterialSchema = createInsertSchema(
  joMixMaterials,
).omit({ id: true, createdAt: true });
export type InsertJoMixMaterial = z.infer<typeof insertJoMixMaterialSchema>;
export type JoMixMaterial = typeof joMixMaterials.$inferSelect;

// Customer Information Registration (Public Form)
export const customerInformation = pgTable("customer_information", {
  id: serial("id").primaryKey(),
  commercialNameAr: text("commercial_name_ar"),
  commercialNameEn: text("commercial_name_en"),
  commercialRegistrationNo: varchar("commercial_registration_no", {
    length: 10,
  }),
  unifiedNo: varchar("unified_no", { length: 10 }),
  vatNo: varchar("vat_no", { length: 14 }),
  province: text("province").notNull(),
  city: text("city"),
  neighborName: text("neighbor_name"),
  buildingNo: varchar("building_no", { length: 4 }),
  additionalNo: varchar("additional_no", { length: 4 }),
  postalCode: varchar("postal_code", { length: 5 }),
  responseName: text("response_name"),
  responseNo: text("response_no"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCustomerInformationSchema = createInsertSchema(
  customerInformation,
  {
    commercialRegistrationNo: z
      .string()
      .length(10, "Commercial Registration No must be exactly 10 digits"),
    unifiedNo: z.string().length(10, "Unified No must be exactly 10 digits"),
    vatNo: z.string().length(14, "VAT No must be exactly 14 digits"),
    buildingNo: z.string().length(4, "Building No must be exactly 4 digits"),
    additionalNo: z
      .string()
      .length(4, "Additional No must be exactly 4 digits"),
    postalCode: z.string().length(5, "Postal Code must be exactly 5 digits"),
  },
).omit({ id: true, createdAt: true });

export type InsertCustomerInformation = z.infer<
  typeof insertCustomerInformationSchema
>;
export type CustomerInformation = typeof customerInformation.$inferSelect;
