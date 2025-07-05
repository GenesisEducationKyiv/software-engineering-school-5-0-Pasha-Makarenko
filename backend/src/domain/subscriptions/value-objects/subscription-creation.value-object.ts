export class SubscriptionCreation {
  constructor(
    public readonly email: string,
    public readonly city: string,
    public readonly frequency: string,
    public readonly confirmationToken: string,
    public readonly unsubscribeToken: string
  ) {}

  static create(
    email: string,
    city: string,
    frequency: string,
    confirmationToken: string,
    unsubscribeToken: string
  ): SubscriptionCreation {
    return new SubscriptionCreation(
      email,
      city,
      frequency,
      confirmationToken,
      unsubscribeToken
    )
  }
}
