import { GraphNode } from './GraphNode';

export interface IGraph<T extends GraphNode, L> {
    addNode(node: T): void
    removeNode(node: T): void
    addEdge(source: T, target: T, weight: number, props: L): void
    removeEdge(source: T, target: T): void
    hasNode(node: T): boolean
    hasEdge(source: T, target: T): boolean
    getNeighbours(node: T): ReadonlySet<T>
    getEdgeWeight(source: T, target: T): number | undefined
    getNodes(): ReadonlySet<T>;
}
