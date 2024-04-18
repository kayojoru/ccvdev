console.log("Highlight setup loaded");

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';

// Load highlights from the JSON file
fetch('objects.json')
.then(res => res.json())
.then(data => {
  const highlights = data.highlights;

  // Load the PDF document
  pdfjsLib.getDocument('Hyponatremia_Synthetic_Neg_Complex.pdf').promise.then(function(pdfDoc) {
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

        page.render({
          canvasContext: context,
          viewport: viewport
        }).promise.then(function() {
          // Render highlights after the page is rendered
          highlights.filter(h => h.page === num).forEach(function(highlight) {
            const div = document.createElement('div');
            div.classList.add('highlight');
            div.style.width = `${(highlight.coordinates.x1 - highlight.coordinates.x0) * scale}px`;
            div.style.height = `${(highlight.coordinates.y1 - highlight.coordinates.y0) * scale}px`;
            div.style.left = `${highlight.coordinates.x0 * scale}px`;
            div.style.top = `${(canvas.height - (viewport.height - highlight.coordinates.y1) * scale)}px`;
            container.appendChild(div);
          });
        });
      });
    }

    for (let num = 1; num <= pdfDoc.numPages; num++) {
      renderPage(num);
    }
  });
});
