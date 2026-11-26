import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_locales" ADD COLUMN "video" varchar;
  ALTER TABLE "_projects_v_locales" ADD COLUMN "version_video" varchar;
  -- La vidéo existante devient la version française; l'anglais s'y rabat tant qu'il est vide.
  UPDATE "projects_locales" l SET "video" = p."video" FROM "projects" p WHERE l."_parent_id" = p."id" AND l."_locale" = 'fr';
  UPDATE "_projects_v_locales" l SET "version_video" = v."version_video" FROM "_projects_v" v WHERE l."_parent_id" = v."id" AND l."_locale" = 'fr';
  ALTER TABLE "projects" DROP COLUMN "video";
  ALTER TABLE "_projects_v" DROP COLUMN "version_video";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "video" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_video" varchar;
  ALTER TABLE "projects_locales" DROP COLUMN "video";
  ALTER TABLE "_projects_v_locales" DROP COLUMN "version_video";`)
}
