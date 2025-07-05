import { Frequency } from "../enums/frequency.enum"
import { SubscriptionAlreadyConfirmedException } from "../exceptions/subscription-already-confirmed.exception"

export class Subscription {
  private _isConfirmed = false

  constructor(
    private _id: string,
    private _email: string,
    private _city: string,
    private _frequency: Frequency,
    private _confirmationToken: string,
    private _unsubscribeToken: string
  ) {}

  static create(
    id: string,
    email: string,
    city: string,
    frequency: Frequency,
    confirmationToken: string,
    unsubscribeToken: string
  ): Subscription {
    return new Subscription(
      id,
      email,
      city,
      frequency,
      confirmationToken,
      unsubscribeToken
    )
  }

  get id(): string {
    return this._id
  }

  get email(): string {
    return this._email
  }

  get city(): string {
    return this._city
  }

  get frequency(): Frequency {
    return this._frequency
  }

  get confirmationToken(): string {
    return this._confirmationToken
  }

  get unsubscribeToken(): string {
    return this._unsubscribeToken
  }

  get isConfirmed(): boolean {
    return this._isConfirmed
  }

  confirm() {
    if (this._isConfirmed) {
      throw new SubscriptionAlreadyConfirmedException()
    }

    this._isConfirmed = true
  }
}
