import { Graph } from './Graph';
import { GraphNode } from "./GraphNode";

export interface CycleDetectionStrategy<T extends GraphNode> {
    findCycles(graph: Graph<T, any>): T[][];
}
