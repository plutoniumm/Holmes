<script>
      import { ms } from "../core/micro";

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
            width: 86%;
            margin: 0 auto;
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
            }
      }
</style>

<section style="width:100%">
      <ul>
            {#each notifs as notif}
                  <a
                        href="{notif.repository.owner.html_url}/{notif.repository.name}">
                        <li class="gitNotifs">
                              <div>
                                    <div class="head">
                                          <span>{notif.repository.name}</span>
                                          <span
                                                style="text-transform:lowercase">{ms(new Date() - new Date(notif.updated_at))}</span>
                                    </div>
                                    <div class="body">
                                          {notif.subject.title}
                                    </div>
                              </div>
                              <div class="head" style="padding-top:1em">
                                    {notif.subject.type}
                              </div>
                        </li>
                  </a>
            {/each}
      </ul>
</section>
