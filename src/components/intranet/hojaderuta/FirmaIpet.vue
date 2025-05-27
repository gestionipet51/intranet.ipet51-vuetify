<template>
    <div class="image-container">
        <img :src="firmaIpet" alt="Firma Ipet51">
    </div>
</template>

<script setup>
    import firmaIpet from '@/assets/plantillas/images/image1.png'
</script>

<style>
    img {
        max-width: 120px;
        max-height: 150px;
        width:120px;
        height:150px;
    }

    .image-container {
        text-align: center;
        margin-top: 20px;
    }
    
</style>