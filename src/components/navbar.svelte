<script>
</script>

<style>
      .nav {
            width: calc(100% - 2em);
            background: #222;
            padding: 1em;
            display: flex;
            justify-content: space-between;
      }
</style>

<nav class="nav">
      <div>Holmes</div>
      <div>{new Date().toLocaleString('en-GB')}</div>
      <div onclick="window.location.href='http://localhost:3000'">Newton</div>
</nav>
