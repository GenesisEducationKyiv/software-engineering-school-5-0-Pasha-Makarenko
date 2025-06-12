export class GetUnsubscribeUrlQuery {
  constructor(
    public readonly clientUrl: string,
    public readonly token: string
  ) {}
}
