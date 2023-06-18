export class ServiceRequestCreated {
  constructor(
    public readonly id: number,
    public readonly descriptionProblems: string,
  ) {}
}
