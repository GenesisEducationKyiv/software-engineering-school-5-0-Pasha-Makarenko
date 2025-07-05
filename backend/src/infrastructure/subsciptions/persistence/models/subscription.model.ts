import { Column, DataType, Index, Model, Table } from "sequelize-typescript"
import { ApiProperty } from "@nestjs/swagger"
import { Frequency } from "../../../../domain/subscriptions/enums/frequency.enum"
import { Subscription as SubscriptionEntity } from "../../../../domain/subscriptions/entities/subscription.entity"
import { SubscriptionCreation } from "../../../../domain/subscriptions/value-objects/subscription-creation.value-object"

@Table({ tableName: "subscriptions" })
export class Subscription extends Model<Subscription, SubscriptionCreation> {
  @ApiProperty({ example: "1", description: "Unique identifier" })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string

  @Index
  @ApiProperty({ example: "example@gmail.com", description: "User email" })
  @Column({ type: DataType.STRING, allowNull: false })
  declare email: string

  @Index
  @ApiProperty({ example: "London", description: "Weather in current city" })
  @Column({ type: DataType.STRING, allowNull: false })
  declare city: string

  @ApiProperty({
    example: Frequency.DAILY,
    description: "Send weather frequency"
  })
  @Column({
    type: DataType.ENUM(...Object.values(Frequency)),
    defaultValue: Frequency.DAILY
  })
  declare frequency: Frequency

  @ApiProperty({ example: false, description: "Is subscription confirmed" })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isConfirmed: boolean

  @ApiProperty({ example: "123", description: "Confirmation token" })
  @Column({ type: DataType.STRING(64), allowNull: false, unique: true })
  declare confirmationToken: string

  @Index
  @ApiProperty({ example: "123", description: "Unsubscribe token" })
  @Column({ type: DataType.STRING(64), allowNull: false, unique: true })
  declare unsubscribeToken: string

  public to_entity() {
    return new SubscriptionEntity(
      this.id,
      this.email,
      this.city,
      this.frequency,
      this.confirmationToken,
      this.unsubscribeToken
    )
  }
}
