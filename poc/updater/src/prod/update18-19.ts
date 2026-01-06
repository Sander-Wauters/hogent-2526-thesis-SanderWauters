/******************************************************************************
 *
 *
 * Updates Angular from version 18 to 19.
 *
 *
 *****************************************************************************/

import { SyntaxKind } from "ts-morph";
import { loadTestenv, saveProject } from "../util/projectio.js";
import {
  findNodes,
  getAncestor,
  hasType,
  deepestInstanceOf,
  accessedFrom,
} from "../util/traversal.js";

const project = loadTestenv();

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "withServerTransition") &&
      findNodes(
        getAncestor(node, 3)!,
        (ancestor) => hasType(ancestor, "BrowserModule"),
        () => {},
      ),
    (node) => {
      console.log(
        "withServerTransition",
        "PARTIALLY",
        file.getBaseName(),
        node.getStartLineNumber(),
      );
      // node
      //   .getFirstAncestorByKind(SyntaxKind.CallExpression)
      //   ?.replaceWithText(`BrowserModule`);
    },
  ),
);

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "factories") &&
      findNodes(
        getAncestor(node, 3)!,
        (ancestor) => hasType(ancestor, "KeyValueDiffers"),
        () => {},
      ),
    (node) =>
      console.log(
        "factories",
        "NOT",
        file.getBaseName(),
        node.getStartLineNumber(),
      ),
  ),
);

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "fakeAsync") &&
      node.getKind() == SyntaxKind.Identifier &&
      node.getParent()?.getKind() === SyntaxKind.CallExpression,
    (node) =>
      console.log(
        "fakeAsync",
        "NOT",
        file.getBaseName(),
        node.getStartLineNumber(),
      ),
  ),
);

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "errorHandler") &&
      findNodes(
        getAncestor(node, 3)!,
        (ancestor) => hasType(ancestor, "Router"),
        () => {},
      ),
    (node) =>
      console.log(
        "errorHandler",
        "NOT",
        file.getBaseName(),
        node.getStartLineNumber(),
      ),
  ),
);

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "tick") &&
      node.getParent()?.getKind() == SyntaxKind.CallExpression &&
      findNodes(
        getAncestor(node, 3)!,
        (ancestor) => hasType(ancestor, "ApplicationRef"),
        () => {},
      ),
    (node) =>
      console.log("tick", "NOT", file.getBaseName(), node.getStartLineNumber()),
  ),
);

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "resolve") && accessedFrom(node, "Resolve"),
    (node) =>
      console.log(
        "resolve",
        "NOT",
        file.getBaseName(),
        node.getStartLineNumber(),
      ),
  ),
);

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "fakeAsync") &&
      node.getKind() === SyntaxKind.Identifier &&
      node.getParent()?.getKind() === SyntaxKind.CallExpression,
    (node) =>
      console.log(
        "fakeAsync",
        "NOT",
        file.getBaseName(),
        node.getStartLineNumber(),
      ),
  ),
);

await saveProject(project);
