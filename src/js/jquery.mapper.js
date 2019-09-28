(function ($) {
    "use strict";
    $.fn.mapper = function (options) {
        var defaultOptions = {
            Title: 'Hej!',
            ApiKey: 'YOUR_APIKEY',
            Debug: true,
            Mode: 'Locations',
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

        this.mapMode = () => {
            console.log(this[0]);
            switch (this.settings.Mode) {
                case "Locations":
                    this.append('<div class="jquery-mapper-controls" id="MapControls">lorem</div>');
                    break;
            }
        }

        this.init = () => {
            switch (this.settings.Mode) {
                case "Locations":
                    $(this).addClass('jquery-mapper-container-locations');
                    break;
                default:
                    break;
            }
            $(this).addClass('jquery-mapper-container');
            $(this).append('<div class="jquery-mapper-map" id="MyMap">lorem</div>');
            var map = new google.maps.Map($('.jquery-mapper-map')[0], {
                center: this.settings.FocusLocation,
                zoom: 11,
                mapTypeId: 'roadmap',
            });
            var infoWindow = new google.maps.InfoWindow();
            this.mapMode();
        };

        this.init();
    }
})(jQuery);
