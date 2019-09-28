            Mode: 'Locations',
        this.mapMode = () => {
            console.log(this[0]);
            switch (this.settings.Mode) {
                case "Locations":
                    this.append('<div class="jquery-mapper-controls" id="MapControls">lorem</div>');
                    break;
            }
        }
            switch (this.settings.Mode) {
                case "Locations":
                    $(this).addClass('jquery-mapper-container-locations');
                    break;
                default:
                    break;
            }
            this.mapMode();
