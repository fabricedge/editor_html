CREATE TABLE "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"nanoid" text NOT NULL,
	"html_data" text,
	"theme" text,
	"owner" uuid,
	"private" boolean,
	"inserted_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pages_nanoid_unique" UNIQUE("nanoid")
);
