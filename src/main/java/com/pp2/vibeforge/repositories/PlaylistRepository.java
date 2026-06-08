package com.pp2.vibeforge.repositories;

import com.pp2.vibeforge.models.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Integer> {
    List<Playlist> findByIdUsuario(Integer idUsuario);
}