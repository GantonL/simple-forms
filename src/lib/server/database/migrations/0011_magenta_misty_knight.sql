ALTER TABLE "form_template" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "form_template" ADD COLUMN "is_community" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "form_template" ADD CONSTRAINT "form_template_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;