<script lang="ts" setup>
import { initModals } from 'flowbite';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';

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
const amount_cards = 4;
const cards_per_suite = 1;

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

let current_card_id = amount_cards - 1;

/*
    Main functions
*/

function restart() {
    // TODO : Hay que arreglar este método
    window.location.reload();
}

function endGame() {
    // TODO : Hay que arreglar este método
    restart();
}

/*
    Operation functions
*/

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

function shuffleCards(pile: Card[]): Card[] {
    let result_pile = pile.sort((a, b) => 0.5 - Math.random()) as Card[];
    result_pile.forEach((card, index) => {
        card.id = index;
        card.pile_position = index;
    });
    return result_pile;
}

function clearPiles() {
    pile_1.array = [];
    pile_2.array = [];
    pile_3.array = [];
    pile_4.array = [];
    leftover_pile.array = [];
    initial_pile.array = [];
}

// Card functions

function makeDraggable(card_id: number) {
    console.log(card_id);
    const card_element = document.getElementById(`card-${card_id}`)!;
    card_element.draggable = true;
    card_element.classList.add('cursor-grab');
}

// Drag and drop functions

function dragStart(event: DragEvent, card: Card) {
    event.dataTransfer!.setData('cardID', card.id.toString());

    if (!isPlaying) {
        isPlaying = true;
    }
}

function onDrop(event: DragEvent, new_pile_id: number) {
    const cardID = event.dataTransfer!.getData('cardID');
    const card = initial_pile.array.find((card) => card.id == parseInt(cardID));

    initial_pile.array.splice(card!.pile_position, 1);

    //TODO: Comprobar si la carta se puede mover a la pila

    if (card!.pile_position - 1 < 0) {
        endGame();
        return;
    }

    current_card_id = initial_pile.array[card!.pile_position - 1].id; // ID de la carta siguiente

    card!.current_pile = new_pile_id;
    card!.pile_position = 0;

    switch (new_pile_id) {
        case 1:
            pile_1.array.push(card!);
            break;
        case 2:
            pile_2.array.push(card!);
            break;
        case 3:
            pile_3.array.push(card!);
            break;
        case 4:
            pile_4.array.push(card!);
            break;
        case 5:
            leftover_pile.array.push(card!);
            break;
    }

    setTimeout(() => makeDraggable(current_card_id), 1000);

    amount_movements += 1;
}

// Visual functions

function alignCards() {
    for (let i = 0; i < amount_cards; i++) {
        const card = document.getElementById(`card-${i}`)!;

        card.style.top = `${i * 3}px`;
        card.style.left = `${i * 6}px`;
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

onBeforeMount(() => {
    initial_pile.array = shuffleCards(generateCards());
});

onMounted(() => {
    initModals();
    setInterval(() => updateTime(), 1000);
    alignCards();
    makeDraggable(current_card_id);
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
            </div>
        </header>
        <!-- Content -->
        <main class="flex h-full py-4">
            <div class="m-auto main_grid w-[48rem] h-[40rem]">
                <!-- Piles -->
                <div
                    @drop="onDrop($event, pile_1.id)"
                    @dragover.prevent
                    @dragenter.prevent
                    class="flex bg-green-600 rounded-lg pile_1_box">
                    <img
                        v-for="card in pile_1.array"
                        draggable="false"
                        :src="`/cards/${card.suit}/${card.value}.png`"
                        class="w-24 h-40 m-auto rounded-lg select-none" />
                </div>
                <div
                    @drop="onDrop($event, pile_2.id)"
                    @dragover.prevent
                    @dragenter.prevent
                    class="flex bg-green-600 rounded-lg pile_2_box">
                    <img
                        v-for="card in pile_2.array"
                        draggable="false"
                        :src="`/cards/${card.suit}/${card.value}.png`"
                        class="w-24 h-40 m-auto rounded-lg select-none" />
                </div>
                <div
                    @drop="onDrop($event, pile_3.id)"
                    @dragover.prevent
                    @dragenter.prevent
                    class="flex bg-green-600 rounded-lg pile_3_box">
                    <img
                        v-for="card in pile_3.array"
                        draggable="false"
                        :src="`/cards/${card.suit}/${card.value}.png`"
                        class="w-24 h-40 m-auto rounded-lg select-none" />
                </div>
                <div
                    @drop="onDrop($event, pile_4.id)"
                    @dragover.prevent
                    @dragenter.prevent
                    class="flex bg-green-600 rounded-lg pile_4_box">
                    <img
                        v-for="card in pile_4.array"
                        draggable="false"
                        :src="`/cards/${card.suit}/${card.value}.png`"
                        class="w-24 h-40 m-auto rounded-lg select-none" />
                </div>
                <!-- Leftover Cards -->
                <div
                    @drop="onDrop($event, leftover_pile.id)"
                    @dragover.prevent
                    @dragenter.prevent
                    class="flex bg-blue-400 leftover_cards_box">
                    <img
                        v-for="card in leftover_pile.array"
                        draggable="false"
                        :src="`/cards/${card.suit}/${card.value}.png`"
                        class="w-24 h-40 m-auto rounded-lg select-none" />
                </div>
                <!-- Restart Button -->
                <div class="flex border border-gray-400 buttons_box">
                    <button
                        data-modal-target="restart_modal"
                        data-modal-toggle="restart_modal"
                        id="restart_button"
                        type="button"
                        class="px-3 py-2 m-auto text-white border rounded-lg border-primary-700 bg-primary-600 hover:bg-primary-500 hover:shadow-lg">
                        Reiniciar
                    </button>
                </div>
                <!-- Main Pile -->
                <div
                    class="relative flex bg-gradient-to-r from-green-600 via-green-500 to-green-600 main_pile_box">
                    <img
                        v-for="card in initial_pile.array"
                        draggable="false"
                        @dragstart="dragStart($event, card)"
                        :id="`card-${card.id}`"
                        :src="`/cards/${card.suit}/${card.value}.png`"
                        class="absolute w-24 h-40 transform rounded-lg select-none" />
                </div>
            </div>
        </main>
        <!-- Footer -->
        <footer class="py-4 mx-auto">
            <p class="text-md">
                Powered by
                <span class="font-semibold text-primary-600">
                    RAB Developments
                </span>
            </p>
        </footer>
        <!-- Restart Modal -->
        <div
            id="restart_modal"
            tabindex="-1"
            class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full bg-gray-400/50">
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
                        <InformationCircleIcon
                            class="mx-auto mb-4 text-gray-400 w-14 h-14" />
                        <h3 class="mb-5 text-lg font-normal text-gray-500">
                            ¿Seguro que quieres volver a iniciar la partida?
                        </h3>
                        <button
                            @click="restart()"
                            data-modal-hide="restart_modal"
                            type="button"
                            class="text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mx-auto">
                            Sí
                        </button>
                    </div>
                </div>
            </div>
        </div>
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
