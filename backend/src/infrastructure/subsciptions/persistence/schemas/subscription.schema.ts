import { EntitySchema } from "@mikro-orm/core"
import { Frequency } from "../../../../domain/subscriptions/enums/frequency.enum"
import { Subscription } from "../../../../domain/subscriptions/entities/subscription.entity"
import { BaseSchema } from "../../../common/persistance/schemas/base.schema"
import { BaseEntity } from "../../../../domain/common/entities/base.entity"

export const SubscriptionSchema = new EntitySchema<Subscription, BaseEntity>({
  class: Subscription,
  extends: BaseSchema,
  tableName: "subscriptions",
  properties: {
    email: {
      type: "string",
      length: 255,
      index: true,
      nullable: false
    },
    city: {
      type: "string",
      length: 255,
      index: true,
      nullable: false
    },
    frequency: {
      type: "string",
      enum: true,
      items: Object.values(Frequency),
      default: Frequency.DAILY,
      onCreate: () => Frequency.DAILY
    },
    isConfirmed: {
      type: "boolean",
      default: false,
      onCreate: () => false
    },
    confirmationToken: {
      type: "string",
      length: 64,
      unique: true,
      nullable: false
    },
    unsubscribeToken: {
      type: "string",
      length: 64,
      unique: true,
      nullable: false
    }
  }
})
