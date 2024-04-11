##  Overview

Utility functions for traversing or querying the [Graphology](https://graphology.github.io/) graph data structure.

See [typedocs](https://tbui17.github.io/graph-functions/) and [tests folder](https://github.com/tbui17/graph-functions/tree/main/src/tests) for details of available utilities.

---

##  Repository Structure



```sh
└── graph-functions/
    ├── .changeset
    │   └── config.json
    ├── .eslintrc.cjs
    ├── .github
    │   └── workflows
    │       ├── main.yml
    │       └── publish.yml
    ├── index.ts
    ├── package.json
    ├── pnpm-lock.yaml
    ├── prettier.config.mjs
    ├── src
    │   ├── edges
    │   │   ├── filterEdgeEntries.ts
    │   │   ├── getEdgeEntry.ts
    │   │   ├── getGraphEdgesOfType.ts
    │   │   ├── getParallelEdgeEntries.ts
    │   │   ├── index.ts
    │   │   ├── mapFilterEdges.ts
    │   │   ├── mappers.ts
    │   │   ├── realignGraphEdges.ts
    │   │   └── types.ts
    │   ├── index.ts
    │   ├── nodes
    │   │   ├── filterNodeEntries.ts
    │   │   ├── getGraphNodesOfType.ts
    │   │   ├── getNodeEntry.ts
    │   │   ├── index.ts
    │   │   ├── mapFilterNodes.ts
    │   │   └── types.ts
    │   ├── recursors
    │   │   ├── bfs.ts
    │   │   ├── index.ts
    │   │   ├── RecursorContext.ts
    │   │   └── TraversalStateManager.ts
    │   ├── toUndirectedKeepEdgeNames.ts
    │   ├── types.ts
    │   └── unweightedSteinerSubgraph.ts
    └── tsconfig.json
```

---

##  Modules

<details closed><summary>.</summary>

| File                                                                                             | Summary                                                                                                                                                                                                                                                                                                  |
| ---                                                                                              | ---                                                                                                                                                                                                                                                                                                      |
| [.eslintrc.cjs](https://github.com/tbui17/graph-functions/blob/master/.eslintrc.cjs)             | The code snippet configures eslint for TypeScript enforcement in a library focused on graph data structure manipulation.                                                                                                                                                                                 |
| [index.ts](https://github.com/tbui17/graph-functions/blob/master/index.ts)                       | The `index.ts` file acts as an entry point, re-exporting functionalities from the source internals, aligning with the repository's focus on graph data structure manipulations.                                                                                                                          |
| [package.json](https://github.com/tbui17/graph-functions/blob/master/package.json)               | This codebase provides graph manipulation and traversal utilities as a library, with functions focusing on nodes, edges, and recursive searches within graph data structures. It's built in TypeScript, follows modern JS ecosystem practices, and includes automated workflows for testing and release. |
| [pnpm-lock.yaml](https://github.com/tbui17/graph-functions/blob/master/pnpm-lock.yaml)           | This code snippet is part of a graph-related utilities library, managing configurations for changesets, linting, and continuous integration workflows, focusing on automated code quality and publishing processes.                                                                                      |
| [prettier.config.mjs](https://github.com/tbui17/graph-functions/blob/master/prettier.config.mjs) | The `prettier.config.mjs` configures code formatting for the graph-related function library, ensuring consistent styling across the repository.                                                                                                                                                          |
| [tsconfig.json](https://github.com/tbui17/graph-functions/blob/master/tsconfig.json)             | The `tsconfig.json` sets TypeScript compiler options for strict type-checking and ESNext features, optimizing the graph library for robust development.                                                                                                                                                  |

</details>

<details closed><summary>.changeset</summary>

| File                                                                                        | Summary                                                                                                                                                    |
| ---                                                                                         | ---                                                                                                                                                        |
| [config.json](https://github.com/tbui17/graph-functions/blob/master/.changeset\config.json) | The code manages a graph utility library within a Node.js ecosystem, automating changelog generation and enforcing consistent code style and CI workflows. |

</details>

<details closed><summary>.github.workflows</summary>

| File                                                                                               | Summary                                                                                                                                           |
| ---                                                                                                | ---                                                                                                                                               |
| [main.yml](https://github.com/tbui17/graph-functions/blob/master/.github\workflows\main.yml)       | Continuous Integration setup for graph-functions repo, automating tests, linting, and build on push to any branch.                                |
| [publish.yml](https://github.com/tbui17/graph-functions/blob/master/.github\workflows\publish.yml) | The publish.yml workflow automates package deployment when the main branch updates or CI succeeds, using concurrency to manage simultaneous runs. |

</details>

<details closed><summary>src</summary>

| File                                                                                                                   | Summary                                                                                                                                                                                   |
| ---                                                                                                                    | ---                                                                                                                                                                                       |
| [index.ts](https://github.com/tbui17/graph-functions/blob/master/src\index.ts)                                         | The `src/index.ts` serves as the central export hub for the graph-functions library, consolidating utilities for graph edges, nodes, traversal algorithms, and specific graph operations. |
| [toUndirectedKeepEdgeNames.ts](https://github.com/tbui17/graph-functions/blob/master/src\toUndirectedKeepEdgeNames.ts) | This snippet provides a utility within the graph-functions module to convert directed graphs to undirected while preserving edge key names.                                               |
| [types.ts](https://github.com/tbui17/graph-functions/blob/master/src\types.ts)                                         | Types module for a graph-oriented library, provides type inference for nodes, edges, and graph attributes based on the Graphology library's types.                                        |
| [unweightedSteinerSubgraph.ts](https://github.com/tbui17/graph-functions/blob/master/src\unweightedSteinerSubgraph.ts) | This code provides a function to compute the unweighted Steiner subgraph in a graph architecture, ensuring it contains specified nodes and handles disconnections with a custom error.    |

</details>

<details closed><summary>src.edges</summary>

| File                                                                                                                   | Summary                                                                                                                                                                                                                 |
| ---                                                                                                                    | ---                                                                                                                                                                                                                     |
| [filterEdgeEntries.ts](https://github.com/tbui17/graph-functions/blob/master/src\edges\filterEdgeEntries.ts)           | The `filterEdgeEntries.ts` file provides a utility to filter edges in a graph based on specified criteria, crucial for graph traversal and manipulation within the graph-functions library.                             |
| [getEdgeEntry.ts](https://github.com/tbui17/graph-functions/blob/master/src\edges\getEdgeEntry.ts)                     | The `getEdgeEntry` function retrieves detailed data for a graph edge, integral to edge-related operations in the graph-processing library.                                                                              |
| [getGraphEdgesOfType.ts](https://github.com/tbui17/graph-functions/blob/master/src\edges\getGraphEdgesOfType.ts)       | The `getGraphEdgesOfType.ts` module provides utilities to filter and retrieve edges from a graph data structure based on type specifications, integral to the graph-functions library's edge manipulation capabilities. |
| [getParallelEdgeEntries.ts](https://github.com/tbui17/graph-functions/blob/master/src\edges\getParallelEdgeEntries.ts) | This module identifies and groups parallel edges within a graph data structure, utilizing the graphology library and lodash for processing.                                                                             |
| [index.ts](https://github.com/tbui17/graph-functions/blob/master/src\edges\index.ts)                                   | The file serves as a central export hub for edge-related utilities in a graph manipulation library.                                                                                                                     |
| [mapFilterEdges.ts](https://github.com/tbui17/graph-functions/blob/master/src\edges\mapFilterEdges.ts)                 | The snippet provides utility functions for mapping and filtering a graph's edges based on custom criteria, crucial for graph manipulation within the architecture.                                                      |
| [mappers.ts](https://github.com/tbui17/graph-functions/blob/master/src\edges\mappers.ts)                               | The code provides edge transformation utilities within a graph manipulation library, aligning edges and mapping iteration parameters to standardized structures.                                                        |
| [realignGraphEdges.ts](https://github.com/tbui17/graph-functions/blob/master/src\edges\realignGraphEdges.ts)           | The code provides functionality to realign graph edges within a graph data structure, based on node types or custom filters, altering the graph's edge directionality.                                                  |
| [types.ts](https://github.com/tbui17/graph-functions/blob/master/src\edges\types.ts)                                   | Defines edge-related TypeScript types for graph manipulation functions, integral to enforcing type safety and facilitating edge operations within the graph library.                                                    |

</details>

<details closed><summary>src.nodes</summary>

| File                                                                                                             | Summary                                                                                                                                                                                                  |
| ---                                                                                                              | ---                                                                                                                                                                                                      |
| [filterNodeEntries.ts](https://github.com/tbui17/graph-functions/blob/master/src\nodes\filterNodeEntries.ts)     | This code provides a utility to filter nodes in a graph, returning nodes that meet criteria defined by a provided filter function. It's part of a graph manipulation library.                            |
| [getGraphNodesOfType.ts](https://github.com/tbui17/graph-functions/blob/master/src\nodes\getGraphNodesOfType.ts) | The `getGraphNodesOfType.ts` provides functionality for retrieving nodes by type from a graph, supporting both individual and multiple type queries.                                                     |
| [getNodeEntry.ts](https://github.com/tbui17/graph-functions/blob/master/src\nodes\getNodeEntry.ts)               | This snippet defines `getNodeEntry`, a utility fetching node details from a graph, pivotal for node data retrieval within the graph library.                                                             |
| [index.ts](https://github.com/tbui17/graph-functions/blob/master/src\nodes\index.ts)                             | This code serves as an export hub for node-related functionalities within a graph manipulation library, streamlining the repository's module structure.                                                  |
| [mapFilterNodes.ts](https://github.com/tbui17/graph-functions/blob/master/src\nodes\mapFilterNodes.ts)           | The `mapFilterNodes.ts` module provides a utility for transforming and selectively including nodes from a graph based on custom logic defined in a mapper function, within a graph manipulation library. |
| [types.ts](https://github.com/tbui17/graph-functions/blob/master/src\nodes\types.ts)                             | Defines types for node-related operations in a graph architecture, focusing on type-based filtering and retrieval.                                                                                       |

</details>

<details closed><summary>src.recursors</summary>

| File                                                                                                                     | Summary                                                                                                                                                                                                                |
| ---                                                                                                                      | ---                                                                                                                                                                                                                    |
| [bfs.ts](https://github.com/tbui17/graph-functions/blob/master/src\recursors\bfs.ts)                                     | This code provides a breadth-first search (BFS) utility for traversing graphs, handling directed/undirected and partial traversals with customizable neighbor iteration strategies within the graph-functions library. |
| [index.ts](https://github.com/tbui17/graph-functions/blob/master/src\recursors\index.ts)                                 | The `src/recursors/index.ts` centralizes exports of graph traversal functionalities for the graph utility library.                                                                                                     |
| [RecursorContext.ts](https://github.com/tbui17/graph-functions/blob/master/src\recursors\RecursorContext.ts)             | The `RecursorContext` class provides a context for graph traversal operations within the graph-functions library, managing node and edge data access and manipulation for specific graph recursion scenarios.          |
| [TraversalStateManager.ts](https://github.com/tbui17/graph-functions/blob/master/src\recursors\TraversalStateManager.ts) | The `TraversalStateManager` manages state for graph traversal algorithms, tracking visited nodes, paths, and handling cycles within the `graph-functions` library.                                                     |

</details>

---


### NPM Installation

```sh
npm install @tbui17/graph-functions
```

###  Installation

1. Clone the graph-functions repository:

```sh
git clone https://github.com/tbui17/graph-functions
```

2. Change to the project directory:

```sh
cd graph-functions
```

3. Install the dependencies:

```sh
npm install
```

###  Tests

To execute tests, run:

```sh
npm test
```

---

##  License

MIT
