import { Editor, EditorOptions } from "@tiptap/core";
import { Accessor, createSignal, onCleanup, onMount } from "solid-js";

export const createEditor = (
  options: Partial<EditorOptions>
): Accessor<Editor | null> => {
  const [editor, setEditor] = createSignal<Editor | null>(null, {
    equals: false,
  });

  onMount(() => {
    const instance = new Editor(options);
    instance.on("transaction", () => setEditor(instance));
    onCleanup(() => {
      editor()?.destroy();
    });
  });

  return editor;
};
