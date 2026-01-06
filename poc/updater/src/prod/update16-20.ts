/******************************************************************************
 *
 *
 * Updates Angular from version 16 to 20.
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

await saveProject(project, true);
