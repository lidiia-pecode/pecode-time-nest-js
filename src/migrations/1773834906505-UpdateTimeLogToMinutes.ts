import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTimeLogToMinutes1773834906505 implements MigrationInterface {
  name = 'UpdateTimeLogToMinutes1773834906505';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "time_logs" DROP CONSTRAINT "CHK_3ed887ae2c0f5ac8c4841d0e3e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "time_logs" ADD CONSTRAINT "CHK_8df388fac7a6aaf9a725e62e5b" CHECK ("time" > 0 AND "time" <= 1440)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "time_logs" DROP CONSTRAINT "CHK_8df388fac7a6aaf9a725e62e5b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "time_logs" ADD CONSTRAINT "CHK_3ed887ae2c0f5ac8c4841d0e3e" CHECK ((("time" > 0) AND ("time" <= 24)))`,
    );
  }
}
