const ui = {
    renderLayout(contenidoPrincipal) {
        const rol = auth.rolActual;
        
        const menuItems = rol === 'ADMIN' ? `
            <div class="nav-item" onclick="navigate('/admin/home')">🏠 Panel Admin</div>
            <div class="nav-item" onclick="navigate('/admin/artistas')">👩‍🎤 Gestión de Catálogo</div>
            <div class="nav-item" onclick="navigate('/admin/metricas')">📊 Métricas</div>
        ` : `
            <div class="nav-item" onclick="navigate('/user/home')">🏠 Inicio</div>
            <div class="nav-item" onclick="navigate('/user/playlists')">📚 Mis Playlists</div>
        `;

        return `
            <div class="app-layout">
                <aside class="sidebar">
                    <div class="logo" style="cursor:pointer" onclick="navigate(auth.rolActual === 'ADMIN' ? '/admin/home' : '/user/home')">🎧 Vibeforge</div>
                    <nav class="nav-links">
                        ${menuItems}
                    </nav>
                </aside>

                <main class="main-area">
<header class="topbar" style="display:flex; justify-content:space-between; align-items:center; flex-shrink: 0;">
    
    <!-- BOTONES MEJORADOS CON LÓGICA DE ESTADO -->
    <div class="topbar-nav-container">
        <button class="nav-arrow" onclick="volverAtras()" title="Atrás" id="btn-back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>
        </button>
        <button class="nav-arrow" onclick="window.history.forward()" title="Adelante" id="btn-forward">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>
        </button>
    </div>

    <!-- BUSCADOR CON ICONO SVG -->
    <div class="search-container">
        <span class="search-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg>
        </span>
        <input type="text" id="global-search" class="global-search-input" 
               placeholder="Buscar..." 
               autocomplete="off" 
               onfocus="cargarCacheBuscador()" 
               oninput="ejecutarBusquedaGlobal(this.value)">
        
        <div id="search-dropdown" class="search-dropdown"></div>
    </div>
    
<div class="topbar-user" style="position: relative; margin-left: auto; display: flex; align-items: center; gap: 15px;">
                            
                            <span style="color: var(--text-muted); font-size: 14px; font-weight: 500;">
                                Hola de nuevo, <span style="color: white; font-weight: bold;">${auth.nombre || auth.usuario || 'Usuario'}</span>
                            </span>

                            <div onclick="document.getElementById('user-menu').style.display = document.getElementById('user-menu').style.display === 'block' ? 'none' : 'block'" 
                                 style="cursor: pointer; display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.5); padding: 5px 15px 5px 5px; border-radius: 500px; border: 1px solid transparent; transition: 0.2s;" 
                                 onmouseover="this.style.background='#282828'; this.style.border='1px solid #444'" 
                                 onmouseout="this.style.background='rgba(0,0,0,0.5)'; this.style.border='1px solid transparent'">
                                
                                <span style="background: var(--primary); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/></svg>
                                </span>
                                
                                <span style="font-weight: bold; color: white; font-size: 14px;">Mi Cuenta</span>
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 11L3 6h10l-5 5z"/></svg>
                            </div>
                            
                            <div id="user-menu" style="display: none; position: absolute; top: calc(100% + 15px); right: 0; background: #282828; border-radius: 4px; box-shadow: 0 15px 40px rgba(0,0,0,0.8); width: 200px; z-index: 10000; border: 1px solid #3e3e3e; overflow: hidden;">
                                
                                <div onclick="navigate('/user/profile'); document.getElementById('user-menu').style.display='none'" style="padding: 14px 15px; cursor: pointer; color: var(--text-muted); transition: 0.2s; display: flex; align-items: center; gap: 12px; font-weight: 500;" onmouseover="this.style.background='#3e3e3e'; this.style.color='white'" onmouseout="this.style.background='transparent'; this.style.color='var(--text-muted)'">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.766-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.766-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/></svg>
                                    Configuración de Perfil
                                </div>
                                
                                <div style="height: 1px; background: #3e3e3e;"></div>
                                
                                <div onclick="auth.logout()" style="padding: 14px 15px; cursor: pointer; color: var(--text-muted); transition: 0.2s; display: flex; align-items: center; gap: 12px; font-weight: 500;" onmouseover="this.style.background='#3e3e3e'; this.style.color='white'" onmouseout="this.style.background='transparent'; this.style.color='var(--text-muted)'">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/><path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/></svg>
                                    Cerrar Sesión
                                </div>
                            </div>
                        </div>
</header>
                    
                    <div class="content-area" onclick="document.getElementById('search-dropdown').style.display='none'; document.getElementById('user-menu').style.display='none'">
                        ${contenidoPrincipal}
                    </div>
                </main>
            </div>
        `;
    }
};

