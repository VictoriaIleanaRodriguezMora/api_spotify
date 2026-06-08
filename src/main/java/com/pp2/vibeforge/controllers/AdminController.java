package com.pp2.vibeforge.controllers;

import com.pp2.vibeforge.models.Admin;
import com.pp2.vibeforge.repositories.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @GetMapping
    public List<Admin> obtenerTodos() {
        return adminRepository.findAll();
    }

    @PostMapping("/registro")
    public Admin crearAdmin(@RequestBody Admin admin) {
        return adminRepository.save(admin);
    }
}