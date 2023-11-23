<script>
import axios from 'axios';

import { Chart, LineController, LineElement, CategoryScale, Tooltip, LinearScale } from 'chart.js'

Chart.register(LineController, LineElement, CategoryScale, Tooltip, LinearScale)

export default {
    name: 'Evolutions',
    data() {
        return {
            evolutions: [],
            selectedEmployeeId: '1',
            lineChart: null
        }
    },
    created() {
        axios.get("http://localhost:3002/api/evolutions")
            .then(response => {
                this.evolutions = response.data
                this.initLineChart()
            })
    },
    methods: {
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
    <div>
        <select v-model="selectedEmployeeId" @change="onEmployeeChange">
            <option v-for="i in 10" :key="i" :value="i.toString()">{{ 'Employé ' + i }}</option>
        </select>

        <div class="line">
            <canvas ref="lineCanvas" width="400" height="100"></canvas>
        </div>
    </div>
</template>

<style scoped lang="scss">
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
        width: 400px;
        ;
    }

}
</style>
