const olPathInicial = document.querySelector('.cart__items');
const localStorageUpdate = () => {
  const olPath = document.querySelector('.cart__items');
  localStorage.setItem('olInfo', olPath.innerHTML);
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// *-- 5 --*
const cartItems = [];
const cartPrices = [];

const createTitleTotalPrice = () => {
  const h1Path = document.querySelector('.total-price');
  let sumPrices = 0;
  cartPrices.forEach((price) => {
    sumPrices += price;
  });
  h1Path.innerText = sumPrices;
};
//  *-- 3 --*
function cartItemClickListener(event) {
  const innerTextLi = event.target.innerText;
  for (let index = 0; index < cartItems.length; index += 1) {
    if (innerTextLi === cartItems[index]) {
      cartPrices[index] = 0;
    }
  }
  createTitleTotalPrice();
  event.target.remove('li');
  localStorageUpdate();
}
olPathInicial.addEventListener('click', cartItemClickListener);

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  cartItems.push(li.innerText);
  cartPrices.push(price);
  return li;
}
// *-- 1 --*
const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const arrayToObject = ({ id, title, thumbnail }, key1, key2, key3) => ({ 
  [key1]: id,
  [key2]: title,
  [key3]: thumbnail,
});

// const promise = new Promise(() => {});
function fetchApi(urlApi) {
  return fetch(urlApi)
  .then((response) => response.json())
  .then((json) => json.results.map((jsonObj) => arrayToObject(jsonObj, 'sku', 'name', 'image')));
}
// console.log(fetchApi(url));
// *-- 2 --*
async function fetchId(event) {
  const buttonParent = event.target.parentElement;
  const parentId = getSkuFromProductItem(buttonParent);
  return fetch(`https://api.mercadolibre.com/items/${parentId}`)
  .then((response) => response.json())
  .then((jsonObj) => olPathInicial.appendChild(createCartItemElement(jsonObj)))
  .then(() => localStorageUpdate())
  .then(() => createTitleTotalPrice());
}

function addListener() {
  const arrayButtons = document.querySelectorAll('.item__add');
  arrayButtons.forEach((button) => button.addEventListener('click', fetchId));
}

async function createElement(promise) {
  const resultado = await promise.then((result) => result);
  const fatherElement = document.querySelector('.items');
  resultado.forEach((item) => fatherElement.appendChild(createProductItemElement(item)));
  addListener();
}
// *-- 4 --*
const getLocalStorage = () => {
  olPathInicial.innerHTML += localStorage.getItem('olInfo');
};

window.onload = () => {
  createElement(fetchApi(url));
  getLocalStorage();
};
