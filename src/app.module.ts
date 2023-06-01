import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RentingManagementModule } from './renting-management/renting-management.module';
import { BillingManagementModule } from './billing-management/billing-management.module';
import { SubscriptionManagementModule } from './subscription-management/subscription-management.module';
import { WorkshopServiceManagementModule } from './workshop-service-management/workshop-service-management.module';
import { SharedModule } from './shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryOperation } from './workshop-service-management/domain/entities/inventory-operation.entity';
import { InventoryTransaction } from './workshop-service-management/domain/entities/inventory-transaction.entity';
import { Inventory } from './workshop-service-management/domain/entities/inventory.entity';
import { Product } from './workshop-service-management/domain/entities/product.entity';
import { RequestItem } from './workshop-service-management/domain/entities/request-item.entity';
import { ServiceItem } from './workshop-service-management/domain/entities/service-item.value';
import { ServiceItemOrder } from './workshop-service-management/domain/entities/service-item-order-entity';
import { Warehouse } from './workshop-service-management/domain/entities/warehouse.entity';
import { Workshop } from './workshop-service-management/domain/entities/workshop.entity';

@Module({
  imports: [
    RentingManagementModule,
    BillingManagementModule,
    SubscriptionManagementModule,
    WorkshopServiceManagementModule,
    SharedModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'rca-db',
      autoLoadEntities: true,
      synchronize: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
      entities: ['/domain/entities/*.js'],
    }),
    TypeOrmModule.forFeature([
      InventoryOperation,
      InventoryTransaction,
      Inventory,
      Product,
      RequestItem,
      ServiceItem,
      ServiceItemOrder,
      ServiceItem,
      Warehouse,
      Workshop,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
