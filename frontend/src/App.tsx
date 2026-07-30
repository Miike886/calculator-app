import { API_BASE_URL } from './config'

export function App() {
  return (
    <main className="app-shell">
      <section aria-labelledby="app-title" className="scaffold-panel">
        <h1 id="app-title">Calculator App</h1>
        <p>Initial scaffold ready for the calculator UI.</p>
        <small>API base URL: {API_BASE_URL}</small>
      </section>
    </main>
  )
}
