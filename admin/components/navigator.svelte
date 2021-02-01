<script>
    export let naver;
</script>

<style type="text/scss">
    .nav {
        border-radius: 5px;
        ul {
            list-style: none;
            padding-left: 2px;
            .title {
                font-size: 0.9em;
                font-weight: 600;
                color: #888;
            }
            li {
                font-size: 1.1em;
                padding: 10px;
                border-radius: 5px;
                transition: background 0.2s ease;
                &:hover {
                    cursor: pointer;
                    background: #6664;
                }
            }
        }
    }
</style>

<div class="nav" on:click={naver}>
    <ul title="LongBox">
        <div class="title">LongBox</div>
        <li>Reminders</li>
        <li>Reddit</li>
        <li>Space</li>
        <li>Shows</li>
    </ul>
    <ul title="Central">
        <div class="title">Central</div>
        <li>Projects</li>
        <li>Corona</li>
    </ul>
</div>
