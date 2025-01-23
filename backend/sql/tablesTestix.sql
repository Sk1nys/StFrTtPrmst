
CREATE TABLE public.roles (
	id int GENERATED ALWAYS AS IDENTITY NOT NULL,
	"role" varchar(255) NOT NULL,
	CONSTRAINT roles_pk PRIMARY KEY (id)
);

CREATE TABLE public.users (
	id int GENERATED ALWAYS AS IDENTITY NOT NULL,
	"name" varchar(255) NOT NULL,
	surname varchar(255) NOT NULL,
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	role_id int NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT username_unique UNIQUE (username),
	CONSTRAINT email_unique UNIQUE (email),
	CONSTRAINT role_fk FOREIGN KEY (role_id)
		REFERENCES public.roles (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
		NOT VALID
);
CREATE TABLE public.images (
	id int GENERATED ALWAYS AS IDENTITY NOT NULL,
	"image" bytea NOT NULL,
	CONSTRAINT image_pk PRIMARY KEY (id)
);

CREATE TABLE public.tests (
	id int GENERATED ALWAYS AS IDENTITY NOT NULL,
	"title" varchar(255) NOT NULL,
	description varchar(255) NOT NULL,
	subject varchar(255) NOT NULL,
	data DATE NOT NULL,
	disposable BOOLEAN NOT NULL,
	user_id int NOT NULL,
	CONSTRAINT test_pk PRIMARY KEY (id),
	CONSTRAINT user_fk FOREIGN KEY (user_id)
		REFERENCES public.users (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
		NOT VALID
);

CREATE TABLE public.questions (
	id int GENERATED ALWAYS AS IDENTITY NOT NULL,
	test_id int NOT NULL,
	"text" varchar(255) NOT NULL,
	type varchar(255) NOT NULL,
	CONSTRAINT questions_pk PRIMARY KEY (id),
	CONSTRAINT test_fk FOREIGN KEY (test_id)
		REFERENCES public.tests (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
		NOT VALID
);

CREATE TABLE public.answers (
	id int GENERATED ALWAYS AS IDENTITY NOT NULL,
	question_id int NOT NULL,
	"answer_text" varchar(255) NOT NULL,
	isCorrect BOOLEAN NOT NULL,
	CONSTRAINT answer_pk PRIMARY KEY (id),
	CONSTRAINT question_fk FOREIGN KEY (question_id)
		REFERENCES public.questions (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
		NOT VALID
);

CREATE TABLE public.results (
	id int GENERATED ALWAYS AS IDENTITY NOT NULL,
	test_id int NOT NULL,
	user_id int NOT NULL,
	"score" int NOT NULL,
	"total_score" int NOT NULL,
	data DATE NOT NULL,
	CONSTRAINT result_pk PRIMARY KEY (id),
	CONSTRAINT test_fk FOREIGN KEY (test_id)
		REFERENCES public.tests (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
		NOT VALID,
	CONSTRAINT user_fk FOREIGN KEY (user_id)
		REFERENCES public.users (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
		NOT VALID
);

CREATE TABLE public.users_answers (
	id int GENERATED ALWAYS AS IDENTITY NOT NULL,
	result_id int NOT NULL,
	question_id int NOT NULL,
	answer_id int NOT NULL,
	CONSTRAINT users_answer_pk PRIMARY KEY (id),
	CONSTRAINT result_fk FOREIGN KEY (result_id)
		REFERENCES public.results (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
		NOT VALID,
	CONSTRAINT question_fk FOREIGN KEY (question_id)
		REFERENCES public.questions (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
		NOT VALID,
	CONSTRAINT answer_fk FOREIGN KEY (answer_id)
		REFERENCES public.answers (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
		NOT VALID
);



INSERT INTO public.roles ("role")
	VALUES ('Администратор');
INSERT INTO public.roles ("role")
	VALUES ('Ученик');
INSERT INTO public.roles ("role")
	VALUES ('Преподаватель');
INSERT INTO public.users ("name",surname,username,email,"password",role_id)
	VALUES ('Админ','Админ','admin','admin@admin.zov','$2y$13$JMnJBHhjIdfoR/jfE2nn8OeZJlPqqjiy/Ej8bfZF9EGXabaXLIqF2',1);
