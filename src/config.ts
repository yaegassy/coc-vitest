import { workspace } from 'coc.nvim';

export function getConfigVitestEnable() {
  return workspace.getConfiguration('vitest').get<boolean>('enable', true);
}

export function getConfigVitestCodeLensEnable() {
  return workspace.getConfiguration('vitest').get<boolean>('codelens.enable', true);
}

export function getConfigVitestCodeLensTitle() {
  return workspace.getConfiguration('vitest').get('codelens.title', '>> [RUN Vitest]');
}
