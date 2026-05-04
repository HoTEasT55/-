document.addEventListener('DOMContentLoaded', () => {

  // ---- ЭЛЕМЕНТЫ ----
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const openBtn = document.getElementById('openInvitationBtn');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const floatingHeart = document.getElementById('floatingHeart');
  const heartThreadContainer = document.getElementById('heartThreadContainer');
  
  let musicStarted = false;

  // ---- ОТКРЫТИЕ КОНВЕРТА ----
  openBtn.addEventListener('click', () => {
    if (!musicStarted) {
      bgMusic.volume = 0.35;
      bgMusic.play().then(() => {
        musicToggle.textContent = '🎵';
        musicToggle.classList.add('playing');
        musicStarted = true;
      }).catch(e => {
        console.log('Автовоспроизведение заблокировано:', e);
      });
    }
    
    envelopeOverlay.classList.add('closed');
    
    setTimeout(() => {
      heartThreadContainer.classList.add('visible');
    }, 1400);
  });

  // ---- МУЗЫКА ----
  musicToggle.addEventListener('click', () => {
    if (!musicStarted) {
      bgMusic.volume = 0.35;
      bgMusic.play().then(() => {
        musicToggle.textContent = '🎵';
        musicToggle.classList.add('playing');
        musicStarted = true;
      }).catch(err => console.log('Ошибка воспроизведения:', err));
    } else {
      if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.textContent = '🎵';
        musicToggle.classList.add('playing');
      } else {
        bgMusic.pause();
        musicToggle.textContent = '🔇';
        musicToggle.classList.remove('playing');
      }
    }
  });

  // ---- ДВИЖЕНИЕ СЕРДЕЧКА ПО НИТИ ПРИ СКРОЛЛЕ ----
  window.addEventListener('scroll', () => {
    if (!heartThreadContainer.classList.contains('visible')) return;
    
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;
    const scrollFraction = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    
    // Движение сверху вниз (10% - 90% высоты экрана)
    const minY = window.innerHeight * 0.12;
    const maxY = window.innerHeight * 0.88;
    const currentY = minY + (maxY - minY) * Math.min(scrollFraction, 1);
    
    // Боковое покачивание вдоль нити
    const horizontalOffset = Math.sin(scrollTop * 0.015) * 22;
    
    floatingHeart.style.top = currentY + 'px';
    floatingHeart.style.left = `calc(50% + ${horizontalOffset}px)`;
    
    // Прозрачность в начале и конце
    if (scrollTop < 60 || scrollHeight - scrollTop < 60) {
      floatingHeart.style.opacity = '0.4';
    } else {
      floatingHeart.style.opacity = '1';
    }
  });

  // ---- КАРУСЕЛЬ ОБРАЗОВ ----
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  let currentSlide = 0;
  const totalSlides = slides.length;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    if (index >= totalSlides) currentSlide = 0;
    else if (index < 0) currentSlide = totalSlides - 1;
    else currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => showSlide(i));
    });
  }

  // Свайп для мобильных
  const carousel = document.getElementById('outfitCarousel');
  if (carousel) {
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });
    carousel.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) showSlide(currentSlide + 1);
        else showSlide(currentSlide - 1);
      }
    });
  }

  // ---- СУЩЕСТВУЮЩИЙ ФУНКЦИОНАЛ ----
  const smoothScroll = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const rsvpButtons = document.querySelectorAll('.rsvp-trigger');
  rsvpButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScroll('rsvp');
    });
  });

  const mapBtn = document.querySelector('.map-btn');
  if (mapBtn) {
    mapBtn.addEventListener('click', () => {
      window.open(`https://yandex.ru/maps/213/moscow/house/gorokhovskiy_pereulok_19s4/Z04YcAFoTUMFQFtvfXt3dHlqYQ==/?ll=37.668378%2C55.765539&z=19.94`, '_blank');
    });
  }

  const scrollHint = document.querySelector('.hero-scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const welcomeSection = document.getElementById('welcome');
      if (welcomeSection) welcomeSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const fadeElements = document.querySelectorAll('.fade-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
  fadeElements.forEach(el => observer.observe(el));

  // Форма RSVP
  const form = document.getElementById('rsvpForm');
  const successDiv = document.getElementById('rsvpSuccess');
  const nameInput = document.getElementById('name');
  const attendingRadios = document.querySelectorAll('input[name="attending"]');
  const guestsInput = document.getElementById('guests');
  const nameError = document.getElementById('nameError');
  const attendingError = document.getElementById('attendingError');
  const guestsError = document.getElementById('guestsError');

  function clearFieldErrors() {
    nameError.innerText = '';
    attendingError.innerText = '';
    guestsError.innerText = '';
  }

  function validateForm() {
    let isValid = true;
    clearFieldErrors();
    const nameVal = nameInput.value.trim();
    if (nameVal === '') {
      nameError.innerText = 'Пожалуйста, укажите ваше имя';
      isValid = false;
    } else if (nameVal.length < 2) {
      nameError.innerText = 'Имя должно содержать хотя бы 2 символа';
      isValid = false;
    }
    let attendingSelected = false;
    attendingRadios.forEach(radio => {
      if (radio.checked) attendingSelected = true;
    });
    if (!attendingSelected) {
      attendingError.innerText = 'Выберите, будете ли вы присутствовать';
      isValid = false;
    }
    let guestsVal = parseInt(guestsInput.value, 10);
    if (isNaN(guestsVal) || guestsVal < 1) {
      guestsError.innerText = 'Минимум 1 гость (включая вас)';
      isValid = false;
    } else if (guestsVal > 6) {
      guestsError.innerText = 'Пожалуйста, свяжитесь с нами, если больше 3 гостей';
      isValid = false;
    }
    return isValid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const name = nameInput.value.trim();
    let attendingValue = '';
    attendingRadios.forEach(radio => {
      if (radio.checked) attendingValue = radio.value;
    });
    console.log('=== RSVP Submitted ===');
    console.log(`Имя: ${name}`);
    console.log(`Присутствие: ${attendingValue === 'yes' ? 'Да' : 'Нет'}`);
    console.log(`Кол-во гостей: ${guestsInput.value}`);
    console.log(`Комментарий: ${document.getElementById('comment').value || '—'}`);
    
    form.classList.add('hidden');
    successDiv.classList.remove('hidden');
    
    if (!document.querySelector('.reset-form-btn')) {
      const newBtn = document.createElement('button');
      newBtn.textContent = 'Отправить ещё один ответ';
      newBtn.classList.add('btn', 'btn-outline', 'reset-form-btn');
      newBtn.style.marginTop = '1rem';
      newBtn.addEventListener('click', () => {
        form.reset();
        form.classList.remove('hidden');
        successDiv.classList.add('hidden');
        clearFieldErrors();
        newBtn.remove();
      });
      successDiv.appendChild(newBtn);
    }
  });

  guestsInput.addEventListener('input', () => {
    let val = parseInt(guestsInput.value, 10);
    if (guestsInput.value === '') guestsInput.value = 1;
    if (val < 1) guestsInput.value = 1;
    if (val > 6) guestsInput.value = 6;
  });

  attendingRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      attendingError.innerText = '';
    });
  });
  nameInput.addEventListener('input', () => {
    if (nameError.innerText) nameError.innerText = '';
  });
  openBtn.addEventListener('click', () => {
    // Запуск музыки...
    
    // Анимация крышки конверта
    document.getElementById('envelopeFlap').classList.add('opened');
    
    // Закрываем оверлей с задержкой
    setTimeout(() => {
      envelopeOverlay.classList.add('closed');
    }, 900);
    
    // Показываем сердечко
    setTimeout(() => {
      heartThreadContainer.classList.add('visible');
    }, 1600);
  });
});