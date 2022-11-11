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
    if (!verificareCart || verificareCart === "undefined" && verificareCart === "null") {
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
    let template1 = '';
    let template2 = ''

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
            data: JSON.stringify({
                "cartItem": {
                    "sku": target.closest('.card1').attr('data-sku'),
                    "qty": 1,
                    "quote_id": sessionStorage.getItem('quoteId')
                }
            })
        }).done(function(response) {
            sessionStorage.setItem('prod', JSON.stringify(response));
            for (const [key, value] of Object.entries(response)) {
                jQuery('.cart p').html(response.length).css({
                    "background-color": "#059E67",
                    "border-radius": "50%",
                    "margin-left": "10px",
                    "width": "20px",
                    "color": "white"
                });
                template1 += '<div class="cumparaturi"><div class="detfruct"><p class="numeFruct">' + value.name + '</p><p class="qunaty">Qty:</p><input class="valuequanty" value="' + value.qty + '"><p class="price" value="' + value.price + '">Price:' + value.price + '$</p><a class="rmvitm"><span>Remove</span></a></div></div>'
            }
            jQuery('.shopitems').append(template1);
            jQuery.ajax({
                method: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]=' + target.closest('.card1').attr('data-sku') + '&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes]'
            }).done(function(response) {
                for (const [key, value] of Object.entries(response.items)) {
                    template2 = '<img src="https://magento-demo.tk/media/catalog/product/' + value.media_gallery_entries[0].file + '"/>'
                }
                jQuery('.cumparaturi').append(template2);
            }).fail(function(response) {
                console.log(response);
            })
        }).fail(function(response) {
            console.log(response);
        })
    }).fail(function(response) {
        console.log(response);
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
    cartId()
})