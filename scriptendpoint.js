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
    let url = 'https://magento-demo.tk/rest/V1/curs/categorii/56';
    if (!sessionStorage.getItem('categorii')) {
        jQuery.ajax({
                method: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: url,
            })
            .done(function(response) {
                sessionStorage.setItem("categorii", JSON.stringify(response))
            })
            .fail(function(response) {
                console.log(response);
            })
    } else {
        let categoryId = window.location.search ? window.location.search.replace('?categoryId=', '') : '56';
        randareHTMLMenu(categoryId);
    }
};

function getProduse() {
    let url = 'https://magento-demo.tk/rest/V1/curs/produse/56';
    if (!sessionStorage.getItem('produse')) {
        jQuery.ajax({
                method: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: url,
            }).done(function(response) {
                sessionStorage.setItem("produse", JSON.stringify(response))
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
            jQuery(link).attr('href', 'index.html?categoryId=' + value.id).text(value.name);
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
                // jQuery("#laoder").css('display', 'none');
                //jQuery('body').removeClass('noscroll');
                clearInterval(intervalcategorii);
            }
        }
    }, 500)

})

function createCart() {
    let verificareCart = sessionStorage.getItem('cartId');
    if (!verificareCart || verificareCart === 'null') {
        let interval = setInterval(() => {
            jQuery.ajax({
                method: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: 'https://magento-demo.tk/rest/V1/guest-carts'
            }).done(function(response) {
                sessionStorage.setItem('cartId', response)
                cartId()
            }).fail(function(response) {
                console.log(response)
            });
            if (sessionStorage.getItem('cartId')) {
                clearInterval(interval)
            }
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
        randareCart()
        $(".msj").text(response.name + ' was added to the cart').attr('id', 'succes').show();
        jQuery(".salemb").addClass('salembof')

        $(".salemb").css("pointer-events", "none");
        setTimeout(function() {
            $("#succes").hide();
            $(".salemb").css("pointer-events", "auto");
            jQuery(".salemb").removeClass('salembof')
        }, 5000);


    }).fail(function(response) {
        $(".msj").html(response.responseJSON.message).attr('id', 'fail').show();
        setTimeout(function() { $("#fail").hide(); }, 5000);
    })
}

function randareCart() {
    let template1 = '';
    jQuery.ajax({
        method: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: 'https://magento-demo.tk/rest/V1/guest-carts/' + sessionStorage.getItem('cartId'),
    }).done(function(response) {
        for (const [key, value] of Object.entries(response.items)) {
            template1 += '<div class="cumparaturi" data-id="' + value.item_id + '"><img id="imgsh" src="' + value.extension_attributes.image + '" /><div class="detfruct" ><p  class="numeFruct" >' + value.name + '</p><p id="quantyy">Qty:</p><input class="valuequanty" value="' + value.qty + '"><button type="button" id="minus"><span>minus</span></button><button type="button" id="plus"><span>plus</span></button><div class="pricebut"><p class="price">Price: ' + value.price + ' $</p><button id="delitm">X</button></div></div></div> '
        }
        jQuery('#nrprod').text(response.items.length).addClass('numarcumparaturi');
        jQuery('.itmshop').html(template1);
        jQuery('.itmcart').text(response.items.length + ' Item(s) in Cart')
        subTotal();

    }).fail(function(response) {
        console.log(response)
    })
}


function modificareProdCos(target) {

    jQuery.ajax({
        method: "PUT",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: 'https://magento-demo.tk/rest/V1/guest-carts/' + sessionStorage.getItem('cartId') + '/items/' + target.closest('.cumparaturi').attr('data-id'),
        data: JSON.stringify({
            "cartItem": {
                "item_id": target.closest('.cumparaturi').attr('data-id'),
                "qty": target.closest('.detfruct').find('.valuequanty').val(),
                "quote_id": sessionStorage.getItem('quoteId'),
            }
        })
    }).done(function(response) {

        $(this).closest('.detfruct').find('.valuequanty').html(response.qty)
        $(".msj").text('The amount of ' + response.name + ' has changed').attr('id', 'succes').show();
        setTimeout(function() { $("#succes").hide(); }, 5000);
        randareCart();
    }).fail(function(response) {
        $(".msj").html(response.responseJSON.message).attr('id', 'fail').show();
        setTimeout(function() { $("#fail").hide(); }, 5000);
        console.log(response)
    })
}



function subTotal() {
    let pretinmultite = [];
    jQuery.ajax({
        method: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: 'https://magento-demo.tk/rest/V1/guest-carts/' + sessionStorage.getItem('cartId'),
    }).done(function(result) {
        for (const [key, value] of Object.entries(result.items)) {
            pretinmultite.push(value.qty * value.price)
        }
        var totalpret = 0;
        for (var i = 0; i < pretinmultite.length; i++) {
            totalpret += pretinmultite[i] << 0;
        }
        jQuery('#value').text(totalpret + '$')
    }).fail(function(result) {

    })
}

function deleteItm(target) {
    let cartid = sessionStorage.getItem('cartId');
    let token = sessionStorage.getItem('token')
    jQuery.ajax({
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: 'https://magento-demo.tk/rest/V1/guest-carts/' + cartid + '/items/' + target.closest('.cumparaturi').attr('data-id'),
        data: JSON.stringify({
            "cartItem": {
                "item_id": target.closest('.cumparaturi').attr('data-id'),
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
        $(".msj").text('The product has been deleted').attr('id', 'succes').show();
        setTimeout(function() { $("#succes").hide(); }, 5000);
        randareCart()
    }).fail(function(response) {
        console.log(response)
        $(".msj").html(response.responseJSON.message).attr('id', 'fail').show();
        setTimeout(function() { $("#fail").hide; }, 5000);
    })

}
$(document).on('keydown', '.valuequanty', function(e) {
    if (e.keyCode === 13) {
        modificareProdCos($(e.target))
    }
})

jQuery(document).on('click', '#plus', function(event) {
    let x = $(this).closest('.detfruct').find('.valuequanty').val()

    $(this).closest('.detfruct').find('.valuequanty').val(++x)
    modificareProdCos($(event.target))
})
jQuery(document).on('click', '#minus', function(event) {
    let x = $(this).closest('.detfruct').find('.valuequanty').val()

    if (x > 0) {
        $(this).closest('.detfruct').find('.valuequanty').val(--x)
        modificareProdCos($(event.target))
    }
})



jQuery(document).on('click', '#delitm', function(event) {
    deleteItm($(event.target));

})
jQuery(document).on('click', '.salemb', function(event) {
    addCart($(event.target));



})
jQuery(document).on("Loader", function(event) {
    randareHTMLMenu();
    randareCart()
    jQuery('.msj').click(function() {
        jQuery(this).hide()
        $(".salemb").css("pointer-events", "auto");

    })

})
jQuery(document).ready(function() {
    loginToken('integrare', 'admin123');

    createCart()

})

jQuery("body").on("Token", function(event) {

})