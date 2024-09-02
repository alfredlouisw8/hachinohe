// function translatePage(){
//     const data = this[getLanguage().replace('-','_') + '_getTranslationData']();
//     let el = null;
//     data.forEach(function (item, index) {
//         el =$('.LT-' + index);
//         if(el){
//             if(el.hasClass('LT-ph')){
//                 el.attr('placeholder',item);
//             } else{
//                 el.html(item);
//             }
//         }
//     });
// }



function ja_JP_getTranslationData() {
    return [
        '滞在する場所', // 0.Where To Stay
        '先', // 1. Destination
        '任意の価格', // 2. Any Price
        'タイプ名', // 3. Type Name
        '探す', // 4. Search
        '八戸エリア', //5. The Hachinohe Area
        '旅行を計画する', //6. Plan Your Trip
        '活動内容',//7. What to do
        '宿泊予約 楽天',//8. Find a Hotel
        'はちのへ圏域を知る',//9. access
        '事業者の皆様へ',//10. contact us
        '旅程',//11. Itinerary
        '小切手',//12. Check Availability
        'English',//13. English
        '旅程に追加',// 14
        'プレビュー',// 15
        'さらに読み込む',// 16
        'から',// 17
        '削除',// 18
        '追加',// 19
        '場所',// 20
        'ストーリー',// 21
        '経験',// 22
        '場所',// 23
        '今後のイベントとニュース',// 24
        'ニュース',// 25
        '今後のイベント',// 26
        '旅行のアイデアと旅程',// 27
        '三陸復興国立公園',// 28
        '八戸アフターダーク：バーホッピング',// 29
        '五感の八戸エリア',// 30
        '山から海へ.',// 31
        '八戸の料理の歴史を旅する',// 32
        '初心者のための八戸エリア',// 33
        '旅行情報',// 34
        '八戸エリアとは/ダウンロード可能な写真',// 35
        'ダウンロード可能な観光パンフレット',// 36
        'ビジターインフォメーションセンター＆リソース',// 37
        'ローカルガイド',// 38
        'アクセスと交通情報',// 39
        '八戸エリアとは',// 40
        '企業サイト', // 41
        '八戸帰宅',// 42
        'アクセス',// 43
        'お問い合わせ',// 44
        '八戸市',//45
        '三戸町',//46
        '五戸町',//47
        '田子町',//48
        '南部町',//49
        '階上町',//50
        '新郷村',//51
        'おいらせ町',//52
        '検索キーワード',//53
        '頻出', // 54
        'おすすめ', // 55
        '種差海岸', // 56
        'Pagi', // 57
        'マリエント', // 58
        '八戸三社大祭', // 59
        'えんぶり', // 60
        '馬',// 61
        'ハッチ',// 62
        'むつ',// 63
        '横丁',// 64
        'たてはな',// 65
        '八戸三社大祭',// // 66
        'えんぶり',// 67
        '朝市',// 68
        'むつみなと駅前の朝市',// 69
        '縄文是川美術館',// 70
        '種差海岸',// 71
        '館花桟橋朝市',// 72
        'かぶしま',// 73
        'マリエント',// 74
        '横丁',// 75
    ];
}

function fr_FR_getTranslationData() {
    return [
        "Où loger", // 0
        "Destination", // 1
        "Tout prix", // 2
        "Nom du type", // 3
        "Rechercher", // 4
        "La région de Hachinohe", // 5
        "Planifiez votre voyage", // 6
        "Que faire", // 7
        "Trouver un hôtel", // 8
        "Accès", // 9
        "Contactez-nous", // 10
        "Itinéraire", // 11
        "Vérifier la disponibilité", // 12
        "Japonais", // 13
        "Ajouter à l'itinéraire'", // 14
        "Aperçu", // 15
        "Charger plus", // 16
        "De", // 17
        "Supprimer", // 18
        "Ajouté", // 19
        "Emplacement", // 20
        "Histoires", // 21
        "Expériences", // 22
        "Lieux", // 23
        "Prochains événements et actualités", // 24
        "Actualités", // 25
        "Événements à venir", // 26
        "Idées de voyages et itinéraires", // 27
        "Le parc national de Sanriku Fukko", // 28
        "Hachinohe After Dark: Bar Hopping", // 29
        "La région de Hachinohe à travers les cinq sens", // 30
        "Des montagnes à la mer", // 31
        "Voyage à travers l’histoire culinaire de Hachinohe", // 32
        "La zone Hachinohe pour les débutants", // 33
        "Informations de voyage", // 34
        "Qu'est-ce que la région de Hachinohe / Images téléchargeables", // 35
        "Brochures touristiques téléchargeables", // 36
        "Centres d'information et ressources pour les visiteurs", // 37
        "Guides locaux", // 38
        "Informations sur l'accès et le transport", // 39
        "Qu'est-ce que la région de Hachinohe", // 40
        "Site de l'entreprise'", // 41
        "Ramener Hachinohe à la maison", // 42
        "Accès", // 43
        "Contactez-nous", // 44
        "Hachinohe", // 45
        "Sannohe", // 46
        "Gonohe", // 47
        "Takko", // 48
        "Nanbu", // 49
        "Hashikami", // 50
        "Shingo", // 51
        "Oirase", // 52
        "Rechercher un mot-clé", // 53
        "Populaire", // 54
        "Recommandé", // 55
        "Tanesashi", // 56
        "Matin", // 57
        "Marient", // 58
        "Sansha", // 59
        "Enburi", // 60
        "cheval", // 61
        "hacchi", // 62
        "mutsu", // 63
        "yokocho", // 64
        "tatehana", // 65
        "Hachinohe Sansha Taisai", // 66
        "Enburi", // 67
        "Marché du matin", // 68
        "Marché du matin devant la gare de Mutsu-Minato", // 69
        "Musée Korekawa Jomon", // 70
        "Côte de Tanesashi", // 71
        "Marché matinal de Tatehana Wharf", // 72
        "Kabushima", // 73
        "Marient", // 74
        "Yokocho", // 75
    ];
}

