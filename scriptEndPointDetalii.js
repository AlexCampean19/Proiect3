 function randareHTMLDetaliu() {
     let categorySku = window.location.search ? window.location.search.replace('?sku=', '') : '';
     let url = '';
     let token = sessionStorage.getItem('token');
     let template = '';

     if (categorySku) {
         url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]=' + categorySku + '&fields=items[id,name,sku,price,special_price,weight,media_gallery_entries,custom_attributes]';
     } else {
         url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=41&fields=items[id,name,sku,price,special_price,weight,media_gallery_entries,custom_attributes[short_description,ingredients,health_benefits,nutrition_information]]';
     }
     jQuery.ajax({
             method: "GET",
             contentType: "application/json; charset=utf-8",
             dataType: "json",
             url: url,
             headers: { "Authorization": "Bearer " + token }
         })
         .done(function(response) {
             console.log(response)
             sessionStorage.setItem('proddet', JSON.stringify(response))
             for (const [key, value] of Object.entries(response.items)) {
                 sessionStorage.setItem('itemIdRew', JSON.stringify(value.id))

                 value.custom_attributes.map(function(ing) {
                     if (ing.attribute_code == "ingredients") {
                         jQuery('#ingre ').html(ing.value);
                     } else {
                         return null
                     }
                 });
                 value.custom_attributes.map(function(health) {
                     if (health.attribute_code == "health_benefits") {
                         jQuery('.sub-menu#health').html(health.value);
                     } else {
                         return null
                     }
                 });
                 value.custom_attributes.map(function(nutrition) {
                     if (nutrition.attribute_code == "nutrition_information") {
                         jQuery('.sub-menu#nutrition').html(nutrition.value);
                     } else {
                         return null
                     }
                 });
                 let descriere = value.custom_attributes[0];
                 jQuery('.buc1 img').attr('src', "https://magento-demo.tk/media/catalog/product/" + value.media_gallery_entries[0].file);
                 jQuery('.buc2 h1').text(value.name);
                 // jQuery('.preturi2 p').text(value.price + '$');
                 jQuery('.detaliu').text(descriere.value);
                 jQuery(" h4").text('Quantity');
                 jQuery(".unu span").text('stea');
                 jQuery('.doi span').text('stea');

                 jQuery('#ingredientetitle').text('Ingredients');
                 jQuery('#nutritiontitle').text('Nutrition information (100g):');
                 jQuery('#healthtitle').text('Health benefits:');
                 jQuery('#review').text('Review');
                 jQuery('.plusicon').text('plus');
                 jQuery('.hmpage span').text(value.name);
                 jQuery('.salemb span').text('Add to cart').attr('data-sku', categorySku)
                 template += '<a class="plus showdetails"><span class="plusicon"></span></a>'
             }

             jQuery('.showdetails').append(template);
             jQuery('.titledetails2').append(template);
             jQuery('.titledetails3').append(template);

         }).fail(function(response) {
             console.log(response);
         })
 }

 function stock() {
     let categorySku = window.location.search ? window.location.search.replace('?sku=', '') : '';
     let token = sessionStorage.getItem('token')
     let url = 'https://magento-demo.tk/rest/default/V1/stockItems/' + categorySku;
     jQuery.ajax({
         method: "GET",
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         url: url,
         headers: { "Authorization": "Bearer " + token }
     }).done(function(response) {
         console.log(response.is_in_stock);
         for (const [key, value] of Object.entries({ response })) {
             if (value.is_in_stock === true) {
                 jQuery("#stock").text("Is in stock").addClass('instock')
             } else {
                 jQuery("#stock").text("Out of stock").addClass('outstock')
             }
         }
     }).fail(function(response) {
         console.log(response)
     })
 }
 stock()



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
         console.log(result)
         if (sessionStorage.getItem('price') !== '[]') {
             for (const [key, value] of Object.entries(result)) {
                 let dataExp = value.price_to;
                 let dataNow = value.price_from;
                 console.log(new Date)
                 console.log(dataExp)
                 console.log(dataNow)
                 if (new Date < dataExp) {
                     console.log(value.price)
                     jQuery('.preturi2 p').html(value.price + '$')
                     jQuery('.buc1 p').addClass('saleoferte').text('Sale');
                     if (new Date > dataNow) {
                         let prod = sessionStorage.getItem('proddet');
                         console.log(JSON.parse(prod))
                         for (const [key, value] of Object.entries(JSON.parse(prod))) {
                             console.log(value[0].price)
                             jQuery('.preturi2 p').text(value[0].price + '$')

                         }
                     } else {
                         console.log(value.price)
                         jQuery('.preturi2 p').html(value.price + '$')
                         jQuery('.buc1 p').addClass('saleoferte').text('Sale');
                     }
                 } else {
                     let prod = sessionStorage.getItem('proddet');
                     console.log(JSON.parse(prod))
                     for (const [key, value] of Object.entries(JSON.parse(prod))) {
                         console.log(value[0].price)
                         jQuery('.preturi2 p').text(value[0].price + '$')

                     }
                 }
             }
         } else {
             let prod = sessionStorage.getItem('proddet');
             for (const [key, value] of Object.entries(JSON.parse(prod))) {
                 console.log(value[0].price)
                 jQuery('.preturi2 p').text(value[0].price + '$')

             }
         }
     }).fail(function(result) {
         console.log(result)
     })
 }




 function postareReview() {
     let url = 'https://magento-demo.tk/rest/V1/reviews';
     let token = sessionStorage.getItem('token');
     let titleForm = document.querySelector('#name').value;
     console.log(titleForm)
     let nickNameForm = document.querySelector('#summ').value;
     let descriereForm = document.querySelector('#desc').value;
     let prodid = JSON.parse(sessionStorage.getItem('itemIdRew'))
     console.log(nickNameForm);


     console.log($('input[name=stars]:checked').val())
     jQuery.ajax({
         method: 'POST',
         contentType: "application/json; charset=utf-8",
         headers: { "Authorization": "Bearer " + token },
         url: url,
         dataType: "json",
         data: JSON.stringify({
             "review": {
                 "title": titleForm,
                 "detail": descriereForm,
                 "nickname": nickNameForm,
                 "ratings": [{
                     "rating_name": "Rating",
                     "value": $('input[name=stars]:checked').val(),
                 }],
                 "review_entity": "product",
                 "review_status": 1,
                 "entity_pk_value": prodid,
                 "store_id": 3,
                 "stores": [
                     0,
                     1
                 ]
             }
         })
     }).done(function(result) {
         window.location.reload();
         console.log(result)


     }).fail(function(result) {
         console.log(result)
     })
 }

 function getReview() {
     let categorySku = window.location.search ? window.location.search.replace('?sku=', '') : '';
     let url = 'https://magento-demo.tk/rest/V1/products/' + categorySku + '/reviews';
     let token = sessionStorage.getItem('token');
     let template = '';
     jQuery.ajax({
             method: "GET",
             contentType: "application/json; charset=utf-8",
             dataType: "json",
             url: url,
             headers: { "Authorization": "Bearer " + token }
         }).done(function(result) {
             sessionStorage.setItem('review', JSON.stringify(result.slice(-2)));
             for (const [key, value] of Object.entries(result.slice(-2))) {
                 jQuery("#person").text('(' + result.length + ')');

                 console.log(value.value)
                 template += '<div class="namesirew"><p id="nameReview">' + value.nickname + '</p><div class="rating"><div class="rating-upper" style="width:' + value.value + '%"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div><div class="rating-lower"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div></div><p id="titleReview">' + value.title + '</p><p id="descReview">' + value.detail + '</p>'

             }
             jQuery('.reviewluat').append(template)

         })
         .fail(function(result) {
             console.log(result)
         })
 };

 jQuery('.addsubmit').click(function() {
     postareReview()

 })

 function getAllReviewStars() {
     let categorySku = window.location.search ? window.location.search.replace('?sku=', '') : '';
     let url = 'https://magento-demo.tk/rest/V1/products/' + categorySku + '/reviews';
     let token = sessionStorage.getItem('token');
     let stars = [];
     jQuery.ajax({
             method: "GET",
             contentType: "application/json; charset=utf-8",
             dataType: "json",
             url: url,
             headers: { "Authorization": "Bearer " + token }
         }).done(function(result) {
             sessionStorage.setItem('review', JSON.stringify(result));
             for (const [key, value] of Object.entries(result)) {

                 //  stars.push(valoare stele)
             }
             var total = 0;
             for (var i = 0; i < stars.length; i++) {
                 total += stars[i] << 0;
             }
             console.log(total / stars.length)
         })
         .fail(function(result) {
             console.log(result)
         })
 }
 //getAllReviewStars()




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
                 template += '<div class="card1" data-sku="' + value.sku + '"><a class="fruct " href="https://alexcampean19.github.io/proiect3/detalii?sku=' + value.sku + ' "><img  src="https://magento-demo.tk/media/catalog/product/' + value.media_gallery_entries[0].file + '"></a><div class="detalii "><a href="https://alexcampean19.github.io/proiect2/detalii " class="nume ">' + value.name + '</a><p class="gramaj ">' + value.weight + 'g</p><div class="detalii2 "><p class="pret ">$' + value.price + '</p><div class="stele "><p class="unu "><span>stea</span></p><p class="doi "><span>stea</span></p></div><a class="salemb "><span class="mbbuy ">Add to cart</span></a></div></div></div>';
             }
             jQuery('ul.glide__slides').append(template);
             jQuery(document).trigger('slider');
             jQuery('.related').text('Related Product')

         }).fail(function(response) {
             console.log(response)
         })
     }
 }

 jQuery(document).on("Loader", function(event) {
     randareHTMLDetaliu();
     randareRelated();
     specialPrice();
     getReview();
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