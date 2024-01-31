import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRolesTableAndMappingToUsers1706686886231 implements MigrationInterface {
    name = 'CreateRolesTableAndMappingToUsers1706686886231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`roles\` (
                \`id\` varchar(36) NOT NULL,
                \`code\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                UNIQUE INDEX \`IDX_f6d54f95c31b73fb1bdd8e91d0\` (\`code\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`roles_users\` (
                \`userId\` varchar(36) NOT NULL,
                \`roleId\` varchar(36) NOT NULL,
                INDEX \`IDX_cfb5fc35a3822b6231678941fb\` (\`userId\`),
                INDEX \`IDX_8963f495c8b35eb224629caafd\` (\`roleId\`),
                PRIMARY KEY (\`userId\`, \`roleId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles_users\`
            ADD CONSTRAINT \`FK_cfb5fc35a3822b6231678941fbe\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles_users\`
            ADD CONSTRAINT \`FK_8963f495c8b35eb224629caafd3\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`roles_users\` DROP FOREIGN KEY \`FK_8963f495c8b35eb224629caafd3\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles_users\` DROP FOREIGN KEY \`FK_cfb5fc35a3822b6231678941fbe\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_8963f495c8b35eb224629caafd\` ON \`roles_users\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_cfb5fc35a3822b6231678941fb\` ON \`roles_users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`roles_users\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_f6d54f95c31b73fb1bdd8e91d0\` ON \`roles\`
        `);
        await queryRunner.query(`
            DROP TABLE \`roles\`
        `);
    }

}
