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
      @media (max-width: 600px) {
            .quick {
                  overflow-x: scroll;
                  &::-webkit-scrollbar {
                        display: none;
                  }
                  img {
                        width: 25px;
                        height: 25px;
                        border-radius: 5px;
                  }
            }
      }
</style>

<div class="quick">
      <a href="https://{link.link}">
            <div>
                  <img
                        src="https://{link.imgLink}.png"
                        onerror="this.onerror=null;this.src='https://{link.imgLink}.png';"
                        alt={link.name} />
            </div>
            {link.name}
      </a>
</div>
