const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();

const SERVER_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://proyecto-herramientas-de-desarrollo-1.onrender.com'
  : 'http://localhost:5000';

// URLs fijas para ambos entornos
const LOCAL_URL = 'http://localhost:5000';
const PRODUCTION_URL = 'https://proyecto-herramientas-de-desarrollo-1.onrender.com';

// Middlewares PRIMERO
app.use(cors({
    origin: ["http://localhost:3000", "https://proyecto-herramientas-de-desarrollo.onrender.com"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Función para mapear collectionType a nombre de carpeta
const mapCollectionToFolder = (collectionType) => {
    const mapping = {
        'SeaCollection': 'sea-collection',
        'MataritaCollection': 'matarita-collection', 
        'BestSellers': 'best-sellers',
        'seacollection': 'sea-collection',
        'mataritacollection': 'matarita-collection',
        'bestsellers': 'best-sellers'
    };
    return mapping[collectionType] || 'sea-collection';
};

// Función para generar URLs dinámicas con AMBAS opciones
const generateImageUrls = (filename, folder = '', collection = '') => {
    const pathSegment = collection ? `${collection}/${filename}` : `${folder}/${filename}`;
    
    return {
        localUrl: `${LOCAL_URL}/uploads/${pathSegment}`,
        productionUrl: `${PRODUCTION_URL}/uploads/${pathSegment}`,
        currentUrl: `${SERVER_BASE}/uploads/${pathSegment}`,
        path: `/uploads/${pathSegment}`
    };
};

// SOLUCIÓN: Configurar multer sin destination fija
const upload = multer({ 
    storage: multer.memoryStorage(), // Guardar en memoria primero
    limits: {
        fileSize: 10 * 1024 * 1024 // Límite de 10MB
    }
});

// Crear directorios necesarios al iniciar
const directories = [
    'uploads/categories', 
    'uploads/sea-collection', 
    'uploads/matarita-collection', 
    'uploads/best-sellers',
    'uploads/headers/sea-collection',
    'uploads/headers/matarita-collection',
    'uploads/headers/best-sellers',
    'uploads/headers/general'
];

directories.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log('📂 Directorio creado:', fullPath);
    }
});

// Log todas las peticiones
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.originalUrl}`);
    next();
});

// Rutas para servir imágenes específicas
app.get('/uploads/sea-collection/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', 'sea-collection', filename);
    
    console.log('🌊 Buscando imagen sea-collection:', filename);
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        console.log('❌ Imagen no encontrada en sea-collection:', filename);
        res.status(404).json({ 
            error: 'Imagen no encontrada en sea-collection',
            filename: filename
        });
    }
});

app.get('/uploads/matarita-collection/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', 'matarita-collection', filename);
    
    console.log('🍹 Buscando imagen matarita-collection:', filename);
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        console.log('❌ Imagen no encontrada en matarita-collection:', filename);
        res.status(404).json({ 
            error: 'Imagen no encontrada en matarita-collection',
            filename: filename
        });
    }
});

app.get('/uploads/best-sellers/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', 'best-sellers', filename);
    
    console.log('⭐ Buscando imagen best-sellers:', filename);
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        console.log('❌ Imagen no encontrada en best-sellers:', filename);
        res.status(404).json({ 
            error: 'Imagen no encontrada en best-sellers',
            filename: filename
        });
    }
});

app.get('/uploads/categories/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', 'categories', filename);
    
    console.log('📂 Buscando imagen categories:', filename);
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        console.log('❌ Imagen no encontrada en categories:', filename);
        res.status(404).json({ 
            error: 'Imagen no encontrada en categories',
            filename: filename
        });
    }
});

// Ruta para servir imágenes de header
app.get('/uploads/headers/:collection/:filename', (req, res) => {
    const { collection, filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', 'headers', collection, filename);
    
    console.log(`🖼️ Buscando imagen de header en ${collection}:`, filename);
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        console.log(`❌ Imagen de header no encontrada en ${collection}:`, filename);
        res.status(404).json({ 
            error: `Imagen de header no encontrada en ${collection}`,
            collection: collection,
            filename: filename
        });
    }
});

// Ruta genérica para cualquier imagen en uploads
app.get('/uploads/:collection/:filename', (req, res) => {
    const { collection, filename } = req.params;
    
    const collectionMapping = {
        'seacollection': 'sea-collection',
        'mataritacollection': 'matarita-collection',
        'bestsellers': 'best-sellers'
    };
    
    const actualCollection = collectionMapping[collection] || collection;
    const filePath = path.join(__dirname, 'uploads', actualCollection, filename);
    
    console.log(`🖼️ Buscando imagen en ${actualCollection}:`, filename);
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        console.log(`❌ Imagen no encontrada en ${actualCollection}:`, filename);
        res.status(404).json({ 
            error: `Imagen no encontrada en ${actualCollection}`,
            collection: actualCollection,
            filename: filename
        });
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.json({ 
        message: 'Servidor funcionando correctamente',
        environment: process.env.NODE_ENV || 'development',
        serverBase: SERVER_BASE,
        urls: {
            local: LOCAL_URL,
            production: PRODUCTION_URL
        },
        endpoints: {
            upload: 'POST /api/upload-product-image',
            upload_header: 'POST /api/upload-header-image',
            upload_sea_header: 'POST /api/upload-sea-collection-header-image',
            upload_matarita_header: 'POST /api/upload-matarita-collection-header-image',
            upload_bestsellers_header: 'POST /api/upload-best-sellers-header-image',
            images: 'GET /uploads/:collection/:filename',
            header_images: 'GET /uploads/headers/:collection/:filename',
            sea_collection_header: 'GET /api/sea-collection-header-image',
            matarita_collection_header: 'GET /api/matarita-collection-header-image',
            best_sellers_header: 'GET /api/best-sellers-header-image',
            files: 'GET /files'
        }
    });
});

// RUTA CORREGIDA - Manejo manual del archivo CON AMBAS URLs
app.post('/api/upload-product-image', upload.single('productImage'), (req, res) => {
    try {
        console.log('📤 Upload recibido - Body:', req.body);
        console.log('📤 File recibido:', req.file ? `Sí - ${req.file.originalname}` : 'No');

        if (!req.file) {
            console.log('❌ No se recibió archivo en la petición');
            return res.status(400).json({ 
                success: false,
                error: 'No se subió ningún archivo' 
            });
        }

        // Obtener collectionType del body (ahora debería estar disponible)
        let collection = 'sea-collection';
        if (req.body.collectionType) {
            collection = mapCollectionToFolder(req.body.collectionType);
            console.log('✅ CollectionType del body:', req.body.collectionType, '→', collection);
        } else {
            console.log('⚠️ No se encontró collectionType, usando por defecto:', collection);
        }

        // Crear directorio si no existe
        const uploadPath = path.join(__dirname, 'uploads', collection);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log('✅ Directorio creado:', uploadPath);
        }

        // Generar nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'product-' + uniqueSuffix + path.extname(req.file.originalname);
        const filePath = path.join(uploadPath, filename);

        console.log('💾 Guardando archivo en:', filePath);

        // Guardar el archivo manualmente
        fs.writeFileSync(filePath, req.file.buffer);

        // Verificar que el archivo se guardó correctamente
        if (!fs.existsSync(filePath)) {
            console.log('❌ Error: El archivo no se guardó');
            return res.status(500).json({
                success: false,
                error: 'Error al guardar el archivo en el servidor'
            });
        }

        // Generar TODAS las URLs
        const urls = generateImageUrls(filename, '', collection);

        console.log('✅ Archivo subido exitosamente:', {
            filename: filename,
            collectionTypeFromFrontend: req.body.collectionType,
            finalCollectionFolder: collection,
            localUrl: urls.localUrl,
            productionUrl: urls.productionUrl,
            currentUrl: urls.currentUrl,
            path: urls.path,
            fullPath: filePath
        });

        res.json({
            success: true,
            message: 'Archivo subido exitosamente',
            filename: filename,
            collection: collection,
            // URL principal (actual)
            imageUrl: urls.currentUrl,
            // AMBAS URLs para compatibilidad
            localUrl: urls.localUrl,
            productionUrl: urls.productionUrl,
            path: urls.path,
            fullPath: filePath,
            uploadedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error al subir archivo:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor al subir archivo: ' + error.message 
        });
    }
});

// RUTAS CORREGIDAS PARA HEADER IMAGES - BUSCAN IMÁGENES REALES CON AMBAS URLs
app.get('/api/sea-collection-header-image', (req, res) => {
    const headerPath = path.join(__dirname, 'uploads', 'headers', 'sea-collection');
    
    if (!fs.existsSync(headerPath)) {
        return res.status(404).json({
            success: false,
            error: 'Directorio de headers no encontrado'
        });
    }

    // Buscar archivos de imagen en el directorio
    const files = fs.readdirSync(headerPath)
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .sort((a, b) => {
            // Ordenar por fecha de modificación (más reciente primero)
            const statA = fs.statSync(path.join(headerPath, a));
            const statB = fs.statSync(path.join(headerPath, b));
            return statB.mtime.getTime() - statA.mtime.getTime();
        });

    if (files.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'No hay imágenes de header para Sea Collection',
            imageUrl: null
        });
    }

    // Tomar la imagen más reciente
    const latestImage = files[0];
    const urls = generateImageUrls(latestImage, 'headers/sea-collection');

    console.log('🌊 Header image encontrada para Sea Collection:', latestImage);

    res.json({
        success: true,
        // URL principal (actual)
        imageUrl: urls.currentUrl,
        // AMBAS URLs
        localUrl: urls.localUrl,
        productionUrl: urls.productionUrl,
        filename: latestImage,
        message: 'Imagen de header para Sea Collection'
    });
});

app.get('/api/matarita-collection-header-image', (req, res) => {
    const headerPath = path.join(__dirname, 'uploads', 'headers', 'matarita-collection');
    
    if (!fs.existsSync(headerPath)) {
        return res.status(404).json({
            success: false,
            error: 'Directorio de headers no encontrado'
        });
    }

    // Buscar archivos de imagen en el directorio
    const files = fs.readdirSync(headerPath)
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .sort((a, b) => {
            // Ordenar por fecha de modificación (más reciente primero)
            const statA = fs.statSync(path.join(headerPath, a));
            const statB = fs.statSync(path.join(headerPath, b));
            return statB.mtime.getTime() - statA.mtime.getTime();
        });

    if (files.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'No hay imágenes de header para Matarita Collection',
            imageUrl: null
        });
    }

    // Tomar la imagen más reciente
    const latestImage = files[0];
    const urls = generateImageUrls(latestImage, 'headers/matarita-collection');

    console.log('🍹 Header image encontrada para Matarita Collection:', latestImage);

    res.json({
        success: true,
        imageUrl: urls.currentUrl,
        localUrl: urls.localUrl,
        productionUrl: urls.productionUrl,
        filename: latestImage,
        message: 'Imagen de header para Matarita Collection'
    });
});

app.get('/api/best-sellers-header-image', (req, res) => {
    const headerPath = path.join(__dirname, 'uploads', 'headers', 'best-sellers');
    
    if (!fs.existsSync(headerPath)) {
        return res.status(404).json({
            success: false,
            error: 'Directorio de headers no encontrado'
        });
    }

    // Buscar archivos de imagen en el directorio
    const files = fs.readdirSync(headerPath)
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .sort((a, b) => {
            // Ordenar por fecha de modificación (más reciente primero)
            const statA = fs.statSync(path.join(headerPath, a));
            const statB = fs.statSync(path.join(headerPath, b));
            return statB.mtime.getTime() - statA.mtime.getTime();
        });

    if (files.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'No hay imágenes de header para Best Sellers',
            imageUrl: null
        });
    }

    // Tomar la imagen más reciente
    const latestImage = files[0];
    const urls = generateImageUrls(latestImage, 'headers/best-sellers');

    console.log('⭐ Header image encontrada para Best Sellers:', latestImage);

    res.json({
        success: true,
        imageUrl: urls.currentUrl,
        localUrl: urls.localUrl,
        productionUrl: urls.productionUrl,
        filename: latestImage,
        message: 'Imagen de header para Best Sellers'
    });
});

// Rutas alternativas que el frontend está intentando usar
app.get('/api/matarita-header-image', (req, res) => {
    // Redirigir a la ruta correcta
    const headerPath = path.join(__dirname, 'uploads', 'headers', 'matarita-collection');
    
    if (!fs.existsSync(headerPath)) {
        return res.status(404).json({
            success: false,
            error: 'Directorio de headers no encontrado'
        });
    }

    const files = fs.readdirSync(headerPath)
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .sort((a, b) => {
            const statA = fs.statSync(path.join(headerPath, a));
            const statB = fs.statSync(path.join(headerPath, b));
            return statB.mtime.getTime() - statA.mtime.getTime();
        });

    if (files.length === 0) {
        return res.status(404).json({
            success: false,
            error: 'No hay imágenes de header para Matarita Collection',
            imageUrl: null
        });
    }

    const latestImage = files[0];
    const urls = generateImageUrls(latestImage, 'headers/matarita-collection');

    res.json({
        success: true,
        imageUrl: urls.currentUrl,
        localUrl: urls.localUrl,
        productionUrl: urls.productionUrl,
        filename: latestImage,
        message: 'Imagen de header para Matarita Collection'
    });
});

// Función helper MEJORADA para subir imágenes de header CON AMBAS URLs
function uploadHeaderImage(req, res, collectionType) {
    try {
        console.log(`📤 Subiendo header image para ${collectionType}:`, req.file ? `Sí - ${req.file.originalname}` : 'No');

        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                error: 'No se subió ningún archivo' 
            });
        }

        const collection = mapCollectionToFolder(collectionType);
        
        const uploadPath = path.join(__dirname, 'uploads', 'headers', collection);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        // Limpiar imágenes antiguas (opcional - mantener solo las 5 más recientes)
        const existingFiles = fs.readdirSync(uploadPath)
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map(file => {
                const filePath = path.join(uploadPath, file);
                return {
                    name: file,
                    path: filePath,
                    time: fs.statSync(filePath).mtime.getTime()
                };
            })
            .sort((a, b) => b.time - a.time);

        // Mantener solo las 5 imágenes más recientes
        if (existingFiles.length >= 5) {
            const filesToDelete = existingFiles.slice(4);
            filesToDelete.forEach(file => {
                fs.unlinkSync(file.path);
                console.log(`🗑️ Imagen antigua eliminada: ${file.name}`);
            });
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'header-' + uniqueSuffix + path.extname(req.file.originalname);
        const filePath = path.join(uploadPath, filename);

        fs.writeFileSync(filePath, req.file.buffer);

        // Generar TODAS las URLs
        const urls = generateImageUrls(filename, `headers/${collection}`);

        console.log(`✅ Header image subida exitosamente para ${collectionType}:`, urls);

        res.json({
            success: true,
            message: `Imagen de header para ${collectionType} subida exitosamente`,
            // URL principal (actual)
            imageUrl: urls.currentUrl,
            // AMBAS URLs
            localUrl: urls.localUrl,
            productionUrl: urls.productionUrl,
            filename: filename,
            collection: collection,
            path: urls.path,
            uploadedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error(`❌ Error al subir header image para ${collectionType}:`, error);
        res.status(500).json({ 
            success: false,
            error: `Error al subir imagen de header: ${error.message}` 
        });
    }
}

// Ruta para subir imágenes de header (genérica) CON AMBAS URLs
app.post('/api/upload-header-image', upload.single('headerImage'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                error: 'No se subió ningún archivo' 
            });
        }

        const collectionType = req.body.collectionType || 'general';
        const collection = mapCollectionToFolder(collectionType);
        
        const uploadPath = path.join(__dirname, 'uploads', 'headers', collection);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'header-' + uniqueSuffix + path.extname(req.file.originalname);
        const filePath = path.join(uploadPath, filename);

        fs.writeFileSync(filePath, req.file.buffer);

        // Generar TODAS las URLs
        const urls = generateImageUrls(filename, `headers/${collection}`);

        res.json({
            success: true,
            message: 'Imagen de header subida exitosamente',
            imageUrl: urls.currentUrl,
            localUrl: urls.localUrl,
            productionUrl: urls.productionUrl,
            filename: filename,
            collection: collection,
            path: urls.path,
            uploadedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error al subir imagen de header:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al subir imagen de header' 
        });
    }
});

// Rutas específicas para subir headers de cada colección
app.post('/api/upload-sea-collection-header-image', upload.single('headerImage'), (req, res) => {
    uploadHeaderImage(req, res, 'SeaCollection');
});

app.post('/api/upload-matarita-collection-header-image', upload.single('headerImage'), (req, res) => {
    uploadHeaderImage(req, res, 'MataritaCollection');
});

app.post('/api/upload-best-sellers-header-image', upload.single('headerImage'), (req, res) => {
    uploadHeaderImage(req, res, 'BestSellers');
});

// Ruta para obtener información de archivos CON AMBAS URLs
app.get('/files', (req, res) => {
    try {
        const collections = ['categories', 'sea-collection', 'matarita-collection', 'best-sellers'];
        const filesInfo = {};

        collections.forEach(collection => {
            const collectionPath = path.join(__dirname, 'uploads', collection);
            if (fs.existsSync(collectionPath)) {
                const files = fs.readdirSync(collectionPath);
                filesInfo[collection] = files.map(file => {
                    const filePath = path.join(collectionPath, file);
                    const stats = fs.statSync(filePath);
                    const urls = generateImageUrls(file, '', collection);
                    
                    return {
                        filename: file,
                        // URL principal (actual)
                        url: urls.currentUrl,
                        imageUrl: urls.currentUrl,
                        // AMBAS URLs
                        localUrl: urls.localUrl,
                        productionUrl: urls.productionUrl,
                        path: urls.path,
                        size: stats.size,
                        created: stats.birthtime,
                        modified: stats.mtime
                    };
                });
            }
        });

        console.log('📋 Archivos encontrados:', filesInfo);
        res.json(filesInfo);
    } catch (error) {
        console.error('Error al leer archivos:', error);
        res.status(500).json({ error: 'Error al leer archivos' });
    }
});

// Ruta para verificar que una imagen existe CON AMBAS URLs
app.get('/check-image/:collection/:filename', (req, res) => {
    const { collection, filename } = req.params;
    
    const collectionMapping = {
        'seacollection': 'sea-collection',
        'mataritacollection': 'matarita-collection',
        'bestsellers': 'best-sellers'
    };
    
    const actualCollection = collectionMapping[collection] || collection;
    const filePath = path.join(__dirname, 'uploads', actualCollection, filename);
    
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const urls = generateImageUrls(filename, '', actualCollection);
        
        res.json({ 
            exists: true,
            // URL principal (actual)
            url: urls.currentUrl,
            imageUrl: urls.currentUrl,
            // AMBAS URLs
            localUrl: urls.localUrl,
            productionUrl: urls.productionUrl,
            path: urls.path,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
        });
    } else {
        res.status(404).json({ 
            exists: false,
            error: 'Imagen no encontrada' 
        });
    }
});

// Ruta para eliminar una imagen
app.delete('/delete-image/:collection/:filename', (req, res) => {
    const { collection, filename } = req.params;
    
    const collectionMapping = {
        'seacollection': 'sea-collection',
        'mataritacollection': 'matarita-collection',
        'bestsellers': 'best-sellers'
    };
    
    const actualCollection = collectionMapping[collection] || collection;
    const filePath = path.join(__dirname, 'uploads', actualCollection, filename);
    
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            console.log('🗑️ Imagen eliminada:', filePath);
            res.json({ 
                success: true,
                message: 'Imagen eliminada exitosamente'
            });
        } catch (error) {
            console.error('❌ Error eliminando imagen:', error);
            res.status(500).json({ 
                success: false,
                error: 'Error eliminando imagen' 
            });
        }
    } else {
        res.status(404).json({ 
            success: false,
            error: 'Imagen no encontrada' 
        });
    }
});

// Manejo de errores
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        console.error('❌ Error de Multer:', error.code);
        
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ 
                success: false,
                error: `Campo de archivo incorrecto. Se esperaba: productImage` 
            });
        }
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success: false,
                error: 'El archivo es demasiado grande. Límite: 10MB' 
            });
        }
    }
    console.error('❌ Error general:', error);
    res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor: ' + error.message 
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    console.log(`❌ Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
        success: false,
        error: 'Ruta no encontrada',
        method: req.method,
        path: req.originalUrl
    });
});

