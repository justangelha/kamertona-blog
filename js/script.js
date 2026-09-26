(function () {
  "use strict";

  const articles = window.ARTICLES || [];
  const favoriteKey = "kamertona-favorites";
  const themeKey = "kamertona-theme";

  const icons = {
    search:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<circle cx="11" cy="11" r="6.8"></circle>' +
      '<path d="m16 16 4.2 4.2"></path>' +
      "</svg>",
    moon:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M20 15.6A8.5 8.5 0 0 1 8.4 4a8.5 8.5 0 1 0 11.6 11.6Z"></path>' +
      "</svg>",
    sun:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="4"></circle>' +
      '<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4' +
      'M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>' +
      "</svg>",
    heart:
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1' +
      'a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z"></path>' +
      "</svg>",
    arrow:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"></path></svg>',
  };

  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(favoriteKey)) || [];
    } catch (_) {
      return [];
    }
  }

  function setFavorites(ids) {
    localStorage.setItem(favoriteKey, JSON.stringify(ids));
    updateFavoriteCounters();
  }

  function isFavorite(id) {
    return getFavorites().includes(id);
  }

  function toggleFavorite(id) {
    const ids = getFavorites();
    const added = !ids.includes(id);
    const next = added ? [...ids, id] : ids.filter((item) => item !== id);
    setFavorites(next);
    document.querySelectorAll('[data-favorite="' + id + '"]').forEach((button) => {
      button.classList.toggle("is-active", added);
      button.setAttribute("aria-pressed", String(added));
      button.setAttribute("aria-label", added ? "Удалить из избранного" : "Добавить в избранное");
    });
    showToast(added ? "Материал добавлен в избранное" : "Материал удалён из избранного");
    if (document.body.dataset.page === "favorites") renderFavorites();
  }

  function headerMarkup() {
    return `
      <a class="skip-link" href="#main">Перейти к содержанию</a>
      <header class="site-header">
        <div class="header-top container">
          <a class="brand" href="index.html" aria-label="Камертона — на главную">
            <span class="brand-mark" aria-hidden="true">𝄞</span>
            <span><strong>Камертона</strong><small>блог о музыке как увлечении</small></span>
          </a>
          <div class="header-actions">
            <a class="icon-button" href="search.html" aria-label="Поиск">${icons.search}</a>
            <a
              class="icon-button favorites-link"
              href="favorites.html"
              aria-label="Избранные материалы"
            >
              ${icons.heart}
              <span class="favorite-count" aria-label="Количество избранных">0</span>
            </a>
            <button
              class="icon-button theme-toggle"
              type="button"
              aria-label="Переключить тему"
            >
              ${icons.moon}
            </button>
            <button
              class="menu-toggle"
              type="button"
              aria-label="Открыть меню"
              aria-expanded="false"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
        <nav class="main-nav" aria-label="Основная навигация">
          <div class="container nav-inner">
            <a href="index.html" data-nav="home">Главная</a>
            <div class="nav-group">
              <a href="catalog.html" data-nav="catalog">Каталог <span aria-hidden="true">⌄</span></a>
              <div class="mega-menu">
                <div>
                  <strong>Обучение</strong>
                  <a href="catalog.html?category=Фортепиано">Фортепиано</a>
                  <a href="catalog.html?category=Скрипка">Скрипка</a>
                  <a href="catalog.html?category=Теория%20музыки">Теория музыки</a>
                </div>
                <div>
                  <strong>Чтение</strong>
                  <a href="catalog.html?category=Статьи">Статьи</a>
                  <a href="catalog.html?category=Подборки">Подборки</a>
                  <a href="catalog.html?category=Статьи&sub=Советы%20начинающим">
                    Советы начинающим
                  </a>
                </div>
                <div class="menu-note">
                  <span>Новая тема</span>
                  <b>Как заниматься по 20 минут и слышать результат</b>
                  <a href="article.html?id=piano-from-zero">
                    Читать материал ${icons.arrow}
                  </a>
                </div>
              </div>
            </div>
            <a href="about.html" data-nav="about">О блоге</a>
            <a
              href="catalog.html?category=Статьи&sub=Советы%20начинающим"
              data-nav="useful"
            >
              Полезное
            </a>
            <a href="contacts.html" data-nav="contacts">Контакты</a>
          </div>
        </nav>
      </header>`;
  }

  function footerMarkup() {
    return `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div>
            <a class="brand footer-brand" href="index.html">
              <span class="brand-mark">𝄞</span>
              <span>
                <strong>Камертона</strong>
                <small>слушать внимательнее</small>
              </span>
            </a>
            <p>Тихое место о практике, теории и музыке, к которой хочется возвращаться.</p>
          </div>
          <div>
            <h2>Разделы</h2>
            <a href="catalog.html?category=Фортепиано">Фортепиано</a>
            <a href="catalog.html?category=Скрипка">Скрипка</a>
            <a href="catalog.html?category=Теория%20музыки">Теория музыки</a>
            <a href="catalog.html?category=Подборки">Подборки</a>
          </div>
          <div>
            <h2>О проекте</h2>
            <a href="about.html">О блоге</a>
            <a href="contacts.html">Контакты</a>
            <a href="search.html">Поиск</a>
            <a href="favorites.html">Избранное</a>
          </div>
          <div>
            <h2>Письмо раз в месяц</h2>
            <p>Одна пьеса, один полезный приём и история для внимательного слушания.</p>
            <form class="subscribe-form" data-demo-form>
              <label class="sr-only" for="footer-email">Ваш email</label>
              <input id="footer-email" type="email" placeholder="name@example.ru" required>
              <button type="submit" aria-label="Подписаться">${icons.arrow}</button>
            </form>
          </div>
        </div>
        <div class="container footer-bottom">
          <span>© 2026 Камертона</span>
          <span>Учебный проект</span>
          <button class="text-button theme-toggle-footer" type="button">Сменить тему</button>
        </div>
      </footer>
      <button class="back-to-top" type="button" aria-label="Наверх">↑</button>
      <div class="toast" role="status" aria-live="polite"></div>`;
  }

  function injectShell() {
    const header = document.querySelector("[data-site-header]");
    const footer = document.querySelector("[data-site-footer]");
    if (header) header.innerHTML = headerMarkup();
    if (footer) footer.innerHTML = footerMarkup();
  }

  function articleUrl(article) {
    return "article.html?id=" + encodeURIComponent(article.id);
  }

  function cardMarkup(article, options = {}) {
    const compact = options.compact ? " card--compact" : "";
    const articleNumber = String(articles.indexOf(article) + 1).padStart(2, "0");
    const categoryUrl = encodeURIComponent(article.category);
    const favoriteClass = isFavorite(article.id) ? " is-active" : "";
    const favoriteLabel = isFavorite(article.id) ? "Удалить из избранного" : "Добавить в избранное";

    return `<article
      class="article-card${compact}"
      data-category="${article.category}"
    >
      <a class="card-image" href="${articleUrl(article)}">
        <img
          src="${article.image}"
          alt="${article.imageAlt}"
          loading="lazy"
        >
        <span class="image-number">${articleNumber}</span>
      </a>
      <div class="card-body">
        <div class="card-meta">
          <a href="catalog.html?category=${categoryUrl}">${article.category}</a>
          <span>${article.readTime}</span>
        </div>
        <h3>
          <a href="${articleUrl(article)}">${article.title}</a>
        </h3>
        ${options.compact ? "" : `<p>${article.excerpt}</p>`}
        <div class="card-footer">
          <time datetime="${article.isoDate}">${article.date}</time>
          <button
            class="favorite-button${favoriteClass}"
            type="button"
            data-favorite="${article.id}"
            aria-pressed="${isFavorite(article.id)}"
            aria-label="${favoriteLabel}"
          >
            ${icons.heart}
          </button>
        </div>
      </div>
    </article>`;
  }

  function renderHome() {
    if (document.body.dataset.page !== "home") return;
    const featured = articles.find((item) => item.featured) || articles[0];
    const featuredEl = document.querySelector("[data-featured]");
    if (featuredEl) {
      featuredEl.innerHTML = `
        <article class="featured-story">
          <a class="featured-image" href="${articleUrl(featured)}">
            <img src="${featured.image}" alt="${featured.imageAlt}">
          </a>
          <div class="featured-copy">
            <div class="eyebrow">Выбор редакции · ${featured.category}</div>
            <h2>
              <a href="${articleUrl(featured)}">${featured.title}</a>
            </h2>
            <p>${featured.excerpt}</p>
            <div class="story-meta">
              <time datetime="${featured.isoDate}">${featured.date}</time>
              <span>${featured.readTime} чтения</span>
            </div>
            <a class="arrow-link" href="${articleUrl(featured)}">
              Читать статью ${icons.arrow}
            </a>
          </div>
        </article>`;
    }
    fillGrid("popular", articles.filter((a) => a.popular).slice(0, 4));
    fillGrid("piano", articles.filter((a) => a.category === "Фортепиано").slice(0, 3));
    fillGrid("violin", articles.filter((a) => a.category === "Скрипка").slice(0, 3));
    fillGrid("theory", articles.filter((a) => a.category === "Теория музыки").slice(0, 3));
    fillGrid("collections", articles.filter((a) => a.category === "Подборки").slice(0, 3));
    fillGrid("latest", articles.slice(0, 6), true);
  }

  function fillGrid(name, items, compact) {
    const el = document.querySelector(`[data-grid="${name}"]`);
    if (el) el.innerHTML = items.map((item) => cardMarkup(item, { compact })).join("");
  }

  function renderCatalog() {
    if (document.body.dataset.page !== "catalog") return;
    const grid = document.querySelector("[data-catalog-grid]");
    const count = document.querySelector("[data-catalog-count]");
    const empty = document.querySelector("[data-catalog-empty]");
    const params = new URLSearchParams(location.search);
    let active = params.get("category") || "Все";
    const sub = params.get("sub");
    const allowed = ["Все", "Фортепиано", "Скрипка", "Теория музыки", "Статьи", "Подборки"];
    if (!allowed.includes(active)) active = "Все";

    function apply(category) {
      active = category;
      const filtered = articles.filter(
        (article) =>
          (category === "Все" || article.category === category) &&
          (!sub || article.subcategory === sub),
      );
      grid.innerHTML = filtered.map((item) => cardMarkup(item)).join("");
      count.textContent = `${filtered.length} ${pluralize(filtered.length, ["материал", "материала", "материалов"])}`;
      empty.hidden = filtered.length !== 0;
      document.querySelectorAll("[data-filter]").forEach((btn) => {
        const selected = btn.dataset.filter === category;
        btn.classList.toggle("is-active", selected);
        btn.setAttribute("aria-pressed", String(selected));
      });
      const heading = document.querySelector("[data-catalog-heading]");
      if (heading) heading.textContent = sub || (category === "Все" ? "Все материалы" : category);
    }
    document
      .querySelectorAll("[data-filter]")
      .forEach((btn) => btn.addEventListener("click", () => apply(btn.dataset.filter)));
    apply(active);
  }

  function normalize(value) {
    return value.toLocaleLowerCase("ru-RU").replace(/ё/g, "е").trim();
  }

  function renderSearch() {
    if (document.body.dataset.page !== "search") return;
    const input = document.querySelector("[data-search-input]");
    const grid = document.querySelector("[data-search-results]");
    const status = document.querySelector("[data-search-status]");
    const clear = document.querySelector("[data-search-clear]");
    const initial = new URLSearchParams(location.search).get("q") || "";
    input.value = initial;

    function search() {
      const query = normalize(input.value);
      const found =
        query.length < 2
          ? []
          : articles.filter((article) =>
              normalize(
                [
                  article.title,
                  article.category,
                  article.subcategory,
                  article.excerpt,
                  ...article.keywords,
                ].join(" "),
              ).includes(query),
            );
      if (!query) {
        status.innerHTML = `
          Введите название, тему или ключевое слово — например,
          <button type="button" data-suggestion="ритм">ритм</button>
          или
          <button type="button" data-suggestion="скрипка">скрипка</button>.
        `;
        grid.innerHTML = "";
      } else if (query.length < 2) {
        status.textContent = "Введите не меньше двух символов.";
        grid.innerHTML = "";
      } else {
        status.textContent = found.length
          ? `Найдено: ${found.length}`
          : "Ничего не найдено. Попробуйте более общее слово.";
        grid.innerHTML = found.map((item) => cardMarkup(item)).join("");
      }
      clear.hidden = !input.value;
      status.querySelectorAll("[data-suggestion]").forEach((btn) =>
        btn.addEventListener("click", () => {
          input.value = btn.dataset.suggestion;
          search();
        }),
      );
    }
    input.addEventListener("input", search);
    clear.addEventListener("click", () => {
      input.value = "";
      input.focus();
      search();
    });
    search();
  }

  function renderFavorites() {
    if (document.body.dataset.page !== "favorites") return;
    const ids = getFavorites();
    const selected = ids.map((id) => articles.find((item) => item.id === id)).filter(Boolean);
    const grid = document.querySelector("[data-favorites-grid]");
    const empty = document.querySelector("[data-favorites-empty]");
    grid.innerHTML = selected.map((item) => cardMarkup(item)).join("");
    empty.hidden = selected.length > 0;
    const count = document.querySelector("[data-favorites-count]");
    if (count)
      count.textContent = `${selected.length} ${pluralize(selected.length, ["материал", "материала", "материалов"])}`;
  }

  function renderArticle() {
    if (document.body.dataset.page !== "article") return;
    const id = new URLSearchParams(location.search).get("id");
    const article = articles.find((item) => item.id === id) || articles[0];
    const index = articles.indexOf(article);
    const prev = articles[(index - 1 + articles.length) % articles.length];
    const next = articles[(index + 1) % articles.length];
    const related = articles
      .filter((item) => item.id !== article.id && item.category === article.category)
      .slice(0, 3);
    const root = document.querySelector("[data-article]");
    const categoryUrl = encodeURIComponent(article.category);
    const favoriteClass = isFavorite(article.id) ? " is-active" : "";
    const favoriteText = isFavorite(article.id) ? "В избранном" : "Сохранить";
    const recommendations = related.length ? related : articles.slice(0, 3);
    const contentsMarkup = article.sections
      .map(
        (section, sectionIndex) => `
          <a href="#section-${sectionIndex + 1}">${section.heading}</a>
        `,
      )
      .join("");
    const sectionsMarkup = article.sections
      .map(
        (section, sectionIndex) => `
          <section id="section-${sectionIndex + 1}">
            <h2>${section.heading}</h2>
            ${section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
            ${sectionIndex === 0 ? `<blockquote>${article.quote}</blockquote>` : ""}
          </section>
        `,
      )
      .join("");
    const tipsMarkup = article.tips.map((tip) => `<li>${tip}</li>`).join("");
    const relatedMarkup = recommendations.map((item) => cardMarkup(item)).join("");

    root.innerHTML = `
      <nav class="breadcrumbs container" aria-label="Хлебные крошки">
        <a href="index.html">Главная</a>
        <span>/</span>
        <a href="catalog.html?category=${categoryUrl}">${article.category}</a>
        <span>/</span>
        <span aria-current="page">${article.title}</span>
      </nav>
      <article class="article-page">
        <header class="article-hero container">
          <a class="eyebrow" href="catalog.html?category=${categoryUrl}">
            ${article.category} · ${article.subcategory}
          </a>
          <h1>${article.title}</h1>
          <p class="article-deck">${article.excerpt}</p>
          <div class="article-meta">
            <time datetime="${article.isoDate}">${article.date}</time>
            <span>${article.readTime} чтения</span>
            <button
              class="save-text${favoriteClass}"
              type="button"
              data-favorite="${article.id}"
              aria-pressed="${isFavorite(article.id)}"
            >
              ${icons.heart}
              <span>${favoriteText}</span>
            </button>
          </div>
        </header>
        <figure class="article-cover container-wide">
          <img src="${article.image}" alt="${article.imageAlt}">
          <figcaption>${article.imageAlt}. Иллюстрация редакции.</figcaption>
        </figure>
        <div class="article-layout container">
          <aside class="article-aside">
            <span>В материале</span>
            ${contentsMarkup}
          </aside>
          <div class="article-content">
            ${sectionsMarkup}
            <section class="tips-box">
              <span class="eyebrow">Коротко</span>
              <h2>Что взять в практику</h2>
              <ul>${tipsMarkup}</ul>
            </section>
          </div>
        </div>
      </article>
      <nav class="article-navigation container" aria-label="Соседние публикации">
        <a href="${articleUrl(prev)}">
          <span>← Предыдущая</span>
          <strong>${prev.title}</strong>
        </a>
        <a href="${articleUrl(next)}">
          <span>Следующая →</span>
          <strong>${next.title}</strong>
        </a>
      </nav>
      <section class="section container">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Продолжить чтение</span>
            <h2>Похожие материалы</h2>
          </div>
          <a class="arrow-link" href="catalog.html?category=${categoryUrl}">
            Весь раздел ${icons.arrow}
          </a>
        </div>
        <div class="card-grid">${relatedMarkup}</div>
      </section>`;
    document.title = `${article.title} — Камертона`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = article.excerpt;
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description: article.excerpt,
      datePublished: article.isoDate,
      image: article.image,
      author: { "@type": "Person", name: "Ангелина" },
      publisher: { "@type": "Organization", name: "Камертона" },
      articleSection: article.category,
      keywords: article.keywords.join(", "),
    });
    document.head.appendChild(schema);
  }

  function pluralize(number, forms) {
    const n = Math.abs(number) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
  }

  let toastTimer;
  function showToast(message) {
    const toast = document.querySelector(".toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(themeKey, theme);
    document.querySelectorAll(".theme-toggle").forEach((button) => {
      button.innerHTML = theme === "dark" ? icons.sun : icons.moon;
      button.setAttribute(
        "aria-label",
        theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему",
      );
    });
  }

  function updateFavoriteCounters() {
    const count = getFavorites().length;
    document.querySelectorAll(".favorite-count").forEach((el) => {
      el.textContent = count;
      el.hidden = count === 0;
    });
  }

  function bindGlobalEvents() {
    document.addEventListener("click", (event) => {
      const favorite = event.target.closest("[data-favorite]");
      if (favorite) {
        event.preventDefault();
        toggleFavorite(favorite.dataset.favorite);
      }
    });

    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");
    if (menuToggle && nav)
      menuToggle.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        menuToggle.classList.toggle("is-open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
        document.body.classList.toggle("menu-open", open);
      });

    document
      .querySelectorAll(".theme-toggle, .theme-toggle-footer")
      .forEach((button) =>
        button.addEventListener("click", () =>
          setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"),
        ),
      );
    setTheme(
      localStorage.getItem(themeKey) ||
        (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
    );

    const back = document.querySelector(".back-to-top");
    if (back) {
      addEventListener("scroll", () => back.classList.toggle("is-visible", scrollY > 600), {
        passive: true,
      });
      back.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
    }

    document.querySelectorAll("[data-demo-form]").forEach((form) =>
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.classList.contains("contact-form"))
          localStorage.setItem("kamertona-newsletter-demo", "subscribed");
        form.reset();
        showToast(
          form.classList.contains("contact-form")
            ? "Спасибо! Сообщение сохранено в демонстрационном режиме."
            : "Демонстрационная подписка сохранена локально",
        );
      }),
    );

    const page = document.body.dataset.page;
    const activeKey =
      page === "article" || page === "favorites" || page === "search" ? "catalog" : page;
    const active = document.querySelector(`[data-nav="${activeKey}"]`);
    if (active) {
      active.classList.add("is-active");
      active.setAttribute("aria-current", "page");
    }
    updateFavoriteCounters();
  }

  injectShell();
  renderHome();
  renderCatalog();
  renderSearch();
  renderFavorites();
  renderArticle();
  bindGlobalEvents();
})();
