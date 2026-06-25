/**
 * Static, trilingual blog content for the /blog section. SEO-first: each post
 * carries localized title + meta description + body paragraphs. Related products
 * are matched at render time against the live catalogue by keyword (see
 * getRelatedProducts), so the blog stays in sync with seeded products.
 */
import type { Locale } from '../types'

export type BlogCategory = 'cicek' | 'bitki' | 'rehber'
export type RelatedCollection =
  | 'bouquet'
  | 'box'
  | 'plant'
  | 'wedding'
  | 'corporate'

export interface BlogPost {
  /** URL: /blog/<slug> */
  slug: string
  category: BlogCategory
  title: Record<Locale, string>
  /** ~150-char SEO meta description per language. */
  metaDescription: Record<Locale, string>
  /** A webp from the existing product photos. */
  heroImage: string
  /** Body paragraphs per language (3–5 each). */
  body: Record<Locale, string[]>
  /** TR keywords searched (case-insensitive) inside product names. */
  relatedKeywords: string[]
  relatedCollection: RelatedCollection
}

export const BLOG_POSTS: BlogPost[] = [
  /* ── 1 · Gül ──────────────────────────────────────────────────── */
  {
    slug: 'gul',
    category: 'cicek',
    relatedKeywords: ['Gül'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/luks-kirmizi-gul-buket.webp',
    title: {
      tr: 'Gül: Anlamı, Renkleri ve Bakımı',
      en: 'Roses: Meaning, Colors and Care',
      ru: 'Розы: значение, цвета и уход',
    },
    metaDescription: {
      tr: "Gül çeşitleri, renklerinin anlamı ve gül bakımı hakkında bilmeniz gereken her şey. Fethiye'de taze gül buketleri Flora Art'ta.",
      en: 'Everything about rose varieties, the meaning of rose colors and rose care. Fresh rose bouquets in Fethiye at Flora Art.',
      ru: 'Всё о сортах роз, значении цветов роз и уходе за розами. Свежие букеты роз в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Gül, dünyanın en sevilen ve en çok tercih edilen çiçeğidir. Zarafeti, kokusu ve anlam zenginliğiyle gül, her özel anın vazgeçilmez sembolü olmuştur. Fethiye'de bir gül buketi göndermek istediğinizde, doğru gül rengini ve türünü seçmek mesajınızı güçlendirir.",
        'Gülün her rengi farklı bir duyguyu temsil eder. Kırmızı gül tutkulu aşkı, pembe gül zarafeti ve minneti, beyaz gül saflığı, sarı gül ise dostluğu anlatır. Sevdiğinize bir gül seçerken, bu anlamları göz önünde bulundurmanız armağanınızı daha kişisel kılar.',
        'Gül bakımı, çiçeğin ömrünü uzatmanın anahtarıdır. Taze gülleri serin suda, doğrudan güneş ışığından uzakta tutun. Gül saplarını çapraz kesmek ve suyu iki günde bir değiştirmek, güllerinizin günlerce taze kalmasını sağlar.',
        "Flora Art olarak Fethiye'de en taze gülleri özenle seçip hazırlıyoruz. Gül buketlerimiz, kız isteme törenlerinden yıl dönümlerine, her özel ana eşlik edecek şekilde tasarlanır. Hangi gül rengini seçerseniz seçin, kalitemiz aynı kalır.",
      ],
      en: [
        'The rose is the most beloved and most preferred flower in the world. With its elegance, fragrance and richness of meaning, the rose has become the indispensable symbol of every special moment. When you want to send a rose bouquet in Fethiye, choosing the right rose color and variety strengthens your message.',
        'Every color of the rose represents a different emotion. A red rose speaks of passionate love, a pink rose of grace and gratitude, a white rose of purity, and a yellow rose of friendship. When choosing a rose for your loved one, keeping these meanings in mind makes your gift more personal.',
        "Rose care is the key to extending the flower's life. Keep fresh roses in cool water, away from direct sunlight. Cutting rose stems at an angle and changing the water every two days keeps your roses fresh for days.",
        'At Flora Art, we carefully select and prepare the freshest roses in Fethiye. Our rose bouquets are designed to accompany every special moment, from marriage proposals to anniversaries. Whichever rose color you choose, our quality stays the same.',
      ],
      ru: [
        'Роза — самый любимый и самый востребованный цветок в мире. Благодаря своей элегантности, аромату и богатству значений роза стала неотъемлемым символом каждого особенного момента. Когда вы хотите отправить букет роз в Фетхие, правильный выбор цвета и сорта розы усиливает ваше послание.',
        'Каждый цвет розы выражает своё чувство. Красная роза говорит о страстной любви, розовая роза — об изяществе и благодарности, белая роза — о чистоте, а жёлтая роза — о дружбе. Выбирая розу для любимого человека, помните об этих значениях — так ваш подарок станет более личным.',
        'Уход за розами — ключ к продлению жизни цветка. Держите свежие розы в прохладной воде, вдали от прямых солнечных лучей. Косой срез стеблей розы и смена воды каждые два дня сохранят ваши розы свежими много дней.',
        'Мы во Flora Art бережно отбираем и готовим самые свежие розы в Фетхие. Наши букеты роз создаются для каждого особого момента — от сватовства до годовщин. Какой бы цвет розы вы ни выбрали, наше качество остаётся неизменным.',
      ],
    },
  },

  /* ── 2 · Kırmızı Gül ──────────────────────────────────────────── */
  {
    slug: 'kirmizi-gul',
    category: 'cicek',
    relatedKeywords: ['Kırmızı Gül'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/kirmizi-gul-buket-kurdele.webp',
    title: {
      tr: 'Kırmızı Gül: Aşkın ve Tutkunun Sembolü',
      en: 'Red Roses: Symbol of Love and Passion',
      ru: 'Красные розы: символ любви и страсти',
    },
    metaDescription: {
      tr: "Kırmızı gül aşkın en güçlü sembolüdür. Kırmızı gül buketi anlamı ve Fethiye'de kırmızı gül siparişi Flora Art'ta.",
      en: 'Red roses are the strongest symbol of love. The meaning of red rose bouquets and red rose delivery in Fethiye.',
      ru: 'Красные розы — самый сильный символ любви. Значение букетов красных роз и доставка в Фетхие.',
    },
    body: {
      tr: [
        "Kırmızı gül, dünya genelinde aşkın ve tutkunun en güçlü sembolü olarak kabul edilir. Bir kırmızı gül buketi, kelimelerin yetersiz kaldığı anlarda duygularınızı en içten şekilde ifade eder. Fethiye'de sevdiğinize kırmızı gül göndermek, ona değer verdiğinizi anlatmanın zarif bir yoludur.",
        "Kırmızı gülün anlamı yüzyıllardır değişmeden kalmıştır: derin aşk, sadakat ve arzu. Sevgililer Günü'nde, yıl dönümlerinde ya da bir 'seni seviyorum' demek istediğiniz her an kırmızı gül en doğru tercihtir. Gül sayısının bile özel bir anlamı vardır; tek bir kırmızı gül 'sadece sen' derken, kırmızı gül buketleri büyük tutkuyu anlatır.",
        'Kırmızı güllerinizin uzun süre taze kalması için saplarını çapraz kesin, vazoyu serin bir yerde tutun ve suyunu düzenli değiştirin. Bu küçük özen, kırmızı gül buketinizin günlerce ilk günkü canlılığını korumasını sağlar.',
        "Flora Art olarak Fethiye'de en taze kırmızı gülleri özenle seçiyoruz. İster klasik bir kırmızı gül buketi ister gösterişli bir aranjman olsun, aşkınızı en güzel şekilde temsil edecek kırmızı gül tasarımlarını sizin için hazırlıyoruz.",
      ],
      en: [
        'The red rose is recognized worldwide as the strongest symbol of love and passion. A red rose bouquet expresses your feelings in the most heartfelt way when words fall short. Sending red roses to your loved one in Fethiye is an elegant way to show how much you care.',
        "The meaning of the red rose has stayed unchanged for centuries: deep love, loyalty and desire. On Valentine's Day, on anniversaries, or any moment you want to say 'I love you', the red rose is the perfect choice. Even the number matters — a single red rose says 'only you', while red rose bouquets speak of grand passion.",
        'To keep your red roses fresh for longer, cut the stems at an angle, keep the vase in a cool place and change the water regularly. This small care lets your red rose bouquet hold its first-day vitality for days.',
        'At Flora Art we carefully select the freshest red roses in Fethiye. Whether a classic red rose bouquet or a striking arrangement, we prepare red rose designs that represent your love in the most beautiful way.',
      ],
      ru: [
        'Красная роза во всём мире признана самым сильным символом любви и страсти. Букет красных роз выражает ваши чувства самым искренним образом, когда слов недостаточно. Отправить красные розы любимому человеку в Фетхие — изящный способ показать, как он вам дорог.',
        'Значение красной розы остаётся неизменным веками: глубокая любовь, верность и желание. В День святого Валентина, на годовщины или в любой момент, когда хочется сказать «я люблю тебя», красная роза — идеальный выбор. Даже количество имеет значение: одна красная роза говорит «только ты», а букеты красных роз — о большой страсти.',
        'Чтобы красные розы дольше оставались свежими, срезайте стебли наискось, держите вазу в прохладном месте и регулярно меняйте воду. Эта забота позволит вашему букету красных роз сохранять свежесть много дней.',
        'Мы во Flora Art бережно отбираем самые свежие красные розы в Фетхие. Будь то классический букет красных роз или эффектная композиция, мы создаём дизайны из красных роз, которые красиво воплощают вашу любовь.',
      ],
    },
  },

  /* ── 3 · Orkide ───────────────────────────────────────────────── */
  {
    slug: 'orkide',
    category: 'cicek',
    relatedKeywords: ['Orkide'],
    relatedCollection: 'plant',
    heroImage: '/images/products/pexels/benekli-orkide-saksi.webp',
    title: {
      tr: 'Orkide: Zarafetin ve Bakımının İncelikleri',
      en: 'Orchids: The Art of Elegance and Care',
      ru: 'Орхидеи: искусство элегантности и ухода',
    },
    metaDescription: {
      tr: "Orkide bakımı, sulaması ve anlamı hakkında pratik rehber. Fethiye'de saksıda orkide ve aranjmanları Flora Art'ta.",
      en: 'A practical guide to orchid care, watering and meaning. Potted orchids and arrangements in Fethiye at Flora Art.',
      ru: 'Практическое руководство по уходу за орхидеей, поливу и значению. Орхидеи в горшках в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Orkide, zarafetin ve sofistike güzelliğin simgesidir. Bir orkide, bulunduğu her mekâna sakin bir asalet katar. Fethiye'de ev ya da ofis için orkide tercih etmek, hem uzun ömürlü hem de şık bir seçimdir.",
        'Orkide bakımı sanıldığı kadar zor değildir. Orkidenizi doğrudan güneş ışığından uzak, aydınlık bir yere yerleştirin. Orkide sulaması haftada bir, kökleri kısa süre suya batırarak yapılmalı; fazla su orkidenin en büyük düşmanıdır.',
        'Orkide, anlam olarak güzelliği, lüksü ve karşılıklı sevgiyi temsil eder. Bu yüzden bir orkide, doğum günlerinden iş kutlamalarına kadar pek çok özel an için anlamlı bir hediyedir. Beyaz orkide saflığı, mor orkide ise saygıyı anlatır.',
        "Flora Art'ın Fethiye koleksiyonunda saksıda ve aranjmanda farklı orkide seçenekleri bulabilirsiniz. Her orkide, sağlıklı kökleri ve canlı çiçekleriyle özenle seçilir; böylece orkideniz aylarca güzelliğini korur.",
      ],
      en: [
        'The orchid is a symbol of elegance and sophisticated beauty. An orchid adds quiet nobility to any space it graces. Choosing an orchid for a home or office in Fethiye is both a long-lasting and stylish choice.',
        "Orchid care is not as difficult as it seems. Place your orchid in a bright spot away from direct sunlight. Orchid watering should be done once a week by briefly dipping the roots in water; too much water is the orchid's greatest enemy.",
        'In meaning, the orchid represents beauty, luxury and mutual love. That is why an orchid is a meaningful gift for many special moments, from birthdays to business celebrations. A white orchid speaks of purity, while a purple orchid expresses respect.',
        "In Flora Art's Fethiye collection you'll find different orchid options, potted and arranged. Every orchid is carefully selected with healthy roots and vivid blooms, so your orchid keeps its beauty for months.",
      ],
      ru: [
        'Орхидея — символ элегантности и изысканной красоты. Орхидея придаёт тихое благородство любому пространству. Выбрать орхидею для дома или офиса в Фетхие — это долговечное и стильное решение.',
        'Уход за орхидеей не так сложен, как кажется. Поставьте орхидею в светлое место вдали от прямых солнечных лучей. Поливать орхидею следует раз в неделю, ненадолго погружая корни в воду; избыток воды — главный враг орхидеи.',
        'По значению орхидея символизирует красоту, роскошь и взаимную любовь. Поэтому орхидея — это значимый подарок для многих особых моментов, от дней рождения до деловых праздников. Белая орхидея говорит о чистоте, а фиолетовая орхидея выражает уважение.',
        'В коллекции Flora Art в Фетхие вы найдёте разные варианты орхидей — в горшке и в композиции. Каждая орхидея тщательно отбирается со здоровыми корнями и яркими цветами, чтобы ваша орхидея сохраняла красоту месяцами.',
      ],
    },
  },

  /* ── 4 · Lilyum ───────────────────────────────────────────────── */
  {
    slug: 'lilyum',
    category: 'cicek',
    relatedKeywords: ['Lilyum'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/beyaz-lilyum-buket.webp',
    title: {
      tr: 'Lilyum (Zambak): Asaletin Çiçeği',
      en: 'Lilies: The Flower of Nobility',
      ru: 'Лилии: цветок благородства',
    },
    metaDescription: {
      tr: "Lilyum anlamı, bakımı ve düğünlerde kullanımı. Fethiye'de beyaz lilyum buketleri ve aranjmanları Flora Art'ta.",
      en: 'The meaning of lilies, their care and use at weddings. White lily bouquets and arrangements in Fethiye at Flora Art.',
      ru: 'Значение лилий, уход и использование на свадьбах. Букеты белых лилий в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Lilyum, asaletin ve zarafetin çiçeği olarak bilinir. Görkemli açan taç yaprakları ve büyüleyici kokusuyla lilyum, hem buketlerde hem de aranjmanlarda göz kamaştırır. Fethiye'de zarif bir hediye arıyorsanız lilyum mükemmel bir seçimdir.",
        'Lilyumun anlamı saflık, masumiyet ve onurdur. Özellikle beyaz lilyum, düğünlerin ve nikâh törenlerinin vazgeçilmezidir; gelin buketlerinde lilyum sıkça tercih edilir. Pembe lilyum ise zenginlik ve hayranlığı simgeler.',
        'Lilyum bakımında dikkat edilmesi gereken birkaç nokta vardır. Çiçek açtığında polenli organları nazikçe alırsanız hem lilyumun ömrü uzar hem de lekelenme önlenir. Lilyumu serin suda tutmak ve doğrudan güneşten korumak tazeliğini artırır.',
        "Flora Art olarak Fethiye'de en taze lilyumları özenle seçip hazırlıyoruz. İster tek başına lilyum buketi ister güllerle birleşen bir aranjman olsun, lilyumun asil duruşu armağanınıza ayrı bir değer katar.",
      ],
      en: [
        "The lily is known as the flower of nobility and elegance. With its grandly opening petals and captivating fragrance, the lily dazzles in both bouquets and arrangements. If you're looking for an elegant gift in Fethiye, the lily is a perfect choice.",
        'The meaning of the lily is purity, innocence and honor. The white lily in particular is indispensable at weddings and nuptial ceremonies; lilies are often chosen for bridal bouquets. The pink lily symbolizes abundance and admiration.',
        "There are a few points to watch in lily care. When the flower opens, gently removing the pollen-bearing organs extends the lily's life and prevents staining. Keeping the lily in cool water and away from direct sun boosts its freshness.",
        'At Flora Art we carefully select and prepare the freshest lilies in Fethiye. Whether a lily bouquet on its own or an arrangement combined with roses, the noble bearing of the lily adds special value to your gift.',
      ],
      ru: [
        'Лилия известна как цветок благородства и элегантности. Своими роскошно раскрывающимися лепестками и чарующим ароматом лилия восхищает и в букетах, и в композициях. Если вы ищете изысканный подарок в Фетхие, лилия — идеальный выбор.',
        'Значение лилии — чистота, невинность и честь. Особенно белая лилия незаменима на свадьбах и церемониях бракосочетания; лилии часто выбирают для букетов невесты. Розовая лилия символизирует изобилие и восхищение.',
        'В уходе за лилией есть несколько важных моментов. Когда цветок раскрывается, аккуратное удаление пыльников продлевает жизнь лилии и предотвращает пятна. Держите лилию в прохладной воде и вдали от прямого солнца, чтобы сохранить свежесть.',
        'Мы во Flora Art бережно отбираем и готовим самые свежие лилии в Фетхие. Будь то букет из лилий или композиция с розами, благородство лилии придаёт вашему подарку особую ценность.',
      ],
    },
  },

  /* ── 5 · Lale ─────────────────────────────────────────────────── */
  {
    slug: 'lale',
    category: 'cicek',
    relatedKeywords: ['Lale'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/pembe-lale-dahlia-buket.webp',
    title: {
      tr: 'Lale: Baharın ve Zarafetin Habercisi',
      en: 'Tulips: Heralds of Spring and Grace',
      ru: 'Тюльпаны: вестники весны и изящества',
    },
    metaDescription: {
      tr: "Lale anlamı, renkleri ve bakımı. Fethiye'de baharın habercisi rengârenk lale buketleri Flora Art'ta.",
      en: 'The meaning of tulips, their colors and care. Colorful tulip bouquets, heralds of spring, in Fethiye at Flora Art.',
      ru: 'Значение тюльпанов, их цвета и уход. Яркие букеты тюльпанов, вестники весны, в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Lale, baharın ve zarafetin habercisidir. Sade ama asil duruşuyla lale, hem geleneksel hem de modern buketlerin gözdesidir. Fethiye'de baharın canlılığını sevdiklerinize taşımak isterseniz bir lale buketi tam size göre.",
        'Lalenin tarihi ve kültürel değeri çok derindir; özellikle bizim topraklarımızda lale, zarafetin ve mükemmel aşkın simgesi olmuştur. Lalenin her rengi farklı bir mesaj taşır: kırmızı lale güçlü aşkı, sarı lale neşeyi, beyaz lale ise saygıyı anlatır.',
        'Lale bakımı oldukça kolaydır ancak birkaç ince ayrıntı tazeliği uzatır. Laleler kesildikten sonra büyümeye devam eder; bu yüzden saplarını kısa kesip serin suda tutmak gerekir. Lale ışığa yöneldiği için vazoyu dengeli bir yerde tutmak görünümünü korur.',
        "Flora Art olarak Fethiye'de mevsiminde en taze laleleri seçiyoruz. Rengârenk bir lale buketi, doğum günlerinden bahar kutlamalarına kadar her ana neşe katar; lalenin sade zarafeti armağanınızı özel kılar.",
      ],
      en: [
        'The tulip is a herald of spring and grace. With its simple yet noble bearing, the tulip is a favorite of both traditional and modern bouquets. If you want to bring the vitality of spring to your loved ones in Fethiye, a tulip bouquet is just right for you.',
        'The historical and cultural value of the tulip runs deep; in our lands especially, the tulip has been a symbol of elegance and perfect love. Every color of the tulip carries a different message: a red tulip speaks of strong love, a yellow tulip of cheer, and a white tulip of respect.',
        'Tulip care is quite easy, though a few small details extend freshness. Tulips keep growing after they are cut, so their stems should be trimmed short and kept in cool water. Because the tulip bends toward the light, keeping the vase in a balanced spot preserves its look.',
        'At Flora Art we select the freshest seasonal tulips in Fethiye. A colorful tulip bouquet adds joy to every moment, from birthdays to spring celebrations; the simple elegance of the tulip makes your gift special.',
      ],
      ru: [
        'Тюльпан — вестник весны и изящества. Своей простой, но благородной осанкой тюльпан остаётся любимцем и традиционных, и современных букетов. Если вы хотите подарить близким в Фетхие весеннюю свежесть, букет тюльпанов — именно то, что нужно.',
        'Историческая и культурная ценность тюльпана очень глубока; особенно на наших землях тюльпан стал символом изящества и совершенной любви. Каждый цвет тюльпана несёт своё послание: красный тюльпан говорит о сильной любви, жёлтый тюльпан — о радости, а белый тюльпан — об уважении.',
        'Уход за тюльпанами довольно прост, но несколько деталей продлевают свежесть. Тюльпаны продолжают расти после срезки, поэтому стебли стоит подрезать коротко и держать в прохладной воде. Поскольку тюльпан тянется к свету, ставьте вазу в устойчивом месте, чтобы сохранить форму.',
        'Мы во Flora Art отбираем самые свежие сезонные тюльпаны в Фетхие. Яркий букет тюльпанов добавляет радости любому моменту — от дней рождения до весенних праздников; простая элегантность тюльпана делает ваш подарок особенным.',
      ],
    },
  },

  /* ── 6 · Pembe Gül ────────────────────────────────────────────── */
  {
    slug: 'pembe-gul',
    category: 'cicek',
    relatedKeywords: ['Pembe Gül'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/pembe-gul-buket-keten.webp',
    title: {
      tr: 'Pembe Gül: Zarafetin ve Minnetin İfadesi',
      en: 'Pink Roses: An Expression of Grace and Gratitude',
      ru: 'Розовые розы: выражение изящества и благодарности',
    },
    metaDescription: {
      tr: "Pembe gül zarafeti, minneti ve nazik sevgiyi anlatır. Pembe gül buketi anlamı ve Fethiye'de pembe gül siparişi Flora Art'ta.",
      en: 'Pink roses express grace, gratitude and gentle love. Meaning of pink rose bouquets and pink rose delivery in Fethiye at Flora Art.',
      ru: 'Розовые розы выражают изящество, благодарность и нежную любовь. Значение букетов розовых роз и доставка в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Pembe gül, zarafetin ve inceliğin en güzel ifadesidir. Kırmızı gülün tutkusu ile beyaz gülün saflığı arasında duran pembe gül, nazik bir sevgiyi, hayranlığı ve minnettarlığı anlatır. Fethiye'de sevdiklerinize bir pembe gül buketi göndermek, sözcüklere dökemediğiniz zarif duyguları aktarmanın en güzel yoludur.",
        "Pembe gülün tonları da farklı anlamlar taşır. Açık pembe gül minnettarlık ve hayranlığı, koyu pembe gül ise teşekkürü ve takdiri simgeler. Anneler Günü'nden doğum günlerine, yeni bir başlangıcı kutlamaktan bir teşekkürü iletmeye kadar pembe gül her nazik duyguya eşlik eder.",
        "Pembe gül bakımı diğer güllerde olduğu gibi özen ister. Saplarını çapraz kesin, vazo suyunu serin tutun ve doğrudan güneşten uzak bir yere yerleştirin. Bu küçük dokunuşlarla pembe güllerinizin tazeliği günlerce sürer.",
        "Flora Art olarak Fethiye'de en taze pembe gülleri özenle seçiyor, zarif buketler halinde hazırlıyoruz. Pembe gül buketlerimiz, sevdiklerinize duyduğunuz nazik sevgiyi en şık biçimde ifade eder.",
      ],
      en: [
        "The pink rose is one of the most beautiful expressions of grace and delicacy. Standing between the passion of the red rose and the purity of the white rose, the pink rose speaks of gentle love, admiration and gratitude. Sending a pink rose bouquet to your loved ones in Fethiye is a graceful way to convey the tender feelings that words cannot capture.",
        "Different shades of the pink rose carry different meanings as well. A light pink rose symbolizes gratitude and admiration, while a deep pink rose represents thankfulness and appreciation. From Mother's Day to birthdays, from celebrating a new beginning to saying thank you, the pink rose accompanies every gentle emotion.",
        "Caring for the pink rose requires the same attention as other roses. Cut the stems at an angle, keep the vase water cool, and place them away from direct sunlight. With these small touches, the freshness of your pink roses will last for days.",
        "At Flora Art, we carefully select the freshest pink roses in Fethiye and arrange them into elegant bouquets. Our pink rose bouquets express the tender love you feel for your dear ones in the most stylish way.",
      ],
      ru: [
        'Розовая роза — одно из самых прекрасных выражений изящества и нежности. Находясь между страстью красной розы и чистотой белой розы, розовая роза говорит о нежной любви, восхищении и благодарности. Отправить букет розовых роз близким в Фетхие — это изящный способ передать те тёплые чувства, которые невозможно выразить словами.',
        'Разные оттенки розовой розы также несут разный смысл. Светло-розовая роза символизирует благодарность и восхищение, а тёмно-розовая роза выражает признательность и уважение. От Дня матери до дней рождения, от празднования нового начала до слов благодарности — розовая роза сопровождает каждое нежное чувство.',
        'Уход за розовой розой требует такого же внимания, как и за другими розами. Подрезайте стебли под углом, держите воду в вазе прохладной и ставьте розы вдали от прямых солнечных лучей. Благодаря этим небольшим заботам свежесть ваших розовых роз сохранится надолго.',
        'В Flora Art мы тщательно отбираем самые свежие розовые розы в Фетхие и составляем из них элегантные букеты. Наши букеты розовых роз самым стильным образом выражают нежную любовь к дорогим вам людям.',
      ],
    },
  },

  /* ── 7 · Beyaz Gül ────────────────────────────────────────────── */
  {
    slug: 'beyaz-gul',
    category: 'cicek',
    relatedKeywords: ['Beyaz Gül'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/beyaz-gul-vazo.webp',
    title: {
      tr: 'Beyaz Gül: Saflığın ve Yeni Başlangıçların Çiçeği',
      en: 'White Roses: The Flower of Purity and New Beginnings',
      ru: 'Белые розы: цветок чистоты и новых начинаний',
    },
    metaDescription: {
      tr: "Beyaz gül saflığı, masumiyeti ve yeni başlangıçları simgeler. Beyaz gül buketi anlamı ve Fethiye'de beyaz gül Flora Art'ta.",
      en: 'White roses symbolize purity, innocence and new beginnings. Meaning of white rose bouquets and white roses in Fethiye at Flora Art.',
      ru: 'Белые розы символизируют чистоту, невинность и новые начинания. Значение букетов белых роз и белые розы в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Beyaz gül, saflığın ve masumiyetin en zarif simgesidir. Sade ama güçlü duruşuyla beyaz gül, yeni başlangıçları, içten saygıyı ve sonsuz sevgiyi anlatır. Fethiye'de bir beyaz gül buketi, düğünlerden anma törenlerine kadar en anlamlı anların vazgeçilmez çiçeğidir.",
        'Beyaz gül çoğunlukla gelin buketlerinde tercih edilir, çünkü saflığı ve yeni bir hayatın başlangıcını temsil eder. Aynı zamanda bir özrü iletmek, huzur dilemek ya da derin saygı göstermek için de beyaz gül en doğru seçimdir.',
        'Beyaz gül bakımında temizlik önemlidir; soluk yaprakları ayıklayın, saplarını çapraz kesin ve suyu düzenli değiştirin. Böylece beyaz güllerinizin lekesiz zarafeti uzun süre korunur.',
        "Flora Art olarak Fethiye'de en taze beyaz gülleri seçip zarif aranjmanlar hazırlıyoruz. Beyaz gül buketlerimiz, saf ve içten duygularınızı en şık haliyle ifade eder.",
      ],
      en: [
        'The white rose is the most elegant symbol of purity and innocence. With its simple yet powerful presence, the white rose speaks of new beginnings, sincere respect and everlasting love. In Fethiye, a white rose bouquet is the indispensable flower of the most meaningful moments, from weddings to memorial ceremonies.',
        'The white rose is often chosen for bridal bouquets, as it represents purity and the start of a new life. It is also the perfect choice for conveying an apology, wishing peace, or showing deep respect with a white rose.',
        'Cleanliness matters in white rose care; remove wilted petals, cut the stems at an angle and change the water regularly. This way, the flawless elegance of your white roses is preserved for a long time.',
        'At Flora Art, we select the freshest white roses in Fethiye and prepare elegant arrangements. Our white rose bouquets express your pure and sincere feelings in the most stylish way.',
      ],
      ru: [
        'Белая роза — самый элегантный символ чистоты и невинности. Своим простым, но сильным присутствием белая роза говорит о новых начинаниях, искреннем уважении и вечной любви. В Фетхие букет белых роз — незаменимый цветок самых значимых моментов, от свадеб до памятных церемоний.',
        'Белую розу часто выбирают для свадебных букетов, так как она олицетворяет чистоту и начало новой жизни. Белая роза также станет идеальным выбором, чтобы выразить извинения, пожелать мира или проявить глубокое уважение.',
        'В уходе за белой розой важна чистота: удаляйте увядшие лепестки, подрезайте стебли под углом и регулярно меняйте воду. Так безупречная элегантность ваших белых роз сохранится надолго.',
        'В Flora Art мы отбираем самые свежие белые розы в Фетхие и создаём элегантные композиции. Наши букеты белых роз самым стильным образом выражают ваши чистые и искренние чувства.',
      ],
    },
  },

  /* ── 8 · Gerbera ──────────────────────────────────────────────── */
  {
    slug: 'gerbera',
    category: 'cicek',
    relatedKeywords: ['Gerbera'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/pembe-gul-gerbera-buket.webp',
    title: {
      tr: 'Gerbera: Neşenin ve Canlılığın Çiçeği',
      en: 'Gerbera: The Flower of Joy and Vitality',
      ru: 'Гербера: цветок радости и жизненной силы',
    },
    metaDescription: {
      tr: "Gerbera neşeyi, canlılığı ve mutluluğu simgeleyen rengârenk bir çiçektir. Gerbera buketi ve Fethiye'de gerbera siparişi Flora Art'ta.",
      en: 'Gerbera is a colorful flower symbolizing joy, vitality and happiness. Gerbera bouquets and gerbera delivery in Fethiye at Flora Art.',
      ru: 'Гербера — яркий цветок, символизирующий радость, жизненную силу и счастье. Букеты гербер и доставка в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Gerbera, canlı renkleri ve neşeli duruşuyla mutluluğun çiçeğidir. Sarısından kırmızısına, pembesinden turuncusuna kadar her tonu pozitif bir enerji yayan gerbera, sevdiklerinize moral ve neşe göndermenin en güzel yoludur. Fethiye'de bir gerbera buketi, gülümseme hediye etmek gibidir.",
        "Gerbera masumiyeti, saflığı ve neşeyi simgeler. Doğum günleri, kutlamalar ve 'iyi ki varsın' demek istediğiniz her an için gerbera ideal bir seçimdir. Rengârenk gerbera buketleri, girdiği her ortama enerji katar.",
        'Gerbera bakımı kolaydır ama dikkat ister; saplarının dik durması için temiz su ve doğru kesim önemlidir. Suyu sık değiştirip serin ortamda tutarsanız gerberalarınız uzun süre canlı kalır.',
        "Flora Art olarak Fethiye'de en taze ve renkli gerberaları seçip neşeli buketler hazırlıyoruz. Gerbera aranjmanlarımız, sevdiklerinize mutluluğu en canlı renklerle ulaştırır.",
      ],
      en: [
        'With its vivid colors and cheerful presence, the gerbera is the flower of happiness. From yellow to red, from pink to orange, every shade of the gerbera radiates positive energy, making it the loveliest way to send cheer to your loved ones. In Fethiye, a gerbera bouquet is like gifting a smile.',
        "The gerbera symbolizes innocence, purity and joy. For birthdays, celebrations and every moment you want to say 'I'm glad you exist,' the gerbera is an ideal choice. Colorful gerbera bouquets bring energy to every space they enter.",
        'The gerbera is easy to care for but needs attention; clean water and a proper cut are important to keep the stems upright. If you change the water often and keep them in a cool place, your gerberas will stay fresh for a long time.',
        'At Flora Art, we select the freshest and most colorful gerberas in Fethiye and create cheerful bouquets. Our gerbera arrangements deliver happiness to your loved ones in the most vibrant colors.',
      ],
      ru: [
        'Своими яркими красками и жизнерадостным видом гербера является цветком счастья. От жёлтого до красного, от розового до оранжевого — каждый оттенок герберы излучает позитивную энергию, что делает её прекраснейшим способом подарить радость близким. В Фетхие букет гербер — это словно подарить улыбку.',
        'Гербера символизирует невинность, чистоту и радость. Для дней рождения, праздников и каждого момента, когда хочется сказать «как хорошо, что ты есть», гербера — идеальный выбор. Яркие букеты гербер наполняют энергией любое пространство.',
        'Гербера неприхотлива, но требует внимания: для того чтобы стебли стояли прямо, важны чистая вода и правильный срез. Если часто менять воду и держать цветы в прохладе, ваши герберы долго останутся свежими.',
        'В Flora Art мы выбираем самые свежие и яркие герберы в Фетхие и создаём жизнерадостные букеты. Наши композиции из гербер дарят вашим близким счастье в самых сочных красках.',
      ],
    },
  },

  /* ── 9 · Papatya ──────────────────────────────────────────────── */
  {
    slug: 'papatya',
    category: 'cicek',
    relatedKeywords: ['Papatya'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/luks-papatya-buket.webp',
    title: {
      tr: 'Papatya: Sadeliğin ve Masumiyetin Zarafeti',
      en: 'Daisies: The Grace of Simplicity and Innocence',
      ru: 'Ромашки: изящество простоты и невинности',
    },
    metaDescription: {
      tr: "Papatya sadeliği, masumiyeti ve içtenliği simgeler. Papatya buketi anlamı ve Fethiye'de papatya siparişi Flora Art'ta.",
      en: 'Daisies symbolize simplicity, innocence and sincerity. Meaning of daisy bouquets and daisy delivery in Fethiye at Flora Art.',
      ru: 'Ромашки символизируют простоту, невинность и искренность. Значение букетов ромашек и доставка в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Papatya, sadeliğin içindeki zarafeti en iyi anlatan çiçektir. Beyaz yaprakları ve sarı kalbiyle papatya, masumiyeti, içtenliği ve saf sevgiyi simgeler. Fethiye'de bir papatya buketi, gösterişsiz ama derin duyguları aktarmanın en samimi yoludur.",
        "Papatya çoğu zaman 'seviyor, sevmiyor' oyununun çiçeği olarak bilinir; bu da onu masum aşkın sembolü yapar. Bir arkadaşa, sevgiliye ya da anneye papatya göndermek, sade ve içten bir sevgi mesajı verir.",
        'Papatya bakımı oldukça kolaydır; bol ve temiz su sever. Saplarını kesip suyunu düzenli değiştirdiğinizde papatyalarınız uzun süre taze ve dik kalır.',
        "Flora Art olarak Fethiye'de en taze papatyaları seçip zarif buketler hazırlıyoruz. Papatya buketlerimiz, sade ve içten duygularınızı en doğal haliyle ifade eder.",
      ],
      en: [
        'The daisy is the flower that best expresses the elegance found within simplicity. With its white petals and yellow heart, the daisy symbolizes innocence, sincerity and pure love. In Fethiye, a daisy bouquet is the most heartfelt way to convey modest yet deep emotions.',
        "The daisy is often known as the flower of the 'loves me, loves me not' game, which makes it a symbol of innocent love. Sending a daisy to a friend, a sweetheart or a mother delivers a simple and sincere message of love.",
        'Caring for the daisy is quite easy; it loves plenty of clean water. When you trim the stems and change the water regularly, your daisies stay fresh and upright for a long time.',
        'At Flora Art, we select the freshest daisies in Fethiye and prepare elegant bouquets. Our daisy bouquets express your simple and sincere feelings in their most natural form.',
      ],
      ru: [
        'Ромашка — цветок, который лучше всего выражает изящество, скрытое в простоте. Своими белыми лепестками и жёлтой сердцевиной ромашка символизирует невинность, искренность и чистую любовь. В Фетхие букет ромашек — самый душевный способ передать скромные, но глубокие чувства.',
        'Ромашку часто называют цветком игры «любит — не любит», что делает её символом невинной любви. Подарить ромашку другу, любимому человеку или маме — значит передать простое и искреннее послание любви.',
        'Уход за ромашкой довольно прост: она любит обилие чистой воды. Если подрезать стебли и регулярно менять воду, ваши ромашки надолго останутся свежими и будут стоять прямо.',
        'В Flora Art мы выбираем самые свежие ромашки в Фетхие и составляем элегантные букеты. Наши букеты ромашек выражают ваши простые и искренние чувства в их самом естественном виде.',
      ],
    },
  },

  /* ── 10 · Karanfil ────────────────────────────────────────────── */
  {
    slug: 'karanfil',
    category: 'cicek',
    relatedKeywords: ['Karanfil'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/pembe-karanfil-buket.webp',
    title: {
      tr: 'Karanfil: Sevginin ve Saygının Köklü Çiçeği',
      en: 'Carnations: The Timeless Flower of Love and Respect',
      ru: 'Гвоздики: вечный цветок любви и уважения',
    },
    metaDescription: {
      tr: "Karanfil sevgiyi, saygıyı ve hayranlığı simgeleyen köklü bir çiçektir. Karanfil buketi ve Fethiye'de karanfil siparişi Flora Art'ta.",
      en: 'The carnation is a timeless flower symbolizing love, respect and admiration. Carnation bouquets and carnation delivery in Fethiye at Flora Art.',
      ru: 'Гвоздика — вечный цветок, символизирующий любовь, уважение и восхищение. Букеты гвоздик и доставка в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Karanfil, köklü tarihi ve zengin anlamıyla en sevilen çiçeklerden biridir. Kıvrımlı yaprakları ve dayanıklı yapısıyla karanfil; sevgiyi, saygıyı ve hayranlığı simgeler. Fethiye'de bir karanfil buketi, hem zarif hem de uzun ömürlü bir armağandır.",
        "Karanfilin her rengi farklı bir mesaj taşır. Kırmızı karanfil derin sevgiyi ve hayranlığı, pembe karanfil minnettarlığı, beyaz karanfil ise saf sevgi ve iyi şansı anlatır. Anneler Günü'nün de simgesi olan karanfil, sevgi dolu her ana yakışır.",
        'Karanfil bakımı kolaydır ve uzun ömürlüdür; bu yüzden vazoda haftalarca taze kalabilir. Saplarını çapraz kesip suyunu düzenli değiştirdiğinizde karanfillerinizin tazeliği şaşırtıcı derecede uzun sürer.',
        "Flora Art olarak Fethiye'de en taze karanfilleri seçip zarif buketler hazırlıyoruz. Karanfil aranjmanlarımız, sevginizi ve saygınızı uzun süre solmayan bir güzellikle ifade eder.",
      ],
      en: [
        'With its deep history and rich meaning, the carnation is one of the most beloved flowers. With its ruffled petals and resilient structure, the carnation symbolizes love, respect and admiration. In Fethiye, a carnation bouquet is both an elegant and long-lasting gift.',
        "Each color of the carnation carries a different message. A red carnation expresses deep love and admiration, a pink carnation gratitude, and a white carnation pure love and good luck. Also a symbol of Mother's Day, the carnation suits every moment full of love.",
        'The carnation is easy to care for and long-lasting, so it can stay fresh in a vase for weeks. When you cut the stems at an angle and change the water regularly, the freshness of your carnations lasts surprisingly long.',
        'At Flora Art, we select the freshest carnations in Fethiye and prepare elegant bouquets. Our carnation arrangements express your love and respect with a beauty that does not fade for a long time.',
      ],
      ru: [
        'Благодаря своей глубокой истории и богатому значению гвоздика — один из самых любимых цветов. Своими волнистыми лепестками и стойкой структурой гвоздика символизирует любовь, уважение и восхищение. В Фетхие букет гвоздик — это одновременно элегантный и долговечный подарок.',
        'Каждый цвет гвоздики несёт своё послание. Красная гвоздика выражает глубокую любовь и восхищение, розовая гвоздика — благодарность, а белая гвоздика — чистую любовь и удачу. Будучи также символом Дня матери, гвоздика подходит для каждого момента, наполненного любовью.',
        'Гвоздика неприхотлива и долговечна, поэтому может стоять в вазе свежей неделями. Если подрезать стебли под углом и регулярно менять воду, свежесть ваших гвоздик сохраняется удивительно долго.',
        'В Flora Art мы выбираем самые свежие гвоздики в Фетхие и составляем элегантные букеты. Наши композиции из гвоздик выражают вашу любовь и уважение красотой, которая долго не увядает.',
      ],
    },
  },

  /* ── 11 · Şakayık ─────────────────────────────────────────────── */
  {
    slug: 'sakayik',
    category: 'cicek',
    relatedKeywords: ['Şakayık'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/sakayik-ranunculus-buket.webp',
    title: {
      tr: 'Şakayık: Zarafetin ve Bolluğun Çiçeği',
      en: 'Peonies: The Flower of Elegance and Abundance',
      ru: 'Пионы: цветок элегантности и изобилия',
    },
    metaDescription: {
      tr: "Şakayık zarafeti, romantizmi ve bolluğu simgeleyen lüks bir çiçektir. Şakayık buketi ve Fethiye'de şakayık siparişi Flora Art'ta.",
      en: 'The peony is a luxurious flower symbolizing elegance, romance and abundance. Peony bouquets and peony delivery in Fethiye at Flora Art.',
      ru: 'Пион — роскошный цветок, символизирующий элегантность, романтику и изобилие. Букеты пионов и доставка в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Şakayık, dolgun yaprakları ve büyüleyici kokusuyla çiçeklerin en zarif ve lüks olanlarından biridir. Romantizmi, bolluğu ve mutlu bir evliliği simgeleyen şakayık, özel anların gözdesidir. Fethiye'de bir şakayık buketi, zarafeti ve cömertliği bir arada sunar.",
        'Şakayık özellikle düğünlerde ve nişanlarda tercih edilir, çünkü mutluluğu ve bereketli bir geleceği temsil eder. Romantik bir jest yapmak ya da birini özel hissettirmek istediğinizde şakayık kusursuz bir seçimdir.',
        'Şakayık bakımında nazik olmak gerekir; tomurcukları açarken bol temiz su ister. Saplarını çapraz kesip serin bir ortamda tuttuğunuzda şakayıklarınız ihtişamla açar ve uzun süre taze kalır.',
        "Flora Art olarak Fethiye'de en taze şakayıkları özenle seçip lüks buketler hazırlıyoruz. Şakayık aranjmanlarımız, zarafetinizi ve sevginizi en görkemli haliyle ifade eder.",
      ],
      en: [
        'With its full petals and enchanting fragrance, the peony is one of the most elegant and luxurious of flowers. Symbolizing romance, abundance and a happy marriage, the peony is the favorite of special moments. In Fethiye, a peony bouquet offers elegance and generosity together.',
        'The peony is especially preferred for weddings and engagements, as it represents happiness and a prosperous future. When you want to make a romantic gesture or make someone feel special, the peony is a flawless choice.',
        'Caring for the peony requires gentleness; it needs plenty of clean water as the buds open. When you cut the stems at an angle and keep them in a cool place, your peonies bloom magnificently and stay fresh for a long time.',
        'At Flora Art, we carefully select the freshest peonies in Fethiye and prepare luxurious bouquets. Our peony arrangements express your elegance and love in their most magnificent form.',
      ],
      ru: [
        'Своими пышными лепестками и чарующим ароматом пион — один из самых элегантных и роскошных цветов. Символизируя романтику, изобилие и счастливый брак, пион является фаворитом особых моментов. В Фетхие букет пионов сочетает в себе элегантность и щедрость.',
        'Пион особенно предпочитают для свадеб и помолвок, так как он олицетворяет счастье и благополучное будущее. Когда вы хотите сделать романтический жест или дать кому-то почувствовать себя особенным, пион — безупречный выбор.',
        'Уход за пионом требует деликатности: ему нужно много чистой воды, пока раскрываются бутоны. Если подрезать стебли под углом и держать их в прохладе, ваши пионы раскроются великолепно и долго будут свежими.',
        'В Flora Art мы тщательно отбираем самые свежие пионы в Фетхие и создаём роскошные букеты. Наши композиции из пионов выражают вашу элегантность и любовь в их самом великолепном виде.',
      ],
    },
  },
]

/** Find a post by its slug. */
export function getBlogPost(slug: string | undefined): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

/**
 * Related products for a post. A product matches if any of the post's
 * relatedKeywords appears (case-insensitive) in its name; otherwise the first
 * few products of relatedCollection are used. Capped at 6. Generic over the
 * product shape so it works with the live StoreProduct view-model.
 */
export function getRelatedProducts<T extends { name: string; category: string }>(
  post: BlogPost,
  allProducts: T[],
): T[] {
  const keywords = post.relatedKeywords.map((k) => k.toLowerCase())
  const matched = allProducts.filter((p) =>
    keywords.some((k) => p.name.toLowerCase().includes(k)),
  )
  const base =
    matched.length > 0
      ? matched
      : allProducts
          .filter((p) => p.category === post.relatedCollection)
          .slice(0, 4)
  return base.slice(0, 6)
}
