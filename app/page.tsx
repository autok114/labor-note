"use client";

import { useEffect, useMemo, useState } from "react";
import generatedData from "../data/generated-articles.json";

type ContentKind = "이슈" | "판례" | "스터디";

type Article = {
  id: number;
  kind: ContentKind;
  category: string;
  impact: "높음" | "중간" | "기초";
  date: string;
  title: string;
  summary: string[];
  memory: string;
  source: string;
  sourceLabel: string;
  reference: string;
};

const manualArticles: Article[] = [
  {
    id: 101,
    kind: "이슈",
    category: "임금",
    impact: "높음",
    date: "2026.07.15",
    title: "2027년 최저임금안, 시간급 10,700원",
    summary: [
      "최저임금위원회가 2027년도 적용 최저임금안을 시간급 10,700원으로 의결했습니다. 2026년 적용 시급 10,320원보다 380원 높은 수준으로, 이번에 발표된 금액은 위원회가 고용노동부 장관에게 제출하는 ‘최저임금안’ 단계입니다.",
      "고용노동부 장관의 최종 결정·고시 절차가 남아 있으므로 급여 테이블을 확정하기 전 최종 고시를 다시 확인해야 합니다. 확정 후에는 시급직뿐 아니라 월급제 근로자의 최저임금 환산, 산입범위에 포함되는 수당, 수습근로자 적용 여부까지 함께 점검하는 것이 좋습니다.",
    ],
    memory: "10,700원은 현재 ‘최저임금안’이므로 최종 고시를 한 번 더 확인한다.",
    source: "https://www.minimumwage.go.kr/index.jsp",
    sourceLabel: "최저임금위원회",
    reference: "최저임금위원회 2026. 7. 15. 보도참고자료",
  },
  {
    id: 102,
    kind: "이슈",
    category: "산업재해",
    impact: "높음",
    date: "2026.07.15",
    title: "상반기 사고사망자는 줄었지만 제조업은 늘었다",
    summary: [
      "고용노동부의 잠정 통계에 따르면 2026년 상반기 재해조사 대상 사고사망자는 253명으로 전년 같은 기간보다 34명 감소했습니다. 전체 건수와 건설업·기타업종에서는 감소했지만, 제조업 사고사망자는 92명으로 전년 동기보다 25명 증가했습니다.",
      "전체 수치가 개선되었다고 개별 사업장의 위험이 낮아진 것은 아닙니다. 제조업에서는 반복되는 끼임·화재·폭발 위험과 정비작업 시 전원 차단 절차를 다시 점검하고, 사고 발생 후 조치보다 위험성평가와 재발방지 대책이 실제 작업 방식에 반영되는지 확인해야 합니다.",
    ],
    memory: "전체 사고가 줄어도 업종별 위험은 다를 수 있으므로 사업장 위험을 따로 본다.",
    source: "https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=19661",
    sourceLabel: "고용노동부",
    reference: "2026년 상반기 재해조사 대상 사망사고 잠정결과",
  },
  {
    id: 103,
    kind: "판례",
    category: "취업규칙",
    impact: "높음",
    date: "2026.06.25",
    title: "개별 동의가 과반이어도 집단적 동의가 아닐 수 있다",
    summary: [
      "대법원은 임금피크제 도입을 위한 취업규칙 불이익 변경에서 개별 동의서가 형식적으로 과반수를 넘었다는 사정만으로 근로자 과반수의 집단적 동의가 성립한다고 볼 수 없다고 판단했습니다. 변경의 불이익을 충분히 알리고 근로자들이 의견을 교환해 집단적 의사를 형성할 기회가 실질적으로 보장되어야 한다는 취지입니다.",
      "과반수 노동조합이 아닌 노동조합과의 합의도 법이 요구하는 과반수 동의를 그대로 대신할 수 없습니다. 실무에서는 설명자료의 내용, 의견교환 방식, 사용자 개입 여부, 동의 기간과 취합 과정을 함께 설계하고, 단순한 개별 서명 수집으로 절차를 끝내지 않도록 주의해야 합니다.",
    ],
    memory: "취업규칙 불이익 변경은 서명 숫자보다 집단적 의사형성 과정이 중요하다.",
    source: "https://www.scourt.go.kr/portal/news/NewsViewAction.work?gubun=4&pageIndex=3&searchOption=&searchWord=&seqnum=11171&type=5",
    sourceLabel: "대법원 판례속보",
    reference: "대법원 2026. 6. 25. 선고 2025다215010",
  },
  {
    id: 104,
    kind: "이슈",
    category: "근로시간",
    impact: "높음",
    date: "2026.05.28",
    title: "포괄임금 오남용 감독, 근로시간 기록이 핵심",
    summary: [
      "고용노동부는 포괄임금 오남용 의심 사업장 101개소를 대상으로 실시한 1차 기획감독 결과를 발표했습니다. 포괄임금이나 고정 OT를 운영한다는 이유로 실제 연장근로수당을 지급하지 않거나, 장시간 노동과 근로시간 관리 미흡이 함께 나타난 사례가 주요 점검 대상이 됐습니다.",
      "포괄임금 약정이 있다는 사실만으로 모든 시간외근로수당 지급의무가 없어지지는 않습니다. 약정의 성립 여부와 대상 업무를 확인하고, 실제 연장·야간·휴일근로시간을 기록해 약정수당과 법정수당을 비교해야 합니다. 임금대장과 임금명세서의 시간 수가 출퇴근 기록과 일치하는지도 점검할 필요가 있습니다.",
    ],
    memory: "포괄임금 약정보다 먼저 실제 근로시간을 기록하고 법정수당과 비교한다.",
    source: "https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=19447",
    sourceLabel: "고용노동부",
    reference: "포괄임금 오남용 1차 기획감독 결과",
  },
  {
    id: 105,
    kind: "판례",
    category: "임금",
    impact: "높음",
    date: "2026.04.30",
    title: "시간외수당 재산정 때 ‘보장시간’ 약정도 확인해야 한다",
    summary: [
      "대법원은 노사가 실제 근로시간과 관계없이 일정 시간을 연장·야간근로시간으로 간주하기로 합의한 사건에서, 통상임금 변경에 따라 시간외수당을 재산정할 때도 그 보장시간 약정을 고려해야 한다고 판단했습니다. 실제 근로시간이 보장시간에 미달하더라도 곧바로 실제 시간만을 기준으로 계산할 수 없다는 취지입니다.",
      "급여 재산정에서는 통상임금에 포함되는 임금 항목만 바꾸고 끝내기 쉽지만, 연장·야간근로시간 산정에 관한 단체협약이나 임금협약도 함께 확인해야 합니다. 보장시간의 의미와 적용 대상, 이미 지급한 수당의 계산식을 대조한 뒤 차액을 산정하는 것이 안전합니다.",
    ],
    memory: "통상임금이 바뀌면 시간 단가뿐 아니라 보장시간 약정도 함께 확인한다.",
    source: "https://www.scourt.go.kr/portal/news/NewsViewAction.work?gubun=6&searchOption=&searchWord=&seqnum=2963",
    sourceLabel: "대법원 보도자료",
    reference: "대법원 2026. 4. 30. 선고 2025다219757·219758",
  },
  {
    id: 106,
    kind: "이슈",
    category: "근로계약",
    impact: "중간",
    date: "2026.12.08 시행",
    title: "노동감독관 직무집행법이 새로 시행된다",
    summary: [
      "2026년 12월 8일부터 노동감독관의 직무·권한·의무와 사업장 감독 절차를 별도로 정한 노동감독관 직무집행법이 시행될 예정입니다. 중앙노동감독관과 지방노동감독관을 구분하고, 사업장 감독계획과 감독결과 조치, 신고사건 처리 절차 등의 법적 근거를 마련한 것이 핵심입니다.",
      "일부 소규모 사업장에 대한 감독 권한이 협의 절차를 거쳐 지방자치단체에 위임될 수 있는 근거도 포함됐습니다. 시행 전까지 하위 규정과 실제 운영계획이 구체화될 수 있으므로, 사업장은 근로계약서·임금대장·근로시간 기록 등 기본 노동관계 서류의 정합성을 미리 점검하는 편이 좋습니다.",
    ],
    memory: "새 감독체계 시행 전 기본 노동관계 서류부터 서로 맞는지 확인한다.",
    source: "https://www.law.go.kr/LSW/lsInfoP.do?ancYnChk=&chrClsCd=010202&efYd=20261208&lsiSeq=285371&urlMode=lsInfoP",
    sourceLabel: "국가법령정보센터",
    reference: "노동감독관 직무집행법, 2026. 12. 8. 시행",
  },
  {
    id: 107,
    kind: "이슈",
    category: "비정규직",
    impact: "중간",
    date: "2026.06.23",
    title: "공공부문 비정규직의 차별·쪼개기 계약 감독",
    summary: [
      "고용노동부가 지방정부 30개소를 대상으로 비정규직 노동조건 준수 여부를 감독한 결과, 수당 차별과 퇴직금 미지급, 반복적인 단기계약 등 불합리한 고용관행을 적발했습니다. 기간제 근로자 비중이 높거나 11개월 안팎의 계약이 반복되는 사업장이 주요 점검 대상이 됐습니다.",
      "기간제라는 이유만으로 합리적 근거 없이 수당이나 복리후생을 다르게 적용할 수 있는 것은 아닙니다. 계약기간을 짧게 나눈 목적과 실제 업무의 계속성, 갱신 관행, 무기계약 전환 회피 여부를 함께 살펴야 하며, 비교대상 근로자와의 처우 차이가 있다면 객관적인 이유를 설명할 수 있어야 합니다.",
    ],
    memory: "계약기간의 형식보다 업무의 계속성과 처우 차이의 합리적 이유를 본다.",
    source: "https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=19559",
    sourceLabel: "고용노동부",
    reference: "지방정부 비정규직 기획감독 결과",
  },
  {
    id: 108,
    kind: "이슈",
    category: "휴일·휴가",
    impact: "중간",
    date: "2026.05.06",
    title: "육아기 10시 출근제는 법정 단축제도와 다르다",
    summary: [
      "육아기 10시 출근제는 일하는 부모가 자녀의 등하교 시간을 확보할 수 있도록 근로시간을 하루 1시간 줄여 운영하는 사업주 지원제도입니다. 법정 육아기 근로시간 단축과 보완적으로 활용할 수 있으며, 일정 요건을 충족해 제도를 허용한 사업주에게 지원하는 방식입니다.",
      "지원사업과 근로기준법상 권리를 혼동하지 않는 것이 중요합니다. 도입할 때는 대상자, 적용기간, 임금 유지 여부와 근무시간을 사내 기준에 명확히 정하고, 기존의 육아기 근로시간 단축 신청권이나 육아휴직 사용을 제한하는 방식으로 운영하지 않도록 구분해야 합니다.",
    ],
    memory: "사업주 지원제도와 근로자의 법정 육아지원 권리는 구분해서 운영한다.",
    source: "https://www.moel.go.kr/policyitrd/policyItrdView.do?policy_itrd_sn=372",
    sourceLabel: "고용노동부 정책안내",
    reference: "2026년 육아기 10시 출근제 개요 및 FAQ",
  },
  {
    id: 1,
    kind: "이슈",
    category: "임금",
    impact: "높음",
    date: "2024.12.19",
    title: "통상임금에서 ‘고정성’이 빠졌다",
    summary: [
      "대법원 전원합의체는 종전 통상임금 판단에서 핵심적으로 사용되던 ‘고정성’을 개념적 징표에서 제외했습니다. 이제는 근로자가 소정근로를 온전하게 제공할 경우 그 대가로 정기적이고 일률적으로 지급하도록 정한 임금인지가 중심 기준이 됩니다.",
      "따라서 재직 조건이나 일정 근무일수 조건이 붙었다는 이유만으로 통상임금성을 곧바로 부정할 수 없습니다. 실무에서는 정기상여금·최소보장 성과급 등 각 임금 항목이 무엇의 대가인지와 적용 대상을 다시 살피고, 새로운 법리의 적용 시점 및 후속 판례도 함께 확인해야 합니다.",
    ],
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
    summary: [
      "근로기준법이 모든 징계에 대하여 ‘며칠 전까지 통지해야 한다’는 하나의 기간을 정하고 있는 것은 아닙니다. 우선 취업규칙과 단체협약에 징계사유, 개최 일시·장소, 사전통지 기간과 소명 절차가 어떻게 규정되어 있는지 확인해야 합니다. 정해진 절차를 누락하면 징계의 효력 자체가 문제될 수 있습니다.",
      "소명 절차가 있다면 근로자에게 의견을 말하고 자료를 준비할 실질적인 기회를 제공하는 것이 중요합니다. 통지 일수만 계산하기보다 혐의사실을 알 수 있었는지, 준비 시간이 있었는지, 진술 기회가 보장되었는지를 함께 확인하고 그 과정을 기록해 두는 것이 안전합니다.",
    ],
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
    summary: [
      "지각이 반복되었다고 해서 그 횟수만으로 실제 일한 하루 전체를 결근으로 바꾸어 처리하면 임금 문제와 징계 문제를 섞게 됩니다. 임금은 제공하지 않은 근로시간에 대응하는 범위에서 정산하고, 반복 지각에 대한 경고·징계는 취업규칙의 복무 및 징계 기준에 따라 별도로 판단해야 합니다.",
      "‘지각 3회는 결근 1일’ 같은 규정이 있더라도 실제 근로한 시간의 임금까지 공제할 근거인지, 복무상 불이익을 주는 기준인지는 구분해서 검토해야 합니다. 실무에서는 지각 시각과 미근로시간, 임금 공제액, 별도 징계 여부를 각각 기록하고 감급 제재라면 법정 한도도 확인해야 합니다.",
    ],
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
    summary: [
      "사용자가 근로자를 해고하려면 해고사유와 해고시기를 서면으로 통지해야 효력이 인정될 수 있습니다. 특히 징계해고라면 ‘회사 규정 위반’이라고만 적기보다 어떤 행위가 언제, 어떠한 규정과 관련하여 해고사유가 되었는지 근로자가 구체적으로 알 수 있도록 작성하는 것이 원칙입니다.",
      "다만 표현이 다소 축약되어 있더라도 근로자가 이미 구체적인 사유를 충분히 알고 대응할 수 있었는지 등 사건의 사정이 함께 고려될 수 있습니다. 실무에서는 징계의결서와 해고통지서의 사유가 서로 어긋나지 않는지, 해고일이 명확한지까지 마지막으로 대조해야 합니다.",
    ],
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
    summary: [
      "연차 사용촉진을 실시했다는 사실만으로 모든 미사용 연차에 대한 보상의무가 자동으로 없어지는 것은 아닙니다. 근로기준법 제61조는 사용자가 미사용 일수를 알리고 사용 시기를 정해 통보하도록 서면으로 촉구해야 하는 시기와 절차를 구체적으로 정하고 있습니다.",
      "근로자가 기간 안에 사용 시기를 정하지 않으면 사용자가 법정 시기 안에 사용 시기를 정해 다시 서면으로 통보하는 절차도 필요합니다. 실무에서는 근로자별 미사용 일수, 각 통지일과 수령 사실을 남기고, 1년 미만 근로자의 연차처럼 별도 일정이 적용되는 경우도 구분해야 합니다.",
    ],
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
    summary: [
      "취업규칙을 작성하거나 변경할 때 언제나 같은 방식의 동의를 받아야 하는 것은 아닙니다. 출발점은 변경 내용이 근로자에게 불리한지 판단하는 것입니다. 일반적인 작성·변경은 근로자 측의 의견을 들어야 하지만, 불리하게 변경하는 경우에는 근로기준법 제94조에 따른 동의가 필요합니다.",
      "일부 근로자 집단에만 불이익한 변경이라면 누가 동의의 주체가 되는지도 별도로 검토해야 합니다. 실무에서는 변경 전후 조문을 나란히 비교해 불이익 여부와 적용 대상을 정리하고, 의견청취 또는 동의 과정과 결과를 문서로 남긴 뒤 신고 절차까지 연결해야 합니다.",
    ],
    memory: "취업규칙 변경은 먼저 ‘불이익 변경인가’를 판단한다.",
    source: "https://www.law.go.kr/법령/근로기준법/제94조",
    sourceLabel: "근로기준법 제94조",
    reference: "근로기준법 제94조",
  },
];

