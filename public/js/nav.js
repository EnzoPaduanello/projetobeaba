document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('nav ul.menu');

  menuToggle.addEventListener('click', () => {
      menu.classList.toggle('open');
  });
});

document.getElementById('usuariosNav').addEventListener('click', function(event){
  event.preventDefault();

  window.location.href = '/usuarios/gerenciamento'
});

document.getElementById('perfisNav').addEventListener('click', function(event){
  event.preventDefault();

  window.location.href = '/perfis/gerenciamento'
});

document.getElementById('transacoesNav').addEventListener('click', function(event){
  event.preventDefault();

  window.location.href = '/transacoes/gerenciamento'
});

document.getElementById('modulosNav').addEventListener('click', function(event){
  event.preventDefault();

  window.location.href = '/modulos/gerenciamento'
});

document.getElementById('funcoesNav').addEventListener('click', function(event){
  event.preventDefault();

  window.location.href = '/funcoes/gerenciamento'
});

document.getElementById('dashboardNav').addEventListener('click', function(event){
  event.preventDefault();

  window.location.href = '/dashboards'
});

document.getElementById('logoutNav').addEventListener('click', function(event){
  event.preventDefault();

  localStorage.clear();
  window.location.href = '/login'
});
