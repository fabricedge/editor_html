CREATE TABLE "pages" (
	"id" integer PRIMARY KEY NOT NULL,
	"nanoid" text NOT NULL,
	"html_data" jsonb,
	"theme" text,
	"owner" uuid,
	"private" boolean,
	"inserted_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
