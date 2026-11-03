/**
 * DhakaCart Local AI Recommendation Engine (brain.ts)
 * ----------------------------------------------------
 * High-performance, explainable TypeScript/JavaScript implementation with
 * 100% deterministic parity to `brain.py`.
 *
 * Runs locally in the browser with ZERO network calls, zero third-party APIs,
 * and zero external dependencies.
 */

import productsData from '../data/products.json';

export type ProductSpecs = Record<string, string | undefined>;

export interface Product {
  id: string;
  name: string;
  banglaName: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  origin: string;
  badge: string;
  stock: number;
  tags: string[];
  description: string;
  specs: ProductSpecs;
  color: string;
  accentColor: string;
}

export interface RecommendationResult {
  product: Product;
  score: number;
  rawScore: number;
  matchedWords: string[];
  matchedTags: string[];
  budgetSavings: number;
  explanation: string;
}

export interface RecommendationResponse {
  query: string;
  parsedTokens: string[];
  expandedKeywords: string[];
  budgetLimit: number;
  budgetExcludedCount: number;
  totalMatches: number;
  results: RecommendationResult[];
}

export interface SimilarProductResult {
  product: Product;
  jaccardSimilarity: number;
  similarityPercentage: number;
  sharedTags: string[];
  totalUniqueTags: number;
  sharedCount: number;
  explanation: string;
}

export interface SimilarProductsResponse {
  targetProductId: string;
  targetProductName: string;
  targetTags: string[];
  similarProducts: SimilarProductResult[];
}

export const STOP_WORDS = new Set([
  'a', 'an', 'the', 'for', 'my', 'in', 'on', 'at', 'to', 'and', 'or', 'is',
  'are', 'of', 'with', 'some', 'need', 'want', 'looking', 'please', 'find',
  'get', 'me', 'i', 'can', 'you', 'under', 'below', 'within', 'around', 'about',
  'give', 'show', 'recommend', 'item', 'items', 'product', 'products', 'dhaka'
]);

export const CONCEPT_SYNONYMS: Record<string, string[]> = {
  sister: ['sister', 'women', 'saree', 'shawl', 'kurti', 'gift'],
  "sister's": ['sister', 'women', 'saree', 'shawl', 'kurti', 'gift'],
  apu: ['sister', 'women', 'saree', 'shawl', 'kurti', 'gift'],
  bubu: ['sister', 'women', 'saree', 'shawl', 'kurti', 'gift'],

  brother: ['brother', 'men', 'panjabi', 'wallet', 'lungi', 'bag'],
  "brother's": ['brother', 'men', 'panjabi', 'wallet', 'lungi', 'bag'],
  bhai: ['brother', 'men', 'panjabi', 'wallet', 'lungi', 'bag'],
  bhaiya: ['brother', 'men', 'panjabi', 'wallet', 'lungi', 'bag'],

  mother: ['mother', 'women', 'saree', 'shawl', 'kantha', 'honey', 'gift'],
  "mother's": ['mother', 'women', 'saree', 'shawl', 'kantha', 'honey', 'gift'],
  ammu: ['mother', 'women', 'saree', 'shawl', 'kantha', 'honey', 'gift'],
  ma: ['mother', 'women', 'saree', 'shawl', 'kantha', 'honey', 'gift'],

  father: ['father', 'men', 'panjabi', 'wallet', 'honey', 'brass', 'lungi'],
  "father's": ['father', 'men', 'panjabi', 'wallet', 'honey', 'brass', 'lungi'],
  abbu: ['father', 'men', 'panjabi', 'wallet', 'honey', 'brass', 'lungi'],
  baba: ['father', 'men', 'panjabi', 'wallet', 'honey', 'brass', 'lungi'],

  eid: ['eid', 'festive', 'traditional', 'panjabi', 'saree', 'polao', 'gift', 'sweets'],
  boishakh: ['pohela boishakh', 'traditional', 'cotton', 'taant', 'panjabi', 'clay'],
  wedding: ['wedding', 'festive', 'traditional', 'katan', 'silk', 'jamdani', 'brass'],
  winter: ['winter', 'shawl', 'silk', 'mustard oil', 'honey'],
  summer: ['summer', 'cotton', 'khadi', 'taant', 'lungi', 'kurti'],

  gift: ['gift', 'handicraft', 'shawl', 'kantha', 'wallet', 'jamdani', 'tray'],
  present: ['gift', 'handicraft', 'shawl', 'kantha', 'wallet', 'jamdani'],
  traditional: ['traditional', 'handloom', 'heritage', 'craft', 'brass', 'kantha'],
  heritage: ['heritage', 'traditional', 'handloom', 'shotoronji', 'rickshaw'],

  tea: ['tea', 'cups', 'clay', 'brass', 'terracotta'],
  cha: ['tea', 'cups', 'clay', 'brass', 'terracotta'],

  food: ['food', 'grocery', 'honey', 'rice', 'shutki', 'mustard oil', 'sweets'],
  pantry: ['food', 'grocery', 'honey', 'rice', 'shutki', 'mustard oil'],
  organic: ['organic', 'honey', 'rice', 'mustard oil', 'clay', 'shutki'],
  sweet: ['sweets', 'naru', 'food', 'gift'],
  dessert: ['sweets', 'naru', 'food', 'gift'],

  leather: ['leather', 'wallet', 'bag', 'accessories'],
  silk: ['silk', 'katan', 'rajshahi', 'shawl', 'saree'],
  cotton: ['cotton', 'tangail', 'taant', 'khadi', 'kurti', 'lungi'],
  handloom: ['handloom', 'jamdani', 'taant', 'khadi', 'lungi', 'saree']
};

