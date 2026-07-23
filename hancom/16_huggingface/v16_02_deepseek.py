import os
from huggingface_hub import InferenceClient
 # .env 파일을 읽어 환경변수로 등록


client = InferenceClient(
    provider="auto",
    api_key=os.environ['HF_TOKEN'],
)

answer = input("질문을 입력해주세요 : " )

# result = client.text_generation(
#     answer,
#     model="deepseek-ai/DeepSedek-V3.2-Speciale",
# )

completion = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-V3.2:novita",  # :novita → novita.ai 무료 라우팅
    messages=[
        {
            "role": "user",       # 발화자 구분 (user/assistant/system)
            "content": answer     # 실제 질문 본문
        }
    ],
)

# 4단계 → 왜: API는 후보 답변 N개 반환 가능. 어떻게: choices[0]로 첫 응답 추출
print(completion.choices[0].message)