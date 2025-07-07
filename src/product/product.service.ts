import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../database/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    await this.productRepository.remove(product);
  }

  async findByPriceRange(min?: number, max?: number): Promise<Product[]> {
    const where: any = {};
    if (min !== undefined) where.price = { ...(where.price || {}), $gte: min };
    if (max !== undefined) where.price = { ...(where.price || {}), $lte: max };

    // Para TypeORM:
    const query = this.productRepository.createQueryBuilder('product');
    if (min !== undefined) query.andWhere('product.price >= :min', { min });
    if (max !== undefined) query.andWhere('product.price <= :max', { max });
    return query.getMany();
  }
}
