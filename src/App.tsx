import { useState, useEffect } from 'react'

type Language = 'de' | 'en' | 'vi'
type ViewMode = 'phone' | 'pad'
type Tab = 'menu' | 'mining' | 'node' | 'bitictionary'

interface DictionaryItem {
  term: string
  de: string
  en: string
  vi: string
}

function App() {
  const [language, setLanguage] = useState<Language>('en')
  const [viewMode, setViewMode] = useState<ViewMode>('phone')
  const [activeTab, setActiveTab] = useState<Tab>('menu')
  const [searchTerm, setSearchTerm] = useState('')

  const [blockHeight, setBlockHeight] = useState<number | null>(null)
  const [btcPrice, setBtcPrice] = useState<any>(null)
  const [priceHistory, setPriceHistory] = useState<number[]>([])

  // === BITICTIONARY ===
  const bitictionary: DictionaryItem[] = [
  
  { term: "Bitcoin", 
      de: "Die erste dezentrale digitale Währung der Welt • Festgelegt auf maximal 21 Millionen Stück • Vollständig dezentral ohne Banken oder Regierungen • Pseudonym und zensurresistent • 2009 von Satoshi Nakamoto erschaffen.", 
      en: "The first decentralized digital currency in the world • Hard-capped at 21 million coins • Fully decentralized without banks or governments • Pseudonymous and censorship-resistant • Created in 2009 by Satoshi Nakamoto.", 
      vi: "Tiền tệ kỹ thuật số phi tập trung đầu tiên trên thế giới • Giới hạn cứng tối đa 21 triệu đồng • Hoàn toàn phi tập trung, không cần ngân hàng hay chính phủ • Ẩn danh và chống kiểm duyệt • Được Satoshi Nakamoto tạo ra năm 2009." },
    { term: "Blockchain", de: "Öffentliche, unveränderliche Kette von Blöcken • Jeder Block enthält Transaktionen • Sehr schwer zu manipulieren.", en: "Public, immutable chain of blocks • Each block contains transactions • Extremely difficult to manipulate.", vi: "Chuỗi khối công khai, không thể thay đổi • Mỗi khối chứa giao dịch • Rất khó bị thao túng." },
    { term: "Whitepaper", de: "Das Bitcoin Whitepaper von Satoshi Nakamoto (2008) • Beschreibt das Grundkonzept von Bitcoin • Titel: 'Bitcoin: A Peer-to-Peer Electronic Cash System'.", en: "Bitcoin Whitepaper by Satoshi Nakamoto (2008) • Describes the core concept of Bitcoin • Title: 'Bitcoin: A Peer-to-Peer Electronic Cash System'.", vi: "Whitepaper Bitcoin của Satoshi Nakamoto (2008) • Mô tả khái niệm cốt lõi • Tiêu đề: 'Bitcoin: A Peer-to-Peer Electronic Cash System'." },
    { term: "Satoshi Nakamoto", de: "Pseudonym des Bitcoin-Erfinders • Identität bis heute unbekannt • Veröffentlichte Whitepaper 2008 und Genesis Block 2009.", en: "Pseudonym of Bitcoin's creator • Identity still unknown • Published Whitepaper in 2008 and Genesis Block in 2009.", vi: "Bút danh của người tạo Bitcoin • Danh tính vẫn chưa biết • Công bố Whitepaper 2008 và Genesis Block 2009." },
    { term: "Satoshi", de: "Kleinste Einheit von Bitcoin • 1 BTC = 100.000.000 Satoshis • Benannt nach dem Erfinder.", en: "Smallest unit of Bitcoin • 1 BTC = 100,000,000 Satoshis • Named after the creator.", vi: "Đơn vị nhỏ nhất của Bitcoin • 1 BTC = 100 triệu Satoshis • Đặt theo tên người tạo." },
    { term: "Lightning Network", de: "Layer-2 für schnelle & günstige Zahlungen • Transaktionen in Sekunden • Sehr niedrige Gebühren.", en: "Layer-2 for fast & cheap payments • Transactions in seconds • Very low fees.", vi: "Layer-2 cho thanh toán nhanh & rẻ • Giao dịch trong vài giây • Phí cực thấp." },
    { term: "Wallet", de: "Digitale Geldbörse • Speichert Private Keys • Hot / Cold Varianten.", en: "Digital wallet • Stores private keys • Hot / Cold variants.", vi: "Ví điện tử • Lưu trữ khóa bí mật • Có loại Hot / Cold." },
    { term: "Private Key", de: "Geheimer Schlüssel • Niemals teilen • Verlust = Verlust der Bitcoin.", en: "Secret key • Never share • Loss = loss of coins.", vi: "Khóa bí mật • Không bao giờ chia sẻ • Mất = mất tiền." },
    { term: "Public Key", de: "Öffentliche Adresse • Kann geteilt werden • Zum Empfangen.", en: "Public address • Can be shared • For receiving.", vi: "Địa chỉ công khai • Có thể chia sẻ • Để nhận Bitcoin." },
    { term: "Halving", de: "Alle 210.000 Blöcke (~4 Jahre) halbiert sich die Mining-Belohnung • Macht Bitcoin knapper.", en: "Every 210,000 blocks (~4 years) mining reward is halved • Makes Bitcoin scarcer.", vi: "Cứ 210.000 khối (~4 năm) phần thưởng khai thác giảm một nửa • Làm Bitcoin khan hiếm hơn." },
    { term: "HODL", de: "Langfristig halten statt verkaufen • Aus Tippfehler entstanden • Bitcoiner-Philosophie.", en: "Hold long-term instead of selling • From a typo • Bitcoin philosophy.", vi: "Giữ dài hạn thay vì bán • Từ lỗi đánh máy • Triết lý Bitcoin." },
    { term: "Fiat", de: "Staatliches Geld (Euro, VND...) • Kommt vom lateinischen 'fiat' = 'es werde gemacht' • Kann beliebig vermehrt werden.", en: "Government money (Euro, VND...) • From Latin 'fiat' = 'let it be done' • Can be printed indefinitely.", vi: "Tiền pháp định • Từ tiếng Latin 'fiat' = 'hãy để nó được tạo ra' • Có thể in vô hạn." },
    { term: "Mining", de: "Rechenleistung für neue Blöcke • Sichert das Netzwerk • Belohnung in BTC.", en: "Computing power for new blocks • Secures the network • Rewarded in BTC.", vi: "Sức mạnh tính toán tạo khối • Bảo vệ mạng • Phần thưởng BTC." },
    { term: "Bitaxe 601 Miner", de: "Kleiner, energieeffizienter Solo-Miner • Ideal für Zuhause • Gut für Einsteiger.", en: "Small, energy-efficient solo miner • Great for home use • Good for beginners.", vi: "Máy đào Bitcoin nhỏ, tiết kiệm điện • Phù hợp dùng tại nhà • Tốt cho người mới." },
    { term: "Fullnode", de: "Vollständiger Bitcoin-Knoten • Speichert die komplette Blockchain • Erhöht Dezentralisierung und eigene Sicherheit.", en: "Full Bitcoin node • Stores the entire blockchain • Increases decentralization and your own security.", vi: "Nút Bitcoin đầy đủ • Lưu trữ toàn bộ blockchain • Tăng tính phi tập trung và an toàn cá nhân." },
    { term: "Blocktrainer Terminal", de: "Hardware-Terminal vom Blocktrainer • Zeigt Echtzeit-Infos, Mempool, Preis etc. • Perfekt für Cafés.", en: "Hardware terminal from Blocktrainer • Shows real-time info, mempool, price etc. • Perfect for cafés.", vi: "Thiết bị phần cứng từ Blocktrainer • Hiển thị thông tin thời gian thực, mempool • Hoàn hảo cho quán cà phê." },
    { term: "Mempool", de: "Warteschlange unbestätigter Transaktionen • Zeigt aktuelle Gebühren • https://mempool.blocktrainer.de", en: "Waiting area for unconfirmed transactions • Shows current fees • https://mempool.blocktrainer.de", vi: "Hàng chờ giao dịch chưa xác nhận • Hiển thị phí hiện tại • https://mempool.blocktrainer.de" },
    { term: "The Bitcoin Standard", de: "Buch von Saifedean Ammous • Erklärt Bitcoin als gesundes Geld • Sehr empfohlen.", en: "Book by Saifedean Ammous • Explains Bitcoin as sound money • Highly recommended.", vi: "Sách của Saifedean Ammous • Giải thích Bitcoin là tiền lành mạnh • Rất đáng đọc." },
    { term: "Hal Finney", de: "Erster Mensch, der eine Bitcoin-Transaktion von Satoshi erhielt (2009) • Früher Cypherpunk und Bitcoin-Entwickler.", en: "First person to receive a Bitcoin transaction from Satoshi (2009) • Early cypherpunk and Bitcoin developer.", vi: "Người đầu tiên nhận giao dịch Bitcoin từ Satoshi (2009) • Cypherpunk và lập trình viên Bitcoin sớm." },
    { term: "Cantillon-Effekt", de: "Neues Geld erreicht zuerst Banken und Reiche • Diese profitieren, bevor die Inflation alle trifft.", en: "New money reaches banks and rich first • They benefit before inflation hits everyone.", vi: "Tiền mới đến tay ngân hàng và người giàu trước • Họ hưởng lợi trước khi lạm phát lan ra." },
    { term: "Block Reward", de: "Belohnung für den Miner eines Blocks • Besteht aus neu geschaffenen BTC + Transaktionsgebühren.", en: "Reward for the miner of a block • New BTC + transaction fees.", vi: "Phần thưởng cho thợ đào khối • Bao gồm BTC mới + phí giao dịch." },
    { term: "FOMO", de: "Fear Of Missing Out • Angst, eine starke Kursbewegung zu verpassen.", en: "Fear Of Missing Out • Fear of missing a big price move.", vi: "Sợ bỏ lỡ • Sợ bỏ lỡ một đợt tăng giá mạnh." },
    { term: "Time Preference", de: "Hohe Zeitpräferenz = sofortige Belohnung • Niedrige Zeitpräferenz = langfristiges Denken (Bitcoin fördert das).", en: "High time preference = immediate reward • Low time preference = long-term thinking (Bitcoin encourages this).", vi: "Thời gian ưu tiên cao = thưởng ngay • Thấp = nghĩ dài hạn (Bitcoin khuyến khích)." },
    { term: "FUD", de: "Fear, Uncertainty, Doubt • Absichtliche Panikmache gegen Bitcoin.", en: "Fear, Uncertainty, Doubt • Deliberate panic against Bitcoin.", vi: "Sợ hãi, Không chắc chắn, Nghi ngờ • Tin đồn tiêu cực về Bitcoin." },
    { term: "Proof of Work (PoW)", de: "Konsensmechanismus • Miner lösen Rechenaufgaben • Macht Bitcoin extrem sicher.", en: "Consensus mechanism • Miners solve computational puzzles • Makes Bitcoin extremely secure.", vi: "Cơ chế đồng thuận • Thợ đào giải toán • Làm Bitcoin cực kỳ an toàn." },
    { term: "Genesis Block", de: "Erster Block der Bitcoin-Blockchain • 3. Januar 2009 • Enthält Nachricht über Bankenrettung.", en: "First block of the Bitcoin blockchain • January 3, 2009 • Contains message about bank bailouts.", vi: "Khối đầu tiên của blockchain Bitcoin • 3/1/2009 • Chứa thông điệp về cứu trợ ngân hàng." },
    { term: "2140", de: "Ca. im Jahr 2140 wird der letzte Bitcoin gemined • Danach nur noch Transaktionsgebühren.", en: "Around year 2140 the last Bitcoin will be mined • After that only transaction fees.", vi: "Khoảng năm 2140 Bitcoin cuối cùng sẽ được khai thác • Sau đó chỉ còn phí giao dịch." },
    { term: "Don’t Trust, Verify", de: "Bitcoin-Motto • Überprüfe alles selbst statt blind zu vertrauen.", en: "Bitcoin motto • Verify everything yourself instead of trusting blindly.", vi: "Khẩu hiệu Bitcoin • Tự kiểm chứng thay vì tin tưởng mù quáng." },
    { term: "Passphrase", de: "Zusätzliche Sicherung zur Seed Phrase • Erhöht die Sicherheit enorm • Auch '25. Wort' genannt.", en: "Additional protection for Seed Phrase • Greatly increases security • Also called '25th word'.", vi: "Bảo vệ thêm cho Seed Phrase • Tăng cường an toàn rất nhiều • Còn gọi là 'từ thứ 25'." },
    { term: "Hard Fork", de: "Nicht rückwärtskompatible Änderung der Regeln • Beispiel: Bitcoin Cash (2017) spaltete sich von Bitcoin ab.", en: "Non-backwards compatible rule change • Example: Bitcoin Cash (2017) split from Bitcoin.", vi: "Thay đổi quy tắc không tương thích ngược • Ví dụ: Bitcoin Cash tách ra năm 2017." },
    { term: "Soft Fork", de: "Rückwärtskompatible Änderung • Alte Nodes akzeptieren neue Blöcke • z.B. SegWit.", en: "Backwards compatible change • Old nodes accept new blocks • e.g. SegWit.", vi: "Thay đổi tương thích ngược • Node cũ vẫn chấp nhận khối mới • Ví dụ SegWit." },
    { term: "51% Attack", de: "Angriff, bei dem eine Gruppe mehr als 50% der Hashrate kontrolliert • Sehr teuer und bei Bitcoin extrem unwahrscheinlich.", en: "Attack where a group controls over 50% of hashrate • Very expensive and extremely unlikely on Bitcoin.", vi: "Tấn công kiểm soát hơn 50% hashrate • Rất tốn kém và cực kỳ khó xảy ra với Bitcoin." },
    { term: "Lindy Effect", de: "Je länger etwas existiert, desto wahrscheinlicher überlebt es weiter • Bitcoin wird mit der Zeit stärker.", en: "The longer something exists, the more likely it will continue to exist • Bitcoin gets stronger over time.", vi: "Càng tồn tại lâu, càng có khả năng tiếp tục tồn tại • Bitcoin càng mạnh theo thời gian." },
    { term: "Metcalfe's Law", de: "Netzwerkeffekt: Der Wert eines Netzwerks steigt quadratisch mit der Anzahl der Nutzer.", en: "Network effect: Value of a network grows quadratically with the number of users.", vi: "Hiệu ứng mạng: Giá trị mạng tăng bình phương theo số lượng người dùng." },
    { term: "The Problem Bitcoin Solves", de: "Doppelausgaben-Problem • Vertrauen in Dritte (Banken) • Inflation durch Gelddrucken.", en: "Double-spending problem • Trust in third parties (banks) • Inflation through money printing.", vi: "Vấn đề chi tiêu kép • Tin tưởng bên thứ ba (ngân hàng) • Lạm phát do in tiền." },
    { term: "Hot Wallet", de: "Mit dem Internet verbundene Wallet • Bequem, aber weniger sicher.", en: "Wallet connected to the internet • Convenient but less secure.", vi: "Ví kết nối internet • Tiện lợi nhưng ít an toàn hơn." },
    { term: "Cold Wallet", de: "Offline Wallet (Hardware oder Paper) • Sehr sicher für große Beträge.", en: "Offline wallet (hardware or paper) • Very secure for large amounts.", vi: "Ví ngoại tuyến (hardware hoặc giấy) • An toàn cao cho số lượng lớn." },
    { term: "SHA-256", de: "Kryptografische Hash-Funktion, die Bitcoin verwendet • Sehr sicher.", en: "Cryptographic hash function used by Bitcoin • Extremely secure.", vi: "Hàm băm mật mã mà Bitcoin sử dụng • Cực kỳ an toàn." },
    { term: "Hashrate", de: "Gesamte Rechenleistung des Bitcoin-Netzwerks • Maß für die Sicherheit.", en: "Total computing power of the Bitcoin network • Measure of security.", vi: "Tổng sức mạnh tính toán của mạng Bitcoin • Đo lường mức độ an toàn." },
    { term: "Merkle Root", de: "Hash aller Transaktionen in einem Block • Ermöglicht effiziente Überprüfung.", en: "Hash of all transactions in a block • Allows efficient verification.", vi: "Hash của tất cả giao dịch trong khối • Cho phép kiểm tra hiệu quả." },
    { term: "Elliptic Curve", de: "Mathematische Kurve, auf der die Kryptografie von Bitcoin basiert (ECDSA).", en: "Mathematical curve on which Bitcoin's cryptography is based (ECDSA).", vi: "Đường cong elliptic mà mật mã Bitcoin dựa vào (ECDSA)." },
    { term: "Orphan Block", de: "Gültiger Block, der nicht in die längste Kette aufgenommen wurde.", en: "Valid block that was not included in the longest chain.", vi: "Khối hợp lệ nhưng không nằm trong chuỗi dài nhất." },
    { term: "Seed Phrase", de: "12–24 Wörter Backup • Wiederherstellung auf jedem Gerät.", en: "12–24 word backup • Recover on any device.", vi: "Cụm từ khôi phục 12–24 từ." },
    { term: "Difficulty", de: "Automatisch angepasste Mining-Schwierigkeit alle 2016 Blöcke, ca. 14 Tage.", en: "Automatically adjusted mining difficulty every 2016 blocks, approx. 14 days", vi: "Độ khó khai thác được tự động điều chỉnh sau mỗi 2016 khối, khoảng 14 ngày." },
    { term: "UTXO (Unspent Transaction Output)", de: "Nicht ausgegebene Guthaben • Wie einzelne Münzen.", en: "Unspent funds • Like individual coins.", vi: "Số dư chưa chi tiêu." },
    { term: "SegWit", de: "Upgrade für mehr Transaktionen pro Block.", en: "Upgrade for more transactions per block.", vi: "Nâng cấp tăng giao dịch mỗi khối." },
    { term: "Taproot", de: "2021 Upgrade • Mehr Privatsphäre & Smart Contracts.", en: "2021 upgrade • Better privacy & smart contracts.", vi: "Nâng cấp 2021 • Quyền riêng tư tốt hơn." },
    { term: "DIP", de: "Preisrückgang • Gute Kaufgelegenheit.", en: "Price drop • Good buying opportunity.", vi: "Giảm giá tạm thời." },
    { term: "DYOR", de: "Do Your Own Research – eigene Recherche machen.", en: "Do Your Own Research.", vi: "Tự nghiên cứu." },
    { term: "Miner", de: "Ein Miner ist ein Computer, der mit hoher Rechenleistung neue Blöcke zur Bitcoin-Blockchain hinzufügt • Er sichert das Netzwerk, verifiziert Transaktionen und wird mit neu geschaffenen Bitcoins + Gebühren belohnt • Wichtig für die Dezentralität und Sicherheit von Bitcoin.", en: "A miner is a powerful computer that adds new blocks to the Bitcoin blockchain • It secures the network, verifies transactions and gets rewarded with newly created Bitcoin + fees • Essential for decentralization and security.", vi: "Miner là máy tính mạnh dùng để thêm khối mới vào blockchain Bitcoin • Họ bảo vệ mạng, xác minh giao dịch và nhận phần thưởng là Bitcoin mới + phí • Rất quan trọng cho tính phi tập trung và an ninh của Bitcoin." },
    { term: "Stratum V1", 
      de: "Älteres Protokoll für die Kommunikation zwischen Mining-Hardware und Mining-Pools • Hat mehrere Schwächen wie hohe Latenz, zentrale Kontrolle durch den Pool und schlechte Skalierbarkeit.", 
      en: "Older protocol for communication between mining hardware and mining pools • Has several weaknesses such as high latency, central control by the pool, and poor scalability.", 
      vi: "Giao thức cũ để giao tiếp giữa phần cứng đào và mining pool • Có nhiều nhược điểm như độ trễ cao, kiểm soát tập trung bởi pool và khả năng mở rộng kém." },
    { term: "Stratum V2", 
      de: "Moderne Weiterentwicklung von Stratum V1 • Ermöglicht Minern mehr Autonomie, bessere Effizienz, geringere Latenz und dezentralere Pool-Struktur • Der Miner kann selbst Transaktionen auswählen.", 
      en: "Modern evolution of Stratum V1 • Gives miners more autonomy, better efficiency, lower latency and a more decentralized pool structure • Miners can select transactions themselves.", 
      vi: "Phiên bản hiện đại của Stratum V1 • Cho phép miner có nhiều quyền tự chủ hơn, hiệu quả cao hơn, độ trễ thấp và cấu trúc pool phi tập trung hơn • Miner có thể tự chọn giao dịch." },
    { term: "Mining Pool", 
      de: "Zusammenschluss mehrerer Miner, die ihre Rechenleistung bündeln • Erhöht die Chance regelmäßige Belohnungen zu erhalten • Belohnung wird anteilig nach Hashrate verteilt.", 
      en: "Group of miners who combine their computing power • Increases the chance of regular payouts • Rewards are distributed proportionally based on hashrate.", 
      vi: "Nhóm các miner gộp sức mạnh tính toán • Tăng khả năng nhận thanh toán thường xuyên • Phần thưởng được chia theo tỷ lệ hashrate." },
    { term: "Bitcoin Address", 
      de: "Öffentliche Adresse, die aus dem Public Key berechnet wird • Wird mit Hash-Funktionen erzeugt • Dient zum Empfangen von Bitcoin und kann sicher geteilt werden.", 
      en: "Public address derived from the Public Key • Generated using hashing functions • Used to receive Bitcoin and can be safely shared.", 
      vi: "Địa chỉ công khai được tính từ Public Key • Được tạo bằng hàm hash • Dùng để nhận Bitcoin và có thể chia sẻ an toàn." },
    { term: "Mnemonic Phrase", 
      de: "Auch Seed Phrase genannt • 12–24 Wörter, die den Private Key ableiten • Ermöglicht die Wiederherstellung der Wallet auf jedem Gerät • Niemals teilen!", 
      en: "Also called Seed Phrase • 12–24 words that derive the Private Key • Allows wallet recovery on any device • Never share!", 
      vi: "Còn gọi là Seed Phrase • 12–24 từ tạo ra Private Key • Cho phép khôi phục ví trên bất kỳ thiết bị nào • Không bao giờ chia sẻ!" },
    { term: "Triffin Dilemma", 
      de: "Wirtschaftstheorie über den Konflikt einer Weltreservewährung • Ein Land muss gleichzeitig nationale und internationale Interessen bedienen • Führt langfristig zu Instabilität (wie beim US-Dollar).", 
      en: "Economic theory about the conflict of a world reserve currency • A country must serve both domestic and international interests • Leads to long-term instability (as seen with the US Dollar).", 
      vi: "Lý thuyết kinh tế về xung đột của tiền tệ dự trữ thế giới • Một quốc gia phải cân bằng lợi ích trong nước và quốc tế • Dẫn đến bất ổn dài hạn (như với USD)." },
    { term: "Michael Saylor", 
      de: "CEO von MicroStrategy • Einer der bekanntesten Bitcoin-Maximalisten • Kauft seit 2020 massiv Bitcoin für sein Unternehmen • Sieht Bitcoin als digitales Gold.", 
      en: "CEO of MicroStrategy • One of the most prominent Bitcoin maximalists • Has been aggressively buying Bitcoin since 2020 • Views Bitcoin as digital gold.", 
      vi: "CEO của MicroStrategy • Một trong những người ủng hộ Bitcoin nổi bật nhất • Đã mua mạnh Bitcoin từ năm 2020 • Coi Bitcoin là vàng kỹ thuật số." },
    { term: "MicroStrategy", 
      de: "Börsennotiertes Unternehmen unter Michael Saylor • Verfolgt die aggressivste Bitcoin-Strategie eines Unternehmens • Hält aktuell über 800.000 BTC als primäres Reservevermögen.", 
      en: "Public company led by Michael Saylor • Pursues the most aggressive corporate Bitcoin strategy • Currently holds over 800,000 BTC as primary reserve asset.", 
      vi: "Công ty niêm yết do Michael Saylor lãnh đạo • Theo đuổi chiến lược Bitcoin mạnh nhất trong các công ty • Hiện nắm giữ hơn 800.000 BTC làm tài sản dự trữ chính." },
    { term: "Block Header", 
      de: "Der Kopf eines Blocks (ca. 80 Bytes) • Enthält: Version, Hash des vorherigen Blocks, Merkle Root, Timestamp, Difficulty Target und Nonce • Wird für Mining und Verifizierung verwendet.", 
      en: "The header of a block (about 80 bytes) • Contains: Version, Previous Block Hash, Merkle Root, Timestamp, Difficulty Target and Nonce • Used for mining and verification.", 
      vi: "Phần đầu của khối (khoảng 80 byte) • Chứa: Version, Hash khối trước, Merkle Root, Timestamp, Difficulty Target và Nonce • Dùng cho mining và xác minh." },
    { term: "Block Body", 
      de: "Der eigentliche Inhalt eines Blocks • Enthält alle Transaktionen des Blocks • Die Transaktionen werden in einem Merkle Tree organisiert, dessen Root im Block Header steht.", 
      en: "The actual content of a block • Contains all transactions of the block • Transactions are organized in a Merkle Tree whose root is stored in the Block Header.", 
      vi: "Nội dung thực sự của khối • Chứa tất cả giao dịch trong khối • Các giao dịch được tổ chức trong Merkle Tree, Root nằm trong Block Header." },

    { term: "Nonce", 
      de: "Number Only Used Once • Eine zufällige Zahl, die Miner im Block Header verändern • Wird beim Mining solange angepasst, bis der Hash des Blocks den aktuellen Difficulty Target erfüllt • Kern des Proof-of-Work Mechanismus.", 
      en: "Number Only Used Once • A random number that miners change in the Block Header • Continuously adjusted during mining until the block hash meets the current Difficulty Target • Core of the Proof-of-Work mechanism.", 
      vi: "Number Only Used Once • Một số ngẫu nhiên mà miner thay đổi trong Block Header • Liên tục điều chỉnh trong quá trình đào cho đến khi hash của khối đáp ứng Difficulty Target • Là cốt lõi của cơ chế Proof-of-Work." },

    { term: "Bitcoin Trilemma", 
      de: "Das grundlegende Spannungsfeld von Bitcoin • Dezentralität • Skalierbarkeit • Sicherheit • Man kann immer nur zwei der drei Eigenschaften stark ausprägen • Bitcoin priorisiert Dezentralität und Sicherheit auf Kosten der Skalierbarkeit (Layer 1).", 
      en: "Bitcoin's fundamental trilemma • Decentralization • Scalability • Security • You can only strongly achieve two of the three • Bitcoin prioritizes decentralization and security at the expense of scalability (Layer 1).", 
      vi: "Tam giác cơ bản của Bitcoin • Phi tập trung • Khả năng mở rộng • An ninh • Chỉ có thể mạnh hai trong ba đặc tính • Bitcoin ưu tiên phi tập trung và an ninh, đánh đổi khả năng mở rộng (Layer 1)." },

    { term: "M2", 
      de: "Geldmengenaggregat M2 • Umfasst Bargeld, Sichteinlagen und kurzfristige Spareinlagen • Wichtiger Indikator für die Geldmenge in der Fiat-Wirtschaft • Starkes Wachstum von M2 führt oft zu Inflation und steigender Bitcoin-Nachfrage als Inflationsschutz.", 
      en: "M2 money supply • Includes cash, checking deposits and short-term savings • Key indicator of money supply in fiat economies • Strong M2 growth often leads to inflation and increased demand for Bitcoin as an inflation hedge.", 
      vi: "Cung tiền M2 • Bao gồm tiền mặt, tiền gửi vãng lai và tiền gửi tiết kiệm ngắn hạn • Chỉ số quan trọng về cung tiền trong kinh tế fiat • Tăng mạnh M2 thường dẫn đến lạm phát và nhu cầu Bitcoin tăng như hàng rào chống lạm phát." },

    { term: "Thermodynamik & Bitcoin", 
      de: "Bitcoin Mining folgt den Gesetzen der Thermodynamik • Erster Hauptsatz (Energieerhaltung): Eingangsenergie = ausgegebene Wärme + nutzbare Arbeit • Zweiter Hauptsatz: Jede Energieumwandlung erzeugt Entropie (Abwärme) • Mining wandelt Strom in Sicherheit des Netzwerks um.", 
      en: "Bitcoin mining follows the laws of thermodynamics • First Law (energy conservation): Input energy = waste heat + useful work • Second Law: Every energy conversion creates entropy (waste heat) • Mining converts electricity into network security.", 
      vi: "Bitcoin mining tuân theo định luật Nhiệt động lực học • Định luật thứ nhất (bảo toàn năng lượng): Năng lượng vào = nhiệt thải + công hữu ích • Định luật thứ hai: Mọi chuyển đổi năng lượng tạo entropy (nhiệt thải) • Mining chuyển hóa điện thành an ninh mạng." },

    { term: "Kardashev-Skala", 
      de: "Skala zur Messung der technologischen Entwicklung einer Zivilisation nach Energieverbrauch • Typ I: Planetare Energie • Typ II: Sternenenergie • Typ III: Galaktische Energie • Bitcoin Mining wird teilweise als Schritt in Richtung Typ I Zivilisation gesehen, da es überschüssige Energie nutzbar macht.", 
      en: "Scale for measuring a civilization's technological advancement by energy consumption • Type I: Planetary energy • Type II: Stellar energy • Type III: Galactic energy • Bitcoin mining is sometimes seen as a step toward a Type I civilization by making use of surplus energy.", 
      vi: "Thang đo sự phát triển công nghệ của nền văn minh theo mức tiêu thụ năng lượng • Loại I: Năng lượng hành tinh • Loại II: Năng lượng sao • Loại III: Năng lượng thiên hà • Bitcoin mining đôi khi được xem là bước tiến tới nền văn minh Loại I bằng cách tận dụng năng lượng dư thừa." }


  ]

  const filteredTerms = bitictionary
    .filter((item): item is DictionaryItem => 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[language].toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.term.localeCompare(b.term))

  // Live Daten
  useEffect(() => {
    const fetchData = async () => {
      try {
        const blockRes = await fetch('https://mempool.space/api/blocks/tip/height')
        if (blockRes.ok) setBlockHeight(parseInt(await blockRes.text()))

        const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,vnd')
        if (priceRes.ok) setBtcPrice((await priceRes.json()).bitcoin)

        const historyRes = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=vnd&days=365&interval=daily')
        if (historyRes.ok) {
          const data = await historyRes.json()
          setPriceHistory(data.prices.map((p: [number, number]) => p[1]))
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
    de: { subtitle: "Da Nang • Vietnam", bitictionary: "Bitictionary", menu: "Menü", mining: "Mining", node: "Node", openPdf: "PDF in neuem Tab öffnen" },
    en: { subtitle: "Da Nang • Vietnam", bitictionary: "Bitictionary", menu: "Menu", mining: "Mining", node: "Node", openPdf: "Open PDF in new tab" },
    vi: { subtitle: "Đà Nẵng • Việt Nam", bitictionary: "Bitictionary", menu: "Thực đơn", mining: "Mining", node: "Node", openPdf: "Mở PDF trong tab mới" }
  }[language]

  const generateChartPoints = () => {
    if (priceHistory.length < 5) return "20,65 520,65"
    const max = Math.max(...priceHistory)
    const min = Math.min(...priceHistory)
    const range = max - min || 1
    const points = priceHistory.map((price, index) => {
      const x = 20 + (index / (priceHistory.length - 1)) * 480
      const y = 70 - ((price - min) / range) * 55
      return `${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ')
    return points
  }

  const formatVND = (vnd: number) => {
    return (vnd / 1_000_000).toFixed(2) + "M"
  }

  const containerMaxWidth = viewMode === 'pad' ? '3000px' : '620px'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: 'white' }}>
      <div style={{ maxWidth: containerMaxWidth, margin: '0 auto', padding: '0 1rem' }}>

        {/* Hero Bild */}
        <div style={{ position: 'relative' }}>
          <img src="/bitcoffee-hero.png" alt="BitCoffee" style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '0 0 16px 16px' }} />
          <button onClick={() => setViewMode(viewMode === 'phone' ? 'pad' : 'phone')}
            style={{ position: 'absolute', top: '20px', left: '20px', padding: '8px 16px', background: 'rgba(245,158,11,0.3)', color: '#111', border: 'none', borderRadius: '9999px', fontWeight: 'bold' }}>
            {viewMode === 'phone' ? '📱 Phone' : '📟 Pad'}
          </button>
        </div>

        {/* Sprachen */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '25px 0' }}>
          {(['de','en','vi'] as const).map(l => (
            <button key={l} onClick={() => setLanguage(l)}
              style={{ padding: '8px 16px', borderRadius: '9999px', background: language === l ? '#f59e0b' : '#333', color: language === l ? '#111' : 'white' }}>
              {l === 'de' && '🇩🇪'} {l === 'en' && '🇬🇧'} {l === 'vi' && '🇻🇳'}
            </button>
          ))}
        </div>

       {/* === LOGO (Custom Logo deines Freundes) === */}
<div style={{ textAlign: 'center', marginBottom: '20px' }}>
  <img 
    src="/bitcoffee-logo.png" 
    alt="BitCoffee Logo" 
    style={{ 
      maxWidth: '420px', 
      width: '90%', 
      height: 'auto',
      marginBottom: '8px'
    }} 
  />
  <p style={{ color: '#f59e0b', marginTop: '4px', fontSize: '1.1rem' }}>
    {t.subtitle}
  </p>
</div>
        {/* Kontakt */}
        <div style={{ textAlign: 'center', color: '#ddd', fontSize: '0.95rem', marginBottom: '25px', lineHeight: '1.7' }}>
          <p style={{ color: '#f59e0b', cursor: 'pointer' }} onClick={() => window.open('https://maps.google.com/?q=1 Nguyễn Đăng Giai, Đà Nẵng', '_blank')}>📍 1 Nguyễn Đăng Giai, Đà Nẵng</p>
          <p style={{ color: '#f59e0b', cursor: 'pointer' }} onClick={() => window.open('https://x.com/21BitCoffee', '_blank')}>𝕏 @21BitCoffee</p>
        </div>

        {/* 4 Reiter */}
        <div style={{ display: 'flex', background: '#1a1a1a', borderRadius: '9999px', padding: '4px', margin: '20px 0' }}>
          {[
            { key: 'menu' as Tab, label: t.menu },
            { key: 'mining' as Tab, label: t.mining },
            { key: 'node' as Tab, label: t.node },
            { key: 'bitictionary' as Tab, label: t.bitictionary }
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ flex: 1, padding: '14px', borderRadius: '9999px', fontWeight: '600', background: activeTab === tab.key ? '#f59e0b' : 'transparent', color: activeTab === tab.key ? '#111' : '#ccc', border: 'none', cursor: 'pointer' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* === MENÜ === */}
{activeTab === 'menu' && (
  <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '16px' }}>
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <a 
        href="/menu.pdf" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          background: '#f59e0b',
          color: '#111',
          padding: '14px 36px',
          borderRadius: '9999px',
          fontWeight: 'bold',
          textDecoration: 'none',
          fontSize: '1.05rem'
        }}
      >
        {t.openPdf} ↗
      </a>
    </div>

    {/* PDF mit Cache-Busting */}
    <iframe 
      src={`/menu.pdf?v=${Date.now()}`} 
      style={{ 
        width: '100%', 
        height: '1300px', 
        minHeight: '85vh',
        border: 'none', 
        borderRadius: '16px', 
        background: 'white' 
      }} 
      title="BitCoffee Menu" 
    />
  </div>
)}

        {/* === MINING === */}
        {activeTab === 'mining' && (
          <div style={{ background: '#1a1a1a', padding: '2rem', borderRadius: '16px' }}>
            {language === 'de' && (
              <>
                <h2 style={{ color: '#f59e0b', marginBottom: '1.5rem' }}>Was ist Bitcoin Mining?</h2>
                <div style={{ color: '#ddd', lineHeight: '1.7', fontSize: '1.05rem' }}>
                 
                  <p>Stell dir Bitcoin wie ein riesiges, dezentrales Kassenbuch vor, das von Tausenden Computern weltweit gleichzeitig geführt wird. Damit neue Transaktionen in dieses Kassenbuch aufgenommen werden dürfen, müssen Computer darum „wetteifern“, wer als nächstes einen neuen Block hinzufügen darf.</p>
                  <p>Dieser Wettbewerb heißt <strong>Mining</strong>. Die Computer, die daran teilnehmen, nennt man <strong>Miner</strong>. Sie lösen extrem schwierige Rechenaufgaben. Wer als Erster die richtige Lösung findet, darf den neuen Block hinzufügen und wird mit neuen Bitcoins belohnt.</p>

                  <p style={{ marginTop: '1.5rem' }}><strong>Warum braucht Bitcoin Mining?</strong></p>
                  <ul style={{ paddingLeft: '1.2rem' }}>
                    <li> Es sorgt dafür, dass neue Bitcoins kontrolliert und langsam in Umlauf kommen (max. 21 Millionen)</li>
                    <li> Es schützt das Netzwerk vor Betrug und Fälschungen</li>
                    <li> Es macht Bitcoin dezentral – niemand kann allein das System kontrollieren</li>
                  </ul>

                  <p style={{ marginTop: '1.5rem' }}><strong>Wie funktioniert Mining technisch?</strong></p>
                  <p>Miner nehmen alle aktuellen Transaktionen, packen sie in einen Block und versuchen, einen speziellen „Stempel“ (Hash) zu finden, der mit vielen Nullen beginnt. Dafür verändern sie ständig eine Zufallszahl im Block (die <strong>Nonce</strong>), bis der Hash die richtige Form hat. Das ist extrem rechenintensiv und verbraucht viel Strom – genau das macht Bitcoin sicher.</p>

                  <p style={{ marginTop: '1.5rem' }}><strong>Wichtige Begriffe:</strong></p>
                  <ul style={{ paddingLeft: '1.2rem' }}>
                    <li><strong>Hashrate</strong> → Die gesamte Rechenleistung aller Miner weltweit</li>
                    <li><strong>Difficulty</strong> → Wie schwer es gerade ist, einen gültigen Block zu finden</li>
                    <li><strong>Block Reward</strong> → Die Belohnung für das Finden eines Blocks (aktuell 3,125 BTC + Gebühren)</li>
                    <li><strong>Halving</strong> → Alle 4 Jahre halbiert sich die Block-Belohnung</li>
                  </ul>
                </div>
              </>
            )}

            {language === 'en' && (
              <>
                <h2 style={{ color: '#f59e0b', marginBottom: '1.5rem' }}>What is Bitcoin Mining?</h2>
                <div style={{ color: '#ddd', lineHeight: '1.7', fontSize: '1.05rem' }}>
               
                  <p>Think of Bitcoin as a giant, decentralized ledger that is maintained by thousands of computers around the world at the same time. For new transactions to be added to this ledger, computers compete to be the next one to add a new "page" (block).</p>
                  <p>This competition is called <strong>Mining</strong>. The computers participating are called <strong>Miners</strong>. They solve extremely difficult mathematical problems. Whoever finds the correct solution first gets to add the new block and is rewarded with new Bitcoins.</p>

                  <p style={{ marginTop: '1.5rem' }}><strong>Why does Bitcoin need mining?</strong></p>
                  <ul style={{ paddingLeft: '1.2rem' }}>
                    <li> It ensures new Bitcoins are released in a controlled and slow manner (max 21 million)</li>
                    <li> It protects the network from fraud and counterfeiting</li>
                    <li> It makes Bitcoin decentralized – no single entity can control the system</li>
                  </ul>

                  <p style={{ marginTop: '1.5rem' }}><strong>How does mining work technically?</strong></p>
                  <p>Miners take all current transactions, put them into a block, and try to find a special "stamp" (hash) that starts with many zeros. To do this, they constantly change a random number in the block (the <strong>Nonce</strong>) until the hash has the correct form. This is extremely computationally intensive and consumes a lot of electricity – which is exactly what makes Bitcoin secure.</p>

                  <p style={{ marginTop: '1.5rem' }}><strong>Key terms:</strong></p>
                  <ul style={{ paddingLeft: '1.2rem' }}>
                    <li><strong>Hashrate</strong> → The total computing power of all miners worldwide</li>
                    <li><strong>Difficulty</strong> → How hard it currently is to find a valid block</li>
                    <li><strong>Block Reward</strong> → The reward for finding a block (currently 3.125 BTC + fees)</li>
                    <li><strong>Halving</strong> → Every 4 years the block reward is halved</li>
                  </ul>
                </div>
              </>
            )}

            {language === 'vi' && (
              <>
                <h2 style={{ color: '#f59e0b', marginBottom: '1.5rem' }}>Bitcoin Mining là gì?</h2>
                <div style={{ color: '#ddd', lineHeight: '1.7', fontSize: '1.05rem' }}>
           
                  <p>Hãy tưởng tượng Bitcoin như một cuốn sổ cái khổng lồ, phi tập trung được duy trì bởi hàng nghìn máy tính trên toàn thế giới cùng lúc. Để các giao dịch mới được ghi vào sổ cái này, các máy tính phải cạnh tranh để trở thành người tiếp theo thêm một "trang" mới (khối).</p>
                  <p>Cuộc cạnh tranh này được gọi là <strong>Mining</strong>. Những máy tính tham gia được gọi là <strong>Miner</strong>. Họ giải các bài toán toán học cực kỳ khó. Ai tìm ra lời giải đúng đầu tiên sẽ được thêm khối mới và nhận phần thưởng là Bitcoin mới.</p>

                  <p style={{ marginTop: '1.5rem' }}><strong>Tại sao Bitcoin cần Mining?</strong></p>
                  <ul style={{ paddingLeft: '1.2rem' }}>
                    <li> Đảm bảo Bitcoin mới được phát hành có kiểm soát và chậm rãi (tối đa 21 triệu)</li>
                    <li> Bảo vệ mạng lưới khỏi gian lận và làm giả</li>
                    <li> Giúp Bitcoin phi tập trung – không ai có thể kiểm soát hệ thống một mình</li>
                  </ul>

                  <p style={{ marginTop: '1.5rem' }}><strong>Mining hoạt động như thế nào về mặt kỹ thuật?</strong></p>
                  <p>Miner lấy tất cả giao dịch hiện tại, đóng gói chúng vào một khối và cố gắng tìm một "con dấu" đặc biệt (hash) bắt đầu bằng nhiều số 0. Để làm điều này, họ liên tục thay đổi một số ngẫu nhiên trong khối (gọi là <strong>Nonce</strong>) cho đến khi hash có dạng đúng. Việc này đòi hỏi sức mạnh tính toán cực lớn và tiêu tốn rất nhiều điện – chính điều này làm cho Bitcoin trở nên an toàn.</p>

                  <p style={{ marginTop: '1.5rem' }}><strong>Các thuật ngữ quan trọng:</strong></p>
                  <ul style={{ paddingLeft: '1.2rem' }}>
                    <li><strong>Hashrate</strong> → Tổng sức mạnh tính toán của tất cả miner trên toàn cầu</li>
                    <li><strong>Difficulty</strong> → Độ khó hiện tại để tìm một khối hợp lệ</li>
                    <li><strong>Block Reward</strong> → Phần thưởng khi tìm được khối (hiện tại 3.125 BTC + phí)</li>
                    <li><strong>Halving</strong> → Cứ 4 năm một lần phần thưởng khối bị giảm một nửa</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {/* === NODE === */}
        {activeTab === 'node' && (
          <div style={{ background: '#1a1a1a', padding: '2rem', borderRadius: '16px' }}>
            {language === 'de' && (
              <>
                <h2 style={{ color: '#f59e0b', marginBottom: '1.5rem' }}>Was ist ein Bitcoin Node?</h2>
                <div style={{ color: '#ddd', lineHeight: '1.7', fontSize: '1.05rem' }}>
                  
                  <p>Ein <strong>Bitcoin Node</strong> ist ein Computer, der die komplette Bitcoin-Blockchain herunterlädt und ständig mit anderen Computern auf der Welt synchronisiert. Er überprüft jede einzelne Transaktion und jeden Block selbstständig, ohne auf irgendjemand anderen vertrauen zu müssen.</p>
                  <p>Wenn du nur eine Wallet-App auf deinem Handy nutzt, vertraust du darauf, dass jemand anderes dir die richtigen Informationen gibt. Ein Full Node vertraut niemandem – er prüft alles selbst.</p>

                  <p style={{ marginTop: '1.5rem' }}><strong>Warum sollte man einen Node betreiben?</strong></p>
                  <ul style={{ paddingLeft: '1.2rem' }}>
                    <li> Du bist wirklich unabhängig und musst niemandem vertrauen</li>
                    <li> Du hilfst, das Bitcoin-Netzwerk dezentral und sicher zu halten</li>
                    <li> Du kannst selbst Transaktionen validieren und senden</li>
                    <li> Du unterstützt die Zensurresistenz von Bitcoin</li>
                  </ul>

                  <p style={{ marginTop: '1.5rem' }}><strong>Was macht ein Full Node genau?</strong></p>
                  <p>Ein Full Node lädt die gesamte Blockchain herunter und prüft jede Transaktion und jeden Block nach den Regeln von Bitcoin. Er lehnt ungültige Blöcke und Transaktionen automatisch ab. Dadurch trägt er aktiv zur Sicherheit und Dezentralität des Netzwerks bei.</p>

                  <p style={{ marginTop: '1.5rem' }}><strong>Wichtige Begriffe:</strong></p>
                  <ul style={{ paddingLeft: '1.2rem' }}>
                    <li><strong>Full Node</strong> → Speichert die komplette Blockchain und validiert alles selbst</li>
                    <li><strong>Light Node / SPV</strong> → Nur eine vereinfachte Version (z.B. Handy-Wallets)</li>
                    <li><strong>Pruned Node</strong> → Speichert nur die letzten Blöcke, um Speicherplatz zu sparen</li>
                    <li><strong>Running a Node</strong> → Der wichtigste Beitrag, den ein einzelner Mensch für Bitcoin leisten kann</li>
                  </ul>
                </div>
              </>
            )}

            {language === 'en' && (
              <>
                <h2 style={{ color: '#f59e0b', marginBottom: '1.5rem' }}>What is a Bitcoin Node?</h2>
                <div style={{ color: '#ddd', lineHeight: '1.7', fontSize: '1.05rem' }}>
                 
                  <p>A <strong>Bitcoin Node</strong> is a computer that downloads the entire Bitcoin blockchain and constantly synchronizes with other computers around the world. It independently verifies every single transaction and every block without having to trust anyone else.</p>
                  <p>If you only use a wallet app on your phone, you trust that someone else is giving you the correct information. A Full Node trusts no one – it verifies everything itself.</p>

                  <p style={{ marginTop: '1.5rem' }}><strong>Why should you run a node?</strong></p>
                  <ul style={{ paddingLeft: '1.2rem' }}>
                    <li> You are truly independent and don’t have to trust anyone</li>
                    <li> You help keep the Bitcoin network decentralized and secure</li>
                    <li> You can validate and send transactions yourself</li>
                    <li> You support Bitcoin’s censorship resistance</li>
                  </ul>

                  <p style={{ marginTop: '1.5rem' }}><strong>What does a Full Node actually do?</strong></p>
                  <p>A Full Node downloads the entire blockchain and checks every transaction and every block according to Bitcoin’s rules. It automatically rejects invalid blocks and transactions. This actively contributes to the security and decentralization of the network.</p>

                  <p style={{ marginTop: '1.5rem' }}><strong>Key terms:</strong></p>
                  <ul style={{ paddingLeft: '1.2rem' }}>
                    <li><strong>Full Node</strong> → Stores the complete blockchain and validates everything itself</li>
                    <li><strong>Light Node / SPV</strong> → A simplified version (e.g. mobile wallets)</li>
                    <li><strong>Pruned Node</strong> → Only stores the most recent blocks to save storage space</li>
                    <li><strong>Running a Node</strong> → The most important contribution an individual can make to Bitcoin</li>
                  </ul>
                </div>
              </>
            )}

            {language === 'vi' && (
              <>
                <h2 style={{ color: '#f59e0b', marginBottom: '1.5rem' }}>Bitcoin Node là gì?</h2>
                <div style={{ color: '#ddd', lineHeight: '1.7', fontSize: '1.05rem' }}>
               
                  <p>Một <strong>Bitcoin Node</strong> là một máy tính tải toàn bộ chuỗi khối Bitcoin về và liên tục đồng bộ hóa với các máy tính khác trên toàn thế giới. Nó tự kiểm tra từng giao dịch và từng khối một cách độc lập mà không cần tin tưởng bất kỳ ai khác.</p>
                  <p>Nếu bạn chỉ sử dụng ứng dụng ví trên điện thoại, bạn đang tin tưởng rằng ai đó đang cung cấp cho bạn thông tin chính xác. Một Full Node không tin ai – nó tự kiểm tra mọi thứ.</p>

                  <p style={{ marginTop: '1.5rem' }}><strong>Tại sao nên chạy một Node?</strong></p>
                  <ul style={{ paddingLeft: '1.2rem' }}>
                    <li> Bạn thực sự độc lập và không cần tin tưởng ai</li>
                    <li> Bạn giúp giữ cho mạng lưới Bitcoin phi tập trung và an toàn</li>
                    <li> Bạn có thể tự xác thực và gửi giao dịch</li>
                    <li> Bạn hỗ trợ khả năng chống kiểm duyệt của Bitcoin</li>
                  </ul>

                  <p style={{ marginTop: '1.5rem' }}><strong>Full Node làm gì chính xác?</strong></p>
                  <p>Full Node tải toàn bộ blockchain về và kiểm tra từng giao dịch, từng khối theo quy tắc của Bitcoin. Nó tự động từ chối các khối và giao dịch không hợp lệ. Điều này đóng góp tích cực vào sự an toàn và phi tập trung của mạng lưới.</p>

                  <p style={{ marginTop: '1.5rem' }}><strong>Các thuật ngữ quan trọng:</strong></p>
                  <ul style={{ paddingLeft: '1.2rem' }}>
                    <li><strong>Full Node</strong> → Lưu trữ toàn bộ blockchain và tự xác thực mọi thứ</li>
                    <li><strong>Light Node / SPV</strong> → Phiên bản đơn giản hóa (ví dụ: ví điện thoại)</li>
                    <li><strong>Pruned Node</strong> → Chỉ lưu trữ các khối gần nhất để tiết kiệm dung lượng</li>
                    <li><strong>Running a Node</strong> → Đóng góp quan trọng nhất mà một cá nhân có thể làm cho Bitcoin</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {/* BITICTIONARY */}
        {activeTab === 'bitictionary' && (
          <>
            <h2 style={{ textAlign: 'center', color: '#f59e0b', marginBottom: '20px', textShadow: '0 0 20px #f59e0b' }}>Bitictionary</h2>
            <div style={{ background: '#1a1a1a', padding: '1.6rem', borderRadius: '16px' }}>
              <input type="text" placeholder={language === 'de' ? "Suchen..." : language === 'en' ? "Search..." : "Tìm kiếm..."} value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', background: '#222', border: 'none', color: 'white', marginBottom: '20px', boxSizing: 'border-box' }} />

              {filteredTerms.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>Kein Begriff gefunden.</p>
              ) : (
                filteredTerms.map((item, i) => (
                  <div key={i} style={{ background: '#222', padding: '1.3rem', borderRadius: '12px', marginBottom: '12px', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.08)' }}
                    onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.25)'}
                    onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.08)'}>
                    <h4 style={{ color: '#f59e0b', margin: '0 0 12px 0' }}>{item.term}</h4>
                    <p style={{ color: '#ddd', lineHeight: '1.6' }}>{item[language]}</p>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* LIVE CHART + KURS (unter allen Reitern) */}
        <div style={{ marginTop: '30px', background: '#1a1a1a', padding: '1.6rem', borderRadius: '16px', textAlign: 'center', border: '1px solid #f59e0b' }}>
          <div>Block Height: <span style={{ color: '#f59e0b' }}>{blockHeight ? `#${blockHeight.toLocaleString()}` : 'Laden...'}</span></div>
          <div style={{ margin: '8px 0', color: '#f59e0b', fontWeight: '600' }}>
            BTC: {btcPrice ? `$${btcPrice.usd?.toLocaleString()} • €${btcPrice.eur?.toLocaleString()} • ₫${formatVND(btcPrice.vnd)}` : 'Laden...'}
          </div>

          <div style={{ margin: '20px 0', minHeight: '100px' }}>
            {priceHistory.length > 5 ? (
              <svg width="100%" height="90" viewBox="0 0 520 90" style={{ filter: 'drop-shadow(0 4px 15px #f59e0b)' }}>
                <polyline points={generateChartPoints()} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <div style={{ color: '#f59e0b' }}>Lade Chart...</div>
            )}
          </div>
          <div style={{ color: '#f59e0b', fontSize: '0.9rem' }}>1-Year Bitcoin Chart</div>
        </div>

        {/* Copyright */}
        <div style={{ textAlign: 'center', marginTop: '40px', color: '#555', fontSize: '0.85rem' }}>
          Copyright © <span style={{ color: '#f59e0b', cursor: 'pointer' }} onClick={() => window.open('https://x.com/BitcoinZeit', '_blank')}>BitcoinZeit</span>
        </div>
      </div>
    </div>
  )
}

export default App