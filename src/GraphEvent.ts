import {GraphNode} from "./GraphNode";

export type GraphEvent<NodeType extends GraphNode, LinkProps> =
    | { type: 'nodeAdded'; node: NodeType }
    | { type: 'nodeRemoved'; node: NodeType }
    | { type: 'edgeAdded'; source: NodeType; target: NodeType; weight: number; props: LinkProps }
    | { type: 'edgeRemoved'; source: NodeType; target: NodeType }
    | { type: 'missingDependency'; parent: NodeType; missingId: string };
