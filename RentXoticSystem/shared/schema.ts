import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  type: text("type").notNull(),
  color: text("color").notNull(),
  status: text("status").notNull().default("available"), // available, rented, maintenance
  fuelLevel: integer("fuel_level").notNull().default(100),
  condition: text("condition").notNull().default("excellent"), // excellent, good, fair
  location: text("location").notNull().default("La Jolla Office"),
  mileage: integer("mileage").notNull().default(0),
  lastService: timestamp("last_service").defaultNow(),
  issues: text("issues").array().default([]),
  washed: boolean("washed").notNull().default(false),
  lastWash: timestamp("last_wash"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id).notNull(),
  vehicleName: text("vehicle_name").notNull(),
  type: text("type").notNull(), // wash, delivery, pickup, service, fuel, inspection, photos, other
  priority: text("priority").notNull().default("normal"), // normal, high, urgent
  assigned: text("assigned").notNull().default("Unassigned"),
  description: text("description").notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});



// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  lastService: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});



// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;


