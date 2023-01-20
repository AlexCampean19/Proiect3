document.addEventListener('DOMContentLoaded', (event) => {
    let dropDown = document.querySelector('.navbuton');
    dropDown.addEventListener('click', () => {
        dropDown.classList.toggle('showmenu');

    });
    jQuery('.cart.buttoncart').click(function() {

        jQuery('.cart.buttoncart').addClass('showshop')
    })
    jQuery('button.close').click(function() {

        jQuery('.cart.buttoncart').removeClass('showshop')
    })


    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('showdetails')) {
            let elementcarusel = document.querySelector('.showsub-menu');
            if (elementcarusel) {
                elementcarusel.classList.toggle("showsub-menu");

            }
            event.target.parentNode.classList.toggle('showsub-menu')


        }
    });





    function WindowResize() {
        if (window.innerWidth > 1024) {
            let navigation = document.querySelector('.navigation-active'),
                scrollblock = document.querySelector('.scrollblock');
            if (navigation) {
                document.querySelector('.navigation-active').classList.remove('navigation-active');
            }
            if (scrollblock) {
                document.querySelector('.scrollblock').classList.remove('scrollblock');
            }
        }
    }
    window.addEventListener('resize', WindowResize);


});