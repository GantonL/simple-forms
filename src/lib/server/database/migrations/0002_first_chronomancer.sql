ALTER TABLE "user_form" ALTER COLUMN "submissions" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user_form" ALTER COLUMN "submissions" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "form_submission" DROP COLUMN "data";