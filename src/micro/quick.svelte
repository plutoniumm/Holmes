<script>
      export let link;

      let linkImg;
      const fallback = "./assets/link.png";

      var favi = link.link
            .replace("https://", "")
            .replace("http://", "")
            .replace("www.", "")
            .split("/")[0];
      fetch("http://favicongrabber.com/api/grab/" + favi)
            .then((r) => r.json())
            .then((fi) => {
                  if (fi) {
                        linkImg.src = fi.icons[fi.icons.length - 1].src;
                  } else {
                        linkImg.src = fallback;
                  }
            })
            .catch((e) => (linkImg.src = fallback));
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
                        src=""
                        onerror="this.onerror=null;this.src='./assets/link.png';"
                        alt={link.name} />
            </div>
            <span style="font-size:0.75em;color:#ddd"> {link.name} </span>
      </a>
</div>
