import type { Editor } from "@tiptap/core";

export const ReactiveOwnerProperty = Symbol(
  "Reactive owner property used by tiptap solid as a workaround"
);

// Solid js doesn't expose Owner type so use any instead
export const getTiptapSolidReactiveOwner = (editor: Editor): any | undefined =>
  (editor as any)[ReactiveOwnerProperty] ?? undefined;
