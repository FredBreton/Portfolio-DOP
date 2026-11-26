import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_video_type" AS ENUM('bande', 'film');
  CREATE TYPE "public"."enum__projects_v_version_video_type" AS ENUM('bande', 'film');
  ALTER TABLE "projects" ADD COLUMN "video_type" "enum_projects_video_type" DEFAULT 'bande';
  ALTER TABLE "_projects_v" ADD COLUMN "version_video_type" "enum__projects_v_version_video_type" DEFAULT 'bande';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DROP COLUMN "video_type";
  ALTER TABLE "_projects_v" DROP COLUMN "version_video_type";
  DROP TYPE "public"."enum_projects_video_type";
  DROP TYPE "public"."enum__projects_v_version_video_type";`)
}
