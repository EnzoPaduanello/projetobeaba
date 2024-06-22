const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('nav ul');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('open');
});
