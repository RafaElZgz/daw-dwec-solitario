# Índice

-   Introducción
-   Desarrollo
-   Conclusiones
-   Bibliografía

# Introducción

Este proyecto consiste en hacer una versión concreta del juego del solitario, en dónde se parte de 48 cartas, colocadas una encima de otra en diagonal, que hay que ir colocando en 4 mazos distintos. Se debe tener en cuenta que solo se puede jugar la última carta que haya puesta y que se cuenta con un mazo auxiliar para las cartas que no se puedan colocar en ningún mazo. Hay otra serie de reglas que no se van a explicar ahora sino en el apartado del desarrollo. Partiendo de está base ya podemos hacernos una idea del diseño que va tener la web.

Luego explicaremos que tecnologías se van a usar para el desarrollo, pero ya adelantamos que para ejecutar el proyecto se va a necesitar tener instalado Node.js y yarn.

Para instalar las dependencias del proyecto, se debe ejecutar el siguiente comando:

    yarn install

Para ejecutar el proyecto, se debe ejecutar este otro comando:

    yarn dev

El proyecto terminado está disponible en el siguiente enlace: [www.alastuey.ovh](https://www.alastuey.ovh)

-   ## Tecnologías que se van a usar

El **IDE** con el que se va a trabajar es Visual Studio Code, debido a que este es simple de utilizar, y cuenta con decenas de herramientas y extensiones que facilitan el desarrollo.

**El desarrollo se va a hacer con [Nuxt](https://nuxt.com/)**, un framework JS destinado a crear portales web, en su versión 3. Está basado en Vue.js. Fcilita en general el desarrollo con respecto a un proyecto escrito en HTML base.

Hay que tener en cuenta una serie de cuestiones con Nuxt. La primera es que tiene el siguiente cico de vida:

![Ciclo de vida de Nuxt](img/lifecycle.svg)

De está imagen nos interesa la última fase del ciclo, Mounted, que es cuando se renderiza el contenido de la página y el DOM está listo para ser manipulado. Aquí es dónde referenciaremos las funciones que queremos que se ejecuten al cargar la página. En Nuxt 3 esta fase del ciclo se la puede llamar con la función **onMounted**, que viene importada por defecto. Luego, en la explicación del código, explicaremos que está pasando en esta función.

Támbien hay que tener en cuenta que Nuxt cuenta con una serie de facilidades, una de ellas es que nos permite incrustar variables de JS en el HTML, para que se puedan renderizar. Esto se hace con la siguiente sintaxis:

    {{ nomnbre de la variable }}

En el caso de que queramos que la variable este dentro de un atributo, se hace de la siguiente manera:

    :nombre del atributo="nombre de la variable" o :nombre del atributo="`/ruta/${nombre de la variable}`"

Los event listeners se hacen de la siguiente manera:

    @nombre del evento="nombre de la función a ejecutar"

Aunque siempre podemos usar la sintaxis de HTML base.

Luego tiene otra serie de funciones como **v-for** o **v-if** que nos permiten hacer bucles y condicionales para el renderizado, dentro en el propio HTML, pero no hemos hecho uso de ellas en el código principal.

Todo el contenido de la web está dentro de la carpeta **src**, la cual contiene otras 3 carpetas:

-   Assets: Contiene un archivo CSS que nos sirve para hacer que Tailwind funcione.
-   Pages: Contiene los archivos **.vue**. En estos es donde se va a desarrollar la web. Luego explicaremos la estructura de estos archivos.
-   Public: Contiene los archivos estáticos, en este caso el logo de la web y las imagenes de las cartas.

Hay otros archivos de configuración que no vamos a explicar, pero que son necesarios para que Nuxt, Tailwind, TypeScript y el repositorio Git funcionen.

La estructura que cumplen los archivos **.vue** es la siguiente:

    <script lang="ts">
        // Aquí va el código TS
    </script>

    <template>
        <!-- Aquí va el HTML -->
    </template>

    <style>
        /* Aquí va el CSS */
    </style>

Para el proyecto hemos creado dos páginas, una llamada **index.vue**, dónde se ejecuta todo el juego, y otra llamada **mobile.vue**, destinada a dispositivos móviles, en la que se muestra un mensaje de que la web no está optimizada para dispositivos móviles o táctiles.

Hacemos uso de **TypeScript**, un lenguaje de programación que se basa en JavaScript, para hacer el código más legible y que sea más fácil de mantener. Además, nos permite hacer uso de las interfaces, que nos permiten definir el tipo de dato que va a tener una variable, y así evitar errores. Se probó a realizar el proyecto con JavaScript, pero este se volvió difícil de depurar.

Como hemos mencionado antes, también vamos a hacer uso de [**Tailwind**](https://tailwindcss.com/), un framework CSS, para crear la interfaz web de una forma sencilla y rápida.

Por último hemos usado dos librerías para crear la interfaz web, una es [**Heroicons**](https://heroicons.com/), que nos permite usar iconos SVG, y la otra es [**Flowbite**](https://flowbite.com/), una extensión de Tailwind que sirve para crear componentes. Está última librería solo se ha usado en los modales.

# Desarrollo

-   ## Interfaz

La interfaz, como ya se ha explicado antes, está contendia por completo entre las etiquetas **template**. Aquí va todo el código HTML. Las reglas CSS se encuentran entre las etiquetas **style**, aunque en este caso apenas se han creado reglas CSS, ya que ha usado Tailwind para casi todo.

![Interfaz]()

Se divide en 2 partes:

-   La primera nos muestra las estadísticas del juego; cantidad de movimientos realizados y tiempo transcurrido. Y un botón para mostrar las intrucciones del juego.

    ![Interfaz superior]()

    ![Código Header]()

-   La segunda pate de la interfaz contiene el juego en sí, con el tablero inicial de las cartas, los 4 mazos dónde se van a colocar las cartas, el mazo auxiliar y el botón para reiniciar el juego. El tablero principal tiene en la esquina inferior derecha un texto que indica el estado de la partida. Cada mazo tiene un contador que indica la cantidad de cartas que tiene.

    ![Interfaz inferior]()

    ![Código pilas]()

    ![Código tablero y restart]()

Al clicar en el botón de las instrucciones, se abre un modal con las instrucciones del juego.

![Modal de instrucciones]()

![Código modal instrucciones]()

Lo mismo pasa cuando se gana el juego, se abre otro modal con las estadísticas de la partida actual, y las mejores historicamente, además de un botón para volver a iniciar otra partida.

![Modal de victoria]()

![Código modal victoria]()

El botón de reiniciar el juego, abre un modal para confirmar que se quiere reiniciar el juego.

![Modal de reinicio]()

![Código modal reinicio]()

-   ## Lógica del juego

Toda la lógica del juego se encuentra entre las etiquetas **script**. Aquí se encuentra todo el código JavaScript, TypeScript en este caso, que se ejecuta en el navegador del usuario. Casi todo el código está comentado, así que se explicará solo lo más importante.

El código tiene al principio dos _imports_, de las dos librerias que se han usado para crear componentes de la interfaz.

![Imports]()

Después estan las interfaces que se van a usar. Hay dos, Carta y Pila.

![Interfaces]()

Luego se declaran e inicializan las variables y constantes que se van a usar. Hay algunas que van a actualizarse cuando se ejecuta la función **onMounted**, cuando se renderiza el contenido de la página. Cambiaran o no en función del contenido del **localStorage**.

![Constantes]()

![Variables]()

Después viene la parte en la que se crean las funciones, comenzando por la función **start()** y **restart()**. La primera se ejecuta siempre que empiece una partida nueva. La segunda cuando el usuario quiere reiniciar la partida, ya sea por medio del botón o tras ganar una partida. Si **localStorgae** ya tiene una partida guardada, la función **start()** no se va a ejecutar.

![Funciones start y restart]()

Las siguientes dos funciones son **endGame()** y **sleep()**. Está última tiene como proposito hacer que el navegador espere un tiempo antes de ejecutar la siguiente instrucción. Se usa para crear efecto visual en la función **alignCards()**. La función **endGame()** se ejecuta cuando el usuario gana la partida, y se encarga de guardar las estadísticas de la partida actual en el **localStorage**, en caso de batir las mejores ya guardadas.

![Funciones endGame y sleep]()

Luego vienen las funciones **generateCards()** y **shuffleCards()**. Ambas funciones devuelven un array del objeto Carta y se ejecutan en la función **start()**. La primera crea las cartas, y la segunda las baraja. Está segunda función también se usa para barajar las cartas del mazo auxiliar, cuando el tablero se vacía.

![Funciones generateCards y shuffleCards]()

Seguimos con la función **addCardToPile()**. Aquí añadimos una carta bien al mazo auxiliar, o a uno de los 4 mazos principales. Tanto el objeto de la carta a añadir como el del mazo al que irá, se pasan como parámetros.

![Función addCardToPile]()

Vamos con las funciones **showPileFromLocalStorage()** y **clearPile()**. La primera se va a ejecutar en el caso de que el **localStorage** tenga una partida guardada. Esa comprobación se hará cuando se ejecute la función **onMounted()**, del ciclo de vida de Nuxt. Está función mostrará todas las cartas que contenga el mazo que se le pasa como parámetro. La segunda se ejecuta cuando el usuario quiere reiniciar la partida, o cuando se baraja el mazo auxiliar para volver a colocar las cartas en el tablero. Se encarga de borrar todos los elementos HTML, que se correspondan con las cartas del mazo que se le pasa como parámetro.

![Funciones showPileFromLocalStorage y clearPile]()

Las próximas funciones son **clearPiles()** y **showCards()**. **clearPiles()** se ejecuta cuando el usuario quiere reiniciar la partida, y se encarga de borrar todas las cartas de los 4 mazos principales, del mazo auxiliar y del tablero. Para ello elimina los elementos HTML haciendo uso de la función **clearPile()** y vacia los arrays. **showCards()** se ejecuta al comenzar una partida nueva, al cargar una partida guardada en el **localStorage** o al barajar el mazo auxiliar. Se encarga de mostrar todas las cartas del mazo que se le pasa como parámetro, creando los elementos HTML correspondientes y añadiéndolos al elemento del propio mazo.

![Funciones clearPiles y showCards]()

Las funciones **alignCards()**, **makeDraggable()** y **updateTime()** son la que siguen en el código. La primera se encarga de alinear las cartas del tablero, de tal forma que formen una diagonal desde la esquina superior izquierda, dónde cada carta se va a superponer a la siguiente. La segunda hace que sea arrastrable una determinada carta, que se le pasa como parámetro. La tercera aumenta el tiempo en 1 segundo y convierte el tiempo a string, para poder mostrarlo en la interfaz. **alignCards()** se ejecuta cuando el usuario inicia, reinicia o carga una partida, **makeDraggable()** en estos mismos casos, y también cuando el usuario mueve una carta del tablero a uno de los mazos. **updateTime()** se ejecuta cada segundo, se establece dicho bucle en la función **onMounted()**.

![Funciones alignCards, makeDraggable y updateTime()]()

Ahora vienen las funciones **dragStart()** y **dragLeave()**. La primera se ejecuta cuando el usuario empieza a arrastrar una carta, y la segunda cuando el arrastre de dicha carta pasa a ser fuera de un mazo. **dragStart()** se encarga de guardar la carta que se está arrastrando, de iniciar el contador del tiempo en caso de que no se haya iniciado ya, y de pasar el ID de la carta que estamos moviendo a la función **onDrop()**. **dragLeave()** se encarga de borrar los efectos visuales que se aplican sobre los mazos cuando se arrastra una carta sobre ellos.

![Funciones dragStart y dragLeave]()
