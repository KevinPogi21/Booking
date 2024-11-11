console.log('TourOperator.js loaded successfully!');

// Ensure everything runs after DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded.');

    // --- Sidebar Toggle Logic ---
    const sidebarToggle = document.querySelector('.btn-sidebar-toggle');
    const sideNav = document.querySelector('.side-nav');
    
    if (sidebarToggle && sideNav) {
        sidebarToggle.addEventListener('click', () => {
            sideNav.classList.toggle('active');
        });
    }

    // --- Tab Switching Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior

            // Remove 'active' class from all links and tabs
            navLinks.forEach(link => link.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Activate clicked link and its corresponding tab pane
            link.classList.add('active');
            const targetTab = document.getElementById(link.dataset.tab);
            if (targetTab) targetTab.classList.add('active');

            // Close sidebar on smaller screens after switching tabs
            if (window.innerWidth < 768) {
                sideNav.classList.remove('active');
            }
        });
    });

    // Ensure the correct tab is shown on page load
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        const targetTab = document.getElementById(activeLink.dataset.tab);
        if (targetTab) targetTab.classList.add('active');
    }

    // --- Modal Logic ---
    const addOperatorBtn = document.getElementById('add-operator-btn');
    const operatorModalWrapper = document.getElementById('operator-modal-wrapper');
    const closeOperatorModal = document.getElementById('close-operator-modal');
    const modalOverlay = document.getElementById('modal-overlay');

    // Open Modal
    if (addOperatorBtn && operatorModalWrapper) {
        addOperatorBtn.addEventListener('click', () => {
            operatorModalWrapper.classList.add('show');
        });
    }

    // Close Modal
    [closeOperatorModal, modalOverlay].forEach(element => {
        if (element && operatorModalWrapper) {
            element.addEventListener('click', () => {
                operatorModalWrapper.classList.remove('show');
            });
        }
    });

    // --- Form Submission Logic ---
    const operatorForm = document.getElementById('operator-form');

    if (operatorForm) {
        operatorForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission for custom handling

            // Show success message and close the modal
            alert('Tour Operator Account Created Successfully!');
            operatorModalWrapper.classList.remove('show');

            // Submit the form programmatically
            operatorForm.submit();
        });
    }
});
