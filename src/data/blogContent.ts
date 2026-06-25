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
