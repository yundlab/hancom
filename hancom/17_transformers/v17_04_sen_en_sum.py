from transformers import pipeline

# 1. 요약 파이프라인 생성
summarizer = pipeline(
    "summarization",
    model="t5-small"
)

# 2. 요약할 원문
text = """
Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry. An incredible adventure is about to begin!
These new editions of the classic and internationally bestselling, multi-award-winning series feature instantly pick-up-able new jackets by Jonny Duddle, with huge child appeal, to bring Harry Potter to the next generation of readers. It's time to PASS THE MAGIC ON .
"""

# 3. 요약 실행
summary = summarizer(
    text,
    min_length=20,      # 최소 토큰 수 => 너무 짧은 요약 방지
    max_length=60,      # 최대 토큰 수 => 길이 폭주 방지
    do_sample=False     # 매번 동일한 결과
)

# 4. 결과 확인
sum_text = summary[0]['summary_text']
print(f"요약된 문장 : {sum_text}")