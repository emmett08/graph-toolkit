import { Graph } from "./Graph";
import { Edge } from './Edge';
import { GraphNode } from './GraphNode';
import { SerialisedGraph } from './SerialisedGraph';

export class GraphSerialiser<NodeType extends GraphNode, LinkProps> {
    serialise(graph: Graph<NodeType, LinkProps>): SerialisedGraph<NodeType, LinkProps> {
        const sm = graph as any;
        const nodes = Array.from(sm.store.nodes as Set<NodeType>)
        const edges: Edge<LinkProps>[] = []

        for (const src of nodes) {
            for (const tgt of graph.getNeighbours(src)) {
                edges.push({
                    source: src.id,
                    target: tgt.id,
                    weight: graph.getEdgeWeight(src, tgt),
                    props: sm.store.properties.get(src.id)!.get(tgt.id)!,
                })
            }
        }

        return { nodes, edges }
    }

    deserialise(data: SerialisedGraph<NodeType, LinkProps>) {
        const g = new Graph<NodeType, LinkProps>()
        const map = new Map(data.nodes.map(n => [n.id, n] as const))
        data.nodes.forEach(n => g.addNode(n))
        data.edges.forEach(e => {
            const s = map.get(e.source), t = map.get(e.target)
            if (s && t) g.addEdge(s, t, e.weight ?? 1, e.props)
        })
        return g
    }
}