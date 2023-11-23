<script>
import { Chart, PieController, ArcElement, CategoryScale, Tooltip } from 'chart.js'

Chart.register(PieController, ArcElement, CategoryScale, Tooltip)

export default {
    name: 'TauxParticipation',
    props: {
        tauxMoyen: String,
        tauxMoyenHommes: String,
        tauxMoyenFemmes: String
    },
    data() {
        return {
            selectedGenre: 'all',
            pieChartData: null
        }
    },
    mounted() {
        this.initPieChart()
    },
    methods: {
        initPieChart() {
            let percentage = 0

            if (this.selectedGenre === 'all') {
                percentage = parseFloat(this.tauxMoyen)
            } else if (this.selectedGenre === 'homme') {
                percentage = parseFloat(this.tauxMoyenHommes)
            } else {
                percentage = parseFloat(this.tauxMoyenFemmes)
            }

            const remainingPercentage = 100 - percentage

            const data = {
                labels: ['Taux de participation'],
                datasets: [{
                    data: [percentage, remainingPercentage],
                    backgroundColor: ['#FF6384', '#E0E0E0']
                }]
            }

            const config = {
                type: 'pie',
                data: data
            }

            const ctx = this.$refs.pieCanvas.getContext('2d')
            this.pieChartData = new Chart(ctx, config)
        },
        updatePieChart() {
            if (!this.pieChartData) {
                console.error("Le graphique n'est pas initialisé.")
                return
            }

            this.pieChartData.destroy()
            this.initPieChart()
        }
    }
}
</script>

<template>
    <div class="cat">
        <select v-model="selectedGenre" @change="updatePieChart">
            <option value="all">Tous</option>
            <option value="homme">Hommes</option>
            <option value="femme">Femmes</option>
        </select>

        <div class="pie">
            <canvas ref="pieCanvas" width="250" height="250"></canvas>
        </div>
    </div>
</template>

<style scoped lang="scss">
.cat {
    display: flex;
    flex-direction: column;

    select {
        font-size: 16px;
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        background-color: #F4F4F4;
        color: #333;
        transition: background-color 0.3s ease;
        cursor: pointer;
    }

    select:hover {
        background-color: #E9E9E9;
    }

    select:active,
    select:focus {
        outline: none;
        background-color: #E0E0E0;
    }

    .pie {
        height: 250px;
        width: 250px;
        margin: 1rem 4rem 1rem 0;

        canvas {
            height: 100%;
            width: 100%;
        }
    }
}
</style>
