import { Migration } from "@mikro-orm/migrations"

export class InitSubscriptionsMigration extends Migration {
  async up() {
    this.addSql(
      `CREATE TABLE IF NOT EXISTS "subscriptions" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" VARCHAR(255) NOT NULL,
        "city" VARCHAR(255) NOT NULL,
        "frequency" VARCHAR(20) NOT NULL DEFAULT 'DAILY',
        "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
        "confirmation_token" VARCHAR(64) NOT NULL UNIQUE,
        "unsubscribe_token" VARCHAR(64) NOT NULL UNIQUE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "subscriptions_email_city_unique" UNIQUE ("email", "city")
      )`
    )

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "subscriptions_email_index" ON "subscriptions" ("email")`
    )

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "subscriptions_city_index" ON "subscriptions" ("city")`
    )

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "subscriptions_confirmation_token_index" ON "subscriptions" ("confirmation_token")`
    )

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "subscriptions_unsubscribe_token_index" ON "subscriptions" ("unsubscribe_token")`
    )
  }

  async down() {
    this.addSql(`DROP TABLE IF EXISTS "subscriptions"`)
    this.addSql(`DROP INDEX IF EXISTS "subscriptions_email_index"`)
    this.addSql(`DROP INDEX IF EXISTS "subscriptions_city_index"`)
    this.addSql(`DROP INDEX IF EXISTS "subscriptions_confirmation_token_index"`)
    this.addSql(`DROP INDEX IF EXISTS "subscriptions_unsubscribe_token_index"`)
  }
}
