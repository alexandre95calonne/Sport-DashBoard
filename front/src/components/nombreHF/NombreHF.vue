<script>
import { Chart, DoughnutController, ArcElement, CategoryScale, Tooltip } from 'chart.js'

Chart.register(DoughnutController, ArcElement, CategoryScale, Tooltip)

export default {
    name: 'NombreHF',
    props: {
        totalFemmes: Number,
        totalHommes: Number
    },
    data() {
        return {
            donutChart: null
        }
    },
    mounted() {
        this.initDonutChart()
    },
    methods: {
        initDonutChart() {
            const data = {
                labels: ['Femmes', 'Hommes'],
                datasets: [{
                    data: [this.totalFemmes, this.totalHommes],
                    backgroundColor: ['#FF6384', '36A2EB']
                }]
            }

            const config = {
                type: 'doughnut',
                data: data,
                options: {
                    responsive: true,
                    legend: {
                        position: 'top'
                    },
                    animation: {
                        animationScale: true,
                        animationRotate: true
                    }
                }
            }

            const ctx = this.$refs.donutCanvas.getContext('2d')
            this.donutChart = new Chart(ctx, config)
        }
    }
}
</script>

<template>
    <div class="donut">
        <canvas ref="donutCanvas" width="275" height="275"></canvas>
    </div>
</template>

<style scoped lang="scss">
.donut {
    height: 275px;
    width: 275px;
    margin: 1rem 4rem 1rem 0;

    canvas {
        height: 100%;
        width: 100%;
    }
}
</style>
