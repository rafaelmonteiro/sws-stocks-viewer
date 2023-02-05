import { IsNotEmpty } from 'class-validator';
import { Company } from '../entities/company.entity';

export class PaginatedCompaniesDto {
  @IsNotEmpty()
  take = 10;

  @IsNotEmpty()
  skip = 0;

  @IsNotEmpty()
  totalCount: number;

  @IsNotEmpty()
  data: Company[];
}
