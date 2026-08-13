-- Learning progress tracker
CREATE TYPE topic_status AS ENUM ('not_started', 'in_progress', 'completed');

CREATE TABLE user_topic_progress (
  id          SERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id    INT  NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  status      topic_status NOT NULL DEFAULT 'not_started',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, topic_id)
);

-- Row Level Security: users can only read/write their own progress
ALTER TABLE user_topic_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON user_topic_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_topic_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_topic_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX ON user_topic_progress (user_id);
