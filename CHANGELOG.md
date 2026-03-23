# Change Log
All notable changes to VisualGraphX will be documented in this file. 

## 0.1.0 - 2026-03-22
### Added
- Standalone mode: app can now run without Galaxy as a self-contained web application
- index.html entry point with file upload for JGF/JSON files
- Galaxy UI shim modules (portlet, tabs, misc, utils) to decouple from Galaxy framework
- Sample graph data (static/sample.json) for testing
- CLAUDE.md for developer onboarding
### Changed
- graph.js supports direct JGF data injection in addition to Galaxy API fetch
- Enabled console debug/log output in static/app.js for development

## 0.0.2 - 2016-06-01
### Changed
- Input Format has been changed to JSON Graph Format (JGF)
### Added
- Automated detection of external URL

## 0.0.1 - 2016-02-03
### Added
- Load external graphics asynchronically  
- Fixation of the root node in order to center the layout
- Calming of the layout through presetting the coordinates in space