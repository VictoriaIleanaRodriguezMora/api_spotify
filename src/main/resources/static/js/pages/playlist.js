window.playlistActual = null;
let indiceArrastrado = null;

const PL_ICON_SORT_ALPHA = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M11 2h2v12h-2zM3.4 5.4l2.6-2.6v11h2v-11l2.6 2.6-1.4 1.4-4.2-4.2-4.2 4.2z"/></svg>`;
const PL_ICON_SORT_TIME = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg>`;
const PL_ICON_TRASH = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>`;
const PL_ICON_REMOVE = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>`;

async function renderPlaylist() {
    const playlistId = new URLSearchParams(window.location.search).get('id');
    
    document.getElementById('app').innerHTML = ui.renderLayout(`
        <div id="playlist-container" style="padding: 20px;">
            
            <div style="display: flex; gap: 30px; align-items: flex-end; margin-bottom: 30px; background: linear-gradient(to bottom, rgba(255,255,255,0.05), transparent); padding: 30px; border-radius: var(--radius-md);">
                <img id="playlist-cover" src="https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021" style="width: 230px; height: 230px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); border-radius: 4px; object-fit: cover;">
                <div style="flex-grow: 1;">
                    <p style="text-transform: uppercase; font-size: 12px; font-weight: bold; margin-bottom: 5px; color: var(--text-muted);">Playlist</p>
                    <input type="text" id="edit-titulo" value="Cargando..." onblur="guardarCambios()" style="font-size: 3.5rem; font-weight: 900; background: transparent; border: none; color: white; width: 100%; outline: none; margin-bottom: 10px;">
                    <p style="color: var(--text-muted); font-size: 14px;">Arrastrá las canciones desde el ícono de las rayas para cambiar el orden como más te guste.</p>
                </div>
            </div>

            <div style="display: flex; gap: 30px; border-bottom: 1px solid #333; margin-bottom: 30px; padding-bottom: 10px;">
                <button onclick="cambiarTabPL('musica')" id="btn-tab-pl-musica" style="background: transparent; color: var(--primary); border: none; font-size: 18px; font-weight: bold; cursor: pointer; border-bottom: 2px solid var(--primary); padding-bottom: 5px;">🎵 Música</button>
                <button onclick="cambiarTabPL('analiticas')" id="btn-tab-pl-analiticas" style="background: transparent; color: var(--text-muted); border: none; font-size: 18px; font-weight: bold; cursor: pointer; padding-bottom: 5px;">📊 Analytics</button>
            </div>

            <div id="tab-pl-musica" class="tab-content">
                <div style="margin-bottom: 20px; display: flex; gap: 10px;">
                    <button onclick="ordenarPor('titulo')" style="padding: 8px 15px; border-radius: 20px; border: 1px solid #555; background: transparent; color: white; cursor: pointer; display: flex; align-items: center; gap: 6px;">${PL_ICON_SORT_ALPHA} Título</button>
                    <button onclick="ordenarPor('duracion')" style="padding: 8px 15px; border-radius: 20px; border: 1px solid #555; background: transparent; color: white; cursor: pointer; display: flex; align-items: center; gap: 6px;">${PL_ICON_SORT_TIME} Duración</button>
                    <button onclick="eliminarPlaylist()" style="padding: 8px 15px; border-radius: 20px; border: none; background: #e91e63; color: white; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 6px;">${PL_ICON_TRASH} Eliminar Playlist</button>
                </div>

                <div style="display: grid; grid-template-columns: 50px 1fr 100px 50px; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px; color: var(--text-muted); font-size: 14px; text-transform: uppercase;">
                    <span>#</span>
                    <span>Título</span>
                    <span style="text-align: right;">${PL_ICON_SORT_TIME}</span>
                    <span style="text-align: center;"></span>
                </div>
                <div id="lista-tracks"></div>
            </div>

            <div id="tab-pl-analiticas" class="tab-content" style="display: none; height: 60vh;">
                <iframe id="pbi-playlist-iframe" width="100%" height="100%" src="" frameborder="0" allowFullScreen="true" style="border-radius: var(--radius-md); background: #fff;"></iframe>
            </div>
        </div>
    `);

    try {
        window.playlistActual = await api.get('/playlists/' + playlistId);
        
        if (window.playlistActual.canciones && window.playlistActual.canciones.length > 0) {
            try {
                const albumInfo = await api.get('/albumes/' + window.playlistActual.canciones[0].idAlbum);
                if(albumInfo.imagenUrl) document.getElementById('playlist-cover').src = albumInfo.imagenUrl;
            } catch(e) {}
        }

        document.getElementById('edit-titulo').value = window.playlistActual.titulo;
        
        // PBI URL
        const linkBasePowerBI = "https://app.powerbi.com/view?r=CODIGO_DE_REPORTE";
        document.getElementById('pbi-playlist-iframe').src = `${linkBasePowerBI}&filter=Playlist/idPlaylist eq ${playlistId}`;
        
        renderizarTablaCanciones(window.playlistActual.canciones);
    } catch (e) {
        document.getElementById('playlist-container').innerHTML = '<h2 style="color:var(--error);">Error al cargar.</h2>';
    }
}

function renderizarTablaCanciones(lista) {
    const tbody = document.getElementById('lista-tracks');
    if(!lista || lista.length === 0) {
        tbody.innerHTML = '<p style="color: var(--text-muted); padding: 20px 0;">No hay canciones todavía. ¡Agregá algunas desde los álbumes!</p>';
        return;
    }

    tbody.innerHTML = lista.map((cancion, index) => {
        const min = Math.floor(cancion.duracion / 60);
        const seg = (cancion.duracion % 60).toString().padStart(2, '0');
        return `
        <div draggable="true" 
             ondragstart="iniciarArrastre(event, ${index})" 
             ondragover="permitirSoltar(event)" 
             ondrop="soltarElemento(event, ${index})"
             style="display: grid; grid-template-columns: 50px 1fr 100px 50px; align-items: center; padding: 12px 0; border-radius: 4px; transition: 0.2s; cursor: grab;" 
             onmouseover="this.style.background='var(--bg-elevated)'; this.querySelector('.btn-quitar').style.opacity='1';" 
             onmouseout="this.style.background='transparent'; this.querySelector('.btn-quitar').style.opacity='0';">
             
            <span style="color: var(--text-muted); padding-left: 10px;" title="Arrastrar para ordenar">☰</span>
            <span style="font-weight: bold; color: white;">${cancion.titulo}</span>
            <span style="text-align: right; color: var(--text-muted);">${min}:${seg}</span>
            <span class="btn-quitar" style="text-align: center; cursor: pointer; color: #b3b3b3; transition: 0.2s; opacity: 0;" 
                  onmouseover="this.style.color='#e91e63'" 
                  onmouseout="this.style.color='#b3b3b3'" 
                  onclick="removerCancion(${cancion.idCancion})" title="Quitar">
                  ${PL_ICON_REMOVE}
            </span>
        </div>`;
    }).join('');
}

// Tabs
window.cambiarTabPL = function(tab) {
    document.getElementById('tab-pl-musica').style.display = tab === 'musica' ? 'block' : 'none';
    document.getElementById('tab-pl-analiticas').style.display = tab === 'analiticas' ? 'block' : 'none';
    
    document.getElementById('btn-tab-pl-musica').style.color = tab === 'musica' ? 'var(--primary)' : 'var(--text-muted)';
    document.getElementById('btn-tab-pl-musica').style.borderBottom = tab === 'musica' ? '2px solid var(--primary)' : 'none';
    
    document.getElementById('btn-tab-pl-analiticas').style.color = tab === 'analiticas' ? 'var(--primary)' : 'var(--text-muted)';
    document.getElementById('btn-tab-pl-analiticas').style.borderBottom = tab === 'analiticas' ? '2px solid var(--primary)' : 'none';
};

// Drag & Drop
window.iniciarArrastre = (e, index) => {
    indiceArrastrado = index;
    setTimeout(() => e.target.style.opacity = "0.5", 0);
};
window.permitirSoltar = (e) => e.preventDefault();

window.soltarElemento = async (e, indexDestino) => {
    e.preventDefault();
    e.target.closest('div[draggable]').style.opacity = "1";
    
    const lista = window.playlistActual.canciones;
    const cancionMovida = lista.splice(indiceArrastrado, 1)[0]; 
    lista.splice(indexDestino, 0, cancionMovida);
    
    renderizarTablaCanciones(lista);

    try {
        const idsOrdenados = lista.map(c => c.idCancion);
        await api.put('/playlists/' + window.playlistActual.idPlaylist + '/ordenar', idsOrdenados);
    } catch (err) {
        console.error("Error al guardar el orden", err);
    }
};

window.ordenarPor = async function(criterio) {
    const lista = window.playlistActual.canciones;
    lista.sort((a, b) => criterio === 'titulo' ? a.titulo.localeCompare(b.titulo) : a.duracion - b.duracion);
    renderizarTablaCanciones(lista);
    const idsOrdenados = lista.map(c => c.idCancion);
    await api.put('/playlists/' + window.playlistActual.idPlaylist + '/ordenar', idsOrdenados);
};

window.removerCancion = async (idCancion) => {
    await api.borrar('/playlists/' + window.playlistActual.idPlaylist + '/canciones/' + idCancion);
    renderPlaylist(); 
};
window.guardarCambios = async () => {
    await api.patch('/playlists/' + window.playlistActual.idPlaylist, { titulo: document.getElementById('edit-titulo').value });
};
window.eliminarPlaylist = async () => {
    if(confirm("¿Eliminar esta playlist para siempre?")) {
        await api.borrar('/playlists/' + window.playlistActual.idPlaylist);
        navigate('/user/playlists');
    }
};