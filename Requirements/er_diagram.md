erDiagram
    User {
        string id PK
        string email
        string password_hash
        string name
        datetime created_at
        datetime updated_at
    }

    Project ||--o{ Task : "contains"
    User ||--o{ Project : "manages"
    User ||--o| Task : "created"

    Project {
        string id PK
        string name
        string description
         string status
        datetime created_at
        datetime updated_at
    }

    Task {
        string id PK
        string title
        string description
        string priority
        date due_date
        string project_id FK
        string assignee_name
        datetime created_at
        datetime updated_at
    }

   ShortTermMemory {
        string id PK
        string chat_id FK
        json messages
        datetime created_at
    }
   MidTermMemory {
        string id PK
         string chat_id FK
        string summary
        datetime created_at
    }
   LongTermMemory {
       string id PK
         string chat_id FK
        json key_points
        datetime created_at
    }
    Chat {
      string id PK
      string user_id FK
      datetime created_at
       datetime updated_at
    }
    Chat ||--o{ ShortTermMemory : "contains"
    Chat ||--o{ MidTermMemory : "contains"
    Chat ||--o{ LongTermMemory : "contains"
    User ||--o{ Chat : "has"