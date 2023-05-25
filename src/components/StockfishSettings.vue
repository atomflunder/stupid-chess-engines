<template>
    <div class="stockfish">
        <div style="grid-row: 1">
            <img
                src="@/assets/settings.svg"
                title="Stockfish Settings"
                alt="settings-icon"
                width="20"
                height="20"
                class="black-outline"
            />
            STOCKFISH SETTINGS
        </div>

        <div style="grid-row: 2">LEVEL: {{ stockfishOptions.level }}</div>
        <input
            class="slider"
            style="grid-row: 2"
            type="range"
            min="0"
            max="20"
            @input="
                $emit('change-level', stockfishOptions, ($event.target as HTMLInputElement).value)
            "
        />

        <div style="grid-row: 3">DEPTH: {{ stockfishOptions.depth }}</div>
        <input
            class="slider"
            style="grid-row: 3"
            type="range"
            min="1"
            max="20"
            @input="
                $emit('change-depth', stockfishOptions, ($event.target as HTMLInputElement).value)
            "
        />

        <div style="grid-row: 4">MAX ERROR: {{ stockfishOptions.maxError }}</div>
        <input
            class="slider"
            style="grid-row: 4"
            type="range"
            min="0"
            max="5000"
            @input="
                $emit(
                    'change-max-error',
                    stockfishOptions,
                    ($event.target as HTMLInputElement).value
                )
            "
        />

        <div style="grid-row: 5">PROBABILITY: {{ stockfishOptions.probability }}</div>
        <input
            class="slider"
            style="grid-row: 5"
            type="range"
            min="1"
            max="1000"
            @input="
                $emit(
                    'change-probability',
                    stockfishOptions,
                    ($event.target as HTMLInputElement).value
                )
            "
        />
    </div>
</template>

<script setup lang="ts">
import type { StockfishOptions } from '@/helpers/options';

defineProps<{
    stockfishOptions: StockfishOptions;
}>();

defineEmits(['change-level', 'change-depth', 'change-max-error', 'change-probability']);
</script>

<style scoped>
.stockfish {
    display: grid;
    margin-top: 100px;
    grid-template-columns: 180px 220px;
    gap: 5px;
}

.slider {
    accent-color: #444;
}
</style>
