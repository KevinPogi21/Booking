document.addEventListener('DOMContentLoaded', () => {
    const viewPackageBtn = document.getElementById('view-package-btn');
    const modal = document.getElementById('tour-package-modal');
    const overlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal');

    viewPackageBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    });

    overlay.addEventListener('click', () => {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    });
});
