async function renderProfile() {
    const SVG_PENCIL = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>`;

    const contenidoHTML = `
        <div style="max-width: 500px; margin: 40px auto; padding: 40px; background: #181818; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <h1 style="margin-bottom: 30px; font-size: 2rem; border-bottom: 1px solid #333; padding-bottom: 15px;">Ajustes de Perfil</h1>
            
            <div id="mensaje-perfil" style="margin-bottom: 20px; padding: 10px; border-radius: 4px; display: none; font-weight: bold; text-align: center;"></div>

            <div style="margin-bottom: 35px;">
                <label style="display: block; color: var(--text-muted); font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">Nombre de Usuario</label>
                <div style="position: relative;">
                    <input type="text" id="perfil-nombre" placeholder="Cargando tu nombre..." style="width: 100%; padding: 12px 40px 12px 15px; border-radius: 4px; border: 1px solid #555; background: #282828; color: white; outline: none; font-size: 16px; font-weight: bold; transition: 0.2s;" onfocus="this.style.border='1px solid var(--primary)'; this.style.background='#333'" onblur="this.style.border='1px solid #555'; this.style.background='#282828'">
                    <span style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none;">
                        ${SVG_PENCIL}
                    </span>
                </div>
            </div>

            <h3 style="margin: 30px 0 15px 0; color: white; border-top: 1px solid #333; padding-top: 20px;">Seguridad</h3>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; color: var(--text-muted); font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">Contraseña Actual</label>
                <input type="password" id="perfil-pass-actual" placeholder="Requerida solo si querés cambiar la clave..." style="width: 100%; padding: 12px 15px; border-radius: 4px; border: 1px solid #555; background: #282828; color: white; outline: none; transition: 0.2s;" onfocus="this.style.border='1px solid white'" onblur="this.style.border='1px solid #555'">
            </div>

            <div style="margin-bottom: 30px;">
                <label style="display: block; color: var(--text-muted); font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">Nueva Contraseña</label>
                <input type="password" id="perfil-pass-nueva" placeholder="Escribí tu nueva contraseña..." style="width: 100%; padding: 12px 15px; border-radius: 4px; border: 1px solid #555; background: #282828; color: white; outline: none; transition: 0.2s;" onfocus="this.style.border='1px solid white'" onblur="this.style.border='1px solid #555'">
            </div>

            <button onclick="guardarPerfil()" style="width: 100%; padding: 15px; border-radius: 500px; background: white; color: black; font-size: 16px; font-weight: bold; border: none; cursor: pointer; transition: 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">Guardar Cambios</button>
        </div>
    `;

    document.getElementById('app').innerHTML = ui.renderLayout(contenidoHTML);

    try {
        const usuario = await api.get('/usuarios/' + auth.idActual);
        document.getElementById('perfil-nombre').value = usuario.nombre || usuario.username || '';
    } catch(e) {
        mostrarMensaje("No se pudo conectar con la base de datos.", "error");
    }
}

window.guardarPerfil = async function() {
    const nombre = document.getElementById('perfil-nombre').value;
    const passActual = document.getElementById('perfil-pass-actual').value;
    const passNueva = document.getElementById('perfil-pass-nueva').value;

    const datosAEnviar = {};
    
    if (nombre.trim() !== '') datosAEnviar.nombre = nombre;
    
    if (passNueva.trim() !== '') {
        if (passActual.trim() === '') {
            mostrarMensaje("Por seguridad, ingresá tu contraseña actual.", "error");
            return;
        }
        datosAEnviar.passwordActual = passActual;
        datosAEnviar.passwordNueva = passNueva;
    }

    if (Object.keys(datosAEnviar).length === 0) return;

    try {
        await api.patch('/usuarios/' + auth.idActual + '/perfil', datosAEnviar);
        
        mostrarMensaje("¡Perfil actualizado con éxito!", "success");
        document.getElementById('perfil-pass-actual').value = '';
        document.getElementById('perfil-pass-nueva').value = '';

        if (datosAEnviar.nombre) {
            auth.nombre = datosAEnviar.nombre;
            localStorage.setItem('nombre', datosAEnviar.nombre);
            setTimeout(() => renderProfile(), 1000); 
        }

    } catch(e) {
        mostrarMensaje("La contraseña actual es incorrecta.", "error");
    }
};

function mostrarMensaje(texto, tipo) {
    const div = document.getElementById('mensaje-perfil');
    div.style.display = 'block';
    div.innerText = texto;
    div.style.background = tipo === 'error' ? 'rgba(233, 30, 99, 0.2)' : 'rgba(30, 215, 96, 0.2)';
    div.style.color = tipo === 'error' ? '#e91e63' : '#1ed760';
    div.style.border = tipo === 'error' ? '1px solid #e91e63' : '1px solid #1ed760';
}