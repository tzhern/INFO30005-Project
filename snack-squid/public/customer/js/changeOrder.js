let foodListings = document.querySelectorAll('.foodListing')
let foods = []
let addCarts = []
let removeCarts = []
let quantitySelectors = []

// load data from old order everytime users refresh the page
let oldFoods = document.getElementById('changeorder').innerHTML;
localStorage.setItem('inCart', oldFoods);
oldFoods = JSON.parse(oldFoods)
let cartNumbers = 0;
let cartCost = 0
for (let i=0; i < oldFoods.length; i++) {
    cartNumbers += oldFoods[i].quantity;
    cartCost += oldFoods[i].quantity * oldFoods[i].price
    let foodName = foodListings[i].querySelector('.foodName').innerHTML;
    if (oldFoods[i].foodName == foodName){
        foodListings[i].querySelector('.quantity').innerHTML = oldFoods[i].quantity;
    }
}
cartNumbers = cartNumbers.toString();
localStorage.setItem('cartNumbers', cartNumbers);
document.getElementById("basket_span").innerHTML = cartNumbers;
cartCost = cartCost.toString();
localStorage.setItem('cartCost', cartCost);

for (let i = 0; i < foodListings.length; i++) {
    let foodName = foodListings[i].querySelector('.foodName').innerHTML
    let foodPrice = parseInt(foodListings[i].querySelector('.foodPrice').innerHTML.charAt(1))
    let quantitySelector = foodListings[i].querySelector('.quantity')
    let food = {
        foodName: foodName,
        price: foodPrice,
        quantity: 0
    }
    for (let j=0; j < oldFoods.length; j++){
        if (oldFoods[j].foodName == food.foodName){
            food.quantity = oldFoods[j].quantity;
            quantitySelector.innerHTML = food.quantity;
        }
    }
    foods.push(food)

    quantitySelectors.push(quantitySelector)

    let addCart = foodListings[i].querySelector('.addCart')
    addCarts.push(addCart)
    let removeCart = foodListings[i].querySelector('.removeCart')
    removeCarts.push(removeCart)
}



// food quantity + 1 in localStorage
function setAddItems(food, quantitySelector) {
    let cartItems = localStorage.getItem('inCart');
    cartItems = JSON.parse(cartItems);
    if (cartItems != null) {
        let flag = 0;
        for (let i = 0; i < cartItems.length; i++) {
            if (cartItems[i]["foodName"] == food.foodName) {
                cartItems[i]["quantity"] += 1;
                quantitySelector.innerHTML = cartItems[i]['quantity']
                flag = 1;
            }
        }
        if (flag == 0) {
            food.quantity = 1;
            quantitySelector.innerHTML = food.quantity
            cartItems.push(food)
        }
    } else {
        food.quantity = 1;
        quantitySelector.innerHTML = food.quantity
        cartItems = [
            food
        ]
    }
    localStorage.setItem("inCart", JSON.stringify(cartItems));
}

// food quantity - 1 in localStorage
function setRemoveItems(food, quantitySelector) {
    let cartItems = localStorage.getItem('inCart');
    cartItems = JSON.parse(cartItems);
    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i]["foodName"] == food.foodName) {
            if (cartItems != null) {
                if (cartItems[i]["quantity"] > 0) {
                    cartItems[i]["quantity"] -= 1;
                }
                quantitySelector.innerHTML = cartItems[i]["quantity"]
            }
            if (cartItems[i]["quantity"] == 0) {
                cartItems.splice(i, 1);
                //delete cartItems[i];
                quantitySelector.innerHTML = 0
            }
        }
    }
    localStorage.setItem("inCart", JSON.stringify(cartItems));
}

function updateCartNumbers() {
    let cartItems = localStorage.getItem('inCart');
    cartItems = JSON.parse(cartItems);
    let cartNumbers = 0
    for (let i = 0; i < cartItems.length; i++) {
        cartNumbers += cartItems[i].quantity;
    }
    localStorage.setItem('cartNumbers', cartNumbers);
    document.getElementById("basket_span").innerHTML = cartNumbers;
}

function updateTotalCost() {
    let cartItems = localStorage.getItem('inCart');
    cartItems = JSON.parse(cartItems);
    let cartCost = 0;
    for (let i = 0; i < cartItems.length; i++) {
        let cost = cartItems[i].price * cartItems[i].quantity;
        cartCost += cost;
    }
    localStorage.setItem('cartCost', cartCost);
}

// when "+" is clicked, do everything required
for (let i = 0; i < addCarts.length; i++) {
    addCarts[i].addEventListener('click', () => {
        setAddItems(foods[i], quantitySelectors[i])
        updateCartNumbers();
        updateTotalCost();
        displayCart();
    })
}

// when "-" is clicked, do everything required
for (let i = 0; i < removeCarts.length; i++) {
    removeCarts[i].addEventListener('click', () => {
        setRemoveItems(foods[i], quantitySelectors[i]);
        updateCartNumbers();
        updateTotalCost();
        displayCart();
    })
}

// display cart
function displayCart() {
    let cartItems = localStorage.getItem("inCart");
    cartItems = JSON.parse(cartItems);
    let foodContainer = document.querySelector(".products-container");
    let cartCost = localStorage.getItem('totalCost');

    if (cartItems && foodContainer) {
        foodContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            foodContainer.innerHTML += `
                <div class="overlayfood">
                    <ion-icon name="close-circle"></ion-icon>
                    <span>${item.foodName}</span>
                </div>
                <div class="overlayquantity">${item.quantity}
                    <ion-icon class="decrease" name="arrow-dropright-circle"></ion-icon>
                </div>
                <div class="overlaytotal">
                    $${item.price * item.quantity},00
                </div>
                <div class="line"></div>
                `;

        });
        // <img src="../images/${item.foodName}.jpg">


        foodContainer.innerHTML += `
            <div class="basketTotalContainer">
                <span class="basketTotalTitle">
                    Basket Total
                </span>
                <span class="basketTotal">
                    $${localStorage.getItem('cartCost')},00
                </span>
                <br>
                <button id="checkout" onclick="changeOrder()">Change Order</button>
            </div>
        `;
    }
}

function changeOrder() {
    let cartItems = localStorage.getItem('inCart');
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: cartItems,
        redirect: 'follow'
    };
    try {
        let url = window.location.href + "/change-order"
        console.log(url)
        fetch(url, options)
            .then(res => {
                if (res.redirected) {
                    localStorage.removeItem('inCart');
                    localStorage.removeItem('totalCost');
                    localStorage.removeItem('cartNumbers');
                    localStorage.setItem('cartCost', '0');
                    window.alert("Order changed successfully!")
                    window.location.href = res.url;
                }
            });
    } catch (err) {
        //pass
    }
}

function on() {
    displayCart();
    let width = window.innerWidth;
    if (width > 650) {
        document.getElementById("overlay").style.width = "50%";
    } else {
        document.getElementById("overlay").style.width = "100%";
    }
}

function off() {
    document.getElementById("overlay").style.width = "0%";
}