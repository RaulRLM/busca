// Variables globales y valores por defecto
let board = document.getElementById('board') // Div en el que se guardará el tablero de juego
let filas = parseInt(document.getElementById('filas').value) // Numero de filas por defecto
let columnas = parseInt(document.getElementById('columnas').value) // Numero de columnas por defecto
let mineCount = parseInt(document.getElementById('minas').value) // Cantidad de minas por defecto
let gameBoard // Variable que almacena los diferentes parámetros de una casilla (si es una mina, el número de minas a su alrededor, etc.)
let PrimerClick // Variable booleana que almacena si en esta partida se ha revelado una casilla o no
let MinasEncontradas // Variable que gestiona cuántos banderines hay colocados
let unrevealedSafeCells // Variable que guarda el número de casillas sin minas que faltan por revelar
let temporizador // Temporizador
let tiempo = 0 // Tiempo en segundos
let mejoresTiempos = [] // Array para almacenar los mejores tiempos
let nombreJugador

// Cargar los mejores tiempos desde el almacenamiento local del navegador al cargar la página
window.addEventListener('load', function () {
  const storedMejoresTiempos = localStorage.getItem('mejoresTiempos')
  if (storedMejoresTiempos) {
    mejoresTiempos = JSON.parse(storedMejoresTiempos)
  }
})

// Función para obtener el nombre del jugador del localStorage o pedirlo al jugador si no está almacenado
function obtenerNombreJugador() {
  nombreJugador = localStorage.getItem('nombreJugador')
  document.getElementById('ingresarNombreContainer').style.display = 'block'
}

// Iniciar el juego
function iniciarJuego() {
  principal()
}

// Función para iniciar el temporizador
function iniciarTemporizador() {
  tiempo = 0
  const tiempos = document.querySelectorAll('.tiempo')
  tiempos.forEach((span) => {
    span.innerHTML = tiempo
  })
  temporizador = setInterval(function () {
    tiempo++
    tiempos.forEach((span) => {
      span.innerHTML = tiempo
    })
  }, 1000)
}

// Función para detener el temporizador
function detenerTemporizador() {
  clearInterval(temporizador)
}

// Función para reiniciar el temporizador
function reiniciarTemporizador() {
  detenerTemporizador()
  tiempo = 0
  const tiempos = document.querySelectorAll('.tiempo')
  tiempos.forEach((span) => {
    span.innerHTML = tiempo
  })
}

// Función para manejar el evento cuando se hace clic en el botón de guardar nombre
/// Función para manejar el evento cuando se hace clic en el botón de guardar nombre
function guardarNombre() {
  const nombreJugador = document.getElementById('nombre').value.trim();
  const errorMensajeExistente = document.getElementById('errorMensaje');

  if (!nombreJugador) {
      if (!errorMensajeExistente) {
          const errorMensaje = document.createElement('h6');
          errorMensaje.textContent = 'Debes ingresar un nombre';
          errorMensaje.style.color = 'red';
          errorMensaje.id = 'errorMensaje'; // Agregar un identificador al mensaje de error
          document.getElementById('ingresarNombreContainer').appendChild(errorMensaje);
      }
      return; // Evitar continuar con el guardado si no se ingresa un nombre
  }

  // Si hay un mensaje de error existente, eliminarlo
  if (errorMensajeExistente) {
      errorMensajeExistente.remove();
  }

  // Guardar el nombre y tiempo del jugador en una estructura de datos o base de datos
  const nuevoTiempo = { nombre: nombreJugador, tiempo: tiempo };
  mejoresTiempos.push(nuevoTiempo);
  mejoresTiempos.sort((a, b) => a.tiempo - b.tiempo); // Ordenar los tiempos de menor a mayor
  if (mejoresTiempos.length > 10) {
      mejoresTiempos.pop(); // Eliminar el último elemento si hay más de 10 mejores tiempos
  }
  // Guardar los mejores tiempos actualizados en el almacenamiento local
  localStorage.setItem('mejoresTiempos', JSON.stringify(mejoresTiempos));
  
  // Actualizar y mostrar los 10 mejores tiempos en el div correspondiente
  mostrarMejoresTiempos();
  
  // Ocultar el div de ingresar nombre
  document.getElementById('ingresarNombreContainer').classList.add('hidden');
  document.getElementById('ingresarNombreContainer').style.display = 'none';
}