// Iniciar servidor en puerto 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 Servidor ejecutándose en ${SERVER_BASE}`);
    console.log(`🌐 Local URL: ${LOCAL_URL}`);
    console.log(`🌐 Production URL: ${PRODUCTION_URL}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('=================================');
    console.log('📁 Directorios creados:');
    console.log('   - uploads/categories/');
    console.log('   - uploads/sea-collection/');
    console.log('   - uploads/matarita-collection/');
    console.log('   - uploads/best-sellers/');
    console.log('   - uploads/headers/sea-collection/');
    console.log('   - uploads/headers/matarita-collection/');
    console.log('   - uploads/headers/best-sellers/');
    console.log('   - uploads/headers/general/');
    console.log('=================================');
    console.log('🔄 Mapeo de colecciones:');
    console.log('   SeaCollection → sea-collection');
    console.log('   MataritaCollection → matarita-collection');
    console.log('   BestSellers → best-sellers');
    console.log('=================================');
    console.log('📤 Endpoints disponibles (con URLs duales):');
    console.log('   POST /api/upload-product-image - Subir imágenes de productos');
    console.log('   POST /api/upload-header-image - Subir imágenes de header genéricas');
    console.log('   POST /api/upload-sea-collection-header-image - Subir header Sea Collection');
    console.log('   POST /api/upload-matarita-collection-header-image - Subir header Matarita Collection');
    console.log('   POST /api/upload-best-sellers-header-image - Subir header Best Sellers');
    console.log('   GET  /api/sea-collection-header-image - Obtener header Sea Collection');
    console.log('   GET  /api/matarita-collection-header-image - Obtener header Matarita Collection');
    console.log('   GET  /api/best-sellers-header-image - Obtener header Best Sellers');
    console.log('   GET  /api/matarita-header-image - Ruta alternativa Matarita Collection');
    console.log('   GET  /files - Listar archivos');
    console.log('=================================');
    console.log('💡 NOTA: Todas las respuestas incluyen:');
    console.log('   - imageUrl (URL actual según entorno)');
    console.log('   - localUrl (siempre http://localhost:5000)');
    console.log('   - productionUrl (siempre https://proyecto-herramientas-de-desarrollo-1.onrender.com)');
    console.log('=================================');
});

module.exports = app;