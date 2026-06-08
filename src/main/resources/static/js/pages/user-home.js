async function renderUserHome() {
    if (!auth.estaAutenticado()) {
        navigate('/login');
        return;
    }

    const contenidoHTML = `
        <h1 style="margin-bottom: 20px; font-size: 2rem; color: var(--primary);">Bienvenido a tu Forja Musical</h1>
        <h2 style="margin-bottom: 20px; color: var(--text-muted);">Artistas Recomendados</h2>
        
        <div class="grid" id="grid-artistas">
            <p style="color: var(--text-muted);">Cargando artistas desde el servidor...</p>
        </div>
    `;

    document.getElementById('app').innerHTML = ui.renderLayout(contenidoHTML);

try {
        const artistas = await api.get('/artistas');
        const grid = document.getElementById('grid-artistas');
        
        const IMG_SILUETA = 'https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021';
        let tarjetasHTML = '';
        
        artistas.slice(0, 100).forEach(artista => {
            const imagen = artista.imagenUrl || IMG_SILUETA;
            const idSeguro = artista.idArtista || artista.id;
            
            tarjetasHTML += `
                <div class="card" onclick="navigate('/user/artist?id=${idSeguro}')">
                    <img src="${imagen}" class="card-img" alt="Foto" loading="lazy">
                    <div class="card-title">${artista.nombreArtistico}</div>
                    <div class="card-subtitle">${artista.generoMusical || 'Artista'}</div>
                </div>
            `;
        });
        grid.innerHTML = tarjetasHTML;

    } catch (error) {
        document.getElementById('grid-artistas').innerHTML = `<p style="color: var(--error);">Error al cargar el catálogo de artistas.</p>`;
    }
}