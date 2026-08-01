---
"@plexus-ms/config": minor
---

Add the `tsconfig-cli` subpath export: the shared TypeScript compiler options for Node CLI and library packages that build to `dist` — `"extends": "@plexus-ms/config/tsconfig-cli"`. It emits (`declaration`, `declarationMap`, `sourceMap`) under `NodeNext` resolution, so source must use explicit `.js` import specifiers. `outDir`/`rootDir` and `include`/`exclude` stay in the extending package, since TypeScript resolves those paths relative to the file that declares them. Requires `@types/node`, which the config pins via `"types": ["node"]`.
