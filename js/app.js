/***** SPOTIFY INITIALIZATION *******/
// initialize spotify stuff
var spotify = new SpotifyAPI();
spotify.login.setClientId('7501ca235761432fac0f01e5d91cee1d');
if (location.hostname == 'localhost') spotify.login.setRedirect('http://localhost:8000/');
else spotify.login.setRedirect('http://ben-tanen.com/Cookbook/');



/******** FUNCTIONS ***************/
// blank function that does nothing
function none() { };

// called by getTracks as callback
function buildSongList(r) {
    getSongData(r.items);
    if (r.next) {
        spotify.general.getURL(r.next, buildSongList, null);
    } else {
        spotify.track.getTracks(playlist_tracks, function(r) {
            r.tracks.forEach(function(t) {
                var output_str = '"' + t.name + '", by ';
                t.artists.forEach(function(a) {
                    output_str += a.name;
                });
                $('#playlist-list').append('<li>' + output_str +'</li>');
            });
        });
    }
}

// called by buildSongList to start the song filtering process
function getSongData(tracks) {
    uris = [ ];
    for (var i = 0; i < tracks.length; i++) {
        uris.push(tracks[i].track.uri.replace('spotify:track:',''));
    }
    spotify.track.getMultipleAudioFeatures(uris, filterSongs, null);
}

function filterSongs(r) {
    var tracks = r.audio_features;

    for (var i = 0; i < tracks.length; i++) {
        var goodSong = true;
        for (var k in preset_params) {
            param = preset_params[k];
            track_val = tracks[i][k];

            if (track_val < param.min || track_val > param.max) {
                goodSong = false;
                break;
            }
        }
        if (goodSong) playlist_tracks.push(tracks[i].id);
    }
}

/****** GLOBAL VARS *********/
var preset_params = {
    danceability: {
        min: 0.8,
        max: 1
    },
    liveness: {
        min: 0,
        max: 0.1
    }
};

var playlist_tracks = [ ];

// check if user is logged in
var logged_in = spotify.login.pullAccessToken(none, false);

// hash of page names and their corresponding id values
var PAGES = {
    login: 'login',
    presets: 'preset-select',
}


$(document).ready(function() {



    // log in code
    $('#login').click(function() {
        scopes = [
            'playlist-read-private',
            'playlist-read-collaborative',
            'playlist-modify-public',
            'playlist-modify-private',
            'user-library-read',
            'user-library-modify',
            'user-read-private',
            'user-read-birthdate',
            'user-read-email',
            'user-follow-read',
            'user-follow-modify',
            'user-top-read'
        ];
        spotify.login.openLogin(scopes);
    });

    if (logged_in) {
        console.log('user logged in');
        setPage(PAGES['presets']);
    } else {
        setPage(PAGES['login']);
    }

    $('button#build').click(function() {
        console.log('you clicked the button');
        spotify.library.getTracks('US', buildSongList, null);
    });


    // In order to setup a page change on click in html, add a data-dest
    // attribute to the link or button, where the value of data-dest is the id
    // of the page you want to show.

    $('.page a, .page button').filter('[data-dest]').click(function() {
        setPage($(this).data('dest'));
    })

    // hides all pages, and then shows the page with id = newPage
    function setPage(newPage) {
        $('.page').hide();
        if (newPage != PAGES['presets'] || logged_in) {
            $('#' + newPage).show();
        }
    }
});
