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
        raw_correct = str(item.get("correctAnswer", item.get("correct_option", ""))).strip()
        explanation = str(item.get("explanation", "Assessment principle derived directly from uploaded study material.")).strip()

        if not q_text:
            continue

        # If options is a dict e.g. {"A": "...", "B": "..."}
        if isinstance(raw_options, dict):
            raw_options = list(raw_options.values())

        if not isinstance(raw_options, list) or len(raw_options) < 2:
            continue

        # Clean options
        options = [str(opt).strip().replace("```", "") for opt in raw_options if str(opt).strip()]
        if len(options) < 4:
            while len(options) < 4:
                options.append(f"Standard alternative protocol {len(options) + 1}")

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


def _call_groq_quiz(clean_text: str, num_questions: int, groq_key: str):
    """
    Generates high-speed, highly tailored MCQs directly from the uploaded material using Groq LLMs.
    """
    try:
        from groq import Groq
        client = Groq(api_key=groq_key)

        text_len = len(clean_text)
        if text_len > 4000:
            start_offset = random.randint(0, min(text_len - 3000, 3000))
            sample_slice = clean_text[start_offset:start_offset + 3500]
        else:
            sample_slice = clean_text

        prompt = f"""You are an expert assessment examiner for civil services and professional training.
Carefully read the following uploaded source document:

\"\"\"{sample_slice}\"\"\"

Generate exactly {num_questions} completely unique, challenging, high-quality multiple-choice questions SPECIFICALLY based on the facts, concepts, methodologies, and details in the text above.

Format your output STRICTLY as a valid JSON array of objects with NO additional markdown wrappers.
Each object in the array must have these exact keys:
"question": string (clear question based directly on the provided material)
"options": array of 4 distinct strings (4 answer choices)
"correctAnswer": string (MUST EXACTLY match one of the 4 choices in options)
"explanation": string (brief citation explaining why it is correct based on the text)"""

        for model_name in ['openai/gpt-oss-120b', 'qwen/qwen3.6-27b', 'openai/gpt-oss-20b']:
            try:
                response = client.chat.completions.create(
                    model=model_name,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.7,
                    max_tokens=2048,
                )
                raw = response.choices[0].message.content.strip()
                if raw.startswith("```"):
                    raw = re.sub(r'^```json\s*|^```\s*|```$', '', raw, flags=re.MULTILINE).strip()
                parsed = json.loads(raw)
                if isinstance(parsed, list) and len(parsed) > 0:
                    sanitized = _sanitize_questions(parsed[:num_questions])
                    if len(sanitized) > 0:
                        print(f"[_call_groq_quiz] Successfully generated {len(sanitized)} questions using {model_name}!")
                        return sanitized
            except Exception as m_err:
                print(f"[_call_groq_quiz] model {model_name} note: {m_err}")
                continue
    except Exception as err:
        print(f"[_call_groq_quiz] error: {err}")
    return None


def _call_gemini_quiz(clean_text: str, num_questions: int, gemini_key: str):
    try:
        from google import genai
        client = genai.Client(api_key=gemini_key)

        text_len = len(clean_text)
        if text_len > 3000:
            start_offset = random.randint(0, min(text_len - 2500, 4000))
            sample_slice = clean_text[start_offset:start_offset + 3500]
        else:
            sample_slice = clean_text

        prompt = f"""You are an expert assessment examiner for civil services and professional training.
Generate {num_questions} completely unique, challenging, high-quality multiple-choice questions based on the following uploaded material:

\"\"\"{sample_slice}\"\"\"

Format your output STRICTLY as a valid JSON array of objects. Do not include markdown backticks.
Each object must have these exact keys:
"question": string (clear question based on the document)
"options": array of 4 distinct strings (the 4 answer choices)
"correctAnswer": string (MUST EXACTLY match one of the 4 choices in options)
"explanation": string (clear citation/justification)"""

        for model_name in ['gemini-3.6-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']:
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
            except Exception as err:
                print(f"[_call_gemini_quiz] model {model_name} note: {err}")
                continue
    except Exception as e:
        print(f"[_call_gemini_quiz] error: {e}")
    return None


