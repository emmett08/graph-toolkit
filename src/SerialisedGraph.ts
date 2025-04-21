import {Edge} from "./Edge";
import {GraphNode} from './GraphNode';

export interface SerialisedGraph<NodeType extends GraphNode, LinkProps> {
    nodes: NodeType[]
    edges: Edge<LinkProps>[]
}
