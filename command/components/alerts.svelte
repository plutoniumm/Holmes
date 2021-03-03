<script>
    import { fade } from "svelte/transition";
    import { repoSecurity } from "../../public/shared/js/yoroi";

    let promise = repoSecurity();
</script>

{#await promise}
    <a class="blur flex safe" href="/">
        <svg
            viewBox="0 0 32 32"
            width="20"
            height="20"
            fill="none"
            stroke="currentcolor"
            stroke-width="2"
        >
            <path d="M16 14 L16 23 M16 8 L16 10" />
            <circle cx="16" cy="16" r="14" />
        </svg>
        Checking...
    </a>
{:then response}
    <a
        in:fade
        href="https://github.com/notifications?query=reason%3Asecurity-alert"
        class="blur flex alert"
    >
        <svg
            viewBox="0 0 32 32"
            width="20"
            height="20"
            fill="none"
            stroke="currentcolor"
            stroke-width="2"
        >
            <path d="M16 14 L16 23 M16 8 L16 10" />
            <circle cx="16" cy="16" r="14" />
        </svg>
        Security Vulnerability Found in&nbsp;<strong>{response[0].name}</strong
        >&nbsp;(Code 0)
    </a>
{:catch err}
    <a in:fade href="https://github.com/" class="blur flex warn">
        <svg
            viewBox="0 0 32 32"
            width="20"
            height="20"
            fill="none"
            stroke="currentcolor"
            stroke-width="2"
        >
            <path d="M16 14 L16 23 M16 8 L16 10" />
            <circle cx="16" cy="16" r="14" />
        </svg>
        Unknown error, try again!
    </a>
{/await}

<style type="text/scss">
    a {
        align-items: center;
        justify-content: center;
        width: 400px;
        margin: 0 auto;
        padding: 10px 5px;
        border-radius: 20px;
        transform: scale(1);
        animation: aja 1s ease forwards;
        animation-delay: 1s;
        transition: transform 0.2s ease;
        &:hover {
            transform: scale(1.05);
        }
        svg {
            padding: 0 5px 0 0;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
    }
    .alert {
        background: #a448;
        color: #f88;
    }
    .safe {
        background: #4a48;
        color: #8f8;
    }
    .warn {
        background: #aa48;
        color: #ff8;
    }
</style>
