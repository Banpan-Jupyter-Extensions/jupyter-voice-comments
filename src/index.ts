import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';
import { Widget } from '@lumino/widgets';

/**
 * Initialization data for the jupyter-voice-comments extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-voice-comments:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyter-voice-comments is activated!');

    const widget = new Widget();
    widget.id = 'lm-VoiceWidget';
    const button = document.createElement('button');
    button.id = 'lm-VoiceWidget-button';
    widget.node.appendChild(button);
    console.log('APP SHELL', app.shell);
    app.shell.add(widget, 'top');
    requestAPI<any>('get_example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyter-voice-comments server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default plugin;
