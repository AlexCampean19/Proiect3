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
                document.querySelector("#loader").style.display = "none";
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
            getProduse().then(randareHTMLProduse());
            console.log('test');
            clearInterval(intervalcategorii);
            document.querySelector("#loader").style.display = "none";
            document.querySelector('body').classList.remove('noscroll');
        }
    }, 500);

    async function getCategorii() {
        let token = sessionStorage.getItem('token');
        let url = 'https://magento-demo.tk/rest/V1/categories/list?searchCriteria[filterGroups][0][filters][0][field]=parent_id&searchCriteria[filterGroups][0][filters][0][value]=41&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&fields=items[id,parent_id,name,image,custom_attributes[image]]';
        if (!sessionStorage.getItem('categorii')) {
            await apiCall(url, token.replace(/"/g, ''), 'token', 'GET').then(result => {
                sessionStorage.setItem('categorii', result);
                let categorySku = window.location.search ? window.location.search.replace('?sku', '') : '7182697302&';
                randareHTML(categorySku);
                randareHtmlSlider();
                return result;
            });
        };
    };

    function randareHTML() {
        let categorii = JSON.parse(sessionStorage.getItem('categorii'));
        if (categorii) {
            for (const [key, value] of Object.entries(categorii.items)) {
                let meniu = document.createElement('li');
                document.querySelector("ul.menu .partea1").appendChild(meniu);
                let link = document.createElement('a');
                link.setAttribute('href', '?category_id=' + value.id);
                meniu.appendChild(link);
                link.innerText = value.name;
            }
        }
    }



    async function getProduse() {
        let token = sessionStorage.getItem('token');
        let url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]=7182697302&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes]';
        if (!sessionStorage.getItem('produse')) {
            await apiCall(url, token.replace(/"/g, ''), 'token', 'GET').then(result => {
                sessionStorage.setItem('produse', result);
                randareHTMLProduse();
                return result;
            });
        };
    };

    async function randareHTMLProduse() {
        let produse = JSON.parse(sessionStorage.getItem('produse'));
        let categorySku = window.location.search ? window.location.search.replace('?sku=', '') : '';
        console.log(categorySku);
        if (categorySku) {
            let token = sessionStorage.getItem('token');
            let url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]=' + categorySku + '&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes]';
            await apiCall(url, token.replace(/"/g, ''), 'token', 'GET').then(result => {
                console.log(result.items);
                for (const [key, value] of Object.entries(JSON.parse(result).items)) {
                    let template = ' <div class="buc1"><img src="https://magento-demo.tk/media/catalog/product/' + value.media_gallery_entries[0].file + '"/></div><div class="buc2"><h1>' + value.name + '</h1> <div class="rating"><div class="stele"><p class="unu"><span>stea</span></p><p class="doi"><span>stea</span></p><p>(49)</p></div><div class="preturi2"><p>$' + value.price + '</p></div></div><p class="detaliu">' + value.detail + '</p><h4>Quantity</h4><div class="but2"><div class="butoane"><button type="button" class="minus"><span>minus</span></button><input class="numere-cantiate" type="number" name="quantity" value="1"><button type="button" class="plus"> <span>plus</span></button></div><a href="/" class="salemb"><span>Add to cart </span></a></div></div>';
                    document.querySelector(".bucati").innerHTML += template;
                }
            });
        } else {
            if (produse) {
                for (const [key, value] of Object.entries(produse.items)) {
                    console.log(value.custom_attributes.filter(x => x.attribute_name == 'sku'));
                    let template = '<div class="buc1"><img src="https://magento-demo.tk/media/catalog/product/' + value.media_gallery_entries[0].file + '"/></div><div class="buc2"><h1>' + value.name + '</h1> <div class="rating"><div class="stele"><p class="unu"><span>stea</span></p><p class="doi"><span>stea</span></p><p>(49)</p></div><div class="preturi2"><p>$' + value.price + '</p></div></div><p class="detaliu">' + value.detail + '</p><h4>Quantity</h4><div class="but2"><div class="butoane"><button type="button" class="minus"><span>minus</span></button><input class="numere-cantiate" type="number" name="quantity" value="1"><button type="button" class="plus"> <span>plus</span></button></div><a href="/" class="salemb"><span>Add to cart </span></a></div></div>';
                    document.querySelector(".bucati").innerHTML += template;

                }
            }
        }
    }

})