document.addEventListener('DOMContentLoaded', (event) => {
    let dropDown = document.querySelector('.navbuton');
    dropDown.addEventListener('click', () => {
        dropDown.classList.toggle('showmenu');

    });

    let dropDownMobile = document.querySelector('.mobilebtn');
    let dropDownMenuMobile = document.querySelector('.navigation');
    dropDownMobile.addEventListener('click', () => {

        if (dropDownMobile.classList.toggle('navigation-active')) {
            if (document) {
                document.body.classList.add('scrollblock');
            }
        } else {
            document.body.classList.remove('scrollblock')
        }
    })
})
jQuery('.cart.buttoncart').click(function() {
    jQuery("body").addClass('scrollblock');
    jQuery('.cart.buttoncart').addClass('showshop')

})
jQuery('button.close').click(function() {
    jQuery('body').removeClass('scrollblock');
    jQuery('.cart.buttoncart').removeClass('showshop')
})



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