// function to create modal

export const createModal = (modalContent: string) => {
  const relativeElement = document.getElementsByClassName('jp-Notebook')[0];
  const modal = document.createElement('div');
  modal.id = 'lm-VoiceWidget-modal';
  modal.textContent = modalContent !== null ? modalContent : '';
  modal.tabIndex = 0; // Add tabindex to make modal focusable
  relativeElement.appendChild(modal); // Append modal to activeCell
  modal.focus(); // Focus on modal

  modal.addEventListener('keydown', (event: any) => {
    if (event.key === 'Escape') {
      modal.remove();
    }

    if (event.ctrlKey && event.key === 'c') {
      event.preventDefault();
      const text = modal.textContent;
      if (text) {
        navigator.clipboard.writeText(text);
      }
    }
  });

  modal.addEventListener('mousedown', (event: any) => {
    modal.focus(); // Give modal focus when clicked
  });

  return modal;
};

export const dragElement = (ele: any) => {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  ele.onmousedown = dragMouseDown;

  function dragMouseDown(e: any) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e: any) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    ele.style.top = ele.offsetTop - pos2 + 'px';
    ele.style.left = ele.offsetLeft - pos1 + 'px';
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
};
