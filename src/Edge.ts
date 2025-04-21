export interface Edge<LinkProps> {
    source: string
    target: string
    weight?: number
    props: LinkProps
}
