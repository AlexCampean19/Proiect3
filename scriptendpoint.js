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
                "qty": 1,
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
    jQuery.ajax({
        method: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: 'https://magento-demo.tk/rest/V1/guest-carts/' + sessionStorage.getItem('cartId') + '/items',
        data: payload
    }).done(function(response) {

    }).fail(function(response) {
        console.log(response)
    })

}


function randareCart() {
    let template1 = '';
    let pozash = ''
    jQuery.ajax({
        method: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: 'https://magento-demo.tk/rest/V1/guest-carts/' + sessionStorage.getItem('cartId'),
    }).done(function(response) {
        console.log(response)
        for (const [key, value] of Object.entries(response.items)) {
            console.log(value.sku)
            console.log(pozaShop(value.sku))

            pozash = '<img id="imgsh" src="https://magento-demo.tk/media/catalog/product/' + pozaShop(value.sku) + '"/>'
            console.log(pozash)

            template1 += '<div class="cumparaturi">' + pozash + '<div class="detfruct"><p class="numeFruct">' + value.name + '</p><p id="quantyy">Qty:</p><input class="valuequanty" value="' + value.qty + '"><div class=pricebut"><p class="price">Price:' + value.price + '$</p><button onclick="deleteItm(' + value.item_id + ')"id="delitm">X</button></div></div></div>'
        }
        jQuery('#nrprod').text(response.items.length).addClass('numarcumparaturi')
        jQuery('.itmshop').append(template1)
        subTotal()


    }).fail(function(response) {
        console.log(response)
    })
}


//pt imagini ca la pret special

/* 
     jQuery.ajax({
                method: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]=' + poza + '&fields=items[id,name,sku,price,special_price,weight,media_gallery_entries,custom_attributes]',
                headers: { "Authorization": "Bearer " + token }
            })
            .done(function(result) {
                console.log(result)

                for (const [key, value] of Object.entries(result.items)) {
                    sessionStorage.setItem('poza', value.media_gallery_entries[0].file)
                    jQuery('#imgsh').attr('src', "https://magento-demo.tk/media/catalog/product/" + value.media_gallery_entries[0].file)

                }

            }).fail(function(result) {
                console.log(result)
            })
*/
function pozaShop(poza) {
    let token = sessionStorage.getItem('token')
    jQuery.ajax({
            method: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]=' + poza + '&fields=items[id,name,sku,price,special_price,weight,media_gallery_entries,custom_attributes]',
            headers: { "Authorization": "Bearer " + token }
        })
        .done(function(result) {
            return result.items[0].media_gallery_entries[0].file;
        }).fail(function(result) {
            console.log(result)
        })
}




function subTotal() {
    let pretinmultite = [];
    let itemscos = [];
    jQuery.ajax({
        method: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: 'https://magento-demo.tk/rest/V1/guest-carts/' + sessionStorage.getItem('cartId'),
    }).done(function(result) {
        for (const [key, value] of Object.entries(result.items)) {
            pretinmultite.push(value.qty * value.price)
            itemscos.push(value.qty)
        }
        var totalpret = 0;
        for (var i = 0; i < pretinmultite.length; i++) {
            totalpret += pretinmultite[i] << 0;
        }
        var produsecos = 0;
        for (var i = 0; i < itemscos.length; i++) {
            produsecos += itemscos[i] << 0;
        }
        jQuery('.itmcart').text(produsecos + ' Item(s) in Cart')
        jQuery('.subtotal').text('Subtotal: ' + totalpret + ' $')
    }).fail(function(result) {
        console.log(result)
    })
}




function deleteItm(itemid) {
    let cartid = sessionStorage.getItem('quoteId');
    let token = sessionStorage.getItem('token')

    jQuery.ajax({
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: 'https://magento-demo.tk/rest/default/V1/carts/' + cartid + '/items/' + itemid + '',
        data: JSON.stringify({
            "cartItem": {
                "item_id": itemid,
                "sku": "string",
                "qty": 1,
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
        console.log('succ')
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
    randareCart()
    jQuery(document).on('click', '.salemb', function(event) {
        addCart($(event.target));

    })

})


jQuery("body").on("Token", function(event) {


})