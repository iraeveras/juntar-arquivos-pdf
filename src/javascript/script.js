const uploadArea = document.getElementById("upload-area");
const fileInput = document.getElementById("file-input");
const combineBtn = document.getElementById("combine-btn");
const downloadLink = document.getElementById("download-link");

let pdfFiles = [];

// Função para lidar com o arrastar e soltar arquivos
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = "#e8f4f8";
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.backgroundColor = "white";
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = "white";
    handleFiles(e.dataTransfer.files);
});

// Função para selecionar arquivos ao clicar
document.getElementById("file-select").addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", (e) => {
    handleFiles(e.target.files);
});

// Função para manipular os arquivos selecionados
function handleFiles(files) {
    pdfFiles = Array.from(files).filter(file => file.type === "application/pdf");
    if (pdfFiles.length > 1) {
        combineBtn.disabled = false;
    } else {
        combineBtn.disabled = true;
        alert("Faça upload de pelo menos dois arquivos PDF.");
    }
}

// Função para combinar os PDFs
combineBtn.addEventListener("click", async () => {
    if (pdfFiles.length < 2) {
        alert("Você precisa de pelo menos dois PDFs para combinar.");
        return
    }

    const pdfDoc = await PDFLib.PDFDocument.create();

    for (const file of pdfFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const tempPdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        const copiedPages = await pdfDoc.copyPages(tempPdfDoc, tempPdfDoc.getPageIndices());
        copiedPages.forEach(page => pdfDoc.addPage(page));
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    // Cria link para download
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "combined.pdf";
    downloadLink.style.display = "block";
    downloadLink.click();

    // Limpa o estado
    fileInput.value = "";
    pdfFiles = [];
    combineBtn.disabled = true;
    uploadArea.innerHTML = `<p> Arraste e solte PDFs aqui ou <button id="file-select">Selecione PDFs</button></p>`;
});

// Função para arrastar e soltar arquivos
uploadArea.addEventListener("click", () => {
    fileInput.click();
});