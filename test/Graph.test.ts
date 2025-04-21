import { Graph } from '../src/Graph';
import { GraphNode } from '../src/GraphNode';

class TestNode implements GraphNode {
    constructor(public id: string) {}
}

describe('Graph', () => {
    let graph: Graph<TestNode, { label: string }>;
    const props = { label: 'edge' };
    const weight = 10;
    let listener: jest.Mock;

    beforeEach(() => {
        graph = new Graph<TestNode, { label: string }>();
        listener = jest.fn();
        graph.on('event', listener);
    });

    it('initially has no nodes or edges', () => {
        const node = new TestNode('1');
        expect(graph.hasNode(node)).toBe(false);
        expect(graph.hasEdge(node, node)).toBe(false);
    });

    it('adds nodes and emits nodeAdded once', () => {
        const node = new TestNode('1');
        graph.addNode(node);
        expect(graph.hasNode(node)).toBe(true);
        expect(listener).toHaveBeenCalledWith({ type: 'nodeAdded', node });
        listener.mockClear();
        graph.addNode(node);
        expect(listener).not.toHaveBeenCalled();
    });

    it('removes nodes and emits nodeRemoved once', () => {
        const node = new TestNode('1');
        graph.addNode(node);
        listener.mockClear();
        graph.removeNode(node);
        expect(graph.hasNode(node)).toBe(false);
        expect(listener).toHaveBeenCalledWith({ type: 'nodeRemoved', node });
        listener.mockClear();
        graph.removeNode(node);
        expect(listener).not.toHaveBeenCalled();
    });

    it('emits missingDependency when adding edge with missing nodes', () => {
        const n1 = new TestNode('1');
        const n2 = new TestNode('2');
        graph.addEdge(n1, n2, weight, props);
        expect(listener).toHaveBeenCalledWith({ type: 'missingDependency', parent: n1, missingId: '1' });
        listener.mockClear();
        graph.addNode(n1);
        graph.addEdge(n1, n2, weight, props);
        expect(listener).toHaveBeenCalledWith({ type: 'missingDependency', parent: n1, missingId: '2' });
    });

    it('adds edges and emits edgeAdded', () => {
        const n1 = new TestNode('1');
        const n2 = new TestNode('2');
        graph.addNode(n1);
        graph.addNode(n2);
        listener.mockClear();
        graph.addEdge(n1, n2, weight, props);

        expect(graph.hasEdge(n1, n2)).toBe(true);
        expect(graph.getEdgeWeight(n1, n2)).toBe(weight);

        const neighbours = Array.from(graph.getNeighbours(n1));
        expect(neighbours).toEqual([n2]);
        expect(listener).toHaveBeenCalledWith({
            type: 'edgeAdded',
            source: n1,
            target: n2,
            weight,
            props,
        });
    });

    it('removes edges and emits edgeRemoved', () => {
        const n1 = new TestNode('1');
        const n2 = new TestNode('2');
        graph.addNode(n1);
        graph.addNode(n2);
        graph.addEdge(n1, n2, weight, props);
        listener.mockClear();
        graph.removeEdge(n1, n2);

        expect(graph.hasEdge(n1, n2)).toBe(false);
        expect(listener).toHaveBeenCalledWith({ type: 'edgeRemoved', source: n1, target: n2 });
        listener.mockClear();
        graph.removeEdge(n1, n2);
        expect(listener).not.toHaveBeenCalled();
    });
});
