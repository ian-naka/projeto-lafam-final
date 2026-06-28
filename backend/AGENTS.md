# Estrutura do Backend

Este backend deve seguir sempre esta organizacao ao implementar novas funcionalidades.

## Regras de organizacao

- `src/controllers`: ficam controllers e regras de entrada/saida HTTP.
- `src/routes`: ficam definicoes de rotas.
- `src/models`: ficam models e estrutura de persistencia.
- `src/services`: ficam servicos, integracoes externas e logicas de infraestrutura.
- `src/helpers`: ficam funcoes de apoio, validacoes simples e utilitarios pequenos.
- `src/scripts`: ficam scripts operacionais, bootstrap e rotinas manuais.
- `src/db`: fica configuracao de banco e conexao.
- `src/__tests__`: ficam os testes automatizados.

## Diretriz de implementacao

Ao criar codigo novo, a IA deve:

- colocar regras HTTP em `controllers`
- colocar declaracao de endpoints em `routes`
- colocar estrutura de banco em `models`
- colocar integracoes e servicos em `services`
- colocar funcoes auxiliares em `helpers`
- colocar scripts executaveis em `scripts`
- colocar testes em `__tests__`
- evitar colocar regra de acesso externo diretamente em controller quando isso puder ficar em `services`
- evitar misturar responsabilidades entre rotas, controllers, models e services

## Regra pratica

Se a implementacao envolver:

- entrada de requisicao e resposta HTTP: vai para `controllers`
- mapeamento de endpoint: vai para `routes`
- tabela, entidade ou persistencia: vai para `models`
- Google, API externa, cache, autenticacao tecnica ou logica de infraestrutura: vai para `services`
- funcao utilitaria e apoio: vai para `helpers`
- script de inicializacao ou manutencao: vai para `scripts`
- teste automatizado: vai para `__tests__`

Esta estrutura deve ser mantida como padrao em futuras implementacoes.
