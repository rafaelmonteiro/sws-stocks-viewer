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

  async search(
    filterDto: GetCompaniesFilterDto,
    paginationDto: GetCompaniesPaginationDto,
  ): Promise<Company[]> {
    const { take, skip } = paginationDto;

    try {
      const queryBuilder = this.createQueryBuilder('company');
      const query = this.applyFilters(filterDto, queryBuilder);
      query.leftJoinAndSelect('company.score', 'score');
      query.take(take ?? this.DEFAULT_TAKE);
      query.skip(skip ?? this.DEFAULT_SKIP);

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
    const { search, symbol, score, includeSharePrices } = filterDto;

    if (search) {
      queryBuilder.andWhere(
        '(company.name LIKE :search OR company.tickerSymbol LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (symbol) {
      queryBuilder.andWhere(
        '(company.exchangeSymbol LIKE :symbol)',
        { symbol: `%${symbol}%` },
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
