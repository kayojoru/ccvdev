console.log("Highlight setup loaded");
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
const url = 'Hyponatremia_Synthetic_Neg_Complex.pdf';

fetch('objects.json')
  .then(response => response.json())
  .then(data => {
    const highlights = data.highlights;

    pdfjsLib.getDocument(url).promise.then(function(pdfDoc) {
      console.log('PDF loaded');
      const container = document.getElementById('pdf-container');

      function renderPage(num) {
        pdfDoc.getPage(num).then(function(page) {
          const scale = 1.5;
          const viewport = page.getViewport({ scale: scale });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          container.appendChild(canvas);

          page.render({ canvasContext: context, viewport: viewport }).promise.then(function() {
            highlights.forEach(function(highlight) {
              if(highlight.page === num) {
                const div = document.createElement('div');
                div.classList.add('highlight');
                div.style.width = `${(highlight.coordinates.x1 - highlight.coordinates.x0) * scale}px`;
                div.style.height = `${(highlight.coordinates.y1 - highlight.coordinates.y0) * scale}px`;
                div.style.left = `${highlight.coordinates.x0 * scale}px`;
                div.style.top = `${viewport.height - highlight.coordinates.y1 * scale}px`;
                container.appendChild(div);
              }
            });
          });
        });
      }

      for (let num = 1; num <= pdfDoc.numPages; num++) {
        renderPage(num);
      }
    });
  });