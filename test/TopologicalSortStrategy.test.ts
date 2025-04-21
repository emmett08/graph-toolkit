import { Graph } from '../src/Graph';
import { TopologicalSortStrategy } from '../src/TopologicalSortStrategy';
import { GraphNode } from '../src/GraphNode';

class TestNode implements GraphNode {
    constructor(public id: string) {}
}

describe('TopologicalSortStrategy', () => {
    let graph: Graph<TestNode, {}>;
    let strategy: TopologicalSortStrategy<TestNode, {}>;

    beforeEach(() => {
        graph = new Graph<TestNode, {}>();
        strategy = new TopologicalSortStrategy<TestNode, {}>();
    });

    it('returns an empty array for an empty graph', () => {
        expect(strategy.traverse(graph)).toEqual([]);
    });

    it('sorts a simple DAG in reverse topological order', () => {
        const n1 = new TestNode('1');
        const n2 = new TestNode('2');
        const n3 = new TestNode('3');

        graph.addNode(n1);
        graph.addNode(n2);
        graph.addNode(n3);
        graph.addEdge(n1, n2, 1, {});
        graph.addEdge(n2, n3, 1, {});

        const order = strategy.traverse(graph).map(n => n.id);
        expect(order).toEqual(['3', '2', '1']);
    });

    it('throws when the graph contains a cycle', () => {
        const a = new TestNode('A');
        const b = new TestNode('B');
        const c = new TestNode('C');

        graph.addNode(a);
        graph.addNode(b);
        graph.addNode(c);
        graph.addEdge(a, b, 1, {});
        graph.addEdge(b, c, 1, {});
        graph.addEdge(c, a, 1, {});

        expect(() => strategy.traverse(graph)).toThrow('Cycle detected');
    });
});
