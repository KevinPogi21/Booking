

console.log('TourOperator.js loaded successfully!');

// Ensure everything runs after DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded.');

    // Sidebar Tab Switching Logic
    const navLinks = document.querySelectorAll('.nav-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabPanes.forEach((pane) => pane.classList.remove('active'));
    const activeTab = document.querySelector('.nav-link.active');
    if (activeTab) {
        document.getElementById(activeTab.dataset.tab).classList.add('active');
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach((link) => link.classList.remove('active'));
            tabPanes.forEach((pane) => pane.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(link.dataset.tab).classList.add('active');
        });
    });

    // Logout Modal Logic
    const logoutModal = document.getElementById('logout-modal');
    const confirmLogout = document.getElementById('confirm-logout');
    const cancelLogout = document.getElementById('cancel-logout');

    const logoutTab = document.querySelector('[data-tab="logout"]');
    if (logoutTab) {
        logoutTab.addEventListener('click', () => {
            logoutModal.classList.add('show');
        });
    }
    confirmLogout?.addEventListener('click', () => {
        window.location.href = '{{ url_for("touroperator.logout") }}';
    });

    cancelLogout?.addEventListener('click', () => {
        logoutModal.classList.remove('show');
    });





    // Booking Tab Switching Logic
    const bookingTabBtns = document.querySelectorAll('.booking-tab-btn');
    const bookingCategories = document.querySelectorAll('.booking-category');

    bookingTabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            bookingTabBtns.forEach((btn) => btn.classList.remove('active'));
            btn.classList.add('active');

            const status = btn.dataset.status;
            bookingCategories.forEach((category) => {
                const categoryStatus = category.dataset.status;
                category.style.display =
                    status === 'all' || categoryStatus === status ? 'block' : 'none';
            });
        });
    });




