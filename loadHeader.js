console.log("script:", document.currentScript.src);
console.log("header:", new URL("header.html", new URL(".", document.currentScript.src)));

//finding url of current script, "root", so I can load everything relative to here.
const root = new URL(".", document.currentScript.src);

//creating header div for convenience
const header = document.createElement("div");
header.id = "header";
document.body.prepend(header);

fetch(new URL("header.html", root))
  .then(r => r.text())
  .then(html => {
      header.innerHTML = html;
      const current = window.location.pathname;

      //updating links in header.html to be relative to "root"
      header.querySelectorAll("a").forEach(link => {
          link.href = new URL(
              link.getAttribute("href"),
              root
          );
      });

      //changing style and clickability of link leading to current
      // page (the one that called loadHeader.js)
      header.querySelectorAll("a").forEach(link => {
          if (link.pathname === current) {
              link.classList.add("current");
              link.removeAttribute("href");
          }
      });
  });