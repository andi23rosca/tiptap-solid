import type { Editor } from "@tiptap/core";
import {
  type Component,
  type ComponentProps,
  createEffect,
  onCleanup,
  splitProps,
} from "solid-js";
export interface EditorContentProps extends ComponentProps<"div"> {
  editor: Editor | null;
}

export const EditorContent: Component<EditorContentProps> = (props) => {
  const [local, rest] = splitProps(props, ["editor"]);

  let editorContentRef!: HTMLDivElement;
  let mounted = false;

  createEffect(() => {
    const { editor } = local;
    if (editor?.options.element) {
      if (mounted) return;
      mounted = true;
      editorContentRef.append(...editor.options.element.childNodes);
      editor.setOptions({
        element: editorContentRef,
      });
      editor.createNodeViews();
    }
  });
  onCleanup(() => {
    const { editor } = local;
    if (!editor) {
      return;
    }
    if (!editor.isDestroyed) {
      editor.view.setProps({
        nodeViews: {},
      });
    }
    if (!editor.options.element.firstChild) {
      return;
    }
    const newElement = document.createElement("div");
    newElement.append(...editor.options.element.childNodes);
    editor.setOptions({
      element: newElement,
    });
  });

  return (
    <div
      ref={editorContentRef}
      {...rest}
    />
  );
};
