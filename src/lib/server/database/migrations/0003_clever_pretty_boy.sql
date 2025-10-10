ALTER TABLE "form_template" ADD COLUMN "key" text;--> statement-breakpoint
ALTER TABLE "form_template" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "form_template" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "form_template" ADD CONSTRAINT "form_template_key_unique" UNIQUE("key");