// Booking Details Modal Logic
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


    // Profile Picture Upload and Cropper Logic
    const changePicBtn = document.getElementById('change-pic-btn');
    const uploadPicInput = document.getElementById('upload-pic');
    const profilePic = document.getElementById('profile-pic');
    const cropperModal = document.getElementById('cropper-modal');
    const cropperContainer = document.getElementById('cropper-container');
    const cropBtn = document.getElementById('crop-btn');
    const closeCropperModal = document.getElementById('close-cropper-modal');
    const savePicBtn = document.getElementById('save-pic-btn');
    let cropper = null;

    changePicBtn?.addEventListener('click', () => uploadPicInput.click());

    uploadPicInput?.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.id = 'crop-image';
                cropperContainer.innerHTML = '';
                cropperContainer.appendChild(img);

                cropperModal.classList.add('show');
                cropper = new Cropper(img, { aspectRatio: 1, viewMode: 1 });
            };
            reader.readAsDataURL(file);
        }
    });

    cropBtn?.addEventListener('click', () => {
        if (cropper) {
            const canvas = cropper.getCroppedCanvas({ width: 200, height: 200 });
            profilePic.src = canvas.toDataURL();
            cropperModal.classList.remove('show');
            savePicBtn.classList.remove('hidden');
        }
    });

    savePicBtn?.addEventListener('click', () => {
        alert('Profile picture saved!');
        savePicBtn.classList.add('hidden');
    });

    closeCropperModal?.addEventListener('click', () => {
        cropperModal.classList.remove('show');
    });




    

    // Editable Fields Logic
    setupEditableSection('name');
    setupEditableSection('municipal');
    setupEditableSection('email');
    setupEditableSection('contact-number');

    function setupEditableSection(fieldId) {
        const editBtn = document.getElementById(`edit-${fieldId}-btn`);
        const saveBtn = document.getElementById(`save-${fieldId}-btn`);
        const input = document.getElementById(fieldId);

        editBtn?.addEventListener('click', () => {
            input.disabled = false;
            input.focus();
            editBtn.classList.add('hidden');
            saveBtn.classList.remove('hidden');
        });

        saveBtn?.addEventListener('click', () => {
            input.disabled = true;
            editBtn.classList.remove('hidden');
            saveBtn.classList.add('hidden');
        });
    }

    

    // Password Management Logic
    const editPasswordBtn = document.getElementById('edit-password-btn');
    const savePasswordBtn = document.getElementById('save-password-btn');
    const reenterPasswordGroup = document.getElementById('reenter-password-group');
    const newPasswordGroup = document.getElementById('new-password-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');

    editPasswordBtn?.addEventListener('click', () => togglePasswordEdit(true));
    savePasswordBtn?.addEventListener('click', () => togglePasswordEdit(false));

    function togglePasswordEdit(isEditing) {
        [reenterPasswordGroup, newPasswordGroup, confirmPasswordGroup].forEach(group => {
            group.classList.toggle('hidden', !isEditing);
        });
        editPasswordBtn.classList.toggle('hidden', isEditing);
        savePasswordBtn.classList.toggle('hidden', !isEditing);
    }
});








  // Add Tour Guide Modal Logic
  const addTourGuideBtn = document.getElementById('add-tour-guide-btn');
  const tourGuideModal = document.getElementById('tour-guide-modal');
  const closeTourGuideModal = document.getElementById('close-tour-guide-modal');

  addTourGuideBtn?.addEventListener('click', () => {
    tourGuideModal.classList.add('show');
  });

  closeTourGuideModal?.addEventListener('click', () => {
    tourGuideModal.classList.remove('show');
  });


  document.addEventListener('DOMContentLoaded', function() {
    // ** Open "Add Package" modal **
    document.getElementById('open-form-btn').addEventListener('click', () => {
      document.getElementById('form-modal').classList.add('show');
      document.getElementById('modal-overlay').classList.add('show');
    });
  
    // ** Close "Add Package" modal **
    document.getElementById('close-form-modal').addEventListener('click', () => {
      document.getElementById('form-modal').classList.remove('show');
      document.getElementById('modal-overlay').classList.remove('show');
    });
  
  // ** Open "View Package" modal **
  document.querySelectorAll('.view-package').forEach(button => {
    button.addEventListener('click', async function() {
      console.log("View Package button clicked");
      const packageId = this.getAttribute('data-package-id');
      console.log("Package ID:", packageId);

      try {
        // Fetch package details from server
        const response = await fetch(`/touroperator/get_tour_package/${packageId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
  
          // Populate modal header
          document.querySelector('.modal-header-image').src = data.package_img ? `/static/uploads/${data.package_img}` : '/static/default.jpg';
          document.querySelector('.package-title').textContent = data.name;
          // document.querySelector('.location').innerHTML = `<span class="location-icon">&#x1F4CD;</span> ${data.location}`;
  
          // Populate description
          document.querySelector('.description').textContent = data.description;
  
          // Populate estimated prices
          const priceList = document.querySelector('.price-list');
          priceList.innerHTML = '';
          data.estimated_prices.forEach(price => {
            const priceItem = document.createElement('li');
            priceItem.textContent = `${price.description}: $${price.estimated_price}`;
            priceList.appendChild(priceItem);
          });
  
          // Populate inclusions
          const inclusionsList = document.querySelector('.inclusions-list');
          inclusionsList.innerHTML = '';
          data.inclusions.forEach(inclusion => {
            const inclusionItem = document.createElement('li');
            inclusionItem.innerHTML = `<span class="checkmark">&#10003;</span> ${inclusion.inclusion}`;
            inclusionsList.appendChild(inclusionItem);
          });
  
          // Populate exclusions
          const exclusionsList = document.querySelector('.exclusions-list');
          exclusionsList.innerHTML = '';
          data.exclusions.forEach(exclusion => {
            const exclusionItem = document.createElement('li');
            exclusionItem.innerHTML = `<span class="crossmark">&#10007;</span> ${exclusion.exclusion}`;
            exclusionsList.appendChild(exclusionItem);
          });
  
          // Populate itinerary
          const itineraryList = document.querySelector('.itinerary-list');
          itineraryList.innerHTML = '';
          data.itineraries.forEach(item => {
            const itineraryItem = document.createElement('li');
            itineraryItem.innerHTML = `
              <span class="timeline-dot"></span>
              <div class="timeline-content"><strong>${item.title}:</strong> <p>${item.subtitle}</p></div>`;
            itineraryList.appendChild(itineraryItem);
          });
  
        // Show the "View Package" modal
        document.getElementById('tour-details-modal').classList.add('show');
        document.getElementById('modal-overlay').classList.add('show');
        console.log("Modal displayed");
      } catch (error) {
        console.error("Failed to load package details:", error);
      }
    });
  });

 // Close modal when the close buttons or overlay are clicked
 document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('tour-details-modal').classList.remove('show');
  document.getElementById('modal-overlay').classList.remove('show');
  console.log("Modal closed");
});

document.getElementById('close-modal-btn').addEventListener('click', () => {
  document.getElementById('tour-details-modal').classList.remove('show');
  document.getElementById('modal-overlay').classList.remove('show');
  console.log("Modal closed by Close button");
});

document.getElementById('modal-overlay').addEventListener('click', () => {
  document.getElementById('tour-details-modal').classList.remove('show');
  document.getElementById('modal-overlay').classList.remove('show');
  console.log("Modal closed by clicking overlay");
});


  
    // ** Add functionality for dynamic inclusions, exclusions, itinerary, and estimated prices in "Add Package" modal **
  
    // Add Estimated Price
    document.getElementById('add-estimated-price-btn').addEventListener('click', function() {
      const list = document.getElementById('estimated-price-list');
      const newItem = document.createElement('li');
      newItem.innerHTML = `
        <input type="text" name="estimated_price_description[]" placeholder="Description" class="editable-item" />
        <input type="text" name="estimated_price_value[]" placeholder="Price" class="editable-item" />
        <button type="button" class="remove-btn">Remove</button>`;
      list.appendChild(newItem);
    });
  
    // Add Inclusions
    document.getElementById('add-inclusion-btn').addEventListener('click', function() {
      const list = document.getElementById('inclusions-list');
      const newItem = document.createElement('li');
      newItem.innerHTML = `
        <input type="text" name="inclusions[]" placeholder="Add inclusion" class="editable-item" />
        <button type="button" class="remove-btn">Remove</button>`;
      list.appendChild(newItem);
    });
  
    // Add Exclusions
    document.getElementById('add-exclusion-btn').addEventListener('click', function() {
      const list = document.getElementById('exclusions-list');
      const newItem = document.createElement('li');
      newItem.innerHTML = `
        <input type="text" name="exclusions[]" placeholder="Add exclusion" class="editable-item" />
        <button type="button" class="remove-btn">Remove</button>`;
      list.appendChild(newItem);
    });
  
    // Add Itinerary
    document.getElementById('add-itinerary-btn').addEventListener('click', function() {
      const list = document.getElementById('itinerary-list');
      const newItem = document.createElement('li');
      newItem.innerHTML = `
        <input type="text" name="itinerary_title[]" placeholder="Title" class="editable-item" />
        <input type="text" name="itinerary_subtitle[]" placeholder="Subtitle" class="editable-item" />
        <button type="button" class="remove-btn">Remove</button>`;
      list.appendChild(newItem);
    });
  
    // ** Remove dynamic items on "Remove" button click **
    document.addEventListener('click', function(e) {
      if (e.target && e.target.classList.contains('remove-btn')) {
        e.target.parentElement.remove();
      }
    });
  });
  
  



  // // Add and Remove Estimated Prices
  // document.addEventListener('DOMContentLoaded', () => {
  //   const addEstimatedPriceBtn = document.getElementById('add-estimated-price-btn');
    
  //   if (addEstimatedPriceBtn) {
  //     addEstimatedPriceBtn.addEventListener('click', () => {
  //       const newExpense = document.createElement('li');
  //       newExpense.innerHTML = `<input type="text" placeholder="Description" class="editable-item" />
  //                               <input type="text" placeholder="Price" class="editable-item" />
  //                               <button type="button" class="remove-btn">Remove</button>`;
  //       document.getElementById('estimated-price-list').appendChild(newExpense);
  //       updateNameAttributes('estimated-price-list', 'estimated_prices');
  //     });
  //   } else {
  //     console.error("Element with ID 'add-estimated-price-btn' not found in the DOM.");
  //   }
  // });
  

  // // Add and Remove Inclusions/Exclusions
  // document.getElementById('add-inclusion-btn').addEventListener('click', () => {
  //   const newInclusion = document.createElement('li');
  //   newInclusion.innerHTML = `<input type="text" placeholder="Add inclusion" class="editable-item" />
  //                             <button type="button" class="remove-btn">Remove</button>`;
  //   document.getElementById('inclusions-list').appendChild(newInclusion);
  //   updateNameAttributes('inclusions-list', 'inclusions');
  // });

  // document.getElementById('add-exclusion-btn').addEventListener('click', () => {
  //   const newExclusion = document.createElement('li');
  //   newExclusion.innerHTML = `<input type="text" placeholder="Add exclusion" class="editable-item" />
  //                             <button type="button" class="remove-btn">Remove</button>`;
  //   document.getElementById('exclusions-list').appendChild(newExclusion);
  //   updateNameAttributes('exclusions-list', 'exclusions');
  // });

  // // Add and Remove Itinerary Items
  // document.getElementById('add-itinerary-btn').addEventListener('click', () => {
  //   const newItinerary = document.createElement('li');
  //   newItinerary.innerHTML = `<input type="text" placeholder="Title" class="editable-item" />
  //                             <input type="text" placeholder="Subtitle" class="editable-item" />
  //                             <button type="button" class="remove-btn">Remove</button>`;
  //   document.getElementById('itinerary-list').appendChild(newItinerary);
  //   updateNameAttributes('itinerary-list', 'itineraries');
  // });

//   // General removal handler for dynamic items and updating names after removal
//   document.addEventListener('click', (e) => {
//     if (e.target && e.target.classList.contains('remove-btn')) {
//       const parentList = e.target.closest('ul');
//       e.target.parentElement.remove();
//       // Update name attributes after an item is removed
//       if (parentList.id === 'estimated-price-list') updateNameAttributes('estimated-price-list', 'estimated_prices');
//       else if (parentList.id === 'inclusions-list') updateNameAttributes('inclusions-list', 'inclusions');
//       else if (parentList.id === 'exclusions-list') updateNameAttributes('exclusions-list', 'exclusions');
//       else if (parentList.id === 'itinerary-list') updateNameAttributes('itinerary-list', 'itineraries');
//     }
//   });

