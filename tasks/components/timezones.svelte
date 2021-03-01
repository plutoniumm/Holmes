<script>
    let offset = 0;
    let [d, ctz] = [new Date(), "PST"];

    const tz = {
        PST: "America/Los_Angeles",
        CST: "America/Chicago",
        EST: "America/New_York",
        IST: "Asia/Kolkata",
        GMT: "Europe/London",
    };

    const recalc = () => (d = new Date(new Date().getTime() + 36e5 * offset));
</script>

<article>
    <table>
        <tr>
            <td>
                <select name="tz" on:blur={recalc} bind:value={ctz}>
                    {#each Object.entries(tz) as [k, v]}
                        <option value={k}>{k}: {v}</option>
                    {/each}
                </select>
            </td>
            <td>
                <input
                    type="range"
                    min="-48"
                    max="48"
                    on:mousemove={recalc}
                    bind:value={offset}
                />
            </td>
        </tr>
        {#each [ctz, "GMT", "IST"] as t}
            <tr>
                <td>
                    {t}
                </td>
                <td>
                    {d.toLocaleString("en-GB", { timeZone: tz[t] })}
                </td>
            </tr>
        {/each}
    </table>
</article>

<style>
</style>
