/**
 * Created by SVYAT on 01.06.2017.
 */

import $ from 'jquery';

class TestView{
    constructor(root){
        this._root = root;

        this._init();
        this._events();
    }

    _init(){
        this._counter = this._root.querySelector('.test__counter');
        this._question = this._root.querySelectorAll('.test__question-item');
        this._paginate = this._root.querySelector('.test__paginate');
        this._paginateItems = [];
        this._currQuestion = 0;
        this._counter.innerHTML = `${this._currQuestion+1} / ${this._question.length}`;

        this._$sectionHeader = $(this._root)
            .closest('.section__content-inner')
            .find('.section__header');
        this._sectionHeaderValue = this._$sectionHeader.text();

        for (let i = 0; i < this._question.length; i++) {
            let paginateItem = document.createElement('div');
            paginateItem.classList.add('test__paginate-item');
            this._paginateItems.push(paginateItem);
            this._paginate.appendChild(paginateItem);
        }
        if(this._paginateItems.length > 0){
            this._paginateItems[0].classList.add('test__paginate-item--active');
        }

        this._answers = [];
    }

    _events(){
        let btnNext = this._root.querySelector('.js-next-question');
        this._defaultValueBtn = btnNext.innerHTML;
        if(btnNext){
            btnNext.addEventListener('click', () => {
                this._question[this._currQuestion].style.display = 'none';
                if(this._currQuestion + 1 < this._question.length){
                    this._currQuestion++;
                    this._question[this._currQuestion].style.display = 'block';
                    this._counter.innerHTML = `${this._currQuestion+1} / ${this._question.length}`;
                    this._paginateItems[this._currQuestion-1].classList.remove('test__paginate-item--active');
                    this._paginateItems[this._currQuestion].classList.add('test__paginate-item--active');
                    if((this._currQuestion + 1) === this._question.length){
                        btnNext.innerHTML = 'Результат'
                    }
                }else{
                    this._root.querySelector('.test__wrapper-test').style.display = 'none';
                    this._root.querySelector('.test__wrapper-result').style.display = 'block';
                    this._$sectionHeader.text(`${this._sectionHeaderValue}: ваш результат`);
                }
            })
        }
    }

    reInit(){
        this._root.querySelector('.test__wrapper-test').style.display = 'block';
        this._root.querySelector('.test__wrapper-result').style.display = 'none';
        let btnNext = this._root.querySelector('.js-next-question');
        btnNext.innerHTML = this._defaultValueBtn;

        if(this._paginateItems.length > 0){
            this._question[this._currQuestion].style.display = 'none';
            this._paginateItems[this._currQuestion].classList.remove('test__paginate-item--active');
            this._paginateItems[0].classList.add('test__paginate-item--active');
            this._question[0].style.display = 'block';
        }
        this._currQuestion = 0;
        this._counter.innerHTML = `${this._currQuestion+1} / ${this._question.length}`;
        this._$sectionHeader.text(this._sectionHeaderValue);
    }
}

export default TestView;
