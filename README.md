# Consulta Meteorológica

Aplicação front-end para pesquisar cidades, consultar as condições meteorológicas atuais e visualizar a previsão dos próximos cinco dias.

O projeto utiliza as APIs públicas da [Open-Meteo](https://open-meteo.com/), não exige chave de acesso e mantém cidades favoritas no navegador.

## Funcionalidades

- Pesquisa automática de cidades com debounce de 500 ms.
- Cancelamento de requisições anteriores durante a digitação.
- Exibição de cidade, estado/região e país.
- Consulta meteorológica pelas coordenadas retornadas na geocodificação.
- Condições atuais:
  - temperatura;
  - sensação térmica;
  - umidade;
  - velocidade do vento;
  - descrição da condição meteorológica.
- Previsão para cinco dias:
  - código meteorológico convertido para português;
  - temperatura mínima e máxima;
  - probabilidade máxima de precipitação.
- Modal de detalhes com fechamento pelo botão, tecla `Esc` ou clique externo.
- Favoritos persistidos no `localStorage`.
- Temas claro e escuro com preferência persistida.
- Loading e notificações para sucesso, erro e ausência de resultados.
- Validação das respostas externas com Zod.
- Interface responsiva e controles acessíveis por teclado.

## Tecnologias

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Zod 4](https://zod.dev/)
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- APIs da [Open-Meteo](https://open-meteo.com/)

## Como executar

### Pré-requisitos

- Node.js recente.
- npm.

### Instalação

```bash
npm install
```

### Ambiente de desenvolvimento

```bash
npm run dev
```

O Vite informará no terminal o endereço local da aplicação.

Não é necessário criar `.env` ou configurar uma chave de API.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Valida o TypeScript e gera a aplicação de produção. |
| `npm run preview` | Executa localmente a versão de produção. |
| `npm run typecheck` | Verifica os tipos sem gerar arquivos. |
| `npm test` | Executa todos os testes uma vez. |
| `npm run test:watch` | Executa os testes em modo de observação. |

## Fluxo da aplicação

1. O usuário digita o nome de uma cidade.
2. Após 500 ms sem novas alterações, a aplicação consulta a geocodificação.
3. A API retorna até dez localidades.
4. O usuário seleciona a localidade correta.
5. A aplicação utiliza a latitude e a longitude recebidas.
6. O modal é aberto e a previsão meteorológica é consultada.
7. As condições atuais e os próximos cinco dias são exibidos.
8. A cidade pode ser adicionada ou removida dos favoritos.

## APIs

### Geocodificação

Endpoint:

```text
https://geocoding-api.open-meteo.com/v1/search
```

Parâmetros utilizados:

```text
name={cidade}
count=10
language=pt
format=json
```

A implementação está em [`src/global/city.ts`](src/global/city.ts).

### Previsão meteorológica

Endpoint:

```text
https://api.open-meteo.com/v1/forecast
```

Campos atuais solicitados:

```text
temperature_2m
relative_humidity_2m
apparent_temperature
weather_code
wind_speed_10m
```

Campos diários solicitados:

```text
weather_code
temperature_2m_max
temperature_2m_min
precipitation_probability_max
```

A consulta utiliza `timezone=auto` e `forecast_days=5`. A implementação e o mapeamento dos códigos WMO estão em [`src/global/weather.ts`](src/global/weather.ts).

## Validação dos dados

TypeScript verifica os tipos durante o desenvolvimento, mas não garante o formato dos dados recebidos em tempo de execução. Por isso, o projeto utiliza Zod para validar:

- resposta da API de cidades;
- resposta da API meteorológica;
- favoritos recuperados do `localStorage`.

Os schemas estão em [`src/global/schemas.ts`](src/global/schemas.ts). Os tipos das respostas são inferidos diretamente desses schemas, evitando regras duplicadas.

Limites aplicados:

- até 10 resultados de cidades;
- até 5 dias de previsão;
- até 100 favoritos armazenados;
- até 100 códigos postais por localidade.

Uma resposta inválida é tratada como erro e não é utilizada pela interface.

## Favoritos

Os favoritos são salvos na chave:

```text
favoriteCities
```

Cada favorito guarda:

```ts
{
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}
```

As coordenadas permitem consultar novamente o clima sem repetir a geocodificação. Entradas antigas ou inválidas sem coordenadas são descartadas durante a leitura.

## Temas

A aplicação oferece tema claro e escuro. A escolha é salva na chave `theme` do `localStorage`.

Quando ainda não existe uma preferência salva, a aplicação utiliza `prefers-color-scheme` para respeitar o tema do sistema operacional.

## Notificações

As notificações podem representar informação, sucesso ou erro. A duração depende da quantidade de palavras:

- até 10 palavras: 5 segundos;
- de 11 a 20 palavras: 10 segundos;
- de 21 a 30 palavras: 15 segundos;
- e assim sucessivamente.

Todas podem ser fechadas manualmente.

## Estrutura

```text
src/
├── App.tsx                 # Estrutura principal da página
├── FormCity.tsx            # Pesquisa, resultados, favoritos e notificações
├── CityResult.tsx          # Lista de localidades
├── City.tsx                # Cartão de cidade
├── CityModal.tsx           # Clima atual e previsão diária
├── Loading.tsx             # Indicador reutilizável de carregamento
├── Notification.tsx        # Notificações temporárias
├── ThemeToggle.tsx         # Alternância e persistência do tema
├── main.tsx                # Inicialização do React
├── tailwind.css            # Temas e estilos globais
└── global/
    ├── city.ts             # Cliente da API de geocodificação
    ├── weather.ts          # Cliente meteorológico e códigos WMO
    ├── schemas.ts          # Schemas Zod e tipos inferidos
    ├── types.ts            # Tipos das propriedades dos componentes
    └── function.ts         # Regras dos favoritos

tests/
├── App.test.tsx
├── City.test.tsx
├── CityModal.test.tsx
├── FormCity.test.tsx
├── Loading.test.tsx
├── Notification.test.tsx
├── ThemeToggle.test.tsx
├── UserScenarios.test.tsx
├── city.test.ts
├── function.test.ts
├── weather.test.ts
└── setup.ts
```

## Testes

A suíte possui testes de componentes, integração, regras de negócio, clientes HTTP, validação e acessibilidade básica.

Entre os cenários cobertos estão:

- debounce e cancelamento de requisições;
- carregamento, sucesso e erro das APIs;
- respostas HTTP e JSON inválidos;
- tradução de códigos meteorológicos;
- abertura e fechamento do modal;
- adição, remoção e persistência de favoritos;
- dados ausentes ou corrompidos no `localStorage`;
- alternância e persistência de tema;
- duração e variantes das notificações;
- entrada semelhante a código HTML ou JavaScript;
- fluxo completo de usuário experiente;
- orientação de usuário iniciante;
- tentativa de uso incorreto ou hostil.

Execute:

```bash
npm test
```

## Decisões técnicas

### Por que usar `AbortController`?

Ao alterar uma pesquisa ou fechar o modal, a requisição anterior é cancelada. Isso reduz trabalho desnecessário e impede que respostas antigas sobrescrevam dados mais recentes.

### Por que separar `city.ts` e `weather.ts`?

Os componentes cuidam da interface e dos estados. Os módulos de API cuidam da montagem das URLs, requisições HTTP e validação das respostas.

### Por que manter os favoritos no componente pai?

O estado centralizado mantém os cartões, a lista de favoritos e o `localStorage` sincronizados.

## Fonte dos dados

Dados de geocodificação e meteorologia fornecidos por [Open-Meteo](https://open-meteo.com/).
