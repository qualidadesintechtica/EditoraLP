'use strict';

const email = 'editorasintechtica@animaeducacao.com.br';
const menuButton = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu');
const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  menu.classList.remove('is-open');
};
menuButton.addEventListener('click', () => {
  const opened = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opened));
  menuButton.setAttribute('aria-label', opened ? 'Fechar menu' : 'Abrir menu');
  menu.classList.toggle('is-open', opened);
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 641px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
document.getElementById('year').textContent = String(new Date().getFullYear());

const projectDialog = document.getElementById('project-dialog');
const privacyDialog = document.getElementById('privacy-dialog');
const projectInfo = {
  floresce: {
    title: 'Educação que floresce',
    category: 'PROJETO EDITORIAL · EDUCAÇÃO',
    description: 'Educação que floresce integra o planejamento editorial da Sintechtica. Para conhecer a proposta da obra, sua autoria e as informações de lançamento, converse com a equipe editorial.'
  },
  taxonomia: {
    title: 'Taxonomia da Neuroaprendizagem',
    category: 'PROJETO EDITORIAL · APRENDIZAGEM',
    description: 'O projeto sobre Taxonomia da Neuroaprendizagem integra o percurso editorial da Sintechtica. Consulte a equipe para confirmar o título definitivo, a autoria, a proposta e as condições de acesso à obra.'
  }
};
function openDialog(dialog) { dialog.showModal(); document.body.classList.add('no-scroll'); }
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projectInfo[button.dataset.project];
  document.getElementById('dialog-title').textContent = project.title;
  document.getElementById('dialog-category').textContent = project.category;
  document.getElementById('dialog-description').textContent = project.description;
  document.getElementById('dialog-contact').dataset.projectTitle = project.title;
  openDialog(projectDialog);
}));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('no-scroll'));
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    }
  });
});
document.getElementById('privacy-button').addEventListener('click', () => openDialog(privacyDialog));
document.getElementById('dialog-contact').addEventListener('click', event => {
  event.preventDefault();
  document.getElementById('interest').value = 'obras';
  document.getElementById('message').value = `Olá! Gostaria de receber informações sobre o projeto ${event.currentTarget.dataset.projectTitle}.`;
  projectDialog.close();
  document.getElementById('contato').scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  document.getElementById('name').focus({preventScroll: true});
});
document.querySelectorAll('[data-interest]').forEach(link => link.addEventListener('click', () => {
  document.getElementById('interest').value = link.dataset.interest;
}));

document.getElementById('copy-email').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(email);
    status.textContent = 'E-mail copiado.';
  } catch {
    status.textContent = `Selecione e copie o endereço: ${email}`;
  }
});

document.getElementById('contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const nameInput = document.getElementById('name');
  const messageInput = document.getElementById('message');
  nameInput.setCustomValidity(nameInput.value.trim() ? '' : 'Informe seu nome.');
  messageInput.setCustomValidity(messageInput.value.trim().length >= 10 ? '' : 'Escreva uma mensagem com pelo menos 10 caracteres.');
  if (!event.currentTarget.reportValidity()) return;
  const select = document.getElementById('interest');
  const subject = `[Editora Sintechtica] ${select.options[select.selectedIndex].text}`;
  const body = `Olá, equipe da Editora Sintechtica!\n\nMeu nome é ${nameInput.value.trim()}.\n\n${messageInput.value.trim()}\n\nAtenciosamente,\n${nameInput.value.trim()}`;
  const uri = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const status = document.getElementById('form-status');
  status.replaceChildren(document.createTextNode('Mensagem preparada. Revise e envie no seu aplicativo de e-mail. Se ele não abrir, '));
  const retry = document.createElement('a');
  retry.href = uri;
  retry.textContent = 'clique aqui';
  status.append(retry, document.createTextNode(` ou escreva para ${email}.`));
  window.location.href = uri;
});
['name', 'message'].forEach(id => document.getElementById(id).addEventListener('input', event => event.target.setCustomValidity('')));
