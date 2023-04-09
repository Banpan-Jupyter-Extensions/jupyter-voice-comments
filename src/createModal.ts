// function to create modal

const createModal = (modalContent: string) => {
  const activeCell = document.getElementsByClassName('jp-mod-active');
  const modal = document.createElement('div');
  modal.id = 'lm-VoiceWidget-modal';
  modal.textContent = modalContent !== null ? modalContent : '';
  modal.style.top = (activeCell[0] as HTMLElement).offsetTop - 100 + 'px';
  modal.style.left = (activeCell[0] as HTMLElement).offsetLeft + 'px';
  modal.tabIndex = 0; // Add tabindex to make modal focusable
  activeCell[0].appendChild(modal); // Append modal to activeCell
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
};

export default createModal;
