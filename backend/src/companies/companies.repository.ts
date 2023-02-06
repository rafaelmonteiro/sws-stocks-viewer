import { Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Company } from './entities/company.entity';
import { GetCompaniesFilterDto } from './dto/get-companies-filter.dto';
import { GetCompaniesPaginationDto } from './dto/get-companies-pagination.dto';

export class CompaniesRepository extends Repository<Company> {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {
    super(
      companiesRepository.target,
      companiesRepository.manager,
      companiesRepository.queryRunner,
    );
  }

  private logger = new Logger('CompaniesRepository');
  private DEFAULT_TAKE = 10;
  private DEFAULT_SKIP = 0;
  private DEFAULT_ORDER_BY = 'company.name';

  async search(
    filterDto: GetCompaniesFilterDto,
    paginationDto: GetCompaniesPaginationDto,
  ): Promise<Company[]> {
    const { take, skip, orderBy } = paginationDto;

    try {
      const queryBuilder = this.createQueryBuilder('company');
      const query = this.applyFilters(filterDto, queryBuilder);
      query.leftJoinAndSelect('company.score', 'score');
      query.take(take ?? this.DEFAULT_TAKE);
      query.skip(skip ?? this.DEFAULT_SKIP);
      query.orderBy(orderBy ?? this.DEFAULT_ORDER_BY);

      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to retrieve companies. Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  private applyFilters(
    filterDto: GetCompaniesFilterDto,
    queryBuilder: SelectQueryBuilder<Company>,
  ) {
    const { search, score, includeSharePrices } = filterDto;

    if (search) {
      queryBuilder.andWhere(
        '(company.name LIKE :search OR company.uniqueSymbol LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (score) {
      queryBuilder.leftJoin(
        'company.score',
        'swsCompanyScore.id',
        'company.score',
      );
      queryBuilder.andWhere('(score.total = :score)', { score });
    }

    if (includeSharePrices) {
      queryBuilder.leftJoinAndSelect(
        'company.sharePrices',
        'swsCompanyPriceClose',
      );
    }

    return queryBuilder;
  }
}
