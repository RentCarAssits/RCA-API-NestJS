import { Column } from 'typeorm';
export class Address {
  @Column('varchar', { name: 'country' })
  private readonly country: string;
  @Column('varchar', { name: 'district' })
  private readonly district: string;
  @Column('varchar', { name: 'description' })
  private readonly description: string;

  private constructor(country: string, district: string, description: string) {
    this.country = country;
    this.district = district;
    this.description = description;
  }

  public static create(
    country: string,
    district: string,
    description: string,
  ): Address {
    return new Address(country, district, description);
  }

  public getCountry(): string {
    return this.country;
  }
  public getDitrict(): string {
    return this.district;
  }
  public getDescription(): string {
    return this.description;
  }
}
