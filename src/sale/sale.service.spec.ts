import { Test, TestingModule } from '@nestjs/testing';
import { SaleService } from './sale.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sale } from '../database/entities/sale.entity';
import { Product } from '../database/entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('SaleService', () => {
  let service: SaleService;
  let saleRepo: Repository<Sale>;
  let productRepo: Repository<Product>;

  const mockSale: Sale = {
    id: 1,
    client_id: 1,
    client: {} as any,
    products: [{ id: 1 } as Product, { id: 2 } as Product],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Sale;

  const mockProduct: Product = {
    id: 1,
    name: 'Produto Exemplo',
    description: 'Descrição',
    price: 99.99,
  } as Product;

  const saleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const productRepository = {
    findByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleService,
        { provide: getRepositoryToken(Sale), useValue: saleRepository },
        { provide: getRepositoryToken(Product), useValue: productRepository },
      ],
    }).compile();

    service = module.get<SaleService>(SaleService);
    saleRepo = module.get<Repository<Sale>>(getRepositoryToken(Sale));
    productRepo = module.get<Repository<Product>>(getRepositoryToken(Product));
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a sale', async () => {
      productRepository.findByIds.mockResolvedValue([mockProduct]);
      saleRepository.create.mockReturnValue(mockSale);
      saleRepository.save.mockResolvedValue(mockSale);

      const dto = { client_id: 1, product_ids: [1] };
      const result = await service.create(dto);

      expect(productRepository.findByIds).toHaveBeenCalledWith([1]);
      expect(saleRepository.create).toHaveBeenCalledWith({
        client_id: 1,
        products: [mockProduct],
      });
      expect(saleRepository.save).toHaveBeenCalledWith(mockSale);
      expect(result).toEqual(mockSale);
    });

    it('should throw NotFoundException if any product not found', async () => {
      productRepository.findByIds.mockResolvedValue([]);
      const dto = { client_id: 1, product_ids: [1] };
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all sales', async () => {
      saleRepository.find.mockResolvedValue([mockSale]);
      const result = await service.findAll();
      expect(saleRepository.find).toHaveBeenCalledWith({
        relations: ['client', 'products'],
      });
      expect(result).toEqual([mockSale]);
    });
  });

  describe('findOne', () => {
    it('should return a sale by id', async () => {
      saleRepository.findOne.mockResolvedValue(mockSale);
      const result = await service.findOne(1);
      expect(saleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['client', 'products'],
      });
      expect(result).toEqual(mockSale);
    });

    it('should throw NotFoundException if sale not found', async () => {
      saleRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a sale', async () => {
      saleRepository.findOne.mockResolvedValue(mockSale);
      productRepository.findByIds.mockResolvedValue([mockProduct]);
      saleRepository.save.mockResolvedValue({
        ...mockSale,
        client_id: 2,
        products: [mockProduct],
      });

      const dto = { client_id: 2, product_ids: [1] };
      const result = await service.update(1, dto);

      expect(saleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['products'],
      });
      expect(productRepository.findByIds).toHaveBeenCalledWith([1]);
      expect(saleRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        ...mockSale,
        client_id: 2,
        products: [mockProduct],
      });
    });

    it('should throw NotFoundException if sale not found', async () => {
      saleRepository.findOne.mockResolvedValue(null);
      await expect(
        service.update(2, { client_id: 2, product_ids: [1] }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if any product not found', async () => {
      saleRepository.findOne.mockResolvedValue(mockSale);
      productRepository.findByIds.mockResolvedValue([]);
      await expect(
        service.update(1, { client_id: 2, product_ids: [1] }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a sale', async () => {
      saleRepository.findOne.mockResolvedValue(mockSale);
      saleRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);
      expect(saleRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(saleRepository.remove).toHaveBeenCalledWith(mockSale);
    });

    it('should throw NotFoundException if sale not found', async () => {
      saleRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(2)).rejects.toThrow(NotFoundException);
    });
  });
});
