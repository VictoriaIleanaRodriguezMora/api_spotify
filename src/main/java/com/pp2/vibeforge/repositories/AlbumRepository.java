package com.pp2.vibeforge.repositories;

import com.pp2.vibeforge.models.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Integer> {
    List<Album> findByIdArtista(Integer idArtista); 
}