import { useNavigate, useLocation } from 'react-router-dom'
import RecordForm from '../components/RecordForm.jsx'
import { emptyRecord } from '../data/records.js'

// 등록 페이지: 폼에서 새 기록을 받아 추가한 뒤 목록으로 이동.
// 예매 알리미에서 '예매완료'로 들어온 경우, 예매 정보가 미리 채워진다.
function New({ onAdd }) {
  const navigate = useNavigate()
  const location = useLocation()

  const fromOpening = location.state?.fromOpening
  // 예매 알리미에서 넘어온 값을 빈 기록 위에 얹어 완전한 초기값을 만든다.
  const initial = fromOpening
    ? { ...emptyRecord(), ...fromOpening.prefill }
    : undefined

  const handleAdd = (newRecord) => {
    // 예매 알림은 아카이브로 유지해 같은 오픈 일정에서 여러 회차를 등록할 수 있다.
    onAdd(newRecord)
    navigate('/')
  }

  return (
    <div className="new-page">
      <div className="page-head">
        <div>
          <h2>
            {fromOpening ? '🎟️ 예매완료 · 기록 등록' : '📝 새 관람 기록'}
          </h2>
          <p className="page-sub">
            {fromOpening
              ? '예매 정보와 결제일이 채워져 있어요. 관람일·좌석·금액만 입력해주세요.'
              : '관람한 영화·공연·경기의 정보를 입력해주세요.'}
          </p>
        </div>
      </div>
      <div className="inline-form">
        <p className="form-heading">📝 새 기록 일정</p>
        <RecordForm
          initial={initial}
          onSubmit={handleAdd}
          submitLabel="기록 추가하기"
        />
      </div>
    </div>
  )
}

export default New
