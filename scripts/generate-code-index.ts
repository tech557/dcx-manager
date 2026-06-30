import { Project, SyntaxKind, SourceFile, Node } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

interface ComponentInfo {
  definedIn: string;
  exportType: 'default' | 'named' | 'local';
  props: { name: string; type: string; required: boolean }[];
  childComponentsUsed: string[];
}

interface ComponentUsage {
  component: string;
  usedIn: string;
  line: number;
  propsPassed: Record<string, string>;
  origin: 'project' | 'external' | 'native' | 'wrapped' | 'unresolved';
  resolvedPath: string;
}

interface TextLabel {
  text: string;
  type: 'jsx-text' | 'prop-value' | 'expression-text';
  file: string;
  line: number;
  context: string;
}

interface UnresolvedImport {
  file: string;
  line: number;
  importSpecifier: string;
  importedName: string;
}

interface UnresolvedComponent {
  file: string;
  line: number;
  componentName: string;
}

function findFileForModuleSpecifier(currentFilePath: string, specifier: string, project: Project): SourceFile | undefined {
  const rootDir = process.cwd();
  let targetPath = '';
  if (specifier.startsWith('@/')) {
    targetPath = path.resolve(rootDir, 'src', specifier.substring(2));
  } else if (specifier.startsWith('.')) {
    targetPath = path.resolve(path.dirname(currentFilePath), specifier);
  } else {
    return undefined;
  }

  const candidates = [
    targetPath,
    targetPath + '.tsx',
    targetPath + '.ts',
    path.join(targetPath, 'index.tsx'),
    path.join(targetPath, 'index.ts'),
    targetPath + '.d.ts',
  ];

  for (const candidate of candidates) {
    const sf = project.getSourceFile(candidate);
    if (sf) return sf;
    try {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return project.addSourceFileAtPath(candidate);
      }
    } catch {
      // ignored
    }
  }
  return undefined;
}

function getDefaultExportName(sourceFile: SourceFile): string {
  const defaultFunc = sourceFile.getFunctions().find(f => f.isDefaultExport());
  if (defaultFunc && defaultFunc.getName()) return defaultFunc.getName()!;
  const defaultClass = sourceFile.getClasses().find(c => c.isDefaultExport());
  if (defaultClass && defaultClass.getName()) return defaultClass.getName()!;
  const ea = sourceFile.getExportAssignments().find(a => !a.isExportEquals());
  if (ea) return ea.getExpression().getText();
  return 'default';
}

function resolveOriginalComponent(
  sourceFile: SourceFile,
  name: string,
  project: Project,
  visited: Set<string> = new Set()
): { file: SourceFile; name: string; origin: 'project' | 'external' | 'wrapped' } | undefined {
  const filePath = sourceFile.getFilePath();
  const key = `${filePath}:${name}`;
  if (visited.has(key)) return undefined;
  visited.add(key);

  for (const importDec of sourceFile.getImportDeclarations()) {
    const specifier = importDec.getModuleSpecifierValue();
    const namedImport = importDec.getNamedImports().find(ni => ni.getName() === name);
    if (namedImport) {
      const importedName = namedImport.getName();
      if (!specifier.startsWith('.') && !specifier.startsWith('@/')) {
        return { file: sourceFile, name: importedName, origin: 'external' };
      }
      const target = findFileForModuleSpecifier(filePath, specifier, project);
      return target ? resolveOriginalComponent(target, importedName, project, visited) : { file: sourceFile, name: importedName, origin: 'external' };
    }

    const defaultImport = importDec.getDefaultImport();
    if (defaultImport && defaultImport.getText() === name) {
      if (!specifier.startsWith('.') && !specifier.startsWith('@/')) {
        return { file: sourceFile, name: 'default', origin: 'external' };
      }
      const target = findFileForModuleSpecifier(filePath, specifier, project);
      if (target) {
        const defName = getDefaultExportName(target);
        return resolveOriginalComponent(target, defName, project, visited);
      }
      return { file: sourceFile, name: 'default', origin: 'external' };
    }
  }

  const func = sourceFile.getFunction(name);
  if (func) return { file: sourceFile, name, origin: 'project' };

  const cls = sourceFile.getClass(name);
  if (cls) return { file: sourceFile, name, origin: 'project' };

  const vDec = sourceFile.getVariableDeclaration(name);
  if (vDec) {
    const init = vDec.getInitializer();
    let origin: 'project' | 'wrapped' = 'project';
    if (init && init.getKind() === SyntaxKind.CallExpression) {
      const exprText = (init as any).getExpression().getText();
      if (exprText.includes('forwardRef') || exprText.includes('memo') || exprText.includes('motion')) {
        origin = 'wrapped';
      }
    }
    return { file: sourceFile, name, origin };
  }
  return undefined;
}

