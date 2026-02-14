// FAQ Functionality
document.addEventListener('DOMContentLoaded', function() {
  // --- EmailJS Initialization ---
  // IMPORTANT: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS Public Key from your account dashboard.
  emailjs.init('lUln9zR9vYfdlWGbI');


  // --- Hero Slider ---
  const faqQuestions = document.querySelectorAll('.faq-question');

  // --- Header Scroll Effect ---
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) { // Add class after scrolling 50px
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
  
  // --- TripAdvisor Badge Logic ---
  const tripAdvisorBadge = document.querySelector('.tripadvisor-badge-floating');
  const testimonialsSection = document.querySelector('.testimonials');

  if (tripAdvisorBadge) {
    // 1. Show for 5 seconds on page load
    tripAdvisorBadge.classList.add('visible');
    setTimeout(() => {
      // Only hide it if the testimonials section is not already in view
      const testimonialsRect = testimonialsSection ? testimonialsSection.getBoundingClientRect() : { top: 9999 };
      if (testimonialsRect.top > window.innerHeight || testimonialsRect.bottom < 0) {
        tripAdvisorBadge.classList.remove('visible');
      }
    }, 5000);

    // 2. Reappear when scrolling to the testimonials section
    if (testimonialsSection) {
      const badgeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tripAdvisorBadge.classList.add('visible');
          } else {
            tripAdvisorBadge.classList.remove('visible');
          }
        });
      }, { threshold: 0.1 }); // Appears when 10% of the section is visible

      badgeObserver.observe(testimonialsSection);
    }
  }

  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      const faqAnswer = faqItem.querySelector('.faq-answer');
      
      // Close all other FAQ items
      faqQuestions.forEach(otherQuestion => {
        const otherItem = otherQuestion.parentElement;
        const otherAnswer = otherItem.querySelector('.faq-answer');
        
        if (otherItem !== faqItem) {
          otherItem.classList.remove('active');
          otherAnswer.classList.remove('active');
        }
      });
      
      // Toggle current FAQ item
      faqItem.classList.toggle('active');
      faqAnswer.classList.toggle('active');
    });
  });

  // Smooth scrolling for anchor links
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Form submission
  const bookingForm = document.querySelector('.booking-form');
  
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple validation
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      if (!data.name || !data.email || !data.guests || !data.tour) {
        alert('Please fill in all required fields.');
        return;
      }

      const submitButton = this.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;

      // --- EmailJS Submission ---
      const serviceID = 'service_8iryo1g';
      const templateID = 'template_6sxlvus';

      // Manually create the template parameters object for reliability.
      // This ensures the data keys match your EmailJS template variables (e.g., {{name}}, {{tour_selection}}).
      const templateParams = {
        from_name: data.name, // Changed to match template variable {{from_name}}
        from_email: data.email, // Changed to match template variable {{from_email}}
        phone: data.phone || 'Not provided',
        guests: data.guests,
        tour_type: data.tour, // Changed to match template variable {{tour_type}}
        date_time: data.date || 'Not specified', // Changed to match template variable {{date_time}}
        message: data.message || 'No message',
        contact_method: 'Email', // Assuming email is the primary contact method from the form
        current_year: new Date().getFullYear() // Added for the footer in the template
      };

      emailjs.send(serviceID, templateID, templateParams)
        .then(() => {
          // Show custom thank you popup instead of alert
          const thankYouPopup = document.getElementById('thank-you-popup');
          const thankYouOverlay = document.getElementById('thank-you-overlay');
          if (thankYouPopup && thankYouOverlay) {
            thankYouOverlay.style.display = 'block';
            thankYouPopup.style.display = 'block';
            // Use a timeout to allow the display property to apply before adding the transition class
            setTimeout(() => {
              thankYouPopup.classList.add('visible');
            }, 10);
          } else {
            // Fallback to alert if popup elements are not found
            alert('Thank you for your booking request! We will contact you within 24 hours to confirm your adventure.');
          }

          this.reset(); // Reset form on success

        }, (err) => {
          console.error('EmailJS Error:', err);
          alert('Oops! Something went wrong and your message could not be sent. Please try again or contact us directly.');
        })
        .finally(() => {
          // Restore button text and state regardless of outcome
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
        });
    });
  }

  // --- Thank You Popup Close Functionality ---
  const thankYouPopup = document.getElementById('thank-you-popup');
  const thankYouOverlay = document.getElementById('thank-you-overlay');
  const thankYouOkButton = document.getElementById('thank-you-ok');

  function closeThankYouPopup() {
    if (thankYouPopup && thankYouOverlay) {
      thankYouPopup.classList.remove('visible');
      // Wait for the transition to finish before hiding
      setTimeout(() => {
        thankYouOverlay.style.display = 'none';
        thankYouPopup.style.display = 'none';
      }, 300); // Must match the CSS transition duration
    }
  }

  if (thankYouOkButton) thankYouOkButton.addEventListener('click', closeThankYouPopup);

  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections for animation
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // Hero section is always visible
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.style.opacity = '1';
    heroSection.style.transform = 'translateY(0)';
  }

  // Button click handlers
  const bookNowButtons = document.querySelectorAll('.btn-primary');
  bookNowButtons.forEach(button => {
    if (button.textContent.includes('Book Now')) {
      button.addEventListener('click', function() {
        const bookingSection = document.querySelector('.booking');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });

  // --- Hero Slider Functionality ---
  const sliderContainer = document.getElementById('hero-slider');
  if (sliderContainer) {
    const images = [
      'images/1.jpeg', 'images/2.jpeg', 'images/3.jpeg', 'images/4.jpg', 'images/5.jpeg',
      'images/6.jpeg', 'images/7.jpeg', 'images/8.jpeg', 'images/9.jpeg', 'images/10.jpeg',
      'images/11.jpeg', 'images/12.jpeg', 'images/13.jpeg', 'images/14.jpeg', 'images/15.jpeg',
      'images/16.jpeg', 'images/17.jpeg', 'images/18.jpeg', 'images/19.jpeg', 'images/20.jpeg'
    ];

    // Create slides and prepare for loading
    images.forEach((imgSrc, index) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      // Use a data attribute to hold the image source for loading
      slide.dataset.src = imgSrc;
      if (index === 0) {
        // Load the first image immediately
        slide.style.backgroundImage = `url(${imgSrc})`;
        slide.classList.add('active');
      }
      sliderContainer.appendChild(slide);
    });

    // Robust slider logic with preloading
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slider .slide');

    const slideInterval = setInterval(() => {
      const nextSlideIndex = (currentSlide + 1) % slides.length;
      const nextSlide = slides[nextSlideIndex];
      
      const performTransition = () => {
        slides[currentSlide].classList.remove('active');
        nextSlide.classList.add('active');
        currentSlide = nextSlideIndex;
      };

      // If the image is already loaded (from a previous cycle), transition immediately.
      if (nextSlide.style.backgroundImage) {
        performTransition();
      } else {
        // If the image is not loaded, create it, wait for it to load, and THEN transition.
        const img = new Image();
        img.src = nextSlide.dataset.src;
        img.onload = () => {
          nextSlide.style.backgroundImage = `url(${img.src})`;
          performTransition(); // The key: transition only after the image is ready.
        };
      }
    }, 7000); // Change slide every 7 seconds
  }


  // --- In-Popup "Inquire" Button ---


  // --- Popup Functionality ---

  const tourData = {
    'cave-tubing-nohoch-cheen': {
      title: "Cave Tubing at Nohoch Che'en",
      price: '$164 US',
      description: "Embark on a journey into the Mayan underworld at the Nohoch Che'en Caves Branch Archaeological Reserve. After a short jungle hike, you'll settle into your inner tube and float into a series of breathtaking limestone caves. With only your headlamp to light the way, you'll discover stunning crystal formations, ancient Mayan artifacts, and a world hidden from the sun.",
      image: 'images/5.jpeg',
      duration: '7AM to 5:00PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Swimsuit and a towel',
        'Water shoes or sandals with a backstrap',
        'A change of dry clothes for after the tour',
        'Sunscreen and insect repellent',
        'Waterproof camera or phone case',
        'Cash for souvenirs or tips'
      ]
    },
    'xunantunich-cave-tubing': {
      title: 'Xunantunich + Cave Tubing',
      price: '$194 US',
      description: "Experience the best of Belize's history and adventure. Start your day by crossing the Mopan River on a hand-cranked ferry to reach the ancient city of Xunantunich. Climb the magnificent 'El Castillo' pyramid for panoramic views, then journey to the cool, dark caves for a relaxing and mystical float through the Mayan underworld.",
      image: 'images/12.jpeg',
      duration: '6AM to 5:30PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable walking shoes for the ruins',
        'Swimsuit and a towel',
        'Water shoes for tubing',
        'A change of dry clothes',
        'Sunscreen, hat, and insect repellent',
        'Cash for souvenirs or tips'
      ]
    },
    'xunantunich-blue-hole': {
      title: 'Xunantunich + Blue Hole',
      price: '$150 US',
      description: "Step back in time at the impressive Xunantunich archaeological site, home to one of Belize's tallest Mayan structures. After exploring the plazas and temples, cool off with a refreshing swim in the famous St. Herman's Blue Hole, a stunning sapphire-blue cenote surrounded by lush jungle.",
      image: 'images/7.jpeg',
      duration: '6AM to 5:30PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable walking shoes for the ruins',
        'Swimsuit and a towel',
        'A change of dry clothes',
        'Sunscreen, hat, and insect repellent',
        'Camera to capture memories',
        'Cash for souvenirs or tips'
      ]
    },
    'cheil-chocolate-half-day': {
      title: 'Half Day Cheil Chocolate',
      price: '$70 US',
      description: "Indulge your sweet tooth with an authentic 'bean-to-bar' chocolate experience. At a local organic farm, you'll learn the entire process, from harvesting cacao pods to grinding the beans and creating your own delicious Mayan chocolate. This is a fun, interactive, and tasty way to learn about a key part of Belizean culture.",
      image: 'missing images/Half Day Cheil_.jpg',
      duration: '8AM to 1PM',
      groupSize: 'Minimum 3 people',
      included: ['Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable clothing and shoes',
        'Camera to capture the experience',
        'Insect repellent',
        'Cash for purchasing chocolate or souvenirs'
      ]
    },
    'cockscomb-jungle-cheil-chocolate': {
      title: 'Cockscomb Jungle + Cheil Chocolate',
      price: '$125 US',
      description: "A perfect blend of wildlife and flavor. Spend your morning hiking the verdant trails of the Cockscomb Basin Wildlife Sanctuary, the world's first jaguar preserve. Look for tracks, listen for birds, and immerse yourself in nature. Afterwards, reward yourself with a hands-on chocolate making tour at a local farm.",
      image: 'images/15.jpeg',
      duration: '8AM to 3:30PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable hiking shoes',
        'Lightweight long-sleeved shirt for sun/bug protection',
        'Sunscreen, hat, and insect repellent',
        'Cash for souvenirs or tips'
      ]
    },
    'cockscomb-jungle-waterfall': {
      title: 'Cockscomb Jungle + Cockscomb Waterfall',
      price: '$110 US',
      description: "Journey deep into the Cockscomb Basin, a sanctuary renowned for its rich biodiversity and jaguar population. Hike through dense tropical forest, keeping an eye out for exotic birds and wildlife, before arriving at a stunning, secluded waterfall where you can take a refreshing swim in the cool, clear waters.",
      image: 'images/cockscomb2.jpeg', // Jaguar image is best for Cockscomb
      duration: '8AM to 4:00PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable hiking shoes that can get wet',
        'Swimsuit and a towel',
        'A change of dry clothes',
        'Sunscreen, hat, and insect repellent',
        'Cash for souvenirs or tips'
      ]
    },
    'cockscomb-jungle-rivertubing': {
      title: 'Cockscomb Jungle + Cockscomb Rivertubing',
      price: '$115 US',
      description: "Discover the Cockscomb Basin from two perspectives. First, hike its famous jungle trails, learning about the flora and fauna of this vital jaguar habitat. Then, take to the water for a relaxing river tubing adventure, floating gently downstream while surrounded by the sights and sounds of the pristine rainforest.",
      image: 'images/coccomb1.jpeg',
      duration: '8AM to 4:00PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Swimsuit and a towel',
        'Water shoes or sandals with a backstrap',
        'A change of dry clothes',
        'Comfortable hiking shoes for the jungle walk',
        'Sunscreen, hat, and insect repellent',
        'Cash for souvenirs or tips'
      ]
    },
    'cockscomb-jungle-night-tour': {
      title: 'Cockscomb Jungle Night Tour',
      price: '$105 US',
      description: "As the sun sets, the jungle transforms. This unique tour takes you into the Cockscomb Basin after dark, offering a rare chance to spot nocturnal creatures. With your guide and a flashlight, you'll search for animals like kinkajous, owls, and maybe even the elusive jaguar, experiencing the rainforest in a whole new light.",
      image: 'images/forest2.jpeg', // Jaguar image is best for Cockscomb
      duration: '4PM to 10PM',
      groupSize: 'Minimum 3 people',
      included: ['Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Closed-toe shoes (hiking boots recommended)',
        'Long pants and a long-sleeved shirt for bug protection',
        'A small flashlight or headlamp (optional, guide will have one)',
        'Strong insect repellent'
      ]
    },
    'jungle-atv-waterfall': {
      title: 'Jungle ATV + Mayan World Waterfall',
      price: '$190 US',
      description: "Unleash your inner adventurer on this thrilling ATV tour! Navigate rugged jungle trails, splash through mud puddles, and climb hills to reach incredible viewpoints. The grand finale is a stop at a beautiful Mayan World waterfall, where you can wash off the mud and cool down with a well-deserved swim.",
      image: 'images/16.jpeg',
      duration: '8AM to 2PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Clothes you don\'t mind getting muddy',
        'Closed-toe shoes are mandatory for ATV',
        'Swimsuit and a towel',
        'A change of dry clothes',
        'Sunscreen and insect repellent',
        'Cash for souvenirs or tips'
      ]
    },
    'zipline-cheil-chocolate': {
      title: 'Zipline Mayan World + Cheil Chocolate',
      price: '$190 US',
      description: "Get a bird's-eye view of the jungle as you soar through the canopy on an exhilarating zipline course. Feel the rush of wind as you glide from platform to platform. After your aerial adventure, come back down to earth for a sweet and educational tour at a local chocolate farm.",
      image: 'missing images/Zipline Mayan World + Cheil Chocolate_.jpg',
      duration: '8AM to 3:30PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable clothing and closed-toe shoes',
        'Sunscreen and insect repellent',
        'Camera to capture memories',
        'Cash for souvenirs or tips'
      ]
    },
    'zipline-rivertubing-waterfall': {
      title: 'Zipline + Rivertubing + Waterfall',
      price: '$190 US',
      description: "The ultimate trifecta of adventure! Start your day with an adrenaline rush, flying through the jungle canopy on a series of ziplines. Next, cool off with a relaxing float down a gentle river. Finally, end your perfect day with a swim in the refreshing pools of a stunning natural waterfall.",
      image: 'images/17.jpeg', // Zipline is the main draw
      duration: '8AM to 4:00PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Closed-toe shoes for ziplining',
        'Swimsuit and a towel',
        'Water shoes or sandals with a backstrap',
        'A change of dry clothes',
        'Sunscreen and insect repellent',
        'Cash for souvenirs or tips'
      ]
    },
    'horse-back-riding-waterfall': {
      title: 'Horse Back Riding to Waterfall',
      price: '$135 US',
      description: "Saddle up for a peaceful and scenic journey through the Belizean countryside. Your gentle horse will carry you along jungle trails and across open fields to a beautiful, secluded waterfall. It's the perfect spot to dismount, relax, and take a refreshing dip in a pristine natural pool.",
      image: 'images/horse1.jpeg', // Waterfall is the destination
      duration: '8AM to 1PM',
      groupSize: 'Minimum 3 people',
      included: ['Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Long pants are recommended for riding',
        'Closed-toe shoes',
        'Swimsuit (can be worn underneath) and a towel',
        'Sunscreen, hat, and insect repellent',
        'Cash for souvenirs or tips'
      ]
    },
    'cheil-chocolate-waterfall': {
      title: 'Cheil Chocolate + Mayan World Waterfall',
      price: '$125 US',
      description: "A tour that delights the senses. First, learn the ancient art of chocolate making from bean to bar at a local organic farm. After tasting your delicious creations, take a short trip to a stunning Mayan World waterfall for a refreshing swim in its crystal-clear waters.",
      image: 'images/Chocolate1.jpeg', // Chocolate is a key component
      duration: '8AM to 3:30PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable clothing and walking shoes',
        'Swimsuit and a towel',
        'A change of dry clothes',
        'Sunscreen and insect repellent',
        'Cash for souvenirs or tips'
      ]
    },
    'mayan-cooking-nim-li-punit': {
      title: 'Mayan Cooking + Nim Li Punit',
      price: '$140 US',
      description: "Dive deep into Mayan culture, both ancient and modern. You'll visit the Nim Li Punit archaeological site, famous for its numerous stelae, before participating in a hands-on cooking class where you'll learn to prepare traditional Mayan dishes using age-old techniques and local ingredients.",
      image: 'images/nimli-punit1.jpeg', // Nim Li Punit stela is unique
      duration: '8AM to 5PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable walking shoes',
        'Sunscreen and a hat for the ruins',
        'Insect repellent',
        'Cash for souvenirs or tips'
      ]
    },
    'mayan-cooking-ixcacao-chocolate': {
      title: 'Mayan Cooking + Ixcacao Chocolate',
      price: '$140 US',
      description: "A journey for your taste buds! Learn the secrets of traditional Mayan cuisine in an authentic, hands-on cooking class. Then, discover the rich history and flavor of cacao with a tour at Ixcacao, a family-run farm that still makes chocolate the way their ancestors did.",
      image: 'images/maya1.jpeg', // Represents both cooking (tamales) and chocolate
      duration: '8AM to 5PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable shoes',
        'Camera for photos',
        'Cash for purchasing chocolate or souvenirs'
      ]
    },
    'ixcacao-chocolate-spice-farm': {
      title: 'Ixcacao Chocolate + Spice Farm',
      price: '$140 US',
      description: "Awaken your senses with this flavorful tour. First, experience the rich, authentic taste of Mayan chocolate at Ixcacao. Then, embark on an aromatic journey at a local spice farm, where you'll see, smell, and taste spices like vanilla, cinnamon, and nutmeg growing in their natural environment.",
      image: 'missing images/Ixcacao Chocolate + Spice Farm_.jpg',
      duration: '8AM to 5PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable walking shoes',
        'Sunscreen and insect repellent',
        'Camera for photos',
        'Cash for purchasing chocolate, spices, or souvenirs'
      ]
    },
    'spice-farm-nim-li-punit': {
      title: 'Spice Farm + Nim Li Punit',
      price: '$140 US',
      description: "A tour of scents and stones. Begin with an aromatic exploration of a Belizean spice farm, learning about the cultivation of vanilla, black pepper, and other spices. Afterwards, travel back in time with a visit to the Nim Li Punit Mayan site, known for its well-preserved stelae depicting ancient rulers.",
      image: 'images/spice3.jpeg', // Nim Li Punit stela is unique
      duration: '8AM to 5PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable walking shoes',
        'Sunscreen, hat, and insect repellent',
        'Camera for photos',
        'Cash for purchasing spices or souvenirs'
      ]
    },
    'ixcacao-chocolate-nim-li-punit': {
      title: 'Ixcacao Chocolate + Nim Li Punit',
      price: '$140 US',
      description: "Explore the legacy of the Maya through both taste and sight. Indulge in a traditional chocolate-making tour at Ixcacao, then visit the nearby Nim Li Punit archaeological site to see the impressive stone carvings (stelae) that tell the story of this ancient Mayan city.",
      image: 'images/nimli-punit3.jpeg', // Shows a Mayan ruin
      duration: '8AM to 5PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable walking shoes',
        'Sunscreen, hat, and insect repellent',
        'Camera for photos',
        'Cash for purchasing chocolate or souvenirs'
      ]
    },
    'ixcacao-chocolate-spice-farm-waterfall': {
      title: 'Ixcacao Chocolate + Spice Farm + Waterfall',
      price: '$170 US',
      description: "A true feast for the senses! This full-day tour combines a traditional chocolate tour at Ixcacao, an aromatic visit to a local spice farm, and a relaxing finale at a beautiful waterfall where you can swim and unwind after a day of exploration.",
      image: 'missing images/Ixcacao Chocolate + Spice Farm + Waterfall_.jpg',
      duration: '7AM to 5:30PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable walking shoes',
        'Swimsuit and a towel',
        'A change of dry clothes',
        'Sunscreen and insect repellent',
        'Cash for souvenirs or tips'
      ]
    },
    'spice-farm-ixcacao-nim-li-punit': {
      title: 'Spice Farm + Ixcacao Chocolate + Nim Li Punit',
      price: '$170 US',
      description: "The ultimate cultural tour of Southern Belize. This comprehensive adventure takes you to a fragrant spice farm, the traditional Ixcacao chocolate makers, and the historic Nim Li Punit Mayan ruins, offering a deep dive into the region's rich agricultural and historical heritage.",
      image: 'images/nimli-punit2.jpeg', // Nim Li Punit is a strong visual anchor
      duration: '7AM to 5:30PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable walking shoes',
        'Sunscreen, hat, and insect repellent',
        'Camera for photos',
        'Cash for purchasing chocolate, spices, or souvenirs'
      ]
    },
    'ixcacao-chocolate-waterfall': {
      title: 'Ixcacao Chocolate + Mayan World Waterfall',
      price: '$140 US',
      description: "A perfectly balanced day of flavor and relaxation. Start with an authentic chocolate-making experience at the renowned Ixcacao farm. After indulging your sweet tooth, unwind with a refreshing swim in the cool, clear waters of a stunning Mayan World waterfall.",
      image: 'images/cacao2.jpeg', // Chocolate is a key component
      duration: '8AM to 5PM',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable walking shoes',
        'Swimsuit and a towel',
        'A change of dry clothes',
        'Sunscreen and insect repellent',
        'Cash for purchasing chocolate or souvenirs'
      ]
    },
    'chocolate-classes': {
      title: 'Chocolate Classes',
      price: '$46 US',
      description: "Perfect for those short on time but big on flavor! This focused class teaches you the fascinating history of cacao, lets you taste various types of chocolate, and guides you in making your very own chocolate treat to take with you. A fun and delicious cultural lesson.",
      image: 'missing images/Chocolate Classes_.jpg',
      duration: '1.5 hours',
      groupSize: 'Minimum 3 people',
      included: ['History', 'Tasting', 'Tour Guide'],
      bring: [
        'Camera for photos',
        'Cash for purchasing extra chocolate'
      ]
    },
    'placencia-lunch-walking-tour': {
      title: 'Placencia Lunch Walking Tour',
      price: '$66 US',
      description: "Eat your way through paradise! This walking tour takes you along the famous Placencia sidewalk to sample the best the village has to offer. You'll taste a variety of local dishes from different eateries, learning about the history and culture of Placencia from your expert guide along the way.",
      image: 'images/walking1.jpeg',
      duration: 'Approx. 3 hours',
      groupSize: 'Minimum 2 people',
      included: ['History', 'Tasting', 'Food and water'],
      bring: [
        'Comfortable walking shoes',
        'Sunscreen and a hat',
        'An appetite!'
      ]
    },
    'placencia-dinner-walking-tour': {
      title: 'Placencia Dinner Walking Tour',
      price: '$76 US',
      description: "As the sun sets, Placencia's culinary scene comes alive. This evening walking tour guides you to some of the best local spots for dinner and dessert. Experience the vibrant nightlife and diverse flavors of the village, from savory main courses to sweet Belizean treats.",
      image: 'images/walking2.jpeg', // Rigo with tourists fits the walking tour theme
      duration: 'Approx. 3 hours',
      groupSize: 'Minimum 2 people',
      included: ['History', 'Tasting', 'Food and water'],
      bring: [
        'Comfortable walking shoes',
        'Light jacket or sweater (evenings can be cool)',
        'An appetite!'
      ]
    },
    'mestizo-cooking-classes': {
      title: 'Mestizo Cooking Classes',
      price: '$75 US',
      description: "Join a local family to learn the secrets of Mestizo cooking. In this hands-on class, you'll learn to prepare delicious, traditional dishes like savory tamales, hearty escabeche, or cheesy pupusas from scratch. It's a cultural and culinary experience you won't forget.",
      image: 'images/mestizo2.jpeg', // Pupusas are a perfect fit
      duration: 'Approx. 3-4 hours',
      groupSize: 'Minimum 3 people',
      included: ['Tour Guide', 'Fees', 'Food Included', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable shoes',
        'Camera to document your cooking'
      ]
    },
    'garifuna-cooking-waterfall': {
      title: 'Garifuna Cooking + Mayan World Waterfall',
      price: '$130 US',
      description: "Immerse yourself in the vibrant Garifuna culture with a hands-on cooking class. Learn to make iconic dishes like Hudut (a fish and coconut stew). After enjoying the delicious meal you helped prepare, you'll take a trip to a beautiful waterfall for a relaxing afternoon swim.",
      image: 'images/garifuna1.jpeg', // Authentic cooking scene
      duration: 'Approx. 5-6 hours',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable shoes',
        'Swimsuit and a towel',
        'A change of dry clothes',
        'Sunscreen and insect repellent'
      ]
    },
    'garifuna-cooking-cheil-waterfall': {
      title: 'Garifuna Cooking + Cheil + Mayan World Waterfall',
      price: '$168 US',
      description: "A full day packed with culture and flavor! Start with a hands-on Garifuna cooking class, then discover the world of bean-to-bar chocolate at a local farm. Finish your amazing day with a refreshing dip in the cool waters of a Mayan World waterfall.",
      image: 'images/9.jpeg', // Authentic cooking scene
      duration: 'Full Day',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable shoes',
        'Swimsuit and a towel',
        'A change of dry clothes',
        'Sunscreen and insect repellent',
        'Cash for souvenirs or tips'
      ]
    },
    'mestizo-cooking-waterfall': {
      title: 'Mestizo Cooking + Mayan World Waterfall',
      price: '$115 US',
      description: "Learn to prepare delicious Mestizo dishes like tamales or pupusas in an authentic, hands-on cooking class. After you've enjoyed your culinary creations, spend a relaxing afternoon swimming and unwinding at the beautiful Mayan World waterfall.",
      image: 'missing images/Mestizo Cooking + Mayan World Waterfall_.jpg',
      duration: 'Approx. 5-6 hours',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable shoes',
        'Swimsuit and a towel',
        'A change of dry clothes',
        'Sunscreen and insect repellent'
      ]
    },
    'mestizo-cooking-cheil-chocolate': {
      title: 'Mestizo Cooking + Cheil Chocolate',
      price: '$130 US',
      description: "A day dedicated to Belizean flavors! First, master the art of traditional Mestizo cooking in a fun, hands-on class. Then, switch from savory to sweet with a fascinating bean-to-bar tour at a local chocolate farm, where you'll make your own chocolate.",
      image: 'images/cheil1.jpg', // Pupusas image is great for Mestizo cooking
      duration: 'Approx. 6 hours',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'Comfortable shoes',
        'Camera for photos',
        'Cash for purchasing chocolate or souvenirs'
      ]
    },
    'atm-cave': {
      title: 'ATM Cave Exploration',
      price: '$198 US',
      description: "Embark on a world-class caving adventure into Actun Tunichil Muknal (ATM), a sacred Mayan sacrificial site. This challenging tour involves hiking, wading through water, and climbing to reach 'The Cathedral', a stunning chamber filled with ancient pottery, skeletons, and the famous 'Crystal Maiden'.",
      image: 'images/1.jpeg',
      duration: 'Full Day',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'Transportation', 'One bottle of water each'],
      bring: [
        'A full change of clothes and a towel (you will get completely wet)',
        'Sturdy, closed-toe hiking shoes or water shoes that you can hike in',
        'A pair of socks (mandatory for inside the cave)',
        'Insect repellent',
        'NOTE: Cameras are NOT allowed on this tour'
      ]
    },
    'banana-farm-waterfall': {
      title: 'Banana Farm + Mayan World Waterfall',
      price: '(Inquire for price)',
      description: "Discover the journey of a banana from farm to table! This tour takes you through a working banana plantation to learn about the cultivation and harvesting process of one of Belize's top exports. Afterwards, cool off with a relaxing swim at a beautiful Mayan World waterfall.",
      image: 'missing images/Banana Farm tour_.jpg',
      duration: 'Full Day',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'One bottle of water each'],
      bring: [
        'Comfortable walking shoes',
        'Swimsuit and a towel',
        'A change of dry clothes',
        'Sunscreen, hat, and insect repellent',
        'Cash for souvenirs or tips'
      ]
    },
    'banana-farm-cheil-chocolate': {
      title: 'Banana Farm + Cheil Chocolate',
      price: '(Inquire for price)',
      description: "Explore two of Belize's most important and delicious crops. Start with a fascinating tour of a working banana farm to see how this fruit is grown and prepared for export. Then, switch gears for a hands-on chocolate making class at a local farm.",
      image: 'images/banana2.jpeg', // Banana is a strong visual
      duration: 'Full Day',
      groupSize: 'Minimum 3 people',
      included: ['Lunch', 'Tour Guide', 'Fees', 'One bottle of water each'],
      bring: [
        'Comfortable walking shoes',
        'Sunscreen, hat, and insect repellent',
        'Camera for photos',
        'Cash for purchasing chocolate or souvenirs'
      ]
    }
  };

  // Popup DOM elements
  const popupOverlay = document.querySelector('.popup-overlay');
  const popup = document.querySelector('.popup');
  const popupClose = document.querySelector('.popup-close');
  const popupTitle = document.getElementById('popup-title');
  const popupPrice = document.getElementById('popup-price');
  const popupImage = document.getElementById('popup-image');
  const popupDuration = document.getElementById('popup-duration');
  const popupGroupSize = document.getElementById('popup-group-size');
  const popupDescription = document.getElementById('popup-description');
  const popupIncluded = document.getElementById('popup-included');
  const popupBring = document.getElementById('popup-bring');

  const openPopup = (tourId) => {
    const data = tourData[tourId];
    if (!data) return;

    popupTitle.textContent = data.title;
    popupPrice.textContent = `Starting at ${data.price}`;
    popupImage.src = data.image;
    popupDuration.textContent = data.duration;
    popupGroupSize.textContent = data.groupSize;
    popupDescription.textContent = data.description;

    popupIncluded.innerHTML = data.included.map(item => `<li>${item}</li>`).join('');
    popupBring.innerHTML = data.bring.map(item => `<li>${item}</li>`).join('');

    popupOverlay.style.display = 'block';
    popup.style.display = 'block';
    setTimeout(() => {
      popup.style.opacity = '1';
      popup.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10); // Small delay to allow transition
  };

  const closePopup = () => {
    popup.style.opacity = '0';
    popup.style.transform = 'translate(-50%, -50%) scale(0.95)';
    setTimeout(() => {
      popupOverlay.style.display = 'none';
      popup.style.display = 'none';
    }, 300); // Match CSS transition duration
  };

  popupClose.addEventListener('click', closePopup);
  popupOverlay.addEventListener('click', closePopup);

  // --- Adventure Slider ---
  const adventureGrid = document.querySelector('.adventure-grid');
  if (adventureGrid) {
    // 1. Populate slider with all tours from tourData
    Object.keys(tourData).forEach(tourId => {
      const tour = tourData[tourId];
      const card = document.createElement('div');
      card.className = 'adventure-card';
      card.innerHTML = `
        <img src="${tour.image}" onerror="this.src='https://dummyimage.com/400x250/e5e5e5/666666?text=Tour'" alt="${tour.title}" referrerpolicy="no-referrer">
        <div class="card-content">
          <h3>${tour.title}</h3>
          <p>${tour.description.substring(0, 100)}...</p>
          <div class="card-footer">
            <span class="price">From ${tour.price}</span>
            <button class="btn btn-outline">Learn More</button>
          </div>
        </div>
      `;
      // Add click listener for the "Learn More" button on the new card
      card.querySelector('.btn-outline').addEventListener('click', () => openPopup(tourId));
      adventureGrid.appendChild(card);
    });

    // 2. Slider Logic
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    function updateSlider() {
      const cardToView = adventureGrid.children[currentIndex];
      const offset = cardToView ? -cardToView.offsetLeft + (adventureGrid.parentElement.offsetWidth - cardToView.offsetWidth) / 2 : 0;
      adventureGrid.style.transform = `translateX(${offset}px)`;
    }

    function nextSlide() {
      const totalCards = Object.keys(tourData).length;
      currentIndex = (currentIndex + 1) % totalCards;
      updateSlider();
    }

    function prevSlide() {
      const totalCards = Object.keys(tourData).length;
      currentIndex = (currentIndex - 1 + totalCards) % totalCards;
      updateSlider();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // 3. Auto-slide functionality
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
  }
  
  // Generic "Learn More" button in hero section
  const heroLearnMore = document.querySelector('.hero .btn-secondary');
  if (heroLearnMore) {
    heroLearnMore.addEventListener('click', function() {
      const aboutSection = document.querySelector('.about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    img.addEventListener('load', function() {
      this.style.opacity = '1';
    });
    
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    
    // If image is already loaded (cached)
    if (img.complete) {
      img.style.opacity = '1';
    }
  });
});
