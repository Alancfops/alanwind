# 042. Native: emissor de cor e tipografia

- **Status**: pronta (depois da 010 e da 040)
- **Fase**: 1
- **Branch**: feature/native-emissor-cor-texto
- **Depende de**: 010, 040 (só o tipo `ResolutionContext`, para esquema e
  plataforma)
- **Paralelo com**: 041, 044, 020
- **Spec**: `docs/specs/emissor-native.md` R16 (linhas `ThemedColor`, `Ratio`,
  `fontWeight` e `fontFamily`), R17, R19 a R22, seções 5.1 (cor e texto), 5.3,
  5.4 (cor com alfa, `fontWeight`, `lineHeight`) e 6;
  `docs/specs/funcionamento-interno.md` R30, R31, R33, R48;
  `docs/specs/tema.md` R15, seções 5.10 e 7.2 (fontes)
- **Decisões**: D20, D23, D31, D49, D98, D104, D115, D120, D133, D154, D156,
  D157

## Objetivo
Traduzir cor (com esquema e alfa) e tipografia da IR para o estilo do RN,
respeitando a escala de fonte do sistema.

## Escopo
- Faz:
  - `backgroundColor`, `color`, `borderColor`: escolher `light` ou `dark` do
    `ThemedColor` pelo esquema do contexto. Com `alpha` igual a 1, sai o
    `rgb` como está (`'#2563EB'`); com `alpha` menor que 1, sai
    `'rgba(r, g, b, a)'`, com `r`, `g`, `b` em decimal e `a` igual ao
    `alpha`, separados por vírgula e espaço: `'rgba(37, 99, 235, 0.5)'`
    (R17, D154). A conversão de cor fica exportada dentro do pacote para a
    `043` usar na cor da sombra (R18, D155).
  - `fontSize`, `textAlign`, `fontStyle`, `textDecorationLine` e
    `textTransform` com o mesmo valor da IR (R19).
  - `fontWeight` 400, 500 e 700 saem como as strings `'400'`, `'500'` e
    `'700'` (R16, D154).
  - `lineHeight`: a IR traz um `Ratio`; o valor é `tamanho final da fonte ×
    value`, arredondado a duas casas decimais (R20, D157). Esta tarefa
    entrega a tradução que **recebe o tamanho final da fonte** como entrada;
    quem decide esse tamanho é quem chama: a `045` (tamanho do próprio
    `look`) e a `052` (tamanho depois da herança e do padrão do `Text`,
    componentes R20).
  - `fontFamily` genérica → texto exato da fonte do sistema por plataforma
    (R21, D156):

    | Genérica | iOS | Android | Web |
    |---|---|---|---|
    | `sans` | `'System'` | `'Roboto'` | `'system-ui, sans-serif'` |
    | `serif` | `'Georgia'` | `'serif'` | `'Georgia, serif'` |
    | `mono` | `'Menlo'` | `'monospace'` | `'ui-monospace, monospace'` |

  - Escala de fonte do sistema: o emissor NÃO gera `allowFontScaling` nem
    `maxFontSizeMultiplier` (R22, D115).
- Não faz: herança de texto (`050`); o padrão do `Text` (`052`);
  `numberOfLines` (props, `044` e `045`); escolher o esquema (`040`); cor da
  sombra (`043`, usando a conversão daqui).

## Arquivos permitidos
- Implementador: `packages/native/src/emit/color.ts`,
  `packages/native/src/emit/typography.ts`, `packages/native/src/emit/index.ts`.
- QA: `packages/native/test/emit-color.test.ts`,
  `packages/native/test/emit-typography.test.ts` (Vitest; entrada: IR escrita
  à mão).

## Critérios de aceite
- [ ] Cada linha de cor e texto das seções 5.1, 5.3 e 5.4 sai exata
      (`toStrictEqual`), no esquema e na plataforma da linha.
- [ ] Cor com `alpha` 1 sai `'#RRGGBB'` como veio da IR; com `alpha` < 1,
      `'rgba(r, g, b, a)'` (R17).
- [ ] `fontWeight` sai sempre como string (R16, D154).
- [ ] `lineHeight` = tamanho recebido × razão, a duas casas:
      `type-2xl leading=1.4` → `33.6` (R20, D157).
- [ ] O estilo nunca contém `allowFontScaling` nem `maxFontSizeMultiplier`
      (R22).
- [ ] O emissor não importa o tema; só tipos de `@alanwind/core` e o tipo da
      `040` (`funcionamento-interno.md` R5).

## Casos que o QA deve cobrir
- Seção 5.1: `bg-surface` (claro `#FFFFFF`, escuro `#1E1E22`), `bg-primary`
  (claro `#2563EB`, escuro `#8AB4FF`), `text-on-warning` (`#3B2A00` nos
  dois), `border-danger` (claro `#D02424`, escuro `#FF8A80`),
  `type-lg leading-normal` (`fontSize` 18, `lineHeight` 27),
  `type-sm leading-tight` (14, 17.5), `italic underline upper`,
  `align-center` (R17, R19, R20).
- Seção 5.3: as nove linhas de `font-sans`, `font-serif` e `font-mono` em
  `ios`, `android` e `web` (R21).
- Seção 5.4: `bg-primary-50` claro → `'rgba(37, 99, 235, 0.5)'`;
  `bg=#e11d48/50` → `'rgba(225, 29, 72, 0.5)'`; `weight-bold` → `'700'`;
  `type-2xl leading=1.4` → `lineHeight` 33.6 (D154, D157).
- `lineHeight` com tamanho recebido 16 e `leading-normal` → 24
  (componentes R20).
