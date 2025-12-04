cat > src/main/resources/data/README.md << 'EOF'
# Directorio de Base de Datos SQLite

Esta carpeta contiene los archivos de base de datos SQLite que **SÍ se guardarán en GitHub**.

## Archivos importantes:
- `prod.db` - Base de datos principal (producción)
- `local.db` - Base de datos local (desarrollo)
- `backup_*.db` - Copias de seguridad automáticas

## Para Git:
✓ Estos archivos están siendo trackeados por Git
✓ Los cambios se versionarán automáticamente
✓ Se mantendrán entre despliegues en Render

## No commitar:
✗ Archivos temporales (*-journal, *-shm, *-wal)
✗ Archivos de lock/log
✗ Backups manuales
EOF