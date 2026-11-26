#!/usr/bin/env python3
"""Hook PreToolUse dos agentes do alanwind: transforma as restrições dos agentes em bloqueio real.

Uso (no frontmatter do agente, em hooks.PreToolUse):
  restringir.py escrita <regex> [<regex> ...]   Write/Edit só em caminhos que casem com algum regex
                                                (caminho relativo à raiz do projeto)
  restringir.py bash [--somente-leitura|--sem-escrita]
                                                Bloqueia push, PR e merge; com --somente-leitura,
                                                bloqueia também comandos que alteram arquivos ou o git;
                                                com --sem-escrita, bloqueia escrever arquivo pelo shell
                                                (arquivos se escrevem com Write/Edit, que checam o caminho)

Saída 2 bloqueia a ferramenta e devolve a mensagem (stderr) ao agente.
"""
import json
import os
import re
import sys

SEMPRE_PROIBIDO = [
    (r"\bgit\s+push\b", "push é feito pela sessão principal"),
    (r"\bgh\s+pr\s+(create|merge)\b", "PR é aberta pela sessão principal e o merge é do Alan"),
    (r"\bgit\s+merge\b", "merge é do Alan"),
    (r"\bgit\s+(reset\s+--hard|clean\s+-[a-z]*f)", "comando destrutivo"),
]

ALTERA_ESTADO = [
    (r"\bgit\s+(add|commit|rm|mv|restore|stash|rebase|cherry-pick|revert|tag|branch\s+-[dDmM])\b", "altera o git"),
    (r"\b(rm|mv|cp|touch|mkdir|rmdir|chmod|chown|truncate|tee|dd)\b", "altera arquivos"),
    (r"\bsed\s+(-[a-zA-Z]*i|--in-place)", "edita arquivos"),
    (r"(^|[^0-9&<>|])>{1,2}\s*(?!&|/dev/null)\S", "redireciona saída para arquivo"),
    (r"\b(npm|pnpm|yarn|bun)\s+(install|add|remove|i)\b", "altera dependências"),
]


ESCREVE_ARQUIVO = [
    (r"(^|[^0-9&<>|])>{1,2}\s*(?!&|/dev/null)\S", "redireciona saída para arquivo"),
    (r"\btee\b", "escreve arquivo"),
    (r"\bsed\s+(-[a-zA-Z]*i|--in-place)", "edita arquivos"),
    (r"\b(python3?|node|perl|ruby)\b[^|;&]*\s(-c|-e|-)(\s|$)", "script inline pode escrever arquivos"),
    (r"(^|[;&|(]\s*|\b(xargs|sudo|env)\s+)(cp|mv|touch|install|dd|ln)\s",
     "copia ou cria arquivos"),
    (r"\bcurl\b[^|;&]*\s(-o|-O|--output)\b", "baixa para arquivo"),
    (r"\bwget\b", "baixa para arquivo"),
    (r"\bgit\s+(apply|restore)\b", "altera arquivos pelo git"),
    (r"\bgit\s+checkout\b[^|;&]*\s--(\s|$)", "altera arquivos pelo git"),
    (r"\bgit\s+worktree\b", "worktree é criada pela sessão principal"),
]

SAIDA_DOS_BLOQUEIOS = (
    " Use Write/Edit dentro dos arquivos permitidos; se o bloqueio impedir a"
    " tarefa, pare e relate (D173)."
)


def bloquear(mensagem: str) -> None:
    print(f"Bloqueado pela restrição do agente: {mensagem}", file=sys.stderr)
    sys.exit(2)


def caminho_relativo(caminho: str) -> str:
    raiz = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())
    absoluto = os.path.realpath(os.path.join(raiz, caminho))
    relativo = os.path.relpath(absoluto, os.path.realpath(raiz))
    # Agents isolated in a git worktree get the same rules as in the root.
    return re.sub(r"^\.claude/worktrees/[^/]+/", "", relativo)


def checar_escrita(entrada: dict, permitidos: list[str]) -> None:
    dados = entrada.get("tool_input", {})
    caminho = dados.get("file_path") or dados.get("notebook_path")
    if not caminho:
        return
    relativo = caminho_relativo(caminho)
    if relativo.startswith(".."):
        bloquear(f"{caminho} fica fora do projeto")
    if not any(re.search(padrao, relativo) for padrao in permitidos):
        bloquear(f"este agente não pode editar {relativo} (permitido: {', '.join(permitidos)})")


def checar_bash(entrada: dict, somente_leitura: bool, sem_escrita: bool) -> None:
    comando = entrada.get("tool_input", {}).get("command", "")
    regras = list(SEMPRE_PROIBIDO)
    if somente_leitura:
        regras += ALTERA_ESTADO
    for padrao, motivo in regras:
        if re.search(padrao, comando):
            bloquear(f"{motivo} (`{comando.strip()[:80]}`)")
    if sem_escrita:
        # Quoted text (commit messages, patterns) is not a shell redirection.
        sem_aspas = re.sub(r"'[^']*'|\"[^\"]*\"", "''", comando)
        for padrao, motivo in ESCREVE_ARQUIVO:
            if re.search(padrao, sem_aspas):
                bloquear(f"{motivo}.{SAIDA_DOS_BLOQUEIOS} (`{comando.strip()[:80]}`)")


def main() -> None:
    if len(sys.argv) < 2:
        bloquear("restringir.py chamado sem modo")
    entrada = json.load(sys.stdin)
    modo, argumentos = sys.argv[1], sys.argv[2:]
    if modo == "escrita":
        checar_escrita(entrada, argumentos)
    elif modo == "bash":
        checar_bash(
            entrada,
            "--somente-leitura" in argumentos,
            "--sem-escrita" in argumentos,
        )
    else:
        bloquear(f"modo desconhecido: {modo}")


if __name__ == "__main__":
    main()
