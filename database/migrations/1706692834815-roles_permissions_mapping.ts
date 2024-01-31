import { MigrationInterface, QueryRunner } from "typeorm";

export class RolesPermissionsMapping1706692834815 implements MigrationInterface {
    name = 'RolesPermissionsMapping1706692834815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`permission_groups\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`permissions\` (
                \`id\` varchar(36) NOT NULL,
                \`code\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                \`groupId\` varchar(36) NULL,
                UNIQUE INDEX \`IDX_8dad765629e83229da6feda1c1\` (\`code\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`roles_permissions\` (
                \`roleId\` varchar(36) NOT NULL,
                \`permissionId\` varchar(36) NOT NULL,
                INDEX \`IDX_28bf280551eb9aa82daf1e156d\` (\`roleId\`),
                INDEX \`IDX_31cf5c31d0096f706e3ba3b1e8\` (\`permissionId\`),
                PRIMARY KEY (\`roleId\`, \`permissionId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`permissions\`
            ADD CONSTRAINT \`FK_0ce20ad956af3961df1ff12d0c5\` FOREIGN KEY (\`groupId\`) REFERENCES \`permission_groups\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles_permissions\`
            ADD CONSTRAINT \`FK_28bf280551eb9aa82daf1e156d9\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles_permissions\`
            ADD CONSTRAINT \`FK_31cf5c31d0096f706e3ba3b1e82\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`roles_permissions\` DROP FOREIGN KEY \`FK_31cf5c31d0096f706e3ba3b1e82\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles_permissions\` DROP FOREIGN KEY \`FK_28bf280551eb9aa82daf1e156d9\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`permissions\` DROP FOREIGN KEY \`FK_0ce20ad956af3961df1ff12d0c5\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_31cf5c31d0096f706e3ba3b1e8\` ON \`roles_permissions\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_28bf280551eb9aa82daf1e156d\` ON \`roles_permissions\`
        `);
        await queryRunner.query(`
            DROP TABLE \`roles_permissions\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_8dad765629e83229da6feda1c1\` ON \`permissions\`
        `);
        await queryRunner.query(`
            DROP TABLE \`permissions\`
        `);
        await queryRunner.query(`
            DROP TABLE \`permission_groups\`
        `);
    }

}
