 function randareHTMLDetaliu() {
     let categorySku = window.location.search ? window.location.search.replace('?sku=', '') : '';
     let template = '';
     let produse = JSON.parse(sessionStorage.getItem('produse'));
     console.log(produse.key)

     function filterByProperty(produse, prop, value) {
         var filtered = [];
         for (var i = 0; i < produse.length; i++) {

             var obj = produse[i];

             for (var key in obj) {
                 if (typeof(obj[key] == "object")) {
                     var item = obj[key];
                     if (item[prop] == value) {
                         filtered.push(item);
                     }
                 }
             }

         }
         for (const [key, value] of Object.entries(filtered)) {
             sessionStorage.setItem('itemIdRew', JSON.stringify(value.id))
             jQuery('.buc1 img').attr('src', "https://magento-demo.tk/media/catalog/product/" + value.image);
             jQuery('.buc2 h1').text(value.name);
             if (value.final_price > value.price) {
                 jQuery('.preturi2 p').text(value.final_price + '$');
                 jQuery('.preturi2 span').text(value.price + '$')
                 jQuery('.buc1 p').addClass('saleoferte').text('Sale');
             } else {
                 jQuery('.preturi2 p').text(value.price + '$');
             }
             if (value.stock_status = 0) {
                 jQuery("#stock").text("Out of stock").addClass('outstock')
             } else {
                 jQuery("#stock").text("Is in stock").addClass('instock')
             }
             console.log(value.health_benefits)
             jQuery('.detaliu').html(value.description);
             jQuery(" h4").text('Quantity');
             jQuery(".unu span").text('stea');
             jQuery('.doi span').text('stea');
             jQuery('#ingre ').html(value.ingredients);
             jQuery('.sub-menu#health').html(value.health_benefits);
             jQuery('.sub-menu#nutrition').html(value.nutritional_informtion);
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
         console.log(filtered)
         return filtered;

     }
     filterByProperty(produse, "sku", categorySku);




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
                 console.log(response.items)
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