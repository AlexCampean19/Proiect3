document.addEventListener('DOMContentLoaded', (event) => {
    let dropDown = document.querySelector('.navbuton');
    let dropDownMenu = document.querySelector('.navbar');
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

    const config = {
        type: 'carousel',
        startAt: 0,
        perView: 7,
        breakpoints: {
            700: { perView: 1 },
            1200: {
                perView: 2
            },
            1400: {
                perView: 4
            },
            1700: {
                perView: 5
            },
            1900: {
                perView: 6
            },

        }



    };
    document.addEventListener('slider', () => {
        new Glide('.glide', config).mount();
        console.log('slider');
    });



})

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