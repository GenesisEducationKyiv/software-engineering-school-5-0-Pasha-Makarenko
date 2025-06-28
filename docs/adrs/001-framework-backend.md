# ADR-001: Choosing framework for weather api

---

**Status**: Accepted \
**Date**: 2025-05-12 \
**Author**: Pavlo Makarenko

---

## Context
We need to develop a Weather API with the following requirements:
- Store subscriptions for users to receive weather updates.
- Provides cron job functionality to send weather updates by email.
- Must be maintainable, scalable, and well-structured.

---

## Considered Options
### Express

**Advantages**:
- Well-known and widely used.
- Large ecosystem of middleware and plugins.

**Disadvantages**:
- Can become unstructured with large codebases. 
- Less built-in support for advanced features.

### Fastify

**Advantages**:
- High performance and low overhead.
- Good support for async/await.

**Disadvantages**:
- Smaller ecosystem compared to Express.
- Less mature in terms of community support.

### NestJS

**Advantages**:
- Modular architecture promotes maintainability.
- Cron job functionality can be easily integrated.
- Good for large applications with complex requirements.

**Disadvantages**:
- Steeper learning curve for developers not familiar with Angular-like architecture.
- More boilerplate code compared to Express or Fastify.

---

## Decision
Decided to use **NestJS**

---

## Consequences

**Positive**:
- Modular architecture (Modules, DI, Controllers, Services) allows for better organization of code.
- Built-in support for cron jobs simplifies scheduling tasks.

**Negative**:
- Higher barrier to entry for new developers.
- Slower than Express or Fastify.