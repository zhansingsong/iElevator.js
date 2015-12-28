require.config({　　
    paths: {　　　　
        "jquery": "js/jquery-1.8.2",
        "ielevator": "iElevator"　　
    }
});
require(["ielevator"], function() {
    $('#elevator').ielevator({
        floors: $('.js-floor'),
        btns: $('#elevator .js-btn'),
        backtop: $('#elevator .js-backtop'),
        selected: 'selected',
        // visible: {isHide: 'yes', numShow: 400},
        show: function() {
            $('#elevator').slideDown(400);
        },
        hide: function() {
            $('#elevator').slideUp(400);
        }
    });
});
