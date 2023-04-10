import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker, NotebookActions } from '@jupyterlab/notebook';
import { Widget } from '@lumino/widgets';
import { createModal, dragElement, openaiPrompt } from './utils';
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

    const toggleRecording = () => {
      const button = document.getElementById('lm-VoiceWidget-button');
      const buttonStyle = (button as HTMLElement).style;

      const resetStyles = () => {
        buttonStyle.backgroundColor = 'rgb(224, 224, 224)';
        buttonStyle.outline = '2px solid rgb(224, 224, 224)';
      };
      const resetRecording = () => {
        isRecording = false;
        recognition.stop();
        resetStyles();
      };

      if (isRecording) {
        resetRecording();
      } else {
        recognition.start();
        isRecording = true;
        buttonStyle.backgroundColor = 'rgb(228, 99, 99)';
        buttonStyle.outline = '2px solid rgb(228, 99, 99)';
      }
    };

    // creates a new command that inserts a comment and fetches a code snippet from openai based on the comment
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

          /***********************************************
           * Clean up the fetch request to openai below  *
           * I plan to make it so that the fetch request *
           * is made in a separate file                  *
           **********************************************/
          const url =
            'https://q6ya2o2jm2.execute-api.us-east-2.amazonaws.com/default/jplext-voice-comments-openai';
          const prompt = openaiPrompt(comment);
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

          /************************************************
           * Add a loading spinner on the modal that is   *
           * removed when the fetch request is complete.  *
           * Create the function in a separate file.      *
           ************************************************/
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
    /******************************************************
     * Add a widget to the top of the JupyterLab window   *
     * that includes a button to toggle voice recording   *
     * on and off.                                        *
     * I also need to include the code snippet in the     *
     * widget. Also, add more user functionality to close *
     * the widget and modify the code snippet.            *
     ******************************************************/
    const widget = new Widget();
    widget.id = 'lm-VoiceWidget';
    const button = document.createElement('button');
    button.id = 'lm-VoiceWidget-button';
    button.title = 'Toggle voice recording (Alt + V)';
    button.addEventListener('click', toggleRecording);
    document.addEventListener('keydown', (event: any) => {
      if (event.altKey && event.key === 'v') {
        toggleRecording();
      }
    });
    console.log('PIZZA');
    widget.node.appendChild(button);
    app.shell.add(widget, 'top');
  }
};

export default plugin;
