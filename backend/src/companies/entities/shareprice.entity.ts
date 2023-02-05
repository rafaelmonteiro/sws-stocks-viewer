import {
  BaseEntity,
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Entity('swsCompanyPriceClose')
export class SharePrice extends BaseEntity {
  @ManyToOne(type => Company, company => company.sharePrices)
  @JoinColumn()
  company: Company;

  @Column({ type: 'date' })
  @PrimaryColumn()
  date: Date;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'datetime', select: false })
  dateCreated: Date;
}
