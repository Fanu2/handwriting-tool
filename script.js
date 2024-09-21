document.getElementById('generate-button').addEventListener('click', function() {
    const text = document.getElementById('text-input').value;
    const font = document.getElementById('font-selection').value;
    const fontSize = document.getElementById('font-size').value;
    const fontWeight = document.getElementById('font-weight').value;
    const letterSpacing = document.getElementById('letter-spacing').value;
    const wordSpacing = document.getElementById('word-spacing').value;
    const fontColor = document.getElementById('font-color').value;
    const paperColor = document.getElementById('paper-color').value;
    const lineHeight = document.getElementById('line-height').value;
    const pageMargin = document.getElementById('page-margin').value;
    const ruledLines = document.getElementById('ruled-lines').value;
    const scannedEffect = document.getElementById('scanned-effect').checked;
    const backgroundImage = document.getElementById('background-image').files[0];

    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous output

    const lines = text.split('\n');
    let currentPageDiv = createNewPage(font, fontSize, fontWeight, fontColor, paperColor, lineHeight, pageMargin, ruledLines, scannedEffect);
    let currentHeight = 0;
    const pageHeight = 600; // Adjust according to your needs

    lines.forEach((line) => {
        const p = document.createElement('p');
        p.style.letterSpacing = letterSpacing + 'px';
        p.style.wordSpacing = wordSpacing + 'px';
        p.textContent = line;

        currentPageDiv.appendChild(p);
        currentHeight += p.offsetHeight;

        if (currentHeight > pageHeight) {
            outputDiv.appendChild(currentPageDiv);
            currentPageDiv = createNewPage(font, fontSize, fontWeight, fontColor, paperColor, lineHeight, pageMargin, ruledLines, scannedEffect);
            currentHeight = 0;
        }
    });

    outputDiv.appendChild(currentPageDiv);

    if (backgroundImage) {
        const reader = new FileReader();
        reader.onload = function(event) {
            outputDiv.querySelectorAll('.page').forEach(page => {
                page.style.backgroundImage = `url(${event.target.result})`;
                page.style.backgroundSize = 'cover';
                page.style.backgroundPosition = 'center';
            });
        };
        reader.readAsDataURL(backgroundImage);
    }
});

function createNewPage(font, fontSize, fontWeight, fontColor, paperColor, lineHeight, pageMargin, ruledLines, scannedEffect) {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page';
    pageDiv.style.fontFamily = font;
    pageDiv.style.fontSize = fontSize + 'px';
    pageDiv.style.fontWeight = fontWeight;
    pageDiv.style.color = fontColor;
    pageDiv.style.backgroundColor = paperColor;
    pageDiv.style.lineHeight = lineHeight;
    pageDiv.style.margin = `${pageMargin}px`;
    
    if (ruledLines === 'with-lines') {
        pageDiv.classList.add('lines');
    }
    
    if (scannedEffect) {
        pageDiv.classList.add('scanned-effect');
    }

    return pageDiv;
}

document.getElementById('save-button').addEventListener('click', function() {
    const outputDiv = document.getElementById('output');

    if (outputDiv.childElementCount === 0) {
        alert('Please generate the handwriting output before saving.');
        return;
    }

    const pages = outputDiv.childNodes;
    const promises = [];

    pages.forEach((page, index) => {
        promises.push(html2canvas(page, { allowTaint: true, useCORS: true }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `handwriting_output_page_${index + 1}.png`;
            link.click();
        }));
    });

    Promise.all(promises).then(() => {
        alert('All pages saved!');
    }).catch(err => {
        console.error('Failed to save as image:', err);
        alert('An error occurred while saving. Please try again.');
    });
});
