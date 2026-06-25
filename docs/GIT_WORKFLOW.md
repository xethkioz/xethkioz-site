# GIT WORKFLOW — XETHKIOZ v4.0

## Flujo recomendado

```txt
main
└── release/v4.0
    ├── feature/v4-audit
    ├── feature/v4-cms
    ├── feature/v4-community
    └── feature/v4-admin
```

## Comandos base

```bash
git status
git switch release/v4.0
git switch -c feature/v4-audit
```

## Antes de commit

```bash
npm run build
git status
```

## Mensajes de commit

```txt
docs: add v4 architecture plan
refactor: move shared hooks
feat: add cms articles foundation
fix: resolve auth redirect issue
```
