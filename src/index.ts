import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';

/**
 * Initialization data for the jupyter-voice-comments extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-voice-comments:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyter-voice-comments is activated!');

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
