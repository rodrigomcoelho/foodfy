drop schema public cascade;
create schema public;

drop database if exists foodfy;

create database foodfy;
-- create procedure
create function trigger_set_timestamp()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- create table files 
create table files 
(
  id serial primary key,
  name text,
  path text not null
);

--create table chefs
create table chefs 
(
    id serial primary key,
    name text,
    file_id integer references files(id),
    created_at timestamp default(now()),
    updated_at timestamp default(now())
);

-- auto updated_at chefs
create trigger trigger_set_timestamp
before update on chefs
for each row
execute procedure trigger_set_timestamp();

-- create table receipts
create table receipts 
(
  id serial primary key,
  chef_id integer references chefs(id),
  title text,
  ingredients text[],
  preparation text[],
  information text,
  created_at timestamp default(now()),
  updated_at timestamp default(now())
);

-- auto updated_at receipts
create trigger trigger_set_timestamp
before update on receipts
for each row
execute procedure trigger_set_timestamp();

-- create table recipe_files
create table recipe_files
(
  id serial primary key,
  recipe_id integer references receipts(id),
  file_id integer references files(id)
);

-- create table users
create table users
(
	id serial primary key,
  name text not null,
  email text unique not null,
  password text not null,
  reset_token text,
  reset_token_expires text,
  is_admin boolean default false,
  created_at timestamp default(now()),
  updated_at timestamp default(now())
);

-- auto updated_at receipts
create trigger trigger_set_timestamp
before update on users
for each row
execute procedure trigger_set_timestamp();

-- session table
create table session (
  sid varchar not null collate "default",
  sess json not null,
  expire timestamp(6) not null
)
with (oids=false);
alter table session 
add constraint session_pkey 
primary key (sid) not deferrable initially immediate;