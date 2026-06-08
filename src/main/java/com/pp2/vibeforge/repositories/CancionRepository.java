package com.pp2.vibeforge.repositories;

import com.pp2.vibeforge.models.Cancion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CancionRepository extends JpaRepository<Cancion, Integer> {
    List<Cancion> findByIdAlbum(Integer idAlbum);
}