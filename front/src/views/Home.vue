<script>
import axios from 'axios'

import chiffresCles from '../components/chiffresCles/chiffresCles.vue'
import NombreHF from '../components/nombreHF/NombreHF.vue'
import TauxParticipation from '../components/tauxParticipation/TauxParticipation.vue' 
import NombreEmployesCat from '../components/nombreEmployesCat/NombreEmployesCat.vue'
import MoyAgeCat from '../components/moyAgeCat/MoyAgeCat.vue'
import Evolutions from '../components/evolutions/Evolutions.vue'

export default {
    name: 'Home',
    components: {
        chiffresCles,
        MoyAgeCat,
        NombreHF,
        TauxParticipation,
        Evolutions,
        NombreEmployesCat
    },
    data() {
        return {
            totalEmployes: 0,
            totalFemmes: 0,
            totalHommes: 0,
            tauxMoyen: "0%",
            donutChart: null,
            selectedGenre: 'all',
            pieChartData: null,
            employeesData: [],
            evolutions: [],
            selectedEmployeeId: '1',
            lineChart: null,
            dataLoaded: false
        }
    },
    created() {
        axios.get("http://localhost:3002/api/employees")
            .then(response => {
                const data = response.data

                this.employeesData = data;
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

                this.dataLoaded = true;
            })
    }
}
</script>

<template>
    <div class="home__container">

        <chiffresCles
            :total-employes="totalEmployes"
            :total-femmes="totalFemmes"
            :total-hommes="totalHommes"
            :taux-moyen="tauxMoyen">
        </chiffresCles> 

        <h2>Les chiffres visuels</h2>

        <h3>Données générales</h3>

        <div class="donneesGen">

            <NombreHF v-if="dataLoaded" :total-femmes="totalFemmes" :total-hommes="totalHommes" />

            <TauxParticipation v-if="dataLoaded" :taux-moyen="tauxMoyen" :taux-moyen-hommes="tauxMoyenHommes" :taux-moyen-femmes="tauxMoyenFemmes" />

            <NombreEmployesCat v-if="dataLoaded" :employee-data="employeesData" />

            <MoyAgeCat v-if="dataLoaded" :employeeData="employeesData" />

        </div>

        <h3>Évolutions</h3>

        <Evolutions />

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

    .donneesGen {
        width: 100%;
        justify-content: space-around;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
    }
}
</style>