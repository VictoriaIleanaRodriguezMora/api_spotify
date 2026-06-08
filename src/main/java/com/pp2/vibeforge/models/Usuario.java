package com.pp2.vibeforge.models;

import jakarta.persistence.*;

@Entity
@Table(name = "Usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idUsuario")
    private Integer idUsuario;

    @Column(name = "nombre") private String nombre;
    @Column(name = "apellido") private String apellido;
    @Column(name = "correo") private String correo;
    @Column(name = "contraseña") private String contraseña;
    @Column(name = "tipoSuscripcion") private String tipoSuscripcion;
    @Column(name = "rol") private String rol = "Usuario";

    //GETTERS Y SETTERS

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getContraseña() { return contraseña; }
    public void setContraseña(String contraseña) { this.contraseña = contraseña; }

    public String getTipoSuscripcion() { return tipoSuscripcion; }
    public void setTipoSuscripcion(String tipoSuscripcion) { this.tipoSuscripcion = tipoSuscripcion; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}