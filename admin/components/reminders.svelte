<script>
    let reminders = [];
    const sendCMD = (appl, cmd, params = "") => {
        fetch(`/sys?app=${appl}&cmd=${cmd}&params=${params}`, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((r) => {
                console.log(r);
                if (r.cmd == "reminders") {
                    reminders = r.data;
                }
            });
    };
    sendCMD("reminders", null, "Stack");
</script>

<style type="text/scss">
    article {
        padding: 5px;
        border-radius: 10px;
        background: #112;
        margin: 5px 0;
    }
    input,
    svg {
        border: 0;
        outline: none;
        padding: 5px;
        color: #fff;
        border-radius: 5px;
        margin: 5px;
        background: #334;
        height: 32px;
    }
    input {
        font-size: 1.2em;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }
    ul {
        list-style: none;
        padding: 2px;
        margin: 5px 0;
        border-radius: 5px;
        overflow: hidden;
        background: #334;
        li {
            padding: 2px;
            margin: 0 3px;
        }
    }
    svg {
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
        cursor: pointer;
        stroke: #fff;
        transition: background 0.2s ease;
        &:hover {
            background: #445;
        }
    }
</style>

<article style="display:flex;flex-wrap:wrap;">
    <img
        src="https://upload.wikimedia.org/wikipedia/commons/8/82/Reminders_(macOS).png"
        alt=""
        style="width:67px;margin:5px;height:67px" />
    <div style="display:flex;flex-wrap:wrap;">
        <div style="padding:2px 7px;width:100%;">REMINDERS</div>
        <input type="text" value="Stack" style="width:60px;" />
        <svg
            viewBox="0 0 32 34"
            on:click={(e) => sendCMD('reminders', null, e.target.parentElement.childNodes[0].value)}>
            <path stroke-width="3" d="M6 22 L16 30 26 22 M16 30 L16 2" />
        </svg>
    </div>
    <div style="width:100%;margin:left:70px;">
        {#each reminders as rmd}
            <div style="font-weight:600;">{rmd.list}</div>
            <ul>
                {#each rmd.notes as nt}
                    <li>{nt}</li>
                {/each}
            </ul>
        {/each}
    </div>
</article>
