import '@/main.css';
import bgImg from '@/static/background.png';
import { cloneDeep, wait } from '@/utils';

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

function createBtn() {
  const element = document.createElement('button');
  element.innerHTML = 'Click me and check the console!';
  return element;
}
document.body.appendChild(createBtn());

const oBtn = document.querySelector('button');
oBtn?.addEventListener('click', async () => {
  await wait(1000);
  console.log('button clicked!');
});

const obj = { a: [1, 2, 3] };
const result = cloneDeep(obj?.a ?? 'nothing');

console.log('App ready!', result);
