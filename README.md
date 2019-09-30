#  jQuery Mapper v0.0.1

## What is it?
This project is aimed at creating a jQuery plugin which acts as a google maps wrapper enabling the passing of map data in `JSON` format for use on a website by binding to a containing element. The aim is for this plugin to be inately responsive and fully customisable.

## Usage;
- Usage is simple.
Add to your `<head>` tag;
```html
<link ref="stylesheet" href="build/css/[VERSION]-basic.min.css">
```

Add before your `</body>` tag;
```html
<script src="https://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=[API-KEY]"></script>
<script src="build/js/[VERSION]-jquery.mapper.min.js" type="text/javascript" delay></script>
```

### Initialising
Once the requried files are included you can initialise jQuery Mapper like this;
```html
<script>
$(document).ready(() => {
    $("#map").mapper();
});
</script>
```

### Options / Arguements.
Coming soon.

## Requirements;
- SASS (npm install sass)
To compile and minify SASS/SCSS Files.

- Minify (npm install minify)
To minify JS files.

- jQuery (//code.jquery.com/jquery-latest.min.js")
Use the latest version of jQuery.

## Available Modes;
- Default
This will simply render a google map into the bound element with not much else.
- Locations
This will render a google map with controls located to the right hand side, the controls will be populated with locations from the supplied option `Locations` as an array of objects.

## Locations Object Structure;
The locations property is structured as an array of objects using the following format;
```
{
    name: 'My Location',
    text: 'Some cool text...',
    address: '189 Appleberry Way',
    phone: '08 12134 5679',
    lat: -33.782066,
    lng: 151.101867,
    icon: 'path_to_image_override',
}
```
| Property | Type | Details |
| ---      | ---  | ------  |
| name     | String | The name of the location you wish to display, this will be the location's `title` |
| text     | String | A brief description of the location you wish to display. |
| address  | String | The address of the location, used in Geolocation and displayed in the controls. |
| phone    | String | The phone number of the location, this will be formatted to a `TEL` Link. |
| lat      | Float  | The optional latitude of the location, used to override address geolocation. |
| lng      | Float  | The optional longitude of the location, used to override address geolcation. |
| icon     | String | An optional URL / URI to an image that will be displayed in place of the default location SVG icon specified by `$location-item-icon` in the src/scss/variables.scss file. |


## Credits;
- Icons provided by freepik / flaticon.

Author: Sarah Jabado @ Jabado Pty Ltd. 2019