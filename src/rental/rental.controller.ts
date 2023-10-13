import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';

@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  create(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalService.create(createRentalDto);
  }

  @Get()
  getRentals() {
    return this.rentalService.getRentals();
  }

  @Get(':id')
  getRental(@Param('id') id: number) {
    return this.rentalService.getRental(id);
  }

  @Patch(':id')
  updateRental(
    @Param('id') id: number,
    @Body() updateRentalDto: UpdateRentalDto,
  ) {
    return this.rentalService.update(id, updateRentalDto);
  }

  @Delete(':id')
  removeRental(@Param('id') id: number) {
    return this.rentalService.removeRental(id);
  }
}
