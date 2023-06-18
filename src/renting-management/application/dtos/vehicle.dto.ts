export class VehicleDto {
  public id?: number;
  public name: string;
  public brand: string;
  public model: string;
  public integrity: string;
  public state: number;
  public year: Date;
  public ownerId: number;
  public image: string;
  public stars: number;
  public price: number;
  public currency: string;
  public timeUnit: string;
  public categories?: string[];
}
