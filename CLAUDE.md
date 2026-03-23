# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VisualGraphX is an interactive, large-scale graph visualization tool using D3.js force-directed layouts. It supports single and multigraph JGF files, node expand/collapse, drag-to-pin, and SVG/PNG export.

It runs in two modes:
- **Standalone** (`index.html`) — loads JGF files via browser file upload
- **Galaxy plugin** (`templates/visualgraphx.mako`) — legacy mode, fetches data from Galaxy API

## Build & Development Commands

```bash
# Standalone (primary mode)
python3 -m http.server 8000    # Serve locally, open http://localhost:8000

# Galaxy plugin mode (legacy)
npm install                     # Install grunt dependencies
grunt                           # Copy plugin files into Galaxy instance
grunt dev                       # Watch mode: auto-copies on file changes
```

## Architecture

Backbone.js MVC application loaded via RequireJS. Dependencies (jQuery, Backbone, Underscore, D3 v3) are loaded from CDNs in standalone mode.

**Entry points:**
- `index.html` — Standalone. Loads deps from CDNs, configures RequireJS, handles file upload, passes JGF data to app via `options.jgfData`.
- `templates/visualgraphx.mako` — Galaxy mode. Mako template that relies on Galaxy's libs and API.

**`static/app.js`** — Main Backbone.View. Initializes models (types, graph), listens for graph `ready` event, then creates Editor and Viewer views. Switches between them via `go()`.

**Models (`static/models/`):**
- `graph.js` — Core model. In standalone mode, accepts JGF data directly (`options.jgfData`) via deferred `setTimeout` to allow event listeners to bind. In Galaxy mode, fetches via Backbone `fetch()`. Parses nodes/edges into collections, determines graph properties (root node, depth, labels).
- `settings.js` — Visualization settings model.

**Views (`static/views/`):**
- `editor/` — Configuration panel (graph type selection, settings) shown before visualization.
- `viewer/` — Visualization display. `visualizer.js` dynamically loads the graph wrapper on the `wrap` event.
- `ui/` — Custom UI components (Select2 dropdowns, radio buttons, tables, labels).

**Graph types (`static/graph/`):**
- `types.js` — Registry. Only `d3js_generic` is active.
- `d3js/generic/wrapper.js` — Core D3 v3 force layout. Uses `d3.layout.force()`, `JSON.search()` (DefiantJS) for graph traversal, supports expand/collapse via double-click.

**Shims (`static/shims/`):** Lightweight replacements for Galaxy UI modules. RequireJS path mapping in `index.html` redirects `utils/utils`, `mvc/ui/*` imports to these stubs. They implement only the API surface used by VisualGraphX (Portlet, Tabs, ButtonIcon, ButtonMenu, Label, Message).

**Libraries (`static/libs/`):** DefiantJS 1.2.5 (XPath queries on JSON via `JSON.search()`), Select2 3.5.3, FileSaver, capture.js (SVG/PNG export).

## Key Technical Notes

- **D3 version:** v3 (uses `d3.layout.force()`, `d3.behavior.zoom()`). Not compatible with D3 v4+.
- **DefiantJS** adds `JSON.search()` globally — must be loaded before any module using it.
- **Timing:** `graph.js` uses `setTimeout(fn, 0)` for standalone data injection so that `app.js` can bind its `listenTo('ready', ...)` handler before the event fires.

## Input Format

JGF (JSON Graph Format) with `graph.nodes[]` (each with unique `id`) and `graph.edges[]` (each with `source`/`target`). Multigraph uses `graphs[]` array. Node metadata can include `name` (label), `chart` (external graphic URL), and `root: "true"` for root node designation.

## Sample Data

- `static/sample.json` — minimal 6-node test graph
- `sample data/` — larger JGF files up to 100K nodes/edges
