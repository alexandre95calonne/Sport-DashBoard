<script>
import { Chart } from 'chart.js';

export default {
    name: 'barChart',
    props: {
        chartData: Array,
        chartLabels: Array
    },
    mounted() {
        this.initBarChart()
    },
    methods: {
        initBarChart() {
            const config = {
                type: 'bar',
                data: {
                    labels: this.chartLabels,
                    datasets: [{
                        label: "Nombre d'employés par catégories",
                        data: this.chartData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }

            const ctx = this.$refs.barCanvas.getContext('2d')
            new Chart(ctx, config)
        }

    }
}
</script>

<template>
    <div class="bat">
        <canvas ref="barCanvas" width="500" height="200"></canvas>
    </div>
</template>

<style scoped lang="scss">
.bat {
    height: 200px;
    width: 500px;
    margin: 1rem 4rem;

    canvas {
        height: 100%;
        width: 100%;
    }
}
</style>