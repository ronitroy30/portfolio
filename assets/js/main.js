
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



/* ===== Enhancements (moved from inline) ===== */
document.addEventListener('DOMContentLoaded', function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress
  const bar = document.getElementById('scroll-progress');
  const onScroll = () => {
    if (!bar) return;
    const st = document.documentElement.scrollTop || document.body.scrollTop;
    const dh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const p = dh ? st/dh : 0;
    bar.style.transform = `scaleX(${p})`;
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Typewriter
  const tw = document.getElementById('typewriter');
  if (tw){
    const phrases = [
      (tw.textContent || "").trim() || "Data Engineer",
      "Machine Learning Engineer",
      "ETL & Cloud (AWS)",
      "Analytics & Visualization"
    ];
    let i=0, pos=0, dir=1, hold=0;
    setInterval(()=>{
      if (prefersReduced){ tw.textContent = phrases[i]; return; }
      if (hold>0){ hold--; return; }
      const t = phrases[i];
      pos += dir;
      tw.textContent = t.slice(0,pos);
      if (pos>=t.length){ dir=-1; hold=18; }
      if (pos<=0){ dir=1; i=(i+1)%phrases.length; hold=8; }
    }, 60);
  }

  // Particles
  (function(){
    const c = document.getElementById('particles-canvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    let w=0,h=0,dpr=Math.max(1, window.devicePixelRatio||1);
    let P=[], N=prefersReduced?16:60;

    function resize(){
      const r = c.parentElement.getBoundingClientRect();
      w=r.width; h=r.height;
      c.width = Math.floor(w*dpr); c.height = Math.floor(h*dpr);
      c.style.width=w+'px'; c.style.height=h+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    function init(){
      P=[];
      for(let i=0;i<N;i++) P.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,r:Math.random()*2+.6});
    }
    function color(){ return getComputedStyle(document.documentElement).getPropertyValue('--first-color').trim() || '#4f46e5'; }
    function step(){
      ctx.clearRect(0,0,w,h);
      P.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>w)p.vx*=-1; if(p.y<0||p.y>h)p.vy*=-1; });
      for(let i=0;i<P.length;i++) for(let j=i+1;j<P.length;j++){
        const a=P[i],b=P[j],dx=a.x-b.x,dy=a.y-b.y,dist=Math.hypot(dx,dy);
        if(dist<120){ ctx.globalAlpha=1-(dist/120); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.strokeStyle=color(); ctx.lineWidth=1; ctx.stroke(); }
      }
      ctx.globalAlpha=1; ctx.fillStyle=color();
      P.forEach(p=>{ ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); });
      requestAnimationFrame(step);
    }
    resize(); init(); step();
    window.addEventListener('resize', ()=>{ resize(); init(); });
  })();

  // Reveal
  (function(){
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (prefersReduced){ els.forEach(e=>e.classList.add('in-view')); return; }
    const io = new IntersectionObserver(entries=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in-view'); io.unobserve(en.target);} });
    }, {threshold:.15});
    els.forEach(e=>io.observe(e));
  })();

  // Parallax
  (function(){
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length || prefersReduced) return;
    window.addEventListener('mousemove', e=>{
      const cx=innerWidth/2, cy=innerHeight/2;
      const dx=(e.clientX-cx)/cx, dy=(e.clientY-cy)/cy;
      els.forEach(el=>{ el.style.transform = `translate3d(${dx*8}px, ${dy*8}px, 0)`; });
    });
  })();
});