window.cacheBuscador = { artistas: [], albumes: [], cargado: false };
window.timerDebounce = null;

window.cargarCacheBuscador = async function() {
    if (window.cacheBuscador.cargado) return;
    try {
        const [artistas, albumes] = await Promise.all([
            api.get('/artistas'),
            api.get('/albumes')
        ]);
        window.cacheBuscador.artistas = artistas;
        window.cacheBuscador.albumes = albumes;
        window.cacheBuscador.cargado = true;
    } catch (e) {
        console.error("Fallo al cargar caché del buscador");
    }
};


window.volverAtras = function() {
    if (window.location.pathname !== '/user/home') {
        window.history.back();
    }
};


window.ejecutarBusquedaGlobal = function(texto) {
    const dropdown = document.getElementById('search-dropdown');
    texto = texto.toLowerCase().trim();

    if (texto.length === 0) {
        dropdown.style.display = 'none';
        return;
    }

    cargarCacheBuscador();
    clearTimeout(window.timerDebounce);
    
    window.timerDebounce = setTimeout(() => {
        const artistasFiltrados = window.cacheBuscador.artistas.filter(a => a.nombreArtistico.toLowerCase().includes(texto)).slice(0, 4);
        const albumesFiltrados = window.cacheBuscador.albumes.filter(a => a.titulo.toLowerCase().includes(texto)).slice(0, 4);

        if (artistasFiltrados.length === 0 && albumesFiltrados.length === 0) {
            dropdown.innerHTML = '<div style="padding: 20px; color: var(--text-muted); text-align:center;">No encontramos resultados para "' + texto + '"</div>';
            dropdown.style.display = 'block';
            return;
        }

        let html = '';
        
        if (artistasFiltrados.length > 0) {
            html += '<div style="padding: 5px 10px; font-weight:bold; color:#b3b3b3; font-size: 11px; text-transform:uppercase; letter-spacing:1px; margin-bottom:5px;">Artistas</div>';
            artistasFiltrados.forEach(a => {
                const idSeguro = a.idArtista || a.id;
                html += `
                    <div onclick="navigate('/user/artist?id=${idSeguro}')" style="padding: 8px; display:flex; align-items:center; gap: 15px; cursor:pointer; border-radius: 6px; transition:0.2s;" onmouseover="this.style.background='#3e3e3e'" onmouseout="this.style.background='transparent'">
                        <img src="${a.imagenUrl || 'https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021'}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                        <div style="display: flex; flex-direction: column;">
                            <span style="color:white; font-weight:bold; font-size:15px;">${a.nombreArtistico}</span>
                            <span style="color:var(--text-muted); font-size:13px;">Artista</span>
                        </div>
                    </div>`;
            });
            html += '<div style="height: 1px; background: #333; margin: 10px 0;"></div>';
        }

        if (albumesFiltrados.length > 0) {
            html += '<div style="padding: 5px 10px; font-weight:bold; color:#b3b3b3; font-size: 11px; text-transform:uppercase; letter-spacing:1px; margin-bottom:5px;">Álbumes</div>';
            albumesFiltrados.forEach(a => {
                html += `
                    <div onclick="navigate('/user/album?id=${a.idAlbum}')" style="padding: 8px; display:flex; align-items:center; gap: 15px; cursor:pointer; border-radius: 6px; transition:0.2s;" onmouseover="this.style.background='#3e3e3e'" onmouseout="this.style.background='transparent'">
                        <img src="${a.imagenUrl || 'https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021'}" style="width: 48px; height: 48px; border-radius: 4px; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                        <div style="display: flex; flex-direction: column;">
                            <span style="color:white; font-weight:bold; font-size:15px;">${a.titulo}</span>
                            <span style="color:var(--text-muted); font-size:13px;">Álbum</span>
                        </div>
                    </div>`;
            });
        }

        dropdown.innerHTML = html;
        dropdown.style.display = 'block';
    }, 250); 
};



document.addEventListener('click', function(event) {
    const searchDropdown = document.getElementById('search-dropdown');
    const searchInput = document.getElementById('global-search');
    const userMenu = document.getElementById('user-menu');
    const btnUser = document.getElementById('btn-user-menu');

    if (searchDropdown && searchDropdown.style.display === 'block') {
        if (!searchInput.contains(event.target) && !searchDropdown.contains(event.target)) {
            searchDropdown.style.display = 'none';
        }
    }


    if (userMenu && userMenu.style.display === 'block') {
        if (!userMenu.contains(event.target) && event.target.closest('.topbar-user') === null) {
            userMenu.style.display = 'none';
        }
    }
});