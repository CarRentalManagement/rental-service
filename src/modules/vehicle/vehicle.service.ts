import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Vehicle } from '@microservice-vehicle/entities';
import { VehicleTypeService } from '@microservice-vehicle/module-vehicle-type/vehicleType.service';
import { AutomakerService } from '@microservice-vehicle/module-automaker/automaker.service';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { UserGrpcService } from '@microservice-vehicle/module-user/user.grpc.service';
import CustomLogger from '@microservice-vehicle/module-log/customLogger';
import { GetVehiclesDto } from './dto/get-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    private readonly vehicleTypeService: VehicleTypeService,
    private readonly automakerService: AutomakerService,
    private readonly userGrpcService: UserGrpcService,
    private readonly logger: CustomLogger,

    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
  ) {
    logger.setContext(VehicleService.name);
  }

  async create(createVehicleDto: CreateVehicleDto) {
    const { automakerId, typeId, userEmail } = createVehicleDto;

    const [type, automaker, user] = await Promise.all([
      this.vehicleTypeService.getOne({ id: typeId }),
      this.automakerService.getOne({ id: automakerId }),
      this.userGrpcService.getUserByEmail({ email: userEmail }),
    ]);

    if (!user) {
      this.logger.log('User not found', 'create');
      throw {
        message: 'User not found',
      };
    }

    const newVehicle = new Vehicle();

    this.vehicleRepository.merge(newVehicle, {
      ...createVehicleDto,
      type,
      automaker,
      ownerId: user.id,
    });
    await this.vehicleRepository.save(newVehicle);

    return newVehicle;
  }

  async getVehicles(query: GetVehiclesDto) {
    const { automakerIds, typeIds, name, color } = query;

    const vehicleQuery = this.vehicleRepository.createQueryBuilder('vehicle');

    if (automakerIds?.length > 0) {
      vehicleQuery.andWhere('vehicle.automakerId IN (:...automakerIds', {
        automakerIds,
      });
    }

    const vehicles = await vehicleQuery.getMany();

    return vehicles;
  }

  getOne(id: number) {
    return `This action returns a #${id} vehicle`;
  }

  update(id: number, updateVehicleDto: UpdateVehicleDto) {
    return `This action updates a #${id} vehicle`;
  }

  remove(id: number) {
    this.vehicleRepository.delete(id);
  }
}