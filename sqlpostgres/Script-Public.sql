-- Table: public.funcoes
CREATE TABLE public.funcoes (
    id_funcao serial PRIMARY KEY,
    tag_funcao varchar(4) not null UNIQUE,
    nome_funcao varchar(100) NOT null UNIQUE,
    descricao_funcao varchar(255)
);

-- Table: public.modulos
CREATE TABLE public.modulos (
    id_modulo serial PRIMARY KEY,
    tag_modulo varchar(4) not null UNIQUE,
    nome_modulo varchar(100) NOT null UNIQUE,
    descricao_modulo varchar(255),
    id_transacao integer null references public.transacoes(id_transacao)
);

-- Table: public.usuarios
CREATE TABLE public.usuarios (
    id_usuario serial PRIMARY KEY,
    nome_usuario varchar(255) NOT NULL UNIQUE,
    email varchar(255) NOT NULL UNIQUE,
    senha varchar(255) NOT NULL,
    matricula int not null unique,
    id_perfil int null references public.perfis(id_perfil),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.transacoes (
    id_transacao serial PRIMARY KEY,
    tag_transacao varchar(4) not null UNIQUE,
    nome_transacao varchar(100) NOT null UNIQUE,
    descricao_transacao varchar(255)
);

CREATE TABLE public.perfis (
    id_perfil serial PRIMARY KEY,
    nome_perfil varchar(100) NOT null UNIQUE,
    descricao_perfil varchar(255)
);

CREATE TABLE public.modulos_funcoes (
    id serial PRIMARY KEY,
    id_modulo integer NOT NULL REFERENCES public.modulos(id_modulo),
    id_funcao integer NOT NULL REFERENCES public.funcoes(id_funcao)
);

CREATE TABLE public.transacoes_funcoes (
    id serial PRIMARY KEY,
    id_transacao integer NOT NULL REFERENCES public.transacoes(id_transacao),
    id_funcao integer NOT NULL REFERENCES public.funcoes(id_funcao)
);

create table public.perfis_modulos (
	id serial primary key,
	id_perfil integer not null references public.perfis(id_perfil),
	id_modulo integer not null references public.modulos(id_modulo)
);

select * from usuarios u;
select * from perfis p; 
select * from modulos m;
select * from transacoes t;
select * from funcoes f; 
select * from perfis_modulos pm; 
select * from modulos_funcoes mf; 
select * from transacoes_funcoes tf;

-- drop table usuarios;
-- drop table perfis; 
-- drop table modulos;
-- drop table transacoes; 
-- drop table funcoes; 
-- drop table perfis_modulos; 
-- drop table modulos_funcoes; 
-- drop table transacoes_funcoes; 