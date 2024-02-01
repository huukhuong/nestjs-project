import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('administrative_units')
export class AdministrativeUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  full_name_en: string;

  @Column({ nullable: true })
  short_name: string;

  @Column({ nullable: true })
  short_name_en: string;

  @Column({ nullable: true, unique: true })
  code_name: string;

  @Column({ nullable: true, unique: true })
  code_name_en: string;
}
