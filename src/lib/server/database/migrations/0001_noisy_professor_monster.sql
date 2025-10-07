CREATE TABLE "form_submission" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_form_id" integer NOT NULL,
	"data" jsonb NOT NULL,
	"storage_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_template" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"schema" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_form" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"template_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"public_link_identifier" uuid DEFAULT gen_random_uuid(),
	"submissions" integer
);
--> statement-breakpoint
ALTER TABLE "form_submission" ADD CONSTRAINT "form_submission_user_form_id_user_form_id_fk" FOREIGN KEY ("user_form_id") REFERENCES "public"."user_form"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_form" ADD CONSTRAINT "user_form_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_form" ADD CONSTRAINT "user_form_template_id_form_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."form_template"("id") ON DELETE no action ON UPDATE no action;