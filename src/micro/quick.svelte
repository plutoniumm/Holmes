<script>
      export let link;
</script>

<style type="text/scss">
      .quick {
            margin: 0.25em 0.75em;
            font-size: 0.75em;
            img {
                  width: 75px;
                  height: 75px;
                  object-fit: contain;
                  border-radius: 15px;
                  transition: transform 0.3s ease;
            }
            a {
                  text-decoration: none;
                  color: #ddd;
            }
            &:hover {
                  img {
                        transform: scale(1.1);
                  }
            }
      }
</style>

<div class="quick">
      <a href={link.link}>
            <div>
                  <img
                        src="https://{link.imgLink}"
                        onerror="this.onerror=null;this.src='https://{link.imgLink}';"
                        alt={link.name} />
            </div>
            {link.name}
      </a>
</div>
