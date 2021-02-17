<script>
    let events = [
        {
            class: "Academic",
            title: "Partial Differncial",
            desc: "Catch Up",
        },
    ];
</script>

<section>
    {#each events as evn}
        <div class="event w-100 rpm-5 t-lhs">
            <div class="title">
                {evn.title}
            </div>
            <div class="desc">
                {evn.desc}
            </div>
        </div>
    {/each}
</section>

<style type="text/scss">
    .event {
        border-left: 5px solid #fff;
        .title {
            font-weight: 600;
        }
    }
</style>
