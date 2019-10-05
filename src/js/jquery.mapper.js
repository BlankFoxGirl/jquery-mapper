/*eslint-env*/
/*jshint esversion: 6*/
/*global $, jQuery, google*/
(function ($) {
    'use strict';
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
            Locations: [],
        };
        this.settings = $.extend(defaultOptions, options);
        if (this.settings.Debug) {
            console.log('Started!', this);
        }

        this.map = null;
        this.markers = [];
        this.infoWindow = null;

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
            if (typeof google === 'undefined') {
                this.importMap();
            } else {
                this.map = new google.maps.Map($('.jquery-mapper-map')[0], {
                    center: this.settings.FocusLocation,
                    zoom: 11,
                    mapTypeId: 'roadmap',
                });
                this.mapMode();
            }
        };

        this.importMap = () => {
            if (this.settings.Debug) {
                console.log('Importing google maps with ' + this.settings.ApiKey);
            }
            let dom = document.createElement('script');
            dom.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.settings.ApiKey;
            document.getElementsByTagName('body')[0].appendChild(dom);
            this.thread = window.setInterval(() => {
                if (typeof google !== 'undefined') {
                    if (this.settings.Debug) {
                        console.log('Successfully lazy loaded google maps. Now we\'ll initiate the map!');
                    }
                    clearInterval(this.thread);
                    this.map = new google.maps.Map($('.jquery-mapper-map')[0], {
                        center: this.settings.FocusLocation,
                        zoom: 11,
                        mapTypeId: 'roadmap',
                    });
                    this.infoWindow = new google.maps.InfoWindow();
                    this.mapMode();
                }
            }, 100);
        };

        this.init();
    };
})(jQuery);
