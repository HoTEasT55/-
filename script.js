document.addEventListener('DOMContentLoaded', () => {

  // ---- КОНВЕРТ ----
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const openBtn = document.getElementById('openInvitationBtn');
  const envelopeFlap = document.getElementById('envelopeFlap');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  let musicStarted = false;

  function openEnvelope() {
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = collectFormData();

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxkYFovXkTOlD6CFzQ6MkuKquWNTKtm0xKTVERV2mboNqnoSett1QLIBbC2L4qVi9EbgQ/exec';

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      form.classList.add('hidden');
      successDiv.classList.remove('hidden');

      if (!document.querySelector('.reset-form-btn')) {
        const btn = document.createElement('button');
        btn.textContent = 'Отправить ещё один ответ';
        btn.classList.add('btn', 'btn-outline', 'reset-form-btn');
        btn.style.marginTop = '1rem';
        btn.addEventListener('click', () => {
          form.reset();
          form.classList.remove('hidden');
          successDiv.classList.add('hidden');
          clearFieldErrors();
          updateExtraGuests(1);
          btn.remove();
        });
        successDiv.appendChild(btn);
      }
      console.log('Данные отправлены:', data);
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Произошла ошибка. Проверьте интернет и попробуйте снова.');
    }
  });

  [nameInput, lastNameInput].forEach(input => {
    if (input) input.addEventListener('input', () => clearFieldErrors());
  });
  attendingRadios.forEach(r => r.addEventListener('change', () => { if (attendingError) attendingError.innerText = ''; }));
  if (guestsInput) guestsInput.addEventListener('input', () => { if (guestsError) guestsError.innerText = ''; });
});