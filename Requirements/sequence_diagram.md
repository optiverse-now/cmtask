sequenceDiagram
    participant User as ユーザー
    participant ChatUI as チャットUI
    participant MemoryManager as メモリ管理
     participant Database as データベース
    participant ChatBot as Geminiモデル
    participant TaskDB as タスクDB
    participant TaskUI as タスクUI

    User->>ChatUI: チャット開始
    ChatUI->>MemoryManager: 新規会話開始を通知
   MemoryManager->>Database: 新規チャットをDBに保存
    MemoryManager->>MemoryManager: 短期メモリを初期化

    loop 情報収集
        User->>ChatUI: 質問に回答またはメッセージを送信
        ChatUI->>MemoryManager: ユーザーメッセージを送信
        MemoryManager->>MemoryManager: 短期メモリにメッセージを追加
         MemoryManager->>Database: 短期メモリをDBに保存
        MemoryManager->>MemoryManager: メモリ圧縮が必要か判定
        alt メモリ圧縮が必要
          MemoryManager->>ChatBot: 短期メモリを要約して中期メモリを生成
          ChatBot-->>MemoryManager: 要約された中期メモリを返信
            MemoryManager->>MemoryManager: 中期メモリに要約を追加
          MemoryManager->>Database: 中期メモリをDBに保存
             MemoryManager->>Database: 長期メモリをDBに保存
        end
        MemoryManager->>ChatBot: 短期、中期、長期メモリを送信
        ChatBot-->>ChatUI: AIの応答を送信
        ChatUI->>User: AIの応答を表示
         ChatBot-->>MemoryManager: AIの応答を送信
       MemoryManager->>MemoryManager: 短期メモリにAIの応答を追加
       MemoryManager->>Database: 短期メモリをDBに保存
    end
    
    ChatBot-->>ChatBot: 情報収集完了の判定
    ChatBot->>ChatUI: 情報収集完了を通知
    ChatUI->>User: 情報収集完了を通知
    User->>ChatUI: 最終確認完了を送信
     ChatUI->>ChatBot: 最終確認完了を送信
    ChatBot->>ChatBot: 短期、中期、長期メモリを元にJSON形式のタスク情報を生成
    ChatBot-->>ChatUI: JSON形式のタスク情報を送信
     ChatUI-->>TaskUI: タスク情報を送信
    TaskUI->>TaskDB: JSON形式のタスク情報を元にタスクを保存
    TaskDB-->>TaskUI: タスク保存完了を返信
    TaskUI->>User: タスク情報を表示