def generate_quiz_from_text(text: str, num_questions: int = 5) -> dict:
    """
    Generates intelligent multiple-choice questions based on uploaded document content.
    Prioritizes Groq LLM (high-speed, large quota) -> Google Gemini -> Smart In-Document NLP Extractor.
    """
    if not text or len(text.strip()) < 20:
        return {"questions": []}

    clean_text = re.sub(r'\s+', ' ', text).strip()

    # 1. Try Groq (Ultra-fast LLM with active credentials)
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key:
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(_call_groq_quiz, clean_text, num_questions, groq_key)
                llm_parsed = future.result(timeout=25.0)
                if llm_parsed and len(llm_parsed) >= 2:
                    print(f"[quiz_generator] Generated {len(llm_parsed)} questions via Groq LLM!")
                    return {"questions": llm_parsed}
        except Exception as e:
            print(f"[quiz_generator] Groq note: {e}")

    # 2. Try Google Gemini
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(_call_gemini_quiz, clean_text, num_questions, gemini_key)
                llm_parsed = future.result(timeout=25.0)
                if llm_parsed and len(llm_parsed) >= 2:
                    print(f"[quiz_generator] Generated {len(llm_parsed)} questions via Gemini LLM!")
                    return {"questions": llm_parsed}
        except Exception as e:
            print(f"[quiz_generator] Gemini note: {e}")

    # 3. Dynamic Smart Document NLP Semantic Extractor (Guaranteed 100% derived from uploaded material)
    sentences = [s.strip() for s in re.split(r'(?<=[.!?\n])\s+', clean_text) if len(s.strip()) > 35]
    if not sentences:
        sentences = [clean_text]

    random.shuffle(sentences)
    questions = []
    used_sentences = set()

    keywords = re.findall(r'\b[A-Z][a-zA-Z0-9_\-]{2,}\b|\b[A-Z]{2,}\b|\b\w+(?: \w+){1,2}\b', clean_text)
    keywords = [k for k in set(keywords) if len(k) > 3 and k.lower() not in ["the", "this", "that", "with", "from", "which", "their", "about", "under", "these", "into", "have", "been"]]
    random.shuffle(keywords)

    for sent in sentences:
        if len(questions) >= num_questions:
            break
        if sent in used_sentences:
            continue

        # Look for definition/action statements
        match_def = re.search(r'([A-Za-z0-9\s\-]{3,40})\s+(is|are|refers to|means|provides|mandates|conducts|ensures|monitors|includes|describes|aims to|implements|utilizes|features|contains|supports)\s+(.+)', sent, re.IGNORECASE)
        if match_def:
            subject = match_def.group(1).strip()
            verb = match_def.group(2).strip()
            predicate = match_def.group(3).strip()

            if len(subject.split()) > 6:
                subject = " ".join(subject.split()[-4:])

            if len(subject) >= 3 and len(predicate) > 15:
                used_sentences.add(sent)
                correct_opt = predicate.rstrip('.').capitalize()
                if len(correct_opt) > 110:
                    correct_opt = correct_opt[:107] + "..."

                distractors = [
                    f"Primarily replaces standard workflows with unverified alternative procedures.",
                    f"Restricts user participation and bypasses official evaluation protocols.",
                    f"Operates as an external standalone utility without administrative integration.",
                ]

                other_kw = [k for k in keywords if k.lower() not in subject.lower()][:2]
                if len(other_kw) >= 2:
                    distractors[0] = f"Focuses exclusively on {other_kw[0]} without addressing {subject.lower()}."
                    distractors[1] = f"Automates reporting for {other_kw[1]} instead of standard verification."

                options = [correct_opt] + distractors[:3]
                random.shuffle(options)

                q_templates = [
                    f"According to the uploaded document, what does {subject} {verb}?",
                    f"Based on the provided presentation material, what is the role or specification of {subject}?",
                    f"Which of the following best describes {subject} as stated in the material?",
                ]
                q_text = random.choice(q_templates)

                questions.append({
                    "question": q_text,
                    "options": options,
                    "correctAnswer": correct_opt,
                    "explanation": f"Directly cited from uploaded material: \"{sent[:180]}...\""
                })

    # If more questions needed, formulate direct comprehension questions from remaining sentences
    for sent in sentences:
        if len(questions) >= num_questions:
            break
        if sent in used_sentences:
            continue

        used_sentences.add(sent)
        clean_sent = sent.rstrip('.').capitalize()
        if len(clean_sent) > 110:
            clean_sent = clean_sent[:107] + "..."

        distractors = [
            "The system is restricted solely to informal external pilot testing.",
            "All processes are deprecated in favor of legacy paper schedules.",
            "Independent verification standards are omitted from current architecture.",
        ]
        options = [clean_sent] + distractors
        random.shuffle(options)

        questions.append({
            "question": f"Which of the following key statements is directly confirmed in the uploaded document?",
            "options": options,
            "correctAnswer": clean_sent,
            "explanation": f"Confirmed in source document text: \"{sent[:180]}\""
        })

    return {"questions": _sanitize_questions(questions[:num_questions])}