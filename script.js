// Acessa a webcam
const video = document.getElementById('webcam');
const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');

// Configurações iniciais
let zoom = 1;
let panX = 0;
let panY = 0;
let rotation = 0;

// Alternância de tema
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeToggle.textContent = '🌙 Tema Escuro';
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️ Tema Claro';
    }
});

// Acessa a webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
        video.play();
    })
    .catch((err) => {
        console.error("Erro ao acessar a webcam:", err);
    });

// Atualiza a imagem com zoom, pan e rotação
function updateFrame() {
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Define o tamanho do canvas
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Aplica zoom
    const zoomWidth = videoWidth / zoom;
    const zoomHeight = videoHeight / zoom;

    // Calcula o deslocamento do pan
    const offsetX = (videoWidth - zoomWidth) / 2 + (panX / 100) * (videoWidth - zoomWidth);
    const offsetY = (videoHeight - zoomHeight) / 2 + (panY / 100) * (videoHeight - zoomHeight);

    // Aplica rotação
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Desenha a imagem com zoom e pan
    ctx.drawImage(
        video,
        offsetX, offsetY, zoomWidth, zoomHeight, // Recorte da imagem
        0, 0, canvas.width, canvas.height        // Desenho no canvas
    );

    ctx.restore();

    // Repete o processo
    requestAnimationFrame(updateFrame);
}

// Inicia a atualização do frame
video.addEventListener('play', () => {
    updateFrame();
});

// Atualiza os valores de zoom, pan e rotação
document.getElementById('zoom').addEventListener('input', (e) => {
    zoom = parseFloat(e.target.value);
});

document.getElementById('pan-x').addEventListener('input', (e) => {
    panX = parseFloat(e.target.value);
});

document.getElementById('pan-y').addEventListener('input', (e) => {
    panY = parseFloat(e.target.value);
});

document.getElementById('rotation').addEventListener('input', (e) => {
    rotation = parseFloat(e.target.value);
});