import { Editor } from "@tiptap/core";
import { Component, createRoot } from "solid-js";
import { createStore } from "solid-js/store";
import { Dynamic, insert } from "solid-js/web";
import { getTiptapSolidReactiveOwner } from "./ReactiveOwner";

export interface SolidRendererOptions {
  editor: Editor;
  props?: Record<string, any>;
  as?: string;
  className?: string;
}

export class SolidRenderer<P extends Record<string, any>> {
  id: string;
  editor: Editor;
  element: Element;
  dispose!: () => void;
  setProps: any;

  constructor(
    component: Component<P>,
    { editor, props, as = "div", className = "" }: SolidRendererOptions
  ) {
    this.id = Math.floor(Math.random() * 0xffffffff).toString();
    this.editor = editor;
    this.element = document.createElement(as);
    this.element.classList.add("solid-renderer");
    createRoot((dispose) => {
      const [reactiveProps, setProps] = createStore<Record<string, any>>(
        props ?? {}
      );
      this.setProps = setProps;
      if (className) {
        this.element.classList.add(...className.split(" "));
      }
      insert(
        this.element,
        <Dynamic component={component} {...(reactiveProps as any)} />
      );
      this.dispose = dispose;
    }, getTiptapSolidReactiveOwner(this.editor));
  }

  updateProps(props: P): void {
    this.setProps({
      ...props,
    });
  }

  destroy() {
    this.dispose();
    this.element.remove();
  }
}
