(function ($) {
    "use strict";
    $.fn.mapper = function (options) {
        var defaultOptions = {
            Title: 'Hej!',
            ApiKey: 'YOUR_APIKEY',
            Debug: true,
            FocusLocation: {
                lat: -33.863276,
                lng: 151.107977,
            },
            MapSize: {
                height: 400,
                width: 400,
            },
            Locations: [
            ],
        };
        this.settings = $.extend(defaultOptions, options);
        if (this.settings.Debug) {
            console.log('Started!', this);
        }

        this.init = () => {
            $(this).addClass('jquery-mapper-container');
            $(this).append('<div class="jquery-mapper-map" id="MyMap">lorem</div>');
            var map = new google.maps.Map($('.jquery-mapper-map')[0], {
                center: this.settings.FocusLocation,
                zoom: 11,
                mapTypeId: 'roadmap',
            });
            var infoWindow = new google.maps.InfoWindow();
        };

        this.init();
    }
})(jQuery);
