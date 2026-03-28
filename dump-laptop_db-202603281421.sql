--
-- PostgreSQL database dump
--

-- Dumped from database version 15.17
-- Dumped by pg_dump version 17.0

-- Started on 2026-03-28 14:21:51

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
-- TOC entry 2 (class 3079 OID 16389)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3683 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 255 (class 1255 OID 33075)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 32803)
-- Name: brands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brands (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    slug character varying(50) NOT NULL,
    logo_url character varying(500),
    is_active boolean DEFAULT true NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 32802)
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3684 (class 0 OID 0)
-- Dependencies: 219
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- TOC entry 234 (class 1259 OID 32937)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT cart_items_quantity_check CHECK (((quantity >= 1) AND (quantity <= 10)))
);


--
-- TOC entry 233 (class 1259 OID 32936)
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cart_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3685 (class 0 OID 0)
-- Dependencies: 233
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- TOC entry 218 (class 1259 OID 32789)
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    slug character varying(50) NOT NULL,
    icon character varying(50),
    description character varying(255),
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 217 (class 1259 OID 32788)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3686 (class 0 OID 0)
-- Dependencies: 217
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 232 (class 1259 OID 32915)
-- Name: flash_sale_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flash_sale_items (
    id bigint NOT NULL,
    flash_sale_id integer NOT NULL,
    product_id bigint NOT NULL,
    sale_price bigint NOT NULL,
    stock_limit integer,
    sold_count integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 231 (class 1259 OID 32914)
-- Name: flash_sale_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.flash_sale_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3687 (class 0 OID 0)
-- Dependencies: 231
-- Name: flash_sale_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.flash_sale_items_id_seq OWNED BY public.flash_sale_items.id;


--
-- TOC entry 230 (class 1259 OID 32905)
-- Name: flash_sales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flash_sales (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT flash_sales_check CHECK ((end_time > start_time))
);


--
-- TOC entry 229 (class 1259 OID 32904)
-- Name: flash_sales_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.flash_sales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3688 (class 0 OID 0)
-- Dependencies: 229
-- Name: flash_sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.flash_sales_id_seq OWNED BY public.flash_sales.id;


--
-- TOC entry 240 (class 1259 OID 33010)
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id bigint NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    product_name character varying(200) NOT NULL,
    product_image character varying(500) NOT NULL,
    price bigint NOT NULL,
    original_price bigint NOT NULL,
    quantity integer NOT NULL,
    subtotal bigint NOT NULL,
    CONSTRAINT order_items_quantity_check CHECK (((quantity >= 1) AND (quantity <= 10)))
);


--
-- TOC entry 239 (class 1259 OID 33009)
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3689 (class 0 OID 0)
-- Dependencies: 239
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- TOC entry 238 (class 1259 OID 32978)
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    order_code character varying(20) NOT NULL,
    user_id bigint NOT NULL,
    shipping_address_id bigint NOT NULL,
    subtotal bigint NOT NULL,
    shipping_fee bigint DEFAULT 0 NOT NULL,
    total bigint NOT NULL,
    payment_method character varying(10) NOT NULL,
    payment_status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    order_status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    ship_full_name character varying(100),
    ship_phone character varying(15),
    ship_email character varying(255),
    ship_province character varying(50),
    ship_district character varying(50),
    ship_address character varying(255),
    CONSTRAINT orders_order_status_check CHECK (((order_status)::text = ANY ((ARRAY['PENDING'::character varying, 'CONFIRMED'::character varying, 'PROCESSING'::character varying, 'SHIPPING'::character varying, 'DELIVERED'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying, 'RETURNED'::character varying])::text[]))),
    CONSTRAINT orders_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['cod'::character varying, 'vnpay'::character varying])::text[]))),
    CONSTRAINT orders_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['PENDING'::character varying, 'PAID'::character varying, 'FAILED'::character varying, 'REFUNDED'::character varying])::text[])))
);


--
-- TOC entry 237 (class 1259 OID 32977)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3690 (class 0 OID 0)
-- Dependencies: 237
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 228 (class 1259 OID 32890)
-- Name: product_gifts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_gifts (
    id bigint NOT NULL,
    product_id bigint NOT NULL,
    description character varying(255) NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


--
-- TOC entry 227 (class 1259 OID 32889)
-- Name: product_gifts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_gifts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3691 (class 0 OID 0)
-- Dependencies: 227
-- Name: product_gifts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_gifts_id_seq OWNED BY public.product_gifts.id;


--
-- TOC entry 224 (class 1259 OID 32859)
-- Name: product_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_images (
    id bigint NOT NULL,
    product_id bigint NOT NULL,
    image_url character varying(500) NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    is_primary boolean DEFAULT false NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 32858)
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3692 (class 0 OID 0)
-- Dependencies: 223
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- TOC entry 226 (class 1259 OID 32876)
-- Name: product_specs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_specs (
    id bigint NOT NULL,
    product_id bigint NOT NULL,
    label character varying(50) NOT NULL,
    value character varying(255) NOT NULL,
    display_order integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 32875)
-- Name: product_specs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_specs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3693 (class 0 OID 0)
-- Dependencies: 225
-- Name: product_specs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_specs_id_seq OWNED BY public.product_specs.id;


--
-- TOC entry 222 (class 1259 OID 32817)
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    name character varying(200) NOT NULL,
    slug character varying(200) NOT NULL,
    brand_id integer NOT NULL,
    category_id integer NOT NULL,
    price bigint NOT NULL,
    original_price bigint NOT NULL,
    image character varying(500) NOT NULL,
    rating numeric(2,1) DEFAULT 0 NOT NULL,
    review_count integer DEFAULT 0 NOT NULL,
    sold_count integer DEFAULT 0 NOT NULL,
    badge character varying(10),
    specs jsonb DEFAULT '{}'::jsonb NOT NULL,
    description text,
    stock_quantity integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT products_badge_check CHECK (((badge)::text = ANY ((ARRAY['Hot'::character varying, 'New'::character varying, 'Sale'::character varying])::text[]))),
    CONSTRAINT products_check CHECK ((original_price >= price)),
    CONSTRAINT products_price_check CHECK ((price > 0)),
    CONSTRAINT products_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric))),
    CONSTRAINT products_stock_quantity_check CHECK ((stock_quantity >= 0))
);


--
-- TOC entry 221 (class 1259 OID 32816)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3694 (class 0 OID 0)
-- Dependencies: 221
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 244 (class 1259 OID 33060)
-- Name: review_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_images (
    id bigint NOT NULL,
    review_id bigint NOT NULL,
    image_url character varying(500) NOT NULL,
    display_order integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 243 (class 1259 OID 33059)
-- Name: review_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.review_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3695 (class 0 OID 0)
-- Dependencies: 243
-- Name: review_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.review_images_id_seq OWNED BY public.review_images.id;


--
-- TOC entry 242 (class 1259 OID 33031)
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id bigint NOT NULL,
    product_id bigint NOT NULL,
    user_id bigint NOT NULL,
    rating integer NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    helpful_count integer DEFAULT 0 NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- TOC entry 241 (class 1259 OID 33030)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3696 (class 0 OID 0)
-- Dependencies: 241
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 236 (class 1259 OID 32960)
-- Name: shipping_addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_addresses (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    full_name character varying(100) NOT NULL,
    phone character varying(15) NOT NULL,
    email character varying(255),
    province character varying(50) NOT NULL,
    district character varying(50) NOT NULL,
    address character varying(255) NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT shipping_addresses_address_check CHECK ((length((address)::text) >= 10))
);


--
-- TOC entry 235 (class 1259 OID 32959)
-- Name: shipping_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shipping_addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3697 (class 0 OID 0)
-- Dependencies: 235
-- Name: shipping_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shipping_addresses_id_seq OWNED BY public.shipping_addresses.id;


--
-- TOC entry 216 (class 1259 OID 32770)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(100) NOT NULL,
    phone character varying(15),
    avatar_url character varying(500),
    role character varying(20) DEFAULT 'CUSTOMER'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 215 (class 1259 OID 32769)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3698 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3351 (class 2604 OID 32806)
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- TOC entry 3375 (class 2604 OID 32940)
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- TOC entry 3347 (class 2604 OID 32792)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 3373 (class 2604 OID 32918)
-- Name: flash_sale_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flash_sale_items ALTER COLUMN id SET DEFAULT nextval('public.flash_sale_items_id_seq'::regclass);


--
-- TOC entry 3370 (class 2604 OID 32908)
-- Name: flash_sales id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flash_sales ALTER COLUMN id SET DEFAULT nextval('public.flash_sales_id_seq'::regclass);


--
-- TOC entry 3387 (class 2604 OID 33013)
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- TOC entry 3381 (class 2604 OID 32981)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 3367 (class 2604 OID 32893)
-- Name: product_gifts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_gifts ALTER COLUMN id SET DEFAULT nextval('public.product_gifts_id_seq'::regclass);


--
-- TOC entry 3362 (class 2604 OID 32862)
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- TOC entry 3365 (class 2604 OID 32879)
-- Name: product_specs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_specs ALTER COLUMN id SET DEFAULT nextval('public.product_specs_id_seq'::regclass);


--
-- TOC entry 3353 (class 2604 OID 32820)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 3393 (class 2604 OID 33063)
-- Name: review_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_images ALTER COLUMN id SET DEFAULT nextval('public.review_images_id_seq'::regclass);


--
-- TOC entry 3388 (class 2604 OID 33034)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 3378 (class 2604 OID 32963)
-- Name: shipping_addresses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_addresses ALTER COLUMN id SET DEFAULT nextval('public.shipping_addresses_id_seq'::regclass);


--
-- TOC entry 3342 (class 2604 OID 32773)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3653 (class 0 OID 32803)
-- Dependencies: 220
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brands (id, name, slug, logo_url, is_active) FROM stdin;
1	Acer	acer	\N	t
2	Apple	apple	\N	t
3	ASUS	asus	\N	t
4	Dell	dell	\N	t
5	HP	hp	\N	t
6	Lenovo	lenovo	\N	t
7	MSI	msi	\N	t
8	Razer	razer	\N	t
\.


--
-- TOC entry 3667 (class 0 OID 32937)
-- Dependencies: 234
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (id, user_id, product_id, quantity, created_at, updated_at) FROM stdin;
1	115	1	1	2026-03-14 03:09:26.252793+00	2026-03-14 03:09:26.252793+00
4	121	1	3	2026-03-14 03:09:26.971147+00	2026-03-14 03:09:26.999494+00
5	125	1	2	2026-03-14 03:09:27.364426+00	2026-03-14 03:09:27.389392+00
\.


--
-- TOC entry 3651 (class 0 OID 32789)
-- Dependencies: 218
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, slug, icon, description, display_order, is_active, created_at) FROM stdin;
1	Gaming	gaming	Gamepad2	Laptop gaming hiệu năng cao	1	t	2026-03-12 12:36:27.245497+00
2	Văn phòng	van-phong	Briefcase	Laptop văn phòng cao cấp	2	t	2026-03-12 12:36:27.245497+00
3	Apple	apple	Laptop	MacBook chính hãng	3	t	2026-03-12 12:36:27.245497+00
\.


--
-- TOC entry 3665 (class 0 OID 32915)
-- Dependencies: 232
-- Data for Name: flash_sale_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.flash_sale_items (id, flash_sale_id, product_id, sale_price, stock_limit, sold_count) FROM stdin;
1	1	1	42990000	50	12
2	1	2	89990000	30	8
3	1	3	119990000	15	3
4	1	4	45990000	40	15
5	1	9	34990000	55	20
\.


--
-- TOC entry 3663 (class 0 OID 32905)
-- Dependencies: 230
-- Data for Name: flash_sales; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.flash_sales (id, title, start_time, end_time, is_active, created_at) FROM stdin;
1	Flash Sale Cuối Tuần	2026-03-12 12:37:25.523281+00	2026-03-12 20:37:25.523281+00	t	2026-03-12 12:37:25.523281+00
\.


--
-- TOC entry 3673 (class 0 OID 33010)
-- Dependencies: 240
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, product_name, product_image, price, original_price, quantity, subtotal) FROM stdin;
1	1	1	ASUS ROG Strix G16 2024	https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop	42990000	49990000	1	42990000
2	2	10	MacBook Pro 14 M3 Pro	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop	54990000	59990000	3	164970000
3	3	2	MacBook Pro 16 M3 Max	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop	89990000	96990000	1	89990000
4	4	16	MacBook Air 13 M3	https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop	27990000	29990000	1	27990000
5	5	5	Lenovo ThinkPad X1 Carbon Gen 12	https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop	38990000	42990000	1	38990000
6	5	6	MacBook Air 15 M3	https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop	37990000	39990000	1	37990000
7	6	10	MacBook Pro 14 M3 Pro	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop	54990000	59990000	1	54990000
8	7	13	Dell Inspiron 16 Plus	https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=600&fit=crop	24990000	27990000	1	24990000
9	8	16	MacBook Air 13 M3	https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop	27990000	29990000	1	27990000
\.


