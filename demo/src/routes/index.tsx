import { createEditor, EditorContent } from "tiptap-solid";
import StarterKit from "@tiptap/starter-kit";
export default function Home() {

  const editor = createEditor({
    extensions: [StarterKit],
  });

  return (
    <main>
      <div class="test">
        <p>test</p>
      <EditorContent class="editor" editor={editor()} />
      </div>
    </main>
  );
}
