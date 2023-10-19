<script>
import axios from 'axios'

import { Chart,PieController, DoughnutController, ArcElement, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, BarController, LinearScale, BarElement } from 'chart.js';

Chart.register(DoughnutController, ArcElement, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, BarController, LinearScale, BarElement, PieController);

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
            pieChartData: null
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

        updatePieChart() {
            let dataToDisplay = []
            
            if (this.selectedGenre === 'all') {
                dataToDisplay = [parseFloat(this.tauxMoyen)]
            } else if (this.selectedGenre === 'homme') {
                dataToDisplay = [parseFloat(this.tauxMoyenHommes)]
            } else {
                dataToDisplay = [parseFloat(this.tauxMoyenFemmes)]
            }

            this.pieChartData.data.datasets = [{
                ...this.pieChartData.data.datasets[0],
                data: dataToDisplay
            }]
            this.pieChartData.update()
        },

        initPieChart() {
            const data = {
                labels: ['Taux de participation'],
                datasets: [{
                    data: [parseFloat(this.tauxMoyen)],
                    backgroundColor: ['#FF6384']
                }]
            }

            const config = {
                type: 'pie',
                data: data
            }

            const ctx = this.$refs.pieCanvas.getContext('2d')
            this.pieChartData = new Chart(ctx, config)
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
                <canvas ref="donutCanvas" width="200" height="200"></canvas>
            </div>

            <div class="bat">
                <canvas ref="barCanvas" width="500" height="200"></canvas>
            </div>

            <div class="cat">
                <select v-model="selectedGenre" @change="updatePieChart">
                    <option value="all">Tous</option>
                    <option value="homme">Hommes</option>
                    <option value="femme">Femmes</option>
                </select>

                <div class="pie">
                    <canvas ref="pieCanvas" width="200" height="200"></canvas>
                </div>
            </div>
        </div>

        <h3>Évolutions</h3>


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
        display: flex;
        flex-direction: row;

        .donut {
            height: 200px;
            width: 200px;
            margin: 1rem 4rem 1rem 0;

            canvas {
                height: 100%;
                width: 100%;
            }
        }

        .bat {
            height: 200px;
            width: 500px;
            margin: 1rem 4rem;

            canvas {
                height: 100%;
                width: 100%;
            }
        }

        .cat {
            display: flex;
            flex-direction: column;

            .pie {
                height: 200px;
                width: 200px;
                margin: 1rem 4rem 1rem 0;

                canvas {
                    height: 100%;
                    width: 100%;
                }
            }
        }

    }


}
</style>