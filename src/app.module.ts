import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RentingManagementModule } from './renting-management/renting-management.module';
import { BillingManagementModule } from './billing-management/billing-management.module';
import { SubscriptionManagementModule } from './subscription-management/subscription-management.module';
import { WorkshopServiceManagementModule } from './workshop-service-management/workshop-service-management.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    RentingManagementModule,
    BillingManagementModule,
    SubscriptionManagementModule,
    WorkshopServiceManagementModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
