async function apiCall(url, auth, authTipe, methodType) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "PHPSESSID=4lqf2uaojvmavdinfdg0gd4dob");
    if (authTipe == 'login') {
        var raw = JSON.stringify(auth);
        var requestOptions = {
            method: methodType,
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
    }
    if (authTipe == 'token') {
        myHeaders.append("Authorization", "Bearer " + auth.replace(/['"]+/g, ''));
        var requestOptions = {
            method: methodType,
            headers: myHeaders,
            redirect: 'follow'

        };
    }

    return fetch(url, requestOptions)
        .then(response => {
            return response.text().then((result) => {
                    return result;
                })
                .catch(error => console.log('error', error));
        })


}


function loginToken(username, password) {
    let credentiale = {
        'username': username,
        'password': password
    }
    let url = 'https://magento-demo.tk/rest/V1/integration/admin/token';
    let verificare = sessionStorage.getItem('token');
    if (!verificare || verificare === 'undefiend') {
        let interval = setInterval(() => {
            let token;

            apiCall(url, credentiale, 'login', 'POST').then(result => {
                token = result;
                sessionStorage.setItem('token', token);
            });
            if (sessionStorage.getItem('token')) {
                clearInterval(interval);
                // pun element style dispaly none pe loader 
            }
        }, 1000);
    }
}
loginToken('integrare', 'admin123');
document.addEventListener('DOMContentLoaded', function(event) {
    let intervalcategorii = setInterval(function() {
        if (sessionStorage.getItem('token')) {
            //tot cu display none;
            getCategorii().then(randareHTML());
            console.log('test');
            clearInterval(intervalcategorii);
        }
    }, 500);
    async function getCategorii() {
        let token = sessionStorage.getItem('token');
        let url = 'https://magento-demo.tk/rest/V1/categories/list?searchCriteria[filterGroups][0][filters][0][field]=parent_id&searchCriteria[filterGroups][0][filters][0][value]=41&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&fields=items[id,parent_id,name,image,custom_attributes[image]]';
        await apiCall(url, token.replace(/"/g, ''), 'token', 'GET').then(result => {
            sessionStorage.setItem('categorii', result);
            return result;
        });

    }

    function randareHTML() {
        let categorii = JSON.parse(sessionStorage.getItem('categorii'));
        if (categorii) {
            for (const [key, value] of Object.entries(categorii.items)) {
                let meniu = document.createElement('li')
                meniu.innerText = value.name;
                document.querySelector("ul.menu").appendChild(meniu);
                //fac html
            }
        }
    }

})