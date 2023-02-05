import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Score } from './score.entity';
import { SharePrice } from './shareprice.entity';

@Entity('swsCompany')
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  tickerSymbol: string;

  @Column()
  exchangeSymbol: string;

  @Column()
  uniqueSymbol: string;

  @Column()
  dateGenerated: Date;

  @Column()
  securityName: string;

  @Column()
  exchangeCountryIso: string;

  @Column()
  listingCurrencyIso: string;

  @Column()
  canonicalUrl: string;

  @Column()
  uniqueSymbolSlug: string;

  @OneToOne(() => Score)
  @JoinColumn()
  score: Score;

  @OneToMany(share => SharePrice, share => share.company, { eager: true })
  @JoinTable()
  sharePrices: SharePrice[];
}
