// Update the count down every 1 second
let x = setInterval(function() {

    // Get required section
    let orderTables = document.getElementsByClassName("orderNum");
    let timeStamp = parseInt(document.getElementById("discountTime").innerHTML)

    for (let i = 0; i < orderTables.length; i++) {
        let tds = orderTables[i].getElementsByTagName("td")
        let orderTime;
        let timeRemaining;

        for (let j = 0; j < tds.length; j++) {
            if (tds[j].className == "updateTime") {
                orderTime = new Date(tds[j].innerHTML)

            }
            if (tds[j].className == "time") {
                timeRemaining = tds[j]
            }
        }
        let countDownDate = new Date(orderTime.getTime() + timeStamp * 60 * 1000)

        // Get today's date and time
        let now = new Date().getTime();


        // Find the distance between now and the count down date
        let distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="timeRemaining"
        timeRemaining.innerHTML = minutes + "m " + seconds + "s ";
        // If the count down is over, write some text
        if (distance < 0) {
            // udpate message
            timeRemaining.innerHTML = "20% off awarded !"
        }
    }

}, 1000);

// Send fulfill order message to server
preparingOrders = document.querySelectorAll('.preparingOrder');
for (let i = 0; i < preparingOrders.length; i++) {
    let fulfillbtn = preparingOrders[i].querySelector('#fulfilled')
    let orderId = preparingOrders[i].querySelector('.orderId').innerHTML
    fulfillbtn.addEventListener('click', function() {

        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 'orderId': orderId }),
            redirect: 'follow'
        }
        try {
            posturl = window.location.href + '/fulfill-order'
            url = window.location.href
            fetch(posturl, options).then(res => {
                if (res.redirected) {
                    window.location.href = url
                }
            })
        } catch (err) {
            console.log(err)
        }
    })
}

// Send complete order message to server
fulfilledOrders = document.querySelectorAll('.fulfilledOrder');
for (let i = 0; i < fulfilledOrders.length; i++) {
    let pickedupbtn = fulfilledOrders[i].querySelector('#pickedup')
    let orderId = fulfilledOrders[i].querySelector('.orderId').innerHTML
    pickedupbtn.addEventListener('click', function() {
        console.log(orderId)
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 'orderId': orderId }),
            redirect: 'follow'
        }
        try {
            posturl = window.location.href + '/complete-order'
            url = window.location.href
            fetch(posturl, options).then(res => {
                if (res.redirected) {
                    window.location.href = url
                }
            })
        } catch (err) {
            console.log(err)
        }
    })

}

// Change the HTML representation of order detail
orderDetail = document.querySelectorAll('.orderDetail');
for (let i = 0; i < orderDetail.length; i++) {
    let tds = orderDetail[i].getElementsByClassName('detail');
    let foods;
    let details;

    for (let j = 0; j < tds.length; j++) {
        if (tds[j].className == "detail") {
            foods = JSON.parse(tds[j].innerHTML);
            details = tds[j];
        }
    }
    details.innerHTML = ``;
    for (let j = 0; j < foods.length; j++) {
        details.innerHTML += `
                        <span>${foods[j].quantity}</span>
                        <span>${foods[j].foodName}</span>
                        <br>
                         `

    }
}

// Show the preparing order list if pressed preparing button 
function preparingButton() {
    document.getElementById('fulfilledButton').style.background = "none";
    document.getElementById('preparingButton').style.background = "#DBCAC2";
    document.getElementById('preparingOrders').style.display = "flex";
    document.getElementById('fulfilledOrders').style.display = "none";

}

// Show the fulfilled order list if pressed fullfilled button
function fulfilledButton() {
    document.getElementById('preparingButton').style.background = "none";
    document.getElementById('fulfilledButton').style.background = "#DBCAC2";
    document.getElementById('preparingOrders').style.display = "none";
    document.getElementById('fulfilledOrders').style.display = "flex";
}

//Hide orderDetail
let orders = document.querySelectorAll('.oneOrder')

for (let i = 0; i < orders.length; i++) {
    let orderDetail = orders[i].querySelector("#orderDetail");
    let hidebtn = orders[i].querySelector("#hidebtn")
    hidebtn.addEventListener('click', function() {
        if (orderDetail.style.display === "none") {
            orderDetail.style.display = "block";
            hidebtn.innerHTML = "Hide";
        } else {
            orderDetail.style.display = "none";
            hidebtn.innerHTML = "Show";
        }
    })
}