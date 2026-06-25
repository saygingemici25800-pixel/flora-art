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

  /* ── 12 · Sümbül ──────────────────────────────────────────────── */
  {
    slug: 'sumbul',
    category: 'cicek',
    relatedKeywords: ['Sümbül'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/sumbul-aranjman.webp',
    title: {
      tr: 'Sümbül: Baharın Kokulu Müjdecisi',
      en: 'Hyacinths: The Fragrant Herald of Spring',
      ru: 'Гиацинты: ароматный вестник весны',
    },
    metaDescription: {
      tr: "Sümbül baharı, içtenliği ve yeniden doğuşu simgeleyen kokulu bir çiçektir. Sümbül aranjmanı ve Fethiye'de sümbül Flora Art'ta.",
      en: 'The hyacinth is a fragrant flower symbolizing spring, sincerity and rebirth. Hyacinth arrangements and hyacinths in Fethiye at Flora Art.',
      ru: 'Гиацинт — ароматный цветок, символизирующий весну, искренность и возрождение. Композиции из гиацинтов в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Sümbül, baharın gelişini müjdeleyen en kokulu çiçeklerden biridir. Yoğun ve büyüleyici kokusuyla sümbül, içtenliği, oyunculuğu ve yeniden doğuşu simgeler. Fethiye'de bir sümbül aranjmanı, bir mekânı hem renk hem de eşsiz bir koku ile doldurmanın en güzel yoludur.",
        'Sümbülün her rengi farklı bir anlam taşır. Mor sümbül içtenlik ve özrü, mavi sümbül huzuru, beyaz sümbül ise güzelliği anlatır. Baharı kutlamak ya da sevdiklerinize taze bir başlangıç dilemek için sümbül ideal bir seçimdir.',
        'Sümbül bakımında serinlik önemlidir; soğanlı yapısı bol su sever ama köklerinin çürümemesine dikkat edilmelidir. Saplarını kesip serin bir ortamda tuttuğunuzda sümbülleriniz kokusunu uzun süre korur.',
        "Flora Art olarak Fethiye'de en taze sümbülleri seçip zarif aranjmanlar hazırlıyoruz. Sümbül aranjmanlarımız, baharın tazeliğini ve içten duygularınızı kokusuyla birlikte sunar.",
      ],
      en: [
        'The hyacinth is one of the most fragrant flowers heralding the arrival of spring. With its intense and enchanting scent, the hyacinth symbolizes sincerity, playfulness and rebirth. In Fethiye, a hyacinth arrangement is the loveliest way to fill a space with both color and a unique fragrance.',
        'Each color of the hyacinth carries a different meaning. A purple hyacinth expresses sincerity and apology, a blue hyacinth peace, and a white hyacinth beauty. To celebrate spring or wish your loved ones a fresh start, the hyacinth is an ideal choice.',
        'Coolness matters in hyacinth care; its bulbous structure loves plenty of water, but care must be taken to prevent the roots from rotting. When you trim the stems and keep them in a cool place, your hyacinths retain their fragrance for a long time.',
        'At Flora Art, we select the freshest hyacinths in Fethiye and prepare elegant arrangements. Our hyacinth arrangements present the freshness of spring and your sincere feelings together with their fragrance.',
      ],
      ru: [
        'Гиацинт — один из самых ароматных цветов, возвещающих приход весны. Своим насыщенным и чарующим ароматом гиацинт символизирует искренность, игривость и возрождение. В Фетхие композиция из гиацинтов — прекраснейший способ наполнить пространство и цветом, и неповторимым ароматом.',
        'Каждый цвет гиацинта несёт своё значение. Фиолетовый гиацинт выражает искренность и извинение, синий гиацинт — спокойствие, а белый гиацинт — красоту. Чтобы отпраздновать весну или пожелать близким нового начала, гиацинт — идеальный выбор.',
        'В уходе за гиацинтом важна прохлада: его луковичная структура любит обилие воды, но нужно следить, чтобы корни не загнивали. Если подрезать стебли и держать их в прохладе, ваши гиацинты надолго сохранят свой аромат.',
        'В Flora Art мы выбираем самые свежие гиацинты в Фетхие и создаём элегантные композиции. Наши композиции из гиацинтов дарят свежесть весны и ваши искренние чувства вместе с их ароматом.',
      ],
    },
  },

  /* ── 13 · Calla (Gala) ────────────────────────────────────────── */
  {
    slug: 'calla',
    category: 'cicek',
    relatedKeywords: ['Calla', 'Gala'],
    relatedCollection: 'plant',
    heroImage: '/images/products/pexels/pembe-calla-bahce.webp',
    title: {
      tr: 'Calla (Gala Çiçeği): Modern Zarafetin Simgesi',
      en: 'Calla Lilies: The Symbol of Modern Elegance',
      ru: 'Каллы: символ современной элегантности',
    },
    metaDescription: {
      tr: "Calla (gala çiçeği) zarafeti, asaleti ve modern güzelliği simgeler. Calla çiçeği ve Fethiye'de gala siparişi Flora Art'ta.",
      en: 'The calla lily symbolizes elegance, nobility and modern beauty. Calla lilies in Fethiye at Flora Art.',
      ru: 'Калла символизирует элегантность, благородство и современную красоту. Каллы в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Calla, yani gala çiçeği, zarif kıvrımı ve sade duruşuyla modern zarafetin simgesidir. Asaleti, güzelliği ve takdiri anlatan calla, hem buketlerde hem de şık aranjmanlarda göz kamaştırır. Fethiye'de bir calla çiçeği, minimal ama güçlü bir estetik sunar.",
        'Calla çiçeği özellikle düğünlerde ve özel davetlerde tercih edilir, çünkü asaleti ve sofistike güzelliği temsil eder. Beyaz calla saflığı, pembe calla zarafeti, koyu tonlu calla ise gizemi anlatır.',
        'Calla bakımı kolaydır; saplarını çapraz kesip temiz suda tutmak yeterlidir. Suyu düzenli değiştirdiğinizde calla çiçeğiniz zarafetini uzun süre korur.',
        "Flora Art olarak Fethiye'de en taze calla çiçeklerini seçip modern aranjmanlar hazırlıyoruz. Calla aranjmanlarımız, sade ve sofistike zevkinizi en şık biçimde yansıtır.",
      ],
      en: [
        'The calla lily, with its graceful curve and minimalist presence, is the symbol of modern elegance. Expressing nobility, beauty and appreciation, the calla lily dazzles both in bouquets and in stylish arrangements. In Fethiye, a calla lily offers a minimal yet powerful aesthetic.',
        'The calla lily is especially preferred for weddings and special events, as it represents nobility and sophisticated beauty. A white calla lily expresses purity, a pink one elegance, and a dark-toned calla lily mystery.',
        'Caring for the calla lily is easy; it is enough to cut the stems at an angle and keep them in clean water. When you change the water regularly, your calla lily preserves its elegance for a long time.',
        'At Flora Art, we select the freshest calla lilies in Fethiye and prepare modern arrangements. Our calla lily arrangements reflect your simple and sophisticated taste in the most stylish way.',
      ],
      ru: [
        'Калла своим изящным изгибом и минималистичным видом является символом современной элегантности. Выражая благородство, красоту и признательность, калла восхищает и в букетах, и в стильных композициях. В Фетхие калла предлагает минималистичную, но выразительную эстетику.',
        'Каллу особенно предпочитают для свадеб и особых мероприятий, так как она олицетворяет благородство и утончённую красоту. Белая калла выражает чистоту, розовая — элегантность, а калла тёмного оттенка — загадочность.',
        'Уход за каллой прост: достаточно подрезать стебли под углом и держать их в чистой воде. Если регулярно менять воду, ваша калла надолго сохранит свою элегантность.',
        'В Flora Art мы выбираем самые свежие каллы в Фетхие и создаём современные композиции. Наши композиции из калл отражают ваш простой и утончённый вкус в самом стильном виде.',
      ],
    },
  },

  /* ── 14 · Lisianthus ──────────────────────────────────────────── */
  {
    slug: 'lisianthus',
    category: 'cicek',
    relatedKeywords: ['Lisianthus'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/mor-lisianthus-gul-kutu.webp',
    title: {
      tr: 'Lisianthus: Zarif Bir Gül Alternatifi',
      en: 'Lisianthus: An Elegant Rose Alternative',
      ru: 'Лизиантус: изящная альтернатива розе',
    },
    metaDescription: {
      tr: "Lisianthus zarafeti, minnettarlığı ve kalıcı sevgiyi simgeleyen narin bir çiçektir. Lisianthus buketi Fethiye'de Flora Art'ta.",
      en: 'Lisianthus is a delicate flower symbolizing elegance, gratitude and lasting love. Lisianthus bouquets in Fethiye at Flora Art.',
      ru: 'Лизиантус — нежный цветок, символизирующий элегантность, благодарность и прочную любовь. Букеты лизиантуса в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Lisianthus, gülü andıran narin yaprakları ve zarif duruşuyla son yılların en sevilen çiçeklerinden biridir. Minnettarlığı, kalıcı sevgiyi ve takdiri simgeleyen lisianthus, hem sade hem de sofistike bir güzellik sunar. Fethiye'de bir lisianthus buketi, gülün zarafetine farklı bir dokunuş arayanlar için idealdir.",
        'Lisianthus mor, beyaz, pembe ve şampanya tonlarıyla her aranjmana şıklık katar. Bir teşekkürü iletmek, bir başarıyı kutlamak ya da kalıcı bir sevgiyi anlatmak için lisianthus zarif bir seçimdir.',
        'Lisianthus bakımında nazik olmak gerekir; narin saplarını dikkatlice kesip temiz suda tutun. Suyu düzenli değiştirdiğinizde lisianthus çiçekleriniz şaşırtıcı derecede uzun süre taze kalır.',
        "Flora Art olarak Fethiye'de en taze lisianthus çiçeklerini seçip zarif buketler hazırlıyoruz. Lisianthus aranjmanlarımız, narin ve sofistike zevkinizi en güzel biçimde yansıtır.",
      ],
      en: [
        'Lisianthus, with its rose-like delicate petals and elegant presence, is one of the most beloved flowers of recent years. Symbolizing gratitude, lasting love and appreciation, lisianthus offers a beauty that is both simple and sophisticated. In Fethiye, a lisianthus bouquet is ideal for those seeking a different touch on the elegance of the rose.',
        'Lisianthus adds chic to every arrangement with its purple, white, pink and champagne tones. To convey a thank you, celebrate a success, or express a lasting love, lisianthus is an elegant choice.',
        'Caring for lisianthus requires gentleness; carefully cut its delicate stems and keep them in clean water. When you change the water regularly, your lisianthus flowers stay fresh for a surprisingly long time.',
        'At Flora Art, we select the freshest lisianthus in Fethiye and prepare elegant bouquets. Our lisianthus arrangements reflect your delicate and sophisticated taste in the most beautiful way.',
      ],
      ru: [
        'Лизиантус со своими похожими на розу нежными лепестками и изящным видом — один из самых любимых цветов последних лет. Символизируя благодарность, прочную любовь и признательность, лизиантус дарит красоту, одновременно простую и утончённую. В Фетхие букет лизиантуса идеален для тех, кто ищет иной оттенок элегантности розы.',
        'Лизиантус добавляет шик любой композиции своими фиолетовыми, белыми, розовыми и шампанскими тонами. Чтобы выразить благодарность, отпраздновать успех или передать прочную любовь, лизиантус — изящный выбор.',
        'Уход за лизиантусом требует деликатности: аккуратно подрежьте его нежные стебли и держите в чистой воде. Если регулярно менять воду, цветы лизиантуса остаются свежими удивительно долго.',
        'В Flora Art мы выбираем самый свежий лизиантус в Фетхие и составляем изящные букеты. Наши композиции из лизиантуса отражают ваш нежный и утончённый вкус самым прекрасным образом.',
      ],
    },
  },

  /* ── 15 · Ranunculus ──────────────────────────────────────────── */
  {
    slug: 'ranunculus',
    category: 'cicek',
    relatedKeywords: ['Ranunculus'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/sakayik-ranunculus-buket.webp',
    title: {
      tr: 'Ranunculus: Katmanlı Yapraklarıyla Büyüleyen Çiçek',
      en: 'Ranunculus: The Flower Captivating with Layered Petals',
      ru: 'Ранункулюс: цветок, очаровывающий многослойными лепестками',
    },
    metaDescription: {
      tr: "Ranunculus katmanlı yaprakları ve canlı renkleriyle çekiciliği simgeler. Ranunculus buketi Fethiye'de Flora Art'ta.",
      en: 'Ranunculus symbolizes charm with its layered petals and vivid colors. Ranunculus bouquets in Fethiye at Flora Art.',
      ru: 'Ранункулюс символизирует очарование своими многослойными лепестками и яркими красками. Букеты ранункулюса в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Ranunculus, ince ve katmanlı yapraklarıyla bir çiçekten çok bir sanat eserini andırır. Çekiciliği ve zarafeti simgeleyen ranunculus, pastel tonlarından canlı renklerine kadar her aranjmana romantik bir hava katar. Fethiye'de bir ranunculus buketi, ince zevkin en güzel ifadesidir.",
        "Ranunculus 'sen göz kamaştırıcısın' mesajını taşır; bu yüzden hayranlık ve takdir göstermek için ideal bir çiçektir. Düğünlerden doğum günlerine kadar zarif bir dokunuş arayan herkes için ranunculus mükemmel bir seçimdir.",
        'Ranunculus bakımında serinlik ve temiz su önemlidir. Narin saplarını dikkatlice kesip suyu düzenli değiştirdiğinizde ranunculus çiçekleriniz katmanlı güzelliğini uzun süre korur.',
        "Flora Art olarak Fethiye'de en taze ranunculus çiçeklerini seçip romantik buketler hazırlıyoruz. Ranunculus aranjmanlarımız, ince ve zarif zevkinizi en büyüleyici haliyle sunar.",
      ],
      en: [
        'Ranunculus, with its fine and layered petals, resembles a work of art more than a flower. Symbolizing charm and elegance, ranunculus adds a romantic air to every arrangement, from pastel tones to vivid colors. In Fethiye, a ranunculus bouquet is the loveliest expression of refined taste.',
        "Ranunculus carries the message 'you are dazzling,' making it an ideal flower for showing admiration and appreciation. For anyone seeking an elegant touch, from weddings to birthdays, ranunculus is a perfect choice.",
        'Coolness and clean water are important in ranunculus care. When you carefully cut its delicate stems and change the water regularly, your ranunculus flowers retain their layered beauty for a long time.',
        'At Flora Art, we select the freshest ranunculus in Fethiye and prepare romantic bouquets. Our ranunculus arrangements present your refined and elegant taste in its most captivating form.',
      ],
      ru: [
        'Ранункулюс со своими тонкими и многослойными лепестками напоминает скорее произведение искусства, чем цветок. Символизируя очарование и элегантность, ранункулюс добавляет романтическую атмосферу любой композиции — от пастельных тонов до ярких красок. В Фетхие букет ранункулюса — прекраснейшее выражение утончённого вкуса.',
        'Ранункулюс несёт послание «ты ослепительна», что делает его идеальным цветком для выражения восхищения и признательности. Для всех, кто ищет элегантный штрих, от свадеб до дней рождения, ранункулюс — прекрасный выбор.',
        'В уходе за ранункулюсом важны прохлада и чистая вода. Если аккуратно подрезать его нежные стебли и регулярно менять воду, цветы ранункулюса надолго сохранят свою многослойную красоту.',
        'В Flora Art мы выбираем самый свежий ранункулюс в Фетхие и составляем романтические букеты. Наши композиции из ранункулюса представляют ваш утончённый и элегантный вкус в его самом обворожительном виде.',
      ],
    },
  },

  /* ── 16 · Ortanca ─────────────────────────────────────────────── */
  {
    slug: 'ortanca',
    category: 'cicek',
    relatedKeywords: ['Ortanca'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/pembe-gul-orkide-buket.webp',
    title: {
      tr: 'Ortanca: Bolluğun ve İçten Duyguların Çiçeği',
      en: 'Hydrangeas: The Flower of Abundance and Heartfelt Emotions',
      ru: 'Гортензии: цветок изобилия и душевных чувств',
    },
    metaDescription: {
      tr: "Ortanca bolluğu, içten duyguları ve minnettarlığı simgeleyen gösterişli bir çiçektir. Ortanca buketi Fethiye'de Flora Art'ta.",
      en: 'The hydrangea is a showy flower symbolizing abundance, heartfelt emotions and gratitude. Hydrangea bouquets in Fethiye at Flora Art.',
      ru: 'Гортензия — пышный цветок, символизирующий изобилие, душевные чувства и благодарность. Букеты гортензии в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Ortanca, dolgun ve gösterişli görünümüyle bolluğun ve cömertliğin çiçeğidir. Küçük çiçeklerin bir araya gelerek oluşturduğu görkemli yapısıyla ortanca, içten duyguları ve minnettarlığı simgeler. Fethiye'de bir ortanca buketi, zengin ve etkileyici bir armağan sunar.",
        'Ortancanın renkleri farklı anlamlar taşır. Mavi ortanca içtenliği, pembe ortanca samimi duyguları, beyaz ortanca ise saflığı anlatır. Bir teşekkürü iletmek ya da derin duygularınızı göstermek için ortanca etkileyici bir seçimdir.',
        'Ortanca bol su seven bir çiçektir; susuz kaldığında çabuk solar. Saplarını çapraz kesip bol temiz suda tuttuğunuzda ve serin bir ortamda muhafaza ettiğinizde ortancalarınız uzun süre canlı kalır.',
        "Flora Art olarak Fethiye'de en taze ortancaları seçip gösterişli buketler hazırlıyoruz. Ortanca aranjmanlarımız, cömert ve içten duygularınızı en görkemli haliyle ifade eder.",
      ],
      en: [
        'The hydrangea, with its full and showy appearance, is the flower of abundance and generosity. With its magnificent structure formed by small flowers coming together, the hydrangea symbolizes heartfelt emotions and gratitude. In Fethiye, a hydrangea bouquet offers a rich and impressive gift.',
        'The colors of the hydrangea carry different meanings. A blue hydrangea expresses sincerity, a pink one heartfelt emotions, and a white hydrangea purity. To convey a thank you or show your deep feelings, the hydrangea is an impressive choice.',
        'The hydrangea is a flower that loves plenty of water; it wilts quickly when left without it. When you cut the stems at an angle, keep them in plenty of clean water and store them in a cool place, your hydrangeas stay fresh for a long time.',
        'At Flora Art, we select the freshest hydrangeas in Fethiye and prepare showy bouquets. Our hydrangea arrangements express your generous and heartfelt emotions in their most magnificent form.',
      ],
      ru: [
        'Гортензия своим пышным и эффектным видом является цветком изобилия и щедрости. Своей великолепной структурой, образованной множеством маленьких цветков, гортензия символизирует душевные чувства и благодарность. В Фетхие букет гортензии — это богатый и впечатляющий подарок.',
        'Цвета гортензии несут разные значения. Синяя гортензия выражает искренность, розовая — душевные чувства, а белая гортензия — чистоту. Чтобы выразить благодарность или показать ваши глубокие чувства, гортензия — впечатляющий выбор.',
        'Гортензия — цветок, который любит обилие воды; без неё она быстро вянет. Если подрезать стебли под углом, держать их в обилии чистой воды и хранить в прохладе, ваши гортензии надолго останутся свежими.',
        'В Flora Art мы выбираем самые свежие гортензии в Фетхие и составляем эффектные букеты. Наши композиции из гортензии выражают ваши щедрые и душевные чувства в их самом великолепном виде.',
      ],
    },
  },

  /* ── 17 · Aster ───────────────────────────────────────────────── */
  {
    slug: 'aster',
    category: 'cicek',
    relatedKeywords: ['Aster'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/pembe-aster-buket.webp',
    title: {
      tr: 'Aster: Sevginin ve Sabrın Yıldız Çiçeği',
      en: 'Asters: The Star Flower of Love and Patience',
      ru: 'Астры: звёздный цветок любви и терпения',
    },
    metaDescription: {
      tr: "Aster yıldızı andıran yapısıyla sevgiyi, sabrı ve zarafeti simgeler. Aster buketi Fethiye'de Flora Art'ta.",
      en: 'The aster, with its star-like shape, symbolizes love, patience and elegance. Aster bouquets in Fethiye at Flora Art.',
      ru: 'Астра своей звёздообразной формой символизирует любовь, терпение и элегантность. Букеты астр в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Aster, yıldızı andıran narin yaprakları ile zarafetin ve içtenliğin çiçeğidir. Adını yıldız anlamına gelen kelimeden alan aster; sevgiyi, sabrı ve zarif bir güzelliği simgeler. Fethiye'de bir aster buketi, sade ama büyüleyici bir armağan sunar.",
        'Aster çoğunlukla derin sevgiyi ve değer vermeyi anlatmak için tercih edilir. Pembe aster nazik sevgiyi, mor aster bilgeliği, beyaz aster ise masumiyeti simgeler. İçten bir mesaj vermek isteyenler için aster ideal bir çiçektir.',
        'Aster bakımı kolaydır; bol su sever ve serin ortamda uzun süre taze kalır. Saplarını çapraz kesip suyunu düzenli değiştirdiğinizde asterlerinizin yıldız gibi parıltısı uzun süre korunur.',
        "Flora Art olarak Fethiye'de en taze asterleri seçip zarif buketler hazırlıyoruz. Aster aranjmanlarımız, içten ve nazik duygularınızı en zarif haliyle ifade eder.",
      ],
      en: [
        'The aster, with its star-like delicate petals, is the flower of elegance and sincerity. Taking its name from the word meaning star, the aster symbolizes love, patience and graceful beauty. In Fethiye, an aster bouquet offers a simple yet enchanting gift.',
        'The aster is often chosen to express deep love and appreciation. A pink aster symbolizes gentle love, a purple aster wisdom, and a white aster innocence. For those who want to give a heartfelt message, the aster is an ideal flower.',
        'Caring for the aster is easy; it loves plenty of water and stays fresh for a long time in a cool environment. When you cut the stems at an angle and change the water regularly, the star-like sparkle of your asters is preserved for a long time.',
        'At Flora Art, we select the freshest asters in Fethiye and prepare elegant bouquets. Our aster arrangements express your heartfelt and gentle emotions in their most graceful form.',
      ],
      ru: [
        'Астра со своими звёздообразными нежными лепестками — цветок элегантности и искренности. Получив название от слова, означающего «звезда», астра символизирует любовь, терпение и изящную красоту. В Фетхие букет астр — это простой, но обворожительный подарок.',
        'Астру часто выбирают, чтобы выразить глубокую любовь и признательность. Розовая астра символизирует нежную любовь, фиолетовая астра — мудрость, а белая астра — невинность. Для тех, кто хочет передать душевное послание, астра — идеальный цветок.',
        'Уход за астрой прост: она любит обилие воды и долго остаётся свежей в прохладе. Если подрезать стебли под углом и регулярно менять воду, звёздное сияние ваших астр сохранится надолго.',
        'В Flora Art мы выбираем самые свежие астры в Фетхие и составляем изящные букеты. Наши композиции из астр выражают ваши душевные и нежные чувства в их самом изящном виде.',
      ],
    },
  },

  /* ── 18 · Antoryum ────────────────────────────────────────────── */
  {
    slug: 'antoryum',
    category: 'bitki',
    relatedKeywords: ['Antoryum', 'AntORyum'],
    relatedCollection: 'plant',
    heroImage: '/images/products/pexels/antoryum.webp',
    title: {
      tr: 'Antoryum: Misafirperverliğin ve Mutluluğun Bitkisi',
      en: 'Anthurium: The Plant of Hospitality and Happiness',
      ru: 'Антуриум: растение гостеприимства и счастья',
    },
    metaDescription: {
      tr: "Antoryum misafirperverliği, mutluluğu ve bolluğu simgeleyen şık bir saksı bitkisidir. Antoryum bakımı ve Fethiye'de antoryum Flora Art'ta.",
      en: 'Anthurium is a stylish potted plant symbolizing hospitality, happiness and abundance. Anthurium care and anthurium in Fethiye at Flora Art.',
      ru: 'Антуриум — стильное горшечное растение, символизирующее гостеприимство, счастье и изобилие. Уход за антуриумом в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Antoryum, parlak kırmızı yaprakları ve zarif duruşuyla bir mekânı anında canlandıran şık bir saksı bitkisidir. Misafirperverliği, mutluluğu ve bolluğu simgeleyen antoryum, hem ev hem de ofis için ideal bir yeşil dosttur. Fethiye'de bir antoryum, uzun ömürlü ve bakımı kolay bir armağan sunar.",
        'Antoryum çiçeği kalp şeklini andıran yaprağıyla sevgiyi ve sıcak duyguları da çağrıştırır. Bu yüzden bir açılış hediyesi, ev hediyesi ya da sevdiklerinize uzun ömürlü bir jest olarak antoryum mükemmel bir seçimdir.',
        'Antoryum bakımı kolaydır; parlak ama dolaylı ışık sever, toprağı nemli tutulmalı ancak aşırı sulanmamalıdır. Yapraklarını ara sıra silerek parlaklığını koruyabilir, antoryumunuzun aylarca canlı kalmasını sağlayabilirsiniz.',
        "Flora Art olarak Fethiye'de en sağlıklı antoryum bitkilerini özenle seçiyoruz. Antoryum aranjmanlarımız, hem şık bir dekor hem de uzun ömürlü bir sevgi armağanı olarak öne çıkar.",
      ],
      en: [
        'The anthurium, with its glossy red spathes and elegant presence, is a stylish potted plant that instantly brightens a space. Symbolizing hospitality, happiness and abundance, the anthurium is an ideal green companion for both home and office. In Fethiye, an anthurium offers a long-lasting and easy-care gift.',
        'The anthurium, with its heart-shaped spathe, also evokes love and warm emotions. This makes the anthurium a perfect choice as an opening gift, a housewarming gift, or a long-lasting gesture for your loved ones.',
        'Caring for the anthurium is easy; it loves bright but indirect light, and its soil should be kept moist but not overwatered. By occasionally wiping its leaves you can maintain its shine and keep your anthurium alive for months.',
        'At Flora Art, we carefully select the healthiest anthurium plants in Fethiye. Our anthurium arrangements stand out as both a stylish decoration and a long-lasting gift of love.',
      ],
      ru: [
        'Антуриум со своими глянцевыми красными покрывалами и элегантным видом — стильное горшечное растение, которое мгновенно оживляет пространство. Символизируя гостеприимство, счастье и изобилие, антуриум — идеальный зелёный спутник как для дома, так и для офиса. В Фетхие антуриум — это долговечный и неприхотливый подарок.',
        'Антуриум со своим покрывалом в форме сердца также напоминает о любви и тёплых чувствах. Это делает антуриум прекрасным выбором в качестве подарка на открытие, новоселье или долговечного жеста для близких.',
        'Уход за антуриумом прост: он любит яркий, но рассеянный свет, а его почву следует держать влажной, но не переувлажнять. Периодически протирая листья, вы можете сохранить их блеск и поддерживать жизнь антуриума месяцами.',
        'В Flora Art мы тщательно отбираем самые здоровые растения антуриума в Фетхие. Наши композиции с антуриумом выделяются как стильный декор и долговечный подарок любви.',
      ],
    },
  },

  /* ── 19 · Bonsai ──────────────────────────────────────────────── */
  {
    slug: 'bonsai',
    category: 'bitki',
    relatedKeywords: ['Bonsai'],
    relatedCollection: 'plant',
    heroImage: '/images/products/pexels/ficus-bonsai.webp',
    title: {
      tr: 'Bonsai: Sabrın ve Huzurun Minyatür Sanatı',
      en: 'Bonsai: The Miniature Art of Patience and Peace',
      ru: 'Бонсай: миниатюрное искусство терпения и покоя',
    },
    metaDescription: {
      tr: "Bonsai sabrı, huzuru ve doğayla uyumu simgeleyen minyatür bir ağaçtır. Bonsai bakımı ve Fethiye'de bonsai Flora Art'ta.",
      en: 'Bonsai is a miniature tree symbolizing patience, peace and harmony with nature. Bonsai care and bonsai in Fethiye at Flora Art.',
      ru: 'Бонсай — миниатюрное дерево, символизирующее терпение, покой и гармонию с природой. Уход за бонсай в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Bonsai, yüzyıllar öncesine dayanan köklü bir sanatın ürünü olan minyatür bir ağaçtır. Sabrı, huzuru ve doğayla uyumu simgeleyen bonsai, bir mekâna sakinlik ve denge katar. Fethiye'de bir bonsai, sıradan bir bitkiden çok daha anlamlı, kalıcı bir armağandır.",
        'Bonsai hediye etmek, karşınızdaki kişiye saygı, dileklerinizde kalıcılık ve içsel huzur dilemek anlamına gelir. Bu yüzden bonsai, bir iş açılışı, terfi ya da özel bir kutlama için zarif ve anlamlı bir seçimdir.',
        'Bonsai bakımı özen ister; düzenli sulama, doğru ışık ve ara sıra budama ile bonsai ağacınız yıllarca yaşayabilir. Toprağını kurutmadan nemli tutmak ve dolaylı ışıkta bulundurmak bonsainin sağlığı için önemlidir.',
        "Flora Art olarak Fethiye'de özenle yetiştirilmiş sağlıklı bonsai ağaçları sunuyoruz. Bonsai koleksiyonumuz, huzur ve zarafeti bir arada arayanlar için ideal bir armağandır.",
      ],
      en: [
        'Bonsai is a miniature tree, the product of a deep-rooted art dating back centuries. Symbolizing patience, peace and harmony with nature, bonsai brings calm and balance to a space. In Fethiye, a bonsai is a far more meaningful and lasting gift than an ordinary plant.',
        'Gifting a bonsai means wishing the recipient respect, permanence in your good wishes, and inner peace. This makes bonsai an elegant and meaningful choice for a business opening, a promotion or a special celebration.',
        "Bonsai care requires attention; with regular watering, proper light and occasional pruning, your bonsai tree can live for years. Keeping its soil moist without drying out and placing it in indirect light is important for the bonsai's health.",
        'At Flora Art, we offer healthy, carefully cultivated bonsai trees in Fethiye. Our bonsai collection is an ideal gift for those seeking peace and elegance together.',
      ],
      ru: [
        'Бонсай — миниатюрное дерево, плод глубоко укоренившегося искусства, восходящего к векам. Символизируя терпение, покой и гармонию с природой, бонсай привносит в пространство спокойствие и равновесие. В Фетхие бонсай — гораздо более значимый и долговечный подарок, чем обычное растение.',
        'Подарить бонсай — значит пожелать человеку уважения, постоянства в ваших добрых пожеланиях и внутреннего покоя. Это делает бонсай элегантным и значимым выбором для открытия бизнеса, повышения или особого торжества.',
        'Уход за бонсай требует внимания: при регулярном поливе, правильном освещении и периодической обрезке ваше дерево бонсай может прожить годы. Поддерживать почву влажной, не пересушивая, и держать его при рассеянном свете важно для здоровья бонсай.',
        'В Flora Art мы предлагаем здоровые, бережно выращенные деревья бонсай в Фетхие. Наша коллекция бонсай — идеальный подарок для тех, кто ищет покой и элегантность одновременно.',
      ],
    },
  },

  /* ── 20 · Sukulent & Kaktüs ───────────────────────────────────── */
  {
    slug: 'sukulent-kaktus',
    category: 'bitki',
    relatedKeywords: ['Sukulent', 'Kaktüs'],
    relatedCollection: 'plant',
    heroImage: '/images/products/pexels/kaktus-bahcesi.webp',
    title: {
      tr: 'Sukulent ve Kaktüs: Dayanıklılığın Minimal Güzelliği',
      en: 'Succulents and Cacti: The Minimal Beauty of Resilience',
      ru: 'Суккуленты и кактусы: минималистичная красота стойкости',
    },
    metaDescription: {
      tr: "Sukulent ve kaktüs dayanıklılığı, sadeliği ve modern estetiği simgeler. Sukulent bakımı ve Fethiye'de kaktüs Flora Art'ta.",
      en: 'Succulents and cacti symbolize resilience, simplicity and modern aesthetics. Succulent care and cacti in Fethiye at Flora Art.',
      ru: 'Суккуленты и кактусы символизируют стойкость, простоту и современную эстетику. Уход за суккулентами в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Sukulent ve kaktüs, dayanıklı yapıları ve minimal güzellikleriyle modern dekorların vazgeçilmezidir. Az suyla yaşayabilen bu bitkiler; gücü, dayanıklılığı ve sade zarafeti simgeler. Fethiye'de bir sukulent ya da kaktüs, bakımı en kolay ve en uzun ömürlü yeşil armağanlardandır.",
        "Sukulent ve kaktüs, 'her koşulda yanındayım' mesajını taşıyan anlamlı bitkilerdir. Bir öğrenciye, yoğun çalışan bir sevdiğinize ya da bitki bakmaya yeni başlayan birine sukulent hediye etmek hem şık hem de pratik bir jesttir.",
        'Sukulent ve kaktüs bakımı oldukça kolaydır; bol güneş ister ve çok az sulama gerektirir. Toprağı tamamen kuruyunca sulamak, bu bitkilerin uzun yıllar sağlıklı kalmasını sağlar; fazla su en büyük düşmanlarıdır.',
        "Flora Art olarak Fethiye'de şık saksılarda sukulent ve kaktüs aranjmanları hazırlıyoruz. Minimal ve modern koleksiyonumuz, hem dekoratif hem de uzun ömürlü bir hediye arayanlar için idealdir.",
      ],
      en: [
        'Succulents and cacti, with their resilient structures and minimal beauty, are indispensable to modern decor. These plants, able to live on little water, symbolize strength, resilience and simple elegance. In Fethiye, a succulent or cactus is among the easiest-care and longest-lasting green gifts.',
        "Succulents and cacti are meaningful plants that carry the message 'I am with you under any condition.' Gifting a succulent to a student, a hard-working loved one, or someone new to caring for plants is both a stylish and practical gesture.",
        'Caring for succulents and cacti is quite easy; they need plenty of sun and very little watering. Watering only when the soil is completely dry keeps these plants healthy for many years; too much water is their greatest enemy.',
        'At Flora Art, we prepare succulent and cactus arrangements in stylish pots in Fethiye. Our minimal and modern collection is ideal for those seeking a gift that is both decorative and long-lasting.',
      ],
      ru: [
        'Суккуленты и кактусы со своими стойкими структурами и минималистичной красотой незаменимы в современном декоре. Эти растения, способные жить при малом количестве воды, символизируют силу, стойкость и простую элегантность. В Фетхие суккулент или кактус — один из самых неприхотливых и долговечных зелёных подарков.',
        'Суккуленты и кактусы — значимые растения, несущие послание «я с тобой при любых обстоятельствах». Подарить суккулент студенту, много работающему близкому человеку или тому, кто только начинает ухаживать за растениями, — это стильный и практичный жест.',
        'Уход за суккулентами и кактусами довольно прост: им нужно много солнца и совсем немного полива. Полив только тогда, когда почва полностью высохла, сохраняет эти растения здоровыми долгие годы; избыток воды — их злейший враг.',
        'В Flora Art мы создаём композиции из суккулентов и кактусов в стильных горшках в Фетхие. Наша минималистичная и современная коллекция идеальна для тех, кто ищет подарок одновременно декоративный и долговечный.',
      ],
    },
  },

  /* ── 21 · Areka Palmiyesi ─────────────────────────────────────── */
  {
    slug: 'areka-palmiyesi',
    category: 'bitki',
    relatedKeywords: ['Areka', 'Palmiye'],
    relatedCollection: 'plant',
    heroImage: '/images/products/pexels/areka-palmiyesi.webp',
    title: {
      tr: 'Areka Palmiyesi: Tropik Ferahlığın Yeşil Dokunuşu',
      en: 'Areca Palm: The Green Touch of Tropical Freshness',
      ru: 'Арековая пальма: зелёный штрих тропической свежести',
    },
    metaDescription: {
      tr: "Areka palmiyesi ferahlığı, bolluğu ve doğal havayı simgeleyen şık bir iç mekân bitkisidir. Areka palmiyesi bakımı Fethiye'de Flora Art'ta.",
      en: 'The areca palm is a stylish indoor plant symbolizing freshness, abundance and natural air. Areca palm care in Fethiye at Flora Art.',
      ru: 'Арековая пальма — стильное комнатное растение, символизирующее свежесть, изобилие и природную атмосферу. Уход за арековой пальмой в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Areka palmiyesi, zarif yaprakları ve tropik duruşuyla bir mekâna ferahlık ve doğallık katan şık bir iç mekân bitkisidir. Bolluğu, huzuru ve canlılığı simgeleyen areka palmiyesi, hem evler hem de ofisler için ideal bir yeşil seçimdir. Fethiye'de bir areka palmiyesi, mekânınıza tropik bir nefes getirir.",
        'Areka palmiyesi havayı temizleyen özelliğiyle de bilinir; bu yüzden sağlıklı bir yaşam alanı arayanlar için anlamlı bir hediyedir. Bir açılış, yeni ev ya da ofis hediyesi olarak areka palmiyesi hem şık hem de faydalı bir jesttir.',
        'Areka palmiyesi bakımı kolaydır; parlak dolaylı ışık sever ve toprağının hafif nemli kalmasını ister. Yapraklarını ara sıra nemlendirmek, areka palmiyenizin canlı ve sağlıklı kalmasını sağlar.',
        "Flora Art olarak Fethiye'de sağlıklı ve gür areka palmiyeleri sunuyoruz. Areka palmiyesi koleksiyonumuz, mekânlara doğal bir ferahlık katmak isteyenler için ideal bir armağandır.",
      ],
      en: [
        'The areca palm, with its elegant fronds and tropical presence, is a stylish indoor plant that brings freshness and naturalness to a space. Symbolizing abundance, peace and vitality, the areca palm is an ideal green choice for both homes and offices. In Fethiye, an areca palm brings a tropical breath to your space.',
        'The areca palm is also known for its air-purifying quality, making it a meaningful gift for those seeking a healthy living space. As an opening, new home or office gift, the areca palm is both a stylish and useful gesture.',
        'Caring for the areca palm is easy; it loves bright indirect light and likes its soil to stay slightly moist. Occasionally misting its leaves keeps your areca palm lively and healthy.',
        'At Flora Art, we offer healthy and lush areca palms in Fethiye. Our areca palm collection is an ideal gift for those who want to add a natural freshness to their spaces.',
      ],
      ru: [
        'Арековая пальма со своими элегантными листьями и тропическим видом — стильное комнатное растение, которое привносит в пространство свежесть и естественность. Символизируя изобилие, покой и жизненную силу, арековая пальма — идеальный зелёный выбор как для дома, так и для офиса. В Фетхие арековая пальма приносит в ваше пространство тропическое дыхание.',
        'Арековая пальма также известна своим свойством очищать воздух, что делает её значимым подарком для тех, кто ищет здоровое жизненное пространство. В качестве подарка на открытие, новоселье или для офиса арековая пальма — это стильный и полезный жест.',
        'Уход за арековой пальмой прост: она любит яркий рассеянный свет и предпочитает, чтобы её почва оставалась слегка влажной. Периодическое опрыскивание листьев сохраняет вашу арековую пальму живой и здоровой.',
        'В Flora Art мы предлагаем здоровые и пышные арековые пальмы в Фетхие. Наша коллекция арековых пальм — идеальный подарок для тех, кто хочет добавить своему пространству естественной свежести.',
      ],
    },
  },

  /* ── 22 · Barış Çiçeği (Spathiphyllum) ────────────────────────── */
  {
    slug: 'baris-cicegi',
    category: 'bitki',
    relatedKeywords: ['Barış Çiçeği', 'Spathiphyllum', 'Spatifilyum'],
    relatedCollection: 'plant',
    heroImage: '/images/products/pexels/benekli-orkide-saksi.webp',
    title: {
      tr: 'Barış Çiçeği (Spathiphyllum): Huzurun ve Saflığın Bitkisi',
      en: 'Peace Lily (Spathiphyllum): The Plant of Peace and Purity',
      ru: 'Спатифиллум: растение мира и чистоты',
    },
    metaDescription: {
      tr: "Barış çiçeği (spathiphyllum) huzuru, saflığı ve uyumu simgeleyen zarif bir saksı bitkisidir. Barış çiçeği bakımı Fethiye'de Flora Art'ta.",
      en: 'The peace lily (spathiphyllum) is an elegant potted plant symbolizing peace, purity and harmony. Peace lily care in Fethiye at Flora Art.',
      ru: 'Спатифиллум — изящное горшечное растение, символизирующее мир, чистоту и гармонию. Уход за спатифиллумом в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Barış çiçeği, beyaz zarif çiçekleri ve koyu yeşil yapraklarıyla huzurun ve saflığın simgesidir. Spathiphyllum olarak da bilinen bu zarif bitki; sükuneti, uyumu ve iyi niyeti anlatır. Fethiye'de bir barış çiçeği, bir mekâna hem zarafet hem de dinginlik katar.",
        'Barış çiçeği adından da anlaşılacağı gibi huzur ve uzlaşma diler; bu yüzden bir özrü iletmek, geçmiş olsun demek ya da içten iyi dilekler sunmak için anlamlı bir hediyedir. Ev ve ofis için sağlıklı ve şık bir yeşil dosttur.',
        "Barış çiçeği bakımı kolaydır; dolaylı ışık sever ve toprağının nemli kalmasını ister. Yaprakları sarktığında suya ihtiyacı olduğunu anlar, böylece barış çiçeğinizin bakımını kolayca takip edebilirsiniz.",
        "Flora Art olarak Fethiye'de sağlıklı barış çiçeği bitkileri sunuyoruz. Barış çiçeği koleksiyonumuz, huzur ve saflığı bir armağanla iletmek isteyenler için ideal bir seçimdir.",
      ],
      en: [
        'The peace lily, with its elegant white blooms and dark green leaves, is the symbol of peace and purity. Also known as spathiphyllum, this graceful plant expresses calm, harmony and goodwill. In Fethiye, a peace lily brings both elegance and serenity to a space.',
        'As its name suggests, the peace lily wishes peace and reconciliation, making it a meaningful gift for conveying an apology, wishing a speedy recovery, or offering heartfelt good wishes. It is a healthy and stylish green companion for home and office.',
        "Caring for the peace lily is easy; it loves indirect light and likes its soil to stay moist. When its leaves droop, you know it needs water, so you can easily keep track of your peace lily's care.",
        'At Flora Art, we offer healthy peace lily plants in Fethiye. Our peace lily collection is an ideal choice for those who want to convey peace and purity with a gift.',
      ],
      ru: [
        'Спатифиллум со своими изящными белыми цветками и тёмно-зелёными листьями — символ мира и чистоты. Это грациозное растение выражает спокойствие, гармонию и доброжелательность. В Фетхие спатифиллум привносит в пространство и элегантность, и безмятежность.',
        'Как следует из его значения, спатифиллум желает мира и примирения, что делает его значимым подарком, чтобы выразить извинение, пожелать скорейшего выздоровления или преподнести искренние добрые пожелания. Это здоровый и стильный зелёный спутник для дома и офиса.',
        'Уход за спатифиллумом прост: он любит рассеянный свет и предпочитает, чтобы почва оставалась влажной. Когда его листья опускаются, вы понимаете, что ему нужна вода, поэтому за уходом легко следить.',
        'В Flora Art мы предлагаем здоровые растения спатифиллума в Фетхие. Наша коллекция спатифиллума — идеальный выбор для тех, кто хочет передать мир и чистоту в подарок.',
      ],
    },
  },

  /* ── 23 · Begonvil ────────────────────────────────────────────── */
  {
    slug: 'begonvil',
    category: 'cicek',
    relatedKeywords: ['Begonvil'],
    relatedCollection: 'plant',
    heroImage: '/images/products/pexels/renkli-spray-gul-mavi.webp',
    title: {
      tr: "Begonvil: Akdeniz'in Rengârenk Tutkusu",
      en: 'Bougainvillea: The Colorful Passion of the Mediterranean',
      ru: 'Бугенвиллея: яркая страсть Средиземноморья',
    },
    metaDescription: {
      tr: "Begonvil Akdeniz'in simgesi, canlı renkleri ve dayanıklılığıyla tutkuyu anlatır. Fethiye'de begonvil ve çiçek siparişi Flora Art'ta.",
      en: 'Bougainvillea, the symbol of the Mediterranean, expresses passion with its vivid colors and resilience. Bougainvillea and flowers in Fethiye at Flora Art.',
      ru: 'Бугенвиллея, символ Средиземноморья, выражает страсть своими яркими красками и стойкостью. Бугенвиллея и цветы в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Begonvil, Akdeniz'in ve Fethiye'nin sokaklarını süsleyen, rengârenk yapraklarıyla tutkuyu ve canlılığı simgeleyen büyüleyici bir bitkidir. Mor, pembe, turuncu ve kırmızı tonlarıyla begonvil, sıcak iklimin neşesini ve coşkusunu yansıtır. Fethiye'de begonvil, bu güzel beldenin doğal güzelliğinin bir parçasıdır.",
        'Begonvil dayanıklılığı ve uzun ömrüyle de bilinir; sıcağa ve güneşe meydan okuyan yapısıyla gücü ve azmi simgeler. Bir mekâna Akdeniz ruhu katmak isteyenler için begonvil eşsiz bir ilham kaynağıdır.',
        "Begonvil bakımı kolaydır; bol güneş ve ılıman iklim sever, az suyla bile gürbüz kalır. Fethiye'nin iklimi begonvil için idealdir, bu yüzden bahçelerde ve balkonlarda sıkça tercih edilir.",
        "Flora Art olarak Fethiye'nin bu simge bitkisinden ilham alıyor, Akdeniz'in canlı renklerini çiçek aranjmanlarımıza taşıyoruz. Begonvilin coşkulu ruhunu yansıtan rengârenk buketlerimizle sevdiklerinize Fethiye'nin güzelliğini ulaştırın.",
      ],
      en: [
        'Bougainvillea is an enchanting plant that adorns the streets of the Mediterranean and Fethiye, symbolizing passion and vitality with its colorful bracts. With its purple, pink, orange and red tones, bougainvillea reflects the joy and enthusiasm of the warm climate. In Fethiye, bougainvillea is part of the natural beauty of this lovely town.',
        'Bougainvillea is also known for its resilience and longevity; with a structure that defies heat and sun, it symbolizes strength and perseverance. For those who want to add a Mediterranean spirit to a space, bougainvillea is a unique source of inspiration.',
        'Caring for bougainvillea is easy; it loves plenty of sun and a mild climate, and stays lush even with little water. The climate of Fethiye is ideal for bougainvillea, which is why it is often preferred in gardens and on balconies.',
        'At Flora Art, we draw inspiration from this iconic plant of Fethiye, bringing the vivid colors of the Mediterranean to our flower arrangements. With our colorful bouquets reflecting the exuberant spirit of bougainvillea, deliver the beauty of Fethiye to your loved ones.',
      ],
      ru: [
        'Бугенвиллея — очаровательное растение, украшающее улицы Средиземноморья и Фетхие, символизирующее страсть и жизненную силу своими яркими прицветниками. Своими фиолетовыми, розовыми, оранжевыми и красными тонами бугенвиллея отражает радость и воодушевление тёплого климата. В Фетхие бугенвиллея — часть природной красоты этого прекрасного городка.',
        'Бугенвиллея также известна своей стойкостью и долголетием; своей структурой, бросающей вызов жаре и солнцу, она символизирует силу и упорство. Для тех, кто хочет привнести средиземноморский дух в пространство, бугенвиллея — уникальный источник вдохновения.',
        'Уход за бугенвиллеей прост: она любит обилие солнца и мягкий климат и остаётся пышной даже при малом поливе. Климат Фетхие идеален для бугенвиллеи, поэтому её часто предпочитают в садах и на балконах.',
        'В Flora Art мы черпаем вдохновение в этом символичном растении Фетхие, привнося яркие краски Средиземноморья в наши цветочные композиции. С нашими красочными букетами, отражающими жизнерадостный дух бугенвиллеи, дарите красоту Фетхие своим близким.',
      ],
    },
  },

  /* ── 24 · Lavanta ─────────────────────────────────────────────── */
  {
    slug: 'lavanta',
    category: 'cicek',
    relatedKeywords: ['Lavanta'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/sumbul-aranjman.webp',
    title: {
      tr: 'Lavanta: Huzurun ve Sakinliğin Mor Kokusu',
      en: 'Lavender: The Purple Scent of Peace and Calm',
      ru: 'Лаванда: фиолетовый аромат покоя и спокойствия',
    },
    metaDescription: {
      tr: "Lavanta huzuru, sakinliği ve zarafeti simgeleyen kokulu mor bir çiçektir. Lavanta aranjmanı ve Fethiye'de lavanta Flora Art'ta.",
      en: 'Lavender is a fragrant purple flower symbolizing peace, calm and elegance. Lavender arrangements and lavender in Fethiye at Flora Art.',
      ru: 'Лаванда — ароматный фиолетовый цветок, символизирующий покой, спокойствие и элегантность. Композиции из лаванды в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Lavanta, sakinleştirici kokusu ve zarif mor tonuyla huzurun simgesidir. Yüzyıllardır dinginlik ve rahatlama ile özdeşleşen lavanta, hem görünümü hem de kokusuyla bir mekâna sükunet katar. Fethiye'de bir lavanta aranjmanı, sevdiklerinize huzur ve zarafet göndermenin en güzel yoludur.",
        'Lavanta sadakati, zarafeti ve içsel huzuru simgeler. Stresli bir dönem geçiren bir sevdiğinize ya da huzur dilemek istediğiniz birine lavanta, hem anlamlı hem de rahatlatıcı bir armağandır.',
        'Lavanta kurutulduğunda bile kokusunu ve güzelliğini uzun süre korur; bu yüzden hem taze hem de kuru aranjmanlarda tercih edilir. Lavantayı serin ve havadar bir yerde tutmak, kokusunun kalıcılığını artırır.',
        "Flora Art olarak Fethiye'de lavantanın huzur veren ruhunu aranjmanlarımıza taşıyoruz. Lavanta buketlerimiz, sakinlik ve zarafeti bir arada sunarak sevdiklerinize huzur dolu bir mesaj iletir.",
      ],
      en: [
        'Lavender, with its calming scent and elegant purple tone, is the symbol of peace. Identified with serenity and relaxation for centuries, lavender brings tranquility to a space with both its appearance and its fragrance. In Fethiye, a lavender arrangement is the loveliest way to send peace and elegance to your loved ones.',
        'Lavender symbolizes devotion, elegance and inner peace. For a loved one going through a stressful time, or for someone you wish peace, lavender is both a meaningful and soothing gift.',
        'Lavender retains its scent and beauty for a long time even when dried, which is why it is preferred in both fresh and dried arrangements. Keeping lavender in a cool and airy place increases the longevity of its fragrance.',
        'At Flora Art, we bring the peaceful spirit of lavender to our arrangements in Fethiye. Our lavender bouquets offer calm and elegance together, conveying a peaceful message to your loved ones.',
      ],
      ru: [
        'Лаванда со своим успокаивающим ароматом и элегантным фиолетовым оттенком — символ покоя. Веками отождествляемая с безмятежностью и расслаблением, лаванда привносит в пространство спокойствие и своим видом, и своим ароматом. В Фетхие композиция из лаванды — прекраснейший способ подарить близким покой и элегантность.',
        'Лаванда символизирует преданность, элегантность и внутренний покой. Для близкого человека, переживающего напряжённый период, или для того, кому вы желаете покоя, лаванда — это значимый и успокаивающий подарок.',
        'Лаванда сохраняет свой аромат и красоту надолго даже в сухом виде, поэтому её предпочитают как в свежих, так и в сухих композициях. Хранение лаванды в прохладном и проветриваемом месте увеличивает стойкость её аромата.',
        'В Flora Art мы привносим умиротворяющий дух лаванды в наши композиции в Фетхие. Наши букеты из лаванды сочетают спокойствие и элегантность, передавая вашим близким умиротворяющее послание.',
      ],
    },
  },

  /* ── 25 · Ayçiçeği ────────────────────────────────────────────── */
  {
    slug: 'aycicegi',
    category: 'cicek',
    relatedKeywords: ['Ayçiçeği'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/sari-turuncu-gul-vazo.webp',
    title: {
      tr: 'Ayçiçeği: Güneşin ve Mutluluğun Çiçeği',
      en: 'Sunflowers: The Flower of Sun and Happiness',
      ru: 'Подсолнухи: цветок солнца и счастья',
    },
    metaDescription: {
      tr: "Ayçiçeği güneşi, mutluluğu ve sadakati simgeleyen neşeli bir çiçektir. Ayçiçeği buketi ve Fethiye'de ayçiçeği Flora Art'ta.",
      en: 'The sunflower is a cheerful flower symbolizing the sun, happiness and loyalty. Sunflower bouquets and sunflowers in Fethiye at Flora Art.',
      ru: 'Подсолнух — жизнерадостный цветок, символизирующий солнце, счастье и верность. Букеты подсолнухов в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Ayçiçeği, güneşi andıran parlak sarı yapraklarıyla mutluluğun ve pozitif enerjinin çiçeğidir. Hep güneşe dönen yapısıyla ayçiçeği; sadakati, hayranlığı ve neşeyi simgeler. Fethiye'de bir ayçiçeği buketi, sevdiklerinize bir parça güneş ışığı göndermek gibidir.",
        "Ayçiçeği 'sen benim güneşimsin' mesajını taşır; bu yüzden hayranlık ve içten sevgi göstermek için ideal bir çiçektir. Doğum günleri, kutlamalar ve moral vermek istediğiniz her an için ayçiçeği neşeli bir seçimdir.",
        'Ayçiçeği bakımı kolaydır ama bol su sever; uzun sapları nedeniyle düzenli su takviyesi gerektirir. Saplarını çapraz kesip suyunu sık değiştirdiğinizde ayçiçeklerinizin canlı sarısı uzun süre korunur.',
        "Flora Art olarak Fethiye'de en taze ayçiçeklerini seçip neşeli buketler hazırlıyoruz. Ayçiçeği aranjmanlarımız, sevdiklerinize güneşin sıcaklığını ve mutluluğunu en canlı haliyle ulaştırır.",
      ],
      en: [
        'The sunflower, with its bright yellow petals resembling the sun, is the flower of happiness and positive energy. With its structure that always turns toward the sun, the sunflower symbolizes loyalty, admiration and joy. In Fethiye, a sunflower bouquet is like sending a piece of sunshine to your loved ones.',
        "The sunflower carries the message 'you are my sunshine,' making it an ideal flower for showing admiration and heartfelt love. For birthdays, celebrations and every moment you want to lift someone's spirits, the sunflower is a cheerful choice.",
        'Caring for the sunflower is easy but it loves plenty of water; due to its long stems it requires regular watering. When you cut the stems at an angle and change the water often, the vivid yellow of your sunflowers is preserved for a long time.',
        'At Flora Art, we select the freshest sunflowers in Fethiye and prepare cheerful bouquets. Our sunflower arrangements deliver the warmth and happiness of the sun to your loved ones in their most vibrant form.',
      ],
      ru: [
        'Подсолнух со своими яркими жёлтыми лепестками, напоминающими солнце, — цветок счастья и позитивной энергии. Своей структурой, всегда обращённой к солнцу, подсолнух символизирует верность, восхищение и радость. В Фетхие букет подсолнухов — это словно отправить близким частичку солнечного света.',
        'Подсолнух несёт послание «ты моё солнце», что делает его идеальным цветком для выражения восхищения и искренней любви. Для дней рождения, праздников и каждого момента, когда хочется поднять кому-то настроение, подсолнух — жизнерадостный выбор.',
        'Уход за подсолнухом прост, но он любит обилие воды; из-за длинных стеблей ему требуется регулярный полив. Если подрезать стебли под углом и часто менять воду, яркая желтизна ваших подсолнухов сохранится надолго.',
        'В Flora Art мы выбираем самые свежие подсолнухи в Фетхие и составляем жизнерадостные букеты. Наши композиции из подсолнухов дарят вашим близким тепло и счастье солнца в их самом ярком виде.',
      ],
    },
  },

  /* ── 26 · Nilüfer ─────────────────────────────────────────────── */
  {
    slug: 'nilufer',
    category: 'cicek',
    relatedKeywords: ['Nilüfer'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/beyaz-gul-vazo.webp',
    title: {
      tr: 'Nilüfer: Saflığın ve Aydınlanmanın Su Çiçeği',
      en: 'Water Lily: The Aquatic Flower of Purity and Enlightenment',
      ru: 'Кувшинка: водный цветок чистоты и просветления',
    },
    metaDescription: {
      tr: "Nilüfer saflığı, huzuru ve aydınlanmayı simgeleyen zarif bir su çiçeğidir. Nilüfer temalı aranjmanlar Fethiye'de Flora Art'ta.",
      en: 'The water lily is an elegant aquatic flower symbolizing purity, peace and enlightenment. Water lily themed arrangements in Fethiye at Flora Art.',
      ru: 'Кувшинка — изящный водный цветок, символизирующий чистоту, покой и просветление. Композиции на тему кувшинки в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Nilüfer, durgun suların üzerinde açan zarif yapraklarıyla saflığın ve huzurun simgesidir. Birçok kültürde aydınlanmayı ve ruhsal arınmayı temsil eden nilüfer, dinginliği ve içsel güzelliği anlatır. Fethiye'de nilüfer temalı bir aranjman, huzur ve zarafeti bir arada sunar.",
        'Nilüfer, çamurlu sulardan yükselip tertemiz açmasıyla yeniden doğuşu ve umudu simgeler. Zor bir dönemden geçen birine ya da yeni bir başlangıç dileyen sevdiklerinize nilüfer derin ve anlamlı bir mesaj iletir.',
        'Nilüfer narin bir çiçektir ve serin, temiz su ister. Su çiçekleri zarif yapıları nedeniyle özel bakım gerektirir; serin ortamda ve temiz suda tutulduğunda nilüferin zarafeti uzun süre korunur.',
        "Flora Art olarak Fethiye'de nilüferin huzur veren ruhundan ilham alıyoruz. Saf ve dingin aranjmanlarımız, nilüferin simgelediği zarafeti ve içsel güzelliği sevdiklerinize ulaştırır.",
      ],
      en: [
        'The water lily, with its elegant petals blooming over still waters, is the symbol of purity and peace. Representing enlightenment and spiritual purification in many cultures, the water lily expresses serenity and inner beauty. In Fethiye, a water lily themed arrangement offers peace and elegance together.',
        'The water lily, rising from muddy waters to bloom immaculately, symbolizes rebirth and hope. For someone going through a difficult time, or for loved ones wishing a new beginning, the water lily conveys a deep and meaningful message.',
        'The water lily is a delicate flower and requires cool, clean water. Aquatic flowers need special care due to their graceful structure; when kept in a cool environment and clean water, the elegance of the water lily is preserved for a long time.',
        'At Flora Art, we draw inspiration from the peaceful spirit of the water lily in Fethiye. Our pure and serene arrangements deliver the elegance and inner beauty symbolized by the water lily to your loved ones.',
      ],
      ru: [
        'Кувшинка со своими изящными лепестками, распускающимися над спокойной водой, — символ чистоты и покоя. Олицетворяя во многих культурах просветление и духовное очищение, кувшинка выражает безмятежность и внутреннюю красоту. В Фетхие композиция на тему кувшинки сочетает покой и элегантность.',
        'Кувшинка, поднимающаяся из мутной воды, чтобы безупречно расцвести, символизирует возрождение и надежду. Для того, кто переживает трудное время, или для близких, желающих нового начала, кувшинка передаёт глубокое и значимое послание.',
        'Кувшинка — нежный цветок, которому нужна прохладная, чистая вода. Водные цветы требуют особого ухода из-за своей грациозной структуры; при содержании в прохладной среде и чистой воде элегантность кувшинки сохраняется надолго.',
        'В Flora Art мы черпаем вдохновение в умиротворяющем духе кувшинки в Фетхие. Наши чистые и безмятежные композиции дарят вашим близким элегантность и внутреннюю красоту, которые символизирует кувшинка.',
      ],
    },
  },

  /* ── 27 · Rehber · Sevgiliye Çiçek Seçimi ─────────────────────── */
  {
    slug: 'sevgiliye-cicek-secimi',
    category: 'rehber',
    relatedKeywords: ['Gül', 'Kırmızı Gül'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/kirmizi-gul-buket-kurdele.webp',
    title: {
      tr: 'Sevgiliye Çiçek Seçimi: Hangi Çiçek Ne Anlatır?',
      en: 'Choosing Flowers for Your Loved One: What Each Flower Says',
      ru: 'Выбор цветов для любимого человека: о чём говорит каждый цветок',
    },
    metaDescription: {
      tr: "Sevgiliye çiçek seçimi rehberi: hangi çiçek hangi duyguyu anlatır? Doğru çiçeği seçin, Fethiye'de Flora Art ile gönderin.",
      en: 'A guide to choosing flowers for your loved one: which flower expresses which emotion? Choose the right flower and send it with Flora Art in Fethiye.',
      ru: 'Руководство по выбору цветов для любимого человека: какой цветок выражает какое чувство? Выберите правильный цветок и отправьте с Flora Art в Фетхие.',
    },
    body: {
      tr: [
        "Sevgiliye çiçek seçimi, sözcüklerle anlatamadığınız duyguları aktarmanın en zarif yoludur. Doğru çiçeği seçmek, mesajınızı çok daha anlamlı kılar. Fethiye'de sevdiğinize çiçek gönderirken, her çiçeğin taşıdığı anlamı bilmek size yol gösterir.",
        'Kırmızı gül tutkulu aşkın değişmez sembolüdür; sevgilinize derin aşkınızı anlatmak isterseniz kırmızı gül her zaman doğru seçimdir. Pembe gül nazik sevgiyi ve hayranlığı, beyaz gül saf ve sonsuz bağlılığı simgeler. Yeni başlayan bir ilişki için pembe güller, köklü bir aşk için kırmızı güller idealdir.',
        'Aşkın yanında neşe de iletmek isterseniz, gerbera ve ayçiçeği gibi canlı çiçekler mutluluğu ve pozitif enerjiyi anlatır. Zarafeti öne çıkarmak isteyenler için lilyum, şakayık ve lisianthus sofistike birer seçimdir. Karanfil ise hem uzun ömrü hem de derin sevgi anlamıyla romantik bir alternatiftir.',
        "Flora Art olarak Fethiye'de sevgilinize en uygun çiçeği seçmenize yardımcı oluyoruz. İster tutkulu kırmızı güller, ister zarif bir karışım olsun, duygularınızı en güzel biçimde ifade eden aranjmanları sizin için hazırlıyoruz.",
      ],
      en: [
        'Choosing flowers for your loved one is the most elegant way to convey emotions you cannot express in words. Selecting the right flower makes your message far more meaningful. When sending flowers to your beloved in Fethiye, knowing the meaning each flower carries guides you.',
        'The red rose is the unchanging symbol of passionate love; if you want to express your deep love to your sweetheart, the red rose is always the right choice. The pink rose symbolizes gentle love and admiration, and the white rose pure and eternal devotion. Pink roses are ideal for a new relationship, red roses for a deep-rooted love.',
        'If you want to convey joy alongside love, vivid flowers like gerbera and sunflower express happiness and positive energy. For those who want to highlight elegance, lily, peony and lisianthus are sophisticated choices. The carnation, with both its long life and its meaning of deep love, is a romantic alternative.',
        'At Flora Art, we help you choose the most suitable flower for your loved one in Fethiye. Whether passionate red roses or an elegant mix, we prepare arrangements that express your feelings in the most beautiful way.',
      ],
      ru: [
        'Выбор цветов для любимого человека — самый изящный способ передать чувства, которые невозможно выразить словами. Выбор правильного цветка делает ваше послание гораздо более значимым. Отправляя цветы любимому в Фетхие, знание значения каждого цветка станет вашим ориентиром.',
        'Красная роза — неизменный символ страстной любви; если вы хотите выразить любимому человеку свою глубокую любовь, красная роза всегда будет правильным выбором. Розовая роза символизирует нежную любовь и восхищение, а белая роза — чистую и вечную преданность. Розовые розы идеальны для новых отношений, красные розы — для глубокой любви.',
        'Если вы хотите передать вместе с любовью и радость, яркие цветы, такие как гербера и подсолнух, выражают счастье и позитивную энергию. Для тех, кто хочет подчеркнуть элегантность, лилия, пион и лизиантус — утончённый выбор. Гвоздика же со своим долголетием и значением глубокой любви — романтическая альтернатива.',
        'В Flora Art мы помогаем вам выбрать наиболее подходящий цветок для любимого человека в Фетхие. Будь то страстные красные розы или элегантное сочетание, мы создаём композиции, которые выражают ваши чувства самым прекрасным образом.',
      ],
    },
  },

  /* ── 28 · Rehber · Çiçek Bakımı ───────────────────────────────── */
  {
    slug: 'cicek-bakimi-rehberi',
    category: 'rehber',
    relatedKeywords: ['Gül'],
    relatedCollection: 'bouquet',
    heroImage: '/images/products/pexels/pembe-gul-vazo.webp',
    title: {
      tr: 'Çiçek Bakımı Rehberi: Kesme Çiçeklerin Ömrünü Uzatma',
      en: 'Flower Care Guide: Extending the Life of Cut Flowers',
      ru: 'Руководство по уходу за цветами: как продлить жизнь срезанных цветов',
    },
    metaDescription: {
      tr: "Çiçek bakımı rehberi: kesme çiçeklerin ömrünü uzatmanın püf noktaları. Taze çiçekler ve bakım ipuçları Fethiye'de Flora Art'ta.",
      en: 'Flower care guide: tips for extending the life of cut flowers. Fresh flowers and care tips in Fethiye at Flora Art.',
      ru: 'Руководство по уходу за цветами: советы по продлению жизни срезанных цветов. Свежие цветы и советы по уходу в Фетхие в Flora Art.',
    },
    body: {
      tr: [
        "Çiçek bakımı, sevdiklerinizden gelen ya da onlara gönderdiğiniz çiçeklerin güzelliğini günlerce korumanın anahtarıdır. Birkaç basit kuralla kesme çiçeklerin ömrünü önemli ölçüde uzatabilirsiniz. Fethiye'de Flora Art'tan aldığınız taze çiçekler, doğru bakımla çok daha uzun süre canlı kalır.",
        'İlk kural temizliktir: vazoyu iyice yıkayın ve daima temiz, oda sıcaklığında su kullanın. Çiçeklerin saplarını 45 derecelik açıyla kesmek, suyu daha iyi emmelerini sağlar. Suyun içinde kalan yaprakları ayıklayın, çünkü bunlar bakteri üreterek çiçeklerin daha çabuk solmasına yol açar.',
        'Suyu her iki günde bir değiştirin ve sapları her su değişiminde tazeleyin. Çiçekleri doğrudan güneş ışığından, ısı kaynaklarından ve olgun meyvelerden uzak tutun; meyvelerin saldığı gaz çiçekleri hızla yaşlandırır. Serin bir ortam, çiçek bakımının en önemli sırlarından biridir.',
        "Flora Art olarak Fethiye'de en taze çiçekleri özenle hazırlıyoruz. Doğru çiçek bakımıyla aranjmanlarınızın tazeliğini en üst düzeyde tutabilir, sevdiklerinizin armağanının keyfini çok daha uzun süre yaşayabilirsiniz.",
      ],
      en: [
        'Flower care is the key to preserving the beauty of flowers received from or sent to your loved ones for days. With a few simple rules, you can significantly extend the life of cut flowers. Fresh flowers from Flora Art in Fethiye stay alive much longer with proper care.',
        'The first rule is cleanliness: wash the vase thoroughly and always use clean, room-temperature water. Cutting the flower stems at a 45-degree angle helps them absorb water better. Remove any leaves that remain underwater, as these breed bacteria and cause the flowers to wilt faster.',
        'Change the water every two days and refresh the stems with each water change. Keep the flowers away from direct sunlight, heat sources and ripe fruit; the gas released by fruit ages flowers quickly. A cool environment is one of the most important secrets of flower care.',
        'At Flora Art, we carefully prepare the freshest flowers in Fethiye. With proper flower care, you can keep your arrangements at peak freshness and enjoy the gift of your loved ones for much longer.',
      ],
      ru: [
        'Уход за цветами — ключ к тому, чтобы на протяжении многих дней сохранять красоту цветов, полученных от близких или отправленных им. С помощью нескольких простых правил вы можете значительно продлить жизнь срезанных цветов. Свежие цветы от Flora Art в Фетхие при правильном уходе остаются живыми гораздо дольше.',
        'Первое правило — чистота: тщательно вымойте вазу и всегда используйте чистую воду комнатной температуры. Срез стеблей под углом 45 градусов помогает им лучше впитывать воду. Удалите листья, остающиеся под водой, так как они разводят бактерии и заставляют цветы вянуть быстрее.',
        'Меняйте воду каждые два дня и обновляйте срез стеблей при каждой смене воды. Держите цветы вдали от прямых солнечных лучей, источников тепла и спелых фруктов; газ, выделяемый фруктами, быстро состаривает цветы. Прохладная среда — один из важнейших секретов ухода за цветами.',
        'В Flora Art мы бережно готовим самые свежие цветы в Фетхие. При правильном уходе за цветами вы можете поддерживать максимальную свежесть ваших композиций и наслаждаться подарком близких гораздо дольше.',
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
