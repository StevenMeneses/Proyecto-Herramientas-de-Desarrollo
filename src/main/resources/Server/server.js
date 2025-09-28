// En tu server.js, REEMPLAZA la configuración de productStorage:
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const collectionType = req.body.collectionType || 'general';
    let collectionDir;
    
    // Determinar la carpeta según el tipo de colección
    if (collectionType === 'SeaCollection') {
      collectionDir = path.join(__dirname, 'uploads', 'sea-collection');
    } else if (collectionType === 'MataritaCollection') {
      collectionDir = path.join(__dirname, 'uploads', 'matarita-collection');
    } else if (collectionType === 'BestSellers') {
      collectionDir = path.join(__dirname, 'uploads', 'best-sellers');
    } else {
      collectionDir = path.join(__dirname, 'uploads', 'categories');
    }
    
    // Crear carpeta si no existe
    if (!fs.existsSync(collectionDir)) {
      fs.mkdirSync(collectionDir, { recursive: true });
      console.log('📁 Carpeta creada:', collectionDir);
    }
    
    console.log('📂 Guardando imagen en:', collectionDir);
    cb(null, collectionDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `product-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Y MODIFICA la ruta de productos para que use la carpeta correcta:
app.post('/api/upload-product-image', uploadProduct.single('productImage'), (req, res) => {
  console.log('📸 Subiendo imagen de producto...');
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }
    
    const collectionType = req.body.collectionType || 'general';
    let imageUrl;
    
    // Construir la URL según la colección
    if (collectionType === 'SeaCollection') {
      imageUrl = `http://localhost:${PORT}/uploads/sea-collection/${req.file.filename}`;
    } else if (collectionType === 'MataritaCollection') {
      imageUrl = `http://localhost:${PORT}/uploads/matarita-collection/${req.file.filename}`;
    } else if (collectionType === 'BestSellers') {
      imageUrl = `http://localhost:${PORT}/uploads/best-sellers/${req.file.filename}`;
    } else {
      imageUrl = `http://localhost:${PORT}/uploads/categories/${req.file.filename}`;
    }
    
    console.log('✅ Imagen subida para colección:', collectionType);
    res.json({ 
      success: true, 
      imageUrl: imageUrl, 
      filename: req.file.filename,
      collectionType: collectionType
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});