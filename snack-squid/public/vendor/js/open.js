function geoFindMe() {

    function success(position) {
        const latitude = position.coords.latitude.toFixed(4);
        const longitude = position.coords.longitude.toFixed(4);
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'latitude': latitude,
                'longitude': longitude
            }),
            redirect: 'follow'
        }
        try {
            url = window.location.href
            fetch(url, options).then(res => {
                if (res.redirected) {
                    window.location.href = "/vendor/order"
                }
            })
        } catch (err) {
            console.log(err)
        }

    }

    function error() {
        alert('Unable to retrieve your location');
    }

    if (!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
    } else {
        console.log('Locating…');
        navigator.geolocation.getCurrentPosition(success, error);
    }

}

document.querySelector('#changeLocation').addEventListener('click', geoFindMe);