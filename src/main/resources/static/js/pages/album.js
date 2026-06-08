window.userPlaylistsCache = [];
window.mapaGuardadas = {};

// SVGs
const SVG_CLOCK = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg>`;
const SVG_PLUS = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/></svg>`;
const SVG_CHECK = `<svg width="16" height="16" viewBox="0 0 16 16" fill="#1ed760"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>`;

async function renderAlbum() {
    let albumId = new URLSearchParams(window.location.search).get('id');
    
    document.getElementById('app').innerHTML = ui.renderLayout(`
        <div id="album-loading" style="color: var(--text-muted); text-align: center; padding: 50px;">Buscando tracks...</div>
        <div id="album-content" style="display: none;">
            <div style="display: flex; gap: 30px; align-items: flex-end; margin-bottom: 40px; padding: 30px;">
                <img id="album-cover" src="" style="width: 230px; height: 230px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); border-radius: 4px; object-fit: cover;">
                <div>
                    <p style="text-transform: uppercase; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Álbum</p>
                    <h1 id="album-title" style="font-size: 3.5rem; margin: 0; line-height: 1.1; margin-bottom: 10px;"></h1>
                </div>
            </div>

            <div style="padding: 0 30px;">
                <div style="display: grid; grid-template-columns: 50px 1fr 50px 80px; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px; color: var(--text-muted); font-size: 14px; text-transform: uppercase;">
                    <span>#</span>
                    <span>Título</span>
                    <span style="text-align: center;"></span> <span style="text-align: right;">${SVG_CLOCK}</span> </div>
                <div id="tracks-container"></div>
            </div>
        </div>

        <div id="modal-playlist" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); z-index:9999; justify-content:center; align-items:center;">
            <div style="background: #282828; padding: 30px; border-radius: 8px; width: 400px; max-width: 90%; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
                <h3 style="margin-bottom: 20px;">Guardar en Playlist</h3>
                
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <input type="text" id="nueva-pl-input" placeholder="Crear lista nueva..." style="flex-grow: 1; padding: 10px; border-radius: 4px; border: none; background: #3e3e3e; color: white; outline: none;">
                    <button onclick="crearYAgregarPL()" style="padding: 10px 15px; border-radius: 4px; background: white; color: black; font-weight: bold; border: none; cursor: pointer;">Crear</button>
                </div>

                <div id="lista-mis-playlists" style="max-height: 250px; overflow-y: auto; margin-bottom: 20px; padding-right: 10px;"></div>
                
                <button onclick="cerrarModal()" style="width: 100%; padding: 12px; background: transparent; border: 1px solid var(--text-muted); color: white; font-weight: bold; border-radius: 500px; cursor: pointer;">Cerrar</button>
            </div>
        </div>
    `);

    try {
        // Se pide todo para agilizar las cargas
        const [album, canciones, playlistsUsuario] = await Promise.all([
            api.get('/albumes/' + albumId),
            api.get('/canciones/album/' + albumId),
            api.get('/playlists/usuario/' + auth.idActual)
        ]);

        // Mapeo de listas para cada canción
        window.userPlaylistsCache = playlistsUsuario;
        window.mapaGuardadas = {};
        playlistsUsuario.forEach(pl => {
            if(pl.canciones) {
                pl.canciones.forEach(c => {
                    if(!window.mapaGuardadas[c.idCancion]) window.mapaGuardadas[c.idCancion] = [];
                    window.mapaGuardadas[c.idCancion].push(pl.idPlaylist);
                });
            }
        });

        document.getElementById('album-cover').src = album.imagenUrl || 'https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021';
        document.getElementById('album-title').innerText = album.titulo;

        let tracksHTML = '';
        canciones.forEach((cancion, index) => {
            const min = Math.floor(cancion.duracion / 60);
            const seg = (cancion.duracion % 60).toString().padStart(2, '0');
            
            // Verificar si esta en una playlist 
            const estaGuardada = window.mapaGuardadas[cancion.idCancion] && window.mapaGuardadas[cancion.idCancion].length > 0;
            const iconoAUsar = estaGuardada ? SVG_CHECK : SVG_PLUS;
            const opacidadInicial = estaGuardada ? '1' : '0'; // se oculta hasta el hover si no esta guardada

            tracksHTML += `
                <div style="display: grid; grid-template-columns: 50px 1fr 50px 80px; align-items: center; padding: 10px 0; border-radius: 4px; transition: 0.2s;" 
                     onmouseover="this.style.background='var(--bg-elevated)'; document.getElementById('btn-add-${cancion.idCancion}').style.opacity='1';" 
                     onmouseout="this.style.background='transparent'; document.getElementById('btn-add-${cancion.idCancion}').style.opacity='${opacidadInicial}';">
                    
                    <span style="color: var(--text-muted); padding-left: 10px;">${index + 1}</span>
                    <span style="font-weight: bold; color: white;">${cancion.titulo}</span>
                    
                    <span id="btn-add-${cancion.idCancion}" style="text-align: center; cursor: pointer; color: var(--text-muted); transition: 0.2s; opacity: ${opacidadInicial};" 
                          onclick="abrirModalPlaylist(${cancion.idCancion})">
                          ${iconoAUsar}
                    </span>
                    
                    <span style="text-align: right; color: var(--text-muted);">${min}:${seg}</span>
                </div>
            `;
        });

        document.getElementById('tracks-container').innerHTML = tracksHTML;
        document.getElementById('album-loading').style.display = 'none';
        document.getElementById('album-content').style.display = 'block';

    } catch (error) {
        document.getElementById('album-loading').innerHTML = '<span style="color: var(--error);">Error al cargar.</span>';
    }
}


