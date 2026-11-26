#!/usr/bin/env node
// Checks the repository Markdown rules (CLAUDE.md, "Formato dos documentos"):
// 1. prose lines fit in 80 columns, unless the line holds a single unit that
//    cannot be broken (a code span, a link or a word);
// 2. relative Markdown links and `docs/specs/*.md` / `docs/adr/*.md`
//    references point to files that exist;
// 3. every D## reference points to a decision registered in
//    docs/00-visao-e-decisoes.md.
// Zero dependencies: runs with plain Node.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

const MAX_COLUMNS = 80;
const DECISIONS_FILE = 'docs/00-visao-e-decisoes.md';

const files = execFileSync('git', ['ls-files', '*.md'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

const problems = [];
const report = (file, line, message) => problems.push(`${file}:${line}: ${message}`);

const lastDecision = findLastDecision();

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  let inFence = false;
  let inFrontMatter = lines[0] === '---';

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (inFrontMatter) {
      if (index > 0 && line === '---') inFrontMatter = false;
      return;
    }
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;

    checkLength(file, lineNumber, line);
    checkLinks(file, lineNumber, line);
    checkDecisions(file, lineNumber, line);
  });
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s) found in the documentation.`);
  process.exit(1);
}
console.log(`Documentation OK (${files.length} files, decisions up to D${lastDecision}).`);

function findLastDecision() {
  const content = readFileSync(DECISIONS_FILE, 'utf8');
  const numbers = [...content.matchAll(/^\| D(\d+) \|/gm)].map((match) => Number(match[1]));
  if (numbers.length === 0) throw new Error(`No decision table found in ${DECISIONS_FILE}`);
  return Math.max(...numbers);
}

function checkLength(file, lineNumber, line) {
  const width = [...line].length;
  if (width <= MAX_COLUMNS) return;
  const trimmed = line.trim();
  if (trimmed.startsWith('|') || trimmed.startsWith('#') || trimmed.startsWith('<')) return;
  if (isSingleUnit(trimmed)) return;
  report(file, lineNumber, `line has ${width} columns (max ${MAX_COLUMNS})`);
}

// A line that is only a list marker plus one unbreakable unit cannot be wrapped.
function isSingleUnit(text) {
  const withoutMarker = text.replace(/^(>\s*)*([-*+]|\d+\.)(\s+\[[ xX]\])?\s+/, '');
  return splitUnits(withoutMarker).length <= 1;
}

// Splits on spaces that are outside code spans and outside link text/targets.
function splitUnits(text) {
  const units = [];
  let current = '';
  let inCode = false;
  let bracketDepth = 0;
  let parenDepth = 0;
  for (const char of text) {
    if (char === '`') inCode = !inCode;
    if (!inCode) {
      if (char === '[') bracketDepth++;
      if (char === ']') bracketDepth = Math.max(0, bracketDepth - 1);
      if (char === '(' && current.endsWith(']')) parenDepth++;
      else if (char === ')' && parenDepth > 0) parenDepth--;
    }
    if (char === ' ' && !inCode && bracketDepth === 0 && parenDepth === 0) {
      if (current) units.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current) units.push(current);
  return units;
}

function checkLinks(file, lineNumber, line) {
  const withoutCode = line.replace(/`[^`]*`/g, '');
  for (const match of withoutCode.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = match[1];
    if (/^([a-z]+:|#)/i.test(target)) continue;
    const path = normalize(join(dirname(file), decodeURI(target.split('#')[0])));
    if (!existsSync(path)) report(file, lineNumber, `broken link: ${target}`);
  }
  for (const match of line.matchAll(/`((?:docs\/)?(?:specs|adr)\/[\w.-]+\.md)`/g)) {
    if (/NNNN|XXX/.test(match[1])) continue; // template placeholder
    const reference = match[1].startsWith('docs/') ? match[1] : `docs/${match[1]}`;
    if (!existsSync(reference)) report(file, lineNumber, `missing document: ${match[1]}`);
  }
}

function checkDecisions(file, lineNumber, line) {
  for (const match of line.matchAll(/\bD(\d{1,4})\b/g)) {
    const number = Number(match[1]);
    if (number > lastDecision) {
      report(file, lineNumber, `D${number} is not registered (last is D${lastDecision})`);
    }
  }
}
