// 孙颖莎比赛问答游戏数据
import { VideoData } from '@/types/quiz'

export const videoData: VideoData = {
  id: 1,
  name: '孙颖莎 vs 王曼昱',
  src: '/videos/sample1.mp4',
  duration: 30,
  opponent: '王曼昱',
  matchInfo: '2024年WTT新加坡大满贯女单决赛',
  questions: [
    {
      id: 1,
      videoId: 1,
      question: "这段视频中，孙颖莎的对手是谁？",
      options: [
        "A. 陈梦",
        "B. 王曼昱",
        "C. 伊藤美诚",
        "D. 王艺迪"
      ],
      correctAnswer: 1,
      explanation: "这是孙颖莎与王曼昱的精彩对决"
    }
  ]
}

export const videoData2: VideoData = {
  id: 2,
  name: '孙颖莎经典比赛',
  src: '/videos/sample2.mp4',
  duration: 30,
  opponent: '2024年仁川冠军赛',
  matchInfo: '2024年仁川冠军赛',
  questions: [
    {
      id: 2,
      videoId: 2,
      question: "这是孙颖莎的哪场经典比赛？",
      options: [
        "A. 2024年WTT新加坡大满贯",
        "B. 2024年WTT澳门冠军赛",
        "C. 2024年仁川冠军赛",
        "D. 2024年WTT法兰克福冠军赛"
      ],
      correctAnswer: 2,
      explanation: "这是2024年仁川冠军赛的精彩对决"
    }
  ]
}

export const videoData3: VideoData = {
  id: 3,
  name: '孙颖莎 vs 田志希',
  src: '/videos/sample3.mp4',
  duration: 30,
  opponent: '田志希',
  matchInfo: '2024年WTT新加坡大满贯女单比赛',
  questions: [
    {
      id: 3,
      videoId: 3,
      question: "这段视频中，孙颖莎的对手是谁？",
      options: [
        "A. 王曼昱",
        "B. 陈梦",
        "C. 田志希",
        "D. 伊藤美诚"
      ],
      correctAnswer: 2,
      explanation: "这是孙颖莎与韩国选手田志希的精彩对决"
    }
  ]
}

export const videoData4: VideoData = {
  id: 4,
  name: '孙颖莎的霸王拧',
  src: '/videos/sample4.mp4',
  duration: 30,
  opponent: '技术展示',
  matchInfo: '孙颖莎标志性技术动作',
  questions: [
    {
      id: 4,
      videoId: 4,
      question: "这段视频展示的是孙颖莎的什么标志性技术？",
      options: [
        "A. 正手拉球",
        "B. 反手拧拉",
        "C. 霸王拧",
        "D. 侧身抢攻"
      ],
      correctAnswer: 2,
      explanation: "霸王拧是孙颖莎的标志性技术动作，是一种极具威胁性的反手拧拉技术"
    }
  ]
}

export const videoData5: VideoData = {
  id: 5,
  name: '混双：孙颖莎与许昕',
  src: '/videos/sample5.mp4',
  duration: 30,
  opponent: '混双搭档',
  matchInfo: '孙颖莎与许昕混双比赛',
  questions: [
    {
      id: 5,
      videoId: 5,
      question: "这段视频中，孙颖莎的混双搭档是谁？",
      options: [
        "A. 王楚钦",
        "B. 许昕",
        "C. 樊振东",
        "D. 马龙"
      ],
      correctAnswer: 1,
      explanation: "这是孙颖莎与许昕的混双比赛，两人曾多次搭档参加国际比赛"
    }
  ]
}

export const videoData6: VideoData = {
  id: 6,
  name: '女双：孙颖莎与王艺迪',
  src: '/videos/sample6.mp4',
  duration: 30,
  opponent: '陈梦和王曼昱',
  matchInfo: '女双比赛：孙颖莎/王艺迪 vs 陈梦/王曼昱',
  questions: [
    {
      id: 6,
      videoId: 6,
      question: "这段视频中，孙颖莎的女双搭档是谁？",
      options: [
        "A. 陈梦",
        "B. 王曼昱",
        "C. 王艺迪",
        "D. 陈幸同"
      ],
      correctAnswer: 2,
      explanation: "这是孙颖莎与王艺迪的女双比赛，对手是陈梦和王曼昱"
    }
  ]
}

export const videoData7: VideoData = {
  id: 7,
  name: '孙颖莎 vs 伊藤美诚',
  src: '/videos/sample7.mp4',
  duration: 30,
  opponent: '伊藤美诚',
  matchInfo: '孙颖莎与伊藤美诚的经典对决',
  questions: [
    {
      id: 7,
      videoId: 7,
      question: "这段视频中，孙颖莎的对手是谁？",
      options: [
        "A. 王曼昱",
        "B. 陈梦",
        "C. 伊藤美诚",
        "D. 王艺迪"
      ],
      correctAnswer: 2,
      explanation: "这是孙颖莎与日本选手伊藤美诚的经典对决"
    }
  ]
}

// 可以添加更多视频
export const allVideos: VideoData[] = [
  videoData,
  videoData2,
  videoData3,
  videoData4,
  videoData5,
  videoData6,
  videoData7,
]
