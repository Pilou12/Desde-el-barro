import localtunnel from 'localtunnel';
import { exec } from 'child_process';
import fs from 'fs';

console.log("Iniciando preview local...");
const serve = exec('npx vite preview --port 8080');

setTimeout(async () => {
  console.log("Abriendo túnel...");
  try {
    const tunnel = await localtunnel({ port: 8080 });
    fs.writeFileSync('tunnel.txt', tunnel.url);
    console.log("Túnel abierto en:", tunnel.url);
    
    tunnel.on('close', () => {
      console.log('Túnel cerrado.');
    });
  } catch (err) {
    console.error("Error al abrir el túnel:", err);
  }
}, 3000); // Esperar 3 segundos a que Vite inicie
