import 'babel-polyfill'
import $ from 'jquery'
import 'fullpage.js'
require('perfect-scrollbar/jquery')($);
import './views/TestView'
import InsideFactorsCarousel from './views/InsideFactorsCarousel'
import Doctors from './views/DoctorsShow'

class Application{
    /**
     * Гланый класс приложения
     */
    constructor(){
        console.log('application start');
        let a = new Doctors();
        a.toggle();
        this._init();
    }

    /**
     *
     * @private
     */
    _init(){
        this._initFullPage();
    }

    /**
     *
     * @private
     */
    _initAfterRender(){
        $.fn.fullpage.setAllowScrolling(false, 'right, left');

        this._initPagination();
        new InsideFactorsCarousel();
        this._initViews();
        this._initMobileMenu();
        this._initScrollableBlocks();
        this._initCentersTabs();
        this._initBackground();
        this._initFaqTabs();
        this._initArticleTabs();
        this._events()
    }

    _initBackground(){
        this._$background = $('.background');
    }

    /**
     *
     * @private
     */
    _initMobileMenu(){
        let $menu = $('.menu');
        let $burger = $('.burger');

        $burger.on('click', () => {
            $burger.toggleClass('burger--active');
            $menu.toggleClass('menu--active');
        });

        $menu.find('a').on('click', () => {
            $burger.removeClass('burger--active');
            $menu.removeClass('menu--active');
        });
    }

    /**
     *
     * @private
     */
    _initCentersTabs(){
        let $centerLinks = $('.centers__cities-list a');
        $centerLinks.on('click', function (e) {
            e.preventDefault();
            let $this = $(this);
            let idTab = $this.attr('href');
            $this.closest('.centers__cities-list').slideUp();
            $(idTab).slideDown();
            $('.scrollable-block__content').scrollTop(0).perfectScrollbar('update');
        })
    }

    /**
     *
     * @private
     */
    _initScrollableBlocks(){

        this._$scrollBlock = $('.scrollable-block');
        this._$scrollContent = $('.scrollable-block__content');

        $(window).on('resize', () => {
            this._resizeScrollableBlock();
        });

        this._$scrollContent.perfectScrollbar({
            minScrollbarLength: 140,
            maxScrollbarLength: 140,
            wheelSpeed: 0.5,
            suppressScrollX: true,
        });
    }

    _resizeScrollableBlock() {
        try {
            if (window.innerWidth < 1024) {
                this._$scrollBlock.each(function () {
                    let $this = $(this);
                    //console.log($this.offset().top);
                    if ($this.offset().top > 0 && $this.offset().top <= window.innerHeight) {
                        let height = (window.innerHeight - 70) - $this.offset().top;
                        $this.height(height);
                    }
                });
            } else {
                this._$scrollBlock.height('');
            }
            this._$scrollContent.perfectScrollbar('update');
        }catch(e){
            console.warn('scrollable blocks not ready yet');
        }
    }

    /**
     *
     * @private
     */
    _events(){
        $('.js-btn-func').on('click', (event) => { this._handlerClickFunc(event) });

        $('.js-btn-down').on('click', (event) => { this._handlerClickDown(event) });

        $('.js-btn-top').on('click', function () {
            $.fn.fullpage.moveSectionUp();
        });

        $('.header__logo a').on('click', () => {
            if(this._curSection === 1) {
                $.fn.fullpage.moveTo(1,0);
            }
        });

        this._$btnBack.on('click', () => { this._handlerBack() });
    }

    /**
     *
     * @private
     */
    _handlerBack(){

        if(this._curSection === 5){
            if(this._backCenters()) return;
        }
        $.fn.fullpage.moveSlideLeft();
    }

    _backCenters(){
        let $centerList = $('.centers__cities-list');
        if($centerList.css('display') === 'none') {
            $centerList.slideDown();
            $('.centers__city-info').slideUp();
            $('.scrollable-block__content').scrollTop(0).perfectScrollbar('update');
            return true;
        }
        return false;
    }

    /**
     *
     * @private
     */
    _handlerClickDown(){
        if(!this._isScrollable){
            this._closeFunctionalitySlide();
        }
        $.fn.fullpage.moveSectionDown();
        this._scrollOn();
    }

    /**
     *
     * @private
     */
    _handlerClickFunc(){
        if(!this._isOpenFuncSlide) {
            this._openFunctionalitySlide();
        }else{
            $.fn.fullpage.moveTo(this._curSection, 0);
            //this._closeFunctionalitySlide();
        }
    }

    /**
     *
     * @private
     */
    _openFunctionalitySlide(){
        this._isOpenFuncSlide = true;
        $('.fp-section.active .section__init-func').addClass('section__init-func--active');
        this._$pagination.addClass('pagination--hide');
        this._$background.addClass('background--active');
        this._$btnBack.addClass('btn-back--active');
        $.fn.fullpage.moveSlideRight();
        this._scrollOff();
    }

