CREATE TYPE "public"."blog_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."game_status" AS ENUM('active', 'finished', 'abandoned', 'expired');--> statement-breakpoint
CREATE TYPE "public"."game_type" AS ENUM('flag-quiz', 'capital-quiz', 'map-guess');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"family_id" uuid NOT NULL,
	"token_version" integer DEFAULT 0 NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "refresh_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"display_name" text NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"disabled" boolean DEFAULT false NOT NULL,
	"token_version" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country_code" text NOT NULL,
	"slug" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"image" text,
	"translations" jsonb NOT NULL,
	"complete_langs" text[] DEFAULT '{}' NOT NULL,
	CONSTRAINT "cities_country_slug_unique" UNIQUE("country_code","slug")
);
--> statement-breakpoint
CREATE TABLE "city_guides" (
	"city_id" uuid PRIMARY KEY NOT NULL,
	"translations" jsonb NOT NULL,
	"complete_langs" text[] DEFAULT '{}' NOT NULL,
	"reviewed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "continents" (
	"slug" text PRIMARY KEY NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"translations" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"code" text PRIMARY KEY NOT NULL,
	"iso3" text NOT NULL,
	"continent_slug" text NOT NULL,
	"subregion" text,
	"flag" text,
	"latitude" double precision,
	"longitude" double precision,
	"landlocked" boolean DEFAULT false NOT NULL,
	"borders" text[] DEFAULT '{}' NOT NULL,
	"aliases" text[] DEFAULT '{}' NOT NULL,
	"capital" text[] DEFAULT '{}' NOT NULL,
	"translations" jsonb NOT NULL,
	"has_travel" boolean DEFAULT false NOT NULL,
	CONSTRAINT "countries_iso3_unique" UNIQUE("iso3")
);
--> statement-breakpoint
CREATE TABLE "country_travel" (
	"country_code" text PRIMARY KEY NOT NULL,
	"image" text,
	"accent" text,
	"budget" text,
	"iata" text,
	"position" integer DEFAULT 0 NOT NULL,
	"translations" jsonb NOT NULL,
	"complete_langs" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"status" "blog_status" DEFAULT 'draft' NOT NULL,
	"author_id" uuid,
	"cover_image" text,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"country_code" text,
	"translations" jsonb NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "game_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"game_type" "game_type" NOT NULL,
	"status" "game_status" DEFAULT 'active' NOT NULL,
	"rounds" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"current_round" integer DEFAULT 0 NOT NULL,
	"round_started_at" timestamp with time zone,
	"score" integer DEFAULT 0 NOT NULL,
	"correct_count" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"game_type" "game_type" NOT NULL,
	"session_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"correct_count" integer NOT NULL,
	"rounds_total" integer NOT NULL,
	"duration_ms" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "scores_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_code_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "city_guides" ADD CONSTRAINT "city_guides_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "countries" ADD CONSTRAINT "countries_continent_slug_continents_slug_fk" FOREIGN KEY ("continent_slug") REFERENCES "public"."continents"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "country_travel" ADD CONSTRAINT "country_travel_country_code_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_country_code_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scores" ADD CONSTRAINT "scores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scores" ADD CONSTRAINT "scores_session_id_game_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."game_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "refresh_tokens_user_idx" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "refresh_tokens_family_idx" ON "refresh_tokens" USING btree ("family_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_lower_idx" ON "users" USING btree (lower("email"));--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "cities_country_idx" ON "cities" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "countries_continent_idx" ON "countries" USING btree ("continent_slug");--> statement-breakpoint
CREATE INDEX "countries_has_travel_idx" ON "countries" USING btree ("has_travel");--> statement-breakpoint
CREATE INDEX "blog_posts_status_published_idx" ON "blog_posts" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "blog_posts_country_idx" ON "blog_posts" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "blog_posts_tags_idx" ON "blog_posts" USING gin ("tags");--> statement-breakpoint
CREATE INDEX "game_sessions_user_type_status_idx" ON "game_sessions" USING btree ("user_id","game_type","status");--> statement-breakpoint
CREATE INDEX "scores_game_type_score_idx" ON "scores" USING btree ("game_type","score" desc);--> statement-breakpoint
CREATE INDEX "scores_user_game_type_idx" ON "scores" USING btree ("user_id","game_type");