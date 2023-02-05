<script lang="ts" setup>
import { initModals } from 'flowbite';
import {
    ExclamationCircleIcon,
    FaceSmileIcon,
    InformationCircleIcon,
    XMarkIcon,
} from '@heroicons/vue/24/outline';

/*
    Definitions
*/

interface Card {
    id: number;
    suit: string;
    value: number;
    current_pile: number;
    pile_position: number;
}

interface Pile {
    id: number;
    array: Card[];
}

const suits = ['oval', 'circle', 'square', 'hexagon'];

/*
    Variables
*/

// Constants
const cards_per_suite = 12;
const amount_cards = cards_per_suite * suits.length;

// Valid configuration check
if (cards_per_suite > 12) {
    throw new Error(`La cantidad de cartas por mazo debe ser menor a 12`);
}

let amount_movements = 0;
let played_time = 0;
let played_time_string = ref('00:00:00');

var isPlaying = false;

let initial_pile = { id: 6, array: [] } as Pile;
let leftover_pile = { id: 5, array: [] } as Pile;

let pile_1 = { id: 1, array: [] } as Pile;
let pile_2 = { id: 2, array: [] } as Pile;
let pile_3 = { id: 3, array: [] } as Pile;
let pile_4 = { id: 4, array: [] } as Pile;

let current_playing_card: Card =
    initial_pile.array[initial_pile.array.length - 1];

let game_status_text = ref('Juego no iniciado');

/*
    Main functions
*/

async function restart() {
    clearPiles();
    start();
    isPlaying = false;
    amount_movements = 0;
    played_time = 0;
    played_time_string.value = '00:00:00';
}

function endGame() {
    // TODO : Hay que desarrollar este método
    setTimeout(() => {
        isPlaying = false;
        game_status_text.value = 'Partida finalizada';
        document.getElementById('win_modal_button')!.click();
    }, 1000);
}

/*
    Operation functions
*/

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateCards(): Card[] {
    let pile = [] as Card[];

    let current_suite = 0;
    let current_value = 1;

    for (let i = 0; i < amount_cards; i++) {
        const card: Card = {
            id: i,
            suit: suits[current_suite],
            value: current_value,
            current_pile: 6,
            pile_position: i,
        };

        pile.push(card);

        current_value += 1;

        if (current_value > cards_per_suite) {
            current_value = 1;
            current_suite += 1;
        }
    }
    return pile;
}

async function shuffleCards(pile: Card[]): Promise<Card[]> {
    let result_pile = pile.sort((a, b) => 0.5 - Math.random()) as Card[];
    result_pile.forEach((card, index) => {
        card.pile_position = index;
    });
    return result_pile;
}

function clearPiles() {
    clearPile(initial_pile);
    initial_pile.array = [];
    clearPile(leftover_pile);
    leftover_pile.array = [];
    clearPile(pile_1);
    pile_1.array = [];
    clearPile(pile_2);
    pile_2.array = [];
    clearPile(pile_3);
    pile_3.array = [];
    clearPile(pile_4);
    pile_4.array = [];
}

function showCards(pile: Pile) {
    pile.array.forEach((card) => {
        const board = document.getElementById(`pile_${pile.id}`)!;
        const card_element = document.createElement('img');

        card_element.draggable = false;
        card_element.id = `card-${card.id}`;
        card_element.src = `/cards/${card.suit}/${card.value}.png`;
        card_element.classList.add(
            'absolute',
            'w-24',
            'h-40',
            'transform',
            'rounded-lg',
            'select-none'
        );

        card_element.addEventListener('dragstart', (event) => {
            dragStart(event, card);
        });

        board.appendChild(card_element);
    });
}

function addCardToPile(card: Card, pile: Pile) {
    card.pile_position = pile.array.length - 1;
    pile.array.push(card);

    const pile_box = document.getElementById(`pile_${pile.id}`)!;
    const card_element = document.createElement('img');

    card_element.draggable = false;
    card_element.id = `card-${card.id}`;
    card_element.src = `/cards/${card.suit}/${card.value}.png`;
    card_element.classList.add('absolute', 'w-24', 'h-40', 'rounded-lg');

    pile_box.appendChild(card_element);
}

