
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
let owlCarousel = require('owl.carousel');

class InsideFactorsCarousel{
    constructor(){
        let factorSlider = $('.factors-slider__wrapper-items');
        factorSlider.owlCarousel({
            items: 1,
            loop: true,
            dots: true,
            dotsContainer: '.factors-slider__dots',
            nav: false,
            //navContainerClass: 'factors-slider__navigation',
            //navClass: ["factors-slider__nav-prev", "factors-slider__nav-next"],
            autoHeight: false
        });
        $('.factors-slider__nav-next').click(function() {
            factorSlider.trigger('next.owl.carousel');
        })
        // Go to the previous item
        $('.factors-slider__nav-prev').click(function() {
            // With optional speed parameter
            // Parameters has to be in square bracket '[]'
            factorSlider.trigger('prev.owl.carousel', [300]);
        })
    }
}

export default InsideFactorsCarousel;