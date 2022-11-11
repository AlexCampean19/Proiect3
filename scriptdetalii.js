document.addEventListener('DOMContentLoaded', (event) => {
    let dropDown = document.querySelector('.navbuton');
    dropDown.addEventListener('click', () => {
        dropDown.classList.toggle('showmenu');

    });
    let shopDrop = document.querySelector('.cart.buttoncart');
    shopDrop.addEventListener('click', () => {
        shopDrop.classList.toggle('showshop');

    });
    if (window.innerWidth < 1024) {
        let shopDrop = document.querySelector('.cart.buttoncart');
        shopDrop.addEventListener('click', () => {
            document.body.classList.add('scrollblock');
            let butonclos = document.querySelector("button.close");
            butonclos.addEventListener('click', () => {
                document.body.classList.remove('scrollblock');
                shopDrop.classList.remove('showshop')
            })
        })
    }


    document.addEventListener('click', (event) => {
        let element = event.target.classList;
        if (event.target.classList.contains('showdetails')) {
            let elementcarusel = document.querySelector('.showsub-menu');
            if (elementcarusel) {
                elementcarusel.classList.toggle("showsub-menu");

            }
            event.target.parentNode.classList.toggle('showsub-menu')
        }
    });
    let dropDownMobile = document.querySelector('.mobilebtn');
    dropDownMobile.addEventListener('click', () => {
        if (dropDownMobile.classList.toggle('navigation-active')) {
            if (document) {
                document.body.classList.add('scrollblock');
            }
        } else {
            document.body.classList.remove('scrollblock')
        }
    });



    function WindowResize() {
        if (window.innerWidth > 1024) {
            let navigation = document.querySelector('.navigation-active'),
                scrollblock = document.querySelector('.scrollblock');
            shopactive = document.querySelector('.showshop')

            if (navigation || shopactive) {
                document.querySelector('.navigation-active').classList.remove('navigation-active');
                document.querySelector('.showshop').classList.remove('showshop')
            }
            if (scrollblock) {
                document.querySelector('.scrollblock').classList.remove('scrollblock');
            }
        }
    }
    window.addEventListener('resize', WindowResize);


});