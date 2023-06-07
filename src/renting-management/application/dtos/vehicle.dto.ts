export class VehicleDto {
  public id?: string;
  public name: string;
  public brand: string;
  public model: string;
  public integrity: string;
  public state: number;
  public year: Date;
  public ownerId: number;
  public image: string;
  public categories?: string[];
}
