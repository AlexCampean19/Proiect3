 function randareHTMLDetaliu() {
     let productSku = window.location.search ? window.location.search.replace('?sku=', '') : '';
     let template = '';
     let produse = JSON.parse(sessionStorage.getItem('produse'));


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
             sessionStorage.setItem('itemIdRew', JSON.stringify(parseInt(value.entity_id)))
             jQuery('.buc1 img').attr('src', "https://magento-demo.tk/media/catalog/product/" + value.image);
             jQuery('.buc2 h1').text(value.name);
             if (parseInt(value.final_price) < parseInt(value.price)) {
                 jQuery('.preturi2 p').text(parseInt(value.final_price) + '$');
                 jQuery('.preturi2 span').text(parseInt(value.price) + '$')
                 jQuery('.buc1 p').addClass('saleoferte').text('Sale');
             } else {
                 jQuery('.preturi2 p').attr('id', 'pretnormal').text(value.price + '$');
             }
             let stock = parseInt(value.stock_status);
             if (stock == 0) {
                 jQuery("#stock").text("Out of stock").addClass('outstock')
                 jQuery(".salemb").css("background-color", "#D9D9D9")
                 $(".salemb").css("pointer-events", "none");
             } else {
                 jQuery("#stock").text("Is in stock").addClass('instock')
                 jQuery(".salemb").css("background-color", "#059E67")
                 $(".salemb").css("pointer-events", "auto");
             }

             if (value.short_description == null) {
                 let desc = value.description.substring(0, 400);
                 jQuery('.detaliu').html(desc)
             } else {
                 jQuery('.detaliu').html(value.short_description);
             }
             jQuery(" h4").text('Quantity');
             jQuery(".unu span").text('stea');
             jQuery('.doi span').text('stea');
             if (value.ingredients == null) {
                 jQuery('#ingredientetitle').text('Ingredients').hide();
                 jQuery('#ingrediente').hide();

             } else {
                 jQuery('#ingrediente').addClass('showsub-menu')
                 jQuery('#ingredientetitle').text('Ingredients');
                 jQuery('#ingre ').html(value.ingredients);
             }
             if (value.health_benefits == null) {
                 jQuery('#healthtitle').text('Health benefits:').hide();
                 jQuery('#sanatate').hide();
             } else {
                 jQuery('#healthtitle').text('Health benefits:');
                 jQuery('.sub-menu#health').html(value.health_benefits);
             }
             if (value.nutritional_informtion == null) {
                 jQuery('#nutritiontitle').text('Nutrition information (100g):').hide();
                 jQuery('#nutritie').hide();
             } else {
                 jQuery('#nutritiontitle').text('Nutrition information (100g):');
                 jQuery('.sub-menu#nutrition').html(value.nutritional_informtion);
             }
             if (
                 value.ingredients == null && value.health_benefits != null && value.nutritional_informtion == null
             ) {
                 jQuery('#sanatate').addClass('showsub-menu')

             }
             if (value.ingredients == null && value.health_benefits == null && value.nutritional_informtion != null ||
                 value.ingredients == null && value.health_benefits != null && value.nutritional_informtion != null
             ) {
                 jQuery('#nutritie').addClass('showsub-menu')
             }
             if (
                 value.ingredients == null && value.health_benefits == null && value.nutritional_informtion == null
             ) {
                 jQuery('#pareri').addClass('showsub-menu')

             }
             jQuery('#review').text('Review');
             jQuery('.plusicon').text('plus');
             jQuery('.hmpage span').text(value.name);
             jQuery('.salemb span').text('Add to cart').attr('data-sku', productSku)
             template += '<a class="plus showdetails"><span class="plusicon"></span></a>'
         }
         jQuery('.titledetails').append(template);

         return filtered;
     }
     filterByProperty(produse, "sku", productSku);
 }

 function getRelated() {
     let productSku = window.location.search ? window.location.search.replace('?sku=', '') : '';
     let url = 'https://magento-demo.tk/rest/V1/products/' + productSku + '/links/related';
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
     let reviewstea = $('.star-rating input[name="stars"]:checked').val()
     let titleForm = jQuery('#name').val();
     let nickNameForm = jQuery('#summ').val();
     let descriereForm = jQuery('#desc').val();
     let prodid = JSON.parse(sessionStorage.getItem('itemIdRew'))
     jQuery.ajax({
         method: 'POST',
         contentType: "application/json; charset=utf-8",

         url: url,
         dataType: "json",
         data: JSON.stringify({
             "review": {
                 "title": titleForm,
                 "detail": descriereForm,
                 "nickname": nickNameForm,
                 "ratings": [{
                     "rating_name": "Rating",
                     "value": reviewstea,
                 }],
                 "entity_pk_value": prodid,
             }
         })
     }).done(function(result) {
         $(".msj").text(result).attr('id', 'succes').show();
         setTimeout(function() { $("#succes").hide(); }, 5000);

     }).fail(function(result) {
         console.log(result)
         $(".msj").html(result.responseJSON.message).attr('id', 'fail').show();
         setTimeout(function() { $("#fail").hide; }, 5000);
     })
 }

 function verificareReview() {

     setInterval(function() {

         let titleForm = jQuery('#name').val();
         let nickNameForm = jQuery('#summ').val();
         let descriereForm = jQuery('#desc').val();
         if (titleForm.length == 0 || nickNameForm.length == 0 || descriereForm == 0 || jQuery('.star-rating input[name="stars"]:checked').length == 0) {
             jQuery(".addsubmit").css("background-color", "#D9D9D9")
             $(".addsubmit").css("pointer-events", "none");

         } else {

             jQuery(".addsubmit").css("background-color", "#059E67")
             $(".addsubmit").css("pointer-events", "auto");
         }


     }, 100);
 }
 verificareReview()

 function getReview() {
     let url = 'https://magento-demo.tk/rest/V1/products/' + JSON.parse(sessionStorage.getItem('itemIdRew')) + '/reviews';
     let token = sessionStorage.getItem('token');
     let template = '';
     jQuery.ajax({
             method: "GET",
             contentType: "application/json; charset=utf-8",
             dataType: "json",
             url: url,
             headers: { "Authorization": "Bearer " + token }
         }).done(function(result) {

             sessionStorage.setItem('review', JSON.stringify(result.slice(0, 2)));
             for (const [key, value] of Object.entries(result.slice(0, 2))) {

                 template += '<div class="namesirew"><p id="nameReview">' + value.nickname + '</p><div class="rating"><div class="rating-upper" style="width:' + value.rating_percent + '%"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div><div class="rating-lower"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div></div><p id="titleReview">' + value.title + '</p><p id="descReview">' + value.detail + '</p>'
             }
             jQuery('.reviewluat').append(template)


         })
         .fail(function(result) {
             console.log(result)
         })
 };




 function getAllReviewStars() {
     let url = 'https://magento-demo.tk/rest/V1/products/' + JSON.parse(sessionStorage.getItem('itemIdRew')) + '/reviews';
     let token = sessionStorage.getItem('token');
     let stars = [];
     jQuery.ajax({
             method: "GET",
             contentType: "application/json; charset=utf-8",
             dataType: "json",
             url: url,
             headers: { "Authorization": "Bearer " + token }
         }).done(function(result) {

             jQuery("#person").text('(' + result.length + ')');
             for (const [key, value] of Object.entries(result)) {
                 stars.push(value.rating_percent)
             }
             var total = 0;
             for (var i = 0; i < stars.length; i++) {
                 total += stars[i] << 0;
             }
             let percent = total / result.length
             if (result.length > 0) {
                 jQuery('.doi').css('max-width', percent + 'px')
             } else {
                 jQuery('.doi').css('max-width', 0 + 'px')
             }

         })
         .fail(function(result) {
             console.log(result)
         })
 }

 jQuery(".minus").click(function() {
     let input = jQuery(".numere-cantiate");
     let valoare = parseInt(input.val()) - 1;
     valoare = valoare < 1 ? 1 : valoare;
     input.val(valoare);
     input.change();
     return false;
 })
 jQuery(".plus").click(function() {
     let input = jQuery(".numere-cantiate");
     input.val(parseInt(input.val()) + 1);
     input.change();
     return false;
 })



 function randareRelated() {
     let slider = sessionStorage.getItem('related');
     let template = '';
     let url = '';
     if (slider) {
         url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filterGroups][0][filters][0][field]=sku&searchCriteria[filterGroups][0][filters][0][condition_type]=in&searchCriteria[filterGroups][0][filters][0][value]=' + slider;
         jQuery.ajax({
             url: url,
         }).done(function(response) {
             sessionStorage.setItem('relatedProducts', JSON.stringify(response.items))
             relatedReviewStars(value.entity_id, value.sku)
             for (const [key, value] of Object.entries(response.items)) {

                 template += '<div class="card1" data-sku="' + value.sku + '" data-id="' + value.id + '"><a class="fruct " href="https://alexcampean19.github.io/proiect3/detalii?sku=' + value.sku + ' "><img  src="https://magento-demo.tk/media/catalog/product/' + value.media_gallery_entries[0].file + '"></a><div class="detalii "><a href="https://alexcampean19.github.io/proiect2/detalii " class="nume ">' + value.name + '</a><p class="gramaj ">' + value.weight + 'g</p><div class="detalii2 "><p class="pret ">$' + value.price + '</p><div class="stele "><p class="unu "><span>stea</span></p><span>stea</span></p></div><a class="salemb "><span class="mbbuy ">Add to cart</span></a></div></div></div>';
             }
             jQuery('ul.glide__slides').append(template);
             jQuery(document).trigger('slider');
             jQuery('.related').text('Related Product')

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

         }).fail(function(response) {
             console.log(response)
         })
     }
 }

 function relatedReviewStars(prod, sku) {
     let percent = '';
     let stars = [];
     let token = sessionStorage.getItem('token')
     let url = 'https://magento-demo.tk/rest/V1/products/' + prod + '/reviews';
     jQuery.ajax({
             method: "GET",
             contentType: "application/json; charset=utf-8",
             dataType: "json",
             url: url,
             headers: { "Authorization": "Bearer " + token },

         }).done(function(result) {

             $.each(result, function(key, value) {
                 if (value.rating_percent) {
                     stars.push(parseInt(value.rating_percent))
                 }
             })
             if (result.length > 0) {
                 var total = 0;
                 $.each(stars, function(key, value) {
                     total += value
                 })
                 percent = total / result.length;

             } else {
                 percent = 0
             }
             console.log(sku)
             jQuery('.card1[data-sku=' + sku + '] .doi').attr('style', 'max-width:' + percent + '%')
             console.log(percent)
         })
         .fail(function(result) {
             console.log(result)
         })

 }



 jQuery('.addsubmit').click(function() {
     postareReview()
     setTimeout(function() { location.reload(true) }, 3000);

 })

 jQuery(document).on("Loader", function(event) {
     randareHTMLDetaliu();
     randareRelated();
     getReview();
     getAllReviewStars()

     jQuery('.msj').click(function() {
         jQuery(this).hide()
     })
 })