function loginToken(username, password) {
    let credentiale = {
        'username': username,
        'password': password
    }
    let url = 'https://magento-demo.tk/rest/V1/integration/admin/token';
    let verificare = sessionStorage.getItem('token');
    if (!verificare || verificare === 'undefined') {
        let interval = setInterval(() => {
            jQuery.ajax({
                method: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: url,
                data: JSON.stringify(credentiale),

            }).done(function(response) {
                sessionStorage.setItem("token", response);
            });

            if (sessionStorage.getItem('token')) {
                clearInterval(interval);

            }
        }, 1000);
    } else {
        jQuery("body").trigger("Token");
    }
}

function getCategorii() {
    let token = sessionStorage.getItem('token');
    let url = 'https://magento-demo.tk/rest/V1/categories/list?searchCriteria[filterGroups][0][filters][0][field]=parent_id&searchCriteria[filterGroups][0][filters][0][value]=41&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&fields=items[id,parent_id,name,image,custom_attributes[image]]';
    if (!sessionStorage.getItem('categorii')) {
        jQuery.ajax({
                method: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: url,
                headers: { "Authorization": "Bearer " + token }
            })
            .done(function(response) {
                sessionStorage.setItem("categorii", JSON.stringify(response.items))
            })
            .fail(function(response) {
                console.log(response);
            })
    } else {
        let categoryId = window.location.search ? window.location.search.replace('?category_id=', '') : '41';
        randareHTMLMenu(categoryId);
    }
};

function getProduse() {
    let token = sessionStorage.getItem('token');
    let url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=41&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes[short_description,ingredients,health_benefits,nutrition_information]]';
    if (!sessionStorage.getItem('produse')) {
        jQuery.ajax({
                method: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: url,
                headers: { "Authorization": "Bearer " + token }
            }).done(function(response) {
                sessionStorage.setItem("produse", JSON.stringify(response.items))
            })
            .fail(function(response) {
                console.log(response);
            })
    };
};


function randareHTMLMenu() {
    let categorii = JSON.parse(sessionStorage.getItem('categorii'));
    if (categorii && jQuery('ul.menu .partea1').children().length < 1) {
        for (const [key, value] of Object.entries(categorii)) {
            let meniu = jQuery('<li>')
            jQuery("ul.menu .partea1").append(meniu);
            let link = jQuery('<a>');
            jQuery(link).attr('href', 'index.html?category_id=' + value.id).text(value.name);
            jQuery(meniu).append(link);
        }
    }
}
jQuery(document).ready(function() {
    loginToken('integrare', 'admin123');
    let intervalcategorii = setInterval(function() {
        if (sessionStorage.getItem('token')) {
            if (!sessionStorage.getItem('produse') && !sessionStorage.getItem('categorii')) {
                getCategorii();
                getProduse();
            } else {
                jQuery(document).trigger("Loader");
                jQuery("#laoder").css('display', 'none');
                jQuery('body').removeClass('noscroll');
                clearInterval(intervalcategorii);
            }
        }
    }, 500)

})

function createCart() {
    let verificareCart = sessionStorage.getItem('cartId');
    if (!verificareCart || verificareCart === "undefined" || verificareCart === 'null') {
        let interval = setInterval(() => {
            if (sessionStorage.getItem('cartId')) {
                clearInterval(interval);
            }
            jQuery.ajax({
                method: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: 'https://magento-demo.tk/rest/V1/guest-carts'
            }).done(function(response) {
                sessionStorage.setItem('cartId', response)
                cartId();
            }).fail(function(response) {
                console.log(response);
            });

        }, 1000)

    }
}





function cartId() {
    jQuery.ajax({
        method: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: 'https://magento-demo.tk/rest/V1/guest-carts/' + sessionStorage.getItem('cartId')
    }).done(function(response) {
        sessionStorage.setItem('quoteId', response.id);
        console.log(response)
    }).fail(function(response) {
        console.log(response);
    })
}


