package com.pp2.vibeforge.controllers;

import com.pp2.vibeforge.models.Cancion;
import com.pp2.vibeforge.models.Playlist;
import com.pp2.vibeforge.repositories.CancionRepository;
import com.pp2.vibeforge.repositories.PlaylistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
@CrossOrigin(origins = "*")
public class PlaylistController {

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private CancionRepository cancionRepository;

    // Obtener las playlists de un usuario específico
    @GetMapping("/usuario/{idUsuario}")
    public List<Playlist> obtenerPorUsuario(@PathVariable Integer idUsuario) {
        return playlistRepository.findByIdUsuario(idUsuario);
    }

    // Crear una nueva Playlist
    @PostMapping
    public Playlist crearPlaylist(@RequestBody Playlist playlist) {
        return playlistRepository.save(playlist);
    }

    // Agregar una canción a la playlist
    @PostMapping("/{idPlaylist}/canciones/{idCancion}")
    public Playlist agregarCancion(@PathVariable Integer idPlaylist, @PathVariable Integer idCancion) {
        Playlist playlist = playlistRepository.findById(idPlaylist).orElseThrow();
        Cancion cancion = cancionRepository.findById(idCancion).orElseThrow();

        // Evitar duplicados
        if (!playlist.getCanciones().contains(cancion)) {
            playlist.getCanciones().add(cancion);
            playlistRepository.save(playlist);
        }
        return playlist;
    }

    // Quitar una canción de la playlist
    @DeleteMapping("/{idPlaylist}/canciones/{idCancion}")
    public Playlist quitarCancion(@PathVariable Integer idPlaylist, @PathVariable Integer idCancion) {
        Playlist playlist = playlistRepository.findById(idPlaylist).orElseThrow();
        Cancion cancion = cancionRepository.findById(idCancion).orElseThrow();

        playlist.getCanciones().remove(cancion);
        return playlistRepository.save(playlist);
    }

    // Borrar la playlist entera
    @DeleteMapping("/{id}")
    public void borrarPlaylist(@PathVariable Integer id) {
        playlistRepository.deleteById(id);
    }

    // 1. Renombrar o editar la descripción de una playlist
    @PatchMapping("/{id}")
    public Playlist actualizarPlaylist(@PathVariable Integer id, @RequestBody Playlist playlistActualizada) {
        Playlist playlist = playlistRepository.findById(id).orElseThrow();
        playlist.setTitulo(playlistActualizada.getTitulo());
        playlist.setDescripcion(playlistActualizada.getDescripcion());
        return playlistRepository.save(playlist);
    }

    // 2. Obtener una sola playlist con todas sus canciones (útil para el detalle)
    @GetMapping("/{id}")
    public Playlist obtenerUna(@PathVariable Integer id) {
        return playlistRepository.findById(id).orElseThrow();
    }

    // 3. Guardar el nuevo orden personalizado de las canciones
    @PutMapping("/{id}/ordenar")
    public Playlist ordenarCanciones(@PathVariable Integer id, @RequestBody List<Integer> idsCanciones) {
        Playlist playlist = playlistRepository.findById(id).orElseThrow();
        
        // 1. Limpiamos la lista para que Hibernate borre las posiciones viejas
        playlist.getCanciones().clear();
        
        // 2. Agregamos las canciones en el nuevo orden exacto
        for(Integer idCancion : idsCanciones) {
            playlist.getCanciones().add(cancionRepository.findById(idCancion).orElseThrow());
        }
        
        return playlistRepository.save(playlist);
    }
}