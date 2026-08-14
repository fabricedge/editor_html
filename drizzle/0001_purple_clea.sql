ALTER TABLE "pages" ALTER COLUMN "owner" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "expires_at" timestamp;