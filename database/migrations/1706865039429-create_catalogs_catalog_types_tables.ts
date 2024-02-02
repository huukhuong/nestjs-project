import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCatalogsCatalogTypesTables1706865039429 implements MigrationInterface {
    name = 'CreateCatalogsCatalogTypesTables1706865039429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`catalogs\` (
                \`id\` varchar(36) NOT NULL,
                \`code\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                \`catalogTypeCode\` varchar(255) NULL,
                UNIQUE INDEX \`IDX_ebafddaccc9c55028f7b5e605b\` (\`code\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`catalog_types\` (
                \`id\` varchar(36) NOT NULL,
                \`code\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                UNIQUE INDEX \`IDX_836b4eed14ae988ef6a984f021\` (\`code\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`catalogs\`
            ADD CONSTRAINT \`FK_f8b1d66fe5fcc8cdd4811eecc15\` FOREIGN KEY (\`catalogTypeCode\`) REFERENCES \`catalog_types\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`catalogs\` DROP FOREIGN KEY \`FK_f8b1d66fe5fcc8cdd4811eecc15\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_836b4eed14ae988ef6a984f021\` ON \`catalog_types\`
        `);
        await queryRunner.query(`
            DROP TABLE \`catalog_types\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_ebafddaccc9c55028f7b5e605b\` ON \`catalogs\`
        `);
        await queryRunner.query(`
            DROP TABLE \`catalogs\`
        `);
    }

}
