<script>
import axios from 'axios'

import { Chart, PieController, DoughnutController, ArcElement, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, BarController, LinearScale, BarElement, BubbleController, PointElement, LineElement, LineController } from 'chart.js'

Chart.register(DoughnutController, ArcElement, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, BarController, LinearScale, BarElement, PieController, BubbleController, PointElement, LineElement, LineController)

import femininSVG from '@/assets/feminin.svg'
import masculinSVG from '@/assets/masculin.svg'
import tauxSVG from '@/assets/taux.svg'
import allEmployesSVG from '@/assets/allEmployes.svg'

export default {
    name: 'Home',
    data() {
        return {
            totalEmployes: 0,
            totalFemmes: 0,
            totalHommes: 0,
            tauxMoyen: "0%",
            femininSVG,
            masculinSVG,
            allEmployesSVG,
            tauxSVG,
            donutChart: null,
            selectedGenre: 'all',
            pieChartData: null,
            evolutions: [],
            selectedEmployeeId: '1',
            lineChart: null
        }
    },
    created() {
        axios.get("http://localhost:3002/api/employees")
            .then(response => {
                const data = response.data

                this.totalEmployes = data.length
                this.totalFemmes = data.filter(person => person.genre === "Femme").length
                this.totalHommes = data.filter(person => person.genre === "Homme").length

                const totalTaux = data.reduce((sum, person) => {
                    return sum + parseFloat(person.taux_participation.replace(' %', ''))
                }, 0)

                this.tauxMoyen = (totalTaux / data.length).toFixed(2) + "%"

                const totalTauxHommes = data
                    .filter(person => person.genre === "Homme")
                    .reduce((sum, person) => sum + parseFloat(person.taux_participation.replace(' %', '')), 0)

                this.tauxMoyenHommes = (totalTauxHommes / this.totalHommes).toFixed(2) + "%"

                const totalTauxFemmes = data
                    .filter(person => person.genre === "Femme")
                    .reduce((sum, person) => sum + parseFloat(person.taux_participation.replace(' %', '')), 0)

                this.tauxMoyenFemmes = (totalTauxFemmes / this.totalFemmes).toFixed(2) + "%"

                this.initDonutChart()
                this.initBarChart(data)
                this.initPieChart()
                this.initBubbleChart(data)
            }),
            axios.get("http://localhost:3002/api/evolutions")
                .then(response => {
                    this.evolutions = response.data
                    this.initLineChart()
                })
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
        },
        initBarChart(data) {
            const categoriesCount = data.reduce((counts, employee) => {
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

            const ctx = this.$refs.barCanvas.getContext('2d')
            new Chart(ctx, config)
        },
        initPieChart() {
            if (!this.$refs.pieCanvas) {
                console.error("Le canvas n'est pas disponible dans le DOM.")
                return
            }

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
            this.$nextTick(() => {
                this.initPieChart()
            })
        },
        initBubbleChart(data) {
            const categoriesData = data.reduce((sum, employee) => {
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
            new Chart(ctx, config)

        },
        initLineChart() {
            const employeeEvolutions = this.evolutions.filter(evolution => evolution.employe_id === this.selectedEmployeeId)

            const labels = employeeEvolutions.map(evolution => evolution.mois)

            const data = employeeEvolutions.map(evolution => parseInt(evolution.progression_sportive))

            const config = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Progression sportive',
                        data: data,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                }
            }

            const ctx = this.$refs.lineCanvas.getContext('2d')
            if (this.lineChart) {
                this.lineChart.destroy()
            }
            this.lineChart = new Chart(ctx, config)
        },

        onEmployeeChange() {
            this.initLineChart()
        }

    }
}
</script>

<template>
    <div class="home__container">
        <h2>Quelques chiffes</h2>

        <div class="home__chiffres">
            <div class="home__chiffres-card">
                <div class="card__left-bloc">
                    <p class="grey-txt">Nombre d'employés</p>
                    <p class="blue-txt">{{ totalEmployes }}</p>
                </div>
                <div class="card__right-bloc">
                    <img :src="allEmployesSVG" alt="allEmployes">
                </div>
            </div>

            <div class="home__chiffres-card">
                <div class="card__left-bloc">
                    <p class="grey-txt">Nombre de femmes</p>
                    <p class="blue-txt">{{ totalFemmes }}</p>
                </div>
                <div class="card__right-bloc">
                    <img :src="femininSVG" alt="feminin">
                </div>
            </div>

            <div class="home__chiffres-card">
                <div class="card__left-bloc">
                    <p class="grey-txt">Nombre d'hommes</p>
                    <p class="blue-txt">{{ totalHommes }}</p>
                </div>
                <div class="card__right-bloc">
                    <img :src="masculinSVG" alt="masculin">
                </div>
            </div>

            <div class="home__chiffres-card">
                <div class="card__left-bloc">
                    <p class="grey-txt">Moy. % participation</p>
                    <p class="blue-txt">{{ tauxMoyen }}</p>
                </div>
                <div class="card__right-bloc">
                    <img :src="tauxSVG" alt="taux">
                </div>
            </div>
        </div>

        <h2>Les chiffres visuels</h2>

        <h3>Données génales</h3>

        <div class="donneesGen">



            <div class="donut">
                <canvas ref="donutCanvas" width="275" height="275"></canvas>
            </div>

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

            <div class="bat">
                <canvas ref="barCanvas" width="600" height="300"></canvas>
            </div>

            <div class="bubble">
                <canvas ref="bubbleCanvas" width="600" height="300"></canvas>
            </div>

        </div>

        <h3>Évolutions</h3>

        <select v-model="selectedEmployeeId" @change="onEmployeeChange">
            <option v-for="i in 10" :key="i" :value="i.toString()">{{ 'Employé ' + i }}</option>
        </select>

        <div class="line">
            <canvas ref="lineCanvas" width="400" height="100"></canvas>
        </div>

    </div>
</template>

<style scoped lang="scss">
.home__container {
    padding: 0 6rem 0rem 6rem;

    h2 {
        margin-bottom: 1.5rem;
        margin-top: 3rem;
    }

    h3 {
        margin-top: 1rem;
        margin-bottom: 1.5rem;
    }

    .home__chiffres {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        flex-wrap: wrap;

        .home__chiffres-card {
            width: 263px;
            height: 80px;
            background-color: #fff;
            border-radius: 15px;
            box-shadow: 0px 3.5px 5.5px 0px rgba(0, 0, 0, 0.02);
            padding: 1rem;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin: 1rem 1.5rem;


            .grey-txt {
                color: #A0AEC0;
                font-size: 14px;
                font-weight: 400;
            }

            .blue-txt {
                color: #2D3748;
                font-weight: 700;
                font-size: 18px;
                margin-top: 0.5rem;
            }

            .card__left-bloc {
                display: flex;
                flex-direction: column;
            }

            .card__right-bloc {
                background-color: #151928;
                width: 45px;
                height: 45px;
                border-radius: 12px;
                box-shadow: 0px 3.5px 5.5px 0px rgba(0, 0, 0, 0.02);
                display: flex;
                justify-content: center;
                align-items: center;
            }

            img {
                height: 65%;
                width: 85%;
                ;
            }
        }
    }

    .donneesGen {
        width: 100%;
        justify-content: space-around;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;

        .donut {
            height: 275px;
            width: 275px;
            margin: 1rem 4rem 1rem 0;

            canvas {
                height: 100%;
                width: 100%;
            }
        }

        .bat {
            height: 300px;
            width: 600px;
            margin: 1rem 4rem;

            canvas {
                height: 100%;
                width: 100%;
            }
        }

        .bubble {
            height: 300px;
            width: 600px;
            margin: 1.5rem 4rem;

            canvas {
                height: 100%;
                width: 100%;
            }
        }

        .cat {
            display: flex;
            flex-direction: column;


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

    }

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

    .line {
        margin-bottom: 3rem;

        canvas {
            height: 100px;
            width: 400px;;
        }

    }



}
</style>