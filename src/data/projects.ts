import type { Language } from './translations'

export type Text = string | { en: string; id: string }

export const tx = (text: Text, lang: Language) => (typeof text === 'string' ? text : text[lang])

export type ProjectCategory = 'web' | 'mobile' | 'software'

export const categoryLabel: Record<ProjectCategory, string> = {
  web: 'Web',
  mobile: 'Mobile',
  software: 'Software',
}

export type Screen = { src: string; label: Text }

export type Story = {
  /** One line shown on the project panel */
  hook: Text
  problem: Text
  solution: Text
}

export type Project = {
  slug: string
  title: Text
  desc: Text
  story?: Story
  category: ProjectCategory
  color: string
  stack: string[]
  cover: string
  thumb: string
  video?: string
  /** "phone" for portrait app screens, "desktop" for wide screens */
  layout: 'phone' | 'desktop'
  features: Text[]
  screens: Screen[]
  links?: { label: string; href: string }[]
  note?: Text
}

const shots = (app: string, list: [file: string, label: Text][]): Screen[] =>
  list.map(([file, label]) => ({ src: `/works/${app}/screens/${file}.webp`, label }))

const MOBILE_STACK = ['Flutter', 'Supabase']

export const projects: Project[] = [
  {
    slug: 'bensinku',
    title: 'Bensinku',
    desc: {
      en: 'A fuel and vehicle maintenance tracker. It predicts when you need to refuel, reminds you of service schedules, and includes an AI-powered Mechanic Assistant.',
      id: 'Pencatat bensin dan perawatan kendaraan. Memprediksi kapan harus isi ulang, mengingatkan jadwal servis, dan punya Asisten Montir berbasis AI.',
    },
    story: {
      hook: {
        en: 'Built after the fuel gauge on my motorbike died.',
        id: 'Dibuat setelah indikator bensin di motor saya mati.',
      },
      problem: {
        en: 'The fuel bar on my motorbike stopped working, so I never knew when to refuel. Service schedules — oil changes, radiator top-ups and the like — were just as easy to forget.',
        id: 'Indikator bar bensin di motor saya mati, jadi saya tidak pernah tahu kapan harus isi bensin. Jadwal servis — ganti oli, isi air radiator, dan sejenisnya — juga gampang terlupa.',
      },
      solution: {
        en: "Bensinku estimates when the tank is running low from my refills and trips, and reminds me when to fill up and when maintenance is due. It isn't 100% accurate, but a reminder beats guessing.",
        id: 'Bensinku memperkirakan kapan bensin mulai habis dari catatan pengisian dan perjalanan, lalu mengingatkan kapan harus isi dan kapan waktunya servis. Memang tidak 100% akurat, tapi setidaknya ada pengingat daripada menebak-nebak.',
      },
    },
    category: 'mobile',
    color: '#0EA5E9',
    stack: MOBILE_STACK,
    cover: '/works/bensinku/hero.webp',
    thumb: '/works/bensinku/hero-sm.webp',
    video: '/works/bensinku/reel.mp4',
    layout: 'phone',
    features: [
      { en: 'Remaining fuel and next refill date predictions', id: 'Prediksi sisa bensin dan tanggal isi ulang' },
      { en: 'Maintenance schedule with overdue, due soon, and OK statuses', id: 'Jadwal perawatan dengan status terlewat, segera, dan aman' },
      { en: 'Spending charts and trip history', id: 'Grafik pengeluaran dan riwayat perjalanan' },
      { en: 'Supports multiple vehicles, motorbikes and cars alike', id: 'Bisa untuk beberapa kendaraan sekaligus, motor maupun mobil' },
      { en: 'AI-powered Mechanic Assistant for vehicle questions', id: 'Asisten Montir berbasis AI untuk konsultasi kendaraan' },
    ],
    screens: shots('bensinku', [
      ['beranda', { en: 'Home', id: 'Beranda' }],
      ['prediksi', { en: 'Fuel prediction', id: 'Prediksi bensin' }],
      ['input', { en: 'Log a refill', id: 'Input pengisian' }],
      ['analisa', { en: 'Spending analysis', id: 'Analisa pengeluaran' }],
      ['perjalanan', { en: 'Trip history', id: 'Riwayat perjalanan' }],
      ['perawatan', { en: 'Maintenance schedule', id: 'Jadwal perawatan' }],
      ['avanza', { en: 'Multiple vehicles', id: 'Multi kendaraan' }],
      ['asisten', { en: 'Mechanic Assistant', id: 'Asisten Montir' }],
    ]),
  },
  {
    slug: 'temanku',
    title: 'Temanku',
    desc: {
      en: "An editorial-style personal finance tracker. It doesn't just record, it analyzes: category breakdowns, budgets, savings goals, and month-over-month comparisons.",
      id: 'Pencatat keuangan pribadi bergaya editorial. Bukan cuma mencatat, tapi juga menganalisis: distribusi kategori, anggaran, target tabungan, sampai perbandingan bulan ke bulan.',
    },
    story: {
      hook: {
        en: 'Personal finance, shaped around how I actually track money.',
        id: 'Keuangan pribadi, disesuaikan dengan cara saya mencatat.',
      },
      problem: {
        en: "Most people's money isn't tracked neatly — mine included. The apps out there never quite fit how I wanted to record and review my spending.",
        id: 'Keuangan kebanyakan orang tidak tercatat rapi — termasuk saya. Aplikasi yang ada tidak pernah benar-benar pas dengan cara saya ingin mencatat dan meninjau pengeluaran.',
      },
      solution: {
        en: 'So I built my own, tailored to my needs — and it doubled as a project for my university coursework.',
        id: 'Jadi saya membuat sendiri, disesuaikan dengan kebutuhan saya — sekaligus untuk tugas kuliah.',
      },
    },
    category: 'mobile',
    color: '#10B981',
    stack: MOBILE_STACK,
    cover: '/works/temanku/hero.webp',
    thumb: '/works/temanku/hero-sm.webp',
    video: '/works/temanku/reel.mp4',
    layout: 'phone',
    features: [
      { en: 'Income and expense records by payment method', id: 'Catatan pemasukan dan pengeluaran per metode bayar' },
      { en: 'Per-category budgets with alerts when you go over', id: 'Anggaran per kategori dengan peringatan saat melewati batas' },
      { en: 'Savings goals with progress tracking', id: 'Target tabungan dengan progres terkumpul' },
      { en: 'Month vs. month comparison with significance testing', id: 'Perbandingan bulan vs bulan dengan uji signifikansi' },
      { en: 'Monthly, quarterly, and yearly summaries', id: 'Ringkasan bulanan, kuartalan, dan tahunan' },
    ],
    screens: shots('temanku', [
      ['beranda', { en: 'Home', id: 'Beranda' }],
      ['transaksi', { en: 'Transactions', id: 'Catatan transaksi' }],
      ['tambah', { en: 'Add transaction', id: 'Tambah transaksi' }],
      ['ringkasan', { en: 'Summary', id: 'Ringkasan' }],
      ['analisa', { en: 'Category breakdown', id: 'Distribusi kategori' }],
      ['perbandingan', { en: 'Month vs. month', id: 'Bulan vs bulan' }],
      ['anggaran', { en: 'Budget', id: 'Anggaran' }],
      ['tabungan', { en: 'Savings goals', id: 'Target tabungan' }],
    ]),
  },
  {
    slug: 'ingatanku',
    title: 'Ingatanku',
    desc: {
      en: 'A place to save links and notes, with bolubi, a little character that "eats" everything you save. Ask an AI assistant about your notes and review them with a weekly quiz.',
      id: 'Tempat menyimpan link dan catatan, ditemani bolubi, karakter yang "makan" setiap ilmu yang kamu simpan. Isinya bisa ditanyakan ke asisten AI dan diulang lewat kuis mingguan.',
    },
    story: {
      hook: {
        en: 'For everything worth remembering that scrolls past.',
        id: 'Untuk semua hal menarik yang lewat saat scrolling.',
      },
      problem: {
        en: "While scrolling social media I keep finding things worth keeping — a new tech stack, a useful tip — but they're scattered across different apps. Sometimes the uploader deletes the video before I get back to it.",
        id: 'Saat scroll media sosial saya sering menemukan hal menarik — tech stack baru, tips yang berguna — tapi tersebar di berbagai aplikasi. Kadang uploader-nya juga sudah menghapus videonya sebelum sempat saya tonton.',
      },
      solution: {
        en: 'Ingatanku saves them all in one place as tidy notes. To make coming back fun, I added gamification with a virtual pet: bolubi, who "eats" everything you save.',
        id: 'Ingatanku menyimpan semuanya di satu tempat sebagai catatan yang rapi. Supaya menarik untuk dibuka lagi, saya tambahkan gamifikasi bertema virtual pet: bolubi, yang "memakan" setiap hal yang kamu simpan.',
      },
    },
    category: 'mobile',
    color: '#F59E0B',
    stack: MOBILE_STACK,
    cover: '/works/ingatanku/hero.webp',
    thumb: '/works/ingatanku/hero-sm.webp',
    video: '/works/ingatanku/reel.mp4',
    links: [{ label: 'Website', href: 'https://ingatanku.temanlabs.tech' }],
    layout: 'phone',
    features: [
      { en: "Paste a link and it's saved as a tidy note", id: 'Tempel link, lalu tersimpan jadi catatan yang rapi' },
      { en: 'Library with search and tags', id: 'Pustaka dengan pencarian dan tag' },
      { en: 'Ask bolubi: an AI assistant that answers from your notes', id: 'Tanya bolubi: asisten AI yang menjawab dari catatanmu' },
      { en: "Weekly quiz based on what you've saved", id: 'Kuis mingguan dari isi yang sudah disimpan' },
      { en: 'A bolubi character you can dress up, with habits of its own', id: 'Karakter bolubi yang bisa didandani dan punya kebiasaan sendiri' },
    ],
    screens: shots('ingatanku', [
      ['beranda', { en: "bolubi's home", id: 'Rumah bolubi' }],
      ['tempel', { en: 'Paste a link', id: 'Tempel link' }],
      ['review', { en: 'Save & feed', id: 'Simpan & suapi' }],
      ['pustaka', { en: 'Library', id: 'Pustaka' }],
      ['baca', { en: 'Reading mode', id: 'Mode baca' }],
      ['catatan', { en: 'Notes', id: 'Catatan' }],
      ['asisten', { en: 'Ask bolubi', id: 'Tanya bolubi' }],
      ['kuis', { en: 'Weekly quiz', id: 'Kuis mingguan' }],
      ['lemari', { en: "bolubi's wardrobe", id: 'Lemari bolubi' }],
      ['tidur', { en: 'bolubi asleep', id: 'Bolubi tidur' }],
    ]),
  },
  {
    slug: 'reamber',
    title: 'Reamber',
    desc: {
      en: 'A retro-styled comic and manhwa reader. New content sources can be added through JSON recipes, complete with automated smoke tests.',
      id: 'Aplikasi baca komik dan manhwa bergaya retro. Sumber konten bisa ditambah lewat recipe JSON, lengkap dengan smoke test otomatis.',
    },
    story: {
      hook: {
        en: 'A calmer way to read manhwa.',
        id: 'Cara yang lebih nyaman untuk baca manhwa.',
      },
      problem: {
        en: "Same itch as Ingatanku, but for comics. I love reading manhwa, but some sites don't support it well, and many are buried in ads.",
        id: 'Masalahnya mirip Ingatanku, tapi untuk komik. Saya suka baca manhwa, tapi beberapa situs tidak mendukung dengan baik, dan banyak yang penuh iklan.',
      },
      solution: {
        en: 'Reamber brings the sources I read into one ad-free reader with a library, history and bookmarks — and new sources can be added through JSON recipes.',
        id: 'Reamber mengumpulkan sumber bacaan saya dalam satu reader tanpa iklan, lengkap dengan library, riwayat, dan bookmark — dan sumber baru bisa ditambah lewat recipe JSON.',
      },
    },
    category: 'mobile',
    color: '#F97316',
    stack: MOBILE_STACK,
    cover: '/works/reamber/hero.webp',
    thumb: '/works/reamber/hero-sm.webp',
    video: '/works/reamber/reel.mp4',
    layout: 'phone',
    features: [
      { en: 'Library, reading history, and bookmarks', id: 'Library, riwayat baca, dan bookmark' },
      { en: 'Chapter list with reading and download progress', id: 'Daftar chapter dengan progres baca dan download' },
      { en: 'Modular content sources via JSON recipes', id: 'Sumber konten modular lewat recipe JSON' },
      { en: 'Automated smoke tests to make sure sources work', id: 'Smoke test otomatis untuk memastikan sumber berjalan' },
      { en: 'Per-source mature content flags', id: 'Penanda konten dewasa per sumber' },
    ],
    screens: shots('reamber', [
      ['beranda', { en: 'Home', id: 'Beranda' }],
      ['feed', { en: 'Latest updates', id: 'Update terbaru' }],
      ['jelajah', { en: 'Search', id: 'Pencarian' }],
      ['detail', { en: 'Title details', id: 'Detail judul' }],
      ['chapter', { en: 'Chapter list', id: 'Daftar chapter' }],
      ['reader', { en: 'Reader', id: 'Mode baca' }],
      ['library', { en: 'History', id: 'Riwayat' }],
      ['bookmark', 'Bookmark'],
      ['sumber', { en: 'Manage sources', id: 'Atur sumber' }],
      ['uji', 'Smoke test'],
    ]),
  },
  {
    slug: 'temanlabsos',
    title: 'TemanLabsOS',
    desc: {
      en: 'A web desktop for Ubuntu home servers. Manage Docker, files, backups, and networking from the browser through a desktop interface, no terminal needed. Ships as a single binary.',
      id: 'Web desktop untuk home server Ubuntu. Kelola Docker, file, backup, dan jaringan dari browser lewat tampilan desktop, tanpa membuka terminal. Dikemas jadi satu file binary.',
    },
    story: {
      hook: {
        en: "A home server for people who've never touched Linux.",
        id: 'Home server untuk orang yang belum pernah menyentuh Linux.',
      },
      problem: {
        en: "When I started learning to run my own server, I had a hard time. I'd grown up on Windows, so Linux and the command line were unfamiliar territory.",
        id: 'Waktu awal belajar punya server sendiri, saya cukup kesulitan. Dari kecil saya terbiasa dengan Windows, jadi Linux dan command line terasa asing.',
      },
      solution: {
        en: 'So I built TemanLabsOS: a desktop in the browser for Ubuntu home servers that keeps commands to a minimum, so anyone can run a home server without an IT background.',
        id: 'Jadi saya membuat TemanLabsOS: tampilan desktop di browser untuk home server Ubuntu yang meminimalkan penggunaan command, supaya siapa pun bisa punya home server tanpa harus punya dasar IT.',
      },
    },
    category: 'web',
    color: '#8B5CF6',
    stack: ['Go', 'React', 'TypeScript', 'Docker'],
    cover: '/works/temanlabsos/hero.webp',
    thumb: '/works/temanlabsos/hero-sm.webp',
    video: '/works/temanlabsos/promo.mp4',
    layout: 'desktop',
    links: [
      { label: 'Website', href: 'https://os.temanlabs.tech' },
      { label: 'GitHub', href: 'https://github.com/diopratama99/TemanLabs-OS' },
    ],
    features: [
      { en: 'App Center with hundreds of apps and one-click updates', id: 'App Center dengan ratusan app dan update sekali klik' },
      { en: 'App health monitoring, auto-restart, and 30-day history', id: 'Pemantauan kesehatan app, restart otomatis, dan riwayat 30 hari' },
      { en: 'File manager, share links, and encrypted backups', id: 'File manager, link berbagi, dan backup terenkripsi' },
      { en: 'System Monitor and Kubernetes (k3s) management', id: 'System Monitor dan pengelolaan Kubernetes (k3s)' },
      { en: 'Snappable windows, desktop widgets, and a dedicated phone layout', id: 'Jendela yang bisa di-snap, widget desktop, dan tampilan khusus HP' },
    ],
    screens: shots('temanlabsos', [
      ['desktop', { en: 'Desktop & widgets', id: 'Desktop & widget' }],
      ['launcher', 'Launcher'],
      ['app-center', 'App Center'],
      ['apps', { en: 'App health', id: 'Kesehatan app' }],
      ['monitor', 'System Monitor'],
      ['history', { en: '30-day history', id: 'Riwayat 30 hari' }],
      ['files', 'Files'],
      ['share', { en: 'Share links', id: 'Link berbagi' }],
      ['backup', 'Backup'],
      ['code', 'Code editor'],
      ['kubernetes', 'Kubernetes'],
      ['snap', { en: 'Window snapping', id: 'Snap jendela' }],
    ]),
  },
  {
    slug: 'temanlabsos-site',
    title: { en: 'TemanLabsOS Landing Page', id: 'Landing Page TemanLabsOS' },
    desc: {
      en: 'The landing page for TemanLabsOS: a feature tour styled as desktop windows, a live demo you can try right away, and one-command installation. Available in two languages.',
      id: 'Landing page untuk TemanLabsOS: tur fitur bergaya jendela desktop, demo yang bisa dicoba langsung, dan instalasi satu perintah. Tersedia dalam dua bahasa.',
    },
    category: 'web',
    color: '#6366F1',
    stack: ['Astro'],
    cover: '/works/temanlabsos-site/hero.webp',
    thumb: '/works/temanlabsos-site/hero-sm.webp',
    layout: 'desktop',
    features: [
      { en: 'Feature tour styled as desktop windows', id: 'Tur fitur bergaya jendela desktop' },
      { en: 'Live demo you can try without installing', id: 'Demo langsung yang bisa dicoba tanpa instal' },
      { en: 'Two languages: Indonesian and English', id: 'Dua bahasa: Indonesia dan English' },
      { en: 'Light and dark mode', id: 'Mode terang dan gelap' },
      { en: 'Lightweight static pages built with Astro', id: 'Halaman statis yang ringan, dibangun dengan Astro' },
    ],
    screens: shots('temanlabsos-site', [
      ['00', 'Hero'],
      ['01', { en: 'Your server on every screen', id: 'Servermu di setiap layar' }],
      ['02', { en: 'Supported devices', id: 'Perangkat yang didukung' }],
      ['04', { en: 'Features', id: 'Fitur' }],
      ['06', { en: 'Desktop tour', id: 'Tur desktop' }],
      ['07', { en: 'Phone version', id: 'Versi HP' }],
      ['08', { en: 'App catalog', id: 'Katalog app' }],
      ['09', { en: 'About & security', id: 'Tentang & keamanan' }],
      ['12', { en: 'Installation', id: 'Instalasi' }],
      ['16', { en: 'Closing', id: 'Penutup' }],
    ]),
  },
  {
    slug: 'fmlc',
    title: 'FM26 Player Editor',
    desc: {
      en: "A Football Manager 26 player editor that works directly in the game's memory, built through my own reverse engineering. Find a player, change attributes, positions, and traits, and apply them while the game is running.",
      id: 'Editor pemain Football Manager 26 yang bekerja langsung di memori game, hasil reverse engineering sendiri. Cari pemain, ubah atribut, posisi, dan traits, lalu terapkan saat game berjalan.',
    },
    category: 'software',
    color: '#22C55E',
    stack: ['Python', 'Tkinter', 'pymem'],
    cover: '/works/fmlc/hero.webp',
    thumb: '/works/fmlc/hero-sm.webp',
    layout: 'desktop',
    note: {
      en: 'Screenshots taken in demo mode, with values from the legend template feature.',
      id: 'Screenshot diambil dalam mode demo, dengan nilai dari fitur template legenda.',
    },
    features: [
      { en: 'Find players by Player ID or name, with search history', id: 'Cari pemain lewat Player ID atau nama, dengan riwayat pencarian' },
      { en: 'Edit 40+ attributes, personality, positions, and traits/PPMs', id: 'Edit 40+ atribut, personality, posisi, dan traits/PPM' },
      { en: 'Per-position legend templates scaled to a target CA', id: 'Template legenda per posisi yang diskalakan ke target CA' },
      { en: 'Automatic CA estimate, with a warning when it goes over the limit', id: 'Perkiraan CA otomatis, dengan peringatan saat melewati batas' },
      { en: "Freeze values so they don't change while the game runs", id: 'Kunci (freeze) nilai supaya tidak berubah saat game berjalan' },
    ],
    screens: shots('fmlc', [
      ['attr', { en: 'Attributes tab', id: 'Tab atribut' }],
      ['pos', { en: 'Positions & traits', id: 'Posisi & traits' }],
    ]),
  },
  {
    slug: 'macropad',
    title: 'Macropad Configurator',
    desc: {
      en: "A replacement for the macropad's stock software, built by reverse engineering its configuration protocol. Every key and knob can run real actions, much like a Stream Deck.",
      id: 'Pengganti software bawaan macropad, dibangun dari reverse engineering protokol konfigurasinya. Tiap tombol dan knob bisa menjalankan aksi sungguhan, mirip Stream Deck.',
    },
    category: 'software',
    color: '#EC4899',
    stack: ['Python', 'HID', 'HTML'],
    cover: '/works/macropad/hero.webp',
    thumb: '/works/macropad/hero-sm.webp',
    layout: 'desktop',
    features: [
      { en: '11 action types: shortcuts, text, media, OBS, soundboard, macros, and more', id: '11 jenis aksi: shortcut, teks, media, OBS, soundboard, macro, dan lainnya' },
      { en: 'Unlimited profiles, switchable with a knob gesture (press 3×, then turn)', id: 'Profil tanpa batas, bisa diganti lewat gestur knob (tekan 3×, lalu putar)' },
      { en: 'Local web editor that lights up live as you press keys', id: 'Editor web lokal yang menyala live saat tombol ditekan' },
      { en: 'Visual key picker and ready-made profile templates', id: 'Key picker visual dan template profil siap pakai' },
      { en: 'Automatic five-version backup on every save', id: 'Backup otomatis lima versi setiap kali menyimpan' },
    ],
    screens: shots('macropad', [
      ['key1', 'Binding OBS'],
      ['knob', 'Knob & media'],
      ['mouse', { en: 'Action types', id: 'Jenis aksi' }],
      ['picker', 'Key picker'],
      ['templates', { en: 'Profile templates', id: 'Template profil' }],
      ['led', { en: 'LED control', id: 'Kontrol LED' }],
    ]),
  },
]

/** The Flutter apps featured on the portfolio. */
export const mobileApps = projects.filter((p) => p.category === 'mobile')

/** Bigger builds outside Flutter, shown in their own section. */
export const otherProjects = projects.filter((p) => p.slug === 'temanlabsos')

/** Website links read better as their domain ("os.temanlabs.tech"); others keep their label. */
export const linkText = (l: { label: string; href: string }) =>
  l.label === 'Website' ? new URL(l.href).host : l.label

export const websiteOf = (p: Project) => p.links?.find((l) => l.label === 'Website')
