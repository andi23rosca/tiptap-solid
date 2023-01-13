import { Editor } from "@tiptap/core";
import { Component } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { Dynamic } from "solid-js/web";

export interface SolidRendererOptions {
  editor: Editor;
  props?: Record<string, any>;
  as?: string;
  className?: string;
}

export class SolidRenderer<P = unknown> {
  id: string;

  editor: Editor;

  component: any;

  element: Element;

  props: Record<string, any>;

  solidElement: JSX.Element;

  constructor(
    component: Component<P>,
    { editor, props = {}, as = "div", className = "" }: SolidRendererOptions
  ) {
    this.id = Math.floor(Math.random() * 0xffffffff).toString();
    this.component = component;
    this.editor = editor;
    this.props = props;
    this.element = document.createElement(as);
    this.element.classList.add("solid-renderer");

    if (className) {
      this.element.classList.add(...className.split(" "));
    }

    this.render();
  }

  render(): void {
    this.solidElement = <Dynamic component={this.component} {...this.props} />;

    (this.editor as any)?.contentComponent?.setRenderer(this.id, this);
  }

  updateProps(props: Record<string, any> = {}): void {
    this.props = {
      ...this.props,
      ...props,
    };

    this.render();
  }

  destroy(): void {
    (this.editor as any)?.contentComponent?.removeRenderer(this.id);
  }
}
