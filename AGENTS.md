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

## Estrutura do Frontend

Este frontend deve seguir sempre esta organizacao ao implementar novas funcionalidades.

## Regras de organizacao

- `src/paginas`: ficam apenas as paginas e telas da aplicacao.
- `src/paginas/logado`: ficam apenas as paginas acessadas depois do login.
- `src/componentes`: ficam apenas componentes reaproveitaveis.
- `src/servicos`: ficam apenas servicos, integracoes e acesso a API.
- `src/hooks`: fica a pasta obrigatoria de hooks customizados de React.
- `src/hooks/responsividade`: ficam os hooks padrao de responsividade da aplicacao e devem ser reutilizados nas telas.
- `src/ajudantes`: ficam funcoes de apoio, transformacoes e utilitarios pequenos.
- `src/contextos`: ficam providers e contextos globais.
- `src/tipos`: ficam tipos e contratos TypeScript.

## Diretriz de implementacao

Ao criar codigo novo, a IA deve:

- colocar paginas em `paginas`
- colocar componentes reutilizaveis em `componentes`
- colocar chamadas de API e integracoes em `servicos`
- criar hooks em `src/hooks` quando houver logica reutilizavel de estado, efeito ou comportamento
- usar os hooks de `src/hooks/responsividade` na construcao de telas responsivas, evitando recriar media query direto na pagina ou componente
- colocar funcoes auxiliares em `ajudantes`
- evitar misturar regra de negocio de servico dentro de componente de interface
- evitar criar arquivo fora dessa estrutura sem necessidade clara

## Regra pratica

Se a implementacao envolver:

- tela: vai para `paginas`
- bloco visual reutilizavel: vai para `componentes`
- acesso ao backend ou Google: vai para `servicos`
- logica reutilizavel com React: vai para `src/hooks`
- responsividade de tela: deve reutilizar `src/hooks/responsividade`
- funcao utilitaria ou transformacao de dados: vai para `ajudantes`

Esta estrutura deve ser mantida como padrao em futuras implementacoes.
