import { Column } from 'typeorm';
export class Address {
  @Column('varchar', { name: 'country' })
  private readonly country: string;
  @Column('varchar', { name: 'district' })
  private readonly district: string;
  @Column('varchar', { name: 'address_detail' })
  private readonly addressDetail: string;

  private constructor(country: string, district: string, addressDetail: string) {
    this.country = country;
    this.district = district;
    this.addressDetail = addressDetail;
  }

  public static create(
    country: string,
    district: string,
    addressDetail: string,
  ): Address {
    return new Address(country, district, addressDetail);
  }

  public getCountry(): string {
    return this.country;
  }
  public getDitrict(): string {
    return this.district;
  }
  public getAddressDetail(): string {
    return this.addressDetail;
  }
}
