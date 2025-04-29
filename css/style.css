document.addEventListener('DOMContentLoaded', () => {
    const getStartedBtn = document.getElementById('getStartedBtn');
    const toolSection = document.getElementById('toolSection');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const downloadSourceBtn = document.getElementById('downloadSourceBtn');
    const extractStatus = document.getElementById('extractStatus');
    const extensionUrlInput = document.getElementById('extensionUrl');
    const installBtn = document.getElementById('installBtn');
    const installStatus = document.getElementById('installStatus');
    const permissionModal = document.getElementById('permissionModal');
    const allowBtn = document.getElementById('allowBtn');
    const denyBtn = document.getElementById('denyBtn');
    let currentExtensionUrl = '';

    getStartedBtn.addEventListener('click', () => {
        toolSection.scrollIntoView({ behavior: 'smooth' });
        toolSection.classList.add('visible');
    });

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#4f46e5';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#d1d5db';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#d1d5db';
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.crx')) {
            processCrxFile(file);
        } else {
            extractStatus.textContent = 'Please upload a valid .CRX file';
        }
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file && file.name.endsWith('.crx')) {
            processCrxFile(file);
        } else {
            extractStatus.textContent = 'Please upload a valid .CRX file';
        }
    });

    function processCrxFile(file) {
        extractStatus.textContent = 'Processing...';
        const reader = new FileReader();
        reader.onload = () => {
            const arrayBuffer = reader.result;
            const zip = new JSZip();
            zip.loadAsync(arrayBuffer).then((zipContent) => {
                extractStatus.textContent = '';
                downloadSourceBtn.style.display = 'block';
                downloadSourceBtn.onclick = () => {
                    zip.generateAsync({ type: 'blob' }).then((blob) => {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${file.name.replace('.crx', '')}_source.zip`;
                        a.click();
                        URL.revokeObjectURL(url);
                        extractStatus.textContent = 'Source code downloaded successfully!';
                        extractStatus.classList.add('success');
                    });
                };
            }).catch(() => {
                extractStatus.textContent = 'Failed to extract source code';
            });
        };
        reader.readAsArrayBuffer(file);
    }

    installBtn.addEventListener('click', () => {
        const url = extensionUrlInput.value.trim();
        if (!url || !url.match(/^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+\/[a-zA-Z0-9-]+$/)) {
            installStatus.textContent = 'Please enter a valid extension URL';
            return;
        }
        currentExtensionUrl = url;
        permissionModal.style.display = 'flex';
        installStatus.textContent = '';
    });

    allowBtn.addEventListener('click', () => {
        permissionModal.style.display = 'none';
        customInstallExtension(currentExtensionUrl);
    });

    denyBtn.addEventListener('click', () => {
        permissionModal.style.display = 'none';
        installStatus.textContent = 'Installation cancelled';
    });

    function customInstallExtension(url) {
        installStatus.textContent = 'Fetching extension...';
        fetchCrxFile(url).then((crxData) => {
            const blob = new Blob([crxData], { type: 'application/x-chrome-extension' });
            const crxUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = crxUrl;
            a.download = 'extension.crx';
            a.click();
            URL.revokeObjectURL(crxUrl);
            installStatus.textContent = 'Extension downloaded. Drag it into Chrome to install.';
            installStatus.classList.add('success');
        }).catch((err) => {
            installStatus.textContent = `Failed to fetch extension: ${err.message}`;
        });
    }

    async function fetchCrxFile(url) {
        const extensionId = url.split('/').pop();
        const crxUrl = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=91.0.4472.114&acceptformat=crx2,crx3&x=id%3D${extensionId}%26uc`;
        const response = await fetch(crxUrl, { method: 'GET', redirect: 'follow' });
        if (!response.ok) throw new Error('Network error');
        return await response.arrayBuffer();
    }
});
