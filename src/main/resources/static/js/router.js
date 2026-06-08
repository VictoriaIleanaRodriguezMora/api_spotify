const appContainer = document.getElementById('app');

let historialInterno = [];

function navigate(path, esHistorial = false) {
    if (window.location.protocol !== 'file:') {
        if (!esHistorial) {
            window.history.pushState({}, path, window.location.origin + path);
        }
    }
    
    historialInterno.push(path);
    handleRoute(path);
}

function handleRoute(forzarRuta = null) {
    let rawPath = forzarRuta || window.location.pathname;
    let path = rawPath.split('?')[0];
    
    if (path.endsWith('index.html') || path === '/' || path === '') {
        path = '/login';
    }

const routes = {
        '/login': typeof renderLogin !== 'undefined' ? renderLogin : null,
        '/user/home': typeof renderUserHome !== 'undefined' ? renderUserHome : null,
        '/admin/home': typeof renderAdminHome !== 'undefined' ? renderAdminHome : null,
        '/user/artist': typeof renderArtist !== 'undefined' ? renderArtist : null,
        '/user/album': typeof renderAlbum !== 'undefined' ? renderAlbum : null,
        '/user/playlist': typeof renderPlaylist !== 'undefined' ? renderPlaylist : null,
        '/user/profile': typeof renderProfile !== 'undefined' ? renderProfile : null,
        '/user/playlists': typeof renderUserPlaylists !== 'undefined' ? renderUserPlaylists : null
    };
    const renderFunction = routes[path];

    if (renderFunction) {
        appContainer.innerHTML = '';
        renderFunction();
    } else {
        console.error("Ruta no encontrada:", path);
        appContainer.innerHTML = `
            <div style="padding: 50px; text-align: center; color: white;">
                <h1>Error de Navegación</h1>
                <p>La ruta <b>${path}</b> no existe.</p>
                <button onclick="navigate('/user/home')">Volver al Inicio</button>
            </div>
        `;
    }


    const btnBack = document.getElementById('btn-back');
    if (btnBack) {
        if (path === '/user/home' || path === '/login') {
            btnBack.disabled = true;
            btnBack.style.opacity = '0.3';
            btnBack.style.cursor = 'not-allowed';
        } else {
            btnBack.disabled = false;
            btnBack.style.opacity = '1';
            btnBack.style.cursor = 'pointer';
        }
    }
}

window.volverAtras = function() {
    const path = window.location.pathname;
    if (path !== '/user/home' && path !== '/login') {
        window.history.back();
    }
};

window.addEventListener('popstate', () => handleRoute());

handleRoute();