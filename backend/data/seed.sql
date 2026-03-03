USE iomp;

INSERT IGNORE INTO users(id, username, password, gravatar, created_at, updated_at)
VALUES
("53e1deae-31da-4244-99e6-c0777da311b0", "forge", "$2a$10$9cQmVqe2Hz6aKX0YqYgvXeDKCbKHhj330ujNxDR7k/yubLoIWiswe", "", NOW(), NOW()),
("09c1a199-df9c-48f2-aa01-28511b19da36", "rithik", "$2a$10$/mA3np4tWg7hsj.Jl9SGmO9BglTllhZxnLrHI7ATWT4VoraU2KC7i", "", NOW(), NOW()),
("6963eed1-0ae8-4b13-ba33-065a56c3ccef", "shubh", "$2a$10$d0n1G5dNVTfGJEvrSxRU9OZrABWQ9ICBL24lONWYWrIUFp11Fx6c.", "", NOW(), NOW()),
("202598e5-b90b-4002-9def-8d6b496c028a", "jaidev", "$2a$10$iIGjYwWQUtrSMuh9RVQYNupBalea0Q6qeBzrtHhlw/5bpWWeRscDe", "", NOW(), NOW()),
("077bd8af-c97b-4a4a-af3f-60e08fae95b9", "harshal", "$2a$10$dISBkirxSiwQnhy2m8SoHuJ2wgYGLkwsF9He5UWVOMLBo2NtKkKxa", "", NOW(), NOW()),
("8404f9f6-cc20-478c-9ff8-1170f0e367b0", "hritik", "$2a$10$u9xQmmo6ejTv/ex021wq9eKZVpIpfwdpE6RrRqp5M6P/qOzDBXh22", "", NOW(), NOW()),
("ec4789e5-e382-4985-85b4-31c0c4bbe745", "shadowsaver", "$2a$10$.qGwjVv/39t.nLEg5DFpkO3oz72MCNsOF6a6ijuMKBmluaH5qAfIq", "", NOW(), NOW());

INSERT IGNORE INTO posts(id, title, body, user_id, created_at, updated_at) VALUES ("904b7e6e-0f20-4020-af7b-4bb775c02189", "LocalDate and LocalDateTime in a index which runs in EST vs UTC", "I am trying to understand LocalDate and LocalDateTime. Since they do not carry zone info, how does it work for now() on two different time zone.", "53e1deae-31da-4244-99e6-c0777da311b0", NOW(), NOW());
SET @v1 := (SELECT LAST_INSERT_ID());
INSERT IGNORE INTO tags(tagname, description, created_at, updated_at) VALUES ("java", "Java is a popular high-level programming language. Use this tag when you&#39;re having problems using or understanding the language itself. This tag is rarely used alone and is most often used in conjunction with [spring], [spring-boot], [jakarta-ee], [android], [javafx], [gradle] and [maven].", NOW(), NOW());
SET @v2 := (SELECT id FROM tags WHERE tagname = "java");
INSERT IGNORE INTO posttag(post_id, tag_id, created_at, updated_at) VALUES(@v1, @v2, NOW(), NOW());

INSERT IGNORE INTO posts(id, title, body, user_id, created_at, updated_at) VALUES ("ee7e47e4-6bfd-4f4f-a3ad-39dd5f37ad27", "Flutter: Specify ListTile height", "The issue is The tile here toke around more than half of the page which makes it looks inconsistent. I want to limit the height of the tile, I have tried putting them in a row and a container and it doesn't work. Any HELP will be appreciated.", "202598e5-b90b-4002-9def-8d6b496c028a", NOW(), NOW());
SET @v1 := (SELECT LAST_INSERT_ID());
INSERT IGNORE INTO tags(tagname, description, created_at, updated_at) VALUES ("flutter", "Flutter is an open-source UI software development kit created by Google. It is used to develop applications for Android, iOS, Linux, Mac, Windows, Google Fuchsia and the web from a single codebase.", NOW(), NOW());
SET @v2 := (SELECT id FROM tags WHERE tagname = "flutter");
INSERT IGNORE INTO posttag(post_id, tag_id, created_at, updated_at) VALUES(@v1, @v2, NOW(), NOW());

INSERT IGNORE INTO posts(id, title, body, user_id, created_at, updated_at) VALUES ("f961328f-f507-4a42-9a79-112ebbad3d9a", "Programmatically navigate using react router", "With react-router I can use the Link element to create links which are natively handled by react router. I see internally it calls this.context.transitionTo(...).", "077bd8af-c97b-4a4a-af3f-60e08fae95b9", NOW(), NOW());
SET @v1 := (SELECT LAST_INSERT_ID());
INSERT IGNORE INTO tags(tagname, description, created_at, updated_at) VALUES ("reactjs", "React is a JavaScript library for building user interfaces. It uses a declarative, component-based paradigm and aims to be both efficient and flexible.", NOW(), NOW());
SET @v2 := (SELECT id FROM tags WHERE tagname = "reactjs");
INSERT IGNORE INTO posttag(post_id, tag_id, created_at, updated_at) VALUES(@v1, @v2, NOW(), NOW());

