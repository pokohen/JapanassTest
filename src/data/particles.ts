import type { ParticleItem } from '../types/word';

const items: ParticleItem[] = [
  // ===== は (주제) =====
  {
    particle: 'は',
    name: '~은/는',
    meaning: '~은/는',
    description: '"누구는~", "무엇은~"처럼 무엇에 대해 이야기할지 알려주는 말이에요. 읽을 땐 [와]라고 해요!',
    examples: [
      { sentence: '私___学生です。', translation: '저는 학생입니다.' },
      { sentence: 'これ___本です。', translation: '이것은 책입니다.' },
      { sentence: '今日___月曜日です。', translation: '오늘은 월요일입니다.' },
    ],
  },

  // ===== が (주격) =====
  {
    particle: 'が',
    name: '~이/가',
    meaning: '~이/가',
    description: '"누가 했어?" "뭐가 좋아?"처럼 누군지 무엇인지 딱 말할 때 써요.',
    examples: [
      { sentence: '猫___好きです。', translation: '고양이를 좋아합니다. (직역: 고양이가 좋습니다.)' },
      { sentence: '誰___来ましたか。', translation: '누가 왔어요?' },
      { sentence: '雨___降っている。', translation: '비가 내리고 있다.' },
    ],
  },

  // ===== を (목적격) =====
  {
    particle: 'を',
    name: '~을/를',
    meaning: '~을/를',
    description: '"빵을 먹어", "책을 읽어"처럼 뭔가를 하는 그것 뒤에 붙어요. 읽을 땐 [오]라고 해요!',
    examples: [
      { sentence: 'パン___食べます。', translation: '빵을 먹습니다.' },
      { sentence: '本___読む。', translation: '책을 읽는다.' },
      { sentence: '映画___見ました。', translation: '영화를 봤어요.' },
    ],
  },

  // ===== に (시간/장소/방향/대상) =====
  {
    particle: 'に',
    name: '~에, ~에게',
    meaning: '~에, ~에게',
    description: '"7시에", "학교에 가", "친구에게 줘", "방에 있어"처럼 언제·어디·누구에게인지 말할 때 써요.',
    examples: [
      { sentence: '7時___起きます。', translation: '7시에 일어납니다.' },
      { sentence: '学校___行く。', translation: '학교에 간다.' },
      { sentence: '友達___プレゼントをあげる。', translation: '친구에게 선물을 준다.' },
      { sentence: '部屋___猫がいます。', translation: '방에 고양이가 있습니다.' },
    ],
  },

  // ===== へ (방향) =====
  {
    particle: 'へ',
    name: '~으로, ~에',
    meaning: '~으로, ~에',
    description: '"어디로 가는지" 가는 쪽을 말할 때 써요. 읽을 땐 [에]라고 해요! に랑 거의 똑같이 쓸 수 있어요.',
    examples: [
      { sentence: '日本___行きます。', translation: '일본에 갑니다.' },
      { sentence: '駅___向かう。', translation: '역으로 향한다.' },
    ],
  },

  // ===== で (수단/장소) =====
  {
    particle: 'で',
    name: '~에서, ~으로',
    meaning: '~에서, ~으로',
    description: '"학교에서 공부해"처럼 어디서 하는지, "버스로 가", "젓가락으로 먹어"처럼 무엇으로 하는지 말할 때 써요.',
    examples: [
      { sentence: '図書館___勉強する。', translation: '도서관에서 공부한다.' },
      { sentence: 'バス___学校に行く。', translation: '버스로 학교에 간다.' },
      { sentence: '日本語___話す。', translation: '일본어로 이야기한다.' },
    ],
  },

  // ===== と (~와) =====
  {
    particle: 'と',
    name: '~와/과',
    meaning: '~와/과',
    description: '"엄마랑 같이", "빵이랑 우유"처럼 누구랑 같이 있거나 여러 개를 같이 말할 때 써요.',
    examples: [
      { sentence: '友達___映画を見る。', translation: '친구와 영화를 본다.' },
      { sentence: 'パン___牛乳を買った。', translation: '빵과 우유를 샀다.' },
    ],
  },

  // ===== も (~도) =====
  {
    particle: 'も',
    name: '~도',
    meaning: '~도',
    description: '"저도 좋아해", "이것도 줘"처럼 뒤에 "도"가 오면 も를 써요.',
    examples: [
      { sentence: '私___学生です。', translation: '저도 학생입니다.' },
      { sentence: 'コーヒー___飲みます。', translation: '커피도 마십니다.' },
    ],
  },

  // ===== から (출발점/이유) =====
  {
    particle: 'から',
    name: '~부터, ~때문에',
    meaning: '~부터, ~에서, ~때문에',
    description: '"9시부터", "한국에서"처럼 어디서·언제 시작하는지 말할 때 써요. "비싸니까 안 사"처럼 이유를 말할 때도 써요.',
    examples: [
      { sentence: '9時___始まる。', translation: '9시부터 시작한다.' },
      { sentence: '韓国___来ました。', translation: '한국에서 왔습니다.' },
      { sentence: '高い___買わない。', translation: '비싸니까 안 산다.' },
    ],
  },

  // ===== まで (도착점/한계) =====
  {
    particle: 'まで',
    name: '~까지',
    meaning: '~까지',
    description: '"5시까지", "역까지"처럼 어디까지·몇 시까지인지 끝을 말할 때 써요. から(부터)랑 단짝이에요!',
    examples: [
      { sentence: '駅___歩く。', translation: '역까지 걷는다.' },
      { sentence: '5時___待ってください。', translation: '5시까지 기다려 주세요.' },
    ],
  },

  // ===== の (소유/수식) =====
  {
    particle: 'の',
    name: '~의',
    meaning: '~의',
    description: '두 낱말을 이어주는 말이에요. "엄마의 가방", "내 책"처럼 누구 거인지 말할 때 써요.',
    examples: [
      { sentence: '私___本です。', translation: '제 책입니다.' },
      { sentence: '日本___歌が好きだ。', translation: '일본 노래를 좋아한다.' },
      { sentence: '木___下で休む。', translation: '나무 아래에서 쉰다.' },
    ],
  },

  // ===== や (예시 나열) =====
  {
    particle: 'や',
    name: '~(이)나',
    meaning: '~(이)나',
    description: '"사과나 귤(같은 거)"처럼 여러 개 중에 몇 개만 골라서 말할 때 써요. と는 다 말하기, や는 몇 개만!',
    examples: [
      { sentence: 'りんご___みかんを買った。', translation: '사과나 귤(같은 걸) 샀다.' },
      { sentence: 'ペン___ノートが必要だ。', translation: '펜이나 노트(같은 게) 필요하다.' },
    ],
  },

  // ===== より (비교) =====
  {
    particle: 'より',
    name: '~보다',
    meaning: '~보다',
    description: '"여름은 겨울보다 더워"처럼 두 개를 비교할 때 써요. 우리말의 "~보다"랑 똑같아요!',
    examples: [
      { sentence: '夏は冬___暑い。', translation: '여름은 겨울보다 덥다.' },
      { sentence: '彼は私___背が高い。', translation: '그는 나보다 키가 크다.' },
    ],
  },

  // ===== か (의문) =====
  {
    particle: 'か',
    name: '물음 조사',
    meaning: '~까?',
    description: '문장 끝에 か를 붙이면 물어보는 말이 돼요. 물음표(?)랑 같은 역할이에요!',
    examples: [
      { sentence: '元気です___。', translation: '잘 지내세요?' },
      { sentence: 'これは何です___。', translation: '이것은 무엇입니까?' },
    ],
  },

  // ===== ね (확인/공감) =====
  {
    particle: 'ね',
    name: '~네, ~지?',
    meaning: '~네, ~지?',
    description: '"그치?", "그렇네~"처럼 같이 맞장구치고 싶을 때 문장 끝에 붙여요.',
    examples: [
      { sentence: '今日は寒いです___。', translation: '오늘은 춥네요.' },
      { sentence: 'いい天気です___。', translation: '날씨가 좋네요.' },
    ],
  },

  // ===== よ (알림/강조) =====
  {
    particle: 'よ',
    name: '~야, ~라고',
    meaning: '~야, ~라고',
    description: '"있잖아!", "이거 진짜 맛있어!"처럼 상대가 모르는 걸 알려주고 싶을 때 문장 끝에 붙여요.',
    examples: [
      { sentence: 'これ、おいしいです___。', translation: '이거 맛있어요!' },
      { sentence: '危ないです___！', translation: '위험해요!' },
    ],
  },
];

export default items;
