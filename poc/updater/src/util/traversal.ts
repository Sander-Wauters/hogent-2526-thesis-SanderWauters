/*****************************************************************************
 *
 *
 * Collection of helper function for traversing the TypeScript AST.
 *
 *
 *****************************************************************************/

import { Node, SyntaxKind, TypeFormatFlags } from "ts-morph";

/**
 * Finds the number of nodes that match the predicate in the given AST.
 *
 * @param {Node} root - The root node of the tree.
 * @param {(node: Node) => boolean | number} predicate - Callback function that evaluates each node.
 * @param {(node: Node) => void} onMatch - Callback function called if a node matches the predicate.
 */
export function findNodes(
  root: Node,
  predicate: (node: Node) => boolean | number,
  onMatch: (node: Node) => void,
): number {
  let matches = 0;
  root.forEachDescendant((node) => {
    if (predicate(node)) {
      matches += 1;
      onMatch(node);
    }
  });
  return matches;
}

/**
 * Checks if the text of a node contains a given pattern.
 *
 * @param {Node} node - The node to check.
 * @param {string} pattern - The pattern to check against.
 */
export function containsPattern(node: Node, pattern: string): boolean {
  const matches = node.getText().match(pattern);
  return matches !== null && matches.length > 0;
}

/**
 * Checks if a node contains the last occurance of a given string in it's own subtree.
 *
 * @param {Node} node - The node to check.
 * @param {string} pattern - The pattern to check against.
 */
export function lastInstanceInTree(node: Node, pattern: string): boolean {
  const matchesCurrent = containsPattern(node, pattern);
  const matchesChild = node.forEachChild((child) =>
    containsPattern(child, pattern),
  );
  return matchesCurrent && !matchesChild;
}

/**
 * Gets the n'th ancestor of a node.
 *
 * @param {Node} node - The current node.
 * @param {number} count - The distance of the ancestor to the current node.
 */
export function getAncestor(node: Node, count: number): Node | undefined {
  const parent = node.getParent();
  if (count <= 1 || !parent) return parent;
  return getAncestor(parent, --count);
}

/**
 * Checks if a node is in a certain scope.
 * Returns the first node that matches the given scope, otherwise undefined.
 *
 * @param {Node} node - The node to check.
 * @param {SyntaxKind} kind - The kind of the scope.
 */
export function inScopeOf(node: Node, kind: SyntaxKind): Node | undefined {
  const parent = node.getParent();
  if (!parent) return undefined;
  if (parent.getKind() === kind) return parent;
  return inScopeOf(parent, kind);
}

/**
 * Checks if the type of the node matches the given pattern.
 *
 * @param {Node} node - The node to check.
 * @param {string} type - The pattern of the type.
 */
export function hasType(node: Node, type: string): boolean {
  const matches = node
    .getType()
    .getText(undefined, TypeFormatFlags.InTypeAlias)
    .match(type);
  return matches !== null && matches.length > 0;
}

/**
 * Checks if a node is accessed from a certain type.
 *
 * @param {Node} node - The node to check.
 * @param {string} type - The pattern of the type.
 */
export function accessedFrom(node: Node, type: string): boolean {
  const accessProp = node.getParentIfKind(SyntaxKind.PropertyAccessExpression);
  if (!accessProp) return false;
  return hasType(accessProp.getExpression(), type);
}
