setInterval(() => {
  animateHeroSection()
}, 1000);

function animateHeroSection() {

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  const uniqueRand = (min, max, prev) => {
    let next = prev;
    
    while(prev === next) next = rand(min, max);
    
    return next;
  }

  const combinations = [
    { configuration: 1, roundness: 1 },
    { configuration: 1, roundness: 2 },
    { configuration: 1, roundness: 4 },
    { configuration: 2, roundness: 2 },
    { configuration: 2, roundness: 3 },
    { configuration: 3, roundness: 3 }
  ];

  let prev = 0;

  const index = uniqueRand(0, combinations.length - 1, prev)
  const combination = combinations[index];
  
  heroAnimationWrap.dataset.configuration = combination.configuration;
  heroAnimationWrap.dataset.roundness = combination.roundness;
  
  prev = index;
}

const projectImages = document.querySelectorAll('.projects_wrapper img')
const projectControls = document.querySelectorAll('.projects_controls div')
const heroAnimationWrap = document.getElementById("hero_animation")

projectImages.forEach(i => i.addEventListener('click', handleProjectClick))
projectControls.forEach(b => b.addEventListener('click', handleProjectControlClick))

function handleProjectClick({target}) {
  let isOpen = false
  if(!target.classList.contains('open')) isOpen = true
  projectImages.forEach(i => i.classList.remove('open'))

  if(isOpen) target.classList.add('open')
  else target.classList.remove('open')
}

function handleProjectControlClick(e) {
  e.stopPropagation();
  
  const direction = this.dataset.direction
  const track = document.querySelector('.projects_inner')
  const translateValue = direction == 'next' ? -20 : 20

  const translate = parseInt(track.dataset.translate)
  const newTranslate = translate + translateValue

  if(newTranslate <= 0 && newTranslate >= -100) {
    track.animate({
      transform: `translateX(${newTranslate}%)`
    }, {duration: 700, fill: "forwards", easing: "ease-in-out"})

    projectImages.forEach(i => {
      i.animate({
        objectPosition: `${100 + newTranslate}% center`
      }, { duration: 1000, fill: "forwards", easing: "ease-in-out" });
    })

    track.dataset.translate = newTranslate
  }
}

const skills = document.querySelectorAll('.skill')
const sections = document.querySelectorAll('section')
const navItems = document.querySelectorAll('nav li')
const contactParticles = document.querySelectorAll('#contact .text-wrap h2, #contact .text-wrap p')
const toWatch = [...skills, ...sections, ...contactParticles]

navItems.forEach(navItem => navItem.addEventListener('click', scrollToTop))

function scrollToTop(element) {
  const scrollToDiv = this.dataset ? this.dataset.scrollto : element

  document.getElementById(scrollToDiv).scrollIntoView({behavior: 'smooth'})
}

skills.forEach((s, i) => {
  s.style.transitionDelay = `${i * .05}s`
})

contactParticles.forEach((s, i) => {
  s.style.transitionDelay = `${i * .1}s`
})

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.target.tagName == 'SECTION') {
      highlightNavItem(entry)
    }
    entry.target.classList.toggle('isVisible', entry.isIntersecting)
  })
}, {
  threshold: 1
})

function highlightNavItem(section) {
  const order = parseInt(section.target.dataset.order)
  
  navItems.forEach((n, i) => {
    if(i == order) n.classList.toggle('active', section.isIntersecting)
  })
}

toWatch.forEach(s => observer.observe(s))
// sections.forEach(navItem => observer.observe(navItem))


const reachOutLink = document.querySelector('a.reachout')
const reachOutForm = document.querySelector('form')

reachOutLink.addEventListener('click', (e) => {
  e.preventDefault()
  reachOutForm.classList.add('visible')
  reachOutForm.querySelector('input:first-of-type').focus()
})

reachOutForm.addEventListener('submit', e => {
  e.preventDefault()
  
  const heroPlane = document.querySelector('#hero .plane-container')
  heroPlane.classList.remove('fly-plane')

  reachOutForm.querySelector('.plane-container').classList.add('run-the-engine')

  // handle form submission plz
  
  setTimeout(() => {
    scrollToTop('hero')
    heroPlane.classList.add('fly-plane')
  }, 3000)
})