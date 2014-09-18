# numbers

> un juego sobre numeros

### se requiere instalar :

 + node + npm
 + apache cordova 
 + Android SDK
 
### instrucciones para correr la aplicacion :

 + luego correr el servidor con ```cordova serve```
 + para emular ```cordova emulate```
 + para correr en el celular ```cordova run```

Es posible que se necesite actualizar el proyecto usando `android update project -p .` o `android update project -p ./platforms/android/` para volver a generar el .local.properties y que se corrija el path a la carpeta **sdk** de la carpeta root del *androidSDK*.
Si con `android update project` no funciona entonces habra que editar manualmente la variable **sdk.dir** del archivo *local.properties* de la carpeta `./platforms/android/` y luego copiar ese mismo archivo a la carpeta `CordovaLib` 
