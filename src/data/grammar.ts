import type { GrammarItem } from '../types/word';

const items: GrammarItem[] = [
  // ===== ～てから =====
  {
    pattern: '～てから',
    name: '~하고 나서',
    meaning: '~한 후에',
    description: '동사 て형 + から. "A를 먼저 하고 그 다음 B를 한다"는 시간 순서를 강조해요.',
    examples: [
      { sentence: 'ご飯を食べ___、学校に行きます。', answer: 'てから', translation: '밥을 먹고 나서 학교에 갑니다.' },
      { sentence: '宿題をし___、テレビを見ます。', answer: 'てから', translation: '숙제를 하고 나서 TV를 봅니다.' },
      { sentence: '日本に来___、3年になります。', answer: 'てから', translation: '일본에 온 지 3년이 됩니다.' },
    ],
  },

  // ===== ～たことがある =====
  {
    pattern: '～たことがある',
    name: '~한 적이 있다',
    meaning: '경험',
    description: '동사 た형 + ことがある. 과거에 한 번이라도 경험한 적이 있는지 말할 때 써요.',
    examples: [
      { sentence: '富士山に登った___あります。', answer: 'こと', translation: '후지산에 오른 적이 있습니다.' },
      { sentence: '寿司を食べた___がある？', answer: 'こと', translation: '초밥을 먹어본 적이 있어?' },
    ],
  },

  // ===== ～ことができる =====
  {
    pattern: '～ことができる',
    name: '~할 수 있다',
    meaning: '가능',
    description: '동사 사전형 + ことができる. "~할 수 있다"는 가능을 정중하게 표현해요.',
    examples: [
      { sentence: '私は日本語を話す___ができます。', answer: 'こと', translation: '저는 일본어를 말할 수 있습니다.' },
      { sentence: 'ピアノを弾く___ができますか。', answer: 'こと', translation: '피아노를 칠 수 있어요?' },
    ],
  },

  // ===== ～ながら =====
  {
    pattern: '～ながら',
    name: '~하면서',
    meaning: '동시 동작',
    description: '동사 ます형(ます떼고) + ながら. 두 가지 동작을 동시에 할 때 써요.',
    examples: [
      { sentence: '音楽を聞き___、勉強します。', answer: 'ながら', translation: '음악을 들으면서 공부합니다.' },
      { sentence: '歩き___、話しましょう。', answer: 'ながら', translation: '걸으면서 이야기합시다.' },
      { sentence: 'コーヒーを飲み___、本を読む。', answer: 'ながら', translation: '커피를 마시면서 책을 읽는다.' },
    ],
  },

  // ===== ～かもしれない =====
  {
    pattern: '～かもしれない',
    name: '~일지도 모른다',
    meaning: '추측 (가능성 50%)',
    description: '동사·형용사·명사의 보통체 + かもしれない. 확실하지 않지만 그럴 가능성이 있을 때 써요.',
    examples: [
      { sentence: '明日は雨が降る___しれません。', answer: 'かも', translation: '내일은 비가 올지도 모릅니다.' },
      { sentence: '彼は来ない___しれない。', answer: 'かも', translation: '그는 안 올지도 몰라.' },
    ],
  },

  // ===== ～でしょう =====
  {
    pattern: '～でしょう',
    name: '~겠지요',
    meaning: '추측 (가능성 높음)',
    description: '명사·형용사·동사 보통체 + でしょう. "아마 그럴 것이다"라고 거의 확신할 때 써요.',
    examples: [
      { sentence: '明日は晴れる___。', answer: 'でしょう', translation: '내일은 맑을 거예요.' },
      { sentence: '彼も来る___。', answer: 'でしょう', translation: '그도 올 거예요.' },
    ],
  },

  // ===== ～はずだ =====
  {
    pattern: '～はずだ',
    name: '~일 것이다 (당연히)',
    meaning: '논리적 확신',
    description: '명사+の/형용사/동사 보통체 + はずだ. 근거가 있어서 "당연히 그럴 것"이라고 확신할 때 써요.',
    examples: [
      { sentence: '彼は今日来る___です。', answer: 'はず', translation: '그는 오늘 올 것입니다(올 거예요).' },
      { sentence: 'この答えは正しい___だ。', answer: 'はず', translation: '이 답은 맞을 것이다.' },
    ],
  },

  // ===== ～ば =====
  {
    pattern: '～ば',
    name: '~하면 (조건)',
    meaning: '일반 조건',
    description: '동사 가정형 (え단 + ば). "A하면 B"라는 일반적인 조건을 말할 때 써요.',
    examples: [
      { sentence: '安けれ___、買います。', answer: 'ば', translation: '싸다면 사겠습니다.' },
      { sentence: '春になれ___、桜が咲く。', answer: 'ば', translation: '봄이 되면 벚꽃이 핀다.' },
    ],
  },

  // ===== ～たら =====
  {
    pattern: '～たら',
    name: '~하면, ~했더니',
    meaning: '조건/계기',
    description: '동사 た형 + ら. "그 일이 일어난 다음에"라는 뜻으로, 가장 일반적으로 쓰이는 조건 표현이에요.',
    examples: [
      { sentence: '時間があっ___、行きます。', answer: 'たら', translation: '시간이 있으면 가겠습니다.' },
      { sentence: '家に帰っ___、誰もいなかった。', answer: 'たら', translation: '집에 돌아갔더니 아무도 없었다.' },
      { sentence: '駅に着い___、電話してください。', answer: 'たら', translation: '역에 도착하면 전화해 주세요.' },
    ],
  },

  // ===== ～なら =====
  {
    pattern: '～なら',
    name: '~한다면',
    meaning: '가정 (상대 발화 받기)',
    description: '명사·동사 보통체 + なら. 상대가 한 말을 받아 "그러한 경우라면"이라고 말할 때 자주 써요.',
    examples: [
      { sentence: '日本語を勉強する___、この本がいいですよ。', answer: 'なら', translation: '일본어를 공부한다면 이 책이 좋아요.' },
      { sentence: 'あなたが行く___、私も行く。', answer: 'なら', translation: '당신이 간다면 나도 간다.' },
    ],
  },

  // ===== ～ても =====
  {
    pattern: '～ても',
    name: '~해도',
    meaning: '역접 (~지만)',
    description: '동사 て형 + も. "그렇게 해도 결과는 달라지지 않는다"는 양보·역접을 말할 때 써요.',
    examples: [
      { sentence: '雨が降っ___、行きます。', answer: 'ても', translation: '비가 내려도 가겠습니다.' },
      { sentence: 'いくら食べ___、太らない。', answer: 'ても', translation: '아무리 먹어도 살이 안 찐다.' },
    ],
  },

  // ===== ～のに =====
  {
    pattern: '～のに',
    name: '~인데도',
    meaning: '의외/불만',
    description: '동사·형용사 보통체 + のに. "그런데도", "~인데" 의외나 불만을 나타낼 때 써요.',
    examples: [
      { sentence: '一生懸命勉強した___、不合格だった。', answer: 'のに', translation: '열심히 공부했는데도 떨어졌다.' },
      { sentence: 'まだ夏な___、寒い。', answer: 'のに', translation: '아직 여름인데 춥다.' },
    ],
  },

  // ===== ～ので =====
  {
    pattern: '～ので',
    name: '~이기 때문에',
    meaning: '이유 (정중)',
    description: '동사·형용사 보통체 + ので. から보다 부드럽고 정중한 이유 표현이에요.',
    examples: [
      { sentence: '頭が痛い___、休みます。', answer: 'ので', translation: '머리가 아파서 쉬겠습니다.' },
      { sentence: '雨が降っている___、傘を持って行く。', answer: 'ので', translation: '비가 오고 있어서 우산을 가지고 간다.' },
    ],
  },

  // ===== ～ために =====
  {
    pattern: '～ために',
    name: '~을 위해',
    meaning: '목적/이유',
    description: '동사 사전형 / 명사+の + ために. 목적 "~위해서" 또는 이유 "~때문에"를 말할 때 써요.',
    examples: [
      { sentence: '健康の___、毎日運動する。', answer: 'ために', translation: '건강을 위해 매일 운동한다.' },
      { sentence: '大学に入る___、勉強しています。', answer: 'ために', translation: '대학에 들어가기 위해 공부하고 있습니다.' },
    ],
  },

  // ===== ～そうだ (양태) =====
  {
    pattern: '～そうだ (양태)',
    name: '~할 것 같다',
    meaning: '직감/외관',
    description: '동사 ます형(ます떼고) / 형용사 어간 + そう. 보고 느낀 인상을 말할 때 써요. (전문 そうだ와 헷갈리지 않게!)',
    examples: [
      { sentence: 'このケーキはおいし___です。', answer: 'そう', translation: '이 케이크는 맛있어 보여요.' },
      { sentence: '雨が降り___です。', answer: 'そう', translation: '비가 올 것 같아요.' },
    ],
  },

  // ===== ～ようだ / みたい =====
  {
    pattern: '～みたい',
    name: '~인 것 같다',
    meaning: '비유/추측',
    description: '명사·동사·형용사 보통체 + みたい. "~같다"는 비유나 추측을 말할 때 써요. ようだ의 회화체.',
    examples: [
      { sentence: '彼は学生___です。', answer: 'みたい', translation: '그는 학생인 것 같아요.' },
      { sentence: '今日は冬___寒い。', answer: 'みたい', translation: '오늘은 겨울처럼 춥다.' },
    ],
  },

  // ===== ～らしい =====
  {
    pattern: '～らしい',
    name: '~인 것 같다 / 다운',
    meaning: '전문/전형성',
    description: '명사·형용사·동사 보통체 + らしい. 들은 정보로 추측하거나 "~답다"는 전형성을 말할 때 써요.',
    examples: [
      { sentence: '彼は日本に行った___。', answer: 'らしい', translation: '그는 일본에 갔다는 것 같다.' },
      { sentence: '今日は春___天気だ。', answer: 'らしい', translation: '오늘은 봄다운 날씨다.' },
    ],
  },

  // ===== ～やすい =====
  {
    pattern: '～やすい',
    name: '~하기 쉽다',
    meaning: '용이성',
    description: '동사 ます형(ます떼고) + やすい. "~하기 쉽다", "편하다"는 뜻으로 い형용사처럼 활용해요.',
    examples: [
      { sentence: 'この本は読み___です。', answer: 'やすい', translation: '이 책은 읽기 쉬워요.' },
      { sentence: 'この道は歩き___。', answer: 'やすい', translation: '이 길은 걷기 쉽다.' },
    ],
  },

  // ===== ～にくい =====
  {
    pattern: '～にくい',
    name: '~하기 어렵다',
    meaning: '난해함',
    description: '동사 ます형(ます떼고) + にくい. "~하기 힘들다"는 뜻. やすい의 짝꿍이에요.',
    examples: [
      { sentence: 'この字は読み___です。', answer: 'にくい', translation: '이 글자는 읽기 어려워요.' },
      { sentence: 'この靴は歩き___。', answer: 'にくい', translation: '이 신발은 걷기 불편하다.' },
    ],
  },

  // ===== ～方がいい =====
  {
    pattern: '～方がいい',
    name: '~하는 편이 좋다',
    meaning: '조언',
    description: '동사 た형 + 方がいい (긍정), 동사 ない형 + 方がいい (부정). 조언이나 충고를 할 때 써요.',
    examples: [
      { sentence: '早く寝た___がいいよ。', answer: '方', translation: '일찍 자는 편이 좋아.' },
      { sentence: 'タバコは吸わない___がいい。', answer: '方', translation: '담배는 안 피우는 편이 좋다.' },
    ],
  },

  // ===== ～なければならない =====
  {
    pattern: '～なければならない',
    name: '~하지 않으면 안 된다',
    meaning: '의무 (~해야 한다)',
    description: '동사 ない형(ない 떼고) + なければならない. 회화에선 짧게 ～なきゃ로도 써요.',
    examples: [
      { sentence: '宿題をし___ならない。', answer: 'なければ', translation: '숙제를 하지 않으면 안 된다.' },
      { sentence: '明日は早く起き___なりません。', answer: 'なければ', translation: '내일은 일찍 일어나야 합니다.' },
    ],
  },

  // ===== ～てもいい =====
  {
    pattern: '～てもいい',
    name: '~해도 된다',
    meaning: '허가',
    description: '동사 て형 + もいい. "~해도 좋다"는 허가를 받거나 줄 때 써요.',
    examples: [
      { sentence: 'ここに座っ___いいですか。', answer: 'ても', translation: '여기 앉아도 됩니까?' },
      { sentence: 'もう帰っ___いいよ。', answer: 'ても', translation: '이제 돌아가도 돼.' },
    ],
  },

  // ===== ～てはいけない =====
  {
    pattern: '～てはいけない',
    name: '~하면 안 된다',
    meaning: '금지',
    description: '동사 て형 + はいけない. "절대 하면 안 된다"는 금지를 나타내요.',
    examples: [
      { sentence: 'ここで写真を撮っ___いけません。', answer: 'ては', translation: '여기서 사진을 찍으면 안 됩니다.' },
      { sentence: '授業中、話し___いけない。', answer: 'ては', translation: '수업 중에 떠들면 안 된다.' },
    ],
  },

  // ===== ～なくてもいい =====
  {
    pattern: '～なくてもいい',
    name: '~하지 않아도 된다',
    meaning: '불필요',
    description: '동사 ない형(ない 떼고) + なくてもいい. "굳이 안 해도 괜찮다"는 뜻이에요.',
    examples: [
      { sentence: '明日は来___もいいです。', answer: 'なくて', translation: '내일은 안 와도 됩니다.' },
      { sentence: '無理に食べ___もいい。', answer: 'なくて', translation: '억지로 안 먹어도 돼.' },
    ],
  },

  // ===== ～ようにする =====
  {
    pattern: '～ようにする',
    name: '~하도록 하다',
    meaning: '노력/습관',
    description: '동사 사전형/ない형 + ようにする. "그렇게 하려고 노력하다"는 의식적인 행동을 말할 때 써요.',
    examples: [
      { sentence: '毎日運動する___しています。', answer: 'ように', translation: '매일 운동하도록 하고 있습니다.' },
      { sentence: '甘いものを食べない___する。', answer: 'ように', translation: '단 것을 안 먹도록 한다.' },
    ],
  },

  // ===== ～ようになる =====
  {
    pattern: '～ようになる',
    name: '~하게 되다',
    meaning: '변화',
    description: '동사 사전형/가능형 + ようになる. "전에는 못 했지만 이제는 할 수 있게 되다"라는 변화를 말해요.',
    examples: [
      { sentence: '日本語が話せる___なりました。', answer: 'ように', translation: '일본어를 말할 수 있게 되었습니다.' },
      { sentence: '最近、早く起きる___なった。', answer: 'ように', translation: '최근에 일찍 일어나게 되었다.' },
    ],
  },
];

export default items;
