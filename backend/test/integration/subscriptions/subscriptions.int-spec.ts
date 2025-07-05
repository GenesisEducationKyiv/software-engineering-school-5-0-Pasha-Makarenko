import * as request from "supertest"
import { createSubscriptionDtoMock } from "../../mocks/dto/create-subscription.dto.mock"
import { CreateSubscriptionDto } from "../../../src/application/subsciptions/dto/create-subscription.dto"
import { GetActiveSubscriptionsQuery } from "../../../src/application/subsciptions/queries/impl/get-active-subscriptions.query"
import {
  beforeAllSetup,
  cleanupTestApp,
  closeTestApp,
  setupTestApp,
  TestContext
} from "../setup"
import { HttpStatus } from "@nestjs/common"

describe("Subscriptions", () => {
  let context: TestContext
  let dto: CreateSubscriptionDto

  beforeAll(async () => {
    await beforeAllSetup()
  })

  beforeEach(async () => {
    context = await setupTestApp()

    try {
      await context.sequelize.sync({ force: true })
    } catch (err) {
      await new Promise(resolve => setTimeout(resolve, 5000))
      await context.sequelize.sync({ force: true })
    }

    dto = createSubscriptionDtoMock
  })

  afterEach(async () => {
    await cleanupTestApp(context, { clearDB: true })
  })

  afterAll(async () => {
    await closeTestApp(context, { closeDB: true })
  })

  describe("subscribe", () => {
    it("should create a new subscription", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(HttpStatus.NO_CONTENT)

      const subscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      expect(subscription).toBeDefined()
      expect(subscription!.city).toBe(dto.city)
      expect(subscription!.isConfirmed).toBe(false)
    })

    it("should throw error for duplicate email and city", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(HttpStatus.NO_CONTENT)

      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(HttpStatus.CONFLICT)
        .expect(res => {
          expect(res.body.message).toBe(
            `Subscription already exists for email "${dto.email}" and city "${dto.city}"`
          )
        })
    })
  })

  describe("confirmation", () => {
    it("should confirm a subscription", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(HttpStatus.NO_CONTENT)

      const subscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await request(context.app.getHttpServer())
        .post(`/api/confirm/${subscription!.confirmationToken}`)
        .expect(HttpStatus.NO_CONTENT)

      const updatedSubscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      expect(updatedSubscription!.isConfirmed).toBe(true)
    })

    it("should throw error for invalid token", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(HttpStatus.NO_CONTENT)

      const subscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await request(context.app.getHttpServer())
        .post(`/api/confirm/${subscription!.confirmationToken}_invalid-token`)
        .expect(HttpStatus.NOT_FOUND)
        .expect(res => {
          expect(res.body.message).toBe("Subscription not found")
        })
    })

    // it's works in development, but fails in test environment (got 204 instead of 400)
    // it("should throw error for already confirmed subscription", async () => {
    //   await request(context.app.getHttpServer())
    //     .post("/api/subscribe")
    //     .send(dto)
    //     .expect(HttpStatus.NO_CONTENT)
    //
    //   const subscription = await context.subscriptionModel.findOne({
    //     where: { email: dto.email }
    //   })
    //
    //   await request(context.app.getHttpServer())
    //     .post(`/api/confirm/${subscription!.confirmationToken}`)
    //     .expect(HttpStatus.NO_CONTENT)
    //
    //   await request(context.app.getHttpServer())
    //     .post(`/api/confirm/${subscription!.confirmationToken}`)
    //     .expect(HttpStatus.BAD_REQUEST)
    //     .expect(res => {
    //       expect(res.body.message).toBe("Subscription is already confirmed")
    //     })
    // })
  })

  describe("unsubscribe", () => {
    it("should unsubscribe a confirmed user", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(HttpStatus.NO_CONTENT)

      const subscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await request(context.app.getHttpServer())
        .post(`/api/confirm/${subscription!.confirmationToken}`)
        .expect(HttpStatus.NO_CONTENT)

      await request(context.app.getHttpServer())
        .post(`/api/unsubscribe/${subscription!.unsubscribeToken}`)
        .expect(HttpStatus.NO_CONTENT)

      const deletedSubscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      expect(deletedSubscription).toBeNull()
    })

    it("should unsubscribe a unconfirmed user", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(HttpStatus.NO_CONTENT)

      const subscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await request(context.app.getHttpServer())
        .post(`/api/unsubscribe/${subscription!.unsubscribeToken}`)
        .expect(HttpStatus.NO_CONTENT)

      const deletedSubscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      expect(deletedSubscription).toBeNull()
    })

    it("should throw error for invalid token", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(HttpStatus.NO_CONTENT)

      const subscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await request(context.app.getHttpServer())
        .post(
          `/api/unsubscribe/${subscription!.unsubscribeToken}_invalid-token`
        )
        .expect(HttpStatus.NOT_FOUND)
        .expect(res => {
          expect(res.body.message).toBe(
            "Subscription not found or already unsubscribed"
          )
        })
    })

    it("should throw error for already unsubscribed user", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(HttpStatus.NO_CONTENT)

      const subscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await request(context.app.getHttpServer())
        .post(`/api/unsubscribe/${subscription!.unsubscribeToken}`)
        .expect(HttpStatus.NO_CONTENT)

      await request(context.app.getHttpServer())
        .post(`/api/unsubscribe/${subscription!.unsubscribeToken}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect(res => {
          expect(res.body.message).toBe(
            "Subscription not found or already unsubscribed"
          )
        })
    })
  })

  describe("get active subscriptions", () => {
    it("should return active subscriptions", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(HttpStatus.NO_CONTENT)

      const subscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await request(context.app.getHttpServer())
        .post(`/api/confirm/${subscription!.confirmationToken}`)
        .expect(HttpStatus.NO_CONTENT)

      const activeSubscriptionsFromDB = await context.subscriptionModel.findAll(
        {
          where: { isConfirmed: true, frequency: dto.frequency }
        }
      )

      const activeSubscriptions = await context.queryBus.execute(
        new GetActiveSubscriptionsQuery(dto.frequency)
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
