import { Component, ParentComponent, createEffect, onCleanup } from "solid-js";
import {
  FloatingMenuPlugin,
  FloatingMenuPluginProps,
} from "@tiptap/extension-floating-menu";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type FloatingMenuProps = Omit<
  Optional<FloatingMenuPluginProps, "pluginKey">,
  "element"
> & {
  class?: string;
};

export const FloatingMenu: ParentComponent<FloatingMenuProps> = (props) => {
  let element: HTMLElement | null = null;

  createEffect(() => {
    if (!element) {
      return;
    }

    const {
      pluginKey = "floatingMenu",
      editor,
      tippyOptions = {},
      shouldShow = null,
    } = props;

    editor.registerPlugin(
      FloatingMenuPlugin({
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
