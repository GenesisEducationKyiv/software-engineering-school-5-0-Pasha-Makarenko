import { Seeder } from "@mikro-orm/seeder"
import { EntityManager } from "@mikro-orm/postgresql"
import { Subscription } from "../src/domain/subscriptions/entities/subscription.entity"
import { Frequency } from "../src/domain/subscriptions/enums/frequency.enum"

export class SubscriptionsSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const subscription = em.create(Subscription, {
      email: "test1@example.com",
      city: "London",
      frequency: Frequency.DAILY,
      confirmationToken: "confirmation-token-1",
      unsubscribeToken: "unsubscribe-token-1",
      isConfirmed: true
    })
    await em.persistAndFlush(subscription)
  }
}
