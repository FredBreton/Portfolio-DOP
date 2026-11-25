import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_image_texte_cote" AS ENUM('gauche', 'droite');
  CREATE TYPE "public"."enum_pages_blocks_bouton_contact_type" AS ENUM('film', 'video');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_image_texte_cote" AS ENUM('gauche', 'droite');
  CREATE TYPE "public"."enum__pages_v_blocks_bouton_contact_type" AS ENUM('film', 'video');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_messages_type" AS ENUM('film', 'video');
  CREATE TYPE "public"."enum_messages_notification" AS ENUM('attente', 'envoye', 'desactive', 'echec');
  CREATE TYPE "public"."enum_accueil_blocks_image_texte_cote" AS ENUM('gauche', 'droite');
  CREATE TYPE "public"."enum_accueil_blocks_bouton_contact_type" AS ENUM('film', 'video');
  CREATE TYPE "public"."enum_accueil_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__accueil_v_blocks_image_texte_cote" AS ENUM('gauche', 'droite');
  CREATE TYPE "public"."enum__accueil_v_blocks_bouton_contact_type" AS ENUM('film', 'video');
  CREATE TYPE "public"."enum__accueil_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__accueil_v_published_locale" AS ENUM('fr', 'en');
  CREATE TABLE "projects_prix" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_prix_locales" (
  	"texte" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"categorie_id" integer,
  	"annee" numeric,
  	"couverture_id" integer,
  	"video" varchar,
  	"realisation" varchar,
  	"production" varchar,
  	"lien" varchar,
  	"slug" varchar,
  	"accueil" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_locales" (
  	"titre" varchar,
  	"format" varchar,
  	"description" varchar,
  	"role" varchar,
  	"seo_titre" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_projects_v_version_prix" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_prix_locales" (
  	"texte" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_categorie_id" integer,
  	"version_annee" numeric,
  	"version_couverture_id" integer,
  	"version_video" varchar,
  	"version_realisation" varchar,
  	"version_production" varchar,
  	"version_lien" varchar,
  	"version_slug" varchar,
  	"version_accueil" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__projects_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_locales" (
  	"version_titre" varchar,
  	"version_format" varchar,
  	"version_description" varchar,
  	"version_role" varchar,
  	"version_seo_titre" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"accueil" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"titre" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_texte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_texte_locales" (
  	"titre" varchar,
  	"contenu" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_image_texte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cote" "enum_pages_blocks_image_texte_cote" DEFAULT 'gauche',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_texte_locales" (
  	"titre" varchar,
  	"contenu" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"affiche_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_carrousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_carrousel_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_grille_projets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"categorie_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_grille_projets_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_services_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_services_elements_locales" (
  	"titre" varchar,
  	"texte" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_services_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_temoignages_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nom" varchar
  );
  
  CREATE TABLE "pages_blocks_temoignages_elements_locales" (
  	"citation" varchar,
  	"fonction" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_temoignages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_temoignages_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_logos_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logos_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_bouton_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_bouton_contact_type" DEFAULT 'film',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_bouton_contact_locales" (
  	"titre" varchar,
  	"texte" varchar,
  	"libelle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"slug" varchar,
  	"menu" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"titre" varchar,
  	"intro" varchar,
  	"seo_titre" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_texte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_texte_locales" (
  	"titre" varchar,
  	"contenu" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_image_texte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cote" "enum__pages_v_blocks_image_texte_cote" DEFAULT 'gauche',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_texte_locales" (
  	"titre" varchar,
  	"contenu" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"affiche_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_carrousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_carrousel_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_grille_projets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"categorie_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_grille_projets_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_services_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_elements_locales" (
  	"titre" varchar,
  	"texte" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_temoignages_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_temoignages_elements_locales" (
  	"citation" varchar,
  	"fonction" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_temoignages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_temoignages_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_logos_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logos_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_bouton_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_bouton_contact_type" DEFAULT 'film',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_bouton_contact_locales" (
  	"titre" varchar,
  	"texte" varchar,
  	"libelle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_slug" varchar,
  	"version_menu" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_titre" varchar,
  	"version_intro" varchar,
  	"version_seo_titre" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_petite_url" varchar,
  	"sizes_petite_width" numeric,
  	"sizes_petite_height" numeric,
  	"sizes_petite_mime_type" varchar,
  	"sizes_petite_filesize" numeric,
  	"sizes_petite_filename" varchar,
  	"sizes_moyenne_url" varchar,
  	"sizes_moyenne_width" numeric,
  	"sizes_moyenne_height" numeric,
  	"sizes_moyenne_mime_type" varchar,
  	"sizes_moyenne_filesize" numeric,
  	"sizes_moyenne_filename" varchar,
  	"sizes_grande_url" varchar,
  	"sizes_grande_width" numeric,
  	"sizes_grande_height" numeric,
  	"sizes_grande_mime_type" varchar,
  	"sizes_grande_filesize" numeric,
  	"sizes_grande_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"lu" boolean DEFAULT false,
  	"nom" varchar NOT NULL,
  	"courriel" varchar NOT NULL,
  	"type" "enum_messages_type" NOT NULL,
  	"message" varchar NOT NULL,
  	"notification" "enum_messages_notification" DEFAULT 'attente',
  	"erreur" varchar,
  	"expediteur" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer,
  	"categories_id" integer,
  	"pages_id" integer,
  	"media_id" integer,
  	"messages_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "accueil_blocks_texte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "accueil_blocks_texte_locales" (
  	"titre" varchar,
  	"contenu" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accueil_blocks_image_texte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cote" "enum_accueil_blocks_image_texte_cote" DEFAULT 'gauche',
  	"block_name" varchar
  );
  
  CREATE TABLE "accueil_blocks_image_texte_locales" (
  	"titre" varchar,
  	"contenu" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accueil_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"affiche_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "accueil_blocks_video_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accueil_blocks_carrousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "accueil_blocks_carrousel_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accueil_blocks_grille_projets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"categorie_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "accueil_blocks_grille_projets_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accueil_blocks_services_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "accueil_blocks_services_elements_locales" (
  	"titre" varchar,
  	"texte" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accueil_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "accueil_blocks_services_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accueil_blocks_temoignages_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nom" varchar
  );
  
  CREATE TABLE "accueil_blocks_temoignages_elements_locales" (
  	"citation" varchar,
  	"fonction" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accueil_blocks_temoignages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "accueil_blocks_temoignages_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accueil_blocks_logos_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "accueil_blocks_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "accueil_blocks_logos_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accueil_blocks_bouton_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_accueil_blocks_bouton_contact_type" DEFAULT 'film',
  	"block_name" varchar
  );
  
  CREATE TABLE "accueil_blocks_bouton_contact_locales" (
  	"titre" varchar,
  	"texte" varchar,
  	"libelle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accueil" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"image_id" integer,
  	"demo" varchar,
  	"_status" "enum_accueil_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "accueil_locales" (
  	"seo_titre" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "accueil_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_accueil_v_blocks_texte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_accueil_v_blocks_texte_locales" (
  	"titre" varchar,
  	"contenu" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_accueil_v_blocks_image_texte" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cote" "enum__accueil_v_blocks_image_texte_cote" DEFAULT 'gauche',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_accueil_v_blocks_image_texte_locales" (
  	"titre" varchar,
  	"contenu" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_accueil_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"affiche_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_accueil_v_blocks_video_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_accueil_v_blocks_carrousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_accueil_v_blocks_carrousel_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_accueil_v_blocks_grille_projets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"categorie_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_accueil_v_blocks_grille_projets_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_accueil_v_blocks_services_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_accueil_v_blocks_services_elements_locales" (
  	"titre" varchar,
  	"texte" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_accueil_v_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_accueil_v_blocks_services_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_accueil_v_blocks_temoignages_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_accueil_v_blocks_temoignages_elements_locales" (
  	"citation" varchar,
  	"fonction" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_accueil_v_blocks_temoignages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_accueil_v_blocks_temoignages_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_accueil_v_blocks_logos_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_accueil_v_blocks_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_accueil_v_blocks_logos_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_accueil_v_blocks_bouton_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__accueil_v_blocks_bouton_contact_type" DEFAULT 'film',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_accueil_v_blocks_bouton_contact_locales" (
  	"titre" varchar,
  	"texte" varchar,
  	"libelle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_accueil_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_video_id" integer,
  	"version_image_id" integer,
  	"version_demo" varchar,
  	"version__status" "enum__accueil_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__accueil_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_accueil_v_locales" (
  	"version_seo_titre" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_accueil_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "reglages_reseaux" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nom" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "reglages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom" varchar DEFAULT 'Frédérick Breton' NOT NULL,
  	"image_id" integer,
  	"courriel" varchar,
  	"courriel_messages" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "reglages_locales" (
  	"metier" varchar DEFAULT 'Directeur photo' NOT NULL,
  	"description" varchar,
  	"contact_intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "projects_prix" ADD CONSTRAINT "projects_prix_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_prix_locales" ADD CONSTRAINT "projects_prix_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_prix"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_categorie_id_categories_id_fk" FOREIGN KEY ("categorie_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_couverture_id_media_id_fk" FOREIGN KEY ("couverture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_prix" ADD CONSTRAINT "_projects_v_version_prix_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_prix_locales" ADD CONSTRAINT "_projects_v_version_prix_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_prix"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_categorie_id_categories_id_fk" FOREIGN KEY ("version_categorie_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_couverture_id_media_id_fk" FOREIGN KEY ("version_couverture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_texte" ADD CONSTRAINT "pages_blocks_texte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_texte_locales" ADD CONSTRAINT "pages_blocks_texte_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_texte" ADD CONSTRAINT "pages_blocks_image_texte_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_texte" ADD CONSTRAINT "pages_blocks_image_texte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_texte_locales" ADD CONSTRAINT "pages_blocks_image_texte_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_affiche_id_media_id_fk" FOREIGN KEY ("affiche_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_locales" ADD CONSTRAINT "pages_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_carrousel" ADD CONSTRAINT "pages_blocks_carrousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_carrousel_locales" ADD CONSTRAINT "pages_blocks_carrousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_carrousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_grille_projets" ADD CONSTRAINT "pages_blocks_grille_projets_categorie_id_categories_id_fk" FOREIGN KEY ("categorie_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_grille_projets" ADD CONSTRAINT "pages_blocks_grille_projets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_grille_projets_locales" ADD CONSTRAINT "pages_blocks_grille_projets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_grille_projets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_elements" ADD CONSTRAINT "pages_blocks_services_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_elements_locales" ADD CONSTRAINT "pages_blocks_services_elements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services_elements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services" ADD CONSTRAINT "pages_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_locales" ADD CONSTRAINT "pages_blocks_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_temoignages_elements" ADD CONSTRAINT "pages_blocks_temoignages_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_temoignages_elements_locales" ADD CONSTRAINT "pages_blocks_temoignages_elements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_temoignages_elements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_temoignages" ADD CONSTRAINT "pages_blocks_temoignages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_temoignages_locales" ADD CONSTRAINT "pages_blocks_temoignages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos_elements" ADD CONSTRAINT "pages_blocks_logos_elements_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos_elements" ADD CONSTRAINT "pages_blocks_logos_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos" ADD CONSTRAINT "pages_blocks_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos_locales" ADD CONSTRAINT "pages_blocks_logos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_bouton_contact" ADD CONSTRAINT "pages_blocks_bouton_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_bouton_contact_locales" ADD CONSTRAINT "pages_blocks_bouton_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_bouton_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_texte" ADD CONSTRAINT "_pages_v_blocks_texte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_texte_locales" ADD CONSTRAINT "_pages_v_blocks_texte_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_texte" ADD CONSTRAINT "_pages_v_blocks_image_texte_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_texte" ADD CONSTRAINT "_pages_v_blocks_image_texte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_texte_locales" ADD CONSTRAINT "_pages_v_blocks_image_texte_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_affiche_id_media_id_fk" FOREIGN KEY ("affiche_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_locales" ADD CONSTRAINT "_pages_v_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carrousel" ADD CONSTRAINT "_pages_v_blocks_carrousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carrousel_locales" ADD CONSTRAINT "_pages_v_blocks_carrousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_carrousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_grille_projets" ADD CONSTRAINT "_pages_v_blocks_grille_projets_categorie_id_categories_id_fk" FOREIGN KEY ("categorie_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_grille_projets" ADD CONSTRAINT "_pages_v_blocks_grille_projets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_grille_projets_locales" ADD CONSTRAINT "_pages_v_blocks_grille_projets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_grille_projets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_elements" ADD CONSTRAINT "_pages_v_blocks_services_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_elements_locales" ADD CONSTRAINT "_pages_v_blocks_services_elements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services_elements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services" ADD CONSTRAINT "_pages_v_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_locales" ADD CONSTRAINT "_pages_v_blocks_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_temoignages_elements" ADD CONSTRAINT "_pages_v_blocks_temoignages_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_temoignages_elements_locales" ADD CONSTRAINT "_pages_v_blocks_temoignages_elements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_temoignages_elements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_temoignages" ADD CONSTRAINT "_pages_v_blocks_temoignages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_temoignages_locales" ADD CONSTRAINT "_pages_v_blocks_temoignages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logos_elements" ADD CONSTRAINT "_pages_v_blocks_logos_elements_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logos_elements" ADD CONSTRAINT "_pages_v_blocks_logos_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logos" ADD CONSTRAINT "_pages_v_blocks_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logos_locales" ADD CONSTRAINT "_pages_v_blocks_logos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_bouton_contact" ADD CONSTRAINT "_pages_v_blocks_bouton_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_bouton_contact_locales" ADD CONSTRAINT "_pages_v_blocks_bouton_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_bouton_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_messages_fk" FOREIGN KEY ("messages_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_texte" ADD CONSTRAINT "accueil_blocks_texte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_texte_locales" ADD CONSTRAINT "accueil_blocks_texte_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil_blocks_texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_image_texte" ADD CONSTRAINT "accueil_blocks_image_texte_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accueil_blocks_image_texte" ADD CONSTRAINT "accueil_blocks_image_texte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_image_texte_locales" ADD CONSTRAINT "accueil_blocks_image_texte_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil_blocks_image_texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_video" ADD CONSTRAINT "accueil_blocks_video_affiche_id_media_id_fk" FOREIGN KEY ("affiche_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accueil_blocks_video" ADD CONSTRAINT "accueil_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_video_locales" ADD CONSTRAINT "accueil_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_carrousel" ADD CONSTRAINT "accueil_blocks_carrousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_carrousel_locales" ADD CONSTRAINT "accueil_blocks_carrousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil_blocks_carrousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_grille_projets" ADD CONSTRAINT "accueil_blocks_grille_projets_categorie_id_categories_id_fk" FOREIGN KEY ("categorie_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accueil_blocks_grille_projets" ADD CONSTRAINT "accueil_blocks_grille_projets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_grille_projets_locales" ADD CONSTRAINT "accueil_blocks_grille_projets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil_blocks_grille_projets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_services_elements" ADD CONSTRAINT "accueil_blocks_services_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_services_elements_locales" ADD CONSTRAINT "accueil_blocks_services_elements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil_blocks_services_elements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_services" ADD CONSTRAINT "accueil_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_services_locales" ADD CONSTRAINT "accueil_blocks_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_temoignages_elements" ADD CONSTRAINT "accueil_blocks_temoignages_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil_blocks_temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_temoignages_elements_locales" ADD CONSTRAINT "accueil_blocks_temoignages_elements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil_blocks_temoignages_elements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_temoignages" ADD CONSTRAINT "accueil_blocks_temoignages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_temoignages_locales" ADD CONSTRAINT "accueil_blocks_temoignages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil_blocks_temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_logos_elements" ADD CONSTRAINT "accueil_blocks_logos_elements_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accueil_blocks_logos_elements" ADD CONSTRAINT "accueil_blocks_logos_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_logos" ADD CONSTRAINT "accueil_blocks_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_logos_locales" ADD CONSTRAINT "accueil_blocks_logos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_bouton_contact" ADD CONSTRAINT "accueil_blocks_bouton_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_blocks_bouton_contact_locales" ADD CONSTRAINT "accueil_blocks_bouton_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil_blocks_bouton_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil" ADD CONSTRAINT "accueil_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accueil" ADD CONSTRAINT "accueil_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accueil_locales" ADD CONSTRAINT "accueil_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_rels" ADD CONSTRAINT "accueil_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accueil_rels" ADD CONSTRAINT "accueil_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_texte" ADD CONSTRAINT "_accueil_v_blocks_texte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_texte_locales" ADD CONSTRAINT "_accueil_v_blocks_texte_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v_blocks_texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_image_texte" ADD CONSTRAINT "_accueil_v_blocks_image_texte_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_image_texte" ADD CONSTRAINT "_accueil_v_blocks_image_texte_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_image_texte_locales" ADD CONSTRAINT "_accueil_v_blocks_image_texte_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v_blocks_image_texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_video" ADD CONSTRAINT "_accueil_v_blocks_video_affiche_id_media_id_fk" FOREIGN KEY ("affiche_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_video" ADD CONSTRAINT "_accueil_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_video_locales" ADD CONSTRAINT "_accueil_v_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_carrousel" ADD CONSTRAINT "_accueil_v_blocks_carrousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_carrousel_locales" ADD CONSTRAINT "_accueil_v_blocks_carrousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v_blocks_carrousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_grille_projets" ADD CONSTRAINT "_accueil_v_blocks_grille_projets_categorie_id_categories_id_fk" FOREIGN KEY ("categorie_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_grille_projets" ADD CONSTRAINT "_accueil_v_blocks_grille_projets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_grille_projets_locales" ADD CONSTRAINT "_accueil_v_blocks_grille_projets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v_blocks_grille_projets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_services_elements" ADD CONSTRAINT "_accueil_v_blocks_services_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_services_elements_locales" ADD CONSTRAINT "_accueil_v_blocks_services_elements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v_blocks_services_elements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_services" ADD CONSTRAINT "_accueil_v_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_services_locales" ADD CONSTRAINT "_accueil_v_blocks_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_temoignages_elements" ADD CONSTRAINT "_accueil_v_blocks_temoignages_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v_blocks_temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_temoignages_elements_locales" ADD CONSTRAINT "_accueil_v_blocks_temoignages_elements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v_blocks_temoignages_elements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_temoignages" ADD CONSTRAINT "_accueil_v_blocks_temoignages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_temoignages_locales" ADD CONSTRAINT "_accueil_v_blocks_temoignages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v_blocks_temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_logos_elements" ADD CONSTRAINT "_accueil_v_blocks_logos_elements_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_logos_elements" ADD CONSTRAINT "_accueil_v_blocks_logos_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_logos" ADD CONSTRAINT "_accueil_v_blocks_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_logos_locales" ADD CONSTRAINT "_accueil_v_blocks_logos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_bouton_contact" ADD CONSTRAINT "_accueil_v_blocks_bouton_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_blocks_bouton_contact_locales" ADD CONSTRAINT "_accueil_v_blocks_bouton_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v_blocks_bouton_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v" ADD CONSTRAINT "_accueil_v_version_video_id_media_id_fk" FOREIGN KEY ("version_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_accueil_v" ADD CONSTRAINT "_accueil_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_accueil_v_locales" ADD CONSTRAINT "_accueil_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accueil_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_rels" ADD CONSTRAINT "_accueil_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_accueil_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accueil_v_rels" ADD CONSTRAINT "_accueil_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reglages_reseaux" ADD CONSTRAINT "reglages_reseaux_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reglages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reglages" ADD CONSTRAINT "reglages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reglages_locales" ADD CONSTRAINT "reglages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reglages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_prix_order_idx" ON "projects_prix" USING btree ("_order");
  CREATE INDEX "projects_prix_parent_id_idx" ON "projects_prix" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_prix_locales_locale_parent_id_unique" ON "projects_prix_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_prix_locales_parent_id_idx" ON "projects_prix_locales" USING btree ("_parent_id");
  CREATE INDEX "projects__order_idx" ON "projects" USING btree ("_order");
  CREATE INDEX "projects_categorie_idx" ON "projects" USING btree ("categorie_id");
  CREATE INDEX "projects_couverture_idx" ON "projects" USING btree ("couverture_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_locales_parent_id_idx" ON "projects_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_media_id_idx" ON "projects_rels" USING btree ("media_id");
  CREATE INDEX "_projects_v_version_prix_order_idx" ON "_projects_v_version_prix" USING btree ("_order");
  CREATE INDEX "_projects_v_version_prix_parent_id_idx" ON "_projects_v_version_prix" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_prix_locales_locale_parent_id_unique" ON "_projects_v_version_prix_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_prix_locales_parent_id_idx" ON "_projects_v_version_prix_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version__order_idx" ON "_projects_v" USING btree ("version__order");
  CREATE INDEX "_projects_v_version_version_categorie_idx" ON "_projects_v" USING btree ("version_categorie_id");
  CREATE INDEX "_projects_v_version_version_couverture_idx" ON "_projects_v" USING btree ("version_couverture_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_snapshot_idx" ON "_projects_v" USING btree ("snapshot");
  CREATE INDEX "_projects_v_published_locale_idx" ON "_projects_v" USING btree ("published_locale");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_projects_v_locales_locale_parent_id_unique" ON "_projects_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_locales_parent_id_idx" ON "_projects_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_media_id_idx" ON "_projects_v_rels" USING btree ("media_id");
  CREATE INDEX "categories__order_idx" ON "categories" USING btree ("_order");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_locales_parent_id_idx" ON "categories_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_texte_order_idx" ON "pages_blocks_texte" USING btree ("_order");
  CREATE INDEX "pages_blocks_texte_parent_id_idx" ON "pages_blocks_texte" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_texte_path_idx" ON "pages_blocks_texte" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_texte_locales_locale_parent_id_unique" ON "pages_blocks_texte_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_texte_locales_parent_id_idx" ON "pages_blocks_texte_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_texte_order_idx" ON "pages_blocks_image_texte" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_texte_parent_id_idx" ON "pages_blocks_image_texte" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_texte_path_idx" ON "pages_blocks_image_texte" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_texte_image_idx" ON "pages_blocks_image_texte" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_image_texte_locales_locale_parent_id_unique" ON "pages_blocks_image_texte_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_image_texte_locales_parent_id_idx" ON "pages_blocks_image_texte_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_affiche_idx" ON "pages_blocks_video" USING btree ("affiche_id");
  CREATE UNIQUE INDEX "pages_blocks_video_locales_locale_parent_id_unique" ON "pages_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_video_locales_parent_id_idx" ON "pages_blocks_video_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_carrousel_order_idx" ON "pages_blocks_carrousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_carrousel_parent_id_idx" ON "pages_blocks_carrousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_carrousel_path_idx" ON "pages_blocks_carrousel" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_carrousel_locales_locale_parent_id_unique" ON "pages_blocks_carrousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_carrousel_locales_parent_id_idx" ON "pages_blocks_carrousel_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_grille_projets_order_idx" ON "pages_blocks_grille_projets" USING btree ("_order");
  CREATE INDEX "pages_blocks_grille_projets_parent_id_idx" ON "pages_blocks_grille_projets" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_grille_projets_path_idx" ON "pages_blocks_grille_projets" USING btree ("_path");
  CREATE INDEX "pages_blocks_grille_projets_categorie_idx" ON "pages_blocks_grille_projets" USING btree ("categorie_id");
  CREATE UNIQUE INDEX "pages_blocks_grille_projets_locales_locale_parent_id_unique" ON "pages_blocks_grille_projets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_grille_projets_locales_parent_id_idx" ON "pages_blocks_grille_projets_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_elements_order_idx" ON "pages_blocks_services_elements" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_elements_parent_id_idx" ON "pages_blocks_services_elements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_services_elements_locales_locale_parent_id_uniq" ON "pages_blocks_services_elements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_services_elements_locales_parent_id_idx" ON "pages_blocks_services_elements_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_order_idx" ON "pages_blocks_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_parent_id_idx" ON "pages_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_path_idx" ON "pages_blocks_services" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_services_locales_locale_parent_id_unique" ON "pages_blocks_services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_services_locales_parent_id_idx" ON "pages_blocks_services_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_temoignages_elements_order_idx" ON "pages_blocks_temoignages_elements" USING btree ("_order");
  CREATE INDEX "pages_blocks_temoignages_elements_parent_id_idx" ON "pages_blocks_temoignages_elements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_temoignages_elements_locales_locale_parent_id_u" ON "pages_blocks_temoignages_elements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_temoignages_elements_locales_parent_id_idx" ON "pages_blocks_temoignages_elements_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_temoignages_order_idx" ON "pages_blocks_temoignages" USING btree ("_order");
  CREATE INDEX "pages_blocks_temoignages_parent_id_idx" ON "pages_blocks_temoignages" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_temoignages_path_idx" ON "pages_blocks_temoignages" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_temoignages_locales_locale_parent_id_unique" ON "pages_blocks_temoignages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_temoignages_locales_parent_id_idx" ON "pages_blocks_temoignages_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logos_elements_order_idx" ON "pages_blocks_logos_elements" USING btree ("_order");
  CREATE INDEX "pages_blocks_logos_elements_parent_id_idx" ON "pages_blocks_logos_elements" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logos_elements_logo_idx" ON "pages_blocks_logos_elements" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_logos_order_idx" ON "pages_blocks_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logos_parent_id_idx" ON "pages_blocks_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logos_path_idx" ON "pages_blocks_logos" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_logos_locales_locale_parent_id_unique" ON "pages_blocks_logos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_logos_locales_parent_id_idx" ON "pages_blocks_logos_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_bouton_contact_order_idx" ON "pages_blocks_bouton_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_bouton_contact_parent_id_idx" ON "pages_blocks_bouton_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_bouton_contact_path_idx" ON "pages_blocks_bouton_contact" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_bouton_contact_locales_locale_parent_id_unique" ON "pages_blocks_bouton_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_bouton_contact_locales_parent_id_idx" ON "pages_blocks_bouton_contact_locales" USING btree ("_parent_id");
  CREATE INDEX "pages__order_idx" ON "pages" USING btree ("_order");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_texte_order_idx" ON "_pages_v_blocks_texte" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_texte_parent_id_idx" ON "_pages_v_blocks_texte" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_texte_path_idx" ON "_pages_v_blocks_texte" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_texte_locales_locale_parent_id_unique" ON "_pages_v_blocks_texte_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_texte_locales_parent_id_idx" ON "_pages_v_blocks_texte_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_texte_order_idx" ON "_pages_v_blocks_image_texte" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_texte_parent_id_idx" ON "_pages_v_blocks_image_texte" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_texte_path_idx" ON "_pages_v_blocks_image_texte" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_texte_image_idx" ON "_pages_v_blocks_image_texte" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_image_texte_locales_locale_parent_id_unique" ON "_pages_v_blocks_image_texte_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_image_texte_locales_parent_id_idx" ON "_pages_v_blocks_image_texte_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_affiche_idx" ON "_pages_v_blocks_video" USING btree ("affiche_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_video_locales_locale_parent_id_unique" ON "_pages_v_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_video_locales_parent_id_idx" ON "_pages_v_blocks_video_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_carrousel_order_idx" ON "_pages_v_blocks_carrousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_carrousel_parent_id_idx" ON "_pages_v_blocks_carrousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_carrousel_path_idx" ON "_pages_v_blocks_carrousel" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_carrousel_locales_locale_parent_id_unique" ON "_pages_v_blocks_carrousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_carrousel_locales_parent_id_idx" ON "_pages_v_blocks_carrousel_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_grille_projets_order_idx" ON "_pages_v_blocks_grille_projets" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_grille_projets_parent_id_idx" ON "_pages_v_blocks_grille_projets" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_grille_projets_path_idx" ON "_pages_v_blocks_grille_projets" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_grille_projets_categorie_idx" ON "_pages_v_blocks_grille_projets" USING btree ("categorie_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_grille_projets_locales_locale_parent_id_uniq" ON "_pages_v_blocks_grille_projets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_grille_projets_locales_parent_id_idx" ON "_pages_v_blocks_grille_projets_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_elements_order_idx" ON "_pages_v_blocks_services_elements" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_elements_parent_id_idx" ON "_pages_v_blocks_services_elements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_services_elements_locales_locale_parent_id_u" ON "_pages_v_blocks_services_elements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_services_elements_locales_parent_id_idx" ON "_pages_v_blocks_services_elements_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_order_idx" ON "_pages_v_blocks_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_parent_id_idx" ON "_pages_v_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_path_idx" ON "_pages_v_blocks_services" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_services_locales_locale_parent_id_unique" ON "_pages_v_blocks_services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_services_locales_parent_id_idx" ON "_pages_v_blocks_services_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_temoignages_elements_order_idx" ON "_pages_v_blocks_temoignages_elements" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_temoignages_elements_parent_id_idx" ON "_pages_v_blocks_temoignages_elements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_temoignages_elements_locales_locale_parent_i" ON "_pages_v_blocks_temoignages_elements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_temoignages_elements_locales_parent_id_idx" ON "_pages_v_blocks_temoignages_elements_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_temoignages_order_idx" ON "_pages_v_blocks_temoignages" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_temoignages_parent_id_idx" ON "_pages_v_blocks_temoignages" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_temoignages_path_idx" ON "_pages_v_blocks_temoignages" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_temoignages_locales_locale_parent_id_unique" ON "_pages_v_blocks_temoignages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_temoignages_locales_parent_id_idx" ON "_pages_v_blocks_temoignages_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logos_elements_order_idx" ON "_pages_v_blocks_logos_elements" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logos_elements_parent_id_idx" ON "_pages_v_blocks_logos_elements" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logos_elements_logo_idx" ON "_pages_v_blocks_logos_elements" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_logos_order_idx" ON "_pages_v_blocks_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logos_parent_id_idx" ON "_pages_v_blocks_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logos_path_idx" ON "_pages_v_blocks_logos" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_logos_locales_locale_parent_id_unique" ON "_pages_v_blocks_logos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_logos_locales_parent_id_idx" ON "_pages_v_blocks_logos_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_bouton_contact_order_idx" ON "_pages_v_blocks_bouton_contact" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_bouton_contact_parent_id_idx" ON "_pages_v_blocks_bouton_contact" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_bouton_contact_path_idx" ON "_pages_v_blocks_bouton_contact" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_bouton_contact_locales_locale_parent_id_uniq" ON "_pages_v_blocks_bouton_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_bouton_contact_locales_parent_id_idx" ON "_pages_v_blocks_bouton_contact_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version__order_idx" ON "_pages_v" USING btree ("version__order");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_locales_parent_id_idx" ON "_pages_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_petite_sizes_petite_filename_idx" ON "media" USING btree ("sizes_petite_filename");
  CREATE INDEX "media_sizes_moyenne_sizes_moyenne_filename_idx" ON "media" USING btree ("sizes_moyenne_filename");
  CREATE INDEX "media_sizes_grande_sizes_grande_filename_idx" ON "media" USING btree ("sizes_grande_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "messages_expediteur_idx" ON "messages" USING btree ("expediteur");
  CREATE INDEX "messages_updated_at_idx" ON "messages" USING btree ("updated_at");
  CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("messages_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "accueil_blocks_texte_order_idx" ON "accueil_blocks_texte" USING btree ("_order");
  CREATE INDEX "accueil_blocks_texte_parent_id_idx" ON "accueil_blocks_texte" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_texte_path_idx" ON "accueil_blocks_texte" USING btree ("_path");
  CREATE UNIQUE INDEX "accueil_blocks_texte_locales_locale_parent_id_unique" ON "accueil_blocks_texte_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accueil_blocks_texte_locales_parent_id_idx" ON "accueil_blocks_texte_locales" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_image_texte_order_idx" ON "accueil_blocks_image_texte" USING btree ("_order");
  CREATE INDEX "accueil_blocks_image_texte_parent_id_idx" ON "accueil_blocks_image_texte" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_image_texte_path_idx" ON "accueil_blocks_image_texte" USING btree ("_path");
  CREATE INDEX "accueil_blocks_image_texte_image_idx" ON "accueil_blocks_image_texte" USING btree ("image_id");
  CREATE UNIQUE INDEX "accueil_blocks_image_texte_locales_locale_parent_id_unique" ON "accueil_blocks_image_texte_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accueil_blocks_image_texte_locales_parent_id_idx" ON "accueil_blocks_image_texte_locales" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_video_order_idx" ON "accueil_blocks_video" USING btree ("_order");
  CREATE INDEX "accueil_blocks_video_parent_id_idx" ON "accueil_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_video_path_idx" ON "accueil_blocks_video" USING btree ("_path");
  CREATE INDEX "accueil_blocks_video_affiche_idx" ON "accueil_blocks_video" USING btree ("affiche_id");
  CREATE UNIQUE INDEX "accueil_blocks_video_locales_locale_parent_id_unique" ON "accueil_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accueil_blocks_video_locales_parent_id_idx" ON "accueil_blocks_video_locales" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_carrousel_order_idx" ON "accueil_blocks_carrousel" USING btree ("_order");
  CREATE INDEX "accueil_blocks_carrousel_parent_id_idx" ON "accueil_blocks_carrousel" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_carrousel_path_idx" ON "accueil_blocks_carrousel" USING btree ("_path");
  CREATE UNIQUE INDEX "accueil_blocks_carrousel_locales_locale_parent_id_unique" ON "accueil_blocks_carrousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accueil_blocks_carrousel_locales_parent_id_idx" ON "accueil_blocks_carrousel_locales" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_grille_projets_order_idx" ON "accueil_blocks_grille_projets" USING btree ("_order");
  CREATE INDEX "accueil_blocks_grille_projets_parent_id_idx" ON "accueil_blocks_grille_projets" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_grille_projets_path_idx" ON "accueil_blocks_grille_projets" USING btree ("_path");
  CREATE INDEX "accueil_blocks_grille_projets_categorie_idx" ON "accueil_blocks_grille_projets" USING btree ("categorie_id");
  CREATE UNIQUE INDEX "accueil_blocks_grille_projets_locales_locale_parent_id_uniqu" ON "accueil_blocks_grille_projets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accueil_blocks_grille_projets_locales_parent_id_idx" ON "accueil_blocks_grille_projets_locales" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_services_elements_order_idx" ON "accueil_blocks_services_elements" USING btree ("_order");
  CREATE INDEX "accueil_blocks_services_elements_parent_id_idx" ON "accueil_blocks_services_elements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "accueil_blocks_services_elements_locales_locale_parent_id_un" ON "accueil_blocks_services_elements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accueil_blocks_services_elements_locales_parent_id_idx" ON "accueil_blocks_services_elements_locales" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_services_order_idx" ON "accueil_blocks_services" USING btree ("_order");
  CREATE INDEX "accueil_blocks_services_parent_id_idx" ON "accueil_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_services_path_idx" ON "accueil_blocks_services" USING btree ("_path");
  CREATE UNIQUE INDEX "accueil_blocks_services_locales_locale_parent_id_unique" ON "accueil_blocks_services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accueil_blocks_services_locales_parent_id_idx" ON "accueil_blocks_services_locales" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_temoignages_elements_order_idx" ON "accueil_blocks_temoignages_elements" USING btree ("_order");
  CREATE INDEX "accueil_blocks_temoignages_elements_parent_id_idx" ON "accueil_blocks_temoignages_elements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "accueil_blocks_temoignages_elements_locales_locale_parent_id" ON "accueil_blocks_temoignages_elements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accueil_blocks_temoignages_elements_locales_parent_id_idx" ON "accueil_blocks_temoignages_elements_locales" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_temoignages_order_idx" ON "accueil_blocks_temoignages" USING btree ("_order");
  CREATE INDEX "accueil_blocks_temoignages_parent_id_idx" ON "accueil_blocks_temoignages" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_temoignages_path_idx" ON "accueil_blocks_temoignages" USING btree ("_path");
  CREATE UNIQUE INDEX "accueil_blocks_temoignages_locales_locale_parent_id_unique" ON "accueil_blocks_temoignages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accueil_blocks_temoignages_locales_parent_id_idx" ON "accueil_blocks_temoignages_locales" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_logos_elements_order_idx" ON "accueil_blocks_logos_elements" USING btree ("_order");
  CREATE INDEX "accueil_blocks_logos_elements_parent_id_idx" ON "accueil_blocks_logos_elements" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_logos_elements_logo_idx" ON "accueil_blocks_logos_elements" USING btree ("logo_id");
  CREATE INDEX "accueil_blocks_logos_order_idx" ON "accueil_blocks_logos" USING btree ("_order");
  CREATE INDEX "accueil_blocks_logos_parent_id_idx" ON "accueil_blocks_logos" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_logos_path_idx" ON "accueil_blocks_logos" USING btree ("_path");
  CREATE UNIQUE INDEX "accueil_blocks_logos_locales_locale_parent_id_unique" ON "accueil_blocks_logos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accueil_blocks_logos_locales_parent_id_idx" ON "accueil_blocks_logos_locales" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_bouton_contact_order_idx" ON "accueil_blocks_bouton_contact" USING btree ("_order");
  CREATE INDEX "accueil_blocks_bouton_contact_parent_id_idx" ON "accueil_blocks_bouton_contact" USING btree ("_parent_id");
  CREATE INDEX "accueil_blocks_bouton_contact_path_idx" ON "accueil_blocks_bouton_contact" USING btree ("_path");
  CREATE UNIQUE INDEX "accueil_blocks_bouton_contact_locales_locale_parent_id_uniqu" ON "accueil_blocks_bouton_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accueil_blocks_bouton_contact_locales_parent_id_idx" ON "accueil_blocks_bouton_contact_locales" USING btree ("_parent_id");
  CREATE INDEX "accueil_video_idx" ON "accueil" USING btree ("video_id");
  CREATE INDEX "accueil_image_idx" ON "accueil" USING btree ("image_id");
  CREATE INDEX "accueil__status_idx" ON "accueil" USING btree ("_status");
  CREATE UNIQUE INDEX "accueil_locales_locale_parent_id_unique" ON "accueil_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accueil_locales_parent_id_idx" ON "accueil_locales" USING btree ("_parent_id");
  CREATE INDEX "accueil_rels_order_idx" ON "accueil_rels" USING btree ("order");
  CREATE INDEX "accueil_rels_parent_idx" ON "accueil_rels" USING btree ("parent_id");
  CREATE INDEX "accueil_rels_path_idx" ON "accueil_rels" USING btree ("path");
  CREATE INDEX "accueil_rels_media_id_idx" ON "accueil_rels" USING btree ("media_id");
  CREATE INDEX "_accueil_v_blocks_texte_order_idx" ON "_accueil_v_blocks_texte" USING btree ("_order");
  CREATE INDEX "_accueil_v_blocks_texte_parent_id_idx" ON "_accueil_v_blocks_texte" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_texte_path_idx" ON "_accueil_v_blocks_texte" USING btree ("_path");
  CREATE UNIQUE INDEX "_accueil_v_blocks_texte_locales_locale_parent_id_unique" ON "_accueil_v_blocks_texte_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_accueil_v_blocks_texte_locales_parent_id_idx" ON "_accueil_v_blocks_texte_locales" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_image_texte_order_idx" ON "_accueil_v_blocks_image_texte" USING btree ("_order");
  CREATE INDEX "_accueil_v_blocks_image_texte_parent_id_idx" ON "_accueil_v_blocks_image_texte" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_image_texte_path_idx" ON "_accueil_v_blocks_image_texte" USING btree ("_path");
  CREATE INDEX "_accueil_v_blocks_image_texte_image_idx" ON "_accueil_v_blocks_image_texte" USING btree ("image_id");
  CREATE UNIQUE INDEX "_accueil_v_blocks_image_texte_locales_locale_parent_id_uniqu" ON "_accueil_v_blocks_image_texte_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_accueil_v_blocks_image_texte_locales_parent_id_idx" ON "_accueil_v_blocks_image_texte_locales" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_video_order_idx" ON "_accueil_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_accueil_v_blocks_video_parent_id_idx" ON "_accueil_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_video_path_idx" ON "_accueil_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_accueil_v_blocks_video_affiche_idx" ON "_accueil_v_blocks_video" USING btree ("affiche_id");
  CREATE UNIQUE INDEX "_accueil_v_blocks_video_locales_locale_parent_id_unique" ON "_accueil_v_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_accueil_v_blocks_video_locales_parent_id_idx" ON "_accueil_v_blocks_video_locales" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_carrousel_order_idx" ON "_accueil_v_blocks_carrousel" USING btree ("_order");
  CREATE INDEX "_accueil_v_blocks_carrousel_parent_id_idx" ON "_accueil_v_blocks_carrousel" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_carrousel_path_idx" ON "_accueil_v_blocks_carrousel" USING btree ("_path");
  CREATE UNIQUE INDEX "_accueil_v_blocks_carrousel_locales_locale_parent_id_unique" ON "_accueil_v_blocks_carrousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_accueil_v_blocks_carrousel_locales_parent_id_idx" ON "_accueil_v_blocks_carrousel_locales" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_grille_projets_order_idx" ON "_accueil_v_blocks_grille_projets" USING btree ("_order");
  CREATE INDEX "_accueil_v_blocks_grille_projets_parent_id_idx" ON "_accueil_v_blocks_grille_projets" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_grille_projets_path_idx" ON "_accueil_v_blocks_grille_projets" USING btree ("_path");
  CREATE INDEX "_accueil_v_blocks_grille_projets_categorie_idx" ON "_accueil_v_blocks_grille_projets" USING btree ("categorie_id");
  CREATE UNIQUE INDEX "_accueil_v_blocks_grille_projets_locales_locale_parent_id_un" ON "_accueil_v_blocks_grille_projets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_accueil_v_blocks_grille_projets_locales_parent_id_idx" ON "_accueil_v_blocks_grille_projets_locales" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_services_elements_order_idx" ON "_accueil_v_blocks_services_elements" USING btree ("_order");
  CREATE INDEX "_accueil_v_blocks_services_elements_parent_id_idx" ON "_accueil_v_blocks_services_elements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_accueil_v_blocks_services_elements_locales_locale_parent_id" ON "_accueil_v_blocks_services_elements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_accueil_v_blocks_services_elements_locales_parent_id_idx" ON "_accueil_v_blocks_services_elements_locales" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_services_order_idx" ON "_accueil_v_blocks_services" USING btree ("_order");
  CREATE INDEX "_accueil_v_blocks_services_parent_id_idx" ON "_accueil_v_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_services_path_idx" ON "_accueil_v_blocks_services" USING btree ("_path");
  CREATE UNIQUE INDEX "_accueil_v_blocks_services_locales_locale_parent_id_unique" ON "_accueil_v_blocks_services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_accueil_v_blocks_services_locales_parent_id_idx" ON "_accueil_v_blocks_services_locales" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_temoignages_elements_order_idx" ON "_accueil_v_blocks_temoignages_elements" USING btree ("_order");
  CREATE INDEX "_accueil_v_blocks_temoignages_elements_parent_id_idx" ON "_accueil_v_blocks_temoignages_elements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_accueil_v_blocks_temoignages_elements_locales_locale_parent" ON "_accueil_v_blocks_temoignages_elements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_accueil_v_blocks_temoignages_elements_locales_parent_id_idx" ON "_accueil_v_blocks_temoignages_elements_locales" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_temoignages_order_idx" ON "_accueil_v_blocks_temoignages" USING btree ("_order");
  CREATE INDEX "_accueil_v_blocks_temoignages_parent_id_idx" ON "_accueil_v_blocks_temoignages" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_temoignages_path_idx" ON "_accueil_v_blocks_temoignages" USING btree ("_path");
  CREATE UNIQUE INDEX "_accueil_v_blocks_temoignages_locales_locale_parent_id_uniqu" ON "_accueil_v_blocks_temoignages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_accueil_v_blocks_temoignages_locales_parent_id_idx" ON "_accueil_v_blocks_temoignages_locales" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_logos_elements_order_idx" ON "_accueil_v_blocks_logos_elements" USING btree ("_order");
  CREATE INDEX "_accueil_v_blocks_logos_elements_parent_id_idx" ON "_accueil_v_blocks_logos_elements" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_logos_elements_logo_idx" ON "_accueil_v_blocks_logos_elements" USING btree ("logo_id");
  CREATE INDEX "_accueil_v_blocks_logos_order_idx" ON "_accueil_v_blocks_logos" USING btree ("_order");
  CREATE INDEX "_accueil_v_blocks_logos_parent_id_idx" ON "_accueil_v_blocks_logos" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_logos_path_idx" ON "_accueil_v_blocks_logos" USING btree ("_path");
  CREATE UNIQUE INDEX "_accueil_v_blocks_logos_locales_locale_parent_id_unique" ON "_accueil_v_blocks_logos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_accueil_v_blocks_logos_locales_parent_id_idx" ON "_accueil_v_blocks_logos_locales" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_bouton_contact_order_idx" ON "_accueil_v_blocks_bouton_contact" USING btree ("_order");
  CREATE INDEX "_accueil_v_blocks_bouton_contact_parent_id_idx" ON "_accueil_v_blocks_bouton_contact" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_blocks_bouton_contact_path_idx" ON "_accueil_v_blocks_bouton_contact" USING btree ("_path");
  CREATE UNIQUE INDEX "_accueil_v_blocks_bouton_contact_locales_locale_parent_id_un" ON "_accueil_v_blocks_bouton_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_accueil_v_blocks_bouton_contact_locales_parent_id_idx" ON "_accueil_v_blocks_bouton_contact_locales" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_version_version_video_idx" ON "_accueil_v" USING btree ("version_video_id");
  CREATE INDEX "_accueil_v_version_version_image_idx" ON "_accueil_v" USING btree ("version_image_id");
  CREATE INDEX "_accueil_v_version_version__status_idx" ON "_accueil_v" USING btree ("version__status");
  CREATE INDEX "_accueil_v_created_at_idx" ON "_accueil_v" USING btree ("created_at");
  CREATE INDEX "_accueil_v_updated_at_idx" ON "_accueil_v" USING btree ("updated_at");
  CREATE INDEX "_accueil_v_snapshot_idx" ON "_accueil_v" USING btree ("snapshot");
  CREATE INDEX "_accueil_v_published_locale_idx" ON "_accueil_v" USING btree ("published_locale");
  CREATE INDEX "_accueil_v_latest_idx" ON "_accueil_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_accueil_v_locales_locale_parent_id_unique" ON "_accueil_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_accueil_v_locales_parent_id_idx" ON "_accueil_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_accueil_v_rels_order_idx" ON "_accueil_v_rels" USING btree ("order");
  CREATE INDEX "_accueil_v_rels_parent_idx" ON "_accueil_v_rels" USING btree ("parent_id");
  CREATE INDEX "_accueil_v_rels_path_idx" ON "_accueil_v_rels" USING btree ("path");
  CREATE INDEX "_accueil_v_rels_media_id_idx" ON "_accueil_v_rels" USING btree ("media_id");
  CREATE INDEX "reglages_reseaux_order_idx" ON "reglages_reseaux" USING btree ("_order");
  CREATE INDEX "reglages_reseaux_parent_id_idx" ON "reglages_reseaux" USING btree ("_parent_id");
  CREATE INDEX "reglages_image_idx" ON "reglages" USING btree ("image_id");
  CREATE UNIQUE INDEX "reglages_locales_locale_parent_id_unique" ON "reglages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "reglages_locales_parent_id_idx" ON "reglages_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_prix" CASCADE;
  DROP TABLE "projects_prix_locales" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_prix" CASCADE;
  DROP TABLE "_projects_v_version_prix_locales" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_locales" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "pages_blocks_texte" CASCADE;
  DROP TABLE "pages_blocks_texte_locales" CASCADE;
  DROP TABLE "pages_blocks_image_texte" CASCADE;
  DROP TABLE "pages_blocks_image_texte_locales" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_video_locales" CASCADE;
  DROP TABLE "pages_blocks_carrousel" CASCADE;
  DROP TABLE "pages_blocks_carrousel_locales" CASCADE;
  DROP TABLE "pages_blocks_grille_projets" CASCADE;
  DROP TABLE "pages_blocks_grille_projets_locales" CASCADE;
  DROP TABLE "pages_blocks_services_elements" CASCADE;
  DROP TABLE "pages_blocks_services_elements_locales" CASCADE;
  DROP TABLE "pages_blocks_services" CASCADE;
  DROP TABLE "pages_blocks_services_locales" CASCADE;
  DROP TABLE "pages_blocks_temoignages_elements" CASCADE;
  DROP TABLE "pages_blocks_temoignages_elements_locales" CASCADE;
  DROP TABLE "pages_blocks_temoignages" CASCADE;
  DROP TABLE "pages_blocks_temoignages_locales" CASCADE;
  DROP TABLE "pages_blocks_logos_elements" CASCADE;
  DROP TABLE "pages_blocks_logos" CASCADE;
  DROP TABLE "pages_blocks_logos_locales" CASCADE;
  DROP TABLE "pages_blocks_bouton_contact" CASCADE;
  DROP TABLE "pages_blocks_bouton_contact_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_texte" CASCADE;
  DROP TABLE "_pages_v_blocks_texte_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_image_texte" CASCADE;
  DROP TABLE "_pages_v_blocks_image_texte_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_video_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_carrousel" CASCADE;
  DROP TABLE "_pages_v_blocks_carrousel_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_grille_projets" CASCADE;
  DROP TABLE "_pages_v_blocks_grille_projets_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_services_elements" CASCADE;
  DROP TABLE "_pages_v_blocks_services_elements_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_services" CASCADE;
  DROP TABLE "_pages_v_blocks_services_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_temoignages_elements" CASCADE;
  DROP TABLE "_pages_v_blocks_temoignages_elements_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_temoignages" CASCADE;
  DROP TABLE "_pages_v_blocks_temoignages_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_logos_elements" CASCADE;
  DROP TABLE "_pages_v_blocks_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logos_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_bouton_contact" CASCADE;
  DROP TABLE "_pages_v_blocks_bouton_contact_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "messages" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "accueil_blocks_texte" CASCADE;
  DROP TABLE "accueil_blocks_texte_locales" CASCADE;
  DROP TABLE "accueil_blocks_image_texte" CASCADE;
  DROP TABLE "accueil_blocks_image_texte_locales" CASCADE;
  DROP TABLE "accueil_blocks_video" CASCADE;
  DROP TABLE "accueil_blocks_video_locales" CASCADE;
  DROP TABLE "accueil_blocks_carrousel" CASCADE;
  DROP TABLE "accueil_blocks_carrousel_locales" CASCADE;
  DROP TABLE "accueil_blocks_grille_projets" CASCADE;
  DROP TABLE "accueil_blocks_grille_projets_locales" CASCADE;
  DROP TABLE "accueil_blocks_services_elements" CASCADE;
  DROP TABLE "accueil_blocks_services_elements_locales" CASCADE;
  DROP TABLE "accueil_blocks_services" CASCADE;
  DROP TABLE "accueil_blocks_services_locales" CASCADE;
  DROP TABLE "accueil_blocks_temoignages_elements" CASCADE;
  DROP TABLE "accueil_blocks_temoignages_elements_locales" CASCADE;
  DROP TABLE "accueil_blocks_temoignages" CASCADE;
  DROP TABLE "accueil_blocks_temoignages_locales" CASCADE;
  DROP TABLE "accueil_blocks_logos_elements" CASCADE;
  DROP TABLE "accueil_blocks_logos" CASCADE;
  DROP TABLE "accueil_blocks_logos_locales" CASCADE;
  DROP TABLE "accueil_blocks_bouton_contact" CASCADE;
  DROP TABLE "accueil_blocks_bouton_contact_locales" CASCADE;
  DROP TABLE "accueil" CASCADE;
  DROP TABLE "accueil_locales" CASCADE;
  DROP TABLE "accueil_rels" CASCADE;
  DROP TABLE "_accueil_v_blocks_texte" CASCADE;
  DROP TABLE "_accueil_v_blocks_texte_locales" CASCADE;
  DROP TABLE "_accueil_v_blocks_image_texte" CASCADE;
  DROP TABLE "_accueil_v_blocks_image_texte_locales" CASCADE;
  DROP TABLE "_accueil_v_blocks_video" CASCADE;
  DROP TABLE "_accueil_v_blocks_video_locales" CASCADE;
  DROP TABLE "_accueil_v_blocks_carrousel" CASCADE;
  DROP TABLE "_accueil_v_blocks_carrousel_locales" CASCADE;
  DROP TABLE "_accueil_v_blocks_grille_projets" CASCADE;
  DROP TABLE "_accueil_v_blocks_grille_projets_locales" CASCADE;
  DROP TABLE "_accueil_v_blocks_services_elements" CASCADE;
  DROP TABLE "_accueil_v_blocks_services_elements_locales" CASCADE;
  DROP TABLE "_accueil_v_blocks_services" CASCADE;
  DROP TABLE "_accueil_v_blocks_services_locales" CASCADE;
  DROP TABLE "_accueil_v_blocks_temoignages_elements" CASCADE;
  DROP TABLE "_accueil_v_blocks_temoignages_elements_locales" CASCADE;
  DROP TABLE "_accueil_v_blocks_temoignages" CASCADE;
  DROP TABLE "_accueil_v_blocks_temoignages_locales" CASCADE;
  DROP TABLE "_accueil_v_blocks_logos_elements" CASCADE;
  DROP TABLE "_accueil_v_blocks_logos" CASCADE;
  DROP TABLE "_accueil_v_blocks_logos_locales" CASCADE;
  DROP TABLE "_accueil_v_blocks_bouton_contact" CASCADE;
  DROP TABLE "_accueil_v_blocks_bouton_contact_locales" CASCADE;
  DROP TABLE "_accueil_v" CASCADE;
  DROP TABLE "_accueil_v_locales" CASCADE;
  DROP TABLE "_accueil_v_rels" CASCADE;
  DROP TABLE "reglages_reseaux" CASCADE;
  DROP TABLE "reglages" CASCADE;
  DROP TABLE "reglages_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum__projects_v_published_locale";
  DROP TYPE "public"."enum_pages_blocks_image_texte_cote";
  DROP TYPE "public"."enum_pages_blocks_bouton_contact_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_image_texte_cote";
  DROP TYPE "public"."enum__pages_v_blocks_bouton_contact_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_messages_type";
  DROP TYPE "public"."enum_messages_notification";
  DROP TYPE "public"."enum_accueil_blocks_image_texte_cote";
  DROP TYPE "public"."enum_accueil_blocks_bouton_contact_type";
  DROP TYPE "public"."enum_accueil_status";
  DROP TYPE "public"."enum__accueil_v_blocks_image_texte_cote";
  DROP TYPE "public"."enum__accueil_v_blocks_bouton_contact_type";
  DROP TYPE "public"."enum__accueil_v_version_status";
  DROP TYPE "public"."enum__accueil_v_published_locale";`)
}
