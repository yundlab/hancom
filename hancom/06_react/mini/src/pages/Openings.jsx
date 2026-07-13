import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CATEGORIES,
  CATEGORY_LIST,
  BOOKING_SITES,
  bookingSiteUrl,
} from '../data/records.js'
import { openDDay, openDDayLabel } from '../data/openings.js'
import CategoryBadge from '../components/CategoryBadge.jsx'
import FilterBar from '../components/FilterBar.jsx'
import SearchBar from '../components/SearchBar.jsx'

const EMPTY = {
  category: '콘서트',
  title: '',
  openDate: '',
  openTime: '',
  bookingSite: '인터파크',
  place: '',
  memo: '',
}

// 예매 오픈 알리미: 공연의 예매 오픈 일정을 등록하고 지난 일정까지 보관한다.
function Openings({ openings, onAdd, onUpdate, onDelete }) {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null) // null이면 추가, 값 있으면 수정
  const [form, setForm] = useState(EMPTY)
  const [query, setQuery] = useState('') // 제목 검색어
  const [filter, setFilter] = useState('전체') // 선택된 카테고리

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  // 새 일정 추가 모드로 폼 열기
  const openAddForm = () => {
    setEditId(null)
    setForm(EMPTY)
    setShowForm(true)
  }

  // 폼 닫기 + 초기화
  const closeForm = () => {
    setShowForm(false)
    setEditId(null)
    setForm(EMPTY)
  }

  // 항목 클릭 → 수정 모드로 폼 열기 (기존 값 채우기)
  const startEdit = (item) => {
    setForm({
      category: item.category,
      title: item.title,
      openDate: item.openDate,
      openTime: item.openTime || '',
      bookingSite: item.bookingSite,
      place: item.place || '',
      memo: item.memo || '',
    })
    setEditId(item.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.title.trim() === '') {
      alert('제목을 입력해주세요!')
      return
    }
    if (form.openDate === '') {
      alert('예매 오픈일을 선택해주세요!')
      return
    }
    const data = { ...form, poster: CATEGORIES[form.category].emoji }
    if (editId != null) onUpdate(editId, data)
    else onAdd(data)
    closeForm()
  }

  // 예매 완료: 예매 정보와 예매 오픈일(결제일)을 미리 채운 채 기록 등록 페이지로 이동
  const convertToRecord = (item) => {
    navigate('/new', {
      state: {
        fromOpening: {
          prefill: {
            category: item.category,
            title: item.title,
            bookedDate: item.openDate,
            bookingSite: item.bookingSite,
            place: item.place || '',
          },
        },
      },
    })
  }

  // 검색어 + 카테고리로 필터링
  const keyword = query.trim().toLowerCase()
  const filtered = openings.filter((o) => {
    const okSearch = keyword === '' || o.title.toLowerCase().includes(keyword)
    const okCategory = filter === '전체' || o.category === filter
    return okSearch && okCategory
  })

  // 예매 오픈일 가까운 순으로 정렬
  const sorted = [...filtered].sort((a, b) =>
    a.openDate.localeCompare(b.openDate)
  )

  return (
    <div className="openings">
      <div className="page-head">
        <div>
          <h2>🔔 예매 오픈 알리미</h2>
          <p className="page-sub">
            보고 싶은 공연의 예매 오픈 일정을 등록해두세요.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={showForm ? closeForm : openAddForm}
        >
          {showForm ? '닫기' : '+ 일정 등록'}
        </button>
      </div>

      {/* 제목 검색 */}
      <SearchBar value={query} onChange={setQuery} />

      <FilterBar current={filter} onChange={setFilter} />

      {/* 등록 / 수정 폼 */}
      {showForm && (
        <form className="record-form opening-form" onSubmit={handleSubmit}>
          <p className="form-heading">
            {editId != null ? '✏️ 예매 일정 수정' : '🔔 새 예매 일정'}
          </p>

          <div className="form-row">
            <label>
              카테고리
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORY_LIST.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORIES[c].emoji} {c}
                  </option>
                ))}
              </select>
            </label>
            <label>
              예매처
              <select
                name="bookingSite"
                value={form.bookingSite}
                onChange={handleChange}
              >
                {BOOKING_SITES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            제목
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="예) 아이유 콘서트"
            />
          </label>

          <div className="form-row">
            <label>
              예매 오픈일
              <input
                type="date"
                name="openDate"
                value={form.openDate}
                onChange={handleChange}
              />
            </label>
            <label>
              오픈 시각
              <input
                type="time"
                name="openTime"
                value={form.openTime}
                onChange={handleChange}
              />
            </label>
          </div>

          <label>
            예정 장소 (선택)
            <input
              type="text"
              name="place"
              value={form.place}
              onChange={handleChange}
              placeholder="예) KSPO DOME"
            />
          </label>

          <label>
            메모 (선택)
            <input
              type="text"
              name="memo"
              value={form.memo}
              onChange={handleChange}
              placeholder="예) 팬클럽 선예매 먼저!"
            />
          </label>

          <button type="submit" className="btn-primary">
            {editId != null ? '수정 완료' : '등록하기'}
          </button>
        </form>
      )}

      {/* 목록 */}
      {sorted.length === 0 ? (
        <p className="empty">
          {openings.length === 0
            ? '등록된 예매 일정이 없어요.'
            : '조건에 맞는 예매 일정이 없어요.'}
        </p>
      ) : (
        <div className="opening-list">
          {sorted.map((item) => {
            const dday = openDDay(item)
            const url = bookingSiteUrl(item.bookingSite)
            return (
              <div
                key={item.id}
                className={dday < 0 ? 'opening-item past' : 'opening-item'}
              >
                <div
                  className="opening-poster"
                  style={{ backgroundColor: CATEGORIES[item.category].color }}
                >
                  {item.poster}
                </div>

                {/* 정보 영역을 누르면 수정 */}
                <div
                  className="opening-info"
                  onClick={() => startEdit(item)}
                  title="클릭하면 수정"
                >
                  <div className="opening-top">
                    <CategoryBadge category={item.category} />
                    <span
                      className={
                        dday <= 0 ? 'dday-badge open now' : 'dday-badge open'
                      }
                    >
                      {openDDayLabel(item)}
                    </span>
                  </div>
                  <h3 className="opening-title">{item.title}</h3>
                  <p className="opening-when">
                    🗓 예매 오픈 {item.openDate}
                    {item.openTime && ` ${item.openTime}`}
                  </p>
                  <p className="opening-meta">
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="booking-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.bookingSite} ↗
                      </a>
                    ) : (
                      item.bookingSite
                    )}
                    {item.place && ` · ${item.place}`}
                  </p>
                  {item.memo && <p className="opening-memo">📝 {item.memo}</p>}
                </div>

                <div className="opening-actions">
                  <button
                    className="btn-convert"
                    onClick={(e) => {
                      e.stopPropagation()
                      convertToRecord(item)
                    }}
                  >
                    🎟️ 예매완료
                  </button>
                  <button
                    className="opening-del"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(item.id)
                    }}
                    aria-label="삭제"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Openings
