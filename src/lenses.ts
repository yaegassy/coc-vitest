import { CancellationToken, CodeLens, CodeLensProvider, LinesTextDocument, Position, Range, Uri } from 'coc.nvim';
import { getConfigVitestCodeLensTitle } from './config';
import { parse, ParsedNode } from './parser';
import { isTestFile } from './utils';

export class VitestCodeLensProvider implements CodeLensProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async provideCodeLenses(document: LinesTextDocument, token: CancellationToken) {
    const filePath = Uri.parse(document.uri).fsPath;

    if (!isTestFile(filePath)) return [];

    const codeLenses: CodeLens[] = [];

    try {
      const text = document.getText();
      const parseResults = parse(filePath, text).root.children;

      parseResults.forEach((parseResult: ParsedNode) => codeLenses.push(...getTestsBlocks(parseResult, parseResults)));
    } catch {
      // noop
    }

    // For some reason, the virtual text does not disappear even when the
    // number of code lens goes from 1 to 0.
    //
    // It may be a bug in coc.nvim itself, but it sends code lens with Range
    // of 0 and forces a refresh.
    if (codeLenses.length === 0) {
      codeLenses.push({
        range: Range.create(Position.create(0, 0), Position.create(0, 0)),
      });
    }

    return codeLenses;
  }
}

function getTestsBlocks(parsedNode: ParsedNode, parseResults: ParsedNode[]): CodeLens[] {
  const codeLenses: CodeLens[] = [];
  parsedNode.children?.forEach((subNode) => {
    codeLenses.push(...getTestsBlocks(subNode, parseResults));
  });

  const range = Range.create(
    parsedNode.start.line - 1,
    parsedNode.start.column,
    parsedNode.end.line - 1,
    parsedNode.end.column
  );

  if (parsedNode.type === 'expect') return [];

  const codeLensTitle = getConfigVitestCodeLensTitle();

  const lens: CodeLens = {
    range,
    command: {
      title: codeLensTitle,
      command: 'vitest.singleTest',
    },
  };

  codeLenses.push(lens);

  return codeLenses;
}
