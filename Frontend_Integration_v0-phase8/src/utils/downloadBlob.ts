/**
 * Trigger a file download from a Blob (Chrome, Firefox, Safari).
 */
export const downloadBlob = (blob: Blob, fileName: string): void => {
  const safeName = fileName.replace(/[/\\?%*:|"<>]/g, '_') || 'download.pdf';
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = safeName;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);

  if (typeof link.click === 'function') {
    link.click();
  } else {
    link.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
    );
  }

  window.setTimeout(() => {
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
    URL.revokeObjectURL(url);
  }, 250);
};

export const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
