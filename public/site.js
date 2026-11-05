// Progressive enhancement only. Unison generates all readable page content.
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(returnFocus = false) {
  navigation?.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
  if (returnFocus) menu?.focus();
}
menu?.addEventListener('click', () => {
  const opened = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(opened));
  navigation.classList.toggle('open', opened);
});
navigation?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('#dispatches .dispatch-card')];
filters.forEach(button => button.addEventListener('click', () => {
  const region = button.dataset.filter;
  filters.forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  cards.forEach(card => { card.hidden = region !== 'all' && card.dataset.region !== region; });
  const count = cards.filter(card => !card.hidden).length;
  document.querySelector('#filter-status').textContent = `Showing ${count} reporting ${count === 1 ? 'brief' : 'briefs'}${region === 'all' ? '' : ` for ${button.textContent}`}.`;
}));

const pins = [...document.querySelectorAll('[data-map]')];
pins.forEach(button => button.addEventListener('click', () => {
  pins.forEach(pin => {
    const selected = pin === button;
    pin.setAttribute('aria-pressed', String(selected));
    pin.classList.toggle('active', selected);
    document.getElementById(`map-${pin.dataset.map}`).hidden = !selected;
  });
}));

document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  const url = button.dataset.copy === 'home'
    ? new URL('./', location.href).href
    : location.href.split('#')[0];
  const status = button.parentElement.querySelector('.copy-status') || document.querySelector('.copy-status');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(url);
    status.textContent = 'Link copied. Bring someone along.';
  } catch {
    status.replaceChildren(document.createTextNode('Copy this link: '));
    const input = document.createElement('input');
    input.type = 'url';
    input.readOnly = true;
    input.value = url;
    input.setAttribute('aria-label', 'Journal link to copy');
    input.style.cssText = 'width:100%;padding:8px;margin-top:8px;color:#192d2a;background:#f2f0e7;border:1px solid #9da396';
    status.append(input);
    input.focus();
    input.select();
  }
}));
