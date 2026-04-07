import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatorRole1764000000000 implements MigrationInterface {
  name = 'AddCreatorRole1764000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE "public"."users_roles_enum"
      ADD VALUE IF NOT EXISTS 'CREATOR'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Se deja vacío
  }
}