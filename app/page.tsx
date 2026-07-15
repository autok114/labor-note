"use client";

import { useEffect, useMemo, useState } from "react";

type ContentKind = "이슈" | "판례" | "스터디";

type Article = {
  id: number;
  kind: ContentKind;
  category: string;
  impact: "높음" | "중간" | "기초";
  date: string;
  title: string;
  summary: string;
  memory: string;
  source: string;
  sourceLabel: string;
  reference: string;
};

const articles: Article[] = [
  {
    id: 1,
    kind: "이슈",
    category: "임금",
    impact: "높음",
    date: "2024.12.19",
    title: "통상임금에서 ‘고정성’이 빠졌다",
    summary:
      "대법원 전원합의체는 통상임금의 개념적 징표에서 고정성을 제외하고, 소정근로의 대가로 정기적·일률적으로 지급하도록 정한 임금인지 중심으로 판단 기준을 재정립했습니다.",
    memory: "재직 조건이 있다는 이유만으로 통상임금에서 바로 제외할 수 없다.",
    source:
      "https://www.scourt.go.kr/portal/news/NewsViewAction.work?gubun=4&pageIndex=1&searchOption=&searchWord=&seqnum=10200&type=5",
    sourceLabel: "대법원 판례속보",
    reference: "대법원 2024. 12. 19. 선고 2020다247190 전원합의체",
  },
  {
    id: 2,
    kind: "판례",
    category: "징계",
    impact: "높음",
    date: "2020.06.25",
    title: "징계 통지는 반드시 며칠 전에 해야 할까?",
    summary:
      "법이 일률적인 통지 일수를 정한 것은 아닙니다. 먼저 취업규칙과 단체협약의 절차를 확인해야 하며, 소명 기회를 정했다면 실제로 그 기회를 제공했는지가 중요합니다.",
    memory: "징계 전에는 ‘법정 며칠’보다 사내 규정과 실질적 소명 기회를 먼저 확인한다.",
    source: "https://www.law.go.kr/LSW/precInfoP.do?precSeq=211773",
    sourceLabel: "국가법령정보센터",
    reference: "대법원 2020. 6. 25. 선고 2016두56042",
  },
  {
    id: 3,
    kind: "스터디",
    category: "근로시간",
    impact: "기초",
    date: "5분 읽기",
    title: "지각 3번을 결근 1일로 처리해도 될까?",
    summary:
      "지각 시간만큼 임금을 정산하는 문제와 지각을 이유로 징계하는 문제는 구분해야 합니다. 실제 제공한 근로까지 없었던 것으로 간주해 임금을 공제하는 방식은 신중히 검토해야 합니다.",
    memory: "임금 정산과 복무상 징계는 서로 다른 문제다.",
    source: "https://www.law.go.kr/법령/근로기준법",
    sourceLabel: "근로기준법 원문",
    reference: "근로기준법 제43조 · 취업규칙의 감급 기준 확인",
  },
  {
    id: 4,
    kind: "판례",
    category: "해고",
    impact: "높음",
    date: "2021.02.25",
    title: "해고통지서에는 어디까지 써야 할까?",
    summary:
      "근로자가 해고사유를 구체적으로 알 수 있도록 서면에 실질적인 비위 내용을 적는 것이 원칙입니다. 이미 사유를 충분히 알고 대응할 수 있었는지 등 구체적 사정도 함께 판단됩니다.",
    memory: "징계해고 통지서는 ‘무슨 행위가 문제인지’ 근로자가 알 수 있게 쓴다.",
    source: "https://www.law.go.kr/LSW/precInfoP.do?precSeq=222729",
    sourceLabel: "국가법령정보센터",
    reference: "대법원 2021. 2. 25. 선고 2017다226605",
  },
  {
    id: 5,
    kind: "스터디",
    category: "휴일·휴가",
    impact: "기초",
    date: "5분 읽기",
    title: "연차 사용촉진을 하면 미사용수당은 늘 없어질까?",
    summary:
      "사용촉진은 법이 정한 시기·방법·서면 절차를 모두 지킨 경우에만 효력이 문제됩니다. 단순 안내 메일이나 구두 독려만으로 법정 절차를 대신했다고 보기 어렵습니다.",
    memory: "연차 사용촉진은 내용보다도 법정 시기와 서면 절차가 핵심이다.",
    source: "https://www.law.go.kr/법령/근로기준법/제61조",
    sourceLabel: "근로기준법 제61조",
    reference: "근로기준법 제61조",
  },
  {
    id: 6,
    kind: "스터디",
    category: "취업규칙",
    impact: "중간",
    date: "5분 읽기",
    title: "취업규칙을 바꾸면 동의가 항상 필요할까?",
    summary:
      "근로자에게 불리한 변경인지가 출발점입니다. 불이익 변경이라면 근로자 집단의 동의 원칙을 검토하고, 유리한 변경이나 단순한 제도 정비와 구분해야 합니다.",
    memory: "취업규칙 변경은 먼저 ‘불이익 변경인가’를 판단한다.",
    source: "https://www.law.go.kr/법령/근로기준법/제94조",
    sourceLabel: "근로기준법 제94조",
    reference: "근로기준법 제94조",
  },
];

