#!/usr/bin/env python3
"""
DhakaCart Local AI Recommendation Engine (brain.py)
----------------------------------------------------
An explainable, zero-external-dependency recommendation engine implemented
in pure Python. Designed for local execution with strict mathematical parity
against the client-side JavaScript engine.

Ethical AI Principles:
1. Hard Budget Enforcement: Products exceeding the user's budget are NEVER recommended.
2. Transparent Explanations: Every recommendation explicitly lists the matched query tokens,
   matched tags, and mathematical reasoning.
3. Jaccard Tag Similarity: Related products use the exact formula: |A ∩ B| / |A ∪ B|.
4. Zero Fake Urgency or Misleading Scoring.
"""

import json
import os
import re
import sys
import argparse
from typing import List, Dict, Any, Set, Tuple

# Domain stop words (common particles and low-signal terms in English and Banglish)
STOP_WORDS: Set[str] = {
    "a", "an", "the", "for", "my", "in", "on", "at", "to", "and", "or", "is",
    "are", "of", "with", "some", "need", "want", "looking", "please", "find",
    "get", "me", "i", "can", "you", "under", "within", "around", "about",
    "give", "show", "recommend", "item", "items", "product", "products", "dhaka"
}

# Domain concept and synonym mapping for authentic Bangladeshi commerce
CONCEPT_SYNONYMS: Dict[str, List[str]] = {
    "sister": ["sister", "women", "saree", "shawl", "kurti", "gift"],
    "sister's": ["sister", "women", "saree", "shawl", "kurti", "gift"],
    "apu": ["sister", "women", "saree", "shawl", "kurti", "gift"],
    "bubu": ["sister", "women", "saree", "shawl", "kurti", "gift"],
    
    "brother": ["brother", "men", "panjabi", "wallet", "lungi", "bag"],
    "brother's": ["brother", "men", "panjabi", "wallet", "lungi", "bag"],
    "bhai": ["brother", "men", "panjabi", "wallet", "lungi", "bag"],
    "bhaiya": ["brother", "men", "panjabi", "wallet", "lungi", "bag"],

    "mother": ["mother", "women", "saree", "shawl", "kantha", "honey", "gift"],
    "mother's": ["mother", "women", "saree", "shawl", "kantha", "honey", "gift"],
    "ammu": ["mother", "women", "saree", "shawl", "kantha", "honey", "gift"],
    "ma": ["mother", "women", "saree", "shawl", "kantha", "honey", "gift"],

    "father": ["father", "men", "panjabi", "wallet", "honey", "brass", "lungi"],
    "father's": ["father", "men", "panjabi", "wallet", "honey", "brass", "lungi"],
    "abbu": ["father", "men", "panjabi", "wallet", "honey", "brass", "lungi"],
    "baba": ["father", "men", "panjabi", "wallet", "honey", "brass", "lungi"],

    "eid": ["eid", "festive", "traditional", "panjabi", "saree", "polao", "gift", "sweets"],
    "boishakh": ["pohela boishakh", "traditional", "cotton", "taant", "panjabi", "clay"],
    "wedding": ["wedding", "festive", "traditional", "katan", "silk", "jamdani", "brass"],
    "winter": ["winter", "shawl", "silk", "mustard oil", "honey"],
    "summer": ["summer", "cotton", "khadi", "taant", "lungi", "kurti"],

    "gift": ["gift", "handicraft", "shawl", "kantha", "wallet", "jamdani", "tray"],
    "present": ["gift", "handicraft", "shawl", "kantha", "wallet", "jamdani"],
    "traditional": ["traditional", "handloom", "heritage", "craft", "brass", "kantha"],
    "heritage": ["heritage", "traditional", "handloom", "shotoronji", "rickshaw"],

    "tea": ["tea", "cups", "clay", "brass", "terracotta"],
    "cha": ["tea", "cups", "clay", "brass", "terracotta"],
    
    "food": ["food", "grocery", "honey", "rice", "shutki", "mustard oil", "sweets"],
    "pantry": ["food", "grocery", "honey", "rice", "shutki", "mustard oil"],
    "organic": ["organic", "honey", "rice", "mustard oil", "clay", "shutki"],
    "sweet": ["sweets", "naru", "food", "gift"],
    "dessert": ["sweets", "naru", "food", "gift"],

    "leather": ["leather", "wallet", "bag", "accessories"],
    "silk": ["silk", "katan", "rajshahi", "shawl", "saree"],
    "cotton": ["cotton", "tangail", "taant", "khadi", "kurti", "lungi"],
    "handloom": ["handloom", "jamdani", "taant", "khadi", "lungi", "saree"]
}


