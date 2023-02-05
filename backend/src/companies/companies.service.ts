import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesRepository } from './companies.repository';
import { Company } from './entities/company.entity';
import { GetCompaniesFilterDto } from './dto/get-companies-filter.dto';
import { GetCompaniesPaginationDto } from './dto/get-companies-pagination.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompaniesRepository)
    private companiesRepository: CompaniesRepository,
  ) {}

  async count(): Promise<number> {
    return this.companiesRepository.count();
  }

  async search(
    filterDto: GetCompaniesFilterDto,
    paginationDto: GetCompaniesPaginationDto,
  ): Promise<Company[]> {
    return this.companiesRepository.search(filterDto, paginationDto);
  }

  async findOne(id: string): Promise<Company> {
    const row = await this.companiesRepository.findOne({
      where: { id },
      relations: ['score'],
    });

    if (!row) {
      throw new NotFoundException(`Company ID "${id}" not found`);
    }

    return row;
  }
}
