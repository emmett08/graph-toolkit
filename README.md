# @emmett08/graph-toolkit

This is a work in progress. 

A TypeScript toolkit providing robust data structures and algorithms for directed and undirected graphs. Designed for performance and extensibility, it adheres to SOLID principles and includes serialisation, traversal, cycle detection, topological sorting and rendering capabilities.

## Features

- **Graph representation**: Nodes, edges, stores and events
- **Cycle detection**: Tarjan’s algorithm and configurable strategies
- **Topological sorting**: Efficient ordering for directed acyclic graphs
- **Rendering**: Utilities to render graph structures programmatically

## Installation

```shell
yarn add @emmett08/graph-toolkit
```

## Build, Lint and Test

Use the following commands during development:

```shell
yarn build
yarn lint
yarn test
```

## Reference

For an authoritative treatment of topological sorting, see:

> A. B. Kahn, “Topological sorting of large networks”, *Communications of the ACM*, **vol. 5, no. 11**, pp. 558–562, Nov 1962. [https://dl.acm.org/doi/10.1145/368996.369025](https://dl.acm.org/doi/10.1145/368996.369025)

## License

MIT © @emmett08
