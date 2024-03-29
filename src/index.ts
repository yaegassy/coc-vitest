import { commands, ExtensionContext, languages } from 'coc.nvim';
import { fileTestCommand, getVitestPath, projectTestCommand, singleTestCommand } from './commands';
import { getConfigVitestCodeLensEnable, getConfigVitestEnable } from './config';
import { VitestCodeLensProvider } from './lenses';

export async function activate(context: ExtensionContext): Promise<void> {
  if (!getConfigVitestEnable()) return;

  context.subscriptions.push(
    commands.registerCommand('vitest.projectTest', projectTestCommand()),
    commands.registerCommand('vitest.fileTest', fileTestCommand()),
    commands.registerCommand('vitest.singleTest', singleTestCommand())
  );

  if (getConfigVitestCodeLensEnable()) {
    const vitestBin = getVitestPath();
    if (vitestBin) {
      context.subscriptions.push(
        languages.registerCodeLensProvider(
          [
            { scheme: 'file', language: 'typescript' },
            { scheme: 'file', language: 'javascript' },
            { scheme: 'file', language: 'typescriptreact' },
            { scheme: 'file', language: 'javascriptreact' },
          ],
          new VitestCodeLensProvider()
        )
      );
    }
  }
}
