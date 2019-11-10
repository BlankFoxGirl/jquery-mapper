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
            Locations: [],
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
        this.infoWindow = null;
        this.radius = null;

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
                $('.mapper-radius-dropdown').on('change', (e) => {
                    this.setRadius(e.currentTarget.value);
                });
                $('.mapper-location-name').on('change', (e) => {
                    this.searchLocationNames(e.currentTarget.value);
                });
                break;
            }
        };

        this.init = () => {
            switch (this.settings.Mode) {
            case 'Locations':
                $(this).addClass('jquery-mapper-container-locations');
                $(this).prepend('<div class="mapper-location-search"><input class="mapper-location-name" type="text" placeholder="Location Name"><select class="mapper-radius-dropdown"><option value="">Default</option><option value="100">100km</option><option value="50">50km</option><option value="20">20km</option><option value="10">10km</option><option value="2">2km</option></select></div>');
                break;
            default:
                break;
            }
            $(this).addClass('jquery-mapper-container');
            $(this).append('<div class="jquery-mapper-map" id="MyMap">lorem</div>');
            if (typeof google === 'undefined') {
                this.importMap();
            } else {
                if (this.settings.Debug) {
                    console.log(this.settings.googleOptions);
                }
                if (this.settings.FocusLocation !== null) {
                    this.settings.googleOptions.center = this.settings.FocusLocation;
                }
                this.map = new google.maps.Map($('.jquery-mapper-map')[0], this.settings.googleOptions);
                this.infoWindow = new google.maps.InfoWindow();
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
                    if (this.settings.Debug) {
                        console.log(this.settings.googleOptions);
                    }
                    if (this.settings.FocusLocation !== null) {
                        this.settings.googleOptions.center = this.settings.FocusLocation;
                    }
                    this.map = new google.maps.Map($('.jquery-mapper-map')[0], this.settings.googleOptions);
                    this.infoWindow = new google.maps.InfoWindow();
                    this.mapMode();
                }
            }, 100);
        };

        this.setRadius = (radius) => {
            // Performa a simple calculation to display locations within the radius (KM) around the centerpoint of the map.
            console.log('set radius to', radius);
            if (radius === null) {
                // Reset markers.
                console.log('Reset all');
                this.map.setZoom(11);
                for (let i = 0; i < this.markers.length; i++) {
                    this.markers[i].visible = true;
                }
                $('.location-item').show();
                return;
            }

            const r = (isNaN(parseInt(radius))) ? null : parseInt(radius);
            if (r === null) {
                console.log('Reset all');
                // Reset markers.
                this.map.setZoom(11);
                for (let i = 0; i < this.markers.length; i++) {
                    this.markers[i].visible = true;
                }
                $('.location-item').show();
                return;
            }

            const degCalc = 1 / 110;  // 1 LAT/Long deg ~= 110 KM.
            const latMin = this.map.center.lat() - (degCalc * r);
            const latMax = this.map.center.lat() + (degCalc * r);
            const lngMin = this.map.center.lng() - (degCalc * r);
            const lngMax = this.map.center.lng() + (degCalc * r);
            for (let i = 0; i < this.markers.length; i++) {
                if (
                    (
                        this.markers[i].position.lat() <= latMax &&
                        this.markers[i].position.lat() >= latMin
                    ) &&
                    (
                        this.markers[i].position.lng() <= lngMax &&
                        this.markers[i].position.lng() >= lngMin
                    )
                ) {
                    $('#MapControls>.location-item[data-marker-index="' + i + '"]').show();
                    console.log('Found', this.markers[i]);
                    this.markers[i].visible = true;
                } else {
                    $('#MapControls>.location-item[data-marker-index="' + i + '"]').hide();
                    this.markers[i].visible = false;
                    console.log('Remove', this.markers[i]);
                }
            }

            let zoom = 11;
            switch (r) {
            case 2:
                zoom = 15;
                break;
            case 10:
                zoom = 11;
                break;
            case 20:
                zoom = 10.5;
                break;
            case 50:
                zoom = 9.75;
                break;
            case 100:
                zoom = 9;
                break;
            }

            this.map.setZoom(zoom);
            this.radius = r;
        };

        this.searchLocationNames = (name) => {
            let found = 0;
            let foundIndex = 0;

            if (name === null) {
                console.log('Reset all');
                // Reset markers.
                this.map.setZoom(11);
                for (let i = 0; i < this.markers.length; i++) {
                    this.markers[i].visible = true;
                }
                $('.location-item').show();
                return;
            }

            for (let i = 0; i < this.markers.length; i++) {
                if (this.markers[i].label.text.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
                    this.markers[i].visible = true;
                    $('#MapControls>.location-item[data-marker-index="' + i + '"]').show();
                    found ++;
                    foundIndex = i;
                } else {
                    this.markers[i].visible = false;
                    $('#MapControls>.location-item[data-marker-index="' + i + '"]').hide();
                }
            }

            if (found === 1) {
                this.map.setCenter(this.markers[foundIndex].position);
                this.map.setZoom(15);
            } else {
                // Do jitter to force map refresh.
                this.map.setCenter(this.settings.googleOptions.center);
                if (this.map.zoom === 11) {
                    this.map.setZoom(11.5);
                } else {
                    this.map.setZoom(11);
                }
            }
        };

        this.init();
    };
})(jQuery);