INSERT IGNORE INTO posts(id, title, body, user_id, created_at, updated_at) VALUES ("bfc3f286-06e4-40c6-bd9a-220376b5fca8", "Why is processing a sorted array faster than processing an unsorted array?", "Here is a piece of C++ code that shows some very peculiar behavior. For some strange reason, sorting the data miraculously makes the code almost six times faster:", "6963eed1-0ae8-4b13-ba33-065a56c3ccef", NOW(), NOW());
SET @v1 := (SELECT LAST_INSERT_ID());
INSERT IGNORE INTO tags(tagname, description, created_at, updated_at) VALUES ("java", "Java is a popular high-level programming language. Use this tag when you&#39;re having problems using or understanding the language itself. This tag is rarely used alone and is most often used in conjunction with [spring], [spring-boot], [jakarta-ee], [android], [javafx], [gradle] and [maven].", NOW(), NOW());
SET @v2 := (SELECT id FROM tags WHERE tagname = "java");
INSERT IGNORE INTO posttag(post_id, tag_id, created_at, updated_at) VALUES(@v1, @v2, NOW(), NOW());

INSERT IGNORE INTO posts(id, title, body, user_id, created_at, updated_at) VALUES ("17d97d9b-7c3f-484a-aa48-0a8bf3e2c71c", "Is there a unique Android device ID?", "Do Android devices have a unique ID, and if so, what is a simple way to access it using Java?", "09c1a199-df9c-48f2-aa01-28511b19da36", NOW(), NOW());
SET @v1 := (SELECT LAST_INSERT_ID());
INSERT IGNORE INTO tags(tagname, description, created_at, updated_at) VALUES ("android", "Android is Google&#39;s mobile operating system, used for programming or developing digital devices (Smartphones, Tablets, Automobiles, TVs, Wear, Glass, IoT). For topics related to Android, use Android-specific tags such as android-intent, android-activity, android-adapter, etc. For questions other than development or programming, but related to the Android framework, use this link: https://android.stackexchange.com.", NOW(), NOW());
SET @v2 := (SELECT id FROM tags WHERE tagname = "android");
INSERT IGNORE INTO posttag(post_id, tag_id, created_at, updated_at) VALUES(@v1, @v2, NOW(), NOW());

INSERT IGNORE INTO answers(id, body, user_id, post_id, created_at, updated_at)
VALUES
("8ab4bf7e-0d27-4912-9108-c90abb6c9a96", "Just remove the Expanded Widget to avoid fill the space available and use a parent Container with a fixed height, the same as the itemExtent value:", "53e1deae-31da-4244-99e6-c0777da311b0", "bfc3f286-06e4-40c6-bd9a-220376b5fca8", NOW(), NOW()),
("f9ce5ae6-fa99-4663-9f30-a741ce199a39", "There is a new useHistory hook in React Router >5.1.0 if you are using React >16.8.0 and functional components.", "09c1a199-df9c-48f2-aa01-28511b19da36", "17d97d9b-7c3f-484a-aa48-0a8bf3e2c71c", NOW(), NOW()),
("ddb5150e-33fc-495a-9b7b-a6b7a970075b", "While you are correct that LocalDateTime and LocalDate don’t contain any time zone information, their now methods do use time zones. Either the one passed to them, or if you use the no-arg variant, the default time zone of the JVM.", "53e1deae-31da-4244-99e6-c0777da311b0", "f961328f-f507-4a42-9a79-112ebbad3d9a", NOW(), NOW());

INSERT IGNORE INTO comments(id, body, user_id, post_id, created_at, updated_at)
VALUES
("300bd1f9-4ce2-4515-8bf3-d23d97e31d3b", "I need more information", "53e1deae-31da-4244-99e6-c0777da311b0", "bfc3f286-06e4-40c6-bd9a-220376b5fca8", NOW(), NOW()),
("120cadb4-8cae-4a8b-b939-b398525d2adc", "I think I can help you in this", "53e1deae-31da-4244-99e6-c0777da311b0", "bfc3f286-06e4-40c6-bd9a-220376b5fca8", NOW(), NOW()),
("38ec6a02-4c5a-4903-bf32-1ffbecc59993", "I need more information", "09c1a199-df9c-48f2-aa01-28511b19da36", "17d97d9b-7c3f-484a-aa48-0a8bf3e2c71c", NOW(), NOW()),
("6c81e5e7-52db-42fe-bd13-eff3f8962ee9", "You sure you don't want funcs to be an array, if you're using numeric indices? Just a heads up.", "53e1deae-31da-4244-99e6-c0777da311b0", "17d97d9b-7c3f-484a-aa48-0a8bf3e2c71c", NOW(), NOW()),
("2f6a8f13-3f58-464a-bbd7-66ee8002ebd8", "I need more information", "6963eed1-0ae8-4b13-ba33-065a56c3ccef", "904b7e6e-0f20-4020-af7b-4bb775c02189", NOW(), NOW());
