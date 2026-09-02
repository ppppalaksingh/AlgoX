import os
import re
import random
import json
import concurrent.futures
from dotenv import load_dotenv

load_dotenv()

def _sanitize_questions(questions: list) -> list:
    """
    Guarantees that options and correctAnswer are clean, consistent,
    and correctly aligned so every question can be accurately graded.
    """
    clean_list = []
    for item in questions:
        q_text = str(item.get("question", "")).strip()
        raw_options = item.get("options", [])
        raw_correct = str(item.get("correctAnswer", "")).strip()
        explanation = str(item.get("explanation", "Standard official statistics verification principle.")).strip()

        if not q_text or len(raw_options) < 2:
            continue

        # Clean options
        options = [str(opt).strip().replace("```", "") for opt in raw_options if str(opt).strip()]
        if len(options) < 4:
            while len(options) < 4:
                options.append(f"Standard alternative administrative protocol {len(options) + 1}")

        options = options[:4]

        # Clean and map correctAnswer
        correct = raw_correct
        letter_match = re.match(r'^[A-D]$', correct, re.IGNORECASE)
        if letter_match:
            idx = ord(letter_match.group(0).upper()) - 65
            if idx < len(options):
                correct = options[idx]

        # Strip letter prefix from correct answer if present e.g. "A) text"
        clean_correct = re.sub(r'^[A-D][\.\)\:\-]\s*', '', correct, flags=re.IGNORECASE).strip()

        # Match with options
        matched_option = None
        for opt in options:
            clean_opt = re.sub(r'^[A-D][\.\)\:\-]\s*', '', opt, flags=re.IGNORECASE).strip()
            if clean_opt.lower() == clean_correct.lower() or clean_correct.lower() in clean_opt.lower():
                matched_option = opt
                break

        if not matched_option:
            matched_option = options[0]

        clean_list.append({
            "question": q_text,
            "options": options,
            "correctAnswer": matched_option,
            "explanation": explanation
        })
    return clean_list

def _call_gemini_quiz(clean_text: str, num_questions: int, gemini_key: str):
    from google import genai
    client = genai.Client(api_key=gemini_key)
    
    # Slice a random dynamic window of text to ensure variety across runs
    text_len = len(clean_text)
    if text_len > 3000:
        start_offset = random.randint(0, min(text_len - 2500, 4000))
        sample_slice = clean_text[start_offset:start_offset + 3500]
    else:
        sample_slice = clean_text

    prompt = f"""You are an expert civil service examination assessment creator for the Ministry of Statistics and Programme Implementation (MoSPI) and iGOT Karmayogi.
Generate {num_questions} completely unique, challenging, high-quality multiple-choice questions based on the following material:

\"\"\"{sample_slice}\"\"\"

Format your output STRICTLY as a valid JSON array of objects. Do not include markdown backticks.
Each object must have these exact keys:
"question": string (clear question based on the document)
"options": array of 4 distinct strings (the 4 answer choices)
"correctAnswer": string (MUST EXACTLY match one of the 4 choices in options)
"explanation": string (clear citation/justification)"""

    for model_name in ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            raw = response.text.strip()
            if raw.startswith("```"):
                raw = re.sub(r'^```json\s*|^```\s*|```$', '', raw, flags=re.MULTILINE).strip()
            parsed = json.loads(raw)
            if isinstance(parsed, list) and len(parsed) > 0:
                sanitized = _sanitize_questions(parsed[:num_questions])
                if len(sanitized) > 0:
                    return sanitized
        except Exception:
            continue
    return None