const categories = [
  "전체",
  "근로계약",
  "임금",
  "근로시간",
  "휴일·휴가",
  "징계",
  "해고",
  "취업규칙",
  "직장 내 괴롭힘",
  "비정규직",
  "산업재해",
  "노사관계",
];

function ArticleCard({
  article,
  saved,
  onSave,
}: {
  article: Article;
  saved: boolean;
  onSave: (id: number) => void;
}) {
  return (
    <article className="article-card">
      <div className="card-topline">
        <div className="tag-row">
          <span className={`kind kind-${article.kind}`}>{article.kind}</span>
          <span className="category">{article.category}</span>
          <span className={`impact impact-${article.impact}`}>
            영향 {article.impact}
          </span>
        </div>
        <button
          className={`save-button ${saved ? "is-saved" : ""}`}
          type="button"
          aria-label={saved ? `${article.title} 저장 해제` : `${article.title} 저장`}
          aria-pressed={saved}
          onClick={() => onSave(article.id)}
        >
          {saved ? "● 저장됨" : "○ 저장"}
        </button>
      </div>
      <p className="article-date">{article.date}</p>
      <h3>{article.title}</h3>
      <p className="article-summary">{article.summary}</p>
      <div className="memory-line">
        <span>한 줄 기억</span>
        <p>{article.memory}</p>
      </div>
      <div className="card-footer">
        <span>{article.reference}</span>
        <a href={article.source} target="_blank" rel="noreferrer">
          {article.sourceLabel} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}

export default function Home() {
  const [selectedType, setSelectedType] = useState<"전체" | ContentKind>("전체");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [query, setQuery] = useState("");
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("labor-note-saved");
      if (stored) setSavedIds(JSON.parse(stored));
    } catch {
      // Device storage may be unavailable in privacy modes.
    }
  }, []);

  const toggleSave = (id: number) => {
    setSavedIds((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      try {
        window.localStorage.setItem("labor-note-saved", JSON.stringify(next));
      } catch {
        // Keep the current-session state even when persistence is unavailable.
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ko");
    return articles.filter((article) => {
      const matchesType = selectedType === "전체" || article.kind === selectedType;
      const matchesCategory =
        selectedCategory === "전체" || article.category === selectedCategory;
      const matchesSaved = !savedOnly || savedIds.includes(article.id);
      const haystack = `${article.title} ${article.summary} ${article.category} ${article.reference}`.toLocaleLowerCase("ko");
      return matchesType && matchesCategory && matchesSaved && haystack.includes(normalized);
    });
  }, [query, savedIds, savedOnly, selectedCategory, selectedType]);

  const resetFilters = () => {
    setSelectedType("전체");
    setSelectedCategory("전체");
    setQuery("");
    setSavedOnly(false);
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="노동노트 홈">
          <span className="brand-mark">노</span>
          <span>노동노트</span>
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#radar">최신 이슈</a>
          <a href="#radar">중요 판례</a>
          <a href="#radar">5분 스터디</a>
        </nav>
        <button
          className={`saved-nav ${savedOnly ? "active" : ""}`}
          type="button"
          onClick={() => setSavedOnly((current) => !current)}
        >
          저장한 글 <span>{savedIds.length}</span>
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">LABOR LAW BRIEFING · 2026</p>
          <h1>
            오늘의 노동 이슈,
            <br />
            <em>실무의 언어</em>로 읽다.
          </h1>
          <p className="hero-description">
            법령·판례·행정해석을 바탕으로 노동 현장의 중요한 변화를 짧고
            정확하게 정리합니다. 하루 5분, 업무의 판단 기준을 쌓아보세요.
          </p>
          <a className="primary-link" href="#radar">
            오늘의 브리핑 읽기 <span aria-hidden="true">↓</span>
          </a>
        </div>

        <aside className="hero-brief" aria-label="오늘의 핵심 브리핑">
          <div className="brief-label">
            <span>오늘의 핵심</span>
            <time dateTime="2026-07-16">7월 16일</time>
          </div>
          <p className="brief-number">01</p>
          <span className="brief-category">징계 · 판례</span>
          <h2>징계 통지는 반드시 며칠 전에 해야 할까?</h2>
          <p>
            정해진 법정 일수보다 먼저 확인할 것은 취업규칙과 단체협약,
            그리고 실질적인 소명 기회입니다.
          </p>
          <a href="https://www.law.go.kr/LSW/precInfoP.do?precSeq=211773" target="_blank" rel="noreferrer">
            판례 원문 확인 <span aria-hidden="true">↗</span>
          </a>
        </aside>
      </section>

      <section className="quick-strip" aria-label="서비스 특징">
        <div><strong>공식 출처 우선</strong><span>법령 · 법원 · 정부 자료</span></div>
        <div><strong>실무 영향 해설</strong><span>업무에서 확인할 체크포인트</span></div>
        <div><strong>하루 5분 학습</strong><span>한 번에 하나의 원칙</span></div>
      </section>

      <section className="radar-section" id="radar">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ISSUE RADAR</p>
            <h2>읽어둘 노동 이슈</h2>
          </div>
          <p>
            내용은 학습용 MVP 샘플입니다. 실제 업무 적용 전 원문과 최신 법령을
            다시 확인하세요.
          </p>
        </div>

        <div className="filter-panel">
          <div className="type-tabs" role="group" aria-label="콘텐츠 유형">
            {(["전체", "이슈", "판례", "스터디"] as const).map((type) => (
              <button
                type="button"
                key={type}
                className={selectedType === type ? "active" : ""}
                onClick={() => setSelectedType(type)}
              >
                {type === "전체" ? "전체 보기" : type === "스터디" ? "5분 스터디" : type}
              </button>
            ))}
          </div>
          <label className="search-box">
            <span className="sr-only">글 검색</span>
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="판례, 법령, 주제 검색"
            />
          </label>
        </div>

        <div className="category-row" aria-label="주제별 필터">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={selectedCategory === category ? "active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="results-meta">
          <p><strong>{filtered.length}</strong>개의 글</p>
          {savedOnly && <span>저장한 글만 보는 중</span>}
        </div>

        {filtered.length > 0 ? (
          <div className="article-grid">
            {filtered.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                saved={savedIds.includes(article.id)}
                onSave={toggleSave}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>찾는 글이 없습니다.</span>
            <p>검색어를 줄이거나 다른 주제를 선택해 보세요.</p>
            <button type="button" onClick={resetFilters}>필터 초기화</button>
          </div>
        )}
      </section>

      <section className="study-callout">
        <div>
          <p className="eyebrow">DAILY STUDY</p>
          <h2>매일 하나씩,<br />판단의 근거를 쌓습니다.</h2>
        </div>
        <div className="study-copy">
          <p>
            조문만 외우지 않습니다. 기본 원칙에 판례와 행정해석을 곁들여
            실제 상황에서 무엇을 먼저 확인해야 하는지 짚습니다.
          </p>
          <button type="button" onClick={() => { setSelectedType("스터디"); setSavedOnly(false); document.querySelector("#radar")?.scrollIntoView({ behavior: "smooth" }); }}>
            5분 스터디 모아보기 →
          </button>
        </div>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">노</span><span>노동노트</span></div>
        <p>공식 자료에서 시작하는 실무형 노동법 브리핑</p>
        <p className="disclaimer">본 사이트의 콘텐츠는 학습용이며 법률 자문을 대신하지 않습니다.</p>
      </footer>
    </main>
  );
}
