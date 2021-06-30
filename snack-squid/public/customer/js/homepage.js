let infoContainer = document.querySelector(".Info");

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            let c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function checkUserInfo(){
    let givenName = getCookie('givenName')
    let familyName = getCookie('familyName')
    if (givenName != '' && familyName != ''){
        console.log('1')
        infoContainer.innerHTML += `
            <div className="icon"></div>
            <h1>Snack Squid</h1>
            <h1>Name</h1>
            <br><a className='findvan'>Find a nearby van <i className="fas fa-map-marked-alt"></i> </a>
        `
    } else {
        console.log(2)
        infoContainer.innerHTML += `
            <div className="icon"></div>
            <h1>Snack Squid</h1>
            <a className='login' href="/customer/login">Login</a>
            <br><br>
            <a className='signup' href="/customer/signup">Sign up</a>
            <br><a className='findvan'>Find a nearby van <i className="fas fa-map-marked-alt"></i> </a>
        `
    }
}

//checkUserInfo()