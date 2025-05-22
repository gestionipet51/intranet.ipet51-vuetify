<template>
    <div class="image-container">
        <img :src="selloIpet" alt="Sello Ipet51">
    </div>
</template>

<script setup>
    import selloIpet from '@/assets/plantillas/images/image2.png'
</script>

<style>
    img {
        max-width: 100px;
        max-height: 150px;
        width:100px;
        height:150px;
    }

    .image-container {
        text-align: center;
        margin-top: 20px;
    }
    
</style>