import {Graph} from "./Graph";
import {CycleDetectionStrategy} from "./CycleDetectionStrategy";
import { GraphNode } from "./GraphNode";

export class TarjanCycleDetection<T extends GraphNode>
    implements CycleDetectionStrategy<T>
{
    private index = 0;
    private indices = new Map<string, number>();
    private lowlinks = new Map<string, number>();
    private stack: T[] = [];
    private onStack = new Set<string>();

    findCycles(graph: Graph<T, any>): T[][] {
        const nodes = Array.from((graph as any).store.nodes as Set<T>);
        this.index = 0;
        this.indices.clear();
        this.lowlinks.clear();
        this.stack = [];
        this.onStack.clear();
        const result: T[][] = [];
        for (const node of nodes) {
            if (!this.indices.has(node.id)) {
                this.strongConnect(node, graph, result);
            }
        }
        return result;
    }

    private strongConnect(v: T, graph: Graph<T, any>, result: T[][]): void {
        this.indices.set(v.id, this.index);
        this.lowlinks.set(v.id, this.index);
        this.index++;
        this.stack.push(v);
        this.onStack.add(v.id);
        for (const w of graph.getNeighbours(v)) {
            if (!this.indices.has(w.id)) {
                this.strongConnect(w, graph, result);
                this.lowlinks.set(
                    v.id,
                    Math.min(this.lowlinks.get(v.id)!, this.lowlinks.get(w.id)!)
                );
            } else if (this.onStack.has(w.id)) {
                this.lowlinks.set(
                    v.id,
                    Math.min(this.lowlinks.get(v.id)!, this.indices.get(w.id)!)
                );
            }
        }

        if (this.lowlinks.get(v.id) === this.indices.get(v.id)) {
            const component: T[] = [];
            let w: T;
            do {
                w = this.stack.pop()!;
                this.onStack.delete(w.id);
                component.push(w);
            } while (w.id !== v.id);
            if (component.length > 1) result.push(component);
        }
    }
}
