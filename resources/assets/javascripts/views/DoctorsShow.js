/**
 * Created by dmitriy on 02.06.2017.
 */
class Doctors{
    constructor(){

    }
    toggle(){
        $('.center-info__selector').click(function () {
            let parent = $(this).parent();
            var obj = parent.find(".center-info__doctors");
            if(obj.css("display") == 'none'){
                console.log($(this));
                $(this).find('img').addClass("rotate_img");
            }
            else {
                $(this).find('img').removeClass("rotate_img");
            }
            obj.slideToggle("slow");
            obj.css("display","inline-block");
        })
    }
}

export default Doctors