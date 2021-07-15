# jupyterlab-notifications

![Github Actions Status](https://github.com/mwakaba2/jupyterlab-notifications/workflows/Build/badge.svg)
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/mwakaba2/jupyterlab-notifications/main?urlpath=/lab/tree/demo.ipynb)
[![PyPI](https://img.shields.io/pypi/v/jupyterlab-notifications.svg)](https://pypi.org/project/jupyterlab-notifications)
[![npm](https://img.shields.io/npm/v/jupyterlab-notifications.svg)](https://www.npmjs.com/package/jupyterlab-notifications)

Notebook Cell Completion Browser Notifications for JupyterLab. 

<img width="387" alt="notification" src="https://user-images.githubusercontent.com/3497137/118382531-3275eb80-b5bc-11eb-9810-5b92183609c3.png">


## Requirements

* Web Browser that supports the Notification Web API (See [Browser Compatibility Chart](https://developer.mozilla.org/en-US/docs/Web/API/notification#browser_compatibility))
* JupyterLab >= 3.0
* Notebook Cell Timing needs to be enabled for Jupyterlab Notifications with version < `0.3.0` to work. Please go to Settings -> Advanced Settings Editor -> Notebook and update setting to:
```json5
{
  // Recording timing
  // Should timing data be recorded in cell metadata
  "recordTiming": true
}
```
* [BETA] the cell timing doesn't need to be enabled for Jupyterlab >= 3.1 and Jupyterlab notification version 0.3.0.

## Install

For JupyterLab 3.x, the extension can be installed with `pip`:

```bash
pip install jupyterlab-notifications
```

## Settings

Use the following settings to update cell execution time for a notification and information to display in the notification. (in `Settings > Advanced Settings Editor`):

```json5
{
    // Notifications
    // jupyterlab-notifications:plugin
    // Settings for the Notifications extension
    // ****************************************

    // Enabled Status
    // Enable the extension or not.
    "enabled": true,

    // Minimum Notebook Cell Execution Time
    // The minimum execution time to send out notification for a particular notebook cell (in seconds).
    "minimum_cell_execution_time": 60,

    // Report Notebook Cell Execution Time
    // Display notebook cell execution time in the notification.
    "report_cell_execution_time": true,

    // Report Notebook Cell Number
    // Display notebook cell number in the notification.
    "report_cell_number": true,
    // Cell Number Type
    // Type of cell number to display when the report_cell_number is true. Select from 'cell_index' or ‘cell_execution_count'.
    "cell_number_type": "cell_index"
}
```

![notification](https://user-images.githubusercontent.com/3497137/111881088-01db5200-897d-11eb-8faa-4701cabfcde4.gif)

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterlab-notifications directory
# Install package in development mode
pip install -e .
# Link your development version of the extension with JupyterLab
jlpm run install:extension
# Rebuild extension Typescript source after making changes
jlpm run build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm run watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

### Uninstall

```bash
pip uninstall jupyterlab-notifications
```
