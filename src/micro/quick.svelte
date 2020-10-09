<script>
      export let link;

      let linkImg;

      fetch("http://localhost:4000/favicon?link=" + link.imgLink)
            .then((r) => r.text())
            .then((fi) => {
                  linkImg.src = "data:image/png;base64, " + fi;
            });
</script>

<style type="text/scss">
      .quick {
            margin: 0.25em 0.75em;
            img {
                  width: 75px;
                  height: 75px;
                  object-fit: cover;
                  border-radius: 15px;
            }
            a {
                  text-decoration: none;
                  color: #fff;
            }
      }
</style>

<div class="quick">
      <a href={link.link}>
            <div>
                  <img
                        bind:this={linkImg}
                        src="./assets/link.png"
                        onerror="this.onerror=null;this.src='{link.imgLink}';"
                        alt={link.name} />
            </div>
            <span style="font-size:0.75em;color:#ddd"> {link.name} </span>
      </a>
</div>
