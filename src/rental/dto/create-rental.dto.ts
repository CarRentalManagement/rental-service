import { RENTAL_TYPE } from '@microservice-vehicle/entities';
import { Type } from 'class-transformer';
import {
  IsDataURI,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRentalDto {
  @IsNumber()
  public vehicleId: number;

  @IsNumber()
  public customerId: number;

  @IsDataURI()
  @Type(() => Date)
  public date: Date;

  @IsString()
  @IsEnum(RENTAL_TYPE)
  @IsOptional()
  public type: RENTAL_TYPE;

  @IsNumber()
  public duration: number;
}
