// Juegos JC - utilidades sencillas (sin complicaciones)
const JC = {
  siteName: "Juegos JC",
  gameName: "Infinity Evolution",
  currentVersion: "v1.0",
  nextVersion: "v1.1",
  // Cambia esto si algún día el juego está en otra URL
  gamePath: "./game/index.html"
};

function setText(id, value){
  const el = document.getElementById(id);
  if(el) el.textContent = value;
}
function setHref(id, value){
  const el = document.getElementById(id);
  if(el) el.href = value;
}

document.addEventListener("DOMContentLoaded", () => {
  setText("siteName", JC.siteName);
  setText("gameName", JC.gameName);
  setText("currentVersion", JC.currentVersion);
  setText("nextVersion", JC.nextVersion);

  setHref("playBtn", "game.html");
  setHref("gameLink", "game.html");
  setHref("directPlay", JC.gamePath);

  // En la página del juego, intenta cargar el iframe
  const frame = document.getElementById("gameFrame");
  if(frame){
    frame.src = JC.gamePath;
  }

  // Mostrar año en footer
  const y = document.getElementById("year");
  if(y) y.textContent = String(new Date().getFullYear());
});