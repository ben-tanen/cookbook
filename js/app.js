// initialize spotify stuff
var spotify = new SpotifyAPI();
spotify.login.setClientId('7501ca235761432fac0f01e5d91cee1d');
spotify.login.setRedirect('http://localhost:8000/');

// blank function that does nothing
function none() { };

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

    // check if user is logged in
    if (spotify.login.pullAccessToken(none, false)) {
        console.log('user logged in');
    }
});