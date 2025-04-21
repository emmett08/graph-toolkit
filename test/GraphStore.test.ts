import { GraphStore } from '../src/GraphStore';
import { GraphNode } from '../src/GraphNode';

interface Props {
    label: string;
}

class TestNode implements GraphNode {
    constructor(public id: string) {}
}

describe('GraphStore', () => {
    let store: GraphStore<TestNode, Props>;
    let a: TestNode;
    let b: TestNode;
    let c: TestNode;
    const props: Props = { label: 'edge' };
    const weight = 42;

    beforeEach(() => {
        store = new GraphStore<TestNode, Props>();
        a = new TestNode('A');
        b = new TestNode('B');
        c = new TestNode('C');
    });

    it('is empty initially', () => {
        expect(store.hasNode(a)).toBe(false);
        expect(store.hasEdge(a, b)).toBe(false);
        expect(store.getNeighbours(a)).toEqual(new Set());
        expect(store.getEdgeWeight(a, b)).toBeUndefined();
    });

    it('adds and recognises nodes', () => {
        store.addNode(a);
        expect(store.hasNode(a)).toBe(true);
    });

    it('removes nodes and cleans up edges, weights, props', () => {
        // set up edges A->B and C->A
        store.addNode(a);
        store.addNode(b);
        store.addNode(c);
        store.addEdge(a, b, weight, props);
        store.addEdge(c, a, weight, props);

        // sanity checks
        expect(Array.from(store.getNeighbours(a))).toEqual([b]);
        expect(store.getNeighbours(c)).toEqual(new Set([a]));
        expect(store.getEdgeWeight(a, b)).toBe(weight);
        expect(store.getEdgeWeight(c, a)).toBe(weight);

        // remove A
        store.removeNode(a);

        expect(store.hasNode(a)).toBe(false);
        expect(store.hasEdge(a, b)).toBe(false);
        expect(store.getEdgeWeight(a, b)).toBeUndefined();
        expect(store.getNeighbours(a)).toEqual(new Set());
        // C->A should be removed
        expect(store.getNeighbours(c)).toEqual(new Set());
    });

    it('adds edges, creating internal maps as needed', () => {
        store.addEdge(a, b, weight, props);
        expect(store.hasEdge(a, b)).toBe(true);

        const neighbours = Array.from(store.getNeighbours(a));
        expect(neighbours).toEqual([b]);

        expect(store.getEdgeWeight(a, b)).toBe(weight);

        // properties map is internal, but we can re-serialise to inspect:
        // simulate: serialise from store
        const rawProps = (store as any).properties.get(a.id)!.get(b.id);
        expect(rawProps).toEqual(props);
    });

    it('removes edges correctly', () => {
        store.addEdge(a, b, weight, props);
        expect(store.hasEdge(a, b)).toBe(true);

        store.removeEdge(a, b);
        expect(store.hasEdge(a, b)).toBe(false);
        expect(store.getEdgeWeight(a, b)).toBeUndefined();
        expect(store.getNeighbours(a)).toEqual(new Set());
    });
});