// MODAL
let cancionSeleccionada = null;

window.abrirModalPlaylist = function(idCancion) {
    cancionSeleccionada = idCancion;
    document.getElementById('modal-playlist').style.display = 'flex';
    dibujarPlaylistsEnModal();
};

window.cerrarModal = function() {
    document.getElementById('modal-playlist').style.display = 'none';
    cancionSeleccionada = null;
    renderAlbum();
};

window.dibujarPlaylistsEnModal = function() {
    let playlistHTML = '';
    window.userPlaylistsCache.forEach(pl => {
        const laTengo = window.mapaGuardadas[cancionSeleccionada] && window.mapaGuardadas[cancionSeleccionada].includes(pl.idPlaylist);
        
        const bgColor = laTengo ? 'rgba(30, 215, 96, 0.2)' : 'transparent';
        const textColor = laTengo ? '#1ed760' : 'white';
        const borde = laTengo ? '1px solid #1ed760' : '1px solid #555';
        
        const textoAccion = laTengo 
            ? `<span style="display:flex; align-items:center; gap:5px;">${SVG_CHECK} Agregada</span>` 
            : `<span style="display:flex; align-items:center; gap:5px;">${SVG_PLUS} Agregar</span>`;

        playlistHTML += `
            <div onclick="toggleGuardado(${pl.idPlaylist})" style="padding: 12px 15px; margin-bottom: 10px; border-radius: 4px; cursor: pointer; border: ${borde}; background: ${bgColor}; color: ${textColor}; display: flex; justify-content: space-between; align-items: center; transition: 0.2s;">
                <span>${pl.titulo}</span>
                ${textoAccion}
            </div>
        `;
    });
    document.getElementById('lista-mis-playlists').innerHTML = playlistHTML;
};

// Agregar o Quitar canción al tocar una playlist del menú
window.toggleGuardado = async function(idPlaylist) {
    const laTengo = window.mapaGuardadas[cancionSeleccionada] && window.mapaGuardadas[cancionSeleccionada].includes(idPlaylist);
    
    try {
        if (laTengo) {
            await api.borrar('/playlists/' + idPlaylist + '/canciones/' + cancionSeleccionada);
            window.mapaGuardadas[cancionSeleccionada] = window.mapaGuardadas[cancionSeleccionada].filter(id => id !== idPlaylist);
        } else {
            await api.post('/playlists/' + idPlaylist + '/canciones/' + cancionSeleccionada, {});
            if(!window.mapaGuardadas[cancionSeleccionada]) window.mapaGuardadas[cancionSeleccionada] = [];
            window.mapaGuardadas[cancionSeleccionada].push(idPlaylist);
        }
        dibujarPlaylistsEnModal();
    } catch(e) {}
};

// Crear lista e inyectar la canción
window.crearYAgregarPL = async function() {
    const titulo = document.getElementById('nueva-pl-input').value;
    if(!titulo || titulo.trim() === '') return;
    try {
        //Crea la playlist vacía
        const nuevaPl = await api.post('/playlists', { titulo: titulo, idUsuario: auth.idActual, descripcion: "Creada desde el álbum" });
        //Le agrega el tema
        await api.post('/playlists/' + nuevaPl.idPlaylist + '/canciones/' + cancionSeleccionada, {});
        //Actualiza memoria
        window.userPlaylistsCache.push(nuevaPl);
        if(!window.mapaGuardadas[cancionSeleccionada]) window.mapaGuardadas[cancionSeleccionada] = [];
        window.mapaGuardadas[cancionSeleccionada].push(nuevaPl.idPlaylist);
        
        document.getElementById('nueva-pl-input').value = '';
        dibujarPlaylistsEnModal();
    } catch(e) {}
};