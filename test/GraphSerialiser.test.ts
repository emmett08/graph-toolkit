import { Graph } from '../src/Graph';
import { GraphSerialiser } from '../src/GraphSerialiser';
import { GraphNode } from '../src/GraphNode';
import { SerialisedGraph } from '../src/SerialisedGraph';

class TestNode implements GraphNode {
    constructor(public id: string) {}
}

describe('GraphSerialiser', () => {
    let serialiser: GraphSerialiser<TestNode, { label: string }>;

    beforeEach(() => {
        serialiser = new GraphSerialiser();
    });

    it('serialises a graph with nodes and edges', () => {
        const n1 = new TestNode('1');
        const n2 = new TestNode('2');
        const graph = new Graph<TestNode, { label: string }>();
        graph.addNode(n1);
        graph.addNode(n2);
        graph.addEdge(n1, n2, 5, { label: 'foo' });

        const result = serialiser.serialise(graph);

        expect(result.nodes.map(n => n.id)).toEqual(['1', '2']);
        expect(result.edges).toHaveLength(1);
        expect(result.edges[0]).toEqual({
            source: '1',
            target: '2',
            weight: 5,
            props: { label: 'foo' },
        });
    });

    it('deserialises data into an equivalent graph', () => {
        const n1 = new TestNode('1');
        const n2 = new TestNode('2');
        const data: SerialisedGraph<TestNode, { label: string }> = {
            nodes: [n1, n2],
            edges: [
                { source: '1', target: '2', weight: 7, props: { label: 'bar' } },
            ],
        };

        const graph = serialiser.deserialise(data);

        const neighboursSet = graph.getNeighbours(n1);
        const neighbours   = Array.from(neighboursSet);
        expect(neighbours.map(n => n.id)).toEqual(['2']);
    });
});