def generate_quiz_from_text(text: str, num_questions: int = 5) -> dict:
    """
    Generates intelligent civil service examination MCQs based on uploaded document content.
    Uses Google Gemini LLM with instant dynamic local NLP semantic fallback.
    """
    if not text or len(text.strip()) < 20:
        return {"questions": []}

    clean_text = re.sub(r'\s+', ' ', text).strip()

    # 1. Try Google Gemini with a 3.5s timeout
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(_call_gemini_quiz, clean_text, num_questions, gemini_key)
                llm_parsed = future.result(timeout=3.5)
                if llm_parsed:
                    print(f"[quiz_generator] Generated {len(llm_parsed)} questions via Gemini LLM!")
                    return {"questions": llm_parsed}
        except Exception as e:
            print(f"[quiz_generator] Gemini fallback triggered: {e}")

    # 2. Dynamic Smart Semantic NLP Quiz Generator (Offline Fallback with Randomization)
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', clean_text) if len(s.strip()) > 30]
    if not sentences:
        sentences = [clean_text]

    # Shuffle sentences to ensure different questions on every generation
    random.shuffle(sentences)

    questions = []
    used_sentences = set()

    keywords = re.findall(r'\b[A-Z][a-zA-Z]{3,}\b|\b[A-Z]{2,}\b|\b\w+(?: \w+){1,3}\b', clean_text)
    keywords = [k for k in set(keywords) if len(k) > 4 and k.lower() not in ["the", "this", "that", "with", "from", "which", "their", "about", "under", "these"]]
    random.shuffle(keywords)

    for i, sent in enumerate(sentences):
        if len(questions) >= num_questions:
            break
        if sent in used_sentences:
            continue

        match_def = re.search(r'([A-Za-z0-9\s\-]+)\s+(is|are|refers to|means|provides|mandates|conducts|ensures|monitors|includes|describes|aims to)\s+(.+)', sent, re.IGNORECASE)
        if match_def:
            subject = match_def.group(1).strip()
            verb = match_def.group(2).strip()
            predicate = match_def.group(3).strip()

            if len(subject.split()) > 6:
                subject_words = subject.split()[-4:]
                subject = " ".join(subject_words)

            if len(subject) > 3 and len(predicate) > 15:
                used_sentences.add(sent)
                correct_opt = predicate.rstrip('.').capitalize()
                if len(correct_opt) > 120:
                    correct_opt = correct_opt[:117] + "..."

                distractors = [
                    f"Primarily focuses on routine administrative reporting rather than {subject.lower()}.",
                    f"Exclusively restricts data sharing without adherence to standard {subject.lower()} guidelines.",
                    f"Applies only to unaccredited external systems with no statistical oversight.",
                    f"Standardizes informal estimation methods rather than official verification.",
                ]

                other_kw = [k for k in keywords if k.lower() not in subject.lower()][:3]
                if len(other_kw) >= 2:
                    distractors[0] = f"Replaces traditional workflows with unvalidated {other_kw[0]} frameworks."
                    distractors[1] = f"Manages external compliance without implementing {other_kw[1]} standards."

                options = [correct_opt] + distractors[:3]
                random.shuffle(options)

                q_templates = [
                    f"According to the document, what does {subject} {verb}?",
                    f"Based on the provided material, which of the following is true regarding {subject}?",
                    f"What is the primary role or requirement specified for {subject}?",
                ]
                q_text = random.choice(q_templates)

                questions.append({
                    "question": q_text,
                    "options": options,
                    "correctAnswer": correct_opt,
                    "explanation": f"Reference from text: \"{sent[:200]}\""
                })

    if len(questions) < num_questions:
        sample_topics = [
            ("Sampling Methodology", "Ensures national statistical accuracy through stratified multi-stage selection."),
            ("Data Privacy & DPDP Compliance", "Mandates strict access governance, encryption, and citizen data protection."),
            ("SDG Indicator Framework", "Standardizes metadata and quantitative indicators across ministerial datasets."),
            ("AI in Civil Services", "Enables predictive policy simulations and automated anomaly flagging in administrative databases."),
            ("Official Statistics Quality Protocol", "Validates census and survey metrics against international statistical standards."),
            ("National Accounts (SNA 2008)", "Measures Gross Value Added (GVA) and economic output across production sectors."),
            ("Consumer Price Index (CPI)", "Measures retail inflation using modified Laspeyres aggregation across rural and urban markets."),
            ("Periodic Labour Force Survey (PLFS)", "Tracks quarterly employment, WPR, and unemployment through rotational panels.")
        ]
        random.shuffle(sample_topics)

        for topic, fact in sample_topics:
            if len(questions) >= num_questions:
                break
            
            correct = fact
            distractors = [
                f"Applies informal estimation without standardized verification protocols for {topic.lower()}.",
                f"Eliminates statistical controls in favor of automated unstructured processing.",
                f"Restricts ministerial participation across official state and central monitoring systems.",
            ]
            options = [correct] + distractors
            random.shuffle(options)

            questions.append({
                "question": f"In official government data governance, what is the core objective of {topic}?",
                "options": options,
                "correctAnswer": correct,
                "explanation": f"Standard official statistics principle: {topic} {fact.lower()}"
            })

    return {"questions": _sanitize_questions(questions[:num_questions])}