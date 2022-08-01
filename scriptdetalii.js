document.addEventListener('DOMContentLoaded', (event) => {
    let dropDown = document.querySelector('.navbuton');
    let dropDownMenu = document.querySelector('.navbar');
    dropDown.addEventListener('click', () => {
        dropDown.classList.toggle('showmenu');
    });

    document.addEventListener('click', (event) => {
        let element = event.target.classList;
        if (event.target.classList.contains('showdetails')) {
            let elementcarusel = document.querySelector('.showsub-menu');
            if (
                elementcarusel) {
                elementcarusel.classList.toggle("showsub-menu");
            }
            event.target.parentNode.classList.toggle('showsub-menu')
        }
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
    const config = {
        type: 'carousel',
        startAt: 0,
        perView: 4,

        breakpoints: {
            700: { perView: 1 },
            1200: { perView: 2 },
            1400: { perView: 3 },
            1700: { perView: 4 },
        }
    };
    new Glide('.glide', config).mount();



});