// Gallery Carousel Logic
const imagePaths = [
  '../Images/Food and beverages/Untitled design (28).png',
  '../Images/Food and beverages/ed biffet (7).png',
  '../Images/Food and beverages/Untitled design (19).png',
  '../Images/Food and beverages/ed biffet (2).png',
  '../Images/Food and beverages/ed biffet (3).png',
  '../Images/Food and beverages/Untitled design (25).png',
  '../Images/Food and beverages/ed biffet (6).png',
  '../Images/Food and beverages/Untitled design (22).png',
  '../Images/Food and beverages/ed biffet.png',
];

let currentIndex = 0;
let intervalId = null;
let progressBar = null;
let sliding = false;

function updateCarousel() {
  const imagesContainer = document.querySelector('.carousel-images');
  imagesContainer.innerHTML = '';
  // Show 3 images: prev, current, next
  const prevIndex = (currentIndex + imagePaths.length - 1) % imagePaths.length;
  const nextIndex = (currentIndex + 1) % imagePaths.length;

  const leftImg = document.createElement('img');
  leftImg.src = imagePaths[prevIndex];
  leftImg.className = 'carousel-img left';
  leftImg.alt = `Gallery Image ${prevIndex + 1}`;
  imagesContainer.appendChild(leftImg);

  const centerImg = document.createElement('img');
  centerImg.src = imagePaths[currentIndex];
  centerImg.className = 'carousel-img focused';
  centerImg.alt = `Gallery Image ${currentIndex + 1}`;
  imagesContainer.appendChild(centerImg);

  const rightImg = document.createElement('img');
  rightImg.src = imagePaths[nextIndex];
  rightImg.className = 'carousel-img right';
  rightImg.alt = `Gallery Image ${nextIndex + 1}`;
  imagesContainer.appendChild(rightImg);
}

function startProgressBar() {
  if (!progressBar) progressBar = document.querySelector('.carousel-progress-bar');
  progressBar.style.transition = 'none';
  progressBar.style.width = '0%';
  setTimeout(() => {
    progressBar.style.transition = 'width 10s linear';
    progressBar.style.width = '100%';
  }, 50);
}

function nextImage() {
  if (sliding) return;
  sliding = true;
  currentIndex = (currentIndex + 1) % imagePaths.length;
  updateCarousel();
  startProgressBar();
  setTimeout(() => { sliding = false; }, 1200);
}

function prevImage() {
  if (sliding) return;
  sliding = true;
  currentIndex = (currentIndex + imagePaths.length - 1) % imagePaths.length;
  updateCarousel();
  startProgressBar();
  setTimeout(() => { sliding = false; }, 1200);
}

function startCarousel() {
  updateCarousel();
  startProgressBar();
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    nextImage();
  }, 10000);
}

document.addEventListener('DOMContentLoaded', () => {
  const leftArrow = document.querySelector('.carousel-arrow.left');
  const rightArrow = document.querySelector('.carousel-arrow.right');
  leftArrow.addEventListener('click', () => {
    prevImage();
    startCarousel();
  });
  rightArrow.addEventListener('click', () => {
    nextImage();
    startCarousel();
  });
  startCarousel();
}); 