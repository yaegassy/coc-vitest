import { Terminal, Uri, window, workspace } from 'coc.nvim';
import fs from 'fs';
import path from 'path';
import { getConfigVitestTerminalEnableSplitRight, getConfigVitestWatchMode } from './config';
import { findCurrentTestName, isSupportLang } from './utils';

const NOT_TEST_FILE_MESSAGE = 'This file is not a test file!';
let terminal: Terminal | undefined;

export function getVitestPath() {
  let cmdPath = '';
  const vitestPath = workspace.getConfiguration('vitest').get<string>('path');
  const localVitestPath = path.join(workspace.root, 'node_modules', '.bin', 'vitest');

  if (vitestPath && fs.existsSync(vitestPath)) {
    cmdPath = vitestPath;
  } else if (fs.existsSync(localVitestPath)) {
    cmdPath = path.join(workspace.root, 'node_modules', '.bin', 'vitest');
  }

  return cmdPath;
}

async function runVitest(filePath?: string, testName?: string) {
  const vitestBin = getVitestPath();

  if (vitestBin) {
    if (terminal) {
      if (terminal.bufnr) {
        await workspace.nvim.command(`bd! ${terminal.bufnr}`);
      }
      terminal.dispose();
      terminal = undefined;
    }

    terminal = await window.createTerminal({ name: 'vitest', cwd: workspace.root });

    const args: string[] = [];
    if (!getConfigVitestWatchMode()) {
      args.push('run');
    }

    if (testName && filePath) {
      args.push('--testNamePattern');
      args.push(`'${testName}'`);
      args.push(`${filePath}`);
    } else if (filePath) {
      args.push(`${filePath}`);
    }

    terminal.sendText(`${vitestBin} ${args.join(' ')}`);

    const enableSplitRight = getConfigVitestTerminalEnableSplitRight();
    if (enableSplitRight) terminal.hide();
    await workspace.nvim.command('stopinsert');
    if (enableSplitRight) {
      await workspace.nvim.command(`vert bel sb ${terminal.bufnr}`);
      await workspace.nvim.command(`wincmd p`);
    }
  } else {
    return window.showErrorMessage('vitest not found!');
  }
}

export function projectTestCommand() {
  return async () => {
    const { document } = await workspace.getCurrentState();

    if (!isSupportLang(document.languageId)) return window.showErrorMessage(NOT_TEST_FILE_MESSAGE);

    runVitest();
  };
}

export function fileTestCommand() {
  return async () => {
    const { document } = await workspace.getCurrentState();
    const filePath = Uri.parse(document.uri).fsPath;

    if (!isSupportLang(document.languageId)) return window.showErrorMessage(NOT_TEST_FILE_MESSAGE);

    runVitest(filePath);
  };
}

export function singleTestCommand() {
  return async () => {
    const { document, position } = await workspace.getCurrentState();
    const filePath = Uri.parse(document.uri).fsPath;

    if (!isSupportLang(document.languageId)) return window.showErrorMessage(NOT_TEST_FILE_MESSAGE);

    const testName = findCurrentTestName(document, position);

    if (testName) {
      runVitest(filePath, testName);
    } else {
      window.showErrorMessage(`Test not found`);
    }
  };
}
