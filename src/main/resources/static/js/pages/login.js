function renderLogin() {
    // Si está logueado, lo manda a su panel correspondiente y aborta el render
    if (auth.estaAutenticado()) {
        navigate(auth.rolActual === 'ADMIN' ? '/admin/home' : '/user/home');
        return;
    }

    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div style="display: flex; height: 100vh; justify-content: center; align-items: center; background: var(--bg-base);">
            <div style="background: var(--bg-surface); padding: 40px; border-radius: var(--radius-md); width: 100%; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                
                <h1 style="color: var(--primary); text-align: center; margin-bottom: 30px;">🎧 Vibeforge</h1>
                
                <div id="auth-container">
                    ${htmlFormularioLogin()}
                </div>

            </div>
        </div>
    `;
}



function htmlFormularioLogin() {
    return `
        <h2 style="margin-bottom: 20px;">Iniciar Sesión</h2>
        <div id="login-error" style="color: var(--error); margin-bottom: 15px; font-size: 14px; display: none;"></div>
        
        <input type="email" id="log-correo" placeholder="Correo electrónico" style="width: 100%; padding: 12px; margin-bottom: 15px; background: var(--bg-elevated); border: 1px solid #333; color: white; border-radius: var(--radius-sm);" onkeypress="verificarEnter(event)">
        <input type="password" id="log-pass" placeholder="Contraseña" style="width: 100%; padding: 12px; margin-bottom: 20px; background: var(--bg-elevated); border: 1px solid #333; color: white; border-radius: var(--radius-sm);" onkeypress="verificarEnter(event)">
        
        <button onclick="ejecutarLogin()" style="width: 100%; padding: 12px; background: var(--primary); color: #000; border: none; font-weight: bold; border-radius: var(--radius-pill); cursor: pointer; margin-bottom: 15px;">Entrar</button>
        
        <p style="text-align: center; color: var(--text-muted); font-size: 14px;">
            ¿No tienes cuenta? <span style="color: var(--primary); cursor: pointer;" onclick="cambiarARegistro()">Regístrate</span>
        </p>
    `;
}

window.verificarEnter = function(event) {
    if (event.key === "Enter") {
        ejecutarLogin();
    }
};


function htmlFormularioRegistro() {
    return `
        <h2 style="margin-bottom: 20px;">Crear Cuenta</h2>
        <div id="reg-error" style="color: var(--error); margin-bottom: 15px; font-size: 14px; display: none;"></div>
        
        <input type="text" id="reg-nombre" placeholder="Nombre completo" style="width: 100%; padding: 12px; margin-bottom: 15px; background: var(--bg-elevated); border: 1px solid #333; color: white; border-radius: var(--radius-sm);">
        <input type="email" id="reg-correo" placeholder="Correo electrónico" style="width: 100%; padding: 12px; margin-bottom: 15px; background: var(--bg-elevated); border: 1px solid #333; color: white; border-radius: var(--radius-sm);">
        <input type="password" id="reg-pass" placeholder="Contraseña" style="width: 100%; padding: 12px; margin-bottom: 20px; background: var(--bg-elevated); border: 1px solid #333; color: white; border-radius: var(--radius-sm);">
        
        <button onclick="ejecutarRegistro()" style="width: 100%; padding: 12px; background: var(--secondary); color: #fff; border: none; font-weight: bold; border-radius: var(--radius-pill); cursor: pointer; margin-bottom: 15px;">Registrarse</button>
        
        <p style="text-align: center; color: var(--text-muted); font-size: 14px;">
            ¿Ya tienes cuenta? <span style="color: var(--primary); cursor: pointer;" onclick="cambiarALogin()">Inicia Sesión</span>
        </p>
    `;
}

//FUNCIONES DE INTERACCIÓN

function cambiarARegistro() {
    document.getElementById('auth-container').innerHTML = htmlFormularioRegistro();
}

function cambiarALogin() {
    document.getElementById('auth-container').innerHTML = htmlFormularioLogin();
}

async function ejecutarLogin() {
    const correo = document.getElementById('log-correo').value;
    const pass = document.getElementById('log-pass').value;
    const errorDiv = document.getElementById('login-error');
    
    if(!correo || !pass) {
        errorDiv.innerText = "Por favor completa todos los campos";
        errorDiv.style.display = "block";
        return;
    }

    const resultado = await auth.login(correo, pass);
    
    if (resultado.exito) {
        navigate(resultado.rol === 'ADMIN' ? '/admin/home' : '/user/home');
    } else {
        errorDiv.innerText = resultado.mensaje;
        errorDiv.style.display = "block";
    }
}

async function ejecutarRegistro() {
    const nombre = document.getElementById('reg-nombre').value;
    const correo = document.getElementById('reg-correo').value;
    const pass = document.getElementById('reg-pass').value;
    const errorDiv = document.getElementById('reg-error');

    if(!nombre || !correo || !pass) {
        errorDiv.innerText = "Por favor completa todos los campos";
        errorDiv.style.display = "block";
        return;
    }

    const resultado = await auth.registro(nombre, correo, pass);
    
    if (resultado.exito) {
        alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
        cambiarALogin();
    } else {
        errorDiv.innerText = resultado.mensaje;
        errorDiv.style.display = "block";
    }
}