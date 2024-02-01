import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AdministrativeRegion } from './administrative-region.entity';
import { AdministrativeUnit } from './administrative-unit.entity';

@Entity('provinces')
export class Province {
  @PrimaryColumn({ length: 20, unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  name_en: string;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  full_name_en: string;

  @Column({ nullable: true })
  code_name: string;

  @ManyToOne(() => AdministrativeUnit)
  @JoinColumn({ name: 'administrative_unit_id' })
  administrativeUnit: AdministrativeUnit;

  @ManyToOne(() => AdministrativeRegion)
  @JoinColumn({ name: 'administrative_region_id' })
  administrativeRegion: AdministrativeRegion;
}
