/*eslint-env*/
/*jshint esversion: 6*/
/*global $, jQuery, google*/
(function ($) {
    'use strict';
    $.fn.mapper = function (options) {
        var defaultOptions = {
            Title: 'Hej!',
            ApiKey: 'YOUR_APIKEY',
            Debug: false,
            Mode: 'default',
            FocusLocation: null,
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
                },
            ],
            googleOptions: {
                center: {
                    lat: -33.863276,
                    lng: 151.107977,
                },
                zoom: 11,
                mapTypeId: 'roadmap',
            }
        };
        this.settings = $.extend(defaultOptions, options);
        if (this.settings.Debug) {
            console.log('Started!', this);
        }

        this.map = null;
        this.markers = [];
        this.infoWindow = new google.maps.InfoWindow();

        this.mapMode = () => {
            switch (this.settings.Mode) {
            case 'Locations':
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
                    var icon = '';
                    if (typeof item.icon !== 'undefined') {
                        icon = '<img src="' + item.icon + '" alt="' + item.name + '" title="' + item.name + '">';
                    }
                    var html = '<div data-marker-index="' + index + '" class="location-item' + ((icon !== '') ? ' icon-supplied' : '') + '">' + icon + '<span class="title">' + item.name + '</span><span class="phone">' + item.phone + '</span><span class="address">' + item.address + '</span><span class="text">' + item.text + '</span></div>';
                    google.maps.event.addListener(marker, 'click', () => {
                        this.infoWindow.setContent(html);
                        this.infoWindow.open(this.map, marker);
                        $('#MapControls').children().each((index, child) => {
                            $(child).removeClass('active');
                        });
                        $('#MapControls>.location-item[data-marker-index=\'' + index + '\']').addClass('active');
                    });
                    this.markers.push(marker);
                    children = children + html;
                    // Populate the controls with clickable options.
                });
                this.append('<div class="jquery-mapper-controls" id="MapControls">' + children + '</div>');
                $('#MapControls>.location-item[data-marker-index]').on('click', (e) => {
                    let markerId = e.currentTarget.getAttribute('data-marker-index');
                    if (this.settings.Debug) {
                        console.log(e.currentTarget, markerId);
                    }
                    this.infoWindow.setContent('<div class="location-item' + ($(e.currentTarget).hasClass('icon-supplied') ? ' icon-supplied' : '') + '">' + $(e.currentTarget).html() + '</div>');
                    this.infoWindow.open(this.map, this.markers[markerId]);
                    $('#MapControls').children().each((index, child) => {
                        if (this.settings.Debug) {
                            console.log(index);
                        }
                        $(child).removeClass('active');
                    });
                    $(e.currentTarget).addClass('active');
                });
                break;
            }
        };

        this.init = () => {
            switch (this.settings.Mode) {
            case 'Locations':
                $(this).addClass('jquery-mapper-container-locations');
                break;
            default:
                break;
            }
            $(this).addClass('jquery-mapper-container');
            $(this).append('<div class="jquery-mapper-map" id="MyMap">lorem</div>');
            if (this.settings.Debug) {
                console.log(this.settings.googleOptions);
            }
            if (this.settings.FocusLocation !== null) {
                this.settings.googleOptions.center = this.settings.FocusLocation;
            }
            this.map = new google.maps.Map($('.jquery-mapper-map')[0], this.settings.googleOptions);
            this.mapMode();
        };

        this.init();
    };
})(jQuery);
