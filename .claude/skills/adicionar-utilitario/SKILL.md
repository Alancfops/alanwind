---
name: adicionar-utilitario
description: Use ao adicionar, alterar ou remover uma classe utilitária, variante ou token do vocabulário do alanwind (ex.: pad-*, round-*, bg-<papel>, hover(...)). Passo a passo de ponta a ponta, da spec ao parser, IR, emissores, tipos, testes de ouro e documentação, para nada ficar pela metade.
---

# Adicionar (ou alterar) um utilitário

O vocabulário de classes é **API pública**. Uma classe só está pronta quando
funciona em todos os lugares de uma vez: spec, parser, IR, emissores, tipos,
testes e docs. Esta skill existe para nada ficar pela metade.

## 0. Antes de escrever código

- A classe está **na spec** (`docs/specs/sintaxe.md` e, se for cor/escala,
  `tema.md`) com saída definida? Se não, **pare**: ela precisa de decisão
  (`registrar-decisao`) e de spec (`escrever-spec`) antes.
- A classe **já existe** com outro nome? Sem dois jeitos de escrever a mesma
  coisa (D18).
- Respeita as regras de nome: inglês (D7), abreviar só `w`, `h`, `x`, `y` (D19),
  `propriedade-valor` com hífen, papéis de cor não terminam em número (D31)?
- Qual a **especificidade** dela na regra de conflito (D58)? Ex.: `pad-x` é mais
  específica que `pad`.
- Em quais plataformas ela vale (RN, web, ambas)?

## 1. Passo a passo

1. **Fonte única do vocabulário** (no `core`): adicione a classe **uma vez** no
   lugar onde o vocabulário é definido. Parser, tipos e docs leem dali; nunca
   copie a definição.
2. **Parser**: garanta que a classe é reconhecida, inclusive dentro de variantes
   (`hover(...)`, `medium(...)`), com valor livre (`=`) se fizer sentido, e com
   opacidade se for cor (D31).
3. **IR**: a classe produz a representação prevista em
   `docs/specs/funcionamento-interno.md`, com a especificidade correta.
4. **Emissor RN** (`native`): tradução para estilo (ou prop, se for o caso).
5. **Emissor CSS** (`css`), quando existir: tradução equivalente.
6. **Tipos**: o autocomplete passa a oferecer a classe; classe errada parecida
   gera sugestão (D20, D35).
7. **Testes de ouro** (skill `teste-de-ouro`): a classe sozinha, dentro de
   variante, em conflito com a genérica/específica, nos dois esquemas de cor se
   mudar com o tema, e o caso inválido próximo (`pad-17` fora da escala).
8. **Contraste** (skill `checar-contraste`): obrigatório se a classe é cor de
   fundo, texto ou borda de foco.
9. **Documentação**: referência de classes, com exemplo. Se a classe estava no
   rascunho da seção 11 da visão, mantenha a visão em sincronia.

## 2. Alterar ou remover

- Renomear ou remover é **breaking change**: commit com `!` e rodapé
  `BREAKING CHANGE` explicando a migração (skill `conventional-commits`).
- Remova **tudo** que existia só por causa da classe antiga: testes, tipos,
  docs, entradas no vocabulário (skill `codigo-limpo`, seção 4).

## 3. Pronto quando

- [ ] Está na spec, com D## de origem.
- [ ] Definida uma única vez no vocabulário.
- [ ] Parser, IR e emissor(es) cobertos.
- [ ] Testes de ouro passando, incluindo variante, conflito e caso inválido.
- [ ] Contraste conferido (se for cor).
- [ ] Autocomplete funcionando.
- [ ] Documentada.

Commit típico: `feat(core): adiciona classe <nome>` ou, se tocar vários pacotes
de uma vez, `feat: adiciona classe <nome>`.
