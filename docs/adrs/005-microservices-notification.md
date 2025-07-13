# ADR-005: Microservices Architecture - Notification Service Extraction

---

**Status**: Accepted \
**Date**: 2025-07-08 \
**Author**: Pavlo Makarenko

---

## Context

The current weather application is a monolithic NestJS application with modules for subscriptions, weather, search,
mail, scheduler, metrics, URL generation, and transactions. As the application grows, we need to consider extracting
modules into microservices for better scalability and maintainability.

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

**Extract Only Notification Service** (NotificationsModule + SchedulerModule)

The service will handle email sending, scheduling, and support multiple notification channels.

---

## Communication Protocol

### HTTP REST API vs gRPC vs AMQP (RabbitMQ)

**Chosen**: AMQP (RabbitMQ)

**Advantages**:

- Asynchronous communication
- Decoupled services
- Supports multiple consumers
- Performance and scalability

**Disadvantages**:

- Requires additional infrastructure
- Complexity in setup and management
