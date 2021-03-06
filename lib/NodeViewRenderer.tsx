import {
  NodeView,
  NodeViewRenderer,
  NodeViewRendererProps,
  NodeViewRendererOptions,
  Editor,
} from "@tiptap/core";
import { Decoration, NodeView as ProseMirrorNodeView } from "prosemirror-view";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { Component, createRoot, Setter } from "solid-js";
import { Dynamic, insert } from "solid-js/web";
import { createStore } from "solid-js/store";

import {
  SolidNodeViewContext,
  SolidNodeViewContextProps,
} from "./useSolidNodeView";

export interface SolidNodeViewRendererOptions extends NodeViewRendererOptions {
  update:
    | ((node: ProseMirrorNode, decorations: Decoration[]) => boolean)
    | null;
}

export class SolidNodeView extends NodeView<
  Component,
  Editor,
  SolidNodeViewRendererOptions
> {
  rootElement!: HTMLElement | null;
  contentElement!: HTMLElement | null;
  setProps!: Setter<Record<string, any>>;
  dispose!: () => void;


  constructor(component: Component, props: NodeViewRendererProps, options?: Partial<SolidNodeViewRendererOptions>) {
    super(component, props, options);
    createRoot((dispose) => {
      this.dispose = dispose;
      const [props, setProps] = createStore({
        editor: this.editor,
        node: this.node,
        decorations: this.decorations,
        selected: false,
        extension: this.extension,
        getPos: () => this.getPos(),
        updateAttributes: (attributes = {}) =>
          this.updateAttributes(attributes),
        deleteNode: () => this.deleteNode(),
      });
      this.setProps = setProps;

      const tagName = this.node.isInline ? "span" : "div";

      this.rootElement = document.createElement(tagName);
      this.rootElement.classList.add("solid-renderer");

      this.contentElement = this.node.isLeaf
        ? null
        : document.createElement(tagName);

      if (this.contentElement) {
        // For some reason the whiteSpace prop is not inherited properly in Chrome and Safari
        // With this fix it seems to work fine
        // See: https://github.com/ueberdosis/tiptap/issues/1197
        this.contentElement.style.whiteSpace = "inherit";
      }

      const SolidNodeViewProvider: Component<Record<string, any>> = (
        componentProps
      ) => {
        const onDragStart = this.onDragStart.bind(this);
        const nodeViewContentRef: SolidNodeViewContextProps["nodeViewContentRef"] =
          (element) => {
            if (
              element &&
              this.contentElement &&
              element.firstChild !== this.contentElement
            ) {
              element.appendChild(this.contentElement);
            }
          };

        return (
          <SolidNodeViewContext.Provider
            value={{ onDragStart, nodeViewContentRef }}
          >
            <Dynamic component={this.component} {...componentProps} />
          </SolidNodeViewContext.Provider>
        );
      };

      insert(this.rootElement, SolidNodeViewProvider(props));
    });
  }

  get dom() {
    if (
      !this.rootElement?.firstElementChild?.hasAttribute(
        "data-node-view-wrapper"
      )
    ) {
      throw Error(
        "Please use the NodeViewWrapper component for your node view."
      );
    }

    return this.rootElement;
  }

  get contentDOM() {
    if (this.node.isLeaf) {
      return null;
    }
    return this.contentElement;
  }

  update(node: ProseMirrorNode, decorations: Decoration[]) {
    if (typeof this.options.update === "function") {
      const oldNode = this.node;
      const oldDecorations = this.decorations;

      this.node = node;
      this.decorations = decorations;

      return this.options.update(oldNode, oldDecorations);
    }

    if (node.type !== this.node.type) {
      return false;
    }

    if (node === this.node && this.decorations === decorations) {
      return true;
    }

    this.node = node;
    this.decorations = decorations;

    this.setProps({ node, decorations });

    return true;
  }

  selectNode() {
    this.setProps({
      selected: true,
    });
  }

  deselectNode() {
    this.setProps({
      selected: false,
    });
  }

  destroy() {
    if (this.rootElement) this.rootElement.textContent = "";
    this.dispose();
    this.contentElement = null;
    this.rootElement = null;
  }
}

export function SolidNodeViewRenderer(
  component: any,
  options?: Partial<SolidNodeViewRendererOptions>
): NodeViewRenderer {
  return (props: NodeViewRendererProps) => {
    return new SolidNodeView(component, props, options) as ProseMirrorNodeView;
  };
}
