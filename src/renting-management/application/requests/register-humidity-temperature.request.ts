export class RegisterHumidityTemperatureRequest {
  constructor(
    public readonly humidity: string,
    public readonly temperature: string
  ) {
  }
}
