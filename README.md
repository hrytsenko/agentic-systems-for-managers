# Enterprise Agentic Systems

A lean guide for managers and staff engineers to the concepts, costs, and risks of agentic systems for business.

Published at [Enterprise Agentic Systems](https://hrytsenko.github.io/enterprise-agentic-systems/), with a [slide deck](https://hrytsenko.github.io/enterprise-agentic-systems/deck/).

## Content

```text
src/content/docs/
  index.mdx       # home page
  <topic>.md      # topic page
deck/
  index.md        # slides
```

## Develop

```sh
npm install
npm run guide               # run guide at http://localhost:4321/enterprise-agentic-systems/
npm run deck                # run deck at http://localhost:8080/
npm run build               # build the guide and deck
pre-commit install          # install hooks
pre-commit run --all-files  # run hooks
```
