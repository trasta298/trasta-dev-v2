import { Component, type ReactNode } from 'react'

type Props = { fallback: ReactNode; children: ReactNode }

export class EmbedBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error(error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
