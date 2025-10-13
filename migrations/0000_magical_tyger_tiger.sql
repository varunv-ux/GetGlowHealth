CREATE TABLE "analyses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"image_url" text NOT NULL,
	"file_name" text NOT NULL,
	"file_size" integer,
	"processed_size" integer,
	"original_dimensions" text,
	"processed_dimensions" text,
	"status" varchar(20) DEFAULT 'pending',
	"overall_score" integer NOT NULL,
	"skin_health" integer NOT NULL,
	"eye_health" integer NOT NULL,
	"circulation" integer NOT NULL,
	"symmetry" integer NOT NULL,
	"analysis_data" jsonb NOT NULL,
	"recommendations" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");