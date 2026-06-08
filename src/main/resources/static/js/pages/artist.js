async function renderArtist() {
    let artistId = new URLSearchParams(window.location.search).get('id');
    
    // Respaldo por si window.location falla
    if (!artistId && window.location.href.includes('?id=')) {
        artistId = window.location.href.split('?id=')[1].split('&')[0];
    }

    // Freno si el ID no llega
    if (!artistId || artistId === 'undefined') {
        document.getElementById('app').innerHTML = ui.renderLayout(`
            <div style="padding: 50px; text-align: center;">
                <h2 style="color: var(--error);">Error Crítico</h2>
                <p style="color: white;">No se recibió el número de ID del artista. Java no envió el dato correcto.</p>
                <button class="btn-action" style="margin-top:20px;" onclick="navigate('/user/home')">Volver</button>
            </div>
        `);
        return;
    }

    const contenidoHTML = `
        <div id="artist-loading" style="color: var(--text-muted); text-align: center; padding: 50px;">Cargando perfil maestro (ID: ${artistId})...</div>
        
<div id="artist-content" style="display: none;">
            <div id="artist-banner" style="
                height: 350px; 
                background-size: cover; 
                background-position: center 30%;
                border-radius: var(--radius-md); 
                position: relative; 
                margin-bottom: 30px; 
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                
                <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to top, var(--bg-base) 10%, transparent 60%); border-radius: var(--radius-md);"></div>
                <div style="position: absolute; bottom: 30px; left: 40px; z-index: 2;">
                    <p id="artist-genre" style="color: var(--primary); font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px;"></p>
                    <h1 id="artist-name" style="font-size: 4rem; color: white; text-shadow: 2px 2px 10px rgba(0,0,0,0.8); margin: 0; line-height: 1;"></h1>
                </div>
            </div>

            <div style="display: flex; gap: 30px; border-bottom: 1px solid #333; margin-bottom: 30px; padding-bottom: 10px;">
                <button onclick="cambiarTab('musica')" id="btn-tab-musica" style="background: transparent; color: var(--primary); border: none; font-size: 18px; font-weight: bold; cursor: pointer; border-bottom: 2px solid var(--primary); padding-bottom: 5px;">🎵 Música</button>
                <button onclick="cambiarTab('analiticas')" id="btn-tab-analiticas" style="background: transparent; color: var(--text-muted); border: none; font-size: 18px; font-weight: bold; cursor: pointer; padding-bottom: 5px;">📊 Analytics</button>
            </div>

            <div id="tab-musica" class="tab-content">
                <h2 style="margin-bottom: 20px;">Discografía</h2>
                <div class="grid" id="grid-albumes"></div>
            </div>

            <div id="tab-analiticas" class="tab-content" style="display: none; height: 60vh;">
                <iframe id="pbi-iframe" width="100%" height="100%" src="" frameborder="0" allowFullScreen="true" style="border-radius: var(--radius-md); background: #fff;"></iframe>
            </div>
        </div>
    `;

    document.getElementById('app').innerHTML = ui.renderLayout(contenidoHTML);

    //Llamadas a Java
    try {
        console.log("Buscando artista ID: " + artistId);
        const artista = await api.get(`/artistas/${artistId}`);
        console.log("Respuesta de Java:", artista);
        
        document.getElementById('artist-banner').style.backgroundImage = `url('${artista.imagenUrl}')`;
        document.getElementById('artist-name').innerText = artista.nombreArtistico;
        document.getElementById('artist-genre').innerText = artista.generoMusical;

        // LÓGICA PARA IMPLEMENTAR LO DE POWER BI
        const linkBasePowerBI = "https://app.powerbi.com/view?r=SE_NECESITA_UN_CODIGO_DE_REPORTE"; //<- CHEQUEAR SI VAMOS A USAR POWER BI 
        const urlPBIFiltrada = `${linkBasePowerBI}&filter=Artistas/Nombre eq '${artista.nombreArtistico}'`;
        document.getElementById('pbi-iframe').src = urlPBIFiltrada;

        document.getElementById('artist-loading').style.display = 'none';
        document.getElementById('artist-content').style.display = 'block';
        try {
            const albumes = await api.get(`/albumes/artista/${artistId}`);
            let albumesHTML = '';
            
            if (albumes.length === 0) {
                albumesHTML = '<p style="color: var(--text-muted);">Este artista aún no tiene álbumes cargados en la base de datos.</p>';
            } else {
                // Se setea la imagen de disco genérico por si falla
                const IMG_DISCO = 'https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021';
                
                albumes.forEach(album => {
                    const imagenAlbum = album.imagenUrl || IMG_DISCO;
                    albumesHTML += `
                        <div class="card" onclick="navigate('/user/album?id=${album.idAlbum}')">
                            <img src="${imagenAlbum}" class="card-img" style="border-radius: var(--radius-md);" alt="Portada">
                            <div class="card-title">${album.titulo}</div>
                        </div>
                    `;
                });
            }
            document.getElementById('grid-albumes').innerHTML = albumesHTML;

        } catch (errorAlbumes) {
            document.getElementById('grid-albumes').innerHTML = '<p style="color: var(--error);">No se pudieron cargar los álbumes.</p>';
        }

    } catch (error) {
        console.error("Fallo la petición a Java:", error);
        document.getElementById('artist-loading').innerHTML = `
            <div style="color: var(--error);">
                <h2>Error de conexión con la Base de Datos</h2>
                <p>No se encontró el artista con ID ${artistId} en el servidor.</p>
            </div>`;
    }
}

window.cambiarTab = function(tabSeleccionada) {
    const tabMusica = document.getElementById('tab-musica');
    const tabAnaliticas = document.getElementById('tab-analiticas');
    const btnMusica = document.getElementById('btn-tab-musica');
    const btnAnaliticas = document.getElementById('btn-tab-analiticas');

    if (tabSeleccionada === 'musica') {
        tabMusica.style.display = 'block';
        tabAnaliticas.style.display = 'none';
        btnMusica.style.color = 'var(--primary)';
        btnMusica.style.borderBottom = '2px solid var(--primary)';
        btnAnaliticas.style.color = 'var(--text-muted)';
        btnAnaliticas.style.borderBottom = 'none';
    } else {
        tabMusica.style.display = 'none';
        tabAnaliticas.style.display = 'block';
        btnAnaliticas.style.color = 'var(--primary)';
        btnAnaliticas.style.borderBottom = '2px solid var(--primary)';
        btnMusica.style.color = 'var(--text-muted)';
        btnMusica.style.borderBottom = 'none';
    }
}