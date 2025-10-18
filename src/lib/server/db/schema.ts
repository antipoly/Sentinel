import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  pgEnum,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";

export const userType = pgEnum("user_type", [
  "Standard",
  "FirstResponder",
  "Dispatcher",
]);

export const incidentType = pgEnum("incident_type", [
  "Earthquake",
  "Wildfire",
  "Tsunami",
  "Adverse Weather",
  "Flash Flood",
  "Crime",
  "Tornado",
]);

export const cautionLevel = pgEnum("caution_level", [
  "High severity",
  "Medium severity",
  "Low severity",
]);

export const user = pgTable("user", {
  id: uuid("id").primaryKey(),
  email: text("email").unique(),
  phoneNumber: text("phone_number").notNull(),
  name: text("name"),
  dob: timestamp("dob", { mode: "date" }),
  password: text("password").notNull(),

  type: userType("type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const incident = pgTable("incident", {
  id: uuid("id").primaryKey(),
  description: text("description"),
  geolocation: text("geolocation"),
  type: incidentType("type").notNull(),
  severity: cautionLevel("severity").notNull(),
  activeStatus: text("active_status"),
  timestamp: timestamp("timestamp", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

// comments
//

export const incident_comments = pgTable("incident_comments", {
  id: uuid("id").primaryKey(),
  incidentId: uuid("incident_id")
    .notNull()
    .references(() => incident.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  isEdited: boolean("is_edited").notNull().default(false),
});

// Separate table for comment replies to handle the self-referential relationship
export const comment_replies = pgTable("comment_replies", {
  id: uuid("id").primaryKey(),
  parentCommentId: uuid("parent_comment_id")
    .notNull()
    .references(() => incident_comments.id),
  childCommentId: uuid("child_comment_id")
    .notNull()
    .references(() => incident_comments.id),
});

export const incident_assignee = pgTable("incident_assignee", {
  id: uuid("id").primaryKey(),
  incidentId: uuid("incident_id")
    .notNull()
    .references(() => incident.id),
  userId: uuid("user_id")

    .notNull()
    .references(() => user.id),
  assignedAt: timestamp("assigned_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const incident_witnesses = pgTable("incident_witnesses", {
  id: uuid("id").primaryKey(),
  incidentId: uuid("incident_id")
    .notNull()
    .references(() => incident.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  reportedAt: timestamp("reported_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export type User = typeof user.$inferSelect;
export type UserType = (typeof userType.enumValues)[number];

export type Incident = typeof incident.$inferSelect;
export type IncidentAssignee = typeof incident_assignee.$inferSelect;
export type IncidentComment = typeof incident_comments.$inferSelect;
export type IncidentWitness = typeof incident_witnesses.$inferSelect;

export type Session = typeof session.$inferSelect;
