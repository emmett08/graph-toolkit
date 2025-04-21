import {Graph} from "./Graph";
import { TraversalStrategy } from "./TraversalStrategy";
import { GraphNode } from './GraphNode';

// TODO: Use NodeType for domain‑specific code as this really isn't an all-purpose library
export class GraphTraversal<T extends GraphNode, L> {
    constructor(
        private readonly graph: Graph<T, L>,
        private readonly strategy: TraversalStrategy<T, L>
    ) {}

    execute(): T[] {
        return [...this.strategy.traverse(this.graph)]
    }
}
