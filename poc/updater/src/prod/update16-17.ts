/******************************************************************************
 *
 *
 * Updates Angular from version 16 to 17.
 *
 *
 *****************************************************************************/

import { loadTestenv, saveProject } from "../util/projectio.js";
import {
  accessedFrom,
  findNodes,
  getAncestor,
  hasType,
  deepestInstanceOf,
} from "../util/traversal.js";

const project = loadTestenv();

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) => deepestInstanceOf(node, "REMOVE_STYLES_ON_COMPONENT_DESTROY"),
    (node) =>
      findNodes(
        getAncestor(node, 2)!,
        (node) => deepestInstanceOf(node, "useValue: true"),
        (node) => {
          console.log(
            "useValue: true",
            "PARTIALLY",
            file.getBaseName(),
            node.getStartLineNumber(),
          );
          // node.replaceWithText("useValue: false");
        },
      ),
  ),
);

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "AnimationDriver.NOOP") &&
      hasType(node, "AnimationDriver"),
    (node) => node.replaceWithText("NoopAnimationDriver"),
  ),
);

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "mutate") && accessedFrom(node, "WritableSignal"),
    (node) => {
      console.log(
        "mutate",
        "PARTIALLY",
        file.getBaseName(),
        node.getStartLineNumber(),
      );
      // node.replaceWithText("update");
    },
  ),
);

project.getSourceFiles().forEach((file) =>
  findNodes(
    file,
    (node) =>
      deepestInstanceOf(node, "provideClientHydration") &&
      findNodes(
        getAncestor(node, 3)!,
        (node) => deepestInstanceOf(node, "providers"),
        () => {},
      ),
    (node) => {
      console.log(
        "provideClientHydration",
        "PARTIALLY",
        file.getBaseName(),
        node.getStartLineNumber(),
      );
      // node.getParent()!.replaceWithText("");
    },
  ),
);

await saveProject(project);
