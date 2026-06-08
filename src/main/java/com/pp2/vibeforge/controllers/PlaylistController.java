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

    @GetMapping("/usuario/{idUsuario}")
    public List<Playlist> obtenerPorUsuario(@PathVariable Integer idUsuario) {
        return playlistRepository.findByIdUsuario(idUsuario);
    }

    @PostMapping
    public Playlist crearPlaylist(@RequestBody Playlist playlist) {
        return playlistRepository.save(playlist);
    }

    @PostMapping("/{idPlaylist}/canciones/{idCancion}")
    public Playlist agregarCancion(@PathVariable Integer idPlaylist, @PathVariable Integer idCancion) {
        Playlist playlist = playlistRepository.findById(idPlaylist).orElseThrow();
        Cancion cancion = cancionRepository.findById(idCancion).orElseThrow();

        if (!playlist.getCanciones().contains(cancion)) {
            playlist.getCanciones().add(cancion);
            playlistRepository.save(playlist);
        }
        return playlist;
    }

    @DeleteMapping("/{idPlaylist}/canciones/{idCancion}")
    public Playlist quitarCancion(@PathVariable Integer idPlaylist, @PathVariable Integer idCancion) {
        Playlist playlist = playlistRepository.findById(idPlaylist).orElseThrow();
        Cancion cancion = cancionRepository.findById(idCancion).orElseThrow();

        playlist.getCanciones().remove(cancion);
        return playlistRepository.save(playlist);
    }

    @DeleteMapping("/{id}")
    public void borrarPlaylist(@PathVariable Integer id) {
        playlistRepository.deleteById(id);
    }

    @PatchMapping("/{id}")
    public Playlist actualizarPlaylist(@PathVariable Integer id, @RequestBody Playlist playlistActualizada) {
        Playlist playlist = playlistRepository.findById(id).orElseThrow();
        playlist.setTitulo(playlistActualizada.getTitulo());
        playlist.setDescripcion(playlistActualizada.getDescripcion());
        return playlistRepository.save(playlist);
    }

    @GetMapping("/{id}")
    public Playlist obtenerUna(@PathVariable Integer id) {
        return playlistRepository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}/ordenar")
    public Playlist ordenarCanciones(@PathVariable Integer id, @RequestBody List<Integer> idsCanciones) {
        Playlist playlist = playlistRepository.findById(id).orElseThrow();
        
        playlist.getCanciones().clear();
        
        for(Integer idCancion : idsCanciones) {
            playlist.getCanciones().add(cancionRepository.findById(idCancion).orElseThrow());
        }
        
        return playlistRepository.save(playlist);
    }
}