<template>
    <div>
        {{id}}
    </div>
</template>
<script>
    export default{
        data(){
            return{
                id:0
            }
        },
        created(){
            this.id = this.$route.params.id
        }
    }

</script>
<style>


</style>

