import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { GetCompaniesFilterDto } from './dto/get-companies-filter.dto';
import { GetCompaniesPaginationDto } from './dto/get-companies-pagination.dto';
import { PaginatedCompaniesDto } from './dto/paginated-companies.dto';

@Controller('companies')
@UseInterceptors(CacheInterceptor)
export class CompaniesController {
  constructor(private companyService: CompaniesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Company> {
    return await this.companyService.findOne(id);
  }

  @Get()
  async search(
    @Query(ValidationPipe) filterDto: GetCompaniesFilterDto,
    @Query(ValidationPipe) paginationDto: GetCompaniesPaginationDto,
  ): Promise<PaginatedCompaniesDto> {
    const companies = await this.companyService.search(
      filterDto,
      paginationDto,
    );
    const totalCount = await this.companyService.count();

    return {
      data: companies,
      skip: paginationDto.skip,
      take: paginationDto.take,
      totalCount,
    };
  }
}
