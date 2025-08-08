--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_role_enum AS ENUM (
    'author',
    'user',
    'admin'
);


ALTER TYPE public.users_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL,
    movie_id integer NOT NULL,
    id integer NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movies (
    title character varying(255) NOT NULL,
    description text NOT NULL,
    release_date date NOT NULL,
    duration integer NOT NULL,
    poster_url character varying(500),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    author_id integer NOT NULL,
    id integer NOT NULL,
    rating_avg integer DEFAULT 0 NOT NULL,
    rating_count integer DEFAULT 0 NOT NULL,
    approved boolean,
    "deletedAt" timestamp without time zone,
    genre text[] NOT NULL,
    popularity integer DEFAULT 0 NOT NULL,
    trailer_url character varying(500)
);


ALTER TABLE public.movies OWNER TO postgres;

--
-- Name: movies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movies_id_seq OWNER TO postgres;

--
-- Name: movies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movies_id_seq OWNED BY public.movies.id;


--
-- Name: ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ratings (
    rating numeric(2,1) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL,
    movie_id integer NOT NULL,
    id integer NOT NULL,
    CONSTRAINT "CHK_044ed8a2f400fddc84c9dce265" CHECK (((rating >= 1.0) AND (rating <= 5.0)))
);


ALTER TABLE public.ratings OWNER TO postgres;

--
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ratings_id_seq OWNER TO postgres;

--
-- Name: ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ratings_id_seq OWNED BY public.ratings.id;


--
-- Name: trends; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trends (
    id integer NOT NULL,
    search_term character varying NOT NULL,
    count integer DEFAULT 1 NOT NULL,
    poster_url character varying NOT NULL,
    movie_id integer NOT NULL,
    "movieId" integer
);


ALTER TABLE public.trends OWNER TO postgres;

--
-- Name: trends_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trends_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trends_id_seq OWNER TO postgres;

--
-- Name: trends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trends_id_seq OWNED BY public.trends.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    role public.users_role_enum DEFAULT 'user'::public.users_role_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "isEmailVerified" boolean DEFAULT false NOT NULL,
    "verificationToken" character varying,
    id integer NOT NULL,
    "resetPasswordToken" character varying,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: movies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies ALTER COLUMN id SET DEFAULT nextval('public.movies_id_seq'::regclass);


--
-- Name: ratings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings ALTER COLUMN id SET DEFAULT nextval('public.ratings_id_seq'::regclass);


