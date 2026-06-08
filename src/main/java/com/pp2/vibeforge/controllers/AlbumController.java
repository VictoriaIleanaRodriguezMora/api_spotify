package com.pp2.vibeforge.controllers;

import com.pp2.vibeforge.models.Album;
import com.pp2.vibeforge.repositories.AlbumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/albumes")
@CrossOrigin(origins = "*")
public class AlbumController {

    @Autowired
    private com.pp2.vibeforge.repositories.CancionRepository cancionRepository;

    @Autowired
    private AlbumRepository albumRepository;

    @GetMapping
    public List<Album> obtenerTodos() {
        return albumRepository.findAll();
    }

    // Ruta para Buscar álbumes de un artista específico
    @GetMapping("/artista/{idArtista}")
    public List<Album> obtenerPorArtista(@PathVariable Integer idArtista) {
        return albumRepository.findByIdArtista(idArtista);
    }

    // BUSCAR PORTADA DE ÁLBUM EN DEEZER
    @GetMapping("/{id}/imagen")
    public org.springframework.http.ResponseEntity<String> obtenerImagenDeezer(@PathVariable Integer id) {
        Album album = albumRepository.findById(id).orElseThrow();

        try {

            String tituloAlbum = album.getTitulo();

            // Buscamos en Deezer por tipo "album"
            String urlDeezer = "https://api.deezer.com/search/album?q="
                    + java.net.URLEncoder.encode(tituloAlbum, "UTF-8");

            java.net.URL url = java.net.URI.create(urlDeezer).toURL();
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0");

            java.io.BufferedReader reader = new java.io.BufferedReader(
                    new java.io.InputStreamReader(conn.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String linea;
            while ((linea = reader.readLine()) != null)
                sb.append(linea);
            reader.close();

            String json = sb.toString();

            String buscar = "\"cover_xl\":\"";
            int inicio = json.indexOf(buscar);
            if (inicio != -1) {
                inicio += buscar.length();
                int fin = json.indexOf("\"", inicio);
                String imageUrl = json.substring(inicio, fin).replace("\\/", "/");

                album.setImagenUrl(imageUrl);
                albumRepository.save(album);

                return org.springframework.http.ResponseEntity.ok(imageUrl);
            }

        } catch (Exception e) {
            System.out.println("Error buscando álbum en Deezer: " + e.getMessage());
        }

        String discoSilueta = "https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021";
        album.setImagenUrl(discoSilueta);
        albumRepository.save(album);

        return org.springframework.http.ResponseEntity.ok(discoSilueta);
    }


    @GetMapping("/{id}/sincronizar-canciones")
    public org.springframework.http.ResponseEntity<?> sincronizarCanciones(@PathVariable Integer id) {
        Album album = albumRepository.findById(id).orElseThrow();
        
        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            
            String urlBusqueda = "https://api.deezer.com/search/album?q=" + java.net.URLEncoder.encode(album.getTitulo(), "UTF-8");
            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> respuestaDeezer = restTemplate.getForObject(urlBusqueda, java.util.Map.class);
            
            if (respuestaDeezer == null || !respuestaDeezer.containsKey("data")) {
                return org.springframework.http.ResponseEntity.ok("0");
            }

            @SuppressWarnings("unchecked")
            java.util.List<java.util.Map<String, Object>> dataAlbumes = (java.util.List<java.util.Map<String, Object>>) respuestaDeezer.get("data");
            if (dataAlbumes.isEmpty()) {
                return org.springframework.http.ResponseEntity.ok("0");
            }

            String deezerAlbumId = dataAlbumes.get(0).get("id").toString();

            String urlTracks = "https://api.deezer.com/album/" + deezerAlbumId + "/tracks";
            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> respuestaTracks = restTemplate.getForObject(urlTracks, java.util.Map.class);

            if (respuestaTracks != null && respuestaTracks.containsKey("data")) {
                @SuppressWarnings("unchecked")
                java.util.List<java.util.Map<String, Object>> tracks = (java.util.List<java.util.Map<String, Object>>) respuestaTracks.get("data");
                
                java.util.List<com.pp2.vibeforge.models.Cancion> existentes = cancionRepository.findByIdAlbum(album.getIdAlbum());
                int agregadas = 0;

                for (java.util.Map<String, Object> track : tracks) {
                    String tituloTrack = track.get("title").toString();
                    
                    boolean yaExiste = existentes.stream().anyMatch(c -> c.getTitulo().equalsIgnoreCase(tituloTrack));
                    
                    if (!yaExiste) {
                        com.pp2.vibeforge.models.Cancion nueva = new com.pp2.vibeforge.models.Cancion();
                        nueva.setTitulo(tituloTrack);
                        nueva.setDuracion(Integer.parseInt(track.get("duration").toString()));
                        nueva.setIdAlbum(album.getIdAlbum());
                        nueva.setIdArtista(album.getIdArtista());
                        nueva.setDescripcion("Importado automáticamente");
                        
                        cancionRepository.save(nueva);
                        agregadas++;
                    }
                }
                return org.springframework.http.ResponseEntity.ok(agregadas);
            }
            return org.springframework.http.ResponseEntity.ok(0);

        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Optional <com.pp2.vibeforge.models.Album> obtenerPorId(@PathVariable Integer id) {
        return albumRepository.findById(id);
    }

    @PostMapping
    public Album crearAlbum(@RequestBody Album album) {
        return albumRepository.save(album);
    }

    @DeleteMapping("/{id}")
    public void borrarAlbum(@PathVariable Integer id) {
        albumRepository.deleteById(id);
    }
}