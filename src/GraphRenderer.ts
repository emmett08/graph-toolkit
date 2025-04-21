import { Graph } from './Graph'
import { GraphEvent } from './GraphEvent'
import { GraphNode } from './GraphNode'
import { TraversalStrategy } from './TraversalStrategy';
import { TopologicalSortStrategy } from './TopologicalSortStrategy';

const SVG_NS = 'http://www.w3.org/2000/svg'

export class GraphRenderer<NodeType extends GraphNode, LinkProps> {
    private svg: SVGSVGElement
    private container: HTMLElement

    constructor(
        container: HTMLElement,
        private graph: Graph<NodeType, LinkProps>,
        private strategy: TraversalStrategy<NodeType, LinkProps>
    ) {
        this.container = container
        this.svg       = document.createElementNS(SVG_NS, 'svg')
        container.appendChild(this.svg)

        graph.on('event', (e: GraphEvent<NodeType, LinkProps>) =>
            this.handleGraphEvent(e)
        )

        this.strategy.on('step', ({ node }) => this.highlight(node))
        this.strategy.on('end',  ()       => this.clearHighlight())

        window.addEventListener('resize', () => this.render())
        this.render()
    }

    private handleGraphEvent(evt: GraphEvent<NodeType, LinkProps>): void {
        switch (evt.type) {
            case 'nodeAdded':
            case 'nodeRemoved':
            case 'edgeAdded':
            case 'edgeRemoved':
            case 'missingDependency':
                this.render()
                break
        }
    }

    private render(): void {
        const nodes   = Array.from(this.graph.getNodes())
        const edges   = nodes.flatMap(source =>
            Array.from(this.graph.getNeighbours(source))
                .map(target => ({ source, target }))
        )

        const w        = this.container.clientWidth
        const h        = this.container.clientHeight
        const cx       = w / 2
        const cy       = h / 2
        const radius   = Math.min(w, h) / 2 - 40
        const count    = nodes.length
        const positions = new Map<NodeType, { x: number; y: number }>()

        this.svg.setAttribute('width',  `${w}`)
        this.svg.setAttribute('height', `${h}`)
        while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild)

        nodes.forEach((node, i) => {
            const angle = (2 * Math.PI * i) / Math.max(count, 1)
            positions.set(node, {
                x: cx + radius * Math.cos(angle),
                y: cy + radius * Math.sin(angle),
            })
        })

        edges.forEach(({ source, target }) => {
            const p1   = positions.get(source)!
            const p2   = positions.get(target)!
            const line = document.createElementNS(SVG_NS, 'line')
            line.setAttribute('x1', `${p1.x}`)
            line.setAttribute('y1', `${p1.y}`)
            line.setAttribute('x2', `${p2.x}`)
            line.setAttribute('y2', `${p2.y}`)
            line.setAttribute('stroke', 'black')
            this.svg.appendChild(line)
        })

        nodes.forEach(node => {
            const pos   = positions.get(node)!
            const group = document.createElementNS(SVG_NS, 'g')
            group.setAttribute('data-id', node.id)

            const circle = document.createElementNS(SVG_NS, 'circle')
            circle.setAttribute('cx', `${pos.x}`)
            circle.setAttribute('cy', `${pos.y}`)
            circle.setAttribute('r',  '20')
            circle.setAttribute('fill',  'white')
            circle.setAttribute('stroke', 'black')

            const text = document.createElementNS(SVG_NS, 'text')
            text.setAttribute('x', `${pos.x}`)
            text.setAttribute('y', `${pos.y + 5}`)
            text.setAttribute('text-anchor', 'middle')
            text.textContent = node.id

            group.appendChild(circle)
            group.appendChild(text)
            this.svg.appendChild(group)
        })
    }

    private highlight(node: NodeType): void {
        this.svg.querySelectorAll<SVGCircleElement>('circle')
            .forEach(c => c.setAttribute('fill', 'white'))

        const group = this.svg.querySelector<SVGGElement>(
            `g[data-id="${node.id}"]`
        )
        const circ  = group?.querySelector<SVGCircleElement>('circle')
        if (circ) circ.setAttribute('fill', 'orange')
    }

    private clearHighlight(): void {
        this.svg.querySelectorAll<SVGCircleElement>('circle')
            .forEach(c => c.setAttribute('fill', 'white'))
    }
}

export async function animateWithStrategy<
    NodeType extends GraphNode,
    L
>(
    graph: Graph<NodeType, L>,
    strategy: TopologicalSortStrategy<NodeType, L>,
    delayMs = 500
): Promise<void> {
    for (const _ of strategy.traverse(graph)) {
        await new Promise(res => setTimeout(res, delayMs))
    }
}
