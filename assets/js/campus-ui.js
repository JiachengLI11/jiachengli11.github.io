(() => {
  const masthead = document.querySelector('.masthead');
  const nav = document.getElementById('site-nav');
  if (!masthead || !nav) return;

  const links = [...nav.querySelectorAll('a[href]')]
    .filter(link => !link.closest('.masthead__menu-home-item'))
    .map(link => {
      const url = new URL(link.getAttribute('href'), location.href);
      return { link, section: document.getElementById(decodeURIComponent(url.hash.slice(1))) };
    })
    .filter(item => item.section);
  const sections = [...new Set(links.map(item => item.section))];
  let queued = false;

  function update() {
    queued = false;
    const length = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = length > 0 ? Math.min(1, Math.max(0, window.scrollY / length)) : 0;
    masthead.style.setProperty('--reading-progress', `${fraction * 100}%`);

    const threshold = masthead.getBoundingClientRect().bottom + 72;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= threshold) current = section;
    }
    if (fraction >= 0.999) current = sections[sections.length - 1];
    for (const { link, section } of links) {
      if (section === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  function scheduleUpdate() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  document.addEventListener('DOMContentLoaded', scheduleUpdate);
  update();
})();
