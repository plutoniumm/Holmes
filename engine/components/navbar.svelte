<script>
</script>

<style>
      .nav {
            width: calc(100% - 2em);
            background: #2224;
            backdrop-filter: blur(32px);
            -moz-backdrop-filter: blur(32px);
            -webkit-backdrop-filter: blur(32px);
            padding: 1em;
            display: flex;
            justify-content: space-between;
      }
</style>

<nav class="nav">
      <div>Holmes</div>
      <div>
            {new Date()
                  .toLocaleString('en-GB')
                  .slice(0, -3)
                  .replace('/2020', '')}
      </div>
      <div onclick="window.location.href='http://localhost:3000'">Newton</div>
</nav>
