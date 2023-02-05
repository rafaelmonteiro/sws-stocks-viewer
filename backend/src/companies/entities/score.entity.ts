import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Entity('swsCompanyScore')
export class Score extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Company)
  @JoinColumn()
  company: Company;

  @Column()
  dateGenerated: Date;

  @Column()
  dividend: number;

  @Column()
  future: number;

  @Column()
  health: number;

  @Column()
  management: number;

  @Column()
  past: number;

  @Column()
  value: number;

  @Column()
  misc: number;

  @Column()
  total: number;

  @Column()
  sentence: string;
}