--
-- Name: trends id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trends ALTER COLUMN id SET DEFAULT nextval('public.trends_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (content, created_at, updated_at, user_id, movie_id, id, "deletedAt") FROM stdin;
Loved the story and visuals!	2025-07-10 06:58:11.526314	2025-07-10 06:58:11.526314	3	124	7	\N
Solid performance by the lead actor.	2025-07-10 06:58:11.526314	2025-07-10 06:58:11.526314	3	114	9	\N
The soundtrack was phenomenal.	2025-07-10 06:58:11.526314	2025-07-10 06:58:11.526314	14	124	8	\N
Could’ve been better paced, but still enjoyable.	2025-07-10 06:58:11.526314	2025-07-10 06:58:11.526314	14	114	10	\N
This is the first comment in the system	2025-07-11 02:17:32.385678	2025-07-11 02:17:32.385678	4	124	11	\N
Amazing documentary i ever seen!	2025-07-11 02:39:18.833322	2025-07-11 02:39:18.833322	11	124	13	\N
فيلم تحفه 	2025-07-11 02:40:12.674995	2025-07-11 02:40:12.674995	11	111	14	\N
great movie!	2025-07-11 04:10:54.116094	2025-07-11 04:10:54.116094	4	71	15	\N
Master peace!!!!	2025-07-11 04:12:09.809887	2025-07-11 04:12:09.809887	4	65	16	\N
Top movie ever	2025-07-11 04:12:52.416605	2025-07-11 04:12:52.416605	4	86	17	\N
What this movie doing here	2025-07-13 16:05:23.068589	2025-07-13 16:05:23.068589	4	100	19	\N
Amazing movie	2025-07-13 22:40:29.931376	2025-07-13 22:41:09.642	3	86	20	2025-07-13 22:41:09.642
hi	2025-07-11 04:20:20.624888	2025-07-13 22:43:57.395252	4	86	18	2025-07-13 22:43:57.395252
hi 	2025-07-11 02:26:25.816844	2025-07-17 18:52:58.682401	11	124	12	2025-07-17 18:52:58.682401
great movie.	2025-08-07 21:58:53.505109	2025-08-07 21:59:00.89663	3	135	21	\N
\.


--
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movies (title, description, release_date, duration, poster_url, created_at, updated_at, author_id, id, rating_avg, rating_count, approved, "deletedAt", genre, popularity, trailer_url) FROM stdin;
Avengers: Endgame	After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore order to the universe once and for all, no matter what consequences may be in store.	2019-04-24	181	https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg	2025-07-16 18:05:54.533493	2025-07-16 18:42:40.802768	11	155	0	0	\N	2025-07-16 18:42:40.802768	{Adventure,"Science Fiction",Action}	0	\N
Avengers: Age of Ultron	When Tony Stark tries to jumpstart a dormant peacekeeping program, things go awry and Earth’s Mightiest Heroes are put to the ultimate test as the fate of the planet hangs in the balance. As the villainous Ultron emerges, it is up to The Avengers to stop him from enacting his terrible plans, and soon uneasy alliances and unexpected action pave the way for an epic and unique global adventure.	2015-04-22	141	https://image.tmdb.org/t/p/w500/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg	2025-07-03 09:30:55.637024	2025-08-03 08:35:36.953792	2	87	7	23518	t	\N	{Action,Adventure,"Science Fiction"}	5	\N
Avengers: Infinity War	As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos. A despot of intergalactic infamy, his goal is to collect all six Infinity Stones, artifacts of unimaginable power, and use them to inflict his twisted will on all of reality. Everything the Avengers have fought for has led up to this moment - the fate of Earth and existence itself has never been more uncertain.	2018-04-25	149	https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg	2025-07-03 09:30:54.583975	2025-08-03 13:58:32.630712	2	81	8	30683	t	\N	{Adventure,Action,"Science Fiction"}	7	\N
Avengers: Endgame	After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore order to the universe once and for all, no matter what consequences may be in store.	2019-04-24	181	https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg	2025-07-03 09:30:55.469511	2025-08-07 21:55:30.73663	11	86	8	26470	t	\N	{Adventure,"Science Fiction",Action}	13	https://www.youtube.com/embed/TcMBFSGVi1c?si=WJgGICch-UDIUglw
The Godfather Part II	In the continuing saga of the Corleone crime family, a young Vito Corleone grows up in Sicily and in 1910s New York. In the 1950s, Michael Corleone attempts to expand the family business into Las Vegas, Hollywood and Cuba.	1974-12-20	202	https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg	2025-07-03 09:26:43.067666	2025-08-03 09:52:08.802541	2	65	8	13038	t	2025-08-03 09:52:08.802541	{Drama,Crime}	0	\N
El padrino: The Latin Godfather	In the streets of East Los Angeles, Manny is a formidable drug dealer. Impressed by his extravagant lifestyle and prowess, his young son, Kilo, yearns to follow in his footsteps. Kilo resolves to learn how to prosper in the drug world, and his new life as a dealer begins. In a world where a man wants everything, he may end up with nothing.	2004-09-27	128	https://image.tmdb.org/t/p/w500/10J7EQ8WvMYku8lcZrLewV2Ko4I.jpg	2025-07-03 09:26:42.718879	2025-08-03 09:58:37.354516	2	63	7	63	f	\N	{Action,Crime,Drama}	0	\N
The Shawshank Redemption	Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.	1994-09-23	142	https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg	2025-07-03 09:36:02.227416	2025-07-03 09:36:02.227416	2	134	8	28496	t	\N	{Drama,Crime}	0	\N
تراب الماس	تدور الأحداث حول طه، شاب هادئ يعمل كمندوب دعاية طبية. يعيش حياة رتيبة مع والده المقعد، حتى تنقلب حياته رأسًا على عقب بعد جريمة غامضة تقوده إلى شبكة من الفساد والقتل، تكشف له أسرارًا خطيرة عن عائلته ومجتمعه.	2025-07-15	162	https://media0081.elcinema.com/uploads/_640x_88a789aeff4ccf3a4408e9f5369f0dd34028c8f313da2a052898ecb273cbc26d.jpg	2025-07-15 17:05:31.406161	2025-07-16 18:50:11.060457	11	154	0	0	\N	\N	{Crime,Thriller,Drama}	0	https://www.youtube.com/embed/9cO54cwkN1I?si=l61TcpM7XYzeZ4oQ
KPop Demon Hunters	When K-pop superstars Rumi, Mira and Zoey aren't selling out stadiums, they're using their secret powers to protect their fans from supernatural threats.	2025-06-20	96	https://image.tmdb.org/t/p/w500/jfS5KEfiwsS35ieZvdUdJKkwLlZ.jpg	2025-07-03 09:36:02.374127	2025-07-03 09:36:02.374127	2	136	8	368	t	\N	{Animation,Fantasy,Action,Comedy,Music}	0	\N
The Godfather Part II	In the continuing saga of the Corleone crime family, a young Vito Corleone grows up in Sicily and in 1910s New York. In the 1950s, Michael Corleone attempts to expand the family business into Las Vegas, Hollywood and Cuba.	1974-12-20	202	https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg	2025-07-03 09:36:02.446667	2025-07-03 09:36:02.446667	2	137	8	13037	t	\N	{Drama,Crime}	0	\N
Schindler's List	The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.	1993-12-15	195	https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg	2025-07-03 09:36:02.61594	2025-07-03 09:36:02.61594	2	138	8	16514	t	\N	{Drama,History,War}	0	\N
12 Angry Men	The defense and the prosecution have rested and the jury is filing into the jury room to decide if a young Spanish-American is guilty or innocent of murdering his father. What begins as an open and shut case soon becomes a mini-drama of each of the jurors' prejudices and preconceptions about the trial, the accused, and each other.	1957-04-10	97	https://image.tmdb.org/t/p/w500/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg	2025-07-03 09:36:02.781677	2025-07-03 09:36:02.781677	2	139	8	9224	t	\N	{Drama}	0	\N
Spirited Away	A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.	2001-07-20	125	https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg	2025-07-03 09:36:02.949266	2025-07-03 09:36:02.949266	2	140	8	17248	t	\N	{Animation,Family,Fantasy}	0	\N
Dilwale Dulhania Le Jayenge	Raj is a rich, carefree, happy-go-lucky second generation NRI. Simran is the daughter of Chaudhary Baldev Singh, who in spite of being an NRI is very strict about adherence to Indian values. Simran has left for India to be married to her childhood fiancé. Raj leaves for India with a mission at his hands, to claim his lady love under the noses of her whole family. Thus begins a saga.	1995-10-20	190	https://image.tmdb.org/t/p/w500/2CAL2433ZeIihfX1Hb2139CX0pW.jpg	2025-07-03 09:36:03.294344	2025-07-03 09:36:03.294344	2	142	8	4493	t	\N	{Comedy,Drama,Romance}	0	\N
The Godfather	Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.	1972-03-14	175	https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg	2025-07-03 09:36:02.30362	2025-08-07 21:59:08.382612	2	135	8	21581	t	\N	{Drama,Crime}	0	\N
KPop Demon Hunters	When K-pop superstars Rumi, Mira and Zoey aren't selling out stadiums, they're using their secret powers to protect their fans from supernatural threats.	2025-06-20	96	https://image.tmdb.org/t/p/w500/jfS5KEfiwsS35ieZvdUdJKkwLlZ.jpg	2025-07-03 09:35:01.83027	2025-08-03 09:51:14.637309	2	119	8	368	t	2025-08-03 09:51:14.637309	{Animation,Fantasy,Action,Comedy,Music}	0	\N
Squid Game: Making Season 2	From set designs to character arcs, get exclusive cast and director interviews on how Season 2 of the globally most-watched series was brought to life.	2025-01-02	28	https://image.tmdb.org/t/p/w500/yQGaui0bQ5Ai3KIFBB45nTeIqad.jpg	2025-07-03 09:35:02.679881	2025-08-03 09:57:33.456336	2	124	8	414	f	\N	{Documentary}	5	\N
The Godfather 1901–1959: The Complete Epic	The Godfather 1901–1959: The Complete Epic is a reduced, 386-minute version of the 1977 television miniseries, "Mario Puzo's The Godfather: The Complete Novel for Television," released to video in 1981. Unlike the miniseries, which was presented in four segments (each with opening and closing credits), the Epic is presented as a single segment. In January 2016, HBO aired the Epic in its uncut and uncensored format, later making it available on its streaming platforms. The HBO showing contained most of the known deleted scenes, thereby lengthening the runtime of the Epic from its video release to 423 minutes.	1981-03-24	386	https://image.tmdb.org/t/p/w500/DGCsKaQgcp4QkX7ulL1BMbkIkr.jpg	2025-07-03 09:26:44.104923	2025-08-03 09:58:59.871462	2	71	9	6	t	\N	{Crime,Drama}	0	\N
The Green Mile	A supernatural tale set on death row in a Southern prison, where gentle giant John Coffey possesses the mysterious power to heal people's ailments. When the cell block's head guard, Paul Edgecomb, recognizes Coffey's miraculous gift, he tries desperately to help stave off the condemned man's execution.	1999-12-10	189	https://image.tmdb.org/t/p/w500/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg	2025-07-03 09:36:03.462937	2025-07-03 09:36:03.462937	2	143	8	18180	t	\N	{Fantasy,Drama,Crime}	0	\N
Parasite	All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.	2019-05-30	133	https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg	2025-07-03 09:36:03.630415	2025-07-03 09:36:03.630415	2	144	8	19192	t	\N	{Comedy,Thriller,Drama}	0	\N
Sons of Rizk	Four brothers committing crimes with a promise among them to stop someday. When a deal goes south, the older brother says it's enough, but the other three disagree and recklessly do business with a wanted crime lord.	2015-07-16	103	https://image.tmdb.org/t/p/w500/e3MQdo2s9MC74k8YtYnJZzfFpef.jpg	2025-07-03 09:31:59.311966	2025-07-13 17:00:54.275596	2	111	7	36	t	\N	{Action,Comedy,Crime}	5	\N
Final Destination Bloodlines	Plagued by a violent recurring nightmare, college student Stefanie heads home to track down the one person who might be able to break the cycle and save her family from the grisly demise that inevitably awaits them all.	2025-05-14	110	https://image.tmdb.org/t/p/w500/6WxhEvFsauuACfv8HyoVX6mZKFj.jpg	2025-07-03 09:35:01.154502	2025-07-03 09:35:01.154502	2	115	7	1449	t	\N	{Horror,Mystery}	0	\N
Lilo & Stitch	The wildly funny and touching story of a lonely Hawaiian girl and the fugitive alien who helps to mend her broken family.	2025-05-17	108	https://image.tmdb.org/t/p/w500/7c5VBuCbjZOk7lSfj9sMpmDIaKX.jpg	2025-07-03 09:35:01.496783	2025-07-03 09:35:01.496783	2	117	7	769	t	\N	{Family,"Science Fiction",Comedy,Adventure}	0	\N
First Shift	NYPD veteran Mike and rookie Angela tackle a high-stakes day on New York's toughest streets, diving headfirst into a vortex of danger and action. Their adrenaline-fueled pursuits and unexpected threats unfold as they navigate perilous encounters. Amidst the chaos, intense challenges forge unbreakable bonds.	2024-08-30	89	https://image.tmdb.org/t/p/w500/ajsGI4JYaciPIe3gPgiJ3Vw5Vre.jpg	2025-07-03 09:35:01.663111	2025-07-03 09:35:01.663111	2	118	5	26	t	\N	{Crime,Thriller,Action}	0	\N
F1	Racing legend Sonny Hayes is coaxed out of retirement to lead a struggling Formula 1 team—and mentor a young hotshot driver—while chasing one more chance at glory.	2025-06-25	156	https://image.tmdb.org/t/p/w500/vqBmyAj0Xm9LnS1xe1MSlMAJyHq.jpg	2025-07-03 09:35:01.998157	2025-07-03 09:35:01.998157	2	120	7	393	t	\N	{Action,Drama}	0	\N
How to Train Your Dragon	On the rugged isle of Berk, where Vikings and dragons have been bitter enemies for generations, Hiccup stands apart, defying centuries of tradition when he befriends Toothless, a feared Night Fury dragon. Their unlikely bond reveals the true nature of dragons, challenging the very foundations of Viking society.	2025-06-06	125	https://image.tmdb.org/t/p/w500/3lwlJL8aW6Wor9tKvME8VoMnBkn.jpg	2025-07-03 09:35:02.168816	2025-07-03 09:35:02.168816	2	121	7	518	t	\N	{Fantasy,Family,Action}	0	\N
The Twisters	A deadly patchwork of destructive cyclones is on an apocalyptic path of convergence at a populated Midwest city center. There, the twisters will merge into one mega tornado that threatens to obliterate the cities for hundreds of miles around.	2024-06-28	87	https://image.tmdb.org/t/p/w500/8OP3h80BzIDgmMNANVaYlQ6H4Oc.jpg	2025-07-03 09:35:02.349048	2025-07-03 09:35:02.349048	2	122	5	49	t	\N	{Action,Adventure,Drama}	0	\N
Distant	After crash-landing on an alien planet, an asteroid miner must contend with the challenges of his new surroundings, while making his way across the harsh terrain to the only other survivor – a woman who is trapped in her escape pod.	2024-07-12	87	https://image.tmdb.org/t/p/w500/czh8HOhsbBUKoKsmRmLQMCLHUev.jpg	2025-07-03 09:35:02.515568	2025-07-03 09:35:02.515568	2	123	6	150	t	\N	{"Science Fiction",Comedy,Action}	0	\N
Crazy Lizard	A young man climbs into the mountains to pick up a meteorite that has fallen there and is killed by something. The "thing" descends to the village and begins to eat the inhabitants one by one, terrorizing the entire island.	2024-03-27	75	https://image.tmdb.org/t/p/w500/9TFaFsSXedaALXTzba349euDeoY.jpg	2025-07-03 09:35:02.844511	2025-07-03 09:35:02.844511	2	125	6	20	t	\N	{Action,Thriller,Horror}	0	\N
Thunderbolts*	After finding themselves ensnared in a death trap, seven disillusioned castoffs must embark on a dangerous mission that will force them to confront the darkest corners of their pasts.	2025-04-30	127	https://image.tmdb.org/t/p/w500/hBH50Mkcrc4m8x73CovLmY7vBx1.jpg	2025-07-03 09:35:00.977599	2025-07-07 02:51:21.790981	2	114	7	1354	t	\N	{Action,"Science Fiction",Adventure}	2	\N
28 Years Later	Twenty-eight years since the rage virus escaped a biological weapons laboratory, now, still in a ruthlessly enforced quarantine, some have found ways to exist amidst the infected. One such group lives on a small island connected to the mainland by a single, heavily-defended causeway. When one member departs on a mission into the dark heart of the mainland, he discovers secrets, wonders, and horrors that have mutated not only the infected but other survivors as well.	2025-06-18	115	https://image.tmdb.org/t/p/w500/361hRZoG91Nw6qXaIKuGoogQjix.jpg	2025-07-03 09:35:03.007654	2025-07-03 09:35:03.007654	2	126	7	445	t	\N	{Horror,Thriller,"Science Fiction"}	0	\N
Jurassic World Rebirth	Five years after the events of Jurassic World Dominion, covert operations expert Zora Bennett is contracted to lead a skilled team on a top-secret mission to secure genetic material from the world's three most massive dinosaurs. When Zora's operation intersects with a civilian family whose boating expedition was capsized, they all find themselves stranded on an island where they come face-to-face with a sinister, shocking discovery that's been hidden from the world for decades.	2025-07-01	134	https://image.tmdb.org/t/p/w500/qwOwDHUPCcDRmdQu8dWCzIVMEgu.jpg	2025-07-03 09:35:03.171354	2025-07-03 09:35:03.171354	2	127	6	70	t	\N	{"Science Fiction",Adventure,Action}	0	\N
The Ritual	Two priests, one in crisis with his faith and the other confronting a turbulent past, must overcome their differences to perform a risky exorcism.	2025-05-27	98	https://image.tmdb.org/t/p/w500/uubL8yvtEBjz3V7DFQHjCuSQO8w.jpg	2025-07-03 09:35:03.341236	2025-07-03 09:35:03.341236	2	128	5	63	t	\N	{Horror}	0	\N
Avatar 5	The fifth installment of the Avatar franchise.	2031-12-17	0	https://image.tmdb.org/t/p/w500/rtmmvqkIC5zDMEd638Es2woxbz8.jpg	2025-07-03 09:26:08.720262	2025-07-03 09:26:08.720262	2	57	0	0	t	\N	{Adventure,"Science Fiction",Fantasy}	0	\N
Avatar	In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.	2009-12-15	162	https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg	2025-07-03 09:26:06.005077	2025-07-03 09:26:06.005077	2	41	7	32356	t	\N	{Action,Adventure,Fantasy,"Science Fiction"}	0	\N
Avatar	Tension mounts between a quadraplegic man and his wife as she prepares a bath for him.	2006-04-11	15	https://image.tmdb.org/t/p/w500/gmnD2e1RvMdCl9D1rsDEQaQlJxK.jpg	2025-07-03 09:26:06.186877	2025-07-03 09:26:06.186877	2	42	5	59	t	\N	{Drama}	0	\N
Avatar	Based on Théophile Gautier's novel of the same name, the film tells of the tragic love affair of Ottavio de Saville. He falls madly in love with Madame Prascovie Labinska, a woman very faithful to her husband, the Polish count Olaf Labinski. Alarmed by the growing physical and mental weariness of the desperate young man, his relatives and friends decide to turn to Doctor Balthazar, who has just returned from a trip to the Indies where he was initiated into the secrets of Brahman.	1916-03-06	50	https://image.tmdb.org/t/p/w500/nUTlHxnwomoIwojD0AF0OMzkonw.jpg	2025-07-03 09:26:06.353749	2025-07-03 09:26:06.353749	2	43	4	16	t	\N	{Drama,Fantasy}	0	\N
Avatar: Creating the World of Pandora	The Making-of James Cameron's Avatar. It shows interesting parts of the work on the set.	2010-02-07	23	https://image.tmdb.org/t/p/w500/d9oqcfeCyc3zmMal6eJbfj3gatc.jpg	2025-07-03 09:26:06.523211	2025-07-03 09:26:06.523211	2	44	6	169	t	\N	{Documentary}	0	\N
Avataro Sentai Donbrothers vs. Zenkaiger	Divided into three acts, the first act is about the Zenkaigers dealing with a new Kashiwa Mochi World and Zocks declares himself as "Kashiwa Mochi King", the ruler of Zenkaitopia?! In the second act, it's been a year since Taro left and the five companions continue to fight as a team with Jiro as their leader. Taro later regains his memories, only for his companions to ask him to leave the Donbrothers. In the final act, an incident caused the two worlds to connect, thus a full-throttle miracle battle between the two Super Sentai begins!	2023-05-03	60	https://image.tmdb.org/t/p/w500/h5MwCuYy2EUv3AmD3d3E6AUYo90.jpg	2025-07-03 09:26:06.693123	2025-07-03 09:26:06.693123	2	45	4	29	t	\N	{Action,Drama,"Science Fiction"}	0	\N
The King's Avatar: For the Glory	In this prequel to the animated series The King's Avatar, Ye Xiu enters into the pro gaming world of Glory, and competes in the first Pro League series tournament.	2019-08-16	98	https://image.tmdb.org/t/p/w500/6lyXW6GC7ruwDmhvEcRd9d46ZO7.jpg	2025-07-03 09:26:06.858307	2025-07-03 09:26:06.858307	2	46	6	67	t	\N	{Animation,Action,Drama}	0	\N
My Avatar and Me	is a creative documentary-fiction film and a film that might expand your sense of reality. It is the story about a man who enters the virtual world Second Life to pursue his personal dreams and ambitions. His journey into cyberspace becomes a magic learning experience, which gradually opens the gates to a much larger reality.	2010-11-10	0	https://image.tmdb.org/t/p/w500/dZCj0jiOoDzAzbQM7ryYFEjkjs7.jpg	2025-07-03 09:26:07.024967	2025-07-03 09:26:07.024967	2	47	5	23	t	\N	{Documentary,"Science Fiction"}	0	\N
Avatar: The Way of Water	Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.	2022-12-14	192	https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg	2025-07-03 09:26:07.202393	2025-07-03 09:26:07.202393	2	48	7	12647	t	\N	{"Science Fiction",Adventure,Action}	0	\N
Avataro Sentai Donbrothers vs. Avataro Sentai Donburies	The Avataro Sentai Donburies, which first appeared in Avataro Sentai Donbrothers' press conference gets a TTFC special!	2023-11-05	27	https://image.tmdb.org/t/p/w500/9hiiML3NMC4Qj25V97XEYl7bVKw.jpg	2025-07-03 09:26:07.376508	2025-07-03 09:26:07.376508	2	49	5	13	t	\N	{}	0	\N
The Dark Knight	Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.	2008-07-16	152	https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg	2025-07-03 09:36:03.126436	2025-07-16 18:06:17.909839	11	141	8	34017	t	\N	{Drama,Action,Crime,Thriller}	1	\N
The Godfather	Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.	1972-03-14	175	https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg	2025-07-03 09:26:42.550474	2025-08-03 09:52:04.304077	2	62	8	21580	t	2025-08-03 09:52:04.304077	{Drama,Crime}	0	\N
Avatara Purusha: Part 1	When a son of an Ayurveda scholar goes missing, he blames his sister and cuts all ties with her. When the latter's daughter decides to set things right with a devious plan, there seems to be more trouble waiting for the family.	2022-05-06	131	https://image.tmdb.org/t/p/w500/gQ29E9Qy6z5ExsxnpgUTHfpZFO3.jpg	2025-07-03 09:26:07.547603	2025-07-03 09:26:07.547603	2	50	4	22	t	\N	{Thriller,Fantasy,Horror}	0	\N
The Botanical Avatar of Mademoiselle Flora	A young woman lives sadly in a small garrison town with a soldier. Little by little, won over by boredom, sadness, total inaction, she develops a relationship with plants and starts talking to plants.	1965-05-05	14	https://image.tmdb.org/t/p/w500/jV7LWoQbwXplgdIbMvT4UB8O1E3.jpg	2025-07-03 09:26:07.716745	2025-07-03 09:26:07.716745	2	51	5	26	t	\N	{Comedy}	0	\N
Avatar: The Exchange of Souls	Count Olgierd Łabiński lives with his beloved wife in Paris in a beautiful palace. The Countess recalls her stay in Florence and her insistent admirer Octavius ​​de Saville. Soon, Octavius, arrives in Paris and calls for the famous Dr. Cherbonneau, suspected of being a charlatan.  Citing the teachings of the East, Cherbonneau offers the patient an "avatar", a reincarnation of the soul, which takes a different body...	1964-01-01	59	https://image.tmdb.org/t/p/w500null	2025-07-03 09:26:07.883447	2025-07-03 09:26:07.883447	2	52	4	17	t	\N	{"TV Movie",Drama,Family}	0	\N
Avatara Purusha 2	In a battle of mantras, Dharka and Brahma vie for the Trishanku Mani. But when Jois is found dead, the disturbed Ashta Dhigbandana alerts Dharka to the stone`s presence in the house. Now, a junior artist posing as the long-lost son must fight to save the family from the real son`s dark magic	2024-04-05	124	https://image.tmdb.org/t/p/w500/qNNoxTqBjXJvxiDjC6R3PVH0XoQ.jpg	2025-07-03 09:26:08.049979	2025-07-03 09:26:08.049979	2	53	3	7	t	\N	{Action,Comedy,Fantasy,Thriller}	0	\N
Hunan: The Other World of Avatar	How China's magical Zhangjiajie National Park attracted director James Cameron, who came seeking inspiration for a mysterious fictional planet.	2015-01-01	54	https://image.tmdb.org/t/p/w500/aCwF72gto2ADsQK28j7S9tE4xDa.jpg	2025-07-03 09:26:08.218055	2025-07-03 09:26:08.218055	2	54	4	17	t	\N	{Documentary}	0	\N
Avatar 4	The fourth installment of the Avatar franchise.	2029-12-19	0	https://image.tmdb.org/t/p/w500/qzMYKnT4MG1d0gnhwytr4cKhUvS.jpg	2025-07-03 09:26:08.384536	2025-07-03 09:26:08.384536	2	55	0	0	t	\N	{"Science Fiction",Adventure,Fantasy}	0	\N
Capturing Avatar	Capturing Avatar is a feature length behind-the-scenes documentary about the making of Avatar. It uses footage from the film's development, as well as stock footage from as far back as the production of Titanic in 1995. Also included are numerous interviews with cast, artists, and other crew members. The documentary was released as a bonus feature on the extended collector's edition of Avatar.	2010-11-16	98	https://image.tmdb.org/t/p/w500/26SMEXJl3978dn2svWBSqHbLl5U.jpg	2025-07-03 09:26:08.550322	2025-07-03 09:26:08.550322	2	56	7	94	t	\N	{Documentary}	0	\N
Avatar: Scene Deconstruction	The deconstruction of the Avatar scenes and sets	2009-12-18	0	https://image.tmdb.org/t/p/w500/uCreCQFReeF0RiIXkQypRYHwikx.jpg	2025-07-03 09:26:09.056814	2025-07-03 09:26:09.056814	2	59	6	51	t	\N	{Documentary}	0	\N
Avataro Sentai Donbrothers The Movie: New First Love Hero	The Donbrothers are offered to appear in a movie based on Haruka's debut manga, which she allegedly plagiarized, First Love Hero by talented producer Reiko Mieda! She can't hide that she is upset about the offer. Will the plagiarism be revealed? That said, shooting for the movie is a mess and the Noto even got parts! What is happening with the movie's shooting?! ​	2022-07-22	33	https://image.tmdb.org/t/p/w500/8MacEBNLdMnmroPAx6LNmi6oJaj.jpg	2025-07-03 09:26:09.267162	2025-07-03 09:26:09.267162	2	60	6	14	t	\N	{Action,Adventure,Fantasy,"Science Fiction",Family}	0	\N
Godfather	A 2012 Kannada film	2012-07-27	146	https://image.tmdb.org/t/p/w500/ipV6QtfFnrj80Ar2eH24gjSZHir.jpg	2025-07-03 09:26:42.377762	2025-07-03 09:26:42.377762	2	61	6	14	t	\N	{}	0	\N
Your Name.	High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places. Mitsuha wakes up in Taki’s body, and he in hers. This bizarre occurrence continues to happen randomly, and the two must adjust their lives around each other.	2016-08-26	106	https://image.tmdb.org/t/p/w500/8GJsy7w7frGquw1cy9jasOGNNI1.jpg	2025-07-03 09:36:04.149881	2025-07-03 09:36:04.149881	2	147	8	11834	t	\N	{Animation,Romance,Drama}	0	\N
Onimasa: A Japanese Godfather	Onimasa is the egocentric boss of a small yakuza clan on Shikoku Island, whose criminal duties conflict with his self-image as a chivalrous samurai. His struggles with his boss, the Shikoku Godfather, and the tumultuous life of his adopted daughter, Matsue, form the backdrop of this epic tale of justice, obedience, and bloody vengeance.	1982-06-05	146	https://image.tmdb.org/t/p/w500/vGP9WAxhXFTtEmoemhy3ysIwLkT.jpg	2025-07-03 09:26:42.88692	2025-07-03 09:26:42.88692	2	64	6	22	t	\N	{Action,Crime,Drama}	0	\N
Little Godfather from Hong Kong	Bruce Liang plays a Chinese Kung Fu movie star, who during his free time carries on a one-man crusade against drug dealers. The villains trick Liang into signing up to appear in a new martial arts movie. The plan is to kill Our Hero while the cameras are running, and make it look like an accident.	1974-06-28	87	https://image.tmdb.org/t/p/w500/1ieXvvdaEmvtxXL8dYUKvFymYZD.jpg	2025-07-03 09:26:43.272777	2025-07-03 09:26:43.272777	2	66	7	1	t	\N	{Action}	0	\N
The Godfather Legacy	THE GODFATHER LEGACY goes deep inside Francis Ford Coppola's epic saga about the Corleone crime family and reveals how the Academy Award-winning film and its sequels became one of the most acclaimed franchises in Hollywood history. Featuring iconic scenes from all three films, never before seen home movies and insightful interviews with filmmakers (Francis Ford Coppola, All Ruddy and Peter Bart), actors (Al Pacino, James Caan, Talia Shire, Joe Mantegna, et al.), law enforcement officials and even former Mafia members. This feature length documentary illustrates why The Godfather trilogy continues to entertain and fascinate audiences and how it continues to impact the way society views everything from capitalism to crime.	2012-07-12	95	https://image.tmdb.org/t/p/w500/9y9w5prvVjBtwWl9TNtvThL0NNi.jpg	2025-07-03 09:26:43.439724	2025-07-03 09:26:43.439724	2	67	7	17	t	\N	{Documentary,"TV Movie"}	0	\N
The Godfather Family: A Look Inside	A documentary on the making of the three Godfather films, with interviews and recollections from the film makers and cast. This feature also includes the original screen tests of some of the actors for "The Godfather" film, and some candid moments on the set of "The Godfather: Part III."	1990-07-12	73	https://image.tmdb.org/t/p/w500/jDdybr7reoVABPthX9OSlazvncD.jpg	2025-07-03 09:26:43.608052	2025-07-03 09:26:43.608052	2	68	7	41	t	\N	{Documentary,"TV Movie"}	0	\N
Class Reunion 3: Godfathers	The final film in the trilogy takes us on another wild ridewhich will stop at nothing and will leave no time to feel shame. The three best friends –Mart, Andres and Toomas, are back! And as always, they offer genius solutions to both their personal problems, as well as the audience’s spare time.	2019-01-22	90	https://image.tmdb.org/t/p/w500/prLKozxIuJVacKiPq8ZrbYosEmo.jpg	2025-07-03 09:26:43.77504	2025-07-03 09:26:43.77504	2	69	4	5	t	\N	{Comedy}	0	\N
The Godfather of Green Bay	Joe Keegan is the 'Rocky' of stand-up comedy. A fifteen-year comedy veteran who was pegged for stardom early on in his career but has blown every major audition he has ever had in legendary fashion. Fresh off a recent fiasco with a heckler that included a broken nose, Joe's friend Kenny tells him he can get them an audition for 'The Tonight Show' and that it's 'a can't miss.' The one catch is that it's at a roadside bar in tiny Pine Lake, Wisconsin, hometown of Tonight Show Talent scout, Harvey Skorik who never misses 'Rocktoberfest.' Having doubts but needing a break from L.A., Joe reluctantly agrees to go. Arriving in Wisconsin, Joe bombs his first night on stage when local emcee Dug sabotages him. Joe cannot get a break until he encounters his former high school English teacher, the beautiful Molly Mahoney who is also at a crossroads in her life.	2005-04-20	90	https://image.tmdb.org/t/p/w500/83uAEy4jLR1QpkUmsx3YHTpP1vB.jpg	2025-07-03 09:26:43.941886	2025-07-03 09:26:43.941886	2	70	3	7	t	\N	{Comedy}	0	\N
The Good, the Bad and the Ugly	While the Civil War rages on between the Union and the Confederacy, three men – a quiet loner, a ruthless hitman, and a Mexican bandit – comb the American Southwest in search of a strongbox containing $200,000 in stolen gold.	1966-12-22	161	https://image.tmdb.org/t/p/w500/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg	2025-07-03 09:36:04.484791	2025-07-03 09:36:04.484791	2	149	8	9057	t	\N	{Western}	0	\N
Miracles: The Canton Godfather	A country boy becomes the head of a gang through the purchase of some lucky roses from an old lady. He and a singer at the gang's nightclub try to do a good deed for the old lady when her daughter comes to visit.	1989-06-15	126	https://image.tmdb.org/t/p/w500/70OnveJQzlYji1TOoODNGrU9Mjj.jpg	2025-07-03 09:26:44.945003	2025-07-03 09:26:44.945003	2	76	7	170	t	\N	{Crime,Action,Comedy,Drama}	0	\N
Our Godfather	The story of how Sicilian Mafia boss Tommaso Buscetta (1928-2000), the Godfather of Two Worlds, revealed, starting in 1984, the deepest secrets of the organization, thus helping to convict the hundreds of mafiosi who were tried in the trial held in Palermo between 1986 and 1987.	2019-04-28	93	https://image.tmdb.org/t/p/w500/dSI9Gy5xqmObmKoR9D80Bl0c1GC.jpg	2025-07-03 09:26:45.111604	2025-07-03 09:26:45.111604	2	77	6	63	t	\N	{Documentary,History}	0	\N
Godfather from Canton	A coolie is ofter a job a policeman after saving a government official, and through treachery and corruption rises through the ranks of the police, then becomes a gangster.	1982-06-11	85	https://image.tmdb.org/t/p/w500/3sAZvlMTyeAyJYXKl0siCiAt4Da.jpg	2025-07-03 09:26:45.280622	2025-07-03 09:26:45.280622	2	78	4	2	t	\N	{Action}	0	\N
Battle of the Godfathers	Hamburg business man Otto Westermann is also the boss of organized crime in the city. His reign as godfather is in danger, though, as an ambitious Sicilian mafioso enters the fray. His goal is clear and simple: he wants to take over Hamburg. But Westermann isn't as easy to defeat as the Sicilian expects. And soon Hamburg is on the verge of a bloody mob war.	1973-11-30	87	https://image.tmdb.org/t/p/w500/rcG0CQxgSQ9d07omrrTGi6iD1Vm.jpg	2025-07-03 09:26:45.44804	2025-07-03 09:26:45.44804	2	79	5	9	t	\N	{Drama,Action,Thriller}	0	\N
The Funny Face of the Godfather	The Godfather Don Vito Monreale knows, by chance, the Italian-American singer Nick Bouillon. Since the two are alike, Don Vito decided to exploit this similarity in his favour.	1973-05-03	100	https://image.tmdb.org/t/p/w500/yFI6AyrblDaTkJu3iYpZhdSp8wx.jpg	2025-07-03 09:26:45.615068	2025-07-03 09:26:45.615068	2	80	2	1	t	\N	{Comedy}	0	\N
LEGO Marvel Avengers: Mission Demolition	A young, aspiring hero and superhero fan inadvertently unleashes a powerful new villain looking to rid the world of the Avengers.	2024-10-17	44	https://image.tmdb.org/t/p/w500/x9Gi93zL1DZCNwcRkzpe1QndNlY.jpg	2025-07-03 09:30:54.757404	2025-07-03 09:30:54.757404	2	82	6	113	t	\N	{Animation,Comedy,"Science Fiction"}	0	\N
Crippled Avengers	A group of martial artists seek revenge after being crippled by Tu Tin-To, a martial arts master, and his son.	1978-12-21	106	https://image.tmdb.org/t/p/w500/eKdvNCKtiuUFvwCXtpwISw8jqZ5.jpg	2025-07-03 09:30:54.925054	2025-07-03 09:30:54.925054	2	83	6	101	t	\N	{Action,Drama}	0	\N
The Avengers	When an unexpected enemy emerges and threatens global safety and security, Nick Fury, director of the international peacekeeping agency known as S.H.I.E.L.D., finds himself in need of a team to pull the world back from the brink of disaster. Spanning the globe, a daring recruitment effort begins!	2012-04-25	143	https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg	2025-07-03 09:30:55.093241	2025-07-03 09:30:55.093241	2	84	7	32213	t	\N	{"Science Fiction",Action,Adventure}	0	\N
LEGO Marvel Avengers: Code Red	The Avengers gather to celebrate their latest victory, but their celebration is quickly interrupted by the mysterious disappearance of Black Widow's father, Red Guardian. As the Avengers investigate, they discover that Red Guardian isn't the only one missing when they meet a dangerous new foe quite unlike anything they've ever encountered before.	2023-10-26	46	https://image.tmdb.org/t/p/w500/rDzig50dj7VpLwJ7SThbamETK1G.jpg	2025-07-03 09:30:55.298694	2025-07-03 09:30:55.298694	2	85	6	136	t	\N	{Animation,Action,Family}	0	\N
Interstellar	The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.	2014-11-05	169	https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg	2025-07-03 09:36:04.68846	2025-07-03 09:36:04.68846	2	150	8	37357	t	\N	{Adventure,Drama,"Science Fiction"}	0	\N
Avengers Confidential: Black Widow & Punisher	When the Punisher takes out a black-market weapons dealer, he stumbles upon a far-reaching terrorist plot devised by a group known as Leviathan.	2014-04-19	83	https://image.tmdb.org/t/p/w500/wJcyYVRPZDOZOD2w0r2R6wuZqqN.jpg	2025-07-03 09:30:56.759669	2025-07-03 09:30:56.759669	2	93	6	275	t	\N	{Animation,"Science Fiction",Action}	0	\N
Avengers: Doomsday	The Avengers, Wakandans, Fantastic Four, Thunderbolts, and X-Men all fight against Doctor Doom. Plot TBA.	2026-12-18	0	https://image.tmdb.org/t/p/w500/6eB2oh1SplddsZYCdayrIdrIGLd.jpg	2025-07-03 09:30:56.924369	2025-07-03 09:30:56.924369	2	94	0	0	t	\N	{"Science Fiction"}	0	\N
The Avengers: A Visual Journey	Joss Whedon and others in interviews discussing the aims for this new franchise.	2012-09-25	7	https://image.tmdb.org/t/p/w500/2kBT7KONKQTIhkMc2ZtPU11E8Ky.jpg	2025-07-03 09:30:57.269329	2025-07-03 09:30:57.269329	2	96	7	27	t	\N	{}	0	\N
Avengers of Justice: Farce Wars	While trying to remain a good husband and father, Superbat recruits the Avengers of Justice out of retirement to stop Dark Jokester and Lisp Luthor from freezing the planet.	2018-07-20	88	https://image.tmdb.org/t/p/w500/yymsCwKPbJIF1xcl2ih8fl7OxAa.jpg	2025-07-03 09:30:57.437929	2025-07-03 09:30:57.437929	2	97	5	29	t	\N	{Comedy,Fantasy,Action}	0	\N
Thunderbolts*	After finding themselves ensnared in a death trap, seven disillusioned castoffs must embark on a dangerous mission that will force them to confront the darkest corners of their pasts.	2025-04-30	127	https://image.tmdb.org/t/p/w500/hBH50Mkcrc4m8x73CovLmY7vBx1.jpg	2025-07-03 09:30:57.603626	2025-07-03 09:30:57.603626	2	98	7	1354	t	\N	{Action,"Science Fiction",Adventure}	0	\N
LEGO Marvel Avengers: Time Twisted	When Thanos steals the quantum tunnel, the Avengers embark on a mission to stop him from changing history.	2022-01-17	22	https://image.tmdb.org/t/p/w500/7nA9AjJ8iZvbBPsFPC2FNoFj568.jpg	2025-07-03 09:30:57.771262	2025-07-03 09:30:57.771262	2	99	7	16	t	\N	{Family,Animation,Action,Adventure}	0	\N
Batman	Batman must face his most ruthless nemesis when a deformed madman calling himself "The Joker" seizes control of Gotham's criminal underworld.	1989-06-21	126	https://image.tmdb.org/t/p/w500/cij4dd21v2Rk2YtUQbV5kW69WB2.jpg	2025-07-03 09:31:14.752229	2025-07-03 09:31:14.752229	2	101	7	8101	t	\N	{Fantasy,Action,Crime}	0	\N
Batman	Japanese master spy Daka operates a covert espionage-sabotage organization located in Gotham City's now-deserted Little Tokyo, which turns American scientists into pliable zombies. The great crime-fighters Batman and Robin, with the help of their allies, are in pursuit.	1943-07-16	260	https://image.tmdb.org/t/p/w500/AvzD3mrtokIzZOiV6zAG7geIo6F.jpg	2025-07-03 09:31:14.925889	2025-07-03 09:31:14.925889	2	102	6	115	t	\N	{Action,Adventure,Crime,"Science Fiction",Thriller,War}	0	\N
Batman	The Dynamic Duo faces four super-villains who plan to hold the world for ransom with the help of a secret invention that instantly dehydrates people.	1966-07-30	105	https://image.tmdb.org/t/p/w500/zzoPxWHnPa0eyfkMLgwbNvdEcVF.jpg	2025-07-03 09:31:15.094838	2025-07-03 09:31:15.094838	2	103	6	985	t	\N	{Action,Comedy,Crime}	0	\N
GoodFellas	The true story of Henry Hill, a half-Irish, half-Sicilian Brooklyn kid who is adopted by neighbourhood gangsters at an early age and climbs the ranks of a Mafia family under the guidance of Jimmy Conway.	1990-09-12	145	https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg	2025-07-03 09:36:04.861119	2025-07-03 09:36:04.861119	2	151	8	13457	t	\N	{Drama,Crime}	0	\N
Next Avengers: Heroes of Tomorrow	The children of the Avengers hone their powers and go head to head with the very enemy responsible for their parents' demise.	2008-09-02	78	https://image.tmdb.org/t/p/w500/1y4J9HZJoTIMdt77wCq80uXaQJ.jpg	2025-07-03 09:30:56.169754	2025-08-03 14:01:43.530362	2	90	7	295	t	2025-08-03 14:01:43.530362	{Animation,Family,Action,Adventure,"Science Fiction"}	0	\N
Avengers from Hell	Three macabre short stories about gambling, vengeance and homicide.	1981-04-02	92	https://image.tmdb.org/t/p/w500/AuhPoFUKgYBRNDYjsTOPHE56Nzz.jpg	2025-07-03 09:30:56.593404	2025-08-03 14:01:58.738184	2	92	7	10	t	2025-08-03 14:01:58.738184	{Fantasy,Horror,Mystery}	0	\N
People's Avengers	About the partisan movement during the Great Patriotic War.	1943-11-14	55	https://image.tmdb.org/t/p/w500/D1QpslQSEZ9iCiBr6B5oZsIhOR.jpg	2025-07-03 09:30:57.088529	2025-08-03 14:02:12.426047	2	95	7	9	t	2025-08-03 14:02:12.426047	{Documentary}	0	\N
Bikini Avengers	When the Jade Empress steals the world's largest diamonds, super heroes Bikini Avenger and Thong Girl must stop her before she uses the gems to build a dangerous sci-fi weapon.	2015-02-24	81	https://image.tmdb.org/t/p/w500/ehTYWuPKwl8sXPX0I6LnvJUDaVl.jpg	2025-07-03 09:30:56.005045	2025-08-03 14:02:46.252354	2	89	6	30	t	2025-08-03 14:02:46.252354	{Comedy}	0	\N
3 Avengers	Ursus and his sword-wielding companions run head-on against a usurper of a throne.	1964-11-26	101	https://image.tmdb.org/t/p/w500/skGMVZ41KWezqKa29g8bqpXfLlV.jpg	2025-07-03 09:30:56.427149	2025-08-03 14:03:02.053969	2	91	6	16	t	2025-08-03 14:03:02.053969	{Action,Adventure}	0	\N
Sons of Rizk 3: Knockout	Years have passed since the brothers have separated in their different ways of life. But one day, a ghost from the past returns to cast a shadow over the sons of Rizk, forcing them to return to a life of crime and theft once again in order to save themselves, in a fateful operation that is the largest, most dangerous, and most important in the history of the sons of Rizk.	2024-06-12	125	https://image.tmdb.org/t/p/w500/oYwTsy5sNz3TvIeYBWyDRYnTzdu.jpg	2025-07-03 09:31:59.487054	2025-07-03 09:31:59.487054	2	112	6	10	t	\N	{Action,Crime,Thriller}	0	\N
Sons of Rizk 2: Return of the Lions of the Land	Three years after the events of the first film, the four brothers are trying in various ways to preserve the covenant they made to themselves to stay away from a life of theft and crime, but one event in their lives changes all that, and introduces them to new worlds for them, and puts them in very dangerous confrontations with A number of professional criminals.	2019-08-08	96	https://image.tmdb.org/t/p/w500/hA8Gmyiw0NYuRnuwEb0Iezs7fZM.jpg	2025-07-03 09:31:59.653312	2025-07-03 09:31:59.653312	2	113	7	26	t	\N	{Drama,Action}	0	\N
Pulp Fiction	A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.	1994-09-10	154	https://image.tmdb.org/t/p/w500/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg	2025-07-03 09:36:03.807862	2025-07-03 09:36:03.807862	2	145	8	28809	t	\N	{Thriller,Crime,Comedy}	0	\N
Ballerina	Taking place during the events of John Wick: Chapter 3 – Parabellum, Eve Macarro begins her training in the assassin traditions of the Ruska Roma.	2025-06-04	125	https://image.tmdb.org/t/p/w500/mKp4euM5Cv3m2U1Vmby3OGwcD5y.jpg	2025-07-03 09:35:01.327932	2025-07-03 09:35:01.327932	2	116	7	475	t	\N	{Action,Thriller,Crime}	0	\N
Gal Avatar	An ordinary high school student– with an incontinent grandmother and extremely horny dad, are visited by an extremely pretty avatar to preform a “mind transfer” on Grandma. But before too long, Dad’s sniffing round to get it on with the great-shaped avatar.	2010-01-01	71	https://image.tmdb.org/t/p/w500/9ItW3uf0U2OatKb60VAqu6FrbJh.jpg	2025-07-03 09:26:08.888813	2025-07-03 09:26:08.888813	2	58	4	18	t	\N	{"Science Fiction"}	0	\N
Tokyo Godfathers	On Christmas Eve, three homeless people living on the streets of Tokyo discover a newborn baby among the trash and set out to find its parents.	2003-12-05	92	https://image.tmdb.org/t/p/w500/sPC66btzQlzuRdPKiSDYZ5Hvxgc.jpg	2025-07-03 09:26:44.275322	2025-07-03 09:26:44.275322	2	72	7	1362	t	\N	{Animation,Drama,Comedy}	0	\N
The Godfather Part III	In the midst of trying to legitimize his business dealings in 1979 New York and Italy, aging mafia don, Michael Corleone seeks forgiveness for his sins while taking a young protege under his wing.	1990-12-25	162	https://image.tmdb.org/t/p/w500/lm3pQ2QoQ16pextRsmnUbG2onES.jpg	2025-07-03 09:26:44.442604	2025-07-03 09:26:44.442604	2	73	7	6439	t	\N	{Crime,Drama,Thriller}	0	\N
Godfather	A retelling of William Shakespeare's "Romeo and Juliet", the film revolves around the rivalry between two families, the Anjooran and Anappara houses, and the consequences faced when two members of the families fall in love.	1991-09-15	150	https://image.tmdb.org/t/p/w500/xnsLPhy3IkgDFDZQjLofOgPDa5d.jpg	2025-07-03 09:26:44.610351	2025-07-03 09:26:44.610351	2	74	7	31	t	\N	{Drama,Comedy,Romance}	0	\N
Godfather's Fury	Hong Kong crime movie from 1978	1978-08-05	0	https://image.tmdb.org/t/p/w500/7zNb631S6zt7x0bsfnbknOx2Vkk.jpg	2025-07-03 09:26:44.777831	2025-07-03 09:26:44.777831	2	75	0	0	t	\N	{Crime}	0	\N
Masked Avengers	Philip Kwok plays a repentant killer who vows to destroy the masked gang of which he was a member. A young fighter and his martial arts brothers come to the town to catch the killers, but one of them is not to be trusted!	1981-05-15	92	https://image.tmdb.org/t/p/w500/vr54E7RjvMLE4rFgb1NPgZdnpj6.jpg	2025-07-03 09:30:55.839199	2025-08-03 14:02:26.73794	2	88	6	33	t	2025-08-03 14:02:26.73794	{Action,Drama}	1	\N
Mon ami Batman Tremblay		2025-02-25	0	https://image.tmdb.org/t/p/w500/oTsDdOE6barmJ82ksc3xVvaU7sh.jpg	2025-07-03 09:31:15.429389	2025-07-03 09:31:15.429389	2	105	5	2	t	\N	{Documentary}	0	\N
Hassanpoulia: The Avengers of Cyprus	After ten years of prison, Chasampoulis, protector of the poor and underprivileged, escapes with a single goal. To punish the good friends who betrayed him. Meets with his brothers who are in the branch and the revenge plan comes into effect. A film based on real events.	1975-01-02	90	https://image.tmdb.org/t/p/w500/i5w9TjE5tXHjBImcgaEZ2M9fzzQ.jpg	2025-07-03 09:30:57.94049	2025-08-03 09:54:06.079624	2	100	8	9	f	2025-08-03 09:54:06.079624	{Action,Crime}	0	\N
Batman Ninja vs. Yakuza League	The Batman family has returned to the present to discover that Japan has disappeared, and a giant island - Hinomoto - is now in the sky over Gotham City.  At the top sit the Yakuza, a group of superpowered individuals who reign without honor or humanity and look suspiciously like the Justice League. Now, it’s up to Batman and his allies to save Gotham!	2025-03-17	90	https://image.tmdb.org/t/p/w500/sVVT6GYFErVv0Lcc9NvqCu0iOxO.jpg	2025-07-03 09:31:15.261665	2025-07-03 09:31:15.261665	2	104	6	167	t	\N	{Animation,Action}	0	\N
The Batman	In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.	2022-03-01	177	https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg	2025-07-03 09:31:15.598475	2025-07-03 09:31:15.598475	2	106	7	10999	t	\N	{Crime,Mystery,Thriller}	0	\N
Superman, Spider-Man or Batman	Aron, a 5-year-old boy, sets together with his worried father on a journey at the end of which he wishes, like the superheroes in the comic books, to save his mother suffering from a heart condition.	2011-06-01	11	https://image.tmdb.org/t/p/w500/iUp85s5s7eaPbuCUNqOCeJCEVpY.jpg	2025-07-03 09:31:15.768631	2025-07-03 09:31:15.768631	2	107	6	23	t	\N	{Drama}	0	\N
Batman v Superman: Dawn of Justice	Fearing the actions of a god-like Super Hero left unchecked, Gotham City’s own formidable, forceful vigilante takes on Metropolis’s most revered, modern-day savior, while the world wrestles with what sort of hero it really needs. And with Batman and Superman at war with one another, a new threat quickly arises, putting mankind in greater danger than it’s ever known before.	2016-03-23	152	https://image.tmdb.org/t/p/w500/5UsK3grJvtQrtzEgqNlDljJW96w.jpg	2025-07-03 09:31:15.940917	2025-07-03 09:31:15.940917	2	108	5	18337	t	\N	{Action,Adventure,Fantasy}	0	\N
Alias Batman and Robin	Alyas Batman en Robin is a 1991 Filipino Batman comedy film produced by Regal Films spoofing the 1960s Batman television series. The movie was initially an unauthorized production, set to capitalize on the then in-production 1989 Batman film starring Michael Keaton. Warner Brothers threatened legal action and the release of the film was delayed until legal entanglements could be sorted out. The film was released in 1991, two years later than the intended 1989 release.	1991-04-06	103	https://image.tmdb.org/t/p/w500/m7ysdICz4AMvFTU8wYKz3i69n6P.jpg	2025-07-03 09:31:16.11774	2025-07-03 09:31:16.11774	2	109	5	8	t	\N	{Comedy,Action}	0	\N
Batman Ninja	Batman, along with many of his allies and adversaries, finds himself transported to feudal Japan by Gorilla Grodd's time displacement machine.	2018-06-15	85	https://image.tmdb.org/t/p/w500/5xSB0Npkc9Fd9kahKBsq9P4Cdzp.jpg	2025-07-03 09:31:16.292629	2025-07-03 09:31:16.292629	2	110	5	897	t	\N	{Animation,Action,"Science Fiction"}	0	\N
Candle in the Tomb: The Worm Valley	Adapted from the 3rd volume in the novel series "Candle in the Tomb" by Zhang Mu Ye. Hu Bayi, Wang Kaixuan, and Shiely Yang, infected with a curse, embark on a journey to King Xian's tomb to retrieve the Haochen Bead and break the curse. They face ancient organs, ghostly visions, explosive bugs, and a massive salamander.	2023-09-22	94	https://image.tmdb.org/t/p/w500/7Hk1qxAvZi9H9cfBb4iHkoGjapH.jpg	2025-07-03 09:35:03.507293	2025-07-03 09:35:03.507293	2	129	6	20	t	\N	{Action,Adventure,Horror}	0	\N
A Minecraft Movie	Four misfits find themselves struggling with ordinary problems when they are suddenly pulled through a mysterious portal into the Overworld: a bizarre, cubic wonderland that thrives on imagination. To get back home, they'll have to master this world while embarking on a magical quest with an unexpected, expert crafter, Steve.	2025-03-31	101	https://image.tmdb.org/t/p/w500/yFHHfHcUgGAxziP1C3lLt0q2T4s.jpg	2025-07-03 09:35:03.673225	2025-07-03 09:35:03.673225	2	130	6	1980	t	\N	{Family,Comedy,Adventure,Fantasy}	0	\N
The Amateur	After his life is turned upside down when his wife is killed in a London terrorist attack, a brilliant but introverted CIA decoder takes matters into his own hands when his supervisors refuse to take action.	2025-04-09	123	https://image.tmdb.org/t/p/w500/SNEoUInCa5fAgwuEBMIMBGvkkh.jpg	2025-07-03 09:35:03.839463	2025-07-03 09:35:03.839463	2	131	7	702	t	\N	{Thriller,Action}	0	\N
Squid Game: Fireplace	Come share a toast in the Front Man's lair — but tread carefully, for you’re playing with fire.	2024-12-12	60	https://image.tmdb.org/t/p/w500/cIIMvxLztRs1MbXH0oqaw3SGV0q.jpg	2025-07-03 09:35:04.002203	2025-07-03 09:35:04.002203	2	132	7	136	t	\N	{}	0	\N
Diablo	Ex-con Kris Chaney seizes the daughter of a Colombian gangster to fulfill a noble promise to the young girl's mother. When her father enlists both the criminal underworld and a psychotic killer to exact his revenge, Kris relies on everything he's ever learned to stay alive and keep his word.	2025-06-13	91	https://image.tmdb.org/t/p/w500/uFQduVyYIinJy3eLjozgfl6Xtcn.jpg	2025-07-03 09:35:04.169886	2025-07-03 09:35:04.169886	2	133	7	65	t	\N	{Action,Thriller}	0	\N
The Lord of the Rings: The Return of the King	As armies mass for a final battle that will decide the fate of the world--and powerful, ancient forces of Light and Dark compete to determine the outcome--one member of the Fellowship of the Ring is revealed as the noble heir to the throne of the Kings of Men. Yet, the sole hope for triumph over evil lies with a brave hobbit, Frodo, who, accompanied by his loyal friend Sam and the hideous, wretched Gollum, ventures deep into the very dark heart of Mordor on his seemingly impossible quest to destroy the Ring of Power.​	2003-12-17	201	https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg	2025-07-03 09:36:03.981213	2025-07-03 09:36:03.981213	2	146	8	25204	t	\N	{Adventure,Fantasy,Action}	0	\N
Forrest Gump	A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him.	1994-06-23	142	https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg	2025-07-03 09:36:04.317143	2025-07-03 09:36:04.317143	2	148	8	28340	t	\N	{Comedy,Drama,Romance}	0	\N
Seven Samurai	A samurai answers a village's request for protection after he falls on hard times. The town needs protection from bandits, so the samurai gathers six others to help him teach the people how to defend themselves, and the villagers provide the soldiers with food.	1954-04-26	207	https://image.tmdb.org/t/p/w500/8OKmBV5BUFzmozIC3pPWKHy17kx.jpg	2025-07-03 09:36:05.030379	2025-07-03 09:36:05.030379	2	152	8	3921	t	\N	{Action,Drama}	0	\N
Grave of the Fireflies	In the final months of World War II, 14-year-old Seita and his sister Setsuko are orphaned when their mother is killed during an air raid in Kobe, Japan. After a falling out with their aunt, they move into an abandoned bomb shelter. With no surviving relatives and their emergency rations depleted, Seita and Setsuko struggle to survive.	1988-04-16	89	https://image.tmdb.org/t/p/w500/k9tv1rXZbOhH7eiCk378x61kNQ1.jpg	2025-07-03 09:36:05.235535	2025-07-03 09:36:05.235535	2	153	8	5942	t	\N	{Animation,Drama,War}	0	\N
\.


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ratings (rating, created_at, updated_at, user_id, movie_id, id) FROM stdin;
4.0	2025-07-11 04:11:46.513302	2025-07-13 16:26:32.909154	4	65	14
4.0	2025-07-13 22:39:30.703732	2025-07-13 22:39:30.703732	3	86	16
5.0	2025-08-07 21:59:08.371307	2025-08-07 21:59:08.371307	3	135	17
4.0	2025-07-11 02:46:33.588063	2025-07-11 04:01:33.821142	4	111	11
4.0	2025-07-11 04:09:00.918212	2025-07-11 04:09:00.918212	4	81	12
4.0	2025-07-11 04:09:59.713781	2025-07-11 04:09:59.713781	4	71	13
5.0	2025-07-11 04:12:24.756865	2025-07-11 04:53:59.498504	4	86	15
\.


--
-- Data for Name: trends; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trends (id, search_term, count, poster_url, movie_id, "movieId") FROM stdin;
1	avngers	1	https://image.tmdb.org/t/p/w500/DGCsKaQgcp4QkX7ulL1BMbkIkr.jpg	71	\N
2	dark	3	https://image.tmdb.org/t/p/w500/DGCsKaQgcp4QkX7ulL1BMbkIkr.jpg	71	\N
6	end game	2	https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg	86	\N
10	game	6	https://image.tmdb.org/t/p/w500/yQGaui0bQ5Ai3KIFBB45nTeIqad.jpg	124	\N
11	endgame	2	https://image.tmdb.org/t/p/w500/yQGaui0bQ5Ai3KIFBB45nTeIqad.jpg	124	\N
12	godfather	13	https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg	86	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (email, password, first_name, last_name, role, created_at, updated_at, "isEmailVerified", "verificationToken", id, "resetPasswordToken", "deletedAt") FROM stdin;
Yasser@example.com	$2b$12$ccrpAO9wKKlyn0TurgR0pO8dQ5zbEj8Uy/Ywry1GaGuYiZPFu2Ri.	Yasser	Abdalla	admin	2025-06-12 04:15:07.296951	2025-06-17 09:44:05.631997	t	\N	2	e15570fc9cb6bccc974c5b3311ccd584f5460b8eeb3645f9a09949e145c3d1c9	\N
test@example.com	$2b$12$7mESrApcTrDPp3RJA/Dwg.JVIarTTcsiZ64cqWEkwlTq3XJyH2DNe	Yasser	Abdalla	user	2025-06-12 04:04:00.317292	2025-06-25 21:27:50.91357	f	\N	1	\N	2025-06-25 21:27:50.91357
hamza@example.com	$2b$12$aeJOieoletIljlQaoNsLkuob90h746FUPpY.Z6TjHzP10LiFuzZPu	Hamza	Mohamed	author	2025-06-14 05:47:03.536449	2025-06-25 21:36:59.04991	t	[null]	11	b02cb9cf2c17aa503a3c9d5c6b8eacd80063317b27d27e40d8ffe83c52183b5f	\N
omar@example.com	$2b$12$dvmCLB9ErU1wubF.pxYsFu.Kxmda0k4mQ1YWeR/xAUnaD5Yg1bIJC	Omar	Abdalla	user	2025-06-12 04:18:54.645275	2025-06-26 09:10:32.714287	t	\N	4	\N	\N
hoda@gmail.com	$2b$12$9nofstnYOINTjkWwgCxHbOr5JvSa1fEl6Enivkz1P3KAPyzw1L.Qq	Hoda	Hesham	admin	2025-07-10 04:49:27.660542	2025-07-14 21:26:15.198506	f	460e5f8a34748b3a9db9148e36d025358d0be8fe348caa35e5a5221abded905e	14	\N	\N
Ahmed@example.com	$2b$12$zGW749isIB2h2vO9zSQ8yOnzsYla8N.BWgiipSssCk9F/ZhQxdHfS	Ahmed	Abdalla	user	2025-06-12 04:17:11.369129	2025-07-19 17:51:38.29894	t	\N	3	\N	\N
mostafa@gmail.com	$2b$12$6qHo6aNfdT6YhRiOIiTxdu2VYMouOR95NKKQSN6MUSLfJD.XGLOT.	Mostafa	Mohamed	user	2025-07-10 02:31:06.586193	2025-08-03 13:47:57.57518	f	c5a536ecf8360eafd61afe5ecff7253ef952c9741374905247a2c7b14c52e24a	13	\N	\N
\.


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 53, true);


