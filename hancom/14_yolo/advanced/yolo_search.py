from ultralytics import solutions
import ssl, os
ssl._create_default_https_context = ssl._create_unverified_context
os.environ["CURL_CA_BUNDLE"] = ""        # requests/HuggingFace 인증서 검증 무시
os.environ["REQUESTS_CA_BUNDLE"] = ""

# 1. 검색 앱 생성
app = solutions.SearchApp(
    data="14_yolo/advanced/demo_data",
    device="cpu"
)

# 2. 웹 서버 실행
app.run(debug=False)