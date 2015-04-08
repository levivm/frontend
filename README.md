

# Configuración del entorno de trabajo

## Usando Compass

Instalar Ruby según tu SO. https://www.ruby-lang.org/es/downloads/

Instalar Bundler (pip/npm de Ruby) 

```
gem install bundler
```
 
Estando en el root del proyecto hacer

```
bundler install
```
Esto instalará las dependencias contenidas en el Gemfile. Una vez instaladas las dependencias los estidos de trulii con

```
    compass compile 
```
Si se quiere trabajar en los archivos en Sass de Trulii ejecutar

```
    compass watch
```

Esto mantedrá a compass corriendo esperando cambios en los archivos Sass.



