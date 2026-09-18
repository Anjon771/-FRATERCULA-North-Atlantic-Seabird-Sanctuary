/**
 * FRATERCULA - Atlantic Puffin Sanctuary & Expedition Platform
 * Interactive Vertical Slider, Web Audio Synthesizer, & Field Guide Controller
 */

(function () {
  "use strict";

  // -------------------------------------------------------------
  // DOM Elements Selection
  // -------------------------------------------------------------
  const slides = Array.from(document.querySelectorAll(".slider-content"));
  const navDots = Array.from(document.querySelectorAll(".navigator.dot"));
  const desktopNavItems = Array.from(
    document.querySelectorAll(".desktop-nav .nav-item"),
  );
  const mobileNavLinks = Array.from(
    document.querySelectorAll(".mobile-nav-link"),
  );
  const menuToggleBtn = document.getElementById("menuToggleBtn");
  const mobileMenuDrawer = document.getElementById("mobileMenuDrawer");
  const arrowIcon = document.getElementById("arrowIcon");
  const slideCounterDisplay = document.getElementById("slideCounterDisplay");
  const liveUtcClock = document.getElementById("liveUtcClock");
  const toastNotification = document.getElementById("toastNotification");
  const toastMessage = document.getElementById("toastMessage");
  const toastIcon = document.getElementById("toastIcon");

  // Modal elements
  const fieldGuideModal = document.getElementById("fieldGuideModal");
  const openFieldGuideBtn = document.getElementById("openFieldGuideBtn");
  const heroGuideTrigger = document.getElementById("heroGuideTrigger");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalCloseActionBtn = document.getElementById("modalCloseActionBtn");
  const modalBookActionBtn = document.getElementById("modalBookActionBtn");
  const modalTabs = Array.from(document.querySelectorAll(".modal-tab"));
  const tabPanes = {
    soundboard: document.getElementById("tabContentSoundboard"),
    anatomy: document.getElementById("tabContentAnatomy"),
    calendar: document.getElementById("tabContentCalendar"),
  };

  // Sound Buttons
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  const soundIcon = document.getElementById("soundIcon");
  const soundLabel = document.getElementById("soundLabel");
  const heroSoundTrigger = document.getElementById("heroSoundTrigger");
  const playSoundWind = document.getElementById("playSoundWind");
  const playSoundGrowl = document.getElementById("playSoundGrowl");
  const playSoundChick = document.getElementById("playSoundChick");

  // Facts Strip
  const factPills = Array.from(document.querySelectorAll(".fact-pill"));
  const factDisplayCard = document.getElementById("factDisplayCard");
  const factDisplayText = document.getElementById("factDisplayText");

  // Conservation Calculator
  const sponsorTierSelect = document.getElementById("sponsorTierSelect");
  const checkGps = document.getElementById("checkGps");
  const checkInfrared = document.getElementById("checkInfrared");
  const calcImpactSummary = document.getElementById("calcImpactSummary");
  const calcChicksSaved = document.getElementById("calcChicksSaved");
  const calcAreaProtected = document.getElementById("calcAreaProtected");
  const sponsorPledgeBtn = document.getElementById("sponsorPledgeBtn");

  // Booking Form
  const expeditionBookingForm = document.getElementById(
    "expeditionBookingForm",
  );
  const bookingConfirmationCard = document.getElementById(
    "bookingConfirmationCard",
  );
  const confirmMessageText = document.getElementById("confirmMessageText");
  const resetBookingFormBtn = document.getElementById("resetBookingFormBtn");

  // -------------------------------------------------------------
  // Application State
  // -------------------------------------------------------------
  let currentSlideIndex = 0;
  let isTransitioning = false;
  let toastTimeout = null;

  // -------------------------------------------------------------
  // Fact Insights Database
  // -------------------------------------------------------------
  const factInsights = {
    salt: "Atlantic puffins possess specialized supraorbital salt glands located above their eye sockets. These glands extract excess sodium directly from ingested seawater and excrete concentrated saline droplets out through their nares, allowing puffins to thrive for eight continuous winter months far offshore without touching fresh water.",
    nocturnal:
      "To avoid predatory Great Black-backed Gulls and Arctic Skuas patroling the cliff edges, pufflings (chicks) leave their subterranean burrows exclusively between midnight and 3:00 AM. Fledging under cover of darkness, they flutter down to the sea and paddle rapidly miles out to open water by dawn.",
    eyes: "The charismatic crimson eye-rings and triangular horn plates above and below the pupil only appear during the springtime breeding season. In autumn, these ornate horny plates are completely shed, the white face turns dusky gray, and the puffin takes on an understated pelagic camouflage.",
    molt: "Unlike most seabirds that molt flight feathers gradually in pairs so they retain flight, Atlantic puffins shed all their primary wing quills simultaneously in late winter. For approximately 1 to 2 months, they are entirely flightless on the stormy Atlantic, surviving solely by underwater diving.",
  };

  // -------------------------------------------------------------
  // Toast Notification Helper
  // -------------------------------------------------------------
  function showToast(message, iconClass = "fa-check-circle") {
    if (!toastNotification || !toastMessage || !toastIcon) return;
    toastMessage.textContent = message;
    toastIcon.className = `fa ${iconClass}`;
    toastNotification.style.display = "flex";

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    toastTimeout = setTimeout(() => {
      toastNotification.style.display = "none";
    }, 3500);
  }

  // -------------------------------------------------------------
  // Live UTC Clock
  // -------------------------------------------------------------
  function updateUtcClock() {
    if (!liveUtcClock) return;
    const now = new Date();
    const hours = String(now.getUTCHours()).padStart(2, "0");
    const minutes = String(now.getUTCMinutes()).padStart(2, "0");
    const seconds = String(now.getUTCSeconds()).padStart(2, "0");
    liveUtcClock.textContent = `${hours}:${minutes}:${seconds} UTC`;
  }
  setInterval(updateUtcClock, 1000);
  updateUtcClock();

  // -------------------------------------------------------------
  // Slider Controller
  // -------------------------------------------------------------
  function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    if (
      index === currentSlideIndex &&
      slides[index].classList.contains("current")
    ) {
      return;
    }

    isTransitioning = true;
    currentSlideIndex = index;
    const slideNumber = index + 1;

    // Update slides
    slides.forEach((slide, i) => {
      slide.classList.remove("current", "prev", "next");
      if (i < currentSlideIndex) {
        slide.classList.add("prev");
      } else if (i === currentSlideIndex) {
        slide.classList.add("current");
      } else {
        slide.classList.add("next");
      }
    });

    // Update left indicator dots
    navDots.forEach((dot, i) => {
      if (i === currentSlideIndex) {
        dot.classList.add("selected");
        dot.setAttribute("aria-current", "true");
      } else {
        dot.classList.remove("selected");
        dot.removeAttribute("aria-current");
      }
    });

    // Update desktop nav
    desktopNavItems.forEach((item, i) => {
      if (i === currentSlideIndex) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Update mobile links
    mobileNavLinks.forEach((link, i) => {
      if (i === currentSlideIndex) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Update counter display
    if (slideCounterDisplay) {
      slideCounterDisplay.textContent = `0${slideNumber} / 0${slides.length}`;
    }

    // Update arrow button icon: if on last slide, point up to go back to start
    if (arrowIcon) {
      const icon = arrowIcon.querySelector("i");
      if (currentSlideIndex === slides.length - 1) {
        if (icon) {
          icon.className = "fa fa-angle-up";
        }
        arrowIcon.setAttribute("aria-label", "Return to First Slide");
        arrowIcon.title = "Back to Overview";
      } else {
        if (icon) {
          icon.className = "fa fa-angle-down";
        }
        arrowIcon.setAttribute("aria-label", "Next Section");
        arrowIcon.title = "Next Section";
      }
    }

    // Reset lock after transition completes
    setTimeout(() => {
      isTransitioning = false;
    }, 700);
  }

  function nextSlide() {
    if (currentSlideIndex < slides.length - 1) {
      goToSlide(currentSlideIndex + 1);
    } else {
      goToSlide(0);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  }

  // Next Arrow Click
  if (arrowIcon) {
    arrowIcon.addEventListener("click", () => {
      if (currentSlideIndex === slides.length - 1) {
        goToSlide(0);
      } else {
        nextSlide();
      }
    });
  }

  // Wire up all elements with data-target-slide
  document.querySelectorAll("[data-target-slide]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const target = parseInt(el.getAttribute("data-target-slide"), 10);
      if (!isNaN(target)) {
        goToSlide(target - 1);
        // If mobile drawer is open, close it
        if (mobileMenuDrawer && mobileMenuDrawer.classList.contains("open")) {
          toggleMobileMenu();
        }
        // If modal was open and user clicked book expedition, close modal
        if (fieldGuideModal && fieldGuideModal.style.display !== "none") {
          closeFieldGuide();
        }
      }
    });
  });

  // Dot Navigation Click
  navDots.forEach((dot, index) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      goToSlide(index);
    });
  });

  // Mobile Drawer Navigation Toggle
  function toggleMobileMenu() {
    if (!menuToggleBtn || !mobileMenuDrawer) return;
    const isOpen = mobileMenuDrawer.classList.contains("open");
    if (isOpen) {
      menuToggleBtn.classList.remove("active");
      mobileMenuDrawer.classList.remove("open");
      document.body.style.overflow = "hidden";
    } else {
      menuToggleBtn.classList.add("active");
      mobileMenuDrawer.classList.add("open");
    }
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener("click", toggleMobileMenu);
  }

  // -------------------------------------------------------------
  // Mouse Wheel & Keyboard Handling
  // -------------------------------------------------------------
  let wheelCooldown = false;
  window.addEventListener(
    "wheel",
    (e) => {
      // Don't intercept wheel if modal is open
      if (fieldGuideModal && fieldGuideModal.style.display !== "none") {
        return;
      }
      // Check if mouse is hovering over an internal scrollable element
      const activeSlide = slides[currentSlideIndex];
      const scrollable = activeSlide
        ? activeSlide.querySelector(".content-wrapper")
        : null;

      if (scrollable) {
        const atTop = scrollable.scrollTop <= 0;
        const atBottom =
          Math.ceil(scrollable.scrollTop + scrollable.clientHeight) >=
          scrollable.scrollHeight;

        // If scrolling down and not at bottom, let the content scroll
        if (e.deltaY > 0 && !atBottom) {
          return;
        }
        // If scrolling up and not at top, let content scroll
        if (e.deltaY < 0 && !atTop) {
          return;
        }
      }

      if (wheelCooldown || isTransitioning) return;

      if (Math.abs(e.deltaY) > 15) {
        wheelCooldown = true;
        if (e.deltaY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        setTimeout(() => {
          wheelCooldown = false;
        }, 900);
      }
    },
    { passive: true },
  );

  // Keyboard Navigation
  window.addEventListener("keydown", (e) => {
    // Ignore if typing in input/textarea
    if (
      ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
    ) {
      return;
    }
    // Close modal on Escape
    if (e.key === "Escape") {
      if (fieldGuideModal && fieldGuideModal.style.display !== "none") {
        closeFieldGuide();
      } else if (
        mobileMenuDrawer &&
        mobileMenuDrawer.classList.contains("open")
      ) {
        toggleMobileMenu();
      }
      return;
    }

    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      nextSlide();
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "Home") {
      e.preventDefault();
      goToSlide(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goToSlide(slides.length - 1);
    }
  });

  // Touch Swipe Handling
  let touchStartY = null;
  let touchStartX = null;
  window.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );

  window.addEventListener(
    "touchend",
    (e) => {
      if (!touchStartY || !touchStartX) return;
      // Don't intercept swipe if modal is open
      if (fieldGuideModal && fieldGuideModal.style.display !== "none") return;

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const diffY = touchStartY - touchEndY;
      const diffX = touchStartX - touchEndX;

      // Vertical swipe dominant
      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
        if (diffY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      touchStartY = null;
      touchStartX = null;
    },
    { passive: true },
  );

  // -------------------------------------------------------------
  // Interactive Species Field Guide Modal
  // -------------------------------------------------------------
  function openFieldGuide() {
    if (!fieldGuideModal) return;
    fieldGuideModal.style.display = "flex";
  }

  function closeFieldGuide() {
    if (!fieldGuideModal) return;
    fieldGuideModal.style.display = "none";
  }

  if (openFieldGuideBtn)
    openFieldGuideBtn.addEventListener("click", openFieldGuide);
  if (heroGuideTrigger)
    heroGuideTrigger.addEventListener("click", openFieldGuide);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeFieldGuide);
  if (modalCloseActionBtn)
    modalCloseActionBtn.addEventListener("click", closeFieldGuide);

  // Backdrop click to close
  if (fieldGuideModal) {
    fieldGuideModal.addEventListener("click", (e) => {
      if (e.target === fieldGuideModal) {
        closeFieldGuide();
      }
    });
  }

  // Modal Tabs Switching
  modalTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");
      modalTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      Object.keys(tabPanes).forEach((paneKey) => {
        if (tabPanes[paneKey]) {
          tabPanes[paneKey].style.display =
            paneKey === targetTab ? "block" : "none";
        }
      });
    });
  });

  // -------------------------------------------------------------
  // Interactive Biology Fact Strip
  // -------------------------------------------------------------
  let activeFactKey = null;
  factPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const factKey = pill.getAttribute("data-fact");
      if (activeFactKey === factKey) {
        // Toggle close
        factPills.forEach((p) => p.classList.remove("active"));
        if (factDisplayCard) factDisplayCard.style.display = "none";
        activeFactKey = null;
      } else {
        factPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        if (factDisplayCard && factDisplayText && factInsights[factKey]) {
          factDisplayText.textContent = factInsights[factKey];
          factDisplayCard.style.display = "block";
        }
        activeFactKey = factKey;
      }
    });
  });

  // -------------------------------------------------------------
  // Conservation Impact Calculator
  // -------------------------------------------------------------
  function recalculateImpact() {
    if (
      !sponsorTierSelect ||
      !calcImpactSummary ||
      !calcChicksSaved ||
      !calcAreaProtected
    )
      return;

    const burrowsCount = parseInt(sponsorTierSelect.value, 10) || 3;
    const hasGps = checkGps ? checkGps.checked : true;
    const hasInfrared = checkInfrared ? checkInfrared.checked : true;

    const chicksLow = burrowsCount;
    const chicksHigh = Math.round(burrowsCount * 1.6);
    const areaSqMeters = burrowsCount * 30;

    let extras = [];
    if (hasGps) extras.push("solar GPS ring telemetry");
    if (hasInfrared) extras.push("infrared burrow cam access");

    const extrasText = extras.length > 0 ? ` with ${extras.join(" and ")}` : "";

    calcImpactSummary.textContent = `Secures ${burrowsCount} active nesting ${
      burrowsCount === 1 ? "burrow" : "burrows"
    }${extrasText}, shielding ${areaSqMeters} m² of cliff turf from erosion and disruption.`;
    calcChicksSaved.textContent = `${chicksLow} to ${chicksHigh}`;
    calcAreaProtected.textContent = `${areaSqMeters} m²`;
  }

  if (sponsorTierSelect)
    sponsorTierSelect.addEventListener("change", recalculateImpact);
  if (checkGps) checkGps.addEventListener("change", recalculateImpact);
  if (checkInfrared)
    checkInfrared.addEventListener("change", recalculateImpact);

  if (sponsorPledgeBtn) {
    sponsorPledgeBtn.addEventListener("click", () => {
      showToast(
        "Sanctuary pledge registered! You will receive live telemetry access via email.",
        "fa-heart",
      );
    });
  }

  // -------------------------------------------------------------
  // Expedition Booking & Inquiry Form
  // -------------------------------------------------------------
  if (expeditionBookingForm) {
    expeditionBookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const guestName =
        document.getElementById("guestNameInput")?.value || "Explorer";
      const routeSelect = document.getElementById("routeSelect");
      const routeName = routeSelect
        ? routeSelect.options[routeSelect.selectedIndex].text
        : "Sanctuary Route";

      if (confirmMessageText) {
        confirmMessageText.textContent = `Thank you, ${guestName}! Your expedition inquiry for "${routeName}" has been forwarded to our lead marine ornithologist. We will contact you within 24 hours with weather advisories and vessel schedules.`;
      }

      expeditionBookingForm.style.display = "none";
      if (bookingConfirmationCard) {
        bookingConfirmationCard.style.display = "block";
      }
      showToast(
        "Expedition inquiry submitted successfully!",
        "fa-check-circle",
      );
    });
  }

  if (resetBookingFormBtn) {
    resetBookingFormBtn.addEventListener("click", () => {
      if (expeditionBookingForm) {
        expeditionBookingForm.reset();
        expeditionBookingForm.style.display = "flex";
      }
      if (bookingConfirmationCard) {
        bookingConfirmationCard.style.display = "none";
      }
    });
  }

  // -------------------------------------------------------------
  // Web Audio Native Synthesizer (Acoustics & Ambient Soundscapes)
  // -------------------------------------------------------------
  let audioCtx = null;
  let isAmbientPlaying = false;
  let ambientGain = null;
  let ambientNoiseSource = null;
  let ambientOscillator = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Synthesize Coastal Ocean Waves & Breeze
  function startOceanAmbience() {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Buffer of pink/brown noise
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain compensation
    }

    ambientNoiseSource = ctx.createBufferSource();
    ambientNoiseSource.buffer = noiseBuffer;
    ambientNoiseSource.loop = true;

    // Filter to sound like rolling ocean waves
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    // LFO for wave swelling rhythm
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // 8-second wave swells
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(250, ctx.currentTime);
    lfo.connect(filter.frequency);
    lfo.start();

    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.18, ctx.currentTime);

    ambientNoiseSource.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    ambientNoiseSource.start();
    isAmbientPlaying = true;
    updateAmbientUI(true);
    showToast("Ambient ocean breeze & wave swells active", "fa-volume-up");
  }

  function stopOceanAmbience() {
    if (ambientNoiseSource) {
      try {
        ambientNoiseSource.stop();
        ambientNoiseSource.disconnect();
      } catch (err) {
        // Safe catch
      }
      ambientNoiseSource = null;
    }
    isAmbientPlaying = false;
    updateAmbientUI(false);
    showToast("Ocean ambient sound muted", "fa-volume-off");
  }

  function toggleOceanAmbience() {
    if (isAmbientPlaying) {
      stopOceanAmbience();
    } else {
      startOceanAmbience();
    }
  }

  function updateAmbientUI(playing) {
    if (soundToggleBtn) {
      if (playing) {
        soundToggleBtn.classList.add("active");
        if (soundIcon) soundIcon.className = "fa fa-volume-up";
        if (soundLabel) soundLabel.textContent = "Ambient: Playing";
      } else {
        soundToggleBtn.classList.remove("active");
        if (soundIcon) soundIcon.className = "fa fa-volume-off";
        if (soundLabel) soundLabel.textContent = "Ambient: Off";
      }
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", toggleOceanAmbience);
  }
  if (heroSoundTrigger) {
    heroSoundTrigger.addEventListener("click", () => {
      if (!isAmbientPlaying) {
        startOceanAmbience();
      } else {
        showToast("Colony ambience is already playing", "fa-headphones");
      }
    });
  }

  // Synthesize Adult Puffin Deep Guttural Growl ("Arr-arr-arr")
  function playPuffinGrowl() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Puffin vocalization is a low vibrating saw sound with vibrato modulation
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.7);

    // Filter to simulate throat resonance
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(320, now);
    filter.Q.setValueAtTime(3, now);

    // Pulsing amplitude envelope ("arr... arr... arr")
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.22);
    gain.gain.linearRampToValueAtTime(0.38, now + 0.38);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.52);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.65);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.0);

    if (playSoundGrowl) {
      playSoundGrowl.classList.add("playing");
      setTimeout(() => playSoundGrowl.classList.remove("playing"), 1000);
    }
  }

  // Synthesize Hungry Puffling High Peep Call
  function playPufflingPeep() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Quick rising and falling chirp
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(3200, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(2100, now + 0.18);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);

    // Second chirp slightly delayed
    setTimeout(() => {
      const now2 = ctx.currentTime;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(2600, now2);
      osc2.frequency.exponentialRampToValueAtTime(3400, now2 + 0.07);
      osc2.frequency.exponentialRampToValueAtTime(2300, now2 + 0.16);

      gain2.gain.setValueAtTime(0.001, now2);
      gain2.gain.linearRampToValueAtTime(0.22, now2 + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.2);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now2);
      osc2.stop(now2 + 0.22);
    }, 180);

    if (playSoundChick) {
      playSoundChick.classList.add("playing");
      setTimeout(() => playSoundChick.classList.remove("playing"), 600);
    }
  }

  if (playSoundWind) {
    playSoundWind.addEventListener("click", () => {
      if (!isAmbientPlaying) {
        startOceanAmbience();
        playSoundWind.innerHTML =
          '<i class="fa fa-pause"></i> Pause Ocean Ambience';
      } else {
        stopOceanAmbience();
        playSoundWind.innerHTML =
          '<i class="fa fa-play"></i> Play Ocean Ambience';
      }
    });
  }

  if (playSoundGrowl) {
    playSoundGrowl.addEventListener("click", playPuffinGrowl);
  }

  if (playSoundChick) {
    playSoundChick.addEventListener("click", playPufflingPeep);
  }

  // -------------------------------------------------------------
  // Initial Setup
  // -------------------------------------------------------------
  goToSlide(0);
})();
