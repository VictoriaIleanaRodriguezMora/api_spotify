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
        
        if (datos.containsKey("nombre") && datos.get("nombre") != null && !datos.get("nombre").trim().isEmpty()) {
            usuario.setNombre(datos.get("nombre")); // Recordá cambiar a setUsername si así se llama en tu modelo
        }
        
        String passActual = datos.get("passwordActual");
        String passNueva = datos.get("passwordNueva");
        
        if (passActual != null && !passActual.isEmpty() && passNueva != null && !passNueva.trim().isEmpty()) {
            
            if (!usuario.getContraseña().equals(passActual)) { 
                throw new RuntimeException("Contraseña actual incorrecta");
            }
            
            usuario.setContraseña(passNueva);
        }
        
        return usuarioRepository.save(usuario);
    }
}