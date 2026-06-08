package com.pp2.vibeforge.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Playlist")
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPlaylist")
    private Integer idPlaylist;

    @Column(name = "idUsuario")
    private Integer idUsuario;

    @Column(name = "titulo")
    private String titulo;

    @Column(name = "fechaCreacion")
    private LocalDate fechaCreacion = LocalDate.now();

    @Column(name = "descripcion")
    private String descripcion;


    @ManyToMany
    @JoinTable(name = "Playlist_Cancion", joinColumns = @JoinColumn(name = "idPlaylist"), inverseJoinColumns = @JoinColumn(name = "idCancion"))
    @OrderColumn(name = "indice_orden") 
    private List<Cancion> canciones = new ArrayList<>();

    public Integer getIdPlaylist() {
        return idPlaylist;
    }

    public void setIdPlaylist(Integer idPlaylist) {
        this.idPlaylist = idPlaylist;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public LocalDate getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDate fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public List<Cancion> getCanciones() {
        return canciones;
    }

    public void setCanciones(List<Cancion> canciones) {
        this.canciones = canciones;
    }
}