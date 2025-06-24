document.addEventListener('DOMContentLoaded', () => {
  // Lightweight helper: $("elemId") → document.getElementById(elemId)
  const $ = (id) => document.getElementById(id);

  // Selected room information saved from previous page (single/double/suite)
  const selectedRoom = JSON.parse(localStorage.getItem('selectedRoom') || '{}');
  const roomType = selectedRoom.type || 'unknown';

  // Populate room card if data exists
  if (selectedRoom && selectedRoom.name) {
    const imgEl = $('card-room-image');
    if (imgEl) imgEl.src = selectedRoom.image || imgEl.src;
    const nameEl = $('card-room-name');
    if (nameEl) nameEl.textContent = selectedRoom.name;
    const ratingEl = $('card-rating');
    if (ratingEl) ratingEl.textContent = selectedRoom.rating ?? '--';
    const revEl = $('card-reviews');
    if (revEl) revEl.textContent = `- ${selectedRoom.reviews ?? 0} Reviews`;
  }

  const confirmBtn = document.querySelector('.confirm-btn');
  const editBtn    = document.querySelector('.edit-btn');
  const deleteBtn  = document.querySelector('.delete-btn');

  // Persisted id if a reservation was already saved earlier in this session
  let reservationId = localStorage.getItem('confirmedReservationId') || null;

  // Disable edit/delete until a reservation exists
  if (!reservationId) {
    editBtn.disabled = true;
    deleteBtn.disabled = true;
  }

  const roomSelect  = $('select-room-type');
  const rateSelect  = $('select-rate');
  const guestsInput = $('input-guests');

  // set defaults from selectedRoom if available
  if (selectedRoom.type) roomSelect.value = selectedRoom.type;

  const priceMap = {
    single: { night: 22000, week: 153000, month: 657000 },
    double: { night: 40000, week: 280000, month: 1200000 },
    suite:  { night: 40000, week: 280000, month: 1200000 }
  };

  const populateRateOptions = () => {
    const type = roomSelect.value || 'single';
    const prices = priceMap[type];
    rateSelect.innerHTML = '';
    const addOpt = (label, unit) => {
      const opt = document.createElement('option');
      opt.dataset.unit = unit;
      opt.dataset.price = prices[unit];
      opt.textContent = `LKR ${prices[unit].toLocaleString()} per ${unit}`;
      rateSelect.appendChild(opt);
    };
    addOpt(prices.night? 'night':'','night');
    addOpt(prices.week? 'week':'','week');
    addOpt(prices.month? 'month':'','month');
  };

  populateRateOptions();
  roomSelect.addEventListener('change', () => {
    populateRateOptions();
    updatePriceCard();
  });

  const getRateInfo = () => {
    const opt = rateSelect.options[rateSelect.selectedIndex];
    return { unit: opt.dataset.unit, price: Number(opt.dataset.price) };
  };

  const calcNights = () => {
    const inDate  = new Date($('checkin-date').value);
    const outDate = new Date($('checkout-date').value);
    const diff = outDate - inDate;
    const nights = Math.max(1, Math.round(diff / (1000*60*60*24)) || 1);
    return isNaN(nights)?1:nights;
  };

  const updatePriceCard = () => {
    const { unit, price } = getRateInfo();
    const nights = calcNights();
    let unitsUsed;
    if (unit==='night') unitsUsed = nights;
    else if (unit==='week') unitsUsed = Math.ceil(nights/7);
    else unitsUsed = Math.ceil(nights/30);

    const sub = unitsUsed * price;
    const tax = Math.round(sub*0.1);
    const total = sub+tax;

    $('pricing-nights').textContent = `1 room x ${unitsUsed} ${unit}${unitsUsed>1?'s':''}`;
    $('pricing-subtotal').textContent = `LKR ${sub.toLocaleString()}`;
    $('pricing-tax').textContent = `LKR ${tax.toLocaleString()}`;
    $('pricing-grand-total').textContent = `LKR ${total.toLocaleString()}`;
  };

  ['input','change'].forEach(ev=>{
    ['checkin-date','checkout-date'].forEach(id=>$(id).addEventListener(ev,updatePriceCard));
    roomSelect.addEventListener(ev,updatePriceCard);
    rateSelect.addEventListener(ev,updatePriceCard);
    guestsInput.addEventListener(ev,updatePriceCard);
  });

  updatePriceCard();

  confirmBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Basic front-end validation: ensure required personal fields are filled
    const firstName = $('first-name').value.trim();
    const lastName  = $('last-name').value.trim();
    const phone     = $('phone').value.trim();
    const email     = $('email').value.trim();

    if (!firstName || !lastName || !phone || !email) {
      alert('Please complete the required personal details before proceeding.');
      return;
    }

    // Automatically collect every input/select/textarea inside the form section
    const inputs = document.querySelectorAll(
      '.confirm-reservation-container input, .confirm-reservation-container select, .confirm-reservation-container textarea'
    );

    const payload = {};
    inputs.forEach(el => {
      const key = el.id || el.name;
      if (key) payload[key] = el.value.trim();
    });

    const rateInfo = getRateInfo();
    payload.roomType = roomSelect.value;
    payload.rateUnit = rateInfo.unit;
    payload.ratePrice = rateInfo.price;
    payload.guestCount = Number(guestsInput.value);

    // POST to confirmed reservations endpoint (no auth required)
    fetch('http://localhost:5000/api/reservations/confirmed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || 'Server responded with an error');
        }
        return data;
      })
      .then((data) => {
        reservationId = data.id;
        localStorage.setItem('confirmedReservationId', reservationId);

        editBtn.disabled   = false;
        deleteBtn.disabled = false;

        alert('Reservation saved successfully!');
      })
      .catch(err => {
        console.error('Insertion failed:', err);
        alert(err.message || 'Failed to save reservation');
      });
  });

  // -------- EDIT handler ---------
  editBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!reservationId) {
      alert('No reservation to update. Please save first.');
        return;
      }

    const inputs = document.querySelectorAll(
      '.confirm-reservation-container input, .confirm-reservation-container select, .confirm-reservation-container textarea'
    );
    const payload = {};
    inputs.forEach(el => {
      const key = el.id || el.name;
      if (key) payload[key] = el.value.trim();
    });

    const rateInfo = getRateInfo();
    payload.roomType = roomSelect.value;
    payload.rateUnit = rateInfo.unit;
    payload.ratePrice = rateInfo.price;
    payload.guestCount = Number(guestsInput.value);

    fetch(`http://localhost:5000/api/reservations/confirmed/${reservationId}`, {
        method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
      .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Update failed');
        return data;
      })
      .then(() => {
        alert('Reservation updated successfully!');
      })
      .catch(err => {
        console.error('Update failed', err);
        alert(err.message || 'Failed to update reservation');
      });
  });

  // -------- DELETE handler ---------
  deleteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!reservationId) {
      alert('No reservation to delete.');
      return;
    }

    if (!confirm('Are you sure you want to delete this reservation?')) return;

    fetch(`http://localhost:5000/api/reservations/confirmed/${reservationId}`, {
      method: 'DELETE'
    })
      .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Delete failed');
        return data;
      })
      .then(() => {
        localStorage.removeItem('confirmedReservationId');
        reservationId = null;
        editBtn.disabled = true;
        deleteBtn.disabled = true;
        alert('Reservation deleted.');
      })
      .catch(err => {
        console.error('Delete failed', err);
        alert(err.message || 'Failed to delete reservation');
      });
  });

  const formatDateLong = (iso) => {
    if (!iso) return '--';
    const d = new Date(iso);
    if (isNaN(d)) return '--';
    return d.toLocaleDateString('en-GB', { weekday:'short', day:'2-digit', month:'short', year:'numeric' });
  };

  const formatTime = (val) => val ? `${val}` : '--:--';

  const updateSummary = () => {
    $('display-checkin-date').textContent = formatDateLong($('checkin-date').value);
    $('display-checkin-time').textContent = 'From ' + formatTime($('checkin-time').value);

    $('display-checkout-date').textContent = formatDateLong($('checkout-date').value);
    $('display-checkout-time').textContent = 'Until ' + formatTime($('checkout-time').value);

    const unit  = selectedRoom.rateUnit  || 'night';
    const price = selectedRoom.ratePrice || 0;

    const calcTotal = () => {
      const inDate  = new Date($('checkin-date').value);
      const outDate = new Date($('checkout-date').value);
      const nights  = Math.max(1, Math.round((outDate - inDate)/(1000*60*60*24)));

      let unitsUsed, sub;
      if (unit === 'night') {
        unitsUsed = nights;
        sub       = nights * price;
      } else if (unit === 'week') {
        unitsUsed = Math.ceil(nights / 7);
        sub       = unitsUsed * price;
      } else {                    // month
        unitsUsed = Math.ceil(nights / 30);
        sub       = unitsUsed * price;
      }

      const tax = Math.round(sub * 0.10);
      const tot = sub + tax;

      $('pricing-nights').textContent      =
           `1 room x ${unitsUsed} ${unit}${unitsUsed>1?'s':''}`;
      $('pricing-subtotal').textContent = `LKR ${sub.toLocaleString()}`;
      $('pricing-grand-total').textContent = `LKR ${tot.toLocaleString()}`;
    };

    calcTotal();
    ['checkin-date','checkout-date'].forEach(id =>
      $(id).addEventListener('input', calcTotal)
    );
  };

  ['checkin-date','checkin-time','checkout-date','checkout-time'].forEach(id => {
    $(id).addEventListener('input', updateSummary);
  });

  // initial call in case of prefilled values
  updateSummary();

  const checkInInput  = $('checkin-date');
  const checkOutInput = $('checkout-date');

  // -------------------------------------------------------------
  // Enforce that check-out is always AFTER check-in
  // -------------------------------------------------------------
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  // Helper to set the minimum selectable check-out date
  const updateCheckoutMin = () => {
    if (!checkInInput.value) return;
    const checkInDate = new Date(checkInInput.value);
    const minCheckOut = new Date(checkInDate.getTime() + MS_PER_DAY);
    const minStr = minCheckOut.toISOString().split('T')[0];
    checkOutInput.min = minStr;

    // If an invalid check-out is already chosen, clear and warn
    if (checkOutInput.value && new Date(checkOutInput.value) < minCheckOut) {
      alert('Check-out date must be at least one day after the check-in date. Please choose again.');
      checkOutInput.value = '';
      updatePriceCard(); // keep price card in sync
    }
  };

  // Initial min-date settings
  const todayISO = new Date().toISOString().split('T')[0];
  checkInInput.min = todayISO;
  updateCheckoutMin();

  // Event wiring
  checkInInput.addEventListener('change', () => {
    updateCheckoutMin();
    updatePriceCard();
  });

  checkOutInput.addEventListener('change', () => {
    if (!checkInInput.value) return; // nothing to validate yet
    if (new Date(checkOutInput.value) <= new Date(checkInInput.value)) {
      alert('Check-out date must be after the check-in date.');
      checkOutInput.value = '';
      updatePriceCard();
    }
  });
});
