export class City {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly country: string,
    public readonly lat: number,
    public readonly lon: number,
    public readonly url: string
  ) {}

  static create(
    id: number,
    name: string,
    country: string,
    lat: number,
    lon: number,
    url: string
  ): City {
    return new City(id, name, country, lat, lon, url)
  }
}
