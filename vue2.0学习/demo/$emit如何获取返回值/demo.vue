<template>
    <div>
        name: {{ name || "--" }}
        <br />
        <input :value="name" @change="handleChange" />
        <br />
    </div>
</template>
<script>
export default {
    props: {
        name: String
    },
    methods: {
        handleChange(e) {
            const res = this.$emit("change", e.target.value, val => {
                console.log("父组件callback传递过来", val);
            });
            console.log(res, res === this); // 实例  true
        }
    }
};
</script>