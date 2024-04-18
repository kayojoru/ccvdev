console.log("Highlight setup loaded");

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';

const url = 'Hyponatremia_Synthetic_Neg_Complex.pdf'; // The path to your PDF
let highlights = [
  // ... (insert your highlight data here)
];

// Load the PDF document
pdfjsLib.getDocument(url).promise.then(function(pdfDoc) {
  console.log('PDF loaded');

  // Get the container div where the PDF will be rendered
  const container = document.getElementById('pdf-container');

  // Function to render a page
  function renderPage(num) {
    pdfDoc.getPage(num).then(function(page) {
      const scale = 1.5; // Adjust scale to your preference
      const viewport = page.getViewport({ scale: scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      container.appendChild(canvas);

      // Render the page into the canvas
      page.render({
        canvasContext: context,
        viewport: viewport
      }).promise.then(function() {
        // Render highlights after the page is rendered
        highlights.forEach(function(highlight) {
          if(highlight.page === num) {
            const div = document.createElement('div');
            div.classList.add('highlight');
            div.style.width = `${(highlight.coordinates.x1 - highlight.coordinates.x0) * scale}px`;
            div.style.height = `${(highlight.coordinates.y1 - highlight.coordinates.y0) * scale}px`;
            div.style.left = `${highlight.coordinates.x0 * scale}px`;
            div.style.top = `${(canvas.height - highlight.coordinates.y1 * scale)}px`; // Adjust for the PDF coordinate system starting at the bottom-left
            container.appendChild(div);
          }
        });
      });
    });
  }

  // Render all the pages (or a subset if desired)
  for (let num = 1; num <= pdfDoc.numPages; num++) {
    renderPage(num);
  }
});
