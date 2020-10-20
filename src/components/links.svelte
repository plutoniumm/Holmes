<script>
      const data = [
            {
                  name: "DigialOcean",
                  link: "https://cloud.digitalocean.com/login",
                  imgLink:
                        "cdn4.iconfinder.com/data/icons/logos-and-brands/512/89_Digital_Ocean_logo_logos-512.png",
            },
            {
                  name: "FontAwesome",
                  link: "https://fontawesome.com/icons?d=gallery&m=free",
                  imgLink:
                        "fontawesome.com/images/favicons/apple-icon-180x180.png",
            },
            {
                  name: "Firebase",
                  link: "http://console.firebase.google.com/",
                  imgLink:
                        "gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_96dp.png",
            },
            {
                  name: "GMeet",
                  link: "http://meet.google.com/",
                  imgLink:
                        "fonts.gstatic.com/s/i/productlogos/meet_2020q4/v1/web-96dp/logo_meet_2020q4_color_1x_web_96dp.png",
            },
            {
                  name: "GoDaddy",
                  link:
                        "https://sso.godaddy.com/?realm=idp&path=%2Fproducts&app=account",
                  imgLink: "img6.wsimg.com/ux/favicon/favicon-96x96.png",
            },
            {
                  name: "CodePen",
                  link: "https://codepen.io",
                  imgLink:
                        "static.codepen.io/assets/favicon/favicon-touch-de50acbf5d634ec6791894eba4ba9cf490f709b3d742597c6fc4b734e6492a5a.png",
            },
      ];
      import Quick from "../micro/quick.svelte";
</script>

<style>
      .links,
      .quickCont {
            display: flex;
            justify-content: center;
            align-items: center;
            word-wrap: break-word;
            text-align: center;
      }
      .links {
            backdrop-filter: blur(16px) grayscale(100%);
            -moz-backdrop-filter: blur(16px) grayscale(100%);
            -webkit-backdrop-filter: blur(16px) grayscale(100%);
            position: fixed;
            bottom: 0.5em;
      }
</style>

<section class="links" style="width:100%">
      <div class="quickCont" style="width:80%;">
            {#each data as link}
                  <Quick {link} />
            {/each}
      </div>
</section>
