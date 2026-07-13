import { useState } from 'react'
import {
  CATEGORIES,
  CATEGORY_LIST,
  PAY_METHODS,
  BOOKING_SITES,
  emptyRecord,
} from '../data/records.js'

// 관람 기록 입력 폼 (추가 / 수정 겸용)
// - initial: 수정할 때 기존 값 (없으면 빈 폼 = 추가 모드)
// - onSubmit: 제출 시 완성된 기록을 넘겨주는 함수
// - submitLabel: 제출 버튼 글자
// - onCancel: 취소 버튼을 눌렀을 때 실행 (없으면 취소 버튼 자체를 숨김)
// - cancelLabel: 취소 버튼 글자
function RecordForm({
  initial,
  onSubmit,
  submitLabel = '기록 추가하기',
  onCancel,
  cancelLabel = '취소',
}) {
  // 각 입력값을 하나의 state 객체로 관리 (initial이 있으면 그 값으로 시작)
  const [form, setForm] = useState(initial || emptyRecord())

  // 예매처가 목록에 없는 값이면 '기타(직접 입력)' 모드로 시작
  const isCustomSite = (v) => !!v && !BOOKING_SITES.includes(v)
  const [otherSite, setOtherSite] = useState(isCustomSite(form.bookingSite))

  // input이 바뀔 때마다 해당 필드만 갱신
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  // 예매처 select 변경: '기타'면 직접 입력란을 열고 값은 비운다
  const handleSiteChange = (e) => {
    const value = e.target.value
    if (value === '기타') {
      setOtherSite(true)
      setForm({ ...form, bookingSite: '' })
    } else {
      setOtherSite(false)
      setForm({ ...form, bookingSite: value })
    }
  }

  // 사진 파일을 선택하면 미리보기용 data URL로 변환해서 저장
  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setForm({ ...form, image: reader.result })
    reader.readAsDataURL(file) // 파일을 base64 문자열로 읽기
  }

  const handleSubmit = (e) => {
    e.preventDefault() // 새로고침 막기

    // 제목은 필수
    if (form.title.trim() === '') {
      alert('제목을 입력해주세요!')
      return
    }

    // 관람 날짜도 필수 (통계·캘린더가 날짜 기준으로 동작하므로)
    if (form.date === '') {
      alert('관람 날짜를 입력해주세요!')
      return
    }

    // 완성된 기록 하나 만들기 (poster는 카테고리 이모지로 자동 지정)
    const record = {
      ...form,
      rating: Number(form.rating),
      price: Number(form.price) || 0, // 금액은 숫자로 (비우면 0)
      poster: CATEGORIES[form.category].emoji,
    }

    onSubmit(record)
  }

  return (
    <form className="record-form" onSubmit={handleSubmit}>
      <label>
        카테고리
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORY_LIST.map((c) => (
            <option key={c} value={c}>
              {CATEGORIES[c].emoji} {c}
            </option>
          ))}
        </select>
      </label>

      <label>
        제목
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="예) 뮤지컬 오페라의 유령"
        />
      </label>

      <p className="form-section">💳 결제·예매 정보</p>

      {/* 결제일 + 결제수단 한 줄에 */}
      <div className="form-row">
        <label>
          결제일
          <input
            type="date"
            name="bookedDate"
            value={form.bookedDate}
            onChange={handleChange}
          />
        </label>
        <label>
          결제수단
          <select name="payMethod" value={form.payMethod} onChange={handleChange}>
            {PAY_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* 예매처 + 예매번호 한 줄에 */}
      <div className="form-row">
        <label>
          예매처
          <select
            name="bookingSite"
            value={otherSite ? '기타' : form.bookingSite}
            onChange={handleSiteChange}
          >
            {BOOKING_SITES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value="기타">기타 (직접 입력)</option>
          </select>
          {/* '기타' 선택 시 예매처를 직접 입력 */}
          {otherSite && (
            <input
              type="text"
              name="bookingSite"
              value={form.bookingSite}
              onChange={handleChange}
              placeholder="예매처 직접 입력"
            />
          )}
        </label>
        <label>
          예매번호 (선택)
          <input
            type="text"
            name="bookingNo"
            value={form.bookingNo}
            onChange={handleChange}
            placeholder="예) IP12345678"
          />
        </label>
      </div>

      <label>
        금액 (원)
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="예) 150000"
          min="0"
        />
      </label>

      <p className="form-section">🎫 관람 정보</p>

      {/* 관람일 + 시간 한 줄에 */}
      <div className="form-row">
        <label>
          관람 날짜
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </label>
        <label>
          관람 시간
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
          />
        </label>
      </div>

      <label>
        장소
        <input
          type="text"
          name="place"
          value={form.place}
          onChange={handleChange}
          placeholder="예) 샤롯데씨어터"
        />
      </label>

      <label>
        좌석
        <input
          type="text"
          name="seat"
          value={form.seat}
          onChange={handleChange}
          placeholder="예) 1층 R석 5열 12번"
        />
      </label>

      <label>
        별점
        <select name="rating" value={form.rating} onChange={handleChange}>
          <option value={0}>아직 관람 전 (미평가)</option>
          <option value={5}>★★★★★ (5)</option>
          <option value={4}>★★★★☆ (4)</option>
          <option value={3}>★★★☆☆ (3)</option>
          <option value={2}>★★☆☆☆ (2)</option>
          <option value={1}>★☆☆☆☆ (1)</option>
        </select>
      </label>

      <label>
        감상 제목
        <input
          type="text"
          name="reviewTitle"
          value={form.reviewTitle}
          onChange={handleChange}
          placeholder="예) 샹들리에의 전율 (카드에 표시돼요)"
        />
      </label>

      <label>
        감상 내용
        <textarea
          name="reviewBody"
          value={form.reviewBody}
          onChange={handleChange}
          placeholder="관람 소감을 자유롭게 남겨보세요"
          rows={3}
        />
      </label>

      <label>
        포스터 / 현장 사진 (선택)
        <input type="file" accept="image/*" onChange={handleFile} />
      </label>

      {/* 사진을 골랐으면 미리보기 */}
      {form.image && (
        <img src={form.image} alt="미리보기" className="form-preview" />
      )}

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
        )}
      </div>
    </form>
  )
}

export default RecordForm
