import {
	type ParentComponent,
	createEffect,
	createSignal,
	onCleanup,
} from "solid-js";
import {
	BubbleMenuPlugin,
	type BubbleMenuPluginProps,
} from "@tiptap/extension-bubble-menu";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type BubbleMenuProps = Omit<
	Optional<BubbleMenuPluginProps, "pluginKey">,
	"element"
> & {
	class?: string;
};

export const BubbleMenu: ParentComponent<BubbleMenuProps> = (props) => {
	const [ref, setRef] = createSignal<HTMLDivElement>();

	const stableEditorRef = props.editor;

	createEffect(() => {
		const element = ref();
		if (!element) {
			return;
		}

		const pluginKey = props.pluginKey || "bubbleMenu";
		const tippyOptions = props.tippyOptions || {};
		const shouldShow = props.shouldShow || null;

		stableEditorRef.registerPlugin(
			BubbleMenuPlugin({
				pluginKey,
				editor: stableEditorRef,
				element: element,
				tippyOptions,
				shouldShow,
			}),
		);

		onCleanup(() => {
			stableEditorRef.unregisterPlugin(pluginKey);
		});
	});

	return (
		<div ref={setRef} class={props.class} style={{ visibility: "hidden" }}>
			{props.children}
		</div>
	);
};
