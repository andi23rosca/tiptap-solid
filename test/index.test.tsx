import { createRoot } from 'solid-js'
import { isServer } from 'solid-js/web'
import { EditorContent } from '../src'
import { describe, expect, it } from 'vitest'

describe('environment', () => {
  it('runs on client', () => {
    expect(typeof window).toBe('object')
    expect(isServer).toBe(false)
  })
})


describe('Hello', () => {
  it('renders a hello component', () => {
    createRoot(() => {
      const container = (<EditorContent editor={null} />) as HTMLDivElement
      expect(container.outerHTML).toBe('<div></div>')
    })
  })
})
