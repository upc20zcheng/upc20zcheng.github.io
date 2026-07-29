import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(await readFile(resolve(root, "data/cv.json"), "utf8"));

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const publicationCitation = (publication, language) => {
  const suffix = language === "zh" ? "Zh" : "En";
  return `${esc(publication[`title${suffix}`])}[${publication.type}]. <cite>${esc(
    publication[`venue${suffix}`]
  )}</cite>, ${esc(publication[`details${suffix}`])}`;
};

const website = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="theme-color" content="#0b2434" />
  <title>${esc(data.meta.nameZh)}｜学术主页</title>
  <meta name="description" content="${esc(
    `${data.profile.basicZh}研究方向：${data.profile.researchZh.join("、")}。`
  )}" />
  <link rel="stylesheet" href="styles.css?v=20260730b" />
</head>
<body>
  <a class="skip-link" href="#main">跳到主要内容</a>
  <header class="site-header">
    <a class="brand" href="#top" aria-label="返回首页">
      <span class="brand-mark">CZ</span>
      <span>
        <strong>学术主页</strong>
        <small>Academic Profile</small>
      </span>
    </a>
    <nav class="site-nav" aria-label="主导航">
      <a href="#profile">简介</a>
      <a href="#publications">论文</a>
      <a href="#projects">项目</a>
      <a href="#awards">获奖</a>
      <a href="#contact">联系</a>
    </nav>
    <a class="header-download" href="chengzhen_teacher_profile_no_if.pdf" target="_blank" rel="noreferrer">
      中文简历 <span aria-hidden="true">↗</span>
    </a>
  </header>

  <main id="main">
    <section id="top" class="hero">
      <div class="hero-copy">
        <p class="eyebrow">${esc(data.meta.affiliationZh)}</p>
        <div class="hero-name">
          <h1>${esc(data.meta.nameZh)}</h1>
        </div>
        <p class="hero-lede">${esc(data.profile.heroZh)}</p>
        <div class="hero-actions" aria-label="简历下载">
          <a class="button button-primary" href="chengzhen_teacher_profile_no_if.pdf" target="_blank" rel="noreferrer">
            中文 PDF <span aria-hidden="true">↗</span>
          </a>
          <a class="button button-secondary" href="chengzhen_teacher_profile_en.pdf" target="_blank" rel="noreferrer">
            English PDF <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <figure class="portrait">
        <div class="portrait-frame">
          <img src="assets/profile-hd-20260426.png" alt="${esc(data.meta.nameZh)}职业照" width="742" height="1040" decoding="async" fetchpriority="high" />
        </div>
        <figcaption>Management · Accounting · Sustainability</figcaption>
      </figure>
      <div class="research-axis" aria-label="研究方向">
        <div class="research-axis-label">
          <strong>研究方向</strong>
          <span lang="en">Research Interests</span>
        </div>
        <ol>
          ${data.profile.researchZh
            .map(
              (item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span>${esc(item)}</li>`
            )
            .join("\n          ")}
        </ol>
      </div>
    </section>

    <section id="profile" class="content-section profile-section">
      <header class="section-heading">
        <p>Profile</p>
        <h2>个人简介</h2>
      </header>
      <div class="section-body profile-grid">
        <article class="profile-lead">
          <p>${esc(data.profile.publicationsSummaryZh)}</p>
          <p>${esc(data.profile.projectsSummaryZh)}</p>
        </article>
        <dl class="fact-list">
          <div>
            <dt>学术兼职</dt>
            <dd>${esc(data.profile.serviceZh)}</dd>
          </div>
          <div>
            <dt>研究生招生</dt>
            <dd>${esc(data.profile.recruitmentZh)}</dd>
          </div>
          <div>
            <dt>主要讲授课程</dt>
            <dd>${esc(data.profile.coursesZh)}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section id="publications" class="content-section">
      <header class="section-heading">
        <p>Selected work</p>
        <h2>代表性论文</h2>
      </header>
      <div class="section-body">
        <ol class="publication-list">
          ${data.publications
            .map(
              (publication, index) => `<li>
            <span class="pub-number">${String(index + 1).padStart(2, "0")}</span>
            <article>
              <div class="pub-meta">
                <time>${esc(publication.year)}</time>
                <span>${esc(publication.roleZh)}</span>
              </div>
              <p>${publicationCitation(publication, "zh")} <span class="journal-tier">（${esc(
                publication.ratingZh
              )}）</span></p>
            </article>
          </li>`
            )
            .join("\n          ")}
        </ol>
      </div>
    </section>

    <section id="projects" class="content-section">
      <header class="section-heading">
        <p>Research portfolio</p>
        <h2>科研项目</h2>
      </header>
      <div class="section-body project-columns">
        ${["主持", "参与"]
          .map(
            (role) => `<article class="project-group">
          <div class="project-group-title">
            <h3>${role === "主持" ? "主持项目" : "参与项目"}</h3>
            <span>${String(data.projects.filter((project) => project.roleZh === role).length).padStart(
              2,
              "0"
            )}</span>
          </div>
          <ol>
            ${data.projects
              .filter((project) => project.roleZh === role)
              .map(
                (project) => `<li>
              <p>${esc(project.nameZh)}</p>${project.code ? `\n              <small>${esc(project.code)}</small>` : ""}
            </li>`
              )
              .join("\n            ")}
          </ol>
        </article>`
          )
          .join("\n        ")}
      </div>
    </section>

    <section id="awards" class="content-section">
      <header class="section-heading">
        <p>Recognition</p>
        <h2>获奖情况</h2>
      </header>
      <div class="section-body award-list">
        ${data.awards
          .map(
            (award, index) => `<article>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <p>${esc(award.zh)}</p>
        </article>`
          )
          .join("\n        ")}
      </div>
    </section>

    <section id="contact" class="contact-section">
      <div>
        <p class="eyebrow">Contact &amp; CV Downloads</p>
        <h2>联系方式与<br />简历下载</h2>
      </div>
      <div class="contact-details">
        <a class="contact-email" href="mailto:${esc(data.meta.email)}">${esc(data.meta.email)}</a>
        <p>${esc(data.meta.addressZh)}</p>
        <div class="contact-downloads">
          <a href="chengzhen_teacher_profile_no_if.pdf" target="_blank" rel="noreferrer">下载中文简历 <span aria-hidden="true">↗</span></a>
          <a href="chengzhen_teacher_profile_en.pdf" target="_blank" rel="noreferrer">Download English CV <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <p>© ${new Date().getFullYear()} · Academic Profile</p>
    <a href="#top">返回顶部 ↑</a>
  </footer>
</body>
</html>
`;

const printRows = (language) => {
  const suffix = language === "zh" ? "Zh" : "En";
  const rows =
    language === "zh"
      ? [
          ["基本信息", data.profile.basicZh],
          ["研究方向", data.profile.researchZh.join("；")],
          ["项目主持及参与", data.profile.projectsSummaryZh],
          ["论文发表", data.profile.publicationsSummaryZh],
          ["学术兼职", data.profile.serviceZh],
          ["研究生招生", data.profile.recruitmentZh],
          ["主要讲授课程", data.profile.coursesZh]
        ]
      : [
          ["Profile", data.profile.basicEn],
          ["Research interests", data.profile.researchEn.join("; ")],
          ["Projects led and participated in", data.profile.projectsSummaryEn],
          ["Publications", data.profile.publicationsSummaryEn],
          ["Academic service", data.profile.serviceEn],
          ["Graduate recruitment", data.profile.recruitmentEn],
          ["Courses taught", data.profile.coursesEn]
        ];
  return rows
    .map(
      ([label, value]) => `<div class="cv-row">
          <dt>${esc(label)}</dt>
          <dd>${esc(value)}</dd>
        </div>`
    )
    .join("\n        ");
};

const printDocument = (language) => {
  const zh = language === "zh";
  const suffix = zh ? "Zh" : "En";
  const labels = zh
    ? {
        lang: "zh-CN",
        title: data.meta.titleZh,
        kicker: "教师简介",
        profile: "个人基本情况",
        publications: "代表性论文",
        projects: "主持 / 参与科研项目",
        awards: "获奖情况",
        contact: "联系方式"
      }
    : {
        lang: "en",
        title: data.meta.titleEn,
        kicker: "Curriculum Vitae",
        profile: "Profile",
        publications: "Representative Publications",
        projects: "Research Projects",
        awards: "Awards",
        contact: "Contact"
      };
  return `<!DOCTYPE html>
<html lang="${labels.lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(labels.title)}</title>
  <link rel="stylesheet" href="print.css" />
</head>
<body class="${zh ? "cv-zh" : "cv-en"}">
  <main class="cv">
    <header class="cv-header">
      <div>
        <p class="cv-kicker">${labels.kicker}</p>
        <h1>${esc(zh ? data.meta.nameZh : data.meta.nameEn)}</h1>
        <p class="cv-affiliation">${esc(zh ? data.meta.affiliationZh : data.meta.affiliationEn)}</p>
      </div>
      <address>
        <a href="mailto:${esc(data.meta.email)}">${esc(data.meta.email)}</a>
        <a href="${esc(data.meta.homepage)}">${esc(data.meta.homepage.replace("https://", ""))}</a>
        <span>${esc(zh ? data.meta.addressZh : data.meta.addressEn)}</span>
      </address>
    </header>

    <section class="cv-section">
      <h2><span>01</span>${labels.profile}</h2>
      <dl class="cv-facts">
        ${printRows(language)}
      </dl>
    </section>

    <section class="cv-section">
      <h2><span>02</span>${labels.publications}</h2>
      <ol class="cv-publications">
        ${data.publications
          .map(
            (publication) => `<li>
          <div class="cv-pub-meta">
            <time>${esc(publication.year)}</time>
            <span>${esc(publication[`role${suffix}`])}</span>
          </div>
          <p>${publicationCitation(publication, language)} <strong>(${esc(
            publication[`rating${suffix}`]
          )})</strong></p>
        </li>`
          )
          .join("\n        ")}
      </ol>
    </section>

    <section class="cv-section">
      <h2><span>03</span>${labels.projects}</h2>
      <ol class="cv-projects">
        ${data.projects
          .map(
            (project) => `<li>
          <p>${esc(project[`name${suffix}`])}</p>
          <span>${project.code ? esc(project.code) : "—"}</span>
          <strong>${esc(project[`role${suffix}`])}</strong>
        </li>`
          )
          .join("\n        ")}
      </ol>
    </section>

    <section class="cv-section">
      <h2><span>04</span>${labels.awards}</h2>
      <ol class="cv-awards">
        ${data.awards.map((award) => `<li>${esc(award[language])}</li>`).join("\n        ")}
      </ol>
    </section>

    <section class="cv-section cv-contact">
      <h2><span>05</span>${labels.contact}</h2>
      <div>
        <a href="mailto:${esc(data.meta.email)}">${esc(data.meta.email)}</a>
        <p>${esc(zh ? data.meta.addressZh : data.meta.addressEn)}</p>
      </div>
    </section>
  </main>
</body>
</html>`;
};

await mkdir(resolve(root, "cv"), { recursive: true });
await writeFile(resolve(root, "index.html"), website, "utf8");
await writeFile(resolve(root, "cv/cv-cn.html"), printDocument("zh"), "utf8");
await writeFile(resolve(root, "cv/cv-en.html"), printDocument("en"), "utf8");

console.log("Built index.html and bilingual CV print sources from data/cv.json.");
