import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const outputPath = resolve("data/generated-articles.json");
const userAgent = "LaborNoteBot/1.0 (+https://github.com/autok114/labor-note)";

const laborKeywords = [
  "근로", "노동", "임금", "고용", "노사", "해고", "징계", "취업규칙",
  "산업재해", "산재보험", "안전", "직장", "휴가", "휴직", "고용보험", "비정규",
  "채용", "취업", "실업", "일자리", "괴롭힘", "노동조합", "중대재해",
];

const categoryRules = [
  ["산업재해", ["산업재해", "산재보험", "중대재해", "사망사고", "안전", "위험성평가"]],
  ["임금", ["임금", "급여", "수당", "체불", "최저임금", "통상임금", "포괄임금"]],
  ["근로시간", ["근로시간", "노동시간", "주4일", "야간노동", "연장근로", "교대"]],
  ["휴일·휴가", ["휴가", "휴직", "육아", "출산", "가족돌봄"]],
  ["해고", ["해고", "고용종료", "계약해지"]],
  ["징계", ["징계", "정직", "감봉", "소명"]],
  ["취업규칙", ["취업규칙", "불이익 변경"]],
  ["직장 내 괴롭힘", ["괴롭힘", "태움", "성희롱"]],
  ["비정규직", ["비정규", "기간제", "파견", "차별"]],
  ["노사관계", ["노동조합", "노조", "노사", "단체교섭", "부당노동행위"]],
  ["근로계약", ["근로계약", "근로자성", "고용", "채용", "일자리"]],
];

const practicalGuides = {
  "산업재해": "사업장에서는 발표된 통계나 감독 방향을 확인하는 데 그치지 말고, 같은 유형의 위험이 현재 작업공정에 있는지 위험성평가와 작업절차를 대조해야 합니다. 점검 결과와 개선조치가 실제 현장에 반영됐는지도 기록으로 남길 필요가 있습니다.",
  "임금": "급여 담당자는 적용 대상과 시행 시점, 임금 항목별 산입 범위가 기존 급여 테이블에 어떤 영향을 주는지 확인해야 합니다. 근로계약서·임금대장·임금명세서의 계산 기준이 서로 일치하는지도 함께 점검하는 것이 좋습니다.",
  "근로시간": "실무에서는 제도 명칭보다 실제 출퇴근 및 휴게 기록, 교대 방식, 연장·야간·휴일근로 승인 절차를 먼저 확인해야 합니다. 노사 합의나 취업규칙이 있다면 현장의 운영 방식과 일치하는지도 살펴볼 필요가 있습니다.",
  "휴일·휴가": "대상 근로자와 신청 요건, 사용기간, 임금 처리 방식이 서로 다른 제도와 혼동되지 않도록 사내 안내문과 신청 절차를 정비해야 합니다. 법정 권리와 회사의 추가 지원제도를 구분해 설명하는 것이 중요합니다.",
  "노사관계": "노사관계 이슈는 적용되는 노동조합법 조항뿐 아니라 단체협약과 현재 교섭 경과를 함께 봐야 합니다. 통지·협의·의결 과정에서 정해진 절차가 빠지지 않았는지 문서로 확인하는 것이 좋습니다.",
  "비정규직": "계약 명칭만으로 판단하지 말고 실제 업무의 지속성, 비교대상 근로자, 갱신 관행과 처우 차이의 합리적 이유를 함께 확인해야 합니다. 계약서와 실제 근무 방식이 다르지 않은지도 점검할 필요가 있습니다.",
  "직장 내 괴롭힘": "신고 접수부터 조사, 피해자 보호, 결과 통지와 후속조치까지 담당자와 처리 기한을 명확히 해야 합니다. 조사 과정의 비밀유지와 불리한 처우 금지 원칙이 실제 절차에 반영되는지도 확인해야 합니다.",
  "근로계약": "적용 대상과 시행 시점을 확인한 뒤 근로계약서, 취업규칙, 사내 안내문 가운데 수정이 필요한 부분을 찾아야 합니다. 제도 발표와 실제 시행 사이에 후속 고시나 세부 지침이 남아 있는지도 원문에서 확인하는 것이 좋습니다.",
};

function decodeEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&middot;/gi, "·")
    .replace(/&ldquo;|&rdquo;|&quot;/gi, '"')
    .replace(/&lsquo;|&rsquo;|&#39;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function cleanText(html) {
  return decodeEntities(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?\s*>|<\/p>|<\/li>|<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

async function fetchText(url, charset = "utf-8") {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": userAgent, accept: "text/html,application/xhtml+xml" },
        signal: AbortSignal.timeout(25_000),
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const bytes = await response.arrayBuffer();
      return new TextDecoder(charset).decode(bytes);
    } catch (error) {
      lastError = error;
      await new Promise((resolvePromise) => setTimeout(resolvePromise, attempt * 1_000));
    }
  }
  throw lastError;
}

function isLaborRelated(text) {
  return laborKeywords.some((keyword) => text.includes(keyword));
}

function classify(text) {
  return categoryRules.find(([, keywords]) => keywords.some((keyword) => text.includes(keyword)))?.[0] ?? "근로계약";
}

function impactFor(category, title) {
  if (["임금", "해고", "징계", "산업재해"].includes(category)) return "높음";
  if (/시행|개정|판결|감독|의결|발표/.test(title)) return "높음";
  return "중간";
}

function sentences(text) {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?。]|다\.)\s+/)
    .map((sentence) => sentence.replace(/\s+/g, " ").trim())
    .filter((sentence) => sentence.length >= 25 && sentence.length <= 320);
}

function makeSummary(title, body, category, sourceLabel) {
  const bodySentences = sentences(body).filter((sentence) => !sentence.includes("담당 부서"));
  const first = bodySentences.slice(0, 2).join(" ") || `${sourceLabel}이(가) 「${title}」 자료를 공개했습니다. 세부 대상과 적용 시점은 연결된 공식 원문에서 확인할 수 있습니다.`;
  const second = bodySentences.slice(2, 4).join(" ") || `이번 자료의 핵심 내용과 후속 일정은 공식 발표를 기준으로 정리됐습니다. 제목만으로 결론을 넓혀 해석하기보다 발표문에 적힌 범위와 예외를 함께 확인해야 합니다.`;
  const guide = practicalGuides[category] ?? practicalGuides["근로계약"];
  return [first, second, guide];
}

function memoryFor(category) {
  const values = {
    "산업재해": "통계 수치보다 우리 사업장의 같은 위험이 실제로 제거됐는지를 확인한다.",
    "임금": "금액을 바꾸기 전에 적용 대상·시행일·산입 범위를 먼저 확인한다.",
    "근로시간": "제도 이름보다 실제 근로시간 기록과 운영 방식을 먼저 본다.",
    "휴일·휴가": "법정 권리와 회사의 추가 지원제도를 구분해서 안내한다.",
    "노사관계": "법 조항과 함께 단체협약 및 실제 교섭 절차를 확인한다.",
    "비정규직": "계약 명칭보다 업무의 지속성과 실제 처우를 함께 살핀다.",
    "직장 내 괴롭힘": "신고 이후 조사·보호·후속조치가 끊기지 않게 기록한다.",
    "근로계약": "발표 내용의 적용 대상과 시행 시점을 원문에서 먼저 확인한다.",
  };
  return values[category] ?? values["근로계약"];
}

