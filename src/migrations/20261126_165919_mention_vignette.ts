import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_locales" ADD COLUMN "mention" varchar;
  ALTER TABLE "_projects_v_locales" ADD COLUMN "version_mention" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_locales" DROP COLUMN "mention";
  ALTER TABLE "_projects_v_locales" DROP COLUMN "version_mention";`)
}
