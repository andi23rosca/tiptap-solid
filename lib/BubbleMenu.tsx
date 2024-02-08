import { Component, ParentComponent, createEffect, onCleanup } from "solid-js";
import {
  BubbleMenuPlugin,
  BubbleMenuPluginProps,
} from "@tiptap/extension-bubble-menu";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type BubbleMenuProps = Omit<
  Optional<BubbleMenuPluginProps, "pluginKey">,
  "element"
> & {
  class?: string;
};

export const BubbleMenu: ParentComponent<BubbleMenuProps> = (props) => {
  let element: HTMLElement | null = null;

  createEffect(() => {
    if (!element) {
      return;
    }

    const {
      pluginKey = "bubbleMenu",
      editor,
      tippyOptions = {},
      shouldShow = null,
    } = props;

    editor.registerPlugin(
      BubbleMenuPlugin({
        pluginKey,
        editor,
        element: element,
        tippyOptions,
        shouldShow,
      })
    );

    onCleanup(() => {
      editor.unregisterPlugin(pluginKey);
    });
  });

  return (
    <div
      ref={(e) => (element = e)}
      class={props.class}
      style={{ visibility: "hidden" }}
    >
      {props.children}
    </div>
  );
};
