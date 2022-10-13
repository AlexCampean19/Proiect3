 function randareHTMLDetaliu() {
     let categorySku = window.location.search ? window.location.search.replace('?sku=', '') : '';
     console.log(categorySku);
     let url = '';
     let token = sessionStorage.getItem('token');
     if (categorySku) {
         url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]=' + categorySku + '&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes]';
     } else {
         url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=41&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes[description]]';
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
                 let descriere = value.custom_attributes[12];
                 console.log(response.items);
                 jQuery('.buc1 img').attr('src', "https://magento-demo.tk/media/catalog/product/" + value.media_gallery_entries[0].file)
                 jQuery('.buc2 h1').text(value.name);
                 jQuery('.preturi2 p').text(value.price + '$');
                 jQuery('.detaliu').text(descriere.value);
                 jQuery("#person").text('(49)');
                 jQuery(" h4").text('Quantity');
                 jQuery(".unu span").text('stea');
                 jQuery('.doi span').text('stea');
             }
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
     console.log('slider');
 })