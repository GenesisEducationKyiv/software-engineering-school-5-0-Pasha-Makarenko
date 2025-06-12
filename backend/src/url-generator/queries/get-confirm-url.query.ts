export class GetConfirmUrlQuery {
  constructor(
    public readonly clientUrl: string,
    public readonly token: string
  ) {}
}
