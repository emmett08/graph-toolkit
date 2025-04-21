import { GraphTraversal } from '../src/GraphTraversal';
import { Graph } from '../src/Graph';
import { TraversalStrategy } from '../src/TraversalStrategy';
import { GraphNode } from '../src/GraphNode';
import { TopologicalSortStrategy } from '../src/TopologicalSortStrategy';
import { EventEmitter } from 'events';

class TestNode implements GraphNode {
    constructor(public id: string) {}
}

class MockStrategy
    extends EventEmitter
    implements TraversalStrategy<TestNode, any>
{
    traverse = jest.fn<TestNode[], [Graph<TestNode, any>]>()
}

describe('GraphTraversal', () => {
    let graph: Graph<TestNode, any>;
    let strategy: TraversalStrategy<TestNode, any>;
    let traversal: GraphTraversal<TestNode, any>;

    beforeEach(() => {
        graph = new Graph<TestNode, any>();
        strategy  = new MockStrategy()
        traversal = new GraphTraversal(graph, strategy);
    });

    it('calls strategy.traverse with the start node and graph, returning its result', () => {
        const start = new TestNode('start');
        const expected: TestNode[] = [start];
        (strategy.traverse as jest.Mock).mockReturnValue(expected);

        const result = traversal.execute();

        expect(strategy.traverse).toHaveBeenCalledWith(graph);
        expect(result).toStrictEqual(expected);
    });

    it('integrates with a real strategy and graph (topological-sort)', () => {
        const n1 = new TestNode('1');
        const n2 = new TestNode('2');
        const n3 = new TestNode('3');

        graph.addNode(n1);
        graph.addNode(n2);
        graph.addNode(n3);

        graph.addEdge(n1, n2, 1, {});
        graph.addEdge(n2, n3, 1, {});

        traversal = new GraphTraversal(graph, new TopologicalSortStrategy<TestNode, any>());

        const order = traversal.execute().map(n => n.id);
        expect(order).toEqual(['3', '2', '1']);
    });
});