// Función para mostrar los 10 mejores tiempos
function mostrarMejoresTiempos() {
  const mejoresTiemposDiv = document.getElementById('mejoresTiempos')
  mejoresTiemposDiv.innerHTML = '<h1>Top 10 de Mejores Tiempos</h1>'
  mejoresTiempos.forEach((tiempo, index) => {
    mejoresTiemposDiv.innerHTML += `<p>${index + 1}. ${tiempo.nombre}: ${
      tiempo.tiempo
    } segundos</p>`
  })
}

// Cargar los mejores tiempos desde el almacenamiento local al iniciar la página
window.onload = function () {
  const storedMejoresTiempos = localStorage.getItem('mejoresTiempos')
  if (storedMejoresTiempos) {
    mejoresTiempos = JSON.parse(storedMejoresTiempos)
  }
  mostrarMejoresTiempos() // Mostrar los mejores tiempos al cargar la página
}

// Función que se ejecutará cuando el video termine de reproducirse
function videoEnded() {
  document.getElementById('video').style.display = 'none' // Ocultar el video cuando termine
}

// Función para establecer el estilo 0
function estilo0() {
  document.querySelector(':root').style.setProperty('--mina', 'url("mina.svg")')
  document.body.style.backgroundImage = ''
}

// Función para establecer el estilo 1
function estilo1() {
  document
    .querySelector(':root')
    .style.setProperty('--mina', 'url("mina1.svg")')
  document.body.style.backgroundImage = 'url("1win.jpeg")'
}

// Generar la primera partida con los valores por defecto
principal()

// Función para iniciar una partida
function principal() {
  //Si las filas introducidas por el usuario son más de dos se las asignamos a la variable,
  // si no, avisamos al usuario y el valor de filas se mantendrá igual al último utilizado
  if (document.getElementById('filas').value > 2)
    filas = document.getElementById('filas').value
  else alert('Escribe 3 filas o más')

  //Si las columnas introducidas por el usuario son más de cuatro se las asignamos a la variable,
  // si no, avisamos al usuario, y el valor de columnas se mantendrá igual al último utilizado
  if (document.getElementById('columnas').value > 4)
    columnas = document.getElementById('columnas').value
  else alert('Escribe 5 columnas o más')

  // Limitar el número máximo de filas a 15
  if (document.getElementById('filas').value > 15) {
    filas = 15
    document.getElementById('filas').value = 15 // Restablecer el valor en la interfaz de usuario
    alert(
      'No se permiten más de 15 filas. Se ha establecido el valor máximo de filas a 15.',
    )
  }
  // Limitar el número máximo de columnas a 30
  if (document.getElementById('columnas').value > 30) {
    columnas = 30
    document.getElementById('columnas').value = 30 // Restablecer el valor en la interfaz de usuario
    alert(
      'No se permiten más de 30 columnas. Se ha establecido el valor máximo de columnas a 30.',
    )
  }

  //Si las minas son inferiores a filas * columnas (el número de casillas), entonces se las asignamos a la variable,
  //de lo contrario, la generación de minas quedaría en bucle, por lo que avisamos al usuario y asignamos la máxima
  //cantidad de minas en el tablero más pequeño posible (14 minas)
  if (document.getElementById('minas').value < filas * columnas)
    mineCount = document.getElementById('minas').value
  else {
    alert(
      'Has introducido más minas que casillas, introduciendo valores por defecto (14)',
    )
    mineCount = 14
  } // Cantidad de minas

  PrimerClick = true
  MinasEncontradas = 0
  unrevealedSafeCells = filas * columnas - mineCount
  gameBoard = []

  board.innerHTML = ''
  for (let row = 0; row < filas; row++) {
    for (let col = 0; col < columnas; col++) {
      const cell = document.createElement('div')
      cell.dataset.row = row
      cell.dataset.col = col
      cell.addEventListener('click', handleClick)
      cell.addEventListener('contextmenu', toggleFlag) // Agregar evento de clic derecho
      board.appendChild(cell)
    }
  }
  document.querySelector(':root').style.setProperty('--num-filas', filas)
  document.querySelector(':root').style.setProperty('--num-columnas', columnas)
  document.querySelector('#numMinasRestantes').innerHTML =
    mineCount - MinasEncontradas

  reiniciarTemporizador() // Reiniciar temporizador
  createBoard()
}