function clearPile(pile: Pile) {
    pile.array.forEach((card) => {
        document.getElementById(`card-${card.id}`)!.remove();
    });
}

// Card functions

async function makeDraggable(card: Card) {
    const card_element = document.getElementById(`card-${card.id}`)!;
    card_element.draggable = true;
    card_element.classList.add('cursor-grab');
}

// Drag and drop functions

function dragStart(event: DragEvent, card: Card) {
    event.dataTransfer!.setData('cardID', card.id.toString());

    if (!isPlaying) {
        isPlaying = true;
        game_status_text.value = 'Partida en curso';
    }

    current_playing_card = card;
}

function dragOver(event: DragEvent, pile: Pile) {
    var isValid = true;

    const current_color =
        current_playing_card.suit == 'oval' ||
        current_playing_card.suit == 'square'
            ? 'red'
            : 'white';

    let last_color = 'not_defined';

    if (pile.array.length >= cards_per_suite) {
        // El mazo esta lleno, no se puede mover la carta aquí
        isValid = false;
    }

    if (pile.array.length < 1) {
        // Solo se puede mover la carta de mayor valor a un mazo vacío
        if (current_playing_card.value != cards_per_suite) {
            isValid = false;
        }
    } else {
        last_color =
            pile.array[pile.array.length - 1].suit == 'oval' ||
            pile.array[pile.array.length - 1].suit == 'square'
                ? 'red'
                : 'white';

        if (
            pile.array[pile.array.length - 1].value - 1 !=
            current_playing_card.value
        ) {
            // La carta no se puede mover a este mazo porque la carta superior es de mayor valor
            isValid = false;
        }
    }

    if (last_color != 'not_defined') {
        if (current_color === last_color) {
            // La carta no se puede mover a este mazo porque la carta superior es del mismo color
            isValid = false;
        }
    }

    const pile_element = document.getElementById(`pile_${pile.id}_box`)!;

    if (isValid) {
        pile_element.classList.remove('bg-green-600');
        pile_element.classList.add('bg-green-400');
    } else {
        pile_element.classList.remove('bg-green-600');
        pile_element.classList.add('bg-red-600');
        return;
    }

    event.preventDefault();
}

function dragLeave(event: DragEvent, pile: Pile) {
    const pile_element = document.getElementById(`pile_${pile.id}_box`)!;
    pile_element.classList.remove('bg-green-400');
    pile_element.classList.remove('bg-red-600');
    pile_element.classList.add('bg-green-600');
}

async function onDrop(event: DragEvent, new_pile_id: number) {
    const cardID = event.dataTransfer!.getData('cardID');
    const card = initial_pile.array.find((card) => card.id == parseInt(cardID));

    initial_pile.array.splice(card!.pile_position, 1);
    document.getElementById(`card-${card!.id}`)!.remove();

    card!.current_pile = new_pile_id;

    if (new_pile_id != 5) {
        const pile_element = document.getElementById(
            `pile_${new_pile_id}_box`
        )!;
        pile_element.classList.remove('bg-green-400');
        pile_element.classList.remove('bg-red-600');
        pile_element.classList.add('bg-green-600');
    }

    switch (new_pile_id) {
        case 1:
            addCardToPile(card!, pile_1);
            break;
        case 2:
            addCardToPile(card!, pile_2);
            break;
        case 3:
            addCardToPile(card!, pile_3);
            break;
        case 4:
            addCardToPile(card!, pile_4);
            break;
        case 5:
            addCardToPile(card!, leftover_pile);
            break;
    }

    amount_movements += 1;

    if (initial_pile.array.length == 0) {
        if (leftover_pile.array.length == 0) {
            endGame();
            return;
        }

        clearPile(leftover_pile);
        initial_pile.array = await shuffleCards(leftover_pile.array);
        leftover_pile.array = [];

        showCards(initial_pile);
        await alignCards(initial_pile.array);

        game_status_text.value = 'Mezclando las cartas ...';
        setTimeout(() => {
            game_status_text.value = 'Partida en curso';
        }, 2000);
    }
    await makeDraggable(initial_pile.array[initial_pile.array.length - 1]);
}

