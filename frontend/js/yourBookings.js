const listEl = document.querySelector('.bookings-list') || document.getElementById('booking-list');

const dateFMT = (d)=> new Date(d).toLocaleDateString('en-GB',{weekday:'short', day:'2-digit', month:'short', year:'numeric'});

const calcNights = (cin,cout)=>{
  const diff=new Date(cout)-new Date(cin);
  return Math.max(1, Math.round(diff/(1000*60*60*24))||1);
};

const roomImages={single:['Untitled design (42).png','room-1979406_1280.jpg'],double:['Untitled design (41).png','Untitled design (20).png'],suite:['Untitled design (20).png','Untitled design (21).png']};
const randomImage=(type)=>{
  const arr=roomImages[type]||roomImages.single;
  const f=arr[Math.floor(Math.random()*arr.length)];
  return `../Images/Interior/Rooms/${f}`;
};

const createCard = (r)=>{
  const nights = calcNights(r['checkin-date'], r['checkout-date']);
  const price  = r.ratePrice||0;
  const total  = r.rateUnit==='night'? price*nights : price; // simple

  const div=document.createElement('div');
  div.className='booking-card';
  div.innerHTML=`
    <img src="${randomImage(r.roomType)}" class="card-img" alt="room" />
    <div class="card-info">
      <h3>${(r.roomType||'Room').replace(/^./,c=>c.toUpperCase())} Rooms</h3>
      <div class="dates">
        <div><span>Check-in</span><strong>${dateFMT(r['checkin-date'])}</strong></div>
        <div><span>Check-out</span><strong>${dateFMT(r['checkout-date'])}</strong></div>
      </div>
    </div>
    <div class="card-price">
      <div class="price-line">1 room | ${nights} night</div>
      <div class="price-value">LKR ${total.toLocaleString()}</div>
      <small>Taxes incl.</small>
    </div>`;
  return div;
};

fetch('http://localhost:5000/api/reservations/confirmed')
  .then(res=>res.json())
  .then(arr=>{
     listEl.innerHTML='';
     arr.forEach(r=>listEl.appendChild(createCard(r)));
     if (arr.length === 0) listEl.textContent = 'No bookings yet.';
  })
  .catch(err=>{
     console.error(err);
     listEl.textContent='Failed to load bookings';
  }); 