import { IsOptional } from 'class-validator';

export class GetCompaniesPaginationDto {
  @IsOptional()
  take: number;

  @IsOptional()
  skip: number;

  @IsOptional()
  orderBy: string;
}
