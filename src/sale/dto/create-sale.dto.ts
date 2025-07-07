import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateSaleDto {
  @ApiProperty({ example: 1, description: 'ID do cliente' })
  @IsNumber()
  client_id: number;

  @ApiProperty({
    example: [1, 2],
    description: 'IDs dos produtos vendidos',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  product_ids: number[];
}
