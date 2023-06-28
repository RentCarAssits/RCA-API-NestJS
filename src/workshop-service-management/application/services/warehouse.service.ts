import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { CreateWarehouseValidator } from '../validators/create-warehouse.validator';
import { CreateWarehouseDTO } from '../dto/request/create-warehouse.dto';
import { CreateWarehouseCommand } from '../commands/create-warehouse.command';
import { CreateWarehouseResponseDTO } from '../dto/response/create-warehouse-response.dto';
import { WarehouseDTO } from '../dto/warehouse.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Warehouse } from 'src/workshop-service-management/domain/entities/warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Workshop } from '../../domain/entities/workshop.entity';
import { WorkshopIdFK } from '../../domain/value-objects/workshop-id-fk.value';

@Injectable()
export class WarehouseService {
  constructor(
    private commandBus: CommandBus,
    private createWarehouseValidator: CreateWarehouseValidator,

    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,

    @InjectRepository(Workshop)
    private workshopRepository: Repository<Workshop>,
  ) {}
  async create(
    createWarehouseDto: CreateWarehouseDTO,
  ): Promise<Result<AppNotification, CreateWarehouseDTO>> {
    const notification: AppNotification =
      await this.createWarehouseValidator.validate(createWarehouseDto);
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    const createWarehouseCommand: CreateWarehouseCommand =
      new CreateWarehouseCommand(
        createWarehouseDto.name,
        createWarehouseDto.country,
        createWarehouseDto.district,
        createWarehouseDto.addressDetail,
        createWarehouseDto.workshopId,
      );
    const warehouselId = await this.commandBus.execute(createWarehouseCommand);
    const createWarehouseResponseDto: CreateWarehouseResponseDTO =
      new CreateWarehouseResponseDTO(
        warehouselId,
        createWarehouseDto.name,
        createWarehouseDto.country,
        createWarehouseDto.district,
        createWarehouseDto.addressDetail,
        createWarehouseDto.workshopId,
      );
    return Result.ok(createWarehouseResponseDto);
  }
  async findById(
    warehouseId: Number,
  ): Promise<Result<AppNotification, WarehouseDTO>> {
    const warehouse = await this.warehouseRepository.findOne({
      where: {
        id: warehouseId,
      } as FindOptionsWhere<Warehouse>,
    });

    const warehouseDto = new WarehouseDTO();
    warehouseDto.id = Number(warehouse.getId());
    warehouseDto.name = warehouse.getName();
    warehouseDto.country = warehouse.getAdress().getCountry();
    warehouseDto.district = warehouse.getAdress().getDitrict();
    warehouseDto.addressDetail = warehouse.getAdress().getAddressDetail();

    return Result.ok(warehouseDto);
  }

  async findAllWarehouseByWorkshopId(
    workshopId: number,
  ): Promise<Result<AppNotification, WarehouseDTO[]>> {
    const warehouses = await this.warehouseRepository.find({
      where: {
        workshop: WorkshopIdFK.of(workshopId),
      } as FindOptionsWhere<Warehouse>,
    });
    const warehouseDtos: WarehouseDTO[] = warehouses.map((warehouse) => {
      const warehouseDto = new WarehouseDTO();
      warehouseDto.id = Number(warehouse.getId());
      warehouseDto.name = warehouse.getName();
      warehouseDto.country = warehouse.getAdress().getCountry();
      warehouseDto.district = warehouse.getAdress().getDitrict();
      warehouseDto.addressDetail = warehouse.getAdress().getAddressDetail();
      warehouseDto.workshopId = warehouse.getWorkshop().getValue();
      return warehouseDto;
    });
    return Result.ok(warehouseDtos);
  }
}
