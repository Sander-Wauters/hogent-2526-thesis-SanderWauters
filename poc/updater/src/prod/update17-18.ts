/******************************************************************************
 *
 *
 * Updates Angular from version 17 to 18.
 *
 *
 *****************************************************************************/

import { SyntaxKind } from "ts-morph";
import { loadTestenv, saveProject } from "../util/projectio.js";
import {
  accessedFrom,
  findNodes,
  getAncestor,
  hasType,
  inScopeOf,
  deepestInstanceOf,
} from "../util/traversal.js";

const project = loadTestenv();

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "async") &&
      node.getKind() !== SyntaxKind.AsyncKeyword,
    (node) => node.replaceWithText("waitForAsync"),
  ),
);

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "matchesElement") &&
      accessedFrom(node, "AnimationDriver"),
    (node) => {
      console.log(
        "matchesElement",
        "PARTIALLY",
        file.getBaseName(),
        node.getStartLineNumber(),
      );
      // getAncestor(node, 3)?.replaceWithText("");
    },
  ),
);

project.getSourceFiles().forEach((file) => {
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "StateKey") &&
      !!inScopeOf(node, SyntaxKind.ImportDeclaration),
    (node) =>
      findNodes(
        getAncestor(node, 4)!,
        (node) =>
          deepestInstanceOf(node, `"@angular/platform-browser"`) &&
          !!inScopeOf(node, SyntaxKind.ImportDeclaration),
        (node) => node.replaceWithText(`"@angular/core"`),
      ),
  );
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "TransferState") &&
      !!inScopeOf(node, SyntaxKind.ImportDeclaration),
    (node) =>
      findNodes(
        getAncestor(node, 4)!,
        (node) =>
          deepestInstanceOf(node, `"@angular/platform-browser"`) &&
          !!inScopeOf(node, SyntaxKind.ImportDeclaration),
        (node) => node.replaceWithText(`"@angular/core"`),
      ),
  );
});

project.getSourceFiles().forEach((file) => {
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "isPlatformWorkerUi") &&
      node.getParent()?.getKind() === SyntaxKind.CallExpression,
    (node) => {
      console.log(
        "isPlatformWorkerUi",
        "PARTIALLY",
        file.getBaseName(),
        node.getStartLineNumber(),
      );
      // node.getParent()?.replaceWithText("false");
    },
  );
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "isPlatformWorkerApp") &&
      node.getParent()?.getKind() === SyntaxKind.CallExpression,
    (node) => {
      console.log(
        "isPlatformWorkerApp",
        "PARTIALLY",
        file.getBaseName(),
        node.getStartLineNumber(),
      );
      // node.getParent()?.replaceWithText("false");
    },
  );
});

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) => deepestInstanceOf(node, "...RESOURCE_CACHE_PROVIDER"),
    (node) => node.replaceWithText(""),
  ),
);

project.getSourceFiles().forEach((file) => {
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "useAbsoluteUrl") &&
      findNodes(
        getAncestor(node, 3)!,
        (ancestor) => hasType(ancestor, "PlatformConfig"),
        () => {},
      ),
    (node) => node.getParent()?.replaceWithText(""),
  );
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "baseUrl") &&
      findNodes(
        getAncestor(node, 3)!,
        (ancestor) => hasType(ancestor, "PlatformConfig"),
        () => {},
      ),
    (node) => {
      console.log(
        "baseUrl",
        "PARTIALLY",
        file.getBaseName(),
        node.getStartLineNumber(),
      );
      // node.getParent()?.replaceWithText(`url: "TODO"`);
    },
  );
});

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "platformDynamicServer") &&
      (!!inScopeOf(node, SyntaxKind.CallExpression) ||
        !!inScopeOf(node, SyntaxKind.ImportDeclaration)),
    (node) => node.replaceWithText("platformServer"),
  ),
);

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "ServerTransferStateModule") &&
      !inScopeOf(node, SyntaxKind.ImportDeclaration),
    (node) => {
      console.log(
        "ServerTransferStateModule",
        "PARTIALLY",
        file.getBaseName(),
        node.getStartLineNumber(),
      );
      // node.replaceWithText("");
    },
  ),
);

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "OnPush") &&
      accessedFrom(node, "ChangeDetectionStrategy") &&
      !!inScopeOf(node, SyntaxKind.Decorator),
    (node) =>
      console.log(
        "OnPush",
        "NOT",
        file.getBaseName(),
        node.getStartLineNumber(),
      ),
  ),
);

await saveProject(project);
