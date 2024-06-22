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

SELECT pg_get_serial_sequence('funcoes', 'id_funcao');
ALTER SEQUENCE funcoes_id_funcao_seq RESTART WITH 1;

UPDATE funcoes
SET descricao_funcao = 'Adicionar'
WHERE nome_funcao = 'ADAT';

select * from funcoes f; 
select * from perfis p; 

drop table usuarios;
drop table perfis; 
drop table modulos;
drop table transacoes; 
drop table funcoes; 
drop table transacoes_funcoes; 
drop table perfis_modulos; 
drop table modulos_funcoes; 






