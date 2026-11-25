# Spec: tema

Status: **rascunho, só o já decidido** · Decisões de origem: D6, D20, D22, D24, D25, D31 a D35, D43 a D52, D63, D64

Paleta por tons, papéis, `-soft`/`-hover`/`on-`, tema padrão, atalhos e troca de esquema de cor.

## 1. Já definido

### 1.1 Modelo de cores em duas camadas (D33, D34)
1. **Paleta base**: tons de **0 a 100** (0 = preto, 100 = branco). A pessoa define só alguns tons-âncora; os intermediários são calculados.
2. **Papéis**: apontam para um tom da paleta, com um valor para o claro e outro para o escuro.
- A paleta **não aparece nas classes**; só alimenta os papéis e os valores livres com `=` (D34).

### 1.2 Papéis e variações (D20, D22, D24)
- Todo papel tem valores para **claro e escuro** (D20).
- Todo papel colorido ganha sozinho:
  - **`-hover`**: estado de elemento interativo, mesma ênfase, um pouco **mais claro no escuro** e **mais escuro no claro** (D22, D24).
  - **`-soft`**: fundo estático de baixa ênfase (avisos, selos, etiquetas, item selecionado). Não precisa ser botão (D24).
  - **par `on-`**: cor de texto com contraste garantido sobre o papel (`text-on-primary`) (D18).
- Nomes de papéis criados pela pessoa **não podem terminar em número** (D31).

### 1.3 Configuração (D35)
- O **tema padrão é completo**: sem configurar nada, já existem `primary`, `secondary`, `success`, `warning`, `danger`, `info`, fundos, textos e bordas, com claro, escuro, `-soft`, `-hover` e `on-`.
- Configurar um papel **substitui só aquele papel**; os demais continuam do padrão.
- `-soft`, `-hover` e `on-` do papel configurado são **recalculados** a partir da cor nova.
- Papel inexistente: aviso/erro em dev com sugestão, ignorado em produção.
- **Atalhos** (`define`) ficam no arquivo de tema (D63).

### 1.4 Esquema de cor (D25, D64)
- O tema padrão **segue o sistema** (claro/escuro), com o **tema escuro muito bem cuidado** (D25).
- Dá para forçar o esquema **sem Provider**: `setColorScheme('light' | 'dark' | 'system')` (D64).

### 1.5 Tema padrão: escalas
- **Espaçamento** (D43): `0` a `16`, passos de 4 px (`pad-1` = 4, `pad-4` = 16, `pad-16` = 64). Vale para `pad`, `margin`, `gap`.
- **Raios** (D44): `round-none` 0, `round-sm` 4, `round-md` 8, `round-lg` 12, `round-xl` 16, `round-full` (pílula/círculo).
- **Tipografia** (D49): `type-xs` 12, `type-sm` 14, `type-base` 16, `type-lg` 18, `type-xl` 20, `type-2xl` 24, `type-3xl` 30. Fonte padrão: **a do sistema**, trocável no tema.
- **Sombras** (D45): `shadow-sm`, `shadow-md`, `shadow-lg`. No claro: sombra real. No escuro: fundo mais claro (`bg-raised`) + borda fina + sombra bem discreta.

### 1.6 Tema padrão: cores (valores ilustrativos; os finais saem desta spec)
- **`primary`** (D46): azul elétrico. Claro `#2563EB` / texto branco; escuro `#8AB4FF` / texto `#0A1F4D`. `-soft` claro `#E1EAFD` (texto `#1E3FA8`), escuro `#14306B` (texto `#B3CCFF`).
- **`secondary`** (D52): neutro. Claro `#E9E9EE` / texto `#25252B`; escuro `#34343A` / texto `#F2F2F4`.
- **Semáforo** (D47): `success` verde, `warning` amarelo, `danger` vermelho. No `warning`, o texto sobre a cor forte é **escuro** (branco não passa 4,5:1).
- **`info`** (D48): azul.
- **Fundos escuros** (D50), cinza-grafite: página `#141416`, `bg-surface` `#1E1E22`, `bg-raised` `#28282D`, borda `#34343A`; textos `#F2F2F4` (forte), `#C9C9CF` (corpo), `#8E8E96` (apoio).
- **Fundos claros** (D51): página `#F6F6F8`, card `#FFFFFF`, borda `#E3E3E8`; textos `#141416` (forte), `#3B3B42` (corpo), `#6B6B74` (apoio). Elevação pela sombra.

### 1.7 Contraste (D32, seção 5 da visão)
- Pares texto/fundo do tema padrão passam em **WCAG AA (4,5:1)**, nos dois esquemas, incluindo `-soft` e `-hover`.
- Aviso de contraste em dev para fundo + texto declarados no mesmo `look`, inclusive cores livres (D32).

## 2. Ainda não definido

- Formato exato do arquivo `alanwind.config.ts` (`defineTheme`, seções, atalhos).
- Algoritmo de interpolação dos tons da paleta e regras exatas de `-soft`/`-hover`/`on-`.
- Valores finais de todas as cores, de `border-strong`, `border-focus`, `text-link` e das sombras.
- Escala de pesos, alturas de linha e opacidades.
- Uso do formato W3C Design Tokens (proposta).
