-- Users table seeds here

-- password: $2b$10$zUr5GSoayQGyHxrhRU512ekcmmdQe0dcI7v3BJlbukUz7U6IOVQim
-- 123:      $2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG

INSERT INTO users
  (name, email, password, avatar)
VALUES
  ('Alice', 'alice@gmail.com', '$2b$10$zUr5GSoayQGyHxrhRU512ekcmmdQe0dcI7v3BJlbukUz7U6IOVQim', 'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/4_avatar-512.png'),
  ('Kira', 'kira@gmail.com', '$2b$10$zUr5GSoayQGyHxrhRU512ekcmmdQe0dcI7v3BJlbukUz7U6IOVQim', 'assets/images/user-default.png'),
  ('Ali Sayed', 'ali@gmail.com', '$2b$10$zUr5GSoayQGyHxrhRU512ekcmmdQe0dcI7v3BJlbukUz7U6IOVQim', 'assets/images/male-avatar-maker.jpg'),
  ('Doug', 'doug@gmail.com', '$2b$10$zUr5GSoayQGyHxrhRU512ekcmmdQe0dcI7v3BJlbukUz7U6IOVQim', 'assets/images/074.jpg'),
  ('Maria Jacobs', 'maria@gmail.com', '$2b$10$zUr5GSoayQGyHxrhRU512ekcmmdQe0dcI7v3BJlbukUz7U6IOVQim', 'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png'),
  ('Allen John', 'allen@gmail.com', '$2b$10$zUr5GSoayQGyHxrhRU512ekcmmdQe0dcI7v3BJlbukUz7U6IOVQim', 'assets/images/user-default.png'),
  ('Jay', 'jay@gmail.com', '$2b$10$zUr5GSoayQGyHxrhRU512ekcmmdQe0dcI7v3BJlbukUz7U6IOVQim', 'assets/images/kitty-typing.gif'),
  ('Duuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuude', 'dude@420.wtf', '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', 'assets/images/kitty-typing.gif'),
  ('Whaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaat', 'duuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuude@duuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuude.duuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuude', '$2b$10$WMtxQHMdAIcArSAe8B.dPu3FJ56M2.MenoSGja8Xx/6PGkDcFgrzG', 'assets/images/kitty-typing.gif');
