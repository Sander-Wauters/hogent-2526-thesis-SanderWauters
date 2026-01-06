/******************************************************************************
 *
 *
 * Updates Angular from version 19 to 20.
 *
 *
 *****************************************************************************/

import { loadTestenv, saveProject } from "../util/projectio.js";
import { SyntaxKind } from "ts-morph";
import {
  accessedFrom,
  findNodes,
  inScopeOf,
  deepestInstanceOf,
} from "../util/traversal.js";

const project = loadTestenv();

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "afterRender") &&
      (node.getParent()?.getKind() === SyntaxKind.CallExpression ||
        !!inScopeOf(node, SyntaxKind.ImportDeclaration)),
    (node) => node.replaceWithText("afterEveryRender"),
  ),
);

project.getSourceFiles().forEach((file) => {
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "canActivate") && accessedFrom(node, "Route"),
    (node) =>
      console.log(
        "canActivate",
        "NOT",
        file.getBaseName(),
        node.getStartLineNumber(),
      ),
  );
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "canDeactivate") && accessedFrom(node, "Route"),
    (node) =>
      console.log(
        "canDeactivate",
        "NOT",
        file.getBaseName(),
        node.getStartLineNumber(),
      ),
  );
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "canMatch") && accessedFrom(node, "Route"),
    (node) =>
      console.log(
        "canMatch",
        "NOT",
        file.getBaseName(),
        node.getStartLineNumber(),
      ),
  );
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "canActivateChild") &&
      accessedFrom(node, "Route"),
    (node) =>
      console.log(
        "canActivateChild",
        "NOT",
        file.getBaseName(),
        node.getStartLineNumber(),
      ),
  );
});

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "get") &&
      !!inScopeOf(node, SyntaxKind.CallExpression) &&
      accessedFrom(node, "TestBed"),
    (node) => node.replaceWithText("inject"),
  ),
);

project.getSourceFiles().forEach((file) => {
  findNodes(
    file,
    (node) => deepestInstanceOf(node, "InjectFlags.Default"),
    (node) => node.replaceWithText("{}"), // Hacky way to ensure that there are not trailing comma's.
  );
  findNodes(
    file,
    (node) => deepestInstanceOf(node, "InjectFlags.Host"),
    (node) => node.replaceWithText("{ host: true }"),
  );
  findNodes(
    file,
    (node) => deepestInstanceOf(node, "InjectFlags.Self"),
    (node) => node.replaceWithText("{ self: true }"),
  );
  findNodes(
    file,
    (node) => deepestInstanceOf(node, "InjectFlags.SkipSelf"),
    (node) => node.replaceWithText("{ skipSelf: true }"),
  );
  findNodes(
    file,
    (node) => deepestInstanceOf(node, "InjectFlags.Optional"),
    (node) => node.replaceWithText("{ optional: true }"),
  );
});

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "get") &&
      !!inScopeOf(node, SyntaxKind.CallExpression) &&
      accessedFrom(node, "Injector"),
    (node) =>
      console.log("get", "NOT", file.getBaseName(), node.getStartLineNumber()),
  ),
);

await saveProject(project);
