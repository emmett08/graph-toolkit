/**
 * @jest-environment jsdom
 */

import { EventEmitter } from 'events'
import { Graph } from '../src/Graph'
import { GraphRenderer, animateWithStrategy } from '../src/GraphRenderer'
import { TraversalStrategy } from '../src/TraversalStrategy'
import { TopologicalSortStrategy } from '../src/TopologicalSortStrategy'
import { GraphNode } from '../src/GraphNode'

class TestNode implements GraphNode {
    constructor(public id: string) {}
}

class DummyStrategy
    extends EventEmitter
    implements TraversalStrategy<TestNode, any>
{
    traverse = jest.fn().mockReturnValue([] as TestNode[])
}

describe('GraphRenderer', () => {
    let container: HTMLElement
    let graph: Graph<TestNode, any>
    let strategy: DummyStrategy
    let renderer: GraphRenderer<TestNode, any>

    beforeEach(() => {
        container = document.createElement('div')
        Object.defineProperty(container, 'clientWidth', { value: 200 })
        Object.defineProperty(container, 'clientHeight', { value: 200 })

        graph     = new Graph<TestNode, any>()
        strategy  = new DummyStrategy()
        renderer  = new GraphRenderer(container, graph, strategy)
    })

    it('renders no nodes or edges initially', () => {
        expect(container.querySelectorAll('circle').length).toBe(0)
        expect(container.querySelectorAll('line').length).toBe(0)
    })

    it('adds a circle when a node is added', () => {
        const n1 = new TestNode('A')
        graph.addNode(n1)
        const circles = container.querySelectorAll('circle')
        expect(circles.length).toBe(1)
        expect(circles[0].getAttribute('cx')).not.toBeNull()
        expect(circles[0].getAttribute('cy')).not.toBeNull()
    })

    it('adds a line when an edge is added', () => {
        const n1 = new TestNode('A')
        const n2 = new TestNode('B')
        graph.addNode(n1)
        graph.addNode(n2)
        graph.addEdge(n1, n2, 1, {})
        const lines = container.querySelectorAll('line')
        expect(lines.length).toBe(1)
        expect(lines[0].getAttribute('x1')).not.toBeNull()
        expect(lines[0].getAttribute('x2')).not.toBeNull()
    })

    it('highlights the correct node on strategy step', () => {
        const n1 = new TestNode('X')
        graph.addNode(n1)
        renderer['render']()
        strategy.emit('step', { node: n1 })
        const circle = container.querySelector('circle')!
        expect(circle.getAttribute('fill')).toBe('orange')
    })

    it('clears highlight on strategy end', () => {
        const n1 = new TestNode('X')
        graph.addNode(n1)
        renderer['render']()
        strategy.emit('step', { node: n1 })
        expect(container.querySelector('circle')!.getAttribute('fill')).toBe('orange')
        strategy.emit('end')
        expect(container.querySelector('circle')!.getAttribute('fill')).toBe('white')
    })
})

describe('animateWithStrategy', () => {
    let graph: Graph<TestNode, any>
    let strategy: { traverse: jest.Mock }

    beforeEach(() => {
        graph    = new Graph<TestNode, any>()
        strategy = { traverse: jest.fn() }
    })

    it('calls traverse and waits the correct delays between steps', async () => {
        jest.useFakeTimers()

        const n1 = new TestNode('1')
        const n2 = new TestNode('2')
        function* gen() {
            yield n1
            yield n2
        }
        (strategy.traverse as jest.Mock).mockReturnValue(gen())

        const promise = animateWithStrategy(
            graph,
            (strategy as unknown) as TopologicalSortStrategy<TestNode, any>,
            1000
        )

        expect(strategy.traverse).toHaveBeenCalledWith(graph)

        jest.advanceTimersByTime(1000)
        await Promise.resolve()

        jest.advanceTimersByTime(1000)
        await Promise.resolve()

        await expect(promise).resolves.toBeUndefined()
        jest.useRealTimers()
    })
})
