CREATE TABLE "form_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_form_id" integer NOT NULL,
	"data" jsonb
);
--> statement-breakpoint
ALTER TABLE "form_settings" ADD CONSTRAINT "form_settings_user_form_id_user_form_id_fk" FOREIGN KEY ("user_form_id") REFERENCES "public"."user_form"("id") ON DELETE no action ON UPDATE no action;