import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { getManager, Repository } from 'typeorm';
import { VehicleDto } from '../../dtos/vehicle.dto';
import { GetAllVehiclesQuery } from '../../queries/get-all-vehicles.query';
import { GetVehicleByIdQuery } from '../../queries/get-vehicle-by-id.query';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';
import { InjectRepository } from '@nestjs/typeorm';

@QueryHandler(GetAllVehiclesQuery)
export class GetAllVehiclesHandler
  implements IQueryHandler<GetAllVehiclesQuery>
{
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async execute(query: GetAllVehiclesQuery): Promise<VehicleDto[]> {
    const vehicles = await this.vehicleRepository.find({
      relations: {
        categories: true,
      },
    });
    console.log(
      '🚀 ~ file: vehicles-queries.handler.ts:18 ~ GetAllVehiclesHandler ~ execute ~ vehicles:',
      vehicles['result'],
    );

    const vehicleDtos: VehicleDto[] = vehicles.map((vehicle) => {
      const vehicleDto = new VehicleDto();
      vehicleDto.name = vehicle.getName().getValue();
      vehicleDto.brand = vehicle.brand.getValue();
      vehicleDto.model = vehicle.getModel().getValue();
      vehicleDto.integrity = vehicle.getIntegrity().getValue();
      vehicleDto.state = vehicle.getState();
      vehicleDto.year = vehicle.year;
      vehicleDto.categories = vehicle.categories.map((category) =>
        category.getName(),
      );
      return vehicleDto;
    });

    return vehicleDtos;
  }
}

@QueryHandler(GetVehicleByIdQuery)
export class GetVehicleByIdHandler
  implements IQueryHandler<GetVehicleByIdQuery>
{
  async execute(query: GetVehicleByIdQuery) {
    const manager = getManager();
    const sql = `
      SELECT
        v.id,
        v.name,
        v.brand,
        v.model,
        v.integrity,
        v.state,
        v.year,
        v.categoryId
      FROM 
        vehicles v
      WHERE
        v.id = ?;
    `;
    const ormVehicles = await manager.query(sql, [query.vehicleId]);
    if (ormVehicles.length <= 0) {
      return null;
    }
    const ormVehicle = ormVehicles[0];
    const vehicleDto = new VehicleDto();
    // vehicleDto.id = Number(ormVehicle.id);
    vehicleDto.name = ormVehicle.name;
    vehicleDto.brand = ormVehicle.brand;
    vehicleDto.model = ormVehicle.model;
    vehicleDto.integrity = ormVehicle.integrity;
    vehicleDto.state = ormVehicle.state;
    vehicleDto.year = new Date(ormVehicle.year);
    vehicleDto.categories = ormVehicle.categories;
    return vehicleDto;
  }
}
