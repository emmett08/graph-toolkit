import {GraphNode} from "./GraphNode";
import {IGraphStore} from "./IGraphStore";

export class GraphStore<NodeType extends GraphNode, LinkProps> implements IGraphStore<NodeType, LinkProps> {
    readonly nodes = new Set<NodeType>();
    readonly edges = new Map<string, Set<NodeType>>();
    readonly weights = new Map<string, Map<string, number>>();
    readonly properties = new Map<string, Map<string, LinkProps>>();

    hasNode(node: NodeType) { return this.nodes.has(node) }
    hasEdge(source: NodeType, target: NodeType) {
        return this.edges.get(source.id)?.has(target) ?? false;
    }

    addNode(node: NodeType) {
        this.nodes.add(node);
    }

    removeNode(node: NodeType) {
        this.nodes.delete(node);
        this.edges.delete(node.id);
        this.weights.delete(node.id);
        this.properties.delete(node.id);
        for (const neighbours of this.edges.values()) {
            neighbours.forEach(n => { if (n.id === node.id) neighbours.delete(n) })
        }
    }

    addEdge(source: NodeType, target: NodeType, weight: number, props: LinkProps) {
        if (!this.edges.has(source.id)) this.edges.set(source.id, new Set())
        this.edges.get(source.id)!.add(target);

        if (!this.weights.has(source.id)) this.weights.set(source.id, new Map())
        this.weights.get(source.id)!.set(target.id, weight)

        if (!this.properties.has(source.id)) this.properties.set(source.id, new Map())
        this.properties.get(source.id)!.set(target.id, props)
    }

    removeEdge(source: NodeType, target: NodeType) {
        this.edges.get(source.id)?.delete(target)
        this.weights.get(source.id)?.delete(target.id)
        this.properties.get(source.id)?.delete(target.id)
    }

    getNeighbours(node: NodeType): ReadonlySet<NodeType> {
        return this.edges.get(node.id) ?? new Set()
    }

    getEdgeWeight(source: NodeType, target: NodeType): number | undefined {
        return this.weights.get(source.id)?.get(target.id)
    }

    getNodes(): ReadonlySet<NodeType> {
        return this.nodes;
    }
}
