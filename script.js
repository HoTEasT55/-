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
  const successDiv = document.getElementById('rsvpSuccess');
  const nameInput = document.getElementById('name');
  const lastNameInput = document.getElementById('lastName');
  const attendingRadios = document.querySelectorAll('input[name="attending"]');
  const guestsInput = document.getElementById('guests');
  const nameError = document.getElementById('nameError');
  const lastNameError = document.getElementById('lastNameError');
  const attendingError = document.getElementById('attendingError');
  const guestsError = document.getElementById('guestsError');
  const extraGuestsContainer = document.getElementById('extraGuestsContainer');
  const extraGuestsList = document.getElementById('extraGuestsList');

  function clearFieldErrors() {
    if (nameError) nameError.innerText = '';
    if (lastNameError) lastNameError.innerText = '';
    if (attendingError) attendingError.innerText = '';
    if (guestsError) guestsError.innerText = '';

    for (let i = 2; i <= 6; i++) {
      const guestNameField = document.querySelector(`input[name="guest${i}Name"]`);
      const guestLastNameField = document.querySelector(`input[name="guest${i}LastName"]`);
      if (guestNameField) {
        guestNameField.style.borderColor = '#E3D9D0';
        guestNameField.style.boxShadow = 'none';
      }
      if (guestLastNameField) {
        guestLastNameField.style.borderColor = '#E3D9D0';
        guestLastNameField.style.boxShadow = 'none';
      }
      const errorEl = document.getElementById(`guest${i}Error`);
      if (errorEl) errorEl.remove();
    }
  }

  function updateExtraGuests(count) {
    if (!extraGuestsList || !extraGuestsContainer) return;
    const numGuests = parseInt(count, 10) || 1;
    extraGuestsList.innerHTML = '';
    if (numGuests > 1) {
      extraGuestsContainer.classList.remove('hidden');
      for (let i = 2; i <= numGuests; i++) {
        const div = document.createElement('div');
        div.className = 'extra-guest-item';
        div.innerHTML = `
          <div style="flex:1">
            <label class="guest-label">Гость ${i} — Имя</label>
            <input type="text" name="guest${i}Name" placeholder="Имя">
          </div>
          <div style="flex:1">
            <label class="guest-label">Гость ${i} — Фамилия</label>
            <input type="text" name="guest${i}LastName" placeholder="Фамилия">
          </div>
        `;
        extraGuestsList.appendChild(div);
      }
    } else {
      extraGuestsContainer.classList.add('hidden');
    }
  }

    if (guestsInput) {
    guestsInput.addEventListener('change', () => {
      updateExtraGuests(guestsInput.value);
    });
    updateExtraGuests(guestsInput.value);
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

    let guestsVal = parseInt(guestsInput?.value, 10);
    if (isNaN(guestsVal) || guestsVal < 1) {
      if (guestsError) guestsError.innerText = 'Минимум 1 гость';
      isValid = false;
    } else if (guestsVal > 6) {
      if (guestsError) guestsError.innerText = 'Максимум 6 гостей';
      isValid = false;
    }

    if (guestsVal > 1) {
      for (let i = 2; i <= guestsVal; i++) {
        const guestNameField = document.querySelector(`input[name="guest${i}Name"]`);
        const guestLastNameField = document.querySelector(`input[name="guest${i}LastName"]`);

        const guestName = guestNameField?.value.trim() || '';
        const guestLastName = guestLastNameField?.value.trim() || '';

        if (guestName === '' && guestLastName === '') {
          if (guestNameField) {
            guestNameField.style.borderColor = '#c06c54';
            guestNameField.style.boxShadow = '0 0 0 2px rgba(192, 108, 84, 0.15)';
          }
          if (guestLastNameField) {
            guestLastNameField.style.borderColor = '#c06c54';
            guestLastNameField.style.boxShadow = '0 0 0 2px rgba(192, 108, 84, 0.15)';
          }
          const existingError = document.getElementById(`guest${i}Error`);
          if (existingError) {
            existingError.innerText = 'Укажите имя и фамилию гостя';
          } else if (guestNameField?.parentElement) {
            const errorSpan = document.createElement('span');
            errorSpan.id = `guest${i}Error`;
            errorSpan.className = 'error-msg';
            errorSpan.innerText = 'Укажите имя и фамилию гостя';
            guestNameField.parentElement.appendChild(errorSpan);
          }
          isValid = false;
        } else if (guestName === '') {
          if (guestNameField) {
            guestNameField.style.borderColor = '#c06c54';
            guestNameField.style.boxShadow = '0 0 0 2px rgba(192, 108, 84, 0.15)';
          }
          const existingError = document.getElementById(`guest${i}Error`);
          if (!existingError && guestNameField?.parentElement) {
            const errorSpan = document.createElement('span');
            errorSpan.id = `guest${i}Error`;
            errorSpan.className = 'error-msg';
            errorSpan.innerText = 'Укажите имя гостя';
            guestNameField.parentElement.appendChild(errorSpan);
          } else if (existingError) {
            existingError.innerText = 'Укажите имя гостя';
          }
          isValid = false;
        } else if (guestLastName === '') {
          if (guestLastNameField) {
            guestLastNameField.style.borderColor = '#c06c54';
            guestLastNameField.style.boxShadow = '0 0 0 2px rgba(192, 108, 84, 0.15)';
          }
          const existingError = document.getElementById(`guest${i}Error`);
          if (!existingError && guestNameField?.parentElement) {
            const errorSpan = document.createElement('span');
            errorSpan.id = `guest${i}Error`;
            errorSpan.className = 'error-msg';
            errorSpan.innerText = 'Укажите фамилию гостя';
            guestNameField.parentElement.appendChild(errorSpan);
          } else if (existingError) {
            existingError.innerText = 'Укажите фамилию гостя';
          }
          isValid = false;
        } else {
          if (guestNameField) {
            guestNameField.style.borderColor = '#E3D9D0';
            guestNameField.style.boxShadow = 'none';
          }
          if (guestLastNameField) {
            guestLastNameField.style.borderColor = '#E3D9D0';
            guestLastNameField.style.boxShadow = 'none';
          }
          const existingError = document.getElementById(`guest${i}Error`);
          if (existingError) existingError.remove();
        }
      }
    }

    return isValid;
  }

  function collectFormData() {
    const data = {
      invitationNames: document.getElementById('invitationNames')?.value || '',
      lastName: lastNameInput?.value.trim() || '',
      name: nameInput?.value.trim() || '',
      attending: document.querySelector('input[name="attending"]:checked')?.value === 'yes' ? 'Да' : 'Нет',
      guests: guestsInput?.value || '1',
      comment: document.getElementById('comment')?.value.trim() || '',
      extraGuests: []
    };
    const totalGuests = parseInt(data.guests, 10) || 1;
    for (let i = 2; i <= totalGuests; i++) {
      const nameField = document.querySelector(`input[name="guest${i}Name"]`);
      const lastNameField = document.querySelector(`input[name="guest${i}LastName"]`);
      data.extraGuests.push({
        name: nameField?.value.trim() || '',
        lastName: lastNameField?.value.trim() || ''
      });
    }
    return data;
  }

    let isSubmitting = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Блокируем повторную отправку
    if (isSubmitting) return;
    if (!validateForm()) return;

    isSubmitting = true;
    
    // Показываем спиннер, скрываем кнопку
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

      // Задержка 2 секунды, чтобы пользователь видел спиннер
      await new Promise(resolve => setTimeout(resolve, 2000));

      form.classList.add('hidden');
      successDiv.classList.remove('hidden');
      if (spinner) spinner.classList.add('hidden');
      
      console.log('Данные отправлены:', data);
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Произошла ошибка. Проверьте интернет и попробуйте снова.');
      
      // Возвращаем кнопку при ошибке
      if (submitBtn) submitBtn.classList.remove('hidden');
      if (spinner) spinner.classList.add('hidden');
      isSubmitting = false;
    }
  });

  [nameInput, lastNameInput].forEach(input => {
    if (input) input.addEventListener('input', () => clearFieldErrors());
  });
  attendingRadios.forEach(r => r.addEventListener('change', () => { if (attendingError) attendingError.innerText = ''; }));
  if (guestsInput) guestsInput.addEventListener('input', () => { if (guestsError) guestsError.innerText = ''; });

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
