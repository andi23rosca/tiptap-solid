import { Component, JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useSolidNodeView } from "./useSolidNodeView";

export interface NodeViewContentProps {
  [key: string]: any;
  as?: Exclude<number, JSX.Element>;
}

export const NodeViewContent: Component<NodeViewContentProps> = (props) => {
  const state = useSolidNodeView();

  return (
    <Dynamic
      component={props.as || "div"}
      {...props}
      ref={state.nodeViewContentRef}
      data-node-view-content=""
      style={{
        ...props.style,
        "white-space": "pre-wrap",
      }}
    />
  );
};
