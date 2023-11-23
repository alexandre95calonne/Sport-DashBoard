<script>
import { Chart, BarController, LinearScale, CategoryScale, BarElement, Tooltip } from 'chart.js'

Chart.register(BarController, LinearScale, CategoryScale, BarElement, Tooltip)

export default {
    name: 'NombreEmployesCat',
    props: {
        employeeData: Array
    },
    mounted() {
        this.initBarChart()
    },
    methods: {
        initBarChart() {
            const categoriesCount = this.employeeData.reduce((counts, employee) => {
                const category = employee.categorie_socio_professionnelle

                if (!counts[category]) {
                    counts[category] = 0
                }

                counts[category]++
                return counts
            }, {})

            const labels = Object.keys(categoriesCount)
            const barData = Object.values(categoriesCount)

            const config = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Nombre d'employés par catégories",
                        data: barData,
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

            const ctx = this.$refs.barCanvas.getContext('2d');
            new Chart(ctx, config)
        }
    }
}
</script>

<template>
    <div class="bat">
        <canvas ref="barCanvas" width="600" height="300"></canvas>
    </div>
</template>

<style scoped lang="scss">
.bat {
    height: 300px;
    width: 600px;
    margin: 1rem 4rem;

    canvas {
        height: 100%;
        width: 100%;
    }
}
</style>
