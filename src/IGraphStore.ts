import { GraphNode } from './GraphNode';

export interface IGraphStore<NodeType extends GraphNode, LinkProps> {
    nodes: Set<NodeType>
    edges: Map<string, Set<NodeType>>
    weights: Map<string, Map<string, number>>
    properties: Map<string, Map<string, LinkProps>>
    getNodes(): ReadonlySet<NodeType>; // TODO
}
