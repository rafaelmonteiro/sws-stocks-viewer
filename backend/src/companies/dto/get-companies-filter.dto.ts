import { IsOptional } from 'class-validator';

export class GetCompaniesFilterDto {
  @IsOptional()
  search: string;

  @IsOptional()
  symbol: string;

  @IsOptional()
  score: string;

  @IsOptional()
  includeSharePrices: boolean;
}
