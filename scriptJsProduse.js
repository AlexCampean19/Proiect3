function randareHtmlSlider() {
    let slider = JSON.parse(sessionStorage.getItem('categorii'));
    if (slider) {
        for (const [key, value] of Object.entries(slider)) {
            let url = value.custom_attributes[0].value,
                slide = jQuery('<li>').addClass('glide__slide'),
                div = jQuery('<div>').addClass('card2'),
                h3 = jQuery('<h3>').text(value.name),
                link = jQuery('<a>').attr('data-id', value.id),
                img = jQuery('<img>').attr('src', 'https://magento-demo.tk' + url).attr('alt', value.name).attr('title', value.name);
            jQuery('ul.glide__slides ').append(slide);
            jQuery(slide).append(div);
            jQuery(div).append(link);
            jQuery(link).append(img);
            jQuery(div).append(h3);
        }
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

function TitluCategorie(categoryId) {
    let url = 'https://magento-demo.tk/rest/V1/categories/' + categoryId;
    jQuery.ajax({
        url: url
    }).done(function(result) {
        jQuery('h1').text(result.name)
    })
}

function randareHTMLProduse() {
    let categoryId = window.location.search ? window.location.search.replace('?category_id=', '') : '';
    let token = sessionStorage.getItem('token');
    let template = "";
    let url = "";
    if (categoryId) {
        TitluCategorie(categoryId);
        url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=' + categoryId + '&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes]'
    } else {
        url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=41&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes[description]]';
    }
    jQuery.ajax({
        method: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: url,
        headers: { "Authorization": "Bearer " + token }
    }).done(function(response) {
        for (const [key, value] of Object.entries(response.items)) {
            template += '<div class="card1 "><a class="fruct " href="https://alexcampean19.github.io/proiect3/detalii?sku=' + value.sku + ' "><img  src="https://magento-demo.tk/media/catalog/product/' + value.media_gallery_entries[0].file + '"/></a><div class="detalii "><a href="https://alexcampean19.github.io/proiect2/detalii " class="nume ">' + value.name + '</a><p class="gramaj ">' + value.weight + 'g</p><div class="detalii2 "><p class="pret ">$' + value.price + '</p><div class="stele "><p class="unu "><span>stea</span></p><p class="doi "><span>stea</span></p></div><a class="salemb "><span class="mbbuy ">Add to cart</span></a></div></div></div>';
        }
        jQuery(".cardfructe").append(template);
        jQuery(document).trigger('produse');

    }).fail(function(response) {
        console.log(response);
    })
}
jQuery(document).on("Loader", function(event) {
    randareHTMLProduse();
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