import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateActivitiesTables1769635061619 implements MigrationInterface {
  name = 'CreateActivitiesTables1769635061619';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "activity_groups" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "UQ_a41575040f6ac0dad5e85d6947e" UNIQUE ("name"), CONSTRAINT "PK_b362d71e6b088f14121756a102a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "activities" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "group_id" integer NOT NULL, CONSTRAINT "UQ_2a8a3a2ebc8fd3a437a31c452c9" UNIQUE ("name", "group_id"), CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sub_activities" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "activity_id" integer NOT NULL, CONSTRAINT "UQ_b7e0046588ecc2a63cc68109afe" UNIQUE ("name", "activity_id"), CONSTRAINT "PK_ad2789d77c7bbdd18884cae5a58" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_6e067cec263fd8be3aacc4a3329" FOREIGN KEY ("group_id") REFERENCES "activity_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_activities" ADD CONSTRAINT "FK_143ae3bea2ee0c4ca2751147c54" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sub_activities" DROP CONSTRAINT "FK_143ae3bea2ee0c4ca2751147c54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_6e067cec263fd8be3aacc4a3329"`,
    );
    await queryRunner.query(`DROP TABLE "sub_activities"`);
    await queryRunner.query(`DROP TABLE "activities"`);
    await queryRunner.query(`DROP TABLE "activity_groups"`);
  }
}
