import items from "./items.json" assert {type: 'json'};
import {getPrice,getTotal,addElementToCart} from "./utils.js";
import {addToCart,totalDiv,cart,icon,tray,iconNum} from "./elements.js"

let addToCartFlag = false;
 cart.innerHTML = localStorage.getItem("cart") || '';

let total = 0
iconNum.textContent = localStorage.getItem('iconNum') || ''

//Map of numbers of the colors added to the colors
const colorsToNum = new Map();

colorsToNum.set("Red", 0);
colorsToNum.set("Yellow", 0);
colorsToNum.set("Blue", 0);
colorsToNum.set("Orange", 0);
colorsToNum.set("Green", 0);
colorsToNum.set("Purple", 0);
colorsToNum.set("Light Gray", 0);
colorsToNum.set("Dark Gray", 0);


if(localStorage.getItem('addToCartFlag') === 'false' || localStorage.getItem('addToCartFlag') === null) {
  icon.classList.add('invisible')
  tray.classList.add('invisible')
  localStorage.setItem('icon', 'invisible')
  localStorage.setItem('tray', 'invisible')
  localStorage.colorsToNum = JSON.stringify(Array.from(colorsToNum.entries()));
  localStorage.setItem("total", total);
  
}
totalDiv.innerHTML = `$${parseInt(localStorage.getItem("total"))}`;
addToCart.forEach(element => {
  element.addEventListener("click", e => {
    addToCartFlag = true;
    localStorage.setItem('addToCartFlag', addToCartFlag)
    icon.classList.remove("invisible")
    tray.classList.remove("invisible")
    localStorage.removeItem('icon',"invisible")
    localStorage.removeItem('tray',"invisible")

    let color = element.closest('div').children[0].children[1].textContent.trim()
    let price = parseInt(element.closest('div').children[0].children[2].textContent.replace("$", ""))
    let map = new Map(JSON.parse(localStorage.colorsToNum));
    let numberOfColor = map.get(color) + 1

    map.set(color,numberOfColor)
    localStorage.colorsToNum = JSON.stringify(Array.from(map.entries()));

    addElementToCart(color,price, (new Map(JSON.parse(localStorage.colorsToNum))).get(color))
    let totalAdd = getTotal(element)
    localStorage.setItem('total', totalAdd);
    localStorage.setItem('totalDiv', totalAdd);
    totalDiv.innerHTML = `$${totalAdd}`;
  });
});

cart.addEventListener("click", e => {
  e.preventDefault()

  localStorage.setItem('deleted', false);

  cart.childNodes.forEach(element =>{

    if (e.target.textContent === "×" && localStorage.getItem('deleted') === "false") {
      let parentElement = e.target.parentElement.parentElement
      let elementColorToDelete = (parentElement.children[1].children[0].children[0].textContent).trim()
      let getTotalFromLocalStorage = localStorage.getItem('total');
      getTotalFromLocalStorage = parseInt(localStorage.getItem('total')) - getPrice(elementColorToDelete, new Map(JSON.parse(localStorage.colorsToNum)).get(elementColorToDelete))
      localStorage.setItem('total', getTotalFromLocalStorage);

      let map = new Map(JSON.parse(localStorage.colorsToNum));
      
      map.set(elementColorToDelete,0)
      localStorage.colorsToNum = JSON.stringify(Array.from(map.entries()));
      if( parseInt(localStorage.getItem('total')) === 0) {
        addToCartFlag = false;
        localStorage.setItem('addToCartFlag', addToCartFlag)
        icon.classList.add("invisible")
        tray.classList.add("invisible")
        localStorage.setItem('icon', "invisible")
        localStorage.setItem('tray', "invisible")
        cart.innerHTML = ''
        localStorage.setItem('cart', cart.innerHTML)
      }
      localStorage.setItem('totalDiv', total)
      totalDiv.innerHTML = `$${localStorage.getItem("total")}`;
      parentElement.remove();
      localStorage.setItem('cart', cart.innerHTML)
      iconNum.textContent --;
      localStorage.setItem('iconNum', iconNum.textContent)
      localStorage.setItem('deleted', true);
    }
  })
})


