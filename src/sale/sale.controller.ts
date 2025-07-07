import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from '../database/entities/sale.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('sale')
@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @ApiOperation({ summary: 'Cria uma nova venda' })
  @ApiBody({ type: CreateSaleDto })
  @ApiResponse({ status: 201, description: 'Venda criada', type: Sale })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSaleDto: CreateSaleDto): Promise<Sale> {
    return this.saleService.create(createSaleDto);
  }

  @ApiOperation({ summary: 'Lista todas as vendas' })
  @ApiResponse({ status: 200, description: 'Lista de vendas', type: [Sale] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Sale[]> {
    return this.saleService.findAll();
  }

  @ApiOperation({ summary: 'Busca uma venda pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da venda' })
  @ApiResponse({ status: 200, description: 'Venda encontrada', type: Sale })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Sale> {
    return this.saleService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualiza uma venda pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da venda' })
  @ApiBody({ type: UpdateSaleDto })
  @ApiResponse({ status: 200, description: 'Venda atualizada', type: Sale })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto,
  ): Promise<Sale> {
    return this.saleService.update(+id, updateSaleDto);
  }

  @ApiOperation({ summary: 'Remove uma venda pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da venda' })
  @ApiResponse({ status: 204, description: 'Venda removida' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.saleService.remove(+id);
  }
}
