document.addEventListener('DOMContentLoaded', () => {

  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const openBtn = document.getElementById('openInvitationBtn');
  const envelopeFlap = document.getElementById('envelopeFlap');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  
  let musicStarted = false;

  // ---- ОТКРЫТИЕ КОНВЕРТА ----
  function openEnvelope() {
    // Запуск музыки
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
    
    // Анимация крышки конверта
    if (envelopeFlap) {
      envelopeFlap.classList.add('opened');
    }
    
    // Закрываем оверлей после анимации
    setTimeout(() => {
      envelopeOverlay.classList.add('closed');
    }, 900);
  }

  // Вешаем обработчик на кнопку
  if (openBtn) {
    openBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openEnvelope();
    });
    
    // Также обрабатываем клик по всей области печати (на случай если клик попал на дочерний элемент)
    const sealWax = openBtn.querySelector('.seal-wax');
    const sealInner = openBtn.querySelector('.seal-inner');
    const sealMonogram = openBtn.querySelector('.seal-monogram');
    
    if (sealWax) {
      sealWax.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openEnvelope();
      });
    }
    if (sealInner) {
      sealInner.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openEnvelope();
      });
    }
    if (sealMonogram) {
      sealMonogram.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openEnvelope();
      });
    }
  }

  // Резерв: открытие по клику в любом месте конверта
  const envelopeMain = document.getElementById('envelopeMain');
  if (envelopeMain) {
    envelopeMain.addEventListener('click', function(e) {
      // Проверяем, что конверт ещё не открыт
      if (!envelopeOverlay.classList.contains('closed')) {
        e.preventDefault();
        e.stopPropagation();
        openEnvelope();
      }
    });
  }

  // ---- МУЗЫКА ----
  if (musicToggle) {
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
  }

  // ---- КАРУСЕЛЬ ОБРАЗОВ ----
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  let currentSlide = 0;
  const totalSlides = slides.length;

  function showSlide(index) {
    if (!slides.length) return;
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    if (index >= totalSlides) currentSlide = 0;
    else if (index < 0) currentSlide = totalSlides - 1;
    else currentSlide = index;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
  }

  // Свайп для мобильных
  const carousel = document.getElementById('outfitCarousel');
  if (carousel) {
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => { 
      touchStartX = e.touches[0].clientX; 
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) showSlide(currentSlide + 1);
        else showSlide(currentSlide - 1);
      }
    });
  }

  // ---- ПЛАВНЫЙ СКРОЛЛ ----
  function smoothScroll(targetId) {
    const element = document.getElementById(targetId);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Кнопка "Подтвердить присутствие"
  document.querySelectorAll('.rsvp-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => { 
      e.preventDefault(); 
      smoothScroll('rsvp'); 
    });
  });

  // Кнопка "Открыть карту"
  const mapBtn = document.querySelector('.map-btn');
  if (mapBtn) {
    mapBtn.addEventListener('click', () => {
      window.open('https://yandex.ru/maps/213/moscow/house/gorokhovskiy_pereulok_19s4/Z04YcAFoTUMFQFtvfXt3dHlqYQ==/?ll=37.668378%2C55.765539&z=19.94', '_blank');
    });
  }

  // Стрелка вниз на Hero
  const scrollHint = document.querySelector('.hero-scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const el = document.getElementById('welcome');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ---- АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ ----
  const fadeElements = document.querySelectorAll('.fade-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
  fadeElements.forEach(el => observer.observe(el));

  // ---- ФОРМА RSVP ----
  const form = document.getElementById('rsvpForm');
  const successDiv = document.getElementById('rsvpSuccess');
  const nameInput = document.getElementById('name');
  const attendingRadios = document.querySelectorAll('input[name="attending"]');
  const guestsInput = document.getElementById('guests');
  const nameError = document.getElementById('nameError');
  const attendingError = document.getElementById('attendingError');
  const guestsError = document.getElementById('guestsError');

  function clearFieldErrors() {
    if (nameError) nameError.innerText = '';
    if (attendingError) attendingError.innerText = '';
    if (guestsError) guestsError.innerText = '';
  }

  function validateForm() {
    let isValid = true;
    clearFieldErrors();
    
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (nameVal === '') { 
      if (nameError) nameError.innerText = 'Пожалуйста, укажите ваше имя'; 
      isValid = false; 
    } else if (nameVal.length < 2) { 
      if (nameError) nameError.innerText = 'Имя должно содержать хотя бы 2 символа'; 
      isValid = false; 
    }
    
    let attendingSelected = false;
    if (attendingRadios.length) {
      attendingRadios.forEach(r => { if (r.checked) attendingSelected = true; });
      if (!attendingSelected) { 
        if (attendingError) attendingError.innerText = 'Выберите, будете ли вы присутствовать'; 
        isValid = false; 
      }
    }
    
    if (guestsInput) {
      let guestsVal = parseInt(guestsInput.value, 10);
      if (isNaN(guestsVal) || guestsVal < 1) { 
        if (guestsError) guestsError.innerText = 'Минимум 1 гость'; 
        isValid = false; 
      } else if (guestsVal > 3) { 
        if (guestsError) guestsError.innerText = 'Максимум 3 гостей'; 
        isValid = false; 
      }
    }
    
    return isValid;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      
      const name = nameInput ? nameInput.value.trim() : '';
      let attendingValue = '';
      if (attendingRadios.length) {
        attendingRadios.forEach(r => { if (r.checked) attendingValue = r.value; });
      }
      
      console.log('=== RSVP Submitted ===');
      console.log('Имя:', name);
      console.log('Присутствие:', attendingValue === 'yes' ? 'Да' : 'Нет');
      console.log('Гостей:', guestsInput ? guestsInput.value : '—');
      console.log('Комментарий:', document.getElementById('comment')?.value || '—');
      
      form.classList.add('hidden');
      if (successDiv) successDiv.classList.remove('hidden');
      
      if (!document.querySelector('.reset-form-btn')) {
        const newBtn = document.createElement('button');
        newBtn.textContent = 'Отправить ещё один ответ';
        newBtn.classList.add('btn', 'btn-outline', 'reset-form-btn');
        newBtn.style.marginTop = '1rem';
        newBtn.addEventListener('click', () => {
          form.reset();
          form.classList.remove('hidden');
          if (successDiv) successDiv.classList.add('hidden');
          clearFieldErrors();
          newBtn.remove();
        });
        if (successDiv) successDiv.appendChild(newBtn);
      }
    });
  }

  if (guestsInput) {
    guestsInput.addEventListener('input', () => {
      let val = parseInt(guestsInput.value, 10);
      if (guestsInput.value === '') guestsInput.value = 1;
      if (val < 1) guestsInput.value = 1;
      if (val > 6) guestsInput.value = 6;
    });
  }

  if (attendingRadios.length) {
    attendingRadios.forEach(r => {
      r.addEventListener('change', () => { 
        if (attendingError) attendingError.innerText = ''; 
      });
    });
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => { 
      if (nameError && nameError.innerText) nameError.innerText = ''; 
    });
  }

});