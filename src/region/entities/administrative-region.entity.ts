import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('administrative_regions')
export class AdministrativeRegion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  name_en: string;

  @Column({ nullable: true, unique: true })
  code_name: string;

  @Column({ nullable: true, unique: true })
  code_name_en: string;
}
