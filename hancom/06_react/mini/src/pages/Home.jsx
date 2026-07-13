import { useState } from 'react'
import RecordCard from '../components/RecordCard.jsx'
import FilterBar from '../components/FilterBar.jsx'
import RecordForm from '../components/RecordForm.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { pad, yearOf, monthOf } from '../data/utils.js'

// 목록 페이지: 카테고리 + 연도/월 필터 + 정렬 + 카드 그리드
function Home({ records, onAdd }) {
  const [showForm, setShowForm] = useState(false) // 기록 추가 폼 표시 여부
  const [query, setQuery] = useState('') // 제목 검색어
  const [filter, setFilter] = useState('전체') // 선택된 카테고리
  const [year, setYear] = useState('전체') // 선택된 연도
  const [month, setMonth] = useState('전체') // 선택된 월
  const [sort, setSort] = useState('latest') // latest(최신순) | rating(별점순) | price(금액순)

  // 데이터에 존재하는 연도 목록 뽑기 (중복 제거 후 내림차순)
  const years = [...new Set(records.map((r) => yearOf(r.date)))].sort().reverse()

  // 필터: 제목 검색 + 카테고리 + 연도 + 월 모두 만족하는 것만
  const keyword = query.trim().toLowerCase()
  let list = records.filter((r) => {
    const okSearch = keyword === '' || r.title.toLowerCase().includes(keyword)
    const okCategory = filter === '전체' || r.category === filter
    const okYear = year === '전체' || yearOf(r.date) === year
    const okMonth = month === '전체' || monthOf(r.date) === month
    return okSearch && okCategory && okYear && okMonth
  })

  // 정렬: 원본을 건드리지 않게 복사본([...list])을 정렬
  list = [...list].sort((a, b) => {
    if (sort === 'rating') {
      return b.rating - a.rating // 별점 높은 순
    }
    if (sort === 'price') {
      return b.price - a.price // 금액 높은 순
    }
    return b.date.localeCompare(a.date) // 날짜 최신순
  })

  // 기록 추가 후 폼 닫기
  const handleAdd = (record) => {
    onAdd(record)
    setShowForm(false)
  }

  return (
    <div>
      {/* 페이지 헤더 + 기록 추가 버튼 */}
      <div className="page-head">
        <div>
          <h2>🎬 나의 기록</h2>
          <p className="page-sub">
            지금까지 관람한 영화·공연·경기를 기록해두세요.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? '닫기' : '+ 기록 추가'}
        </button>
      </div>

      {/* 기록 추가 폼 (토글) */}
      {showForm && (
        <div className="inline-form">
          <p className="form-heading">📝 새 기록 일정</p>
          <RecordForm onSubmit={handleAdd} submitLabel="기록 추가하기" />
        </div>
      )}

      {/* 제목 검색 */}
      <SearchBar value={query} onChange={setQuery} />

      <FilterBar current={filter} onChange={setFilter} />

      {/* 연도 / 월 필터 */}
      <div className="date-filter">
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="전체">전체 연도</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="전체">전체 월</option>
          {/* 01 ~ 12월 */}
          {Array.from({ length: 12 }, (_, i) => pad(i + 1)).map((m) => (
            <option key={m} value={m}>
              {Number(m)}월
            </option>
          ))}
        </select>
      </div>

      <div className="list-toolbar">
        <span className="count">총 {list.length}건</span>
        <div className="sort-buttons">
          <button
            className={sort === 'latest' ? 'active' : ''}
            onClick={() => setSort('latest')}
          >
            최신순
          </button>
          <button
            className={sort === 'rating' ? 'active' : ''}
            onClick={() => setSort('rating')}
          >
            별점순
          </button>
          <button
            className={sort === 'price' ? 'active' : ''}
            onClick={() => setSort('price')}
          >
            금액순
          </button>
        </div>
      </div>

      {/* 결과가 없을 때 안내 */}
      {list.length === 0 ? (
        <p className="empty">조건에 맞는 기록이 없어요.</p>
      ) : (
        <div className="card-grid">
          {list.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
