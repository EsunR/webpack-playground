import '@/main.css';
import bgImg from '@/static/background.png';

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

console.log('App ready!');
