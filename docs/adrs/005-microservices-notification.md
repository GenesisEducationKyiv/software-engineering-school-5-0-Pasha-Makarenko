# ADR-005: Microservices Architecture - Notification Service Extraction

---

**Status**: Pending \
**Date**: 2025-07-08 \
**Author**: Pavlo Makarenko

---

## Context
The current weather application is a monolithic NestJS application with modules for subscriptions, weather, search, mail, scheduler, metrics, URL generation, and transactions. As the application grows, we need to consider extracting modules into microservices for better scalability and maintainability.

---

## Considered Options

### Option 1: Keep Monolithic Architecture
**Advantages**: Simple deployment, easy debugging, no network latency
**Disadvantages**: Limited scalability, single point of failure, technology lock-in

### Option 2: Extract Multiple Microservices
**Advantages**: Maximum scalability, technology flexibility, independent deployment
**Disadvantages**: High complexity, distributed system challenges, infrastructure overhead

### Option 3: Extract Only Notification Service
**Advantages**: Balanced approach, independent scaling for notifications, easier to add new channels
**Disadvantages**: Partial migration complexity, requires communication infrastructure

---

## Decision
**Extract Only Notification Service** (MailModule + SchedulerModule)

The service will handle email sending, scheduling, and support multiple notification channels.

---

## Communication Protocol

### HTTP REST API vs gRPC
**Chosen**: HTTP REST API

**Rationale**:
- Language-agnostic and easier to test/debug
- Better for asynchronous operations like email sending
- Simpler integration with existing systems
- gRPC is overkill for notification service use case

### Architecture
- **Primary**: HTTP REST API for synchronous operations
- **Secondary**: Message Broker (RabbitMQ/Redis) for asynchronous operations

---

## Implementation Plan

1. **Phase 1**: Create Notification Service with HTTP REST API
2. **Phase 2**: Integrate Message Broker for queuing
3. **Phase 3**: Migrate existing functionality

---

## Consequences

### Positive
- Independent scaling for notifications
- Reliable delivery with message broker
- Easy to add new channels
- Technology flexibility

### Negative
- Distributed system complexity
- Network latency overhead
- Additional infrastructure requirements

### Risks & Mitigation
- Service unavailability → Circuit breakers
- Message loss → Persistent queues
- Performance impact → Caching
- Debugging complexity → Distributed tracing