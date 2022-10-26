 function randareHTMLDetaliu() {
     let categorySku = window.location.search ? window.location.search.replace('?sku=', '') : '';
     let url = '';
     let token = sessionStorage.getItem('token');
     let template = '';
     if (categorySku) {
         url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]=' + categorySku + '&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes]';
     } else {
         url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=41&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes[short_description,ingredients,health_benefits,nutrition_information]]';
     }

     jQuery.ajax({
             method: "GET",
             contentType: "application/json; charset=utf-8",
             dataType: "json",
             url: url,
             headers: { "Authorization": "Bearer " + token }
         })
         .done(function(response) {
             for (const [key, value] of Object.entries(response.items)) {
                 let descriere = value.custom_attributes[0];
                 let ingrediente = value.custom_attributes[17];
                 let healthBenefits = value.custom_attributes[18];
                 let nutritionInf = value.custom_attributes[19];
                 jQuery('.buc1 img').attr('src', "https://magento-demo.tk/media/catalog/product/" + value.media_gallery_entries[0].file)
                 jQuery('.buc2 h1').text(value.name);
                 jQuery('.preturi2 p').text(value.price + '$');
                 jQuery('.detaliu').text(descriere.value);
                 jQuery("#person").text('(49)');
                 jQuery(" h4").text('Quantity');
                 jQuery(".unu span").text('stea');
                 jQuery('.doi span').text('stea');
                 jQuery('.detaliifructe h3').text('Ingredients');
                 jQuery('p#ingrediente').text(ingrediente.value);
                 jQuery('.titledetails h3.showdetails').text('Nutrition information (100g)');
                 jQuery('.titledetails2 h3.showdetails').text('Health benefits:');
                 jQuery('.plusicon').text('plus');
                 jQuery('ul.sub-menu#nutrition').html(nutritionInf.value);
                 jQuery('ul.sub-menu#health').html(healthBenefits.value);
                 jQuery('.hmpage span').text(value.name)
                 template += '<a class="plus showdetails"><span class="plusicon"></span></a>'
             }

             jQuery('.titledetails').append(template);
             jQuery('.titledetails2').append(template);
         }).fail(function(response) {
             console.log(response);
         })
 }

 function getRelated() {
     let categorySku = window.location.search ? window.location.search.replace('?sku=', '') : '';
     let url = 'https://magento-demo.tk/rest/V1/products/' + categorySku + '/links/related';
     let items = [];
     jQuery.ajax({
         url: url
     }).done(function(result) {
         for (const [key, value] of Object.entries(result)) {
             items.push(value.linked_product_sku);
         }
         sessionStorage.setItem('related', items)
     })
 }

 getRelated();

 function specialPrice() {
     let url = 'https://magento-demo.tk/rest/V1/products/special-price-information';
     let categorySku = window.location.search ? window.location.search.replace('?sku=', '') : '';
     let token = sessionStorage.getItem('token');
     jQuery.ajax({
         method: 'POST',
         contentType: "application/json; charset=utf-8",
         headers: { "Authorization": "Bearer " + token },
         url: url,
         dataType: "json",
         data: JSON.stringify({
             "skus": [
                 categorySku
             ]
         })
     }).done(function(result) {
         sessionStorage.setItem('price', JSON.stringify(result))

     })
 }

 function randarePret() {
     let pret = sessionStorage.getItem(JSON.stringify('price'));
     if (pret || !pret === []) {
         for (const [key, value] of Object.entries(pret)) {
             let dataExp = value.price_to[0];
             if (dataExp < new Date) {
                 jQuery('.preturi2 p').text(value.price + '$')
             }
         }
     } else {
         let prod = sessionStorage.getItem('produse');
         for (const [key, value] of Object.entries(prod)) {
             jQuery('preturi p').text(value.price + '$')
         }
     }
 };

 randarePret()

 function randareRelated() {
     let slider = sessionStorage.getItem('related');
     let template = '';
     let url = '';
     if (slider) {
         url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filterGroups][0][filters][0][field]=sku&searchCriteria[filterGroups][0][filters][0][condition_type]=in&searchCriteria[filterGroups][0][filters][0][value]=' + slider;
         jQuery.ajax({
             url: url,
         }).done(function(response) {
             for (const [key, value] of Object.entries(response.items)) {
                 template += '<div class="card1 "><a class="fruct " href="https://alexcampean19.github.io/proiect3/detalii?sku=' + value.sku + ' "><img  src="https://magento-demo.tk/media/catalog/product/' + value.media_gallery_entries[0].file + '"></a><div class="detalii "><a href="https://alexcampean19.github.io/proiect2/detalii " class="nume ">' + value.name + '</a><p class="gramaj ">' + value.weight + 'g</p><div class="detalii2 "><p class="pret ">$' + value.price + '</p><div class="stele "><p class="unu "><span>stea</span></p><p class="doi "><span>stea</span></p></div><a class="salemb "><span class="mbbuy ">Add to cart</span></a></div></div></div>';
             }
             jQuery('ul.glide__slides').append(template);
             jQuery(document).trigger('slider');
         }).fail(function(response) {
             console.log(response)
         })
     }
 }
 jQuery(document).on("Loader", function(event) {
     randareHTMLDetaliu();
     randareRelated();
     specialPrice();
 })
 jQuery(document).on("slider", function() {
     const config = {
         type: 'carousel',
         startAt: 0,
         perView: 5,
         breakpoints: {
             700: { perView: 1 },
             1200: {
                 perView: 2
             },
             1400: {
                 perView: 3
             },
             1700: {
                 perView: 4
             },
             1900: {
                 perView: 5
             },

         }
     };
     new Glide('.glide', config).mount();
 })