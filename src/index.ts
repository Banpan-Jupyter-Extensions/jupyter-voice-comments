import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker, NotebookActions } from '@jupyterlab/notebook';
import { Widget } from '@lumino/widgets';
import { createModal, dragElement } from './createModal';
/**
 * Initialization data for the jupyter-voice-comments extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-voice-comments:plugin',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, notebookTracker: INotebookTracker) => {
    console.log('JupyterLab extension jupyter-voice-comments is activated!');

    // Web Speech API initialization
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    let isRecording = false;

    // function that toggles recording
    const toggleRecording = () => {
      if (isRecording) {
        recognition.stop();
        isRecording = false;
        console.log('Stopped recording');
      } else {
        recognition.start();
        isRecording = true;
        console.log('Started recording');
      }
    };

    app.commands.addCommand('jupyter-voice-comments:insert-comment', {
      label: 'Insert Comment',
      execute: (args: any) => {
        const { comment } = args;

        const current = notebookTracker.currentWidget;

        if (current) {
          const notebook = current.content;

          NotebookActions.insertAbove(notebook);
          NotebookActions.changeCellType(notebook, 'markdown');
          NotebookActions.run(notebook);

          const cell = notebook.activeCell;
          if (cell) {
            cell.model.value.text = comment;
          }
          const url =
            'https://q6ya2o2jm2.execute-api.us-east-2.amazonaws.com/default/jplext-voice-comments-openai';
          const prompt = `Give me a python code snippet based on the following comment: ${comment}. Do not include the comment in the code snippet. The code snippet should be a valid python code snippet. Do not include any examples of running the code in the snippet. Make sure that all new function definitions are on a new line, and follow proper Python formatting conventions. This is for a JupyterLab extension that just uses the response from this prompt to display a code snippet modal. Users should be able to copy the code snippet from the modal and run it in their jupyter notebook.`;

          // async function that fetches a code snippet from openai based on the voice comment and creates a draggable modal with the code snippet
          const fetchOPENAI = async () => {
            const response = await fetch(url, {
              method: 'POST',
              body: JSON.stringify({ text: prompt })
            });
            const data = await response.json();
            dragElement(createModal(data.result));
          };
          fetchOPENAI();
        } else {
          console.log('No active notebook');
        }
      }
    });

    recognition.addEventListener('result', (event: any) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      app.commands.execute('jupyter-voice-comments:insert-comment', {
        comment: text
      });
    });
    // creates a Widget that contains a button that toggles recording.
    // I plan to make the widget contain the button and the modal with better user functionality
    const widget = new Widget();
    widget.id = 'lm-VoiceWidget';
    const button = document.createElement('button');
    button.id = 'lm-VoiceWidget-button';
    button.addEventListener('click', toggleRecording);
    widget.node.appendChild(button);
    app.shell.add(widget, 'top');
  }
};

export default plugin;