export const PRODUCTS: Product[] = productsData as unknown as Product[];

export function tokenize(text: string): string[] {
  const clean = text.toLowerCase().replace(/[^\w\s']/g, ' ');
  return clean
    .split(/\s+/)
    .map(t => t.replace(/^'+|'+$/g, ''))
    .filter(t => t.length > 0);
}

export function filterStopwords(tokens: string[]): string[] {
  return tokens.filter(t => !STOP_WORDS.has(t) && t.length > 1);
}

export function extractBudgetFromText(text: string): number {
  const patterns = [
    /(?:under|below|within|max|budget|upto|up to|less than)\s*(?:bdt|tk|৳)?\s*(\d{2,6})/i,
    /(\d{2,6})\s*(?:bdt|tk|৳)?\s*(?:budget|or less|max)/i
  ];
  for (const p of patterns) {
    const match = text.match(p);
    if (match && match[1]) {
      const parsed = parseFloat(match[1]);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }
  return 0;
}

export function expandQueryConcepts(tokens: string[]): {
  expanded: Set<string>;
  derivations: Record<string, string[]>;
} {
  const expanded = new Set<string>();
  const derivations: Record<string, string[]>= {};

  for (const token of tokens) {
    expanded.add(token);
    if (CONCEPT_SYNONYMS[token]) {
      const syns = CONCEPT_SYNONYMS[token];
      derivations[token] = syns;
      for (const s of syns) {
        expanded.add(s);
      }
    }
  }

  return { expanded, derivations };
}

export function recommendProducts(
  catalog: Product[] = PRODUCTS,
  query: string,
  budget: number = 100000,
  maxResults: number = 6
): RecommendationResponse {
  const safeBudget = budget > 0 ? budget : 100000;
  const rawTokens = tokenize(query);
  const filteredTokens = filterStopwords(rawTokens);
  const { expanded, derivations } = expandQueryConcepts(filteredTokens);

  const recommendations: RecommendationResult[] = [];
  let budgetExcludedCount = 0;

  for (const product of catalog) {
    const price = product.price;

    // Strict Ethical AI Rule: Never exceed budget
    if (price > safeBudget) {
      budgetExcludedCount++;
      continue;
    }

    const productTags = product.tags.map(t => t.toLowerCase());
    const productName = product.name.toLowerCase();
    const productCategory = product.category.toLowerCase();
    const productDesc = product.description.toLowerCase();

    const matchedQueryTokens = new Set<string>();
    const matchedTags = new Set<string>();
    let score = 0.0;

    // 1. Tag matches (weight = 3.0)
    for (const kw of expanded) {
      if (productTags.includes(kw)) {
        matchedTags.add(kw);
        score += 3.0;

        for (const orig of filteredTokens) {
          if (orig === kw || (derivations[orig] && derivations[orig].includes(kw))) {
            matchedQueryTokens.add(orig);
          }
        }
      }
    }

    // 2. Name matches (weight = 2.5)
    for (const token of filteredTokens) {
      if (productName.includes(token)) {
        matchedQueryTokens.add(token);
        score += 2.5;
      }
    }

    // 3. Category matches (weight = 2.0)
    for (const token of filteredTokens) {
      if (productCategory.includes(token)) {
        matchedQueryTokens.add(token);
        score += 2.0;
      }
    }

    // 4. Description matches (weight = 1.0)
    for (const token of filteredTokens) {
      if (productDesc.includes(token) && !matchedQueryTokens.has(token)) {
        matchedQueryTokens.add(token);
        score += 1.0;
      }
    }

    if (score <= 0.0) {
      continue;
    }

    // Quality multiplier based on product rating
    const rating = product.rating || 4.5;
    const qualityMultiplier = 1.0 + (0.05 * (rating - 4.0));
    const finalScore = Math.round((score * qualityMultiplier) * 100) / 100;

    const savings = safeBudget - price;
    const matchedTokensList = Array.from(matchedQueryTokens).sort();
    const matchedTagsList = Array.from(matchedTags).sort();

    const reasons: string[] = [];
    if (matchedTokensList.length > 0) {
      reasons.push(`Matched user words: ${matchedTokensList.map(w => `'${w}'`).join(', ')}`);
    }
    if (matchedTagsList.length > 0) {
      reasons.push(`Product tags: ${matchedTagsList.map(t => `'${t}'`).join(', ')}`);
    }
    reasons.push(
      `Budget compliant: ৳${price.toLocaleString()} is within ৳${safeBudget.toLocaleString()} (৳${savings.toLocaleString()} remaining)`
    );

    recommendations.push({
      product,
      score: finalScore,
      rawScore: score,
      matchedWords: matchedTokensList,
      matchedTags: matchedTagsList,
      budgetSavings: savings,
      explanation: reasons.join(' • ')
    });
  }

  // Sort: highest score -> highest rating -> lowest price
  recommendations.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.product.rating !== a.product.rating) return b.product.rating - a.product.rating;
    return a.product.price - b.product.price;
  });

  return {
    query,
    parsedTokens: filteredTokens,
    expandedKeywords: Array.from(expanded).sort(),
    budgetLimit: safeBudget,
    budgetExcludedCount,
    totalMatches: recommendations.length,
    results: recommendations.slice(0, maxResults)
  };
}

