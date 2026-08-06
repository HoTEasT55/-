document.addEventListener('DOMContentLoaded', () => {

  // ---- КОНВЕРТ ----
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const openBtn = document.getElementById('openInvitationBtn');
  const envelopeFlap = document.getElementById('envelopeFlap');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  let musicStarted = false;

  function openEnvelope() {
  console.log('Конверт открывается!');
    if (!musicStarted) {
    bgMusic.volume = 0.35;
    bgMusic.play().then(() => {
      musicToggle.textContent = '🎵';
      musicToggle.classList.add('playing');
      musicStarted = true;
    }).catch(e => console.log('Автовоспроизведение заблокировано:', e));
  }
  
  // Открываем створки
  const leftFlap = document.getElementById('cardFlapLeft');
  const rightFlap = document.getElementById('cardFlapRight');
  if (leftFlap) leftFlap.classList.add('opened');
  if (rightFlap) rightFlap.classList.add('opened');
  
  // Скрываем печать
  const sealBtn = document.getElementById('openInvitationBtn');
  if (sealBtn) sealBtn.classList.add('hidden-seal');
  
  // Закрываем оверлей через 4 секунды
  setTimeout(() => {
    envelopeOverlay.classList.add('closed');
  }, 2000);
}

  if (openBtn) {
    openBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openEnvelope(); });
    const sealWax = openBtn.querySelector('.seal-wax');
    const sealInner = openBtn.querySelector('.seal-inner');
    const sealMonogram = openBtn.querySelector('.seal-monogram');
    [sealWax, sealInner, sealMonogram].forEach(el => {
      if (el) el.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openEnvelope(); });
    });
  }

  const envelopeMain = document.getElementById('envelopeMain');
  if (envelopeMain) {
    envelopeMain.addEventListener('click', (e) => {
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
        }).catch(() => {});
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
  function showSlide(index) {
    if (!slides.length) return;
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
  }
  const carousel = document.getElementById('outfitCarousel');
  if (carousel) {
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) showSlide(currentSlide + 1);
        else showSlide(currentSlide - 1);
      }
    });
  }

  // ---- СКРОЛЛ ----
  function smoothScroll(targetId) {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.querySelectorAll('.rsvp-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); smoothScroll('rsvp'); });
  });
  const mapBtn = document.querySelector('.map-btn');
  if (mapBtn) {
    mapBtn.addEventListener('click', () => {
      window.open('https://yandex.ru/maps/org/zelyony_bereg/46385904496/?ll=37.469665%2C56.029529&z=12', '_blank');
    });
  }
  const scrollHint = document.querySelector('.hero-scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const el = document.getElementById('welcome');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  // ---- ИМЕННЫЕ ПРИГЛАШЕНИЯ ----
  var urlParams = new URLSearchParams(window.location.search);
  var rawNames = urlParams.get('names') || urlParams.get('name');

  if (rawNames) {
    var decodedNames = decodeURIComponent(rawNames);
    var namesArray = decodedNames.split(',').map(function(n) {
      return n.trim();
    }).filter(function(n) {
      return n.length > 0;
    });

    var greeting = document.getElementById('personalGreeting');
    
    if (greeting && namesArray.length > 0) {
      var greetingText = '';

      if (namesArray.length === 1) {
        greetingText = 'Дорогой(ая) ' + namesArray[0] + '!';
      } else if (namesArray.length === 2) {
        greetingText = 'Дорогие ' + namesArray[0] + ' и ' + namesArray[1] + '!';
      } else {
        var allButLast = namesArray.slice(0, -1).join(', ');
        greetingText = 'Дорогие ' + allButLast + ' и ' + namesArray[namesArray.length - 1] + '!';
      }

      greeting.innerHTML = greetingText + '<br><br>' +
        'Мы бесконечно счастливы, что вы станете частью нашего самого важного дня. ' +
        'Сердце переполняется радостью, когда мы думаем о предстоящей встрече. ' +
        'Приглашаем вас разделить с нами магию любви, нежности и настоящего счастья.';
    }
    // Сохраняем имена в скрытое поле
    var hiddenField = document.getElementById('invitationNames');
    if (hiddenField) {
      hiddenField.value = decodedNames;
    }
  }

  // ---- АНИМАЦИЯ ПОЯВЛЕНИЯ ----
  const fadeElements = document.querySelectorAll('.fade-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  fadeElements.forEach(el => observer.observe(el));

    // ---- ФОРМА RSVP ----
  const form = document.getElementById('rsvpForm');
  const successDivYes = document.getElementById('rsvpSuccessYes');
  const successDivNo = document.getElementById('rsvpSuccessNo');
  const nameInput = document.getElementById('name');
  const lastNameInput = document.getElementById('lastName');
  const attendingRadios = document.querySelectorAll('input[name="attending"]');
  const guestsGroup = document.getElementById('guestsGroup');
  const guestsInput = document.getElementById('guests');
  const declineReasonGroup = document.getElementById('declineReasonGroup');
  const declineReasonInput = document.getElementById('declineReason');
  const nameError = document.getElementById('nameError');
  const lastNameError = document.getElementById('lastNameError');
  const attendingError = document.getElementById('attendingError');
  const guestsError = document.getElementById('guestsError');

  // Переключение видимости полей при выборе Да/Нет
  attendingRadios.forEach(r => {
    r.addEventListener('change', () => {
      const selectedValue = document.querySelector('input[name="attending"]:checked')?.value;
      if (selectedValue === 'yes') {
        guestsGroup.classList.remove('hidden');
        declineReasonGroup.classList.add('hidden');
        if (declineReasonInput) declineReasonInput.value = '';
      } else {
        guestsGroup.classList.add('hidden');
        declineReasonGroup.classList.remove('hidden');
      }
    });
  });

  function clearFieldErrors() {
    if (nameError) nameError.innerText = '';
    if (lastNameError) lastNameError.innerText = '';
    if (attendingError) attendingError.innerText = '';
    if (guestsError) guestsError.innerText = '';
  }

  function validateForm() {
    let isValid = true;
    clearFieldErrors();

    const lastName = lastNameInput?.value.trim() || '';
    const name = nameInput?.value.trim() || '';

    if (name === '') {
      if (nameError) nameError.innerText = 'Пожалуйста, укажите ваше имя';
      isValid = false;
    } else if (name.length < 2) {
      if (nameError) nameError.innerText = 'Имя должно содержать хотя бы 2 символа';
      isValid = false;
    }

    if (lastName === '') {
      if (lastNameError) lastNameError.innerText = 'Пожалуйста, укажите фамилию';
      isValid = false;
    }

    let attendingSelected = false;
    attendingRadios.forEach(r => { if (r.checked) attendingSelected = true; });
    if (!attendingSelected) {
      if (attendingError) attendingError.innerText = 'Выберите вариант';
      isValid = false;
    }

    // Если выбрано «Да» — проверяем количество гостей
    const attendingValue = document.querySelector('input[name="attending"]:checked')?.value;
    if (attendingValue === 'yes') {
      const guestsVal = parseInt(guestsInput?.value, 10);
      if (isNaN(guestsVal) || guestsVal < 1) {
        if (guestsError) guestsError.innerText = 'Укажите количество гостей';
        isValid = false;
      }
    }

    return isValid;
  }

  function collectFormData() {
    const attendingValue = document.querySelector('input[name="attending"]:checked')?.value;
    return {
      invitationNames: document.getElementById('invitationNames')?.value || '',
      lastName: lastNameInput?.value.trim() || '',
      name: nameInput?.value.trim() || '',
      attending: attendingValue === 'yes' ? 'Да' : 'Нет',
      guests: attendingValue === 'yes' ? (guestsInput?.value || '1') : '0',
      declineReason: attendingValue === 'no' ? (declineReasonInput?.value.trim() || '') : '',
      comment: ''
    };
  }

  let isSubmitting = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    if (!validateForm()) return;

    isSubmitting = true;
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const spinner = document.getElementById('submitSpinner');
    if (submitBtn) submitBtn.classList.add('hidden');
    if (spinner) spinner.classList.remove('hidden');

    const data = collectFormData();
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxp-tBNlNz5QgfeTknmEYchpvVDqgsTV-vYq4iL0NT23EWbfnveaRcWatgbHQ20jZTYlA/exec';

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      form.classList.add('hidden');
      if (data.attending === 'Да') {
        successDivYes.classList.remove('hidden');
      } else {
        successDivNo.classList.remove('hidden');
      }
      if (spinner) spinner.classList.add('hidden');
      
      console.log('Данные отправлены:', data);
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Произошла ошибка. Проверьте интернет и попробуйте снова.');
      
      if (submitBtn) submitBtn.classList.remove('hidden');
      if (spinner) spinner.classList.add('hidden');
      isSubmitting = false;
    }
  });

  [nameInput, lastNameInput].forEach(input => {
    if (input) input.addEventListener('input', () => clearFieldErrors());
  });
  attendingRadios.forEach(r => r.addEventListener('change', () => { if (attendingError) attendingError.innerText = ''; }));
  if (guestsInput) guestsInput.addEventListener('change', () => { if (guestsError) guestsError.innerText = ''; });

  // Кнопка добавления в календарь
  var calendarBtn = document.getElementById('addToCalendarBtn');
  if (calendarBtn) {
    calendarBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Открываем Google Calendar для всех устройств
      var googleUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
        '&dates=20260821T100000Z%2F20260821T200000Z' +
        '&text=' + encodeURIComponent('Свадьба Валерии и Дмитрия') +
        '&details=' + encodeURIComponent('Сбор гостей в 14:00. Церемония в 15:00. Банкетный зал «Зеленый Берег»') +
        '&location=' + encodeURIComponent('городской округ Лобня, Московская область') +
        '&ctz=Europe%2FMoscow';
      
      window.open(googleUrl, '_blank');
    });
  }
});
