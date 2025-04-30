import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  vite:{
    optimizeDeps: {
      include: [
        'prosemirror-state',
        'prosemirror-transform',
        'prosemirror-model',
        'prosemirror-view'
      ]
    }
  }
});
