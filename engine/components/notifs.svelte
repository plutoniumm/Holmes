<script>
      $: notifs = [];
      $: count = 0;

      import Projects from "../micro/projects.svelte";

      if (window.Worker) {
            let w = new Worker("./core/thread.js");
            var msg = { func: "getTest" };
            w.postMessage(msg);
            w.onmessage = (e) => {
                  notifs = e.data.notifs;
                  count = e.data.count;
            };
      }
</script>

<style type="text/scss">
      ul {
            padding: 0;
            display: flex;
            list-style: none;
            overflow-x: scroll;
            .gitNotifs {
                  position: relative;
                  border: 1px solid transparent;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  transition: all 0.3s ease;
                  &:hover {
                        background: #111;
                        border: 1px solid #fff6;
                  }
                  .head {
                        display: flex;
                        justify-content: space-between;
                        padding-bottom: 1em;
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
      <Projects />
      {#each notifs as notif}
            <a href="{notif.owner}/{notif.repo}">
                  <li class="gitNotifs box">
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
      <li
            class="box"
            style="display:flex;justify-content:center;align-items:center;font-size:5.5em;">
            {count}
      </li>
</ul>
