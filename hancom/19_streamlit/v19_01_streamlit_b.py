import streamlit as st
from ultralytics import YOLO
import cv2

# 1. Streamlit 페이지 기본 설정 = 웹 화면 모양 결정
st.set_page_config(layout="wide")       # 화면을 가로로 넓게 사용(꼭 코드 맨 위)
st.title("YOLO 실시간 CCTV 탐지")        # vpdlwl aos dnldp zms wpahr vytl  

# 2. 영상 출력용 공간 설정 - 영상이 들어갈 빈 액자 준비
frame_placeholder = st.empty()

# 3. CCTV 비디오 스트림 연결 - 인터넷 CCTV 카메라 접속
stream_url = "http://210.99.70.120:1935/live/cctv013.stream/playlist.m3u8"
cap = cv2.VideoCapture(stream_url)

# 4. 모델 로드 - 사물 인식 AI 두뇌 불러오기
model = YOLO("yolo11n.pt")

# 5. 프레임 처리 - CCTV 영상을 한 장씩 분석 반복
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("프레임 읽기 실패...")
        break

    # 5-1. 모델 객체 탐지 수행 - AI에게 사진 보여주고 분석 요청
    results = model(frame)

    # 5-2. 탐지 결과를 이미지에 시각화 - 찾은 사물에 네모 박스 그리기
    annotated_frame = results[0].plot()

    # 5-3. Streamlit placeholder에 프레임 갱신 - 빈 액자에 결과 사진 표시
    frame_placeholder.image(annotated_frame, channels="BGR")

# 6. 자원 해제
cap.release()
cv2.destroyAllWindows()
