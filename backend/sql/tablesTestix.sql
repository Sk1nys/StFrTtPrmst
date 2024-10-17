
CREATE TABLE public.roles (
	id int GENERATED ALWAYS AS IDENTITY NOT NULL,
	"role" varchar(255) NOT NULL,
	CONSTRAINT roles_pk PRIMARY KEY (id)
);

CREATE TABLE public.users (
	id int NOT NULL,
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
	"route" varchar(255) NOT NULL,
	CONSTRAINT image_pk PRIMARY KEY (id)
);

CREATE TABLE public.tests (
	id int NOT NULL,
	"title" varchar(255) NOT NULL,
	description varchar(255) NOT NULL,
	subject varchar(255) NOT NULL,
	data DATE NOT NULL,
	user_id int NOT NULL,
	CONSTRAINT test_pk PRIMARY KEY (id),
	CONSTRAINT user_fk FOREIGN KEY (user_id)
		REFERENCES public.users (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
		NOT VALID
);

CREATE TABLE public.questions (
	id int NOT NULL,
	test_id int NOT NULL,
	"text" varchar(255) NOT NULL,
	type varchar(255),
	correct varchar(255) NOT NULL,
	CONSTRAINT questions_pk PRIMARY KEY (id),
	CONSTRAINT test_fk FOREIGN KEY (test_id)
		REFERENCES public.tests (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
		NOT VALID
);

CREATE TABLE public.answers (
	id int NOT NULL,
	question_id int NOT NULL,
	user_id int NOT NULL,
	"answer" varchar(255) NOT NULL,
	isCorrect BOOLEAN NOT NULL,
	CONSTRAINT answer_pk PRIMARY KEY (id),
	CONSTRAINT question_fk FOREIGN KEY (question_id)
		REFERENCES public.questions (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
		NOT VALID,
	CONSTRAINT user_fk FOREIGN KEY (user_id)
		REFERENCES public.users (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
		NOT VALID
);

CREATE TABLE public.results (
	id int NOT NULL,
	test_id int NOT NULL,
	user_id int NOT NULL,
	"count" int NOT NULL,
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