<script>
    import { colors } from "../../public/shared/standards";

    let events = [
        {
            at: 1613596412359,
            class: "Academic",
            title: "Partial Differnecial",
            desc: "Catch Up",
        },
    ];
    let stack = [
        {
            class: "Development",
            title: "Ronin",
            desc: "Convert Quartermaster to Ronin",
        },
    ];

    const taskProcessor = (e) => {
        events = [
            ...events,
            {
                class: cls,
                title: title,
                desc: desc,
            },
        ];
    };

    let [title, desc, cls] = ["PDE", "Catching up", "Academic"];
    const cases = (cls) => {
        if (cls == "Academic") return "white";
        if (cls == "Development") return "orange";
    };
</script>

{#each events as evn}
    <div
        class="event rpm-5 t-lhs"
        style={`
            border-left: 5px solid ${colors[cases(evn.class)].d};
            background:${colors[cases(evn.class)].l}4;
            color:${colors[cases(evn.class)].d}`}
    >
        <div class="title">
            {evn.title}
        </div>
        <div class="desc">
            {evn.desc}
        </div>
    </div>
{/each}
<form class="blurW rpm-5 t-lhs" on:submit|preventDefault={taskProcessor}>
    <div>
        <input class="w-50" type="text" value={title} />
        <select class="w-25" bind:value={cls}>
            {#each ["Academic", "Projects", "Development", "BITSGroups", "Organisations"] as mt}
                <option value={mt}>
                    {mt}
                </option>
            {/each}
        </select>
        <input type="submit" value="submit" style="opacity:0" class="w-20" />
    </div>
    <input class="w-100" type="text" value={desc} />
</form>
{#each stack as evn}
    <div
        class="event rpm-5 t-lhs blur"
        style={`
            border-left: 5px solid ${colors[cases(evn.class)].d};
            background:${colors[cases(evn.class)].m}4;
            color:${colors[cases(evn.class)].d}`}
    >
        <div class="title">
            {evn.title}
        </div>
        <div class="desc">
            {evn.desc}
        </div>
    </div>
{/each}

<style type="text/scss">
    .event {
        width: calc(100% - 25px);
        .title {
            font-weight: 600;
        }
    }
    input,
    textarea {
        color: #fff;
    }
</style>
