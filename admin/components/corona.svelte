<script>
    let corona = [],
        canvas;

    fetch(
        "https://cors-anywhere.herokuapp.com/" +
            "https://covid-api.mmediagroup.fr/v1/history?country=India&status=Confirmed"
    )
        .then((res) => res.json())
        .then((r) => {
            corona = Object.entries(r.All.dates).reverse();
            corona = corona.slice(45, corona.length - 1);

            const ctx = canvas.getContext("2d");

            let blueGrad = ctx.createLinearGradient(500, 0, 500, 300);
            blueGrad.addColorStop(0, "#aaf8");
            blueGrad.addColorStop(1, "#aaf0");

            let redGrad = ctx.createLinearGradient(500, 0, 500, 300);
            redGrad.addColorStop(0, "#faa0");
            redGrad.addColorStop(1, "#faa0");

            for (let i = 0; i < corona.length; i++) {
                let temp = { x: corona[i][0], y: corona[i][1] };
                corona[i] = temp;
            }
            for (let i = 1; i < corona.length; i++)
                corona[corona.length - i].y =
                    corona[corona.length - i].y -
                    corona[corona.length - i - 1].y;
            const config = {
                type: "line",
                data: {
                    datasets: [
                        {
                            label: "Corona India",
                            data: corona.filter((d, i) => {
                                return (i + 1) % 3 == new Date().getDate() % 3;
                            }),
                            fill: true,
                            backgroundColor: blueGrad,
                            borderColor: "#aaf",
                        },
                        {
                            label: "Corona Ideal",
                            data: corona
                                .map((e, i) => {
                                    return {
                                        x: e.x,
                                        y: ~~(
                                            1e5 *
                                            Math.exp(
                                                (-1 * (i - 195) ** 2) /
                                                    (2 *
                                                        (i <= 195 ? 45 : 52) **
                                                            2)
                                            )
                                        ),
                                    };
                                })
                                .filter((d, i) => {
                                    return (
                                        (i + 1) % 7 == new Date().getDate() % 7
                                    );
                                }),
                            fill: true,
                            backgroundColor: redGrad,
                            borderColor: "#afa",
                        },
                    ],
                },
                options: {
                    responsive: true,
                    title: {
                        display: false,
                    },
                    scales: {
                        xAxes: [
                            {
                                type: "time",
                                time: {
                                    format: "YYYY-MM-DD",
                                    tooltipFormat: "ll",
                                },
                            },
                        ],
                    },
                },
            };
            window.myLine = new Chart(ctx, config);
        });
</script>

<canvas width="100%" bind:this={canvas} id="CJScanvas" />
