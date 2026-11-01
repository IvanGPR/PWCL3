# Mision 3

La práctica como la segunda misión se trata de una web de cocteles que te permite ver distinta informacion sobre estos utilizando una api, de forma que se han añadido metodos para poder obtener informacion de todo tipo que se encuentre en la api y para poder obtenerla de distintas formas.

## Como probarlo
El primer paso se trata de activar el dev, para poder observarla web.
Esto se hace con la instalacion de npm y posteriormente introduciendo dentro de la carpeta mi-app en terminal npm install (para instalarlo, pero solo es necesario en la primera compilacion) y npm run dev (para entrar en el dev).
A partir de ahi el programa te permite buscar la informacion ya sea buscando por nombre del coctel, por categorias de coctel, por un ingrediente concreto, ambos categoria e ingrediente combinado o tambien tienes la opcion de que el programa te enseñe uno aleatoriamente. Tambien teniendo en cuenta que en caso de que se busque un nombre o ingrediente de coctel incorrecto al usuario se le indica que no hay cocteles con esa especificacion. 
Posteriormente de la busqueda por nombre, por categoria, por ingrediente, categoria e ingrediente o aleatoriamente, se obtiene las informacion general (nombre, foto, categoria) de los cocteles selecionados, dando asi tambien que se pueda ver todo la informacion concreta (nombre, foto, categoria, vaso, ingredientes, preparacion) de un coctel pulsando en "Ver receta", y tambien tienes la opcion de que si buscar un coctel y te gusta debajo del boton "Ver receta" te aparece un boton a para añadir ese coctel a una lista de cocteles favoritos, que posteriormente puedes ver pulsando el boton de "Ver Favoritos" y tambien puedes quitarlos de la lista de favoritos pulsando el mismo boton que "Añadir Favorito" que ahora se veria como "Quitar Favorito".

## Uso de IA
Para esta practica se ha utilizado la IA (chatGPT) para resolver dudas que han surgido en el transcurso de la practica

Prompts:

1. Como puedo realizar que un boton pueda ejecutar dos procesos de forma conjunta o separada, dependiendo de los campos de informacion que reciba.

La solución que me dio fue que cuando el usuario pulsa el botón, se ejecute una funcion que llame a un filtro al cual se le pasa por parametro los dos campos a filtra en este caso categoria, ingrediente.
Dentro del filtro, habia que comprobar mediante condicionales que campos contienen información en el momento de la solicitud de filtracion al pulsar el boton. Y si:

Si solo hay categoria, realizo una peticion a la API para obtener los cocteles de esa categoria.
Si solo hay ingrediente, realizo una peticion para obtener los cocteles que contienen ese ingrediente.
Si ambos campos tienen informacion, recomendaba ejecutar las dos peticiones conjuntamente mediante Promise.all() y comparar los identificadores de los cócteles para quedarme unicamente con aquellos que cumplen ambas condiciones.
Si ninguno tenia informacion, que se mostrase muestro un mensaje indicando que debe seleccionarse al menos un filtro.


2. Como puedo hacer que pulsando un boton que aparece cuando buscas un coctel, guarde la informacion para que en una lista para posteriormente a esa lista se le pueda llamar y aparezcan todos los cockteils guardados.

La solucion que me dio fue, que para conseguir que el usuario pueda guardar cocteles y consultarlos posteriormente, tenia que implementar un sistema para guardar la informacion, el cual acabado siendo useLocalStorage que permite reutilizarse siempre que se quiera guardar algo nuevo y ademas va a guardar la informacion en el almacenamiento del navegador.

Posteriormente menciono que cuando el usuario busca un coctel y aparece el boton. Al pulsarlo, se debia ejecutar una funcion que obtuviese el identificador del coctel y comprobase si ya estaba guardado en la lista, para ello cree el componente ListaCocktails. Y en caso de no estar guardado, se añadiese su identificador al array. Y si ya exista el coctel en la lista, se eliminara de la lista, permitiendo asi utilizar el mismo botón para añadir o quitar.

## Autopsia

En este proyecto tuve que tomar varias decision para correguir algunos problemas:

1. En el momento en que construi el filtro para los ingredientes me di cuenta que solo imprimia un producto da igual el ingrediente que pusiese y teniendo el ejemplo que es el ingrediente Coffee no tendria sentido que eso sucediese, pero tras buscar informacion y realizar distintas prueba de que pasaba la api al programa me he dado cuenta que lo que limita que solo aparezca un coctel en este caso es la api y la opcion que reconsidere para arreglar este problema fue modificar la forma de buscar por ingrediente sin depender de la respuesta de la api ante filter.php?i=Coffee, sino que el cambio con los cocteles obtenidos por cada categoria y consulta la informacion completa de cada coctel para luego comprobar sus ingredientes uno a uno y comprobar que esten igual escritos a el ingrediente que se busca.


2. Otro problema que surgio fue que al final del proyecto la api de cocteles no funcionaba y tuve que decidir cambiarla por una api que tuviese el mismo esquema de composicion de urls y que devolviese una informacion similar, en el sentido de que tuviese una categoria y unos ingredientes, para asi tener que modificar el programa lo minimo posible, por desgracia no encontre ninguna que funcionase correctamente o que fuese gratuita, entonces despues de estar un largo tiempo intentando cambiar la api por oanor Cocktails API, tenia que cambiar muchas partes del codigo y ademas el plan gratuito tiene limitadas las peticiones por lo cual, decidi probar a cambiar a la api themealdb aunque fuese muy diferente de codigo al menos la estructura de los objetos solo cambia el nombre entonces no iba a tener que cambiar los procesos y pero con ayuda de distintas herramientas para cambiar codigo repetitivo rapido, como puede ser la tecnica de normalizar respuestas para que obteniendo la informacion de la api themealdb lo cambiase a la forma de thecocktaildb para no tener que cambiar tanto codigo. (Se han dejado los codigo la thecockteildb comentados por si en algun momento la api vuelve a funcionar)