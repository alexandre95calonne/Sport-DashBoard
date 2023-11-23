<script>
import { Chart, BubbleController, PointElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'

Chart.register(BubbleController, PointElement, CategoryScale, Tooltip, LinearScale)

export default {
    name: 'MoyAgeCat',
    props: {
        employeeData: Array
    },
    data() {
        return {
            bubbleChart: null
        }
    },
    mounted() {
        this.initBubbleChart()
    },
    methods: {
        initBubbleChart() {
            console.log(this.employeeData)
            const categoriesData = this.employeeData.reduce((sum, employee) => {
                const category = employee.categorie_socio_professionnelle

                if (!sum[category]) {
                    sum[category] = {
                        totalAge: 0,
                        count: 0
                    }
                }

                sum[category].totalAge += parseInt(employee.age)
                sum[category].count++

                return sum
            }, {})

            const labels = Object.keys(categoriesData)
            const datasetsData = labels.map(label => {
                const moyAge = (categoriesData[label].totalAge / categoriesData[label].count).toFixed(2)
                return {
                    x: label,
                    y: moyAge,
                    r: Math.sqrt(categoriesData[label].count) * 5
                }
            })

            const config = {
                type: 'bubble',
                data: {
                    datasets: [{
                        label: "Moyenne d'âge par catégorie",
                        data: datasetsData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: "Répartition de la moyenne d'âge par catégorie socio-professionnelle"
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    scales: {
                        x: {
                            type: 'category',
                            position: 'bottom',
                            labels: labels
                        },
                        y: {
                            type: 'linear',
                            position: 'left'
                        }
                    }
                }
            }

            const ctx = this.$refs.bubbleCanvas.getContext('2d')
            this.bubbleChart = new Chart(ctx, config)
        }
    }
}
</script>

<template>
    <div class="bubble">
        <canvas ref="bubbleCanvas" width="600" height="300"></canvas>
    </div>
</template>

<style scoped lang="scss">
.bubble {
    height: 300px;
    width: 600px;
    margin: 1.5rem 4rem;

    canvas {
        height: 100%;
        width: 100%;
    }
}
</style>
