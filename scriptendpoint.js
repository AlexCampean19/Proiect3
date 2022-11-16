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
    if (!verificareCart || verificareCart === "undefined" && verificareCart != null) {
        let interval = setInterval(() => {
            jQuery.ajax({
                method: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: 'https://magento-demo.tk/rest/V1/guest-carts'
            }).done(function(response) {
                sessionStorage.setItem('cartId', response)
            }).fail(function(response) {
                console.log(response);
            });
            if (sessionStorage.getItem('cartId')) {
                clearInterval(interval);

            }
        }, 1000)
    } else { jQuery("body").trigger("CartId"); }

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
    console.log(target.closest('.card1').attr('data-sku'));
    jQuery.ajax({
        method: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: 'https://magento-demo.tk/rest/V1/guest-carts/' + sessionStorage.getItem('cartId') + '/items',
        data: JSON.stringify({
            "cartItem": {
                "sku": target.closest('.card1').attr('data-sku'),
                "qty": 1,
                "quote_id": sessionStorage.getItem('quoteId')
            }
        })
    }).done(function(response) {
        console.log(response)
        jQuery.ajax({
            method: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: 'https://magento-demo.tk/rest/V1/guest-carts/' + sessionStorage.getItem('cartId') + '/items',
        }).done(function(response) {
            sessionStorage.setItem('prod', JSON.stringify(response));
            let prodshop = JSON.parse(sessionStorage.getItem('prod'));
            let template1 = '';
            console.log(response)
            for (const [key, value] of Object.entries(prodshop)) {
                jQuery('.cart p').html(prodshop.length).addClass('numarcumparaturi')
                sessionStorage.setItem('itmid', value.item_id)
                jQuery('.subtotal').text();
                jQuery('.itmcart').text('Item(s) in Cart:' + prodshop.length)
                template1 += '<div class="cumparaturi"><div class="detfruct"><p class="numeFruct">' + value.name + '</p><p id="quantyy">Qty:</p><input class="valuequanty" value="' + value.qty + '"><div class=pricebut"><p class="price" value="' + value.price + '">Price:' + value.price + '$</p><button class="delitm">X</button></div></div></div><a href="#" class="checkout">Go to Checkout</a>'
            }
            jQuery('.shop').append(template1);
            jQuery('button.delitm').click(function() {
                deleteItm();
                console.log('deketed')
            })
        }).fail(function(response) {
            console.log(response);
        })
    }).fail(function(response) {
        console.log(response);
    })
}





function deleteItm() {
    let cartid = sessionStorage.getItem('quoteId');
    let itmid = sessionStorage.getItem('itmid');
    let token = sessionStorage.getItem('token')
    console.log(itmid)
    console.log(cartid)
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
                "qty": 0,
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

        jQuery('.cumparaturi').remove();
        jQuery('.checkout').remove();


    }).fail(function(response) {
        console.log(response)
    })
}



jQuery(document).ready(function() {
    loginToken('integrare', 'admin123');
    jQuery(document).on('click', '.salemb', function(event) {
        addCart($(event.target));

    })

})
jQuery(document).on("Loader", function(event) {
    randareHTMLMenu();

})

jQuery("body").on("Token", function(event) {
    createCart();
    cartId();
})