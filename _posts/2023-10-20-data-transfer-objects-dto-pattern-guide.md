---
title: "DTOs (Data Transfer Objects)"
date: 2023-10-20
categories:
  - Software Design
  - Programming
tags:
  - DTO
  - Data Transfer Objects
  - Design Patterns
  - Software Architecture
  - Clean Code
toc: true
toc_sticky: false
---

# DTOs (Data Transfer Objects)
**What:** Objects that carry data between layers (API ↔ service ↔ DB). Data only, no behavior (or minimal validation).

**Why:** Decouple internal models from API/contracts. Different DTOs per operation (create vs update vs response). Control what goes in/out; validate at the boundary.

- **Input DTOs:** e.g. `CreateUserDTO`, `UpdateUserDTO` — what the API accepts.
- **Output DTOs:** e.g. `UserResponseDTO` — what we return (no secrets, stable shape).
- **Dataclasses / Pydantic:** good fit. Optional: immutable `@dataclass(frozen=True)`.

**Validation:** At the boundary (controller/API). Pydantic or Marshmallow for schema + validation.

**Mapping:** Model → DTO and DTO → model in a mapper layer or small functions. Keeps controllers thin and services model-agnostic.

**Don’t:** Put business logic in DTOs. Expose internal IDs or sensitive fields in response DTOs.

**Pagination:** e.g. `{ items, total, page, page_size }` as a DTO so the API contract is stable.
