import type { Component } from 'solid-js'
import logo from './logo.svg'
import styles from './App.module.css'
import {EditorContent, NodeViewContent, NodeViewWrapper, SolidNodeViewRenderer, createEditor} from "../src/index"
import StarterKit from "@tiptap/starter-kit";
import { mergeAttributes, Node } from '@tiptap/core'

const App: Component = () => {
  const editor = createEditor({
    extensions: [StarterKit, CompExt],
    content: `
    <p>Hello world!</p>
    <react-component>
      <p>This is editable. You can create a new component by pressing Mod+Enter.</p>
    </react-component>
    `,
  });

  return (
    <div class={styles.App}>
      <EditorContent editor={editor()} />
    </div>
  )
}


const CompExt =  Node.create({
  name: 'reactComponent',

  group: 'block',

  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'react-component',
      },
    ]
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => {
        return this.editor.chain().insertContentAt(this.editor.state.selection.head, { type: this.type.name }).focus().run()
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['react-component', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return SolidNodeViewRenderer(Comp)
  },
})

const Comp = () => {
  return (
    <NodeViewWrapper className="react-component">
      <label contentEditable={false}>React Component</label>

      <NodeViewContent className="content is-editable" />
    </NodeViewWrapper>
  )
}

export default App
