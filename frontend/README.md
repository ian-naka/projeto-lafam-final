# Frontend Lafam

Frontend React + Vite do MVP do Lafam.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Google Drive Picker

## Fluxos implementados

- login administrativo
- listagem publica de postagens
- detalhe publico de postagem
- listagem por categoria
- criacao de postagem
- edicao de postagem
- exclusao de postagem
- selecao de thumb e galeria pelo Google Drive Picker
- mapa por `latitude` e `longitude`, com `coordenadas` derivadas

## Ambiente

Copie `./.env.example` para `./.env` e preencha:

- `VITE_API_URL`
- `VITE_GOOGLE_API_KEY`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_GOOGLE_APP_ID`

## Execucao com bun

```bash
bun install
bun run dev
```

## Build

```bash
bun run build
```
