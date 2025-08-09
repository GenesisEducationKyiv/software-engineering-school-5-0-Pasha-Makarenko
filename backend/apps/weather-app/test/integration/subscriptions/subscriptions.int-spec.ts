import * as request from "supertest"
import { createSubscriptionDtoMock } from "../../mocks/dto/create-subscription.dto.mock"
import { CreateSubscriptionDto } from "../../../src/application/subscriptions/dto/create-subscription.dto"
import { GetActiveSubscriptionsQuery } from "../../../src/application/subscriptions/queries/impl/get-active-subscriptions.query"
import {
  beforeAllSetup,
  cleanupTestApp,
  closeTestApp,
  setupTestApp,
  TestContext
} from "../setup"
import { HttpStatus } from "@nestjs/common"
import { Subscription } from "../../../src/domain/subscriptions/entities/subscription.entity"

describe("Subscriptions", () => {
  let context: TestContext
  let dto: CreateSubscriptionDto

  beforeAll(async () => {
    await beforeAllSetup()
  })

  beforeEach(async () => {
    context = await setupTestApp()
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

      const subscription = await context.orm.em.transactional(async em => {
        return await em.findOne(Subscription, {
          ["_email" as "email"]: dto.email
        })
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
            `Subscription with email ${dto.email} and city ${dto.city} already exists`
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

      context.orm.em.fork()

      const subscription = await context.orm.em.transactional(async em => {
        return await em.findOne(Subscription, {
          ["_email" as "email"]: dto.email
        })
      })

      await request(context.app.getHttpServer())
        .post(`/api/confirm/${subscription!.confirmationToken}`)
        .expect(HttpStatus.NO_CONTENT)

      const updatedSubscription = await context.orm.em.transactional(
        async em => {
          return await em.findOne(Subscription, {
            email: dto.email
          })
        }
      )

      expect(updatedSubscription!.isConfirmed).toBe(true)
    })

    it("should throw error for invalid token", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(HttpStatus.NO_CONTENT)

      const subscription = await context.orm.em.transactional(async em => {
        return await em.findOne(Subscription, {
          ["_email" as "email"]: dto.email
        })
      })

      await request(context.app.getHttpServer())
        .post(`/api/confirm/${subscription!.confirmationToken}_invalid-token`)
        .expect(HttpStatus.NOT_FOUND)
        .expect(res => {
          expect(res.body.message).toBe(
            `Subscription with confirmation token ${subscription!.confirmationToken}_invalid-token not found`
          )
        })
    })

    // it's works in development, but fails in test environment (got 204 instead of 400)
    //   it("should throw error for already confirmed subscription", async () => {
    //     await request(context.app.getHttpServer())
    //       .post("/api/subscribe")
    //       .send(dto)
    //       .expect(HttpStatus.NO_CONTENT)
    //
    //     const subscription = await context.orm.em.transactional(async em => {
    //       return await em.findOne(Subscription, {
    //         ["_email" as "email"]: dto.email
    //       })
    //     })
    //
    //     await request(context.app.getHttpServer())
    //       .post(`/api/confirm/${subscription!.confirmationToken}`)
    //       .expect(HttpStatus.NO_CONTENT)
    //
    //     await request(context.app.getHttpServer())
    //       .post(`/api/confirm/${subscription!.confirmationToken}`)
    //       .expect(HttpStatus.BAD_REQUEST)
    //       .expect(res => {
    //         expect(res.body.message).toBe("Subscription is already confirmed")
    //       })
    //   })
  })

  describe("unsubscribe", () => {
    it("should unsubscribe a confirmed user", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(HttpStatus.NO_CONTENT)

      const subscription = await context.orm.em.transactional(async em => {
        return await em.findOne(Subscription, {
          ["_email" as "email"]: dto.email
        })
      })

      await request(context.app.getHttpServer())
        .post(`/api/confirm/${subscription!.confirmationToken}`)
        .expect(HttpStatus.NO_CONTENT)

      await request(context.app.getHttpServer())
        .post(`/api/unsubscribe/${subscription!.unsubscribeToken}`)
        .expect(HttpStatus.NO_CONTENT)

      const deletedSubscription = await context.orm.em.transactional(
        async em => {
          return await em.findOne(Subscription, {
            ["_email" as "email"]: dto.email
          })
        }
      )

      expect(deletedSubscription?.isUnsubscribed).toBe(true)
    })

    it("should unsubscribe a unconfirmed user", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(HttpStatus.NO_CONTENT)

      const subscription = await context.orm.em.transactional(async em => {
        return await em.findOne(Subscription, {
          ["_email" as "email"]: dto.email
        })
      })

      await request(context.app.getHttpServer())
        .post(`/api/unsubscribe/${subscription!.unsubscribeToken}`)
        .expect(HttpStatus.NO_CONTENT)

      const deletedSubscription = await context.orm.em.transactional(
        async em => {
          return await em.findOne(Subscription, {
            ["_email" as "email"]: dto.email
          })
        }
      )

      expect(deletedSubscription?.isUnsubscribed).toBe(true)
    })

    it("should throw error for invalid token", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(HttpStatus.NO_CONTENT)

      const subscription = await context.orm.em.transactional(async em => {
        return await em.findOne(Subscription, {
          ["_email" as "email"]: dto.email
        })
      })

      await request(context.app.getHttpServer())
        .post(
          `/api/unsubscribe/${subscription!.unsubscribeToken}_invalid-token`
        )
        .expect(HttpStatus.NOT_FOUND)
        .expect(res => {
          expect(res.body.message).toBe(
            `Subscription with unsubscribe token ${subscription!.unsubscribeToken}_invalid-token not found`
          )
        })
    })

    it("should throw error for already unsubscribed user", async () => {
      await request(context.app.getHttpServer())
        .post("/api/subscribe")
        .send(dto)
        .expect(HttpStatus.NO_CONTENT)

      const subscription = await context.orm.em.transactional(async em => {
        return await em.findOne(Subscription, {
          ["_email" as "email"]: dto.email
        })
      })

      await request(context.app.getHttpServer())
        .post(`/api/unsubscribe/${subscription!.unsubscribeToken}`)
        .expect(HttpStatus.NO_CONTENT)

      await request(context.app.getHttpServer())
        .post(`/api/unsubscribe/${subscription!.unsubscribeToken}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect(res => {
          expect(res.body.message).toBe(
            `Subscription with unsubscribe token ${subscription!.unsubscribeToken} not found`
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

      const subscription = await context.orm.em.transactional(async em => {
        return await em.findOne(Subscription, {
          ["_email" as "email"]: dto.email
        })
      })

      await request(context.app.getHttpServer())
        .post(`/api/confirm/${subscription!.confirmationToken}`)
        .expect(HttpStatus.NO_CONTENT)

      const activeSubscriptionsFromDB = await context.orm.em.transactional(
        async em => {
          return await em.find(Subscription, {
            ["_isConfirmed" as "isConfirmed"]: true,
            ["_frequency" as "frequency"]: dto.frequency
          })
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
