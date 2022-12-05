import items from "./items.json" assert {type: 'json'};
import {cart,iconNum} from "./elements.js"

export function getPrice(color, num) {
  let price;
  items.forEach(element => {
    if (element["name"] === color.trim()) {
      price = element["priceCents"] / 100;
    }
  });
  return price > 1 ? price * num : price;
}

export function getImageColor(color) {
  let colorCode;
  items.forEach(element => {
    if (element["name"] === color.trim()) {
      colorCode = element["imageColor"];
    }
  });
  return colorCode;
}

export function getTotal(element) {
  let totalLocalStorage = parseInt(localStorage.getItem("total"));
  totalLocalStorage =
    totalLocalStorage +
    parseInt(
      element.previousElementSibling
        .querySelector("p")
        .textContent.replace("$", "")
        .trim()
    );
  return totalLocalStorage;
}

export function addElementToCart(color, price, num) {
  if (num > 1) {
    cart.childNodes.forEach(element => {
      let colorInCart = element.children[1].children[0].children[0].textContent.trim();
      if (colorInCart === color) {
        element.children[1].children[0].children[1].textContent = `${num}x`;
      }
    });
  } else {
    let url = `https://dummyimage.com/210x130/${getImageColor(
      color
    )}/${getImageColor(color)}`;
    let el = `<div class="mb-6">
      <div class="block relative h-24 rounded overflow-hidden">
        <img alt="ecommerce" class="object-cover object-center w-full h-full block rounded" src=${url}>
        <button data-remove-from-cart-button class="absolute top-0 right-0 bg-black rounded-tr text-white w-6 h-6 text-lg flex justify-center items-center">&times;</button>
      </div>
      <div class="mt-2 flex justify-between">
        <div class="flex items-center title-font">
          <h2 class="text-gray-900 text-lg font-medium">
            ${color.trim()}
          </h2>
          <span class="text-gray-600 text-sm font-bold ml-1">${num}x</span>
        </div>
        <div>$${price}</div>
      </div>
  </div>`;
    cart.innerHTML += el;
    iconNum.textContent++;
    localStorage.setItem("iconNum", iconNum.textContent);
    localStorage.setItem("cart", cart.innerHTML);
  }
}
