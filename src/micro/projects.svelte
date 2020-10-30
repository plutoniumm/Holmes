<script>
      let proj;
</script>

<style type="text/scss">
      form {
            overflow-x: scroll;
            padding: 0.5em 0;
            padding-top: 0.75em;
            display: flex;
            justify-content: center;
            text-align: center;
            align-items: center;
            input {
                  font-size: 1.25em;
                  background: transparent;
                  outline: 0;
                  border: 1px solid #2228;
                  border-radius: 10px;
                  backdrop-filter: blur(25px);
                  -webkit-backdrop-filter: blur(25px);
                  -moz-backdrop-filter: blur(25px);
                  -ms-backdrop-filter: blur(25px);
                  background: #2228;
                  color: #fff;
                  margin: 0 12px;
                  padding: 10px;
                  width: 90px;
            }
      }
</style>

<form
      class="box"
      on:submit|preventDefault={() => (window.location.href = `vscode://file/Users/vivaldi/Documents/GitHub.nosync/${proj}/`)}>
      <img src="./assets/vsc.png" height="75px" width="75px" alt="" />
      <input type="text" bind:value={proj} placeholder="Project →" />
</form>
