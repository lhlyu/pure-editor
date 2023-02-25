<template>
    <header>
        <h1>纯净编辑器</h1>
    </header>
    <main>
        <PureEditor></PureEditor>
    </main>
</template>

<script lang="ts" setup>
import PureEditor from './pure-editor'
</script>

<style lang="scss">
* {
    padding: 0;
    margin: 0;
}
body {
    height: 100vh;
    width: 100%;
    padding: 15px;
    box-sizing: border-box;

    header {
        height: 60px;
        line-height: 60px;
        text-align: center;
    }

    main {
        height: calc(100% - 60px);
        width: 100%;
        margin: 0 auto;
        border: 1px solid #e5e5e5;
        box-sizing: border-box;
    }
}
</style>