// Función para crear el tablero
function createBoard() {
  // Crea el tablero y llena con casillas vacías.
  for (let row = 0; row < filas; row++) {
    const rowArray = []
    for (let col = 0; col < columnas; col++) {
      rowArray.push({
        isMine: false,
        isRevealed: false,
        isFlagged: 0,
        neighbors: 0,
      })
    }
    gameBoard.push(rowArray)
  }
}

// Función para colocar minas en ubicaciones aleatorias
function plantMines(r, c) {
  // Coloca minas en ubicaciones aleatorias.
  for (let i = 0; i < mineCount; i++) {
    let row, col
    do {
      row = Math.floor(Math.random() * filas)
      col = Math.floor(Math.random() * columnas)
    } while (gameBoard[row][col].isMine || (row === r && col === c))
    gameBoard[row][col].isMine = true
  }
}

// Función para calcular el número de minas vecinas para cada casilla
function calculateNeighbors() {
  // Calcula el número de minas vecinas para cada casilla.
  for (let row = 0; row < filas; row++) {
    for (let col = 0; col < columnas; col++) {
      if (gameBoard[row][col].isMine) {
        continue
      }

      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (
            r >= 0 &&
            c >= 0 &&
            r < filas &&
            c < columnas &&
            gameBoard[r][c].isMine
          ) {
            gameBoard[row][col].neighbors++
          }
        }
      }
    }
  }
}

// Función para revelar una casilla
function revealCell(row, col) {
  if (row < 0 || col < 0 || row >= filas || col >= columnas) return // Evita desbordamiento del tablero.

  let cell = gameBoard[row][col] // Creamos una variable con las propiedades de la casilla en esta fila y columna
  if (cell.isRevealed || cell.isFlagged === 1) return // No revelamos una casilla ya revelada o con bandera.
  cell.isRevealed = true
  if (PrimerClick) {
    plantMines(row, col)
    calculateNeighbors()
    PrimerClick = false
    iniciarTemporizador()
  }

  let cellElement = document.querySelector(
    `[data-row="${row}"][data-col="${col}"]`,
  )
  cellElement.classList.add('destapado')

  if (cell.isMine) {
    cellElement.classList.add('icon-mina')
    cellElement.style.backgroundColor = 'red' // Unicode del símbolo de la bomba
    detenerTemporizador() // Detener temporizador
    desabilitar()
    // Código para mostrar el contenedor gameOverContainer después de 5 segundos
    setTimeout(function () {
      const gameOverContainer = document.getElementById('gameOverContainer')
      gameOverContainer.style.display = 'block' // Mostrar el contenedor

      // Código para ocultar el contenedor después de 3 segundos adicionales (total 8 segundos)
      setTimeout(function () {
        gameOverContainer.style.display = 'none' // Ocultar el contenedor
      }, 5000)
    }, 2000)

    for (let r = 0; r < filas; r++) {
      for (let c = 0; c < columnas; c++) {
        if (gameBoard[r][c].isMine) {
          cell = gameBoard[r][c]
          cellElement = document.querySelector(
            `[data-row="${r}"][data-col="${c}"]`,
          )
          cellElement.classList.add('destapado')
          if (cell.isFlagged === 0) cellElement.classList.add('icon-mina')
          cellElement.style.backgroundColor = 'red'
        }
      }
    }

    video.style.display = 'block' // Mostrar el video
    video.play() // Reproducir el video

    const explosionAudio = document.getElementById('explosionAudio')
    explosionAudio.play()
  } else if (cell.neighbors === 0) {
    // Si la casilla no tiene minas vecinas, revela las casillas adyacentes.
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        revealCell(r, c)
      }
    }
    unrevealedSafeCells--
  } else {
    // Añado la clase que cotrola el color del numero dependiendo las minas que tiene alrededor.
    cellElement.classList.add('c' + gameBoard[row][col].neighbors)
    // Añade dentro de la casilla el numero de minas.
    cellElement.innerHTML = gameBoard[row][col].neighbors
    unrevealedSafeCells--
  }
}

