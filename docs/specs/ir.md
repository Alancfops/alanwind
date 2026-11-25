# Spec: representação intermediária (IR)

Status: **rascunho, só o já decidido** · Decisões de origem: D15, D58, D60, D65

Formato neutro que o parser produz e os emissores consomem. Contrato central entre os pacotes.

## 1. Já definido

- A **fase 1** inclui parser + **IR** + emissor React Native (D60). O emissor CSS vem depois e consome a mesma IR.
- A resolução é uma **função pura e determinística**: mesma entrada, mesma saída (D15). Isso permite rodar o mesmo código em build mais tarde, sem mudar a API.
- A IR precisa carregar informação suficiente para aplicar a **regra de conflito** (D58): especificidade da classe e ordem em que foi escrita.
- A IR precisa funcionar tanto para o emissor RN (objetos de estilo em runtime) quanto para o emissor CSS (classe gerada a partir do `look`, D65).

## 2. Ainda não definido

- O formato da IR em si (tipos, campos, como representar variantes e condições).
- Se a IR representa saídas que não são estilo (ex.: `lines-2` → `numberOfLines`, `tap-target`), ou se isso fica no emissor.
- Onde a regra de conflito é aplicada: no parser, na IR ou em cada emissor.
- Como erros e avisos são representados e transportados.
- A arquitetura "um core, dois emissores" e "por presets" ainda constam como propostas na seção 4 da visão.
