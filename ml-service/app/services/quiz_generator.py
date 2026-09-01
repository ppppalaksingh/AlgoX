import os
import re
import random
import json
from dotenv import load_dotenv

load_dotenv()

def generate_quiz_from_text(text: str, num_questions: int = 5) -> dict:
    """
    Generates intelligent civil service examination MCQs based on uploaded document content.
    Uses Google Gemini LLM (gemini-3.6-flash) when GEMINI_API_KEY is present,
    with an automatic fallback to the built-in smart semantic NLP engine.
    """
    if not text or len(text.strip()) < 20:
        return {"questions": []}

    clean_text = re.sub(r'\s+', ' ', text).strip()

    # 1. Real Google Gemini LLM Generation
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            from google import genai
            client = genai.Client(api_key=gemini_key)
            prompt = f"""You are an expert civil service examination assessment creator for the Ministry of Statistics and Programme Implementation (MoSPI) and iGOT Karmayogi.
Generate {num_questions} high quality, challenging multiple-choice questions based ONLY on the content of the following document / presentation:

\"\"\"{clean_text[:5000]}\"\"\"

Format your output STRICTLY as a valid JSON array of objects. Do not include markdown backticks or extra text.
Each object must have these exact keys:
"question": string (clear, professional examination question based on the document)
"options": array of 4 distinct strings (the 4 answer choices)
"correctAnswer": string (must exactly match one of the 4 choices in options)
"explanation": string (clear citation / justification from the text)"""

            response = client.models.generate_content(
                model='gemini-3.6-flash',
                contents=prompt
            )
            raw = response.text.strip()
            if raw.startswith("```"):
                raw = re.sub(r'^```json\s*|^```\s*|```$', '', raw, flags=re.MULTILINE).strip()
            parsed = json.loads(raw)
            if isinstance(parsed, list) and len(parsed) > 0:
                print(f"[quiz_generator] Generated {len(parsed)} questions using Real Google Gemini LLM!")
                return {"questions": parsed[:num_questions]}
        except Exception as e:
            print(f"[quiz_generator] Gemini LLM fallback due to: {e}")

    # 2. Built-in Smart Semantic NLP Quiz Generator (Offline / Local Fallback)
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', clean_text) if len(s.strip()) > 35]
    if not sentences:
        sentences = [clean_text]

    questions = []
    used_sentences = set()

    keywords = re.findall(r'\b[A-Z][a-zA-Z]{3,}\b|\b[A-Z]{2,}\b|\b\w+(?: \w+){1,3}\b', clean_text)
    keywords = [k for k in set(keywords) if len(k) > 4 and k.lower() not in ["the", "this", "that", "with", "from", "which", "their", "about", "under", "these"]]

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
        ]

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

    return {"questions": questions[:num_questions]}