// Función para verificar si el jugador ha ganado
function checkWin() {
  // El jugador gana si todas las casillas no minadas están reveladas.
  if (unrevealedSafeCells === 0) {
    alert('Has ganado') // Muestra un mensaje de victoria.
    detenerTemporizador() // Detener temporizador
    desabilitar()
    obtenerNombreJugador()
  }
}

// Función para deshabilitar los eventos de clic en las casillas
function desabilitar() {
  let aCasillas = board.children
  for (let i = 0; i < aCasillas.length; i++) {
    // Quitamos los listeners de los eventos a las casillas
    aCasillas[i].removeEventListener('click', handleClick)
    aCasillas[i].removeEventListener('contextmenu', toggleFlag)
  }
}

// Función para cambiar el estado de la bandera en una casilla al hacer clic derecho
function toggleFlag(event) {
  event.preventDefault() // Evitar el menú contextual del botón derecho
  const row = parseInt(event.target.dataset.row)
  const col = parseInt(event.target.dataset.col)
  const cell = gameBoard[row][col]
  const cellElement = document.querySelector(
    `[data-row="${row}"][data-col="${col}"]`,
  )

  if (!cell.isRevealed) {
    if (cell.isFlagged === 0) {
      if (MinasEncontradas < mineCount) {
        MinasEncontradas++
        cellElement.classList.add('icon-bandera') // Agregar bandera
        cell.isFlagged = 1 // Cambiar el estado a bandera(1)
      }
    } else if (cell.isFlagged === 1) {
      cellElement.classList.remove('icon-bandera')
      cellElement.classList.add('icon-duda') // Cambiar a interrogante
      MinasEncontradas--
      cell.isFlagged = 2 // Cambiar el estado a interrogante(2)
    } else {
      cellElement.classList.remove('icon-duda') // Remover interrogante
      cell.isFlagged = 0 // Cambiar el estado a vacío(0)
    }
  }
  document.querySelector('#numMinasRestantes').innerHTML =
    mineCount - MinasEncontradas
}

// Función para manejar el evento de clic en una casilla
function handleClick(event) {
  const row = parseInt(event.target.dataset.row)
  const col = parseInt(event.target.dataset.col)

  revealCell(row, col)
  checkWin()
}

////////////////// FUNCION PARA REINICIAR LOS DATOS DEL LOCAL STORAGE //////////////////
document
  .getElementById('btnReiniciar')
  .addEventListener('click', reiniciarEstadisticas);

function reiniciarEstadisticas() {
  localStorage.removeItem('mejoresTiempos');
  location.reload(); // Esto recargará la página automáticamente
}
/////////////////// ESTILOS BOTONES //////////////////

function iconos0() {
  document.querySelector(':root').style.setProperty('--mina', 'url("mina.svg")')
  document.querySelector(':root').style.setProperty('--flag', 'url("flag.svg")')
}
function iconos1() {
  document
    .querySelector(':root')
    .style.setProperty('--mina', 'url("mina1.svg")')
  document
    .querySelector(':root')
    .style.setProperty('--flag', 'url("flag1.svg")')
}
function iconos2() {
  document
    .querySelector(':root')
    .style.setProperty('--mina', 'url("mina2.svg")')
  document
    .querySelector(':root')
    .style.setProperty('--flag', 'url("flag2.svg")')
}
function iconos3() {
  document
    .querySelector(':root')
    .style.setProperty('--mina', 'url("mina3.svg")')
  document
    .querySelector(':root')
    .style.setProperty('--flag', 'url("flag3.svg")')
}
function estilo0() {
  document.getElementById('estilo').setAttribute('href', 'css/estilo1.css')
}
function estilo1() {
  document.getElementById('estilo').setAttribute('href', 'css/estilo2.css')
}
function estilo2() {
  document.getElementById('estilo').setAttribute('href', 'css/estilo3.css')
}
