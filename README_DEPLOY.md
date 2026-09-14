# Numerian - demo web funcional

Proyecto estático (HTML5 + CSS3 + JavaScript) basado en las anotaciones del proyecto “Matemáticas Lúdicas”.

## Abrir localmente
Opción simple:
1. Descomprime el ZIP.
2. Abre `index.html` en un navegador moderno.

Opción recomendada (para evitar restricciones de archivos locales):
```bash
python -m http.server 8080
```
y abre `http://localhost:8080`.

## Qué funciona
- Diseño responsive.
- Perfil Estudiante / Docente / Familia.
- 8 mundos matemáticos con preguntas dinámicas.
- Gamificación: puntos, monedas, estrellas, racha y niveles.
- Progreso persistente con `localStorage`.
- Minijuego de memoria matemática.
- Actividad personalizada creada por docente y jugable por estudiante.
- Estadísticas locales del panel docente.
- Filtros de biblioteca.
- PDFs descargables.
- Formulario de contacto de demostración con guardado local.
- Opciones de accesibilidad: tamaño de texto, alto contraste y reducción de movimiento.
- Referentes pedagógicos, DBA, marco normativo, diseño metodológico y fuentes del proyecto.

## Límites de esta versión
No hay servidor ni base de datos. Por eso:
- No existen cuentas reales ni autenticación.
- El progreso se guarda por navegador/dispositivo.
- El formulario no envía correo; guarda una copia local.
- Para seguimiento multiusuario, grupos, reportes centralizados y administración se requiere backend.

## Publicación rápida

### Netlify
Arrastra la carpeta del proyecto o el ZIP al flujo de despliegue manual de Netlify.

### GitHub Pages
Sube estos archivos a un repositorio y activa Pages desde Settings > Pages.

### Vercel
Importa el repositorio o despliega la carpeta como sitio estático.

No requiere proceso de compilación.