--
-- Name: movies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movies_id_seq', 155, true);


--
-- Name: ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ratings_id_seq', 49, true);


--
-- Name: trends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trends_id_seq', 12, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 14, true);


--
-- Name: ratings PK_0f31425b073219379545ad68ed9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT "PK_0f31425b073219379545ad68ed9" PRIMARY KEY (id);


--
-- Name: trends PK_4de18eea43d948e5ea66520e0e8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trends
    ADD CONSTRAINT "PK_4de18eea43d948e5ea66520e0e8" PRIMARY KEY (id);


--
-- Name: comments PK_8bf68bc960f2b69e818bdb90dcb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: movies PK_c5b2c134e871bfd1c2fe7cc3705; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY (id);


--
-- Name: ratings UQ_969fcc2afb64c8a81f487f60afa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT "UQ_969fcc2afb64c8a81f487f60afa" UNIQUE (user_id, movie_id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: IDX_3017cd279543b16a2ecd8ec9db; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3017cd279543b16a2ecd8ec9db" ON public.trends USING btree (search_term);


--
-- Name: IDX_45c7bafa4e537191add4eeed5b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_45c7bafa4e537191add4eeed5b" ON public.ratings USING btree (movie_id);


--
-- Name: IDX_4c675567d2a58f0b07cef09c13; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_4c675567d2a58f0b07cef09c13" ON public.comments USING btree (user_id);


--
-- Name: IDX_4c6fb7e379313af2b445a29f8c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_4c6fb7e379313af2b445a29f8c" ON public.movies USING btree (rating_avg);


--
-- Name: IDX_5aa0bbd146c0082d3fc5a0ad5d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_5aa0bbd146c0082d3fc5a0ad5d" ON public.movies USING btree (title);


--
-- Name: IDX_6146d39292211165aab15a622d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6146d39292211165aab15a622d" ON public.comments USING btree (movie_id);


--
-- Name: IDX_7e6e9f5fdaf2ae02c11fbb72d0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7e6e9f5fdaf2ae02c11fbb72d0" ON public.movies USING btree (author_id);


--
-- Name: IDX_8e7c9a36c0ac867b543c6509aa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_8e7c9a36c0ac867b543c6509aa" ON public.comments USING btree (created_at);


--
-- Name: IDX_ba994db411f25b7c6a17771681; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_ba994db411f25b7c6a17771681" ON public.movies USING btree (genre);


--
-- Name: IDX_e2950f3dd6b31ec76bcad3b679; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e2950f3dd6b31ec76bcad3b679" ON public.ratings USING btree (rating);


--
-- Name: IDX_e41916f63afa790be81b9c55bf; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e41916f63afa790be81b9c55bf" ON public.movies USING btree (release_date);


--
-- Name: IDX_f49ef8d0914a14decddbb170f2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_f49ef8d0914a14decddbb170f2" ON public.ratings USING btree (user_id);


--
-- Name: ratings FK_45c7bafa4e537191add4eeed5b3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT "FK_45c7bafa4e537191add4eeed5b3" FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: comments FK_4c675567d2a58f0b07cef09c13d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: comments FK_6146d39292211165aab15a622d1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "FK_6146d39292211165aab15a622d1" FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: trends FK_64b3592076e5a7b1790ce5a7662; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trends
    ADD CONSTRAINT "FK_64b3592076e5a7b1790ce5a7662" FOREIGN KEY ("movieId") REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: movies FK_7e6e9f5fdaf2ae02c11fbb72d09; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT "FK_7e6e9f5fdaf2ae02c11fbb72d09" FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: ratings FK_f49ef8d0914a14decddbb170f2f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT "FK_f49ef8d0914a14decddbb170f2f" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

