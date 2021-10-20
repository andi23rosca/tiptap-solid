import { Component } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { Dynamic } from "solid-js/web";
import { useSolidNodeView } from "./useSolidNodeView";

export interface NodeViewWrapperProps {
  [key: string]: any;
  ref?: HTMLDivElement | ((el: HTMLDivElement) => void);
  as?: Exclude<number, JSX.Element>;
}

export const NodeViewWrapper: Component<NodeViewWrapperProps> = (props) => {
  const { onDragStart } = useSolidNodeView();

  return (
    <Dynamic
      component={props.as || "div"}
      {...props}
      data-node-view-wrapper=""
      onDragStart={onDragStart}
      style={{
        ...props.style,
        whiteSpace: "normal",
      }}
    />
  );
};
