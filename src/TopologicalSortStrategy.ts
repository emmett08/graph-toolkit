import { EventEmitter } from 'events'
import { Graph } from "./Graph";
import { TraversalStrategy } from "./TraversalStrategy";
import { GraphNode } from './GraphNode';

export class TopologicalSortStrategy<NodeType extends GraphNode, L>
    extends EventEmitter
    implements TraversalStrategy<NodeType, L>
{
    constructor() {
        super()
    }

    traverse(graph: Graph<NodeType, L>): NodeType[] {
        const result: NodeType[] = [];
        const visited = new Set<NodeType>();
        const temp   = new Set<NodeType>();

        function visit(n: NodeType) {
            if (temp.has(n)) throw new Error("Cycle detected");
            if (!visited.has(n)) {
                temp.add(n);
                graph.getNeighbours(n).forEach(visit);
                temp.delete(n);
                visited.add(n);
                result.push(n);
            }
        }

        graph.getNodes().forEach(n => {
            if (!visited.has(n)) visit(n);
        });

        return result;
    }
}
