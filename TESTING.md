# Testing

Copy environment variables from `.env.test.example` to `.env.test`:

```bash
cp .env.test.example .env.test
```

## Unit Tests

Run the unit tests:

* For backend:

```bash
npm run test:unit:backend
```

* For frontend:

```bash
npm run test:unit:frontend
```

* For all unit tests (both backend and frontend):

```bash
npm run test:unit:all
```

## Integration Tests

Run the integration tests:

```bash
npm run test:integration:backend
```

## E2E Tests

Run the end-to-end tests:

```bash
npm run test:e2e:backend
```