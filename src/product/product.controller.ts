import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '../database/entities/product.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Cria um novo produto' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Produto criado', type: Product })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Lista todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos',
    type: [Product],
  })
  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Busca um produto pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado',
    type: Product,
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualiza um produto pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do produto' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado',
    type: Product,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(+id, updateProductDto);
  }

  @ApiOperation({ summary: 'Remove um produto pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do produto' })
  @ApiResponse({ status: 204, description: 'Produto removido' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(+id);
  }

  @ApiOperation({ summary: 'Lista produtos por faixa de preço' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos filtrados por preço',
    type: [Product],
  })
  @Get('filter/price')
  findByPriceRange(
    @Query('min_price') minPrice?: string,
    @Query('max_price') maxPrice?: string,
  ): Promise<Product[]> {
    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;
    return this.productService.findByPriceRange(min, max);
  }
}
