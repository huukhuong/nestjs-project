import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AdministrativeUnit } from './administrative-unit.entity';
import { Province } from './province.entity';

@Entity('districts')
export class District {
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
  province_code: string;

  @ManyToOne(() => AdministrativeUnit)
  @JoinColumn({ name: 'administrative_unit_id' })
  administrativeUnit: AdministrativeUnit;

  @ManyToOne(() => Province)
  @JoinColumn({ name: 'province_code' })
  province: Province;
}
