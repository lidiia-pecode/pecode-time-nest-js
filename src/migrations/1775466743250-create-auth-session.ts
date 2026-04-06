import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthSession1775466743250 implements MigrationInterface {
  name = 'CreateAuthSession1775466743250';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth_sessions" ("id" uuid NOT NULL, "user_id" integer NOT NULL, "refresh_hash" character varying(64) NOT NULL, CONSTRAINT "PK_641507381f32580e8479efc36cd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "refresh_hash" character varying(64)`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_sessions" ADD CONSTRAINT "FK_50ccaa6440288a06f0ba693ccc6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth_sessions" DROP CONSTRAINT "FK_50ccaa6440288a06f0ba693ccc6"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_hash"`);
    await queryRunner.query(`DROP TABLE "auth_sessions"`);
  }
}
