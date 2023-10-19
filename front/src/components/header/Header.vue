<script>
    export default {
        name: 'Header'
    }
</script>

<template>
    <header>
        <h1>SportDashboard</h1>
    </header>
</template>

<style scoped lang="scss">
    header {
        height: 80px;
        background-color: #3A4671;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 6rem 0 6rem;

        h1 {
            color: #fff;
        }
    }

</style>