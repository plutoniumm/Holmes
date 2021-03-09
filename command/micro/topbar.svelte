<script>
    import { date } from "../../public/shared/js/yoroi";

    let dateTime = "";
    setInterval(() => (dateTime = date()), 1.5e3);
</script>

<div class="flex" id="deets">
    <svg viewbox="0 0 256 128" height="22px">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#000;" />
                <stop offset="100%" style="stop-color:#900;" />
            </linearGradient>
        </defs>
        <text
            fill="url(#grad1)"
            font-weight="700"
            font-family="Times"
            font-size="128"
            x="0"
            y="110">浪人</text
        >
    </svg>
    <div>{dateTime}</div>
</div>

<style>
    #deets {
        position: fixed;
        top: -20px;
        padding: 0 5px;
        justify-content: space-between;
        width: calc(100% - 10px);
        animation: topBar 0.2s ease forwards;
        animation-delay: 1s;
    }
    @keyframes topBar {
        to {
            top: 5px;
        }
    }
</style>
