import { Frequency } from "../enums/frequency.enum"
import { ConflictException } from "../../common/exceptions/conflict.exception"
import { BaseEntity } from "../../common/entities/base.entity"

export class Subscription extends BaseEntity {
  public isConfirmed = false

  constructor(
    id: string | null,
    public email: string,
    public city: string,
    public frequency: Frequency,
    public confirmationToken: string,
    public unsubscribeToken: string
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

  confirm() {
    if (this.isConfirmed) {
      throw new ConflictException(
        `Subscription with id ${this.id} already confirmed`
      )
    }

    this.isConfirmed = true
  }
}
