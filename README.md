# tiptap-solid

> Solid components for tiptap v2

[![Open in Visual Studio Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20VS%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://open.vscode.dev/andi23rosca/tiptap-solid)
[![NPM Version](https://badgen.net/npm/v/tiptap-solid)](https://www.npmjs.com/package/tiptap-solid)
[![Total Downloads](https://badgen.net/npm/dt/tiptap-solid)](https://www.npmjs.com/package/tiptap-solid)
[![Monthly Downloads](https://badgen.net/npm/dm/tiptap-solid)](https://www.npmjs.com/package/tiptap-solid)
[![License](https://badgen.net/npm/license/tiptap-solid)](https://github.com/andi23rosca/tiptap-solid/blob/master/LICENSE)

## Installation

```bash
npm i tiptap-solid

# or

yarn add tiptap-solid
```

**Note**: This package just provides components for solid. For configuring/customizing the editor, refer [tiptap's official documentation](https://www.tiptap.dev/).

For any issues with the editor. You may need to open the issue on [tiptap's repository](https://github.com/ueberdosis/tiptap/issues)

## Issues
There's a recurring issue caused by prosemirror dependencies: `RangeError: Adding different instances of a keyed plugin (plugin$)`
These are the steps to fix it:
1. add all `prosemirror` dependencies explicityly: `yarn add prosemirror-state prosemirror-transform prosemirror-model prosemirror-view`
2. include the packages in `vite.config.ts` in `optimizeDeps`
```ts
  optimizeDeps: {
    include: [
      'prosemirror-state',
      'prosemirror-transform',
      'prosemirror-model',
      'prosemirror-view'
    ]
  }
```

## Usage
The structure of the helper components has been designed to mimic the React components provided by tiptap, so for further inspiration on how to use `tiptap-solid` see [tiptap's section on React](https://tiptap.dev/guide/node-views/react)

### A Simple editor

```tsx
import { Component } from "solid-js";
import StarterKit from "@tiptap/starter-kit";
import { createEditor, EditorContent } from "tiptap-solid";

const App: Component = () => {
  const editor = createEditor({
    extensions: [StarterKit],
    content: `Hello world!`,
  });
  return <EditorContent editor={editor()} />;
};
```

### Rendering a Solid component inside the editor:

#### Create a component `Counter.tsx`
```tsx
import { NodeViewProps } from "@tiptap/core";
import { Component } from "solid-js";
import { NodeViewWrapper } from "tiptap-solid";

const Counter: Component<NodeViewProps> = (props) => {
  const increase = () => {
    props.updateAttributes({
      count: props.node.attrs.count + 1,
    });
  };

  return (
    <NodeViewWrapper className="solid-component">
      <span contenteditable={false} className="label">
        Solid Component
      </span>

      <div contenteditable={false} className="content">
        <button onClick={increase}>
          This button has been clicked {props.node.attrs.count} times.
        </button>
      </div>
    </NodeViewWrapper>
  );
};
export default Counter;
```

#### Create a node extension `Extension.ts`

```ts
import { Node, mergeAttributes } from "@tiptap/core";
import { SolidNodeViewRenderer } from "tiptap-solid";
import Counter from "./Counter";

export default Node.create({
  name: "solidComponent",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      count: {
        default: 0,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "solid-component",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["solid-component", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return SolidNodeViewRenderer(Counter);
  },
});
```

#### Register extension in your editor, and use the component's tag `App.tsx`
```tsx
import { Component } from "solid-js";
import StarterKit from "@tiptap/starter-kit";
import { createEditor, EditorContent } from "tiptap-solid";
import Extension from "./Extension";

const App: Component = () => {
  const editor = createEditor({
    extensions: [StarterKit, Extension],
    content: `
    <p>
      This is still the text editor you’re used to, but enriched with node views.
    </p>

    <solid-component count="5">
      <p>
        Editable
      </p>
    </solid-component>
    
    <p>
      Did you see that? That’s a Solid component. We are really living in the future.
    </p>
    `,
  });

  return <EditorContent editor={editor()} />;
};
```
## Solid Contexts
`solid` works with the concept of reactivity owners. Any `createEffect`, `useContext`, etc. is tied to the owner it's defined in.

Owners can have children and parents similarly to how components have children and parents, when you try to use a context. 
Solid will look up the chain of reactivity owners for the closest one that has the context.

The custom node components in `tiptap-solid` are rendered somewhat independently, but the library has some internal logic that automatically attaches the owner of `EditorContent` to any node components rendered inside of it.

The issue is if you need to use contexts inside of the extensions classes. The classes are instantiated and called outside of the usual reactivity tree, and don't have access to any of the contexts.

As a workaround the library exports a function called `getTiptapSolidReactiveOwner` that will return the owner of the `EditorContent` component.
Using the return with `runWithOwner` will let you have access to any context editor has access to.

Example: 
```ts
export default Node.create({
  name: "solidComponent",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      count: {
        default: 0,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "solid-component",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const owner = getTiptapSolidReactiveOwner(this.editor);
    const context = runWithOwner(owner, () => useContext(SomeContext));
    // Do some logic based on the context, render stuff differently, etc.
    return ["solid-component", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return SolidNodeViewRenderer(Counter);
  },
});
```
