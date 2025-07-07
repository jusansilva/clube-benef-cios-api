import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '../database/entities/product.entity';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProduct: Product = {
    id: 1,
    name: 'Produto Exemplo',
    description: 'Descrição',
    price: 99.99,
  } as Product;

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const dto: CreateProductDto = {
        name: 'Produto Exemplo',
        description: 'Descrição',
        price: 99.99,
      };
      mockProductService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      mockProductService.findAll.mockResolvedValue([mockProduct]);
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockProductService.findOne.mockResolvedValue(mockProduct);
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const dto: UpdateProductDto = { name: 'Atualizado' };
      mockProductService.update.mockResolvedValue({ ...mockProduct, ...dto });
      const result = await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ ...mockProduct, ...dto });
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      mockProductService.remove.mockResolvedValue(undefined);
      const result = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });

  describe('findByPriceRange', () => {
    it('should return products filtered by price range', async () => {
      const filteredProducts = [mockProduct];
      service.findByPriceRange = jest.fn().mockResolvedValue(filteredProducts);

      const result = await controller.findByPriceRange('10', '100');
      expect(service.findByPriceRange).toHaveBeenCalledWith(10, 100);
      expect(result).toEqual(filteredProducts);
    });

    it('should handle undefined min_price and max_price', async () => {
      const filteredProducts = [mockProduct];
      service.findByPriceRange = jest.fn().mockResolvedValue(filteredProducts);

      const result = await controller.findByPriceRange(undefined, undefined);
      expect(service.findByPriceRange).toHaveBeenCalledWith(
        undefined,
        undefined,
      );
      expect(result).toEqual(filteredProducts);
    });
  });
});
