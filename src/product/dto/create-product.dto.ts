import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Produto Exemplo' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Descrição do produto', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  price: number;
}
