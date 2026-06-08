package com.pp2.vibeforge.models;

import jakarta.persistence.*;

@Entity
@Table(name = "Admin")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idAdmin")
    private Integer idAdmin;

    @Column(name = "nombre") private String nombre;
    @Column(name = "apellido") private String apellido;
    @Column(name = "correo") private String correo;
    @Column(name = "correoInstitucional") private String correoInstitucional;
    @Column(name = "puesto") private String puesto;
    @Column(name = "nivelPermisos") private Integer nivelPermisos;
    @Column(name = "rol") private String rol = "Administrador";

    //GETTERS Y SETTERS

    public Integer getIdAdmin() { return idAdmin; }
    public void setIdAdmin(Integer idAdmin) { this.idAdmin = idAdmin; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getCorreoInstitucional() { return correoInstitucional; }
    public void setCorreoInstitucional(String correoInstitucional) { this.correoInstitucional = correoInstitucional; }

    public String getPuesto() { return puesto; }
    public void setPuesto(String puesto) { this.puesto = puesto; }

    public Integer getNivelPermisos() { return nivelPermisos; }
    public void setNivelPermisos(Integer nivelPermisos) { this.nivelPermisos = nivelPermisos; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}