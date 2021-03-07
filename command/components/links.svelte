<script>
      import links from "../../config/links.json";
</script>

<section class="links w-100 flex">
      {#each links as link}
            <div class="quick blurW">
                  <a href={link.link}>
                        <div>
                              <img
                                    src="https://{link.imgLink}"
                                    alt={link.name}
                              />
                        </div>
                        {link.name}
                  </a>
            </div>
      {/each}
</section>

<style type="text/scss">
      .links {
            justify-content: center;
            align-items: center;
            word-wrap: break-word;
            text-align: center;
      }
      .quick {
            width: 90px;
            height: 100px;
            border-radius: 10px;
            background: #6666;
            margin: 0.25em 0.75em;
            padding: 0.5em 1.25em;
            img {
                  width: 75px;
                  height: 75px;
                  object-fit: contain;
                  border-radius: 15px;
            }
            a {
                  text-decoration: none;
                  color: #ddd;
            }
            transition: transform 0.3s ease;
            &:hover {
                  transform: scale(1.1);
            }
      }
</style>
