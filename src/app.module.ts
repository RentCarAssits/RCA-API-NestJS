import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RentingManagementModule } from './renting-management/renting-management.module';
import { BillingManagementModule } from './billing-management/billing-management.module';
import { SubscriptionManagementModule } from './subscription-management/subscription-management.module';
import { WorkshopServiceManagementModule } from './workshop-service-management/workshop-service-management.module';
import { SharedModule } from './shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { IamManagementModule } from './iam-management/iam-management.module';
import * as ormconfig from './../../RCA-API-NestJS/ormconfig.js';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot(ormconfig),
    RentingManagementModule,
    BillingManagementModule,
    SubscriptionManagementModule,
    WorkshopServiceManagementModule,
    SharedModule,
    IamManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