def load_catalog(filepath: str = None) -> List[Dict[str, Any]]:
    """Loads product catalogue from json file or default path."""
    if not filepath:
        candidates = [
            os.path.join(os.path.dirname(__file__), "src", "data", "products.json"),
            os.path.join(os.path.dirname(__file__), "products.json"),
            "/app/applet/src/data/products.json"
        ]
        for c in candidates:
            if os.path.exists(c):
                filepath = c
                break
    
    if not filepath or not os.path.exists(filepath):
        raise FileNotFoundError(f"Catalogue file not found. Checked: {filepath}")

    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def tokenize(text: str) -> List[str]:
    """
    Splits text into cleaned lowercase alphanumeric word tokens.
    Handles apostrophes and standard punctuation cleanly.
    """
    clean_text = re.sub(r"[^\w\s']", " ", text.lower())
    tokens = [t.strip("'") for t in clean_text.split() if t.strip("'")]
    return tokens


def filter_stopwords(tokens: List[str]) -> List[str]:
    """Filters out common grammatical filler words."""
    return [t for t in tokens if t not in STOP_WORDS and len(t) > 1]


def extract_budget_from_text(text: str) -> float:
    """
    Extracts explicit budget figures if present in query
    (e.g. 'under 3000', 'budget 2500 bdt', 'max 4000').
    Returns 0.0 if not specified.
    """
    patterns = [
        r"(?:under|below|within|max|budget|upto|up to|less than)\s*(?:bdt|tk|৳)?\s*(\d{2,6})",
        r"(\d{2,6})\s*(?:bdt|tk|৳)?\s*(?:budget|or less|max)"
    ]
    for p in patterns:
        m = re.search(p, text.lower())
        if m:
            try:
                return float(m.group(1))
            except ValueError:
                pass
    return 0.0


def expand_query_concepts(tokens: List[str]) -> Tuple[Set[str], Dict[str, List[str]]]:
    """
    Expands query tokens into domain concepts using CONCEPT_SYNONYMS.
    Returns (all_expanded_keywords, match_derivations_map).
    """
    expanded: Set[str] = set()
    derivations: Dict[str, List[str]] = {}

    for token in tokens:
        expanded.add(token)
        if token in CONCEPT_SYNONYMS:
            synonyms = CONCEPT_SYNONYMS[token]
            derivations[token] = synonyms
            for s in synonyms:
                expanded.add(s)

    return expanded, derivations


