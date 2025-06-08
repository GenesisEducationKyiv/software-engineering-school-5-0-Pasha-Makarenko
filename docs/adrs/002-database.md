# ADR-002: Choosing database

---

**Status**: Accepted \
**Date**: 2025-05-12 \
**Author**: Pavlo Makarenko

---

## Context
We need to select a database for our Weather API that meets the following requirements:
- Storing user subscriptions.
- Scalable and maintainable.
- Good performance for read and write operations.

---

## Considered Options
### PostgreSQL

**Advantages**:
- Performance queries with indexing.
- ACID transactions.
- Strong community support.

**Disadvantages**:
- More complex setup compared to NoSQL databases.

### MySQL

**Advantages**:
- Simple setup and widely used.
- Good performance for read-heavy workloads.

**Disadvantages**:
- Limited support for complex queries.
- Less robust transaction support.

### MongoDB

**Advantages**:
- Flexible schema design.

**Disadvantages**:
- Less efficient for complex queries.

---

## Decision

Decided to use **PostgreSQL**.

---

## Consequences

**Positive**:
- Powerful query capabilities.
- Scalable for large datasets.
- Ready for production.

**Negative**:
- More complex setup.