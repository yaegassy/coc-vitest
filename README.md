# coc-vitest

[Vitest](https://github.com/vitest-dev/vitest) for [coc.nvim](https://github.com/neoclide/coc.nvim)

## Install

**vim-plug**:

```vim
Plug 'yaegassy/coc-vitest', {'do': 'yarn install --frozen-lockfile'}
```

**CocInstall**:

Not supported at this time.

## Configuration options

- `vitest.enable`: Enable coc-vitest extension, default: `true`
- `vitest.codelens.enable`: Enable codelens, default: `true`
- `vitest.codelens.title`: CodeLens title. Can be changed to any display, default: `">> [Run Vitest]"`

## Commands

> :CocCommand [CommandName]
>
> **e.g.**:
> :CocCommand vitest.projectTest

- `vitest.projectTest`: Run Vitest for current project
- `vitest.fileTest`: Run Vitest for current file
- `vitest.singleTest`: Run Vitest for single (nearest) test

**Example of Vim command and key mapping**:

Vim commands can be defined and executed or key mappings can be set and used.

```vim
" Run Vitest for current project
command! -nargs=0 Vitest :call CocAction('runCommand', 'vitest.projectTest')

" Run Vitest for current file
command! -nargs=0 VitestCurrent :call  CocAction('runCommand', 'vitest.fileTest', ['%'])

" Run Vitest for single (nearest) test
nnoremap <leader>te :call CocAction('runCommand', 'vitest.singleTest')<CR>
```

## CodeLens (Neovim only)

**Feature**:

CodeLens appears above the test name in the `*.test.ts` and `*.spec.ts` files. Currently, `import.meta.vitest` is not supported.

**coc-settings.json**:

By default, `codeLens.enable` is set to `false`, which disables it.

Change the setting to `true` to enable it.

```jsonc
{
  "codeLens.enable": true
}
```

**Example key mapping (CodeLens related)**:

```vim
nmap <silent> gl <Plug>(coc-codelens-action)
```

**Misc**:

"CodeLens" does not work with "Vim8" due to coc.nvim specifications.

`vitest.singleTest` commands are available, so please use them.

## Similar coc.nvim extension

- [coc-jest](https://github.com/neoclide/coc-jest)

## Thanks

- [vitest-dev/vitest](https://github.com/vitest-dev/vitest)
- [jest-community/jest-editor-support](https://github.com/jest-community/jest-editor-support)

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
