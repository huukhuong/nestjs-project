import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRegionsTables1706756292684 implements MigrationInterface {
    name = 'CreateRegionsTables1706756292684'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`administrative_units\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`full_name\` varchar(255) NULL,
                \`full_name_en\` varchar(255) NULL,
                \`short_name\` varchar(255) NULL,
                \`short_name_en\` varchar(255) NULL,
                \`code_name\` varchar(255) NULL,
                \`code_name_en\` varchar(255) NULL,
                UNIQUE INDEX \`IDX_afa5c126244c8ebd191df11ad1\` (\`code_name\`),
                UNIQUE INDEX \`IDX_eff57c07bf4f1f9db6c5eb6251\` (\`code_name_en\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`administrative_regions\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`name_en\` varchar(255) NOT NULL,
                \`code_name\` varchar(255) NULL,
                \`code_name_en\` varchar(255) NULL,
                UNIQUE INDEX \`IDX_f983242bc12fe144aae42a295e\` (\`code_name\`),
                UNIQUE INDEX \`IDX_307ef1c18941c65eb7056570ee\` (\`code_name_en\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`provinces\` (
                \`code\` varchar(20) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`name_en\` varchar(255) NULL,
                \`full_name\` varchar(255) NOT NULL,
                \`full_name_en\` varchar(255) NULL,
                \`code_name\` varchar(255) NULL,
                \`administrative_unit_id\` int NULL,
                \`administrative_region_id\` int NULL,
                PRIMARY KEY (\`code\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`districts\` (
                \`code\` varchar(20) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`name_en\` varchar(255) NULL,
                \`full_name\` varchar(255) NULL,
                \`full_name_en\` varchar(255) NULL,
                \`code_name\` varchar(255) NULL,
                \`province_code\` varchar(20) NULL,
                \`administrative_unit_id\` int NULL,
                PRIMARY KEY (\`code\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`wards\` (
                \`code\` varchar(20) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`name_en\` varchar(255) NULL,
                \`full_name\` varchar(255) NULL,
                \`full_name_en\` varchar(255) NULL,
                \`code_name\` varchar(255) NULL,
                \`district_code\` varchar(20) NULL,
                \`administrative_unit_id\` int NULL,
                PRIMARY KEY (\`code\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`provinces\`
            ADD CONSTRAINT \`FK_f084cd63fc4e1c065093899a3d6\` FOREIGN KEY (\`administrative_unit_id\`) REFERENCES \`administrative_units\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`provinces\`
            ADD CONSTRAINT \`FK_d1c497fbc928c872810463e17e9\` FOREIGN KEY (\`administrative_region_id\`) REFERENCES \`administrative_regions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`districts\`
            ADD CONSTRAINT \`FK_602ba4e7409009b9082f9de6a9e\` FOREIGN KEY (\`administrative_unit_id\`) REFERENCES \`administrative_units\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`districts\`
            ADD CONSTRAINT \`FK_7f4b31875273010908d39850284\` FOREIGN KEY (\`province_code\`) REFERENCES \`provinces\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`wards\`
            ADD CONSTRAINT \`FK_d0554b203856eaf330539026f49\` FOREIGN KEY (\`administrative_unit_id\`) REFERENCES \`administrative_units\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`wards\`
            ADD CONSTRAINT \`FK_6614cfc610b3ae870f2467d9798\` FOREIGN KEY (\`district_code\`) REFERENCES \`districts\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`wards\` DROP FOREIGN KEY \`FK_6614cfc610b3ae870f2467d9798\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`wards\` DROP FOREIGN KEY \`FK_d0554b203856eaf330539026f49\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`districts\` DROP FOREIGN KEY \`FK_7f4b31875273010908d39850284\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`districts\` DROP FOREIGN KEY \`FK_602ba4e7409009b9082f9de6a9e\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`provinces\` DROP FOREIGN KEY \`FK_d1c497fbc928c872810463e17e9\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`provinces\` DROP FOREIGN KEY \`FK_f084cd63fc4e1c065093899a3d6\`
        `);
        await queryRunner.query(`
            DROP TABLE \`wards\`
        `);
        await queryRunner.query(`
            DROP TABLE \`districts\`
        `);
        await queryRunner.query(`
            DROP TABLE \`provinces\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_307ef1c18941c65eb7056570ee\` ON \`administrative_regions\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_f983242bc12fe144aae42a295e\` ON \`administrative_regions\`
        `);
        await queryRunner.query(`
            DROP TABLE \`administrative_regions\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_eff57c07bf4f1f9db6c5eb6251\` ON \`administrative_units\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_afa5c126244c8ebd191df11ad1\` ON \`administrative_units\`
        `);
        await queryRunner.query(`
            DROP TABLE \`administrative_units\`
        `);
    }

}