def recommend_products(
    catalog: List[Dict[str, Any]],
    query: str,
    budget: float,
    max_results: int = 6
) -> Dict[str, Any]:
    """
    Local Smart Assistant recommendation algorithm.
    
    Ethical AI Constraints:
    - HARD BUDGET CEILING: Products with price > budget are strictly disqualified.
    - EXPLAINABILITY: Full trace of matched query tokens and matched product tags.
    - TRANSPARENT SCORING: No hidden weights or arbitrary random boosts.
    """
    if budget <= 0:
        # Default fallback ceiling if none set
        budget = 100000.0

    raw_tokens = tokenize(query)
    filtered_tokens = filter_stopwords(raw_tokens)
    expanded_keywords, derivations = expand_query_concepts(filtered_tokens)

    recommendations = []
    budget_excluded_count = 0

    for product in catalog:
        price = float(product.get("price", 0))

        # Ethical Rule 1: Never exceed budget
        if price > budget:
            budget_excluded_count += 1
            continue

        product_tags = [t.lower() for t in product.get("tags", [])]
        product_name = product.get("name", "").lower()
        product_category = product.get("category", "").lower()
        product_desc = product.get("description", "").lower()

        matched_query_tokens: Set[str] = set()
        matched_tags: Set[str] = set()
        score = 0.0

        # 1. Exact Tag Matches (highest signal: weight = 3.0)
        for kw in expanded_keywords:
            if kw in product_tags:
                matched_tags.add(kw)
                score += 3.0
                # Identify which original user token triggered this
                for orig in filtered_tokens:
                    if orig == kw or kw in derivations.get(orig, []):
                        matched_query_tokens.add(orig)

        # 2. Product Name Matches (weight = 2.5)
        for token in filtered_tokens:
            if token in product_name:
                matched_query_tokens.add(token)
                score += 2.5

        # 3. Category Matches (weight = 2.0)
        for token in filtered_tokens:
            if token in product_category:
                matched_query_tokens.add(token)
                score += 2.0

        # 4. Description Substring Matches (weight = 1.0)
        for token in filtered_tokens:
            if token in product_desc and token not in matched_query_tokens:
                matched_query_tokens.add(token)
                score += 1.0

        # If zero matches found but user entered very generic words, don't hallucinate
        if score <= 0.0:
            continue

        # Ethical quality adjustment: slight boost based on verified customer rating (4.0-5.0 scale)
        rating = float(product.get("rating", 4.5))
        quality_multiplier = 1.0 + (0.05 * (rating - 4.0))
        final_score = round(score * quality_multiplier, 2)

        # Build clear explanation
        savings = budget - price
        matched_tokens_list = sorted(list(matched_query_tokens))
        matched_tags_list = sorted(list(matched_tags))
        
        reasons = []
        if matched_tokens_list:
            reasons.append(f"Matched user words: {', '.join(repr(w) for w in matched_tokens_list)}")
        if matched_tags_list:
            reasons.append(f"Product tags: {', '.join(repr(t) for t in matched_tags_list)}")
        reasons.append(f"Budget compliant: ৳{int(price):,} is within ৳{int(budget):,} (৳{int(savings):,} remaining)")

        recommendations.append({
            "product": product,
            "score": final_score,
            "raw_score": score,
            "matched_words": matched_tokens_list,
            "matched_tags": matched_tags_list,
            "budget_savings": savings,
            "explanation": " • ".join(reasons)
        })

    # Sort deterministically: highest score, then highest rating, then lowest price
    recommendations.sort(
        key=lambda r: (
            -r["score"],
            -float(r["product"].get("rating", 0)),
            float(r["product"].get("price", 0))
        )
    )

    top_results = recommendations[:max_results]

    return {
        "query": query,
        "parsed_tokens": filtered_tokens,
        "expanded_keywords": sorted(list(expanded_keywords)),
        "budget_limit": budget,
        "budget_excluded_count": budget_excluded_count,
        "total_matches": len(recommendations),
        "results": top_results
    }


def calculate_jaccard_similarity(tags_a: List[str], tags_b: List[str]) -> Tuple[float, List[str], List[str]]:
    """
    Computes standard Jaccard Similarity coefficient between two tag sets:
        J(A, B) = |A ∩ B| / |A ∪ B|
    Returns:
        (similarity_coefficient, intersection_list, union_list)
    """
    set_a = set(t.lower() for t in tags_a)
    set_b = set(t.lower() for t in tags_b)

    intersection = set_a.intersection(set_b)
    union = set_a.union(set_b)

    if not union:
        return 0.0, [], []

    score = len(intersection) / len(union)
    return round(score, 4), sorted(list(intersection)), sorted(list(union))


