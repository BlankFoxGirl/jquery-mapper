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
                {
                    name: 'My Location',
                    text: 'We sell cool stuff.',
                    address: '123 Appleberry Way',
                    phone: '08 12134 5678',
                    lat: -33.863276,
                    lng: 151.107977,
                },
                {
                    name: 'My Location 2',
                    text: 'We sell cool stuff.',
                    address: '189 Appleberry Way',
                    phone: '08 12134 5679',
                    lat: -33.782066,
                    lng: 151.101867,
                }
            ],
        };
        this.settings = $.extend(defaultOptions, options);
        if (this.settings.Debug) {
            console.log('Started!', this);
        }

        this.map = null;
        this.markers = [];

        this.mapMode = () => {
            switch (this.settings.Mode) {
                case "Locations":
                    
                    var container = document.createElement('div');
                    container.classList = 'jquery-mapper-controls';
                    container.id = 'MapControls';
                    var children = '';
                    $.each(this.settings.Locations, (index, item) => {
                        // Google map drop pin marker.
                        var latlng = new google.maps.LatLng(
                            parseFloat(item.lat),
                            parseFloat(item.lng)
                        );          
                        var marker = new google.maps.Marker({
                            map: this.map,
                            position: latlng,
                            label: {
                                text: item.name,
                                fontWeight: 'bold',
                            },
                            animation: google.maps.Animation.DROP,
                          });
                          this.markers.push(marker);
                          var icon = '';
                          if (typeof item.icon !== 'undefined') {
                            icon = '<img src="' + item.icon + '" alt="' + item.name + '" title="' + item.name + '">';
                          }
                          children = children + '<div class="location-item' + ((icon !== '') ? ' icon-supplied' : '') + '">' + icon + '<span class="title">' + item.name + '</span><span class="phone">' + item.phone + '</span><span class="address">' + item.address + '</span><span class="text">' + item.text + '</span></div>';
                          // Populate the controls with clickable options.
                        });
                        this.append('<div class="jquery-mapper-controls" id="MapControls">' + children + '</div>');
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
            this.map = new google.maps.Map($('.jquery-mapper-map')[0], {
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
