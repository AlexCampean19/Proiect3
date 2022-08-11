async function randareHTMLDetaliu() {
    let produse = JSON.parse(sessionStorage.getItem('produse'));
    let categorySku = window.location.search ? window.location.search.replace('?sku=', '') : '';

    console.log(categorySku);
    if (categorySku) {
        let token = sessionStorage.getItem('token');
        let url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]=' + categorySku + '&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes]';
        await apiCall(url, token.replace(/"/g, ''), 'token', 'GET').then(result => {
            console.log(result.items);
            for (const [key, value] of Object.entries(JSON.parse(result).items)) {
                let descriere = value.custom_attributes[12].value;
                let template = ' <div class="buc1"><img src="https://magento-demo.tk/media/catalog/product/' + value.media_gallery_entries[0].file + '"/></div><div class="buc2"><h1>' + value.name + '</h1> <div class="rating"><div class="stele"><p class="unu"><span>stea</span></p><p class="doi"><span>stea</span></p><p>(49)</p></div><div class="preturi2"><p>$' + value.price + '</p></div></div><p class="detaliu">' + descriere + '</p><h4>Quantity</h4><div class="but2"><div class="butoane"><button type="button" class="minus"><span>minus</span></button><input class="numere-cantiate" type="number" name="quantity" value="1"><button type="button" class="plus"> <span>plus</span></button></div><a href="/" class="salemb"><span>Add to cart </span></a></div></div>';
                document.querySelector(".bucati").innerHTML += template;
            }
        });
    } else {
        if (produse) {
            for (const [key, value] of Object.entries(produse.items)) {
                let descriere = value.custom_attributes[12].value;
                let template = ' <div class="buc1"><img src="https://magento-demo.tk/media/catalog/product/' + value.media_gallery_entries[0].file + '"/></div><div class="buc2"><h1>' + value.name + '</h1> <div class="rating"><div class="stele"><p class="unu"><span>stea</span></p><p class="doi"><span>stea</span></p><p>(49)</p></div><div class="preturi2"><p>$' + value.price + '</p></div></div><p class="detaliu">' + descriere + '</p><h4>Quantity</h4><div class="but2"><div class="butoane"><button type="button" class="minus"><span>minus</span></button><input class="numere-cantiate" type="number" name="quantity" value="1"><button type="button" class="plus"> <span>plus</span></button></div><a href="/" class="salemb"><span>Add to cart </span></a></div></div>';
                document.querySelector(".bucati").innerHTML += template;
            }
        }
    }
}

randareHTMLDetaliu();