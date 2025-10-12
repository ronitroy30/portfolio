
// ===== Mobile nav toggle =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const opened = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(opened));
  });
  // Close menu on link click (mobile)
  navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== Active link on scroll =====
const sections = document.querySelectorAll('section[id]');
function onScroll() {
  const scrollY = window.pageYOffset + 120; // offset for fixed header
  sections.forEach(current => {
    const sectionTop = current.offsetTop;
    const sectionHeight = current.offsetHeight;
    const id = current.getAttribute('id');
    const link = document.querySelector('.nav__menu a[href*=' + id + ']');
    if (link) {
      if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active-link'));
        link.classList.add('active-link');
      }
    }
  });
}
window.addEventListener('scroll', onScroll);

// ===== Smooth anchor offset =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

// ===== Dynamic year in footer =====
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// ===== Project filters =====
const chips = document.querySelectorAll('.projects__filters .chip');
const cards = document.querySelectorAll('.project-card');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('chip--active'));
    chip.classList.add('chip--active');
    const filter = chip.dataset.filter;
    cards.forEach(card => {
      if (filter === 'all') {
        card.classList.remove('hidden');
      } else {
        const cat = card.getAttribute('data-category') || '';
        if (cat.includes(filter)) card.classList.remove('hidden');
        else card.classList.add('hidden');
      }
    });
  });
});

// ===== Simple "Quick View" modal =====
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
  <div class="modal__card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal__header">
      <h3 id="modal-title" class="modal__title">Project</h3>
      <button class="modal__close" aria-label="Close">&times;</button>
    </div>
    <div class="modal__content">
      <p id="modal-body">Loading…</p>
    </div>
  </div>`;
document.body.appendChild(modal);

const modalTitle = modal.querySelector('#modal-title');
const modalBody = modal.querySelector('#modal-body');
const closeBtn = modal.querySelector('.modal__close');
closeBtn.addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

const quickViews = document.querySelectorAll('[data-project]');
const projectDetails = {
  spotify: {
    title: 'Spotify Data Pipeline',
    body: 'Batch + streaming ETL with Airflow DAGs (cron + sensors), AWS Lambda for event ingestion, and Snowpipe for near‑real‑time loads. Includes dbt models, unit tests, and cost‑aware partitioning.'
  },
  lake: {
    title: 'Customer Data Lake',
    body: 'Retail data platform on S3 with Spark structured streaming, Parquet/ORC, Glue catalog, lifecycle rules, and Athena/Redshift spectrum for ad‑hoc analytics.'
  },
  recsys: {
    title: 'E‑commerce Recommender',
    body: 'Implicit MF + deep hybrid model; feature store with batch/online consistency; REST API with Flask and Redis caching; A/B tested CTR uplift ~20%.'
  },
  streaming: {
    title: 'Streaming Retail Analytics',
    body: 'Kafka topics (orders, inventory), Airflow orchestration, exactly‑once sinks, Redshift ELT with materialized views, and Looker dashboards for ops.'
  }
};
quickViews.forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-project');
    const detail = projectDetails[key] || {title:'Project', body:'No details.'};
    modalTitle.textContent = detail.title;
    modalBody.textContent = detail.body;
    modal.classList.add('open');
  });
});
