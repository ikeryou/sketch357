import './style.css'
import { Contents } from './parts/contents';

document.querySelectorAll('.js-photo').forEach((val) => {
  new Contents({
    el:val,
  })
})

