console.log("hola");
let artistas;
// [ {apellido: null, contraseña: '123456', correo: null, generoMusical: 'soundtrack', idArtista: 2, nombre: "21 Savage", nombreArtistico: "21 Savage"}]

const url = "http://localhost:8080/api/artistas";

async function getData() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    artistas = await response.json();
    // console.log(artistas);
    crearVistaArtista(artistas);
  } catch (error) {
    console.error(error.message);
  }
}

getData(url);

async function crearVistaArtista(arrayDeArtistas) {
  let nombreArtistico, generoMusical;
  for (let i = 0; i < arrayDeArtistas.length; i++) {
    // console.log(arrayDeArtistas[i].nombreArtistico);
    nombreArtistico = arrayDeArtistas[i].nombreArtistico;
    generoMusical = arrayDeArtistas[i].generoMusical;
    const artista = `<div>
                        <h4>${nombreArtistico}</h4>
                        <p>${generoMusical}</p>
                    </div>`;
    document.getElementById("artistas").innerHTML += artista;
  }
}