def get_similar_products(
    catalog: List[Dict[str, Any]],
    product_id: str,
    max_results: int = 4
) -> Dict[str, Any]:
    """
    Finds related products using strict Jaccard similarity on product tags.
    Explicitly excludes the current product.
    """
    target_product = next((p for p in catalog if p["id"] == product_id), None)
    if not target_product:
        raise ValueError(f"Product ID '{product_id}' not found in catalogue.")

    target_tags = target_product.get("tags", [])
    results = []

    for other in catalog:
        # Ethical Rule: Always exclude the current product itself
        if other["id"] == product_id:
            continue

        other_tags = other.get("tags", [])
        jaccard_score, shared, union = calculate_jaccard_similarity(target_tags, other_tags)

        # Require at least one shared tag
        if jaccard_score > 0:
            percentage = round(jaccard_score * 100, 1)
            results.append({
                "product": other,
                "jaccard_similarity": jaccard_score,
                "similarity_percentage": percentage,
                "shared_tags": shared,
                "total_unique_tags": len(union),
                "shared_count": len(shared),
                "explanation": (
                    f"{percentage}% tag similarity ({len(shared)}/{len(union)} tags shared: "
                    f"{', '.join(repr(t) for t in shared)})"
                )
            })

    # Sort deterministically: highest Jaccard similarity, then rating
    results.sort(
        key=lambda r: (
            -r["jaccard_similarity"],
            -float(r["product"].get("rating", 0))
        )
    )

    return {
        "target_product_id": product_id,
        "target_product_name": target_product.get("name"),
        "target_tags": target_tags,
        "similar_products": results[:max_results]
    }


def run_parity_test() -> Dict[str, Any]:
    """
    Runs deterministic verification tests to assert algorithm invariants.
    Can be called by test suites or UI inspection tools.
    """
    catalog = load_catalog()
    
    # Test Case 1: Query with budget limit
    res1 = recommend_products(catalog, "a gift for my sister for Eid", budget=3000.0, max_results=4)
    # Invariant: No product should exceed 3000 BDT
    for item in res1["results"]:
        assert item["product"]["price"] <= 3000.0, f"Budget violation: {item['product']['name']}"
        assert len(item["matched_words"]) > 0, "Item matched without explanation"

    # Test Case 2: Similar products for dc-01 (Jamdani Saree)
    res2 = get_similar_products(catalog, "dc-01", max_results=4)
    for sim in res2["similar_products"]:
        assert sim["product"]["id"] != "dc-01", "Self-recommendation detected!"
        assert sim["jaccard_similarity"] > 0, "Zero similarity item included"

    return {
        "status": "PASS",
        "total_catalog_size": len(catalog),
        "test_1_matches": len(res1["results"]),
        "test_1_top": res1["results"][0]["product"]["name"] if res1["results"] else None,
        "test_2_top_similar": res2["similar_products"][0]["product"]["name"] if res2["similar_products"] else None,
        "parity_signature": "DHAKACART_ENGINE_V1_STRICT_JACCARD"
    }


def main():
    parser = argparse.ArgumentParser(description="DhakaCart Local AI Engine (Python)")
    subparsers = parser.add_subparsers(dest="command")

    # Command: recommend
    rec_parser = subparsers.add_parser("recommend")
    rec_parser.add_argument("--query", "-q", type=str, required=True, help="Natural language request")
    rec_parser.add_argument("--budget", "-b", type=float, default=100000.0, help="Max budget in BDT")
    rec_parser.add_argument("--limit", "-l", type=int, default=6, help="Max items to return")

    # Command: similar
    sim_parser = subparsers.add_parser("similar")
    sim_parser.add_argument("--product-id", "-p", type=str, required=True, help="Product ID")
    sim_parser.add_argument("--limit", "-l", type=int, default=4, help="Max items to return")

    # Command: test-parity
    subparsers.add_parser("test-parity")

    args = parser.parse_args()

    try:
        catalog = load_catalog()

        if args.command == "recommend":
            output = recommend_products(catalog, args.query, args.budget, args.limit)
            print(json.dumps(output, indent=2, ensure_ascii=False))

        elif args.command == "similar":
            output = get_similar_products(catalog, args.product_id, args.limit)
            print(json.dumps(output, indent=2, ensure_ascii=False))

        elif args.command == "test-parity":
            output = run_parity_test()
            print(json.dumps(output, indent=2, ensure_ascii=False))

        else:
            parser.print_help()

    except Exception as e:
        sys.stderr.write(f"Error: {e}\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
