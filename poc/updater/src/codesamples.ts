import { SyntaxKind } from "ts-morph";
import { loadProject, saveProject } from "./util/projectio.js";
import {
  accessedFrom,
  findNodes,
  inScopeOf,
  lastInstanceInTree,
} from "./util/traversal.js";

// Change references to AnimationDriver.NOOP to use NoopAnimationDriver because AnimationDriver.NOOP is now deprecated.
const project = loadProject();
project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      lastInstanceInTree(node, "NOOP") && accessedFrom(node, "AnimationDriver"),
    (node) => node.replaceWithText("NoopAnimationDriver"),
  ),
);
await saveProject(project);

// Use update instead of mutate in Angular Signals. For example items.mutate(itemsArray => itemsArray.push(newItem)); will now be items.update(itemsArray => [itemsArray, …newItem]);
const project = loadProject();
project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      lastInstanceInTree(node, "mutate") &&
      accessedFrom(node, "WritableSignal"),
    (node) => node.replaceWithText("update"),
  ),
);
await saveProject(project);

// Replace async from @angular/core with waitForAsync.
const project = loadProject();
project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      lastInstanceInTree(node, "async") &&
      node.getKind() !== SyntaxKind.AsyncKeyword,
    (node) => node.replaceWithText("waitForAsync"),
  ),
);
await saveProject(project);

// Rename the afterRender lifecycle hook to afterEveryRender
const project = loadProject();
project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      lastInstanceInTree(node, "afterRender") &&
      (!!inScopeOf(node, SyntaxKind.CallExpression) ||
        !!inScopeOf(node, SyntaxKind.ImportDeclaration)),
    (node) => node.replaceWithText("afterEveryRender"),
  ),
);
await saveProject(project);

// For any components using OnPush change detection, ensure they are properly marked dirty to enable host binding updates.
const project = loadProject();
project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      lastInstanceInTree(node, "OnPush") &&
      accessedFrom(node, "ChangeDetectionStrategy") &&
      !!inScopeOf(node, SyntaxKind.Decorator),
    () => console.log(file.getBaseName(), file.getStartLineNumber()),
  ),
);
await saveProject(project);
