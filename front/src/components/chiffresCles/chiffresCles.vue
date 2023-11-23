<script>
import femininSVG from '@/assets/feminin.svg'
import masculinSVG from '@/assets/masculin.svg'
import tauxSVG from '@/assets/taux.svg'
import allEmployesSVG from '@/assets/allEmployes.svg'

export default {
    name: 'chiffresCles',
    props: {
        totalEmployes: Number,
        totalFemmes: Number,
        totalHommes: Number,
        tauxMoyen: String,
    },
    data() {
        return {
            femininSVG,
            masculinSVG,
            allEmployesSVG,
            tauxSVG,
        }
    },
}
</script>

<template>
    <h2>Quelques chiffres</h2>
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
</template>

<style scoped lang="scss">

h2 {
        margin-bottom: 1.5rem;
        margin-top: 3rem;
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
</style>
