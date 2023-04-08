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

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.addEventListener('result', (event: any) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      console.log('Text: ' + text);
    });

    const startRecording = () => {
      recognition.start();
      console.log('Voice activated, try speaking into the microphone.');
    };
    const widget = new Widget();
    widget.id = 'lm-VoiceWidget';
    const button = document.createElement('button');
    button.id = 'lm-VoiceWidget-button';
    button.addEventListener('click', startRecording);
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
