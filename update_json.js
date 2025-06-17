const fs = require('fs');
const path = require('path');

// Ruta al archivo original y al archivo de salida
const originalFilePath = path.join(__dirname, 'productos_supermercados.json');
const outputFilePath = path.join(__dirname, 'productos_supermercados_actualizado.json');

// Lista de archivos de imágenes locales
const localImages = [
  'desodorante.webp',
  'mayonesa.webp',
  'toallas femeninas.webp',
  'papel higienico.jpg',
  'mermelada.webp',
  'lentejas.png',
  'sal dos anclas.webp',
  'fideo spaghetti.jpg',
  'manteca sancor.jpeg',
  'pure de tomate.jpg',
  'carne.jpg',
  'pechuga de polloo.png',
  'manzana.jpg',
  'cebolla.jpg',
  'banana.jpg',
  'atun la campagnola.webp',
  'gaseosa coca cola.jpg',
  'cerveza quilmes.jpg',
  'detergente ala.jpg',
  'cacao nesquik.jpg',
  'arveja arcor.jpeg',
  'azucar ledesma.jpg',
  'yerba taragui.webp',
  'pan bimbo.webp',
  'queso cremoso.jpg',
  'leche sancor.jpg',
  'shampoo sedal.webp',
  'lavandina con ayudin.jpg',
  'galletita bagley.webp',
  'harina cañuelas.jpg',
  'zanahorias.jpg',
  'aceite cocinero.jpg',
  'arroz gallo.png',
  'café la morenita.jpg',
  'agua mineral.jpg',
  'pañales.webp',
  'jugo en polvo.jpeg',
];

// Mapeo de palabras clave a archivos de imagen y marcas
const imageBrandMap = [
  { keyword: /arroz/i, file: 'arroz gallo.png', brand: 'Gallo' },
  { keyword: /fideo|spaghetti/i, file: 'fideo spaghetti.jpg', brand: 'Lucchetti' },
  { keyword: /mayonesa/i, file: 'mayonesa.webp', brand: 'Hellmann\'s' },
  { keyword: /toallas/i, file: 'toallas femeninas.webp', brand: 'Always' },
  { keyword: /papel.*higienico/i, file: 'papel higienico.jpg', brand: 'Elite' },
  { keyword: /mermelada/i, file: 'mermelada.webp', brand: 'Arcor' },
  { keyword: /lentejas/i, file: 'lentejas.png', brand: 'Lucchetti' },
  { keyword: /sal/i, file: 'sal dos anclas.webp', brand: 'Dos Anclas' },
  { keyword: /manteca/i, file: 'manteca sancor.jpeg', brand: 'Sancor' },
  { keyword: /pure|tomate/i, file: 'pure de tomate.jpg', brand: 'Arcor' },
  { keyword: /carne/i, file: 'carne.jpg', brand: 'Friar' },
  { keyword: /pechuga/i, file: 'pechuga de polloo.png', brand: 'Granja Tres Arroyos' },
  { keyword: /manzana/i, file: 'manzana.jpg', brand: 'Patagonia' },
  { keyword: /cebolla/i, file: 'cebolla.jpg', brand: 'La Huerta' },
  { keyword: /banana/i, file: 'banana.jpg', brand: 'Ecuador' },
  { keyword: /atun/i, file: 'atun la campagnola.webp', brand: 'La Campagnola' },
  { keyword: /gaseosa|coca/i, file: 'gaseosa coca cola.jpg', brand: 'Coca-Cola' },
  { keyword: /cerveza/i, file: 'cerveza quilmes.jpg', brand: 'Quilmes' },
  { keyword: /detergente/i, file: 'detergente ala.jpg', brand: 'Ala' },
  { keyword: /cacao/i, file: 'cacao nesquik.jpg', brand: 'Nesquik' },
  { keyword: /arveja/i, file: 'arveja arcor.jpeg', brand: 'Arcor' },
  { keyword: /azucar/i, file: 'azucar ledesma.jpg', brand: 'Ledesma' },
  { keyword: /yerba/i, file: 'yerba taragui.webp', brand: 'Taragüi' },
  { keyword: /pan/i, file: 'pan bimbo.webp', brand: 'Bimbo' },
  { keyword: /queso/i, file: 'queso cremoso.jpg', brand: 'La Paulina' },
  { keyword: /leche/i, file: 'leche sancor.jpg', brand: 'Sancor' },
  { keyword: /shampoo/i, file: 'shampoo sedal.webp', brand: 'Sedal' },
  { keyword: /lavandina/i, file: 'lavandina con ayudin.jpg', brand: 'Ayudín' },
  { keyword: /galletita|dulce/i, file: 'galletita bagley.webp', brand: 'Bagley' },
  { keyword: /harina/i, file: 'harina cañuelas.jpg', brand: 'Molinos Cañuelas' },
  { keyword: /zanahoria/i, file: 'zanahorias.jpg', brand: 'La Huerta' },
  { keyword: /aceite/i, file: 'aceite cocinero.jpg', brand: 'Cocinero' },
  { keyword: /cafe|café/i, file: 'café la morenita.jpg', brand: 'La Morenita' },
  { keyword: /desodorante/i, file: 'desodorante.webp', brand: 'Rexona' },
  { keyword: /agua mineral/i, file: 'agua mineral.jpg', brand: 'Eco de los Andes' },
  { keyword: /pañales/i, file: 'pañales.webp', brand: 'Pampers' },
  { keyword: /jugo en polvo|jugo/i, file: 'jugo en polvo.jpeg', brand: 'Tang' },
];

function getImageAndBrand(productName) {
  for (const entry of imageBrandMap) {
    if (entry.keyword.test(productName)) return { file: entry.file, brand: entry.brand };
  }
  return { file: null, brand: 'Marca Genérica' };
}

// Leer el archivo original
fs.readFile(originalFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }

  try {
    const json = JSON.parse(data);
    if (!json.supermarkets || !Array.isArray(json.supermarkets)) {
      throw new Error('Estructura inesperada: falta el array supermarkets');
    }

    json.supermarkets.forEach(supermarket => {
      if (Array.isArray(supermarket.products)) {
        supermarket.products.forEach(producto => {
          // Asignar imagen y marca local si hay coincidencia
          const { file, brand } = getImageAndBrand(producto.name);
          if (file) {
            producto.image_url = file;
          }
          producto.brand = brand;
        });
      }
    });

    // Guardar el resultado en el nuevo archivo
    fs.writeFile(outputFilePath, JSON.stringify(json, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error al escribir el archivo:', err);
        return;
      }
      console.log('Archivo actualizado guardado en:', outputFilePath);
    });
  } catch (error) {
    console.error('Error al procesar el JSON:', error);
  }
}); 