--
-- TOC entry 3671 (class 0 OID 32978)
-- Dependencies: 238
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, order_code, user_id, shipping_address_id, subtotal, shipping_fee, total, payment_method, payment_status, order_status, note, created_at, updated_at, ship_full_name, ship_phone, ship_email, ship_province, ship_district, ship_address) FROM stdin;
5	ORD-6348730C	186	9	76980000	0	76980000	vnpay	PENDING	CANCELLED		2026-03-17 15:16:07.423599+00	2026-03-17 15:37:30.152232+00	\N	\N	\N	\N	\N	\N
4	ORD-A9B785EC	186	11	27990000	0	27990000	vnpay	PENDING	CANCELLED	so 123	2026-03-17 15:04:09.365224+00	2026-03-17 15:37:44.485198+00	\N	\N	\N	\N	\N	\N
3	ORD-8CEAEEC9	186	9	89990000	0	89990000	cod	PENDING	CANCELLED	Số 11	2026-03-17 14:09:58.524384+00	2026-03-17 15:37:47.657662+00	\N	\N	\N	\N	\N	\N
2	ORD-F77DBE8D	186	8	164970000	0	164970000	cod	PENDING	CANCELLED		2026-03-14 04:00:55.241584+00	2026-03-17 15:37:52.226633+00	\N	\N	\N	\N	\N	\N
1	ORD-AA08956D	169	7	42990000	0	42990000	cod	PENDING	CONFIRMED	Please deliver ASAP	2026-03-14 03:09:31.64392+00	2026-03-17 16:20:51.384202+00	\N	\N	\N	\N	\N	\N
6	ORD-0C40A5C5	187	12	54990000	0	54990000	cod	PAID	COMPLETED		2026-03-18 07:18:33.003869+00	2026-03-18 07:19:45.639683+00	\N	\N	\N	\N	\N	\N
7	ORD-3A6C9EF3	187	13	24990000	0	24990000	cod	PENDING	PENDING		2026-03-18 10:10:16.349706+00	2026-03-18 10:10:16.350276+00	\N	\N	\N	\N	\N	\N
8	ORD-27152EF1	187	13	27990000	0	27990000	cod	PENDING	PENDING		2026-03-18 10:28:20.87172+00	2026-03-18 10:28:20.87172+00	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 3661 (class 0 OID 32890)
-- Dependencies: 228
-- Data for Name: product_gifts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_gifts (id, product_id, description, display_order, is_active) FROM stdin;
1	1	Chuột gaming ASUS ROG Chakram X Origin trị giá 3.990.000đ	1	t
2	1	Tai nghe ROG Delta S Core trị giá 1.990.000đ	2	t
3	1	Balo ROG Ranger BP2702 trị giá 1.290.000đ	3	t
4	1	Bảo hành VIP 1 đổi 1 trong 12 tháng đầu	4	t
5	2	AppleCare+ 2 năm trị giá 4.990.000đ	1	t
6	2	Magic Mouse trị giá 2.290.000đ	2	t
7	2	Balo đựng laptop premium trị giá 1.490.000đ	3	t
8	3	Chuột MSI Clutch GM41 Lightweight trị giá 1.590.000đ	1	t
9	3	Tai nghe MSI Immerse GH50 trị giá 1.890.000đ	2	t
10	3	Bảo hành VIP 2 năm tại nhà	3	t
11	4	Dell Premier Wireless Mouse trị giá 1.290.000đ	1	t
12	4	Túi đựng laptop Dell Premier Sleeve 16" trị giá 890.000đ	2	t
13	4	Bảo hành ProSupport 3 năm tại nhà	3	t
14	5	Lenovo Go USB-C Laptop Power Bank 20000mAh trị giá 1.890.000đ	1	t
15	5	Chuột Lenovo Go Wireless Multi-Device trị giá 790.000đ	2	t
16	5	Bảo hành Premier 3 năm tại nhà	3	t
17	6	Magic Mouse trị giá 2.290.000đ	1	t
18	6	Bảo hành AppleCare 1 năm tại nhà	2	t
19	7	Razer DeathAdder V3 Mouse trị giá 1.990.000đ	1	t
20	7	Túi đựng Razer Concourse Pro 16 trị giá 1.190.000đ	2	t
21	8	Bút HP ISPO Rechargeable MPP 2.0 trị giá 1.390.000đ	1	t
22	8	Bảo hành HP Care Pack 3 năm	2	t
23	9	Chuột gaming Acer Predator Cestus 335 trị giá 990.000đ	1	t
24	9	Bảo hành Acer Care 2 năm	2	t
25	10	Bảo hành AppleCare 1 năm tại nhà	1	t
26	10	Túi đựng laptop cao cấp trị giá 790.000đ	2	t
27	11	Túi đựng ASUS ZenBook Sleeve trị giá 590.000đ	1	t
28	12	Chuột MSI M98 trị giá 890.000đ	1	t
29	12	Bảo hành MSI Service 2 năm	2	t
30	13	Chuột Dell MS3320W Wireless trị giá 490.000đ	1	t
31	14	Chuột Lenovo Legion M600 RGB trị giá 890.000đ	1	t
32	14	Bảo hành Legion 2 năm	2	t
33	15	HP Care Pack 2 năm tại nhà	1	t
34	16	Bảo hành Apple 1 năm	1	t
35	17	Chuột ROG Keris II Ace trị giá 1.590.000đ	1	t
36	17	Tai nghe ROG Cetra II Core trị giá 990.000đ	2	t
37	18	Bảo hành Acer 2 năm tại nhà	1	t
\.


--
-- TOC entry 3657 (class 0 OID 32859)
-- Dependencies: 224
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_images (id, product_id, image_url, display_order, is_primary) FROM stdin;
1	1	https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop	0	t
2	1	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop	1	f
3	1	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop	2	f
4	1	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop	3	f
5	1	https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&h=600&fit=crop	4	f
6	2	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop	0	t
7	2	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop	1	f
8	2	https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop	2	f
9	2	https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop	3	f
10	2	https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop	4	f
11	3	https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=600&fit=crop	0	t
12	3	https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop	1	f
13	3	https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&h=600&fit=crop	2	f
14	3	https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=800&h=600&fit=crop	3	f
15	3	https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&h=600&fit=crop	4	f
16	4	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop	0	t
17	4	https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop	1	f
18	4	https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop	2	f
19	4	https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop	3	f
20	4	https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop	4	f
21	5	https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop	0	t
22	5	https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop	1	f
23	5	https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop	2	f
24	5	https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=600&fit=crop	3	f
25	5	https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop	4	f
26	6	https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop	0	t
27	6	https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop	1	f
28	6	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop	2	f
29	6	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop	3	f
30	6	https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop	4	f
31	7	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop	0	t
32	7	https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop	1	f
33	7	https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=800&h=600&fit=crop	2	f
34	7	https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=600&fit=crop	3	f
35	7	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop	4	f
36	8	https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=600&fit=crop	0	t
37	8	https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop	1	f
38	8	https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop	2	f
39	8	https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop	3	f
40	8	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop	4	f
41	9	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop	0	t
42	9	https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop	1	f
43	9	https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=600&fit=crop	2	f
44	9	https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&h=600&fit=crop	3	f
45	9	https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&h=600&fit=crop	4	f
46	10	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop	0	t
47	10	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop	1	f
48	10	https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop	2	f
49	10	https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop	3	f
50	10	https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop	4	f
51	11	https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop	0	t
52	11	https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop	1	f
53	11	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop	2	f
54	11	https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop	3	f
55	11	https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop	4	f
56	12	https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&h=600&fit=crop	0	t
57	12	https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=600&fit=crop	1	f
58	12	https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop	2	f
59	12	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop	3	f
60	12	https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&h=600&fit=crop	4	f
61	13	https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=600&fit=crop	0	t
62	13	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop	1	f
63	13	https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop	2	f
64	13	https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop	3	f
65	13	https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop	4	f
66	14	https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&h=600&fit=crop	0	t
67	14	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop	1	f
68	14	https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop	2	f
69	14	https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=600&fit=crop	3	f
70	14	https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=800&h=600&fit=crop	4	f
71	15	https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop	0	t
72	15	https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=600&fit=crop	1	f
73	15	https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop	2	f
74	15	https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop	3	f
75	15	https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop	4	f
76	16	https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop	0	t
77	16	https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop	1	f
78	16	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop	2	f
79	16	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop	3	f
80	16	https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop	4	f
81	17	https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=800&h=600&fit=crop	0	t
82	17	https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop	1	f
83	17	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop	2	f
84	17	https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&h=600&fit=crop	3	f
85	17	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop	4	f
86	18	https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop	0	t
87	18	https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop	1	f
88	18	https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop	2	f
89	18	https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop	3	f
90	18	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop	4	f
\.


--
-- TOC entry 3659 (class 0 OID 32876)
-- Dependencies: 226
-- Data for Name: product_specs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_specs (id, product_id, label, value, display_order) FROM stdin;
1	1	CPU	Intel Core i9-14900HX (24 nhân, 5.8GHz Boost)	1
2	1	GPU	NVIDIA GeForce RTX 4080 12GB GDDR6	2
3	1	RAM	32GB DDR5-5600MHz (2x16GB, tối đa 64GB)	3
4	1	Ổ cứng	1TB PCIe 4.0 NVMe SSD	4
5	1	Màn hình	16" QHD+ (2560x1600) 240Hz, IPS, 3ms, 100% DCI-P3	5
6	1	Pin	90Wh | Sạc 240W	6
7	1	Hệ điều hành	Windows 11 Home	7
8	1	Trọng lượng	2.5 kg	8
9	1	Kết nối	Wi-Fi 6E, Bluetooth 5.3	9
10	1	Cổng	2x USB-C Thunderbolt 4, 3x USB-A 3.2, HDMI 2.1, SD Card	10
11	1	Kích thước	355 x 259 x 27.2 mm	11
12	1	Bàn phím	RGB Per-key, chống nước IPX4	12
13	2	Chip	Apple M3 Max (16 nhân CPU, 40 nhân GPU)	1
14	2	RAM	48GB Unified Memory	2
15	2	Ổ cứng	1TB SSD	3
16	2	Màn hình	16.2" Liquid Retina XDR, ProMotion 120Hz, 3456x2234, 1000 nits	4
17	2	Pin	100Wh | Sạc MagSafe 140W	5
18	2	Hệ điều hành	macOS Sonoma	6
19	2	Trọng lượng	2.15 kg	7
20	2	Kết nối	Wi-Fi 6E, Bluetooth 5.3	8
21	2	Cổng	3x Thunderbolt 4, HDMI 2.1, SD Card, MagSafe 3	9
22	2	Camera	12MP Center Stage	10
23	2	Kích thước	355.7 x 248.1 x 16.8 mm	11
24	3	CPU	Intel Core i9-14900HX (24 nhân, 5.8GHz Boost)	1
25	3	GPU	NVIDIA GeForce RTX 4090 16GB GDDR6	2
26	3	RAM	64GB DDR5-5600MHz (4x16GB, tối đa 128GB)	3
27	3	Ổ cứng	2TB PCIe 4.0 NVMe SSD (RAID 0)	4
28	3	Màn hình	18" UHD+ (3840x2400) 120Hz Mini LED, 1000 nits HDR	5
29	3	Pin	99.9Wh | Sạc 330W	6
30	3	Hệ điều hành	Windows 11 Pro	7
31	3	Trọng lượng	3.3 kg	8
32	3	Kết nối	Wi-Fi 6E, Bluetooth 5.3, 2.5G LAN	9
33	3	Cổng	2x Thunderbolt 4, 4x USB-A 3.2, HDMI 2.1, SD Card, RJ45	10
34	4	CPU	Intel Core Ultra 9 185H (16 nhân, 5.1GHz Boost)	1
35	4	GPU	NVIDIA GeForce RTX 4060 8GB GDDR6	2
36	4	RAM	32GB LPDDR5x-6400MHz (hàn chìm)	3
37	4	Ổ cứng	1TB PCIe 4.0 NVMe SSD	4
38	4	Màn hình	16" OLED InfinityEdge Touch 3.8K (3840x2400), 120Hz, 400 nits, 100% DCI-P3	5
39	4	Pin	86Wh | Sạc USB-C 130W	6
40	4	Hệ điều hành	Windows 11 Home	7
41	4	Trọng lượng	1.89 kg	8
42	4	Kết nối	Wi-Fi 6E, Bluetooth 5.3	9
43	4	Cổng	2x Thunderbolt 4, 1x USB-C 3.2, SD Card	10
44	4	Kích thước	354.4 x 230.6 x 17.5 mm	11
45	5	CPU	Intel Core Ultra 7 155H (22 nhân, 4.8GHz Boost)	1
46	5	GPU	Intel Arc Graphics (tích hợp)	2
47	5	RAM	32GB LPDDR5x-7467MHz (hàn chìm)	3
48	5	Ổ cứng	512GB PCIe 4.0 NVMe SSD	4
49	5	Màn hình	14" 2.8K (2880x1800) OLED, 90Hz, 400 nits, 100% DCI-P3	5
50	5	Pin	57Wh | Sạc USB-C 65W	6
51	5	Hệ điều hành	Windows 11 Pro	7
52	5	Trọng lượng	1.12 kg	8
53	5	Kết nối	Wi-Fi 6E, Bluetooth 5.3, 4G LTE (tùy chọn)	9
54	5	Cổng	2x Thunderbolt 4, 2x USB-A 3.2, HDMI 2.0, SD Card	10
55	5	Bảo mật	Vân tay, nhận diện khuôn mặt IR, TPM 2.0	11
56	6	Chip	Apple M3 (8 nhân CPU, 10 nhân GPU)	1
57	6	RAM	24GB Unified Memory	2
58	6	Ổ cứng	512GB SSD	3
59	6	Màn hình	15.3" Liquid Retina, 2880x1864, 224ppi, 500 nits	4
60	6	Pin	66.5Wh, lên đến 18 giờ | Sạc MagSafe 35W	5
61	6	Hệ điều hành	macOS Sonoma	6
62	6	Trọng lượng	1.51 kg	7
63	6	Kết nối	Wi-Fi 6E, Bluetooth 5.3	8
64	6	Cổng	2x Thunderbolt 3, MagSafe 3, jack 3.5mm	9
65	6	Camera	12MP Center Stage	10
66	6	Màu sắc	Midnight, Starlight, Space Gray, Silver	11
67	7	CPU	Intel Core i9-14900HX (24 nhân, 5.8GHz Boost)	1
68	7	GPU	NVIDIA GeForce RTX 4090 16GB GDDR6	2
69	7	RAM	32GB DDR5-5600MHz	3
70	7	Ổ cứng	1TB PCIe 4.0 NVMe SSD	4
71	7	Màn hình	16" UHD+ OLED (3840x2400) 120Hz, 0.1ms, 100% DCI-P3	5
72	7	Pin	95.2Wh | Sạc 330W	6
73	7	Hệ điều hành	Windows 11 Home	7
74	7	Trọng lượng	2.14 kg	8
75	7	Thân máy	CNC nhôm nguyên khối màu đen	9
76	8	CPU	Intel Core Ultra 7 155H (22 nhân, 4.8GHz Boost)	1
77	8	GPU	Intel Arc Graphics	2
78	8	RAM	32GB LPDDR5x	3
79	8	Ổ cứng	1TB PCIe 4.0 NVMe SSD	4
80	8	Màn hình	16" 3K (2880x1800) OLED Touch, 120Hz, 400 nits, 100% DCI-P3	5
81	8	Pin	83Wh | Sạc USB-C 140W	6
82	8	Hệ điều hành	Windows 11 Home	7
83	8	Trọng lượng	2.0 kg	8
84	8	Xoay	360 độ, hỗ trợ bút HP ISPO 2048 cấp áp lực	9
85	9	CPU	Intel Core i7-14700HX (20 nhân, 5.5GHz Boost)	1
86	9	GPU	NVIDIA GeForce RTX 4070 8GB GDDR6	2
87	9	RAM	16GB DDR5-5600MHz (tối đa 32GB)	3
88	9	Ổ cứng	1TB PCIe 4.0 NVMe SSD	4
89	9	Màn hình	16" WQXGA (2560x1600) 165Hz, IPS, sRGB 100%	5
90	9	Pin	90Wh | Sạc 330W	6
91	9	Hệ điều hành	Windows 11 Home	7
92	9	Trọng lượng	2.8 kg	8
93	10	Chip	Apple M3 Pro (12 nhân CPU, 18 nhân GPU)	1
94	10	RAM	36GB Unified Memory	2
95	10	Ổ cứng	1TB SSD	3
96	10	Màn hình	14.2" Liquid Retina XDR, ProMotion 120Hz, 3024x1964, 1000 nits	4
97	10	Pin	72.4Wh, lên đến 18 giờ | Sạc MagSafe 96W	5
98	10	Hệ điều hành	macOS Sonoma	6
99	10	Trọng lượng	1.61 kg	7
100	10	Cổng	3x Thunderbolt 4, HDMI 2.1, SD Card, MagSafe 3	8
101	10	Camera	12MP Center Stage	9
102	11	CPU	Intel Core Ultra 7 155H	1
103	11	RAM	16GB LPDDR5x	2
104	11	Ổ cứng	512GB PCIe 4.0 SSD	3
105	11	Màn hình	14" 2.8K OLED, 120Hz, 100% DCI-P3	4
106	11	Pin	75Wh | Sạc 65W	5
107	11	Trọng lượng	1.39 kg	6
108	12	CPU	Intel Core i9-14900HX	1
109	12	GPU	NVIDIA RTX 4080 12GB	2
110	12	RAM	32GB DDR5-5600	3
111	12	Ổ cứng	2TB PCIe 4.0 NVMe	4
112	12	Màn hình	16" QHD+ 240Hz IPS	5
113	12	Trọng lượng	2.0 kg	6
114	13	CPU	Intel Core i7-13700H	1
115	13	RAM	16GB DDR5	2
116	13	Ổ cứng	512GB SSD	3
117	13	Màn hình	16" 2.5K IPS 120Hz	4
118	13	Trọng lượng	1.86 kg	5
119	14	CPU	Intel Core i9-14900HX	1
120	14	GPU	NVIDIA RTX 4070 Ti Super 16GB	2
121	14	RAM	32GB DDR5	3
122	14	Ổ cứng	1TB NVMe SSD	4
123	14	Màn hình	16" WQXGA 240Hz IPS	5
124	14	Trọng lượng	2.4 kg	6
125	15	CPU	Intel Core i7-13700H	1
126	15	RAM	16GB DDR5	2
127	15	Ổ cứng	1TB SSD	3
128	15	Màn hình	16" 2.5K IPS 120Hz Touch	4
129	15	Trọng lượng	1.97 kg	5
130	16	Chip	Apple M3 (8 nhân CPU, 10 nhân GPU)	1
131	16	RAM	16GB Unified Memory	2
132	16	Ổ cứng	256GB SSD	3
133	16	Màn hình	13.6" Liquid Retina 2560x1664, 500 nits	4
134	16	Pin	52.6Wh, 18 giờ	5
135	16	Trọng lượng	1.24 kg	6
136	17	CPU	AMD Ryzen 9 8945HS (8 nhân, 5.2GHz Boost)	1
137	17	GPU	NVIDIA RTX 4070 8GB GDDR6	2
138	17	RAM	32GB LPDDR5x	3
139	17	Ổ cứng	1TB NVMe SSD	4
140	17	Màn hình	14" 2.8K OLED 120Hz, 0.2ms, 100% DCI-P3	5
141	17	Trọng lượng	1.65 kg	6
142	18	CPU	Intel Core Ultra 5 125H	1
143	18	RAM	16GB LPDDR5x	2
144	18	Ổ cứng	512GB SSD	3
145	18	Màn hình	16" 2.5K IPS 144Hz	4
146	18	Trọng lượng	1.56 kg	5
\.


