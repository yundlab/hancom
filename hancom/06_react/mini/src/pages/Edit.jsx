import { useParams, useNavigate, Link } from 'react-router-dom'
import RecordForm from '../components/RecordForm.jsx'

// 수정 페이지: 기존 기록을 폼에 채워 넣고, 저장하면 갱신 후 상세로 이동.
function Edit({ records, onUpdate }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const record = records.find((r) => r.id === Number(id))

  if (!record) {
    return (
      <div className="new-page">
        <p className="empty">존재하지 않는 기록이에요.</p>
        <Link to="/" className="btn-primary">
          목록으로
        </Link>
      </div>
    )
  }

  const handleUpdate = (updated) => {
    onUpdate(Number(id), updated)
    navigate(`/record/${id}`) // 수정 후 상세 페이지로
  }

  return (
    <div className="new-page">
      <h2>기록 수정</h2>
      <RecordForm
        initial={record}
        onSubmit={handleUpdate}
        submitLabel="수정 완료"
        onCancel={() => navigate(`/record/${id}`)}
        cancelLabel="수정 취소"
      />
    </div>
  )
}

export default Edit
