import streamlit as st          # 웹앱 도구
from ultralytics import YOLO    # 사물 찾는 AI  
import cv2                      # 영상 처리 도구
import pandas as pd             # 표(엑셀 같은)
import plotly.express as px     # 그래프 그리는 도구
import time                     # 시간 측정용


# 1. 화면 구성 - 화면을 좌|우 2칸으로 분할
col1, col2 = st.columns(2)

with col1:
    # YOLO 프레임 표시용 빈 영역
    frame_placeholder = st.empty()

with col2:
    # 객체 수 그래프 표시용 빈 영역
    chart_placeholder = st.empty()

# 2. 비디오 경로 설정 - CCTV 주소 연결
stream_url = "http://210.99.70.120:1935/live/cctv013.stream/playlist.m3u8"
cap = cv2.VideoCapture(stream_url)

# 3. 모델 로드 - AI 두뇌 불러오기 (캐시로 1회만 로드)
@st.cache_resource      # 모델이나 DB같은 무거운 자원 캐싱
def load_model():
    return YOLO("yolo11n.pt")

model = load_model()

# 4. 프레임 처리
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("FRAME FAIL")
        break

    # 4-1. 모델 객체 탐지 수행 - AI한테 사진 보여주기
    results = model(frame)

    # 4-2. 탐지 결과 이미지 - 네모 박스 그리기
    annotated_frame = results[0].plot()

    # 4-3. 탐지된 객체의 클래스 이름 추출 - "사람", "차" 이름 모으기
    # 컨프리헨션으로 클래스 이름 가져오기
    labels = [model.names[int(c)] for c in results[0].boxes.cls]

    # 4-4. 탐지 객체 수 시각화 - 종류별 개수세서 막대 그래프 aksemfrl
    if labels:      # 객체 탐지되면
        # labels 리스트를 DataFrame으로 변환 후 개수 집계
        df_count = pd.DataFrame({"Object": labels})

        # 종류별 개수 세기
        df_count = df_count.value_counts().reset_index(name="Count")

        # plotly를 이용해 막대 그래프 생성
        fig = px.bar(
            df_count, 
            x="Object",             # 클래스 이름
            y="Count",              # 개수
            title="탐지 객체 수",
            color="Object",         # 클래스마다 색 다르게
            text="Count"            # 막대 위에 숫자 표시
        )

    else:
        # 빈 표만 표시
        df_count = pd.DataFrame({"Object":[], "Count":[]})
        fig = px.bar(
            df_count,
            x="Object",
            y="Count",
            title="탐지 객체 수"
        )

    # 4-5. Streamlit 결과 표시 - 왼쪽 영상 + 오른쪽 그래프
    frame_placeholder.image(annotated_frame, channels="BGR")
    chart_placeholder.plotly_chart(fig, use_container_width=True, key=f"chart_{time.time()}")
    # 매번 다른 키 값 설정해서 위젯 충돌 막기
    
# 5. 자원 해제
cap.release()
cv2.destroyAllWindows()