--
-- TOC entry 3655 (class 0 OID 32817)
-- Dependencies: 222
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, slug, brand_id, category_id, price, original_price, image, rating, review_count, sold_count, badge, specs, description, stock_quantity, is_active, created_at, updated_at) FROM stdin;
9	Acer Predator Helios Neo 16	acer-predator-helios-neo-16	1	1	34990000	39990000	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop	4.4	445	2100	Sale	{"cpu": "Intel Core i7-14700HX", "ram": "16GB DDR5", "display": "16\\" WQXGA 165Hz", "storage": "1TB SSD NVMe"}	Acer Predator Helios Neo 16 — Gaming laptop với hiệu năng cao cấp ở mức giá cạnh tranh.	55	t	2026-03-12 12:36:27.245497+00	2026-03-12 12:36:27.245497+00
11	ASUS ZenBook 14 OLED	asus-zenbook-14-oled	3	2	28990000	32990000	https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop	4.5	312	1800	Sale	{"cpu": "Intel Core Ultra 7 155H", "ram": "16GB LPDDR5x", "display": "14\\" 2.8K OLED", "storage": "512GB SSD"}	ASUS ZenBook 14 OLED — Laptop văn phòng cao cấp với màn hình OLED sắc nét tuyệt đối.	45	t	2026-03-12 12:36:27.245497+00	2026-03-12 12:36:27.245497+00
12	MSI Stealth 16 Studio	msi-stealth-16-studio	7	1	62990000	69990000	https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&h=600&fit=crop	4.6	178	890	New	{"cpu": "Intel Core i9-14900HX", "ram": "32GB DDR5", "display": "16\\" QHD+ 240Hz", "storage": "2TB SSD NVMe"}	MSI Stealth 16 Studio — Thiết kế mỏng nhẹ kết hợp sức mạnh RTX 4080 cho sáng tạo nội dung chuyên nghiệp.	25	t	2026-03-12 12:36:27.245497+00	2026-03-12 12:36:27.245497+00
14	Lenovo Legion Pro 5 16	lenovo-legion-pro-5-16	6	1	48990000	54990000	https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&h=600&fit=crop	4.7	234	1340	Hot	{"cpu": "Intel Core i9-14900HX", "ram": "32GB DDR5", "display": "16\\" WQXGA 240Hz", "storage": "1TB SSD NVMe"}	Lenovo Legion Pro 5 16 — Hiệu năng gaming cực đỉnh với RTX 4070 Ti Super và màn hình 240Hz.	40	t	2026-03-12 12:36:27.245497+00	2026-03-12 12:36:27.245497+00
15	HP Envy 16	hp-envy-16	5	2	32990000	36990000	https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop	4.4	189	950	\N	{"cpu": "Intel Core i7-13700H", "ram": "16GB DDR5", "display": "16\\" 2.5K IPS Touch", "storage": "1TB SSD"}	HP Envy 16 — Laptop sáng tạo cao cấp với màn hình cảm ứng 2.5K và GPU rời.	50	t	2026-03-12 12:36:27.245497+00	2026-03-12 12:36:27.245497+00
7	Razer Blade 16 2024	razer-blade-16-2024	8	1	79990000	89990000	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop	4.6	156	670	Sale	{"cpu": "Intel Core i9-14900HX", "ram": "32GB DDR5", "display": "16\\" UHD+ 120Hz OLED", "storage": "1TB SSD NVMe"}	Razer Blade 16 2024 — Bezel mỏng nhất trong lịch sử dòng Blade với màn hình OLED UHD+ 16 inch 120Hz.	20	t	2026-03-12 12:36:27.245497+00	2026-03-18 06:59:20.367308+00
4	Dell XPS 16 9640	dell-xps-16-9640	4	2	45990000	52990000	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop	4.6	345	1890	Sale	{"cpu": "Intel Core Ultra 9 185H", "ram": "32GB LPDDR5x", "display": "16\\" OLED 3.8K Touch", "storage": "1TB SSD"}	Dell XPS 16 9640 là biểu tượng của sự tinh tế trong thiết kế laptop. Màn hình OLED InfinityEdge 3.8K cảm ứng mang lại trải nghiệm hình ảnh sống động.	40	t	2026-03-12 12:36:27.245497+00	2026-03-18 06:25:20.892582+00
8	HP Spectre x360 16	hp-spectre-x360-16	5	2	41990000	47990000	https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=600&fit=crop	4.5	234	1100	New	{"cpu": "Intel Core Ultra 7 155H", "ram": "32GB LPDDR5x", "display": "16\\" 3K OLED Touch", "storage": "1TB SSD"}	HP Spectre x360 16 — 2-in-1 cao cấp nhất của HP với khả năng xoay 360 độ. Màn hình OLED cảm ứng 3K.	35	f	2026-03-12 12:36:27.245497+00	2026-03-18 10:30:06.499921+00
2	MacBook Pro 16 M3 Max	macbook-pro-16-m3-max	2	3	89990000	96990000	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop	4.9	567	2340	Hot	{"cpu": "Apple M3 Max", "ram": "48GB Unified", "display": "16.2\\" Liquid Retina XDR", "storage": "1TB SSD"}	MacBook Pro 16 inch với chip M3 Max là đỉnh cao của dòng laptop chuyên nghiệp từ Apple. Chip M3 Max với 16 nhân CPU và 40 nhân GPU mang lại hiệu năng phi thường cho mọi tác vụ.	30	t	2026-03-12 12:36:27.245497+00	2026-03-18 06:25:11.004754+00
13	Dell Inspiron 16 Plus	dell-inspiron-16-plus	4	2	24990000	27990000	https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=600&fit=crop	4.3	567	2801	\N	{"cpu": "Intel Core i7-13700H", "ram": "16GB DDR5", "display": "16\\" 2.5K IPS", "storage": "512GB SSD"}	Dell Inspiron 16 Plus — Laptop phổ thông cao cấp với màn hình 2.5K rộng lớn.	89	t	2026-03-12 12:36:27.245497+00	2026-03-18 10:10:16.313483+00
10	MacBook Pro 14 M3 Pro	macbook-pro-14-m3-pro	2	3	54990000	59990000	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop	4.9	1023	5601	\N	{"cpu": "Apple M3 Pro", "ram": "36GB Unified", "display": "14.2\\" Liquid Retina XDR", "storage": "1TB SSD"}	MacBook Pro 14 M3 Pro — Sức mạnh chuyên nghiệp trong form factor nhỏ gọn.	69	t	2026-03-12 12:36:27.245497+00	2026-03-18 07:18:32.972528+00
16	MacBook Air 13 M3	macbook-air-13-m3	2	3	27990000	29990000	https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop	4.8	1456	7201	Hot	{"cpu": "Apple M3", "ram": "16GB Unified", "display": "13.6\\" Liquid Retina", "storage": "256GB SSD"}	MacBook Air 13 M3 — Laptop siêu nhẹ 1.24kg với hiệu năng vượt trội và thời lượng pin 18 giờ.	99	t	2026-03-12 12:36:27.245497+00	2026-03-18 10:28:20.840372+00
17	ASUS ROG Zephyrus G14	asus-rog-zephyrus-g14	3	1	46990000	52990000	https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=800&h=600&fit=crop	4.7	298	1670	Sale	{"cpu": "AMD Ryzen 9 8945HS", "ram": "32GB LPDDR5x", "display": "14\\" 2.8K OLED 120Hz", "storage": "1TB SSD NVMe"}	ASUS ROG Zephyrus G14 — Gaming laptop nhỏ gọn nhất với AMD Ryzen 9 và RTX 4070, màn hình OLED 2.8K.	35	t	2026-03-12 12:36:27.245497+00	2026-03-12 12:36:27.245497+00
18	Acer Swift Go 16	acer-swift-go-16	1	2	22990000	25990000	https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop	4.2	145	780	\N	{"cpu": "Intel Core Ultra 5 125H", "ram": "16GB LPDDR5x", "display": "16\\" 2.5K IPS", "storage": "512GB SSD"}	Acer Swift Go 16 — Laptop siêu nhẹ 1.56kg với màn hình 2.5K lớn, pin cả ngày làm việc.	65	t	2026-03-12 12:36:27.245497+00	2026-03-12 12:36:27.245497+00
3	MSI Titan 18 HX 2024	msi-titan-18-hx-2024	7	1	119990000	129990000	https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=600&fit=crop	5.0	1	456	New	{"cpu": "Intel Core i9-14900HX", "ram": "64GB DDR5", "display": "18\\" UHD+ 120Hz Mini LED", "storage": "2TB SSD NVMe RAID"}	MSI Titan 18 HX 2024 — Đỉnh cao của công nghệ laptop gaming với màn hình Mini LED 18 inch UHD+ lần đầu được tích hợp vào laptop.	15	t	2026-03-12 12:36:27.245497+00	2026-03-14 03:09:32.425464+00
1	ASUS ROG Strix G16 2024	asus-rog-strix-g16-2024	3	1	42990000	49990000	https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop	4.5	4	1521	Hot	{"cpu": "Intel Core i9-14900HX", "ram": "32GB DDR5", "display": "16\\" QHD+ 240Hz", "storage": "1TB SSD NVMe"}	ASUS ROG Strix G16 2024 là chiếc laptop gaming đỉnh cao được trang bị bộ vi xử lý Intel Core i9-14900HX thế hệ mới nhất cùng card đồ họa NVIDIA GeForce RTX 4080, mang đến hiệu năng gaming vượt trội trong mọi tựa game AAA hiện đại.	49	t	2026-03-12 12:36:27.245497+00	2026-03-14 03:09:32.979888+00
5	Lenovo ThinkPad X1 Carbon Gen 12	lenovo-thinkpad-x1-carbon-gen-12	6	2	38990000	42990000	https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop	4.5	678	3200	Hot	{"cpu": "Intel Core Ultra 7 155H", "ram": "32GB LPDDR5x", "display": "14\\" 2.8K OLED", "storage": "512GB SSD"}	ThinkPad X1 Carbon Gen 12 tiếp tục di sản huyền thoại với chất lượng xây dựng đạt chuẩn quân sự MIL-SPEC 810H. Siêu nhẹ chỉ 1.12kg.	60	t	2026-03-12 12:36:27.245497+00	2026-03-17 15:37:30.152232+00
6	MacBook Air 15 M3	macbook-air-15-m3	2	3	37990000	39990000	https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop	4.8	890	4500	Hot	{"cpu": "Apple M3", "ram": "24GB Unified", "display": "15.3\\" Liquid Retina", "storage": "512GB SSD"}	MacBook Air 15 inch M3 — Chiếc laptop 15 inch mỏng nhẹ nhất thế giới. Thiết kế không quạt hoàn toàn im lặng.	80	t	2026-03-12 12:36:27.245497+00	2026-03-17 15:37:30.152232+00
\.


--
-- TOC entry 3677 (class 0 OID 33060)
-- Dependencies: 244
-- Data for Name: review_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.review_images (id, review_id, image_url, display_order) FROM stdin;
\.


--
-- TOC entry 3675 (class 0 OID 33031)
-- Dependencies: 242
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, product_id, user_id, rating, title, content, helpful_count, is_verified, is_active, created_at) FROM stdin;
1	1	2	5	Máy gaming quá đỉnh, đáng đồng tiền!	Sau 1 tháng sử dụng, mình thực sự hài lòng với ROG Strix G16. Chơi mọi game AAA ở setting Ultra ổn định 60fps+. Tản nhiệt tốt, bàn phím RGB rất đẹp.	42	t	t	2026-03-12 12:37:25.523281+00
2	1	3	5	Hiệu năng vượt trội, thiết kế đẹp	i9-14900HX + RTX 4080 combo thực sự mạnh mẽ. Render video 4K nhanh hơn rất nhiều so với laptop cũ.	28	t	t	2026-03-12 12:37:25.523281+00
3	1	4	4	Máy tốt nhưng hơi nặng	Hiệu năng rất ổn, nhưng 2.5kg hơi nặng để mang đi. Quạt cũng khá ồn khi gaming.	15	t	t	2026-03-12 12:37:25.523281+00
4	2	2	5	Đỉnh cao công nghệ Apple!	M3 Max cực kỳ mạnh mẽ. Edit video 8K ProRes mượt mà, export nhanh gấp 3 lần M1 Max.	56	t	t	2026-03-12 12:37:25.523281+00
5	2	4	5	Pin trâu, màn hình đẹp	Pin dùng được 15-16 tiếng thực tế. Màn hình XDR hiển thị màu sắc chuẩn tuyệt đối cho công việc design.	34	t	t	2026-03-12 12:37:25.523281+00
6	6	3	5	Nhẹ và mạnh!	Chiếc Air 15 inch nhẹ đáng kinh ngạc. Không quạt hoàn toàn im lặng. Dùng cả ngày không cần sạc.	38	t	t	2026-03-12 12:37:25.523281+00
7	6	5	4	Tốt nhưng thiếu cổng	Máy rất ổn cho công việc văn phòng. Chỉ tiếc là chỉ có 2 cổng USB-C, cần mua thêm hub.	12	t	t	2026-03-12 12:37:25.523281+00
8	16	2	5	Best laptop cho sinh viên!	Nhẹ, pin trâu, mượt mà. Dùng cho code, note-taking, xem phim đều tốt. Giá hợp lý cho dòng MacBook.	67	t	t	2026-03-12 12:37:25.523281+00
9	16	3	5	Mua cho vợ, rất hài lòng	Thiết kế đẹp, nhẹ 1.24kg mang đi làm rất tiện. Vợ dùng cho công việc văn phòng quá ổn.	45	t	t	2026-03-12 12:37:25.523281+00
10	16	5	4	Tốt nhưng SSD 256GB hơi ít	Máy chạy tốt mọi thứ, nhưng 256GB thực sự hơi eo hẹp. Nên chọn bản 512GB.	23	f	t	2026-03-12 12:37:25.523281+00
11	3	177	5	Great product!	This product is amazing, highly recommended!	0	f	t	2026-03-14 03:09:32.443232+00
12	1	183	4	Already reviewed	Testing duplicate review	0	f	t	2026-03-14 03:09:32.999302+00
\.


--
-- TOC entry 3669 (class 0 OID 32960)
-- Dependencies: 236
-- Data for Name: shipping_addresses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipping_addresses (id, user_id, full_name, phone, email, province, district, address, is_default, created_at) FROM stdin;
1	2	Nguyễn Văn A	0912345678	nguyenvana@gmail.com	TP. Hồ Chí Minh	Quận 7	123 Nguyễn Văn Linh, Phường Tân Phú	t	2026-03-12 12:37:25.523281+00
2	3	Trần Thị B	0923456789	tranthib@gmail.com	Hà Nội	Cầu Giấy	45 Xuân Thủy, Phường Dịch Vọng Hậu	t	2026-03-12 12:37:25.523281+00
3	4	Lê Văn C	0934567890	levanc@gmail.com	Đà Nẵng	Hải Châu	78 Trần Phú, Phường Hải Châu 1	t	2026-03-12 12:37:25.523281+00
4	42	Nguyen Van B	0912345678	vanb@gmail.com	Ha Noi	Cau Giay	456 Ton That Tung	f	2026-03-14 02:57:58.770694+00
5	90	Nguyen Van B	0912345678	vanb@gmail.com	Ha Noi	Cau Giay	456 Ton That Tung	f	2026-03-14 03:09:23.331392+00
6	98	Default Address User	0911111111	default@gmail.com	Da Nang	Hai Chau	789 Phan Chu Trinh	t	2026-03-14 03:09:24.126563+00
7	169	Nguyen Van A	0987654321	nguyenvana@gmail.com	Ho Chi Minh	District 1	123 Nguyen Hue	f	2026-03-14 03:09:31.631617+00
8	186	DUC DO	0346748114	do.do.duc.do@gmail.com	Hà Nội	Đại Mỗ	PHUNG KHOANG STREET, 67, Phung Khoang Street	f	2026-03-14 04:00:55.164453+00
10	186	Trinh Huy Hoang	0346748117	trinhhuyhoang@gmail.com	Đà Nẵng	Đại Mỗ	123 hang chau	f	2026-03-17 15:04:09.172462+00
9	186	DUC DO	0346748115	do.do.duc.do@gmail.com	Hà Nội	Đại Mỗ	PHUNG KHOANG STREET, 67, Phung Khoang Street	f	2026-03-17 14:09:58.414705+00
11	186	Trinh Huy Hoang	0346748119	trinhhuyhoang@gmail.com	Đà Nẵng	Đại Mỗ	123 hang chau	f	2026-03-17 15:04:09.327008+00
12	187	user1	0346748124	user1@gmail.com	Hà Nội	Đại Mỗ	456 Nguyễn Trãi	f	2026-03-18 07:18:23.450929+00
13	187	user1	0346748123		Hà Nội	Đại Mỗ	123 Phung Khoang	f	2026-03-18 10:10:16.155632+00
\.


--
-- TOC entry 3649 (class 0 OID 32770)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password_hash, full_name, phone, avatar_url, role, is_active, created_at, updated_at) FROM stdin;
1	admin@laptopverse.vn	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy	Admin LaptopVerse	0901000000	\N	ADMIN	t	2026-03-12 12:36:27.245497+00	2026-03-12 12:36:27.245497+00
2	nguyenvana@gmail.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy	Nguyễn Văn A	0912345678	\N	CUSTOMER	t	2026-03-12 12:36:27.245497+00	2026-03-12 12:36:27.245497+00
3	tranthib@gmail.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy	Trần Thị B	0923456789	\N	CUSTOMER	t	2026-03-12 12:36:27.245497+00	2026-03-12 12:36:27.245497+00
4	levanc@gmail.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy	Lê Văn C	0934567890	\N	CUSTOMER	t	2026-03-12 12:36:27.245497+00	2026-03-12 12:36:27.245497+00
5	phamthid@gmail.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy	Phạm Thị D	0945678901	\N	CUSTOMER	t	2026-03-12 12:36:27.245497+00	2026-03-12 12:36:27.245497+00
42	test-customer@gmail.com	$2a$10$GC6l05urcZ7q9SZcNZfYWOr.yuq8Q9xSk9fz/JPwpfoTSsllSo6VC	Test Customer	0912000001	\N	CUSTOMER	t	2026-03-14 02:57:58.740537+00	2026-03-14 02:57:58.740537+00
43	test-admin-1773457394521@laptopverse.vn	$2a$10$p4obwKaQdRJN7AO4Nyy2x.iCbPFIo77FucQ87K5Zus3t5JV5xEabe	Test Admin	0983492233	\N	ADMIN	t	2026-03-14 03:03:14.649952+00	2026-03-14 03:03:14.649952+00
44	test-customer-1773457394521@gmail.com	$2a$10$WAcSEhVG8tQ.dbL4owY3pOK2eTcGNmZxg4MJNpCNOcSusPieh4DsK	Test Customer	0988552555	\N	CUSTOMER	t	2026-03-14 03:03:14.812759+00	2026-03-14 03:03:14.812759+00
45	test-admin-1773457395180@laptopverse.vn	$2a$10$a7OdRITa91zzwF0bPP/JW.UvW6mQNPOIndWdD56vAQb4HtrT5f4jC	Test Admin	0983251421	\N	ADMIN	t	2026-03-14 03:03:15.268122+00	2026-03-14 03:03:15.268122+00
46	test-customer-1773457395180@gmail.com	$2a$10$ydV4TJV2tQ3j7F3gV1O2JusBX48//pzZYWGh8bC/HeQrHj3oGKn9i	Test Customer	0934344382	\N	CUSTOMER	t	2026-03-14 03:03:15.361783+00	2026-03-14 03:03:15.361783+00
47	test-admin-1773457395405@laptopverse.vn	$2a$10$x/8SuBAItsZ8ZDYTw3q.Ae0s0SccVvClL3YvykgiK3ChFyFh.aJqO	Test Admin	0922931467	\N	ADMIN	t	2026-03-14 03:03:15.5277+00	2026-03-14 03:03:15.5277+00
48	test-customer-1773457395405@gmail.com	$2a$10$7Axr8xb0/7XUn38dHx41lelJ3nECK4eH.9QyvnwJxjd8Pg4.F17se	Test Customer	0949644839	\N	CUSTOMER	t	2026-03-14 03:03:15.619214+00	2026-03-14 03:03:15.619214+00
49	test-admin-1773457395964@laptopverse.vn	$2a$10$2cx1qCjlo9wpMfUvk0fRcOJGbGFmzi/aSikP82ZElB7VfUJIMdDaq	Test Admin	0948423377	\N	ADMIN	t	2026-03-14 03:03:16.040699+00	2026-03-14 03:03:16.040699+00
50	test-customer-1773457395964@gmail.com	$2a$10$tlRXKrCom/b06my36ma.TuHph1w/B4mwv/dcaaznEbzi/hHIueoyC	Test Customer	0957828759	\N	CUSTOMER	t	2026-03-14 03:03:16.126933+00	2026-03-14 03:03:16.126933+00
51	test-admin-1773457396190@laptopverse.vn	$2a$10$LFCuXYWvw8SxqzNZOdK70usQZcmznys1I7sSh3ri1/ou3734QiNEi	Test Admin	0946450751	\N	ADMIN	t	2026-03-14 03:03:16.269247+00	2026-03-14 03:03:16.269247+00
52	test-customer-1773457396190@gmail.com	$2a$10$Z4.Y9LhwaLJsgbx1Xw6uB.TPQkevtfe1BgZjeF7NPhYnarmO7D3Ga	Test Customer	0920595627	\N	CUSTOMER	t	2026-03-14 03:03:16.355599+00	2026-03-14 03:03:16.355599+00
53	test-admin-1773457396387@laptopverse.vn	$2a$10$fS0C7EBRgsUu/6J29CpgWu/boMleUBt8wr0lTxljMn2wfJMO6sUrS	Test Admin	0962122585	\N	ADMIN	t	2026-03-14 03:03:16.451635+00	2026-03-14 03:03:16.451635+00
54	test-customer-1773457396387@gmail.com	$2a$10$aP13FP5n/x66uY8mfP.S9.VrLH5zWEsvuVgraWIk8MGuvUc8r8EyC	Test Customer	0974505347	\N	CUSTOMER	t	2026-03-14 03:03:16.553804+00	2026-03-14 03:03:16.554806+00
55	test-admin-1773457396655@laptopverse.vn	$2a$10$8hEUgBTRw./G07aKNhfgH.OgzIXYI/PFsSdzobEm8OdD7Vwaq8p1G	Test Admin	0964127985	\N	ADMIN	t	2026-03-14 03:03:16.732139+00	2026-03-14 03:03:16.732139+00
56	test-customer-1773457396655@gmail.com	$2a$10$0srp7rV69YkOBrT/P4zW3eV4qn8nsQDzam0ZBgYj2h4ZAx2OwPujy	Test Customer	0977209056	\N	CUSTOMER	t	2026-03-14 03:03:16.814218+00	2026-03-14 03:03:16.814218+00
57	testuser@gmail.com	$2a$10$qtL6/rssnWVPcvSd.e9UEueq68KGMfVHM3nDFaKx3yk6C9AUCjPqq	Test User	0987654321	\N	CUSTOMER	t	2026-03-14 03:03:16.912647+00	2026-03-14 03:03:16.912647+00
58	test-admin-1773457513967@laptopverse.vn	$2a$10$9ZtP9W.XOf6q27cj3maH3OArcEfjcX5PFrcsKUjRUFTVFD92x4t4C	Test Admin	0979047538	\N	ADMIN	t	2026-03-14 03:05:14.118956+00	2026-03-14 03:05:14.118956+00
59	test-customer-1773457513967@gmail.com	$2a$10$tZP1oJ8pa/FQRT9g2J9j0.Pgn/CqmWpLUv44UeTJ.VfVe.7u0JijS	Test Customer	0993220404	\N	CUSTOMER	t	2026-03-14 03:05:14.233152+00	2026-03-14 03:05:14.233152+00
60	test-admin-1773457514570@laptopverse.vn	$2a$10$DXGkP0MXvEptYGo6o/ZP7usA7.yjGbvCi4DtV1R2.m1u7isuQ6zai	Test Admin	0973588008	\N	ADMIN	t	2026-03-14 03:05:14.663532+00	2026-03-14 03:05:14.663532+00
61	test-customer-1773457514570@gmail.com	$2a$10$4co1T9Wi9NJSKOm2POhf3OtUn32kEraShN5VnFw6RJoN7LBriHiv6	Test Customer	0954276941	\N	CUSTOMER	t	2026-03-14 03:05:14.77839+00	2026-03-14 03:05:14.77839+00
62	test-admin-1773457514797@laptopverse.vn	$2a$10$TBRUACQWjajrP2..LMvJSeUxbiuW41byFGKka5vhgA00glb1bH0qW	Test Admin	0919983116	\N	ADMIN	t	2026-03-14 03:05:14.88692+00	2026-03-14 03:05:14.88692+00
63	test-customer-1773457514797@gmail.com	$2a$10$4hOr6mfyhgRz16a6xqtLI.9CQqNpAo7ZtQetCH4toyHdw56vHxz/K	Test Customer	0954658819	\N	CUSTOMER	t	2026-03-14 03:05:14.967198+00	2026-03-14 03:05:14.967198+00
64	test-admin-1773457515338@laptopverse.vn	$2a$10$0SKOivzOobOJZsMBv6k7T.9.2CfEJGfJ/3GkypVUspyvZrqbIUDAa	Test Admin	0922738012	\N	ADMIN	t	2026-03-14 03:05:15.410657+00	2026-03-14 03:05:15.410657+00
65	test-customer-1773457515338@gmail.com	$2a$10$88AbEsOHIKTmJBT3OZpMK.b9DunOfJLInIfva48IcCEEFMWCwvKZq	Test Customer	0916886058	\N	CUSTOMER	t	2026-03-14 03:05:15.500283+00	2026-03-14 03:05:15.500283+00
66	test-admin-1773457515574@laptopverse.vn	$2a$10$QMvTQYygSPwF2e0SgDqGUuqLNwYVooHepezykaMDCLGDe8dHjfyjS	Test Admin	0917900853	\N	ADMIN	t	2026-03-14 03:05:15.650168+00	2026-03-14 03:05:15.650168+00
67	test-customer-1773457515574@gmail.com	$2a$10$1R8KUMN4pNr9dxRMAPBDv.asxumyMMPkcaFq.7Mos7xneDJSUQwJe	Test Customer	0986304793	\N	CUSTOMER	t	2026-03-14 03:05:15.732463+00	2026-03-14 03:05:15.732463+00
68	test-admin-1773457515753@laptopverse.vn	$2a$10$fKTK1Dq74ElYEcFmR6lTe.A7/D9UX0yAkZA6dGQgPyhFYVpMSKYS6	Test Admin	0955804573	\N	ADMIN	t	2026-03-14 03:05:15.825372+00	2026-03-14 03:05:15.825372+00
69	test-customer-1773457515753@gmail.com	$2a$10$aJh1GrOqutnKsP52Lh9R8.pMGGIVrJvrEFLQn6FrPHTVvP8MBjI1i	Test Customer	0934207454	\N	CUSTOMER	t	2026-03-14 03:05:15.899573+00	2026-03-14 03:05:15.899573+00
70	test-admin-1773457515992@laptopverse.vn	$2a$10$Jnr.uAhB/jsKjA1QpKj5fuywCacaxG4sgVaF3E6g2BIAhxmUPhPOm	Test Admin	0960863693	\N	ADMIN	t	2026-03-14 03:05:16.069088+00	2026-03-14 03:05:16.069088+00
71	test-customer-1773457515992@gmail.com	$2a$10$EAFLsTfLuLIp8EVmF61zX.foIqudazKYpEX2w9uEfR7AmH1E7CZ1S	Test Customer	0941719213	\N	CUSTOMER	t	2026-03-14 03:05:16.142575+00	2026-03-14 03:05:16.142575+00
72	test-admin-1773457653290@laptopverse.vn	$2a$10$.Elm1vwElVGVBoUp0FU7M.yM1oY7FH9NxgBiGle0oMXLNVVRpa40i	Test Admin	0987755652	\N	ADMIN	t	2026-03-14 03:07:33.524427+00	2026-03-14 03:07:33.524427+00
73	test-customer-1773457653290@gmail.com	$2a$10$iIial0eYPv7psxUO0f2NvuKErLz8hSa2j5uW0mX5Y56Eby.kwtmoa	Test Customer	0942564103	\N	CUSTOMER	t	2026-03-14 03:07:33.700676+00	2026-03-14 03:07:33.700676+00
74	test-admin-1773457654088@laptopverse.vn	$2a$10$nzrplLsTQzYzpQjDCgwbwO.r8XhlIVNS5LjR4mFVNMjZ62KpVsSCe	Test Admin	0983267419	\N	ADMIN	t	2026-03-14 03:07:34.178262+00	2026-03-14 03:07:34.178262+00
75	test-customer-1773457654088@gmail.com	$2a$10$QWoUowJ2BvR0RKi25yR/6u8dVYIyiVv2uLW79c6bvKGLKi6GiJd/q	Test Customer	0929652723	\N	CUSTOMER	t	2026-03-14 03:07:34.251896+00	2026-03-14 03:07:34.251896+00
76	test-admin-1773457654269@laptopverse.vn	$2a$10$mtU0YuqkVIqF14vlbweziOaZ8a5GImPto1ZdMBAUZRbRf7BIYBPu2	Test Admin	0975003309	\N	ADMIN	t	2026-03-14 03:07:34.339305+00	2026-03-14 03:07:34.339305+00
77	test-customer-1773457654269@gmail.com	$2a$10$jVzIHdF8zMtpRg8hmO/DTOY2QCvQT9cMUKltmEYgeDEIjZeN0..bS	Test Customer	0995246434	\N	CUSTOMER	t	2026-03-14 03:07:34.414359+00	2026-03-14 03:07:34.414359+00
78	test-admin-1773457654891@laptopverse.vn	$2a$10$0DbUurFy80djT0xzUKiwXuqVqMw8h4pE5DD52OaGbxlE4V/zf/xjS	Test Admin	0927442980	\N	ADMIN	t	2026-03-14 03:07:34.986348+00	2026-03-14 03:07:34.986348+00
79	test-customer-1773457654891@gmail.com	$2a$10$Sl.Ytm9LLiaSGCjsQRMkW.xxprr9n3V9MwaD2Zd7niahQQJ8MJHhe	Test Customer	0914660999	\N	CUSTOMER	t	2026-03-14 03:07:35.064635+00	2026-03-14 03:07:35.064635+00
80	test-admin-1773457655122@laptopverse.vn	$2a$10$w3YE/2sCGobS4.8/ptBqU.67k6u0WeR1Hng/mpBYoHdlg9bUNdqUO	Test Admin	0954564579	\N	ADMIN	t	2026-03-14 03:07:35.205189+00	2026-03-14 03:07:35.205189+00
81	test-customer-1773457655122@gmail.com	$2a$10$qtLncCDOEOkCc7vAsJVWYeZWh5sTwvQA4AsDwB8W/8S5iXZOnsbYW	Test Customer	0983395599	\N	CUSTOMER	t	2026-03-14 03:07:35.294463+00	2026-03-14 03:07:35.294463+00
82	test-admin-1773457655327@laptopverse.vn	$2a$10$gaCq2EcInSvgS4uivzJPneKzJV1dfht3VkESMVyWXucB9QcFp5dlG	Test Admin	0940742250	\N	ADMIN	t	2026-03-14 03:07:35.407258+00	2026-03-14 03:07:35.407258+00
83	test-customer-1773457655327@gmail.com	$2a$10$yRj0fERiHDsZ.fa9vwu3K.xnYuIEU3WoQaGGmUhd/HecEDJU/GTyu	Test Customer	0943362322	\N	CUSTOMER	t	2026-03-14 03:07:35.48182+00	2026-03-14 03:07:35.48182+00
84	test-admin-1773457655579@laptopverse.vn	$2a$10$uP9nsMcW1kZFXfWwNkbPu.RoZLQ8xyfqTRB2Ksdk.92WQ/Jev07fe	Test Admin	0959471265	\N	ADMIN	t	2026-03-14 03:07:35.670587+00	2026-03-14 03:07:35.670587+00
85	test-customer-1773457655579@gmail.com	$2a$10$stgxw6CYcXH81zIg.NpPL.QFIJcMVIfIjp8oxORbF8zeGMnUNfQN2	Test Customer	0933178440	\N	CUSTOMER	t	2026-03-14 03:07:35.770204+00	2026-03-14 03:07:35.770204+00
86	testuser-1773457655778@gmail.com	$2a$10$ucUizyiCPXbohGRBazhSH.scS7YIfvtcgwuyHkHngpk14B8H8C.xy	Test User	0917675483	\N	CUSTOMER	t	2026-03-14 03:07:35.855604+00	2026-03-14 03:07:35.855604+00
87	test-admin-1773457762332@laptopverse.vn	$2a$10$y5EI6dn3/posYifiCx6BX.PP3c1zn30.yBJ9hSeLpp9rSgPJ587mi	Test Admin	0932219771	\N	ADMIN	t	2026-03-14 03:09:22.473455+00	2026-03-14 03:09:22.473455+00
88	test-customer-1773457762332@gmail.com	$2a$10$oqladS73SPRfo/K5iS9NNOdYtRmzAW/1oRzFdCqhKrlCCibfGUtrm	Test Customer	0936251805	\N	CUSTOMER	t	2026-03-14 03:09:22.577743+00	2026-03-14 03:09:22.577743+00
89	test-admin-1773457763123@laptopverse.vn	$2a$10$7mKX/B/2nqtETGmiKHd0.ecwhrt8DHM8iSsoJiYDbkMj2fIR8wbMS	Test Admin	0996151266	\N	ADMIN	t	2026-03-14 03:09:23.215915+00	2026-03-14 03:09:23.215915+00
90	test-customer-1773457763123@gmail.com	$2a$10$78FMwU1ZEmoItLarx.ublebLN11LhMisLO2.7RDF7r2kyhQOoYGGi	Test Customer	0951830710	\N	CUSTOMER	t	2026-03-14 03:09:23.305401+00	2026-03-14 03:09:23.305401+00
91	test-admin-1773457763384@laptopverse.vn	$2a$10$NNVcQpDxYwBd/nl/HCn8yOHN4CXIndDXYHVtCCJ0.cej6YOvAbPkC	Test Admin	0947905007	\N	ADMIN	t	2026-03-14 03:09:23.45083+00	2026-03-14 03:09:23.45083+00
92	test-customer-1773457763384@gmail.com	$2a$10$3Xd.GDSzwtThdb.96aEIn.L/jt9A2Lu6KcPcZoupoRn0/4IWouZAK	Test Customer	0984284529	\N	CUSTOMER	t	2026-03-14 03:09:23.529123+00	2026-03-14 03:09:23.529123+00
93	test-admin-1773457763563@laptopverse.vn	$2a$10$knckFCy0cZ1bhUB60YO7wusUa52/ImfhVPxQKA1Mf3EMB/..uu99u	Test Admin	0988512919	\N	ADMIN	t	2026-03-14 03:09:23.637623+00	2026-03-14 03:09:23.637623+00
94	test-customer-1773457763563@gmail.com	$2a$10$pQM/2K4i0eQIQHADymomC.Io5KjyD5AsQYeUNJI8dNwR7QDJPh5l2	Test Customer	0952614574	\N	CUSTOMER	t	2026-03-14 03:09:23.716547+00	2026-03-14 03:09:23.716547+00
95	test-admin-1773457763768@laptopverse.vn	$2a$10$F30QS9lQU4tOkHCEyk0jt.b923xjd73N9Xkf3V.zp7mWE47fi3Qpq	Test Admin	0968054626	\N	ADMIN	t	2026-03-14 03:09:23.849067+00	2026-03-14 03:09:23.849067+00
96	test-customer-1773457763768@gmail.com	$2a$10$6nae6gIHAid.hdJBgFSR1.x2BsQtowhITEWI5ZF3DG7NLY9VfXLvC	Test Customer	0982773360	\N	CUSTOMER	t	2026-03-14 03:09:23.930383+00	2026-03-14 03:09:23.930383+00
97	test-admin-1773457763944@laptopverse.vn	$2a$10$RTUC188nlWDvbmIgqVUyS.q5t10J/ivHaIUs/nFZmqsfoyawfRQq.	Test Admin	0963783334	\N	ADMIN	t	2026-03-14 03:09:24.018768+00	2026-03-14 03:09:24.018768+00
98	test-customer-1773457763944@gmail.com	$2a$10$fy.QwnvRU7CiYUbWlZspROv2L7NtXScrv5sE.tPJtbOQUjZv56yeq	Test Customer	0953147871	\N	CUSTOMER	t	2026-03-14 03:09:24.093832+00	2026-03-14 03:09:24.093832+00
99	test-admin-1773457764160@laptopverse.vn	$2a$10$YC7ksLGga4l5cN8psGkk8.nfJ6dul8Um18J5jW63JTuekxXXCO3ni	Test Admin	0912238736	\N	ADMIN	t	2026-03-14 03:09:24.263551+00	2026-03-14 03:09:24.263551+00
100	test-customer-1773457764160@gmail.com	$2a$10$K0VzNTN2zD11brFgFp7JA.09bN/9hp9dlxRYZjdhRE.1CEbvjqjei	Test Customer	0922646791	\N	CUSTOMER	t	2026-03-14 03:09:24.344852+00	2026-03-14 03:09:24.344852+00
101	test-admin-1773457764387@laptopverse.vn	$2a$10$ZMKG.sm5LoG8BlZESXBKuOARlvsiOtHnhu9L9mR5v3bUy72ftj97u	Test Admin	0954269506	\N	ADMIN	t	2026-03-14 03:09:24.469659+00	2026-03-14 03:09:24.469659+00
102	test-customer-1773457764387@gmail.com	$2a$10$zRMFS16dFMz3Vs3rHlxBUu4CGLHc0iLlIWYDmxBhFnj/iDcA2Q5MC	Test Customer	0985978749	\N	CUSTOMER	t	2026-03-14 03:09:24.553286+00	2026-03-14 03:09:24.553286+00
103	test-admin-1773457764568@laptopverse.vn	$2a$10$3krtYITUbfgAGCnukFhdMusS9mxC7Gdb.rF4tJTHgsZYPj7nN3jpK	Test Admin	0932845774	\N	ADMIN	t	2026-03-14 03:09:24.654583+00	2026-03-14 03:09:24.654583+00
104	test-customer-1773457764568@gmail.com	$2a$10$FJccZyB7Ojkgf1KwUxECguvnnAwEq4p.iw1vQKYNe7cDNLhceDWoK	Test Customer	0958564155	\N	CUSTOMER	t	2026-03-14 03:09:24.736558+00	2026-03-14 03:09:24.736558+00
105	test-admin-1773457764939@laptopverse.vn	$2a$10$.jfRkuorStFdIN8o6oy7T.NZakKHet6T0i6Un3EEh1U72t6IDfJAO	Test Admin	0981701678	\N	ADMIN	t	2026-03-14 03:09:25.012363+00	2026-03-14 03:09:25.012363+00
106	test-customer-1773457764939@gmail.com	$2a$10$QGoDriHD99P96P/GCHP/eu7aQjPDUIyEdf7CQJB.2o6ClWaZKGq6C	Test Customer	0949273998	\N	CUSTOMER	t	2026-03-14 03:09:25.085415+00	2026-03-14 03:09:25.085415+00
107	test-admin-1773457765123@laptopverse.vn	$2a$10$erMIlg.5UFIAIBL4oCndCuks8nNRkJbK3rhMRYcv.UplVuORADqfu	Test Admin	0949958599	\N	ADMIN	t	2026-03-14 03:09:25.192819+00	2026-03-14 03:09:25.192819+00
108	test-customer-1773457765123@gmail.com	$2a$10$uLlHC5g3VotLYwC24vVgYeDVdhAySOEkBFivXQ88IDM7SqrXjbNyG	Test Customer	0943554648	\N	CUSTOMER	t	2026-03-14 03:09:25.264717+00	2026-03-14 03:09:25.264717+00
109	test-admin-1773457765293@laptopverse.vn	$2a$10$timCpeck1J2ZioNZGiG0neeRfkAeMIcRou/.PNnX7sYBLZJ7lNq0a	Test Admin	0948267379	\N	ADMIN	t	2026-03-14 03:09:25.364129+00	2026-03-14 03:09:25.364129+00
110	test-customer-1773457765293@gmail.com	$2a$10$ehDdmEAEM4b9LoPuVRdxx.81vBjvLKtDAW7nptRBScB8Xttm5qrTG	Test Customer	0980271791	\N	CUSTOMER	t	2026-03-14 03:09:25.444273+00	2026-03-14 03:09:25.444273+00
111	test-admin-1773457765530@laptopverse.vn	$2a$10$Q8RYJkZ2UxxZvNUF/dEPz.ArPqWkdd/Z0fVBRGlID3yEcLW66C3mm	Test Admin	0966408400	\N	ADMIN	t	2026-03-14 03:09:25.598882+00	2026-03-14 03:09:25.598882+00
112	test-customer-1773457765530@gmail.com	$2a$10$/LAt0nJGo0250gLIOSV8i.iL15h4ebm0MVE6IBnsET7gasug9pV7i	Test Customer	0992307988	\N	CUSTOMER	t	2026-03-14 03:09:25.670957+00	2026-03-14 03:09:25.670957+00
113	testuser-1773457765681@gmail.com	$2a$10$ptlkVvR0YeeBfsOtH0qJUu7ikIFl/f7FSsUF4wCJrY9e9gizq.Wdy	Test User	0917785386	\N	CUSTOMER	t	2026-03-14 03:09:25.757997+00	2026-03-14 03:09:25.757997+00
114	test-admin-1773457765873@laptopverse.vn	$2a$10$9dNdLfBs6M02FCLu.pZW7ex5jQ7Pp.4CVIFf9tXNw2O55330UABGC	Test Admin	0986708709	\N	ADMIN	t	2026-03-14 03:09:25.992336+00	2026-03-14 03:09:25.992336+00
115	test-customer-1773457765873@gmail.com	$2a$10$dGusYR/b8Gk/Ak1nZrgmruiIOqRtDHF1W2ZtZNTvgSg5FPJZws3fC	Test Customer	0919133862	\N	CUSTOMER	t	2026-03-14 03:09:26.090515+00	2026-03-14 03:09:26.091138+00
116	test-admin-1773457766325@laptopverse.vn	$2a$10$7/dwcPjmi5dkXxWZ0mpfsOBGIi9VTS3EEbwYTb3iYVViTp12FNn6a	Test Admin	0973771847	\N	ADMIN	t	2026-03-14 03:09:26.397761+00	2026-03-14 03:09:26.398723+00
117	test-customer-1773457766325@gmail.com	$2a$10$Gk9ksPhNm.M02TMJ7q1NQu5.OFAxWr1WJpS09pmLUJ1rA5QiE1eZS	Test Customer	0974863288	\N	CUSTOMER	t	2026-03-14 03:09:26.482437+00	2026-03-14 03:09:26.482437+00
118	test-admin-1773457766580@laptopverse.vn	$2a$10$crc6b34LqxpkXLbIVHCHzOOODBkjCLbhNO8q7ArY.t/kBpKO41cIW	Test Admin	0937744318	\N	ADMIN	t	2026-03-14 03:09:26.651713+00	2026-03-14 03:09:26.651713+00
119	test-customer-1773457766580@gmail.com	$2a$10$aBSrvMvPZkuFP64gMfJYauUGcTEOgOwUKhtUX6yopK/35rO.DrwXW	Test Customer	0950907592	\N	CUSTOMER	t	2026-03-14 03:09:26.730663+00	2026-03-14 03:09:26.730663+00
120	test-admin-1773457766797@laptopverse.vn	$2a$10$zibwx4xE8DXyHswH67CXne7C.A5nM7ffmaWRquz9DMw/5QqNf2oxa	Test Admin	0951405482	\N	ADMIN	t	2026-03-14 03:09:26.860686+00	2026-03-14 03:09:26.860686+00
121	test-customer-1773457766797@gmail.com	$2a$10$YbRCV/VQxVT4TrbgGJNS0.jGX0s8yvGhNo.094mXNiVp1Tk4AbMEe	Test Customer	0911019902	\N	CUSTOMER	t	2026-03-14 03:09:26.942057+00	2026-03-14 03:09:26.942057+00
122	test-admin-1773457767019@laptopverse.vn	$2a$10$9xFi/SvWNZjGhZ36FmBxzeCt4zpWX0Ps16JDHUGPjM7t6w4f6pIxe	Test Admin	0944341578	\N	ADMIN	t	2026-03-14 03:09:27.089295+00	2026-03-14 03:09:27.089295+00
123	test-customer-1773457767019@gmail.com	$2a$10$yr/MjFVfAonIAJPmq.NlIuCeVBNgVtSMO3pjRJt6h5oG01K/HKLJC	Test Customer	0990862835	\N	CUSTOMER	t	2026-03-14 03:09:27.162789+00	2026-03-14 03:09:27.162789+00
124	test-admin-1773457767189@laptopverse.vn	$2a$10$649TGQLzVrOiONDdqQIz6ecCcRyPPMas4wfJQu/FXqabBD6kX1IEi	Test Admin	0918223424	\N	ADMIN	t	2026-03-14 03:09:27.254781+00	2026-03-14 03:09:27.254781+00
125	test-customer-1773457767189@gmail.com	$2a$10$XVO0CMdCYzVYL6Xvt4lniOS8nJwVPVHncUbaKUjFu2NKhmpncNvce	Test Customer	0923124054	\N	CUSTOMER	t	2026-03-14 03:09:27.332023+00	2026-03-14 03:09:27.332023+00
126	test-admin-1773457767415@laptopverse.vn	$2a$10$UQYfhB.0J3hcyeGoRIZqXuPg/SWx4S3l19R9VP.sPFwViMML18ao6	Test Admin	0972702602	\N	ADMIN	t	2026-03-14 03:09:27.484683+00	2026-03-14 03:09:27.484683+00
127	test-customer-1773457767415@gmail.com	$2a$10$xhQ1V9GQvWEUFeIBpGSpAOhqgMyduuQGPxqa7MbyyCnxDRzl9f.Fi	Test Customer	0999243518	\N	CUSTOMER	t	2026-03-14 03:09:27.569833+00	2026-03-14 03:09:27.569833+00
128	test-admin-1773457767583@laptopverse.vn	$2a$10$.HxhYoVEv9ltosH0uEWXcuPlY5R.ikkmB4WP6bMDBo0ZujWZeici6	Test Admin	0966078409	\N	ADMIN	t	2026-03-14 03:09:27.650008+00	2026-03-14 03:09:27.650008+00
129	test-customer-1773457767583@gmail.com	$2a$10$628Xok/LXQkFVU2JnyCZmOTYIik6xPx14WglCSoU8Ftgs0wKdoEBO	Test Customer	0917064475	\N	CUSTOMER	t	2026-03-14 03:09:27.714727+00	2026-03-14 03:09:27.714727+00
130	test-admin-1773457767768@laptopverse.vn	$2a$10$o4/O165Jb3MwaKyo.jQDS.l4J/yegaVlinKdjPxerSlqJpsHpoQgO	Test Admin	0976683368	\N	ADMIN	t	2026-03-14 03:09:27.838192+00	2026-03-14 03:09:27.838192+00
131	test-customer-1773457767768@gmail.com	$2a$10$aaQ.fMDno2nIu6ynFjXlFujfQZSHJZ/6AVYTAj/ZRHeHIQ68G0HMe	Test Customer	0938712488	\N	CUSTOMER	t	2026-03-14 03:09:27.911212+00	2026-03-14 03:09:27.911212+00
132	test-admin-1773457767989@laptopverse.vn	$2a$10$.eJc3LB2iKFUr8LeEuxaQOPGgiDDNVcjXeD4AK15chhfVUUXhxVeS	Test Admin	0972478103	\N	ADMIN	t	2026-03-14 03:09:28.14959+00	2026-03-14 03:09:28.14959+00
133	test-customer-1773457767989@gmail.com	$2a$10$/SYEjiZ/8Ke0fR1CvRIYDeXc4E0Bz8Y2tVjeKc6/tR/ONxRYZl.Q2	Test Customer	0953979359	\N	CUSTOMER	t	2026-03-14 03:09:28.221901+00	2026-03-14 03:09:28.221901+00
134	test-admin-1773457768296@laptopverse.vn	$2a$10$tLlQHecTwMtVV6cvP4ug3.ZDV7OAP0OvpXRO/pDd7.AaHHsZ.pA1y	Test Admin	0998235697	\N	ADMIN	t	2026-03-14 03:09:28.362741+00	2026-03-14 03:09:28.362741+00
135	test-customer-1773457768296@gmail.com	$2a$10$oQbrYdOabj/bUT2hhlFCW.uLYUkZOZNlGuLTQmdZ2mbXuWAGEN1pa	Test Customer	0920346631	\N	CUSTOMER	t	2026-03-14 03:09:28.444291+00	2026-03-14 03:09:28.444291+00
136	test-admin-1773457768534@laptopverse.vn	$2a$10$jmX46S7/3csDGRVijUM.oexvKTPbbdmWAsLSTnhPeJDEaDm26/1GW	Test Admin	0911364954	\N	ADMIN	t	2026-03-14 03:09:28.600783+00	2026-03-14 03:09:28.600783+00
137	test-customer-1773457768534@gmail.com	$2a$10$CrcidDc3zT81yFM.XJDaROjco98JG.VSJlhkDX6PVimkj1dJNLCPC	Test Customer	0920483799	\N	CUSTOMER	t	2026-03-14 03:09:28.675019+00	2026-03-14 03:09:28.675019+00
138	test-admin-1773457768711@laptopverse.vn	$2a$10$PCSyFtjluhnZqOfbq9gAheHKiqNHQEtvefycNb3Vhh1GlS43IFOCu	Test Admin	0943974010	\N	ADMIN	t	2026-03-14 03:09:28.785635+00	2026-03-14 03:09:28.785635+00
139	test-customer-1773457768711@gmail.com	$2a$10$.1YxvuvQNcbeQyrmCTjeau3LYha3teR0EIVXbzC4lcuJWua7WOPfS	Test Customer	0981204132	\N	CUSTOMER	t	2026-03-14 03:09:28.859257+00	2026-03-14 03:09:28.859257+00
140	test-admin-1773457768884@laptopverse.vn	$2a$10$rjKRFc.e3valbxxAjMWyBOMj9ciuksC2lRzXuzD4Lyvgr3nb9KJSm	Test Admin	0926478731	\N	ADMIN	t	2026-03-14 03:09:28.950796+00	2026-03-14 03:09:28.950796+00
141	test-customer-1773457768884@gmail.com	$2a$10$RmAUgC/aD7zwO9PehPkNBOk.E7zTusMsdllNszLOhCLfrvf5XdcLy	Test Customer	0926194870	\N	CUSTOMER	t	2026-03-14 03:09:29.02545+00	2026-03-14 03:09:29.02545+00
142	test-admin-1773457769042@laptopverse.vn	$2a$10$B7Qhl/1OOAvGD92uOry0buqE2Cu9hxBsZ8bnFl9GusrBcr8upO7Xi	Test Admin	0916463446	\N	ADMIN	t	2026-03-14 03:09:29.110474+00	2026-03-14 03:09:29.110474+00
143	test-customer-1773457769042@gmail.com	$2a$10$STIBkkVPAmlJtfHB37pJNuNe7V8SvZeAwE2w27Di3j/XKsJgBmfbi	Test Customer	0964108055	\N	CUSTOMER	t	2026-03-14 03:09:29.183632+00	2026-03-14 03:09:29.183632+00
144	test-admin-1773457769225@laptopverse.vn	$2a$10$7tVJCGNBps0ant3k6CyVqeUiALXEYCaXfoUYYKfQggm0mkWfiZEmu	Test Admin	0940108687	\N	ADMIN	t	2026-03-14 03:09:29.295668+00	2026-03-14 03:09:29.295668+00
145	test-customer-1773457769225@gmail.com	$2a$10$afK8.ie.ickBhCpERLIaAuIH44r4YfIhAobfpVbg80s9ypahOEZpS	Test Customer	0916004724	\N	CUSTOMER	t	2026-03-14 03:09:29.362095+00	2026-03-14 03:09:29.362095+00
146	test-admin-1773457769390@laptopverse.vn	$2a$10$4u9U5E02FhRwNAVVb0NOBe2I/PPyKFG5xVTOt7Fwc4/6mngOrTGc6	Test Admin	0996409058	\N	ADMIN	t	2026-03-14 03:09:29.456645+00	2026-03-14 03:09:29.456645+00
147	test-customer-1773457769390@gmail.com	$2a$10$9.SL.uOYjjU0eD1MgWs3c.KpaRVnGS5MiXQn7fXw2tCpplXEUUXQK	Test Customer	0942836732	\N	CUSTOMER	t	2026-03-14 03:09:29.53521+00	2026-03-14 03:09:29.53521+00
148	test-admin-1773457769558@laptopverse.vn	$2a$10$4jBi9zwrN4ijrlxPCoiHj.NM6kSHqVKAas14tNFokiKFjk66EE7EK	Test Admin	0967287738	\N	ADMIN	t	2026-03-14 03:09:29.625049+00	2026-03-14 03:09:29.625049+00
149	test-customer-1773457769558@gmail.com	$2a$10$DmbTeh/W0sIGBPZfIf1d4e0WOlXql9ZGIxRFE7kUj0xX/j5yW21pm	Test Customer	0916495670	\N	CUSTOMER	t	2026-03-14 03:09:29.700172+00	2026-03-14 03:09:29.700172+00
150	test-admin-1773457769750@laptopverse.vn	$2a$10$DYcYSuexFXO9nF34ifxXtO1VHzjo.qrzZHJeYEba1tx4jsJTdWYdS	Test Admin	0912441578	\N	ADMIN	t	2026-03-14 03:09:29.818756+00	2026-03-14 03:09:29.818756+00
151	test-customer-1773457769750@gmail.com	$2a$10$HofUJckWUZH4Iwp7xn5tme9BY1Q6Hy7/FevHFZMc59tO2MbOUFdbm	Test Customer	0983695092	\N	CUSTOMER	t	2026-03-14 03:09:29.898755+00	2026-03-14 03:09:29.898755+00
152	test-admin-1773457769916@laptopverse.vn	$2a$10$v9gG2XtS63JAAHxvHd6FUuCB2lfIyEQghiCgJWPCrfod.PHPkEAEq	Test Admin	0985862247	\N	ADMIN	t	2026-03-14 03:09:29.982918+00	2026-03-14 03:09:29.982918+00
153	test-customer-1773457769916@gmail.com	$2a$10$AA/hWRcyYgPbRuFbGb5j.e.rHHNfDJrnG1qkCpSwJpvgqkW1Amuym	Test Customer	0924622647	\N	CUSTOMER	t	2026-03-14 03:09:30.055492+00	2026-03-14 03:09:30.055492+00
154	test-admin-1773457770092@laptopverse.vn	$2a$10$Ub7ASZ5TeP1XEaScaZ8g7uTo9mcjfERsP9KQw.ipBylweyVy9Xl8G	Test Admin	0993350277	\N	ADMIN	t	2026-03-14 03:09:30.159239+00	2026-03-14 03:09:30.159239+00
155	test-customer-1773457770092@gmail.com	$2a$10$CWW5mAse9ZMUp83HeTWHDOp/A0plgb.tsJ4DraUYVTA6arpshXxES	Test Customer	0944827943	\N	CUSTOMER	t	2026-03-14 03:09:30.23888+00	2026-03-14 03:09:30.23888+00
156	test-admin-1773457770305@laptopverse.vn	$2a$10$V//sRkHrl20SeuBL3NPwQOQZjHUbJz5tXkRBjU2WKDlmGicrga.Yi	Test Admin	0939038729	\N	ADMIN	t	2026-03-14 03:09:30.371297+00	2026-03-14 03:09:30.371297+00
157	test-customer-1773457770305@gmail.com	$2a$10$AwNSoQCv6LBEaBjm2mdIMOc8GvAZJPVnW/MA.uc9a32bAKXw47awm	Test Customer	0928586664	\N	CUSTOMER	t	2026-03-14 03:09:30.444687+00	2026-03-14 03:09:30.444687+00
158	test-admin-1773457770471@laptopverse.vn	$2a$10$QRO..Gucn/Ms8S9CeMIkeeAVYVr165S.sKZTxMqegjTH6COu/Gqju	Test Admin	0925193159	\N	ADMIN	t	2026-03-14 03:09:30.538332+00	2026-03-14 03:09:30.538332+00
159	test-customer-1773457770471@gmail.com	$2a$10$E2AeKDncypOZ3dk5wXrrkeALDPP9FzgDOsEDaPiHe7HyFLUbhJN32	Test Customer	0931731037	\N	CUSTOMER	t	2026-03-14 03:09:30.613524+00	2026-03-14 03:09:30.613524+00
160	test-admin-1773457770643@laptopverse.vn	$2a$10$la6On4iwkQWLhi5N3SZnHOQTsRpAfiNBAenDN/0muGXs99W6Bry/a	Test Admin	0969099550	\N	ADMIN	t	2026-03-14 03:09:30.714833+00	2026-03-14 03:09:30.714833+00
161	test-customer-1773457770643@gmail.com	$2a$10$Eq6lWoi5Fy5RsEb35UcZe.eh5DGrwg9nF197QweD6LRIClz1YHP1W	Test Customer	0996633494	\N	CUSTOMER	t	2026-03-14 03:09:30.790689+00	2026-03-14 03:09:30.790689+00
162	test-admin-1773457770814@laptopverse.vn	$2a$10$x1seZjpVnlPwEuUHjv3LNehq3UxAXMVS2/3/fyaMbMvPLiLnaRsZK	Test Admin	0979622810	\N	ADMIN	t	2026-03-14 03:09:30.898685+00	2026-03-14 03:09:30.898685+00
163	test-customer-1773457770814@gmail.com	$2a$10$HcS3S.Ebvlt7YVsZ1NpTHOePRJESBRJwNGM05jd2DsvY4kgEX7TJO	Test Customer	0972680914	\N	CUSTOMER	t	2026-03-14 03:09:30.990859+00	2026-03-14 03:09:30.990859+00
164	test-admin-1773457771014@laptopverse.vn	$2a$10$3wnHhEUyVX5PUe3RWt7IdeytmiMFmCp6O.dMn8NXhqBTpiIa68XSK	Test Admin	0922462998	\N	ADMIN	t	2026-03-14 03:09:31.091724+00	2026-03-14 03:09:31.091724+00
165	test-customer-1773457771014@gmail.com	$2a$10$/H5Az/QoJDOvpRQTYEtzZOeqOCdCc8W6lvcNCvp1Qf9Omzl4Yprb.	Test Customer	0987073522	\N	CUSTOMER	t	2026-03-14 03:09:31.168518+00	2026-03-14 03:09:31.168518+00
166	test-admin-1773457771205@laptopverse.vn	$2a$10$0AH.SbcKy54BeDzmdRNL8uJf3rS9q54ZjbjoMek8FFpQGJ.awH2aC	Test Admin	0939341806	\N	ADMIN	t	2026-03-14 03:09:31.271693+00	2026-03-14 03:09:31.271693+00
167	test-customer-1773457771205@gmail.com	$2a$10$lMOPtcJOjtVKGZ6VRJDoeu2ry5Bc21bKXn4ebyuV1pKeE1dbw2asO	Test Customer	0953579109	\N	CUSTOMER	t	2026-03-14 03:09:31.345488+00	2026-03-14 03:09:31.345488+00
168	test-admin-1773457771378@laptopverse.vn	$2a$10$8Y9wyngJP0rbrrK.vIylGubesWXLi3DCL9Ee3n2OWkDzhXb7Q8FoG	Test Admin	0989173405	\N	ADMIN	t	2026-03-14 03:09:31.447767+00	2026-03-14 03:09:31.447767+00
169	test-customer-1773457771378@gmail.com	$2a$10$Hz6qKP91MJTFpWmvkxTjse2pCtGWu66BtTwSFqNUY4MywxCnwgmtO	Test Customer	0923593317	\N	CUSTOMER	t	2026-03-14 03:09:31.531247+00	2026-03-14 03:09:31.531247+00
170	test-admin-1773457771696@laptopverse.vn	$2a$10$0z8QW9to9brGSRsrrwToKuQe.PspXIbzMgJoaczRM0O1N25FEsc0u	Test Admin	0993379264	\N	ADMIN	t	2026-03-14 03:09:31.765222+00	2026-03-14 03:09:31.765222+00
171	test-customer-1773457771696@gmail.com	$2a$10$jhz7PJ9SxNLQc6zWmuRedu80kTHdOT8DJ/lUlqBcCvr1TgsJOkAim	Test Customer	0917854255	\N	CUSTOMER	t	2026-03-14 03:09:31.840538+00	2026-03-14 03:09:31.840538+00
172	test-admin-1773457771852@laptopverse.vn	$2a$10$U.x93/ESGUfWY3HiZvbRf.Qt2d6O.8dG0yAGpDgiKTlBR1PrfNdHy	Test Admin	0963565292	\N	ADMIN	t	2026-03-14 03:09:31.91944+00	2026-03-14 03:09:31.91944+00
173	test-customer-1773457771852@gmail.com	$2a$10$z0WkoKGRLx2Y9jaBHJyL8.AVWvWisLmoMJuTDxeIeMjH1/3dujvIq	Test Customer	0960924638	\N	CUSTOMER	t	2026-03-14 03:09:31.994448+00	2026-03-14 03:09:31.994448+00
174	test-admin-1773457772034@laptopverse.vn	$2a$10$zR2Ii2C48T6yv8d6.T.bN.W75VHq/vaqyaniih9aTUB9n86wUBGhS	Test Admin	0972523461	\N	ADMIN	t	2026-03-14 03:09:32.126682+00	2026-03-14 03:09:32.126682+00
175	test-customer-1773457772034@gmail.com	$2a$10$FfE8iL6ml6u2tbrKWs5RNeaBMs8uHqyru2V0CG5E1qoowLcJgM6o2	Test Customer	0937320149	\N	CUSTOMER	t	2026-03-14 03:09:32.19832+00	2026-03-14 03:09:32.19832+00
176	test-admin-1773457772254@laptopverse.vn	$2a$10$.WU5Bu9jGOdsL926rEaPZeFEuZ1Me5KEKl8rUfgFS71si4i32K9iq	Test Admin	0951714991	\N	ADMIN	t	2026-03-14 03:09:32.328504+00	2026-03-14 03:09:32.328504+00
177	test-customer-1773457772254@gmail.com	$2a$10$sro9347lokLtbFO80JW05euxRdYPFus22QhCNVUQjKa5I0FK5FkWy	Test Customer	0936562229	\N	CUSTOMER	t	2026-03-14 03:09:32.407783+00	2026-03-14 03:09:32.407783+00
178	test-admin-1773457772474@laptopverse.vn	$2a$10$6aSK/tPiAz1iBHc4yUIzDuLHSZDwBQwmbgE8kWkuQM57f/kKGlHd.	Test Admin	0967023824	\N	ADMIN	t	2026-03-14 03:09:32.548717+00	2026-03-14 03:09:32.548717+00
179	test-customer-1773457772474@gmail.com	$2a$10$NtSJ7U4LImsL7x.CGWJ8GueUx.3d9.SJvEK9GAsSGHhlnGems3BJS	Test Customer	0990914497	\N	CUSTOMER	t	2026-03-14 03:09:32.628029+00	2026-03-14 03:09:32.628029+00
180	test-admin-1773457772638@laptopverse.vn	$2a$10$mty8eS8QiGPHIUR49IeNX.nF7mbEEDgWRVf.V6h7SCYN1rN2ZGv8m	Test Admin	0939550290	\N	ADMIN	t	2026-03-14 03:09:32.70444+00	2026-03-14 03:09:32.70444+00
181	test-customer-1773457772638@gmail.com	$2a$10$s55vQ94hS9TCTv11dOIOzugOOYdubEQ8pFVYjVoaW7emqxQ1ZkIxq	Test Customer	0921165479	\N	CUSTOMER	t	2026-03-14 03:09:32.783129+00	2026-03-14 03:09:32.783129+00
182	test-admin-1773457772808@laptopverse.vn	$2a$10$eqAbVyFKTcI5MZCaEV/qZOBrj3WNjD.cZ4Wl7GDOIsQ0NJBxZfdmC	Test Admin	0926425154	\N	ADMIN	t	2026-03-14 03:09:32.88166+00	2026-03-14 03:09:32.88166+00
183	test-customer-1773457772808@gmail.com	$2a$10$AHNjjGdJ.mom//Gbi1G.Ye5n4vlZhdNIrcExWL.LDNJW2MhZDlw2K	Test Customer	0988720952	\N	CUSTOMER	t	2026-03-14 03:09:32.953735+00	2026-03-14 03:09:32.953735+00
184	test-admin-1773457773014@laptopverse.vn	$2a$10$H3Yyi5rhJjXIPgi6oHlmFu7km6.R21xiXNXx1LoGpLnxiCUKyu5jS	Test Admin	0946695848	\N	ADMIN	t	2026-03-14 03:09:33.081921+00	2026-03-14 03:09:33.081921+00
185	test-customer-1773457773014@gmail.com	$2a$10$Wl.okwlgkMjPuSAUhJhyReen4PtC1UCPk5PT6qtIxP.RGi2uhsOgW	Test Customer	0934226826	\N	CUSTOMER	t	2026-03-14 03:09:33.152276+00	2026-03-14 03:09:33.152276+00
186	dominhduc@gmail.com	$2a$10$weFVmxqv2qmMD8.1qL.OCORQl7LxI9KPFDDD22Il1OgMbfYlMEp2.	dominhduc	0346748114	\N	ADMIN	t	2026-03-14 03:49:33.817652+00	2026-03-17 16:17:00.774195+00
187	user1@gmail.com	$2a$10$euLNWBhSSpJbdXxDjsHgf.KJhrOJj2aPibNCpAVb5RUK7Fl4Ml5Iu	user1	0346748124	\N	CUSTOMER	t	2026-03-18 07:16:20.523188+00	2026-03-18 07:16:20.524702+00
\.


--
-- TOC entry 3699 (class 0 OID 0)
-- Dependencies: 219
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.brands_id_seq', 8, true);


--
-- TOC entry 3700 (class 0 OID 0)
-- Dependencies: 233
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 7, true);


--
-- TOC entry 3701 (class 0 OID 0)
-- Dependencies: 217
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 3, true);


--
-- TOC entry 3702 (class 0 OID 0)
-- Dependencies: 231
-- Name: flash_sale_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.flash_sale_items_id_seq', 5, true);


--
-- TOC entry 3703 (class 0 OID 0)
-- Dependencies: 229
-- Name: flash_sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.flash_sales_id_seq', 1, true);


--
-- TOC entry 3704 (class 0 OID 0)
-- Dependencies: 239
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_id_seq', 9, true);


--
-- TOC entry 3705 (class 0 OID 0)
-- Dependencies: 237
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 8, true);


--
-- TOC entry 3706 (class 0 OID 0)
-- Dependencies: 227
-- Name: product_gifts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_gifts_id_seq', 37, true);


--
-- TOC entry 3707 (class 0 OID 0)
-- Dependencies: 223
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_images_id_seq', 90, true);


--
-- TOC entry 3708 (class 0 OID 0)
-- Dependencies: 225
-- Name: product_specs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_specs_id_seq', 146, true);


--
-- TOC entry 3709 (class 0 OID 0)
-- Dependencies: 221
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 18, true);


--
-- TOC entry 3710 (class 0 OID 0)
-- Dependencies: 243
-- Name: review_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.review_images_id_seq', 1, false);


--
-- TOC entry 3711 (class 0 OID 0)
-- Dependencies: 241
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 12, true);


--
-- TOC entry 3712 (class 0 OID 0)
-- Dependencies: 235
-- Name: shipping_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shipping_addresses_id_seq', 13, true);


--
-- TOC entry 3713 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 187, true);


--
-- TOC entry 3423 (class 2606 OID 32813)
-- Name: brands brands_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_name_key UNIQUE (name);


--
-- TOC entry 3425 (class 2606 OID 32811)
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- TOC entry 3427 (class 2606 OID 32815)
-- Name: brands brands_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_slug_key UNIQUE (slug);


--
-- TOC entry 3458 (class 2606 OID 32945)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3460 (class 2606 OID 32947)
-- Name: cart_items cart_items_user_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_product_id_key UNIQUE (user_id, product_id);


--
-- TOC entry 3417 (class 2606 OID 32799)
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- TOC entry 3419 (class 2606 OID 32797)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3421 (class 2606 OID 32801)
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- TOC entry 3452 (class 2606 OID 32923)
-- Name: flash_sale_items flash_sale_items_flash_sale_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flash_sale_items
    ADD CONSTRAINT flash_sale_items_flash_sale_id_product_id_key UNIQUE (flash_sale_id, product_id);


--
-- TOC entry 3454 (class 2606 OID 32921)
-- Name: flash_sale_items flash_sale_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flash_sale_items
    ADD CONSTRAINT flash_sale_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3450 (class 2606 OID 32913)
-- Name: flash_sales flash_sales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flash_sales
    ADD CONSTRAINT flash_sales_pkey PRIMARY KEY (id);


--
-- TOC entry 3474 (class 2606 OID 33018)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3469 (class 2606 OID 32995)
-- Name: orders orders_order_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_code_key UNIQUE (order_code);


--
-- TOC entry 3471 (class 2606 OID 32993)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3448 (class 2606 OID 32897)
-- Name: product_gifts product_gifts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_gifts
    ADD CONSTRAINT product_gifts_pkey PRIMARY KEY (id);


--
-- TOC entry 3442 (class 2606 OID 32868)
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- TOC entry 3445 (class 2606 OID 32882)
-- Name: product_specs product_specs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_specs
    ADD CONSTRAINT product_specs_pkey PRIMARY KEY (id);


--
-- TOC entry 3437 (class 2606 OID 32837)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 3439 (class 2606 OID 32839)
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_key UNIQUE (slug);


--
-- TOC entry 3484 (class 2606 OID 33068)
-- Name: review_images review_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_images
    ADD CONSTRAINT review_images_pkey PRIMARY KEY (id);


--
-- TOC entry 3479 (class 2606 OID 33043)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 3481 (class 2606 OID 33045)
-- Name: reviews reviews_product_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_user_id_key UNIQUE (product_id, user_id);


--
-- TOC entry 3464 (class 2606 OID 32970)
-- Name: shipping_addresses shipping_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT shipping_addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 3411 (class 2606 OID 32783)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3413 (class 2606 OID 32785)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 3415 (class 2606 OID 32781)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3461 (class 1259 OID 32958)
-- Name: idx_cart_items_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cart_items_user ON public.cart_items USING btree (user_id);


--
-- TOC entry 3455 (class 1259 OID 32935)
-- Name: idx_flash_sale_items_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_flash_sale_items_product ON public.flash_sale_items USING btree (product_id);


--
-- TOC entry 3456 (class 1259 OID 32934)
-- Name: idx_flash_sale_items_sale; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_flash_sale_items_sale ON public.flash_sale_items USING btree (flash_sale_id);


--
-- TOC entry 3472 (class 1259 OID 33029)
-- Name: idx_order_items_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_items_order ON public.order_items USING btree (order_id);


--
-- TOC entry 3465 (class 1259 OID 33007)
-- Name: idx_orders_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_code ON public.orders USING btree (order_code);


--
-- TOC entry 3466 (class 1259 OID 33008)
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_status ON public.orders USING btree (order_status);


--
-- TOC entry 3467 (class 1259 OID 33006)
-- Name: idx_orders_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_user ON public.orders USING btree (user_id);


--
-- TOC entry 3446 (class 1259 OID 32903)
-- Name: idx_product_gifts_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_gifts_product ON public.product_gifts USING btree (product_id);


--
-- TOC entry 3440 (class 1259 OID 32874)
-- Name: idx_product_images_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_images_product ON public.product_images USING btree (product_id);


--
-- TOC entry 3443 (class 1259 OID 32888)
-- Name: idx_product_specs_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_specs_product ON public.product_specs USING btree (product_id);


--
-- TOC entry 3428 (class 1259 OID 32855)
-- Name: idx_products_badge; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_badge ON public.products USING btree (badge) WHERE (badge IS NOT NULL);


--
-- TOC entry 3429 (class 1259 OID 32850)
-- Name: idx_products_brand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_brand ON public.products USING btree (brand_id);


--
-- TOC entry 3430 (class 1259 OID 32851)
-- Name: idx_products_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_category ON public.products USING btree (category_id);


--
-- TOC entry 3431 (class 1259 OID 32852)
-- Name: idx_products_price; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_price ON public.products USING btree (price);


--
-- TOC entry 3432 (class 1259 OID 32853)
-- Name: idx_products_rating; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_rating ON public.products USING btree (rating DESC);


--
-- TOC entry 3433 (class 1259 OID 32857)
-- Name: idx_products_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_slug ON public.products USING btree (slug);


--
-- TOC entry 3434 (class 1259 OID 32854)
-- Name: idx_products_sold; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_sold ON public.products USING btree (sold_count DESC);


--
-- TOC entry 3435 (class 1259 OID 32856)
-- Name: idx_products_specs; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_specs ON public.products USING gin (specs);


--
-- TOC entry 3482 (class 1259 OID 33074)
-- Name: idx_review_images_review; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_images_review ON public.review_images USING btree (review_id);


--
-- TOC entry 3475 (class 1259 OID 33056)
-- Name: idx_reviews_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_product ON public.reviews USING btree (product_id);


--
-- TOC entry 3476 (class 1259 OID 33058)
-- Name: idx_reviews_rating; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_rating ON public.reviews USING btree (rating);


--
-- TOC entry 3477 (class 1259 OID 33057)
-- Name: idx_reviews_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_user ON public.reviews USING btree (user_id);


--
-- TOC entry 3462 (class 1259 OID 32976)
-- Name: idx_shipping_addresses_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shipping_addresses_user ON public.shipping_addresses USING btree (user_id);


--
-- TOC entry 3408 (class 1259 OID 32786)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 3409 (class 1259 OID 32787)
-- Name: idx_users_phone; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_phone ON public.users USING btree (phone);


--
-- TOC entry 3504 (class 2620 OID 33078)
-- Name: cart_items trg_cart_items_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3505 (class 2620 OID 33079)
-- Name: orders trg_orders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3503 (class 2620 OID 33077)
-- Name: products trg_products_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3502 (class 2620 OID 33076)
-- Name: users trg_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3492 (class 2606 OID 32953)
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3493 (class 2606 OID 32948)
-- Name: cart_items cart_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3490 (class 2606 OID 32924)
-- Name: flash_sale_items flash_sale_items_flash_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flash_sale_items
    ADD CONSTRAINT flash_sale_items_flash_sale_id_fkey FOREIGN KEY (flash_sale_id) REFERENCES public.flash_sales(id);


--
-- TOC entry 3491 (class 2606 OID 32929)
-- Name: flash_sale_items flash_sale_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flash_sale_items
    ADD CONSTRAINT flash_sale_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3497 (class 2606 OID 33019)
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 3498 (class 2606 OID 33024)
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3495 (class 2606 OID 40968)
-- Name: orders orders_shipping_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_shipping_address_id_fkey FOREIGN KEY (shipping_address_id) REFERENCES public.shipping_addresses(id) ON DELETE SET NULL;


--
-- TOC entry 3496 (class 2606 OID 32996)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3489 (class 2606 OID 32898)
-- Name: product_gifts product_gifts_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_gifts
    ADD CONSTRAINT product_gifts_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3487 (class 2606 OID 32869)
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3488 (class 2606 OID 32883)
-- Name: product_specs product_specs_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_specs
    ADD CONSTRAINT product_specs_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3485 (class 2606 OID 32840)
-- Name: products products_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id);


--
-- TOC entry 3486 (class 2606 OID 32845)
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 3501 (class 2606 OID 33069)
-- Name: review_images review_images_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_images
    ADD CONSTRAINT review_images_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- TOC entry 3499 (class 2606 OID 33046)
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3500 (class 2606 OID 33051)
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3494 (class 2606 OID 32971)
-- Name: shipping_addresses shipping_addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT shipping_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-03-28 14:21:51

--
-- PostgreSQL database dump complete
--

