# FRONT-AUTH

Proyecto hecho con Angular v17 que gestiona el inicio de sesión de forma local (usuario y contraseña) y mediante redes sociales (Google, Facebook, Github, Twitter).

![Alt text](src/assets/images/Front_Auth_Login_Page.png?raw=true "Front auth login page")

## INSTALACIÓN

Para instalar las dependencias del proyecto, ejecutar el comando:

`npm install`

## PROBAR EN LOCALHOST

Una vez instaladas las dependencias, ejecutar el comando:

`npm run start`

## COMPILADO

Para levantar el proyecto en un ambiente de producción, se necesita compilar la aplicación con el siguiente comando:

`npm run build`

## DESPLIEGUE EN GCP

Para subir el proyecto (compilado) a Google Cloud Platform, ejecutar el comando:

`gcloud app deploy -v=[ID]`

donde -v=[ID] equivale a la versión que se le asigna al proyecto (Ejm. -v=20230927)

NOTA: Previamente se debe realizar la instalación y configuración del sdk de GCP de forma local.
