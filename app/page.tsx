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
      "대법원 전원합의체는 종전 통상임금 판단에서 핵심적으로 사용되던 ‘고정성’을 개념적 징표에서 제외했습니다. 이제는 근로자가 소정근로를 온전하게 제공할 경우 그 대가로 정기적이고 일률적으로 지급하도록 정한 임금인지가 중심 기준이 됩니다. 따라서 지급일 현재 재직 중인 사람에게만 주는 조건이나 일정 근무일수 조건이 붙었다는 이유만으로 통상임금성을 곧바로 부정할 수 없습니다. 실무에서는 정기상여금·최소보장 성과급 등 각 임금 항목이 무엇의 대가인지, 지급 기준이 모든 대상자에게 어떻게 적용되는지를 다시 살펴야 합니다. 다만 새로운 법리의 적용 시점과 개별 임금 항목의 성격은 판결문 및 후속 판례를 함께 확인해야 합니다.",
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
      "근로기준법이 모든 징계에 대하여 ‘며칠 전까지 통지해야 한다’는 하나의 기간을 정하고 있는 것은 아닙니다. 우선 회사의 취업규칙과 단체협약에 징계사유, 개최 일시·장소, 사전통지 기간과 소명 절차가 어떻게 규정되어 있는지 확인해야 합니다. 이러한 절차 규정이 있다면 사용자는 정해진 내용을 지켜야 하고, 이를 누락하면 징계의 효력 자체가 문제될 수 있습니다. 규정에서 소명 기회를 두었다면 근로자에게 실제로 의견을 말하고 자료를 준비할 기회를 제공하는 것이 중요하며, 근로자가 반드시 소명을 완료해야만 절차가 성립하는 것은 아닙니다. 통지 일수만 계산하기보다 혐의사실을 알 수 있었는지, 준비 시간이 있었는지, 진술 기회가 실질적으로 보장되었는지를 함께 기록해 두는 것이 안전합니다.",
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
      "지각이 반복되었다고 해서 그 횟수만으로 실제 출근하여 일한 하루 전체를 결근으로 바꾸어 처리하는 것은 임금 문제와 징계 문제를 섞을 수 있습니다. 임금은 원칙적으로 제공하지 않은 근로시간에 대응하는 범위에서 정산하는 문제이고, 반복 지각에 대한 경고·감점·징계는 취업규칙의 복무 및 징계 기준에 따라 별도로 판단할 문제입니다. ‘지각 3회는 결근 1일’ 같은 문구가 사내 규정에 있더라도, 실제 근로한 시간의 임금까지 공제할 근거가 되는지와 복무상 불이익을 줄 기준인지는 구분해서 검토해야 합니다. 감급 제재에 해당한다면 근로기준법이 정한 감급 한도도 함께 확인해야 합니다. 실무에서는 지각 시각과 미근로시간, 임금 공제액, 별도 징계 여부를 각각 기록해 두는 편이 분쟁 예방에 도움이 됩니다.",
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
      "사용자가 근로자를 해고하려면 해고사유와 해고시기를 서면으로 통지해야 효력이 인정될 수 있습니다. 특히 징계해고라면 단순히 ‘회사 규정 위반’이라고만 적기보다 어떤 행위가 언제, 어떠한 규정과 관련하여 해고사유가 되었는지 근로자가 구체적으로 알 수 있도록 작성하는 것이 원칙입니다. 이는 사용자가 해고를 신중하게 결정하게 하고, 근로자가 사유를 파악해 적절히 대응할 수 있도록 하기 위한 절차입니다. 다만 통지서의 표현이 다소 축약되어 있더라도 근로자가 이미 구체적인 사유를 충분히 알고 그에 대해 대응할 수 있었는지 등 사건의 사정이 함께 고려될 수 있습니다. 실무에서는 징계의결서와 해고통지서의 사유가 서로 어긋나지 않는지, 해고일이 명확한지까지 마지막으로 대조해야 합니다.",
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
      "연차 사용촉진을 실시했다는 사실만으로 모든 미사용 연차에 대한 보상의무가 자동으로 없어지는 것은 아닙니다. 근로기준법 제61조는 대상 연차의 종류에 따라 사용자가 미사용 일수를 알리고 사용 시기를 정해 통보하도록 서면으로 촉구해야 하는 시기와 절차를 구체적으로 정하고 있습니다. 근로자가 기간 안에 사용 시기를 정하지 않은 경우에는 사용자가 다시 법정 시기 안에 사용 시기를 정해 서면으로 통보하는 후속 절차도 필요합니다. 따라서 일반적인 휴가 사용 독려, 게시판 공지, 구두 안내만으로는 법정 사용촉진 절차를 모두 이행했다고 단정하기 어렵습니다. 실무에서는 근로자별 미사용 일수, 각 통지일, 전달 방법과 수령 사실을 남기고 1년 미만 근로자의 연차처럼 별도 일정이 적용되는 경우도 구분해야 합니다.",
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
      "취업규칙을 작성하거나 변경할 때 언제나 같은 방식의 동의를 받아야 하는 것은 아닙니다. 출발점은 변경 내용이 근로자에게 불리한지 판단하는 것입니다. 일반적인 작성·변경은 과반수 노동조합이 있으면 그 노동조합, 없으면 근로자 과반수의 의견을 들어야 하지만, 불리하게 변경하는 경우에는 근로기준법 제94조에 따른 동의가 필요합니다. 여러 근로자 집단 가운데 일부에게만 불이익한 변경이라면 누가 동의의 주체가 되는지도 별도로 검토해야 하며, 사용자가 일방적으로 설명하고 개별 서명을 받는 것만으로 집단적 동의가 항상 충족되는 것은 아닙니다. 실무에서는 변경 전후 조문을 나란히 비교해 불이익 여부와 적용 대상을 정리하고, 의견청취 또는 동의 과정과 결과를 문서로 남긴 뒤 신고 절차까지 연결해야 합니다.",
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