// Visual functions

async function alignCards(cards: Card[]) {
    for (const card of cards) {
        const card_element = document.getElementById(`card-${card.id}`)!;

        card_element.style.top = `${card.pile_position * 3}px`;
        card_element.style.left = `${card.pile_position * 6}px`;
        card_element.style.zIndex = `${card.pile_position}`;

        await sleep(20);
    }
}

function updateTime() {
    if (!isPlaying) return;
    played_time += 1;
    played_time_string.value = new Date(played_time * 1000)
        .toISOString()
        .slice(11, 19);
}

/*
    Events
*/

async function start() {
    initial_pile.array = await shuffleCards(generateCards());

    showCards(initial_pile);

    await alignCards(initial_pile.array);
    await makeDraggable(initial_pile.array[initial_pile.array.length - 1]);
}

onMounted(() => {
    initModals();
    setInterval(() => updateTime(), 1000);
    if (window.screen.availWidth < 800) {
        alert(
            'El juego no está optimizado para pantallas pequeñas.\n\nPor favor, juega en un dispositivo con una pantalla más grande.'
        );
    }
    start();
});
</script>

<template>
    <div class="flex flex-col h-screen">
        <!-- Header -->
        <header class="flex flex-col pt-6 mx-auto">
            <div class="flex flex-row py-4 mx-auto text-center">
                <h1 class="text-4xl">Solitario</h1>
                <img class="w-auto h-8 mx-4" src="/logo.png" />
            </div>
            <div class="flex flex-row">
                <h3 class="p-4 mx-4 border border-gray-400">
                    Tiempo
                    <span class="ml-1 text-primary-600">
                        {{ played_time_string }}
                    </span>
                </h3>
                <h3 class="p-4 mx-4 border border-gray-400">
                    Movimientos
                    <span class="ml-1 text-primary-600">
                        {{ amount_movements }}
                    </span>
                </h3>
                <button
                    data-modal-target="instructions_modal"
                    data-modal-toggle="instructions_modal"
                    type="button"
                    class="p-4 mx-4 border border-gray-400 text-primary-600 hover:text-primary-900">
                    ¿Cómo se juega?
                </button>
            </div>
        </header>
        <!-- Content -->
        <main class="flex h-full py-4">
            <div class="m-auto main_grid w-[48rem] h-[40rem]">
                <!-- Piles -->
                <div
                    @drop="onDrop($event, pile_1.id)"
                    @dragover="dragOver($event, pile_1)"
                    @dragenter.prevent
                    @dragleave="dragLeave($event, pile_1)"
                    :id="`pile_${pile_1.id}_box`"
                    class="relative flex bg-green-600 rounded-lg pile_1_box">
                    <div
                        :id="`pile_${pile_1.id}`"
                        class="w-24 h-40 m-auto shadow-2xl select-none rounded-xl"></div>
                    <div
                        class="absolute inline-flex items-center justify-center w-8 h-8 text-lg font-bold text-white border-2 rounded-full select-none border-primary-100 bg-primary-500 top-2 right-2">
                        <span>{{ pile_1.array.length }}</span>
                    </div>
                </div>
                <div
                    @drop="onDrop($event, pile_2.id)"
                    @dragover="dragOver($event, pile_2)"
                    @dragenter.prevent
                    @dragleave="dragLeave($event, pile_2)"
                    :id="`pile_${pile_2.id}_box`"
                    class="relative flex bg-green-600 rounded-lg pile_2_box">
                    <div
                        :id="`pile_${pile_2.id}`"
                        class="w-24 h-40 m-auto shadow-2xl select-none rounded-xl"></div>
                    <div
                        class="absolute inline-flex items-center justify-center w-8 h-8 text-lg font-bold text-white border-2 rounded-full select-none border-primary-100 bg-primary-500 top-2 right-2">
                        <span>{{ pile_2.array.length }}</span>
                    </div>
                </div>
                <div
                    @drop="onDrop($event, pile_3.id)"
                    @dragover="dragOver($event, pile_3)"
                    @dragenter.prevent
                    @dragleave="dragLeave($event, pile_3)"
                    :id="`pile_${pile_3.id}_box`"
                    class="relative flex bg-green-600 rounded-lg pile_3_box">
                    <div
                        :id="`pile_${pile_3.id}`"
                        class="w-24 h-40 m-auto shadow-2xl select-none rounded-xl"></div>
                    <div
                        class="absolute inline-flex items-center justify-center w-8 h-8 text-lg font-bold text-white border-2 rounded-full select-none border-primary-100 bg-primary-500 top-2 right-2">
                        <span>{{ pile_3.array.length }}</span>
                    </div>
                </div>
                <div
                    @drop="onDrop($event, pile_4.id)"
                    @dragover="dragOver($event, pile_4)"
                    @dragenter.prevent
                    @dragleave="dragLeave($event, pile_4)"
                    :id="`pile_${pile_4.id}_box`"
                    class="relative flex bg-green-600 rounded-lg pile_4_box">
                    <div
                        :id="`pile_${pile_4.id}`"
                        class="w-24 h-40 m-auto shadow-2xl select-none rounded-xl"></div>
                    <div
                        class="absolute inline-flex items-center justify-center w-8 h-8 text-lg font-bold text-white border-2 rounded-full select-none border-primary-100 bg-primary-500 top-2 right-2">
                        <span>{{ pile_4.array.length }}</span>
                    </div>
                </div>
                <!-- Leftover Cards -->
                <div
                    @drop="onDrop($event, leftover_pile.id)"
                    @dragover.prevent
                    @dragenter.prevent
                    class="relative flex bg-blue-400 leftover_cards_box">
                    <div
                        :id="`pile_${leftover_pile.id}`"
                        class="w-24 h-40 m-auto rounded-lg shadow-2xl select-none"></div>
                    <div
                        class="absolute inline-flex items-center justify-center w-8 h-8 text-lg font-bold text-white bg-blue-500 border-2 border-blue-200 rounded-full select-none top-2 right-2">
                        <span>{{ leftover_pile.array.length }}</span>
                    </div>
                </div>
                <!-- Restart Button -->
                <div
                    class="flex border border-gray-400 select-none buttons_box">
                    <button
                        data-modal-target="restart_modal"
                        data-modal-toggle="restart_modal"
                        type="button"
                        class="px-3 py-2 m-auto text-white border rounded-lg border-primary-700 bg-primary-600 hover:bg-primary-500 hover:shadow-lg">
                        Reiniciar
                    </button>
                </div>
                <!-- Main Pile -->
                <div
                    class="flex bg-gradient-to-r from-green-600 via-green-500 to-green-600 main_pile_box">
                    <div id="pile_6" class="relative flex w-full h-full m-4">
                        <div
                            class="absolute text-sm font-semibold text-white select-none bottom-8 right-2">
                            <span>{{ game_status_text }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <!-- Footer -->
        <footer class="py-4 mx-auto">
            <p class="text-md">
                Powered by
                <NuxtLink
                    class="font-semibold text-primary-600"
                    to="https://www.rab-devs.com/rafa">
                    RAB Developments
                </NuxtLink>
            </p>
        </footer>
        <!-- Restart Modal -->
        <div
            id="restart_modal"
            tabindex="-1"
            class="fixed top-0 left-0 right-0 z-50 hidden w-full h-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal bg-gray-400/50">
            <div class="relative w-full h-full max-w-md m-auto md:h-auto">
                <div class="relative bg-white rounded-lg shadow">
                    <button
                        type="button"
                        class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                        data-modal-hide="restart_modal">
                        <XMarkIcon class="w-5 h-5" />
                        <span class="sr-only">Reiniciar partida</span>
                    </button>
                    <div class="p-6 text-center">
                        <ExclamationCircleIcon
                            class="mx-auto mb-4 text-primary-400 w-14 h-14" />
                        <h3 class="mb-5 text-lg font-normal text-gray-500">
                            ¿Seguro que quieres volver a iniciar la partida?
                        </h3>
                        <button
                            data-modal-hide="restart_modal"
                            type="button"
                            @click="restart()"
                            class="text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mx-auto">
                            Sí
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Win Modal -->
        <button
            type="button"
            data-modal-target="win_modal"
            data-modal-toggle="win_modal"
            id="win_modal_button"
            class="hidden">
            Partida ganada
        </button>
        <div
            id="win_modal"
            data-modal-backdrop="static"
            data-modal-closable="false"
            tabindex="-1"
            class="fixed top-0 left-0 right-0 z-50 hidden w-full h-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal bg-gray-400/50">
            <div class="relative w-full h-full max-w-md m-auto md:h-auto">
                <div class="relative bg-white rounded-lg shadow">
                    <button
                        type="button"
                        class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                        data-modal-hide="win_modal">
                        <XMarkIcon class="w-5 h-5" />
                        <span class="sr-only">Partida ganada</span>
                    </button>
                    <div class="p-6 text-center">
                        <FaceSmileIcon
                            class="mx-auto mb-4 text-green-400 w-14 h-14" />
                        <h3 class="mb-5 text-lg font-normal text-gray-500">
                            ¡Has ganado! ¿Quieres volver a jugar?
                        </h3>
                        <button
                            data-modal-hide="win_modal"
                            type="button"
                            @click="restart()"
                            class="text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mx-auto">
                            Sí
                        </button>
                        <div>
                            <hr class="my-6" />
                            <h3
                                class="my-2 text-lg font-semibold text-primary-600">
                                Estadísticas
                            </h3>
                            <ul>
                                <li>
                                    Tiempo -
                                    <span class="text-primary-600">
                                        {{ played_time_string }}
                                    </span>
                                </li>
                                <li>
                                    Movimientos -
                                    <span class="text-primary-600">
                                        {{ amount_movements }}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Instructions Modal -->
        <div
            id="instructions_modal"
            tabindex="-1"
            class="fixed top-0 left-0 right-0 z-50 hidden w-full h-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal bg-gray-400/50">
            <div class="relative w-full h-full m-auto max-w-fit md:h-auto">
                <div class="relative p-8 bg-white rounded-lg shadow">
                    <button
                        type="button"
                        class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                        data-modal-hide="instructions_modal">
                        <XMarkIcon class="w-5 h-5" />
                        <span class="sr-only">Instrucciones del juego</span>
                    </button>
                    <div class="p-6 text-center">
                        <InformationCircleIcon
                            class="mx-auto mb-4 text-blue-400 w-14 h-14" />
                        <h3 class="mb-5 text-lg font-normal text-gray-500">
                            Estas son las instrucciones del juego
                        </h3>
                        <ul class="text-left text-gray-400 list-decimal">
                            <li>
                                El objetivo es repartir las 48 cartas en 4 mazos
                                distintos, de 12 cartas cada uno.
                            </li>
                            <li>
                                Hay que colocar las cartas en orden de mayor a
                                menor valor, comenzando con el número 12.
                            </li>
                            <li>
                                Una carta no puede colocarse encima de otra de
                                su mismo color.
                            </li>
                            <li>
                                Utiliza el mazo auxiliar (de color azul) para
                                almacenar las cartas que no puedas colocar.
                            </li>
                            <li>
                                Cuando ya no haya más cartas por sacar, las
                                cartas del mazo auxiliar se mezclaran y volverán
                                a estar disponibles.
                            </li>
                            <li>
                                El juego termina cuando el mazo auxiliar esté
                                vacío y no haya más cartas por sacar.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- End -->
    </div>
</template>

<style>
.main_grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(12, 1fr);
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
}

.pile_1_box {
    grid-area: 8 / 1 / 13 / 2;
}
.pile_2_box {
    grid-area: 8 / 2 / 13 / 3;
}
.pile_3_box {
    grid-area: 8 / 3 / 13 / 4;
}
.pile_4_box {
    grid-area: 8 / 4 / 13 / 5;
}
.leftover_cards_box {
    grid-area: 3 / 4 / 8 / 5;
}
.buttons_box {
    grid-area: 1 / 4 / 3 / 5;
}
.main_pile_box {
    grid-area: 1 / 1 / 8 / 4;
}
</style>
