import items from "./items.json" assert {type: 'json'};
let addToCart = document.querySelectorAll(".text-xl");
let totalDiv = document.querySelector(".flex.justify-between.items-end.border-t.p-4").children[1]
let cart = document.querySelector(".overflow-y-auto.px-4.pt-4")
let icon = document.querySelector(".fixed.top-0.right-0.mr-4.mt-4.w-12.bg-blue-500.p-2.rounded-full.text-white")
let tray = document.querySelector(".bg-white.text-gray-700.body-font.shadow-lg.border.rounded-lg.flex.flex-col")
let iconNum = document.querySelector(".bg-red-500.rounded-full.text-xs.absolute.w-6.h-6.flex.justify-center.items-center.right-0.bottom-0.transform.translate-x-2.translate-y-2")
//let localStorage = document.querySelector(".mb-4.top-0.right-0.mr-4.mt-20.fixed")
//let template = document.createElement('template');
let addToCartFlag = false;
 cart.innerHTML = localStorage.getItem("cart") || '';
// icon.classList.add(localStorage.getItem("icon"));

let total = 0
//localStorage.setItem('total', 0)
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
// if (localStorage.getItem('colorsToNum') === undefined) {
//   localStorage.colorsToNum = JSON.stringify(Array.from(colorsToNum.entries()));
// }

if(localStorage.getItem('addToCartFlag') === 'false' || localStorage.getItem('addToCartFlag') === null) {
  icon.classList.add('invisible')
  tray.classList.add('invisible')
  localStorage.setItem('icon', 'invisible')
  localStorage.setItem('tray', 'invisible')
  localStorage.colorsToNum = JSON.stringify(Array.from(colorsToNum.entries()));
  localStorage.setItem("total", total);
  
  //localStorage.setItem('totalDiv', total);
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
    console.log("map is " , new Map(JSON.parse(localStorage.colorsToNum)))
    let map = new Map(JSON.parse(localStorage.colorsToNum));
    //localStorage.colorsToNum = JSON.stringify(Array.from(colorsToNum.entries()));
    let numberOfColor = map.get(color) + 1
    map.set(color,numberOfColor)
    localStorage.colorsToNum = JSON.stringify(Array.from(map.entries()));

    addElementToCart(color,price, (new Map(JSON.parse(localStorage.colorsToNum))).get(color))
    let totalAdd = getTotal(element)
    localStorage.setItem('total', totalAdd);
    localStorage.setItem('totalDiv', totalAdd);
    totalDiv.innerHTML = `$${totalAdd}`;
    console.log("get total from local storage inside add to cart", localStorage.getItem('total'))
  });
});

cart.addEventListener("click", e => {
  e.preventDefault()

  localStorage.setItem('deleted', false);

  console.log("get total from local storage inside cart", localStorage.getItem('total'))
  cart.childNodes.forEach(element =>{

    if (e.target.textContent === "×" && localStorage.getItem('deleted') === "false") {
      let parentElement = e.target.parentElement.parentElement
      console.log("parent element inside if ", parentElement)
      let elementColorToDelete = (parentElement.children[1].children[0].children[0].textContent).trim()
      
      console.log('total before is ', localStorage.getItem('total'));
      let getTotalFromLocalStorage = localStorage.getItem('total');
      getTotalFromLocalStorage = parseInt(localStorage.getItem('total')) - getPrice(elementColorToDelete, new Map(JSON.parse(localStorage.colorsToNum)).get(elementColorToDelete))
      localStorage.setItem('total', getTotalFromLocalStorage);
      console.log("total after is ", localStorage.getItem('total'));
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
        //localStorage.setItem('total', total);
        console.log("inside total is equal zero")
      }
      localStorage.setItem('totalDiv', total)
      totalDiv.innerHTML = `$${localStorage.getItem("total")}`;
      console.log('parent element ', parentElement)
      parentElement.remove();
      localStorage.setItem('cart', cart.innerHTML)
      iconNum.textContent --;
      localStorage.setItem('iconNum', iconNum.textContent)
      //deleted = true;
      localStorage.setItem('deleted', true);
   //   console.log("local storage deleted is ", localStorage.getItem("deleted"))
   //   console.log("local storage deleted is ", typeof localStorage.getItem("deleted"));
    }
  })
})

function getPrice (color, num) {
  console.log("color is ", color, " num is ", num)
  let price;
  items.forEach(element =>
    {
      if(element["name"] === color.trim()) {
         price = (element["priceCents"]/100);
    }
  })
  console.log('get price is ', price > 1 ? price * num : price)
  return price > 1 ? price * num : price ;
}

function getImageColor(color){
  let colorCode;
  items.forEach(element => {
    if(element["name"] === color.trim()){
      colorCode = element["imageColor"]
    }
  })
  return colorCode;
}

function getTotal(element) {
  let totalLocalStorage = parseInt(localStorage.getItem("total"));
  totalLocalStorage = totalLocalStorage +  parseInt(
    element.previousElementSibling
      .querySelector("p")
      .textContent.replace("$", "")
      .trim()
  );
  return totalLocalStorage;
}

function addElementToCart(color, price, num) {
  //console.log("color " +  color + " price " +  price + " num " + num)
  if(num > 1) {
    cart.childNodes.forEach(element => {
        let colorInCart = element.children[1].children[0].children[0].textContent.trim();
        console.log("color in Cart is ", colorInCart)
        if(colorInCart === color) {
          console.log("in the if inside deep")
          element.children[1].children[0].children[1].textContent = `${num}x`
        }
    })

  }
  else {
    //console.log("num in the else is " , num)
    let url = `https://dummyimage.com/210x130/${getImageColor(color)}/${getImageColor(color)}`
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
  </div>`
    cart.innerHTML += el
    iconNum.textContent ++;
    localStorage.setItem('iconNum', iconNum.textContent)
    //template.innerHTML = cart.innerHTML
    localStorage.setItem('cart', cart.innerHTML)
  }
}

