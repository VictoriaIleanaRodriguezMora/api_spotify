package com.pp2.vibeforge.controllers;

import com.pp2.vibeforge.models.Cancion;
import com.pp2.vibeforge.repositories.CancionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/canciones")
@CrossOrigin(origins = "*")
public class CancionController {

    @Autowired
    private CancionRepository cancionRepository;

    @GetMapping
    public List<Cancion> obtenerTodas() {
        return cancionRepository.findAll();
    }

    // Ruta para mostrar solo las canciones de un álbum al abrirlo en el Frontend
    @GetMapping("/album/{idAlbum}")
    public List<Cancion> obtenerPorAlbum(@PathVariable Integer idAlbum) {
        return cancionRepository.findByIdAlbum(idAlbum);
    }

    @PostMapping
    public Cancion crearCancion(@RequestBody Cancion cancion) {
        return cancionRepository.save(cancion);
    }

    @DeleteMapping("/{id}")
    public void borrarCancion(@PathVariable Integer id) {
        cancionRepository.deleteById(id);
    }
}