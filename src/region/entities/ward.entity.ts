import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AdministrativeUnit } from './administrative-unit.entity';
import { District } from './district.entity';

@Entity('wards')
export class Ward {
  @PrimaryColumn({ length: 20, unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  name_en: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  full_name_en: string;

  @Column({ nullable: true })
  code_name: string;

  @Column({ length: 20, nullable: true })
  district_code: string;

  @ManyToOne(() => AdministrativeUnit)
  @JoinColumn({ name: 'administrative_unit_id' })
  administrativeUnit: AdministrativeUnit;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_code' })
  district: District;
}
