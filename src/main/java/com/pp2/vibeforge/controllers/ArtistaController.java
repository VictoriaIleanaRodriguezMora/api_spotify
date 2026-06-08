package com.pp2.vibeforge.controllers;

import com.pp2.vibeforge.models.Artista;
import com.pp2.vibeforge.repositories.ArtistaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/artistas")
@CrossOrigin(origins = "*")
public class ArtistaController {

    @Autowired
    private ArtistaRepository artistaRepository;

    @GetMapping
    public List<Artista> obtenerTodos() {
        return artistaRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Artista> obtenerPorId(@PathVariable Integer id) {
        return artistaRepository.findById(id);
    }

    @GetMapping("/{id}/imagen")
    public org.springframework.http.ResponseEntity<String> obtenerImagenDeezer(@PathVariable Integer id) {
        Artista artista = artistaRepository.findById(id).orElseThrow();

        try {
            String nombre = artista.getNombreArtistico();
            String urlDeezer = "https://api.deezer.com/search/artist?q=" + java.net.URLEncoder.encode(nombre, "UTF-8");

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

            String buscar = "\"picture_xl\":\"";
            int inicio = json.indexOf(buscar);
            if (inicio != -1) {
                inicio += buscar.length();
                int fin = json.indexOf("\"", inicio);
                String imageUrl = json.substring(inicio, fin).replace("\\/", "/");

                artista.setImagenUrl(imageUrl);
                artistaRepository.save(artista);

                return org.springframework.http.ResponseEntity.ok(imageUrl);
            }

        } catch (Exception e) {
            System.out.println("Error buscando en Deezer: " + e.getMessage());
        }

        String silueta = "https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021";
        artista.setImagenUrl(silueta);
        artistaRepository.save(artista);

        return org.springframework.http.ResponseEntity.ok(silueta);
    }

    @PostMapping
    public Artista crearArtista(@RequestBody Artista artista) {
        return artistaRepository.save(artista);
    }

    @PostMapping("/importar")
    public org.springframework.http.ResponseEntity<?> importarArtistaCompleto(@RequestParam String nombreArtista) {
        
        List<Artista> existentes = artistaRepository.findAll();
        boolean yaExiste = existentes.stream().anyMatch(a -> a.getNombreArtistico().equalsIgnoreCase(nombreArtista));
        if (yaExiste) {
            return org.springframework.http.ResponseEntity.badRequest().body("El artista ya existe en Vibeforge.");
        }

        RestTemplate restTemplate = new RestTemplate();
        
        try {
            String urlBusquedaArtista = "https://api.deezer.com/search/artist?q=" + java.net.URLEncoder.encode(nombreArtista, "UTF-8");
            
            @SuppressWarnings("unchecked")
            Map<String, Object> respuestaDeezer = restTemplate.getForObject(urlBusquedaArtista, Map.class);
            
            if (respuestaDeezer == null || !respuestaDeezer.containsKey("data")) {
                return org.springframework.http.ResponseEntity.badRequest().body("No se encontró al artista en Deezer.");
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> dataArtista = (List<Map<String, Object>>) respuestaDeezer.get("data");
            if (dataArtista.isEmpty()) {
                return org.springframework.http.ResponseEntity.badRequest().body("No se encontró al artista en Deezer.");
            }

            Map<String, Object> datosPrimerArtista = dataArtista.get(0);
            String idDeezerArtista = datosPrimerArtista.get("id").toString();
            
            Artista nuevoArtista = new Artista();
            nuevoArtista.setNombreArtistico(datosPrimerArtista.get("name").toString());
            nuevoArtista.setImagenUrl(datosPrimerArtista.get("picture_xl").toString());
            nuevoArtista.setGeneroMusical("Pop/Rock"); 
            
            artistaRepository.save(nuevoArtista);

            String urlAlbumes = "https://api.deezer.com/artist/" + idDeezerArtista + "/albums?limit=3";
            
            @SuppressWarnings("unchecked")
            Map<String, Object> respuestaAlbumes = restTemplate.getForObject(urlAlbumes, Map.class);

            if (respuestaAlbumes != null && respuestaAlbumes.containsKey("data")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> dataAlbumes = (List<Map<String, Object>>) respuestaAlbumes.get("data");
                
                for (Map<String, Object> albumDeezer : dataAlbumes) {
                    if (albumDeezer.get("record_type") != null && albumDeezer.get("record_type").toString().equals("single")) {
                        continue;
                    }

                    com.pp2.vibeforge.models.Album nuevoAlbum = new com.pp2.vibeforge.models.Album();
                    nuevoAlbum.setTitulo(albumDeezer.get("title").toString());
                    nuevoAlbum.setImagenUrl(albumDeezer.get("cover_xl").toString());
                    nuevoAlbum.setIdArtista(nuevoArtista.getIdArtista());
                    
                    albumRepository.save(nuevoAlbum);

                    String idDeezerAlbum = albumDeezer.get("id").toString();
                    String urlCanciones = "https://api.deezer.com/album/" + idDeezerAlbum + "/tracks";
                    
                    @SuppressWarnings("unchecked")
                    Map<String, Object> respuestaCanciones = restTemplate.getForObject(urlCanciones, Map.class);

                    if (respuestaCanciones != null && respuestaCanciones.containsKey("data")) {
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> dataCanciones = (List<Map<String, Object>>) respuestaCanciones.get("data");
                        
                        for (Map<String, Object> trackDeezer : dataCanciones) {
                            com.pp2.vibeforge.models.Cancion nuevaCancion = new com.pp2.vibeforge.models.Cancion();
                            
                            nuevaCancion.setTitulo(trackDeezer.get("title").toString());
                            
                            nuevaCancion.setDuracion(Integer.parseInt(trackDeezer.get("duration").toString())); 
                            
                            nuevaCancion.setIdAlbum(nuevoAlbum.getIdAlbum()); 
                            nuevaCancion.setIdArtista(nuevoArtista.getIdArtista());
                            
                            nuevaCancion.setDescripcion("Importado automáticamente desde Deezer API");
                            
                            cancionRepository.save(nuevaCancion);
                        }
                    }


                }
            }

            return org.springframework.http.ResponseEntity.ok("Artista y álbumes importados con éxito. ID Local: " + nuevoArtista.getIdArtista());

        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.internalServerError().body("Error crítico: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Artista actualizarArtista(@PathVariable Integer id, @RequestBody Artista detallesArtista) {
        Artista artista = artistaRepository.findById(id).orElseThrow();
        artista.setNombre(detallesArtista.getNombre());
        artista.setNombreArtistico(detallesArtista.getNombreArtistico());
        artista.setGeneroMusical(detallesArtista.getGeneroMusical());
        artista.setImagenUrl(detallesArtista.getImagenUrl());
        return artistaRepository.save(artista);
    }

    @DeleteMapping("/{id}")
    public void borrarArtista(@PathVariable Integer id) {
        artistaRepository.deleteById(id);
    }
    
    @Autowired
    private com.pp2.vibeforge.repositories.AlbumRepository albumRepository;

    @Autowired 
    private com.pp2.vibeforge.repositories.CancionRepository cancionRepository;

}