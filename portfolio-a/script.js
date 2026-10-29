const langButton=document.getElementById('language');
let current='en';
langButton.addEventListener('click',()=>{
  current=current==='en'?'ar':'en';
  const rtl=current==='ar';
  document.documentElement.lang=current;
  document.documentElement.dir=rtl?'rtl':'ltr';
  document.body.dir=rtl?'rtl':'ltr';
  document.querySelectorAll('[data-en][data-ar]').forEach(el=>{el.innerHTML=el.dataset[current]});
  langButton.innerHTML=rtl?'EN <span>↗</span>':'عربي <span>↗</span>';
});

// Keep motion subtle, and reveal content as each section enters view.
document.body.classList.add('motion-ready');
const revealItems=document.querySelectorAll('.section-label,.intro-content,.stats,.recruiter-snapshot,.section-heading,.project-card,.journey-grid,.contact-inner');
revealItems.forEach(el=>el.classList.add('reveal'));
document.querySelectorAll('.stats>div,.skill').forEach((el,index)=>{
  el.classList.add('reveal');
  el.style.setProperty('--reveal-delay',`${Math.min(index*65,390)}ms`);
});
if('IntersectionObserver' in window){
  const revealObserver=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -35px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
}else{
  document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));
}

// Add a restrained pointer glow to the visual panels on mouse devices.
if(window.matchMedia('(hover: hover) and (pointer: fine)').matches){
  document.querySelectorAll('.hero-art,.project-visual').forEach(panel=>{
    panel.addEventListener('pointermove',event=>{
      const box=panel.getBoundingClientRect();
      panel.style.setProperty('--spot-x',`${event.clientX-box.left}px`);
      panel.style.setProperty('--spot-y',`${event.clientY-box.top}px`);
    });
    panel.addEventListener('pointerleave',()=>{
      panel.style.setProperty('--spot-x','50%');
      panel.style.setProperty('--spot-y','50%');
    });
  });
}

const progressFill=document.getElementById('progress-fill');
const navLinks=[...document.querySelectorAll('nav a')];
const sections=navLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
function updateReadingProgress(){
  const scrollable=document.documentElement.scrollHeight-window.innerHeight;
  progressFill.style.width=`${scrollable>0?(window.scrollY/scrollable)*100:0}%`;
}
window.addEventListener('scroll',updateReadingProgress,{passive:true});
updateReadingProgress();

if('IntersectionObserver' in window){
  const sectionObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        navLinks.forEach(link=>{
          if(link.getAttribute('href')===`#${entry.target.id}`) link.setAttribute('aria-current','location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  },{rootMargin:'-35% 0px -55% 0px'});
  sections.forEach(section=>sectionObserver.observe(section));
}

