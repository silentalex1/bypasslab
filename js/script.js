document.addEventListener('DOMContentLoaded', () => {
    const getStartedBtn = document.getElementById('getStartedBtn');
    const toolSection = document.getElementById('toolSection');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const downloadSourceBtn = document.getElementById('downloadSourceBtn');
    const extractStatus = document.getElementById('extractStatus');
    const extensionRepoUrlInput = document.getElementById('extensionRepoUrl');
    const installBtn = document.getElementById('installBtn');
    const installStatus = document.getElementById('installStatus');
    const permissionModal = document.getElementById('permissionModal');
    const allowBtn = document.getElementById('allowBtn');
    const denyBtn = document.getElementById('denyBtn');
    let currentRepoUrl = '';
    let permissionsGranted = false;

    function requestPermissions() {
        return new Promise((resolve) => {
            permissionModal.style.display = 'flex';
            allowBtn.onclick = () => {
                permissionModal.style.display = 'none';
                permissionsGranted = true;
                resolve(true);
            };
            denyBtn.onclick = () => {
                permissionModal.style.display = 'none';
                permissionsGranted = false;
                resolve(false);
            };
        });
    }

    requestPermissions();

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

    installBtn.addEventListener('click', async () => {
        const repoUrl = extensionRepoUrlInput.value.trim();
        if (!repoUrl || !repoUrl.match(/^[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$/)) {
            installStatus.textContent = 'Please enter a valid GitHub repo URL (e.g., user/repo)';
            return;
        }
        if (!permissionsGranted) {
            const granted = await requestPermissions();
            if (!granted) {
                installStatus.textContent = 'Permissions denied. Installation cancelled.';
                return;
            }
        }
        currentRepoUrl = repoUrl;
        installStatus.textContent = '';
        customInstallExtension(currentRepoUrl);
    });

    function customInstallExtension(repo) {
        installStatus.textContent = 'Fetching extension from GitHub...';
        fetchCrxFromGitHub(repo).then((crxData) => {
            bypassChromeSecurity(crxData);
        }).catch((err) => {
            installStatus.textContent = `Failed to fetch extension: ${err.message}`;
        });
    }

    async function fetchCrxFromGitHub(repo) {
        const rawUrl = `https://raw.githubusercontent.com/${repo}/main/extension.crx`;
        const response = await fetch(rawUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/octet-stream',
                'Cache-Control': 'no-cache'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch .CRX from GitHub');
        return await response.arrayBuffer();
    }

    function bypassChromeSecurity(crxData) {
        const blob = new Blob([crxData], { type: 'application/x-chrome-extension' });
        const crxUrl = URL.createObjectURL(blob);
        const installFrame = document.createElement('iframe');
        installFrame.style.display = 'none';
        installFrame.src = crxUrl;
        document.body.appendChild(installFrame);
        setTimeout(() => {
            document.body.removeChild(installFrame);
            URL.revokeObjectURL(crxUrl);
            installStatus.textContent = 'Extension installation initiated. Check Chrome extensions page.';
            installStatus.classList.add('success');
        }, 1000);
        chrome.runtime.sendMessage({
            action: 'installExtension',
            url: crxUrl
        }, (response) => {
            if (response && response.success) {
                installStatus.textContent = 'Extension installed successfully!';
                installStatus.classList.add('success');
            } else {
                installStatus.textContent = 'Manual installation required. Drag the downloaded file into Chrome.';
            }
        });
    }

    if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'permissionGranted') {
                permissionsGranted = true;
                sendResponse({ success: true });
            }
        });
    }
});
