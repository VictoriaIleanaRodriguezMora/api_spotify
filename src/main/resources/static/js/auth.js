const auth = {

    idActual: localStorage.getItem('vibe_id') || null,
    rolActual: localStorage.getItem('vibe_rol') || null,
    nombre: localStorage.getItem('nombre'),

    estaAutenticado() {
        return this.idActual !== null;
    },

    async login(correo, contrasena) {
        try {
            const respuestaTexto = await api.post('/usuarios/login', { correo, contraseña: contrasena });
            
            if (respuestaTexto.includes("ID: ")) {
                const idExtraccion = respuestaTexto.split("ID: ")[1];
                
                
                const datosUsuario = await api.get('/usuarios/' + idExtraccion);
                const nombreReal = datosUsuario.nombre;

                const esAdmin = correo.endsWith('@vibeforge.com');
                const rolAsignado = esAdmin ? 'ADMIN' : 'USUARIO';

                
                localStorage.setItem('vibe_id', idExtraccion);
                localStorage.setItem('vibe_rol', rolAsignado);
                localStorage.setItem('nombre', nombreReal);

                this.idActual = idExtraccion;
                this.rolActual = rolAsignado;
                this.nombre = nombreReal;

                return { exito: true, rol: rolAsignado };
            } else {
                return { exito: false, mensaje: "Credenciales incorrectas" };
            }
        } catch (error) {
            return { exito: false, mensaje: "Error de conexión" };
        }
    },

    async registro(nombre, correo, contrasena) {
        try {
            const respuesta = await api.post('/usuarios/registro', { nombre, correo, contraseña: contrasena });
            if (respuesta && respuesta.idUsuario) {
                return { exito: true };
            }
            return { exito: false, mensaje: "Error al crear la cuenta" };
        } catch (error) {
            return { exito: false, mensaje: "Error de conexión" };
        }
    },


logout: function() {
        localStorage.clear();
        
        this.idActual = null;
        this.rolActual = null;
        this.nombre = null;
        this.usuario = null;
        window.location.href = '/index.html';
    }
};