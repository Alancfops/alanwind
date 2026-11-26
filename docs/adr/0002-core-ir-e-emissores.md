# 0002. Core puro, IR e emissores

- **Status**: aceito
- **Data**: 2026-11-25
- **Decisões de origem**: D15, D60, D74, D82, D83, D84, D85, D90

## Contexto

O alanwind precisa gerar estilo para duas plataformas (CSS na web e objetos de
estilo no React Native) a partir da mesma sintaxe de classes. No React Native,
as classes são resolvidas em runtime, com cache (D15); por isso a função de
resolução precisa ser pura e determinística (mesma entrada, mesma saída), o que
também permite rodar o mesmo código em build mais tarde, como otimização, sem
mudar a API (seção 3.2 do documento de visão).

A seção 4 do documento de visão traz, como propostas ainda não confirmadas, a
arquitetura "um core, dois emissores" (o core lê a classe e gera uma IR neutra;
um emissor gera CSS e outro gera objetos de estilo do React Native) e a
arquitetura por presets (core enxuto e um `preset-default` com o vocabulário).
Este ADR cita ambas como contexto: o que está decidido é só o que D60, D74 e D82
a D85 fixam. Presets foram adiados (D90).

A fase 1 começa pelo React Native: parser, IR, emissor RN, componentes `Box`,
`Text` e `Pressable` e tema padrão; o emissor de CSS vem logo depois (D60).

## Decisão

- **Fluxo**: parser, depois representação intermediária (IR), depois emissores
  (D60). A IR é o contrato entre as camadas (D74).
- **`core` é o domínio puro**, sem API de plataforma. Emissores são adaptadores.
  Componentes, plugin, CDN e CLI são a borda (D74). No React Native, a resolução
  em runtime usa uma função pura com cache (D15).
- **Regra de dependência**: as dependências apontam sempre para o `core` (D74).
  Em concreto, conforme a seção 14: `core` não depende de nenhum outro pacote;
  `native` e `css` dependem só de `core`; `vite-plugin` e `cdn` dependem de
  `css`; `alanwind` só reexporta. A D74 confirma a proposta da seção 14.
- **Conflito resolvido no `core`, uma vez só** (D82). O `core` aplica a regra de
  conflito da D58 e entrega aos emissores uma IR já sem conflitos. Os emissores
  não reimplementam a regra, então ficam iguais por construção.
- **A IR separa estilo de props** (D83). Classes que viram prop do componente, e
  não estilo (ex.: `lines-2` vira `numberOfLines`), vão numa parte própria da
  IR. O `core` é a fonte única do que cada classe faz; o emissor só traduz.
- **Diagnósticos devolvidos pelo `core`; a borda decide** (D84). A resolução
  sempre devolve o resultado mais uma lista de diagnósticos (código `AW###`,
  posição, sugestão). O `core` não sabe se está em desenvolvimento ou produção:
  quem está na borda (`native`, plugin, CDN) mostra os avisos em dev e os ignora
  em produção (D35). Isso preserva a pureza do `core` (D15).
- **`center-x`/`center-y` traduzidos no `core` com a direção final** (D85). O
  `core` conhece a direção (`row`/`col`, inclusive sob condições como
  `medium(row)`) e converte `center-x`/`center-y` nas propriedades flex certas
  para cada condição. Os emissores recebem propriedades flex comuns.

## Alternativas consideradas

Observação: o documento de visão registra as decisões D82 a D85, mas não lista
as alternativas descartadas nem o motivo de cada escolha. As alternativas abaixo
vêm do pedido de redação deste ADR e do que a rodada 2 da conversa citou; **os
motivos de descarte não estão registrados** e, por isso, só aparecem aqui os que
as próprias decisões dão.

- **Presets (estilo UnoCSS)**: core enxuto e um `preset-default` com o
  vocabulário. **Adiada (D90)**: na fase 1 o vocabulário fica direto no `core`,
  como fonte única; só vira preset se um dia houver um segundo vocabulário, para
  não criar abstração para o futuro (D74).
- **Conflito resolvido em cada emissor**: descartada pela D82. Motivo
  registrado: com a regra no `core`, os emissores ficam iguais por construção,
  sem reimplementar a regra.
- **Emissor decidindo o que vira prop**: descartada pela D83. Motivo registrado:
  o `core` deve ser a fonte única do que cada classe faz; o emissor só traduz.
- **Modo dev passado como parâmetro, ou lido de variável global**: descartadas
  pela D84. Motivo registrado: o `core` não deve saber se está em
  desenvolvimento ou produção, para preservar a pureza (D15).
- **IR guardando a intenção de centralização** (o emissor converteria
  `center-x`/`center-y`): descartada pela D85. Motivo registrado: evitar lógica
  de eixo duplicada nos emissores.
- **Ordem "core + IR + emissor CSS primeiro"** (seção 4): substituída pela D60,
  que começa pelo React Native. A D60 cita a validação com uso real numa tela do
  app do Alan; o motivo de RN antes de CSS não está registrado de forma
  explícita.

## Consequências

- Positivas:
  - Emissores simples e iguais por construção quanto a conflitos e centralização
    (D82, D85).
  - `core` testável sem plataforma, com testes de ouro sobre a IR e a lista de
    diagnósticos.
  - Mesmo código pode rodar em runtime hoje e em build depois (D15).
  - Um novo emissor só precisa traduzir a IR.
- Negativas / custos:
  - O `core` concentra mais lógica (conflito, direção, o que é prop) e precisa
    conhecer o vocabulário completo.
  - A IR precisa ser expressiva o bastante para condições (variantes,
    breakpoints) e ter parte de props (D83).
  - Toda borda (`native`, plugin, CDN) precisa implementar a filtragem de
    diagnósticos (D84).
- O que isso obriga a fazer depois:
  - Spec da IR (tipos TypeScript, estilo, props, diagnósticos) e spec de
    diagnósticos `AW###`.
  - Testes de ouro do `core` cobrindo conflito (D58), `lines-2` em props e
    `center-x` sob `medium(row)`.
  - Enforçar a regra de dependência no CI (Knip e revisão, D74).
  - Se presets forem adotados no futuro, registrar a decisão e escrever um ADR
    novo.
