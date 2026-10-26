<template>
    <dotlottie-player 
        :src="src" 
        background="transparent" 
        speed="1" 					
        direction="1"
        playMode="normal" 
        loop
        autoplay
    >
    </dotlottie-player>
</template>

<script type="module" src="/lib/dotlottie/dotlottie-player.js"></script>
<script type="module">

Vue.config.ignoredElements = ["dotlottie-player"];

module.exports = {
	name : 'lottie',
    props: {
        src: {
            type: String,
            default: "",
        },
    },
    data : () => ({
        lottie_src: "",
    }),
}
</script>