function addCart(target) {
    let payload = '';

    if (target.closest('.card1').length > 0) {

        payload = JSON.stringify({
            "cartItem": {
                "sku": target.closest('.card1').attr('data-sku'),
                "qty": document.querySelector(".numere-cantiate").value,
                "quote_id": sessionStorage.getItem('quoteId'),
            }
        })
    } else {
        payload = JSON.stringify({
            "cartItem": {
                "sku": jQuery('.but2 a span').attr('data-sku'),
                "qty": document.querySelector(".numere-cantiate").value,
                "quote_id": sessionStorage.getItem('quoteId'),
            }
        })

    }
    console.log(payload)
    jQuery.ajax({
        method: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: 'https://magento-demo.tk/rest/V1/guest-carts/' + sessionStorage.getItem('cartId') + '/items',
        data: payload
    }).done(function(response) {
        console.log(response)
        console.log(response.sku)
        console.log(response.length)
        console.log(jQuery('.itmshop').length)
        jQuery('#nrprod').addClass('numarcumparaturi').text(jQuery('.cumparaturi').length)
        let url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]=' + response.sku + '&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes]';
        let template1 = ''
        let token = sessionStorage.getItem('token')
        jQuery.ajax({
            method: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: url,
            headers: { "Authorization": "Bearer " + token }
        }).done(function(result) {
            console.log(result.items)
            console.log(result.items.length)
            console.log(jQuery('.cumparaturi').length)
            jQuery('.itmcart').text(result.length);
            jQuery('.subtotal').text(response.qty * response.price + "$")

            for (const [key, value] of Object.entries(result.items)) {
                template1 += '<div class="cumparaturi"><img id="imgsh" src="https://magento-demo.tk/media/catalog/product/' + value.media_gallery_entries[0].file + '"/><div class="detfruct"><p class="numeFruct">' + response.name + '</p><p id="quantyy">Qty:</p><input class="valuequanty" value="' + response.qty + '"><div class=pricebut"><p class="price" value="' + response.price + '">Price:' + response.price + '$</p><button class="delitm">X</button></div></div></div>'
            }
            jQuery('.itmshop').append(template1)
        }).fail(function(response) {
            console.log(response)
        })



        // incarc in cart sau apelez randare cart
        //apelez metoda randare cart
        //trimit result parametru randare cart
        //metoda separata get card si cand se incarca pagina fca get card

    }).fail(function(response) {
        console.log(response)
    })

}


function randareCart(result) {
    let template1 = '';
    let token = sessionStorage.getItem('token')
    jQuery('.subtotal').text("Subtotal:" + result.qty * result.price + "$")
    console.log(result)
    for (const [key, value] of Object.entries(result)) {
        let url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]=' + value.sku + '&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes]';
        jQuery.ajax({
            method: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: url,
            headers: { "Authorization": "Bearer " + token }
        }).done(function(response) {
            console.log(response)
            template1 += '<div class="cumparaturi"><img id="imgsh" src="https://magento-demo.tk/media/catalog/product/' + response.picture + '"/><div class="detfruct"><p class="numeFruct">' + value.name + '</p><p id="quantyy">Qty:</p><input class="valuequanty" value="' + value.qty + '"><div class=pricebut"><p class="price" value="' + value.price + '">Price:' + value.price + '$</p><button class="delitm">X</button></div></div></div>'
            jQuery('.itmshop').append(template1)
        }).fail(function(response) {
            console.log(response)
        })
    }


}

function deleteItm() {
    let cartid = sessionStorage.getItem('quoteId');
    let itmid = sessionStorage.getItem('itmid');
    let token = sessionStorage.getItem('token')
    jQuery.ajax({
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: 'https://magento-demo.tk/pub/rest/default/V1/carts/' + cartid + '/items/' + itmid + '',
        data: JSON.stringify({
            "cartItem": {
                "item_id": itmid,
                "sku": "string",
                "qty": 3,
                "name": "string",
                "price": 0,
                "product_type": "string",
                "quote_id": "string",
                "product_option": {},
                "extension_attributes": {}
            }

        })

    }).done(function(response) {
        console.log(response)
        alert('item deleted')
    }).fail(function(response) {
        console.log(response)
    })
}
jQuery(document).on("Loader", function(event) {
    randareHTMLMenu();
    createCart();


})
jQuery(document).ready(function() {
    loginToken('integrare', 'admin123');
    jQuery(document).on('click', '.salemb', function(event) {
        addCart($(event.target));

    })

})
jQuery('button.delitm').click(function() {
    deleteItm();

})


jQuery("body").on("Token", function(event) {


})