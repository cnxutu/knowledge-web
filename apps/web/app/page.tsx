import Link from "next/link";
import { listArticles } from "@/lib/content";

const navItems = [
  ["首页", "#top"],
  ["知识流", "#knowledge"],
  ["关于我", "#about"]
] as const;

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="icon icon-arrow">
      <path d="M3.5 12.5 12 4m0 0H5.5M12 4v6.5" />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="sparkle">
      <path d="m12 2 1.35 7.65L21 11l-7.65 1.35L12 20l-1.35-7.65L3 11l7.65-1.35L12 2Z" />
    </svg>
  );
}

export default async function HomePage() {
  const articles = await listArticles();
  const featured = articles[0];
  const newest = articles.slice(1);

  return (
    <main id="top" className="home-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="site-nav page-width">
        <Link href="#top" className="brand-mark" aria-label="Knowledge Web 首页">
          <span className="brand-symbol">K</span>
          <span>knowledge<span className="brand-dot">.</span>web</span>
        </Link>
        <nav className="nav-links" aria-label="主导航">
          {navItems.map(([label, href], index) => (
            <a key={label} href={href} className={index === 0 ? "active" : ""}>{label}</a>
          ))}
        </nav>
        <Link href="/search" className="nav-cta">
          <span>搜索知识</span><span className="command-key">⌘ K</span>
        </Link>
      </header>

      <section className="hero page-width" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="status-pill"><span className="status-dot" /> Personal knowledge system <span className="status-cn">· 持续生长中</span></div>
          <h1 id="hero-title">把好奇心，<br /><em>编译</em>成知识。</h1>
          <p className="hero-intro">这里记录我在产品、工程和日常思考里的探索轨迹。<br />不追求完整，只在意每一次连接都值得。</p>
          <div className="hero-actions">
            <a href="#knowledge" className="primary-action">探索知识流 <ArrowUpRight /></a>
            <Link href="/workspace" className="subtle-action"><span className="play-icon">▶</span> 今日工作区</Link>
          </div>
          <div className="hero-footnote"><span className="scroll-line" /> 向下探索 <span className="footnote-muted">01 / 04</span></div>
        </div>

        <div className="hero-visual" aria-label="知识网络可视化装饰">
          <div className="orbit orbit-large" /><div className="orbit orbit-small" />
          <div className="visual-grid" />
          <div className="node node-main"><span className="node-core">K</span><span className="node-label">KNOWLEDGE<br /><strong>系统中枢</strong></span></div>
          <div className="node node-a"><span className="mini-node violet">⌁</span><span>Ideas</span></div>
          <div className="node node-b"><span className="mini-node orange">&lt;/&gt;</span><span>Build</span></div>
          <div className="node node-c"><span className="mini-node blue">✦</span><span>Explore</span></div>
          <span className="connector connector-a" /><span className="connector connector-b" /><span className="connector connector-c" />
          <span className="visual-caption">/ 01 — CURRENT FOCUS</span>
          <span className="visual-coordinate">31.2304° N<br />121.4737° E</span>
        </div>
      </section>

      <section className="signal-strip page-width" aria-label="知识库统计">
        <div><span className="signal-label">总知识条目</span><strong>24</strong></div>
        <div><span className="signal-label">已连接概念</span><strong>86</strong></div>
        <div><span className="signal-label">最近更新</span><strong>今天</strong></div>
        <div className="signal-note"><Sparkle /> <span>学习是一种<br /><b>长期主义的浪漫</b></span></div>
      </section>

      <section id="knowledge" className="content-section page-width">
        <div className="section-topline"><div><p className="section-kicker">02 / KNOWLEDGE STREAM</p><h2>最近在思考什么</h2></div><Link href="/search" className="view-all">查看全部 <ArrowUpRight /></Link></div>
        <div className="knowledge-layout">
          <div className="article-stack">
            {featured && <Link href={`/articles/${featured.meta.slug}`} className="featured-card reveal-card">
              <div className="card-top"><span className="topic-tag"><span className="tag-dot" /> FEATURED NOTE</span><span className="card-date">2026.06.19</span></div>
              <div className="featured-content"><div><h3>{featured.meta.title}</h3><p>{featured.meta.summary}</p></div><span className="card-arrow"><ArrowUpRight /></span></div>
              <div className="card-bottom"><span>{featured.meta.tags.map((tag) => `#${tag}`).join("  ")}</span><span>阅读文章 →</span></div>
            </Link>}
            {newest.map((article, index) => <Link key={article.meta.slug} href={`/articles/${article.meta.slug}`} className="article-row reveal-card">
              <span className={`row-index row-index-${index + 1}`}>0{index + 2}</span><div className="row-main"><span className="row-category">{article.meta.categoryPath[1] ?? "KNOWLEDGE"}</span><h3>{article.meta.title}</h3><p>{article.meta.summary}</p></div><span className="row-arrow"><ArrowUpRight /></span>
            </Link>)}
          </div>
          <aside id="about" className="about-card">
            <div className="avatar-mark">R<span>✦</span></div><p className="section-kicker">ABOUT THE BUILDER</p><h3>你好，我是<br /><span>Richtu。</span></h3><p className="about-copy">一个在代码和设计之间来回穿梭的人。正在把碎片化的输入，整理成可以反复使用的系统。</p><div className="about-line" /><div className="about-meta"><span>BASE IN</span><b>Shanghai / CN</b></div><div className="about-meta"><span>NOW LEARNING</span><b>Systems thinking</b></div><Link href="/workspace/articles/new" className="about-link">写下一条笔记 <ArrowUpRight /></Link>
          </aside>
        </div>
      </section>

      <footer className="site-footer page-width"><span>© 2026 KNOWLEDGE.WEB</span><span>BUILT WITH CURIOSITY <span className="footer-heart">♥</span></span><Link href="/workspace">OPEN WORKSPACE <ArrowUpRight /></Link></footer>
    </main>
  );
}
