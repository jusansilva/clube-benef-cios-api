import { Test, TestingModule } from '@nestjs/testing';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from '../database/entities/sale.entity';

describe('SaleController', () => {
  let controller: SaleController;
  let service: SaleService;

  const mockSale: Sale = {
    id: 1,
    client_id: 1,
    client: {} as any,
    products: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Sale;

  const mockSaleService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleController],
      providers: [{ provide: SaleService, useValue: mockSaleService }],
    }).compile();

    controller = module.get<SaleController>(SaleController);
    service = module.get<SaleService>(SaleService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a sale', async () => {
      const dto: CreateSaleDto = { client_id: 1, product_ids: [1, 2] };
      mockSaleService.create.mockResolvedValue(mockSale);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockSale);
    });
  });

  describe('findAll', () => {
    it('should return an array of sales', async () => {
      mockSaleService.findAll.mockResolvedValue([mockSale]);
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockSale]);
    });
  });

  describe('findOne', () => {
    it('should return a sale by id', async () => {
      mockSaleService.findOne.mockResolvedValue(mockSale);
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSale);
    });
  });

  describe('update', () => {
    it('should update a sale', async () => {
      const dto: UpdateSaleDto = { client_id: 2, product_ids: [2, 3] };
      mockSaleService.update.mockResolvedValue({ ...mockSale, ...dto });
      const result = await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ ...mockSale, ...dto });
    });
  });

  describe('remove', () => {
    it('should remove a sale', async () => {
      mockSaleService.remove.mockResolvedValue(undefined);
      const result = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
