// hero animation start
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
// hero animation end

const projectImages = document.querySelectorAll('.projects_wrapper img')
const projectControls = document.querySelectorAll('.projects_controls div')
const heroAnimationWrap = document.getElementById("hero_animation")
const skills = document.querySelectorAll('.skill')
const sections = document.querySelectorAll('section')
const navItems = document.querySelectorAll('nav li')
const contactParticles = document.querySelectorAll('#contact .text-wrap h2, #contact .text-wrap .content-wrap')
const toWatch = [...skills, ...sections, ...contactParticles]
const reachOutLink = document.querySelector('a.reachout')
const reachOutForm = document.querySelector('form')

// add event listeners
projectImages.forEach(i => i.addEventListener('click', handleProjectClick))
projectControls.forEach(b => b.addEventListener('click', handleProjectControlClick))
navItems.forEach(navItem => navItem.addEventListener('click', scrollToTop))
// add animation delay to components
skills.forEach((s, i) => { s.style.transitionDelay = `${i * .05}s`})
contactParticles.forEach((s, i) => { s.style.transitionDelay = `${i * .1}s`})

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

function scrollToTop(element) {
  const scrollToDiv = this.dataset ? this.dataset.scrollto : element

  document.getElementById(scrollToDiv).scrollIntoView({behavior: 'smooth'})
}

// init intersection observer
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.target.tagName == 'SECTION') {
      highlightNavItem(entry)
    }
    entry.target.classList.toggle('isVisible', entry.isIntersecting)
  })
}, {
  threshold: 0.25
})

toWatch.forEach(s => observer.observe(s))

function highlightNavItem(section) {
  const order = parseInt(section.target.dataset.order)
  
  navItems.forEach((n, i) => {
    if(i == order) n.classList.toggle('active', section.isIntersecting)
  })
}

reachOutLink.addEventListener('click', (e) => {
  e.preventDefault()
  reachOutForm.classList.add('visible')
  reachOutForm.querySelector('input:first-of-type').focus()
})

reachOutForm.addEventListener('submit', e => {
  e.preventDefault()

  reachOutForm.querySelector('.plane-container').classList.add('run-the-engine')

  const name = reachOutForm.querySelector('#name'),
        email = reachOutForm.querySelector('#email'),
        message = reachOutForm.querySelector('#msg')

  const values = [name.value, email.value, message.value]
  let errors = []

  values.forEach((value, i) => {
    const trimmed = value.trim()

    if(!trimmed.length) {
      const err = {
        index: i,
        msg: 'Cannot be empty'
      }
      errors.push(err)
    }

    if(trimmed.length > 40 && i != 2) {
      const err = {
        index: i,
        msg: 'Maximum length exceeded'
      }
      errors.push(err)
    }
  })

  if(errors.length) {
    handleErrors(errors)
    return
  }

  const formData = new FormData(reachOutForm);

  sendMeAMsg(formData)
  
})

async function sendMeAMsg(data) {
  const heroPlane = document.querySelector('#hero .plane-container')
  const loadingIcon = document.querySelector('.btn-status-wrap .loading-icon')

  heroPlane.classList.remove('fly-plane')
  loadingIcon.classList.add('opacity-100')

  const res = await fetch(reachOutForm.action, {
    method: 'POST',
    body: data,
    headers: {
        'Accept': 'application/json'
    }
  })

  const response = await res.json()

  if(response.ok) {
    setTimeout(() => {
      loadingIcon.classList.remove('opacity-100')
      scrollToTop('hero')
      heroPlane.classList.add('fly-plane')
      handleSuccess({
        index: -1,
        msg: "Message sent"
      })
      clearUserInput()
    }, 3000)

    return
  }

  alert('ne radim zzz')
}

function clearUserInput() {
  reachOutForm.reset()
}

function handleSuccess({msg}) {
  const tooltip = document.querySelector('.tooltip')

  tooltip.textContent = msg
  tooltip.classList.add('error')

  setTimeout(() => {tooltip.classList.remove('error')}, 2500)
}

function handleErrors(errs) {
  const tooltips = document.querySelectorAll('.tooltip')
  const inputs = document.querySelectorAll('form input, form textarea')

  errs.forEach((err, i) => {
    tooltips[i].textContent = err.msg
    tooltips[i].classList.add('error')
    inputs[err.index].classList.add('error')
    console.log(inputs)

    setTimeout(() => {
      tooltips[i].classList.remove('error')
      inputs[err.index].classList.remove('error')
    }, 2500)
  })
}