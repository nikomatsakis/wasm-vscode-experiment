Logging various things

* Need to have `webworker` in the `tsconfig.json` to see `WebAssembly` in typescript
* Need to use latest version of "@vscode/wasm-component-model" and be sure to rerun `npm run generate:model` when version changes

Rust code needs this:

```toml
[lib]
crate-type = ["cdylib"]
```