async function collectMoel() {
  const listUrl = "https://www.moel.go.kr/news/enews/report/enewsList.do";
  const html = await fetchText(listUrl);
  const pattern = /<a[^>]+href="enewsView\.do\?news_seq=(\d+)"[^>]+title="([^"]+)"[^>]*>[\s\S]*?<\/a>[\s\S]*?<td[^>]*aria-label="등록일"[^>]*>\s*(\d{4}\.\d{2}\.\d{2})\s*<\/td>/gi;
  const items = [];
  for (const match of html.matchAll(pattern)) {
    const title = decodeEntities(match[2]).replace(/<[^>]+>/g, "").trim();
    if (!isLaborRelated(title)) continue;
    items.push({ seq: Number(match[1]), title, date: match[3] });
    if (items.length >= 10) break;
  }

  const articles = [];
  for (const item of items) {
    const source = `https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=${item.seq}`;
    try {
      const detail = await fetchText(source);
      const bodyHtml = detail.match(/<div class="\s*b_content\s+news_content">([\s\S]*?)<\/div>/i)?.[1] ?? "";
      const body = cleanText(bodyHtml);
      const category = classify(`${item.title} ${body.slice(0, 800)}`);
      articles.push({
        id: 20_000_000 + item.seq,
        kind: "이슈",
        category,
        impact: impactFor(category, item.title),
        date: item.date,
        title: item.title,
        summary: makeSummary(item.title, body, category, "고용노동부"),
        memory: memoryFor(category),
        source,
        sourceLabel: "고용노동부",
        reference: `고용노동부 ${item.date} 보도자료`,
      });
    } catch (error) {
      console.warn(`MOEL detail skipped (${item.seq}): ${error.message}`);
    }
  }
  return articles;
}

async function collectSupremeCourt() {
  const articles = [];
  for (let page = 1; page <= 3; page += 1) {
    const listUrl = `https://www.scourt.go.kr/portal/news/NewsListAction.work?gubun=4&type=0&pageIndex=${page}`;
    const html = await fetchText(listUrl, "euc-kr");
    const pattern = /<a\s+href='([^']*NewsViewAction\.work[^']*seqnum=(\d+)[^']*)'[^>]*>([\s\S]*?)<\/a>[\s\S]{0,1500}?(\d{4}-\d{2}-\d{2})/gi;
    for (const match of html.matchAll(pattern)) {
      const title = cleanText(match[3]);
      if (!isLaborRelated(title) || /중요판결 요지$/.test(title)) continue;
      const seq = Number(match[2]);
      const date = match[4].replaceAll("-", ".");
      const source = new URL(decodeEntities(match[1]), "https://www.scourt.go.kr").href;
      const category = classify(title);
      articles.push({
        id: 30_000_000 + seq,
        kind: "판례",
        category,
        impact: impactFor(category, title),
        date,
        title,
        summary: [
          `대법원 법원도서관이 ${date} 판례속보로 공개한 사건입니다. 제목에 나타난 쟁점은 ${title.replace(/\[.*$/, "").trim()}에 관한 것으로, 구체적인 사실관계와 법원의 판단 범위는 연결된 판례속보 원문을 기준으로 확인해야 합니다.`,
          "판결의 결론만 떼어 일반화하면 적용 범위를 잘못 이해할 수 있습니다. 원심의 판단, 대법원이 문제 삼은 법리, 사건에 적용된 법령의 시행 시점을 함께 읽고 현재 사안과 사실관계가 같은지 비교할 필요가 있습니다.",
          practicalGuides[category] ?? practicalGuides["근로계약"],
        ],
        memory: memoryFor(category),
        source,
        sourceLabel: "대법원 판례속보",
        reference: `대법원 판례속보 · ${date} 게시`,
      });
    }
  }
  return [...new Map(articles.map((article) => [article.id, article])).values()].slice(0, 8);
}

async function main() {
  const previous = JSON.parse(await readFile(outputPath, "utf8"));
  const results = await Promise.allSettled([collectMoel(), collectSupremeCourt()]);
  const fresh = results.flatMap((result) => result.status === "fulfilled" ? result.value : []);
  for (const result of results) {
    if (result.status === "rejected") console.warn(result.reason);
  }
  if (fresh.length === 0) {
    console.warn("No fresh official content found; keeping the previous data file.");
    process.exitCode = 0;
    return;
  }
  const previousArticles = Array.isArray(previous.articles) ? previous.articles : [];
  const merged = [...fresh, ...previousArticles]
    .filter((article) => isLaborRelated(article.title))
    .filter((article, index, all) => all.findIndex((candidate) => candidate.source === article.source) === index)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 40);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), articles: merged }, null, 2)}\n`, "utf8");
  console.log(`Updated ${merged.length} articles (${fresh.length} refreshed from official sources).`);
}

await main();
