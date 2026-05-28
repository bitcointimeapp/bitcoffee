import { useState, useEffect } from 'react'

type Language = 'de' | 'en' | 'vi'
type ViewMode = 'phone' | 'pad'

interface DictionaryItem {
  term: string
  de: string
  en: string
  vi: string
}

function App() {
  const [language, setLanguage] = useState<Language>('en')
  const [viewMode, setViewMode] = useState<ViewMode>('phone')
  const [searchTerm, setSearchTerm] = useState('')

  const [blockHeight, setBlockHeight] = useState<number | null>(null)
  const [btcPrice, setBtcPrice] = useState<any>(null)
  const [priceHistory, setPriceHistory] = useState<number[]>([])

  // === VOLLSTÄNDIGES BITICTIONARY ===
  const bitictionary: DictionaryItem[] = [
    // ... (alle deine Einträge bleiben hier) ...
    { term: "Bitcoin", de: "Die erste dezentrale digitale Währung • Begrenzt auf 21 Millionen • Dezentral und pseudonym • Von Satoshi Nakamoto 2009 geschaffen.", en: "The first decentralized digital currency • Capped at 21 million • Decentralized and pseudonymous • Created by Satoshi Nakamoto in 2009.", vi: "Tiền tệ kỹ thuật số phi tập trung đầu tiên • Giới hạn 21 triệu • Phi tập trung và ẩn danh • Được Satoshi Nakamoto tạo năm 2009." },
    // (kopiere alle Einträge aus deiner vorherigen Version hier rein)
    { term: "DYOR", de: "Do Your Own Research – eigene Recherche machen.", en: "Do Your Own Research.", vi: "Tự nghiên cứu." }
  ]

  const filteredTerms = bitictionary
    .filter((item): item is DictionaryItem => 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[language].toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.term.localeCompare(b.term))

  // Live Daten + Chart
  useEffect(() => {
    const fetchData = async () => {
      try {
        const blockRes = await fetch('https://mempool.space/api/blocks/tip/height')
        if (blockRes.ok) setBlockHeight(parseInt(await blockRes.text()))

        const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,vnd')
        if (priceRes.ok) {
          const data = await priceRes.json()
          setBtcPrice(data.bitcoin)
        }

        const historyRes = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=vnd&days=365&interval=daily')
        if (historyRes.ok) {
          const historyData = await historyRes.json()
          const prices = historyData.prices.map((item: [number, number]) => item[1])
          setPriceHistory(prices)
        }
      } catch (e) {
        console.error("API Fehler:", e)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 300000)
    return () => clearInterval(interval)
  }, [])

  const t = {
    de: { title: "₿itCoffee", subtitle: "Da Nang • Vietnam", bitictionary: "Bitictionary" },
    en: { title: "₿itCoffee", subtitle: "Da Nang • Vietnam", bitictionary: "Bitictionary" },
    vi: { title: "₿itCoffee", subtitle: "Đà Nẵng • Việt Nam", bitictionary: "Bitictionary" }
  }[language]

  const generateChartPoints = () => {
    if (priceHistory.length < 5) return "20,65 520,65";
    const max = Math.max(...priceHistory);
    const min = Math.min(...priceHistory);
    const range = max - min || 1;
    const points = priceHistory.map((price, index) => {
      const x = 20 + (index / (priceHistory.length - 1)) * 480;
      const y = 70 - ((price - min) / range) * 55;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    return points;
  }

  // Breiten
  const containerMaxWidth = viewMode === 'pad' ? '3000px' : '620px';
  const innerMaxWidth = viewMode === 'pad' ? '100%' : '460px';

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a', 
      color: 'white', 
      width: '100%',
      overflowX: 'hidden'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: containerMaxWidth,
        margin: '0 auto',
        padding: viewMode === 'pad' ? '0 2rem' : '0 1rem'   // Weniger Padding auf Pad
      }}>
        
        <div style={{ maxWidth: innerMaxWidth, margin: '0 auto' }}>

          {/* Hero Bild + Button */}
          <div style={{ position: 'relative' }}>
            <img 
              src="/bitcoffee-hero.png" 
              alt="BitCoffee" 
              style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '0 0 16px 16px' }} 
            />
            <button 
              onClick={() => setViewMode(viewMode === 'phone' ? 'pad' : 'phone')}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                padding: '8px 14px',
                fontSize: '0.9rem',
                background: 'rgba(245, 158, 11, 0.25)',
                color: '#111',
                border: 'none',
                borderRadius: '9999px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
              }}
            >
              {viewMode === 'phone' ? '📱 Phone' : '📟 Pad'}
            </button>
          </div>

          {/* Sprachen */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '1.5rem 0' }}>
            {(['de','en','vi'] as const).map(l => (
              <button key={l} onClick={() => setLanguage(l)} 
                style={{ padding: '6px 14px', borderRadius: '9999px', background: language === l ? '#f59e0b' : '#333', color: language === l ? '#111' : 'white' }}>
                {l === 'de' && '🇩🇪'} {l === 'en' && '🇬🇧'} {l === 'vi' && '🇻🇳'}
              </button>
            ))}
          </div>

          {/* Logo + Kontakt */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.8rem', marginBottom: '0.3rem' }}>☕</div>
            <h1 style={{ fontSize: '2.9rem', fontWeight: 'bold', margin: '0 0 0.3rem 0' }}>
              <span style={{ color: '#f59e0b', display: 'inline-block', transform: 'rotate(12deg)', marginRight: '-3px' }}>₿</span>
              <span style={{ color: '#f59e0b' }}>it</span>
              <span style={{ color: 'white' }}>Coffee</span>
            </h1>
            <p style={{ color: '#f59e0b' }}>{t.subtitle}</p>

            <div style={{ fontSize: '1rem', color: '#ddd', lineHeight: '1.6', marginTop: '1rem' }}>
              <p style={{ color: '#f59e0b', cursor: 'pointer', marginBottom: '4px' }} onClick={() => window.open('https://maps.google.com/?q=DEINE_VOLLE_ADRESSE_HIER', '_blank')}>📍 [Deine volle Adresse hier]</p>
              <p style={{ color: '#f59e0b', cursor: 'pointer', marginBottom: '4px' }} onClick={() => window.open('tel:+849XXXXXXXXX')}>📞 [+84 9XX XXX XXX]</p>
              <p style={{ color: '#f59e0b', cursor: 'pointer' }} onClick={() => window.open('https://x.com/21BitCoffee', '_blank')}>𝕏 @21BitCoffee</p>
            </div>
          </div>

          {/* Bitictionary Titel */}
          <div style={{ textAlign: 'center', margin: '2rem 0 1.5rem 0' }}>
            <h2 style={{ color: '#f59e0b', fontSize: '1.8rem' }}>{t.bitictionary}</h2>
          </div>

          {/* Bitictionary - mit kleinerem Padding auf sehr breiten Bildschirmen */}
          <div style={{ 
            width: '100%', 
            background: '#1a1a1a', 
            padding: viewMode === 'pad' ? '1.4rem' : '1.8rem', 
            borderRadius: '16px' 
          }}>
            <input
              type="text"
              placeholder={language === 'de' ? "Suchen..." : language === 'en' ? "Search..." : "Tìm kiếm..."}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                borderRadius: '12px', 
                background: '#222', 
                color: 'white', 
                border: 'none',
                marginBottom: '1.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />

            {filteredTerms.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', padding: '3rem 1rem' }}>Kein Begriff gefunden.</p>
            ) : (
              filteredTerms.map((item, i) => (
                <div key={i} style={{ 
                  background: '#222', 
                  padding: '1.25rem', 
                  borderRadius: '12px', 
                  marginBottom: '1rem' 
                }}>
                  <h4 style={{ color: '#f59e0b', margin: '0 0 0.8rem 0' }}>{item.term}</h4>
                  <p style={{ color: '#ddd', lineHeight: '1.55', whiteSpace: 'pre-line' }}>{item[language]}</p>
                </div>
              ))
            )}
          </div>

          {/* Live Chart */}
          <div style={{ 
            width: '100%', 
            marginTop: '2.5rem', 
            background: '#1a1a1a', 
            padding: viewMode === 'pad' ? '1.4rem' : '1.8rem', 
            borderRadius: '16px', 
            textAlign: 'center', 
            border: '1px solid #f59e0b' 
          }}>
            <div>Block Height: <span style={{ color: '#f59e0b' }}>{blockHeight ? `#${blockHeight.toLocaleString()}` : 'Laden...'}</span></div>
            <div style={{ marginTop: '6px', color: '#f59e0b', fontWeight: '600' }}>
              BTC: {btcPrice ? `$${btcPrice.usd.toLocaleString()} • €${btcPrice.eur.toLocaleString()} • ₫${(btcPrice.vnd/1000000000).toFixed(2)}B` : 'Laden...'}
            </div>

            <div style={{ margin: '16px 0 10px 0', minHeight: '90px' }}>
              {priceHistory.length > 5 ? (
                <svg width="100%" height="90" viewBox="0 0 520 90" style={{ filter: 'drop-shadow(0 4px 15px #f59e0b)' }}>
                  <polyline points={generateChartPoints()} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points={generateChartPoints()} fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                </svg>
              ) : (
                <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>Lade Bitcoin Chart...</div>
              )}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#f59e0b' }}>1-Year Bitcoin Chart</div>
          </div>

          {/* Copyright */}
          <div style={{ textAlign: 'center', marginTop: '3rem', color: '#666', fontSize: '0.85rem' }}>
            Copyright © <span style={{ color: '#f59e0b', cursor: 'pointer' }} onClick={() => window.open('https://x.com/BitcoinZeit', '_blank')}>BitcoinZeit</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App