const articles: Article[] = [
  ...(generatedData.articles as Article[]),
  ...manualArticles,
].filter(
  (article, index, all) =>
    all.findIndex(
      (candidate) =>
        candidate.source === article.source || candidate.title === article.title,
    ) === index,
);

const latestCheck = generatedData.generatedAt
  ? new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(generatedData.generatedAt))
  : "2026. 7. 16.";

const latestIssue = articles.find((article) => article.kind === "이슈") ?? manualArticles[0];

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
      <div className="article-summary">
        {article.summary.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
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

  const showContent = (type: ContentKind) => {
    setSelectedType(type);
    setSelectedCategory("전체");
    setQuery("");
    setSavedOnly(false);
    window.requestAnimationFrame(() => {
      document.querySelector("#radar")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="노동노트 홈">
          <span className="brand-mark">노</span>
          <span>노동노트</span>
        </a>
        <nav aria-label="주요 메뉴">
          <button
            type="button"
            className={selectedType === "이슈" ? "active" : ""}
            aria-current={selectedType === "이슈" ? "page" : undefined}
            onClick={() => showContent("이슈")}
          >
            최신 이슈
          </button>
          <button
            type="button"
            className={selectedType === "판례" ? "active" : ""}
            aria-current={selectedType === "판례" ? "page" : undefined}
            onClick={() => showContent("판례")}
          >
            중요 판례
          </button>
          <button
            type="button"
            className={selectedType === "스터디" ? "active" : ""}
            aria-current={selectedType === "스터디" ? "page" : undefined}
            onClick={() => showContent("스터디")}
          >
            5분 스터디
          </button>
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
            <span>최신 브리핑</span>
            <time>{latestIssue.date}</time>
          </div>
          <p className="brief-number">01</p>
          <span className="brief-category">{latestIssue.category} · {latestIssue.sourceLabel}</span>
          <h2>{latestIssue.title}</h2>
          <p>{latestIssue.summary[0]}</p>
          <a href={latestIssue.source} target="_blank" rel="noreferrer">
            공식 발표 확인 <span aria-hidden="true">↗</span>
          </a>
        </aside>
      </section>

      <section className="quick-strip" aria-label="서비스 특징">
        <div><strong>공식 출처 우선</strong><span>법령 · 법원 · 정부 자료</span></div>
        <div><strong>실무 영향 해설</strong><span>업무에서 확인할 체크포인트</span></div>
        <div><strong>{latestCheck} 확인</strong><span>최신 이슈와 판례 반영</span></div>
      </section>

      <section className="radar-section" id="radar">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ISSUE RADAR</p>
            <h2>읽어둘 노동 이슈</h2>
          </div>
          <p>
            {latestCheck} 기준 공식 자료를 확인해 정리했습니다. 실제 업무에
            적용하기 전 연결된 원문과 최신 법령을 다시 확인하세요.
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
        <p>공식 자료에서 시작하는 실무형 노동법 브리핑 · 최근 확인 {latestCheck}</p>
        <p className="disclaimer">본 사이트의 콘텐츠는 학습용이며 법률 자문을 대신하지 않습니다.</p>
      </footer>
    </main>
  );
}
