

# Configuración del entorno de trabajo

## Para compilar estilos

Ejecutar 'npm install' debería ser suficiente para compilar los estilos de Trulii y ser feluz. Ahora, si quieres trabajar los estilos debes saber los siguiente:

Instalar Gulp de forma global

```
sudo npm install -g gulp
```
 
Estando en el root del proyecto correr la tarea 'less.compile'

```
gulp less.compile
```
Esto compilará los estilos de trulii y los creará en la carpeta /css respectiva

Si se quiere trabajar en los archivos en Less de Trulii ejecutar

```
    gulp less.watch 
```

Eso iniciará un proceso que esperará cambios sobre los archivos Less para así actualizar los estilos de forma automática.