    /**
     *
     * @private
     */
    _closeFunctionalitySlide(){
        this._isOpenFuncSlide = false;
        $('.fp-section.active .section__init-func').removeClass('section__init-func--active');
        this._$pagination.removeClass('pagination--hide');
        this._$background.removeClass('background--active');
        this._$btnBack.removeClass('btn-back--active');
        $.fn.fullpage.moveTo(this._curSection, 0);
        this._scrollOn();
    }

    /**
     *
     * @private
     */
    _scrollOff(){
        this._isScrollable = false;
        $.fn.fullpage.setMouseWheelScrolling(false);
        $.fn.fullpage.setAllowScrolling(false);
    }

    /**
     *
     * @private
     */
    _scrollOn(){
        $.fn.fullpage.setMouseWheelScrolling(true);
        $.fn.fullpage.setAllowScrolling(true);
        this._isScrollable = true;
    }

    /**
     *
     * @private
     */
    _initFullPage(){
        if(window.location.hash){
            let index = window.location.hash.indexOf('/');
            if(index > 0){
                window.location.hash = window.location.hash.slice(0, index);
            }
        }

        $('#fullpage').fullpage({
            menu: '#pagination, #top-menu',
            controlArrows: false,
            onLeave: (index, nextIndex) => {
                if(this._isOpenFuncSlide){
                    setTimeout(() => {
                        this._closeFunctionalitySlide();
                        $.fn.fullpage.moveTo(nextIndex);
                    }, 100);
                    return false;
                }

                this._curSection = nextIndex;
                this._setPaginationText();

                if(nextIndex === 1){
                    setTimeout(function () {
                        window.history.pushState({},'',window.location.href.slice(0,window.location.href.indexOf('#')));
                    });
                }
            },
            afterLoad: () => {
                this._resizeScrollableBlock();
            },
            afterRender: () => {
                this._initAfterRender();
            },
            onSlideLeave: (anchorLink, index, slideIndex, direction, nextSlideIndex) => {
                if(nextSlideIndex === 0) {
                    if(this._isOpenFuncSlide){
                        this._closeFunctionalitySlide();
                    }
                }
                if(this._curSection === 1 && nextSlideIndex === 0){
                    setTimeout(function () {
                        window.history.pushState({},'',window.location.href.slice(0,window.location.href.indexOf('#')));
                    });
                }
            },
            afterSlideLoad: (anchorLink, index, slideAnchor, slideIndex) => {
                if(slideIndex === 0){
                    if(anchorLink === 'test'){
                        this._views['TestView'].reInit();
                    }
                    if(anchorLink === 'centers'){
                        this._backCenters();
                    }
                }
            }
        });
    }

    /**
     *
     * @private
     */
    _initViews(){
        let views = document.querySelectorAll('[data-view]');
        this._views = [];
        if(views){
            [].forEach.call(views, item => {
                let view = item.getAttribute('data-view');
                if(view){
                    this._views[view] = new (require(`./views/${view}`).default)(item);
                }
            });
        }
    }

    /**
     *
     * @private
     */
    _initPagination(){
        this._curSection = 1;
        this._countSections = document.querySelectorAll('.fp-section').length;
        this._pagination = document.querySelector('.pagination');
        this._$pagination = $(this._pagination);
        this._paginationCounter = this._pagination.querySelector('.pagination__counter');
        this._setPaginationText();
        this._$btnBack = $('.btn-back');
    }

    /**
     *
     * @private
     */
    _setPaginationText(){
        this._paginationCounter.innerHTML = `${this._curSection}/${this._countSections}`;
    }

    /**
     *
     * @private
     */
    _initFaqTabs(){
        let $faqLinks = $('.js-faq-links a');
        $faqLinks.on('click', (e) => {
            e.preventDefault();
            let $this = $(e.target);
            let idFaqContent = $this.attr('href').slice(1);
            $('[data-faq-id]').hide();
            $(`[data-faq-id=${idFaqContent}]`)
                .show()
                .closest('.scrollable-block__content')
                .scrollTop(0);
            this._resizeScrollableBlock();
            $.fn.fullpage.moveSlideRight();
        })
    }

    _initArticleTabs(){
        let $articleLinks = $('.js-articles-links [data-article]');
        $articleLinks.on('click', (e) => {
            e.preventDefault();
            let $this = $(e.currentTarget);
            let idArticleContent = $this.attr('data-article');
            $('[data-article-id]').hide();
            $(`[data-article-id=${idArticleContent}]`)
                .show()
                .closest('.scrollable-block__content')
                .scrollTop(0);
            this._resizeScrollableBlock();
            $.fn.fullpage.moveSlideRight();
        })
    }
}

new Application();
