import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../database/entities/sale.entity';
import { Product } from '../database/entities/product.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const { client_id, product_ids } = createSaleDto;

    const products = await this.productRepository.findByIds(product_ids);
    if (products.length !== product_ids.length) {
      throw new NotFoundException('Um ou mais produtos não encontrados');
    }

    const sale = this.saleRepository.create({
      client_id,
      products,
    });

    return this.saleRepository.save(sale);
  }

  async findAll(): Promise<Sale[]> {
    return this.saleRepository.find({ relations: ['client', 'products'] });
  }

  async findOne(id: number): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['client', 'products'],
    });
    if (!sale) {
      throw new NotFoundException('Venda não encontrada');
    }
    return sale;
  }

  async update(id: number, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const { client_id, product_ids } = updateSaleDto;

    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!sale) {
      throw new NotFoundException('Venda não encontrada');
    }

    if (client_id !== undefined) {
      sale.client_id = client_id;
    }

    if (product_ids !== undefined) {
      const products = await this.productRepository.findByIds(product_ids);
      if (products.length !== product_ids.length) {
        throw new NotFoundException('Um ou mais produtos não encontrados');
      }
      sale.products = products;
    }

    return this.saleRepository.save(sale);
  }

  async remove(id: number): Promise<void> {
    const sale = await this.saleRepository.findOne({ where: { id } });
    if (!sale) {
      throw new NotFoundException('Venda não encontrada');
    }
    await this.saleRepository.remove(sale);
  }
}
