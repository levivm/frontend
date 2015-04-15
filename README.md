

# Configuración del entorno de trabajo

## Para compilar estilos

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



