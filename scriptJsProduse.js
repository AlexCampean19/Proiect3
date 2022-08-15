function randareHtmlSlider() {
    let slider = JSON.parse(sessionStorage.getItem('categorii'));
    if (slider) {
        for (const [key, value] of Object.entries(slider.items)) {
            let url = value.custom_attributes[0].value,
                slide = document.createElement('li'),
                div = document.createElement('div'),
                h3 = document.createElement('h3'),
                link = document.createElement('a'),
                img = document.createElement('img');
            slide.classList.add('glide__slide');
            div.classList.add('card2');
            link.setAttribute('data-id', value.id);
            img.setAttribute('src', 'https://magento-demo.tk' + url);
            img.setAttribute('alt', value.name);
            img.setAttribute('title', value.name);
            h3.innerText = value.name;
            document.querySelector('ul.glide__slides ').appendChild(slide);
            slide.appendChild(div);
            div.appendChild(link);
            link.appendChild(img);
            div.appendChild(h3);
            console.log(url);

        }
        // Create the event.
        var event = document.createEvent('HTMLEvents');
        // Define that the event name is 'build'.
        event.initEvent('slider', true, true);
        // Listen for the event.
        // Target can be any Element or other EventTarget.
        document.dispatchEvent(event);
    }
}



async function randareHTMLProduse() {
    let produse = JSON.parse(sessionStorage.getItem('produse'));
    let categoryId = window.location.search ? window.location.search.replace('?category_id=', '') : '';
    console.log(categoryId);
    if (categoryId) {
        let token = sessionStorage.getItem('token');
        let url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=' + categoryId + '&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes]';
        await apiCall(url, token.replace(/"/g, ''), 'token', 'GET').then(result => {
            console.log(result.items);
            for (const [key, value] of Object.entries(JSON.parse(result).items)) {
                let template = '<div class="card1 "><a class="fruct " href="https://alexcampean19.github.io/proiect3/detalii?sku=' + value.sku + ' "><img  src="https://magento-demo.tk/media/catalog/product/' + value.media_gallery_entries[0].file + '"/></a><div class="detalii "><a href="https://alexcampean19.github.io/proiect2/detalii " class="nume ">' + value.name + '</a><p class="gramaj ">' + value.weight + 'g</p><div class="detalii2 "><p class="pret ">$' + value.price + '</p><div class="stele "><p class="unu "><span>stea</span></p><p class="doi "><span>stea</span></p></div><a class="salemb "><span class="mbbuy ">Add to cart</span></a></div></div>';
                document.querySelector(".cardfructe").innerHTML += template;
            }
        });
    } else {
        if (produse) {
            for (const [key, value] of Object.entries(produse.items)) {

                let template = '<div class="card1 "><a class="fruct " href="https://alexcampean19.github.io/proiect3/detalii?sku=' + value.sku + ' "><img  src="https://magento-demo.tk/media/catalog/product/' + value.media_gallery_entries[0].file + '"/></a><div class="detalii "><a href="https://alexcampean19.github.io/proiect2/detalii " class="nume ">' + value.name + '</a><p class="gramaj ">' + value.weight + 'g</p><div class="detalii2 "><p class="pret ">$' + value.price + '</p><div class="stele "><p class="unu "><span>stea</span></p><p class="doi "><span>stea</span></p></div><a class="salemb "><span class="mbbuy ">Add to cart</span></a></div></div>';
                document.querySelector(".cardfructe").innerHTML += template;

            }
        }
    }
}
randareHTMLProduse();
randareHtmlSlider();