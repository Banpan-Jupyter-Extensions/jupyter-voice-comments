import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker, NotebookActions } from '@jupyterlab/notebook';
import { requestAPI } from './handler';
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

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    let isRecording = false;

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
          dragElement(
            createModal(
              'def transpose_matrix(matrix):\n  transposed_matrix = []\n  for i in range(len(matrix[0])):\n    transposed_row = []\n    for row in matrix:\n      transposed_row.append(row[i])\n    transposed_matrix.append(transposed_row)\n  return transposed_matrix'
            )
          );
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

    const widget = new Widget();
    widget.id = 'lm-VoiceWidget';
    const button = document.createElement('button');
    button.id = 'lm-VoiceWidget-button';
    button.addEventListener('click', toggleRecording);
    widget.node.appendChild(button);
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