function isValidUIText(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (/^[0-9\s.,\/#!$%\^&\*;:{}=\-_`~()_+|<>?\[\]]*$/.test(t)) return false;
  if (t.split(/\s+/).every(w => /^[a-z0-9\-:]+$/.test(w)) && t.includes('-') && (t.length > 15 || t.split(/\s+/).length > 2)) return false;
  if (t.startsWith('/') || t.startsWith('http://') || t.startsWith('https://') || t.includes('.tsx') || t.includes('.ts')) return false;
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(t) && t.length < 2) return false;
  return true;
}

function cleanType(typeStr: string): string {
  return typeStr.replace(/import\("[^"]+"\)\./g, '');
}

async function run() {
  console.log('Initializing Code Indexer...');
  const project = new Project({ tsConfigFilePath: 'tsconfig.json' });
  const sourceFiles = project.getSourceFiles().filter(sf => !sf.getFilePath().includes('node_modules'));

  const components: Record<string, ComponentInfo> = {};
  const usages: ComponentUsage[] = [];
  const textLabels: TextLabel[] = [];
  const unresolvedImports: UnresolvedImport[] = [];
  const unresolvedComponents: UnresolvedComponent[] = [];

  for (const sf of sourceFiles) {
    const filePath = sf.getFilePath();
    const relPath = path.relative(process.cwd(), filePath);
    console.log(`Analyzing: ${relPath}`);

    // Extract defined custom components
    const processComp = (name: string, node: Node, exportType: 'default' | 'named' | 'local', param?: Node) => {
      const children = new Set<string>();
      node.forEachDescendant(desc => {
        if (desc.getKind() === SyntaxKind.JsxOpeningElement || desc.getKind() === SyntaxKind.JsxSelfClosingElement) {
          children.add((desc as any).getTagNameNode().getText());
        }
      });

      const props: { name: string; type: string; required: boolean }[] = [];
      if (param) {
        const paramType = (param as any).getType();
        const sym = paramType.getAliasSymbol() || paramType.getSymbol();
        if (sym) {
          for (const dec of sym.getDeclarations()) {
            if (dec.getKind() === SyntaxKind.InterfaceDeclaration) {
              const intDec = dec as any;
              for (const m of intDec.getMethods()) props.push({ name: m.getName(), type: cleanType(m.getType().getText()), required: !m.hasQuestionToken() });
              for (const p of intDec.getProperties()) props.push({ name: p.getName(), type: cleanType(p.getType().getText()), required: !p.hasQuestionToken() });
            } else if (dec.getKind() === SyntaxKind.TypeAliasDeclaration) {
              const tl = (dec as any).getTypeNode();
              if (tl && tl.getKind() === SyntaxKind.TypeLiteral) {
                for (const p of tl.getProperties()) props.push({ name: p.getName(), type: cleanType(p.getType().getText()), required: !p.hasQuestionToken() });
              }
            }
          }
        }
        if (props.length === 0) {
          for (const prop of paramType.getProperties()) {
            const decs = prop.getDeclarations();
            const isExt = decs.length > 0 && (decs[0].getSourceFile().getFilePath().includes('node_modules') || decs[0].getSourceFile().getFilePath().includes('lib.dom.d.ts'));
            if (!isExt) {
              const typeAtLoc = prop.getTypeAtLocation(param);
              props.push({ name: prop.getName(), type: cleanType(typeAtLoc ? typeAtLoc.getText() : 'any'), required: !prop.isOptional() });
            }
          }
        }
      }

      components[name] = { definedIn: relPath, exportType, props, childComponentsUsed: Array.from(children) };
    };

    for (const f of sf.getFunctions()) {
      const name = f.getName();
      if (name && /^[A-Z]/.test(name)) {
        const hasJsx = f.getDescendantsOfKind(SyntaxKind.JsxOpeningElement).length > 0 || f.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0;
        if (hasJsx) {
          const exportType = f.isDefaultExport() ? 'default' : (f.isExported() ? 'named' : 'local');
          processComp(name, f, exportType, f.getParameters()[0]);
        }
      }
    }

    for (const varStmt of sf.getVariableStatements()) {
      const exportType = varStmt.isDefaultExport() ? 'default' : (varStmt.isExported() ? 'named' : 'local');
      for (const varDec of varStmt.getDeclarations()) {
        const name = varDec.getName();
        if (/^[A-Z]/.test(name)) {
          const init = varDec.getInitializer();
          if (init && (init.getKind() === SyntaxKind.ArrowFunction || init.getKind() === SyntaxKind.FunctionExpression)) {
            const hasJsx = varDec.getDescendantsOfKind(SyntaxKind.JsxOpeningElement).length > 0 || varDec.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0;
            if (hasJsx) {
              processComp(name, varDec, exportType, (init as any).getParameters()[0]);
            }
          }
        }
      }
    }

    // Extract unresolved imports
    for (const id of sf.getImportDeclarations()) {
      const spec = id.getModuleSpecifierValue();
      if (spec.startsWith('.') || spec.startsWith('@/')) {
        const target = findFileForModuleSpecifier(filePath, spec, project);
        if (!target) {
          for (const ni of id.getNamedImports()) {
            unresolvedImports.push({ file: relPath, line: id.getStartLineNumber(), importSpecifier: spec, importedName: ni.getName() });
          }
          const di = id.getDefaultImport();
          if (di) unresolvedImports.push({ file: relPath, line: id.getStartLineNumber(), importSpecifier: spec, importedName: di.getText() });
        }
      }
    }

    // Traverse AST for usages & text labels
    sf.forEachDescendant(node => {
      const kind = node.getKind();
      const line = node.getStartLineNumber();

      if (kind === SyntaxKind.JsxOpeningElement || kind === SyntaxKind.JsxSelfClosingElement) {
        const tagName = (node as any).getTagNameNode().getText();
        const attrs: Record<string, string> = {};
        for (const attr of (node as any).getAttributes()) {
          if (attr.getKind() === SyntaxKind.JsxAttribute) {
            const attrName = attr.getNameNode().getText();
            attrs[attrName] = attr.getInitializer() ? attr.getInitializer()!.getText() : 'true';
          } else if (attr.getKind() === SyntaxKind.JsxSpreadAttribute) {
            attrs['...spread'] = attr.getExpression().getText();
          }
        }

        let origin: ComponentUsage['origin'] = 'unresolved';
        let resolvedPath = '';

        if (/^[a-z]/.test(tagName)) {
          origin = 'native';
        } else if (tagName.includes('.')) {
          origin = 'external';
        } else {
          const res = resolveOriginalComponent(sf, tagName, project);
          if (res) {
            origin = res.origin;
            resolvedPath = path.relative(process.cwd(), res.file.getFilePath());
          } else {
            unresolvedComponents.push({ file: relPath, line, componentName: tagName });
          }
        }

        usages.push({ component: tagName, usedIn: relPath, line, propsPassed: attrs, origin, resolvedPath });
      }

      // Visible text extraction
      if (kind === SyntaxKind.JsxText) {
        const text = node.getText().trim();
        if (isValidUIText(text)) {
          textLabels.push({ text, type: 'jsx-text', file: relPath, line, context: node.getParent()?.getText().substring(0, 100) || text });
        }
      } else if (kind === SyntaxKind.StringLiteral || kind === SyntaxKind.NoSubstitutionTemplateLiteral) {
        const text = (node as any).getLiteralValue();
        if (isValidUIText(text)) {
          const jsxExpr = node.getFirstAncestorByKind(SyntaxKind.JsxExpression);
          if (jsxExpr && !jsxExpr.getFirstAncestorByKind(SyntaxKind.JsxAttribute)) {
            textLabels.push({ text, type: 'expression-text', file: relPath, line, context: jsxExpr.getParent()?.getText().substring(0, 100) || text });
          } else {
            const jsxAttr = node.getFirstAncestorByKind(SyntaxKind.JsxAttribute);
            if (jsxAttr) {
              const textAttrs = ['placeholder', 'title', 'label', 'alt', 'aria-label', 'buttontext', 'btntext', 'tooltip', 'text', 'description', 'heading', 'subheading', 'btnlabel', 'error', 'success', 'message'];
              const attrName = jsxAttr.getNameNode().getText();
              if (textAttrs.includes(attrName.toLowerCase())) {
                textLabels.push({ text, type: 'prop-value', file: relPath, line, context: jsxAttr.getParent()?.getText().substring(0, 100) || text });
              }
            }
          }
        }
      }
    });
  }

  const outDir = path.resolve(process.cwd(), 'code-index');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outDir, 'components.json'), JSON.stringify(components, null, 2));
  fs.writeFileSync(path.join(outDir, 'component-usages.json'), JSON.stringify(usages, null, 2));
  fs.writeFileSync(path.join(outDir, 'text-labels.json'), JSON.stringify(textLabels, null, 2));
  fs.writeFileSync(path.join(outDir, 'unresolved.json'), JSON.stringify({ unresolvedImports, unresolvedComponents }, null, 2));

  console.log(`Success! Output written to ${outDir}/`);
}

run().catch(err => {
  console.error('Error generating code index:', err);
  process.exit(1);
});
