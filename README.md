# @data-structures/graph-toolkit

A TypeScript toolkit providing robust data structures and algorithms for directed and undirected graphs. Designed for performance and extensibility, it adheres to SOLID principles and includes serialisation, traversal, cycle detection, topological sorting and rendering capabilities.

## Features

- **Graph representation**: Nodes, edges, stores and events
- **Traversal strategies**: Depth-first, breadth-first and custom strategies
- **Cycle detection**: Tarjan’s algorithm and configurable strategies
- **Topological sorting**: Efficient ordering for directed acyclic graphs
- **Serialisation**: Convert graphs to/from JSON-ready formats
- **Rendering**: Utilities to render graph structures programmatically

## Installation

```shell
# Install via Yarn
yarn add @data-structures/graph-toolkit
```

## Build, Lint and Test

Use the following commands during development:

```shell
yarn build
yarn lint
yarn test
```

## Publishing

When you’re ready to release a new version:

```shell
yarn npm login
yarn npm publish --access public
```

## Usage

```ts
import { Graph, GraphTraversal, TopologicalSortStrategy } from '@data-structures/graph-toolkit';

// Create a directed graph
const graph = new Graph<string>();

// Add nodes and edges
graph.addNode('A');
graph.addNode('B');
graph.addEdge('A', 'B');

// Topological sort
const sorter = new GraphTraversal(graph, new TopologicalSortStrategy<string>());
const order = sorter.traverse();
console.log(order); // e.g. ['A', 'B']
```

## Reference

For an authoritative treatment of topological sorting, see:

> A. B. Kahn, “Topological sorting of large networks”, *Communications of the ACM*, **vol. 5, no. 11**, pp. 558–562, Nov 1962. [https://dl.acm.org/doi/10.1145/368996.369025](https://dl.acm.org/doi/10.1145/368996.369025)

## License

MIT © @emmett08
