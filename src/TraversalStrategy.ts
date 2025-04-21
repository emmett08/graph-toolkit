import { EventEmitter } from 'events'
import { Graph } from "./Graph";
import { GraphNode } from './GraphNode';

export interface TraversalStrategy<NodeType extends GraphNode, L> extends EventEmitter {
    traverse(graph: Graph<NodeType, L>): Iterable<NodeType>
}
