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
    ["_email" as "email"]: {
      type: "string",
      length: 255,
      index: true,
      nullable: false,
      fieldName: "email",
      getterName: "email"
    },
    ["_city" as "city"]: {
      type: "string",
      length: 255,
      index: true,
      nullable: false,
      fieldName: "city",
      getterName: "city"
    },
    ["_frequency" as "frequency"]: {
      type: "string",
      enum: true,
      items: Object.values(Frequency),
      default: Frequency.DAILY,
      getterName: "frequency",
      fieldName: "frequency",
      onCreate: () => Frequency.DAILY
    },
    ["_isConfirmed" as "isConfirmed"]: {
      type: "boolean",
      default: false,
      getterName: "isConfirmed",
      fieldName: "is_confirmed",
      onCreate: () => false
    },
    ["_confirmationToken" as "confirmationToken"]: {
      type: "string",
      length: 64,
      unique: true,
      nullable: false,
      getterName: "confirmationToken",
      fieldName: "confirmation_token"
    },
    ["_unsubscribeToken" as "unsubscribeToken"]: {
      type: "string",
      length: 64,
      unique: true,
      nullable: false,
      getterName: "unsubscribeToken",
      fieldName: "unsubscribe_token"
    }
  }
})
