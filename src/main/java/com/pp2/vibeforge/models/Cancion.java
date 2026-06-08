package com.pp2.vibeforge.models;

import jakarta.persistence.*;

@Entity
@Table(name = "Cancion")
public class Cancion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCancion")
    private Integer idCancion;

    @Column(name = "titulo")
    private String titulo;

    @Column(name = "idArtista")
    private Integer idArtista;

    @Column(name = "idAlbum")
    private Integer idAlbum;

    @Column(name = "duracion")
    private Integer duracion;

    @Column(name = "descripcion")
    private String descripcion;

    // Getters y Setters
    public Integer getIdCancion() { return idCancion; }
    public void setIdCancion(Integer idCancion) { this.idCancion = idCancion; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public Integer getIdArtista() { return idArtista; }
    public void setIdArtista(Integer idArtista) { this.idArtista = idArtista; }

    public Integer getIdAlbum() { return idAlbum; }
    public void setIdAlbum(Integer idAlbum) { this.idAlbum = idAlbum; }

    public Integer getDuracion() { return duracion; }
    public void setDuracion(Integer duracion) { this.duracion = duracion; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}