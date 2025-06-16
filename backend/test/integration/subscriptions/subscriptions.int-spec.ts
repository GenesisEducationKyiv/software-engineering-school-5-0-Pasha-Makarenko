import { Test } from "@nestjs/testing"
import {
  ConflictException,
  INestApplication,
  NotFoundException
} from "@nestjs/common"
import { Sequelize } from "sequelize-typescript"
import { getModelToken } from "@nestjs/sequelize"
import { AppModule } from "../../../src/app.module"
import { Subscription } from "../../../src/subscriptions/models/subscription.model"
import { createSubscriptionDtoMock } from "../../mocks/dto/create-subscription.dto.mock"
import { CreateSubscriptionDto } from "../../../src/subscriptions/dto/create-subscription.dto"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateSubscriptionCommand } from "../../../src/subscriptions/commands/impl/create-subscription.command"
import { ConfirmSubscriptionCommand } from "../../../src/subscriptions/commands/impl/confirm-subscription.command"
import { UnsubscribeCommand } from "../../../src/subscriptions/commands/impl/unsubscribe.command"
import { GetActiveSubscriptionsQuery } from "../../../src/subscriptions/queries/impl/get-active-subscriptions.query"

describe("Subscriptions", () => {
  let app: INestApplication
  let sequelize: Sequelize
  let subscriptionModel: typeof Subscription
  let dto: CreateSubscriptionDto
  let commandBus: CommandBus
  let queryBus: QueryBus

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    sequelize = moduleFixture.get<Sequelize>(Sequelize)
    subscriptionModel = moduleFixture.get<typeof Subscription>(
      getModelToken(Subscription)
    )
    commandBus = moduleFixture.get<CommandBus>(CommandBus)
    queryBus = moduleFixture.get<QueryBus>(QueryBus)

    await sequelize.sync({ force: true })

    dto = createSubscriptionDtoMock
  })

  afterEach(async () => {
    await subscriptionModel.destroy({ where: {} })
  })

  afterAll(async () => {
    await app.close()
    await sequelize.close()
  })

  describe("subscribe", () => {
    it("should create a new subscription", async () => {
      await commandBus.execute(new CreateSubscriptionCommand(dto))

      const subscription = await subscriptionModel.findOne({
        where: { email: dto.email }
      })

      expect(subscription).toBeDefined()
      expect(subscription!.city).toBe(dto.city)
      expect(subscription!.isConfirmed).toBe(false)
    })

    it("should throw error for duplicate email", async () => {
      await commandBus.execute(new CreateSubscriptionCommand(dto))

      await expect(
        commandBus.execute(new CreateSubscriptionCommand(dto))
      ).rejects.toThrowError(ConflictException)
    })
  })

  describe("confirmation", () => {
    it("should confirm a subscription", async () => {
      await commandBus.execute(new CreateSubscriptionCommand(dto))

      const subscription = await subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await commandBus.execute(
        new ConfirmSubscriptionCommand(subscription!.confirmationToken)
      )

      const updatedSubscription = await subscriptionModel.findOne({
        where: { email: dto.email }
      })

      expect(updatedSubscription!.isConfirmed).toBe(true)
    })

    it("should throw error for invalid token", async () => {
      await commandBus.execute(new CreateSubscriptionCommand(dto))

      await expect(
        commandBus.execute(new ConfirmSubscriptionCommand("invalid-token"))
      ).rejects.toThrowError(NotFoundException)
    })
  })

  describe("unsubscribe", () => {
    it("should unsubscribe a confirmed user", async () => {
      await commandBus.execute(new CreateSubscriptionCommand(dto))

      const subscription = await subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await commandBus.execute(
        new ConfirmSubscriptionCommand(subscription!.confirmationToken)
      )

      await commandBus.execute(
        new UnsubscribeCommand(subscription!.unsubscribeToken)
      )

      const deletedSubscription = await subscriptionModel.findOne({
        where: { email: dto.email }
      })

      expect(deletedSubscription).toBeNull()
    })

    it("should unsubscribe a unconfirmed user", async () => {
      await commandBus.execute(new CreateSubscriptionCommand(dto))

      const subscription = await subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await commandBus.execute(
        new UnsubscribeCommand(subscription!.unsubscribeToken)
      )

      const deletedSubscription = await subscriptionModel.findOne({
        where: { email: dto.email }
      })

      expect(deletedSubscription).toBeNull()
    })

    it("should throw error for invalid token", async () => {
      await commandBus.execute(new CreateSubscriptionCommand(dto))

      await expect(
        commandBus.execute(new UnsubscribeCommand("invalid-token"))
      ).rejects.toThrowError(NotFoundException)
    })
  })

  describe("get active subscriptions", () => {
    it("should return active subscriptions", async () => {
      await commandBus.execute(new CreateSubscriptionCommand(dto))

      const subscription = await subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await commandBus.execute(
        new ConfirmSubscriptionCommand(subscription!.confirmationToken)
      )

      const activeSubscriptionsFromDB = await subscriptionModel.findAll({
        where: { isConfirmed: true }
      })

      const activeSubscriptions = await queryBus.execute(
        new GetActiveSubscriptionsQuery({})
      )

      expect(activeSubscriptions.length).toBe(activeSubscriptionsFromDB.length)

      for (let i = 0; i < activeSubscriptions.length; i++) {
        expect(activeSubscriptions[i].email).toBe(
          activeSubscriptionsFromDB[i].email
        )
        expect(activeSubscriptions[i].city).toBe(
          activeSubscriptionsFromDB[i].city
        )
      }
    })
  })
})
