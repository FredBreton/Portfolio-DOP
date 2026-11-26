import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "projects_liens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "projects_liens_locales" (
  	"libelle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_equipe" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"noms" varchar
  );
  
  CREATE TABLE "projects_equipe_locales" (
  	"poste" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_liens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_liens_locales" (
  	"libelle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_equipe" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"noms" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_equipe_locales" (
  	"poste" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "projects" ADD COLUMN "camera" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_camera" varchar;
  ALTER TABLE "projects_liens" ADD CONSTRAINT "projects_liens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_liens_locales" ADD CONSTRAINT "projects_liens_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_liens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_equipe" ADD CONSTRAINT "projects_equipe_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_equipe_locales" ADD CONSTRAINT "projects_equipe_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_equipe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_liens" ADD CONSTRAINT "_projects_v_version_liens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_liens_locales" ADD CONSTRAINT "_projects_v_version_liens_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_liens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_equipe" ADD CONSTRAINT "_projects_v_version_equipe_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_equipe_locales" ADD CONSTRAINT "_projects_v_version_equipe_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_equipe"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_liens_order_idx" ON "projects_liens" USING btree ("_order");
  CREATE INDEX "projects_liens_parent_id_idx" ON "projects_liens" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_liens_locales_locale_parent_id_unique" ON "projects_liens_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_liens_locales_parent_id_idx" ON "projects_liens_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_equipe_order_idx" ON "projects_equipe" USING btree ("_order");
  CREATE INDEX "projects_equipe_parent_id_idx" ON "projects_equipe" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_equipe_locales_locale_parent_id_unique" ON "projects_equipe_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_equipe_locales_parent_id_idx" ON "projects_equipe_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_liens_order_idx" ON "_projects_v_version_liens" USING btree ("_order");
  CREATE INDEX "_projects_v_version_liens_parent_id_idx" ON "_projects_v_version_liens" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_liens_locales_locale_parent_id_unique" ON "_projects_v_version_liens_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_liens_locales_parent_id_idx" ON "_projects_v_version_liens_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_equipe_order_idx" ON "_projects_v_version_equipe" USING btree ("_order");
  CREATE INDEX "_projects_v_version_equipe_parent_id_idx" ON "_projects_v_version_equipe" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_equipe_locales_locale_parent_id_unique" ON "_projects_v_version_equipe_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_equipe_locales_parent_id_idx" ON "_projects_v_version_equipe_locales" USING btree ("_parent_id");
  -- L'ancien « lien externe » devient le premier bouton « Où voir le film ».
  INSERT INTO "projects_liens" ("_order", "_parent_id", "id", "url")
    SELECT 1, "id", 'lien-' || "id", "lien" FROM "projects" WHERE coalesce("lien", '') <> '';
  INSERT INTO "projects_liens_locales" ("libelle", "_locale", "_parent_id")
    SELECT 'Voir le projet', 'fr'::"_locales", 'lien-' || "id" FROM "projects" WHERE coalesce("lien", '') <> ''
    UNION ALL
    SELECT 'View the project', 'en'::"_locales", 'lien-' || "id" FROM "projects" WHERE coalesce("lien", '') <> '';
  ALTER TABLE "projects" DROP COLUMN "lien";
  ALTER TABLE "_projects_v" DROP COLUMN "version_lien";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_liens" CASCADE;
  DROP TABLE "projects_liens_locales" CASCADE;
  DROP TABLE "projects_equipe" CASCADE;
  DROP TABLE "projects_equipe_locales" CASCADE;
  DROP TABLE "_projects_v_version_liens" CASCADE;
  DROP TABLE "_projects_v_version_liens_locales" CASCADE;
  DROP TABLE "_projects_v_version_equipe" CASCADE;
  DROP TABLE "_projects_v_version_equipe_locales" CASCADE;
  ALTER TABLE "projects" ADD COLUMN "lien" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_lien" varchar;
  ALTER TABLE "projects" DROP COLUMN "camera";
  ALTER TABLE "_projects_v" DROP COLUMN "version_camera";`)
}
