import * as ts from 'typescript';
import { ParameterDeclaration } from 'typescript';
import { NgxThreeClass } from './NgxThreeClass';

/**
 * A wrapper class generator for three.js materials
 */
export class NgxThreeControl extends NgxThreeClass {
  public generate() {
    this.imports.add("import { ThControlBase } from '../ThControlBase';");
    super.generate();
  }

  public getWrappedClassImportPath() {
    const fileName = this.classDecl.getSourceFile().fileName;
    return fileName.substr(fileName.indexOf('/node_modules/@types/three/')).replace('/node_modules/@types/', '').replace('.d.ts', '');
  }

  protected generateConstructor() {
    return '';
  }

  protected getConstructorArgumentTypes(): string[] {
    const symbol = ((this.classDecl as unknown) as ts.Type).symbol;
    const constructorType = this.typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
    const constructSignatures = constructorType.getConstructSignatures();

    if (constructSignatures.length === 0 || (constructSignatures.length === 1 && constructSignatures[0].parameters.length === 0)) {
      return [];
    }

    return constructSignatures[0].parameters.map((param) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (param.declarations[0] as ParameterDeclaration).type!.getText()
    );
  }

  protected generateProvidersArray() {
    return `[{provide: ThControlBase, useExisting: forwardRef(() => ${this.className})}]`;
  }

  public getBaseClassName(): string {
    return '';
  }

  public getWrapperBaseClassName(): string {
    return 'ThControlBase';
  }
}
