import { GraphNode } from './GraphNode';

export interface ResourceNode<T> extends GraphNode {
    data: T;
    dependencies: string[];
}
