# jupyter-voice-comments

A simple extension to allow the creation of markdown cells via speech-to-text and get code snippet suggestions based on the comment.

## Usage

After installation you can activate the microphone by pressing the button on the top menu bar next to the help button. The browser might ask for access to your microphone, you will need to approve access for this extension to work.

* Once you have given the browser access to your microphone, you can press the button or ALT/OPTION + V to toggle voice recording.
* You can now insert a comment by saying something like "function that adds one to a number".
* A mardown cell will be inserted above your current cell with the comment you spoke
* Then a code snippet will appear based on your comment.
* You can click on the code snippet and press CTRL + C to copy then click a cell and press CTRL + V to paste the code snippet in.
* Be sure to always check the logic in the code snippet for accuracy. The code snippets come from OpenAI DaVinci 003 model so it can contains errors or inaccuracies.

## Requirements

- JupyterLab >= 3.0

## Conda Environment

I recommend running your jupyter lab notebook in a new conda environment to test the extension before adding it to your existing environment. You can create a new conda environment by using the following command:
```conda create -n jupyterlab-test-extension --override-channels --strict-channel-priority -c conda-forge -c nodefaults jupyterlab=3 nodejs```

then you can activate the environment with:
```conda activate jupyterlab-test-extension```

then open up jupyter lab:
```jupyter lab```

## Install

To install the extension, execute:

```bash
pip install jupyter-voice-comments
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall jupyter-voice-comments
```

## Troubleshoot

If you are seeing the frontend extension, but it is not working, check
that the server extension is enabled:

```bash
jupyter server extension list
```

If the server extension is installed and enabled, but you are not seeing
the frontend extension, check the frontend extension is installed:

```bash
jupyter labextension list
```

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyter-voice-comments directory
# Install package in development mode
pip install -e ".[test]"
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Server extension must be manually installed in develop mode
jupyter server extension enable jupyter-voice-comments
# Rebuild extension Typescript source after making changes
jlpm build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
# Server extension must be manually disabled in develop mode
jupyter server extension disable jupyter-voice-comments
pip uninstall jupyter-voice-comments
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `jupyter-voice-comments` within that folder.

### Testing the extension

#### Server tests

This extension is using [Pytest](https://docs.pytest.org/) for Python code testing.

Install test dependencies (needed only once):

```sh
pip install -e ".[test]"
# Each time you install the Python package, you need to restore the front-end extension link
jupyter labextension develop . --overwrite
```

To execute them, run:

```sh
pytest -vv -r ap --cov jupyter-voice-comments
```

#### Frontend tests

This extension is using [Jest](https://jestjs.io/) for JavaScript code testing.

To execute them, execute:

```sh
jlpm
jlpm test
```

#### Integration tests

This extension uses [Playwright](https://playwright.dev/docs/intro/) for the integration tests (aka user level tests).
More precisely, the JupyterLab helper [Galata](https://github.com/jupyterlab/jupyterlab/tree/master/galata) is used to handle testing the extension in JupyterLab.

More information are provided within the [ui-tests](./ui-tests/README.md) README.

### Packaging the extension

See [RELEASE](RELEASE.md)
