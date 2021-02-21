<script>
    fetch("/social/google/trends")
        .then((response) => response.text())
        .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
        .then((data) => console.log(data));
</script>
