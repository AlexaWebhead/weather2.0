$(function() {
    var currentTime = new Date();
    var hours = currentTime.getHours();

    //var location = prompt('What is your zip code?');
    var weatherURL = 'http://api.wunderground.com/api/5df4bac451f57869/alerts/geolookup/conditions/q/autoip.json';
    //http://api.wunderground.com/api/5df4bac451f57869/alerts/geolookup/conditions/q/99206.json
    $.ajax({
        dataType: "jsonp",
        url: weatherURL,
        success: function(w) {
            console.log(w);
            var $d = $('#weather-display');
            var r = {
                full_loc: w.current_observation.display_location.full + ' ' + w.location.zip,
                city_loc: w.location.city + ', ' + w.location.state,
                obs_loc: w.current_observation.observation_location.city,
                obs_time: w.current_observation.observation_time,
                temp: w.current_observation.temp_f,
                feel: w.current_observation.feelslike_f,
                weather: w.current_observation.weather,
                precip_today: w.current_observation.precip_today_in,
                humidity: w.current_observation.relative_humidity,
                wind: w.current_observation.wind_string,
                icon: w.current_observation.icon,
                icon_url: w.current_observation.icon_url,
                options: _.keys(w.response.features).join(", ")
            }

            //display enabled options
            $('#options').append('<li>'+r.options+'</li>');

            //alert handling
            var alerts = w.alerts;
            if (alerts.length < 1){
                $("#alert-toggle").hide("fast");
            }
            else {
                $("#alert-toggle").click(function(){
                    $(".panel").slideToggle("fast");
                })
            }

            if (alerts.length === 1){
                $(".alert-box").text('There is ' + alerts.length + ' alert.');
            }
            else {
                $(".alert-box").text('There are ' + alerts.length + ' alerts.');
            }

            for (i=0;i<alerts.length;i++){
                var a = alerts[i];
                $("#alert-details").append('<li class="desc"><h4>' + a.description + '</h4></li>');
                $("li.desc").append('<p><strong>Expires:</strong> ' + a.expires + '</p><p>' + a.message + '</p>');
            }

            //weather display options
            $('body').addClass(r.icon);
            if (hours < 20) {
                $("#weather-icon").append('<img src="http://icons.wxug.com/i/c/i/' + r.icon + '.gif" alt="' + r.icon + ' weather icon"/>');
            }
            else {
                $("#weather-icon").append('<img src="http://icons.wxug.com/i/c/i/nt_' + r.icon + '.gif" alt="' + r.icon + ' weather icon"/>');
            };

            $('header h1').text('Today\'s Weather near ' + r.city_loc);
            $d.append('<p><strong>Observation location:</strong> ' + r.obs_loc + '</p>');
            $d.append('<p>' + r.obs_time + '</p>');
            $d.append('<p><strong>Temperature:</strong> ' + r.temp + '&deg;F</p>');
            $d.append('<p><strong>Feels like:</strong> ' + r.feel + '&deg;F</p>');
            $d.append('<p><strong>Weather condition:</strong> ' + r.weather + '</p>');
            $d.append('<p><strong>Precipitation today:</strong> ' + r.precip_today + '"</p>');
            $d.append('<p><strong>Humidity:</strong> ' + r.humidity + '</p>');
            $d.append('<p><strong>Wind:</strong> '+ r.wind + '</p>');
        },
        error: function(){
            alert('Oops, API is bwoken');
        }
    });
});