<template>
    <div class="eval">
        <img
            src="@/assets/pawn.svg"
            alt="pawn-icon"
            width="16"
            height="16"
            title="Material Difference"
        />
        {{ materialDiff }}
        <img
            src="@/assets/eval.svg"
            alt="eval-icon"
            width="16"
            height="16"
            title="Stockfish Evaluation"
        />
        {{ evaluation }}
        <img
            src="@/assets/move.svg"
            alt="move-icon"
            width="16"
            height="16"
            title="Stockfish Best Move"
        />
        {{ bestMove }}
    </div>
</template>

<script setup lang="ts">
defineProps<{
    materialDiff: number;
    evaluation: string;
    bestMove: string;
}>();
</script>

<style scoped>
.eval {
    justify-content: center;
    text-align: center;
}
</style>