function en_US_getTranslationData() {
    return [
        'Where To Stay', //0
        'Destination', //1
        'Any Price', //2
        'Type Name', //3
        'Search', //4
        'The Hachinohe Area', //5
        'Plan Your Trip', //6
        'What to Do',//7
        'Find a Hotel',//8
        'Access',//9
        'Contact us',//10
        'Itinerary',//11
        'Check Availability',//12
        'Japanese',//13
        'Add To Itinerary',//14
        'Preview',//15
        'Load More',//16
        'From',//17
        'Remove',//18
        'Added',//19
        'Location',//20
        'Stories',//21
        'Experiences',//22
        'Places',//23
        'Upcoming Events & News',//24
        'News',//25
        'Upcoming Events',//26
        'Trip Ideas & Itineraries',//27
        'The Sanriku Fukko National Park',//28
        'Hachinohe After Dark: Bar Hopping',//29
        'Hachinohe Area through the Five Senses',//30
        'From the Mountains to the Sea',//31
        'Travel through Hachinohe’s Culinary History',//32
        'The Hachinohe Area for Beginners',//33
        'Travel Information',//34
        'What’s the Hachinohe Area / Downloadable Pictures',//35
        'Downloadable Sightseeing Brochures',//36
        'Visitor Information Centers & Resources',//37
        'Local Guides',//38
        'Access and Transportation Information',//39
        'What is the Hachinohe Area',//40
        'Corporate Site',//41
        'Bring Hachinohe Home',//42
        'Access',//43
        'Contact Us',//44
        'Hachinohe',//45
        'Sannohe',//46
        'Gonohe',//47
        'Takko',//48
        'Nanbu',//49
        'Hashikami',//50
        'Shingo',//51
        'Oirase',//52
        'Search Keyword',//53
        'Popular',//54
        'Recomended',//55
        'Tanesashi',//56
        'Morning',//57
        'Marient',//58
        'Sansha',//59
        'Enburi',//60
        'horse',//61
        'hacchi',//62
        'mutsu',//63
        'yokocho',//64
        'tatehana',//65
        'Hachinohe Sansha Taisai',//66
        'Enburi',//67
        'Morning Market',//68
        'Morning Market in front of Mutsu-Minato Station',//69
        'Korekawa Jomon Museum',//70
        'Tanesashi Coast',//71
        'Tatehana Wharf Morning Market',//72
        'Kabushima',//73
        'Marient',//74
        'Yokocho',//75
    ];
}

function zh_CN_getTranslationData() {
    return [
        "呆在哪里",// 0
        "目的地,",// 1
        "任何价格",// 2
        "类型名,称",// 3
        "搜索",// 4
        "八,户地,区",// 5
        "计划行程",// 6
        ",做,什么",//, 7
        "寻找酒店",// ,,8
        "访问",// 9
        "与我们联系",// 10
        "行程",// 11
        "检查可用性",// 12
        "日语",// 13
        "添加到行程",// 14
        "预览",// 15
        "加载更多",// 16
        "从",// 17
        "删除",// 18
        "已添加",// 19
        "位置",// 20
        "故事",// 21
        "经验",// 22
        "地方",// 23
        "即将发生的事件和新闻",// 24
        "新闻",// 25
        "即将发生的事件",// 26
        "旅行的想法和行程",// 27
        "三陆福甲国家公园",// 28
        "天黑后八户：跳栏",// 29
        "八感八户地区",// 30
        "从山上到大海",// 31
        "穿越八户的烹饪史",// 32
        "八户初学者专区",// 33
        "旅行信息",// 34
        "八户地区/可下载的图片是什么",// 35
        " /可下载的观光手册",// 36
        "游客信息中心和资源",// 37
        " /本地向导",// 38
        "访问和运输信息",// 39
        "八户地区是什么",// 40
        "公司站点",// 41
        "把八户带回家",// 42
        "访问",// 43
        "联系我们",// 44
        "八户",// 45
        "三诺河",// 46
        "五河",// 47
        "卓子",// 48
        "南布",// 49
        "桥上",// 50
        "慎吾",// 51
        "奥入濑",// 52
        "搜索关键字",// 53
        "受欢迎",// 54
        "推荐",// 55
        "种桥",// 56
        "早晨",// 57
        "玛丽恩",// 58
        "三沙",// 59
        "恩布里",// 60
        "马",// 61
        "哈奇",// 62
        "武津",// 63
        "横町",// 64
        "塔特哈纳",// 65
        "八户三沙泰赛",// 66
        "第一回合",// 67
        "早晨市场",// 68
        "陆续港区站前的早晨市场",// 69
        "Korekawa绳文博物馆",// 70
        "淡江海岸",// 71
        "第一回合码头早市",// 72
        "鹿岛",// 73
        "玛丽恩",// 74
        "横手",// 75
    ];
}