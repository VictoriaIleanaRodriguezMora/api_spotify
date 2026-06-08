package com.pp2.vibeforge.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Album")
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idAlbum")
    private Integer idAlbum;

    @Column(name = "idArtista")
    private Integer idArtista;

    @Column(name = "titulo")
    private String titulo;

    @Column(name = "fechaLanzamiento")
    private LocalDate fechaLanzamiento;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "portada")
    private String portada;

    @Column(name = "imagen_url")
    private String imagenUrl;

    // Getters y Setters
    public Integer getIdAlbum() { return idAlbum; }
    public void setIdAlbum(Integer idAlbum) { this.idAlbum = idAlbum; }

    public Integer getIdArtista() { return idArtista; }
    public void setIdArtista(Integer idArtista) { this.idArtista = idArtista; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public LocalDate getFechaLanzamiento() { return fechaLanzamiento; }
    public void setFechaLanzamiento(LocalDate fechaLanzamiento) { this.fechaLanzamiento = fechaLanzamiento; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getPortada() { return portada; }
    public void setPortada(String portada) { this.portada = portada; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
}