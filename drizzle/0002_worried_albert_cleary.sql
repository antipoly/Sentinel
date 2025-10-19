ALTER TABLE "comment_replies" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "comment_replies" ALTER COLUMN "parent_comment_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "comment_replies" ALTER COLUMN "child_comment_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "incident" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "incident_assignee" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "incident_assignee" ALTER COLUMN "incident_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "incident_assignee" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "incident_comments" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "incident_comments" ALTER COLUMN "incident_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "incident_comments" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "incident_witnesses" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "incident_witnesses" ALTER COLUMN "incident_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "incident_witnesses" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE text;