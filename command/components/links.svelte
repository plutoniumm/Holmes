<script>
      import data from "../../config/links.json";
</script>

<section class="links flex">
      {#each data as link}
            <div class="quick">
                  <a href={link.link}>
                        <div>
                              <img
                                    src="https://{link.imgLink}.png"
                                    onerror="this.onerror=null;this.src='https://{link.imgLink}';"
                                    alt={link.name}
                              />
                        </div>
                        {link.name}
                  </a>
            </div>
      {/each}
      <div class="quick flex-col" style="justify-content:space-between;">
            {#each ["DEBUG", "SOCIAL", "TASKS"] as loc}
                  <a href="/{loc}.html">
                        {loc}
                        <hr />
                  </a>
            {/each}
      </div>
</section>

<style type="text/scss">
      .links {
            justify-content: center;
            align-items: center;
            word-wrap: break-word;
            text-align: center;
      }
      .links {
            position: fixed;
            bottom: 1em;
            width: 100%;
      }
      .quick {
            width: 90px;
            height: 100px;
            border-radius: 10px;
            background: #6666;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
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
                  &:hover {
                        transform: scale(1.1);
                  }
            }
            transition: transform 0.3s ease;
            &:not(:last-child):hover {
                  transform: scale(1.1);
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
      @media (max-width: 768px) {
            .links {
                  flex-wrap: wrap;
            }
      }
</style>
