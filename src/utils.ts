import { LinesTextDocument, Position, Uri } from 'coc.nvim';
import { parse } from './parser';

export function isSupportLang(languageId: string) {
  if (['javascript', 'typescript', 'javascriptreact', 'typescriptreact'].includes(languageId)) {
    return true;
  }
  return false;
}

export function isTestFile(filePath: string) {
  if (filePath.match(/.*\.(test|spec)\.(ts|js|tsx|jsx)$/)) {
    return true;
  }
  return false;
}

export function findFullTestName(selectedLine: number, children: any[]): string | undefined {
  if (!children) {
    return;
  }
  for (const element of children) {
    if (element.type === 'describe' && selectedLine === element.start.line) {
      return resolveTestNameStringInterpolation(element.name);
    }
    if (element.type !== 'describe' && selectedLine >= element.start.line && selectedLine <= element.end.line) {
      return resolveTestNameStringInterpolation(element.name);
    }
  }
  for (const element of children) {
    const result = findFullTestName(selectedLine, element.children);

    if (result) {
      return resolveTestNameStringInterpolation(element.name) + ' ' + result;
    }
  }
}

export function findCurrentTestName(document: LinesTextDocument, position: Position) {
  const filePath = Uri.parse(document.uri).fsPath;
  const parsedTestFile = parse(filePath);

  const fullTestName = findFullTestName(position.line + 1, parsedTestFile.root.children);
  return fullTestName ? escapeRegExp(fullTestName) : undefined;
}

export function resolveTestNameStringInterpolation(s: string): string {
  const variableRegex = /(\${?[A-Za-z0-9_]+}?|%[psdifjo#%])/gi;
  const matchAny = '(.*?)';
  return s.replace(variableRegex, matchAny);
}

export function escapeRegExp(s: string): string {
  const escapedString = s.replace(/[.*+?^${}<>()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  return escapedString.replace(/\\\(\\\.\\\*\\\?\\\)/g, '(.*?)');
}
