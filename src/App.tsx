import { useState, useEffect } from 'react'

type Language = 'de' | 'en' | 'vi'
type Tab = 'home' | 'menu' | 'reservation' | 'bitictionary'

function App() {
  const [language, setLanguage] = useState<Language>('en')
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [blockHeight, setBlockHeight] = useState<number | null>(null)
  const [btcPrice, setBtcPrice] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Reservierung
  const [reservation, setReservation] = useState({ date: '', time: '', people: '2', name: '', phone: '' })
  const [reservationStep, setReservationStep] = useState<'form' | 'choice' | 'sent'>('form')

  // Menu Accordion
  const [openCategory, setOpenCategory] = useState<'drinks' | 'food' | null>('drinks')

  // === BITICTIONARY - 30 wichtige Begriffe ===
  const bitictionary = [
    { term: "Bitcoin", de: "Die erste dezentrale digitale Währung, geschaffen von Satoshi Nakamoto.", en: "The first decentralized digital currency, created by Satoshi Nakamoto.", vi: "Tiền tệ kỹ thuật số phi tập trung đầu tiên, được tạo bởi Satoshi Nakamoto." },
    { term: "Blockchain", de: "Eine öffentliche, unveränderliche Datenbank, die alle Transaktionen speichert.", en: "A public, immutable database that stores all transactions.", vi: "Cơ sở dữ liệu công khai, không thể thay đổi, lưu trữ tất cả giao dịch." },
    { term: "Satoshi", de: "Kleinste Einheit von Bitcoin (100 Millionen Satoshis = 1 BTC).", en: "Smallest unit of Bitcoin (100 million satoshis = 1 BTC).", vi: "Đơn vị nhỏ nhất của Bitcoin (100 triệu satoshi = 1 BTC)." },
    { term: "Lightning Network", de: "Layer-2-Lösung für extrem schnelle und günstige Bitcoin-Zahlungen.", en: "Layer-2 solution for extremely fast and cheap Bitcoin payments.", vi: "Giải pháp Layer-2 cho thanh toán Bitcoin cực nhanh và rẻ." },
    { term: "Wallet", de: "Digitale Geldbörse zum Verwalten von Bitcoin.", en: "Digital wallet to manage Bitcoin.", vi: "Ví điện tử để quản lý Bitcoin." },
    { term: "Private Key", de: "Geheimer Schlüssel – wer ihn hat, besitzt die Bitcoin.", en: "Secret key – whoever has it owns the Bitcoin.", vi: "Khóa bí mật – ai có nó sở hữu Bitcoin." },
    { term: "Public Key", de: "Öffentliche Adresse, an die man Bitcoin senden kann.", en: "Public address where Bitcoin can be sent.", vi: "Địa chỉ công khai để nhận Bitcoin." },
    { term: "Halving", de: "Alle 4 Jahre halbiert sich die Neuproduktion von Bitcoin.", en: "Every 4 years the new Bitcoin supply is halved.", vi: "Cứ 4 năm một lần lượng Bitcoin mới tạo ra giảm một nửa." },
    { term: "HODL", de: "Bitcoin langfristig halten statt verkaufen.", en: "Holding Bitcoin long-term instead of selling.", vi: "Giữ Bitcoin dài hạn thay vì bán." },
    { term: "Fiat", de: "Staatliches Geld wie Euro oder Dong (Gegenteil von Bitcoin).", en: "Government money like Euro or Dong (opposite of Bitcoin).", vi: "Tiền pháp định như Euro hoặc Đồng (ngược với Bitcoin)." },
    { term: "Mining", de: "Rechenleistung bereitstellen, um neue Blöcke zu erstellen und Bitcoin zu verdienen.", en: "Providing computing power to create new blocks and earn Bitcoin.", vi: "Cung cấp sức mạnh tính toán để tạo khối mới và kiếm Bitcoin." },
    { term: "Node", de: "Ein Computer, der das Bitcoin-Netzwerk mitbetreibt und validiert.", en: "A computer that runs and validates the Bitcoin network.", vi: "Máy tính tham gia và xác thực mạng Bitcoin." },
    { term: "Seed Phrase", de: "12–24 Wörter, mit denen man jede Wallet wiederherstellen kann.", en: "12–24 words to recover any wallet.", vi: "12–24 từ để khôi phục ví." },
    { term: "Cold Wallet", de: "Offline-Wallet (sehr sicher).", en: "Offline wallet (very secure).", vi: "Ví ngoại tuyến (rất an toàn)." },
    { term: "Hot Wallet", de: "Online-Wallet (bequemer, aber weniger sicher).", en: "Online wallet (more convenient, less secure).", vi: "Ví trực tuyến (tiện lợi hơn, ít an toàn hơn)." },
    { term: "Hashrate", de: "Gesamtrechenleistung des Bitcoin-Netzwerks.", en: "Total computing power of the Bitcoin network.", vi: "Tổng sức mạnh tính toán của mạng Bitcoin." },
    { term: "Difficulty", de: "Schwierigkeit des Minings, passt sich automatisch an.", en: "Mining difficulty that adjusts automatically.", vi: "Độ khó khai thác, tự động điều chỉnh." },
    { term: "UTXO", de: "Unspent Transaction Output – nicht ausgegebene Guthaben.", en: "Unspent Transaction Output – unspent funds.", vi: "Số dư chưa chi tiêu." },
    { term: "SegWit", de: "Technische Verbesserung, die mehr Transaktionen pro Block ermöglicht.", en: "Technical upgrade that allows more transactions per block.", vi: "Nâng cấp kỹ thuật cho phép nhiều giao dịch hơn mỗi khối." },
    { term: "Taproot", de: "Neueste Bitcoin-Upgrade für mehr Privatsphäre und Smart Contracts.", en: "Latest Bitcoin upgrade for better privacy and smart contracts.", vi: "Nâng cấp Bitcoin mới nhất cho quyền riêng tư và hợp đồng thông minh." },
    { term: "Sats", de: "Kurzform für Satoshis – die gebräuchliche Einheit im Alltag.", en: "Short for Satoshis – the common unit used daily.", vi: "Viết tắt của Satoshis – đơn vị phổ biến hàng ngày." },
    { term: "Moon", de: "Starker Kursanstieg (Slang).", en: "Strong price increase (slang).", vi: "Tăng giá mạnh (tiếng lóng)." },
    { term: "Dip", de: "Kurzer Preisrückgang – gute Kaufgelegenheit.", en: "Short price drop – good buying opportunity.", vi: "Giảm giá tạm thời – cơ hội mua tốt." },
    { term: "FOMO", de: "Fear Of Missing Out – Angst etwas zu verpassen.", en: "Fear Of Missing Out.", vi: "Sợ bỏ lỡ." },
    { term: "DYOR", de: "Do Your Own Research – mache deine eigene Recherche.", en: "Do Your Own Research.", vi: "Tự nghiên cứu đi." },
    { term: "NGU", de: "Number Go Up – Bitcoin steigt langfristig.", en: "Number Go Up – Bitcoin goes up long-term.", vi: "Số tăng – Bitcoin tăng dài hạn." },
    { term: "Rug Pull", de: "Betrug, bei dem Entwickler mit dem Geld verschwinden.", en: "Scam where developers run away with the money.", vi: "Lừa đảo khi nhà phát triển bỏ chạy với tiền." },
    { term: "Ordinals", de: "Bitcoin NFTs auf Satoshi-Ebene.", en: "Bitcoin NFTs on satoshi level.", vi: "NFT trên Bitcoin." },
    { term: "Runes", de: "Neues Protokoll für fungible Tokens auf Bitcoin.", en: "New protocol for fungible tokens on Bitcoin.", vi: "Giao thức mới cho token thay thế trên Bitcoin." },
    { term: "Sovereignty", de: "Finanzielle Selbstbestimmung durch Bitcoin.", en: "Financial self-sovereignty through Bitcoin.", vi: "Tự chủ tài chính qua Bitcoin." }
  ]

  // Gefilterte Begriffe
  const filteredTerms = bitictionary
    .filter(item => 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[language].toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.term.localeCompare(b.term))

  // Live Daten
  useEffect(() => {
    const fetchData = async () => {
      try {
        const blockRes = await fetch('https://mempool.space/api/blocks/tip/height')
        setBlockHeight(parseInt(await blockRes.text()))

        const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,vnd')
        const data = await priceRes.json()
        setBtcPrice(data.bitcoin)
      } catch (e) {}
    }
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const t = {
    de: { 
      title: "₿itCoffee", subtitle: "Da Nang • Vietnam", home: "Start", menu: "Menü", reservation: "Tisch reservieren", 
      bitictionary: "Bitictionary", send: "Reservierung absenden", drinks: "Getränke", food: "Essen",
      success: "✅ Reservierung erhalten! Wir melden uns bald bei dir.",
      newReservation: "Neue Reservierung",
      howToReceive: "Wie möchtest du die Reservierung erhalten?",
      whatsapp: "Per WhatsApp senden",
      email: "Per E-Mail senden"
    },
    en: { 
      title: "₿itCoffee", subtitle: "Da Nang • Vietnam", home: "Home", menu: "Menu", reservation: "Reserve Table", 
      bitictionary: "Bitictionary", send: "Send Reservation", drinks: "Drinks", food: "Food",
      success: "✅ Reservation received! We'll contact you soon.",
      newReservation: "New Reservation",
      howToReceive: "How would you like to receive the reservation?",
      whatsapp: "Send via WhatsApp",
      email: "Send via Email"
    },
    vi: { 
      title: "₿itCoffee", subtitle: "Đà Nẵng • Việt Nam", home: "Trang chủ", menu: "Thực đơn", reservation: "Đặt bàn", 
      bitictionary: "Bitictionary", send: "Gửi đặt bàn", drinks: "Đồ uống", food: "Đồ ăn",
      success: "✅ Đã nhận đặt bàn! Chúng tôi sẽ liên hệ sớm.",
      newReservation: "Đặt bàn mới",
      howToReceive: "Bạn muốn nhận đặt bàn qua?",
      whatsapp: "Gửi qua WhatsApp",
      email: "Gửi qua Email"
    }
  }[language]

  const calculateSats = (vndPrice: number) => {
    if (!btcPrice?.vnd) return '0';
    const sats = Math.round((vndPrice / btcPrice.vnd) * 100000000);
    return sats.toLocaleString();
  }

  const menuDrinks = [
    { name: "BitCoffee", priceVnd: 30000, emoji: "☕" },
    { name: "Cappuccino", priceVnd: 35000, emoji: "☕" },
    { name: "Espresso", priceVnd: 28000, emoji: "☕" },
    { name: "Café Latte", priceVnd: 40000, emoji: "☕" },
  ]

  const menuFood = [
    { name: "Avocado Toast", priceVnd: 95000, emoji: "🥐" },
    { name: "Pho Bo Mini", priceVnd: 85000, emoji: "🍜" },
    { name: "Banh Mi", priceVnd: 65000, emoji: "🥖" },
    { name: "Spring Rolls", priceVnd: 75000, emoji: "🌯" },
  ]

  const handleReservationSubmit = (e: any) => {
    e.preventDefault()
    setReservationStep('choice')
  }

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      `Neue Reservierung ₿itCoffee\n\n` +
      `Name: ${reservation.name}\n` +
      `Datum: ${reservation.date}\n` +
      `Uhrzeit: ${reservation.time}\n` +
      `Personen: ${reservation.people}\n` +
      `Telefon: ${reservation.phone}`
    );
    window.open(`https://wa.me/849XXXXXXXXX?text=${text}`, '_blank');
    setReservationStep('sent');
  }

  const handleSendEmail = () => {
    const subject = encodeURIComponent('Neue Reservierung ₿itCoffee');
    const body = encodeURIComponent(
      `Name: ${reservation.name}\n` +
      `Datum: ${reservation.date}\n` +
      `Uhrzeit: ${reservation.time}\n` +
      `Personen: ${reservation.people}\n` +
      `Telefon: ${reservation.phone}\n\nBitte bestätigen.`
    );
    window.open(`mailto:DEINE_EMAIL_HIER@gmail.com?subject=${subject}&body=${body}`, '_blank');
    setReservationStep('sent');
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a', 
      color: 'white', 
      paddingBottom: '80px',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '620px',
        margin: '0 auto',
        padding: '0 1rem' 
      }}>
        
        <div style={{ maxWidth: '460px', margin: '0 auto' }}>
          
          {/* Sprachen */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '1.5rem 0' }}>
            {(['de','en','vi'] as const).map(l => (
              <button key={l} onClick={() => setLanguage(l)} 
                style={{ padding: '6px 14px', borderRadius: '9999px', background: language === l ? '#f59e0b' : '#333', color: language === l ? '#111' : 'white' }}>
                {l === 'de' && '🇩🇪'} {l === 'en' && '🇬🇧'} {l === 'vi' && '🇻🇳'}
              </button>
            ))}
          </div>

          {/* Logo */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.4rem', marginBottom: '0.3rem' }}>☕</div>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 'bold', margin: '0 0 0.3rem 0' }}>
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

          {/* Tabs */}
          <div style={{ display: 'flex', background: '#1a1a1a', borderRadius: '9999px', padding: '4px', margin: '2.2rem 0' }}>
            {['home', 'menu', 'reservation', 'bitictionary'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as Tab)}
                style={{ flex: 1, padding: '12px', borderRadius: '9999px', fontWeight: '600', background: activeTab === tab ? '#f59e0b' : 'transparent', color: activeTab === tab ? '#111' : '#ccc' }}>
                {tab === 'home' && t.home}
                {tab === 'menu' && t.menu}
                {tab === 'reservation' && t.reservation}
                {tab === 'bitictionary' && t.bitictionary}
              </button>
            ))}
          </div>

          {/* Menu */}
          {activeTab === 'menu' && (
            <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ color: '#f59e0b', marginBottom: '1.5rem' }}>{t.menu}</h3>

              {/* Getränke */}
              <div onClick={() => setOpenCategory(openCategory === 'drinks' ? null : 'drinks')} style={{ cursor: 'pointer', padding: '12px', background: '#222', borderRadius: '12px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>{t.drinks}</span>
                  <span>{openCategory === 'drinks' ? '−' : '+'}</span>
                </div>
                {openCategory === 'drinks' && menuDrinks.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i !== menuDrinks.length-1 ? '1px solid #333' : 'none' }}>
                    <div><span style={{ marginRight: '10px' }}>{item.emoji}</span>{item.name}</div>
                    <div style={{ textAlign: 'right' }}>
                      <div>{item.priceVnd.toLocaleString()} VND</div>
                      <div style={{ color: '#f59e0b' }}>~{calculateSats(item.priceVnd)} Sats</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Essen */}
              <div onClick={() => setOpenCategory(openCategory === 'food' ? null : 'food')} style={{ cursor: 'pointer', padding: '12px', background: '#222', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>{t.food}</span>
                  <span>{openCategory === 'food' ? '−' : '+'}</span>
                </div>
                {openCategory === 'food' && menuFood.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i !== menuFood.length-1 ? '1px solid #333' : 'none' }}>
                    <div><span style={{ marginRight: '10px' }}>{item.emoji}</span>{item.name}</div>
                    <div style={{ textAlign: 'right' }}>
                      <div>{item.priceVnd.toLocaleString()} VND</div>
                      <div style={{ color: '#f59e0b' }}>~{calculateSats(item.priceVnd)} Sats</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reservation */}
          {activeTab === 'reservation' && (
            <div style={{ background: '#1a1a1a', padding: '1.8rem', borderRadius: '20px' }}>
              <h2 style={{ color: '#f59e0b', textAlign: 'center', marginBottom: '1.5rem' }}>{t.reservation}</h2>
              
              {reservationStep === 'sent' ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <p style={{ fontSize: '1.4rem', color: '#4ade80' }}>{t.success}</p>
                  <button onClick={() => { setReservationStep('form'); setReservation({ date: '', time: '', people: '2', name: '', phone: '' }); }} style={{ marginTop: '2rem', color: '#888', background: 'none', border: 'none' }}>
                    {t.newReservation}
                  </button>
                </div>
              ) : reservationStep === 'choice' ? (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ marginBottom: '1.5rem', color: '#ddd', fontSize: '1.1rem' }}>{t.howToReceive}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button onClick={handleSendWhatsApp} style={{ background: '#25D366', color: 'white', padding: '16px', borderRadius: '9999px', fontWeight: 'bold', border: 'none' }}>
                      📱 {t.whatsapp}
                    </button>
                    <button onClick={handleSendEmail} style={{ background: '#f59e0b', color: '#111', padding: '16px', borderRadius: '9999px', fontWeight: 'bold', border: 'none' }}>
                      ✉️ {t.email}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReservationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="date" value={reservation.date} onChange={e => setReservation({...reservation, date: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', background: '#222', color: 'white', border: 'none' }} />
                  <input type="time" value={reservation.time} onChange={e => setReservation({...reservation, time: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', background: '#222', color: 'white', border: 'none' }} />
                  <select value={reservation.people} onChange={e => setReservation({...reservation, people: e.target.value})} style={{ padding: '12px', borderRadius: '12px', background: '#222', color: 'white', border: 'none' }}>
                    <option value="1">1 Person</option><option value="2">2 Personen</option><option value="3">3 Personen</option><option value="4">4 Personen</option><option value="5">5+ Personen</option>
                  </select>
                  <input type="text" placeholder={language === 'de' ? "Dein Name" : language === 'en' ? "Your Name" : "Tên của bạn"} value={reservation.name} onChange={e => setReservation({...reservation, name: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', background: '#222', color: 'white', border: 'none' }} />
                  <input type="tel" placeholder={language === 'de' ? "Telefonnummer" : language === 'en' ? "Phone Number" : "Số điện thoại"} value={reservation.phone} onChange={e => setReservation({...reservation, phone: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', background: '#222', color: 'white', border: 'none' }} />
                  <button type="submit" style={{ background: '#f59e0b', color: '#111', padding: '16px', borderRadius: '9999px', fontWeight: 'bold' }}>{t.send}</button>
                </form>
              )}
            </div>
          )}

          {/* Bitictionary */}
          {activeTab === 'bitictionary' && (
            <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ color: '#f59e0b', marginBottom: '1rem' }}>{t.bitictionary}</h3>
              
              <input
                type="text"
                placeholder={language === 'de' ? "Suchen (z.B. Lightning, Satoshi...)" : language === 'en' ? "Search (e.g. Lightning, Satoshi...)" : "Tìm kiếm (ví dụ: Lightning, Satoshi...)"}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '12px', 
                  background: '#222', 
                  color: 'white', 
                  border: 'none',
                  marginBottom: '1.5rem',
                  fontSize: '1rem'
                }}
              />

              {filteredTerms.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888', padding: '3rem 1rem' }}>
                  Kein Begriff gefunden.
                </p>
              ) : (
                filteredTerms.map((item, i) => (
                  <div key={i} style={{ 
                    background: '#222', 
                    padding: '1.25rem', 
                    borderRadius: '12px', 
                    marginBottom: '1rem' 
                  }}>
                    <h4 style={{ color: '#f59e0b', margin: '0 0 0.8rem 0' }}>{item.term}</h4>
                    <p style={{ color: '#ddd', lineHeight: '1.55' }}>{item[language]}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Home */}
          {activeTab === 'home' && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#ddd' }}>
              Welcome / Willkommen / Chào mừng bạn đến với ₿itCoffee!
            </div>
          )}

          {/* Live Daten */}
          <div style={{ marginTop: '2.5rem', background: '#1a1a1a', padding: '14px', borderRadius: '16px', textAlign: 'center', fontSize: '0.95rem' }}>
            <div>Block Height: <span style={{ color: '#f59e0b' }}>{blockHeight ? `#${blockHeight.toLocaleString()}` : 'Laden...'}</span></div>
            <div style={{ marginTop: '6px' }}>
              BTC: {btcPrice ? `$${btcPrice.usd.toLocaleString()} • €${btcPrice.eur.toLocaleString()} • ₫${(btcPrice.vnd/1000000000).toFixed(2)}B` : 'Laden...'}</div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem', color: '#666', fontSize: '0.85rem' }}>
            Copyright © BitcoinZeit
          </div>
        </div>
      </div>
    </div>
  )
}

export default App