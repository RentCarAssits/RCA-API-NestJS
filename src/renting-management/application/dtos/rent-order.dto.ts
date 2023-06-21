export class RentOrderDto {
    public id?: number;
    public state: string;
    public renterId: number;
    public ownerId: number;
    public itemIds: number[];
  }
  