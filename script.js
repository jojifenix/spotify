/* A partir del proyecto Spotify, incluye una caja de texto
   para poder buscar información acerca de una canción. La
   llamada a la API la puedes encontrar aquí:
   https://developer.spotify.com/web-api/search-item/
   Es muy parecido a lo realizado con el artista, pero ahora
   deberás indicar que el tipo de la búsqueda es un track.
   Por ejemplo, para canción "Thriller":
   https://api.spotify.com/v1/search?q thriller&type=track
   Muestra la información que te parezca más relevante.*/



$( document ).ready(function() {
    
   const getUrlParameter = (sParam) => {
     let sPageURL = window.location.search.substring(1),////substring will take everything after the https link and split the #/&
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
   if(accessToken == null || accessToken == "" || accessToken == undefined){
     window.location.replace(redirect);
   }

   
   $( "#search_button" ).click(function() {
     let raw_search_query = $('#search-text').val();
     let search_query = encodeURI(raw_search_query);
     $.ajax({
       url: `https://api.spotify.com/v1/search?q=${search_query}&type=track`,
       type: 'GET',
       headers: {
           'Authorization' : 'Bearer ' + accessToken
       },
       success: function(data) {
         let num_of_tracks = data.tracks.items.length;
         let count = 0;
         const max_songs = 12;
         while(count < max_songs && count < num_of_tracks){
           let id = data.tracks.items[count].id;
           let src_str = `https://open.spotify.com/embed/track/${id}`;
           let iframe = `<div class='song'><iframe src=${src_str} frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>`;
           let parent_div = $('#song_'+ count);
           parent_div.html(iframe);
           count++;
         }
       }
     }); 
   });
 }); 