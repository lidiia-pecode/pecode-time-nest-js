import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersAndTimeLogs1773512293132 implements MigrationInterface {
  name = 'CreateUsersAndTimeLogs1773512293132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "username" character varying(255) NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."time_logs_type_enum" AS ENUM('WORK_ACTIVITY', 'PAID_VACATION', 'UNPAID_VACATION', 'SICK_LEAVE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "time_logs" ("id" SERIAL NOT NULL, "type" "public"."time_logs_type_enum" NOT NULL, "time" integer NOT NULL, "date" date NOT NULL, "activity_id" integer, "sub_activity_id" integer, "user_id" integer NOT NULL, CONSTRAINT "CHK_3ed887ae2c0f5ac8c4841d0e3e" CHECK ("time" > 0 AND "time" <= 24), CONSTRAINT "CHK_0961ac3e182a4314173b09c764" CHECK ("type" != 'WORK_ACTIVITY' OR "activity_id" IS NOT NULL OR "sub_activity_id" IS NOT NULL), CONSTRAINT "PK_8657e6aaa7035da9fc7309f385a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_time_logs_activity" ON "time_logs" ("activity_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_time_logs_sub_activity" ON "time_logs" ("sub_activity_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_time_logs_user" ON "time_logs" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "time_logs" ADD CONSTRAINT "FK_4279972ec3f9798284b0e26587c" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "time_logs" ADD CONSTRAINT "FK_fe1b5120acaa4fbce548132e8db" FOREIGN KEY ("sub_activity_id") REFERENCES "sub_activities"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "time_logs" ADD CONSTRAINT "FK_b5e06aedfbf8f061e3e68ad154e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "time_logs" DROP CONSTRAINT "FK_b5e06aedfbf8f061e3e68ad154e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "time_logs" DROP CONSTRAINT "FK_fe1b5120acaa4fbce548132e8db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "time_logs" DROP CONSTRAINT "FK_4279972ec3f9798284b0e26587c"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_time_logs_user"`);
    await queryRunner.query(`DROP INDEX "public"."idx_time_logs_sub_activity"`);
    await queryRunner.query(`DROP INDEX "public"."idx_time_logs_activity"`);
    await queryRunner.query(`DROP TABLE "time_logs"`);
    await queryRunner.query(`DROP TYPE "public"."time_logs_type_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
