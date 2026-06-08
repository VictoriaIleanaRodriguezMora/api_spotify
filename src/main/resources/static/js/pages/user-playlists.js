async function renderUserPlaylists() {
    const contenidoHTML = `
        <div style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h1 style="font-size: 2.5rem; margin: 0;">Mis Playlists</h1>
                <button onclick="abrirModalNuevaPlaylist()" class="btn-action" style="font-size: 14px; padding: 12px 24px; border-radius: 500px; display: flex; align-items: center; gap: 8px; font-weight: bold; background: white; color: black; border: none; cursor: pointer; transition: 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/></svg>
                    Nueva Playlist
                </button>
            </div>
            <div id="grid-mis-playlists" class="grid"><div style="color: var(--text-muted);">Cargando...</div></div>
        </div>

        <div id="modal-crear-pl" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); z-index:9999; justify-content:center; align-items:center;">
            <div style="background: #282828; padding: 30px; border-radius: 8px; width: 400px; max-width: 90%; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
                <h3 style="margin-bottom: 20px; font-size: 24px;">Crear Nueva Playlist</h3>
                <input type="text" id="input-nombre-pl" placeholder="Nombre de tu playlist..." style="width: 100%; padding: 15px; border-radius: 4px; border: 1px solid transparent; background: #3e3e3e; color: white; outline: none; margin-bottom: 25px; font-size: 16px; font-weight: bold;" onfocus="this.style.border='1px solid var(--primary)'" onblur="this.style.border='1px solid transparent'">
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="cerrarModalNuevaPlaylist()" style="padding: 10px 20px; background: transparent; border: none; color: var(--text-muted); font-weight: bold; cursor: pointer;">Cancelar</button>
                    <button onclick="confirmarNuevaPlaylist()" style="padding: 10px 25px; border-radius: 500px; background: var(--primary); color: white; font-weight: bold; border: none; cursor: pointer;">Crear</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('app').innerHTML = ui.renderLayout(contenidoHTML);
    cargarGrillaPlaylists();
}

async function cargarGrillaPlaylists() {
    try {
        const misPlaylists = await api.get('/playlists/usuario/' + auth.idActual);
        const grid = document.getElementById('grid-mis-playlists');
        if (misPlaylists.length === 0) {
            grid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1;">Todavía no tenés ninguna playlist. ¡Creá la primera!</p>';
            return;
        }
        let html = '';
        for (const pl of misPlaylists) {
            let imagenPortada = 'https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021';
            if (pl.canciones && pl.canciones.length > 0) {
                try {
                    const album = await api.get('/albumes/' + pl.canciones[0].idAlbum);
                    if (album && album.imagenUrl) imagenPortada = album.imagenUrl;
                } catch (e) {}
            }
            html += `
                <div class="card" onclick="navigate('/user/playlist?id=${pl.idPlaylist}')">
                    <img src="${imagenPortada}" class="card-img" style="border-radius: var(--radius-md);" alt="Playlist">
                    <div class="card-title">${pl.titulo}</div>
                    <div class="card-subtitle">${pl.canciones ? pl.canciones.length : 0} canciones</div>
                </div>`;
        }
        grid.innerHTML = html;
    } catch (e) {}
}

window.abrirModalNuevaPlaylist = () => {
    document.getElementById('input-nombre-pl').value = '';
    document.getElementById('modal-crear-pl').style.display = 'flex';
    document.getElementById('input-nombre-pl').focus();
};
window.cerrarModalNuevaPlaylist = () => document.getElementById('modal-crear-pl').style.display = 'none';

window.confirmarNuevaPlaylist = async () => {
    const nombre = document.getElementById('input-nombre-pl').value;
    if (!nombre || nombre.trim() === '') return;
    try {
        await api.post('/playlists', { titulo: nombre, idUsuario: auth.idActual, descripcion: "Lista personalizada" });
        cerrarModalNuevaPlaylist();
        cargarGrillaPlaylists();
    } catch (e) { alert("Error al crear"); }
};