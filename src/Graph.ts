import { EventEmitter } from 'events';
import { GraphNode } from './GraphNode';
import { IGraph } from './IGraph';
import { GraphEvent } from './GraphEvent';
import { GraphStore } from './GraphStore';

export class Graph<NodeType extends GraphNode, LinkProps>
    extends EventEmitter
    implements IGraph<NodeType, LinkProps> {
    private readonly store = new GraphStore<NodeType, LinkProps>();

    hasNode(node: NodeType): boolean {
        return this.store.hasNode(node);
    }

    hasEdge(source: NodeType, target: NodeType): boolean {
        return this.store.hasEdge(source, target);
    }

    addNode(node: NodeType): void {
        if (this.hasNode(node)) return;
        this.store.addNode(node);
        this.emit('event', { type: 'nodeAdded', node } as GraphEvent<NodeType, LinkProps>);
    }

    removeNode(node: NodeType): void {
        if (!this.hasNode(node)) return;
        this.store.removeNode(node);
        this.emit('event', { type: 'nodeRemoved', node } as GraphEvent<NodeType, LinkProps>);
    }

    addEdge(
        source: NodeType,
        target: NodeType,
        weight: number,
        props: LinkProps,
    ): void {
        if (!this.hasNode(source)) {
            this.emit(
                'event',
                { type: 'missingDependency', parent: source, missingId: source.id } as GraphEvent<
                    NodeType,
                    LinkProps
                >,
            );
            return;
        }
        if (!this.hasNode(target)) {
            this.emit(
                'event',
                { type: 'missingDependency', parent: source, missingId: target.id } as GraphEvent<
                    NodeType,
                    LinkProps
                >,
            );
            return;
        }
        this.store.addEdge(source, target, weight, props);
        this.emit(
            'event',
            { type: 'edgeAdded', source, target, weight, props } as GraphEvent<
                NodeType,
                LinkProps
            >,
        );
    }

    removeEdge(source: NodeType, target: NodeType): void {
        if (!this.hasEdge(source, target)) return;
        this.store.removeEdge(source, target);
        this.emit(
            'event',
            { type: 'edgeRemoved', source, target } as GraphEvent<NodeType, LinkProps>,
        );
    }

    getNeighbours(node: NodeType): ReadonlySet<NodeType> {
        return this.store.getNeighbours(node);
    }

    getEdgeWeight(source: NodeType, target: NodeType): number | undefined {
        return this.store.getEdgeWeight(source, target);
    }

    getNodes(): ReadonlySet<NodeType> {
        return this.store.getNodes(); // TODO: prefer getNodes over nodes. This looks better.
    }
}
