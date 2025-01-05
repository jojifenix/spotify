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
    let client_id = '7205d00e7c964f58a560668a763ff3c7';
    let redirect_uri = encodeURIComponent("https://jojifenix.github.io/spotify/");
  
    const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;
    if (accessToken == null || accessToken == "" || accessToken == undefined) {
      window.location.replace(redirect);
    }
  
    $("#search_button").click(function () {
      let raw_search_query = $('#search-text').val();
      let search_query = encodeURI(raw_search_query);
      $.ajax({
        url: `https://api.spotify.com/v1/search?q=${search_query}&type=track&limit=1`, // Limitamos a 1 resultado
        type: 'GET',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        success: function (data) {
          if (data.tracks.items.length > 0) {
            let track = data.tracks.items[0]; // Solo tomamos el primer resultado
            let id = track.id;
            let src_str = `https://open.spotify.com/embed/track/${id}`;
            let name = track.name;
            let artist = track.artists.map(artist => artist.name).join(", ");
            let album = track.album.name;
            let duration_ms = track.duration_ms;
            let duration_min = Math.floor(duration_ms / 60000);
            let duration_sec = Math.floor((duration_ms % 60000) / 1000).toString().padStart(2, '0');
            let duration = `${duration_min}:${duration_sec}`;
            let popularity = track.popularity;
  
            // Género no está directamente en la información de la pista, se necesita una llamada adicional
            // Aquí simplificamos mostrando la información básica
            let songInfoHTML = `
              <div class='song'>
                <iframe src=${src_str} frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                <p><strong>Canción:</strong> ${name}</p>
                <p><strong>Artista:</strong> ${artist}</p>
                <p><strong>Álbum:</strong> ${album}</p>
                <p><strong>Duración:</strong> ${duration}</p>
                <p><strong>Popularidad:</strong> ${popularity}/100</p>
              </div>
            `;
            $('#song-list').html(songInfoHTML); // Reemplazamos todo el contenido del contenedor
          } else {
            $('#song-list').html("<p>No se encontraron resultados para tu búsqueda.</p>");
          }
        }
      });
    });
  });
  