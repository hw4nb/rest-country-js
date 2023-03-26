import { pages } from '../controllers'

const router = route => {
  const content = document.querySelector('#root')
  content.innerHTML = ''

  if (route.includes('#/')) {
    return content.appendChild(pages.country())
  } else {
    return content.appendChild(pages.home())
  }
}

export { router }
