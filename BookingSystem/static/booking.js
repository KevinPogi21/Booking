document.addEventListener('DOMContentLoaded', async () => {
    const tourGuideList = document.getElementById('tour-guide-list');
  
    try {
      const response = await fetch('/tourguide/active_tourguides');
      const guides = await response.json();
  
      guides.forEach(guide => {
        const guideCard = document.createElement('div');
        guideCard.className = 'tour-guide-card';
  
        guideCard.innerHTML = `
          <div class="profile-picture">
            <img src="${guide.profile_picture}" alt="Tour Guide Profile Picture">
          </div>
          <div class="guide-info">
            <h2 class="guide-name">Mabuhay! I Am <span>${guide.name}</span>, Your Friendly Tour Guide</h2>
            <div class="ratings">★★★★☆ (21 Reviews)</div>
            <p class="price">Starting Price: ₱${parseFloat(guide.price).toLocaleString()}</p>
            <a href="/tourguide/profile/${guide.id}">
              <button class="book-btn">Book Now</button>
            </a>
          </div>
        `;
  
        tourGuideList.appendChild(guideCard);
      });
    } catch (error) {
      console.error("Error fetching tour guides:", error);
    }
  });
  