import * as request from "supertest"
import { createSubscriptionDtoMock } from "../../mocks/dto/create-subscription.dto.mock"
import { CreateSubscriptionDto } from "../../../src/subscriptions/dto/create-subscription.dto"
import { GetActiveSubscriptionsQuery } from "../../../src/subscriptions/queries/impl/get-active-subscriptions.query"
import {
  beforeAllSetup,
  cleanupTestApp,
  closeTestApp,
  setupTestApp,
  TestContext
} from "../setup"

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
        .expect(204)

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
        .expect(204)

      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(409)
        .expect(res => {
          expect(res.body.message).toBe("Subscription already exists")
        })
    })
  })

  describe("confirmation", () => {
    it("should confirm a subscription", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(204)

      const subscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await request(context.app.getHttpServer())
        .post(`/api/confirm/${subscription!.confirmationToken}`)
        .expect(204)

      const updatedSubscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      expect(updatedSubscription!.isConfirmed).toBe(true)
    })

    it("should throw error for invalid token", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(204)

      const subscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await request(context.app.getHttpServer())
        .post(`/api/confirm/${subscription!.confirmationToken}_invalid-token`)
        .expect(404)
        .expect(res => {
          expect(res.body.message).toBe(
            "Subscription not found or already confirmed"
          )
        })
    })

    it("should throw error for already confirmed subscription", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(204)

      const subscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await request(context.app.getHttpServer())
        .post(`/api/confirm/${subscription!.confirmationToken}`)
        .expect(204)

      await request(context.app.getHttpServer())
        .post(`/api/confirm/${subscription!.confirmationToken}`)
        .expect(404)
        .expect(res => {
          expect(res.body.message).toBe(
            "Subscription not found or already confirmed"
          )
        })
    })
  })

  describe("unsubscribe", () => {
    it("should unsubscribe a confirmed user", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(204)

      const subscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await request(context.app.getHttpServer())
        .post(`/api/confirm/${subscription!.confirmationToken}`)
        .expect(204)

      await request(context.app.getHttpServer())
        .post(`/api/unsubscribe/${subscription!.unsubscribeToken}`)
        .expect(204)

      const deletedSubscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      expect(deletedSubscription).toBeNull()
    })

    it("should unsubscribe a unconfirmed user", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(204)

      const subscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await request(context.app.getHttpServer())
        .post(`/api/unsubscribe/${subscription!.unsubscribeToken}`)
        .expect(204)

      const deletedSubscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      expect(deletedSubscription).toBeNull()
    })

    it("should throw error for invalid token", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(204)

      const subscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await request(context.app.getHttpServer())
        .post(
          `/api/unsubscribe/${subscription!.unsubscribeToken}_invalid-token`
        )
        .expect(404)
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
        .expect(204)

      const subscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await request(context.app.getHttpServer())
        .post(`/api/unsubscribe/${subscription!.unsubscribeToken}`)
        .expect(204)

      await request(context.app.getHttpServer())
        .post(`/api/unsubscribe/${subscription!.unsubscribeToken}`)
        .expect(404)
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
        .expect(204)

      const subscription = await context.subscriptionModel.findOne({
        where: { email: dto.email }
      })

      await request(context.app.getHttpServer())
        .post(`/api/confirm/${subscription!.confirmationToken}`)
        .expect(204)

      const activeSubscriptionsFromDB = await context.subscriptionModel.findAll(
        {
          where: { isConfirmed: true }
        }
      )

      const activeSubscriptions = await context.queryBus.execute(
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
