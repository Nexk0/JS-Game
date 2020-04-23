// Get DOM Elements
const modal = document.querySelector('#my-modal');
const modalBtn = document.querySelector('#modal-btn');
const closeBtn = document.querySelector('.close');
const modal1 = document.querySelector('#m1');
const modal2 = document.querySelector('#m2');
const past = document.querySelector('#passer');
const click = document.querySelector('.start');

// Events
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
past.addEventListener('click', passe);

// Open
function openModal() {
  modal.style.display='block';
  modal1.style.visibility='visible';
  modal2.style.visibility='hidden';
}

function passe(){
  modal.style.display='block';
  modal1.style.visibility='hidden';
  modal2.style.visibility='visible';
}
// GO --> other page
document.querySelector(".start").addEventListener("click", function(){

  document.location.href = '../niveau1.html'
})

// Close
function closeModal() {
  modal.style.display = 'none';
}
