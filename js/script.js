$(function() {
    var currentTime = new Date();
    var hours = currentTime.getHours();

    //var location = prompt('What is your zip code?');
    var weatherURL = 'http://api.wunderground.com/api/5df4bac451f57869/yesterday/forecast/alerts/geolookup/conditions/q/autoip.json';
    //http://api.wunderground.com/api/5df4bac451f57869/alerts/geolookup/conditions/q/99206.json
    $.ajax({
        dataType: "jsonp",
        url: weatherURL,
        success: function(w) {
            console.log(w);
            var $d = $('#weather-display');
            var $w = w.current_observation;
            var $f = w.forecast.simpleforecast.forecastday[1];
            var $y = w.history.observations[0];
            var r = {
                //full_loc: $w.display_location.full + ' ' + w.location.zip,
                url: $w.forecast_url,
                city_loc: w.location.city + ', ' + w.location.state,
                obs_loc: $w.observation_location.city,
                obs_time: $w.observation_time,
                temp: $w.temp_f,
                feel: $w.feelslike_f,
                weather: $w.weather,
                precip_today: $w.precip_today_in,
                humidity: $w.relative_humidity,
                wind: $w.wind_mph + 'mph ' + $w.wind_dir,
                icon: $w.icon,
                icon_url: $w.icon_url,
                yday_mon: $y.utcdate.mon,
                yday_day: $y.utcdate.mday,
                yday_temp: $y.tempi,
                fcast_high: $f.high.fahrenheit,
                fcast_low: $f.low.fahrenheit
            }

            //alert handling
            var alerts = w.alerts;
            if (alerts.length > 1){
                $("#alert-toggle").click(function(){
                    $(".panel").show("slow");
                })
            }
            if (alerts.length === 1){
                $(".alert-box").text('There is ' + alerts.length + ' alert.');
            } else {
                $(".alert-box").text('There are ' + alerts.length + ' alerts.');
            }
            for (i=0;i<alerts.length;i++){
                var a = alerts[i];
                $("#alert-details").append('<li class="desc"><h4>' + a.description + '</h4></li>');
                $("li.desc").append('<p><strong>Expires:</strong> ' + a.expires + '</p><p>' + a.message + '</p>');
            }

            //weather display options
            $('body').addClass(r.icon);
            if (hours < 20 && hours > 6){
                $("#weather-icon").append('<img src="http://icons.wxug.com/i/c/i/' + r.icon + '.gif" alt="' + r.weather + ' weather icon" title="' + r.weather + '"/>');
            } else {
                $("#weather-icon").append('<img src="http://icons.wxug.com/i/c/i/nt_' + r.icon + '.gif" alt="' + r.weather + ' weather icon" title="' + r.weather + '"/>');
            };
            $('header span').append('near ' + '<a href="' + r.url + '" target="_blank" title="' + r.obs_loc + '">' + r.city_loc + '</a>');
            $('header h1').append('<br><small>' + r.obs_time + '</small>');
            $d.append('<div id="temp" class="large-4 small-6 columns"><p>' + r.temp + '&deg;F</p></div>',
                '<div id="precip" class="large-4 small-6 columns"><p>' + r.precip_today + '"</p></div>',
                '<div id="humidity" class="large-4 small-6 columns"><p>' + r.humidity + '</p></div>',
                '<div id="wind" class="large-4 small-6 columns"><p>'+ r.wind + '</p></div>');
            //weather history + current compare
            //$('#history').append('<p>' + r.yday_mon + '/' + r.yday_day + ': ' + r.yday_temp + 'F</p>');
            if (r.temp < r.yday_temp){
                $('#yday').addClass("colder");
                $('#yday span').append('colder');
            } else if (r.temp == r.yday_temp){
                $('#yday span').append('equal to');
            } else {
                $('#yday').addClass("warmer");
                $('#yday span').append('warmer');
            }
            var fcast_temp = (parseInt(r.fcast_high) + parseInt(r.fcast_low))/2;
            if (r.temp < fcast_temp){
                $('#future').addClass("colder");
                $('#future span').append('colder');
            } else if (r.temp == fcast_temp){
                $('#future span').append('equal to');
            } else {
                $('#future').addClass("warmer");
                $('#future span').append('warmer');
            }
        },
        error: function(){
            alert('Oops, zee API is bwoken');
        }
    });
});