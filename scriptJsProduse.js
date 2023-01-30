function randareHtmlSlider() {
    let template = '';
    let slider = JSON.parse(sessionStorage.getItem('categorii'));
    if (slider) {

        for (const [key, value] of Object.entries(slider)) {
            jQuery('.categori h2').text('Categories')
            let url = value.imageUrl;
            template += '<div class=card2><a data-id=' + value.id + ', href="index.html?categoryId=' + value.id + '"><img src ="https://magento-demo.tk' + url + '", alt=' + value.name + ', title=' + value.name + '></a><h3>' + value.name + '</h3></div>';
        }
        jQuery('ul.glide__slides ').append(template);

    }
    const config = {
        type: 'carousel',
        startAt: 0,
        perView: 7,
        breakpoints: {
            700: { perView: 1 },
            1200: {
                perView: 2
            },
            1400: {
                perView: 4
            },
            1700: {
                perView: 5
            },
            1900: {
                perView: 6
            },
        }
    };
    new Glide('.glide', config).mount();
}

function TitluCategorie() {
    let categorie = JSON.parse(sessionStorage.getItem("categorii"));
    let categoryIdsName = window.location.search ? window.location.search.replace('?categoryId=', '') : '';
    for (const [key, value] of Object.entries(categorie)) {
        if (value.id === categoryIdsName) {
            jQuery('h1').text(value.name)
        }
    }
};



function randareHTMLProduse() {
    let categoryIds = window.location.search ? window.location.search.replace('?categoryId=', '') : '';
    let template = "";
    let url = "";

    if (categoryIds) {
        TitluCategorie(categoryIds);
        url = 'https://magento-demo.tk/rest/V1/curs/produse?categoryId=' + categoryIds;
    } else {
        jQuery('h1').text('All Products')
        url = 'https://magento-demo.tk/rest/V1/curs/produse?categoryId=56';

    }
    jQuery.ajax({
        method: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: url,
    }).then(function(response) {
        for (var i = 0; i < response.length; i++) {

            for (const [key, value] of Object.entries(response[i])) {
                let finalPrice = parseInt(value.final_price);
                let price = parseInt(value.price)
                if (finalPrice < price) {
                    template += '<div class="card1" data-sku="' + value.sku + '"><a class="fruct " href="https://alexcampean19.github.io/proiect3/detalii?sku=' + value.sku + ' "><p></p><img  src="https://magento-demo.tk/media/catalog/product/' + value.image + '"/><p class="oferte">Sale</p></a><div class="detalii "><a href="https://alexcampean19.github.io/proiect2/detalii " class="nume ">' + value.name + '</a><p class="gramaj ">' + value.weight + '</p><div class="detalii2 "><div class="preturi2"><div class="pretred"><p class="pret1">$' + finalPrice + '</p><p class="pret3">$' + value.price + '</p></div><div class="stele "><p class="unu "><span>stea</span></p><p class="doi "><span>stea</span></p></div></div><a class="salemb "><span class="mbbuy ">Add to cart</span></a></div></div></div>';

                } else {
                    template += '<div class="card1" data-sku="' + value.sku + '"><a class="fruct " href="https://alexcampean19.github.io/proiect3/detalii?sku=' + value.sku + ' "><p></p><img  src="https://magento-demo.tk/media/catalog/product/' + value.image + '"/></a><div class="detalii"><a href="https://alexcampean19.github.io/proiect2/detalii " class="nume ">' + value.name + '</a><p class="gramaj ">' + value.weight + '</p><div class="detalii2 "><p class="pret">$' + price + '</p><div class="stele "><p class="unu "><span>stea</span></p><p class="doi "><span>stea</span></p></div><a class="salemb "><span class="mbbuy ">Add to cart</span></a></div></div></div>';
                }
            }
        }
        jQuery(".cardfructe").append(template);
        jQuery(document).trigger('produse');



    }).fail(function(response) {
        console.log(response);
    })
}





function randareSearch() {
    let searchName = window.location.search ? window.location.search.replace('?search+=', '') : '';
    let token = sessionStorage.getItem('token');
    let template = "";
    let url = "";
    if (searchName) {
        jQuery('h1').text(searchName);
        url = 'https://magento-demo.tk/rest/V1/curs/produse?searchCriteria[filter_groups][0][filters][0][field]=name&searchCriteria[filter_groups][0][filters][0][value]=%25' + searchName + '%25&searchCriteria[filter_groups][0][filters][0][condition_type]=like&'
    }
    jQuery.ajax({
        method: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: url,
        headers: { "Authorization": "Bearer " + token }
    }).done(function(response) {
        for (var i = 0; i < response.length; i++) {
            for (const [key, value] of Object.entries(response[i])) {
                let finalPrice = parseInt(value.final_price);
                let price = parseInt(value.price)
                if (finalPrice < price) {
                    template += '<div class="card1" data-sku="' + value.sku + '"><a class="fruct " href="https://alexcampean19.github.io/proiect3/detalii?sku=' + value.sku + ' "><p></p><img  src="https://magento-demo.tk/media/catalog/product/' + value.image + '"/><p class="oferte">Sale</p></a><div class="detalii "><a href="https://alexcampean19.github.io/proiect2/detalii " class="nume ">' + value.name + '</a><p class="gramaj ">' + value.weight + '</p><div class="detalii2 "><div class="preturi2"><div class="pretred"><p class="pret1">$' + finalPrice + '</p><p class="pret3">$' + value.price + '</p></div><div class="stele "><p class="unu "><span>stea</span></p><p class="doi "><span>stea</span></p></div></div><a class="salemb "><span class="mbbuy ">Add to cart</span></a></div></div></div>';
                } else {
                    template += '<div class="card1" data-sku="' + value.sku + '"><a class="fruct " href="https://alexcampean19.github.io/proiect3/detalii?sku=' + value.sku + ' "><p></p><img  src="https://magento-demo.tk/media/catalog/product/' + value.image + '"/></a><div class="detalii"><a href="https://alexcampean19.github.io/proiect2/detalii " class="nume ">' + value.name + '</a><p class="gramaj ">' + value.weight + '</p><div class="detalii2 "><p class="pret">$' + price + '</p><div class="stele "><p class="unu "><span>stea</span></p><p class="doi "><span>stea</span></p></div><a class="salemb "><span class="mbbuy ">Add to cart</span></a></div></div></div>';
                }
            }
        }
        jQuery(".cardfructe").append(template);
    }).fail(function(response) {
        console.log(response);
    })
}

jQuery(document).on("Loader", function(event) {
    if (window.location.search.indexOf('?search') > -1) {
        randareSearch()
    } else {
        randareHTMLProduse();
    }
    randareHtmlSlider();
})
jQuery(function() {
    jQuery('#listaSelector').change(function() {
        sessionStorage.setItem('selectat', this.value);
        location.reload()
    });
    if (sessionStorage.getItem('selectat')) {
        jQuery('#listaSelector').val(sessionStorage.getItem('selectat'));
    } else {
        jQuery('#listaSelector').val('12');
    }

})
jQuery(document).on('produse', function(event) {
    jQuery('.fructe .cardfructe').paginate({
        'perPage': sessionStorage.getItem('selectat') ? sessionStorage.getItem('selectat') : '12'
    })
})