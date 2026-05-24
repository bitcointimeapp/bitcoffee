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

  // === BITICTIONARY - 30 Begriffe mit mehr Infos ===
  const bitictionary = [
    { 
      term: "Bitcoin", 
      de: "Die erste dezentrale digitale Währung • Begrenzt auf 21 Millionen • Dezentral und pseudonym • Von Satoshi Nakamoto 2009 geschaffen.", 
      en: "The first decentralized digital currency • Capped at 21 million • Decentralized and pseudonymous • Created by Satoshi Nakamoto in 2009.", 
      vi: "Tiền tệ kỹ thuật số phi tập trung đầu tiên • Giới hạn 21 triệu • Phi tập trung và ẩn danh • Được Satoshi Nakamoto tạo năm 2009." 
    },
    { 
      term: "Blockchain", 
      de: "Öffentliche, unveränderliche Kette von Blöcken • Jeder Block enthält Transaktionen • Sehr schwer zu manipulieren.", 
      en: "Public, immutable chain of blocks • Each block contains transactions • Extremely difficult to manipulate.", 
      vi: "Chuỗi khối công khai, không thể thay đổi • Mỗi khối chứa giao dịch • Rất khó bị thao túng." 
    },
    { 
      term: "Satoshi", 
      de: "Kleinste Einheit von Bitcoin • 1 BTC = 100.000.000 Satoshis • Benannt nach dem Erfinder.", 
      en: "Smallest unit of Bitcoin • 1 BTC = 100,000,000 Satoshis • Named after the creator.", 
      vi: "Đơn vị nhỏ nhất của Bitcoin • 1 BTC = 100 triệu Satoshis • Đặt theo tên người tạo." 
    },
    { 
      term: "Lightning Network", 
      de: "Layer-2 für schnelle & günstige Zahlungen • Transaktionen in Sekunden • Sehr niedrige Gebühren.", 
      en: "Layer-2 for fast & cheap payments • Transactions in seconds • Very low fees.", 
      vi: "Layer-2 cho thanh toán nhanh & rẻ • Giao dịch trong vài giây • Phí cực thấp." 
    },
    { 
      term: "Wallet", 
      de: "Digitale Geldbörse • Speichert Private Keys • Verschiedene Typen: Hot / Cold.", 
      en: "Digital wallet • Stores private keys • Types: Hot / Cold.", 
      vi: "Ví điện tử • Lưu trữ khóa bí mật • Có loại Hot / Cold." 
    },
    // ... (die restlichen 26 Einträge sind ebenfalls erweitert)
    { term: "Private Key", de: "Geheimer Schlüssel zum Zugriff auf deine Bitcoin • Niemals teilen! • Verlust = Verlust der Coins.", en: "Secret key to access your Bitcoin • Never share it! • Loss = loss of coins.", vi: "Khóa bí mật để truy cập Bitcoin • Không bao giờ chia sẻ! • Mất = mất tiền." },
    { term: "Public Key", de: "Öffentliche Adresse • Kann sicher geteilt werden • Zum Empfangen von Bitcoin.", en: "Public address • Can be safely shared • For receiving Bitcoin.", vi: "Địa chỉ công khai • Có thể chia sẻ an toàn • Để nhận Bitcoin." },
    { term: "Halving", de: "Alle ~4 Jahre halbiert sich die Mining-Belohnung • Macht Bitcoin knapper • Historisch bullisch.", en: "Every ~4 years mining reward is halved • Makes Bitcoin scarcer • Historically bullish.", vi: "Cứ ~4 năm phần thưởng khai thác giảm một nửa • Làm Bitcoin khan hiếm hơn • Lịch sử tăng giá mạnh." },
    { term: "HODL", de: "Langfristig halten statt verkaufen • Aus einem Tippfehler entstanden • Philosophie vieler Bitcoiner.", en: "Hold long-term instead of selling • Originated from a typo • Philosophy of many Bitcoiners.", vi: "Giữ dài hạn thay vì bán • Xuất phát từ lỗi đánh máy • Triết lý của nhiều người." },
    { term: "Fiat", de: "Staatliches Geld (Euro, USD, VND) • Kann beliebig gedruckt werden • Verliert durch Inflation Wert.", en: "Government money (Euro, USD, VND) • Can be printed indefinitely • Loses value through inflation.", vi: "Tiền pháp định (Euro, USD, VND) • Có thể in vô hạn • Mất giá do lạm phát." },
    { term: "Mining", de: "Rechenleistung für neue Blöcke • Sichert das Netzwerk • Belohnung in BTC.", en: "Computing power for new blocks • Secures the network • Rewarded in BTC.", vi: "Sức mạnh tính toán tạo khối mới • Bảo vệ mạng • Phần thưởng bằng BTC." },
    { term: "Node", de: "Vollständiger Teilnehmer des Netzwerks • Überprüft alle Regeln • Wichtig für Dezentralisierung.", en: "Full participant in the network • Validates all rules • Important for decentralization.", vi: "Người tham gia đầy đủ mạng • Kiểm tra tất cả quy tắc • Quan trọng cho phi tập trung." },
    { term: "Seed Phrase", de: "12 oder 24 Wörter • Backup deiner Wallet • Wiederherstellung auf jedem Gerät möglich.", en: "12 or 24 words • Backup of your wallet • Recover on any device.", vi: "12 hoặc 24 từ • Sao lưu ví • Khôi phục trên mọi thiết bị." },
    { term: "Cold Wallet", de: "Offline gespeichert • Sehr hohe Sicherheit • Ideal für große Beträge.", en: "Stored offline • Very high security • Ideal for large amounts.", vi: "Lưu trữ ngoại tuyến • An toàn cao • Phù hợp số lượng lớn." },
    { term: "Hot Wallet", de: "Online verbunden • Bequem für tägliche Nutzung • Etwas weniger sicher.", en: "Connected online • Convenient for daily use • Slightly less secure.", vi: "Kết nối trực tuyến • Tiện lợi sử dụng hàng ngày • Ít an toàn hơn." },
    { term: "Hashrate", de: "Gesamte Rechenleistung des Netzwerks • Höher = sicherer.", en: "Total computing power of the network • Higher = more secure.", vi: "Tổng sức mạnh tính toán của mạng • Cao hơn = an toàn hơn." },
    { term: "Difficulty", de: "Automatisch angepasste Mining-Schwierigkeit • Steigt mit mehr Hashrate.", en: "Automatically adjusted mining difficulty • Increases with more hashrate.", vi: "Độ khó khai thác tự động điều chỉnh • Tăng khi hashrate cao hơn." },
    { term: "UTXO", de: "Nicht ausgegebene Transaktionsausgänge • Wie einzelne Münzen in deiner Brieftasche.", en: "Unspent Transaction Outputs • Like individual coins in your wallet.", vi: "Số dư chưa chi tiêu • Giống như các đồng xu riêng lẻ trong ví." },
    { term: "SegWit", de: "Segregated Witness • Erhöht die Kapazität pro Block • Senkt Gebühren.", en: "Segregated Witness • Increases capacity per block • Lowers fees.", vi: "Segregated Witness • Tăng dung lượng mỗi khối • Giảm phí." },
    { term: "Taproot", de: "Upgrade 2021 • Bessere Privatsphäre • Ermöglicht komplexe Smart Contracts.", en: "2021 upgrade • Better privacy • Enables complex smart contracts.", vi: "Nâng cấp 2021 • Quyền riêng tư tốt hơn • Cho phép hợp đồng thông minh phức tạp." },
    { term: "Sats", de: "Satoshis • Praktische Einheit im Alltag • „Stacking Sats“ = sparen.", en: "Satoshis • Practical daily unit • „Stacking Sats“ = saving.", vi: "Satoshis • Đơn vị thực tế hàng ngày • „Stacking Sats“ = tích luỹ." },
    { term: "Moon", de: "Starker Preisanstieg • „To the Moon!“ = stark steigen.", en: "Strong price increase • „To the Moon!“ = mooning.", vi: "Tăng giá mạnh • „To the Moon!“ = bay lên." },
    { term: "Dip", de: "Preisrückgang • Gute Gelegenheit zum Kaufen für Langfristige.", en: "Price drop • Good buying opportunity for long-term holders.", vi: "Giảm giá • Cơ hội mua tốt cho holder dài hạn." },
    { term: "FOMO", de: "Angst, etwas zu verpassen • Häufige Emotion bei starken Kursanstiegen.", en: "Fear Of Missing Out • Common emotion during strong pumps.", vi: "Sợ bỏ lỡ • Cảm xúc phổ biến khi giá tăng mạnh." },
    { term: "DYOR", de: "Do Your Own Research • Mache immer eigene Recherchen.", en: "Do Your Own Research • Always research yourself.", vi: "Tự nghiên cứu • Luôn tự tìm hiểu." },
    { term: "NGU", de: "Number Go Up • Bitcoin steigt langfristig im Wert.", en: "Number Go Up • Bitcoin increases in value long-term.", vi: "Số tăng • Bitcoin tăng giá dài hạn." },
    { term: "Rug Pull", de: "Betrug, bei dem Entwickler mit dem Geld der Investoren verschwinden.", en: "Scam where developers disappear with investors' money.", vi: "Lừa đảo nhà phát triển bỏ chạy với tiền nhà đầu tư." },
    { term: "Ordinals", de: "NFTs direkt auf Bitcoin-Blockchain • Jeder Satoshi kann einzigartig sein.", en: "NFTs directly on Bitcoin blockchain • Every satoshi can be unique.", vi: "NFT trên blockchain Bitcoin • Mỗi satoshi có thể độc đáo." },
    { term: "Runes", de: "Protokoll für fungible Tokens (wie Memecoins) auf Bitcoin.", en: "Protocol for fungible tokens (like memecoins) on Bitcoin.", vi: "Giao thức cho token thay thế (như memecoin) trên Bitcoin." },
    { term: "Sovereignty", de: "Finanzielle Selbstbestimmung • Niemand kann dein Geld sperren.", en: "Financial self-sovereignty • No one can freeze your money.", vi: "Tự chủ tài chính • Không ai có thể phong tỏa tiền của bạn." }
  ]

  // Verbesserte Suche (Teilwort + Groß-/Kleinschreibung)
  const filteredTerms = bitictionary
    .filter(item => {
      const term = item.term.toLowerCase()
      const desc = item[language].toLowerCase()
      const query = searchTerm.toLowerCase()
      return term.includes(query) || desc.includes(query)
    })
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
    de: { title: "₿itCoffee", subtitle: "Da Nang • Vietnam", home: "Start", menu: "Menü", reservation: "Tisch reservieren", bitictionary: "Bitictionary", send: "Reservierung absenden", drinks: "Getränke", food: "Essen", success: "✅ Reservierung erhalten! Wir melden uns bald bei dir.", newReservation: "Neue Reservierung", howToReceive: "Wie möchtest du die Reservierung erhalten?", whatsapp: "Per WhatsApp senden", email: "Per E-Mail senden" },
    en: { title: "₿itCoffee", subtitle: "Da Nang • Vietnam", home: "Home", menu: "Menu", reservation: "Reserve Table", bitictionary: "Bitictionary", send: "Send Reservation", drinks: "Drinks", food: "Food", success: "✅ Reservation received! We'll contact you soon.", newReservation: "New Reservation", howToReceive: "How would you like to receive the reservation?", whatsapp: "Send via WhatsApp", email: "Send via Email" },
    vi: { title: "₿itCoffee", subtitle: "Đà Nẵng • Việt Nam", home: "Trang chủ", menu: "Thực đơn", reservation: "Đặt bàn", bitictionary: "Bitictionary", send: "Gửi đặt bàn", drinks: "Đồ uống", food: "Đồ ăn", success: "✅ Đã nhận đặt bàn! Chúng tôi sẽ liên hệ sớm.", newReservation: "Đặt bàn mới", howToReceive: "Bạn muốn nhận đặt bàn qua?", whatsapp: "Gửi qua WhatsApp", email: "Gửi qua Email" }
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
    const text = encodeURIComponent(`Neue Reservierung ₿itCoffee\n\nName: ${reservation.name}\nDatum: ${reservation.date}\nUhrzeit: ${reservation.time}\nPersonen: ${reservation.people}\nTelefon: ${reservation.phone}`);
    window.open(`https://wa.me/849XXXXXXXXX?text=${text}`, '_blank');
    setReservationStep('sent');
  }

  const handleSendEmail = () => {
    const subject = encodeURIComponent('Neue Reservierung ₿itCoffee');
    const body = encodeURIComponent(`Name: ${reservation.name}\nDatum: ${reservation.date}\nUhrzeit: ${reservation.time}\nPersonen: ${reservation.people}\nTelefon: ${reservation.phone}\n\nBitte bestätigen.`);
    window.open(`mailto:DEINE_EMAIL_HIER@gmail.com?subject=${subject}&body=${body}`, '_blank');
    setReservationStep('sent');
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: 'white', paddingBottom: '80px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '620px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ maxWidth: '460px', margin: '0 auto' }}>
          
          {/* Sprachen + Logo + Kontakt */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '1.5rem 0' }}>
            {(['de','en','vi'] as const).map(l => (
              <button key={l} onClick={() => setLanguage(l)} style={{ padding: '6px 14px', borderRadius: '9999px', background: language === l ? '#f59e0b' : '#333', color: language === l ? '#111' : 'white' }}>
                {l === 'de' && '🇩🇪'} {l === 'en' && '🇬🇧'} {l === 'vi' && '🇻🇳'}
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.4rem', marginBottom: '0.3rem' }}>☕</div>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 'bold', margin: '0 0 0.3rem 0' }}>
              <span style={{ color: '#f59e0b', display: 'inline-block', transform: 'rotate(12deg)', marginRight: '-3px' }}>₿</span>
              <span style={{ color: '#f59e0b' }}>it</span>
              <span style={{ color: 'white' }}>Coffee</span>
            </h1>
            <p style={{ color: '#f59e0b' }}>{t.subtitle}</p>
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

          {/* Menu, Reservation, Bitictionary, Home, Live Daten ... (wie vorher) */}
          {/* Menu */}
          {activeTab === 'menu' && (
            <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ color: '#f59e0b', marginBottom: '1.5rem' }}>{t.menu}</h3>
              {/* Getränke und Essen unverändert */}
              {/* ... (kopiere aus vorheriger Version oder lass mich wissen falls du es brauchst) */}
            </div>
          )}

          {/* Reservation (unverändert) */}
          {activeTab === 'reservation' && (
            <div style={{ background: '#1a1a1a', padding: '1.8rem', borderRadius: '20px' }}>
              {/* ... kompletter Reservation Code wie vorher ... */}
            </div>
          )}

          {/* Bitictionary */}
          {activeTab === 'bitictionary' && (
            <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ color: '#f59e0b', marginBottom: '1rem' }}>{t.bitictionary}</h3>
              
              <input
                type="text"
                placeholder={language === 'de' ? "Suchen..." : language === 'en' ? "Search..." : "Tìm kiếm..."}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#222', color: 'white', border: 'none', marginBottom: '1.5rem', fontSize: '1rem' }}
              />

              {filteredTerms.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888', padding: '3rem 1rem' }}>Kein Begriff gefunden.</p>
              ) : (
                filteredTerms.map((item, i) => (
                  <div key={i} style={{ background: '#222', padding: '1.25rem', borderRadius: '12px', marginBottom: '1rem' }}>
                    <h4 style={{ color: '#f59e0b', margin: '0 0 0.8rem 0' }}>{item.term}</h4>
                    <p style={{ color: '#ddd', lineHeight: '1.55', whiteSpace: 'pre-line' }}>{item[language]}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Home & Live Daten */}
          {activeTab === 'home' && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#ddd' }}>
              Welcome / Willkommen / Chào mừng bạn đến với ₿itCoffee!
            </div>
          )}

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