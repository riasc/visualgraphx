# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VisualGraphX is a Galaxy platform visualization plugin for interactive, large-scale graph visualization. It renders JSON Graph Format (JGF) datasets from a user's Galaxy history using D3.js force-directed layouts. It supports single and multigraph JGF files, node expand/collapse, drag-to-pin, and SVG/PNG export.

## Build & Development Commands

```bash
npm install                  # Install dependencies
grunt                        # Default task: copies plugin files into Galaxy instance
grunt dev                    # Watch mode: auto-copies on file changes
grunt compile                # RequireJS build (produces static/build-app.js)
```

Before running `grunt`, set the `galaxy` path in `gruntfile.js` (line 7) to your local Galaxy instance path.

## Architecture

This is a Backbone.js MVC application loaded via RequireJS inside a Galaxy visualization iframe.

**Entry point:** `templates/visualgraphx.mako` — Mako template that sets up RequireJS config and bootstraps `app.js`. Galaxy injects dataset/history IDs here.

**`app.js`** — Main Backbone.View. Initializes models (types, graph), then switches between Editor and Viewer views via `go()`.

**Models (`static/models/`):**
- `graph.js` — Core model. Fetches JGF data from Galaxy API, parses nodes/edges into Backbone collections, determines graph properties (root node, depth, labels, edge orientation).
- `settings.js` — Visualization settings model.

**Views (`static/views/`):**
- `editor/` — Configuration panel (start screen, settings forms) shown before visualization.
- `viewer/` — Visualization display (`viewer.js` manages the viewport, `visualizer.js` renders the graph).
- `viewport.js` — SVG viewport management.
- `ui/` — Reusable UI components (dropdowns, buttons, tables).

**Graph types (`static/graph/`):**
- `types.js` — Registry of available graph type configs. Currently only `d3js_generic` is active (`d3js_covenntree` is commented out).
- `d3js/generic/` — D3.js force-directed graph implementation: `config.js` (type metadata), `wrapper.js` (D3 bindings), `src.js` (force layout logic), `settings.js` (type-specific settings).
- `d3js/covenntree/` — CoVennTree-specific visualization variant (currently disabled).
- `d3js/common/` — Shared config and wrapper utilities across graph types.
- `forms/` — Dynamic form generation for graph settings.

**Plugin registration:** `config/visualgraphx.xml` — Declares the plugin to Galaxy's Visualization Registry. Accepts `HistoryDatasetAssociation` of type `text.Json`.

**Libraries (`static/libs/`):** DefiantJS (XPath queries on JSON), Select2, FileSaver, capture.js (SVG/PNG export).

## Input Format

JGF (JSON Graph Format) with `graph.nodes[]` (each with unique `id`) and `graph.edges[]` (each with `source`/`target`). Multigraph uses `graphs[]` array. Node metadata can include `name` (label), `chart` (external graphic URL), and `root: "true"` for root node designation.

## Sample Data

The `sample data/` directory contains JGF test files ranging from small (multigraph_min.jgf) to large-scale (100Knetwork.jgf with 100K nodes/edges).
