import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { RECORDS } from './data/records.js'
import { OPEN_SCHEDULES } from './data/openings.js'
import Home from './pages/Home.jsx'
import Detail from './pages/Detail.jsx'
import New from './pages/New.jsx'
import Edit from './pages/Edit.jsx'
import Stats from './pages/Stats.jsx'
import Calendar from './pages/Calendar.jsx'
import Openings from './pages/Openings.jsx'
import Splash from './components/Splash.jsx'
import './App.css'

// localStorage 저장 키. 새로고침해도 유지되도록 여기에 저장한다.
const STORAGE_KEY = 'culture-log:records'
const OPENINGS_KEY = 'culture-log:openings'

// 저장된 값을 불러온다. 없거나 읽기 실패 시 기본값(fallback)으로 시작.
function loadSaved(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved)
  } catch {
    // 파싱 실패 등은 무시하고 기본값 사용
  }
  return fallback
}

// 예전 목데이터가 localStorage에 남아 있어도 새 로컬 포스터로 마이그레이션한다.
// 사용자가 직접 추가하거나 사진을 바꾼 기록은 건드리지 않는다.
function migrateMockPosters(records) {
  let changed = false

  const next = records.map((record) => {
    const mock = RECORDS.find(
      (item) => item.id === record.id && item.title === record.title
    )
    if (!mock) return record

    const isLegacyImage =
      !record.image || record.image.startsWith('https://picsum.photos/')
    if (!isLegacyImage || record.image === mock.image) return record

    changed = true
    return { ...record, image: mock.image }
  })

  return changed ? next : records
}

function App() {
  // 앱 전체의 관람 기록 상태. 저장된 값이 있으면 그걸로, 없으면 목 데이터로 시작.
  const [records, setRecords] = useState(() =>
    migrateMockPosters(loadSaved(STORAGE_KEY, RECORDS))
  )
  // 예매 오픈 알리미 상태.
  const [openings, setOpenings] = useState(() =>
    loadSaved(OPENINGS_KEY, OPEN_SCHEDULES)
  )

  // 개발 서버의 빠른 새로고침으로 state가 유지된 경우에도 마이그레이션을 적용한다.
  useEffect(() => {
    setRecords((current) => migrateMockPosters(current))
  }, [])

  // 기록이 바뀔 때마다 localStorage에 저장 → 새로고침해도 유지된다.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    } catch {
      // 저장 용량(대략 5MB) 초과 등은 무시. 이번 세션 동안은 메모리로 동작.
    }
  }, [records])

  // 예매 일정도 저장.
  useEffect(() => {
    try {
      localStorage.setItem(OPENINGS_KEY, JSON.stringify(openings))
    } catch {
      // 무시
    }
  }, [openings])

  // 예매 일정 추가 / 삭제
  const addOpening = (item) => {
    const nextId =
      openings.length === 0 ? 1 : Math.max(...openings.map((o) => o.id)) + 1
    setOpenings([{ ...item, id: nextId }, ...openings])
  }
  const deleteOpening = (id) => {
    setOpenings(openings.filter((o) => o.id !== id))
  }
  const updateOpening = (id, updated) => {
    setOpenings(openings.map((o) => (o.id === id ? { ...updated, id } : o)))
  }

  // 사이트 첫 진입 시 보여줄 인트로 화면 표시 여부
  const [showSplash, setShowSplash] = useState(true)
  // 안정된 참조로 고정 — 매 렌더마다 새 함수가 생기면 Splash의 타이머가 리셋된다.
  const hideSplash = useCallback(() => setShowSplash(false), [])
  const playSplash = useCallback(() => setShowSplash(true), [])

  // 기록 추가: 새 id를 만들어 목록 맨 앞에 붙인다.
  // 예매 알림은 일정 아카이브이므로 기록을 추가해도 그대로 유지한다.
  const addRecord = (newRecord) => {
    const nextId =
      records.length === 0 ? 1 : Math.max(...records.map((r) => r.id)) + 1
    setRecords([{ ...newRecord, id: nextId }, ...records])
  }

  // 기록 삭제: 해당 id만 걸러낸다.
  const deleteRecord = (id) => {
    setRecords(records.filter((r) => r.id !== id))
  }

  // 기록 수정: 해당 id의 기록을 새 값으로 교체 (id는 유지)
  const updateRecord = (id, updated) => {
    setRecords(records.map((r) => (r.id === id ? { ...updated, id } : r)))
  }

  return (
    <BrowserRouter>
      {showSplash && <Splash onFinish={hideSplash} />}
      <header className="app-header">
        <NavLink to="/" className="logo" onClick={playSplash}>
          <svg
            className="logo-ticket"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M4 5h16a2 2 0 0 1 2 2v2.5a2.5 2.5 0 0 0 0 5V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2.5a2.5 2.5 0 0 0 0-5V7a2 2 0 0 1 2-2zm11 1H4a1 1 0 0 0-1 1v1.76a3.5 3.5 0 0 1 0 6.48V17a1 1 0 0 0 1 1h11V6z" />
          </svg>
          <span>Culture Log</span>
        </NavLink>
        <nav className="app-nav">
          <NavLink to="/" end>
            기록
          </NavLink>
          <NavLink to="/openings">예매</NavLink>
          <NavLink to="/calendar">캘린더</NavLink>
          <NavLink to="/stats">통계</NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={<Home records={records} onAdd={addRecord} />}
          />
          <Route
            path="/record/:id"
            element={<Detail records={records} onDelete={deleteRecord} />}
          />
          <Route path="/new" element={<New onAdd={addRecord} />} />
          <Route
            path="/edit/:id"
            element={<Edit records={records} onUpdate={updateRecord} />}
          />
          <Route path="/stats" element={<Stats records={records} />} />
          <Route
            path="/calendar"
            element={<Calendar records={records} openings={openings} />}
          />
          <Route
            path="/openings"
            element={
              <Openings
                openings={openings}
                onAdd={addOpening}
                onUpdate={updateOpening}
                onDelete={deleteOpening}
              />
            }
          />
        </Routes>
      </main>

      <footer className="app-footer">
        나의 문화생활 아카이브 · Culture Log
      </footer>
    </BrowserRouter>
  )
}

export default App
