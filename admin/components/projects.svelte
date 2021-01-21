<script>
    import projeccs from "../../config/projects.json";

    const inverter = (col) => {
        const base = 0xfff - Number("0x" + col.split("#")[1]);
        return base < 100 ? "0" + base : base;
    };
    const calcfrac = (pj) =>
        ~~(
            (1 -
                (new Date(pj.end).getTime() - today) /
                    (new Date(pj.end) - new Date(pj.start))) *
            1e2
        );

    const today = new Date().getTime();
</script>

<style type="text/scss">
    .project-boxes {
        flex-direction: column;
        flex: 2;
        overflow: hidden;
        height: 100%;
        display: flex;
        margin: 0 -8px;
        overflow-y: auto;

        .project-box {
            display: flex;
            border-radius: 10px;
            position: relative;
            > * {
                margin-right: 12px;
            }
        }

        .project-box-content-header {
            order: 1;
            max-width: 120px;
        }

        .project-box-header {
            order: 2;
        }

        .project-box-footer {
            order: 3;
            padding-top: 0;
            flex-direction: column;
            justify-content: flex-start;
        }

        .project-box-footer:after {
            display: none;
        }

        .participants {
            margin-bottom: 8px;
        }

        .project-box-content-header p {
            text-align: left;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .project-box-header > span {
            position: absolute;
            bottom: 16px;
            left: 16px;
            font-size: 12px;
        }

        .box-progress-wrapper {
            order: 3;
            flex: 1;
        }
    }

    .project-box {
        border-radius: 30px;
        padding: 16px;

        &-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            color: #4a4a4a;
            opacity: 0.7;
            font-size: 14px;
            line-height: 16px;
        }

        &-content-header {
            text-align: center;
            margin-bottom: 16px;
            p {
                margin: 0;
            }
        }

        &-wrapper {
            padding: 8px;
        }
    }

    .box-content-header {
        font-size: 16px;
        color: #111;
        line-height: 24px;
        font-weight: 700;
        opacity: 0.7;
    }

    .box-content-subheader {
        color: #111;
        font-size: 14px;
        line-height: 24px;
        opacity: 0.7;
    }

    .box-progress {
        display: block;
        height: 4px;
        border-radius: 6px;

        &-bar {
            width: 100%;
            height: 4px;
            border-radius: 6px;
            overflow: hidden;
            background: #fff;
            margin: 8px 0;
        }

        &-header {
            font-size: 14px;
            font-weight: 700;
            line-height: 16px;
            margin: 0;
        }

        &-percentage {
            text-align: right;
            margin: 0;
            font-size: 14px;
            font-weight: 700;
            line-height: 16px;
        }
    }

    .project-box-footer {
        display: flex;
        justify-content: space-between;
        padding-top: 16px;
        position: relative;

        &:after {
            content: "";
            position: absolute;
            background: rgba(255, 255, 255, 0.6);
            width: calc(100% + 64px);
            top: 0;
            left: -16px;
            height: 1px;
        }
    }

    .participants {
        display: flex;
        align-items: center;

        img {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            overflow: hidden;
            object-fit: cover;

            &:not(:first-child) {
                margin-left: -8px;
            }
        }
    }

    .days-left {
        background: rgba(255, 255, 255, 0.6);
        font-size: 12px;
        border-radius: 20px;
        flex-shrink: 0;
        padding: 6px 16px;
        font-weight: 700;
    }
</style>

<div class="project-boxes">
    {#each projeccs as pj}
        <div class="project-box-wrapper" style="color:#{inverter(pj.colorl)}">
            <div class="project-box" style="background: {pj.colorl}">
                <div class="project-box-header"><span>{pj.end}</span></div>
                <div class="project-box-content-header">
                    <p class="box-content-header">{pj.name}</p>
                    <p class="box-content-subheader">{pj.sub}</p>
                </div>
                <div class="box-progress-wrapper">
                    <p class="box-progress-header">Progress</p>
                    <div class="box-progress-bar">
                        <span
                            class="box-progress"
                            style={`width: ${calcfrac(pj)}%; background: ${pj.colord}`} />
                    </div>
                    <p class="box-progress-percentage">{calcfrac(pj)}%</p>
                </div>
                <div class="project-box-footer">
                    <div class="participants">
                        <span>{pj.people.join(', ')}</span>
                        <!-- {#each pj.people as ppl}
                            <img src="" alt="participant" />
                        {/each} -->
                    </div>
                    <div class="days-left" style="color: {pj.colord}">
                        {~~((new Date(pj.end).getTime() - today) / 864e5)}
                        Days Left
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>
