import { Graph } from "../src/Graph";
import { GraphNode } from "../src/GraphNode";
import { TarjanCycleDetection } from "../src/TarjanCycleDetection";

class TestNode implements GraphNode {
    constructor(public id: string) {}
}

describe("TarjanCycleDetection", () => {
    let graph: Graph<TestNode, {}>;
    let detector: TarjanCycleDetection<TestNode>;

    beforeEach(() => {
        graph = new Graph<TestNode, {}>();
        detector = new TarjanCycleDetection<TestNode>();
    });

    it("returns empty array for acyclic graph", () => {
        const a = new TestNode("A");
        const b = new TestNode("B");
        graph.addNode(a);
        graph.addNode(b);
        graph.addEdge(a, b, 1, {});

        const cycles = detector.findCycles(graph);
        expect(cycles).toEqual([]);
    });

    it("detects a simple 2-node cycle regardless of order", () => {
        const a = new TestNode("A");
        const b = new TestNode("B");
        graph.addNode(a);
        graph.addNode(b);
        graph.addEdge(a, b, 1, {});
        graph.addEdge(b, a, 1, {});

        const cycles = detector.findCycles(graph);
        expect(cycles).toHaveLength(1);
        expect(cycles[0]).toEqual(expect.arrayContaining([a, b]));
        expect(cycles[0]).toHaveLength(2);
    });

    it("detects a 3-node cycle regardless of order", () => {
        const a = new TestNode("A");
        const b = new TestNode("B");
        const c = new TestNode("C");
        graph.addNode(a);
        graph.addNode(b);
        graph.addNode(c);
        graph.addEdge(a, b, 1, {});
        graph.addEdge(b, c, 1, {});
        graph.addEdge(c, a, 1, {});

        const cycles = detector.findCycles(graph);
        expect(cycles).toHaveLength(1);
        expect(cycles[0]).toEqual(expect.arrayContaining([a, b, c]));
        expect(cycles[0]).toHaveLength(3);
    });

    it("detects multiple independent cycles regardless of order of nodes", () => {
        const a = new TestNode("A");
        const b = new TestNode("B");
        const c = new TestNode("C");
        const d = new TestNode("D");
        graph.addNode(a);
        graph.addNode(b);
        graph.addNode(c);
        graph.addNode(d);
        graph.addEdge(a, b, 1, {});
        graph.addEdge(b, a, 1, {});
        graph.addEdge(c, d, 1, {});
        graph.addEdge(d, c, 1, {});

        const cycles = detector.findCycles(graph);
        expect(cycles).toHaveLength(2);
        expect(cycles).toEqual(
            expect.arrayContaining([
                expect.arrayContaining([a, b]),
                expect.arrayContaining([c, d])
            ])
        );
    });
});
