<script>
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
</script>

<section>
    {#each Array(11) as day, i}
        <div class="day rpm-5" style="opacity:{(5 - Math.abs(i - 5)) / 5}">
            <div class="month">
                {months[
                    +new Date(
                        new Date().getTime() + ~~(i - 5) * 864e5
                    ).getMonth()
                ]}
            </div>
            <div class="numb">
                {new Date(new Date().getTime() + ~~(i - 5) * 864e5).getDate()}
            </div>
        </div>
    {/each}
</section>

<style type="text/scss">
    section {
        display: flex;
        .day {
            display: flex;
            flex-direction: column;
            font-weight: 600;
            padding: 0;
            background: #fff;
            width: 4em;
            overflow: hidden;
            .month {
                background: #a44;
                padding: 5px;
                color: #fff;
            }
            .numb {
                font-size: 48px;
                line-height: 40px;
                padding: 5px;
                color: #000;
            }
        }
    }
</style>
