package com.pp2.vibeforge.controllers;

import com.pp2.vibeforge.models.Usuario;
import com.pp2.vibeforge.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public Usuario obtenerUsuario(@PathVariable Integer id) {
        return usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @PostMapping("/registro")
    public Usuario registrar(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Endpoint de Login básico
    @PostMapping("/login")
    public String login(@RequestBody Usuario loginData) {
        Usuario usuario = usuarioRepository.findByCorreo(loginData.getCorreo()).orElse(null);
        if (usuario != null && usuario.getContraseña().equals(loginData.getContraseña())) {
            return "Login exitoso. ID: " + usuario.getIdUsuario();
        }
        return "Credenciales incorrectas";
    }

@PatchMapping("/{id}/perfil")
    public Usuario actualizarPerfil(@PathVariable Integer id, @RequestBody java.util.Map<String, String> datos) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow();
        
        // CAMINO 1: ¿Quiere cambiar el nombre? 
        // Si mandó un nombre y no está en blanco, lo actualizamos.
        if (datos.containsKey("nombre") && datos.get("nombre") != null && !datos.get("nombre").trim().isEmpty()) {
            usuario.setNombre(datos.get("nombre")); // Recordá cambiar a setUsername si así se llama en tu modelo
        }
        
        // CAMINO 2: ¿Quiere cambiar la contraseña?
        String passActual = datos.get("passwordActual");
        String passNueva = datos.get("passwordNueva");
        
        // Solo intentamos cambiarla si mandó AMBAS y la NUEVA no está vacía
        if (passActual != null && !passActual.isEmpty() && passNueva != null && !passNueva.trim().isEmpty()) {
            
            // Validamos que la actual sea correcta
            if (!usuario.getContraseña().equals(passActual)) { // Recordá usar getPassword si aplica
                throw new RuntimeException("Contraseña actual incorrecta");
            }
            
            usuario.setContraseña(passNueva); // Recordá usar setPassword si aplica
        }
        
        return usuarioRepository.save(usuario);
    }
}