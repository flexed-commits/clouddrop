document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const submitBtn = document.getElementById('submitBtn');
    const resultArea = document.getElementById('resultArea');
    const shareLink = document.getElementById('shareLink');
    const copyBtn = document.getElementById('copyBtn');

    // Trigger file selection when clicking the drop zone
    dropZone.addEventListener('click', () => fileInput.click());

    // Highlight drop zone on drag
    ['dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.toggle('drop-zone--over', eventName === 'dragover');
        });
    });

    // Handle File Upload
    submitBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        submitBtn.innerText = "Uploading...";
        submitBtn.disabled = true;

        // Using File.io (a free ephemeral file sharing API)
        // Note: In a real production app, you'd use your own backend or Firebase/AWS
        const formData = new FormData();
        formData.append('file', file);

        try {
            // File.io automatically deletes files after download/expiry
            // expires=4w sets it to 28 days
            const response = await fetch('https://file.io/?expires=4w', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                shareLink.value = data.link;
                resultArea.classList.remove('hidden');
            } else {
                alert("Upload failed. Try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred during upload.");
        } finally {
            submitBtn.innerText = "Upload & Generate Link";
            submitBtn.disabled = false;
        }
    });

    // Copy to Clipboard Logic
    copyBtn.addEventListener('click', () => {
        shareLink.select();
        document.execCommand('copy');
        copyBtn.innerText = "Copied!";
        setTimeout(() => copyBtn.innerText = "Copy", 2000);
    });
});
