
# Primary Market Data Websocket Emulator

![](https://img.shields.io/badge/version-0.1.0-green) ![](https://img.shields.io/badge/stage-experimental-green)

## Descripción
Este proyecto está en su fase `experimental` por lo que no debe considerarse como un producto terminado, no obstante; es funcional para simular el movimiento de mercado. aún está en proceso de mejoras.

## Instalación

Para instalar el proyecto deberás hacer los siguientes pasos:

- `git clone`
- `npm i` para instalar todas las dependencias

## Configuración

Para poder utilizar este proyecto debes haber tenido tu proceso de alta mediante la plataforma de Primary debidamente (no soy parte del equipo de primary y tampoco canalizo este tipo de cosas).

Al ser un _emulador experimental_ la aplicación podría enviar datos que puedan tener o no un sentido acorde al movimiento de un mercado real, ya que funcionalmente utiliza datos random entre dos cifras dadas.

Pasos para ejecutar el proyecto.
- Configurar variables de entorno
- Ejecutar `npm start`
- Suscribir un instrumento de acuerdo a la documentación oficial de [Primary API](https://apihub.primary.com.ar/assets/docs/Primary-API.pdf);

## Variables de Entorno

Para ejecutar este proyecto tendrás que añadir las siguientes variables a tu archivo `.env`

`DEFAULT_PORT`

`DEFAULT_URL`

`DEFAULT_APIKEY`

`DEFAULT_TIMEZONE`

**Contenido del archivo sample.env**
```txt
DEFAULT_PORT=30000
DEFAULT_URL=http://localhost
DEFAULT_APIKEY=put-your-api-key-here
DEFAULT_TIMEZONE=America/Argentina/Buenos_Aires
```
## Contribución

Toda contribución siempre es bienvenida!

Sientete libre de realizar las mejoras que consideres necesarias y que podamos tener un emulador para desarrollar nuestras aplicaciones.


## Autores

- [@solorzanof2](https://github.com/solorzanof2)


## Licencia

[MIT](https://choosealicense.com/licenses/mit/)

