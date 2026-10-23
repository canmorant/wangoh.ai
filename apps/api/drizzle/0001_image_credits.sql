CREATE TABLE "image_credits" (
	"image" text PRIMARY KEY NOT NULL,
	"author" text,
	"license_name" text,
	"license_url" text,
	"source_url" text NOT NULL,
	"attribution_required" boolean DEFAULT true NOT NULL
);