export function calculateJaccardSimilarity(
  tagsA: string[],
  tagsB: string[]
): {
  similarity: number;
  intersection: string[];
  union: string[];
} {
  const setA = new Set(tagsA.map(t => t.toLowerCase()));
  const setB = new Set(tagsB.map(t => t.toLowerCase()));

  const intersection: string[] = [];
  const unionSet = new Set<string>();

  for (const t of setA) {
    unionSet.add(t);
    if (setB.has(t)) {
      intersection.push(t);
    }
  }

  for (const t of setB) {
    unionSet.add(t);
  }

  if (unionSet.size === 0) {
    return { similarity: 0, intersection: [], union: [] };
  }

  const similarity = Math.round((intersection.length / unionSet.size) * 10000) / 10000;
  return {
    similarity,
    intersection: intersection.sort(),
    union: Array.from(unionSet).sort()
  };
}

export function getSimilarProducts(
  catalog: Product[] = PRODUCTS,
  productId: string,
  maxResults: number = 4
): SimilarProductsResponse {
  const targetProduct = catalog.find(p => p.id === productId);
  if (!targetProduct) {
    throw new Error(`Product ID '${productId}' not found in catalogue.`);
  }

  const results: SimilarProductResult[] = [];

  for (const other of catalog) {
    // Strictly exclude the current product
    if (other.id === productId) continue;

    const { similarity, intersection, union } = calculateJaccardSimilarity(
      targetProduct.tags,
      other.tags
    );

    if (similarity > 0) {
      const percentage = Math.round(similarity * 1000) / 10;
      results.push({
        product: other,
        jaccardSimilarity: similarity,
        similarityPercentage: percentage,
        sharedTags: intersection,
        totalUniqueTags: union.length,
        sharedCount: intersection.length,
        explanation: `${percentage}% tag similarity (${intersection.length}/${union.length} tags shared: ${intersection.map(t => `'${t}'`).join(', ')})`
      });
    }
  }

  // Sort by highest Jaccard similarity, then rating
  results.sort((a, b) => {
    if (b.jaccardSimilarity !== a.jaccardSimilarity) {
      return b.jaccardSimilarity - a.jaccardSimilarity;
    }
    return b.product.rating - a.product.rating;
  });

  return {
    targetProductId: productId,
    targetProductName: targetProduct.name,
    targetTags: targetProduct.tags,
    similarProducts: results.slice(0, maxResults)
  };
}
