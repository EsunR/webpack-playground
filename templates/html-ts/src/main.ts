import '@/main.css';
import bgImg from '@/static/background.png';
import { cloneDeep } from '@/utils';

function createDiv() {
  const element = document.createElement('div');
  element.classList.add('hello');
  element.innerHTML = 'Hello World!';
  return element;
}
document.body.appendChild(createDiv());

function createImg() {
  const element = document.createElement('img');
  element.src = bgImg;
  return element;
}
document.body.appendChild(createImg());

const obj = { a: [1, 2, 3] };
const result = cloneDeep(obj?.a ?? 'nothing');

console.log('App ready!', result);
