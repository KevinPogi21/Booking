// document.addEventListener('DOMContentLoaded', async () => {
//     const tourGuideId = 1; // Replace this with the dynamic tour guide ID as needed
//     const profilePicElement = document.querySelector('.profile-pic');
//     const guideNameElement = document.querySelector('.h2-guide-name span');
//     const aboutMeElement = document.querySelector('.about-me p');
//     const characteristicsList = document.querySelector('.characteristics-box .checklist');
//     const skillsList = document.querySelector('.skills-box .checklist');
//     const priceLabelElement = document.querySelector('.price-label');

//     try {
//         const response = await fetch('/update_profile_picture/');
//         const data = await response.json();

//         if (data.success) {
//             const profile = data.profile;

//             // Update profile picture
//             profilePicElement.src = profile.profile_picture;

//             // Update guide name
//             guideNameElement.textContent = profile.name;

//             // Update About Me section
//             aboutMeElement.textContent = profile.bio;

//             // Update Characteristics
//             characteristicsList.innerHTML = '';
//             profile.characteristics.forEach(characteristic => {
//                 const li = document.createElement('li');
//                 li.innerHTML = `<span class="checkmark">&#10003;</span> ${characteristic}`;
//                 characteristicsList.appendChild(li);
//             });

//             // Update Skills
//             skillsList.innerHTML = '';
//             profile.skills.forEach(skill => {
//                 const li = document.createElement('li');
//                 li.innerHTML = `<span class="checkmark">&#10003;</span> ${skill}`;
//                 skillsList.appendChild(li);
//             });

//             // Update Price
//             priceLabelElement.textContent = `₱${parseFloat(profile.price).toLocaleString()}`;
//         } else {
//             console.error("Profile not available or inactive:", data.message);
//         }
//     } catch (error) {
//         console.error("Error fetching tour guide profile:", error);
//     }
// });








// Tourguide Form
document.addEventListener('DOMContentLoaded', function () {
  const footerBookBtn = document.getElementById('footer-book-btn');
  const bookingForm = document.querySelector('.booking-form');
  const bookingModal = document.getElementById("booking-modal");
  const thankYouPopup = document.getElementById("thank-you-popup");
  const closeModalButton = document.getElementById("close-modal");
  const confirmBookingButton = document.querySelector('.confirm-btn');

  // Form input fields
  const dateInput = document.getElementById('date');
  const tourTypeInput = document.getElementById('tour-type');
  const travelerQuantityInput = document.getElementById('traveler-quantity');
  const personalizedTourInput = document.getElementById('personalized');

  // Modal display fields
  const modalTourDate = document.getElementById('modal-tour-date');
  const modalTourType = document.getElementById('modal-tour-type');
  const modalTravelerQuantity = document.getElementById('modal-traveler-quantity');
  const modalPersonalizedNotes = document.getElementById('modal-personalized-notes');

  // Open the modal with form values
  function openModal() {
      // Check if required fields are filled
      if (!dateInput.value) {
          closeModal(); // Close the modal if it was open
          alert("Please select a date.");
          dateInput.focus(); // Redirect user to date input field
          return; // Stop the function if date is missing
      }
      if (!tourTypeInput.value) {
          closeModal();
          alert("Please select a tour type.");
          tourTypeInput.focus();
          return;
      }
      if (!travelerQuantityInput.value) {
          closeModal();
          alert("Please enter the number of travelers.");
          travelerQuantityInput.focus();
          return;
      }

      // Set modal content based on input values
      modalTourDate.textContent = dateInput.value;
      modalTourType.textContent = tourTypeInput.options[tourTypeInput.selectedIndex].text;
      modalTravelerQuantity.textContent = travelerQuantityInput.value;
      modalPersonalizedNotes.textContent = personalizedTourInput.value || "N/A";

      bookingModal.style.display = "flex";
      document.body.style.overflow = "hidden"; // Disable background scrolling
  }

  confirmBookingButton.addEventListener('click', openModal);

  // Close Modal Function
  function closeModal() {
      bookingModal.style.display = "none"; // Hide the modal
      document.body.style.overflow = "auto"; // Enable background scrolling
  }

  // Attach event listener to close button
  closeModalButton.addEventListener('click', closeModal);

  // Show Thank You Popup After Confirming Booking
  function showThankYouMessage() {
      closeModal(); // Close the booking modal
      thankYouPopup.style.display = "flex"; // Show thank you popup

      // Hide the popup automatically after 3 seconds
      setTimeout(() => {
          thankYouPopup.style.display = "none";
      }, 3000);
  }

  // Optional: Close Modal by Clicking Outside of It
  window.onclick = function (event) {
      if (event.target === bookingModal) {
          closeModal();
      }
  };
});













//  Traveler Calendar
document.addEventListener('DOMContentLoaded', async function () {
  const dateInput = document.getElementById('date');
  const tourGuideId = 7 // Replace with actual ID or set dynamically based on selection

  if (!dateInput) {
      console.error("Date input field not found for Flatpickr initialization.");
      return;
  }

  try {
      const response = await fetch(`/tourguide/get_availability/${tourGuideId}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const availabilityData = await response.json();
      console.log("Fetched availability data:", availabilityData);

      const availableDates = availabilityData
          .filter(entry => entry.status === 'available')
          .map(entry => entry.date);

      flatpickr(dateInput, {
          dateFormat: 'Y-m-d',
          minDate: "today",
          enable: availableDates,
          onDayCreate: function (dObj, dStr, fp, dayElem) {
              const dateStr = dayElem.dateObj.toISOString().split('T')[0];
              if (availableDates.includes(dateStr)) {
                  dayElem.style.backgroundColor = '#4ecdc4';
                  dayElem.style.color = 'white';
                  dayElem.style.borderRadius = '50%';
              }
          }
      });
  } catch (error) {
      console.error('Error fetching availability:', error);
  }
});















