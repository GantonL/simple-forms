CREATE TABLE "form_submission_candidate_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_form_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"data" jsonb
);
--> statement-breakpoint
ALTER TABLE "form_submission_candidate_data" ADD CONSTRAINT "form_submission_candidate_data_user_form_id_user_form_id_fk" FOREIGN KEY ("user_form_id") REFERENCES "public"."user_form"("id") ON DELETE no action ON UPDATE no action;