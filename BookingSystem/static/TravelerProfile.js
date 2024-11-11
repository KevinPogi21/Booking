// Smooth scrolling to sections
const tabLinks = document.querySelectorAll('.tab-link');

tabLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetSection = document.querySelector(link.getAttribute('href'));
    window.scrollTo({
      top: targetSection.offsetTop - 150, // Adjust for spacing
      behavior: 'smooth'
    });

    // Set active tab
    tabLinks.forEach(link => link.classList.remove('active'));
    link.classList.add('active');
  });
});



// Change Profile
const profilePic = document.getElementById('profile-pic');
const editPicBtn = document.getElementById('edit-pic-btn');
const uploadPicInput = document.getElementById('upload-pic');
const confirmModal = document.getElementById('confirm-modal');
const confirmChangeBtn = document.getElementById('confirm-change-btn');
const cancelChangeBtn = document.getElementById('cancel-change-btn');
const cropperModal = document.getElementById('cropper-modal');
const cropperContainer = document.getElementById('cropper-container');
const cropBtn = document.getElementById('crop-btn');
const closeCropperModal = document.getElementById('close-cropper-modal');

let cropper;

// Open confirmation modal on profile picture or edit button click
profilePic.addEventListener('click', () => openConfirmModal());
editPicBtn.addEventListener('click', () => openConfirmModal());

function openConfirmModal() {
  confirmModal.classList.add('show');
}

// Handle confirmation for opening file picker
confirmChangeBtn.addEventListener('click', () => {
  confirmModal.classList.remove('show');
  uploadPicInput.click();
});

// Cancel changing picture
cancelChangeBtn.addEventListener('click', () => {
  confirmModal.classList.remove('show');
});

// Open cropper modal after selecting a picture
uploadPicInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.id = 'crop-image';
      cropperContainer.innerHTML = ''; // Clear previous cropper
      cropperContainer.appendChild(img);
      cropperModal.classList.add('show');

      // Initialize cropper
      if (cropper) cropper.destroy(); // Destroy previous cropper instance
      cropper = new Cropper(img, {
        aspectRatio: 1,
        viewMode: 1,
        movable: true,
        zoomable: true,
        scalable: true,
        cropBoxResizable: true,
      });
    };
    reader.readAsDataURL(file);
  }
});

// Crop and upload the image to the backend
cropBtn.addEventListener('click', async () => {
  const canvas = cropper.getCroppedCanvas({
    width: 150,
    height: 150,
  });

  // Convert the canvas to a blob and send it to the backend
  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append('profile_picture', blob, 'profile.jpg');

    try {
      // Show loading message or spinner here if desired
      const response = await fetch('/update_profile_picture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error(`Failed to update profile picture. Status: ${response.status} ${response.statusText}`);
        const errorData = await response.json();
        console.error("Error message from server:", errorData);
        alert('Failed to update profile picture.');
      } else {
        const data = await response.json();
        
        // Update the profile picture in the UI immediately
        profilePic.src = `${data.image_url}?timestamp=${new Date().getTime()}`; // Append timestamp to avoid caching issues
        alert('Profile picture updated successfully!');
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("An error occurred while uploading the profile picture.");
    }

    // Close the cropper modal
    cropperModal.classList.remove('show');
  });
});

// Close cropper modal
closeCropperModal.addEventListener('click', () => {
  cropperModal.classList.remove('show');
});



// My Tours Toggles Function
const toggleButtons = document.querySelectorAll('.toggle-btn');
const tourCards = document.querySelectorAll('.tour-card');

// Initialize layout on load to fix spacing issue
window.addEventListener('DOMContentLoaded', () => {
  toggleButtons[0].click(); // Simulate a click to trigger layout adjustment
});

// Toggle visibility based on category
toggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Remove active state from all buttons
    toggleButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const status = button.dataset.status;

    // Show/Hide cards based on the selected status
    tourCards.forEach((card) => {
      const cardStatus = card.dataset.status;
      card.style.display =
        status === 'all' || cardStatus === status ? 'block' : 'none';
    });
  });
});









// Review Cards Hide Function
const toggleReviewsBtn = document.getElementById('toggle-reviews');
const reviewsContainer = document.getElementById('reviews-container');

// Toggle Reviews Visibility
toggleReviewsBtn.addEventListener('click', () => {
  reviewsContainer.classList.toggle('hidden');

  // Change icon based on visibility
  toggleReviewsBtn.innerHTML = 
    reviewsContainer.classList.contains('hidden') ? '&#128584;' : '&#128065;';
});




// Show Booking modal logic
const bookingModal = document.getElementById('booking-modal');
const bookingInfo = document.getElementById('booking-info');
const closeBookingModal = document.getElementById('close-booking-modal');

