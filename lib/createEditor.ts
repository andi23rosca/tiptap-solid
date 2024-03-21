import { Editor, type EditorOptions } from "@tiptap/core";
import { type Accessor, createSignal, onCleanup, onMount, getOwner } from "solid-js";
import { ReactiveOwnerProperty } from "./ReactiveOwner";

export const createEditor = (
  options: Partial<EditorOptions>,
): Accessor<Editor | null> => {
  const [editor, setEditor] = createSignal<Editor | null>(null, {
    equals: false,
  });

  const owner = getOwner();

  onMount(() => {
    const instance = new Editor({
      ...options, onBeforeCreate(props) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (props.editor as any)[ReactiveOwnerProperty] = owner;
        options.onBeforeCreate?.(props);
      }
    });
    instance.on("transaction", () => {
      requestAnimationFrame(() => {
        setEditor(instance);
      });
    });
    onCleanup(() => {
      editor()?.destroy();
    });
  });

  return editor;
};
