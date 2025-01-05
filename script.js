/* A partir del proyecto Spotify, incluye una caja de texto
   para poder buscar información acerca de una canción. La
   llamada a la API la puedes encontrar aquí:
   https://developer.spotify.com/web-api/search-item/
   Es muy parecido a lo realizado con el artista, pero ahora
   deberás indicar que el tipo de la búsqueda es un track.
   Por ejemplo, para canción "Thriller":
   https://api.spotify.com/v1/search?q thriller&type=track
   Muestra la información que te parezca más relevante.*/


$(document).ready(function () {

    const getUrlParameter = (sParam) => {
        let sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split('#') : [],
            sParameterName,
            i;
        let split_str = window.location.href.length > 0 ? window.location.href.split('#') : [];
        sURLVariables = split_str != undefined && split_str.length > 1 && split_str[1].length > 0 ? split_str[1].split('&') : [];
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    const accessToken = getUrlParameter('access_token');

    let client_id = "affbae1e92c946faa5859434a9805712";
    let redirect_uri = encodeURIComponent("https://sdeenis.github.io/spotify/");
    const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;

    if (accessToken == null || accessToken == "" || accessToken == undefined) {
        window.location.replace(redirect);
    }

    $('#form').on('submit', function (e) {
        e.preventDefault();
        let search = $('#campo').val();
        let searchQuery = encodeURI(search);
        $.ajax({
            url: 'https://api.spotify.com/v1/search?q=' + searchQuery + '&type=track',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            success: function (response) {
                console.log(response);
                let track = response.tracks.items[0];
                console.log(track);

                // Convertir duración de milisegundos a formato "min:seg"
                let duration_ms = track.duration_ms;
                let minutes = Math.floor(duration_ms / 60000);
                let seconds = Math.floor((duration_ms % 60000) / 1000).toString().padStart(2, '0');
                let duration = `${minutes}:${seconds}`;

                $('#resultado').html(`
                    <h1>Canción: ${track.name}</h1>
                    <img src="${track.album.images[0].url}" alt="${track.name}">
                    <p><b>Artista:</b> ${track.artists[0].name}</p>
                    <p><b>Álbum:</b> ${track.album.name}</p>
                    <p><b>Duración:</b> ${duration}</p>
                    <p><b>Popularidad:</b> ${track.popularity}/100</p>
                    <a href="${track.external_urls.spotify}" target="_blank">
                        Escuchar en Spotify
                    </a>
                `);

               
            }
        });
    });
});
