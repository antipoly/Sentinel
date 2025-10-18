CREATE TYPE "public"."caution_level" AS ENUM('High severity', 'Medium severity', 'Low severity');--> statement-breakpoint
CREATE TYPE "public"."incident_type" AS ENUM('Earthquake', 'Wildfire', 'Tsunami', 'Adverse Weather', 'Flash Flood', 'Crime', 'Tornado');--> statement-breakpoint
CREATE TYPE "public"."user_type" AS ENUM('Standard', 'FirstResponder', 'Dispatcher');--> statement-breakpoint
CREATE TABLE "comment_replies" (
	"id" uuid PRIMARY KEY NOT NULL,
	"parent_comment_id" uuid NOT NULL,
	"child_comment_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incident" (
	"id" uuid PRIMARY KEY NOT NULL,
	"description" text,
	"geolocation" text,
	"type" "incident_type" NOT NULL,
	"severity" "caution_level" NOT NULL,
	"active_status" text,
	"timestamp" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incident_assignee" (
	"id" uuid PRIMARY KEY NOT NULL,
	"incident_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incident_comments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"incident_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"is_edited" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incident_witnesses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"incident_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"reported_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"phone_number" text NOT NULL,
	"name" text,
	"dob" timestamp,
	"password" text NOT NULL,
	"type" "user_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "comment_replies" ADD CONSTRAINT "comment_replies_parent_comment_id_incident_comments_id_fk" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."incident_comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_replies" ADD CONSTRAINT "comment_replies_child_comment_id_incident_comments_id_fk" FOREIGN KEY ("child_comment_id") REFERENCES "public"."incident_comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_assignee" ADD CONSTRAINT "incident_assignee_incident_id_incident_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."incident"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_assignee" ADD CONSTRAINT "incident_assignee_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_comments" ADD CONSTRAINT "incident_comments_incident_id_incident_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."incident"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_comments" ADD CONSTRAINT "incident_comments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_witnesses" ADD CONSTRAINT "incident_witnesses_incident_id_incident_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."incident"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_witnesses" ADD CONSTRAINT "incident_witnesses_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;