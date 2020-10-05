<script>
      export let link;

      let linkImg;

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
                        linkImg.src =
                              "https://static.toiimg.com/photo/72975551.cms";
                  }
            })
            .catch((e) => console.log(e));
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
                        onerror="this.onerror=null;this.src='https://static.toiimg.com/photo/72975551.cms';"
                        alt={link.name} />
            </div>
            {link.name}
      </a>
</div>
