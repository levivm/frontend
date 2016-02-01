

## Tasks

### Task Listing

- `serve` [task por defecto]
Inicia un servidor con liveReload escuchando sobre los archivos de la carpeta `app/`, actualizando automáticamente al detectar cambios en los archivos, así como compilando los archivos .less a .css.

- `serve-docs`
Inicia servidores para visualizar la documentación:
	- ng-docs en el url `<app-url>/docs/:9000` 
	- ui-framework (outdated) en `<app-url>/ui-framework/:9001`

- `serve-ngdocs`
Inicia el servidor para visualizar el ng-doc de la aplicación en el url `<app-url>/docs/:9000`

- `compile-ngdocs`
Compila la documentación de ng-docs de la aplicación

- `build`
Genera la versión de producción de la aplicación, en la carpeta `public/`. Aplicando concatenación, minificación y compresión con gzip, además de copiar recursos (fuentes e imágenes)

 - `clean`
Limpia la carpeta `public/`. ya es ejecutada automaticamente con `build`

#### Meta Tasks

- `injector`
Ejecuta el conjunto de tareas de inyección de recursos en `app/`: `css-injector`, `js-injector`, `serverConf-injector`

- `css-injector`
Ejecuta las tareas de inyección de archivos .css de bower y de estilos propios de la aplicación

- `js-injector`
Ejecuta las tareas de inyección de archivos .js de bower y de componentes Javascript de la aplicación

- `serverConf-injector`
Genera el archivo `trulii.serverConf.js` dependiendo de la presencia o ausencia de la bandera `--prod` explicada más adelante

- `copy-resources`
Ejecuta `copy-fonts` y `copy-img` para copiar las fuentes e imágenes desde `app/css` hasta `public/css`

#### Lower Tasks

- `js-hint`
Ejecuta el linter **js-hint** sobre los archivos .js dentro de `app/`

### Configuración de servidor a utilizar mediante flag 'prod'

`gulp <task> --prod`

Mediante gulp se puede indicar a la aplicación con qué servidor se va a comunicar.
En la raíz del proyecto existe un archivo llamado `trulii.serverConf.json` que contiene los datos para inyectar en `app/` el Servicio de Angular que indica a la aplicación si va a comunicarse con el servidor de desarrollo (local) o e de producción

### Configuración del entorno de trabajo

Para instalar todas las herramientas necesarias para trabajar el front end basta cn ejecutar los siguientes comandos:
``` bash
$ npm install
$ bower install
```

####Instalar Gulp de forma global

Dependiendo de tus preferencias puede que quieras instalar gulp de manera global:

```
$ sudo npm install -g gulp
```
 
####Estructura de archivos de Gulp

Los tasks de gulp se encuentran separados en varios archivos dependiendo del dominio de los tasks que contienen. Así como tambien existe un archivo `config.js`en la raíz, que contiene todos los objetos de configuración utilizados (rutas de archivos  y objetos de opciones de plugins utilizados)

```
|--  gulp/
	|--  tasks/
		|--  all.js
		|--  build.js
		|--  html.js
		|--  js.js
		|--  ngdocs.js
		|--  serve.js
		|--  styles.js
		|--  ui_framework.js
	|--  config.js
```

#### Known Issues

- moment-timezone
El archivo main de la librería **moment-timezone** especificado en su archivo bower.json da problemas al ser pasado por uglify ya que contenien varias IIFE anidadas, por lo que es necesario agregar el prefijo `.min` antes de la extensión .js en el key `main` del archivo bower.json de la misma para poder hacer un build exitoso.
