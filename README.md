# Projeto — Consulta Meteorológica

Aplicação web front-end para pesquisar cidades, consultar as condições meteorológicas atuais e visualizar a previsão dos próximos cinco dias. Os dados devem ser obtidos da API pública **Open-Meteo**, e o usuário deve poder manter uma lista persistente de cidades favoritas usando `localStorage`.

> Este README reúne todos os requisitos obrigatórios, regras de negócio, estados da interface, cenários de teste e desafios opcionais definidos no documento do projeto.

## Como executar

Pré-requisito: Node.js instalado.

```bash
npm install
npm run dev
```

Outros comandos disponíveis:

```bash
npm run build      # valida os tipos e gera a versão de produção
npm run typecheck  # verifica os tipos TypeScript
npm run preview    # abre localmente a versão gerada pelo build
```

O projeto utiliza React, TypeScript e Vite.

## Sumário

- [Objetivo](#objetivo)
- [Tecnologias e conceitos obrigatórios](#tecnologias-e-conceitos-obrigatórios)
- [API e fluxo das requisições](#api-e-fluxo-das-requisições)
- [Requisitos funcionais](#requisitos-funcionais)
- [Comunicação assíncrona](#comunicação-assíncrona)
- [Requisitos da interface](#requisitos-da-interface)
- [Validações e regras de negócio](#validações-e-regras-de-negócio)
- [Estrutura sugerida](#estrutura-sugerida)
- [Organização do JavaScript](#organização-do-javascript)
- [Dados e parâmetros sugeridos para a API](#dados-e-parâmetros-sugeridos-para-a-api)
- [Estados esperados da aplicação](#estados-esperados-da-aplicação)
- [Checklist de implementação](#checklist-de-implementação)
- [Cenários de teste](#cenários-de-teste)
- [Desafios opcionais](#desafios-opcionais)
- [Critérios de conclusão](#critérios-de-conclusão)

## Objetivo

Desenvolver uma aplicação front-end que integre:

- comunicação assíncrona com uma API pública;
- requisições HTTP com `fetch()`;
- Promises e `async/await` (ou `.then()` e `.catch()`);
- interpretação de respostas JSON;
- duas requisições dependentes entre si;
- criação e atualização dinâmica de elementos do DOM;
- validação dos dados fornecidos pelo usuário;
- tratamento dos estados de carregamento, sucesso e erro;
- arrays e funções para organizar a lógica;
- armazenamento e recuperação de dados com `localStorage`;
- feedback visual adequado durante operações assíncronas.

## Tecnologias e conceitos obrigatórios

- HTML5;
- CSS3;
- JavaScript;
- Fetch API;
- JSON;
- DOM;
- `localStorage`;
- API pública Open-Meteo.

Não é permitido substituir as consultas reais por dados fixos, previamente escritos no código ou simulados como solução definitiva.

## API e fluxo das requisições

Será utilizada a API pública **Open-Meteo**, que não exige chave para uso não comercial e oferece suporte a CORS.

Documentação oficial:

- [API de geocodificação](https://open-meteo.com/en/docs/geocoding-api)
- [API de previsão meteorológica](https://open-meteo.com/en/docs)

Os dados exibidos devem incluir a atribuição à Open-Meteo, de acordo com as condições de uso da API.

### Fluxo obrigatório

1. O usuário informa o nome de uma cidade.
2. A aplicação valida o texto informado.
3. A aplicação consulta a API de geocodificação.
4. A interface apresenta todas as localidades encontradas com informações suficientes para diferenciá-las.
5. O usuário seleciona a localidade desejada.
6. A aplicação usa a `latitude` e a `longitude` retornadas pela geocodificação.
7. Somente então a aplicação consulta a API meteorológica.
8. A interface apresenta as condições atuais e a previsão dos próximos cinco dias.

A consulta do clima depende da consulta de geocodificação. A aplicação nunca deve tentar deduzir as coordenadas pelo nome da cidade nem consultar a previsão antes de possuir coordenadas válidas.

## Requisitos funcionais

### RF01 — Pesquisa de cidades

- Criar um formulário para informar o nome de uma cidade.
- Ao enviar o formulário, consultar a API de geocodificação.
- Exibir os locais encontrados.
- Exibir em cada resultado, quando disponível:
  - nome da cidade;
  - estado/região;
  - país;
  - outras informações que ajudem a diferenciar localidades com nomes semelhantes.
- Se houver vários resultados, permitir que o usuário identifique e selecione a localidade correta.
- Não assumir que o primeiro resultado é necessariamente a cidade desejada.

### RF02 — Seleção da cidade

- Permitir que cada resultado da pesquisa seja selecionado.
- Utilizar exatamente as coordenadas retornadas pela API de geocodificação.
- Iniciar a consulta meteorológica somente depois da seleção.

### RF03 — Condições meteorológicas atuais

Após uma consulta bem-sucedida, apresentar um painel contendo, no mínimo:

- nome da cidade e país;
- temperatura atual;
- descrição legível da condição meteorológica;
- velocidade do vento;
- sensação térmica, quando disponível;
- umidade relativa do ar, quando disponível.

Também é obrigatório:

- identificar corretamente as unidades de cada grandeza;
- converter os códigos meteorológicos retornados pela API em descrições legíveis, como “Céu limpo”, “Parcialmente nublado” ou “Chuva”;
- basear o mapeamento de códigos na documentação oficial da Open-Meteo;
- não inventar dados quando algum campo não estiver disponível.

### RF04 — Previsão dos próximos dias

- Exibir a previsão para os próximos **cinco dias**, incluindo o dia atual quando ele estiver no período retornado.
- Para cada dia, mostrar:
  - data;
  - descrição legível da condição meteorológica;
  - temperatura mínima;
  - temperatura máxima;
  - probabilidade máxima de precipitação, quando disponível.
- Organizar a previsão em cartões ou em outro formato visual que facilite a comparação entre os dias.
- Usar somente os dados recebidos da API, sem criar valores fictícios para campos ausentes.

### RF05 — Atualização da consulta

- Permitir uma nova pesquisa a qualquer momento.
- Ao selecionar outra cidade, substituir as informações meteorológicas anteriores.
- Garantir que todo dado mostrado corresponda à cidade atualmente selecionada.
- Não exibir dados da consulta anterior como se fossem da nova cidade.
- Se a nova consulta falhar, informar o problema e evitar qualquer confusão com os dados anteriores.

### RF06 — Cidades favoritas

- Disponibilizar um botão ou controle para favoritar a cidade selecionada.
- Mostrar na lista de favoritos, no mínimo:
  - nome da cidade;
  - país;
  - opção para remover o favorito.
- Permitir selecionar um favorito para consultar novamente sua previsão.
- Usar os dados de localização armazenados no favorito para realizar a consulta.
- Impedir duplicatas da mesma localidade.
- Verificar duplicidade usando dados suficientes para distinguir cidades diferentes, como a identificação da localidade e suas coordenadas.

### RF07 — Persistência dos favoritos

- Armazenar os favoritos no `localStorage`.
- Recuperar e renderizar automaticamente os favoritos ao abrir ou atualizar a página.
- Atualizar o armazenamento sempre que um favorito for adicionado ou removido.
- Funcionar normalmente quando não houver favoritos.
- Tratar dados ausentes, inválidos ou corrompidos no `localStorage` sem interromper a aplicação.

Uma cidade favorita deve guardar dados suficientes para uma nova consulta sem repetir a geocodificação. Exemplo de estrutura:

```js
{
  id: 123456,
  name: "Porto Alegre",
  admin1: "Rio Grande do Sul",
  country: "Brasil",
  latitude: -30.03,
  longitude: -51.23,
  timezone: "America/Sao_Paulo"
}
```

Os nomes exatos das propriedades podem variar de acordo com a organização escolhida, mas a identificação e as coordenadas devem ser preservadas.

### RF08 — Feedback das operações

A interface deve informar, no mínimo, os seguintes estados:

- aguardando uma pesquisa;
- pesquisando/localizando cidades;
- carregando as condições meteorológicas;
- consulta concluída;
- nenhum resultado encontrado;
- erro ao localizar a cidade;
- erro ao consultar a previsão.

A mensagem ou indicação de carregamento deve sempre desaparecer ao final da operação, tanto em caso de sucesso quanto de erro.

## Comunicação assíncrona

### RA01 — Fetch API

- Realizar as consultas reais com `fetch()`.
- Não usar dados fixos ou respostas simuladas como implementação final.

### RA02 — Tratamento de Promises

- Tratar corretamente as operações assíncronas.
- Usar `async/await` ou Promises com `.then()` e `.catch()`.
- Aguardar cada requisição antes de acessar seu resultado.

### RA03 — Processamento de JSON

- Converter as respostas para JSON.
- Interpretar a estrutura retornada pela API.
- Acessar corretamente os campos necessários à geocodificação, às condições atuais e à previsão diária.

### RA04 — Erros HTTP e de comunicação

- Verificar `response.ok` antes de processar cada resposta.
- Tratar respostas HTTP malsucedidas, pois o `fetch()` não rejeita automaticamente a Promise em erros como 404 ou 500.
- Tratar também:
  - falha de conexão;
  - indisponibilidade do serviço;
  - resposta inválida ou inesperada;
  - ausência de resultados;
  - erro na conversão para JSON;
  - erro na interpretação dos dados.
- Usar uma finalização equivalente a `finally` para garantir que o estado de carregamento seja encerrado.

### RA05 — Dependência entre requisições

- Consultar o clima somente após identificar a cidade e obter suas coordenadas.
- Respeitar a ordem lógica: geocodificação → seleção → previsão.

### RA06 — Atualização do DOM

- Construir e atualizar os resultados dinamicamente com JavaScript.
- Criar, preencher, atualizar ou remover elementos de acordo com as respostas e ações do usuário.
- Não deixar previamente no HTML dados que deveriam ser recebidos da API.

## Requisitos da interface

A página deve conter, no mínimo:

1. cabeçalho com o nome da aplicação;
2. formulário de pesquisa de cidades;
3. área de resultados da pesquisa de localidades;
4. painel das condições meteorológicas atuais;
5. área da previsão para os próximos dias;
6. área de cidades favoritas;
7. área de mensagens de carregamento, sucesso e erro;
8. atribuição à fonte dos dados, com referência à Open-Meteo.

O CSS deve definir:

- cores;
- tipografia;
- espaçamentos;
- disposição dos elementos;
- hierarquia visual consistente.

A interface também deve apresentar mensagens apropriadas quando:

- ainda não houver cidade selecionada;
- não existirem favoritos;
- uma pesquisa não retornar resultados.

## Validações e regras de negócio

1. Não executar a pesquisa se o campo estiver vazio ou contiver apenas espaços.
2. Exibir uma orientação ao usuário quando a pesquisa for inválida.
3. Exigir a seleção de uma localidade antes da consulta meteorológica.
4. Garantir que os dados apresentados correspondam à cidade selecionada.
5. Informar claramente quando não houver resultados.
6. Não permitir cidades duplicadas nos favoritos.
7. Ao remover um favorito, atualizar imediatamente o DOM e o `localStorage`.
8. Manter os favoritos após a atualização da página.
9. Não gerar erros quando a lista de favoritos estiver vazia.
10. Não apresentar valores meteorológicos fictícios quando um dado estiver ausente.
11. Exibir uma indicação apropriada, como “Não disponível”, para campos opcionais ausentes.
12. Informar falhas de comunicação e retirar a interface do estado de carregamento.
13. Limpar, ocultar ou marcar como desatualizados os dados anteriores antes de iniciar/exibir uma nova consulta, evitando associá-los à cidade errada.

## Estrutura sugerida

```text
sistema/
├── index.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

É permitido utilizar outra estrutura, desde que o projeto continue claro, organizado e funcional.

## Organização do JavaScript

O código deve ser modular e separado em funções com responsabilidades compreensíveis. Deve contemplar funções ou módulos equivalentes para:

- pesquisar cidades;
- renderizar resultados de geocodificação;
- selecionar uma localidade;
- consultar as condições meteorológicas;
- renderizar as condições atuais;
- renderizar a previsão diária;
- converter códigos meteorológicos em descrições legíveis;
- carregar favoritos;
- salvar favoritos;
- adicionar favoritos;
- remover favoritos;
- renderizar favoritos;
- atualizar mensagens e estados da interface;
- validar e recuperar com segurança os dados do `localStorage`.

Não é obrigatório usar exatamente esses nomes nem criar uma função para cada item, mas toda a lógica não deve ficar concentrada em um único bloco.

## Dados e parâmetros sugeridos para a API

Os exemplos abaixo mostram os campos necessários para cumprir o enunciado. Confirme os nomes na documentação oficial durante a implementação.

### Geocodificação

Endpoint:

```text
https://geocoding-api.open-meteo.com/v1/search
```

Exemplo de consulta:

```text
https://geocoding-api.open-meteo.com/v1/search?name=Porto%20Alegre&count=10&language=pt&format=json
```

Campos relevantes dos resultados:

- `id`;
- `name`;
- `latitude`;
- `longitude`;
- `country`;
- `country_code`;
- `admin1` (estado/região, quando disponível);
- `admin2`, `admin3` ou `admin4` (detalhes adicionais, quando disponíveis);
- `timezone`.

O texto digitado deve ser enviado com codificação adequada, por exemplo, usando `URLSearchParams` ou `encodeURIComponent()`.

### Previsão meteorológica

Endpoint:

```text
https://api.open-meteo.com/v1/forecast
```

Parâmetros necessários ou sugeridos:

```text
latitude={latitude}
longitude={longitude}
current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m
daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max
timezone=auto
forecast_days=5
```

Exemplo de montagem:

```js
const params = new URLSearchParams({
  latitude: cidade.latitude,
  longitude: cidade.longitude,
  current: [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "weather_code",
    "wind_speed_10m"
  ].join(","),
  daily: [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_probability_max"
  ].join(","),
  timezone: "auto",
  forecast_days: "5"
});
```

As unidades devem ser obtidas da resposta (`current_units` e `daily_units`) ou exibidas de modo coerente com os parâmetros usados. As listas diárias são arrays relacionados por índice: data, código meteorológico, mínima, máxima e precipitação do mesmo índice pertencem ao mesmo dia.

### Códigos meteorológicos

Criar um mapeamento dos códigos WMO usados pela Open-Meteo para descrições em português. O mapeamento deve contemplar os códigos documentados pela API, incluindo:

- céu limpo;
- principalmente limpo, parcialmente nublado e nublado;
- neblina;
- garoa leve, moderada e intensa;
- chuva leve, moderada e forte;
- chuva congelante;
- neve e grãos de neve;
- pancadas de chuva ou neve;
- tempestades, inclusive com granizo.

Caso seja recebido um código desconhecido, exibir uma descrição neutra como “Condição desconhecida”, sem interromper a aplicação.

## Estados esperados da aplicação

| Situação | Comportamento esperado |
| --- | --- |
| Página iniciada | Orientar o usuário a pesquisar uma cidade e carregar os favoritos salvos. |
| Sem favoritos | Exibir uma mensagem de lista vazia sem gerar erro. |
| Pesquisa inválida | Não fazer requisição e orientar o preenchimento do campo. |
| Pesquisando cidade | Mostrar carregamento na área de mensagens. |
| Vários resultados | Listar todos de maneira distinguível e aguardar a seleção. |
| Nenhum resultado | Informar que nenhuma localidade foi encontrada. |
| Cidade selecionada | Limpar/atualizar os dados anteriores e iniciar a consulta meteorológica. |
| Consultando previsão | Mostrar carregamento e impedir que dados antigos pareçam pertencer à nova cidade. |
| Sucesso | Mostrar cidade, condições atuais, cinco dias de previsão e mensagem de conclusão. |
| Erro | Informar a etapa que falhou, encerrar o carregamento e permitir nova tentativa. |
| Campo opcional ausente | Mostrar “Não disponível” ou omitir de forma clara; nunca inventar um valor. |

## Checklist de implementação

### HTML

- [ ] Criar o cabeçalho com o nome da aplicação.
- [ ] Criar o formulário com campo de cidade e botão de pesquisa.
- [ ] Criar a área de mensagens/estado.
- [ ] Criar o contêiner dos resultados de geocodificação.
- [ ] Criar o painel de condições atuais.
- [ ] Criar o contêiner da previsão de cinco dias.
- [ ] Criar a seção de favoritos.
- [ ] Adicionar atribuição à Open-Meteo.
- [ ] Vincular corretamente o CSS e o JavaScript.

### CSS

- [ ] Definir cores, fontes, espaçamentos e hierarquia visual.
- [ ] Diferenciar visualmente resultados, painel atual, previsão e favoritos.
- [ ] Criar cartões ou organização equivalente para os dias.
- [ ] Criar estilos claros para carregamento, sucesso e erro.
- [ ] Manter botões e controles visualmente identificáveis.
- [ ] Garantir leitura e uso adequados da interface nos tamanhos de tela necessários ao projeto.

### Pesquisa e geocodificação

- [ ] Validar o campo com `trim()`.
- [ ] Impedir a requisição quando o campo estiver vazio.
- [ ] Fazer a consulta com `fetch()`.
- [ ] Verificar `response.ok`.
- [ ] Converter a resposta para JSON.
- [ ] Tratar uma resposta sem a propriedade/lista de resultados esperada.
- [ ] Renderizar todos os resultados relevantes.
- [ ] Exibir cidade, estado/região e país quando disponíveis.
- [ ] Permitir seleção explícita de uma localidade.

### Consulta meteorológica

- [ ] Usar latitude e longitude da localidade selecionada.
- [ ] Solicitar os campos atuais obrigatórios.
- [ ] Solicitar os campos diários obrigatórios.
- [ ] Solicitar cinco dias e usar o fuso horário apropriado.
- [ ] Verificar `response.ok` e validar a estrutura do JSON.
- [ ] Mostrar temperatura, condição, vento, sensação e umidade.
- [ ] Mostrar data, condição, mínima, máxima e precipitação em cada dia.
- [ ] Exibir unidades corretas.
- [ ] Mapear códigos meteorológicos para descrições legíveis.
- [ ] Tratar códigos desconhecidos e campos ausentes.

### Atualização e estados

- [ ] Permitir pesquisar outra cidade a qualquer momento.
- [ ] Não misturar dados de consultas diferentes.
- [ ] Remover o carregamento em sucesso ou erro.
- [ ] Mostrar mensagens distintas para erro de geocodificação e erro meteorológico.
- [ ] Informar quando não houver resultados.
- [ ] Permitir tentar novamente depois de uma falha.

### Favoritos

- [ ] Adicionar a cidade selecionada aos favoritos.
- [ ] Guardar identificação, nome, país e coordenadas suficientes.
- [ ] Impedir duplicatas.
- [ ] Renderizar nome e país.
- [ ] Permitir consultar um favorito usando seus dados armazenados.
- [ ] Permitir remover um favorito.
- [ ] Salvar alterações no `localStorage`.
- [ ] Recuperar favoritos ao carregar a página.
- [ ] Tratar armazenamento ausente ou inválido.
- [ ] Funcionar corretamente com a lista vazia.

## Cenários de teste

### Teste 1 — Pesquisa válida

Pesquisar uma cidade conhecida, como **Porto Alegre**.

**Resultado esperado:** os resultados de localização são exibidos e é possível selecionar a cidade desejada.

### Teste 2 — Localidades com nomes semelhantes

Pesquisar um nome que exista em mais de uma localidade.

**Resultado esperado:** a lista apresenta informações suficientes para distinguir e selecionar a localidade correta; a aplicação não escolhe automaticamente o primeiro item.

### Teste 3 — Pesquisa vazia

Enviar o formulário com o campo vazio ou contendo apenas espaços.

**Resultado esperado:** nenhuma requisição é realizada e uma orientação adequada é exibida.

### Teste 4 — Cidade não encontrada

Pesquisar um texto que não corresponda a nenhuma localidade.

**Resultado esperado:** a aplicação informa que não encontrou resultados e não exibe dados meteorológicos incorretos.

### Teste 5 — Consulta meteorológica

Selecionar uma cidade válida.

**Resultado esperado:** as condições atuais e a previsão dos próximos cinco dias aparecem com datas e unidades corretas.

### Teste 6 — Nova pesquisa

Consultar uma cidade e depois pesquisar e selecionar outra.

**Resultado esperado:** os dados antigos são substituídos; a identificação e os dados exibidos correspondem à cidade atual.

### Teste 7 — Carregamento

Observar a interface durante as consultas.

**Resultado esperado:** existe uma indicação visual de carregamento, que desaparece ao final da operação.

### Teste 8 — Falha de comunicação

Bloquear a rede ou as requisições pelas ferramentas de desenvolvimento do navegador.

**Resultado esperado:** uma mensagem de erro é apresentada, o carregamento termina e uma nova tentativa continua possível.

### Teste 9 — Adicionar favorito

Consultar uma cidade e adicioná-la aos favoritos.

**Resultado esperado:** a cidade aparece na lista e seus dados são gravados no `localStorage`.

Também tentar adicionar a mesma localidade novamente.

**Resultado esperado:** não é criada uma duplicata.

### Teste 10 — Persistência

Adicionar cidades aos favoritos e atualizar a página.

**Resultado esperado:** os favoritos continuam disponíveis e são renderizados automaticamente.

### Teste 11 — Remover favorito

Remover uma cidade salva.

**Resultado esperado:** ela desaparece da interface e do `localStorage`.

### Teste 12 — Reutilizar favorito

Selecionar uma cidade já salva.

**Resultado esperado:** a aplicação usa os dados de localização armazenados para fazer uma nova consulta meteorológica.

### Teste 13 — Dados ausentes

Testar o comportamento quando um campo opcional não estiver disponível na resposta.

**Resultado esperado:** a aplicação continua funcionando e indica adequadamente que a informação está indisponível, sem inventar valores.

### Verificações adicionais decorrentes dos requisitos

- Testar um erro HTTP, além de uma falha de rede, e confirmar a verificação de `response.ok`.
- Inserir manualmente um JSON inválido na chave de favoritos do `localStorage` e recarregar a página.
- Confirmar que a aplicação se recupera sem interromper a execução.
- Testar a aplicação sem nenhum favorito cadastrado.
- Confirmar que a previsão contém exatamente os cinco dias solicitados, quando disponibilizados pela API.
- Confirmar que a probabilidade de precipitação ausente não é substituída por um valor fictício.
- Confirmar que uma falha na nova consulta não associa os dados antigos à nova cidade.

## Desafios opcionais

Estes recursos só devem ser implementados depois de todos os requisitos obrigatórios. Eles não substituem nenhuma exigência anterior.

- pesquisa de cidades favoritas por nome;
- remoção de todos os favoritos mediante confirmação;
- previsão horária;
- indicadores adicionais, como precipitação e índice UV;
- alternância entre unidades de temperatura;
- comparação entre as condições meteorológicas de duas cidades;
- histórico das últimas cidades consultadas;
- atualização manual da previsão;
- prevenção de consultas duplicadas enquanto uma requisição equivalente estiver em andamento.

## Critérios de conclusão

O projeto estará concluído quando:

- todos os requisitos funcionais RF01 a RF08 estiverem implementados;
- todos os requisitos assíncronos RA01 a RA06 forem atendidos;
- todas as áreas mínimas da interface existirem e forem atualizadas dinamicamente;
- todas as validações e regras de negócio forem respeitadas;
- os treze cenários de teste apresentarem os resultados esperados;
- a aplicação usar dados reais da Open-Meteo;
- os favoritos persistirem corretamente no navegador;
- erros e dados ausentes forem tratados sem travar a aplicação;
- a fonte dos dados estiver devidamente atribuída à Open-Meteo.

## Fonte dos dados

Dados meteorológicos e de geocodificação fornecidos por [Open-Meteo](https://open-meteo.com/).
