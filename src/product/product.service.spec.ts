import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let repo: Repository<Product>;

  const mockProduct: Product = {
    id: 1,
    name: 'Produto Exemplo',
    description: 'Descrição',
    price: 99.99,
  } as Product;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getRepositoryToken(Product), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a product', async () => {
      mockRepository.create.mockReturnValue(mockProduct);
      mockRepository.save.mockResolvedValue(mockProduct);

      const dto = {
        name: 'Produto Exemplo',
        description: 'Descrição',
        price: 99.99,
      };
      const result = await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      mockRepository.find.mockResolvedValue([mockProduct]);
      const result = await service.findAll();
      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockProduct);
      const result = await service.findOne(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a product', async () => {
      mockRepository.preload.mockResolvedValue(mockProduct);
      mockRepository.save.mockResolvedValue(mockProduct);

      const dto = { name: 'Atualizado' };
      const result = await service.update(1, dto);

      expect(mockRepository.preload).toHaveBeenCalledWith({ id: 1, ...dto });
      expect(mockRepository.save).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockRepository.preload.mockResolvedValue(null);
      await expect(service.update(2, { name: 'Atualizado' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByPriceRange', () => {
    it('should return products filtered by min and max price', async () => {
      const mockQueryBuilder: any = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProduct]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findByPriceRange(10, 100);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'product.price >= :min',
        { min: 10 },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'product.price <= :max',
        { max: 100 },
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual([mockProduct]);
    });

    it('should return products filtered by only min price', async () => {
      const mockQueryBuilder: any = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProduct]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findByPriceRange(10, undefined);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'product.price >= :min',
        { min: 10 },
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual([mockProduct]);
    });

    it('should return products filtered by only max price', async () => {
      const mockQueryBuilder: any = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProduct]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findByPriceRange(undefined, 100);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'product.price <= :max',
        { max: 100 },
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual([mockProduct]);
    });

    it('should return all products if no min or max price is provided', async () => {
      const mockQueryBuilder: any = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProduct]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findByPriceRange(undefined, undefined);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual([mockProduct]);
    });
  });
});