function openBookingDetails(details) {
  bookingInfo.textContent = details;
  bookingModal.classList.add('show');
}

closeBookingModal.addEventListener('click', () => {
  bookingModal.classList.remove('show');
});


// Open and Close To Review Modal
const reviewButtons = document.querySelectorAll('.review-btn');
const reviewModal = document.getElementById('review-modal');
const closeReviewModal = document.getElementById('close-review-modal');
const stars = document.querySelectorAll('.star');

// Open the modal when a review button is clicked
reviewButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    reviewModal.classList.add('show');
  });
});

// Close the modal
closeReviewModal.addEventListener('click', () => {
  reviewModal.classList.remove('show');
});

// Star Rating Logic
stars.forEach((star, index) => {
  star.addEventListener('click', () => {
    stars.forEach((s, i) => {
      s.classList.toggle('active', i <= index); // Highlight stars up to the clicked one
    });
  });
});















// Change Password and Email
const editEmailBtn = document.getElementById('edit-email-btn');
const editPasswordBtn = document.getElementById('edit-password-btn');
const passwordConfirmModal = document.getElementById('password-confirm-modal');
const confirmPasswordInput = document.getElementById('confirm-password-input');
const passwordConfirmBtn = document.getElementById('password-confirm-btn');
const passwordCancelBtn = document.getElementById('password-cancel-btn');
const changeEmailModal = document.getElementById('change-email-modal');
const changePasswordModal = document.getElementById('change-password-modal');
const modalOverlay = document.getElementById('modal-overlay');
const saveEmailBtn = document.getElementById('save-email-btn');
const cancelEmailBtn = document.getElementById('cancel-email-btn');
const savePasswordBtn = document.getElementById('save-password-btn');
const cancelPasswordBtn = document.getElementById('cancel-password-btn');

let activeAction = '';

// Open the password confirmation modal
editEmailBtn.addEventListener('click', () => {
  activeAction = 'email';
  openPasswordModal();
});

editPasswordBtn.addEventListener('click', () => {
  activeAction = 'password';
  openPasswordModal();
});

// Confirm password and open the appropriate modal
passwordConfirmBtn.addEventListener('click', async () => {
  const enteredPassword = confirmPasswordInput.value;

  try {
    const response = await fetch('/tourguide/verify_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: enteredPassword }),
    });

    const result = await response.json();

    if (result.success) {
      closeModal(); // Close password confirmation modal
      if (activeAction === 'email') {
        openChangeEmailModal();
      } else if (activeAction === 'password') {
        openChangePasswordModal();
      }
    } else {
      alert('Incorrect password. Please try again.');
    }
  } catch (error) {
    console.error('Error verifying password:', error);
    alert('An error occurred while verifying the password. Please try again.');
  }
});

// Save new email
// Save new email
saveEmailBtn.addEventListener('click', async () => {
  const newEmail = document.getElementById('new-email-input').value;
  try {
    const response = await fetch('/tourguide/update_email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail }),
    });
    const result = await response.json();
    if (result.success) {
      alert('Email updated successfully!');
      closeModal();
    } else {
      alert(result.message || 'Failed to update email');
    }
  } catch (error) {
    console.error('Error updating email:', error);
    alert('An error occurred. Please try again.');
  }
});

// Save new password
savePasswordBtn.addEventListener('click', async () => {
  const newPassword = document.getElementById('new-password').value;
  const confirmNewPassword = document.getElementById('confirm-new-password').value;

  if (newPassword !== confirmNewPassword) {
    alert('Passwords do not match. Please try again.');
    return;
  }

  try {
    const response = await fetch('/update_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword }),
    });
    const result = await response.json();
    if (result.success) {
      alert('Password updated successfully!');
      closeModal();
    } else {
      alert(result.message || 'Failed to update password');
    }
  } catch (error) {
    console.error('Error updating password:', error);
    alert('An error occurred. Please try again.');
  }
});


// Cancel button handlers
passwordCancelBtn.addEventListener('click', closeModal);
cancelEmailBtn.addEventListener('click', closeModal);
cancelPasswordBtn.addEventListener('click', closeModal);

// Helper functions to open and close modals
function openPasswordModal() {
  passwordConfirmModal.classList.add('show');
  modalOverlay.classList.add('show');
}

function openChangeEmailModal() {
  changeEmailModal.classList.add('show');
  modalOverlay.classList.add('show');
}

function openChangePasswordModal() {
  changePasswordModal.classList.add('show');
  modalOverlay.classList.add('show');
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('show'));
  modalOverlay.classList.remove('show');
  confirmPasswordInput.value = ''; // Clear password input
};
