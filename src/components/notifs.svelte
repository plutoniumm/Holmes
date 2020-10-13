<script>
      $: notifs = [];

      if (window.Worker) {
            let w = new Worker("./core/thread.js");
            var msg = { func: "getTest" };
            w.postMessage(msg);
            w.onmessage = (e) => (notifs = e.data);
      }
</script>

<style type="text/scss">
      ul {
            padding: 0;
            display: flex;
            list-style: none;
            overflow-x: scroll;
            &::-webkit-scrollbar {
                  display: none;
            }
            .gitNotifs {
                  min-width: 200px;
                  width: 200px;
                  height: 100px;
                  position: relative;
                  background: #1118;
                  border: 1px solid transparent;
                  border-radius: 15px;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  padding: 1em;
                  margin: 0 0.5em;
                  transition: all 0.3s ease;
                  &:hover {
                        background: #111;
                        border: 1px solid #fff6;
                  }
                  .head {
                        display: flex;
                        justify-content: space-between;
                        padding-bottom: 0.75em;
                        text-transform: uppercase;
                        font-size: 0.75em;
                        color: #bbb;
                  }
                  .body {
                        position: relative;
                        top: -7px;
                        line-height: 1.33em;
                  }
            }
      }
</style>

<ul>
      {#each notifs as notif}
            <a href="{notif.owner}/{notif.repo}">
                  <li class="gitNotifs">
                        <div>
                              <div class="head">
                                    <span>{notif.repo}</span>
                                    <span
                                          style="text-transform:lowercase">{notif.updated_at}</span>
                              </div>
                              <div class="body">{notif.title}</div>
                        </div>
                        <div class="head" style="position:absolute;bottom:0;">
                              {notif.type}
                        </div>
                  </li>
            </a>
      {/each}
</ul>
