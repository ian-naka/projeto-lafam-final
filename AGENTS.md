# AGENTS

## Frontend UI base

Ao criar ou ajustar telas no frontend do Lafam, use estes arquivos como padrao visual principal:

- `frontend/src/componentes/container/Container.tsx`
- `frontend/src/componentes/input/Input.tsx`
- `frontend/src/componentes/botao/Button.tsx`

## Convencoes

- Use `Container` para superficies principais e cards de destaque.
- Use `Input` para campos de formulario em vez de `input` cru.
- Use `Button` para CTAs e acoes principais em vez de `button` cru.
- Para textos de auth e formularios, reutilize as classes tipograficas em `frontend/src/index.css`:
  - `.lafam-text-display`
  - `.lafam-text-subtitle`
  - `.lafam-text-label`
  - `.lafam-text-helper`
  - `.lafam-text-link`
- Preserve a hierarquia de bordas/radius adotada no login:
  - `Input`: `8px`
  - `Button`: `12px`
  - `Container` de destaque: `24px`

## Contratos backend/frontend

- Use `back-front` como fonte dos contratos compartilhados entre backend e frontend.
- Mantenha DTOs, schemas, enums, payloads e tipos de resposta de API em `back-front/src`.
- Evite duplicar contratos em controllers do backend ou em `frontend/src/tipos`; esses arquivos devem importar/reexportar de `@lafam/back-front` quando forem necessários.
