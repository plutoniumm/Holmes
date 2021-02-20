<script>
    import { colors } from "../../public/shared/standards";

    let newEvn;

    class Event {
        constructor(at, type, title, desc) {
            this.at = at || new Date() / 1e3;
            this.type = type;
            this.title = title;
            this.desc = desc;
        }
    }

    let events = [
        new Event(1613596412, "Academic", "Partial Differnecial", "Catch Up"),
    ];
    let stack = [
        new Event("", "Development", "Ronin", "Convert Quartermaster to Ronin"),
    ];

    const taskProcessor = (e) => {
        let formDat = new FormData(newEvn);
        console.log([formDat.get("title")]);
        // events = [
        //     ...events,
        //     {
        //         class: cls,
        //         title: title,
        //         desc: desc,
        //     },
        // ];
    };

    const cases = (cls) => {
        if (cls == "Academic") return "white";
        if (cls == "Development") return "orange";
    };
</script>

{#each events as evn}
    <div
        class="event rpm-5 t-lhs"
        style={`
            border-left: 5px solid ${colors[cases(evn.type)].d};
            background:${colors[cases(evn.type)].l}4;
            color:${colors[cases(evn.type)].d}`}
    >
        <div class="title">
            {evn.title}
        </div>
        <div class="desc">
            {evn.desc}
        </div>
    </div>
{/each}
<form
    bind:this={newEvn}
    class="blurW rpm-5 t-lhs"
    on:submit|preventDefault={taskProcessor}
>
    <div>
        <input name="title" class="w-50" type="text" value="PDE" />
        <select name="type" class="w-25" value="Academic">
            {#each ["Academic", "Projects", "Development", "BITSGroups", "Organisations"] as mt}
                <option value={mt}>
                    {mt}
                </option>
            {/each}
        </select>
        <input type="submit" value="submit" style="opacity:0" class="w-20" />
    </div>
    <input name="desc" class="w-100" type="text" value="Catching up" />
</form>
{#each stack as evn}
    <div
        class="event rpm-5 t-lhs blur"
        style={`
            border-left: 5px solid ${colors[cases(evn.type)].d};
            background:${colors[cases(evn.type)].m}4;
            color:${colors[cases(evn.type)].d}`}
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
