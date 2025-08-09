import { Frequency } from "../enums/frequency.enum"
import { ConflictException } from "../../common/exceptions/conflict.exception"
import { BaseEntity } from "../../common/entities/base.entity"

export class Subscription extends BaseEntity {
  private _isConfirmed = false
  private _isUnsubscribed = false

  constructor(
    id: string | null,
    private _email: string,
    private _city: string,
    private _frequency: Frequency,
    private _confirmationToken: string,
    private _unsubscribeToken: string
  ) {
    super(id)
  }

  static create(
    id: string | null,
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

  get email() {
    return this._email
  }

  get city() {
    return this._city
  }

  get frequency() {
    return this._frequency
  }

  get confirmationToken() {
    return this._confirmationToken
  }

  get unsubscribeToken() {
    return this._unsubscribeToken
  }

  get isConfirmed() {
    return this._isConfirmed
  }

  get isUnsubscribed() {
    return this._isUnsubscribed
  }

  confirm() {
    if (this._isConfirmed) {
      throw new ConflictException(
        `Subscription with id ${this.id} already confirmed`
      )
    }

    this._isConfirmed = true
    this.updateTimestamp()
  }

  unsubscribe() {
    if (this._isUnsubscribed) {
      throw new ConflictException(
        `Subscription with id ${this.id} already unsubscribed`
      )
    }

    this._isUnsubscribed = true
    this.updateTimestamp()
  }
}
