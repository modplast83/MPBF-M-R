--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: aba_formula_materials; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.aba_formula_materials (
    id integer NOT NULL,
    formula_id integer NOT NULL,
    material_id integer NOT NULL,
    screw_a_percentage double precision NOT NULL,
    screw_b_percentage double precision NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.aba_formula_materials OWNER TO neondb_owner;

--
-- Name: aba_formula_materials_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.aba_formula_materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.aba_formula_materials_id_seq OWNER TO neondb_owner;

--
-- Name: aba_formula_materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.aba_formula_materials_id_seq OWNED BY public.aba_formula_materials.id;


--
-- Name: aba_formulas; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.aba_formulas (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    ab_ratio text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    created_by text NOT NULL
);


ALTER TABLE public.aba_formulas OWNER TO neondb_owner;

--
-- Name: aba_formulas_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.aba_formulas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.aba_formulas_id_seq OWNER TO neondb_owner;

--
-- Name: aba_formulas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.aba_formulas_id_seq OWNED BY public.aba_formulas.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.categories (
    id text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    name_ar text
);


ALTER TABLE public.categories OWNER TO neondb_owner;

--
-- Name: corrective_actions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.corrective_actions (
    id integer NOT NULL,
    quality_check_id integer,
    action text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    assigned_to text,
    completed_by text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp without time zone,
    implemented_by character varying,
    implementation_date date,
    verified_by character varying,
    verified_date date,
    verification_notes text
);


ALTER TABLE public.corrective_actions OWNER TO neondb_owner;

--
-- Name: corrective_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.corrective_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.corrective_actions_id_seq OWNER TO neondb_owner;

--
-- Name: corrective_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.corrective_actions_id_seq OWNED BY public.corrective_actions.id;


--
-- Name: customer_information; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.customer_information (
    id integer NOT NULL,
    commercial_name_ar text,
    commercial_name_en text,
    commercial_registration_no character varying(10),
    unified_no character varying(10),
    vat_no character varying(14),
    province text NOT NULL,
    city text,
    neighbor_name text,
    building_no character varying(4),
    additional_no character varying(4),
    postal_code character varying(5),
    response_name text,
    response_no text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.customer_information OWNER TO neondb_owner;

--
-- Name: customer_information_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.customer_information_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_information_id_seq OWNER TO neondb_owner;

--
-- Name: customer_information_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.customer_information_id_seq OWNED BY public.customer_information.id;


--
-- Name: customer_products; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.customer_products (
    id integer NOT NULL,
    customer_id character varying(512),
    category_id character varying(512),
    item_id character varying(512),
    size_caption character varying(512),
    width numeric,
    left_f numeric,
    right_f numeric,
    thickness numeric,
    thickness_one numeric,
    printing_cylinder numeric,
    length_cm numeric,
    cutting_length_cm numeric,
    raw_material character varying(512),
    master_batch_id character varying(512),
    printed character varying(512),
    cutting_unit character varying(512),
    unit_weight_kg numeric,
    packing character varying(512),
    punching character varying(512),
    cover character varying(512),
    volum numeric,
    knife character varying(512),
    notes character varying(512),
    unit_qty numeric,
    package_kg numeric(10,2),
    cliche_front_design text,
    cliche_back_design text
);


ALTER TABLE public.customer_products OWNER TO neondb_owner;

--
-- Name: customer_products_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.customer_products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_products_id_seq OWNER TO neondb_owner;

--
-- Name: customer_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.customer_products_id_seq OWNED BY public.customer_products.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.customers (
    id text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    name_ar text,
    user_id text,
    plate_drawer_code text
);


ALTER TABLE public.customers OWNER TO neondb_owner;

--
-- Name: document_approvals; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.document_approvals (
    id integer NOT NULL,
    document_id integer NOT NULL,
    approver_id character varying(50) NOT NULL,
    approval_status character varying(20) DEFAULT 'pending'::character varying,
    approval_date timestamp without time zone,
    comments text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT document_approvals_approval_status_check CHECK (((approval_status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[])))
);


ALTER TABLE public.document_approvals OWNER TO neondb_owner;

--
-- Name: document_approvals_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.document_approvals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.document_approvals_id_seq OWNER TO neondb_owner;

--
-- Name: document_approvals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.document_approvals_id_seq OWNED BY public.document_approvals.id;


--
-- Name: document_comments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.document_comments (
    id integer NOT NULL,
    document_id integer NOT NULL,
    comment_text text NOT NULL,
    commented_by character varying(50) NOT NULL,
    parent_comment_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.document_comments OWNER TO neondb_owner;

--
-- Name: document_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.document_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.document_comments_id_seq OWNER TO neondb_owner;

--
-- Name: document_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.document_comments_id_seq OWNED BY public.document_comments.id;


--
-- Name: document_subscriptions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.document_subscriptions (
    id integer NOT NULL,
    document_id integer NOT NULL,
    user_id character varying(50) NOT NULL,
    subscription_type character varying(20) DEFAULT 'updates'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT document_subscriptions_subscription_type_check CHECK (((subscription_type)::text = ANY ((ARRAY['updates'::character varying, 'comments'::character varying, 'approvals'::character varying])::text[])))
);


ALTER TABLE public.document_subscriptions OWNER TO neondb_owner;

--
-- Name: document_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.document_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.document_subscriptions_id_seq OWNER TO neondb_owner;

--
-- Name: document_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.document_subscriptions_id_seq OWNED BY public.document_subscriptions.id;


--
-- Name: document_templates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.document_templates (
    id integer NOT NULL,
    template_name character varying(255) NOT NULL,
    document_type character varying(50) NOT NULL,
    template_content text NOT NULL,
    description text,
    is_default boolean DEFAULT false,
    created_by character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    template_variables text[],
    is_active boolean DEFAULT true,
    version integer DEFAULT 1,
    parent_template_id integer,
    category text,
    department text,
    access_level text DEFAULT 'standard'::text,
    usage_count integer DEFAULT 0,
    last_used_at timestamp without time zone
);


ALTER TABLE public.document_templates OWNER TO neondb_owner;

--
-- Name: document_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.document_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.document_templates_id_seq OWNER TO neondb_owner;

--
-- Name: document_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.document_templates_id_seq OWNED BY public.document_templates.id;


--
-- Name: document_views; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.document_views (
    id integer NOT NULL,
    document_id integer NOT NULL,
    viewed_by character varying(50) NOT NULL,
    viewed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ip_address character varying(45),
    user_agent text,
    device_type character varying(20) DEFAULT 'desktop'::character varying,
    view_duration integer DEFAULT 0
);


ALTER TABLE public.document_views OWNER TO neondb_owner;

--
-- Name: document_views_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.document_views_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.document_views_id_seq OWNER TO neondb_owner;

--
-- Name: document_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.document_views_id_seq OWNED BY public.document_views.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    document_number character varying(50) NOT NULL,
    document_type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    status character varying(20) DEFAULT 'draft'::character varying,
    priority character varying(20) DEFAULT 'medium'::character varying,
    created_by character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    effective_date date,
    expiry_date date,
    category character varying(100),
    tags text[],
    view_count integer DEFAULT 0,
    is_archived boolean DEFAULT false,
    archived_at timestamp without time zone,
    archived_by character varying(50),
    archive_reason text,
    template_id integer,
    version text DEFAULT 1,
    parent_document_id integer,
    authorized_by character varying(50),
    authorized_at timestamp without time zone,
    recipient_ids text[],
    section_ids text[],
    is_public boolean DEFAULT false,
    attachments text[],
    document_references text[],
    download_count integer DEFAULT 0,
    last_viewed_at timestamp without time zone,
    reviewed_by text,
    approved_by text,
    published_by text,
    review_date timestamp without time zone,
    department text,
    access_level text DEFAULT 'standard'::text,
    approval_workflow text[] DEFAULT '{}'::text[],
    is_template boolean DEFAULT false,
    is_active boolean DEFAULT true,
    compliance_required boolean DEFAULT false,
    audit_trail jsonb DEFAULT '[]'::jsonb,
    reviewed_at timestamp without time zone,
    approved_at timestamp without time zone,
    published_at timestamp without time zone,
    requires_approval boolean DEFAULT false,
    CONSTRAINT documents_priority_check CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))),
    CONSTRAINT documents_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'active'::character varying, 'archived'::character varying])::text[])))
);


ALTER TABLE public.documents OWNER TO neondb_owner;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documents_id_seq OWNER TO neondb_owner;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: employee_of_month; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.employee_of_month (
    id integer NOT NULL,
    user_id text NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    obligation_points integer DEFAULT 0 NOT NULL,
    quality_score double precision DEFAULT 0,
    attendance_score double precision DEFAULT 0,
    productivity_score double precision DEFAULT 0,
    total_score double precision DEFAULT 0,
    rank integer,
    reward text,
    reward_amount double precision,
    notes text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.employee_of_month OWNER TO neondb_owner;

--
-- Name: employee_of_month_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.employee_of_month_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_of_month_id_seq OWNER TO neondb_owner;

--
-- Name: employee_of_month_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.employee_of_month_id_seq OWNED BY public.employee_of_month.id;


--
-- Name: final_products; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.final_products (
    id integer NOT NULL,
    job_order_id integer NOT NULL,
    quantity real NOT NULL,
    completed_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status text DEFAULT 'in-stock'::text NOT NULL
);


ALTER TABLE public.final_products OWNER TO neondb_owner;

--
-- Name: final_products_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.final_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.final_products_id_seq OWNER TO neondb_owner;

--
-- Name: final_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.final_products_id_seq OWNED BY public.final_products.id;


--
-- Name: geofences; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.geofences (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    center_latitude numeric(10,8) NOT NULL,
    center_longitude numeric(11,8) NOT NULL,
    radius integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    geofence_type text DEFAULT 'factory'::text,
    section_ids text[] DEFAULT '{}'::text[]
);


ALTER TABLE public.geofences OWNER TO neondb_owner;

--
-- Name: geofences_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.geofences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.geofences_id_seq OWNER TO neondb_owner;

--
-- Name: geofences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.geofences_id_seq OWNED BY public.geofences.id;


--
-- Name: hr_complaints; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hr_complaints (
    id integer NOT NULL,
    complainant_id character varying(255) NOT NULL,
    against_user_id character varying(255),
    complaint_type character varying(100) NOT NULL,
    priority character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    desired_outcome text,
    is_anonymous boolean DEFAULT false,
    status character varying(50) DEFAULT 'submitted'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    submitted_date timestamp without time zone DEFAULT now(),
    assigned_to text
);


ALTER TABLE public.hr_complaints OWNER TO neondb_owner;

--
-- Name: hr_complaints_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.hr_complaints_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hr_complaints_id_seq OWNER TO neondb_owner;

--
-- Name: hr_complaints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.hr_complaints_id_seq OWNED BY public.hr_complaints.id;


--
-- Name: hr_violations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hr_violations (
    id integer NOT NULL,
    violation_number text NOT NULL,
    user_id text NOT NULL,
    reported_by text NOT NULL,
    violation_type text NOT NULL,
    violation_subtype text NOT NULL,
    severity text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    previous_violation_count integer DEFAULT 0,
    is_repeat_offense boolean DEFAULT false,
    related_violation_ids text[] DEFAULT '{}'::text[],
    action_taken text NOT NULL,
    action_details text,
    disciplinary_points integer DEFAULT 0,
    estimated_cost double precision DEFAULT 0,
    actual_cost double precision DEFAULT 0,
    cost_recovered boolean DEFAULT false,
    status text DEFAULT 'open'::text NOT NULL,
    resolution_date timestamp without time zone,
    resolution_notes text,
    evidence_files jsonb,
    witness_ids text[] DEFAULT '{}'::text[],
    follow_up_required boolean DEFAULT false,
    follow_up_date timestamp without time zone,
    follow_up_notes text,
    incident_date timestamp without time zone NOT NULL,
    report_date timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.hr_violations OWNER TO neondb_owner;

--
-- Name: hr_violations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.hr_violations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hr_violations_id_seq OWNER TO neondb_owner;

--
-- Name: hr_violations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.hr_violations_id_seq OWNED BY public.hr_violations.id;


--
-- Name: iot_alerts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.iot_alerts (
    id integer NOT NULL,
    sensor_id text NOT NULL,
    alert_type text NOT NULL,
    severity text NOT NULL,
    message text NOT NULL,
    current_value double precision,
    threshold_value double precision,
    is_active boolean DEFAULT true,
    acknowledged_by text,
    acknowledged_at timestamp without time zone,
    resolved_by text,
    resolved_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.iot_alerts OWNER TO neondb_owner;

--
-- Name: iot_alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.iot_alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.iot_alerts_id_seq OWNER TO neondb_owner;

--
-- Name: iot_alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.iot_alerts_id_seq OWNED BY public.iot_alerts.id;


--
-- Name: items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.items (
    id text NOT NULL,
    category_id text NOT NULL,
    name text NOT NULL,
    full_name text NOT NULL
);


ALTER TABLE public.items OWNER TO neondb_owner;

--
-- Name: jo_mix_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.jo_mix_items (
    id integer NOT NULL,
    jo_mix_id integer NOT NULL,
    job_order_id integer NOT NULL,
    quantity numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.jo_mix_items OWNER TO neondb_owner;

--
-- Name: jo_mix_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.jo_mix_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jo_mix_items_id_seq OWNER TO neondb_owner;

--
-- Name: jo_mix_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.jo_mix_items_id_seq OWNED BY public.jo_mix_items.id;


--
-- Name: jo_mix_materials; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.jo_mix_materials (
    id integer NOT NULL,
    jo_mix_id integer NOT NULL,
    material_id integer NOT NULL,
    quantity numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    percentage double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public.jo_mix_materials OWNER TO neondb_owner;

--
-- Name: jo_mix_materials_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.jo_mix_materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jo_mix_materials_id_seq OWNER TO neondb_owner;

--
-- Name: jo_mix_materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.jo_mix_materials_id_seq OWNED BY public.jo_mix_materials.id;


--
-- Name: jo_mixes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.jo_mixes (
    id integer NOT NULL,
    aba_formula_id integer NOT NULL,
    mix_number character varying(255) NOT NULL,
    total_quantity numeric(10,2) NOT NULL,
    screw_type character varying(10) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    created_by character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp without time zone,
    CONSTRAINT jo_mixes_screw_type_check CHECK (((screw_type)::text = ANY ((ARRAY['A'::character varying, 'B'::character varying])::text[]))),
    CONSTRAINT jo_mixes_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'in_progress'::character varying, 'completed'::character varying])::text[])))
);


ALTER TABLE public.jo_mixes OWNER TO neondb_owner;

--
-- Name: jo_mixes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.jo_mixes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jo_mixes_id_seq OWNER TO neondb_owner;

--
-- Name: jo_mixes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.jo_mixes_id_seq OWNED BY public.jo_mixes.id;


--
-- Name: job_order_updates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.job_order_updates (
    id integer NOT NULL,
    job_order_id integer NOT NULL,
    update_type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    priority text DEFAULT 'medium'::text NOT NULL,
    metadata jsonb,
    created_by text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.job_order_updates OWNER TO neondb_owner;

--
-- Name: job_order_updates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.job_order_updates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.job_order_updates_id_seq OWNER TO neondb_owner;

--
-- Name: job_order_updates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.job_order_updates_id_seq OWNED BY public.job_order_updates.id;


--
-- Name: job_orders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.job_orders (
    id integer NOT NULL,
    order_id integer NOT NULL,
    customer_product_id integer NOT NULL,
    quantity real NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    customer_id text,
    finished_qty double precision DEFAULT 0 NOT NULL,
    received_qty double precision DEFAULT 0 NOT NULL,
    receive_date timestamp without time zone,
    received_by text
);


ALTER TABLE public.job_orders OWNER TO neondb_owner;

--
-- Name: job_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.job_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.job_orders_id_seq OWNER TO neondb_owner;

--
-- Name: job_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.job_orders_id_seq OWNED BY public.job_orders.id;


--
-- Name: leave_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.leave_requests (
    id integer NOT NULL,
    user_id text NOT NULL,
    leave_type text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    days_requested integer NOT NULL,
    reason text NOT NULL,
    status text DEFAULT 'pending'::text,
    approved_by text,
    approved_at timestamp without time zone,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total_days integer DEFAULT 1,
    rejection_reason text,
    attachments text[] DEFAULT ARRAY[]::text[],
    requested_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.leave_requests OWNER TO neondb_owner;

--
-- Name: leave_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.leave_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_requests_id_seq OWNER TO neondb_owner;

--
-- Name: leave_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.leave_requests_id_seq OWNED BY public.leave_requests.id;


--
-- Name: machine_machine_parts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.machine_machine_parts (
    id integer NOT NULL,
    machine_id character varying,
    machine_part_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.machine_machine_parts OWNER TO neondb_owner;

--
-- Name: machine_machine_parts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.machine_machine_parts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.machine_machine_parts_id_seq OWNER TO neondb_owner;

--
-- Name: machine_machine_parts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.machine_machine_parts_id_seq OWNED BY public.machine_machine_parts.id;


--
-- Name: machine_parts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.machine_parts (
    id integer NOT NULL,
    machine_name character varying NOT NULL,
    section_id character varying,
    part_type character varying NOT NULL,
    name character varying NOT NULL,
    code character varying NOT NULL,
    serial_number character varying,
    size character varying,
    size_unit character varying,
    size_value numeric,
    note text,
    last_maintenance_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT machine_parts_part_type_check CHECK (((part_type)::text = ANY ((ARRAY['Mechanic'::character varying, 'Electronic'::character varying])::text[]))),
    CONSTRAINT machine_parts_size_unit_check CHECK (((size_unit)::text = ANY ((ARRAY['cm'::character varying, 'inch'::character varying, 'mm'::character varying])::text[])))
);


ALTER TABLE public.machine_parts OWNER TO neondb_owner;

--
-- Name: machine_parts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.machine_parts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.machine_parts_id_seq OWNER TO neondb_owner;

--
-- Name: machine_parts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.machine_parts_id_seq OWNED BY public.machine_parts.id;


--
-- Name: machine_sensors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.machine_sensors (
    id text NOT NULL,
    machine_id text NOT NULL,
    sensor_type text NOT NULL,
    name text NOT NULL,
    unit text,
    min_value double precision,
    max_value double precision,
    warning_threshold double precision,
    critical_threshold double precision,
    is_active boolean DEFAULT true,
    calibration_date timestamp without time zone,
    next_calibration_date timestamp without time zone
);


ALTER TABLE public.machine_sensors OWNER TO neondb_owner;

--
-- Name: machines; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.machines (
    id text NOT NULL,
    name text NOT NULL,
    section_id text,
    is_active boolean DEFAULT true,
    serial_number text,
    supplier text,
    date_of_manufacturing timestamp without time zone,
    model_number text
);


ALTER TABLE public.machines OWNER TO neondb_owner;

--
-- Name: maintenance_actions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.maintenance_actions (
    id integer NOT NULL,
    request_id integer,
    machine_id text,
    action_date timestamp without time zone DEFAULT now(),
    action_type text NOT NULL,
    part_replaced text,
    part_id integer,
    description text,
    performed_by text NOT NULL,
    hours double precision DEFAULT 0,
    cost double precision DEFAULT 0,
    status text DEFAULT 'completed'::text NOT NULL,
    machine_part_id integer
);


ALTER TABLE public.maintenance_actions OWNER TO neondb_owner;

--
-- Name: maintenance_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.maintenance_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_actions_id_seq OWNER TO neondb_owner;

--
-- Name: maintenance_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.maintenance_actions_id_seq OWNED BY public.maintenance_actions.id;


--
-- Name: maintenance_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.maintenance_requests (
    id integer NOT NULL,
    request_number text,
    machine_id text,
    description text NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    priority integer DEFAULT 2 NOT NULL,
    requested_by text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    assigned_to text,
    completed_at timestamp without time zone,
    notes text,
    damage_type text,
    severity text DEFAULT 'Normal'::text,
    estimated_repair_time integer,
    actual_repair_time integer,
    reported_by text
);


ALTER TABLE public.maintenance_requests OWNER TO neondb_owner;

--
-- Name: maintenance_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.maintenance_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_requests_id_seq OWNER TO neondb_owner;

--
-- Name: maintenance_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.maintenance_requests_id_seq OWNED BY public.maintenance_requests.id;


--
-- Name: maintenance_schedule; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.maintenance_schedule (
    id integer NOT NULL,
    machine_id text,
    maintenance_type text NOT NULL,
    description text,
    frequency text NOT NULL,
    last_completed timestamp without time zone,
    next_due timestamp without time zone,
    assigned_to text,
    priority text DEFAULT 'medium'::text,
    estimated_hours double precision DEFAULT 1,
    instructions text,
    status text DEFAULT 'pending'::text,
    created_by text NOT NULL,
    task_name character varying(255)
);


ALTER TABLE public.maintenance_schedule OWNER TO neondb_owner;

--
-- Name: maintenance_schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.maintenance_schedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_schedule_id_seq OWNER TO neondb_owner;

--
-- Name: maintenance_schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.maintenance_schedule_id_seq OWNED BY public.maintenance_schedule.id;


--
-- Name: master_batches; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.master_batches (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.master_batches OWNER TO neondb_owner;

--
-- Name: mix_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.mix_items (
    id integer NOT NULL,
    mix_id integer,
    raw_material_id integer,
    quantity real NOT NULL,
    percentage real
);


ALTER TABLE public.mix_items OWNER TO neondb_owner;

--
-- Name: mix_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.mix_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mix_items_id_seq OWNER TO neondb_owner;

--
-- Name: mix_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.mix_items_id_seq OWNED BY public.mix_items.id;


--
-- Name: mix_machines; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.mix_machines (
    id integer NOT NULL,
    mix_id integer,
    machine_id text
);


ALTER TABLE public.mix_machines OWNER TO neondb_owner;

--
-- Name: mix_machines_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.mix_machines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mix_machines_id_seq OWNER TO neondb_owner;

--
-- Name: mix_machines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.mix_machines_id_seq OWNED BY public.mix_machines.id;


--
-- Name: mix_materials; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.mix_materials (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    order_id integer,
    mix_date timestamp without time zone NOT NULL,
    mix_person text NOT NULL,
    total_quantity real,
    mix_screw text
);


ALTER TABLE public.mix_materials OWNER TO neondb_owner;

--
-- Name: mix_materials_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.mix_materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mix_materials_id_seq OWNER TO neondb_owner;

--
-- Name: mix_materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.mix_materials_id_seq OWNED BY public.mix_materials.id;


--
-- Name: mobile_devices; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.mobile_devices (
    id text NOT NULL,
    user_id text NOT NULL,
    device_name text NOT NULL,
    device_type text NOT NULL,
    device_model text,
    app_version text,
    os_version text,
    push_token text,
    is_active boolean DEFAULT true,
    last_active timestamp without time zone DEFAULT now(),
    registered_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.mobile_devices OWNER TO neondb_owner;

--
-- Name: modules; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.modules (
    id integer NOT NULL,
    name text NOT NULL,
    display_name text NOT NULL,
    description text,
    category text NOT NULL,
    route text,
    icon text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.modules OWNER TO neondb_owner;

--
-- Name: modules_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.modules_id_seq OWNER TO neondb_owner;

--
-- Name: modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.modules_id_seq OWNED BY public.modules.id;


--
-- Name: notification_center; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notification_center (
    id integer NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'info'::text NOT NULL,
    priority text DEFAULT 'medium'::text NOT NULL,
    category text DEFAULT 'general'::text NOT NULL,
    source text DEFAULT 'system'::text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    action_required boolean DEFAULT false NOT NULL,
    action_url text,
    recipient_id text,
    recipient_role text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now(),
    read_at timestamp with time zone,
    expires_at timestamp with time zone,
    user_id text,
    user_role text,
    is_archived boolean DEFAULT false,
    is_dismissed boolean DEFAULT false,
    action_data text,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    dismissed_at timestamp without time zone
);


ALTER TABLE public.notification_center OWNER TO neondb_owner;

--
-- Name: notification_center_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.notification_center_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_center_id_seq OWNER TO neondb_owner;

--
-- Name: notification_center_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.notification_center_id_seq OWNED BY public.notification_center.id;


--
-- Name: notification_templates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notification_templates (
    id text NOT NULL,
    name text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'info'::text NOT NULL,
    category text DEFAULT 'general'::text NOT NULL,
    priority text DEFAULT 'medium'::text,
    is_active boolean DEFAULT true,
    created_by text,
    trigger_event text,
    conditions jsonb,
    action_required boolean DEFAULT false,
    action_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.notification_templates OWNER TO neondb_owner;

--
-- Name: operator_tasks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.operator_tasks (
    id integer NOT NULL,
    assigned_to text NOT NULL,
    task_type text NOT NULL,
    title text NOT NULL,
    description text,
    priority text DEFAULT 'normal'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    due_date timestamp without time zone,
    related_job_order_id integer,
    related_machine_id text,
    related_roll_id text,
    assigned_by text,
    started_at timestamp without time zone,
    completed_at timestamp without time zone,
    estimated_duration integer,
    actual_duration integer,
    notes text,
    attachments text[],
    gps_location text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.operator_tasks OWNER TO neondb_owner;

--
-- Name: operator_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.operator_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.operator_tasks_id_seq OWNER TO neondb_owner;

--
-- Name: operator_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.operator_tasks_id_seq OWNED BY public.operator_tasks.id;


--
-- Name: operator_updates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.operator_updates (
    id integer NOT NULL,
    operator_id text NOT NULL,
    update_type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    related_job_order_id integer,
    related_machine_id text,
    related_roll_id text,
    priority text DEFAULT 'normal'::text,
    status text DEFAULT 'new'::text,
    photos text[],
    gps_location text,
    acknowledged_by text,
    acknowledged_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.operator_updates OWNER TO neondb_owner;

--
-- Name: operator_updates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.operator_updates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.operator_updates_id_seq OWNER TO neondb_owner;

--
-- Name: operator_updates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.operator_updates_id_seq OWNED BY public.operator_updates.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    customer_id text NOT NULL,
    user_id text,
    note text
);


ALTER TABLE public.orders OWNER TO neondb_owner;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO neondb_owner;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: overtime_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.overtime_requests (
    id integer NOT NULL,
    user_id text NOT NULL,
    date date NOT NULL,
    requested_hours numeric(4,2) NOT NULL,
    reason text NOT NULL,
    status text DEFAULT 'pending'::text,
    approved_by text,
    approved_at timestamp without time zone,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    approved_hours numeric(4,2) DEFAULT 0,
    rejection_reason text,
    actual_hours numeric(4,2) DEFAULT 0,
    requested_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.overtime_requests OWNER TO neondb_owner;

--
-- Name: overtime_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.overtime_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.overtime_requests_id_seq OWNER TO neondb_owner;

--
-- Name: overtime_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.overtime_requests_id_seq OWNED BY public.overtime_requests.id;


--
-- Name: payroll_records; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payroll_records (
    id integer NOT NULL,
    user_id text NOT NULL,
    pay_period_start date NOT NULL,
    pay_period_end date NOT NULL,
    base_hours numeric(6,2) DEFAULT 0,
    overtime_hours numeric(6,2) DEFAULT 0,
    base_pay numeric(10,2) DEFAULT 0,
    overtime_pay numeric(10,2) DEFAULT 0,
    bonuses numeric(10,2) DEFAULT 0,
    deductions numeric(10,2) DEFAULT 0,
    gross_pay numeric(10,2) DEFAULT 0,
    net_pay numeric(10,2) DEFAULT 0,
    status text DEFAULT 'draft'::text,
    processed_by text,
    processed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payroll_records OWNER TO neondb_owner;

--
-- Name: payroll_records_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.payroll_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payroll_records_id_seq OWNER TO neondb_owner;

--
-- Name: payroll_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.payroll_records_id_seq OWNED BY public.payroll_records.id;


--
-- Name: performance_reviews; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.performance_reviews (
    id integer NOT NULL,
    user_id text NOT NULL,
    reviewer_id text NOT NULL,
    review_period_start date NOT NULL,
    review_period_end date NOT NULL,
    attendance_score integer,
    quality_score integer,
    productivity_score integer,
    teamwork_score integer,
    overall_rating text,
    goals text,
    achievements text,
    areas_for_improvement text,
    manager_comments text,
    employee_comments text,
    status text DEFAULT 'draft'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT performance_reviews_attendance_score_check CHECK (((attendance_score >= 0) AND (attendance_score <= 100))),
    CONSTRAINT performance_reviews_productivity_score_check CHECK (((productivity_score >= 0) AND (productivity_score <= 100))),
    CONSTRAINT performance_reviews_quality_score_check CHECK (((quality_score >= 0) AND (quality_score <= 100))),
    CONSTRAINT performance_reviews_teamwork_score_check CHECK (((teamwork_score >= 0) AND (teamwork_score <= 100)))
);


ALTER TABLE public.performance_reviews OWNER TO neondb_owner;

--
-- Name: performance_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.performance_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.performance_reviews_id_seq OWNER TO neondb_owner;

--
-- Name: performance_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.performance_reviews_id_seq OWNED BY public.performance_reviews.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    section_id text NOT NULL,
    module_id integer NOT NULL,
    can_view boolean DEFAULT false,
    can_create boolean DEFAULT false,
    can_edit boolean DEFAULT false,
    can_delete boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.permissions OWNER TO neondb_owner;

--
-- Name: permissions_new_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.permissions_new_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissions_new_id_seq OWNER TO neondb_owner;

--
-- Name: permissions_new_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.permissions_new_id_seq OWNED BY public.permissions.id;


--
-- Name: plate_calculations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.plate_calculations (
    id integer NOT NULL,
    customer_id text,
    width double precision NOT NULL,
    height double precision NOT NULL,
    colors integer NOT NULL,
    area double precision,
    plate_type text NOT NULL,
    calculated_price double precision,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by text,
    thickness double precision,
    base_price_per_unit double precision,
    color_multiplier double precision,
    thickness_multiplier double precision,
    customer_discount double precision,
    notes text,
    created_by_id text
);


ALTER TABLE public.plate_calculations OWNER TO neondb_owner;

--
-- Name: plate_calculations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.plate_calculations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plate_calculations_id_seq OWNER TO neondb_owner;

--
-- Name: plate_calculations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.plate_calculations_id_seq OWNED BY public.plate_calculations.id;


--
-- Name: plate_pricing_parameters; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.plate_pricing_parameters (
    id integer NOT NULL,
    name text NOT NULL,
    value double precision NOT NULL,
    description text,
    type text NOT NULL,
    is_active boolean DEFAULT true,
    last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.plate_pricing_parameters OWNER TO neondb_owner;

--
-- Name: plate_pricing_parameters_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.plate_pricing_parameters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plate_pricing_parameters_id_seq OWNER TO neondb_owner;

--
-- Name: plate_pricing_parameters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.plate_pricing_parameters_id_seq OWNED BY public.plate_pricing_parameters.id;


--
-- Name: quality_check_types; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.quality_check_types (
    id text NOT NULL,
    name text NOT NULL,
    type text,
    category text,
    stage text,
    description text,
    is_active boolean DEFAULT true,
    target_stage text DEFAULT 'extrusion'::text,
    checklist_items text[] DEFAULT '{}'::text[],
    parameters text[] DEFAULT '{}'::text[]
);


ALTER TABLE public.quality_check_types OWNER TO neondb_owner;

--
-- Name: quality_checks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.quality_checks (
    id integer NOT NULL,
    roll_id text,
    job_order_id integer,
    check_type_id text,
    status text DEFAULT 'pending'::text NOT NULL,
    result text,
    notes text,
    checked_by text,
    checked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.quality_checks OWNER TO neondb_owner;

--
-- Name: quality_checks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.quality_checks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quality_checks_id_seq OWNER TO neondb_owner;

--
-- Name: quality_checks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.quality_checks_id_seq OWNED BY public.quality_checks.id;


--
-- Name: raw_materials; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.raw_materials (
    id integer NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    quantity real DEFAULT 0,
    unit text NOT NULL,
    last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.raw_materials OWNER TO neondb_owner;

--
-- Name: raw_materials_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.raw_materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.raw_materials_id_seq OWNER TO neondb_owner;

--
-- Name: raw_materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.raw_materials_id_seq OWNED BY public.raw_materials.id;


--
-- Name: rolls; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.rolls (
    id text NOT NULL,
    job_order_id integer NOT NULL,
    roll_serial text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status text DEFAULT 'pending'::text,
    extruding_qty real,
    printing_qty real,
    cutting_qty real,
    extruded_at timestamp without time zone,
    printed_at timestamp without time zone,
    cut_at timestamp without time zone,
    length_meters real,
    raw_material text,
    master_batch_id text,
    current_stage text DEFAULT 'extrusion'::text NOT NULL,
    waste_qty double precision DEFAULT 0,
    waste_percentage double precision DEFAULT 0,
    created_by_id text,
    printed_by_id text,
    cut_by_id text
);


ALTER TABLE public.rolls OWNER TO neondb_owner;

--
-- Name: sections; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sections (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.sections OWNER TO neondb_owner;

--
-- Name: sensor_data; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sensor_data (
    id integer NOT NULL,
    sensor_id text NOT NULL,
    value double precision NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'normal'::text NOT NULL,
    metadata jsonb
);


ALTER TABLE public.sensor_data OWNER TO neondb_owner;

--
-- Name: sensor_data_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.sensor_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sensor_data_id_seq OWNER TO neondb_owner;

--
-- Name: sensor_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.sensor_data_id_seq OWNED BY public.sensor_data.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: sms_messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sms_messages (
    id integer NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    recipient_phone text NOT NULL,
    recipient_name text,
    customer_id text,
    order_id integer,
    job_order_id integer,
    sent_by text,
    sent_at timestamp without time zone,
    delivered_at timestamp without time zone,
    message_type text DEFAULT 'notification'::text NOT NULL,
    twilio_message_id text,
    error_message text,
    priority character varying(20) DEFAULT 'normal'::character varying,
    category character varying(50) DEFAULT 'general'::character varying,
    template_id character varying(255),
    failed_at timestamp without time zone,
    retry_count integer DEFAULT 0,
    last_retry_at timestamp without time zone,
    is_scheduled boolean DEFAULT false,
    scheduled_for timestamp without time zone,
    metadata jsonb
);


ALTER TABLE public.sms_messages OWNER TO neondb_owner;

--
-- Name: sms_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.sms_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sms_messages_id_seq OWNER TO neondb_owner;

--
-- Name: sms_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.sms_messages_id_seq OWNED BY public.sms_messages.id;


--
-- Name: sms_notification_rules; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sms_notification_rules (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    trigger_event character varying(100) NOT NULL,
    template_id character varying(255),
    recipient_roles text[],
    is_active boolean DEFAULT true,
    priority character varying(20) DEFAULT 'normal'::character varying,
    cooldown_minutes integer DEFAULT 0,
    working_hours_only boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    conditions jsonb,
    recipient_users text[],
    created_by text
);


ALTER TABLE public.sms_notification_rules OWNER TO neondb_owner;

--
-- Name: sms_notification_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.sms_notification_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sms_notification_rules_id_seq OWNER TO neondb_owner;

--
-- Name: sms_notification_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.sms_notification_rules_id_seq OWNED BY public.sms_notification_rules.id;


--
-- Name: sms_provider_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sms_provider_settings (
    id integer NOT NULL,
    primary_provider text DEFAULT 'taqnyat'::text NOT NULL,
    fallback_provider text DEFAULT 'twilio'::text NOT NULL,
    retry_attempts integer DEFAULT 3 NOT NULL,
    retry_delay integer DEFAULT 5000 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    last_updated timestamp without time zone DEFAULT now() NOT NULL,
    updated_by text
);


ALTER TABLE public.sms_provider_settings OWNER TO neondb_owner;

--
-- Name: sms_provider_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.sms_provider_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sms_provider_settings_id_seq OWNER TO neondb_owner;

--
-- Name: sms_provider_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.sms_provider_settings_id_seq OWNED BY public.sms_provider_settings.id;


--
-- Name: sms_templates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sms_templates (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    category character varying(50) NOT NULL,
    message_type character varying(50) NOT NULL,
    template text NOT NULL,
    variables text[],
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by text
);


ALTER TABLE public.sms_templates OWNER TO neondb_owner;

--
-- Name: spare_parts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.spare_parts (
    id integer NOT NULL,
    part_name text NOT NULL,
    part_number text,
    barcode text,
    serial_number text,
    machine_id text,
    category text NOT NULL,
    type text NOT NULL,
    manufacturer text,
    supplier text,
    purchase_date timestamp without time zone,
    price double precision DEFAULT 0,
    quantity integer DEFAULT 1,
    min_quantity integer DEFAULT 0,
    location text,
    notes text,
    last_used timestamp without time zone
);


ALTER TABLE public.spare_parts OWNER TO neondb_owner;

--
-- Name: spare_parts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.spare_parts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.spare_parts_id_seq OWNER TO neondb_owner;

--
-- Name: spare_parts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.spare_parts_id_seq OWNED BY public.spare_parts.id;


--
-- Name: time_attendance; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.time_attendance (
    id integer NOT NULL,
    user_id text NOT NULL,
    date timestamp without time zone NOT NULL,
    check_in_time timestamp without time zone,
    check_out_time timestamp without time zone,
    break_start_time timestamp without time zone,
    break_end_time timestamp without time zone,
    working_hours double precision DEFAULT 0,
    overtime_hours double precision DEFAULT 0,
    location text,
    status text DEFAULT 'present'::text NOT NULL,
    is_auto_checked_out boolean DEFAULT false,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    scheduled_start_time timestamp without time zone,
    scheduled_end_time timestamp without time zone,
    break_duration double precision DEFAULT 0,
    check_in_location text,
    check_out_location text,
    auto_check_out_reason text,
    overtime_approved boolean DEFAULT false,
    overtime_approved_by text,
    break_start_location text,
    break_end_location text
);


ALTER TABLE public.time_attendance OWNER TO neondb_owner;

--
-- Name: time_attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.time_attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.time_attendance_id_seq OWNER TO neondb_owner;

--
-- Name: time_attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.time_attendance_id_seq OWNED BY public.time_attendance.id;


--
-- Name: training_certificates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.training_certificates (
    id integer NOT NULL,
    training_id integer NOT NULL,
    certificate_number text NOT NULL,
    template_id text DEFAULT 'default'::text NOT NULL,
    custom_design jsonb,
    issued_date timestamp without time zone DEFAULT now() NOT NULL,
    valid_until timestamp without time zone,
    issuer_name text NOT NULL,
    issuer_title text NOT NULL,
    company_name text DEFAULT 'Production Management Factory'::text NOT NULL,
    logo_url text,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.training_certificates OWNER TO neondb_owner;

--
-- Name: training_certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.training_certificates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.training_certificates_id_seq OWNER TO neondb_owner;

--
-- Name: training_certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.training_certificates_id_seq OWNED BY public.training_certificates.id;


--
-- Name: training_evaluations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.training_evaluations (
    id integer NOT NULL,
    training_id integer NOT NULL,
    training_point_id integer NOT NULL,
    status text NOT NULL,
    notes text,
    evaluated_at timestamp without time zone,
    evaluated_by text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.training_evaluations OWNER TO neondb_owner;

--
-- Name: training_evaluations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.training_evaluations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.training_evaluations_id_seq OWNER TO neondb_owner;

--
-- Name: training_evaluations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.training_evaluations_id_seq OWNED BY public.training_evaluations.id;


--
-- Name: training_field_evaluations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.training_field_evaluations (
    id integer NOT NULL,
    training_id integer NOT NULL,
    training_field text NOT NULL,
    status text NOT NULL,
    notes text,
    evaluated_at timestamp without time zone,
    evaluated_by text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.training_field_evaluations OWNER TO neondb_owner;

--
-- Name: training_field_evaluations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.training_field_evaluations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.training_field_evaluations_id_seq OWNER TO neondb_owner;

--
-- Name: training_field_evaluations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.training_field_evaluations_id_seq OWNED BY public.training_field_evaluations.id;


--
-- Name: training_points; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.training_points (
    id integer NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.training_points OWNER TO neondb_owner;

--
-- Name: training_points_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.training_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.training_points_id_seq OWNER TO neondb_owner;

--
-- Name: training_points_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.training_points_id_seq OWNED BY public.training_points.id;


--
-- Name: trainings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.trainings (
    id integer NOT NULL,
    training_id text NOT NULL,
    date timestamp without time zone,
    trainee_id text,
    training_section text,
    number_of_days integer,
    supervisor_id text,
    supervisor_signature text,
    report text,
    status text DEFAULT 'in_progress'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    title text,
    description text,
    instructor text,
    location text,
    scheduled_date timestamp without time zone,
    duration double precision,
    max_participants integer,
    category text,
    priority text DEFAULT 'medium'::text,
    certification_required boolean DEFAULT false,
    quality_check_types text[] DEFAULT '{}'::text[],
    equipment_ids text[] DEFAULT '{}'::text[],
    prerequisites text[] DEFAULT '{}'::text[],
    learning_objectives text[] DEFAULT '{}'::text[],
    type text DEFAULT 'general'::text,
    training_category text,
    training_fields text[] DEFAULT '{}'::text[],
    notes text
);


ALTER TABLE public.trainings OWNER TO neondb_owner;

--
-- Name: trainings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.trainings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trainings_id_seq OWNER TO neondb_owner;

--
-- Name: trainings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.trainings_id_seq OWNED BY public.trainings.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id text NOT NULL,
    username text NOT NULL,
    password text,
    name text,
    email text,
    phone text,
    is_active boolean DEFAULT true NOT NULL,
    section_id text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    first_name character varying,
    last_name character varying,
    bio text,
    profile_image_url character varying,
    is_admin boolean DEFAULT false NOT NULL,
    "position" text,
    hire_date timestamp without time zone,
    contract_type text DEFAULT 'full_time'::text,
    work_schedule jsonb,
    emergency_contact jsonb,
    bank_details jsonb,
    allowances jsonb
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: aba_formula_materials id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.aba_formula_materials ALTER COLUMN id SET DEFAULT nextval('public.aba_formula_materials_id_seq'::regclass);


--
-- Name: aba_formulas id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.aba_formulas ALTER COLUMN id SET DEFAULT nextval('public.aba_formulas_id_seq'::regclass);


--
-- Name: corrective_actions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.corrective_actions ALTER COLUMN id SET DEFAULT nextval('public.corrective_actions_id_seq'::regclass);


--
-- Name: customer_information id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_information ALTER COLUMN id SET DEFAULT nextval('public.customer_information_id_seq'::regclass);


--
-- Name: customer_products id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_products ALTER COLUMN id SET DEFAULT nextval('public.customer_products_id_seq'::regclass);


--
-- Name: document_approvals id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.document_approvals ALTER COLUMN id SET DEFAULT nextval('public.document_approvals_id_seq'::regclass);


--
-- Name: document_comments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.document_comments ALTER COLUMN id SET DEFAULT nextval('public.document_comments_id_seq'::regclass);


--
-- Name: document_subscriptions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.document_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.document_subscriptions_id_seq'::regclass);


--
-- Name: document_templates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.document_templates ALTER COLUMN id SET DEFAULT nextval('public.document_templates_id_seq'::regclass);


--
-- Name: document_views id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.document_views ALTER COLUMN id SET DEFAULT nextval('public.document_views_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: employee_of_month id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.employee_of_month ALTER COLUMN id SET DEFAULT nextval('public.employee_of_month_id_seq'::regclass);


--
-- Name: final_products id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.final_products ALTER COLUMN id SET DEFAULT nextval('public.final_products_id_seq'::regclass);


--
-- Name: geofences id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.geofences ALTER COLUMN id SET DEFAULT nextval('public.geofences_id_seq'::regclass);


--
-- Name: hr_complaints id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hr_complaints ALTER COLUMN id SET DEFAULT nextval('public.hr_complaints_id_seq'::regclass);


--
-- Name: hr_violations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hr_violations ALTER COLUMN id SET DEFAULT nextval('public.hr_violations_id_seq'::regclass);


--
-- Name: iot_alerts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.iot_alerts ALTER COLUMN id SET DEFAULT nextval('public.iot_alerts_id_seq'::regclass);


--
-- Name: jo_mix_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jo_mix_items ALTER COLUMN id SET DEFAULT nextval('public.jo_mix_items_id_seq'::regclass);


--
-- Name: jo_mix_materials id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jo_mix_materials ALTER COLUMN id SET DEFAULT nextval('public.jo_mix_materials_id_seq'::regclass);


--
-- Name: jo_mixes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jo_mixes ALTER COLUMN id SET DEFAULT nextval('public.jo_mixes_id_seq'::regclass);


--
-- Name: job_order_updates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_order_updates ALTER COLUMN id SET DEFAULT nextval('public.job_order_updates_id_seq'::regclass);


--
-- Name: job_orders id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_orders ALTER COLUMN id SET DEFAULT nextval('public.job_orders_id_seq'::regclass);


--
-- Name: leave_requests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.leave_requests ALTER COLUMN id SET DEFAULT nextval('public.leave_requests_id_seq'::regclass);


--
-- Name: machine_machine_parts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.machine_machine_parts ALTER COLUMN id SET DEFAULT nextval('public.machine_machine_parts_id_seq'::regclass);


--
-- Name: machine_parts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.machine_parts ALTER COLUMN id SET DEFAULT nextval('public.machine_parts_id_seq'::regclass);


--
-- Name: maintenance_actions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_actions ALTER COLUMN id SET DEFAULT nextval('public.maintenance_actions_id_seq'::regclass);


--
-- Name: maintenance_requests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_requests ALTER COLUMN id SET DEFAULT nextval('public.maintenance_requests_id_seq'::regclass);


--
-- Name: maintenance_schedule id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_schedule ALTER COLUMN id SET DEFAULT nextval('public.maintenance_schedule_id_seq'::regclass);


--
-- Name: mix_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mix_items ALTER COLUMN id SET DEFAULT nextval('public.mix_items_id_seq'::regclass);


--
-- Name: mix_machines id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mix_machines ALTER COLUMN id SET DEFAULT nextval('public.mix_machines_id_seq'::regclass);


--
-- Name: mix_materials id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mix_materials ALTER COLUMN id SET DEFAULT nextval('public.mix_materials_id_seq'::regclass);


--
-- Name: modules id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.modules ALTER COLUMN id SET DEFAULT nextval('public.modules_id_seq'::regclass);


--
-- Name: notification_center id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_center ALTER COLUMN id SET DEFAULT nextval('public.notification_center_id_seq'::regclass);


--
-- Name: operator_tasks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.operator_tasks ALTER COLUMN id SET DEFAULT nextval('public.operator_tasks_id_seq'::regclass);


--
-- Name: operator_updates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.operator_updates ALTER COLUMN id SET DEFAULT nextval('public.operator_updates_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: overtime_requests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.overtime_requests ALTER COLUMN id SET DEFAULT nextval('public.overtime_requests_id_seq'::regclass);


--
-- Name: payroll_records id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_records ALTER COLUMN id SET DEFAULT nextval('public.payroll_records_id_seq'::regclass);


--
-- Name: performance_reviews id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.performance_reviews ALTER COLUMN id SET DEFAULT nextval('public.performance_reviews_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_new_id_seq'::regclass);


--
-- Name: plate_calculations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plate_calculations ALTER COLUMN id SET DEFAULT nextval('public.plate_calculations_id_seq'::regclass);


--
-- Name: plate_pricing_parameters id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plate_pricing_parameters ALTER COLUMN id SET DEFAULT nextval('public.plate_pricing_parameters_id_seq'::regclass);


--
-- Name: quality_checks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quality_checks ALTER COLUMN id SET DEFAULT nextval('public.quality_checks_id_seq'::regclass);


--
-- Name: raw_materials id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.raw_materials ALTER COLUMN id SET DEFAULT nextval('public.raw_materials_id_seq'::regclass);


--
-- Name: sensor_data id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sensor_data ALTER COLUMN id SET DEFAULT nextval('public.sensor_data_id_seq'::regclass);


--
-- Name: sms_messages id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sms_messages ALTER COLUMN id SET DEFAULT nextval('public.sms_messages_id_seq'::regclass);


--
-- Name: sms_notification_rules id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sms_notification_rules ALTER COLUMN id SET DEFAULT nextval('public.sms_notification_rules_id_seq'::regclass);


--
-- Name: sms_provider_settings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sms_provider_settings ALTER COLUMN id SET DEFAULT nextval('public.sms_provider_settings_id_seq'::regclass);


--
-- Name: spare_parts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.spare_parts ALTER COLUMN id SET DEFAULT nextval('public.spare_parts_id_seq'::regclass);


--
-- Name: time_attendance id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.time_attendance ALTER COLUMN id SET DEFAULT nextval('public.time_attendance_id_seq'::regclass);


--
-- Name: training_certificates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_certificates ALTER COLUMN id SET DEFAULT nextval('public.training_certificates_id_seq'::regclass);


--
-- Name: training_evaluations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_evaluations ALTER COLUMN id SET DEFAULT nextval('public.training_evaluations_id_seq'::regclass);


--
-- Name: training_field_evaluations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_field_evaluations ALTER COLUMN id SET DEFAULT nextval('public.training_field_evaluations_id_seq'::regclass);


--
-- Name: training_points id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_points ALTER COLUMN id SET DEFAULT nextval('public.training_points_id_seq'::regclass);


--
-- Name: trainings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.trainings ALTER COLUMN id SET DEFAULT nextval('public.trainings_id_seq'::regclass);


--
-- Data for Name: aba_formula_materials; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.aba_formula_materials (id, formula_id, material_id, screw_a_percentage, screw_b_percentage, created_at) FROM stdin;
40	6	1	40	20	2025-06-27 20:06:31.916985
41	6	2	40	10	2025-06-27 20:06:31.970909
42	6	7	20	70	2025-06-27 20:06:32.032785
49	7	1	45.45	45.45	2025-07-05 04:54:04.020279
50	7	2	40.9	40.9	2025-07-05 04:54:04.067283
51	7	7	13.65	13.65	2025-07-05 04:54:04.113228
52	4	2	80	80	2025-07-05 05:00:42.492787
53	4	3	20	20	2025-07-05 05:00:42.544318
54	5	6	79.99	0.01	2025-07-05 05:17:51.261205
55	5	1	5	50	2025-07-05 05:17:51.312004
56	5	7	15	16	2025-07-05 05:17:51.357776
57	5	2	0.01	33.99	2025-07-05 05:17:51.403067
58	8	2	75	29	2025-07-07 16:37:16.234811
59	8	3	20	1	2025-07-07 16:37:16.285777
60	8	7	5	70	2025-07-07 16:37:16.33306
\.


--
-- Data for Name: aba_formulas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.aba_formulas (id, name, description, ab_ratio, is_active, created_at, updated_at, created_by) FROM stdin;
6	HDPE	For All HDPE Orders	0.3333333333333333:1	t	2025-06-26 05:59:04.033664	2025-06-26 05:59:04.033664	00U1
7	HDPE-CLEAR	TAMIMI + MODAWAR	1:1	t	2025-07-05 04:53:43.451108	2025-07-05 04:53:43.451108	00U1
4	LDPE-NO-FILLER	LDPE ORDERS SINGLE SCREW	1:1	t	2025-06-25 13:36:36.704728	2025-06-25 13:36:36.704728	00U1
5	Regrind	This Formula Used with all Trash Bags Orders.	0.42857142857142855:1	t	2025-06-25 15:09:09.669802	2025-06-25 15:09:09.669802	00U1
8	LDPE FILLER	\N	0.3333333333333333:1	t	2025-07-07 16:37:16.169461	2025-07-07 16:37:16.169461	00U1
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.categories (id, name, code, name_ar) FROM stdin;
CAT003	T-Shirt Bag	TSB	أكياس علاقي
CAT001	Packet Trash Bag	PTB	أكياس نفايات باكت
CAT005	Folded Table Cover	FTC	سفر بلاستيك مطوية
CAT006	Non-Folded Table Cover	N-FTC	سفرة بلاستيك غير مطوية
CAT008	Nylon Bag	SampNyl	أكياس نايلون العملاء
CAT007	Nylon Factory	Nyl-Fact	أكياس نايلون المصنع
CAT002	Roll Trash Bag	RTB	أكياس نفايات ترول
CAT004	Calendar Bag	CB	أكياس بنانة
CAT011	Fertilizer Bag	FB	اكياس السماد
CAT010	HD Bag	HD Samp	اكياس اتش دي
CAT009	LD Bag	LD Samp	أكياس ال دي
CAT015	Uncategories	UC	غير مصنف
CAT014	Rubber TC	RTC	سفرة مطاطية
CAT013	Bakery Bag and Cover	BBC	اكياس المخابز
CAT012	Charcoal Bag	CHB	اكياس الفحم
\.


--
-- Data for Name: corrective_actions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.corrective_actions (id, quality_check_id, action, status, assigned_to, completed_by, created_at, completed_at, implemented_by, implementation_date, verified_by, verified_date, verification_notes) FROM stdin;
\.


--
-- Data for Name: customer_information; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customer_information (id, commercial_name_ar, commercial_name_en, commercial_registration_no, unified_no, vat_no, province, city, neighbor_name, building_no, additional_no, postal_code, response_name, response_no, created_at) FROM stdin;
5	مصنع هشام 	مصنع	2050052901	7007685592	30051128200003	eastern	dammam		3865	7760	32435	خليل	0550609050	2025-07-06 04:39:33.039352
6	311309701600003	HYDRAULIC SOLUTIONS COMPANY	2050204661	7006606730	31130970160000	eastern	dammam	other	2199	8158	32442	ليث عبد الرؤوف أبو جليل	0544715026	2025-07-21 05:10:27.204434
\.


--
-- Data for Name: customer_products; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customer_products (id, customer_id, category_id, item_id, size_caption, width, left_f, right_f, thickness, thickness_one, printing_cylinder, length_cm, cutting_length_cm, raw_material, master_batch_id, printed, cutting_unit, unit_weight_kg, packing, punching, cover, volum, knife, notes, unit_qty, package_kg, cliche_front_design, cliche_back_design) FROM stdin;
1	CID004	CAT001	ITM006	50+17+17	50	17	17	8.5	21	0	90	90	LLDPE	MAS001	FALSE	Packet	1.4	10P/Bag	None		31.8	0		\N	\N	\N	\N
2	CID004	CAT001	ITM007	60+15+15	60	15	15	9	22	0	110	110	Regrind	MAS002	FALSE	Packet	1.4	50Pcs/P x 5P/Bag	None		43.6	0	34G/Pc. - 41Pcs./Packet	\N	\N	\N	\N
3	CID004	CAT001	ITM009	60+18+18	60	18	18	11	27	0	110	110	Regrind	MAS003	FALSE	Packet	2.4	5P/Bag	None		57	0		\N	\N	\N	\N
4	CID004	CAT001	ITM010	70+25+25	70	25	25	12	30	0	130	130	Regrind	MAS003	FALSE	Packet	3	5P/Bag	None		93.6	0		\N	\N	\N	\N
5	CID004	CAT001	ITM006	50+17+17	50	17	17	10	25	0	100	100	Regrind	MAS003	FALSE	Packet	1.6	10P/Bag	None	Plain	42	0		\N	\N	\N	\N
6	CID004	CAT001	ITM006	50+18+18	50	18	18	8.5	21	0	105	105	Regrind	MAS004	FALSE	Packet	1.6	10P/Bag	None		37.9	0		\N	\N	\N	\N
7	CID004	CAT002	ITM013	32+12+12	32	12	12	11	27	0	60	60	HDPE	MAS005	FALSE	Box	5	20K/Bag	None		18.1	0		\N	\N	\N	\N
8	CID004	CAT002	ITM013	30+12+12	30	12	12	5	12	0	65	65	HDPE	MAS006	FALSE	Box	4	30Pcs/R x 10R/Box	None		8.4	0		\N	\N	\N	\N
9	CID004	CAT003	ITM022	46+14+14	46	14	14	17	42	0	86	86	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		53.5	0		\N	\N	\N	\N
10	CID002	CAT008	ITM044	61	61	0	0	10	50	22	167	167	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		101.9	0		\N	\N	\N	\N
11	CID005	CAT012	ITM051	21.5+5.5+5.5	21.5	5.5	5.5	55	137	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
12	CID006	CAT003	ITM020	30+10+10	30	10	10	15	37	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		18.8	0		\N	\N	\N	\N
13	CID006	CAT003	ITM021	34+11+11	34	11	11	15	37	24	60.96	60.96	HDPE	MAS007	TRUE	Kg.	1	20K/Bag	None		25.3	0		\N	\N	\N	\N
14	CID009	CAT008	ITM044	19	19	0	0	18	90	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		8.7	0		\N	\N	\N	\N
15	CID013	CAT004	ITM027	29+6+6	29	6	6	20	50	14	35.56	35.56	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		14.6	0		\N	\N	\N	\N
16	CID013	CAT004	ITM028	36+8+8	36	8	8	25	62	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		32.8	0		\N	\N	\N	\N
17	CID017	CAT004	ITM029	42	42	0	0	25	125	22	55.88	55.88	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		58.7	0		\N	\N	\N	\N
18	CID020	CAT001	ITM004	40+12+12	40	12	12	7.5	18	0	0	0	Regrind	MAS004	FALSE	Packet	1	10P/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
19	CID020	CAT001	ITM005	40+15+15	40	15	15	7	17	0	0	0	Regrind	MAS004	FALSE	Packet	1	10P/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
20	CID020	CAT001	ITM006	50+15+15	50	15	15	7	17	0	0	0	Regrind	MAS004	FALSE	Packet	1.2	10P/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
21	CID021	CAT004	ITM028	25+6+6	25	6	6	15	37	16	40.64	40.64	HDPE	MAS004	TRUE	Box	10	1050Pcs/Box	None		11.1	0		\N	\N	\N	\N
22	CID023	CAT004	ITM030	40+7+7	40	7	7	42	105	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		63.4	0		\N	\N	\N	\N
23	CID023	CAT004	ITM031	55+9+9	55	9	9	45	112	32	81.28	81.28	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		132.9	0		\N	\N	\N	\N
24	CID023	CAT004	ITM032	70+14+14	70	14	14	46	115	39	99.06	99.06	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		223.3	0		\N	\N	\N	\N
25	CID025	CAT001	ITM007	55+16+16	55	16	16	23	57	0	110	110	LLDPE	MAS002	FALSE	Packet	3	25Pcs/P x 5P/Bag	None		109.1	0		\N	\N	\N	\N
26	CID025	CAT001	ITM006	50+15+15	50	15	15	5	12	0	100	100	Regrind	MAS002	FALSE	Packet	1	10P/Bag	None		19.2	0		\N	\N	\N	\N
27	CID025	CAT001	ITM008	60+15+15	60	15	15	11	27	0	110	110	Regrind	MAS004	FALSE	Packet	2.6	5P/Bag	None		53.5	0		\N	\N	\N	\N
28	CID025	CAT001	ITM009	67+21+21	67	21	21	17	42	0	123	123	LLDPE	MAS008	FALSE	Packet	5	50Pcs/P x 4P/Bag	None		112.6	0		\N	\N	\N	\N
29	CID025	CAT001	ITM007	60+15+15	60	15	15	9	22	0	110	110	Regrind	MAS004	FALSE	Packet	2	5P/Bag	None		43.6	0		\N	\N	\N	\N
30	CID025	CAT001	ITM006	47+19+19	47	19	19	12.5	31	0	94	94	Regrind	MAS004	FALSE	Packet	2.1	50Pcs/P x 5P/Bag	None		49.5	0		\N	\N	\N	\N
31	CID026	CAT004	ITM027	26+7+7	26	7	7	35	87	16	40.64	40.64	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		28.3	20		\N	\N	\N	\N
32	CID036	CAT004	ITM029	45	45	0	0	18	90	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		41.1	0		\N	\N	\N	\N
33	CID038	CAT006	ITM038	60	60	0	0	8	40	0	120	120	LLDPE	MAS005	TRUE	Roll	2	4R/Bag	None	Ahmad Saad (Busaad Plastic)	57.6	0		\N	\N	\N	\N
34	CID038	CAT006	ITM038	60	60	0	0	16	80	0	140	140	LLDPE	MAS010	TRUE	Roll	2.5	4R/Bag	None	Ahmad Saad (Busaad Plastic)	134.4	0		\N	\N	\N	\N
35	CID040	CAT004	ITM027	22+6+6	22	6	6	20	50	12	30.48	30.48	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		10.4	20		\N	\N	\N	\N
36	CID040	CAT004	ITM028	31+6+6	31	6	6	25	62	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		24.4	20		\N	\N	\N	\N
37	CID040	CAT004	ITM029	40+8+8	40	8	8	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.3	20		\N	\N	\N	\N
38	CID040	CAT004	ITM030	42+9+9	42	9	9	27	67	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		49	20		\N	\N	\N	\N
39	CID040	CAT004	ITM031	15+15+62	62	15	15	28	70	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		104.7	20		\N	\N	\N	\N
40	CID041	CAT003	ITM020	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
41	CID041	CAT003	ITM021	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
42	CID041	CAT003	ITM022	44+13+13	44	13	13	18	45	32	81.28	81.28	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		51.2	0		\N	\N	\N	\N
43	CID042	CAT003	ITM020	31+9+9	31	9	9	16	40	20	50.8	50.8	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		19.9	0		\N	\N	\N	\N
44	CID042	CAT003	ITM021	37+13+13	37	13	13	16	40	24	60.96	60.96	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		30.7	0		\N	\N	\N	\N
45	CID042	CAT003	ITM022	50+14+14	50	14	14	19	47	32	81.28	81.28	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		59.6	0		\N	\N	\N	\N
46	CID051	CAT004	ITM028	38+6+6	38	6	6	38	95	18	45.72	45.72	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	None		43.4	0		\N	\N	\N	\N
47	CID051	CAT004	ITM029	46+6+6	46	6	6	38	95	20	50.8	50.8	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	None		56	0		\N	\N	\N	\N
48	CID065	CAT004	ITM028	41	41	0	0	20	100	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		41.7	0		\N	\N	\N	\N
49	CID004	CAT001	ITM009	60+15+15	60	15	15	11	27	0	110	110	Regrind	MAS003	FALSE	Packet	2.6	5P/Bag	None		53.5	0		\N	\N	\N	\N
50	CID145	CAT003	ITM019	29+9+9	29	9	9	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.9	30		\N	\N	\N	\N
51	CID136	CAT004	ITM028	31+6+6	31	6	6	28	70	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		27.5	0		\N	\N	\N	\N
52	CID136	CAT004	ITM029	41+9+9	41	9	9	28	70	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		42	0		\N	\N	\N	\N
53	CID738	CAT001	ITM005	47+19+19	47	19	19	15	37	20	50.8	50.8	HDPE	MAS008	TRUE	Kg.	1	23Pcs/P x 10P/Bag	None		32	0	64.6Grm/Pc.	\N	\N	\N	\N
54	CID749	CAT004	ITM027	21	21	0	0	15	75	0	0	0	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
55	CID749	CAT004	ITM028	31+6+6	31	6	6	36	90	0	0	0	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
56	CID749	CAT004	ITM029	40+6+6	40	6	6	40	100	0	0	0	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
57	CID749	CAT003	ITM019	28+9+9	28	9	9	10	25	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
58	CID749	CAT003	ITM020	32+10+10	32	10	10	10	25	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
59	CID749	CAT003	ITM021	40+14+14	40	14	14	15	37	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
60	CID402	CAT003	ITM020	30+9+9	30	9	9	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		17.1	30		\N	\N	\N	\N
61	CID402	CAT003	ITM021	35+10+10	35	10	10	21	52	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		34.9	30		\N	\N	\N	\N
62	CID402	CAT003	ITM022	40+9+9	40	9	9	25	62	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		51.1	30		\N	\N	\N	\N
63	CID402	CAT004	ITM029	59	59	0	0	15	75	0	0	0	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
64	CID747	CAT003	ITM020	32+10+10	32	10	10	18	45	20	50.8	50.8	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23.8	30		\N	\N	\N	\N
65	CID292	CAT003	ITM020	27+8+8	27	8	8	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		14.5	0		\N	\N	\N	\N
66	CID292	CAT003	ITM021	36+12+12	36	12	12	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		32.9	0		\N	\N	\N	\N
67	CID292	CAT003	ITM022	41+12+12	41	12	12	18	45	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		41.6	0		\N	\N	\N	\N
68	CID292	CAT003	ITM023	46+14+14	46	14	14	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		60.1	0		\N	\N	\N	\N
69	CID613	CAT004	ITM027	28+8+8	28	8	8	30	75	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		30.2	20		\N	\N	\N	\N
70	CID613	CAT004	ITM028	38+8+8	38	8	8	30	75	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		41.1	20		\N	\N	\N	\N
71	CID613	CAT004	ITM029	45+8+8	45	8	8	30	75	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		51.1	20		\N	\N	\N	\N
72	CID781	CAT004	ITM027	23+6+6	23	6	6	18	45	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		11.2	0		\N	\N	\N	\N
73	CID781	CAT003	ITM020	28+9+9	28	9	9	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		17.3	0		\N	\N	\N	\N
74	CID399	CAT004	ITM027	25	25	0	0	20	100	14	35.56	35.56	LLDPE	MAS013	TRUE	Kg.	1	20K/Bag	None		17.8	0		\N	\N	\N	\N
75	CID399	CAT004	ITM028	26+8+8	26	8	8	38	95	18	45.72	45.72	LLDPE	MAS013	TRUE	Kg.	1	20K/Bag	None		36.5	0		\N	\N	\N	\N
76	CID399	CAT004	ITM029	39+9+9	39	9	9	40	100	20	50.8	50.8	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		57.9	20		\N	\N	\N	\N
77	CID399	CAT003	ITM020	32+11+11	32	11	11	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		19.2	0		\N	\N	\N	\N
78	CID741	CAT005	ITM033	9+9+32	32	9	9	4	10	0	110	110	HDPE	MAS005	TRUE	Roll	0.3	20K/Bag	None	Manal	11	0		\N	\N	\N	\N
79	CID741	CAT005	ITM035	34+14+14	34	14	14	4	10	0	125	125	HDPE	MAS005	TRUE	Roll	0.9	10R/Bag	None	Manal	15.5	0		\N	\N	\N	\N
80	CID741	CAT006	ITM037	55	55	0	0	6	30	0	110	110	HDPE	MAS005	TRUE	Roll	0.8	15R/Bag	None	Manal	36.3	0		\N	\N	\N	\N
81	CID741	CAT001	ITM005	40+15+15	40	15	15	9	22	0	80	80	HDPE	MAS014	FALSE	Packet	1.2	10P/Bag	None	Manal	24.6	0		\N	\N	\N	\N
82	CID741	CAT001	ITM006	50+15+15	50	15	15	8	20	0	90	90	Regrind	MAS002	FALSE	Packet	1.3	10P/Bag	None	Manal	28.8	0		\N	\N	\N	\N
83	CID741	CAT001	ITM007	50+18+18	50	18	18	13	32	0	100	100	Regrind	MAS002	FALSE	Packet	1.3	10P/Bag	None	Manal	55	0		\N	\N	\N	\N
84	CID340	CAT003	ITM019	25+7+7	25	7	7	14	35	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		12.5	30		\N	\N	\N	\N
85	CID340	CAT003	ITM020	32+10+10	32	10	10	15	37	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		21.5	30		\N	\N	\N	\N
86	CID340	CAT003	ITM021	35+10+10	35	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		24.8	30		\N	\N	\N	\N
87	CID480	CAT004	ITM027	31	31	0	0	18	90	14	35.56	35.56	HDPE	MAS015	TRUE	Box	10	500Pcs/ Box	Banana		19.8	20		\N	\N	\N	\N
88	CID480	CAT004	ITM028	45+10+10	45	10	10	30	75	20	50.8	50.8	HDPE	MAS015	TRUE	Box	10	200Pcs/ Box	Banana		49.5	20		\N	\N	\N	\N
89	CID480	CAT004	ITM029	65+15+15	65	15	15	32	80	30	76.2	76.2	HDPE	MAS005	TRUE	Box	10	80Pcs/Box	Banana		115.8	20		\N	\N	\N	\N
90	CID767	CAT004	ITM027	25	25	0	0	10	50	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		8.9	20		\N	\N	\N	\N
91	CID767	CAT004	ITM028	33	33	0	0	12	60	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		18.1	20		\N	\N	\N	\N
92	CID767	CAT004	ITM029	33+10+10	33	10	10	24	60	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.5	20		\N	\N	\N	\N
93	CID767	CAT004	ITM030	40+11+11	40	11	11	28	70	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		61.7	20		\N	\N	\N	\N
94	CID165	CAT003	ITM019	27+8+8	27	8	8	14	35	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		13.8	0		\N	\N	\N	\N
95	CID165	CAT003	ITM020	31+9+9	31	9	9	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		17.4	0		\N	\N	\N	\N
96	CID165	CAT003	ITM021	40+11+11	40	11	11	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		28	0		\N	\N	\N	\N
97	CID555	CAT001	ITM004	36+16+16	36	16	16	10	25	0	70	70	HDPE	MAS016	FALSE	Packet	1	10P/Bag	None	Sanabel Al-Sharq	23.8	0		\N	\N	\N	\N
98	CID555	CAT001	ITM005	40+16+16	40	16	16	10	25	0	80	80	Regrind	MAS003	FALSE	Packet	1.2	10P/Bag	None	Sanabel Al-Sharq	28.8	0		\N	\N	\N	\N
99	CID555	CAT001	ITM006	50+15+15	50	15	15	10	25	0	90	90	Regrind	MAS003	FALSE	Packet	1.4	10P/Bag	None	Sanabel Al-Sharq	36	0		\N	\N	\N	\N
100	CID555	CAT008	ITM044	26	26	0	0	8	40	18	45.72	45.72	LLDPE	MAS015	TRUE	Kg.	1	20K/Bag	None		9.5	0		\N	\N	\N	\N
101	CID555	CAT008	ITM056	24	24	0	0	20	100	10	25.4	25.4	LLDPE	MAS015	TRUE	Kg.	1	20K/Bag	None		12.2	0		\N	\N	\N	\N
102	CID626	CAT003	ITM019	27+8+8	27	8	8	12	30	18	45.72	45.72	HDPE	MAS017	TRUE	Kg.	1	20K/Bag	None		11.8	0	Color Mixing:\nPal Green/EP51186 ----- 2100 Grams\nYellow/EP21003 ---------250Grams\nIvory/EP21131 ----------- 300Grams\n2 Bags =800Grams mixed	\N	\N	\N	\N
151	CID742	CAT003	ITM021	32+10+10	32	10	10	18	45	24	60.96	60.96	HDPE	MAS023	TRUE	Kg.	1	20K/Bag	None		28.5	0		\N	\N	\N	\N
3791	CID1688	CAT008	ITM041	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	10P/Bag	None		0	0		\N	\N	\N	\N
103	CID626	CAT003	ITM020	31+10+10	31	10	10	15	37	20	50.8	50.8	HDPE	MAS017	TRUE	Kg.	1	20K/Bag	None		19.2	0	Color Mixing:\nPal Green/EP51186 ----- 2100 Grams\nYellow/EP21003 ---------250Grams\nIvory/EP21131 ----------- 300Grams\n2 Bags =800Grams mixed	\N	\N	\N	\N
104	CID626	CAT003	ITM021	36+10+10	36	10	10	17	42	24	60.96	60.96	HDPE	MAS017	TRUE	Kg.	1	20K/Bag	None		28.7	0	Color Mixing:\nPal Green/EP51186 ----- 2100 Grams\nYellow/EP21003 ---------250Grams\nIvory/EP21131 ----------- 300Grams\n2 Bags =800Grams mixed	\N	\N	\N	\N
105	CID626	CAT003	ITM022	40+12+12	40	12	12	20	50	28	71.12	71.12	HDPE	MAS017	TRUE	Kg.	1	20K/Bag	None		45.5	0	Color Mixing:\nPal Green/EP51186 ----- 2100 Grams\nYellow/EP21003 ---------250Grams\nIvory/EP21131 ----------- 300Grams\n2 Bags =800Grams mixed	\N	\N	\N	\N
106	CID626	CAT003	ITM023	45+13+13	45	13	13	20	50	32	81.28	81.28	HDPE	MAS017	TRUE	Kg.	1	20K/Bag	None		57.7	0	Color Mixing:\nPal Green/EP51186 ----- 2100 Grams\nYellow/EP21003 ---------250Grams\nIvory/EP21131 ----------- 300Grams\n2 Bags =800Grams mixed	\N	\N	\N	\N
107	CID066	CAT003	ITM020	32+9+9	32	9	9	18	45	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
108	CID066	CAT003	ITM021	35+12+12	35	12	12	18	45	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
109	CID066	CAT003	ITM022	44+13+13	44	13	13	18	45	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
110	CID079	CAT003	ITM020	31+9+9	31	9	9	20	50	0	0	0	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
111	CID079	CAT003	ITM021	36+11+11	36	11	11	22	55	0	0	0	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
112	CID079	CAT003	ITM022	39+11+11	39	11	11	22	55	0	0	0	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
113	CID061	CAT003	ITM020	32+10+10	32	10	10	17	42	0	0	0	HDPE	MAS018	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
114	CID061	CAT003	ITM021	36+12+12	36	12	12	18	45	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
115	CID061	CAT003	ITM022	50+13+13	50	13	13	20	50	0	0	0	HDPE	MAS019	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
116	CID772	CAT003	ITM020	31+9+9	31	9	9	18	45	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		24.6	0		\N	\N	\N	\N
117	CID772	CAT003	ITM021	42+11+11	42	11	11	18	45	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		41	0		\N	\N	\N	\N
118	CID772	CAT003	ITM022	42+11+11	42	11	11	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		52	0		\N	\N	\N	\N
119	CID250	CAT003	ITM019	27+7+7	27	7	7	12	30	20	50.8	50.8	HDPE	MAS020	TRUE	Kg.	1	20K/Bag	None		12.5	0		\N	\N	\N	\N
120	CID250	CAT003	ITM020	30+10+10	30	10	10	15	37	22	55.88	55.88	HDPE	MAS020	TRUE	Kg.	1	20K/Bag	T-Shirt		20.7	30		\N	\N	\N	\N
121	CID250	CAT003	ITM022	43+13+13	43	13	13	18	45	28	71.12	71.12	HDPE	MAS020	TRUE	Kg.	1	20K/Bag	None		44.2	0		\N	\N	\N	\N
122	CID684	CAT004	ITM026	22+5+5	22	5	5	35	87	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		17	20		\N	\N	\N	\N
123	CID684	CAT004	ITM027	33+7+7	33	7	7	28	70	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		30.1	0		\N	\N	\N	\N
124	CID684	CAT004	ITM028	36+7+7	36	7	7	28	70	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		35.6	0		\N	\N	\N	\N
125	CID684	CAT004	ITM029	50+10+10	50	10	10	26	65	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		55.5	0		\N	\N	\N	\N
126	CID421	CAT004	ITM027	29+5+5	29	5	5	20	50	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		19.8	0		\N	\N	\N	\N
127	CID168	CAT001	ITM004	36+16+16	36	16	16	10	25	0	70	70	Regrind	MAS002	FALSE	Packet	1	10P/Bag	None	Dahiya Eastern Shopping Center	23.8	0		\N	\N	\N	\N
128	CID168	CAT001	ITM005	40+16+16	40	16	16	10	25	0	80	80	Regrind	MAS002	FALSE	Packet	1.2	10P/Bag	None	Dahan Shopping Center	28.8	0		\N	\N	\N	\N
129	CID168	CAT001	ITM006	45+18+18	45	18	18	9	22	0	90	90	Regrind	MAS002	FALSE	Packet	1.4	10P/Bag	None	Dahan Shopping Center	32.1	0		\N	\N	\N	\N
130	CID168	CAT001	ITM007	50+18+18	50	18	18	13	32	0	100	100	Regrind	MAS002	FALSE	Packet	1.4	10P/Bag	None	Dahiya Eastern Shopping Center	55	0		\N	\N	\N	\N
131	CID488	CAT011	ITM048	50	50	0	0	0	0	0	0	0	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
132	CID267	CAT011	ITM048	50	50	0	0	0	0	0	0	0	LLDPE	MAS019	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
133	CID344	CAT010	ITM046	30	30	0	0	8	40	8	20.32	20.32	HDPE	MAS021	TRUE	Roll	25	25Kg/Roll	None		4.9	0		\N	\N	\N	\N
134	CID404	CAT001	ITM003	0	0	0	0	4	20	0	0	0	HDPE	MAS006	FALSE	Box	4	17P/Box	None	Plain	0	0		\N	\N	\N	\N
135	CID404	CAT001	ITM008	60+15+15	60	15	15	11	27	0	110	110	Regrind	MAS002	FALSE	Packet	2.4	5P/Bag	None	Plain	53.5	0		\N	\N	\N	\N
136	CID404	CAT001	ITM009	18+18+60	60	18	18	13	32	0	0	0	Regrind	MAS002	FALSE	Packet	2.4	5P/Bag	None	Plain	0	0		\N	\N	\N	\N
137	CID804	CAT003	ITM018	18+6+6	18	6	6	8	20	16	40.64	40.64	HDPE	MAS018	TRUE	Kg.	1	20K/Bag	T-Shirt		4.9	30		\N	\N	\N	\N
138	CID804	CAT003	ITM019	24+7+7	24	7	7	8	20	18	45.72	45.72	HDPE	MAS018	TRUE	Kg.	1	20K/Bag	T-Shirt		6.9	30		\N	\N	\N	\N
139	CID804	CAT003	ITM020	28+8+8	28	8	8	10	25	20	50.8	50.8	HDPE	MAS019	TRUE	Kg.	1	20K/Bag	T-Shirt		11.2	30		\N	\N	\N	\N
140	CID804	CAT003	ITM021	33+9+9	33	9	9	10	25	24	60.96	60.96	HDPE	MAS019	TRUE	Kg.	1	20K/Bag	None		15.5	0		\N	\N	\N	\N
141	CID737	CAT003	ITM019	30+10+10	30	10	10	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.3	30		\N	\N	\N	\N
142	CID737	CAT003	ITM020	35+10+10	35	10	10	16	40	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		24.6	30		\N	\N	\N	\N
143	CID117	CAT004	ITM027	28+8+8	28	8	8	15	37	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		11.6	20		\N	\N	\N	\N
144	CID810	CAT003	ITM021	37+12+12	37	12	12	19	47	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		35	0		\N	\N	\N	\N
145	CID589	CAT003	ITM020	32+9+9	32	9	9	18	45	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		22.9	0		\N	\N	\N	\N
146	CID589	CAT003	ITM021	36+13+13	36	13	13	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		34	0		\N	\N	\N	\N
147	CID589	CAT003	ITM022	44+13+13	44	13	13	20	50	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		49.8	0		\N	\N	\N	\N
148	CID589	CAT003	ITM023	50+14+14	50	14	14	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		63.4	0		\N	\N	\N	\N
149	CID742	CAT003	ITM019	29+8+8	29	8	8	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		16.5	0		\N	\N	\N	\N
150	CID742	CAT003	ITM020	29+9+9	29	9	9	17	42	20	50.8	50.8	HDPE	MAS022	TRUE	Kg.	1	20K/Bag	None		20.1	0	Light Green; 1000 rms - Green (EP51364);  800grms per 2 Bags Raw Material	\N	\N	\N	\N
152	CID742	CAT003	ITM022	37+12+12	37	12	12	20	50	28	71.12	71.12	HDPE	MAS024	TRUE	Kg.	1	20K/Bag	None		43.4	0	Light Blue	\N	\N	\N	\N
153	CID742	CAT003	ITM023	46+12+12	46	12	12	22	55	36	91.44	91.44	HDPE	MAS025	TRUE	Kg.	1	20K/Bag	None		70.4	0		\N	\N	\N	\N
154	CID768	CAT004	ITM029	40+8+8	40	8	8	30	75	0	0	0	HDPE	MAS013	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
155	CID768	CAT004	ITM030	54+10+10	54	10	10	30	75	0	0	0	HDPE	MAS013	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
156	CID766	CAT003	ITM019	26+8+8	26	8	8	12	30	0	0	0	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
157	CID766	CAT003	ITM020	32+10+10	32	10	10	13	32	0	0	0	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
158	CID766	CAT003	ITM021	36+11+11	36	11	11	16	40	0	0	0	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
159	CID766	CAT003	ITM022	50+15+15	50	15	15	22	55	0	0	0	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
160	CID743	CAT003	ITM019	29+8+8	29	8	8	15	37	18	45.72	45.72	HDPE	MAS026	TRUE	Kg.	1	20K/Bag	None		15.2	0	Light Green Mixing:\n          For 2 Bags Raw Material\n   EP 51364 (Green) - - - - 100 Grams\n   EP            (White) - - - - 700 Grams	\N	\N	\N	\N
161	CID743	CAT003	ITM020	29+9+9	29	9	9	17	42	20	50.8	50.8	HDPE	MAS023	TRUE	Kg.	1	20K/Bag	None		20.1	0		\N	\N	\N	\N
162	CID743	CAT003	ITM021	32+10+10	32	10	10	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		26.6	0		\N	\N	\N	\N
163	CID743	CAT003	ITM022	34+13+13	34	13	13	20	50	28	71.12	71.12	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		42.7	0		\N	\N	\N	\N
164	CID130	CAT003	ITM019	18+6+6	18	6	6	6	15	0	0	0	HDPE	MAS015	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
165	CID130	CAT003	ITM020	24+7+7	24	7	7	6.5	16	0	0	0	HDPE	MAS015	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
166	CID130	CAT003	ITM021	27+9+9	27	9	9	6.5	16	0	0	0	HDPE	MAS015	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
167	CID130	CAT003	ITM022	30+10+10	30	10	10	6.5	16	0	0	0	HDPE	MAS015	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
168	CID130	CAT003	ITM023	34+10+10	34	10	10	7	17	0	0	0	HDPE	MAS015	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
169	CID130	CAT002	ITM011	27+10+10	27	10	10	4	10	0	0	0	HDPE	MAS005	FALSE	5 Roll	0.5	5R/Bag	None	Abeer	0	0		\N	\N	\N	\N
170	CID081	CAT003	ITM018	22+7+7	22	7	7	16	40	0	0	0	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
171	CID081	CAT003	ITM019	26+8+8	26	8	8	16	40	0	0	0	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
172	CID081	CAT003	ITM020	32+10+10	32	10	10	16	40	0	0	0	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
173	CID677	CAT004	ITM028	34+5+5	34	5	5	30	75	0	0	0	HDPE	MAS027	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
174	CID677	CAT009	ITM029	40+8+8	40	8	8	34	85	0	0	0	HDPE	MAS027	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
175	CID678	CAT010	ITM046	33	33	0	0	8	40	0	0	0	HDPE	MAS025	TRUE	Roll	50	50K/Roll	None		0	0		\N	\N	\N	\N
176	CID093	CAT003	ITM019	27+9+9	27	9	9	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		12.3	0		\N	\N	\N	\N
177	CID093	CAT003	ITM020	30+10+10	30	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		22.6	0		\N	\N	\N	\N
178	CID093	CAT003	ITM021	35+11+11	35	11	11	15	37	20	50.8	50.8	HDPE	MAS013	TRUE	Kg.	1	20K/Bag	None		21.4	0		\N	\N	\N	\N
179	CID673	CAT003	ITM020	34+9+9	34	9	9	22	55	0	0	0	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		0	0	Master Batch Mixing Per 3 Bags\nEP21260(Ivory) - 1000Grams\nEP21259(Yellow) - 150Grams	\N	\N	\N	\N
180	CID673	CAT003	ITM021	37+11+11	37	11	11	24	60	0	0	0	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		0	0	Master Batch Mixing Per 3 Bags\nEP21260(Ivory) - 1000Grams\nEP21259(Yellow) - 150Grams	\N	\N	\N	\N
181	CID673	CAT003	ITM022	50+13+13	50	13	13	24	60	0	0	0	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		0	0	Master Batch Mixing Per 3 Bags\nEP21260(Ivory) - 1000Grams\nEP21259(Yellow) - 150Grams	\N	\N	\N	\N
182	CID673	CAT004	ITM032	70+10+10	70	10	10	30	75	0	0	0	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		0	0	Master Batch Mixing Per 3 Bags\nEP21260(Ivory) - 1000Grams\nEP21259(Yellow) - 150Grams	\N	\N	\N	\N
183	CID131	CAT004	ITM030	50+13+13	50	13	13	30	75	28	71.12	71.12	HDPE	MAS028	TRUE	Kg.	1	20K/Bag	Banana		81.1	20		\N	\N	\N	\N
184	CID131	CAT004	ITM031	63+12+12	63	12	12	35	87	30	76.2	76.2	HDPE	MAS028	TRUE	Kg.	1	20K/Bag	Banana		115.4	20		\N	\N	\N	\N
185	CID131	CAT004	ITM032	73+17+17	73	17	17	40	100	39	99.06	99.06	HDPE	MAS028	TRUE	Kg.	1	20K/Bag	Banana		212	20		\N	\N	\N	\N
186	CID733	CAT008	ITM044	44	44	0	0	28	140	30	76.2	76.2	LLDPE	MAS015	TRUE	Kg.	1	20K/Bag	None		93.9	0		\N	\N	\N	\N
187	CID733	CAT010	ITM046	99+16+16	99	16	16	30	75	0	94	94	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		184.7	0		\N	\N	\N	\N
188	CID810	CAT008	ITM044	18	18	0	0	18	90	14	35.56	35.56	LLDPE	MAS015	TRUE	Kg.	1	20K/Bag	None		11.5	0		\N	\N	\N	\N
189	CID683	CAT003	ITM020	31+9+9	31	9	9	15	37	20	50.8	50.8	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		18.4	0		\N	\N	\N	\N
190	CID683	CAT003	ITM021	37+13+13	37	13	13	16	40	24	60.96	60.96	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		30.7	0		\N	\N	\N	\N
191	CID683	CAT003	ITM022	44+13+13	44	13	13	18	45	32	81.28	81.28	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		51.2	0		\N	\N	\N	\N
192	CID432	CAT003	ITM020	30+10+10	30	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		15.2	0		\N	\N	\N	\N
193	CID432	CAT003	ITM021	33+10+10	33	10	10	14	35	24	60.96	60.96	HDPE	MAS030	TRUE	Kg.	1	20K/Bag	None		22.6	0		\N	\N	\N	\N
194	CID432	CAT008	ITM044	20	20	0	0	20	100	10	25.4	25.4	LLDPE	MAS015	TRUE	Kg.	1	20K/Bag	None		10.2	0		\N	\N	\N	\N
195	CID146	CAT003	ITM020	30+10+10	30	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		15.2	0		\N	\N	\N	\N
196	CID146	CAT003	ITM021	33+10+10	33	10	10	14	35	24	60.96	60.96	HDPE	MAS024	TRUE	Kg.	1	20K/Bag	None		22.6	0	L - Light Blue      White=7000grams\n   Blue=1000grams	\N	\N	\N	\N
197	CID241	CAT004	ITM028	30+5+5	30	5	5	22	55	16	40.64	40.64	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		17.9	20		\N	\N	\N	\N
198	CID241	CAT003	ITM021	40+6+6	40	6	6	22	55	20	50.8	50.8	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		29.1	20		\N	\N	\N	\N
199	CID754	CAT003	ITM018	22+6+6	22	6	6	10	25	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		6.9	0		\N	\N	\N	\N
200	CID754	CAT003	ITM019	23+8+8	23	8	8	11	27	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9.6	0		\N	\N	\N	\N
201	CID754	CAT003	ITM020	30+8+8	30	8	8	12	30	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		14	0		\N	\N	\N	\N
202	CID754	CAT003	ITM021	30+10+10	30	10	10	14	35	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		21.3	0		\N	\N	\N	\N
203	CID754	CAT001	ITM003	35+13+13	35	13	13	39	97	28	71.12	71.12	LLDPE	MAS029	TRUE	Kg.	1	50Pcs/P	None		84.2	0	4K/P	\N	\N	\N	\N
204	CID754	CAT001	ITM007	55+13+13	55	13	13	42	105	39	99.06	99.06	LLDPE	MAS029	TRUE	Kg.	1	25Pcs/5P	None		168.5	0	4K/P	\N	\N	\N	\N
205	CID754	CAT001	ITM006	51+17+17	51	17	17	18	45	0	76.5	76.5	HDPE	MAS031	FALSE	Packet	2	10P/Bag	None	plain	58.5	0		\N	\N	\N	\N
206	CID754	CAT001	ITM007	51+17+17	51	17	17	18	45	0	96	96	HDPE	MAS031	FALSE	Packet	2	10P/Bag	None	plain	73.4	0		\N	\N	\N	\N
207	CID075	CAT003	ITM019	26+8+8	26	8	8	10	25	0	0	0	HDPE	MAS005	TRUE	Box	6	20K/Bag	None		0	0		\N	\N	\N	\N
208	CID075	CAT003	ITM021	30+8+8	30	8	8	12	30	0	0	0	HDPE	MAS005	TRUE	Kg.	1	14K/Bag	None		0	0		\N	\N	\N	\N
209	CID510	CAT004	ITM027	27+5+5	27	5	5	24	60	16	40.64	40.64	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		18	20		\N	\N	\N	\N
210	CID510	CAT004	ITM028	32+10+10	32	10	10	24	60	20	50.8	50.8	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		31.7	20		\N	\N	\N	\N
211	CID510	CAT004	ITM029	36+12+12	36	12	12	24	60	0	0	0	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
212	CID198	CAT004	ITM027	29+8+8	29	8	8	30	75	16	40.64	40.64	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		27.4	20		\N	\N	\N	\N
213	CID198	CAT004	ITM029	40+8+8	40	8	8	30	75	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		46.9	20		\N	\N	\N	\N
214	CID592	CAT004	ITM025	21+5+5	21	5	5	20	50	10	25.4	25.4	HDPE	MAS023	TRUE	Kg.	1	20K/Bag	Banana		7.9	20		\N	\N	\N	\N
215	CID592	CAT004	ITM026	21+5+5	21	5	5	22	55	12	30.48	30.48	HDPE	MAS023	TRUE	Kg.	1	20K/Bag	Banana		10.4	20		\N	\N	\N	\N
216	CID592	CAT004	ITM027	25+7+7	25	7	7	24	60	14	35.56	35.56	HDPE	MAS023	TRUE	Kg.	1	20K/Bag	Banana		16.6	20		\N	\N	\N	\N
217	CID592	CAT004	ITM028	29+10+10	29	10	10	25	62	16	40.64	40.64	HDPE	MAS023	TRUE	Kg.	1	20K/Bag	Banana		24.7	20		\N	\N	\N	\N
218	CID592	CAT004	ITM029	33+10+10	33	10	10	26	65	18	45.72	45.72	HDPE	MAS023	TRUE	Kg.	1	20K/Bag	Banana		31.5	20		\N	\N	\N	\N
219	CID592	CAT004	ITM030	39+10+10	39	10	10	26	65	20	50.8	50.8	HDPE	MAS023	TRUE	Kg.	1	20K/Bag	Banana		39	20		\N	\N	\N	\N
220	CID592	CAT004	ITM031	50+15+15	50	15	15	28	70	0	0	0	HDPE	MAS032	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
221	CID592	CAT003	ITM019	28+9+9	28	9	9	17	42	18	45.72	45.72	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		17.7	30		\N	\N	\N	\N
222	CID592	CAT003	ITM020	31+10+10	31	10	10	17	42	24	60.96	60.96	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		26.1	30		\N	\N	\N	\N
224	CID423	CAT003	ITM019	25+7+7	25	7	7	13	32	16	40.64	40.64	HDPE	MAS006	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		10.1	30		\N	\N	\N	\N
225	CID423	CAT003	ITM020	32+10+10	32	10	10	15	37	20	50.8	50.8	HDPE	MAS004	TRUE	Box	5	20K/Bag	T-Shirt w/Hook		19.5	30		\N	\N	\N	\N
227	CID423	CAT003	ITM022	39+11+11	39	11	11	18	45	28	71.12	71.12	HDPE	MAS033	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		39	30		\N	\N	\N	\N
228	CID423	CAT003	ITM023	44+12+12	44	12	12	20	50	32	81.28	81.28	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		55.3	30		\N	\N	\N	\N
229	CID423	CAT004	ITM027	25+7+7	25	7	7	38	95	0	45	45	LLDPE	MAS011	FALSE	Box	4.5	20K/Bag	None		33.3	0		\N	\N	\N	\N
230	CID423	CAT004	ITM028	33+8+8	33	8	8	38	95	0	50	50	LLDPE	MAS011	FALSE	Box	4.5	20K/Bag	None		46.6	0		\N	\N	\N	\N
231	CID423	CAT004	ITM029	40+8+8	40	8	8	38	95	0	60	60	LLDPE	MAS011	FALSE	Box	4.5	20K/Bag	None		63.8	0		\N	\N	\N	\N
232	CID423	CAT004	ITM030	42+9+9	42	9	9	38	95	0	65	65	LLDPE	MAS011	FALSE	Box	4.5	20K/Bag	None		74.1	0		\N	\N	\N	\N
233	CID423	CAT004	ITM031	55+10+10	55	10	10	40	100	0	75	75	LLDPE	MAS011	FALSE	Box	4.5	20K/Bag	None		112.5	0		\N	\N	\N	\N
234	CID308	CAT008	ITM044	61	61	0	0	25	125	0	80	80	LLDPE	MAS015	FALSE	Pcs.	1	20Pcs/P x 5P/Bag	None		122	0		\N	\N	\N	\N
235	CID423	CAT001	ITM001	28+10+10	28	10	10	3	7	0	0	0	HDPE	MAS005	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
236	CID025	CAT001	ITM001	0	0	0	0	3	15	0	0	0	HDPE	MAS005	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
237	CID025	CAT001	ITM002	0	0	0	0	3	15	0	0	0	HDPE	MAS029	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
238	CID025	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS006	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
239	CID025	CAT002	ITM013	32+12+12	32	12	12	11	27	0	0	0	HDPE	MAS005	FALSE	Box	5	20K/Bag	None		0	0		\N	\N	\N	\N
240	CID025	CAT001	ITM006	46+18+18	46	18	18	10	25	0	93	93	LLDPE	MAS003	FALSE	Packet	2	10P/Bag	None		38.1	0		\N	\N	\N	\N
241	CID486	CAT003	ITM019	28+9+9	28	9	9	15	37	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
242	CID486	CAT003	ITM020	35+10+10	35	10	10	12	30	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
243	CID486	CAT003	ITM021	0	0	0	0	0	0	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
244	CID486	CAT003	ITM022	42+12+12	42	12	12	13	32	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		30	0		\N	\N	\N	\N
245	CID486	CAT003	ITM023	50+14+14	50	14	14	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		63.4	0		\N	\N	\N	\N
246	CID555	CAT001	ITM007	50+18+18	50	18	18	15	37	0	100	100	Regrind	MAS003	FALSE	Packet	1.4	10P/Bag	None	Sanabel Al-Sharq	63.6	0		\N	\N	\N	\N
247	CID486	CAT005	ITM033	32+9+9	32	9	9	4	10	0	110	110	HDPE	MAS011	TRUE	6 Roll	1	20(6R)/ Bag	None	Price House	11	0		\N	\N	\N	\N
248	CID486	CAT006	ITM036	50	50	0	0	8	40	0	0	0	HDPE	MAS011	TRUE	Roll w/Core	0.9	15R/Bag	None	Price House	0	0		\N	\N	\N	\N
249	CID486	CAT002	ITM011	28+10+10	28	10	10	12	30	0	0	0	HDPE	MAS011	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
250	CID486	CAT002	ITM012	28+11+11	28	11	11	12	30	0	0	0	HDPE	MAS019	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
251	CID486	CAT002	ITM013	30+12+12	30	12	12	12	30	0	0	0	HDPE	MAS034	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
252	CID486	CAT002	ITM014	34+14+14	34	14	14	14	35	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
253	CID486	CAT002	ITM015	40+16+16	40	16	16	14	35	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
254	CID486	CAT002	ITM016	44+18+18	44	18	18	14	35	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
718	CID336	CAT003	ITM018	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	1.8	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
255	CID486	CAT002	ITM017	50+20+20	50	20	20	14	35	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
256	CID588	CAT004	ITM027	27+5+5	27	5	5	25	62	16	40.64	40.64	HDPE	MAS019	TRUE	Kg.	1	20K/Bag	Banana		18.6	20		\N	\N	\N	\N
257	CID588	CAT004	ITM028	40+10+10	40	10	10	26	65	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		39.6	20		\N	\N	\N	\N
258	CID588	CAT004	ITM029	40+10+10	40	10	10	28	70	24	60.96	60.96	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		51.2	20		\N	\N	\N	\N
259	CID588	CAT004	ITM030	50+10+10	50	10	10	28	70	26	66.04	66.04	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		64.7	20		\N	\N	\N	\N
260	CID588	CAT004	ITM031	80+9+9	80	9	9	28	70	0	100	100	HDPE	MAS011	FALSE	Kg.	1	20K/Bag	Banana		137.2	20		\N	\N	\N	\N
261	CID588	CAT004	ITM030	50+10+10	50	10	10	28	70	0	65	65	HDPE	MAS011	FALSE	Kg.	1	20K/Bag	Banana		63.7	20		\N	\N	\N	\N
262	CID700	CAT003	ITM019	28+8+8	28	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		12.1	0		\N	\N	\N	\N
263	CID700	CAT003	ITM020	32+10+10	32	10	10	12	30	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		17.4	0		\N	\N	\N	\N
264	CID700	CAT003	ITM021	35+10+10	35	10	10	18	45	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		35.2	0		\N	\N	\N	\N
265	CID700	CAT012	ITM051	25+5+5	25	5	5	60	150	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		53.3	0		\N	\N	\N	\N
266	CID700	CAT012	ITM052	27+6+6	27	6	6	60	150	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		71.3	0		\N	\N	\N	\N
267	CID700	CAT005	ITM033	0	0	0	0	4	20	0	110	110	HDPE	MAS005	TRUE	7 Roll	1.1	20(7R)/ Bag	None	Muntazah	0	0		\N	\N	\N	\N
268	CID364	CAT003	ITM021	33+10+10	33	10	10	130	325	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		210	30		\N	\N	\N	\N
269	CID364	CAT004	ITM030	48+10+10	48	10	10	32	80	26	66.04	66.04	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		71.9	20		\N	\N	\N	\N
270	CID763	CAT004	ITM031	55+9+9	55	9	9	40	100	32	81.28	81.28	LLDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		118.7	0		\N	\N	\N	\N
271	CID763	CAT004	ITM032	72+14+14	72	14	14	45	112	39	99.06	99.06	LLDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		221.9	0		\N	\N	\N	\N
272	CID004	CAT001	ITM001	0	0	0	0	3	15	0	0	0	HDPE	MAS005	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
273	CID004	CAT001	ITM002	0	0	0	0	3	15	0	0	0	HDPE	MAS029	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
274	CID004	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS006	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
275	CID823	CAT008	ITM044	21	21	0	0	15	75	0	32	32	LLDPE	MAS015	FALSE	Kg.	1	20K/Bag	None		10.1	0		\N	\N	\N	\N
276	CID779	CAT003	ITM020	30+8+8	30	8	8	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.4	30		\N	\N	\N	\N
277	CID779	CAT003	ITM021	33+10+10	33	10	10	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.8	30		\N	\N	\N	\N
278	CID779	CAT008	ITM044	16	16	0	0	10	50	12	30.48	30.48	LLDPE	MAS015	TRUE	Kg.	1	20K/Bag	None		4.9	0		\N	\N	\N	\N
279	CID779	CAT008	ITM056	20	20	0	0	10	50	16	40.64	40.64	LLDPE	MAS015	TRUE	Kg.	1	20K/Bag	None		8.1	0		\N	\N	\N	\N
280	CID779	CAT008	ITM057	30	30	0	0	12	60	20	50.8	50.8	LLDPE	MAS015	TRUE	Kg.	1	20K/Bag	None		18.3	0		\N	\N	\N	\N
281	CID779	CAT008	ITM058	14+4.5+4.5	14	4.5	4.5	15	37	0	35	35	LLDPE	MAS015	FALSE	Kg.	1	20K/Bag	None		6	0		\N	\N	\N	\N
282	CID655	CAT012	ITM050	22+5+5	22	5	5	60	150	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		43.9	20		\N	\N	\N	\N
283	CID655	CAT012	ITM051	22+5+5	22	5	5	60	150	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		48.8	20		\N	\N	\N	\N
284	CID655	CAT012	ITM061	38+8+8	38	8	8	60	150	28	71.12	71.12	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	Banana		115.2	20		\N	\N	\N	\N
285	CID502	CAT004	ITM030	50	50	0	0	17	85	28	71.12	71.12	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		60.5	20		\N	\N	\N	\N
286	CID792	CAT001	ITM005	0	0	0	0	21	105	0	0	0	Regrind	MAS004	FALSE	Packet	1	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
287	CID792	CAT001	ITM006	0	0	0	0	21	105	0	0	0	Regrind	MAS004	FALSE	Packet	1	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
288	CID792	CAT002	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
289	CID792	CAT002	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
290	CID792	CAT002	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
291	CID792	CAT002	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
292	CID710	CAT005	ITM033	32+9+9	32	9	9	4	10	0	0	0	HDPE	MAS011	TRUE	5 Roll	0.8	5R/Bag	None	Sanabis	0	0		\N	\N	\N	\N
293	CID710	CAT005	ITM035	45+10+10	45	10	10	8	20	0	0	0	HDPE	MAS011	TRUE	Roll w/Core	4	5R/Bag	None	Sanabis	0	0		\N	\N	\N	\N
294	CID307	CAT008	ITM044	15	15	0	0	30	150	0	26	26	LLDPE	MAS015	FALSE	Box	10	20K/Bag	None		11.7	0		\N	\N	\N	\N
295	CID307	CAT008	ITM056	30	30	0	0	30	150	0	35	35	LLDPE	MAS015	FALSE	Box	10	20K/Bag	None		31.5	0		\N	\N	\N	\N
296	CID307	CAT008	ITM057	40+17+17	40	17	17	20	50	0	65	65	LLDPE	MAS001	FALSE	Roll	1.3	15R/Bag	None	plain	48.1	0		\N	\N	\N	\N
297	CID307	CAT008	ITM058	28	28	0	0	8	40	16	40.64	40.64	LLDPE	MAS015	TRUE	Box	10	20K/Bag	None		9.1	0		\N	\N	\N	\N
298	CID307	CAT008	ITM059	60	60	0	0	8	40	14	35.56	35.56	LLDPE	MAS015	TRUE	Roll w/Core	10	20K/Bag	None		17.1	0		\N	\N	\N	\N
299	CID307	CAT008	ITM067	35	35	0	0	10	50	22	55.88	55.88	LLDPE	MAS015	TRUE	Box	15	20K/Bag	None		19.6	0		\N	\N	\N	\N
300	CID307	CAT009	ITM045	34	34	0	0	12	60	0	45	45	LLDPE	MAS001	FALSE	Kg.	1	18Kg/Bag	None		18.4	0		\N	\N	\N	\N
301	CID597	CAT003	ITM021	50+11+11	50	11	11	19	47	24	60.96	60.96	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		41.3	0		\N	\N	\N	\N
302	CID101	CAT004	ITM027	37+7+7	37	7	7	40	100	16	40.64	40.64	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		41.5	20		\N	\N	\N	\N
303	CID720	CAT001	ITM003	33+11+11	33	11	11	13	32	24	60	60	HDPE	MAS029	TRUE	Kg.	1	50Pcs/P x 10P/Bag	None		21.1	0		\N	\N	\N	\N
304	CID720	CAT001	ITM004	61	61	0	0	13	65	30	76.2	76.2	HDPE	MAS035	TRUE	Kg.	1	100P/Bag	None		60.4	0	58Grams/Pieces	\N	\N	\N	\N
305	CID720	CAT001	ITM005	44+18+18	44	18	18	13	32	18	90	90	LLDPE	MAS029	TRUE	Kg.	1	50Pcs/P x 10P/Bag	None		46.1	0	44G/Pc	\N	\N	\N	\N
306	CID720	CAT001	ITM007	47+19+19	47	19	19	17	42	20	100	100	HDPE	MAS029	TRUE	Kg.	1	50Pcs/P x 5P/Bag	None		71.4	0	67G/Pc	\N	\N	\N	\N
307	CID528	CAT001	ITM006	20+5+5	20	5	5	10	25	0	31	31	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		4.6	0		\N	\N	\N	\N
308	CID528	CAT001	ITM003	30+10+10	30	10	10	11	27	0	60	60	HDPE	MAS036	FALSE	Kg.	1	50Pcs/P	None		16.2	0		\N	\N	\N	\N
309	CID528	CAT001	ITM003	30+10+10	30	10	10	14	35	24	60	60	HDPE	MAS008	TRUE	Kg.	1	50Pcs/P x 10P/Bag	None		21	0	.021K/Pc.	\N	\N	\N	\N
310	CID528	CAT001	ITM003	30+10+10	30	10	10	23	57	24	60	60	HDPE	MAS008	TRUE	Kg.	1	50Pcs/P	None		34.2	0	32.62Gr/Pc.	\N	\N	\N	\N
311	CID528	CAT001	ITM005	45+14+14	45	14	14	27	67	18	90	90	HDPE	MAS008	TRUE	Kg.	1	50Pcs/P	None		88	0	84.32Gr/Pc.	\N	\N	\N	\N
312	CID528	CAT001	ITM007	60+14+14	60	14	14	27	67	22	112	112	HDPE	MAS008	TRUE	Kg.	1	50Pcs/P	None		132.1	0	123.74Gr/Pc.	\N	\N	\N	\N
313	CID582	CAT003	ITM019	27+7+7	27	7	7	12	30	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		12.5	30	Master Batch Mixing:\n   Ivory/21260 ---- 1100 Grams\n   Yellow/21259 ---100 Grams\n400Grams Mixed Per Bag	\N	\N	\N	\N
314	CID582	CAT003	ITM020	30+10+10	30	10	10	16	40	22	55.88	55.88	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		22.4	30	Master Batch Mixing:\n   Ivory/21260 ---- 1100 Grams\n   Yellow/21259 ---100 Grams\n400Grams Mixed Per Bag	\N	\N	\N	\N
315	CID582	CAT003	ITM022	43+13+13	43	13	13	16	40	28	71.12	71.12	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		39.3	30	Master Batch Mixing:\n   Ivory/21260 ---- 1100 Grams\n   Yellow/21259 ---100 Grams\n400Grams Mixed Per Bag	\N	\N	\N	\N
316	CID117	CAT004	ITM028	38+8+8	38	8	8	30	75	20	50.8	50.8	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		41.1	20		\N	\N	\N	\N
317	CID478	CAT003	ITM019	0	0	0	0	0	0	0	0	0	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
318	CID478	CAT003	ITM020	32+10+10	32	10	10	18	45	22	55.88	55.88	HDPE	MAS037	TRUE	Kg.	1	20K/Bag	None		26.2	0		\N	\N	\N	\N
319	CID423	CAT001	ITM002	28+11+11	28	11	11	3	7	0	0	0	HDPE	MAS029	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
320	CID423	CAT001	ITM003	30+12+12	30	12	12	3	7	0	0	0	HDPE	MAS038	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
321	CID423	CAT001	ITM004	0	0	0	0	0	0	0	0	0	HDPE	MAS003	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
322	CID423	CAT001	ITM005	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
323	CID423	CAT001	ITM006	15+15+50	50	15	15	8	20	0	90	90	Regrind	MAS002	FALSE	Kg.	1	20K/Bag	None		28.8	0		\N	\N	\N	\N
324	CID423	CAT001	ITM007	18+18+50	50	18	18	14	35	0	0	0	Regrind	MAS002	FALSE	Packet	1.4	10P/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
325	CID423	CAT002	ITM011	10+10+28	28	10	10	12	30	0	50	50	HDPE	MAS005	FALSE	Kg.	0.9	20K/Bag	None	Modern Plastic Bag Factory	14.4	0	60-65 Pcs./Roll	\N	\N	\N	\N
326	CID423	CAT002	ITM012	11+11+28	28	11	11	12	30	0	60	60	HDPE	MAS029	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	18	0	50-55 Pcs./Roll	\N	\N	\N	\N
327	CID423	CAT002	ITM013	13+13+30	30	13	13	12	30	0	70	70	HDPE	MAS038	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	23.5	0	38-40 Pcs./Roll	\N	\N	\N	\N
328	CID423	CAT002	ITM014	34+14+14	34	14	14	14	35	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None	Modern Plastic Bag Factory	0	0	35-37 Pcs./Roll	\N	\N	\N	\N
329	CID423	CAT002	ITM015	40+16+16	40	16	16	14	35	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0	26-28 Pcs/Roll	\N	\N	\N	\N
330	CID423	CAT002	ITM016	44+18+18	44	18	18	14	35	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0	20-22 Pcs./Roll	\N	\N	\N	\N
331	CID423	CAT002	ITM017	50+20+20	50	20	20	14	35	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0	16-18 Pcs/Roll	\N	\N	\N	\N
332	CID423	CAT007	ITM040	15.2	15.2	0	0	10	50	0	0	0	LLDPE	MAS015	FALSE	Box	5	200g/P x 25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
333	CID423	CAT007	ITM041	0	0	0	0	10	50	0	0	0	LLDPE	MAS015	FALSE	Box	5	200g/P x 25P/Box	None	Modern Plastic Bag Factory	0	0	22pcs	\N	\N	\N	\N
334	CID423	CAT007	ITM042	0	0	0	0	10	50	0	0	0	LLDPE	MAS015	FALSE	Box	5	200g/P x 25P/Box	None	Modern Plastic Bag Factory	0	0	19 pcs	\N	\N	\N	\N
335	CID423	CAT007	ITM043	0	0	0	0	10	50	0	0	0	LLDPE	MAS015	FALSE	Box	5	200g/P x 25P/Box	None	Modern Plastic Bag Factory	0	0	14 pcs	\N	\N	\N	\N
336	CID690	CAT004	ITM027	32+10+10	32	10	10	24	60	18	45.72	45.72	HDPE	MAS039	TRUE	Kg.	1	20K/Bag	Banana		28.5	20		\N	\N	\N	\N
337	CID690	CAT004	ITM028	34+12+12	34	12	12	25	62	20	50.8	50.8	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	Banana		36.5	20		\N	\N	\N	\N
338	CID690	CAT004	ITM029	38+14+14	38	14	14	27	67	24	60.96	60.96	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	Banana		53.9	20		\N	\N	\N	\N
339	CID679	CAT003	ITM019	29+9+9	29	9	9	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		13.8	0		\N	\N	\N	\N
340	CID679	CAT003	ITM021	35+12+12	35	12	12	19	47	24	60.96	60.96	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		33.8	0		\N	\N	\N	\N
341	CID292	CAT003	ITM022	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
342	CID196	CAT003	ITM019	30+10+10	30	10	10	15	37	18	45.72	45.72	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt		16.9	30		\N	\N	\N	\N
343	CID196	CAT003	ITM022	46+13+13	46	13	13	16	40	28	71.12	71.12	HDPE	MAS013	TRUE	Kg.	1	20K/Bag	None		41	0		\N	\N	\N	\N
344	CID126	CAT003	ITM018	21+6+6	21	6	6	11	27	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
345	CID126	CAT003	ITM019	26+7+7	26	7	7	11	27	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		9.9	0		\N	\N	\N	\N
346	CID126	CAT003	ITM021	34+10+10	34	10	10	14	35	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
347	CID824	CAT004	ITM028	35	35	0	0	25	125	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		40	0		\N	\N	\N	\N
348	CID721	CAT004	ITM027	16	16	0	0	18	90	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		8.8	0		\N	\N	\N	\N
349	CID721	CAT004	ITM028	31+4+4	31	4	4	32	80	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		25.4	0		\N	\N	\N	\N
350	CID721	CAT004	ITM029	41+4+4	41	4	4	32	80	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		35.8	0		\N	\N	\N	\N
351	CID484	CAT012	ITM049	21+5+5	21	5	5	50	125	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		35.4	0		\N	\N	\N	\N
352	CID484	CAT012	ITM051	22+6+6	22	6	6	50	125	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		43.2	0		\N	\N	\N	\N
353	CID484	CAT012	ITM052	26+6+6	26	6	6	50	125	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		57.9	0		\N	\N	\N	\N
354	CID484	CAT012	ITM049	0	0	0	0	0	0	0	0	0	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
355	CID484	CAT012	ITM051	6+6+21	21	6	6	16	40	0	0	0	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
356	CID484	CAT012	ITM052	6+6+25	25	6	6	23	57	0	0	0	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
719	CID336	CAT003	ITM019	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	5	20K/Bag	None		0	0		\N	\N	\N	\N
357	CID423	CAT007	ITM054	0	0	0	0	10	50	0	0	0	LLDPE	MAS015	FALSE	Box	5	200g/P x 25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
358	CID423	CAT007	ITM055	0	0	0	0	10	50	0	0	0	LLDPE	MAS015	FALSE	Box	5	200g/P x 25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
359	CID423	CAT007	ITM064	0	0	0	0	10	50	0	0	0	LLDPE	MAS015	FALSE	Box	5	200g/P x 25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
360	CID423	CAT007	ITM065	0	0	0	0	10	50	0	0	0	LLDPE	MAS015	FALSE	Box	5	200g/P x 25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
361	CID423	CAT007	ITM066	0	0	0	0	10	50	0	0	0	LLDPE	MAS015	FALSE	Box	5	200g/P x 25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
362	CID649	CAT003	ITM020	32+10+10	32	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		15.8	30		\N	\N	\N	\N
363	CID649	CAT003	ITM021	12+12+41	41	12	12	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		25.4	30		\N	\N	\N	\N
364	CID649	CAT008	ITM044	16	16	0	0	10	50	8	20.32	20.32	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		3.3	0		\N	\N	\N	\N
365	CID657	CAT003	ITM020	31+9+9	31	9	9	15	37	20	50.8	50.8	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt		18.4	30		\N	\N	\N	\N
366	CID657	CAT003	ITM021	37+13+13	37	13	13	16	40	24	60.96	60.96	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt		30.7	30		\N	\N	\N	\N
367	CID657	CAT003	ITM022	44+13+13	44	13	13	18	45	32	81.28	81.28	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt		51.2	30		\N	\N	\N	\N
368	CID657	CAT004	ITM025	15	15	0	0	18	90	8	20.32	20.32	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		5.5	0		\N	\N	\N	\N
369	CID657	CAT004	ITM026	18	18	0	0	18	90	10	25.4	25.4	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		8.2	0		\N	\N	\N	\N
370	CID657	CAT004	ITM027	22+5+5	22	5	5	35	87	12	30.48	30.48	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		17	0		\N	\N	\N	\N
371	CID655	CAT012	ITM061	38+8+8	38	8	8	60	150	0	70	70	LLDPE	MAS029	FALSE	Kg.	1	20K/Bag	None		113.4	0		\N	\N	\N	\N
372	CID655	CAT012	ITM050	22+5+5	22	5	5	60	150	18	45.72	45.72	LLDPE	MAS014	TRUE	Kg.	1	20K/Bag	None		43.9	0		\N	\N	\N	\N
373	CID657	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	3 Roll	0.4	30x3R/Bag	None	World of Savings	11	0		\N	\N	\N	\N
374	CID657	CAT005	ITM034	32+9+9	32	9	9	6	15	20	110	110	HDPE	MAS005	TRUE	Roll	0.5	30R/Bag	None	World of Savings	16.5	0		\N	\N	\N	\N
375	CID657	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	0.5	30R/Bag	None	World of Savings	44	0		\N	\N	\N	\N
376	CID657	CAT007	ITM040	15	15	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Kg.	1	.20K/P x 60P/Bag	None	World of Savings	0	0		\N	\N	\N	\N
377	CID657	CAT007	ITM041	20	20	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Kg.	1	.20K/P x 60P/Bag	None	World of Savings	0	0		\N	\N	\N	\N
378	CID657	CAT007	ITM042	25.5	25.5	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Kg.	1	.20K/P x 60P/Bag	None	World of Savings	0	0		\N	\N	\N	\N
379	CID657	CAT007	ITM043	30.5	30.5	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Kg.	1	.20K/P x 60P/Bag	None	World of Savings	0	0		\N	\N	\N	\N
380	CID657	CAT001	ITM004	36+15+15	36	15	15	7	17	0	70	70	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	World of Savings	15.7	0		\N	\N	\N	\N
381	CID657	CAT001	ITM005	40+15+15	40	15	15	7	17	0	80	80	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	World of Savings	19	0		\N	\N	\N	\N
382	CID657	CAT001	ITM006	50+15+15	50	15	15	7	17	0	90	90	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	World of Savings	24.5	0		\N	\N	\N	\N
383	CID657	CAT001	ITM007	50+17+17	50	17	17	7	17	0	100	100	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	World of Savings	28.6	0		\N	\N	\N	\N
384	CID657	CAT001	ITM004	36+15+15	36	15	15	7	17	0	70	70	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	Modern Plastic Bag Factory	15.7	0		\N	\N	\N	\N
385	CID657	CAT001	ITM005	40+15+15	40	15	15	7	17	0	80	80	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	Modern Plastic Bag Factory	19	0		\N	\N	\N	\N
386	CID657	CAT001	ITM006	50+15+15	50	15	15	7	17	0	90	90	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	Modern Plastic Bag Factory	24.5	0		\N	\N	\N	\N
387	CID657	CAT001	ITM007	50+17+17	50	17	17	7	17	0	100	100	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	Modern Plastic Bag Factory	28.6	0		\N	\N	\N	\N
388	CID657	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS006	FALSE	Packet	0.5	30P/Bag	None		0	0		\N	\N	\N	\N
389	CID657	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Roll	0.5	30R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
390	CID657	CAT002	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS029	FALSE	Roll	0.5	30R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
391	CID657	CAT002	ITM013	0	0	0	0	0	0	0	0	0	HDPE	MAS006	FALSE	Roll	0.5	30R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
392	CID657	CAT002	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	0.5	30R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
393	CID657	CAT002	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	0.5	30R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
394	CID657	CAT002	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	0.5	30R/bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
395	CID657	CAT002	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	0.5	30R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
396	CID822	CAT003	ITM020	31+9+9	31	9	9	15	37	20	50.8	50.8	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		18.4	0		\N	\N	\N	\N
397	CID822	CAT003	ITM021	37+13+13	37	13	13	17	42	24	60.96	60.96	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		32.3	0		\N	\N	\N	\N
398	CID822	CAT003	ITM022	48+13+13	48	13	13	20	50	32	81.28	81.28	HDPE	MAS040	TRUE	Kg.	1	20K/Bag	None		60.1	0		\N	\N	\N	\N
399	CID503	CAT003	ITM020	35+10+10	35	10	10	15	37	20	50.8	50.8	HDPE	MAS041	TRUE	Kg.	1	20K/Bag	None		20.7	0		\N	\N	\N	\N
400	CID503	CAT003	ITM022	40+12+12	40	12	12	16	40	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	18K/Bag	None		36.4	0		\N	\N	\N	\N
401	CID503	CAT003	ITM023	46+15+15	46	15	15	16	40	32	81.28	81.28	HDPE	MAS008	TRUE	Kg.	1	18K/Bag	None		49.4	0		\N	\N	\N	\N
402	CID503	CAT005	ITM033	32+9+9	32	9	9	4	10	0	110	110	HDPE	MAS005	TRUE	6 Roll	1	20(6R)/Bag	None	Modern Plastic Bag Factory	11	0		\N	\N	\N	\N
403	CID503	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	0.9	15R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
404	CID503	CAT006	ITM038	60	60	0	0	8	40	20	140	140	HDPE	MAS005	TRUE	Roll w/Core	0.9	15R/Bag	None	Modern Plastic Bag Factory	67.2	0		\N	\N	\N	\N
405	CID503	CAT001	ITM004	36+15+15	36	15	15	8	20	0	70	70	Regrind	MAS003	FALSE	Packet	0.9	20K/Bag	None	Modern Plastic Bag Factory	18.5	0		\N	\N	\N	\N
406	CID503	CAT001	ITM005	40+15+15	40	15	15	8	20	0	80	80	Regrind	MAS003	FALSE	Packet	0.9	20K/Bag	None	Modern Plastic Bag Factory	22.4	0		\N	\N	\N	\N
407	CID503	CAT001	ITM006	50+15+15	50	15	15	7.5	18	0	90	90	Regrind	MAS003	FALSE	Packet	0.9	20K/Bag	None	Modern Plastic Bag Factory	25.9	0		\N	\N	\N	\N
408	CID503	CAT001	ITM007	50+17+17	50	17	17	8	20	0	100	100	Regrind	MAS003	FALSE	Packet	0.9	20K/Bag	None	Modern Plastic Bag Factory	33.6	0		\N	\N	\N	\N
409	CID503	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS011	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
410	CID503	CAT002	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS019	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
411	CID503	CAT002	ITM013	0	0	0	0	0	0	0	0	0	HDPE	MAS034	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
412	CID503	CAT002	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
413	CID503	CAT002	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
414	CID503	CAT002	ITM016	0	0	0	0	14	70	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
415	CID503	CAT002	ITM017	0	0	0	0	14	70	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
416	CID172	CAT003	ITM019	25+7+7	25	7	7	11	27	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		9.6	0		\N	\N	\N	\N
417	CID172	CAT003	ITM020	32+10+10	32	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		15.8	0		\N	\N	\N	\N
418	CID172	CAT003	ITM021	35+11+11	35	11	11	14	35	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		26.3	0		\N	\N	\N	\N
419	CID172	CAT003	ITM022	47+13+13	47	13	13	18	45	32	81.28	81.28	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		53.4	0		\N	\N	\N	\N
420	CID172	CAT008	ITM044	12	12	0	0	17	85	10	25.4	25.4	LLDPE	MAS015	TRUE	Kg.	1	20K/Bag	None		5.2	0		\N	\N	\N	\N
421	CID172	CAT008	ITM056	16	16	0	0	17	85	10	25.4	25.4	LLDPE	MAS015	TRUE	Kg.	1	20K/Bag	None		6.9	0		\N	\N	\N	\N
422	CID172	CAT008	ITM057	19	19	0	0	15	75	12	30.48	30.48	LLDPE	MAS015	TRUE	Kg.	1	20K/Bag	None		8.7	0		\N	\N	\N	\N
423	CID172	CAT008	ITM058	22	22	0	0	15	75	12	30.48	30.48	LLDPE	MAS015	TRUE	Kg.	1	20K/Bag	None		10.1	0		\N	\N	\N	\N
424	CID172	CAT008	ITM059	32	32	0	0	20	100	16	40.64	40.64	LLDPE	MAS015	TRUE	Kg.	1	20K/Bag	None		26	0		\N	\N	\N	\N
425	CID020	CAT002	ITM011	0	0	0	0	0	0	0	0	0	Regrind	MAS011	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
426	CID020	CAT002	ITM012	0	0	0	0	0	0	0	0	0	Regrind	MAS019	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
427	CID020	CAT002	ITM013	0	0	0	0	0	0	0	0	0	Regrind	MAS034	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
428	CID020	CAT002	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
429	CID020	CAT002	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
430	CID020	CAT002	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
431	CID020	CAT002	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
432	CID020	CAT005	ITM033	32+9+9	32	9	9	4	10	0	110	110	HDPE	MAS011	TRUE	6 Roll	1	20(6R)/ Bag	None	Modern Plastic Bag Factory	11	0		\N	\N	\N	\N
433	CID020	CAT005	ITM033	32+9+9	32	9	9	6	15	0	110	110	HDPE	MAS011	TRUE	Roll	1	20K/Bag	None	Modern Plastic Bag Factory	16.5	0		\N	\N	\N	\N
434	CID020	CAT006	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS011	TRUE	Roll w/Core	1	20K/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
435	CID020	CAT006	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS011	TRUE	Roll w/Core	2	10R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
436	CID020	CAT006	ITM037	55	55	0	0	6	30	0	110	110	HDPE	MAS011	TRUE	Roll	0.8	15R/Bag	None	Modern Plastic Bag Factory	36.3	0		\N	\N	\N	\N
437	CID020	CAT006	ITM038	60	60	0	0	8	40	0	140	140	HDPE	MAS011	TRUE	Roll	1.8	10R/Bag	None	Modern Plastic Bag Factory	67.2	0		\N	\N	\N	\N
438	CID135	CAT003	ITM019	8+8+25	25	8	8	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		10	0		\N	\N	\N	\N
439	CID135	CAT003	ITM020	30+10+10	30	10	10	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		16.3	0		\N	\N	\N	\N
440	CID135	CAT003	ITM021	30+10+10	30	10	10	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		19.5	0		\N	\N	\N	\N
441	CID135	CAT003	ITM022	41+13+13	41	13	13	15	37	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		35.3	0		\N	\N	\N	\N
442	CID135	CAT003	ITM023	50+14+14	50	14	14	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		63.4	0		\N	\N	\N	\N
443	CID135	CAT005	ITM033	32+9+9	32	9	9	4	10	0	110	110	HDPE	MAS005	TRUE	6 Roll	1	6R/P x 20P/Bag	None	Big World	11	0		\N	\N	\N	\N
444	CID135	CAT005	ITM033	32+9+9	32	9	9	4	10	0	110	110	HDPE	MAS005	TRUE	Roll	0.5	40R/Bag	None	Big World	11	0		\N	\N	\N	\N
445	CID135	CAT005	ITM033	32+9+9	32	9	9	4	10	0	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Big World	11	0		\N	\N	\N	\N
446	CID613	CAT003	ITM022	40+13+13	40	13	13	22	55	30	76.2	76.2	HDPE	MAS008	TRUE	Kg.	1	20K/Bag	T-Shirt		55.3	30		\N	\N	\N	\N
447	CID423	CAT005	ITM033	32+9+9	32	9	9	4	10	0	110	110	HDPE	MAS011	TRUE	5 Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	11	0		\N	\N	\N	\N
448	CID423	CAT005	ITM034	32+9+9	32	9	9	4	10	0	0	0	HDPE	MAS011	FALSE	6 Roll	1	5R/Bag	None		0	0		\N	\N	\N	\N
449	CID185	CAT003	ITM020	33+10+10	33	10	10	20	50	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		26.9	0		\N	\N	\N	\N
450	CID720	CAT001	ITM001	0	0	0	0	3	15	0	0	0	HDPE	MAS011	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
451	CID720	CAT002	ITM002	0	0	0	0	3	15	0	0	0	HDPE	MAS019	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
452	CID720	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS042	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
453	CID142	CAT010	ITM046	80+27.5+27.5	80	27.5	27.5	11	27	0	0	0	HDPE	MAS005	FALSE	Roll	1	20K/Bag	None		0	0	Slit One Side	\N	\N	\N	\N
454	CID547	CAT003	ITM019	26+8+8	26	8	8	13	32	18	45.72	45.72	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		12.3	0		\N	\N	\N	\N
455	CID675	CAT010	ITM046	55	55	0	0	17	85	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		52.2	0		\N	\N	\N	\N
456	CID675	CAT010	ITM062	55	55	0	0	17	85	32	81.28	81.28	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		76	0		\N	\N	\N	\N
457	CID192	CAT003	ITM019	9+9+28	28	9	9	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		13.5	0		\N	\N	\N	\N
458	CID192	CAT003	ITM020	10+10+32	32	10	10	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		18.5	0		\N	\N	\N	\N
459	CID506	CAT001	ITM006	50+18+18	50	18	18	15	37	0	106	106	Regrind	MAS002	FALSE	Packet	1.4	10P/Bag	None		67.5	0		\N	\N	\N	\N
460	CID506	CAT001	ITM010	70+25+25	70	25	25	12	30	0	130	130	Regrind	MAS002	FALSE	Packet	1.4	5P/Bag	None		93.6	0		\N	\N	\N	\N
461	CID691	CAT003	ITM019	28+9+9	28	9	9	15	37	18	45.72	45.72	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		15.6	0		\N	\N	\N	\N
462	CID691	CAT003	ITM020	35+10+10	35	10	10	15	37	22	55.88	55.88	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		22.7	0		\N	\N	\N	\N
463	CID691	CAT003	ITM022	40+12+12	40	12	12	16	40	28	71.12	71.12	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		36.4	0		\N	\N	\N	\N
464	CID691	CAT003	ITM023	50+14+14	50	14	14	20	50	0	0	0	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
465	CID654	CAT003	ITM020	31+9+9	31	9	9	16	40	20	50.8	50.8	HDPE	MAS006	TRUE	Kg.	1	20K/Bag	None		19.9	0		\N	\N	\N	\N
466	CID654	CAT003	ITM021	37+13+13	37	13	13	18	45	0	0	0	HDPE	MAS006	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
467	CID654	CAT003	ITM022	50+14+14	50	14	14	20	50	32	81.28	81.28	HDPE	MAS006	TRUE	Kg.	1	20K/Bag	None		63.4	0		\N	\N	\N	\N
468	CID582	CAT008	ITM041	20	20	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.1	0		\N	\N	\N	\N
469	CID582	CAT008	ITM042	26	26	0	0	10	50	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		10.6	0		\N	\N	\N	\N
470	CID582	CAT008	ITM043	31	31	0	0	10	50	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		15.7	0		\N	\N	\N	\N
471	CID226	CAT005	ITM033	32+9+9	32	9	9	4	10	0	110	110	HDPE	MAS005	TRUE	5 Roll	0.9	5R/Bag	None	Anud Cold Store	11	0		\N	\N	\N	\N
472	CID226	CAT006	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS005	TRUE	Roll w/Core	1.8	10R/Bag	None	Anud Cold Store	44	0		\N	\N	\N	\N
473	CID226	CAT006	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS005	TRUE	Roll w/Core	3	5R/Bag	None	Anud Cold Store	44	0		\N	\N	\N	\N
474	CID226	CAT006	ITM037	55	55	0	0	6	30	0	110	110	HDPE	MAS005	TRUE	Roll	0.8	15R/Bag	None	Modern Plastic Bag Factory	36.3	0		\N	\N	\N	\N
475	CID226	CAT006	ITM038	60	60	0	0	8	40	0	140	140	HDPE	MAS005	TRUE	Roll	1.8	10R/Bag	None	Modern Plastic Bag Factory	67.2	0		\N	\N	\N	\N
476	CID226	CAT001	ITM004	36+16+16	36	16	16	10	25	0	70	70	Regrind	MAS002	FALSE	Packet	1	10P/Bag	None	Modern Plastic Bag Factory	23.8	0		\N	\N	\N	\N
477	CID226	CAT001	ITM005	40+16+16	40	16	16	10	25	0	80	80	Regrind	MAS002	FALSE	Packet	1.2	10P/Bag	None	Modern Plastic Bag Factory	28.8	0		\N	\N	\N	\N
478	CID226	CAT001	ITM006	50+15+15	50	15	15	10	25	0	90	90	Regrind	MAS002	FALSE	Packet	1.4	10P/Bag	None	Modern Plastic Bag Factory	36	0		\N	\N	\N	\N
479	CID226	CAT001	ITM007	50+18+18	50	18	18	14	35	0	100	100	Regrind	MAS002	FALSE	Packet	1.4	10P/Bag	None	Modern Plastic Bag Factory	60.2	0		\N	\N	\N	\N
480	CID226	CAT002	ITM011	28+10+10	28	10	10	12	30	0	50	50	HDPE	MAS005	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	14.4	0		\N	\N	\N	\N
481	CID226	CAT002	ITM012	28+11+11	28	11	11	12	30	0	55	55	HDPE	MAS029	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	16.5	0		\N	\N	\N	\N
482	CID226	CAT002	ITM013	30+12+12	30	12	12	12	30	0	65	65	HDPE	MAS006	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	21.1	0		\N	\N	\N	\N
483	CID226	CAT002	ITM014	34+14+14	34	14	14	14	35	0	70	70	Regrind	MAS002	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	30.4	0		\N	\N	\N	\N
484	CID226	CAT002	ITM015	40+16+16	40	16	16	14	35	0	80	80	Regrind	MAS002	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	40.3	0		\N	\N	\N	\N
485	CID226	CAT002	ITM016	44+18+18	44	18	18	14	35	0	90	90	Regrind	MAS002	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	50.4	0		\N	\N	\N	\N
486	CID226	CAT002	ITM017	50+20+20	50	20	20	14	35	0	100	100	Regrind	MAS002	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	63	0		\N	\N	\N	\N
487	CID320	CAT007	ITM040	0	0	0	0	10	50	0	0	0	LLDPE	MAS015	FALSE	Kg.	1	.20K/P x 60P/Bag	None	Jarash	0	0		\N	\N	\N	\N
488	CID405	CAT003	ITM019	27+8+8	27	8	8	12	30	18	45.72	45.72	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		11.8	0		\N	\N	\N	\N
489	CID405	CAT003	ITM020	32+10+10	32	10	10	14	35	20	50.8	50.8	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		18.5	0		\N	\N	\N	\N
490	CID405	CAT003	ITM021	32+10+10	32	10	10	14	35	24	60.96	60.96	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		22.2	0		\N	\N	\N	\N
491	CID825	CAT003	ITM019	25+7+7	25	7	7	11	27	0	45	45	HDPE	MAS005	FALSE	Kg.	1	20K/Bag	T-Shirt		9.5	30		\N	\N	\N	\N
492	CID825	CAT003	ITM020	32+10+10	32	10	10	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		18.5	0		\N	\N	\N	\N
493	CID825	CAT003	ITM021	32+10+10	32	10	10	14	35	24	60.96	60.96	HDPE	MAS015	TRUE	Kg.	1	20K/Bag	None		22.2	0		\N	\N	\N	\N
494	CID577	CAT003	ITM019	0	0	0	0	0	0	18	45.72	45.72	HDPE	MAS013	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
495	CID577	CAT003	ITM020	0	0	0	0	0	0	20	50.8	50.8	HDPE	MAS013	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
496	CID476	CAT001	ITM006	45+18+18	45	18	18	10	25	0	90	90	Regrind	MAS003	FALSE	Packet	1.4	10P/Bag	None	Modern Plastic Bag Factory	36.5	0		\N	\N	\N	\N
497	CID476	CAT001	ITM007	50+18+18	50	18	18	14	35	0	100	100	Regrind	MAS003	FALSE	Packet	1.4	10P/Bag	None	Modern Plastic Bag Factory	60.2	0		\N	\N	\N	\N
498	CID757	CAT012	ITM050	22+6+6	22	6	6	38	95	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		32.8	0		\N	\N	\N	\N
499	CID757	CAT012	ITM060	27+6+6	27	6	6	40	100	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		47.5	0		\N	\N	\N	\N
500	CID826	CAT004	ITM027	32	32	0	0	12	60	16	40.64	40.64	HDPE	MAS027	TRUE	Kg.	1	20K/Bag	Banana		15.6	20		\N	\N	\N	\N
501	CID826	CAT004	ITM028	35+6+6	35	6	6	24	60	18	45.72	45.72	HDPE	MAS027	TRUE	Kg.	1	20K/Bag	Banana		25.8	20		\N	\N	\N	\N
502	CID826	CAT015	ITM110	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
503	CID034	CAT003	ITM020	30+9+9	30	9	9	28	70	20	50.8	50.8	HDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		34.1	0		\N	\N	\N	\N
504	CID411	CAT008	ITM044	21	21	0	0	12	60	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		6.4	0	Plastic Spoon	\N	\N	\N	\N
505	CID617	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	6 Roll	1	20(6R)/Bag	None	Taqs	11	0		\N	\N	\N	\N
506	CID476	CAT001	ITM005	40+16+16	40	16	16	10	25	0	0	0	Regrind	MAS003	FALSE	Packet	1.2	10P/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
507	CID574	CAT003	ITM020	31+9+9	31	9	9	14	35	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
508	CID574	CAT003	ITM021	37+13+13	37	13	13	14	35	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
720	CID336	CAT003	ITM020	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	5	20K/Bag	None		0	0		\N	\N	\N	\N
509	CID574	CAT003	ITM022	44+13+13	44	13	13	16	40	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
510	CID573	CAT008	ITM044	18	18	0	0	15	75	12	30.48	30.48	LLDPE	MAS015	TRUE	Kg.	1	20K/Bag	None		8.2	0		\N	\N	\N	\N
511	CID278	CAT003	ITM019	27+7+7	27	7	7	12	30	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		12.5	0		\N	\N	\N	\N
512	CID278	CAT003	ITM020	30+10+10	30	10	10	15	37	22	55.88	55.88	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		20.7	0		\N	\N	\N	\N
513	CID2097	CAT012	ITM049	28	28	0	0	10	50	17	43.18	43.18	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		12.1	0		\N	\N	\N	\N
514	CID349	CAT009	ITM045	40	40	0	0	30	150	24	60.96	60.96	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		73.2	0	Film - Light Green	\N	\N	\N	\N
515	CID783	CAT004	ITM026	20	20	0	0	20	100	12	30.48	30.48	LLDPE	MAS043	TRUE	Kg.	1	20K/Bag	None		12.2	0		\N	\N	\N	\N
516	CID783	CAT004	ITM027	30	30	0	0	20	100	20	50.8	50.8	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	None		30.5	0		\N	\N	\N	\N
517	CID330	CAT004	ITM027	31+6+6	31	6	6	40	100	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35	20		\N	\N	\N	\N
518	CID330	CAT004	ITM028	35+6+6	35	6	6	40	100	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		47.8	20		\N	\N	\N	\N
519	CID330	CAT004	ITM021	35+7+7	35	7	7	40	100	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		54.8	20		\N	\N	\N	\N
520	CID151	CAT004	ITM027	31+6+6	31	6	6	40	100	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35	20		\N	\N	\N	\N
521	CID151	CAT004	ITM028	35+6+6	35	6	6	40	100	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		47.8	20		\N	\N	\N	\N
522	CID151	CAT004	ITM029	35+7+7	35	7	7	40	100	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		54.8	20		\N	\N	\N	\N
523	CID377	CAT004	ITM027	0	0	0	0	0	0	0	0	0	LLDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
524	CID377	CAT004	ITM028	0	0	0	0	0	0	0	0	0	LLDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
525	CID377	CAT004	ITM029	0	0	0	0	0	0	0	0	0	LLDPE	MAS011	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
526	CID269	CAT003	ITM020	30+9+9	30	9	9	16	40	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
527	CID269	CAT003	ITM021	40+12+12	40	12	12	20	50	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
528	CID517	CAT004	ITM025	16	16	0	0	18	90	8	20.32	20.32	LLDPE	MAS044	TRUE	Kg.	1	20K/Bag	Banana		5.9	20		\N	\N	\N	\N
529	CID517	CAT004	ITM026	22	22	0	0	18	90	10	25.4	25.4	LLDPE	MAS044	TRUE	Kg.	1	20K/Bag	Banana		10.1	20		\N	\N	\N	\N
530	CID517	CAT004	ITM027	26	26	0	0	13	65	12	30.48	30.48	LLDPE	MAS044	TRUE	Kg.	1	20K/Bag	Banana		10.3	20		\N	\N	\N	\N
531	CID517	CAT004	ITM028	28	28	0	0	13	65	14	35.56	35.56	HDPE	MAS044	TRUE	Kg.	1	20K/Bag	Banana		12.9	20		\N	\N	\N	\N
532	CID517	CAT003	ITM021	30+9+9	30	9	9	28	70	20	50.8	50.8	HDPE	MAS044	TRUE	Kg.	1	20K/Bag	T-Shirt		34.1	30		\N	\N	\N	\N
533	CID741	CAT006	ITM036	50	50	0	0	8	40	0	110	110	LLDPE	MAS005	TRUE	Roll w/Core	1.8	10R/Bag	None	Manal	44	0		\N	\N	\N	\N
534	CID1122	CAT001	ITM001	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
535	CID1122	CAT001	ITM002	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
536	CID1122	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS003	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
537	CID1122	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS005	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
538	CID1122	CAT001	ITM006	50+17+17	50	17	17	8	20	0	0	0	HDPE	MAS041	FALSE	Packet	1.5	10P/Bag	None	Plain	0	0		\N	\N	\N	\N
539	CID1122	CAT001	ITM005	40+15+15	40	15	15	10	25	0	0	0	HDPE	MAS006	FALSE	Packet	1.3	10P/Bag	None		0	0		\N	\N	\N	\N
540	CID411	CAT003	ITM019	25+7+7	25	7	7	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		10.7	30		\N	\N	\N	\N
541	CID411	CAT003	ITM020	30+10+10	30	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		15.2	30		\N	\N	\N	\N
542	CID411	CAT003	ITM021	35+12+12	35	12	12	12	30	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		21.6	30		\N	\N	\N	\N
543	CID411	CAT003	ITM022	40+12+12	40	12	12	12	30	0	0	0	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
544	CID698	CAT004	ITM027	8+8+28	28	8	8	25	62	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		22.2	0		\N	\N	\N	\N
545	CID698	CAT004	ITM029	35+10+10	35	10	10	25	62	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		41.6	0		\N	\N	\N	\N
546	CID698	CAT004	ITM030	46+11+11	46	11	11	25	62	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		55.7	0		\N	\N	\N	\N
547	CID698	CAT004	ITM031	50+14+14	50	14	14	28	70	36	91.44	91.44	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		99.9	0		\N	\N	\N	\N
548	CID624	CAT004	ITM027	26+5+5	26	5	5	30	75	14	35.56	35.56	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		19.2	0		\N	\N	\N	\N
549	CID624	CAT004	ITM029	50	50	0	0	15	75	24	60.96	60.96	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		45.7	0		\N	\N	\N	\N
550	CID624	CAT004	ITM030	60+14+14	60	14	14	25	62	30	76.2	76.2	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		83.1	0		\N	\N	\N	\N
551	CID624	CAT004	ITM031	66+16+16	66	16	16	25	62	39	99.06	99.06	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		120.4	0		\N	\N	\N	\N
552	CID598	CAT008	ITM044	33	33	0	0	11	55	0	50	50	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		18.2	0		\N	\N	\N	\N
553	CID598	CAT008	ITM056	40	40	0	0	11	55	0	47	47	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		20.7	0		\N	\N	\N	\N
554	CID598	CAT008	ITM057	62	62	0	0	10	50	0	72	72	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		44.6	0		\N	\N	\N	\N
555	CID598	CAT008	ITM058	79	79	0	0	12	60	0	142	142	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		134.6	0		\N	\N	\N	\N
556	CID598	CAT008	ITM059	18	18	0	0	16	80	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.3	0		\N	\N	\N	\N
557	CID598	CAT008	ITM067	46	46	0	0	10	50	0	63	63	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		29	0		\N	\N	\N	\N
558	CID038	CAT005	ITM033	32+9+9	32	9	9	4	10	0	110	110	HDPE	MAS005	TRUE	Roll	1.2	10R/Bag	None	Ahmad Saad (Busaad Plastic)	11	0		\N	\N	\N	\N
559	CID004	CAT001	ITM010	70+30+30	70	30	30	20	50	0	130	130	HDPE	MAS002	FALSE	Packet	1.8	5P/Bag	None		169	0		\N	\N	\N	\N
560	CID829	CAT004	ITM028	33+6+6	33	6	6	26	65	20	50.8	50.8	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		29.7	0		\N	\N	\N	\N
561	CID829	CAT004	ITM028	33+6+6	33	6	6	26	65	20	50.8	50.8	LLDPE	MAS035	TRUE	Kg.	1	20K/Bag	None		29.7	0		\N	\N	\N	\N
562	CID829	CAT004	ITM028	33+6+6	33	6	6	26	65	20	50.8	50.8	LLDPE	MAS045	TRUE	Kg.	1	20K/Bag	None		29.7	0		\N	\N	\N	\N
721	CID336	CAT003	ITM021	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	5	20K/Bag	None		0	0		\N	\N	\N	\N
563	CID829	CAT004	ITM028	33+6+6	33	6	6	26	65	20	50.8	50.8	LLDPE	MAS024	TRUE	Kg.	1	20K/Bag	None		29.7	0		\N	\N	\N	\N
564	CID830	CAT004	ITM028	33+6+6	33	6	6	26	65	20	50.8	50.8	LLDPE	MAS046	TRUE	Kg.	1	20K/Bag	None		29.7	0		\N	\N	\N	\N
565	CID830	CAT004	ITM028	33+6+6	33	6	6	26	65	20	50.8	50.8	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		29.7	0		\N	\N	\N	\N
566	CID831	CAT004	ITM028	33+6+6	33	6	6	26	65	20	50.8	50.8	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	None		29.7	0		\N	\N	\N	\N
567	CID831	CAT004	ITM028	33+6+6	33	6	6	26	65	20	50.8	50.8	LLDPE	MAS024	TRUE	Kg.	1	20K/Bag	None		29.7	0		\N	\N	\N	\N
568	CID685	CAT004	ITM027	20	20	0	0	20	100	12	30.48	30.48	LLDPE	MAS047	TRUE	Kg.	1	20K/Bag	None		12.2	0		\N	\N	\N	\N
569	CID685	CAT004	ITM028	30+6+6	30	6	6	40	100	16	40.64	40.64	LLDPE	MAS047	TRUE	Kg.	1	20K/Bag	None		34.1	0		\N	\N	\N	\N
570	CID832	CAT008	ITM044	50	50	0	0	14	70	34	86.36	86.36	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		60.5	0		\N	\N	\N	\N
571	CID362	CAT004	ITM027	23	23	0	0	15	75	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		10.5	20		\N	\N	\N	\N
572	CID362	CAT004	ITM028	35	35	0	0	18	90	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		28.8	20		\N	\N	\N	\N
573	CID362	CAT003	ITM021	35+10+10	35	10	10	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		23.5	30		\N	\N	\N	\N
574	CID649	CAT008	ITM056	20	20	0	0	13	65	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		6.6	0		\N	\N	\N	\N
575	CID649	CAT008	ITM057	26	26	0	0	12	60	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9.5	0		\N	\N	\N	\N
576	CID654	CAT001	ITM004	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
577	CID654	CAT001	ITM005	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
578	CID654	CAT001	ITM006	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Packet	1	20K/Bag	None	Wisam	0	0		\N	\N	\N	\N
579	CID654	CAT001	ITM007	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
580	CID574	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	3 Roll	0.4	30(3R)/Bag	None	Shamel Group	11	0		\N	\N	\N	\N
581	CID574	CAT005	ITM034	32+9+9	32	9	9	6	15	20	110	110	HDPE	MAS005	TRUE	Roll	0.4	30R/Bag	None	Shamel Group	16.5	0		\N	\N	\N	\N
582	CID574	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	0.5	30R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
583	CID400	CAT007	ITM041	21	21	0	0	13	65	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9.7	0		\N	\N	\N	\N
584	CID400	CAT007	ITM054	35.5	35.5	0	0	10	50	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		21.6	0		\N	\N	\N	\N
585	CID397	CAT004	ITM027	27+7+7	27	7	7	30	75	16	40.64	40.64	HDPE	MAS048	TRUE	Kg.	1	20K/Bag	Banana		25	20		\N	\N	\N	\N
586	CID397	CAT004	ITM028	34+9+9	34	9	9	30	75	20	50.8	50.8	HDPE	MAS048	TRUE	Kg.	1	20K/Bag	Banana		39.6	20		\N	\N	\N	\N
587	CID397	CAT004	ITM029	40+11+11	40	11	11	30	75	24	60.96	60.96	HDPE	MAS048	TRUE	Kg.	1	20K/Bag	Banana		56.7	20		\N	\N	\N	\N
588	CID407	CAT008	ITM044	17	17	0	0	18	90	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9.3	0		\N	\N	\N	\N
589	CID626	CAT001	ITM004	0	0	0	0	7	35	0	70	70	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	Top World	0	0		\N	\N	\N	\N
590	CID626	CAT001	ITM005	0	0	0	0	7	35	0	80	80	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	Top World	0	0		\N	\N	\N	\N
591	CID626	CAT001	ITM006	0	0	0	0	7	35	0	90	90	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	Top World	0	0		\N	\N	\N	\N
592	CID626	CAT001	ITM007	0	0	0	0	7	35	0	100	100	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	Top World	0	0		\N	\N	\N	\N
593	CID362	CAT003	ITM022	42+13+13	42	13	13	16	40	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		38.7	30		\N	\N	\N	\N
594	CID411	CAT003	ITM018	21+7+7	21	7	7	12	30	0	0	0	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
595	CID613	CAT003	ITM023	50+13+13	50	13	13	22	55	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		68	30		\N	\N	\N	\N
596	CID168	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	5 Roll	0.9	5R/Bag	None	Dahiya Eastern Shopping Center	11	0		\N	\N	\N	\N
597	CID168	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	Roll	0.9	20K/Bag	None	Dahiya Eastern Shopping Center	11	0		\N	\N	\N	\N
598	CID168	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	1.8	10R/Bag	None	Dahiya Eastern Shopping Center	44	0		\N	\N	\N	\N
599	CID168	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	3	5R/Bag	None	Dahiya Eastern Shopping Center	44	0		\N	\N	\N	\N
600	CID168	CAT006	ITM037	55	55	0	0	6	30	0	110	110	HDPE	MAS005	TRUE	Roll	0.8	15R/Bag	None	Dahiya Eastern Shopping Center	36.3	0		\N	\N	\N	\N
601	CID168	CAT006	ITM038	60	60	0	0	8	40	0	140	140	HDPE	MAS005	TRUE	Roll	1.8	10R/Bag	None	Dahiya Eastern Shopping Center	67.2	0		\N	\N	\N	\N
602	CID528	CAT001	ITM003	30+10+10	30	10	10	26	65	24	60	60	LLDPE	MAS008	TRUE	Kg.	1	50Pcs/P	None		39	0	36.3g/pc.	\N	\N	\N	\N
603	CID528	CAT001	ITM005	45+14+14	45	14	14	26	65	18	90	90	LLDPE	MAS008	TRUE	Kg.	1	50Pcs/P	None		85.4	0	80.4g/pc.	\N	\N	\N	\N
604	CID528	CAT001	ITM007	60+14+14	60	14	14	26	65	22	112	112	LLDPE	MAS008	TRUE	Kg.	2	50Pcs/P	None		128.1	0	119.2g/pc.	\N	\N	\N	\N
605	CID184	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	5 Roll	0.9	5R/Bag	None	Modern Plastic Bag Factory	11	0		\N	\N	\N	\N
606	CID184	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Modern Plastic Bag Factory	11	0		\N	\N	\N	\N
607	CID184	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	Box	3	10R(300G)/Bag	None	Modern Plastic Bag Factory	11	0		\N	\N	\N	\N
608	CID184	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	6 Roll	1	20(6R)/Bag	None	Modern Plastic Bag Factory	11	0		\N	\N	\N	\N
609	CID184	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	1.8	10R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
610	CID184	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	3	10R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
611	CID184	CAT006	ITM037	55	55	0	0	6	30	20	110	110	LLDPE	MAS005	TRUE	Roll	0.8	15R/Bag	None	Modern Plastic Bag Factory	36.3	0		\N	\N	\N	\N
612	CID184	CAT006	ITM038	60	60	0	0	8	40	20	140	140	HDPE	MAS005	TRUE	Roll	1.8	10R/Bag	None	Modern Plastic Bag Factory	67.2	0		\N	\N	\N	\N
613	CID184	CAT001	ITM004	36+16+16	36	16	16	10	25	0	70	70	Regrind	MAS002	FALSE	Packet	1.2	10P/Bag	None	Modern Plastic Bag Factory	23.8	0		\N	\N	\N	\N
614	CID184	CAT001	ITM005	40+16+16	40	16	16	10	25	0	80	80	Regrind	MAS002	FALSE	Packet	1.2	10P/Bag	None	Modern Plastic Bag Factory	28.8	0		\N	\N	\N	\N
615	CID184	CAT001	ITM006	50+15+15	50	15	15	10	25	0	90	90	Regrind	MAS002	FALSE	Packet	1.4	10P/Bag	None	Modern Plastic Bag Factory	36	0		\N	\N	\N	\N
616	CID184	CAT001	ITM007	50+18+18	50	18	18	14	35	0	100	100	Regrind	MAS002	FALSE	Packet	1.4	10P/Bag	None	Modern Plastic Bag Factory	60.2	0		\N	\N	\N	\N
617	CID184	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
618	CID184	CAT002	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS008	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
619	CID184	CAT002	ITM013	0	0	0	0	0	0	0	0	0	HDPE	MAS006	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
620	CID184	CAT002	ITM014	0	0	0	0	14	70	0	70	70	Regrind	MAS002	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
621	CID184	CAT002	ITM015	0	0	0	0	14	70	0	80	80	Regrind	MAS002	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
622	CID184	CAT002	ITM016	0	0	0	0	14	70	0	90	90	Regrind	MAS002	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
623	CID184	CAT002	ITM017	0	0	0	0	14	70	0	100	100	Regrind	MAS002	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
624	CID778	CAT001	ITM006	50+15+15	50	15	15	15	37	0	90	90	Regrind	MAS003	FALSE	Packet	1	30Pcs/P x 10P/Bag	None		53.3	0		\N	\N	\N	\N
625	CID717	CAT004	ITM028	30	30	0	0	13	65	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		15.8	20		\N	\N	\N	\N
626	CID414	CAT010	ITM046	30	30	0	0	5	25	14	35.56	35.56	HDPE	MAS041	TRUE	Roll	50	20K/Bag	None		5.3	0		\N	\N	\N	\N
627	CID414	CAT010	ITM046	30	30	0	0	5	25	14	35.56	35.56	HDPE	MAS029	TRUE	Roll	50	20K/Bag	None		5.3	0		\N	\N	\N	\N
628	CID135	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	1	20K/Bag	None	Big World	44	0		\N	\N	\N	\N
629	CID135	CAT006	ITM037	55	55	0	0	6	30	20	110	110	HDPE	MAS005	TRUE	Roll	0.8	15R/Bag	None	Big World	36.3	0		\N	\N	\N	\N
630	CID135	CAT006	ITM038	60	60	0	0	8	40	20	140	140	HDPE	MAS005	TRUE	Roll	1.8	10R/Bag	None	Big World	67.2	0		\N	\N	\N	\N
631	CID135	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Roll	1	20K/Bag	None	Big World	0	0		\N	\N	\N	\N
632	CID135	CAT002	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS029	FALSE	Roll	1	20K/Bag	None	Big World	0	0		\N	\N	\N	\N
633	CID135	CAT002	ITM013	0	0	0	0	0	0	0	0	0	HDPE	MAS006	FALSE	Roll	1	20K/Bag	None	Big World	0	0		\N	\N	\N	\N
634	CID135	CAT002	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	1	20K/Bag	None	Big World	0	0		\N	\N	\N	\N
635	CID135	CAT002	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	1	20K/Bag	None	Big World	0	0		\N	\N	\N	\N
636	CID135	CAT002	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	1	20K/Bag	None	Big World	0	0		\N	\N	\N	\N
637	CID135	CAT002	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	1	20K/Bag	None	Big World	0	0		\N	\N	\N	\N
638	CID317	CAT003	ITM018	21+6+6	21	6	6	10	25	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		5.9	0		\N	\N	\N	\N
639	CID317	CAT003	ITM019	26+7+7	26	7	7	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		13.5	0		\N	\N	\N	\N
640	CID317	CAT003	ITM020	31+10+10	31	10	10	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		20.7	0		\N	\N	\N	\N
641	CID317	CAT003	ITM021	40+12+12	40	12	12	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		32.8	0		\N	\N	\N	\N
642	CID269	CAT003	ITM022	48+13+13	48	13	13	20	50	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
643	CID626	CAT002	ITM014	0	0	0	0	0	0	0	70	70	Regrind	MAS002	FALSE	Roll	0.5	30R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
644	CID626	CAT002	ITM015	0	0	0	0	0	0	0	80	80	Regrind	MAS003	FALSE	Roll	0.5	30R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
645	CID626	CAT002	ITM016	0	0	0	0	0	0	0	90	90	Regrind	MAS002	FALSE	Roll	0.5	30R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
646	CID626	CAT002	ITM017	0	0	0	0	0	0	0	100	100	Regrind	MAS002	FALSE	Roll	0.5	30R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
647	CID107	CAT004	ITM027	26+5+5	26	5	5	30	75	14	35.56	35.56	HDPE	MAS048	TRUE	Kg.	1	20K/Bag	Banana		19.2	20		\N	\N	\N	\N
648	CID107	CAT004	ITM029	50	50	0	0	15	75	24	60.96	60.96	HDPE	MAS048	TRUE	Kg.	1	20K/Bag	Banana		45.7	20		\N	\N	\N	\N
649	CID107	CAT004	ITM031	66+16+16	66	16	16	22	55	30	76.2	76.2	HDPE	MAS048	TRUE	Kg.	1	20K/Bag	Banana		82.1	20		\N	\N	\N	\N
650	CID107	CAT004	ITM032	66+16+16	66	16	16	25	62	39	99.06	99.06	HDPE	MAS048	TRUE	Kg.	1	20K/Bag	Banana		120.4	20		\N	\N	\N	\N
651	CID628	CAT008	ITM044	21	21	0	0	15	75	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		11.2	0		\N	\N	\N	\N
652	CID836	CAT012	ITM045	24	24	0	0	18	90	12	30.48	30.48	LLDPE	MAS047	TRUE	Kg.	1	20K/Bag	None		13.2	0		\N	\N	\N	\N
653	CID597	CAT003	ITM019	36+9+9	36	9	9	19	47	20	50.8	50.8	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		25.8	0		\N	\N	\N	\N
654	CID122	CAT003	ITM020	32+9+9	32	9	9	18	45	20	50.8	50.8	HDPE	MAS008	TRUE	Kg.	1	20K/Bag	None		22.9	0		\N	\N	\N	\N
655	CID122	CAT003	ITM021	35+12+12	35	12	12	18	45	24	60.96	60.96	HDPE	MAS008	TRUE	Kg.	1	20K/Bag	None		32.4	0		\N	\N	\N	\N
656	CID122	CAT003	ITM022	44+13+13	44	13	13	18	45	32	81.28	81.28	HDPE	MAS008	TRUE	Kg.	1	20K/Bag	None		51.2	0		\N	\N	\N	\N
657	CID122	CAT005	ITM033	32+9+9	32	9	9	4	10	0	0	0	HDPE	MAS005	TRUE	3 Roll	0.4	3R/P x 30P/Bag	None	Basim	0	0		\N	\N	\N	\N
658	CID122	CAT005	ITM034	32+9+9	32	9	9	6	15	0	0	0	HDPE	MAS005	TRUE	Roll	0.4	30R/Bag	None	Basim	0	0		\N	\N	\N	\N
659	CID122	CAT001	ITM004	0	0	0	0	7	35	0	70	70	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	Basim	0	0		\N	\N	\N	\N
660	CID122	CAT001	ITM005	0	0	0	0	7	35	0	80	80	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	Basim	0	0		\N	\N	\N	\N
661	CID122	CAT001	ITM006	0	0	0	0	7	35	0	90	90	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	Basim	0	0		\N	\N	\N	\N
662	CID122	CAT001	ITM007	0	0	0	0	7	35	0	100	100	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	Basim	0	0		\N	\N	\N	\N
663	CID837	CAT003	ITM020	30+12+12	30	12	12	36	90	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		54.3	0		\N	\N	\N	\N
664	CID837	CAT003	ITM022	40+12+12	40	12	12	48	120	28	71.12	71.12	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		109.2	0		\N	\N	\N	\N
665	CID122	CAT007	ITM040	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
722	CID336	CAT003	ITM022	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	5	20K/Bag	None		0	0		\N	\N	\N	\N
666	CID122	CAT007	ITM041	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
667	CID122	CAT007	ITM042	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
668	CID122	CAT007	ITM043	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
669	CID117	CAT004	ITM029	45+8+8	45	8	8	30	75	22	55.88	55.88	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		51.1	20		\N	\N	\N	\N
670	CID117	CAT003	ITM020	30+10+10	30	10	10	15	37	20	50.8	50.8	HDPE	MAS014	TRUE	Kg.	1	20K/Bag	None		18.8	0		\N	\N	\N	\N
671	CID117	CAT003	ITM021	35+10+10	35	10	10	15	37	24	60.96	60.96	HDPE	MAS014	TRUE	Kg.	1	20K/Bag	None		24.8	0		\N	\N	\N	\N
672	CID117	CAT003	ITM022	44+13+13	44	13	13	18	45	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		44.8	0		\N	\N	\N	\N
673	CID117	CAT003	ITM023	49+13+13	49	13	13	18	45	32	81.28	81.28	HDPE	MAS049	TRUE	Kg.	1	20K/Bag	None		54.9	0		\N	\N	\N	\N
674	CID117	CAT004	ITM032	70+18+18	70	18	18	35	87	39	99.06	99.06	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		182.7	20		\N	\N	\N	\N
675	CID117	CAT004	ITM032	70+18+18	70	18	18	35	87	0	100	100	HDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		184.4	20		\N	\N	\N	\N
676	CID643	CAT003	ITM020	32+10+10	32	10	10	16	40	20	50.8	50.8	HDPE	MAS008	TRUE	Kg.	1	20K/Bag	None		21.1	0		\N	\N	\N	\N
677	CID643	CAT003	ITM021	38+13+13	38	13	13	16	40	24	60.96	60.96	HDPE	MAS008	TRUE	Kg.	1	20K/Bag	None		31.2	0		\N	\N	\N	\N
678	CID643	CAT003	ITM022	45+13+13	45	13	13	18	45	32	81.28	81.28	HDPE	MAS008	TRUE	Kg.	1	20K/Bag	None		51.9	0		\N	\N	\N	\N
679	CID410	CAT003	ITM020	31+9+9	31	9	9	18	45	20	50.8	50.8	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		22.4	0		\N	\N	\N	\N
680	CID410	CAT003	ITM021	37+13+13	37	13	13	18	45	24	60.96	60.96	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt		34.6	30		\N	\N	\N	\N
681	CID410	CAT003	ITM022	44+13+13	44	13	13	20	50	32	81.28	81.28	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt		56.9	30		\N	\N	\N	\N
682	CID411	CAT005	ITM033	32+9+9	32	9	9	4	10	0	0	0	HDPE	MAS005	TRUE	7 Roll	1.1	20(7R)/Bag	None	Mazaya Food	0	0		\N	\N	\N	\N
683	CID411	CAT006	ITM036	50	50	0	0	8	40	0	0	0	HDPE	MAS005	TRUE	Roll w/Core	2	10R/Bag	None	Mazaya Food	0	0		\N	\N	\N	\N
684	CID838	CAT004	ITM028	30+10+10	30	10	10	18	45	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		18.3	20		\N	\N	\N	\N
685	CID431	CAT008	ITM044	21	21	0	0	18	90	0	32	32	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		12.1	0		\N	\N	\N	\N
686	CID431	CAT008	ITM056	26	26	0	0	18	90	0	41	41	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		19.2	0		\N	\N	\N	\N
687	CID431	CAT008	ITM057	31	31	0	0	18	90	0	54	54	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		30.1	0		\N	\N	\N	\N
688	CID502	CAT004	ITM027	20.5	20.5	0	0	10	50	18	45.72	45.72	LLDPE	MAS001	TRUE	Packet	1	20K/Bag	Banana		9.4	20		\N	\N	\N	\N
689	CID675	CAT010	ITM063	55	55	0	0	22	110	32	81.28	81.28	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		98.3	0		\N	\N	\N	\N
690	CID725	CAT003	ITM020	31+11+11	31	11	11	19	47	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.3	30		\N	\N	\N	\N
691	CID235	CAT003	ITM018	6+6+21	21	6	6	10	25	14	35.56	35.56	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		5.9	0		\N	\N	\N	\N
692	CID235	CAT003	ITM019	8+8+25	25	8	8	12	30	18	45.72	45.72	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		11.2	0		\N	\N	\N	\N
693	CID235	CAT003	ITM020	10+10+32	32	10	10	15	37	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		19.5	0		\N	\N	\N	\N
694	CID235	CAT006	ITM036	45	45	0	0	5	25	14	100	100	HDPE	MAS004	TRUE	Roll	1	20K/Bag	None	Plain	22.5	0		\N	\N	\N	\N
695	CID579	CAT003	ITM020	31+10+10	31	10	10	15	37	20	50.8	50.8	HDPE	MAS050	TRUE	Kg.	1	20K/Bag	None		19.2	0		\N	\N	\N	\N
696	CID579	CAT003	ITM029	32+11+11	32	11	11	15	37	24	60.96	60.96	HDPE	MAS051	TRUE	Kg.	1	20K/Bag	None		24.4	0		\N	\N	\N	\N
697	CID579	CAT003	ITM030	42+13+13	42	13	13	17	42	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		40.6	0		\N	\N	\N	\N
698	CID347	CAT004	ITM027	36+6+6	36	6	6	36	90	18	45.72	45.72	LLDPE	MAS014	TRUE	Kg.	1	20K/Bag	Banana		39.5	20		\N	\N	\N	\N
699	CID347	CAT004	ITM028	40+8+8	40	8	8	40	100	20	50.8	50.8	LLDPE	MAS014	TRUE	Kg.	1	20K/Bag	Banana		56.9	20		\N	\N	\N	\N
700	CID347	CAT004	ITM029	42+10+10	42	10	10	40	100	24	60.96	60.96	LLDPE	MAS014	TRUE	Kg.	1	20K/Bag	Banana		75.6	20		\N	\N	\N	\N
701	CID360	CAT003	ITM019	26+8+8	26	8	8	16	40	18	45.72	45.72	HDPE	MAS023	TRUE	Kg.	1	20K/Bag	None		15.4	0		\N	\N	\N	\N
702	CID360	CAT003	ITM020	30+9+9	30	9	9	16	40	20	50.8	50.8	HDPE	MAS048	TRUE	Kg.	1	20K/Bag	None		19.5	0		\N	\N	\N	\N
703	CID360	CAT003	ITM021	32+10+10	32	10	10	17	42	24	60.96	60.96	HDPE	MAS024	TRUE	Kg.	1	20K/Bag	None		26.6	0		\N	\N	\N	\N
704	CID360	CAT003	ITM023	48+17+17	48	17	17	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		66.6	0		\N	\N	\N	\N
705	CID1122	CAT001	ITM006	50+17+17	50	17	17	8	20	0	0	0	HDPE	MAS003	FALSE	Packet	1.5	10P/Bag	None		0	0		\N	\N	\N	\N
706	CID1122	CAT001	ITM006	50+17+17	50	17	17	8	20	0	0	0	HDPE	MAS029	FALSE	Packet	1.5	10P/Bag	None		0	0		\N	\N	\N	\N
707	CID1122	CAT001	ITM006	50+17+17	50	17	17	8	20	0	0	0	HDPE	MAS052	FALSE	Packet	1.5	10P/Bag	None		0	0		\N	\N	\N	\N
708	CID464	CAT003	ITM018	21+7+7	21	7	7	10	25	16	40.64	40.64	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		7.1	30		\N	\N	\N	\N
709	CID464	CAT003	ITM019	27+10+10	27	10	10	16	40	18	45.72	45.72	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		17.2	30		\N	\N	\N	\N
710	CID250	CAT008	ITM041	20	20	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	10P/Bag	None		7.1	0		\N	\N	\N	\N
711	CID250	CAT008	ITM042	26	26	0	0	10	50	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	10P/Bag	None		10.6	0		\N	\N	\N	\N
712	CID250	CAT008	ITM043	31	31	0	0	10	50	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	10P/Bag	None		15.7	0		\N	\N	\N	\N
713	CID783	CAT004	ITM028	30+7+7	30	7	7	45	112	20	50.8	50.8	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		50.1	0		\N	\N	\N	\N
714	CID464	CAT003	ITM021	33+13+13	33	13	13	17	42	24	60.96	60.96	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		30.2	30		\N	\N	\N	\N
715	CID464	CAT004	ITM031	45+13+13	45	13	13	25	62	28	71.12	71.12	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		62.6	30		\N	\N	\N	\N
716	CID326	CAT003	ITM019	27+8+8	27	8	8	14	35	18	45.72	45.72	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt		13.8	30	Punching Without Hook	\N	\N	\N	\N
717	CID326	CAT003	ITM020	30+9+9	30	9	9	17	42	20	50.8	50.8	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		20.5	0		\N	\N	\N	\N
723	CID336	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS004	TRUE	Roll w/Core	1	15R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
724	CID336	CAT001	ITM006	50+15+15	50	15	15	5	12	0	100	100	Regrind	MAS004	FALSE	Packet	1	20K/Bag	None		19.2	0		\N	\N	\N	\N
725	CID741	CAT001	ITM005	40+15+15	40	15	15	9	22	0	80	80	Regrind	MAS002	FALSE	Packet	1.2	10P/Bag	None	Manal	24.6	0		\N	\N	\N	\N
726	CID769	CAT003	ITM019	27+8+8	27	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.8	30		\N	\N	\N	\N
727	CID769	CAT003	ITM023	44+13+13	44	13	13	20	50	0	0	0	HDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
728	CID839	CAT004	ITM025	14.5	14.5	0	0	12	60	8	20.32	20.32	LLDPE	MAS005	TRUE	Box	1	20K/Bag	None		3.5	0	3.5 grms/pc.	\N	\N	\N	\N
729	CID839	CAT004	ITM026	20	20	0	0	12	60	12	30.48	30.48	LLDPE	MAS005	TRUE	Box	1	20K/Bag	None		7.3	0	7grms/pc	\N	\N	\N	\N
730	CID839	CAT004	ITM027	25	25	0	0	12	60	14	35.56	35.56	LLDPE	MAS005	TRUE	Box	1	20K/Bag	None		10.7	0	10grms/pc	\N	\N	\N	\N
731	CID840	CAT004	ITM029	39+5+5	39	5	5	32	80	26	66.04	66.04	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		51.8	20		\N	\N	\N	\N
732	CID404	CAT007	ITM043	30.5	30.5	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	10P/Bag	None	Plain	0	0		\N	\N	\N	\N
733	CID924	CAT004	ITM028	12+12+48	48	12	12	40	100	30	76.2	76.2	HDPE	MAS069	TRUE	Kg.	20	20K/Bag	Banana		109.7	20		\N	\N	\N	\N
734	CID152	CAT003	ITM018	20+7+7	20	7	7	13	32	14	35.56	35.56	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		7.7	30		\N	\N	\N	\N
735	CID152	CAT003	ITM019	28+9+9	28	9	9	15	37	18	45.72	45.72	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.6	30		\N	\N	\N	\N
736	CID152	CAT003	ITM020	32+10+10	32	10	10	15	37	20	50.8	50.8	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		19.5	30		\N	\N	\N	\N
737	CID445	CAT003	ITM018	23+7+7	23	7	7	13	32	14	35.56	35.56	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		8.4	30		\N	\N	\N	\N
738	CID445	CAT003	ITM019	27+7+7	27	7	7	13	32	16	40.64	40.64	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		10.7	30		\N	\N	\N	\N
739	CID445	CAT003	ITM020	32+10+10	32	10	10	15	37	20	50.8	50.8	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		19.5	30		\N	\N	\N	\N
740	CID445	CAT003	ITM023	53+15+15	53	15	15	20	50	32	81.28	81.28	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt		67.5	30		\N	\N	\N	\N
741	CID152	CAT003	ITM023	53+15+15	53	15	15	20	50	32	81.28	81.28	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt		67.5	30		\N	\N	\N	\N
742	CID142	CAT010	ITM046	80+27.5+27.5	80	27.5	27.5	11	27	0	0	0	HDPE	MAS041	FALSE	Roll	1	20K/Bag	None		0	0	Slit One Side	\N	\N	\N	\N
743	CID548	CAT003	ITM021	35+12+12	35	12	12	12	30	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		21.6	30		\N	\N	\N	\N
744	CID266	CAT001	ITM001	0	0	0	0	3	15	0	0	0	HDPE	MAS005	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
745	CID266	CAT001	ITM002	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
746	CID266	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS006	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
747	CID266	CAT001	ITM004	38+13+13	38	13	13	5	12	0	0	0	HDPE	MAS005	FALSE	Box	3	20K/Bag	None		0	0		\N	\N	\N	\N
748	CID790	CAT003	ITM019	23+7+7	23	7	7	10	25	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		6.6	0		\N	\N	\N	\N
749	CID790	CAT003	ITM020	29+8+8	29	8	8	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		13.7	0		\N	\N	\N	\N
750	CID790	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None		11	0		\N	\N	\N	\N
751	CID757	CAT012	ITM051	22+6+6	22	6	6	40	100	20	50.8	50.8	HDPE	MAS024	TRUE	Kg.	1	20K/Bag	None		34.5	0		\N	\N	\N	\N
752	CID400	CAT007	ITM065	53	53	0	0	13	65	36	91.44	91.44	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		63	0		\N	\N	\N	\N
753	CID004	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
754	CID004	CAT002	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS029	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
755	CID004	CAT002	ITM013	30+13+13	30	13	13	12	30	0	0	0	HDPE	MAS005	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
756	CID004	CAT002	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
757	CID004	CAT002	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
758	CID004	CAT002	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
759	CID004	CAT002	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
760	CID841	CAT008	ITM044	71.5	71.5	0	0	18	90	0	87	87	LLDPE	MAS001	FALSE	Box	11	100P/Bag	None		112	0		\N	\N	\N	\N
761	CID706	CAT004	ITM027	27+7+7	27	7	7	24	60	16	40.64	40.64	HDPE	MAS053	TRUE	Kg.	1	20K/Bag	None		20	0		\N	\N	\N	\N
762	CID706	CAT004	ITM028	32+10+10	32	10	10	24	60	20	50.8	50.8	HDPE	MAS053	TRUE	Kg.	1	20K/Bag	None		31.7	0		\N	\N	\N	\N
763	CID842	CAT004	ITM027	30+6+6	30	6	6	33	82	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		31.5	0		\N	\N	\N	\N
764	CID842	CAT004	ITM028	37+7+7	37	7	7	33	82	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		42.5	0		\N	\N	\N	\N
765	CID842	CAT004	ITM030	58+9+9	58	9	9	40	100	28	71.12	71.12	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		108.1	0		\N	\N	\N	\N
766	CID842	CAT004	ITM031	71+13+13	71	13	13	40	100	32	81.28	81.28	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		157.7	0		\N	\N	\N	\N
767	CID040	CAT004	ITM028	6+6+43	43	6	6	0	0	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
768	CID1309	CAT004	ITM028	18+18+55	55	18	18	30	75	0	0	0	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
769	CID503	CAT006	ITM037	55	55	0	0	6	30	20	110	110	HDPE	MAS005	TRUE	Roll	0.8	15R/Bag	None	Modern Plastic Bag Factory	36.3	0		\N	\N	\N	\N
770	CID702	CAT003	ITM019	26+8+8	26	8	8	16	40	18	45.72	45.72	HDPE	MAS026	TRUE	Kg.	1	20K/Bag	None		15.4	0	MP11000\nLight Green\nGreen - 3000Grams\nWhite - 400Grams\n700Grams/2Bags	\N	\N	\N	\N
771	CID702	CAT003	ITM021	35+10+10	35	10	10	17	42	24	60.96	60.96	HDPE	MAS026	TRUE	Kg.	1	20K/Bag	None		28.2	0	MP11000\nLight Green\nGreen - 3000Grams\nWhite - 400Grams\n700Grams/2Bags	\N	\N	\N	\N
772	CID707	CAT003	ITM019	25+7+7	25	7	7	13	32	18	45.72	45.72	HDPE	MAS007	TRUE	Kg.	1	20K/Bag	None		11.4	0		\N	\N	\N	\N
773	CID707	CAT003	ITM020	31+10+10	31	10	10	13	32	20	50.8	50.8	HDPE	MAS007	TRUE	Kg.	1	20K/Bag	None		16.6	0		\N	\N	\N	\N
936	CID004	CAT007	ITM054	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
774	CID707	CAT003	ITM021	34+10+10	34	10	10	13	32	24	60.96	60.96	HDPE	MAS007	TRUE	Kg.	1	20K/Bag	None		21.1	0		\N	\N	\N	\N
775	CID707	CAT005	ITM033	32+9+9	32	9	9	4	10	0	110	110	HDPE	MAS007	TRUE	Roll	1	20K/Bag	None		11	0		\N	\N	\N	\N
776	CID701	CAT003	ITM019	27+10+10	27	10	10	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		12.9	30		\N	\N	\N	\N
777	CID701	CAT003	ITM020	34+10+10	34	10	10	14	35	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		21.1	30		\N	\N	\N	\N
778	CID701	CAT003	ITM021	40+11+11	40	11	11	15	37	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		30.3	30		\N	\N	\N	\N
779	CID717	CAT004	ITM026	20	20	0	0	13	65	10	25.4	25.4	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		6.6	20		\N	\N	\N	\N
780	CID843	CAT004	ITM026	15.5	15.5	0	0	10	50	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		4.7	20		\N	\N	\N	\N
781	CID764	CAT003	ITM020	34+10+10	34	10	10	17	42	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		25.3	0		\N	\N	\N	\N
782	CID843	CAT003	ITM019	20+7+7	20	7	7	11	27	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		7.5	0		\N	\N	\N	\N
783	CID843	CAT003	ITM020	34+12+12	34	12	12	13	32	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		22.6	0		\N	\N	\N	\N
784	CID574	CAT006	ITM037	55	55	0	0	6	30	20	110	110	HDPE	MAS005	TRUE	Roll	0.4	30R/Bag	None	Shamel Group	36.3	0		\N	\N	\N	\N
785	CID574	CAT001	ITM004	0	0	0	0	7	35	0	70	70	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	Shamel Group	0	0		\N	\N	\N	\N
786	CID574	CAT001	ITM005	0	0	0	0	7	35	0	80	80	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	Shamel Group	0	0		\N	\N	\N	\N
787	CID574	CAT001	ITM006	0	0	0	0	7	35	0	90	90	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	Shamel Group	0	0		\N	\N	\N	\N
788	CID574	CAT001	ITM007	0	0	0	0	7	35	0	100	100	Regrind	MAS002	FALSE	Packet	0.5	20K/Bag	None	Shamel Group	0	0		\N	\N	\N	\N
789	CID574	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Roll	0.4	30R/Bag	None	Shamel Group	0	0		\N	\N	\N	\N
790	CID574	CAT002	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS029	FALSE	Roll	0.4	30R/Bag	None	Shamel Group	0	0		\N	\N	\N	\N
791	CID574	CAT002	ITM013	0	0	0	0	0	0	0	0	0	HDPE	MAS006	FALSE	Roll	0.4	30R/Bag	None	Shamel Group	0	0		\N	\N	\N	\N
792	CID574	CAT002	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	0.4	30R/Bag	None	Shamel Group	0	0		\N	\N	\N	\N
793	CID574	CAT002	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	0.4	30R/Bag	None	Shamel Group	0	0		\N	\N	\N	\N
794	CID574	CAT002	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	0.4	30R/Bag	None	Shamel Group	0	0		\N	\N	\N	\N
795	CID574	CAT002	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	0.4	30R/Bag	None	Shamel Group	0	0		\N	\N	\N	\N
796	CID574	CAT007	ITM040	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	200G/P x 25P/Bag	None	Shamel Group	0	0		\N	\N	\N	\N
797	CID574	CAT007	ITM041	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	200G/P x 25P/Bag	None	Shamel Group	0	0		\N	\N	\N	\N
798	CID574	CAT007	ITM042	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	200G/P x 25P/Bag	None	Shamel Group	0	0		\N	\N	\N	\N
799	CID574	CAT007	ITM043	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	200G/P x 25P/Bag	None	Shamel Group	0	0		\N	\N	\N	\N
800	CID829	CAT004	ITM027	28+6+6	28	6	6	26	65	16	40.64	40.64	LLDPE	MAS048	TRUE	Kg.	1	20K/Bag	None		21.1	0		\N	\N	\N	\N
801	CID829	CAT004	ITM027	28+6+6	28	6	6	26	65	16	40.64	40.64	LLDPE	MAS054	TRUE	Kg.	1	20K/Bag	None		21.1	0		\N	\N	\N	\N
802	CID844	CAT003	ITM018	21+7+7	21	7	7	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		8.5	0		\N	\N	\N	\N
803	CID844	CAT003	ITM020	31+10+10	31	10	10	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		16.6	0		\N	\N	\N	\N
804	CID844	CAT006	ITM039	45	45	0	0	4	20	0	100	100	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		18	0		\N	\N	\N	\N
805	CID845	CAT003	ITM018	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
806	CID845	CAT003	ITM019	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	4.8	20K/Bag	None		0	0		\N	\N	\N	\N
807	CID845	CAT003	ITM020	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	4.8	20K/Bag	None		0	0		\N	\N	\N	\N
808	CID845	CAT003	ITM021	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	4.8	20K/Bag	None		0	0		\N	\N	\N	\N
809	CID846	CAT004	ITM027	20	20	0	0	16	80	12	30.48	30.48	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	None		9.8	0		\N	\N	\N	\N
810	CID846	CAT004	ITM028	30+4+4	30	4	4	32	80	16	40.64	40.64	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	None		24.7	0		\N	\N	\N	\N
811	CID808	CAT003	ITM019	30+10+10	30	10	10	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		14.6	30		\N	\N	\N	\N
812	CID136	CAT004	ITM030	41+9+9	41	9	9	28	70	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		50.4	0		\N	\N	\N	\N
813	CID718	CAT011	ITM045	50	50	0	0	28	140	0	0	0	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
814	CID629	CAT004	ITM027	25	25	0	0	20	100	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		15.2	0		\N	\N	\N	\N
815	CID629	CAT004	ITM028	35	35	0	0	20	100	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		28.4	0		\N	\N	\N	\N
816	CID617	CAT007	ITM055	40.5	40.5	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	5Kg/Box	None	plain	0	0		\N	\N	\N	\N
817	CID626	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	3 Roll	0.4	30(3R)/ Bag	None	Top World	11	0		\N	\N	\N	\N
818	CID626	CAT005	ITM034	32+9+9	32	9	9	6	15	20	110	110	HDPE	MAS005	TRUE	Roll	0.4	30(3R)/ Bag	None	Top World	16.5	0		\N	\N	\N	\N
819	CID087	CAT004	ITM027	56	56	0	0	12	60	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		20.5	0		\N	\N	\N	\N
820	CID087	CAT004	ITM028	67	67	0	0	12	60	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		32.7	0		\N	\N	\N	\N
821	CID138	CAT003	ITM019	0	0	0	0	0	0	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
822	CID138	CAT003	ITM020	0	0	0	0	0	0	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
823	CID138	CAT003	ITM021	0	0	0	0	0	0	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
824	CID038	CAT005	ITM034	32+9+9	32	9	9	6	15	0	110	110	HDPE	MAS010	TRUE	Roll	1	10R/Bag	None	Ahmad Saad (Busaad Plastic)	16.5	0		\N	\N	\N	\N
825	CID648	CAT003	ITM019	26+8+8	26	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		11.5	0		\N	\N	\N	\N
826	CID648	CAT004	ITM028	51	51	0	0	11	55	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		28.5	0		\N	\N	\N	\N
827	CID648	CAT004	ITM029	56	56	0	0	14	70	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		47.8	0		\N	\N	\N	\N
828	CID648	CAT001	ITM009	60+18+18	60	18	18	16	40	0	110	110	HDPE	MAS029	FALSE	Packet	2	22Pc/P x 10P/Bag	None	plain	84.5	0		\N	\N	\N	\N
829	CID846	CAT004	ITM029	36+4+4	36	4	4	32	80	18	45.72	45.72	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		32.2	0		\N	\N	\N	\N
830	CID846	CAT004	ITM030	44+4+4	44	4	4	32	80	24	60.96	60.96	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		50.7	0		\N	\N	\N	\N
831	CID729	CAT003	ITM019	25+8+8	25	8	8	18	45	18	45.72	45.72	HDPE	MAS007	TRUE	Kg.	1	20K/Bag	None		16.9	0		\N	\N	\N	\N
832	CID847	CAT004	ITM032	62	62	0	0	28	140	0	87	87	HDPE	MAS056	FALSE	Kg.	1	20K/Bag	Banana		151	20		\N	\N	\N	\N
833	CID847	CAT004	ITM032	62	62	0	0	28	140	0	80	80	HDPE	MAS056	FALSE	Kg.	1	20K/Bag	Banana		138.9	20		\N	\N	\N	\N
834	CID830	CAT004	ITM027	28+6+6	28	6	6	26	65	16	40.64	40.64	LLDPE	MAS057	TRUE	Kg.	1	20K/Bag	None		21.1	0		\N	\N	\N	\N
835	CID830	CAT004	ITM027	28+6+6	28	6	6	26	65	16	40.64	40.64	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		21.1	0		\N	\N	\N	\N
836	CID796	CAT004	ITM020	40+6+6	40	6	6	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		21.1	20		\N	\N	\N	\N
837	CID831	CAT004	ITM027	28+6+6	28	6	6	26	65	16	40.64	40.64	LLDPE	MAS058	TRUE	Kg.	1	20K/Bag	None		21.1	0		\N	\N	\N	\N
838	CID831	CAT004	ITM027	28+6+6	28	6	6	26	65	16	40.64	40.64	LLDPE	MAS048	TRUE	Kg.	1	20K/Bag	None		21.1	0		\N	\N	\N	\N
839	CID476	CAT008	ITM040	15	15	0	0	12	60	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		5.5	0		\N	\N	\N	\N
840	CID226	CAT008	ITM041	23	23	0	0	13	65	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		10.6	0		\N	\N	\N	\N
841	CID476	CAT008	ITM042	26	26	0	0	12	60	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		12.7	0		\N	\N	\N	\N
842	CID020	CAT012	ITM061	38+8+8	38	8	8	60	150	0	71	71	LLDPE	MAS008	FALSE	Kg.	1	20K/Bag	Banana		115	20		\N	\N	\N	\N
843	CID411	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Roll	1.1	20K/Bag	None	Mazaya Food	0	0		\N	\N	\N	\N
844	CID411	CAT002	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS029	FALSE	Roll	1.1	20K/Bag	None	Mazaya Food	0	0		\N	\N	\N	\N
845	CID411	CAT002	ITM013	0	0	0	0	0	0	0	0	0	HDPE	MAS006	FALSE	Roll	1.1	20K/Bag	None	Mazaya Food	0	0		\N	\N	\N	\N
846	CID411	CAT002	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	1.1	15R/Bag	None	Mazaya Food	0	0		\N	\N	\N	\N
847	CID411	CAT002	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	1.1	15R/Bag	None	Mazaya Food	0	0		\N	\N	\N	\N
848	CID411	CAT002	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	1.1	15R/Bag	None	Mazaya Food	0	0		\N	\N	\N	\N
849	CID411	CAT002	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	1.1	15R/Bag	None	Mazaya Food	0	0		\N	\N	\N	\N
850	CID108	CAT012	ITM051	26+6+6	26	6	6	60	150	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		46.3	20		\N	\N	\N	\N
851	CID754	CAT001	ITM001	28+10+10	28	10	10	12	30	0	50	50	HDPE	MAS005	FALSE	Packet	1	20K/Bag	None	plain	14.4	0		\N	\N	\N	\N
852	CID754	CAT001	ITM005	40+16+16	40	16	16	14	35	0	80	80	HDPE	MAS041	FALSE	Packet	1	20K/Bag	None	plain	40.3	0		\N	\N	\N	\N
853	CID670	CAT003	ITM018	24+7.5+7.5	24	7.5	7.5	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		9.5	0		\N	\N	\N	\N
854	CID670	CAT003	ITM019	28+9+9	28	9	9	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		13.5	0		\N	\N	\N	\N
855	CID849	CAT004	ITM028	33+7+7	33	7	7	28	70	18	45.72	45.72	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	None		30.1	0		\N	\N	\N	\N
856	CID849	CAT004	ITM029	36+7+7	36	7	7	28	70	20	50.8	50.8	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	None		35.6	0		\N	\N	\N	\N
857	CID337	CAT001	ITM004	36+16+16	36	16	16	10	25	0	70	70	Regrind	MAS002	FALSE	Packet	1	10P/Bag	None	Juhairan Shopping Center	23.8	0		\N	\N	\N	\N
858	CID337	CAT001	ITM005	40+16+16	40	16	16	10	25	0	80	80	Regrind	MAS002	FALSE	Packet	1.2	10P/Bag	None	Juhairan Shopping Center	28.8	0		\N	\N	\N	\N
859	CID337	CAT001	ITM006	45+18+18	45	18	18	10	25	0	90	90	Regrind	MAS002	FALSE	Packet	1.4	10P/Bag	None	Juhairan Shopping Center	36.5	0		\N	\N	\N	\N
860	CID226	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Modern Plastic Bag Factory	11	0		\N	\N	\N	\N
861	CID850	CAT008	ITM044	48.5	48.5	0	0	34	170	0	74	74	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		122	0		\N	\N	\N	\N
862	CID404	CAT007	ITM040	15.5	15.5	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	4	10P/Bag	None	plai	0	0		\N	\N	\N	\N
863	CID026	CAT004	ITM029	41+8+8	41	8	8	35	87	22	55.88	55.88	LLDPE	MAS024	TRUE	Kg.	1	20K/Bag	Banana		55.4	20		\N	\N	\N	\N
864	CID026	CAT004	ITM030	44+13+13	44	13	13	30	75	30	76.2	76.2	LLDPE	MAS059	TRUE	Kg.	1	20K/Bag	Banana		80	20		\N	\N	\N	\N
865	CID026	CAT004	ITM031	50+14+14	50	14	14	35	87	36	91.44	91.44	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		124.1	20		\N	\N	\N	\N
866	CID732	CAT004	ITM026	25+5+5	25	5	5	28	70	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		17.4	20		\N	\N	\N	\N
867	CID732	CAT004	ITM027	30+8+8	30	8	8	35	87	16	40.64	40.64	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		32.5	20		\N	\N	\N	\N
868	CID732	CAT004	ITM028	35+8+8	35	8	8	35	87	18	45.72	45.72	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		40.6	20		\N	\N	\N	\N
869	CID726	CAT004	ITM026	25+5+5	25	5	5	28	70	14	35.56	35.56	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		17.4	20		\N	\N	\N	\N
870	CID726	CAT004	ITM027	30+8+8	30	8	8	35	87	16	40.64	40.64	LLDPE	MAS060	TRUE	Kg.	1	20K/Bag	Banana		32.5	20		\N	\N	\N	\N
871	CID851	CAT004	ITM028	36+6+6	36	6	6	20	50	18	45.72	45.72	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		21.9	0		\N	\N	\N	\N
872	CID851	CAT003	ITM023	54+14+14	54	14	14	22	55	32	81.28	81.28	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		73.3	0		\N	\N	\N	\N
873	CID852	CAT004	ITM027	31+9+9	31	9	9	25	62	16	40.64	40.64	HDPE	MAS061	TRUE	Kg.	1	20K/Bag	Banana		24.7	20		\N	\N	\N	\N
874	CID852	CAT004	ITM028	40+8+8	40	8	8	28	70	20	50.8	50.8	HDPE	MAS061	TRUE	Kg.	1	20K/Bag	Banana		39.8	20		\N	\N	\N	\N
875	CID086	CAT008	ITM044	17	17	0	0	13	65	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
876	CID086	CAT008	ITM056	24	24	0	0	15	75	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9.1	0		\N	\N	\N	\N
877	CID086	CAT008	ITM057	27	27	0	0	15	75	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		14.4	0		\N	\N	\N	\N
878	CID086	CAT008	ITM058	30+6+6	30	6	6	12	30	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		12.8	0		\N	\N	\N	\N
879	CID806	CAT003	ITM020	30+10+10	30	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		18.8	0		\N	\N	\N	\N
880	CID670	CAT003	ITM020	33+12+12	33	12	12	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		21.4	0		\N	\N	\N	\N
881	CID670	CAT005	ITM033	30+10+10	30	10	10	4	10	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		4.1	0		\N	\N	\N	\N
882	CID338	CAT004	ITM027	33+10+10	33	10	10	40	100	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		48.5	0		\N	\N	\N	\N
883	CID338	CAT004	ITM028	39+10+10	39	10	10	40	100	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		71.9	0		\N	\N	\N	\N
884	CID338	CAT004	ITM029	49+13+13	49	13	13	40	100	26	66.04	66.04	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		99.1	0		\N	\N	\N	\N
885	CID393	CAT003	ITM019	27+8+8	27	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		11.8	30		\N	\N	\N	\N
886	CID393	CAT003	ITM020	32+10+10	32	10	10	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		18.5	30		\N	\N	\N	\N
887	CID393	CAT003	ITM021	32+10+10	32	10	10	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		22.2	30		\N	\N	\N	\N
888	CID853	CAT003	ITM023	44+11+11	44	11	11	21	52	28	71.12	71.12	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		48.8	0		\N	\N	\N	\N
889	CID558	CAT004	ITM027	30+7+7	30	7	7	25	62	16	40.64	40.64	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		22.2	0		\N	\N	\N	\N
890	CID558	CAT004	ITM028	34+10+10	34	10	10	25	62	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		34	0		\N	\N	\N	\N
891	CID558	CAT004	ITM029	42+10+10	42	10	10	25	62	24	60.96	60.96	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		46.9	0		\N	\N	\N	\N
892	CID004	CAT007	ITM040	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	4	.5K(8P)/ Box	None	plain	0	0		\N	\N	\N	\N
893	CID004	CAT007	ITM041	20	20	0	0	10	50	0	0	0	HDPE	MAS004	FALSE	Box	4	.5K(8P)/ Box	None	plain	0	0		\N	\N	\N	\N
894	CID004	CAT007	ITM042	25	25	0	0	10	50	0	0	0	HDPE	MAS004	FALSE	Box	4	.5K(8P)/ Box	None	Plain	0	0		\N	\N	\N	\N
895	CID338	CAT004	ITM028	68	68	0	0	15	75	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		62.2	0		\N	\N	\N	\N
896	CID854	CAT003	ITM019	25+8+8	25	8	8	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		10	0		\N	\N	\N	\N
897	CID854	CAT003	ITM020	31+10+10	31	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		15.5	0		\N	\N	\N	\N
898	CID104	CAT004	ITM027	26+6+6	26	6	6	40	100	12	30.48	30.48	LLDPE	MAS061	TRUE	Kg.	1	20K/Bag	None		23.2	0		\N	\N	\N	\N
899	CID104	CAT004	ITM028	30+7+7	30	7	7	40	100	16	40.64	40.64	LLDPE	MAS057	TRUE	Kg.	1	20K/Bag	None		35.8	0		\N	\N	\N	\N
900	CID104	CAT004	ITM029	36+7+7	36	7	7	40	100	18	45.72	45.72	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	None		45.7	0		\N	\N	\N	\N
901	CID468	CAT004	ITM028	35	35	0	0	20	100	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		35.6	0		\N	\N	\N	\N
902	CID192	CAT003	ITM021	14+14+38	38	14	14	18	45	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
903	CID855	CAT003	ITM027	25+8+8	25	8	8	20	50	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		18.7	0		\N	\N	\N	\N
904	CID855	CAT004	ITM028	32+5+5	32	5	5	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		37.1	0		\N	\N	\N	\N
905	CID142	CAT010	ITM062	125	125	0	0	15	75	0	0	0	HDPE	MAS002	FALSE	Roll	1	20K/Bag	None		0	0		\N	\N	\N	\N
906	CID755	CAT003	ITM018	20+7+7	20	7	7	15	37	14	35.56	35.56	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		8.9	0		\N	\N	\N	\N
907	CID755	CAT003	ITM021	35+10+10	35	10	10	16	40	22	55.88	55.88	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		24.6	0		\N	\N	\N	\N
908	CID755	CAT003	ITM022	42+12+12	42	12	12	17	42	30	76.2	76.2	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		42.2	0		\N	\N	\N	\N
909	CID654	CAT006	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS005	TRUE	Roll w/Core	1	15R/Bag	None	Wisam	44	0		\N	\N	\N	\N
910	CID471	CAT003	ITM019	26+7+7	26	7	7	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		13.5	0		\N	\N	\N	\N
911	CID471	CAT003	ITM020	33+11+11	33	11	11	17	42	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		23.5	0		\N	\N	\N	\N
912	CID471	CAT003	ITM021	35+12+12	35	12	12	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		32.4	0		\N	\N	\N	\N
913	CID471	CAT003	ITM022	49+14+14	49	14	14	20	50	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		54.8	0		\N	\N	\N	\N
914	CID471	CAT008	ITM044	22	22	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.8	0		\N	\N	\N	\N
915	CID471	CAT008	ITM056	27	27	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9.6	0		\N	\N	\N	\N
916	CID471	CAT008	ITM057	35	35	0	0	10	50	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		16	0		\N	\N	\N	\N
917	CID471	CAT008	ITM058	45	45	0	0	18	90	26	66.04	66.04	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		53.5	0		\N	\N	\N	\N
918	CID471	CAT008	ITM059	58	58	0	0	18	90	30	76.2	76.2	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		79.6	0		\N	\N	\N	\N
919	CID278	CAT003	ITM022	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
920	CID278	CAT008	ITM044	20	20	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.1	0		\N	\N	\N	\N
921	CID278	CAT008	ITM056	26	26	0	0	11	55	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		11.6	0		\N	\N	\N	\N
922	CID278	CAT008	ITM057	31	31	0	0	12	60	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		18.9	0		\N	\N	\N	\N
923	CID600	CAT004	ITM027	31.5	31.5	0	0	18	90	16	40.64	40.64	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	None		23	0		\N	\N	\N	\N
924	CID600	CAT004	ITM027	31.5	31.5	0	0	18	90	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		23	0		\N	\N	\N	\N
925	CID349	CAT009	ITM075	44	44	0	0	30	150	32	81.28	81.28	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		107.3	0		\N	\N	\N	\N
926	CID252	CAT003	ITM020	30+9+9	30	9	9	20	50	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		26.8	0		\N	\N	\N	\N
927	CID856	CAT003	ITM021	40+10+10	40	10	10	20	50	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		33.5	0		\N	\N	\N	\N
928	CID856	CAT003	ITM022	40+10+10	40	10	10	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		48.8	0		\N	\N	\N	\N
929	CID723	CAT003	ITM019	6+6+26	26	6	6	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		9.3	30		\N	\N	\N	\N
930	CID723	CAT003	ITM020	32+10+10	32	10	10	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.9	30		\N	\N	\N	\N
931	CID723	CAT003	ITM021	33+10+10	33	10	10	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.6	30		\N	\N	\N	\N
932	CID543	CAT004	ITM028	25+6+6	25	6	6	20	50	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		13.2	0		\N	\N	\N	\N
933	CID025	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS005	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
934	CID020	CAT002	ITM053	60+18+18	60	18	18	13	32	0	110	110	Regrind	MAS002	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	67.6	0		\N	\N	\N	\N
935	CID004	CAT007	ITM043	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
937	CID004	CAT007	ITM055	40.5	40.5	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	5Kg/Box	None	Plain	0	0		\N	\N	\N	\N
938	CID820	CAT006	ITM036	50	50	0	0	10	50	0	110	110	LLDPE	MAS005	TRUE	Roll	1	20K/Bag	None		55	0		\N	\N	\N	\N
939	CID579	CAT003	ITM023	70+17+17	70	17	17	20	50	39	99.06	99.06	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		103	0		\N	\N	\N	\N
940	CID266	CAT008	ITM044	30	30	0	0	7	35	0	0	0	LLDPE	MAS001	TRUE	Box	6	20K/Bag	None		0	0		\N	\N	\N	\N
941	CID811	CAT008	ITM044	50	50	0	0	9	45	36	91.44	91.44	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		41.1	0		\N	\N	\N	\N
942	CID464	CAT007	ITM041	20	20	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.1	0		\N	\N	\N	\N
943	CID478	CAT008	ITM044	20	20	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.1	0		\N	\N	\N	\N
944	CID478	CAT008	ITM056	26	26	0	0	10	50	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		10.6	0		\N	\N	\N	\N
945	CID857	CAT003	ITM019	25+7+7	25	7	7	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		11.4	0		\N	\N	\N	\N
946	CID857	CAT003	ITM020	32+10+10	32	10	10	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		18.5	0		\N	\N	\N	\N
947	CID533	CAT003	ITM019	29+8+8	29	8	8	13	32	18	45.72	45.72	HDPE	MAS024	TRUE	Kg.	1	20K/Bag	None		13.2	0		\N	\N	\N	\N
948	CID533	CAT003	ITM020	32+11+11	32	11	11	13	32	20	50.8	50.8	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		17.6	0		\N	\N	\N	\N
949	CID533	CAT003	ITM021	34+12+12	34	12	12	16	40	24	60.96	60.96	HDPE	MAS041	TRUE	Kg.	1	20K/Bag	None		28.3	0		\N	\N	\N	\N
950	CID533	CAT003	ITM022	39+14+14	39	14	14	16	40	28	71.12	71.12	HDPE	MAS024	TRUE	Kg.	1	20K/Bag	None		38.1	0		\N	\N	\N	\N
951	CID533	CAT003	ITM023	47+13+13	47	13	13	17	42	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		49.8	0		\N	\N	\N	\N
952	CID527	CAT010	ITM046	57	57	0	0	14	70	28	71.12	71.12	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		56.8	0		\N	\N	\N	\N
953	CID746	CAT002	ITM013	32+12+12	32	12	12	11	27	0	65	65	HDPE	MAS005	FALSE	Box	5	14Pc/R x 17R/Box	None		19.7	0		\N	\N	\N	\N
954	CID038	CAT005	ITM033	33+11+11	33	11	11	5	12	0	110	110	HDPE	MAS005	TRUE	5 Roll	0.8	5R/P x 10P/Bag	None	Ahmad Saad (Busaad Plastic)	14.5	0		\N	\N	\N	\N
955	CID142	CAT009	ITM045	10	10	0	0	10	50	0	0	0	LLDPE	MAS056	FALSE	Roll	5	5Kg/Box	None		0	0		\N	\N	\N	\N
956	CID411	CAT008	ITM056	12	12	0	0	7	35	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		3.4	0	Plastic Cups	\N	\N	\N	\N
957	CID411	CAT008	ITM057	25	25	0	0	8	40	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.1	0	Tray No. 3	\N	\N	\N	\N
958	CID858	CAT003	ITM019	25+8+8	25	8	8	17	42	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.7	30		\N	\N	\N	\N
959	CID858	CAT003	ITM021	31+9+9	31	9	9	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.1	30		\N	\N	\N	\N
960	CID815	CAT003	ITM019	28+8+8	28	8	8	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.1	30		\N	\N	\N	\N
961	CID815	CAT003	ITM021	37+13+13	37	13	13	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		32.3	30		\N	\N	\N	\N
962	CID815	CAT005	ITM033	32+9+9	32	9	9	4	10	14	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	11	0		\N	\N	\N	\N
963	CID724	CAT004	ITM028	33+6+6	33	6	6	26	65	20	50.8	50.8	HDPE	MAS057	TRUE	Kg.	1	20K/Bag	None		29.7	0		\N	\N	\N	\N
964	CID036	CAT004	ITM028	33+6+6	33	6	6	26	65	20	50.8	50.8	HDPE	MAS062	TRUE	Kg.	1	20K/Bag	None		29.7	0		\N	\N	\N	\N
965	CID322	CAT003	ITM021	37+11+11	37	11	11	16	40	24	60.96	60.96	HDPE	MAS006	TRUE	Kg.	1	20K/Bag	None		28.8	0		\N	\N	\N	\N
966	CID181	CAT004	ITM027	24+10+10	24	10	10	25	62	16	40.64	40.64	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		22.2	0		\N	\N	\N	\N
967	CID181	CAT004	ITM029	35+10+10	35	10	10	25	62	24	60.96	60.96	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		41.6	0		\N	\N	\N	\N
968	CID181	CAT004	ITM030	45+10+10	45	10	10	25	62	26	66.04	66.04	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		53.2	0		\N	\N	\N	\N
969	CID168	CAT001	ITM005	40+16+16	40	16	16	10	25	0	80	80	HDPE	MAS014	FALSE	Packet	1.2	10P/Bag	None	Dahiya Eastern Shopping Center	28.8	0		\N	\N	\N	\N
970	CID411	CAT003	ITM019	26+7+7	26	7	7	13	32	18	45.72	45.72	LLDPE	MAS001	TRUE	Box	10	20K/Bag	None		11.7	0		\N	\N	\N	\N
971	CID584	CAT008	ITM044	30	30	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Roll	50	20K/Bag	None		0	0		\N	\N	\N	\N
972	CID584	CAT008	ITM056	40	40	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Roll	50	20K/Bag	None		0	0		\N	\N	\N	\N
973	CID452	CAT004	ITM028	45	45	0	0	45	225	20	50.8	50.8	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		102.9	20		\N	\N	\N	\N
974	CID452	CAT004	ITM029	50+5+5	50	5	5	45	112	22	55.88	55.88	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		75.1	20		\N	\N	\N	\N
975	CID859	CAT004	ITM027	31+6+6	31	6	6	40	100	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		35	0		\N	\N	\N	\N
976	CID859	CAT004	ITM028	35+6+6	35	6	6	40	100	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		47.8	0		\N	\N	\N	\N
977	CID859	CAT004	ITM029	35+7+7	35	7	7	40	100	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		54.8	0		\N	\N	\N	\N
978	CID411	CAT009	ITM045	30	30	0	0	25	125	20	50.8	50.8	LLDPE	MAS029	TRUE	Box	10	20K/Bag	Banana		38.1	20		\N	\N	\N	\N
979	CID184	CAT003	ITM021	36+11+11	36	11	11	13	32	0	76	76	LLDPE	MAS001	FALSE	Packet	1	20K/Bag	T-Shirt		28.2	30		\N	\N	\N	\N
980	CID181	CAT003	ITM023	51+14+14	51	14	14	16	40	36	91.44	91.44	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		57.8	0		\N	\N	\N	\N
981	CID320	CAT007	ITM041	0	0	0	0	10	50	0	0	0	LLDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
982	CID320	CAT007	ITM042	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
983	CID320	CAT007	ITM043	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
984	CID320	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Roll	1.1	20K/Bag	None		0	0		\N	\N	\N	\N
985	CID320	CAT002	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS029	FALSE	Roll	1.1	20K/Bag	None		0	0		\N	\N	\N	\N
986	CID320	CAT002	ITM013	0	0	0	0	0	0	0	0	0	HDPE	MAS006	FALSE	Roll	1.1	20K/Bag	None		0	0		\N	\N	\N	\N
987	CID320	CAT002	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
988	CID320	CAT002	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
989	CID320	CAT002	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS002	FALSE	Roll	1.1	15R/Bag	None	Jarash	0	0		\N	\N	\N	\N
990	CID320	CAT002	ITM017	0	0	0	0	0	0	0	100	100	Regrind	MAS002	FALSE	Roll	1.1	15R/Bag	None	Jarash	0	0		\N	\N	\N	\N
991	CID860	CAT004	ITM027	28+8+8	28	8	8	25	62	18	45.72	45.72	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		24.9	20		\N	\N	\N	\N
992	CID860	CAT004	ITM028	37+9+9	37	9	9	25	62	20	50.8	50.8	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		34.6	20		\N	\N	\N	\N
993	CID860	CAT004	ITM029	44+9+9	44	9	9	27	67	22	55.88	55.88	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		46.4	20		\N	\N	\N	\N
994	CID860	CAT004	ITM031	48+13+13	48	13	13	27	67	32	81.28	81.28	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		80.6	20		\N	\N	\N	\N
995	CID182	CAT003	ITM019	25+7+7	25	7	7	11	27	0	0	0	HDPE	MAS023	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
996	CID182	CAT003	ITM020	27+8+8	27	8	8	12	30	20	50.8	50.8	HDPE	MAS023	TRUE	Kg.	1	20K/Bag	None		13.1	0		\N	\N	\N	\N
997	CID182	CAT003	ITM021	35+10+10	35	10	10	13	32	24	60.96	60.96	HDPE	MAS023	TRUE	Kg.	1	20K/Bag	None		21.5	0		\N	\N	\N	\N
998	CID182	CAT003	ITM022	40+13+13	40	13	13	15	37	28	71.12	71.12	HDPE	MAS023	TRUE	Kg.	1	20K/Bag	None		34.7	0		\N	\N	\N	\N
999	CID182	CAT003	ITM023	50+14+14	50	14	14	18	45	32	81.28	81.28	HDPE	MAS023	TRUE	Kg.	1	20K/Bag	None		57.1	0		\N	\N	\N	\N
1000	CID117	CAT004	ITM030	44+13+13	44	13	13	30	75	28	71.12	71.12	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		74.7	20		\N	\N	\N	\N
1001	CID779	CAT008	ITM059	45+14+14	45	14	14	18	45	0	86	86	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		56.5	0		\N	\N	\N	\N
1002	CID684	CAT004	ITM025	22	22	0	0	18	90	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		12.1	0		\N	\N	\N	\N
1003	CID781	CAT004	ITM026	20+5+5	20	5	5	25	62	12	30.48	30.48	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		11.3	0		\N	\N	\N	\N
1004	CID861	CAT004	ITM029	35+10+10	35	10	10	40	100	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		61.5	20		\N	\N	\N	\N
1005	CID781	CAT003	ITM021	30+10+10	30	10	10	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		25.6	0		\N	\N	\N	\N
1006	CID754	CAT001	ITM003	31+8+8	31	8	8	10	25	24	60.96	60.96	HDPE	MAS041	TRUE	Kg.	1	20K/Bag	None		14.3	0		\N	\N	\N	\N
1007	CID785	CAT004	ITM029	46	46	0	0	13	65	26	66.04	66.04	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		39.5	20		\N	\N	\N	\N
1008	CID130	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	5 Roll	0.8	5R/Bag	None	Abeer	11	0		\N	\N	\N	\N
1009	CID130	CAT005	ITM035	45+10+10	45	10	10	8	20	20	50.8	50.8	HDPE	MAS005	TRUE	Roll w/Core	4	5R/Bag	None	Abeer	13.2	0		\N	\N	\N	\N
1010	CID130	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	0.8	20K/Bag	None	Abeer	44	0		\N	\N	\N	\N
1011	CID649	CAT001	ITM004	36+16+16	36	16	16	9	22	0	70	70	Regrind	MAS002	FALSE	Packet	1	10P/Bag	None	Modern Plastic Bag Factory	20.9	0		\N	\N	\N	\N
1012	CID649	CAT001	ITM005	40+16+16	40	16	16	10	25	0	80	80	Regrind	MAS002	FALSE	Packet	1.2	10P/Bag	None	We One Shopping Center	28.8	0		\N	\N	\N	\N
1013	CID649	CAT001	ITM006	45+18+18	45	18	18	9	22	0	90	90	Regrind	MAS002	FALSE	Packet	1.4	10P/Bag	None	We One Shopping Center	32.1	0		\N	\N	\N	\N
1014	CID862	CAT008	ITM044	18	18	0	0	20	100	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		11	0		\N	\N	\N	\N
1015	CID863	CAT008	ITM044	20	20	0	0	10	50	0	35	35	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		7	0		\N	\N	\N	\N
1016	CID863	CAT008	ITM056	41+6+6	41	6	6	24	60	0	112	112	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		71.2	0		\N	\N	\N	\N
1017	CID391	CAT004	ITM028	35+9+9	35	9	9	45	112	18	45.72	45.72	LLDPE	MAS007	TRUE	Kg.	1	20K/Bag	Banana		54.3	20		\N	\N	\N	\N
1018	CID391	CAT004	ITM029	40+8+8	40	8	8	45	112	20	50.8	50.8	LLDPE	MAS007	TRUE	Kg.	1	20K/Bag	Banana		63.7	20		\N	\N	\N	\N
1019	CID391	CAT004	ITM030	46+9+9	46	9	9	50	125	22	55.88	55.88	LLDPE	MAS007	TRUE	Kg.	1	20K/Bag	Banana		89.4	20		\N	\N	\N	\N
1020	CID864	CAT012	ITM050	23+5+5	23	5	5	60	150	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		45.3	0		\N	\N	\N	\N
1021	CID864	CAT012	ITM050	22+5+5	22	5	5	60	150	16	40.64	40.64	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		39	0		\N	\N	\N	\N
1022	CID864	CAT012	ITM097	22+5+5	22	5	5	60	150	16	40.64	40.64	LLDPE	MAS014	TRUE	Kg.	1	20K/Bag	None		39	0		\N	\N	\N	\N
1023	CID864	CAT012	ITM069	38+8+8	38	8	8	60	150	26	66.04	66.04	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		107	0		\N	\N	\N	\N
1024	CID864	CAT012	ITM068	39	39	0	0	30	150	34	86.36	86.36	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		101	0		\N	\N	\N	\N
1025	CID486	CAT007	ITM040	0	0	0	0	0	0	0	30	30	HDPE	MAS004	FALSE	Kg.	1	.2K/P x 60P/Bag	None	Price House	0	0		\N	\N	\N	\N
1026	CID486	CAT007	ITM041	0	0	0	0	0	0	0	35	35	HDPE	MAS004	FALSE	Kg.	1	.2K/P x 60P/Bag	None	Price House	0	0		\N	\N	\N	\N
1027	CID486	CAT007	ITM042	0	0	0	0	0	0	0	40	40	HDPE	MAS004	FALSE	Kg.	1	.2K/P x 60P/Bag	None	Price House	0	0		\N	\N	\N	\N
1028	CID486	CAT007	ITM043	0	0	0	0	0	0	0	50	50	HDPE	MAS004	FALSE	Kg.	1	.2K/P x 60P/Bag	None	Price House	0	0		\N	\N	\N	\N
1029	CID137	CAT005	ITM033	0	0	0	0	4	20	0	110	110	HDPE	MAS004	TRUE	Roll	0.4	30R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1030	CID137	CAT005	ITM033	0	0	0	0	4	20	0	110	110	HDPE	MAS004	TRUE	5 Roll	0.9	5R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1031	CID137	CAT007	ITM040	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	.200K/P x 25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1032	CID137	CAT007	ITM041	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	5	.200K/P x 25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1033	CID137	CAT007	ITM042	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	5	.200K/P x 25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1034	CID137	CAT007	ITM043	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	5	.200K/P x 25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1035	CID137	CAT007	ITM054	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	5Kg/Box	None	Plain	0	0		\N	\N	\N	\N
1036	CID025	CAT001	ITM009	67+21+21	67	21	21	15	37	0	123	123	Regrind	MAS003	FALSE	Packet	1	50Pcs/P x 4P/Bag	None		99.2	0		\N	\N	\N	\N
1037	CID866	CAT001	ITM003	30+12+12	30	12	12	3	7	0	0	0	HDPE	MAS006	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
1038	CID669	CAT004	ITM030	40+8+8	40	8	8	15	37	28	71.12	71.12	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		29.5	20		\N	\N	\N	\N
1039	CID669	CAT004	ITM031	60+15+15	60	15	15	15	37	32	81.28	81.28	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		54.1	20		\N	\N	\N	\N
1040	CID399	CAT003	ITM019	26+8+8	26	8	8	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.3	30		\N	\N	\N	\N
1041	CID429	CAT004	ITM027	27+7+7	27	7	7	22	55	16	40.64	40.64	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	None		18.3	0		\N	\N	\N	\N
1042	CID429	CAT004	ITM028	36+7+7	36	7	7	28	70	20	50.8	50.8	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	None		35.6	0		\N	\N	\N	\N
1043	CID669	CAT004	ITM029	10+10+30	30	10	10	18	45	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		27.4	20		\N	\N	\N	\N
1044	CID867	CAT004	ITM030	43	43	0	0	25	125	26	66.04	66.04	LLDPE	MAS058	TRUE	Kg.	1	20K/Bag	Banana		71	20		\N	\N	\N	\N
1045	CID752	CAT003	ITM019	8+8+25	25	8	8	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		15	30		\N	\N	\N	\N
1046	CID752	CAT003	ITM021	31+10+10	31	10	10	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		24.9	30		\N	\N	\N	\N
1047	CID088	CAT012	ITM049	17+5+5	17	5	5	60	150	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		32.9	0		\N	\N	\N	\N
1048	CID088	CAT012	ITM051	21+5.5+5.5	21	5.5	5.5	60	150	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		48.8	0		\N	\N	\N	\N
1049	CID088	CAT012	ITM052	26+6+6	26	6	6	60	150	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		69.5	0		\N	\N	\N	\N
1050	CID746	CAT007	ITM066	61	61	0	0	22	110	0	100	100	LLDPE	MAS001	FALSE	Box	5	20K/Bag	None		134.2	0		\N	\N	\N	\N
1051	CID868	CAT004	ITM027	23	23	0	0	14	70	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		11.5	0		\N	\N	\N	\N
1052	CID631	CAT004	ITM026	20	20	0	0	20	100	12	30.48	30.48	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		12.2	0		\N	\N	\N	\N
1053	CID631	CAT004	ITM027	25+6+6	25	6	6	35	87	14	35.56	35.56	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		22.9	0		\N	\N	\N	\N
1054	CID631	CAT004	ITM020	40+8+8	40	8	8	40	100	20	50.8	50.8	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		56.9	20		\N	\N	\N	\N
1055	CID631	CAT004	ITM029	50+10+10	50	10	10	40	100	26	66.04	66.04	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		92.5	20		\N	\N	\N	\N
1056	CID631	CAT004	ITM031	60+11+11	60	11	11	40	100	39	99.06	99.06	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		162.5	20		\N	\N	\N	\N
1057	CID438	CAT004	ITM026	20	20	0	0	20	100	12	30.48	30.48	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		12.2	0		\N	\N	\N	\N
1058	CID438	CAT004	ITM027	25+6+6	25	6	6	35	87	14	35.56	35.56	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		22.9	0		\N	\N	\N	\N
1059	CID438	CAT004	ITM028	40+8+8	40	8	8	40	100	20	50.8	50.8	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		56.9	20		\N	\N	\N	\N
1060	CID438	CAT004	ITM029	50+10+10	50	10	10	40	100	26	66.04	66.04	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		92.5	20		\N	\N	\N	\N
1061	CID438	CAT004	ITM031	60+11+11	60	11	11	40	100	32	81.28	81.28	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		133.3	0		\N	\N	\N	\N
1062	CID789	CAT008	ITM044	55	55	0	0	25	125	36	91.44	91.44	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		125.7	0	Gumbo	\N	\N	\N	\N
1063	CID869	CAT004	ITM027	23	23	0	0	14	70	14	35.56	35.56	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		11.5	0		\N	\N	\N	\N
1064	CID516	CAT003	ITM019	28+8+8	28	8	8	14	35	18	45.72	45.72	HDPE	MAS063	TRUE	Kg.	1	20K/Bag	None		14.1	0		\N	\N	\N	\N
1065	CID516	CAT003	ITM021	34+10+10	34	10	10	17	42	24	60.96	60.96	HDPE	MAS063	TRUE	Kg.	1	20K/Bag	None		27.7	0		\N	\N	\N	\N
1066	CID423	CAT009	ITM045	0	0	0	0	0	0	0	0	0	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1067	CID579	CAT004	ITM027	25	25	0	0	20	100	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		15.2	0		\N	\N	\N	\N
1068	CID579	CAT004	ITM028	36+6+6	36	6	6	25	62	16	40.64	40.64	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		24.2	0		\N	\N	\N	\N
1069	CID579	CAT004	ITM029	41+6+6	41	6	6	25	62	20	50.8	50.8	LLDPE	MAS024	TRUE	Kg.	1	20K/Bag	None		33.4	0		\N	\N	\N	\N
1070	CID423	CAT009	ITM038	15	15	0	0	10	50	28	71.12	71.12	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		10.7	0		\N	\N	\N	\N
1071	CID051	CAT004	ITM030	54+8+8	54	8	8	38	95	24	60.96	60.96	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	None		81.1	0		\N	\N	\N	\N
1072	CID168	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Roll	0.9	10R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1073	CID168	CAT002	ITM012	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1074	CID006	CAT003	ITM022	45+13+13	45	13	13	21	52	28	71.12	71.12	HDPE	MAS014	TRUE	Kg.	1	20K/Bag	None		52.5	0		\N	\N	\N	\N
1075	CID503	CAT007	ITM040	0	0	0	0	0	0	0	0	0	LLDPE	MAS004	FALSE	Box	4	200G/P x 20P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1076	CID503	CAT007	ITM041	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	4	200G/P x 20P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1077	CID503	CAT007	ITM042	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	4	200G/P x 20P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1078	CID503	CAT007	ITM043	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	4	200G/P x 20P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1079	CID621	CAT004	ITM027	20	20	0	0	20	100	12	30.48	30.48	LLDPE	MAS007	TRUE	Kg.	1	20K/Bag	None		12.2	0		\N	\N	\N	\N
1080	CID621	CAT004	ITM028	31	31	0	0	20	100	16	40.64	40.64	LLDPE	MAS007	TRUE	Kg.	1	20K/Bag	None		25.2	0		\N	\N	\N	\N
1081	CID083	CAT003	ITM022	40+12+12	40	12	12	45	112	28	71.12	71.12	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		102	0		\N	\N	\N	\N
1082	CID870	CAT004	ITM028	30+6+6	30	6	6	26	65	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		22.2	20		\N	\N	\N	\N
1083	CID870	CAT004	ITM029	40+10+10	40	10	10	25	62	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		37.8	20		\N	\N	\N	\N
1084	CID871	CAT003	ITM019	25+7+7	25	7	7	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		11.4	0		\N	\N	\N	\N
1085	CID871	CAT003	ITM020	32+10+10	32	10	10	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		16.9	0		\N	\N	\N	\N
1086	CID736	CAT003	ITM020	31+10+10	31	10	10	18	45	18	45.72	45.72	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		21	0		\N	\N	\N	\N
1087	CID736	CAT003	ITM021	36+12+12	36	12	12	18	45	24	60.96	60.96	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		32.9	0		\N	\N	\N	\N
1088	CID736	CAT003	ITM022	40+12+12	40	12	12	20	50	28	71.12	71.12	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		45.5	0		\N	\N	\N	\N
1089	CID845	CAT003	ITM022	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	4.8	20K/Bag	None		0	0		\N	\N	\N	\N
1090	CID872	CAT008	ITM044	20	20	0	0	15	75	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.6	0		\N	\N	\N	\N
1091	CID336	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	5 Roll	0.9	5R/Bag	None	Modern Plastic Bag Factory	11	0		\N	\N	\N	\N
1092	CID336	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Modern Plastic Bag Factory	11	0		\N	\N	\N	\N
1093	CID296	CAT008	ITM044	69	69	0	0	12	60	0	98	98	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		81.1	0		\N	\N	\N	\N
1094	CID296	CAT001	ITM007	58+10+10	58	10	10	22	55	22	112	112	LLDPE	MAS049	TRUE	Kg.	1	20K/Bag	None		96.1	0		\N	\N	\N	\N
1095	CID840	CAT010	ITM046	39+19+19	39	19	19	27	67	0	93	93	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		96	0		\N	\N	\N	\N
1096	CID339	CAT003	ITM019	33+11+11	33	11	11	15	37	20	50.8	50.8	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	None		20.7	0		\N	\N	\N	\N
1097	CID339	CAT003	ITM021	37+11+11	37	11	11	19	47	24	60.96	60.96	HDPE	MAS024	TRUE	Kg.	1	20K/Bag	None		33.8	0		\N	\N	\N	\N
1098	CID339	CAT003	ITM022	45+14+14	45	14	14	20	50	28	71.12	71.12	HDPE	MAS024	TRUE	Kg.	1	20K/Bag	None		51.9	0		\N	\N	\N	\N
1099	CID874	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS004	TRUE	5 Roll	0.8	5R/Bag	None	Karzakan	11	0		\N	\N	\N	\N
1100	CID875	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS004	TRUE	5 Roll	0.9	5R/Bag	None	Karana	11	0		\N	\N	\N	\N
1101	CID873	CAT004	ITM027	27+5+5	27	5	5	36	90	16	40.64	40.64	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		27.1	20		\N	\N	\N	\N
1102	CID873	CAT004	ITM028	32+10+10	32	10	10	30	75	20	50.8	50.8	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		39.6	20		\N	\N	\N	\N
1103	CID296	CAT001	ITM003	33+11+11	33	11	11	14	35	24	60.96	60.96	LLDPE	MAS064	TRUE	Kg.	1	50Pcs/P	None		23.5	0	22Grams/Pcs	\N	\N	\N	\N
1104	CID864	CAT012	ITM070	38+8+8	38	8	8	60	150	26	66.04	66.04	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		107	0		\N	\N	\N	\N
1105	CID090	CAT004	ITM029	35+6.5+6.5	35	6.5	6.5	38	95	18	45.72	45.72	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		41.7	20		\N	\N	\N	\N
1106	CID720	CAT001	ITM005	42+14+14	42	14	14	20	50	18	90	90	LLDPE	MAS049	TRUE	Kg.	1	25Pcs/P x 10P/Bag	None		63	0	59Grams/Pcs	\N	\N	\N	\N
1107	CID779	CAT003	ITM018	25+7+7	25	7	7	12	30	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		8.3	0		\N	\N	\N	\N
1108	CID876	CAT003	ITM019	27+7+7	27	7	7	12	30	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		12.5	0	Master Batch Mixing:\n   Ivory/21260 ---- 1100 Grams\n   Yellow/21259 ---100 Grams\n400Grams Mixed Per Bag	\N	\N	\N	\N
1109	CID876	CAT003	ITM020	30+10+10	30	10	10	15	37	22	55.88	55.88	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		20.7	0	Master Batch Mixing:\n   Ivory/21260 ---- 1100 Grams\n   Yellow/21259 ---100 Grams\n400Grams Mixed Per Bag	\N	\N	\N	\N
1110	CID876	CAT003	ITM022	43+13+13	43	13	13	18	45	28	71.12	71.12	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		44.2	0	Master Batch Mixing:\n   Ivory/21260 ---- 1100 Grams\n   Yellow/21259 ---100 Grams\n400Grams Mixed Per Bag	\N	\N	\N	\N
1111	CID876	CAT009	ITM041	20	20	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	10P/Bag	None		7.1	0		\N	\N	\N	\N
1112	CID876	CAT008	ITM042	26	26	0	0	10	50	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	10P/Bag	None		10.6	0		\N	\N	\N	\N
1113	CID876	CAT008	ITM043	31	31	0	0	10	50	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	10P/Bag	None		15.7	0		\N	\N	\N	\N
1114	CID877	CAT003	ITM019	27+7+7	27	7	7	12	30	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		12.5	0		\N	\N	\N	\N
1115	CID877	CAT003	ITM020	30+10+10	30	10	10	15	37	22	55.88	55.88	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		20.7	0		\N	\N	\N	\N
1116	CID877	CAT003	ITM022	43+13+13	43	13	13	18	45	28	71.12	71.12	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		44.2	0		\N	\N	\N	\N
1117	CID877	CAT008	ITM044	20	20	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	10P/Bag	None		7.1	0		\N	\N	\N	\N
1118	CID877	CAT008	ITM056	26	26	0	0	10	50	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	10P/Bag	None		10.6	0		\N	\N	\N	\N
1119	CID877	CAT008	ITM057	31	31	0	0	10	50	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	10P/Bag	None		15.7	0		\N	\N	\N	\N
1120	CID467	CAT004	ITM028	41	41	0	0	20	100	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		37.5	0		\N	\N	\N	\N
1121	CID878	CAT004	ITM027	25+6+6	25	6	6	35	87	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		22.9	0		\N	\N	\N	\N
1122	CID429	CAT004	ITM029	50+10+10	50	10	10	28	70	24	60.96	60.96	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		59.7	0		\N	\N	\N	\N
1123	CID879	CAT004	ITM027	28+7+7	28	7	7	28	70	18	45.72	45.72	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		26.9	20		\N	\N	\N	\N
1124	CID879	CAT004	ITM028	36+7+7	36	7	7	28	70	20	50.8	50.8	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		35.6	20		\N	\N	\N	\N
1125	CID004	CAT005	ITM033	0	0	0	0	4	20	20	110	110	HDPE	MAS004	TRUE	5 Roll	0.9	5R/Bag	None		0	0		\N	\N	\N	\N
1126	CID004	CAT001	ITM009	60+15+15	60	15	15	11	27	0	110	110	Regrind	MAS003	FALSE	Packet	2.4	5P/Bag	None		53.5	0		\N	\N	\N	\N
1127	CID476	CAT001	ITM006	45+18+18	45	18	18	9	22	0	90	90	Regrind	MAS003	FALSE	Packet	1.4	10P/Bag	None	OOJ Coldstore	32.1	0		\N	\N	\N	\N
1128	CID476	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1129	CID476	CAT002	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS029	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1130	CID476	CAT002	ITM013	0	0	0	0	0	0	0	0	0	HDPE	MAS006	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1131	CID476	CAT006	ITM037	55	55	0	0	6	30	20	110	110	HDPE	MAS005	TRUE	Roll	0.8	15R/Bag	None	OOJ Coldstore	36.3	0		\N	\N	\N	\N
1132	CID476	CAT006	ITM038	60	60	0	0	8	40	20	140	140	HDPE	MAS005	TRUE	Roll	1.8	10R/Bag	None	OOJ Coldstore	67.2	0		\N	\N	\N	\N
1133	CID880	CAT004	ITM027	25	25	0	0	20	100	12	30.48	30.48	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		15.2	20		\N	\N	\N	\N
1134	CID880	CAT004	ITM028	33	33	0	0	20	100	16	40.64	40.64	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		26.8	20		\N	\N	\N	\N
1135	CID880	CAT004	ITM029	40	40	0	0	20	100	22	55.88	55.88	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		44.7	20		\N	\N	\N	\N
1136	CID880	CAT003	ITM022	48+12+12	48	12	12	25	62	30	76.2	76.2	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		68	20		\N	\N	\N	\N
1137	CID476	CAT005	ITM033	32+9+9	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	5 Roll	0.9	5R/Bag	None	Fawzi Coldstore	11	0		\N	\N	\N	\N
1138	CID753	CAT003	ITM018	21+7+7	21	7	7	10	25	16	40.64	40.64	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	T-Shirt		7.1	30		\N	\N	\N	\N
1139	CID753	CAT003	ITM019	27+8+8	27	8	8	11	27	18	45.72	45.72	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt		10.6	30		\N	\N	\N	\N
1140	CID753	CAT003	ITM020	31+10+10	31	10	10	12	30	20	50.8	50.8	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	T-Shirt		15.5	30		\N	\N	\N	\N
1141	CID753	CAT003	ITM021	33+11+11	33	11	11	15	37	24	60.96	60.96	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt		24.8	30		\N	\N	\N	\N
1142	CID753	CAT003	ITM022	41+12+12	41	12	12	17	42	28	71.12	71.12	HDPE	MAS038	TRUE	Kg.	1	20K/Bag	T-Shirt		38.8	30		\N	\N	\N	\N
1143	CID753	CAT003	ITM023	47+13+13	47	13	13	17	42	32	81.28	81.28	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt		49.8	30		\N	\N	\N	\N
1144	CID895	CAT003	ITM020	27+10+10	27	10	10	10	25	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		10.7	0		\N	\N	\N	\N
1145	CID895	CAT003	ITM021	30+10+10	30	10	10	10	25	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		15.2	0		\N	\N	\N	\N
1146	CID897	CAT004	ITM027	20	20	0	0	20	100	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12.2	20		\N	\N	\N	\N
1147	CID897	CAT004	ITM028	5+5+25	25	5	5	30	75	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		18.7	0		\N	\N	\N	\N
1148	CID898	CAT003	ITM021	8+8+28.5	28.5	8	8	14	35	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1149	CID898	CAT003	ITM020	8+8+28.5	28.5	8	8	14	35	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		14.2	0		\N	\N	\N	\N
1150	CID898	CAT003	ITM019	7+7+23	23	7	7	11	27	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		7.1	0		\N	\N	\N	\N
1151	CID898	CAT004	ITM025	15	15	0	0	10	50	10	25.4	25.4	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		3.8	0		\N	\N	\N	\N
1152	CID746	CAT002	ITM013	32+12+12	32	12	12	11	27	0	65	65	HDPE	MAS006	FALSE	Box	5	20K/Bag	None		19.7	0		\N	\N	\N	\N
1153	CID185	CAT003	ITM021	33+10+10	33	10	10	20	50	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		32.3	0		\N	\N	\N	\N
1154	CID900	CAT004	ITM031	10+10+71	71	10	10	40	100	32	81.28	81.28	LLDPE	MAS025	TRUE	Kg.	1	20K/Bag	None		147.9	0		\N	\N	\N	\N
1155	CID900	CAT004	ITM027	5+5+30	30	5	5	36	90	18	45.72	45.72	LLDPE	MAS025	TRUE	Kg.	1	20K/Bag	None		32.9	0		\N	\N	\N	\N
1156	CID741	CAT005	ITM035	34+14+14	34	14	14	4	10	0	125	125	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Manal	15.5	0		\N	\N	\N	\N
1157	CID900	CAT004	ITM028	38+6+6	38	6	6	36	90	20	50.8	50.8	LLDPE	MAS025	TRUE	Kg.	1	20K/Bag	None		45.7	0		\N	\N	\N	\N
1158	CID901	CAT002	ITM013	30+12+12	30	12	12	4	10	0	71	71	HDPE	MAS006	FALSE	Roll	1	17R/4Kgs/box	None	Plain	7.7	0		\N	\N	\N	\N
1159	CID411	CAT004	ITM028	31	31	0	0	22	110	20	50.8	50.8	LLDPE	MAS001	TRUE	Box	10	10P/Bag	Banana		34.6	20		\N	\N	\N	\N
1160	CID902	CAT004	ITM028	50+5+0	50	0	0	20	100	16	40.64	40.64	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		44.7	0	Side Sealing	\N	\N	\N	\N
1161	CID744	CAT004	ITM028	7+7+36	36	7	7	34	85	20	50.8	50.8	LLDPE	MAS065	TRUE	Kg.	1	20K/Bag	Banana		43.2	20		\N	\N	\N	\N
1162	CID744	CAT004	ITM027	6+6+28	28	6	6	34	85	16	40.64	40.64	LLDPE	MAS065	TRUE	Kg.	1	20K/Bag	Banana		27.6	20		\N	\N	\N	\N
1163	CID978	CAT004	ITM028	22	22	0	0	15	75	0	28	28	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		9.2	0		\N	\N	\N	\N
1164	CID365	CAT003	ITM019	7+7+22	22	7	7	13	32	18	45.72	45.72	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		10.5	0		\N	\N	\N	\N
1165	CID365	CAT003	ITM020	8+8+30	30	8	8	16	40	20	50.8	50.8	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		18.7	0		\N	\N	\N	\N
1166	CID365	CAT003	ITM021	10+10+34	34	10	10	16	40	24	60.96	60.96	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		26.3	0		\N	\N	\N	\N
1167	CID903	CAT004	ITM030	8+8+45	45	8	8	30	75	24	60.96	60.96	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		55.8	0		\N	\N	\N	\N
1168	CID903	CAT004	ITM027	8+8+30	30	8	8	30	75	16	40.64	40.64	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		28	0		\N	\N	\N	\N
1169	CID904	CAT004	ITM029	35+10+10	35	10	10	35	87	20	50.8	50.8	LLDPE	MAS060	TRUE	Kg.	1	20K/Bag	Banana		48.6	20		\N	\N	\N	\N
1170	CID904	CAT004	ITM028	27+7+7	27	7	7	35	87	18	45.72	45.72	LLDPE	MAS060	TRUE	Kg.	1	20K/Bag	Banana		32.6	20		\N	\N	\N	\N
1171	CID525	CAT004	ITM028	10+10+50	50	10	10	16	40	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		25.6	20		\N	\N	\N	\N
1172	CID851	CAT003	ITM022	10+10+40	40	10	10	15	37	24	60.96	60.96	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		27.1	0		\N	\N	\N	\N
1173	CID907	CAT003	ITM022	40+12+12	40	12	12	16	40	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		36.4	30	Printing Color ( M/red + Dark Blue)	\N	\N	\N	\N
1174	CID907	CAT003	ITM020	34+10+10	34	10	10	16	40	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		24.1	30	Printing Color ( M/Red + Dark Blue)	\N	\N	\N	\N
1175	CID908	CAT004	ITM029	5+5+40	40	5	5	44	110	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		61.5	20		\N	\N	\N	\N
1176	CID908	CAT004	ITM027	8+8+30	30	8	8	22	55	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		23.1	20		\N	\N	\N	\N
1177	CID909	CAT002	ITM017	50+20+20	50	20	20	14	35	0	0	0	HDPE	MAS003	FALSE	Roll	1	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1178	CID909	CAT001	ITM003	0	0	0	0	0	0	0	0	0	HDPE	MAS038	FALSE	Packet	1	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1179	CID296	CAT001	ITM006	15+15+50	50	15	15	10	25	20	100	100	HDPE	MAS064	TRUE	Packet	1.8	10R/Bag	None		40	0		\N	\N	\N	\N
1180	CID910	CAT003	ITM023	13+13+45	45	13	13	20	50	30	76.2	76.2	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		54.1	30		\N	\N	\N	\N
1181	CID910	CAT003	ITM020	10+10+35	35	10	10	15	37	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		22.7	30		\N	\N	\N	\N
1182	CID137	CAT005	ITM033	0	0	0	0	4	20	0	0	0	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1183	CID904	CAT004	ITM030	40+10+10	40	10	10	35	87	24	60.96	60.96	LLDPE	MAS060	TRUE	Kg.	1	20K/Bag	Banana		63.6	20		\N	\N	\N	\N
1184	CID648	CAT003	ITM018	7+7+22	22	7	7	13	32	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		8.2	30		\N	\N	\N	\N
1185	CID262	CAT003	ITM019	7+7+25	25	7	7	13	32	18	45.72	45.72	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		11.4	30		\N	\N	\N	\N
1186	CID262	CAT003	ITM020	10+10+32	32	10	10	15	37	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		19.5	30		\N	\N	\N	\N
1187	CID262	CAT003	ITM021	10+10+35	35	10	10	17	42	24	60.96	60.96	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		28.2	30		\N	\N	\N	\N
1188	CID262	CAT003	ITM022	11+11+39	39	11	11	18	45	30	76.2	76.2	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		41.8	30		\N	\N	\N	\N
1189	CID262	CAT003	ITM023	17+17+48	48	17	17	20	50	32	81.28	81.28	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		66.6	30		\N	\N	\N	\N
1190	CID130	CAT002	ITM015	16+16+40	40	16	16	13	32	0	80	80	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Abeer	36.9	0		\N	\N	\N	\N
1191	CID130	CAT002	ITM016	18+18+44	44	18	18	13	32	0	90	90	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Abeer	46.1	0		\N	\N	\N	\N
1192	CID864	CAT007	ITM064	0	0	0	0	10	50	0	0	0	LLDPE	MAS029	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1193	CID864	CAT004	ITM028	46	46	0	0	28	140	24	60.96	60.96	LLDPE	MAS058	TRUE	Kg.	1	20K/Bag	Banana		78.5	20		\N	\N	\N	\N
1194	CID754	CAT004	ITM028	31	31	0	0	23	115	0	60	60	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		42.8	0		\N	\N	\N	\N
1195	CID1427	CAT004	ITM028	17+17+36	36	17	17	12	30	0	120	120	LLDPE	MAS004	FALSE	Roll	0.4	30R/Bag	None	Nozha	50.4	0		\N	\N	\N	\N
1196	CID864	CAT012	ITM099	8+8+38	38	8	8	60	150	24	60.96	60.96	LLDPE	MAS058	TRUE	Kg.	1	20K/Bag	Banana		98.8	20		\N	\N	\N	\N
1197	CID575	CAT004	ITM028	30	30	0	0	16	80	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		19.5	20		\N	\N	\N	\N
1198	CID915	CAT003	ITM021	13+13+38	38	13	13	20	50	25	63.5	63.5	HDPE	MAS029	TRUE	Kg.	20	20K/Bag	T-Shirt		40.6	30		\N	\N	\N	\N
1199	CID915	CAT003	ITM022	13+13+48	48	13	13	20	50	0	0	0	HDPE	MAS029	TRUE	Kg.	20	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
1200	CID916	CAT012	ITM051	5+5+25	25	5	5	65	162	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		46.1	20		\N	\N	\N	\N
1201	CID916	CAT003	ITM020	8+8+27	27	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		11.8	30		\N	\N	\N	\N
1202	CID336	CAT005	ITM033	0	0	0	0	4	20	0	0	0	HDPE	MAS005	TRUE	Roll	250	10P/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1203	CID917	CAT003	ITM020	12+12+35	35	12	12	17	42	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		27.7	30		\N	\N	\N	\N
1204	CID917	CAT003	ITM019	8+8+28	28	8	8	17	42	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		15	30		\N	\N	\N	\N
1205	CID917	CAT003	ITM018	7+7+22	22	7	7	17	42	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		12.3	30		\N	\N	\N	\N
1206	CID720	CAT004	ITM028	30	30	0	0	15	75	0	40	40	LLDPE	MAS005	FALSE	Kg.	1	100P/Bag	Banana		18	20	17Grams/Pc.	\N	\N	\N	\N
1207	CID1468	CAT004	ITM028	26	26	0	0	20	100	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		23.8	20		\N	\N	\N	\N
1208	CID1468	CAT004	ITM028	26	26	0	0	20	100	12	30.48	30.48	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		15.8	20		\N	\N	\N	\N
1209	CID1468	CAT004	ITM028	26	26	0	0	20	100	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		31.7	20		\N	\N	\N	\N
1210	CID1468	CAT004	ITM028	27	27	0	0	20	100	36	91.44	91.44	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		49.4	20		\N	\N	\N	\N
1211	CID1468	CAT004	ITM028	50	50	0	0	30	150	28	71.12	71.12	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		106.7	20		\N	\N	\N	\N
1212	CID1488	CAT004	ITM028	26	26	0	0	11	55	0	45	45	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		12.9	0	Double Bottom Sealing	\N	\N	\N	\N
1213	CID122	CAT007	ITM043	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1214	CID025	CAT002	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1215	CID025	CAT002	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1216	CID919	CAT003	ITM020	34+9+9	34	9	9	22	55	20	50.8	50.8	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		29.1	30		\N	\N	\N	\N
1217	CID919	CAT003	ITM021	37+11+11	37	11	11	24	60	24	60.96	60.96	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		43.2	30		\N	\N	\N	\N
1218	CID919	CAT003	ITM022	50+13+13	50	13	13	24	60	28	71.12	71.12	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		64.9	30		\N	\N	\N	\N
1219	CID919	CAT003	ITM024	15+15+60	60	15	15	24	60	36	91.44	91.44	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		98.8	30		\N	\N	\N	\N
1220	CID349	CAT003	ITM020	10+10+30	30	10	10	12	30	20	50	50	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		15	30		\N	\N	\N	\N
1221	CID149	CAT003	ITM029	12+12+42	42	12	12	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt w/Hook		33.8	30		\N	\N	\N	\N
1222	CID920	CAT004	ITM028	8+8+28	28	8	8	32	80	18	45.72	45.72	HDPE	MAS067	TRUE	Kg.	20	20K/Bag	Banana		32.2	20		\N	\N	\N	\N
1223	CID920	CAT004	ITM029	8+8+37	37	8	8	32	80	20	50.8	50.8	HDPE	MAS068	TRUE	Kg.	20	20K/Bag	Banana		43.1	20		\N	\N	\N	\N
1224	CID920	CAT004	ITM030	8+8+45	45	8	8	32	80	22	55.88	55.88	HDPE	MAS068	TRUE	Kg.	20	20K/Bag	Banana		54.5	20		\N	\N	\N	\N
1225	CID920	CAT004	ITM032	18+18+70	70	18	18	36	90	0	100	100	HDPE	MAS005	FALSE	Kg.	20	20K/Bag	Banana		190.8	20		\N	\N	\N	\N
1226	CID410	CAT004	ITM019	25	25	0	0	20	100	14	35.56	35.56	LLDPE	MAS019	TRUE	Kg.	20	20K/Bag	Banana		17.8	20		\N	\N	\N	\N
1227	CID890	CAT012	ITM070	8+8+28.5	28.5	8	8	45	112	24	60.96	60.96	HDPE	MAS006	TRUE	Kg.	20	20K/Bag	Banana		60.8	20		\N	\N	\N	\N
1228	CID921	CAT003	ITM020	10+10+30	30	10	10	17	42	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		21.3	30		\N	\N	\N	\N
1229	CID921	CAT003	ITM019	7+7+21	21	7	7	17	42	0	0	0	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
1230	CID921	CAT006	ITM033	45	45	0	0	4	20	12	100	100	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	plain	18	0		\N	\N	\N	\N
1231	CID236	CAT005	ITM033	0	0	0	0	4	20	0	0	0	HDPE	MAS005	TRUE	6 Roll	1	20K/Bag	None	Five Circle	0	0		\N	\N	\N	\N
1232	CID922	CAT003	ITM019	8+8+26	26	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		11.5	30		\N	\N	\N	\N
1233	CID922	CAT003	ITM020	9+9+30	30	9	9	18	45	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		21.9	30		\N	\N	\N	\N
1234	CID922	CAT003	ITM021	9+9+30	30	9	9	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		26.3	30		\N	\N	\N	\N
1235	CID207	CAT015	ITM110	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1236	CID1468	CAT004	ITM028	55	55	0	0	30	150	0	50	50	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	Banana		82.5	20		\N	\N	\N	\N
1237	CID1423	CAT004	ITM028	45	45	0	0	4	20	0	90	90	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None		16.2	0		\N	\N	\N	\N
1238	CID1548	CAT004	ITM028	41	41	0	0	8	40	0	0	0	HDPE	MAS001	FALSE	Roll	25	25kg/Roll	None		0	0		\N	\N	\N	\N
1239	CID925	CAT004	ITM027	5+5+22	22	5	5	28	70	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		15.9	20		\N	\N	\N	\N
1240	CID926	CAT004	ITM029	8+8+41	41	8	8	26	65	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		45.2	20		\N	\N	\N	\N
1241	CID926	CAT004	ITM028	8+8+41	41	8	8	26	65	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		37.6	20		\N	\N	\N	\N
1242	CID926	CAT004	ITM027	6+6+31	31	6	6	26	65	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		25.6	20		\N	\N	\N	\N
1243	CID207	CAT003	ITM022	11+11+39	39	11	11	15	37	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		36.7	30		\N	\N	\N	\N
1244	CID207	CAT003	ITM021	10+10+31	31	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		23	30		\N	\N	\N	\N
1245	CID207	CAT003	ITM020	9+9+30	30	9	9	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		15.6	30		\N	\N	\N	\N
1246	CID207	CAT003	ITM019	7+7+25	25	7	7	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		11.4	30		\N	\N	\N	\N
1247	CID928	CAT003	ITM021	11+11+41	41	11	11	30	75	24	60.96	60.96	HDPE	MAS070	TRUE	Kg.	20	20K/Bag	T-Shirt		57.6	30		\N	\N	\N	\N
1248	CID929	CAT003	ITM021	11+11+41	41	11	11	30	75	24	60.96	60.96	HDPE	MAS071	TRUE	Kg.	20	20K/Bag	T-Shirt		57.6	30		\N	\N	\N	\N
1249	CID930	CAT003	ITM019	8+8+28	28	8	8	16	40	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		14.3	30		\N	\N	\N	\N
1250	CID930	CAT006	ITM035	50	50	0	0	6	30	10	98	98	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	plain	29.4	0		\N	\N	\N	\N
1251	CID142	CAT010	ITM046	80+27.5+27.5	80	27.5	27.5	11	27	0	0	0	HDPE	MAS038	FALSE	Roll	1	20K/Bag	None		0	0		\N	\N	\N	\N
1252	CID931	CAT004	ITM027	28	28	0	0	15	75	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		17.1	20		\N	\N	\N	\N
1253	CID932	CAT004	ITM045	55	55	0	0	20	100	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	1X50pc X 10	Banana		44.7	20	Side Sealing	\N	\N	\N	\N
1254	CID382	CAT003	ITM019	8+8+26.5	26.5	8	8	20	50	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		17.3	30		\N	\N	\N	\N
1255	CID165	CAT008	ITM044	31	31	0	0	12	60	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		18.9	0		\N	\N	\N	\N
1256	CID933	CAT003	ITM021	12+12+38	38	12	12	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		31.7	30		\N	\N	\N	\N
1257	CID933	CAT003	ITM020	11+11+33	33	11	11	14	35	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		0	30		\N	\N	\N	\N
1258	CID933	CAT003	ITM019	8+8+23	23	8	8	14	35	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		9.7	30		\N	\N	\N	\N
1259	CID1488	CAT004	ITM028	9+9+46	46	9	9	37	92	0	60	60	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		70.7	0		\N	\N	\N	\N
1260	CID038	CAT006	ITM038	60	60	0	0	16	80	0	140	140	LLDPE	MAS055	TRUE	Roll	2.5	4R/Bag	None	Ahmad Saad (Busaad Plastic)	134.4	0		\N	\N	\N	\N
1261	CID038	CAT006	ITM038	60	60	0	0	8	40	0	120	120	HDPE	MAS055	TRUE	Roll	2	4R/Bag	None	Ahmad Saad (Busaad Plastic)	57.6	0		\N	\N	\N	\N
1262	CID038	CAT005	ITM034	13+13+34	34	13	13	6	15	0	120	120	HDPE	MAS010	TRUE	Roll	1	10R/Bag	None	Ahmad Saad (Busaad Plastic)	21.6	0		\N	\N	\N	\N
1263	CID1558	CAT004	ITM028	16+16+56	56	16	16	33	82	39	99.06	99.06	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	None		143	0		\N	\N	\N	\N
1264	CID935	CAT003	ITM020	11+11+22	22	11	11	20	50	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		22.4	30		\N	\N	\N	\N
1265	CID936	CAT003	ITM020	10+10+31	31	10	10	15	37	20	50.8	50.8	HDPE	MAS072	TRUE	Kg.	20	20K/Bag	T-Shirt		19.2	30		\N	\N	\N	\N
1266	CID597	CAT004	ITM032	13+13+70	70	13	13	35	87	32	81.28	81.28	HDPE	MAS055	TRUE	Kg.	20	20K/Bag	Banana		135.8	20		\N	\N	\N	\N
1267	CID919	CAT004	ITM028	8+8+33	33	8	8	44	110	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		54.8	20		\N	\N	\N	\N
1268	CID919	CAT004	ITM029	10+10+36	36	10	10	44	110	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		75.1	20		\N	\N	\N	\N
1269	CID569	CAT004	ITM031	12+12+50	50	12	12	46	115	32	81.28	81.28	LLDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		138.3	20		\N	\N	\N	\N
1270	CID919	CAT004	ITM030	12+12+50	50	12	12	44	110	28	71.12	71.12	LLDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		115.8	20		\N	\N	\N	\N
1271	CID937	CAT003	ITM020	10+10+31	31	10	10	34	85	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		44	30		\N	\N	\N	\N
1272	CID937	CAT003	ITM022	14+14+43	43	14	14	34	85	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		98.1	30		\N	\N	\N	\N
1273	CID720	CAT001	ITM005	18+18+44	44	18	18	13	32	18	90	90	HDPE	MAS071	TRUE	Kg.	1	50Pcs/P x 10P/Bag	None		46.1	0		\N	\N	\N	\N
1274	CID720	CAT001	ITM006	19+19+47	47	19	19	16	40	20	100	100	HDPE	MAS073	TRUE	Kg.	1	24Pcs/P x 10P/Bag	None		68	0	63.5Grms/Pc.	\N	\N	\N	\N
1275	CID938	CAT004	ITM027	8+8+30	30	8	8	30	75	16	40.64	40.64	LLDPE	MAS074	TRUE	Kg.	20	20K/Bag	Banana		28	20		\N	\N	\N	\N
1276	CID1560	CAT004	ITM028	15+15+32.5	32.5	15	15	10	25	0	125	125	HDPE	MAS005	TRUE	Roll	1	10R/Bag	None	Najeem	39.1	0		\N	\N	\N	\N
1277	CID254	CAT004	ITM032	20+20+58	58	20	20	26	65	39	99.06	99.06	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		126.2	20		\N	\N	\N	\N
1278	CID137	CAT006	ITM038	60	60	0	0	8	40	0	140	140	HDPE	MAS005	TRUE	Roll	1.8	10R/Bag	None	Modern Plastic Bag Factory	67.2	0		\N	\N	\N	\N
1279	CID1122	CAT001	ITM003	11+11+33	33	11	11	60	150	24	60	60	LLDPE	MAS029	TRUE	Packet	1	10R/Bag	None	plain	99	0	BIO-HAZARD	\N	\N	\N	\N
1280	CID1122	CAT001	ITM006	18+18+47	47	18	18	60	150	20	100	100	HDPE	MAS029	TRUE	Packet	1.8	10R/Bag	None	plain	249	0	BIO-HAZARD	\N	\N	\N	\N
1281	CID428	CAT003	ITM019	9+9+28	28	9	9	17	42	18	45.72	45.72	HDPE	MAS004	TRUE	Kg.	20	20K/Bag	T-Shirt		17.7	30		\N	\N	\N	\N
1282	CID428	CAT003	ITM021	10+10+31	31	10	10	17	42	24	60.96	60.96	HDPE	MAS004	TRUE	Kg.	20	20K/Bag	T-Shirt		26.1	30		\N	\N	\N	\N
1283	CID428	CAT003	ITM023	14+14+43	43	14	14	22	55	32	81.28	81.28	HDPE	MAS004	TRUE	Kg.	20	20K/Bag	T-Shirt		63.5	30		\N	\N	\N	\N
1284	CID464	CAT003	ITM022	13+13+37	37	13	13	17	42	24	60.96	60.96	HDPE	MAS019	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		32.3	30		\N	\N	\N	\N
1285	CID1488	CAT004	ITM028	10+10+42	42	10	10	37	92	0	70	70	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		79.9	0		\N	\N	\N	\N
1286	CID1564	CAT004	ITM028	14+14+35	35	14	14	9	22	0	125	125	HDPE	MAS005	FALSE	Roll	1	10R/Bag	None	Enet	34.7	0		\N	\N	\N	\N
1287	CID411	CAT013	ITM020	10+10+32	32	10	10	13	32	20	50.8	50.8	LLDPE	MAS001	TRUE	Box	10	20K/Bag	T-Shirt		16.9	30		\N	\N	\N	\N
1288	CID411	CAT013	ITM021	12+12+36	36	12	12	16	40	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	20	20K/Bag	T-Shirt		29.3	30		\N	\N	\N	\N
1289	CID482	CAT004	ITM030	40+7+7	40	7	7	42	105	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		63.4	20		\N	\N	\N	\N
1290	CID482	CAT004	ITM031	55+9+9	55	9	9	45	112	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		132.9	20		\N	\N	\N	\N
1291	CID482	CAT004	ITM032	70+14+14	70	14	14	46	115	39	99.06	99.06	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		223.3	20		\N	\N	\N	\N
1292	CID943	CAT004	ITM026	5+5+20	20	5	5	15	37	12	30.48	30.48	HDPE	MAS001	TRUE	Kg.	20	20K/Bag	Banana		6.8	20		\N	\N	\N	\N
1293	CID943	CAT004	ITM028	5+5+34	34	5	5	22	55	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	20	20K/Bag	Banana		22.1	20		\N	\N	\N	\N
1294	CID943	CAT004	ITM029	13+13+39	39	13	13	28	70	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	20	20K/Bag	Banana		46.2	20		\N	\N	\N	\N
1295	CID1525	CAT004	ITM028	45	45	0	0	3.5	17	0	100	100	HDPE	MAS001	FALSE	Roll	5	20K/Bag	None	Plain	15.3	0		\N	\N	\N	\N
1296	CID1577	CAT004	ITM028	52	52	0	0	7	35	0	110	110	LLDPE	MAS005	TRUE	Roll	1	20K/Bag	None		40	0		\N	\N	\N	\N
1297	CID1613	CAT004	ITM028	6+6+37	37	6	6	50	125	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		62.2	20		\N	\N	\N	\N
1298	CID1197	CAT004	ITM028	32	32	0	0	12	60	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.6	20		\N	\N	\N	\N
1299	CID1841	CAT004	ITM028	33.5	33.5	0	0	24	120	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		36.8	20		\N	\N	\N	\N
1300	CID945	CAT004	ITM027	7+7+27	27	7	7	12	30	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		8.7	20		\N	\N	\N	\N
1301	CID945	CAT004	ITM028	7+7+34	34	7	7	13	32	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		12.5	20		\N	\N	\N	\N
1302	CID945	CAT004	ITM029	8+8+41	41	8	8	16	40	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		23.2	20		\N	\N	\N	\N
1303	CID946	CAT003	ITM020	10+10+33	33	10	10	17	42	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		22.6	30		\N	\N	\N	\N
1304	CID946	CAT003	ITM023	13+13+46	46	13	13	20	50	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		51.2	30		\N	\N	\N	\N
1305	CID946	CAT003	ITM024	15+15+54	54	15	15	21	52	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		71	30		\N	\N	\N	\N
1306	CID947	CAT004	ITM028	12+12+35	35	12	12	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		22.2	20		\N	\N	\N	\N
1307	CID948	CAT003	ITM019	10+10+31	31	10	10	17	42	20	50.8	50.8	HDPE	MAS009	TRUE	Kg.	20	20K/Bag	T-Shirt		21.8	30		\N	\N	\N	\N
1308	CID948	CAT003	ITM022	12+12+38	38	12	12	25	62	28	71.12	71.12	HDPE	MAS024	TRUE	Kg.	20	20K/Bag	T-Shirt		54.7	30		\N	\N	\N	\N
1309	CID948	CAT003	ITM023	14+14+46	46	14	14	26	65	32	81.28	81.28	HDPE	MAS019	TRUE	Kg.	20	20K/Bag	T-Shirt		78.2	30		\N	\N	\N	\N
1310	CID949	CAT008	ITM044	8+8+22	22	8	8	25	62	0	50	50	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		23.6	0		\N	\N	\N	\N
1311	CID1877	CAT004	ITM028	10+10+40	40	10	10	65	162	30	76.2	76.2	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		148.1	20		\N	\N	\N	\N
1312	CID703	CAT004	ITM029	7+7+40	40	7	7	23	57	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		31.3	20		\N	\N	\N	\N
1313	CID703	CAT004	ITM028	7+7+35	35	7	7	23	57	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		25.5	20		\N	\N	\N	\N
1314	CID703	CAT004	ITM027	8+8+30	30	8	8	23	57	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		21.3	20		\N	\N	\N	\N
1315	CID950	CAT009	ITM029	40	40	0	0	28	140	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	20	20K/Bag	Banana		56.9	20		\N	\N	\N	\N
1316	CID025	CAT001	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1317	CID803	CAT003	ITM022	13+13+39	39	13	13	16	40	26	66.04	66.04	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		34.3	30		\N	\N	\N	\N
1318	CID803	CAT003	ITM023	14+14+60	60	14	14	18	45	36	91.44	91.44	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		72.4	30		\N	\N	\N	\N
1319	CID072	CAT004	ITM027	6+6+30	30	6	6	30	75	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		28.8	20		\N	\N	\N	\N
1320	CID072	CAT004	ITM028	7+7+37	37	7	7	37	92	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		47.7	20		\N	\N	\N	\N
1321	CID072	CAT004	ITM029	9+9+41	41	9	9	37	92	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		66.2	20		\N	\N	\N	\N
1322	CID952	CAT003	ITM020	10+10+31	31	10	10	17	42	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		21.8	30		\N	\N	\N	\N
1323	CID953	CAT003	ITM021	11+11+33	33	11	11	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		28.2	30		\N	\N	\N	\N
1324	CID894	CAT008	ITM044	48	48	0	0	28	140	0	73	73	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		98.1	0		\N	\N	\N	\N
1325	CID150	CAT004	ITM027	30+7+7	30	7	7	25	62	16	40.64	40.64	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	Banana		22.2	20		\N	\N	\N	\N
1326	CID150	CAT004	ITM028	35+8+8	35	8	8	30	75	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		38.9	0		\N	\N	\N	\N
1327	CID769	CAT012	ITM051	27+5+5	27	5	5	47	117	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.2	20		\N	\N	\N	\N
1328	CID971	CAT008	ITM044	60+16+16	60	16	16	30	75	0	120	120	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		165.6	0		\N	\N	\N	\N
1329	CID555	CAT006	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS005	TRUE	Roll w/Core	3	5R/Bag	None	Sanabel Al-Sharq	44	0		\N	\N	\N	\N
1330	CID555	CAT005	ITM033	0	0	0	0	4	20	0	110	110	HDPE	MAS005	TRUE	5 Roll	0.9	5R/Bag	None	Sanabel Al-Sharq	0	0		\N	\N	\N	\N
1331	CID555	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	1.8	10R/Bag	None	Sanabel Al-Sharq	44	0		\N	\N	\N	\N
1332	CID554	CAT015	ITM110	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1333	CID555	CAT006	ITM037	55	55	0	0	6	30	0	120	120	HDPE	MAS005	TRUE	Roll	0.8	15R/Bag	None	Modern Plastic Bag Factory	39.6	0		\N	\N	\N	\N
1334	CID904	CAT004	ITM027	5+5+22	22	5	5	30	75	16	40.64	40.64	LLDPE	MAS007	TRUE	Kg.	1	20K/Bag	Banana		19.5	20		\N	\N	\N	\N
1335	CID972	CAT003	ITM024	13+13+51	51	13	13	18	45	34	86.36	86.36	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		59.8	30	Pantone 384 C: Yellow - 88.2%; Proc. Blue - 5.9%; Black - 5.9%	\N	\N	\N	\N
1336	CID973	CAT004	ITM027	5+5+25	25	5	5	35	87	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		18.6	20		\N	\N	\N	\N
1337	CID974	CAT003	ITM022	13+13+51	51	13	13	17	42	32	81.28	81.28	HDPE	MAS025	TRUE	Kg.	1	20K/Bag	None		52.6	0		\N	\N	\N	\N
1338	CID412	CAT003	ITM018	0	0	0	0	13	65	0	0	0	HDPE	MAS004	FALSE	Box	4.8	4.8K/Box	T-Shirt		0	30		\N	\N	\N	\N
1339	CID412	CAT003	ITM019	0	0	0	0	13	65	0	0	0	HDPE	MAS055	FALSE	Box	4.8	4.8K/Box	T-Shirt		0	30		\N	\N	\N	\N
1340	CID412	CAT003	ITM020	0	0	0	0	13	65	0	0	0	HDPE	MAS077	FALSE	Box	4.8	4.8K/Box	T-Shirt		0	30		\N	\N	\N	\N
1341	CID412	CAT003	ITM021	0	0	0	0	13	65	0	0	0	HDPE	MAS004	FALSE	Box	4.8	4.8Kg/Box	T-Shirt		0	30		\N	\N	\N	\N
1342	CID412	CAT003	ITM022	0	0	0	0	16	80	0	0	0	HDPE	MAS004	FALSE	Box	4.8	4.8Kg/Box	None		0	0		\N	\N	\N	\N
1343	CID412	CAT006	ITM038	60	60	0	0	8	40	20	140	140	HDPE	MAS005	TRUE	Roll	1.8	10R/Bag	None	Modern Plastic Bag Factory	67.2	0		\N	\N	\N	\N
1344	CID975	CAT004	ITM029	8+8+37	37	8	8	43	107	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		57.6	20		\N	\N	\N	\N
1345	CID185	CAT003	ITM019	29+9+9	29	9	9	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		12.9	30		\N	\N	\N	\N
1346	CID486	CAT002	ITM017	20+20+50	50	20	20	14	35	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1347	CID976	CAT008	ITM044	15	15	0	0	10	50	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		3.8	0		\N	\N	\N	\N
1348	CID977	CAT004	ITM027	6+6+30	30	6	6	40	100	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		34.1	20		\N	\N	\N	\N
1349	CID747	CAT003	ITM019	8+8+30	30	8	8	13	32	16	40.64	40.64	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12	30		\N	\N	\N	\N
1350	CID481	CAT003	ITM019	9+9+29	29	9	9	15	37	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		15.9	0		\N	\N	\N	\N
1351	CID137	CAT006	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS005	TRUE	Roll w/Core	1.8	10R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
1352	CID433	CAT002	ITM017	20+20+50	50	20	20	13	32	0	100	100	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	57.6	0		\N	\N	\N	\N
1353	CID978	CAT012	ITM045	5+5+28	28	5	5	47	117	16	40.64	40.64	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		36.1	20		\N	\N	\N	\N
1354	CID978	CAT004	ITM060	43	43	0	0	20	100	14	71	71	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	None		61.1	0		\N	\N	\N	\N
1355	CID978	CAT012	ITM098	36	36	0	0	14	70	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		25.6	20		\N	\N	\N	\N
1356	CID226	CAT002	ITM053	0	0	0	0	12	60	0	110	110	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1357	CID476	CAT002	ITM017	50+20+20	50	20	20	14	35	0	100	100	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	63	0		\N	\N	\N	\N
1358	CID275	CAT004	ITM026	5+5+20	20	5	5	28	70	10	25.4	25.4	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		10.7	20		\N	\N	\N	\N
1359	CID275	CAT004	ITM027	5+5+28	28	5	5	30	75	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		20.3	20		\N	\N	\N	\N
1360	CID864	CAT012	ITM049	20+5+5	20	5	5	55	137	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		33.4	20		\N	\N	\N	\N
1361	CID026	CAT004	ITM032	19+19+68	68	19	19	38	95	39	99.06	99.06	HDPE	MAS024	TRUE	Kg.	1	20K/Bag	Banana		199.5	20		\N	\N	\N	\N
1362	CID972	CAT003	ITM019	9+9+26	26	9	9	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		16.1	30	Pantone 384 C: Yellow - 88.2%; Proc. Blue - 5.9%; Black - 5.9%	\N	\N	\N	\N
1363	CID972	CAT003	ITM021	13+13+36	36	13	13	18	45	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		36.9	30	Pantone 384 C: Yellow - 88.2%; Proc. Blue - 5.9%; Black - 5.9%	\N	\N	\N	\N
1364	CID972	CAT003	ITM022	13+13+44	44	13	13	18	45	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		44.8	30	Pantone 384 C: Yellow - 88.2%; Proc. Blue - 5.9%; Black - 5.9%	\N	\N	\N	\N
1365	CID979	CAT004	ITM028	37+6+6	37	6	6	25	62	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		30.9	0		\N	\N	\N	\N
1366	CID980	CAT003	ITM023	13+13+51	51	13	13	17	42	32	81.28	81.28	HDPE	MAS025	TRUE	Kg.	1	20K/Bag	None		52.6	0		\N	\N	\N	\N
1367	CID981	CAT003	ITM019	7+7+24	24	7	7	8	20	16	40.64	40.64	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt		6.2	30		\N	\N	\N	\N
1368	CID981	CAT003	ITM020	9+9+29	29	9	9	13	32	18	45.72	45.72	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt		13.8	30		\N	\N	\N	\N
1369	CID981	CAT003	ITM021	10+10+35	35	10	10	14	35	22	55.88	55.88	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt		21.5	30		\N	\N	\N	\N
1370	CID981	CAT003	ITM022	12+12+41	41	12	12	15	37	28	71.12	71.12	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt		34.2	30		\N	\N	\N	\N
1371	CID982	CAT004	ITM029	8+8+40	40	8	8	38	95	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		59.5	20		\N	\N	\N	\N
1372	CID987	CAT003	ITM022	11+11+38	38	11	11	18	45	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		35.7	30		\N	\N	\N	\N
1373	CID987	CAT003	ITM023	15+15+54	54	15	15	20	50	39	99.06	99.06	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		83.2	30		\N	\N	\N	\N
1374	CID987	CAT003	ITM024	20+20+80	80	20	20	20	50	24	120	120	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		144	30		\N	\N	\N	\N
1375	CID741	CAT012	ITM051	6+6+23	23	6	6	55	137	0	0	0	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
1376	CID741	CAT012	ITM052	6+6+27	27	6	6	55	137	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		65.1	20		\N	\N	\N	\N
1377	CID988	CAT010	ITM046	52	52	0	0	4	20	0	80	80	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		16.6	0		\N	\N	\N	\N
1378	CID135	CAT004	ITM027	25	25	0	0	22	110	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		19.6	20		\N	\N	\N	\N
1379	CID135	CAT004	ITM028	36	36	0	0	24	120	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		39.5	20		\N	\N	\N	\N
1380	CID135	CAT004	ITM029	6+6+41	41	6	6	45	112	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		60.3	20		\N	\N	\N	\N
1381	CID990	CAT004	ITM027	3+3+25	25	3	3	40	100	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		22	20		\N	\N	\N	\N
1382	CID990	CAT004	ITM028	7+7+32	32	7	7	40	100	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		37.4	20		\N	\N	\N	\N
1383	CID976	CAT008	ITM056	15	15	0	0	10	50	14	17.5	17.5	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		2.6	0		\N	\N	\N	\N
1384	CID336	CAT003	ITM019	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	1.8	1.8Kg/Box	T-Shirt		0	30		\N	\N	\N	\N
1385	CID336	CAT003	ITM020	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	4	4Kg/Box	T-Shirt		0	30		\N	\N	\N	\N
1386	CID336	CAT003	ITM021	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	4	4Kg/Box	T-Shirt		0	30		\N	\N	\N	\N
1387	CID336	CAT003	ITM022	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	4	4Kg/Box	T-Shirt		0	30		\N	\N	\N	\N
1388	CID989	CAT004	ITM027	7+7+27	27	7	7	40	100	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		25	20		\N	\N	\N	\N
1389	CID196	CAT003	ITM021	11+11+37	37	11	11	17	42	24	60.96	60.96	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt		30.2	30		\N	\N	\N	\N
1390	CID439	CAT001	ITM007	16+16+55	55	16	16	22	55	0	110	110	LLDPE	MAS005	FALSE	Packet	2	10P/Bag	None	Plain	105.3	0		\N	\N	\N	\N
1391	CID439	CAT001	ITM007	16+16+55	55	16	16	24	60	0	110	110	LLDPE	MAS003	FALSE	Packet	2	10P/Bag	None	Plain	114.8	0		\N	\N	\N	\N
1392	CID991	CAT003	ITM019	9+9+27	27	9	9	11	27	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		11.1	30		\N	\N	\N	\N
1393	CID991	CAT003	ITM021	12+12+34	34	12	12	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		26.2	30		\N	\N	\N	\N
1394	CID307	CAT008	ITM067	5.5+5.5+61.5	61.5	5.5	5.5	17	42	16	90	90	LLDPE	MAS001	TRUE	Box	10	1Kg/P x 10P/Box	None		54.8	0		\N	\N	\N	\N
1395	CID992	CAT003	ITM019	8+8+25	25	8	8	16	40	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		11.7	30		\N	\N	\N	\N
1396	CID976	CAT008	ITM057	27	27	0	0	8	40	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.7	0		\N	\N	\N	\N
1397	CID993	CAT004	ITM029	5+5+39	39	5	5	37	92	0	60	60	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	Banana		54.1	20		\N	\N	\N	\N
1398	CID993	CAT004	ITM030	5+5+39	39	5	5	37	92	0	70	70	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	Banana		63.1	20		\N	\N	\N	\N
1399	CID993	CAT010	ITM046	19+19+40	40	19	19	30	75	0	95	95	HDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		111.2	0		\N	\N	\N	\N
1400	CID993	CAT010	ITM062	19+19+40	40	19	19	30	75	0	90	90	HDPE	MAS010	FALSE	Kg.	1	20K/Bag	None		105.3	0		\N	\N	\N	\N
1401	CID413	CAT004	ITM027	21	21	0	0	15	75	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.6	20		\N	\N	\N	\N
1402	CID994	CAT004	ITM027	21	21	0	0	15	75	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.6	20		\N	\N	\N	\N
1403	CID995	CAT003	ITM021	10+10+33	33	10	10	25	62	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		40.1	30		\N	\N	\N	\N
1404	CID752	CAT004	ITM029	53	53	0	0	16	80	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		51.7	20		\N	\N	\N	\N
1405	CID996	CAT004	ITM032	17+17+71	71	17	17	50	125	32	81.28	81.28	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		213.4	20		\N	\N	\N	\N
1406	CID997	CAT004	ITM027	31	31	0	0	14	70	8	20.32	20.32	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		8.8	20	3CM Folding Down	\N	\N	\N	\N
1407	CID997	CAT004	ITM028	37	37	0	0	14	70	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		15.8	20		\N	\N	\N	\N
1408	CID980	CAT003	ITM022	11+11+41	41	11	11	20	50	26	66.04	66.04	HDPE	MAS025	TRUE	Kg.	1	20K/Bag	T-Shirt		41.6	30		\N	\N	\N	\N
1409	CID980	CAT008	ITM044	20.5	20.5	0	0	14	70	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		8.7	0		\N	\N	\N	\N
1410	CID998	CAT003	ITM018	7+7+21	21	7	7	10	25	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		6.2	30		\N	\N	\N	\N
1411	CID998	CAT003	ITM020	11+11+31	31	11	11	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		19.9	30		\N	\N	\N	\N
1412	CID998	CAT003	ITM021	11+11+36	36	11	11	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		29.7	30		\N	\N	\N	\N
1413	CID999	CAT004	ITM027	6+6+28	28	6	6	32	80	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		26	20		\N	\N	\N	\N
1414	CID999	CAT004	ITM028	6+6+32	32	6	6	32	80	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.8	20		\N	\N	\N	\N
1415	CID999	CAT004	ITM029	8+8+40	40	8	8	32	80	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		54.6	20		\N	\N	\N	\N
1416	CID999	CAT004	ITM030	10+10+52	52	10	10	40	100	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		102.4	20		\N	\N	\N	\N
1417	CID1000	CAT004	ITM027	6+6+28	28	6	6	32	80	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		26	20		\N	\N	\N	\N
1418	CID1000	CAT004	ITM028	6+6+32	32	6	6	32	80	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.8	20		\N	\N	\N	\N
1419	CID1000	CAT004	ITM029	8+8+40	40	8	8	32	80	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		54.6	20		\N	\N	\N	\N
1420	CID1000	CAT004	ITM030	10+10+52	52	10	10	40	100	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		102.4	20		\N	\N	\N	\N
1421	CID1001	CAT004	ITM027	6+6+26	26	6	6	32	80	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		24.7	20		\N	\N	\N	\N
1422	CID1001	CAT004	ITM028	6+6+32	32	6	6	32	80	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.8	20		\N	\N	\N	\N
1423	CID1001	CAT004	ITM029	8+8+40	40	8	8	32	80	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		54.6	20		\N	\N	\N	\N
1424	CID1001	CAT004	ITM030	10+10+52	52	10	10	40	100	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		102.4	20		\N	\N	\N	\N
1425	CID885	CAT004	ITM027	7+7+30	30	7	7	25	62	18	45.72	45.72	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		24.9	20		\N	\N	\N	\N
1426	CID885	CAT004	ITM028	10+10+34	34	10	10	25	62	20	50.8	50.8	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		34	20		\N	\N	\N	\N
1427	CID1002	CAT003	ITM021	11+11+36	36	11	11	17	42	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		27.2	30		\N	\N	\N	\N
1428	CID1002	CAT003	ITM022	14+14+46	46	14	14	18	45	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		47.4	30		\N	\N	\N	\N
1429	CID1003	CAT003	ITM022	13+13+39	39	13	13	23	57	28	71.12	71.12	HDPE	MAS025	TRUE	Kg.	1	20K/Bag	T-Shirt		52.7	30		\N	\N	\N	\N
1430	CID677	CAT003	ITM020	8+8+30	30	8	8	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		17.3	30		\N	\N	\N	\N
1431	CID677	CAT003	ITM021	12+12+36	36	12	12	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		27.1	30		\N	\N	\N	\N
1432	CID677	CAT003	ITM022	12+12+45	45	12	12	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		56.1	30		\N	\N	\N	\N
1433	CID414	CAT010	ITM046	30	30	0	0	6	30	14	35.56	35.56	HDPE	MAS005	TRUE	Roll	50	20K/Bag	None		6.4	0		\N	\N	\N	\N
1434	CID754	CAT008	ITM044	60+11+11	60	11	11	50	125	0	0	0	LLDPE	MAS001	FALSE	Roll	20	20K/Bag	None		0	0		\N	\N	\N	\N
1435	CID275	CAT004	ITM029	8+8+40	40	8	8	35	87	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		59.4	20		\N	\N	\N	\N
1436	CID1004	CAT001	ITM006	15+15+50	50	15	15	10	25	0	100	100	Regrind	MAS003	FALSE	Packet	1.4	10P/Bag	None	Plain	40	0		\N	\N	\N	\N
1437	CID759	CAT004	ITM028	34	34	0	0	20	100	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		31.1	20		\N	\N	\N	\N
1438	CID423	CAT010	ITM046	19+19+70	70	19	19	15	37	0	50	50	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		40	0		\N	\N	\N	\N
1439	CID1005	CAT009	ITM045	4.5+4.5+27	27	4.5	4.5	65	162	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	25Pcs/P x 10P/Bag	Banana		71.1	20		\N	\N	\N	\N
1440	CID135	CAT004	ITM026	20	20	0	0	20	100	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12.2	20		\N	\N	\N	\N
1441	CID976	CAT009	ITM045	21	21	0	0	13	65	0	28	28	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		7.6	0		\N	\N	\N	\N
1442	CID476	CAT008	ITM058	28	28	0	0	10	50	26	66.04	66.04	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		18.5	0		\N	\N	\N	\N
1443	CID1006	CAT008	ITM044	27	27	0	0	8	40	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.7	0		\N	\N	\N	\N
1444	CID613	CAT004	ITM026	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1445	CID1007	CAT003	ITM019	9+9+27	27	9	9	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		13.2	0		\N	\N	\N	\N
1446	CID1007	CAT003	ITM021	11+11+33	33	11	11	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		24.8	0		\N	\N	\N	\N
1447	CID1008	CAT004	ITM027	30	30	0	0	20	100	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		24.4	20		\N	\N	\N	\N
1448	CID1008	CAT004	ITM028	6+6+36	36	6	6	32	80	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.1	20		\N	\N	\N	\N
1449	CID809	CAT004	ITM027	6+6+30	30	6	6	30	75	16	40.64	40.64	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		25.6	20		\N	\N	\N	\N
1450	CID809	CAT004	ITM028	8+8+40	40	8	8	30	75	20	50.8	50.8	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		42.7	20		\N	\N	\N	\N
1451	CID972	CAT003	ITM023	13+13+42	42	13	13	20	50	30	76.2	76.2	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		51.8	30		\N	\N	\N	\N
1452	CID972	CAT008	ITM044	21	21	0	0	14	70	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9	0		\N	\N	\N	\N
1453	CID972	CAT008	ITM056	27	27	0	0	14	70	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		17.3	0		\N	\N	\N	\N
1454	CID198	CAT004	ITM028	8+8+35	35	8	8	30	75	18	45.72	45.72	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		35	20		\N	\N	\N	\N
1455	CID137	CAT002	ITM017	20+20+50	50	20	20	13	32	0	110	110	Regrind	MAS003	FALSE	Roll	1.5	25Pcs/R x 10R/Bag	None	Plain	63.4	0		\N	\N	\N	\N
1456	CID1009	CAT003	ITM019	7+7+24	24	7	7	16	40	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		12.4	0		\N	\N	\N	\N
1457	CID1009	CAT003	ITM020	8+8+28	28	8	8	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		17.9	0		\N	\N	\N	\N
1458	CID1009	CAT003	ITM021	13+13+37	37	13	13	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		30.7	0		\N	\N	\N	\N
1459	CID1009	CAT003	ITM022	13+13+44	44	13	13	18	45	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		51.2	0		\N	\N	\N	\N
1460	CID1010	CAT003	ITM020	30+10+10	30	10	10	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		16.3	30		\N	\N	\N	\N
1461	CID129	CAT004	ITM027	6+6+31	31	6	6	37	92	16	40.64	40.64	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		32.2	20		\N	\N	\N	\N
1462	CID893	CAT002	ITM013	12+12+30	30	12	12	4	10	0	0	0	HDPE	MAS038	FALSE	Box	5	5Kg/Box	None		0	0		\N	\N	\N	\N
1463	CID026	CAT004	ITM028	32+8+8	32	8	8	35	87	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		38.2	20		\N	\N	\N	\N
1464	CID1011	CAT004	ITM028	10+10+40	40	10	10	25	62	20	50.8	50.8	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		37.8	20		\N	\N	\N	\N
1465	CID1011	CAT004	ITM029	10+10+45	45	10	10	27	67	24	60.96	60.96	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		53.1	20		\N	\N	\N	\N
1466	CID1011	CAT004	ITM030	15+15+58	58	15	15	27	67	28	71.12	71.12	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		83.9	20		\N	\N	\N	\N
1467	CID142	CAT009	ITM045	10	10	0	0	10	50	0	0	0	LLDPE	MAS077	FALSE	Roll	5	5Kg/Box	None		0	0		\N	\N	\N	\N
1468	CID142	CAT009	ITM045	10	10	0	0	10	50	0	0	0	LLDPE	MAS041	FALSE	Roll	5	5Kg/Box	None		0	0		\N	\N	\N	\N
1469	CID783	CAT004	ITM025	17	17	0	0	17	85	10	25.4	25.4	LLDPE	MAS025	TRUE	Kg.	1	20K/Bag	Banana		7.3	20		\N	\N	\N	\N
1470	CID783	CAT004	ITM028	30+5+5	30	5	5	38	95	14	35.56	35.56	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		27	20		\N	\N	\N	\N
1471	CID904	CAT006	ITM039	45	45	0	0	4	20	16	90	90	HDPE	MAS007	TRUE	Roll	1	20K/Bag	None	Plain	16.2	0		\N	\N	\N	\N
1472	CID1012	CAT003	ITM019	9+9+28	28	9	9	15	37	18	45.72	45.72	HDPE	MAS025	TRUE	Kg.	1	20K/Bag	T-Shirt		15.6	30		\N	\N	\N	\N
1473	CID1012	CAT003	ITM020	10+10+35	35	10	10	16	40	22	55.88	55.88	HDPE	MAS025	TRUE	Kg.	1	20K/Bag	T-Shirt		24.6	30		\N	\N	\N	\N
1474	CID1012	CAT003	ITM021	13+13+37	37	13	13	16	40	24	60.96	60.96	HDPE	MAS025	TRUE	Kg.	1	20K/Bag	T-Shirt		30.7	30		\N	\N	\N	\N
1475	CID1012	CAT003	ITM022	12+12+40	40	12	12	17	42	28	71.12	71.12	HDPE	MAS025	TRUE	Kg.	1	20K/Bag	T-Shirt		38.2	30		\N	\N	\N	\N
1476	CID1012	CAT003	ITM023	14+14+50	50	14	14	20	50	32	81.28	81.28	HDPE	MAS025	TRUE	Kg.	1	20K/Bag	T-Shirt		63.4	30		\N	\N	\N	\N
1477	CID1013	CAT004	ITM027	7+7+30	30	7	7	35	87	16	40.64	40.64	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		31.1	20		\N	\N	\N	\N
1478	CID1013	CAT004	ITM028	8+8+35	35	8	8	35	87	18	45.72	45.72	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		40.6	20		\N	\N	\N	\N
1479	CID1013	CAT004	ITM029	9+9+40	40	9	9	35	87	20	50.8	50.8	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		51.3	20		\N	\N	\N	\N
1480	CID1013	CAT004	ITM030	8+8+50	50	8	8	28	70	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		56.3	20		\N	\N	\N	\N
1481	CID101	CAT004	ITM029	9+9+40	40	9	9	40	100	20	50.8	50.8	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		58.9	20		\N	\N	\N	\N
1482	CID976	CAT001	ITM009	14+14+78	78	14	14	14	35	0	85	85	HDPE	MAS008	FALSE	Kg.	1	20K/Bag	None		63.1	0		\N	\N	\N	\N
1483	CID1014	CAT012	ITM045	24	24	0	0	18	90	12	30.48	30.48	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	None		13.2	0		\N	\N	\N	\N
1484	CID146	CAT005	ITM033	0	0	0	0	4	20	20	110	110	HDPE	MAS005	TRUE	5 Roll	0.9	5R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1485	CID146	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	1.8	10R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
1486	CID146	CAT006	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS005	TRUE	Roll w/Core	3	5R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
1487	CID146	CAT006	ITM037	55	55	0	0	6	30	20	110	110	HDPE	MAS005	TRUE	Roll	0.8	15R/Bag	None	Modern Plastic Bag Factory	36.3	0		\N	\N	\N	\N
1488	CID146	CAT006	ITM038	60	60	0	0	8	40	20	140	140	HDPE	MAS005	TRUE	Roll	1.8	10R/Bag	None	Modern Plastic Bag Factory	67.2	0		\N	\N	\N	\N
1489	CID649	CAT005	ITM033	0	0	0	0	4	20	20	110	110	HDPE	MAS005	TRUE	6 Roll	1	20(6R)/Bag	None	We One Shopping Center	0	0		\N	\N	\N	\N
1490	CID649	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	1.8	10R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
1491	CID649	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	3	5R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
1492	CID649	CAT006	ITM037	55	55	0	0	6	30	20	110	110	HDPE	MAS005	TRUE	Roll	0.8	15R/Bag	None	Modern Plastic Bag Factory	36.3	0		\N	\N	\N	\N
1493	CID476	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	1.8	10R/Bag	None	OOJ Coldstore	44	0		\N	\N	\N	\N
1494	CID476	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	3	5R/Bag	None	OOJ Coldstore	44	0		\N	\N	\N	\N
1495	CID1016	CAT003	ITM019	8+8+25	25	8	8	10	25	18	45.72	45.72	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		9.4	30		\N	\N	\N	\N
1496	CID439	CAT003	ITM020	10+10+32	32	10	10	18	45	0	0	0	LLDPE	MAS001	TRUE	Box	15	15Kg/Box	T-Shirt w/Hook		0	30		\N	\N	\N	\N
1497	CID439	CAT003	ITM021	11+11+35	35	11	11	18	45	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	15Kg/Bag	T-Shirt w/Hook		0	30		\N	\N	\N	\N
1498	CID396	CAT003	ITM020	8+8+26	26	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		11.5	30		\N	\N	\N	\N
1499	CID396	CAT003	ITM021	13+13+43	43	13	13	16	40	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		36.5	30		\N	\N	\N	\N
1500	CID396	CAT003	ITM022	15+15+50	50	15	15	16	40	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		52	30		\N	\N	\N	\N
1501	CID842	CAT004	ITM029	9+9+41	41	9	9	40	100	20	50.8	50.8	HDPE	MAS077	TRUE	Kg.	1	20K/Bag	Banana		59.9	20		\N	\N	\N	\N
1502	CID337	CAT005	ITM033	0	0	0	0	4	20	20	110	110	HDPE	MAS005	TRUE	5 Roll	0.9	5R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1503	CID337	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	1.8	10R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
1504	CID337	CAT006	ITM037	55	55	0	0	6	30	20	110	110	HDPE	MAS005	TRUE	Roll	0.8	15R/Bag	None	Modern Plastic Bag Factory	36.3	0		\N	\N	\N	\N
1505	CID1017	CAT004	ITM028	7+7+35	35	7	7	38	95	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		42.6	20		\N	\N	\N	\N
1506	CID1017	CAT004	ITM029	10+10+46	46	10	10	42	105	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		77.4	20		\N	\N	\N	\N
1507	CID1018	CAT003	ITM020	10+10+32	32	10	10	12	30	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		17.4	30		\N	\N	\N	\N
1508	CID453	CAT003	ITM019	10+10+30	30	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		18.8	30		\N	\N	\N	\N
1509	CID453	CAT003	ITM020	11+11+30	30	11	11	15	37	24	60.96	60.96	HDPE	MAS024	TRUE	Kg.	1	20K/Bag	T-Shirt		23.5	30		\N	\N	\N	\N
1822	CID1067	CAT003	ITM021	0	0	0	0	0	0	0	0	0	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1510	CID453	CAT003	ITM021	12+12+34	34	12	12	15	37	28	71.12	71.12	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		30.5	30		\N	\N	\N	\N
1511	CID453	CAT003	ITM022	13+13+39	39	13	13	18	45	32	81.28	81.28	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	T-Shirt		47.5	30		\N	\N	\N	\N
1512	CID801	CAT001	ITM002	8+8+30	30	8	8	4	10	0	54	54	HDPE	MAS079	FALSE	Kg.	1	50Pcs/P x 50P/Bag	None	Plain	5	0		\N	\N	\N	\N
1513	CID801	CAT001	ITM004	13+13+33	33	13	13	55	137	24	60	60	LLDPE	MAS080	TRUE	Kg.	1	50Pcs/P x 10P/Bag	None	Plain	97	0		\N	\N	\N	\N
1514	CID801	CAT001	ITM004	12+12+31	31	12	12	20	50	24	60	60	LLDPE	MAS041	TRUE	Kg.	1	50Pcs/P x 10P/Bag	None	Plain	33	0		\N	\N	\N	\N
1515	CID801	CAT001	ITM005	15+15+45	45	15	15	15	37	18	90	90	LLDPE	MAS008	TRUE	Kg.	1	50Pcs/P x 10P/Bag	None	Plain	50	0		\N	\N	\N	\N
1516	CID801	CAT001	ITM006	50+15+15	50	15	15	17	42	0	100	100	Regrind	MAS003	FALSE	Kg.	1	50Pcs/P x 5P/Bag	None	Plain	67.2	0		\N	\N	\N	\N
1517	CID486	CAT002	ITM053	60+18+18	60	18	18	13	32	0	110	110	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	67.6	0		\N	\N	\N	\N
1518	CID1019	CAT004	ITM027	5+5+30	30	5	5	31	77	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		21.9	20		\N	\N	\N	\N
1519	CID1019	CAT004	ITM028	9+9+40	40	9	9	40	100	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		58.9	20		\N	\N	\N	\N
1520	CID1019	CAT004	ITM030	9+9+40	40	9	9	40	100	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		94.3	20		\N	\N	\N	\N
1521	CID893	CAT001	ITM003	12+12+30	30	12	12	3	7	0	0	0	HDPE	MAS038	FALSE	Box	2.5	20K/Bag	None	Plain	0	0		\N	\N	\N	\N
1522	CID893	CAT001	ITM008	15+15+60	60	15	15	11	27	0	110	110	Regrind	MAS003	FALSE	Packet	2.4	5P/Bag	None	Plain	53.5	0		\N	\N	\N	\N
1523	CID746	CAT002	ITM017	0	0	0	0	14	70	0	100	100	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1524	CID092	CAT004	ITM026	23	23	0	0	12	60	12	30.48	30.48	LLDPE	MAS005	TRUE	Box	10	10P/Bag	Banana		8.4	20		\N	\N	\N	\N
1525	CID893	CAT005	ITM033	0	0	0	0	4	20	20	50.8	50.8	HDPE	MAS004	TRUE	6 Roll	1	6R/P x 20P/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1526	CID720	CAT001	ITM005	19+19+47	47	19	19	15	37	20	100	100	HDPE	MAS008	TRUE	Kg.	1	23Pcs/P x 10P/Bag	None		62.9	0	65Grms/Pc	\N	\N	\N	\N
1527	CID411	CAT008	ITM058	19	19	0	0	8	40	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		3.9	0	Tray No. 1	\N	\N	\N	\N
1528	CID949	CAT008	ITM056	8+8+36	36	8	8	40	100	0	69	69	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		71.8	0		\N	\N	\N	\N
1529	CID949	CAT008	ITM057	16+16+53	53	16	16	30	75	0	96	96	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		122.4	0		\N	\N	\N	\N
1530	CID764	CAT003	ITM021	13+13+38	38	13	13	19	47	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		39.7	0		\N	\N	\N	\N
1531	CID764	CAT003	ITM019	8+8+26	26	8	8	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		12.3	30		\N	\N	\N	\N
1532	CID974	CAT003	ITM020	10+10+32	32	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		19.5	30		\N	\N	\N	\N
1533	CID092	CAT004	ITM027	5+5+27	27	5	5	21	52	16	40.64	40.64	LLDPE	MAS005	TRUE	Box	10	10P/Bag	Banana		15.6	20		\N	\N	\N	\N
1534	CID893	CAT001	ITM001	0	0	0	0	3	15	0	0	0	HDPE	MAS005	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
1535	CID412	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	3	5R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
1536	CID412	CAT006	ITM037	55	55	0	0	6	30	20	110	110	HDPE	MAS005	TRUE	Roll	0.8	15R/Bag	None	Modern Plastic Bag Factory	36.3	0		\N	\N	\N	\N
1537	CID412	CAT005	ITM033	0	0	0	0	4	20	20	110	110	HDPE	MAS005	TRUE	5 Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1538	CID412	CAT005	ITM033	0	0	0	0	4	20	20	110	110	HDPE	MAS004	TRUE	Roll	1	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1539	CID1877	CAT004	ITM028	4+4+26	26	4	4	40	100	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		31.1	20		\N	\N	\N	\N
1540	CID328	CAT004	ITM027	6+6+27	27	6	6	20	50	0	0	0	LLDPE	MAS048	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1541	CID328	CAT004	ITM028	8+8+33	33	8	8	20	50	0	0	0	LLDPE	MAS048	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1542	CID328	CAT004	ITM029	12+12+50	50	12	12	28	70	0	0	0	LLDPE	MAS048	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1543	CID735	CAT004	ITM027	7+7+30	30	7	7	20	50	0	0	0	LLDPE	MAS081	TRUE	Kg.	1	20K/Bag	Banana		0	20	Orange Mixing Per Bag\nIvory/EP21263 - 300Grams\nOrange/31311 -  300Grams\nWhite ------------- 100Grams	\N	\N	\N	\N
1544	CID735	CAT004	ITM028	9+9+35	35	9	9	20	50	0	0	0	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		0	20	Orange Mixing Per Bag\nIvory/EP21263 - 300Grams\nOrange/31311 -  300Grams\nWhite ------------- 100Grams	\N	\N	\N	\N
1545	CID735	CAT004	ITM029	12+12+50	50	12	12	28	70	0	0	0	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		0	20	Orange Mixing Per Bag\nIvory/EP21263 - 300Grams\nOrange/31311 -  300Grams\nWhite ------------- 100Grams	\N	\N	\N	\N
1546	CID254	CAT004	ITM030	13+13+51	51	13	13	25	62	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		67.9	20		\N	\N	\N	\N
1547	CID400	CAT007	ITM040	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1548	CID400	CAT007	ITM042	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1549	CID218	CAT004	ITM027	7+7+30	30	7	7	20	50	18	45.72	45.72	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		20.1	20		\N	\N	\N	\N
1550	CID218	CAT004	ITM028	9+9+35	35	9	9	20	50	20	50.8	50.8	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		26.9	20		\N	\N	\N	\N
1551	CID218	CAT004	ITM029	12+12+50	50	12	12	28	70	24	60.96	60.96	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		63.2	20		\N	\N	\N	\N
1552	CID360	CAT003	ITM022	11+11+39	39	11	11	18	45	28	71.12	71.12	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt		39	30		\N	\N	\N	\N
1553	CID439	CAT003	ITM020	11+11+32	32	11	11	20	50	24	50	50	HDPE	MAS077	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		27	30		\N	\N	\N	\N
1554	CID1020	CAT004	ITM028	40	40	0	0	22	110	18	45.72	45.72	HDPE	MAS008	TRUE	Kg.	1	20K/Bag	Banana		40.2	20		\N	\N	\N	\N
1555	CID1021	CAT004	ITM031	13+13+51	51	13	13	60	150	28	71.12	71.12	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		164.3	20		\N	\N	\N	\N
1556	CID130	CAT002	ITM014	0	0	0	0	13	65	0	70	70	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Abeer	0	0		\N	\N	\N	\N
1557	CID130	CAT002	ITM053	18+18+60	60	18	18	13	32	0	110	110	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Abeer	67.6	0		\N	\N	\N	\N
1558	CID1022	CAT005	ITM033	9+9+32	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	5 Roll	0.9	5R/Bag	None	Safeena	11	0		\N	\N	\N	\N
1559	CID983	CAT008	ITM044	18	18	0	0	15	75	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		6.9	0		\N	\N	\N	\N
1560	CID983	CAT008	ITM056	22	22	0	0	15	75	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		10.1	0		\N	\N	\N	\N
1561	CID983	CAT008	ITM057	25	25	0	0	15	75	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		13.3	0		\N	\N	\N	\N
1562	CID983	CAT008	ITM058	38	38	0	0	20	100	22	55.88	55.88	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		42.5	0		\N	\N	\N	\N
1563	CID983	CAT008	ITM059	39	39	0	0	20	100	28	71.12	71.12	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		55.5	0		\N	\N	\N	\N
1564	CID983	CAT008	ITM067	57	57	0	0	25	125	32	81.28	81.28	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		115.8	0		\N	\N	\N	\N
1565	CID169	CAT003	ITM019	7+7+25	25	7	7	10	25	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1566	CID169	CAT003	ITM020	10+10+32	32	10	10	12	30	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1567	CID001	CAT008	ITM044	82	82	0	0	20	100	0	0	0	LLDPE	MAS001	FALSE	Roll	50	20K/Bag	None		0	0		\N	\N	\N	\N
1568	CID899	CAT003	ITM021	12+12+38	38	12	12	20	50	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		37.8	30		\N	\N	\N	\N
1569	CID411	CAT008	ITM059	21	21	0	0	9	45	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		5.8	0	Tray No. 2	\N	\N	\N	\N
1570	CID1023	CAT003	ITM020	9+9+31	31	9	9	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		18.4	0		\N	\N	\N	\N
1571	CID1023	CAT003	ITM021	13+13+37	37	13	13	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		30.7	0		\N	\N	\N	\N
1572	CID1023	CAT003	ITM022	13+13+44	44	13	13	18	45	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		51.2	0		\N	\N	\N	\N
1573	CID254	CAT004	ITM021	8+8+40	40	8	8	45	112	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		76.5	20		\N	\N	\N	\N
1574	CID254	CAT004	ITM020	8+8+33	33	8	8	40	100	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		44.8	20		\N	\N	\N	\N
1575	CID542	CAT003	ITM020	10+10+28	28	10	10	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		19.5	30		\N	\N	\N	\N
1576	CID542	CAT003	ITM021	13+13+39	39	13	13	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		35.7	30		\N	\N	\N	\N
1577	CID542	CAT003	ITM023	14+14+48	48	14	14	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		61.8	30		\N	\N	\N	\N
1578	CID002	CAT003	ITM020	10+10+32	32	10	10	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		16.9	30		\N	\N	\N	\N
1579	CID002	CAT003	ITM021	11+11+33	33	11	11	15	37	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		28.9	30		\N	\N	\N	\N
1580	CID002	CAT003	ITM022	12+12+43	43	12	12	21	52	36	91.44	91.44	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		63.7	30		\N	\N	\N	\N
1581	CID023	CAT004	ITM030	7+7+40	40	7	7	42	105	0	56	56	HDPE	MAS006	FALSE	Kg.	1	20K/Bag	Banana		63.5	20		\N	\N	\N	\N
1582	CID023	CAT004	ITM031	9+9+55	55	9	9	45	112	0	81	81	HDPE	MAS006	FALSE	Kg.	1	20K/Bag	Banana		132.5	20		\N	\N	\N	\N
1583	CID023	CAT004	ITM032	14+14+70	70	14	14	46	115	0	100	100	HDPE	MAS006	FALSE	Kg.	1	20K/Bag	Banana		225.4	20		\N	\N	\N	\N
1584	CID863	CAT007	ITM040	15	15	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1585	CID320	CAT003	ITM019	8+8+26	26	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		11.5	30		\N	\N	\N	\N
1586	CID320	CAT003	ITM020	9+9+30	30	9	9	13	32	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
1587	CID320	CAT003	ITM021	11+11+37	37	11	11	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		26.6	30		\N	\N	\N	\N
1588	CID900	CAT004	ITM029	7+7+45	45	7	7	36	90	22	55.88	55.88	LLDPE	MAS025	TRUE	Kg.	1	20K/Bag	Banana		59.3	20		\N	\N	\N	\N
1589	CID721	CAT004	ITM027	5+5+25	25	5	5	32	80	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		17.1	20		\N	\N	\N	\N
1590	CID721	CAT004	ITM028	5+5+38	38	5	5	32	80	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		31.2	20		\N	\N	\N	\N
1591	CID1024	CAT004	ITM027	7+7+27	27	7	7	21	52	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		17.3	0		\N	\N	\N	\N
1592	CID1024	CAT004	ITM028	9+9+34	34	9	9	22	55	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		29.1	0		\N	\N	\N	\N
1593	CID1024	CAT004	ITM029	11+11+40	40	11	11	30	75	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		56.7	0		\N	\N	\N	\N
1594	CID169	CAT010	ITM046	8+8+26	26	8	8	9	22	0	0	0	HDPE	MAS001	FALSE	Kg.	3	5R/Bag	None		0	0		\N	\N	\N	\N
1595	CID912	CAT004	ITM027	6+6+25	25	6	6	40	100	0	0	0	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
1596	CID1025	CAT003	ITM020	8+8+30	30	8	8	20	50	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		23.4	30		\N	\N	\N	\N
1597	CID1002	CAT003	ITM020	10+10+32	32	10	10	17	42	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		22.2	0		\N	\N	\N	\N
1598	CID779	CAT008	ITM067	16	16	0	0	8	40	0	28	28	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		3.6	0		\N	\N	\N	\N
1599	CID789	CAT008	ITM056	55	55	0	0	27	135	36	91.44	91.44	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		135.8	0	Double Sealing	\N	\N	\N	\N
1600	CID617	CAT007	ITM040	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	.200K/P x 25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1601	CID617	CAT007	ITM041	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	.200K/P x 25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1602	CID617	CAT007	ITM042	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	.200K/P x 25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1603	CID617	CAT007	ITM043	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	.200K/P x 25P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1604	CID1026	CAT004	ITM027	5+5+27	27	5	5	25	62	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		18.6	20		\N	\N	\N	\N
1605	CID1026	CAT004	ITM028	8+8+31	31	8	8	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		29.6	20		\N	\N	\N	\N
1606	CID1026	CAT004	ITM029	10+10+42	42	10	10	25	62	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		54.7	20		\N	\N	\N	\N
1607	CID1026	CAT004	ITM030	12+12+50	50	12	12	30	75	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		90.2	20		\N	\N	\N	\N
1608	CID427	CAT004	ITM028	8+8+36	36	8	8	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		32.8	20		\N	\N	\N	\N
1609	CID506	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS082	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
1610	CID882	CAT003	ITM021	10+10+32	32	10	10	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		25.4	30		\N	\N	\N	\N
1611	CID882	CAT003	ITM022	12+12+42	42	12	12	18	45	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		42.2	30		\N	\N	\N	\N
1612	CID882	CAT003	ITM023	52+14+14	52	14	14	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		65	30		\N	\N	\N	\N
1613	CID1027	CAT004	ITM027	10+10+36	36	10	10	35	87	18	45.72	45.72	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		44.5	20		\N	\N	\N	\N
1614	CID1027	CAT004	ITM028	10+10+39	39	10	10	35	87	22	55.88	55.88	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		57.4	20		\N	\N	\N	\N
1615	CID1027	CAT004	ITM029	13+13+49	49	13	13	35	87	26	66.04	66.04	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		86.2	20		\N	\N	\N	\N
1616	CID400	CAT007	ITM055	42	42	0	0	13	65	26	66.04	66.04	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		36.1	0		\N	\N	\N	\N
1617	CID360	CAT005	ITM033	9+9+32	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	5 Roll	0.9	5R/Bag	None	Modern Plastic Bag Factory	11	0		\N	\N	\N	\N
1618	CID354	CAT010	ITM046	35	35	0	0	14	70	0	0	0	HDPE	MAS083	TRUE	Roll	45	45Kg/Roll	None	Plain	0	0	One Side Open	\N	\N	\N	\N
1619	CID789	CAT008	ITM057	47	47	0	0	27	135	30	76.2	76.2	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		96.7	0	Double bottom seal	\N	\N	\N	\N
1620	CID789	CAT008	ITM058	55	55	0	0	13	65	36	91.44	91.44	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		65.4	0		\N	\N	\N	\N
1621	CID569	CAT003	ITM019	7+7+27	27	7	7	18	45	18	45.72	45.72	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		16.9	30		\N	\N	\N	\N
1622	CID137	CAT007	ITM040	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	4	.20G/P x 20P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1623	CID144	CAT004	ITM028	8+8+40	40	8	8	35	87	20	50.8	50.8	LLDPE	MAS084	TRUE	Kg.	1	20K/Bag	Banana		49.5	20		\N	\N	\N	\N
1624	CID751	CAT003	ITM021	43+12+12	43	12	12	16	40	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		35.4	0		\N	\N	\N	\N
1625	CID751	CAT003	ITM022	53+15+15	53	15	15	16	40	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		54	0		\N	\N	\N	\N
1626	CID789	CAT008	ITM059	51	51	0	0	13	65	34	86.36	86.36	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		57.3	0		\N	\N	\N	\N
1627	CID789	CAT008	ITM067	49	49	0	0	9	45	22	55.88	55.88	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		24.6	0		\N	\N	\N	\N
1628	CID789	CAT008	ITM071	36	36	0	0	9	45	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		19.8	0		\N	\N	\N	\N
1629	CID1028	CAT004	ITM027	7+7+28	28	7	7	28	70	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		26.9	20		\N	\N	\N	\N
1630	CID1028	CAT004	ITM028	7+7+34	34	7	7	32	80	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		42.9	20		\N	\N	\N	\N
1631	CID1028	CAT004	ITM029	10+10+45	45	10	10	36	90	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		71.3	20		\N	\N	\N	\N
1632	CID169	CAT003	ITM022	11+11+39	39	11	11	17	42	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
1633	CID1033	CAT004	ITM029	11+11+46	46	11	11	30	75	0	66	66	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		67.3	20		\N	\N	\N	\N
1634	CID1029	CAT004	ITM026	18	18	0	0	10	50	10	25.4	25.4	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		4.6	20		\N	\N	\N	\N
1635	CID1029	CAT004	ITM027	4.5+4.5+22	22	4.5	4.5	20	50	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		11	20		\N	\N	\N	\N
1636	CID1011	CAT004	ITM027	10+10+30	30	10	10	25	62	18	45.72	45.72	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		28.3	20		\N	\N	\N	\N
1637	CID137	CAT007	ITM041	0	0	0	0	0	0	0	0	0	LLDPE	MAS001	FALSE	Box	4	.200K/P x 20P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1638	CID137	CAT007	ITM042	0	0	0	0	0	0	0	0	0	LLDPE	MAS001	FALSE	Box	4	.200K/P x 20P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1639	CID137	CAT007	ITM043	0	0	0	0	0	0	0	0	0	LLDPE	MAS001	FALSE	Box	4	.200K/P x 20P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1640	CID137	CAT007	ITM054	0	0	0	0	0	0	0	0	0	LLDPE	MAS001	FALSE	Box	4	.200K/P x 20P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1641	CID593	CAT004	ITM028	8+8+36	36	8	8	40	100	18	45.72	45.72	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		47.5	20		\N	\N	\N	\N
1642	CID004	CAT001	ITM083	70+25+25	70	25	25	12	30	0	130	130	Regrind	MAS004	FALSE	Packet	2	10P/Bag	None	Plain	93.6	0		\N	\N	\N	\N
1643	CID949	CAT008	ITM058	15+15+50	50	15	15	22	55	0	70	70	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		61.6	0		\N	\N	\N	\N
1644	CID949	CAT008	ITM059	25	25	0	0	25	125	0	36	36	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		22.5	0		\N	\N	\N	\N
1645	CID949	CAT008	ITM067	25	25	0	0	15	75	0	48	48	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		18	0		\N	\N	\N	\N
1646	CID949	CAT008	ITM071	31	31	0	0	15	75	0	42	42	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		19.5	0		\N	\N	\N	\N
1647	CID1030	CAT004	ITM028	7+7+30	30	7	7	35	87	16	40.64	40.64	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		31.1	20		\N	\N	\N	\N
1648	CID1030	CAT004	ITM021	8+8+50	50	8	8	35	87	24	60.96	60.96	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		70	20		\N	\N	\N	\N
1649	CID705	CAT004	ITM028	9+9+40	40	9	9	30	75	20	50.8	50.8	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		44.2	20		\N	\N	\N	\N
1650	CID476	CAT008	ITM043	31	31	0	0	12	60	22	55.88	55.88	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		20.8	0		\N	\N	\N	\N
1651	CID1031	CAT006	ITM039	45	45	0	0	5	25	14	110	110	HDPE	MAS069	TRUE	Kg.	1	1K/R x 20R/Bag	None	Plain	24.8	0		\N	\N	\N	\N
1652	CID972	CAT003	ITM020	11+11+32	32	11	11	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		21.9	30		\N	\N	\N	\N
1653	CID972	CAT008	ITM057	50	50	0	0	20	100	36	91.44	91.44	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		91.4	0		\N	\N	\N	\N
1654	CID320	CAT003	ITM018	6+6+21	21	6	6	10	25	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		5.9	0		\N	\N	\N	\N
1655	CID025	CAT001	ITM083	26+26+70	70	26	26	18	45	0	125	125	Regrind	MAS003	FALSE	Packet	6.5	50Pcs/P x 3P/Bag	None	Plain	137.3	0		\N	\N	\N	\N
1656	CID1032	CAT003	ITM018	7+7+23	23	7	7	13	32	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		8.4	30		\N	\N	\N	\N
1657	CID1032	CAT003	ITM019	9+9+28	28	9	9	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.6	30		\N	\N	\N	\N
1658	CID1032	CAT003	ITM020	10+10+32	32	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		19.5	30		\N	\N	\N	\N
1659	CID503	CAT005	ITM033	0	0	0	0	4	20	20	110	110	HDPE	MAS005	TRUE	7 Roll	1	7R/P x 20P/Bag	None	Ramez Group	0	0		\N	\N	\N	\N
1660	CID648	CAT006	ITM038	60	60	0	0	6	30	22	90	90	HDPE	MAS001	TRUE	Roll	1	20K/Bag	None	Plain	32.4	0		\N	\N	\N	\N
1661	CID870	CAT003	ITM022	15+15+44	44	15	15	30	75	28	71.12	71.12	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		78.9	30		\N	\N	\N	\N
1662	CID307	CAT009	ITM045	40	40	0	0	12	60	0	45	45	LLDPE	MAS010	FALSE	Box	15	10P/Bag	None		21.6	0		\N	\N	\N	\N
1663	CID453	CAT003	ITM023	18+18+67	67	18	18	18	45	36	91.44	91.44	HDPE	MAS084	TRUE	Kg.	1	20K/Bag	T-Shirt		84.8	30		\N	\N	\N	\N
1664	CID754	CAT001	ITM003	8+8+31	31	8	8	6	15	0	55	55	Regrind	MAS003	FALSE	Packet	1	10P/Bag	None	Plain	7.8	0		\N	\N	\N	\N
1665	CID754	CAT001	ITM004	10+10+47	47	10	10	12	30	0	70	70	LLDPE	MAS003	FALSE	Packet	1	20K/Bag	None	Plain	28.1	0		\N	\N	\N	\N
1666	CID754	CAT001	ITM006	19+19+52	52	19	19	12	30	0	100	100	LLDPE	MAS003	FALSE	Packet	1	20K/Bag	None	Plain	54	0		\N	\N	\N	\N
1667	CID885	CAT004	ITM029	12+12+40	40	12	12	35	87	26	66.04	66.04	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		73.5	20		\N	\N	\N	\N
1668	CID624	CAT004	ITM028	40+7+7	40	7	7	30	75	18	45.72	45.72	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		37	20		\N	\N	\N	\N
1669	CID972	CAT008	ITM058	35	35	0	0	18	90	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		38.4	0		\N	\N	\N	\N
1670	CID730	CAT003	ITM020	10+10+30	30	10	10	17	42	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.3	30		\N	\N	\N	\N
1671	CID730	CAT003	ITM022	12+12+40	40	12	12	17	42	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		38.2	30		\N	\N	\N	\N
1672	CID978	CAT012	ITM049	5+5+23	23	5	5	50	125	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		37.7	20		\N	\N	\N	\N
1673	CID978	CAT004	ITM051	5+5+24	24	5	5	50	125	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		47.5	20		\N	\N	\N	\N
1674	CID1033	CAT004	ITM028	6+6+36	36	6	6	24	60	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		23.4	20		\N	\N	\N	\N
1675	CID1033	CAT004	ITM030	8+8+41	41	8	8	28	70	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		44.6	20		\N	\N	\N	\N
1676	CID082	CAT003	ITM020	10+10+35	35	10	10	17	42	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		25.8	30		\N	\N	\N	\N
1677	CID082	CAT003	ITM021	13+13+40	40	13	13	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		36.2	30		\N	\N	\N	\N
1678	CID082	CAT003	ITM022	13+13+45	45	13	13	20	50	30	76.2	76.2	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		54.1	30		\N	\N	\N	\N
1679	CID1020	CAT004	ITM027	21	21	0	0	15	75	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.6	20		\N	\N	\N	\N
1680	CID195	CAT003	ITM020	10+10+32	32	10	10	18	45	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
1681	CID789	CAT008	ITM072	55	55	0	0	12	60	36	91.44	91.44	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		60.4	0		\N	\N	\N	\N
1682	CID617	CAT007	ITM054	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	5Kg/Box	None	Plain	0	0		\N	\N	\N	\N
1683	CID341	CAT009	ITM045	46	46	0	0	30	150	26	66.04	66.04	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		91.1	0		\N	\N	\N	\N
1684	CID526	CAT004	ITM027	25	25	0	0	17	85	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		15.1	20		\N	\N	\N	\N
1685	CID1035	CAT004	ITM028	33+6+6	33	6	6	30	75	20	50.8	50.8	LLDPE	MAS084	TRUE	Kg.	1	20K/Bag	Banana		34.3	20		\N	\N	\N	\N
1686	CID275	CAT004	ITM028	6+6+36	36	6	6	35	87	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		42.4	20		\N	\N	\N	\N
1687	CID1036	CAT004	ITM027	4+4+21	21	4	4	40	100	12	30.48	30.48	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.7	20		\N	\N	\N	\N
1688	CID1036	CAT004	ITM028	7+7+32	32	7	7	40	100	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		42.1	20		\N	\N	\N	\N
1689	CID803	CAT003	ITM021	13+13+39	39	13	13	16	40	20	50.8	50.8	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		26.4	30		\N	\N	\N	\N
1690	CID002	CAT008	ITM056	65	65	0	0	11	55	22	168	168	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		120.1	0		\N	\N	\N	\N
1691	CID1033	CAT004	ITM027	33	33	0	0	15	75	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		17.6	20		\N	\N	\N	\N
1692	CID1033	CAT004	ITM029	8+8+39	39	8	8	30	75	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		37.7	0		\N	\N	\N	\N
1693	CID1033	CAT004	ITM031	11+11+46	46	11	11	30	75	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		67.4	20		\N	\N	\N	\N
1694	CID1033	CAT004	ITM032	11+11+61	61	11	11	45	112	0	102	102	LLDPE	MAS007	FALSE	Kg.	1	20K/Bag	Banana		189.6	20		\N	\N	\N	\N
1695	CID1037	CAT003	ITM020	10+10+32	32	10	10	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.1	30		\N	\N	\N	\N
1696	CID1038	CAT003	ITM021	9+9+33	33	9	9	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		19.9	30		\N	\N	\N	\N
1697	CID1039	CAT003	ITM019	7+7+23	23	7	7	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		9.6	30		\N	\N	\N	\N
1698	CID1039	CAT003	ITM021	10+10+33	33	10	10	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		20.7	30		\N	\N	\N	\N
1699	CID1039	CAT003	ITM022	10+10+46	46	10	10	17	42	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		45.1	30		\N	\N	\N	\N
1700	CID1040	CAT004	ITM028	6+6+30	30	6	6	38	95	16	40.64	40.64	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		32.4	20		\N	\N	\N	\N
1701	CID1040	CAT004	ITM029	6+6+40	40	6	6	38	95	20	50.8	50.8	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		50.2	20		\N	\N	\N	\N
1702	CID1040	CAT004	ITM030	8+8+52	52	8	8	40	100	24	60.96	60.96	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		82.9	20		\N	\N	\N	\N
1703	CID925	CAT004	ITM028	30	30	0	0	16	80	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		19.5	20		\N	\N	\N	\N
1704	CID925	CAT004	ITM029	8+8+40	40	8	8	30	75	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		42.7	20		\N	\N	\N	\N
1705	CID169	CAT008	ITM044	20	20	0	0	9	45	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		6.4	0		\N	\N	\N	\N
1706	CID1041	CAT003	ITM019	10+10+29	29	10	10	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		16.6	30		\N	\N	\N	\N
1707	CID1041	CAT005	ITM033	0	0	0	0	4	20	20	50.8	50.8	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None		0	0		\N	\N	\N	\N
1708	CID1042	CAT003	ITM019	8+8+23	23	8	8	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		11.1	30		\N	\N	\N	\N
1709	CID1042	CAT003	ITM020	10+10+32	32	10	10	14	35	20	50.8	50.8	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	T-Shirt		18.5	30		\N	\N	\N	\N
1710	CID1042	CAT003	ITM022	13+13+46	46	13	13	15	37	28	71.12	71.12	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	T-Shirt		37.9	30		\N	\N	\N	\N
1711	CID1042	CAT003	ITM023	12+12+50	50	12	12	15	37	36	91.44	91.44	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		50.1	30		\N	\N	\N	\N
1712	CID1043	CAT004	ITM029	10+10+45	45	10	10	26	65	22	55.88	55.88	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		47.2	20		\N	\N	\N	\N
1713	CID1043	CAT004	ITM030	10+10+50	50	10	10	26	65	28	71.12	71.12	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		64.7	20		\N	\N	\N	\N
1714	CID1044	CAT008	ITM044	15	15	0	0	12	60	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		4.6	0		\N	\N	\N	\N
1715	CID1044	CAT008	ITM056	32	32	0	0	15	75	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		21.9	0		\N	\N	\N	\N
1716	CID507	CAT004	ITM028	53	53	0	0	13	65	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		24.5	20	Top Folding - 9.5 Cm	\N	\N	\N	\N
1717	CID1045	CAT004	ITM027	8+8+30	30	8	8	22	55	16	40.64	40.64	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		20.6	20		\N	\N	\N	\N
1718	CID1045	CAT004	ITM028	10+10+40	40	10	10	23	57	20	50.8	50.8	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		34.7	20		\N	\N	\N	\N
1719	CID1045	CAT004	ITM029	12+12+50	50	12	12	24	60	22	55.88	55.88	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		49.6	20		\N	\N	\N	\N
1720	CID485	CAT008	ITM044	20	20	0	0	24	120	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		14.6	0		\N	\N	\N	\N
1721	CID1046	CAT003	ITM021	14+14+40	40	14	14	15	37	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		33.2	30		\N	\N	\N	\N
1722	CID1046	CAT003	ITM023	15+15+47	47	15	15	17	42	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		52.6	30		\N	\N	\N	\N
1723	CID1047	CAT012	ITM051	6+6+25	25	6	6	45	112	18	45.72	45.72	LLDPE	MAS025	TRUE	Kg.	1	20K/Bag	Banana		37.9	20		\N	\N	\N	\N
1724	CID1047	CAT012	ITM073	50	50	0	0	28	140	28	71.12	71.12	LLDPE	MAS025	TRUE	Kg.	1	20K/Bag	Banana		99.6	20		\N	\N	\N	\N
1725	CID976	CAT008	ITM058	20	20	0	0	16	80	0	30	30	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		9.6	0		\N	\N	\N	\N
1726	CID976	CAT008	ITM059	26	26	0	0	16	80	0	40	40	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		16.6	0		\N	\N	\N	\N
1727	CID976	CAT008	ITM067	30	30	0	0	16	80	0	53	53	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		25.4	0		\N	\N	\N	\N
1728	CID896	CAT003	ITM020	10+10+31	31	10	10	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		18.1	30		\N	\N	\N	\N
1729	CID886	CAT003	ITM023	14+14+50	50	14	14	22	55	36	91.44	91.44	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		78.5	30		\N	\N	\N	\N
1730	CID1034	CAT003	ITM022	12+12+37	37	12	12	19	47	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		35	30		\N	\N	\N	\N
1731	CID1048	CAT001	ITM005	12+12+38	38	12	12	13	32	28	71.12	71.12	HDPE	MAS008	TRUE	Packet	1.3	50Pcs/P x 10P/Bag	None	Plain	28.2	0		\N	\N	\N	\N
1732	CID1049	CAT004	ITM027	25	25	0	0	8	40	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		7.1	20		\N	\N	\N	\N
1733	CID1049	CAT003	ITM020	10+10+30	30	10	10	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		20.3	30		\N	\N	\N	\N
1734	CID1049	CAT003	ITM022	12+12+45	45	12	12	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		56.1	30		\N	\N	\N	\N
1735	CID1050	CAT004	ITM029	8+8+40	40	8	8	40	100	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		62.6	20		\N	\N	\N	\N
1736	CID1051	CAT004	ITM028	8+8+33	33	8	8	30	75	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		33.6	20		\N	\N	\N	\N
1737	CID717	CAT004	ITM027	25	25	0	0	13	65	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.9	20		\N	\N	\N	\N
1738	CID1052	CAT003	ITM019	8+8+26	26	8	8	14	35	18	45.72	45.72	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	T-Shirt		13.4	30		\N	\N	\N	\N
1739	CID680	CAT004	ITM028	45	45	0	0	14	70	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		32	20		\N	\N	\N	\N
1740	CID1053	CAT004	ITM027	6+6+26	26	6	6	43	107	14	35.56	35.56	LLDPE	MAS061	TRUE	Kg.	1	20K/Bag	Banana		28.9	20		\N	\N	\N	\N
1741	CID1054	CAT003	ITM023	12+12+41	41	12	12	21	52	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		54.9	30		\N	\N	\N	\N
1742	CID296	CAT008	ITM056	28	28	0	0	9	45	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		11.5	0		\N	\N	\N	\N
1743	CID842	CAT004	ITM028	9+9+41	41	9	9	40	100	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		59.9	20		\N	\N	\N	\N
1744	CID800	CAT003	ITM019	7+7+25	25	7	7	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		11.4	30		\N	\N	\N	\N
1745	CID800	CAT003	ITM020	10+10+32	32	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		19.5	30		\N	\N	\N	\N
1746	CID1055	CAT003	ITM019	6+6+21	21	6	6	15	37	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		9.9	30		\N	\N	\N	\N
1747	CID1055	CAT003	ITM020	7+7+26	26	7	7	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		13.5	30		\N	\N	\N	\N
1748	CID1055	CAT003	ITM021	10+10+30	30	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		22.6	30		\N	\N	\N	\N
1749	CID1056	CAT003	ITM020	10+10+30	30	10	10	20	50	20	50	50	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		25	30		\N	\N	\N	\N
1750	CID1056	CAT003	ITM022	10+10+40	40	10	10	20	50	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		42.7	30		\N	\N	\N	\N
1751	CID1057	CAT004	ITM028	7+7+36	36	7	7	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		31.5	20		\N	\N	\N	\N
1752	CID1057	CAT003	ITM023	12+12+50	50	12	12	0	0	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
1753	CID754	CAT001	ITM003	11+11+28	28	11	11	4	10	0	58	58	HDPE	MAS003	FALSE	Packet	1	20K/Bag	None	Plain	5.8	0		\N	\N	\N	\N
1754	CID1058	CAT010	ITM044	55	55	0	0	25	125	36	91.44	91.44	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		125.7	0		\N	\N	\N	\N
1755	CID723	CAT004	ITM030	15+15+41	41	15	15	28	70	22	55.88	55.88	HDPE	MAS065	TRUE	Kg.	1	20K/Bag	Banana		55.5	20		\N	\N	\N	\N
1756	CID1044	CAT008	ITM057	26	26	0	0	12	60	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		11.1	0		\N	\N	\N	\N
1757	CID038	CAT002	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS085	FALSE	Roll	0.8	10R/Bag	None	Ahmad Saad (Busaad Plastic)	0	0		\N	\N	\N	\N
1758	CID038	CAT002	ITM013	0	0	0	0	0	0	0	0	0	HDPE	MAS038	FALSE	Roll	0.8	10R/Bag	None	Ahmad Saad (Busaad Plastic)	0	0		\N	\N	\N	\N
1759	CID038	CAT005	ITM033	9+9+32	32	9	9	5	12	0	110	110	HDPE	MAS004	FALSE	6 Roll	0.9	.9R/P x 10P	None	Ahmad Saad (Busaad Plastic)	13.2	0		\N	\N	\N	\N
1760	CID038	CAT005	ITM034	13+13+34	34	13	13	7	17	20	120	120	HDPE	MAS005	TRUE	Roll	0.8	10R/Bag	None	Ahmad Saad (Busaad Plastic)	24.5	0		\N	\N	\N	\N
1761	CID241	CAT002	ITM017	0	0	0	0	13	65	0	100	100	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1762	CID1042	CAT003	ITM021	10+10+32	32	10	10	15	37	24	60.96	60.96	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		23.5	30		\N	\N	\N	\N
1763	CID1042	CAT008	ITM044	19	19	0	0	10	50	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		5.8	0		\N	\N	\N	\N
1764	CID1042	CAT008	ITM056	20	20	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.1	0		\N	\N	\N	\N
1765	CID1042	CAT008	ITM057	26	26	0	0	10	50	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		10.6	0		\N	\N	\N	\N
1766	CID887	CAT003	ITM019	8+8+25	25	8	8	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		15	0		\N	\N	\N	\N
1767	CID887	CAT003	ITM021	10+10+32	32	10	10	20	50	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		31.7	0		\N	\N	\N	\N
1768	CID1005	CAT008	ITM044	16	16	0	0	20	100	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9.8	0		\N	\N	\N	\N
1769	CID1005	CAT008	ITM056	21	21	0	0	20	100	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		14.9	0		\N	\N	\N	\N
1823	CID1067	CAT003	ITM022	0	0	0	0	0	0	0	0	0	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1770	CID887	CAT003	ITM022	11+11+41	41	11	11	22	55	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		49.3	30		\N	\N	\N	\N
1771	CID896	CAT003	ITM019	7+7+21	21	7	7	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		10	30		\N	\N	\N	\N
1772	CID1059	CAT004	ITM026	6+6+18	18	6	6	20	50	12	30.48	30.48	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.1	20		\N	\N	\N	\N
1773	CID1059	CAT003	ITM019	8+8+26	26	8	8	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		11.9	30		\N	\N	\N	\N
1774	CID1059	CAT003	ITM020	10+10+30	30	10	10	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		17.8	30		\N	\N	\N	\N
1775	CID1060	CAT004	ITM028	7+7+35	35	7	7	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		30.9	20		\N	\N	\N	\N
1776	CID1060	CAT004	ITM029	10+10+35	35	10	10	25	62	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		41.6	20		\N	\N	\N	\N
1777	CID1060	CAT004	ITM030	8+8+45	45	8	8	25	62	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		53.8	20		\N	\N	\N	\N
1778	CID1060	CAT003	ITM023	51+14+14	51	14	14	16	40	36	91.44	91.44	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		57.8	30		\N	\N	\N	\N
1779	CID1044	CAT008	ITM058	21	21	0	0	12	60	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.7	0		\N	\N	\N	\N
1780	CID1044	CAT003	ITM019	8+8+25	25	8	8	15	37	16	40.64	40.64	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		12.3	30		\N	\N	\N	\N
1781	CID1044	CAT003	ITM020	10+10+30	30	10	10	15	37	20	50.8	50.8	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		18.8	30		\N	\N	\N	\N
1782	CID1044	CAT003	ITM021	13+13+40	40	13	13	17	42	26	66.04	66.04	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		36.6	30		\N	\N	\N	\N
1783	CID1061	CAT003	ITM020	7+7+29	29	7	7	17	42	18	45.72	45.72	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt		16.5	30		\N	\N	\N	\N
1784	CID1061	CAT003	ITM021	10+10+35	35	10	10	17	42	24	60.96	60.96	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt		28.2	30		\N	\N	\N	\N
1785	CID1061	CAT006	ITM035	52	52	0	0	4	20	0	110	110	HDPE	MAS010	TRUE	Roll	1	20K/Bag	None		22.9	0		\N	\N	\N	\N
1786	CID038	CAT005	ITM034	13+13+34	34	13	13	7	17	0	120	120	HDPE	MAS010	TRUE	Roll	0.8	10R/Bag	None	Ahmad Saad (Busaad Plastic)	24.5	0		\N	\N	\N	\N
1787	CID038	CAT005	ITM034	13+13+34	34	13	13	7	17	0	120	120	HDPE	MAS004	FALSE	Roll	0.8	10R/Bag	None	Ahmad Saad (Busaad Plastic)	24.5	0		\N	\N	\N	\N
1788	CID978	CAT012	ITM052	5+5+30	30	5	5	60	150	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		73.2	20		\N	\N	\N	\N
1789	CID137	CAT007	ITM055	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	4	20K/Bag	None	Plain	0	0		\N	\N	\N	\N
1790	CID842	CAT004	ITM029	9+9+45	45	9	9	40	100	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		76.8	0		\N	\N	\N	\N
1791	CID135	CAT004	ITM032	15+15+60	60	15	15	35	87	36	91.44	91.44	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		143.2	20		\N	\N	\N	\N
1792	CID1011	CAT004	ITM031	15+15+64	64	15	15	30	75	36	91.44	91.44	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		128.9	20		\N	\N	\N	\N
1793	CID1062	CAT010	ITM046	15+15+98	98	15	15	25	62	0	93	93	HDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		147.6	0		\N	\N	\N	\N
1794	CID847	CAT003	ITM021	10+10+32	32	10	10	15	37	0	60	60	HDPE	MAS041	FALSE	Kg.	1	20K/Bag	T-Shirt		23.1	30		\N	\N	\N	\N
1795	CID435	CAT003	ITM018	6+6+21	21	6	6	11	27	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		6.3	30		\N	\N	\N	\N
1796	CID435	CAT003	ITM019	7+7+27	27	7	7	11	27	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		10.1	30		\N	\N	\N	\N
1797	CID435	CAT003	ITM020	10+10+32	32	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		15.8	30		\N	\N	\N	\N
1798	CID1051	CAT004	ITM029	7+7+43	43	7	7	30	75	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		47.8	20		\N	\N	\N	\N
1799	CID326	CAT003	ITM021	13+13+32	32	13	13	16	40	22	55.88	55.88	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		25.9	0		\N	\N	\N	\N
1800	CID224	CAT003	ITM019	7+7+25	25	7	7	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		10.1	30		\N	\N	\N	\N
1801	CID224	CAT003	ITM020	10+10+31	31	10	10	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		16.6	30		\N	\N	\N	\N
1802	CID224	CAT003	ITM021	12+12+35	35	12	12	16	40	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		26.4	30		\N	\N	\N	\N
1803	CID093	CAT006	ITM035	43	43	0	0	6	30	14	98	98	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None	Plain	25.3	0		\N	\N	\N	\N
1804	CID1063	CAT003	ITM019	6+6+23	23	6	6	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		8.5	30		\N	\N	\N	\N
1805	CID1063	CAT003	ITM020	8+8+26	26	8	8	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		14.2	30		\N	\N	\N	\N
1806	CID1063	CAT003	ITM021	12+12+34	34	12	12	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		21.8	30		\N	\N	\N	\N
1807	CID1063	CAT003	ITM022	9+9+32	32	9	9	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		22.6	30		\N	\N	\N	\N
1808	CID1064	CAT004	ITM029	5+5+35	35	5	5	45	112	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		46.1	20		\N	\N	\N	\N
1809	CID1064	CAT004	ITM030	5+5+50	50	5	5	50	125	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		106.7	20		\N	\N	\N	\N
1810	CID1064	CAT004	ITM031	5+5+60	60	5	5	50	125	34	86.36	86.36	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		151.1	20		\N	\N	\N	\N
1811	CID1065	CAT004	ITM029	7+7+40	40	7	7	42	105	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		69.1	20		\N	\N	\N	\N
1812	CID1015	CAT004	ITM031	20+20+60	60	20	20	35	87	39	100	100	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		174	20		\N	\N	\N	\N
1813	CID754	CAT002	ITM014	0	0	0	0	14	70	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1814	CID972	CAT008	ITM059	20	20	0	0	14	70	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		8.5	0		\N	\N	\N	\N
1815	CID1066	CAT005	ITM033	9+9+32	32	9	9	4	10	0	110	110	HDPE	MAS004	FALSE	5 Roll	0.8	5R/Bag	None	Luluat	11	0		\N	\N	\N	\N
1816	CID617	CAT005	ITM033	0	0	0	0	4	20	0	0	0	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1817	CID649	CAT005	ITM033	0	0	0	0	4	20	0	0	0	HDPE	MAS004	TRUE	5 Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1818	CID720	CAT001	ITM005	13+13+40	40	13	13	15	37	18	90	90	LLDPE	MAS041	TRUE	Kg.	1	25Pcs/P	None		44	0		\N	\N	\N	\N
1819	CID754	CAT007	ITM055	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Roll	50	20K/Bag	None		0	0		\N	\N	\N	\N
1820	CID754	CAT001	ITM007	17+17+50	50	17	17	14	35	0	98	98	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		57.6	0		\N	\N	\N	\N
1821	CID1067	CAT003	ITM020	9+9+31	31	9	9	15	37	0	0	0	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1824	CID1068	CAT004	ITM028	9+9+31	31	9	9	30	75	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		33.6	20		\N	\N	\N	\N
1825	CID1068	CAT004	ITM029	11+11+50	50	11	11	30	75	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		65.8	20		\N	\N	\N	\N
1826	CID1068	CAT004	ITM030	13+13+57	57	13	13	30	75	32	81.28	81.28	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		101.2	20		\N	\N	\N	\N
1827	CID900	CAT004	ITM026	5+5+23	23	5	5	36	90	14	35.56	35.56	LLDPE	MAS025	TRUE	Kg.	1	20K/Bag	Banana		21.1	20		\N	\N	\N	\N
1828	CID978	CAT012	ITM099	45	45	0	0	15	75	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		41.1	20		\N	\N	\N	\N
1829	CID789	CAT008	ITM074	51	51	0	0	13	65	39	200	200	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		132.6	0		\N	\N	\N	\N
1830	CID972	CAT008	ITM067	20	20	0	0	14	70	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		10	0		\N	\N	\N	\N
1831	CID972	CAT003	ITM018	8+8+26	26	8	8	16	40	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		13.7	30		\N	\N	\N	\N
1832	CID1069	CAT003	ITM019	7.5+7.5+24	24	7.5	7.5	15	37	16	40.64	40.64	HDPE	MAS029	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		11.7	30		\N	\N	\N	\N
1833	CID1069	CAT003	ITM020	8.5+8.5+28	28	8.5	8.5	15	37	18	45.72	45.72	HDPE	MAS029	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		15.2	30		\N	\N	\N	\N
1834	CID1033	CAT003	ITM024	15+15+61	61	15	15	28	70	0	106	106	HDPE	MAS005	FALSE	Kg.	1	20K/Bag	T-Shirt		135	30		\N	\N	\N	\N
1835	CID1033	CAT003	ITM023	13+13+51	51	13	13	28	70	0	87	87	HDPE	MAS008	FALSE	Kg.	1	20K/Bag	T-Shirt		93.8	30		\N	\N	\N	\N
1836	CID1070	CAT004	ITM027	5+5+23	23	5	5	30	75	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.6	20		\N	\N	\N	\N
1837	CID1046	CAT003	ITM019	7+7+24	24	7	7	15	37	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		11.4	30		\N	\N	\N	\N
1838	CID1046	CAT003	ITM020	9+9+30	30	9	9	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		18	30		\N	\N	\N	\N
1839	CID1046	CAT003	ITM024	13+13+55	55	13	13	15	37	39	99.06	99.06	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		59.4	30		\N	\N	\N	\N
1840	CID1071	CAT003	ITM020	10+10+30	30	10	10	0	0	20	50.8	50.8	HDPE	MAS050	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
1841	CID1071	CAT003	ITM021	10+10+30	30	10	10	0	0	24	60.96	60.96	HDPE	MAS050	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
1842	CID1071	CAT003	ITM022	12+12+35	35	12	12	0	0	26	66.04	66.04	HDPE	MAS050	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
1843	CID1050	CAT004	ITM027	4+4+20	20	4	4	34	85	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		14.5	20		\N	\N	\N	\N
1844	CID980	CAT008	ITM056	35	35	0	0	20	100	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		42.7	0		\N	\N	\N	\N
1845	CID980	CAT008	ITM057	44	44	0	0	23	115	34	86.36	86.36	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		87.4	0		\N	\N	\N	\N
1846	CID339	CAT004	ITM026	5+5+20	20	5	5	22	55	14	35.56	35.56	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		11.7	20		\N	\N	\N	\N
1847	CID339	CAT003	ITM020	11+11+33	33	11	11	18	45	24	60.96	60.96	HDPE	MAS024	TRUE	Kg.	1	20K/Bag	T-Shirt		30.2	30		\N	\N	\N	\N
1848	CID239	CAT004	ITM027	21	21	0	0	11	55	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.4	20		\N	\N	\N	\N
1849	CID1072	CAT003	ITM020	9+9+30	30	9	9	18	45	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.9	30		\N	\N	\N	\N
1850	CID1073	CAT003	ITM020	9+9+30	30	9	9	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		18	30		\N	\N	\N	\N
1851	CID1073	CAT003	ITM021	13+13+37	37	13	13	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		28.4	30		\N	\N	\N	\N
1852	CID1074	CAT003	ITM019	9+9+26	26	9	9	17	42	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		15	30		\N	\N	\N	\N
1853	CID1074	CAT003	ITM020	9+9+30	30	9	9	17	42	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		20.5	30		\N	\N	\N	\N
1854	CID1074	CAT003	ITM021	10+10+32	32	10	10	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		26.6	30		\N	\N	\N	\N
1855	CID561	CAT003	ITM020	9+9+30	30	9	9	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		19.5	30		\N	\N	\N	\N
1856	CID561	CAT003	ITM021	12+12+35	35	12	12	16	40	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		26.4	30		\N	\N	\N	\N
1857	CID1075	CAT008	ITM041	20	20	0	0	15	75	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.6	0		\N	\N	\N	\N
1858	CID1076	CAT008	ITM044	20	20	0	0	12	60	0	30	30	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		7.2	0		\N	\N	\N	\N
1859	CID1076	CAT008	ITM056	22	22	0	0	12	60	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9.4	0		\N	\N	\N	\N
1860	CID1077	CAT003	ITM020	8+8+28	28	8	8	14	35	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		15.6	30		\N	\N	\N	\N
1861	CID1077	CAT003	ITM021	9+9+32	32	9	9	20	50	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		30.5	30		\N	\N	\N	\N
1862	CID1077	CAT008	ITM044	40	40	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Roll	1	50Kg/Roll	None		0	0		\N	\N	\N	\N
1863	CID1077	CAT008	ITM056	10	10	0	0	8	40	8	20.32	20.32	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		1.6	0		\N	\N	\N	\N
1864	CID1077	CAT008	ITM057	10	10	0	0	8	40	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		2	0		\N	\N	\N	\N
1865	CID1077	CAT008	ITM058	14	14	0	0	8	40	8	20.32	20.32	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		2.3	0		\N	\N	\N	\N
1866	CID1077	CAT008	ITM059	25	25	0	0	8	40	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		10.2	0		\N	\N	\N	\N
1867	CID1077	CAT008	ITM067	25	25	0	0	8	40	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		8.1	0		\N	\N	\N	\N
1868	CID476	CAT002	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1869	CID476	CAT002	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1870	CID476	CAT002	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1871	CID476	CAT002	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1872	CID1029	CAT003	ITM019	8+8+26	26	8	8	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		12.3	30		\N	\N	\N	\N
1873	CID1078	CAT003	ITM018	7+7+22	22	7	7	11	27	14	35.56	35.56	HDPE	MAS052	TRUE	Kg.	1	20K/Bag	None		6.9	0		\N	\N	\N	\N
1874	CID1078	CAT003	ITM019	9+9+27	27	9	9	12	30	18	45.72	45.72	HDPE	MAS052	TRUE	Kg.	1	20K/Bag	None		12.3	0		\N	\N	\N	\N
1875	CID1078	CAT003	ITM022	12+12+42	42	12	12	18	45	28	71.12	71.12	HDPE	MAS052	TRUE	Kg.	1	20K/Bag	None		42.2	0		\N	\N	\N	\N
1876	CID1079	CAT009	ITM029	4+4+22	22	4	4	20	50	32	81.28	81.28	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		24.4	0		\N	\N	\N	\N
1877	CID396	CAT004	ITM027	30	30	0	0	10	50	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12.2	20		\N	\N	\N	\N
1878	CID396	CAT004	ITM028	35	35	0	0	10	50	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		16	20		\N	\N	\N	\N
1879	CID412	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1880	CID412	CAT002	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1881	CID412	CAT002	ITM013	0	0	0	0	0	0	0	0	0	HDPE	MAS038	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1882	CID974	CAT004	ITM028	10+10+31	31	10	10	30	75	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		38.9	20		\N	\N	\N	\N
1883	CID1080	CAT004	ITM028	7+7+30	30	7	7	40	100	16	40.64	40.64	LLDPE	MAS041	TRUE	Kg.	1	20K/Bag	None		35.8	0		\N	\N	\N	\N
1884	CID1099	CAT008	ITM044	13	13	0	0	9	45	0	46	46	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		5.4	0		\N	\N	\N	\N
1885	CID754	CAT004	ITM028	9+9+36	36	9	9	40	100	0	50	50	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		54	20		\N	\N	\N	\N
1886	CID742	CAT004	ITM032	19+19+70	70	19	19	35	87	39	99.06	99.06	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		186.2	20		\N	\N	\N	\N
1887	CID1081	CAT004	ITM027	5+5+22	22	5	5	11	27	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		7	20		\N	\N	\N	\N
1888	CID1081	CAT004	ITM028	8+8+30	30	8	8	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12	20		\N	\N	\N	\N
1889	CID1081	CAT004	ITM029	8+8+30	30	8	8	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		15	20		\N	\N	\N	\N
1890	CID1082	CAT004	ITM027	5+5+22	22	5	5	11	27	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		7	20		\N	\N	\N	\N
1891	CID1082	CAT004	ITM028	8+8+30	30	8	8	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12	20		\N	\N	\N	\N
1892	CID1082	CAT004	ITM029	8+8+30	30	8	8	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		15	20		\N	\N	\N	\N
1893	CID1083	CAT004	ITM027	5+5+22	22	5	5	11	27	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		7	20		\N	\N	\N	\N
1894	CID1083	CAT004	ITM028	8+8+30	30	8	8	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12	20		\N	\N	\N	\N
1895	CID1083	CAT004	ITM029	8+8+30	30	8	8	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		16.4	20		\N	\N	\N	\N
1896	CID741	CAT005	ITM033	9+9+32	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	5 Roll	0.8	5R/Bag	None	Manal	11	0		\N	\N	\N	\N
1897	CID1084	CAT004	ITM028	9+9+31	31	9	9	33	82	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		36.7	20		\N	\N	\N	\N
1898	CID404	CAT008	ITM044	13+13+50	50	13	13	30	75	0	144	144	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		164.2	0		\N	\N	\N	\N
1899	CID1085	CAT004	ITM027	25	25	0	0	10	50	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		8.9	20		\N	\N	\N	\N
1900	CID705	CAT004	ITM026	20	20	0	0	23	115	12	30.48	30.48	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		14	20		\N	\N	\N	\N
1901	CID1087	CAT004	ITM029	58	58	0	0	20	100	16	40.64	40.64	LLDPE	MAS024	TRUE	Kg.	1	20K/Bag	Banana	Modern Plastic Bag Factory	47.1	20		\N	\N	\N	\N
1902	CID412	CAT003	ITM019	7+7+25	25	7	7	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		10.7	30		\N	\N	\N	\N
1903	CID412	CAT003	ITM020	10+10+31	31	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		15.5	30		\N	\N	\N	\N
1904	CID412	CAT003	ITM021	10+10+33	33	10	10	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		22.6	30		\N	\N	\N	\N
1905	CID412	CAT003	ITM022	11+11+40	40	11	11	14	35	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		30.9	30		\N	\N	\N	\N
1906	CID1086	CAT003	ITM019	9+9+27	27	9	9	20	50	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		20.6	0		\N	\N	\N	\N
1907	CID1086	CAT003	ITM020	12+12+34	34	12	12	20	50	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		29.5	0		\N	\N	\N	\N
1908	CID1088	CAT009	ITM045	16	16	0	0	10	50	0	0	0	LLDPE	MAS024	FALSE	Roll	5	5Kg/Box	None	Plain	0	0		\N	\N	\N	\N
1909	CID1089	CAT003	ITM020	9+9+26	26	9	9	12	30	18	45.72	45.72	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	None		12.1	0		\N	\N	\N	\N
1910	CID1089	CAT003	ITM021	11+11+34	34	11	11	14	35	24	60.96	60.96	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	None		23.9	0		\N	\N	\N	\N
1911	CID1089	CAT003	ITM022	12+12+45	45	12	12	18	45	28	71.12	71.12	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	None		44.2	0		\N	\N	\N	\N
1912	CID851	CAT003	ITM020	7+7+26	26	7	7	13	32	18	45.72	45.72	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		11.7	30		\N	\N	\N	\N
1913	CID851	CAT003	ITM021	11+11+34	34	11	11	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		23.9	30		\N	\N	\N	\N
1914	CID411	CAT008	ITM067	30	30	0	0	8	40	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		8.5	0	Tray #22	\N	\N	\N	\N
1915	CID864	CAT012	ITM069	8+8+38	38	8	8	60	150	24	60.96	60.96	LLDPE	MAS048	TRUE	Kg.	1	20K/Bag	None		98.8	0		\N	\N	\N	\N
1916	CID136	CAT004	ITM031	12+12+50	50	12	12	30	75	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		78.9	0		\N	\N	\N	\N
1917	CID178	CAT003	ITM023	15+15+50	50	15	15	40	100	32	81.28	81.28	HDPE	MAS086	TRUE	Kg.	1	20K/Bag	T-Shirt		130	30		\N	\N	\N	\N
1918	CID423	CAT003	ITM022	13+13+44	44	13	13	18	45	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		51.2	30		\N	\N	\N	\N
1919	CID423	CAT008	ITM044	25	25	0	0	0	0	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1920	CID1090	CAT003	ITM019	7+7+26	26	7	7	20	50	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		18.3	0		\N	\N	\N	\N
1921	CID1090	CAT003	ITM021	10+10+33	33	10	10	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		29.1	0		\N	\N	\N	\N
1922	CID1090	CAT003	ITM022	18+18+40	40	18	18	18	45	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		48.6	0		\N	\N	\N	\N
1923	CID754	CAT001	ITM007	16+16+55	55	16	16	22	55	0	110	110	HDPE	MAS005	FALSE	Packet	2	10P/Bag	None	Plain	105.3	0		\N	\N	\N	\N
1924	CID844	CAT003	ITM021	12+12+35	35	12	12	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		23	30		\N	\N	\N	\N
1925	CID1091	CAT004	ITM028	5+5+32	32	5	5	40	100	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		38.4	0		\N	\N	\N	\N
1926	CID1092	CAT003	ITM019	8+8+24	24	8	8	20	50	16	40.64	40.64	HDPE	MAS052	TRUE	Kg.	1	20K/Bag	None		16.3	0		\N	\N	\N	\N
1927	CID1092	CAT003	ITM021	10+10+30	30	10	10	20	50	24	60.96	60.96	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		30.5	0		\N	\N	\N	\N
1928	CID1093	CAT003	ITM019	6+6+22	22	6	6	16	40	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		11.1	0		\N	\N	\N	\N
2501	CID513	CAT009	ITM058	0	0	0	0	0	0	0	0	0	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1929	CID1093	CAT003	ITM020	8+8+25	25	8	8	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		15	0		\N	\N	\N	\N
1930	CID1093	CAT003	ITM021	9+9+32	32	9	9	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		20.3	0		\N	\N	\N	\N
1931	CID1093	CAT003	ITM022	9+9+32	32	9	9	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		24.4	0		\N	\N	\N	\N
1932	CID1094	CAT003	ITM019	6+6+22	22	6	6	15	37	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		10.2	0		\N	\N	\N	\N
1933	CID1094	CAT003	ITM020	8+8+27	27	8	8	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		14.5	0		\N	\N	\N	\N
1934	CID1094	CAT003	ITM021	9+9+32	32	9	9	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		18.8	0		\N	\N	\N	\N
1935	CID1094	CAT003	ITM022	9+9+32	32	9	9	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		22.6	0		\N	\N	\N	\N
1936	CID161	CAT004	ITM028	7+7+40	40	7	7	24	60	20	50.8	50.8	HDPE	MAS087	TRUE	Kg.	1	20K/Bag	Banana		32.9	20		\N	\N	\N	\N
1937	CID626	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Roll	0.5	30R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1938	CID626	CAT002	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS077	FALSE	Roll	0.5	30R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1939	CID626	CAT002	ITM013	0	0	0	0	0	0	0	0	0	HDPE	MAS082	FALSE	Roll	0.5	30R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1940	CID626	CAT007	ITM040	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Packet	0.2	60P/Bag	None	Top World	0	0		\N	\N	\N	\N
1941	CID626	CAT007	ITM041	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Packet	0.2	60P/Bag	None	Top World	0	0		\N	\N	\N	\N
1942	CID626	CAT007	ITM042	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Packet	0.2	60P/Bag	None	Top World	0	0		\N	\N	\N	\N
1943	CID626	CAT007	ITM043	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Kg.	0.2	60P/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1944	CID754	CAT001	ITM004	38+13+13	38	13	13	8	20	0	70	70	HDPE	MAS006	FALSE	Box	4	10Pcs/P x 20P/Box	None	Plain	17.9	0		\N	\N	\N	\N
1945	CID678	CAT010	ITM062	18	18	0	0	8	40	14	35.56	35.56	HDPE	MAS088	TRUE	Roll	50	50K/Roll	None		5.1	0		\N	\N	\N	\N
1946	CID033	CAT010	ITM046	10	10	0	0	12	60	0	17	17	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		2	0		\N	\N	\N	\N
1947	CID033	CAT010	ITM062	56	56	0	0	12	60	32	81.28	81.28	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		54.6	0		\N	\N	\N	\N
1948	CID1084	CAT004	ITM029	11+11+50	50	11	11	30	75	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		65.8	20		\N	\N	\N	\N
1949	CID1095	CAT004	ITM028	8+8+35	35	8	8	38	95	18	45.72	45.72	LLDPE	MAS007	TRUE	Kg.	1	20K/Bag	Banana		44.3	20		\N	\N	\N	\N
1950	CID1060	CAT004	ITM027	8+8+28	28	8	8	25	62	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		24.9	20		\N	\N	\N	\N
1951	CID2057	CAT004	ITM028	40	40	0	0	33	165	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		73.8	20		\N	\N	\N	\N
1952	CID1097	CAT010	ITM046	10	10	0	0	12	60	0	17	17	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		2	0		\N	\N	\N	\N
1953	CID1097	CAT010	ITM046	56	56	0	0	12	60	32	81.28	81.28	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		54.6	0		\N	\N	\N	\N
1954	CID026	CAT004	ITM026	21	21	0	0	18	90	0	33	33	HDPE	MAS009	FALSE	Kg.	1	20K/Bag	Banana		12.5	20		\N	\N	\N	\N
1955	CID1098	CAT004	ITM030	6+6+50	50	6	6	40	100	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		75.6	20		\N	\N	\N	\N
1956	CID1098	CAT004	ITM031	6+6+70	70	6	6	40	100	36	91.44	91.44	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		150	20		\N	\N	\N	\N
1957	CID1098	CAT004	ITM032	14+14+74	74	14	14	40	100	39	99.06	99.06	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		202.1	20		\N	\N	\N	\N
1958	CID889	CAT004	ITM030	12+12+55	55	12	12	55	137	28	71.12	71.12	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		153.9	20		\N	\N	\N	\N
1959	CID669	CAT004	ITM027	5+5+20	20	5	5	17	42	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		12.8	20		\N	\N	\N	\N
1960	CID764	CAT006	ITM039	45	45	0	0	6	30	0	100	100	HDPE	MAS089	TRUE	Roll	1	20K/Bag	None	Plain	27	0		\N	\N	\N	\N
1961	CID1100	CAT004	ITM027	10+10+30	30	10	10	20	50	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana	Modern Plastic Bag Factory	22.9	20		\N	\N	\N	\N
1962	CID1100	CAT004	ITM029	15+15+45	45	15	15	20	50	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana	Modern Plastic Bag Factory	38.1	20		\N	\N	\N	\N
1963	CID980	CAT003	ITM019	8+8+26	26	8	8	12	30	16	40.64	40.64	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		10.2	30		\N	\N	\N	\N
1964	CID980	CAT003	ITM020	10+10+31	31	10	10	17	42	20	50.8	50.8	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		21.8	30		\N	\N	\N	\N
1965	CID1057	CAT004	ITM027	6+6+26	26	6	6	20	50	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		13.5	20		\N	\N	\N	\N
1966	CID1101	CAT003	ITM020	10+10+30	30	10	10	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.9	30		\N	\N	\N	\N
1967	CID265	CAT011	ITM048	50	50	0	0	28	140	0	0	0	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
1968	CID849	CAT004	ITM030	10+10+50	50	10	10	28	70	24	60.96	60.96	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		59.7	20		\N	\N	\N	\N
1969	CID038	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Roll	0.8	10R/Bag	None	Ahmad Saad (Busaad Plastic)	0	0		\N	\N	\N	\N
1970	CID649	CAT006	ITM038	60	60	0	0	8	40	0	140	140	HDPE	MAS005	TRUE	Roll	1.8	10R/Bag	None	Modern Plastic Bag Factory	67.2	0		\N	\N	\N	\N
1971	CID649	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1972	CID649	CAT002	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS029	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1973	CID649	CAT002	ITM013	0	0	0	0	0	0	0	0	0	HDPE	MAS006	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1974	CID649	CAT002	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1975	CID649	CAT002	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1976	CID649	CAT002	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1977	CID649	CAT002	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1978	CID555	CAT006	ITM038	60	60	0	0	8	40	0	140	140	HDPE	MAS005	TRUE	Roll	1.8	10R/Bag	None	Modern Plastic Bag Factory	67.2	0		\N	\N	\N	\N
1979	CID974	CAT004	ITM027	12+12+29	29	12	12	35	87	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		42.2	0		\N	\N	\N	\N
1980	CID1020	CAT004	ITM029	47	47	0	0	25	125	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		65.7	20		\N	\N	\N	\N
1981	CID432	CAT005	ITM033	0	0	0	0	4	20	20	50.8	50.8	HDPE	MAS005	TRUE	5 Roll	0.9	5R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1982	CID432	CAT005	ITM033	0	0	0	0	4	20	20	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
1983	CID432	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	1.8	10R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
1984	CID432	CAT006	ITM038	60	60	0	0	8	40	20	140	140	HDPE	MAS005	TRUE	Roll	1.8	10R/Bag	None	Modern Plastic Bag Factory	67.2	0		\N	\N	\N	\N
1985	CID889	CAT004	ITM028	9+9+40	40	9	9	35	87	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		46.1	20		\N	\N	\N	\N
1986	CID526	CAT004	ITM026	20	20	0	0	17	85	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		10.4	20		\N	\N	\N	\N
1987	CID1102	CAT003	ITM019	7+7+23	23	7	7	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	9.6	30		\N	\N	\N	\N
1988	CID1102	CAT003	ITM020	9+9+26	26	9	9	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	12.9	30		\N	\N	\N	\N
1989	CID1102	CAT003	ITM021	11+11+34	34	11	11	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	18.2	30		\N	\N	\N	\N
1990	CID1102	CAT003	ITM022	10+10+32	32	10	10	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	22.2	30		\N	\N	\N	\N
1991	CID1103	CAT003	ITM021	9+9+32	32	9	9	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	15.2	30		\N	\N	\N	\N
1992	CID1104	CAT003	ITM020	10+10+30	30	10	10	13	32	20	50.8	50.8	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.3	30		\N	\N	\N	\N
1993	CID1104	CAT006	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	44	0		\N	\N	\N	\N
1994	CID972	CAT008	ITM071	25	25	0	0	15	75	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		13.3	0		\N	\N	\N	\N
1995	CID1105	CAT004	ITM027	20	20	0	0	14	70	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		8.5	0		\N	\N	\N	\N
1996	CID1015	CAT004	ITM030	13+13+52	52	13	13	35	87	28	70	70	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		95	20		\N	\N	\N	\N
1997	CID1015	CAT004	ITM029	8+8+40	40	8	8	35	87	20	50	50	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		48.7	20		\N	\N	\N	\N
1998	CID720	CAT001	ITM006	11+11+54	54	11	11	24	60	22	110	110	LLDPE	MAS077	TRUE	Kg.	1	50Pcs/P x 4P/Bag	None	Plain	100.3	0	95Grms/Pc.	\N	\N	\N	\N
1999	CID1106	CAT003	ITM019	10+10+29	29	10	10	11	27	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		12.1	30		\N	\N	\N	\N
2000	CID1106	CAT003	ITM020	10+10+31	31	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		15.5	30		\N	\N	\N	\N
2001	CID1106	CAT003	ITM021	12+12+35	35	12	12	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		23	30		\N	\N	\N	\N
2002	CID502	CAT009	ITM045	49	49	0	0	17	85	28	71.12	71.12	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		59.2	0		\N	\N	\N	\N
2003	CID1107	CAT003	ITM018	8+8+18	18	8	8	13	32	14	35.56	35.56	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt		7.7	30		\N	\N	\N	\N
2004	CID1107	CAT003	ITM019	8+8+26	26	8	8	13	32	16	40.64	40.64	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt		10.9	30		\N	\N	\N	\N
2005	CID1107	CAT003	ITM020	10+10+30	30	10	10	13	32	20	50.8	50.8	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt		16.3	30		\N	\N	\N	\N
2006	CID423	CAT012	ITM051	6+6+22	22	6	6	25	62	0	45	45	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		19	0		\N	\N	\N	\N
2007	CID423	CAT012	ITM052	7+7+29	29	7	7	25	62	0	60	60	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		32	0		\N	\N	\N	\N
2008	CID801	CAT004	ITM027	25	25	0	0	12	60	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		12.2	0		\N	\N	\N	\N
2009	CID978	CAT012	ITM097	5+5+23	23	5	5	48	120	16	40.64	40.64	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		32.2	20		\N	\N	\N	\N
2010	CID1084	CAT004	ITM030	13+13+57	57	13	13	30	75	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		101.2	20		\N	\N	\N	\N
2011	CID1006	CAT010	ITM046	27.5+27.5+80	80	27.5	27.5	11	27	0	0	0	HDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2012	CID1006	CAT010	ITM062	27.5+27.5+80	80	27.5	27.5	11	27	0	0	0	HDPE	MAS041	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2013	CID2117	CAT004	ITM028	9+9+31	31	9	9	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		43.3	0		\N	\N	\N	\N
2014	CID1072	CAT004	ITM027	25	25	0	0	18	90	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		18.3	20		\N	\N	\N	\N
2015	CID1072	CAT004	ITM028	9+9+30	30	9	9	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		30.2	20		\N	\N	\N	\N
2016	CID751	CAT004	ITM027	30	30	0	0	10	50	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12.2	20		\N	\N	\N	\N
2017	CID751	CAT004	ITM028	35	35	0	0	10	50	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		16	20		\N	\N	\N	\N
2018	CID527	CAT008	ITM044	43	43	0	0	15	75	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		39.3	0		\N	\N	\N	\N
2019	CID160	CAT003	ITM020	10+10+32	32	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		19.5	30		\N	\N	\N	\N
2020	CID160	CAT003	ITM021	12+12+37	37	12	12	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		27.5	30		\N	\N	\N	\N
2021	CID160	CAT003	ITM022	13+13+47	47	13	13	18	45	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		46.7	30		\N	\N	\N	\N
2022	CID925	CAT006	ITM037	55	55	0	0	6	30	0	120	120	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	39.6	0		\N	\N	\N	\N
2023	CID1108	CAT004	ITM027	6+6+26	26	6	6	35	87	16	40.64	40.64	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		26.9	20		\N	\N	\N	\N
2024	CID1108	CAT004	ITM028	6+6+37	37	6	6	20	50	18	45.72	45.72	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		22.4	20		\N	\N	\N	\N
2025	CID1108	CAT004	ITM029	11+11+45	45	11	11	35	87	24	60.96	60.96	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		71.1	20		\N	\N	\N	\N
2026	CID829	CAT003	ITM019	9+9+27	27	9	9	18	45	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		18.5	0		\N	\N	\N	\N
2027	CID829	CAT003	ITM020	9+9+29	29	9	9	18	45	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		21.5	0		\N	\N	\N	\N
2028	CID829	CAT004	ITM027	6+6+28	28	6	6	26	65	18	45.72	45.72	LLDPE	MAS084	TRUE	Kg.	1	20K/Bag	Banana		23.8	20		\N	\N	\N	\N
2029	CID656	CAT003	ITM020	9+9+31	31	9	9	15	37	20	50.8	50.8	HDPE	MAS090	TRUE	Kg.	1	20K/Bag	None		18.4	0		\N	\N	\N	\N
2030	CID656	CAT003	ITM021	13+13+37	37	13	13	17	42	24	60.96	60.96	HDPE	MAS090	TRUE	Kg.	1	20K/Bag	None		32.3	0		\N	\N	\N	\N
2031	CID656	CAT003	ITM022	13+13+44	44	13	13	18	45	32	81.28	81.28	HDPE	MAS090	TRUE	Kg.	1	20K/Bag	None		51.2	0		\N	\N	\N	\N
2032	CID969	CAT004	ITM030	8+8+43	43	8	8	20	50	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		21	0		\N	\N	\N	\N
2033	CID969	CAT004	ITM031	10+10+60	60	10	10	20	50	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		36.6	0		\N	\N	\N	\N
2034	CID769	CAT012	ITM070	14+14+47	47	14	14	40	100	14	70	70	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		105	20		\N	\N	\N	\N
2035	CID1109	CAT005	ITM033	9+9+32	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	5 Roll	0.8	10P/Bag	None	Saeed Fakher Trading Co.	11	0		\N	\N	\N	\N
2036	CID769	CAT012	ITM049	44	44	0	0	20	100	14	70	70	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	Banana		61.6	20		\N	\N	\N	\N
2037	CID1110	CAT003	ITM019	8.5+8.5+29	29	8.5	8.5	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		15.6	30		\N	\N	\N	\N
2038	CID1110	CAT003	ITM021	8+8+33	33	8	8	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		18.4	30		\N	\N	\N	\N
2039	CID1110	CAT003	ITM022	9+9+33	33	9	9	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		19.9	30		\N	\N	\N	\N
2040	CID1111	CAT003	ITM019	6+6+22	22	6	6	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		9.7	30		\N	\N	\N	\N
2041	CID1111	CAT003	ITM020	8+8+26	26	8	8	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		14.2	30		\N	\N	\N	\N
2042	CID1111	CAT003	ITM021	10+10+33	33	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		19.9	30		\N	\N	\N	\N
2043	CID1100	CAT008	ITM044	18	18	0	0	10	50	8	20.32	20.32	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		3.7	0		\N	\N	\N	\N
2044	CID1100	CAT008	ITM056	28	28	0	0	10	50	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		8.5	0		\N	\N	\N	\N
2045	CID038	CAT005	ITM033	10+10+35	35	10	10	4	10	20	110	110	HDPE	MAS005	TRUE	Box	3	600G/Roll x 5R/Box	None	Ahmad Saad (Busaad Plastic)	12.1	0		\N	\N	\N	\N
2046	CID411	CAT009	ITM045	26	26	0	0	25	125	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		29.7	20	Salt Bag	\N	\N	\N	\N
2047	CID1106	CAT004	ITM027	12+12+29	29	12	12	35	87	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		37.5	20		\N	\N	\N	\N
2048	CID1106	CAT004	ITM028	12+12+29	29	12	12	35	87	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		42.2	20		\N	\N	\N	\N
2049	CID1033	CAT004	ITM032	15+15+61	61	15	15	40	100	0	106	106	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		192.9	20		\N	\N	\N	\N
2050	CID1033	CAT004	ITM031	16+16+57	57	16	16	36	90	0	78	78	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		125	20		\N	\N	\N	\N
2051	CID886	CAT003	ITM022	14+14+40	40	14	14	22	55	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		53.2	30		\N	\N	\N	\N
2052	CID886	CAT003	ITM028	8+8+31	31	8	8	40	100	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		38.2	20		\N	\N	\N	\N
2053	CID423	CAT009	ITM084	0	0	0	0	0	0	0	0	0	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2054	CID507	CAT003	ITM022	14+14+45	45	14	14	22	55	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		57.1	30		\N	\N	\N	\N
2055	CID507	CAT004	ITM028	36	36	0	0	25	125	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		41.1	20		\N	\N	\N	\N
2056	CID990	CAT004	ITM029	7+7+50	50	7	7	45	112	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		87.4	20		\N	\N	\N	\N
2057	CID236	CAT003	ITM020	11+11+31	31	11	11	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		16.2	30		\N	\N	\N	\N
2058	CID236	CAT003	ITM021	14+14+39	39	14	14	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		26.1	30		\N	\N	\N	\N
2059	CID236	CAT003	ITM022	14+14+42	42	14	14	15	37	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		36.8	30		\N	\N	\N	\N
2060	CID236	CAT003	ITM023	0	0	0	0	15	75	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
2061	CID1046	CAT003	ITM022	15+15+47	47	15	15	17	42	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		46	30		\N	\N	\N	\N
2062	CID025	CAT002	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2063	CID736	CAT004	ITM027	30	30	0	0	16	80	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		19.5	20		\N	\N	\N	\N
2064	CID736	CAT004	ITM028	8+8+33	33	8	8	30	75	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		37.3	20		\N	\N	\N	\N
2065	CID736	CAT004	ITM029	14+14+52	52	14	14	30	75	28	71.12	71.12	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		85.3	20		\N	\N	\N	\N
2066	CID1052	CAT003	ITM021	12+12+32	32	12	12	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		25.3	30		\N	\N	\N	\N
2067	CID1112	CAT004	ITM026	21.5	21.5	0	0	12	60	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		7.9	20		\N	\N	\N	\N
2068	CID168	CAT005	ITM039	13+13+34	34	13	13	4	10	20	120	120	HDPE	MAS005	TRUE	Roll	0.9	20K/Bag	None	Dahiya Eastern Shopping Center	14.4	0		\N	\N	\N	\N
2069	CID1113	CAT004	ITM027	4+4+25	25	4	4	35	87	12	30.48	30.48	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		17.5	20		\N	\N	\N	\N
2070	CID517	CAT003	ITM022	13+13+38	38	13	13	25	62	28	71.12	71.12	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		56.4	30		\N	\N	\N	\N
2071	CID020	CAT006	ITM036	50	50	0	0	8	40	20	110	110	HDPE	MAS005	TRUE	Roll w/Core	1.8	10R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
2072	CID1114	CAT004	ITM027	25+8+8	25	8	8	35	87	14	35.56	35.56	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	Banana		25.4	20		\N	\N	\N	\N
2073	CID1114	CAT004	ITM028	8+8+35	35	8	8	36	90	18	45.72	45.72	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	Banana		42	20		\N	\N	\N	\N
2074	CID806	CAT004	ITM026	21.5	21.5	0	0	15	75	0	27.5	27.5	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		8.9	0		\N	\N	\N	\N
2075	CID885	CAT004	ITM029	10+10+42	42	10	10	30	75	24	60.96	60.96	HDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		56.7	20		\N	\N	\N	\N
2076	CID752	CAT003	ITM023	15+15+54	54	15	15	25	62	32	81.28	81.28	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		84.7	30		\N	\N	\N	\N
2077	CID1122	CAT002	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2078	CID025	CAT002	ITM013	0	0	0	0	0	0	0	0	0	HDPE	MAS038	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2079	CID1115	CAT004	ITM027	23	23	0	0	15	75	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		10.5	20		\N	\N	\N	\N
2080	CID1116	CAT009	ITM045	35	35	0	0	30	150	0	45	45	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		47.3	0		\N	\N	\N	\N
2081	CID238	CAT003	ITM018	8+8+25	25	8	8	14	35	12	30.48	30.48	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		8.7	30		\N	\N	\N	\N
2082	CID238	CAT003	ITM019	8+8+25	25	8	8	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		12	30		\N	\N	\N	\N
2083	CID238	CAT003	ITM020	9+9+30	30	9	9	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		15.6	30		\N	\N	\N	\N
2084	CID1117	CAT003	ITM019	9+9+26	26	9	9	15	37	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		13.2	30		\N	\N	\N	\N
2085	CID1117	CAT003	ITM020	10+10+31	31	10	10	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		20.7	30		\N	\N	\N	\N
2086	CID1117	CAT003	ITM021	11+11+33	33	11	11	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	2oKg/Bag	T-Shirt		30.2	30		\N	\N	\N	\N
2087	CID1117	CAT003	ITM022	12+12+44	44	12	12	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		55.3	30		\N	\N	\N	\N
2088	CID1118	CAT003	ITM019	6+6+22	22	6	6	12	30	16	40.64	40.64	HDPE	MAS060	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	8.3	30		\N	\N	\N	\N
2089	CID1118	CAT003	ITM020	8+8+25	25	8	8	12	30	18	45.72	45.72	HDPE	MAS060	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	11.2	30		\N	\N	\N	\N
2090	CID1118	CAT003	ITM021	9+9+32	32	9	9	12	30	20	50.8	50.8	HDPE	MAS060	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	15.2	30		\N	\N	\N	\N
2091	CID1118	CAT003	ITM022	9+9+32	32	9	9	12	30	24	60.96	60.96	HDPE	MAS060	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	18.3	30		\N	\N	\N	\N
2092	CID972	CAT008	ITM072	15.5	15.5	0	0	11	55	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		4.3	0		\N	\N	\N	\N
2093	CID1119	CAT009	ITM045	13	13	0	0	4	20	0	0	0	LLDPE	MAS005	FALSE	Roll	1	20K/Bag	None		0	0		\N	\N	\N	\N
2094	CID789	CAT009	ITM045	16+16+71	71	16	16	35	87	0	104	104	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		186.4	0		\N	\N	\N	\N
2095	CID789	CAT009	ITM045	16+16+71	71	16	16	45	112	0	182	182	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		419.9	0		\N	\N	\N	\N
2096	CID1120	CAT009	ITM045	16+16+71	71	16	16	35	87	0	104	104	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		186.4	0		\N	\N	\N	\N
2097	CID1121	CAT003	ITM020	8+8+25	25	8	8	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	15	30		\N	\N	\N	\N
2098	CID411	CAT009	ITM071	30	30	0	0	28	140	20	50.8	50.8	LLDPE	MAS001	TRUE	Box	10	10P/Bag	Banana		42.7	20		\N	\N	\N	\N
2099	CID339	CAT007	ITM040	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Packet	0.2	100P/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2100	CID339	CAT007	ITM041	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Packet	0.2	100P/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2101	CID339	CAT007	ITM042	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Packet	0.2	100P/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2102	CID339	CAT007	ITM043	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Packet	0.2	100P/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2103	CID980	CAT003	ITM021	10+10+37	37	10	10	17	42	24	60.96	60.96	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		29.2	30		\N	\N	\N	\N
2104	CID978	CAT012	ITM049	5+5+24	24	5	5	50	125	16	40.64	40.64	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		34.5	20		\N	\N	\N	\N
2105	CID1122	CAT004	ITM027	23	23	0	0	12	60	12	30.48	30.48	LLDPE	MAS005	TRUE	Box	10	10P/Bag	Banana		8.4	20		\N	\N	\N	\N
2106	CID1122	CAT004	ITM028	5+5+27	27	5	5	21	52	16	40.64	40.64	LLDPE	MAS005	TRUE	Box	10	10P/Bag	Banana		15.6	20		\N	\N	\N	\N
2107	CID769	CAT003	ITM022	0	0	0	0	0	0	0	0	0	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
2108	CID769	CAT008	ITM044	21	21	0	0	8	40	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2109	CID769	CAT008	ITM056	26	26	0	0	8	40	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2110	CID769	CAT008	ITM057	35	35	0	0	8	40	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2111	CID705	CAT004	ITM027	4+4+20	20	4	4	45	112	12	30.48	30.48	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		19.1	20		\N	\N	\N	\N
2112	CID1123	CAT003	ITM019	8+8+27	27	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		11.8	30		\N	\N	\N	\N
2113	CID1123	CAT003	ITM020	10+10+33	33	10	10	13	32	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		19	30		\N	\N	\N	\N
2114	CID1123	CAT003	ITM021	10+10+36	36	10	10	14	35	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		25.9	30		\N	\N	\N	\N
2115	CID697	CAT003	ITM019	8+8+24	24	8	8	20	50	16	40.64	40.64	HDPE	MAS052	TRUE	Kg.	1	20K/Bag	T-Shirt		16.3	30		\N	\N	\N	\N
2116	CID411	CAT015	ITM110	27	27	0	0	7	35	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.7	0	Tray #4	\N	\N	\N	\N
2117	CID411	CAT015	ITM110	35	35	0	0	7	35	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		10	0	Tray #26/3	\N	\N	\N	\N
2118	CID1124	CAT004	ITM029	11+11+41	41	11	11	35	87	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		61.3	20		\N	\N	\N	\N
2119	CID720	CAT001	ITM003	11+11+33	33	11	11	13	32	24	60	60	HDPE	MAS041	TRUE	Kg.	1	50Pcs/P x 10P/Bag	None		21.1	0		\N	\N	\N	\N
2120	CID432	CAT008	ITM056	21	21	0	0	20	100	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		14.9	0		\N	\N	\N	\N
2121	CID196	CAT004	ITM028	8+8+40	40	8	8	28	70	20	50.8	50.8	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		39.8	20		\N	\N	\N	\N
2122	CID196	CAT004	ITM030	10+10+42	42	10	10	40	100	28	71.12	71.12	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		88.2	20		\N	\N	\N	\N
2123	CID360	CAT003	ITM018	6+6+22	22	6	6	14	35	14	35.56	35.56	HDPE	MAS082	TRUE	Kg.	1	20K/Bag	T-Shirt		8.5	30		\N	\N	\N	\N
2124	CID864	CAT012	ITM049	18	18	0	0	40	200	24	60.96	60.96	LLDPE	MAS048	TRUE	Kg.	1	2oKg/Bag	None		43.9	0		\N	\N	\N	\N
2125	CID1125	CAT008	ITM044	15	15	0	0	11	55	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		5	0		\N	\N	\N	\N
2126	CID412	CAT005	ITM033	0	0	0	0	4	20	20	50.8	50.8	HDPE	MAS005	TRUE	6 Roll	1	6R/P x 20P/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2127	CID1126	CAT003	ITM020	8+8+30	30	8	8	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		16.4	30		\N	\N	\N	\N
2128	CID1126	CAT003	ITM021	13+13+40	40	13	13	18	45	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		30.2	30		\N	\N	\N	\N
2129	CID1126	CAT005	ITM033	11+11+31	31	11	11	4	10	0	0	0	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	0	0		\N	\N	\N	\N
2130	CID1127	CAT004	ITM028	6+6+35	35	6	6	35	87	18	45.72	45.72	LLDPE	MAS091	TRUE	Kg.	1	20K/Bag	Banana		37.4	20		\N	\N	\N	\N
2131	CID598	CAT008	ITM071	41	41	0	0	12	60	0	49	49	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		24.1	0		\N	\N	\N	\N
2132	CID649	CAT005	ITM033	0	0	0	0	4	20	20	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	We One Shopping Center	0	0		\N	\N	\N	\N
2133	CID161	CAT004	ITM027	8+8+35	35	8	8	24	60	16	40.64	40.64	HDPE	MAS087	TRUE	Kg.	1	20K/Bag	None		24.9	0		\N	\N	\N	\N
2134	CID1128	CAT004	ITM028	9+9+31	31	9	9	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		43.3	20		\N	\N	\N	\N
2135	CID1128	CAT004	ITM029	7+7+35	35	7	7	30	75	22	55.88	55.88	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		41.1	20		\N	\N	\N	\N
2136	CID864	CAT012	ITM049	5+5+22	22	5	5	60	150	20	50.8	50.8	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		48.8	0		\N	\N	\N	\N
2137	CID169	CAT008	ITM056	16	16	0	0	12	60	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		5.9	0		\N	\N	\N	\N
2138	CID743	CAT004	ITM027	22	22	0	0	16	80	12	30.48	30.48	LLDPE	MAS092	TRUE	Kg.	1	20K/Bag	Banana		10.7	20		\N	\N	\N	\N
2139	CID743	CAT004	ITM027	22	22	0	0	16	80	12	30.48	30.48	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		10.7	20		\N	\N	\N	\N
2140	CID1033	CAT004	ITM029	8+8+38	38	8	8	33	82	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		45	20		\N	\N	\N	\N
2141	CID341	CAT010	ITM046	52	52	0	0	12	60	0	75	75	HDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		46.8	0		\N	\N	\N	\N
2142	CID846	CAT004	ITM031	4+4+50	50	4	4	35	87	26	66.04	66.04	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		66.6	20		\N	\N	\N	\N
2143	CID1006	CAT010	ITM063	27.5+27.5+80	80	27.5	27.5	11	27	0	0	0	HDPE	MAS082	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2144	CID196	CAT004	ITM027	6+6+36	36	6	6	36	90	18	45.72	45.72	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		39.5	20		\N	\N	\N	\N
2145	CID1129	CAT003	ITM021	36+12+12	36	12	12	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		32.9	30		\N	\N	\N	\N
2146	CID1129	CAT003	ITM022	41+12+12	41	12	12	18	45	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		41.6	30		\N	\N	\N	\N
2147	CID1129	CAT003	ITM023	46+14+14	46	14	14	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		60.1	30		\N	\N	\N	\N
2148	CID864	CAT012	ITM049	6+6+27	27	6	6	60	150	22	55.88	55.88	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	None		65.4	0		\N	\N	\N	\N
2149	CID1045	CAT008	ITM044	24	24	0	0	18	90	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		15.4	0		\N	\N	\N	\N
2150	CID1045	CAT008	ITM056	29	29	0	0	18	90	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		21.2	0		\N	\N	\N	\N
2151	CID1130	CAT003	ITM019	9+9+26	26	9	9	18	45	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		14.1	30		\N	\N	\N	\N
2152	CID1130	CAT003	ITM020	10+10+31	31	10	10	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		28	30		\N	\N	\N	\N
2153	CID1130	CAT003	ITM021	12+12+41	41	12	12	18	45	30	76.2	76.2	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		44.6	30		\N	\N	\N	\N
2154	CID1131	CAT004	ITM028	7+7+32	32	7	7	22	55	18	45.72	45.72	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		23.1	20		\N	\N	\N	\N
2155	CID1131	CAT003	ITM021	8+8+40	40	8	8	50	125	24	60.96	60.96	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt		85.3	30		\N	\N	\N	\N
2156	CID429	CAT004	ITM026	22	22	0	0	18	90	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12.1	20		\N	\N	\N	\N
2157	CID1132	CAT003	ITM022	12+12+45	45	12	12	25	62	32	81.28	81.28	HDPE	MAS021	TRUE	Kg.	1	20K/Bag	T-Shirt		69.5	30		\N	\N	\N	\N
2158	CID1132	CAT003	ITM023	15+15+54	54	15	15	27	67	39	99.06	99.06	HDPE	MAS021	TRUE	Kg.	1	20K/Bag	T-Shirt		111.5	30		\N	\N	\N	\N
2159	CID1132	CAT003	ITM024	20+20+80	80	20	20	27	67	24	120	120	HDPE	MAS021	TRUE	Kg.	1	20K/Bag	T-Shirt		193	30		\N	\N	\N	\N
2160	CID1133	CAT004	ITM027	20	20	0	0	20	100	12	30.48	30.48	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		12.2	20		\N	\N	\N	\N
2161	CID1133	CAT004	ITM028	31	31	0	0	20	100	16	40.64	40.64	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		25.2	20		\N	\N	\N	\N
2162	CID1134	CAT005	ITM033	0	0	0	0	4	20	20	50.8	50.8	HDPE	MAS005	TRUE	5 Roll	0.8	5R/Bag	None	Nadera	0	0		\N	\N	\N	\N
2163	CID1135	CAT004	ITM027	5+5+25	25	5	5	30	75	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		16	20		\N	\N	\N	\N
2164	CID754	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS005	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
2165	CID480	CAT009	ITM045	71	71	0	0	24	120	22	110	110	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		187.4	0		\N	\N	\N	\N
2166	CID184	CAT008	ITM044	20	20	0	0	12	60	0	30	30	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		7.2	0		\N	\N	\N	\N
2167	CID1045	CAT008	ITM057	20	20	0	0	18	90	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		11	0		\N	\N	\N	\N
2168	CID1136	CAT004	ITM027	5+5+20	20	5	5	28	70	12	30.48	30.48	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12.8	20		\N	\N	\N	\N
2169	CID1136	CAT003	ITM020	10+10+30	30	10	10	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		16.3	30		\N	\N	\N	\N
2170	CID1136	CAT003	ITM022	12+12+44	44	12	12	24	60	30	76.2	76.2	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		62.2	30		\N	\N	\N	\N
2171	CID632	CAT004	ITM030	47+12+12	47	12	12	17	42	30	76.2	76.2	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		45.4	20		\N	\N	\N	\N
2172	CID632	CAT004	ITM031	49+15+15	49	15	15	17	42	39	99.06	99.06	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		65.7	20		\N	\N	\N	\N
2173	CID632	CAT004	ITM032	69+15+15	69	15	15	23	57	39	99.06	99.06	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		111.8	20		\N	\N	\N	\N
2174	CID893	CAT005	ITM033	0	0	0	0	4	20	20	50.8	50.8	HDPE	MAS005	TRUE	5 Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2175	CID503	CAT005	ITM033	0	0	0	0	4	20	20	110	110	HDPE	MAS005	TRUE	6 Roll	1	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2176	CID750	CAT003	ITM020	9+9+30	30	9	9	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		17.1	0		\N	\N	\N	\N
2177	CID750	CAT003	ITM021	10+10+35	35	10	10	21	52	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		34.9	0		\N	\N	\N	\N
2178	CID750	CAT003	ITM022	9+9+40	40	9	9	25	62	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		51.1	0		\N	\N	\N	\N
2179	CID769	CAT009	ITM045	40	40	0	0	28	140	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		45.5	0		\N	\N	\N	\N
2180	CID1137	CAT009	ITM045	13+13+41	41	13	13	35	87	0	75	75	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		87.4	0		\N	\N	\N	\N
2181	CID1138	CAT005	ITM033	0	0	0	0	4	20	20	110	110	HDPE	MAS005	TRUE	5 Roll	0.7	5R/Bag	None	Shima	0	0		\N	\N	\N	\N
2182	CID741	CAT006	ITM037	55	55	0	0	6	30	0	110	110	HDPE	MAS093	FALSE	Roll	0.8	15R/Bag	None	Manal	36.3	0		\N	\N	\N	\N
2183	CID1139	CAT012	ITM050	22+5+5	22	5	5	55	137	16	40.64	40.64	LLDPE	MAS063	TRUE	Kg.	1	20K/Bag	Banana		35.6	20		\N	\N	\N	\N
2184	CID1140	CAT003	ITM020	8+8+25	25	8	8	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	15	30		\N	\N	\N	\N
2185	CID1140	CAT003	ITM022	9+9+32	32	9	9	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	24.4	30		\N	\N	\N	\N
2186	CID1141	CAT003	ITM019	9+9+26	26	9	9	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		12.1	30		\N	\N	\N	\N
2187	CID1141	CAT003	ITM020	10+10+31	31	10	10	15	37	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		21.1	30		\N	\N	\N	\N
3792	CID1688	CAT008	ITM042	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2188	CID1141	CAT003	ITM021	10+10+36	36	10	10	18	45	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		35.8	30		\N	\N	\N	\N
2189	CID1142	CAT004	ITM029	9+9+29	29	9	9	35	87	20	50.8	50.8	LLDPE	MAS023	TRUE	Kg.	1	20K/Bag	Banana		41.5	20		\N	\N	\N	\N
2190	CID1142	CAT004	ITM030	13+13+56	56	13	13	35	87	30	76.2	76.2	LLDPE	MAS023	TRUE	Kg.	1	20K/Bag	Banana		108.7	20		\N	\N	\N	\N
2191	CID1142	CAT004	ITM031	15+15+75	75	15	15	35	87	39	99.06	99.06	LLDPE	MAS023	TRUE	Kg.	1	20K/Bag	Banana		181	20		\N	\N	\N	\N
2192	CID906	CAT003	ITM019	22+7+7	22	7	7	17	42	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		10.8	30		\N	\N	\N	\N
2193	CID906	CAT003	ITM020	9+9+28	28	9	9	18	45	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		21	30		\N	\N	\N	\N
2194	CID083	CAT001	ITM005	10+10+40	40	10	10	55	137	0	87	87	LLDPE	MAS003	FALSE	Kg.	1	20K/Bag	None	Plain	143	0	132 grams/Pc.	\N	\N	\N	\N
2195	CID669	CAT004	ITM026	25	25	0	0	12	60	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		12.2	0		\N	\N	\N	\N
2196	CID1143	CAT003	ITM019	8+8+27	27	8	8	10	25	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		9.8	30		\N	\N	\N	\N
2197	CID1143	CAT003	ITM020	10+10+32	32	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		15.8	30		\N	\N	\N	\N
2198	CID1143	CAT003	ITM021	10+10+33	33	10	10	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		22.6	30		\N	\N	\N	\N
2199	CID1143	CAT003	ITM022	12+12+40	40	12	12	20	50	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		45.5	30		\N	\N	\N	\N
2200	CID1143	CAT008	ITM044	16	16	0	0	10	50	8	20.32	20.32	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		3.3	0		\N	\N	\N	\N
2201	CID1143	CAT008	ITM056	20	20	0	0	10	50	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		5.1	0		\N	\N	\N	\N
2202	CID1143	CAT008	ITM057	26	26	0	0	10	50	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.9	0		\N	\N	\N	\N
2203	CID1144	CAT004	ITM027	5+5+26	26	5	5	28	70	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		15.4	20		\N	\N	\N	\N
2204	CID1144	CAT004	ITM028	6.5+6.5+37	37	6.5	6.5	28	70	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.6	20		\N	\N	\N	\N
2205	CID1144	CAT004	ITM029	9+9+40	40	9	9	40	100	28	71.12	71.12	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		82.5	0		\N	\N	\N	\N
2206	CID769	CAT012	ITM049	20.5	20.5	0	0	20	100	36	91.44	91.44	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	Banana		37.5	20		\N	\N	\N	\N
2207	CID1145	CAT006	ITM038	60	60	0	0	6	30	16	120	120	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	43.2	0		\N	\N	\N	\N
2208	CID152	CAT006	ITM037	55	55	0	0	5	25	12	100	100	HDPE	MAS001	TRUE	Roll	1	20K/Bag	None	Plain	27.5	0		\N	\N	\N	\N
2209	CID623	CAT003	ITM020	10+10+32	32	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		19.5	30		\N	\N	\N	\N
2210	CID623	CAT003	ITM021	12+12+37	37	12	12	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		31.2	30		\N	\N	\N	\N
2211	CID184	CAT007	ITM040	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	20K/Bag	None		0	0		\N	\N	\N	\N
2212	CID184	CAT007	ITM041	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2213	CID184	CAT007	ITM042	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2214	CID184	CAT007	ITM043	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	20K/Bag	None		0	0		\N	\N	\N	\N
2215	CID1146	CAT010	ITM046	56	56	0	0	12	60	32	81.28	81.28	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		54.6	0		\N	\N	\N	\N
2216	CID1147	CAT004	ITM027	5+5+22	22	5	5	28	70	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		13.7	0		\N	\N	\N	\N
2217	CID339	CAT015	ITM110	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2218	CID1143	CAT005	ITM033	0	0	0	0	4	20	0	110	110	HDPE	MAS005	TRUE	5 Roll	0.9	5R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2219	CID1143	CAT006	ITM037	55	55	0	0	6	30	20	120	120	HDPE	MAS005	TRUE	Roll	0.8	15R/Bag	None	Modern Plastic Bag Factory	39.6	0		\N	\N	\N	\N
2220	CID1143	CAT006	ITM038	60	60	0	0	8	40	20	140	140	HDPE	MAS005	TRUE	Roll	1.8	10R/Bag	None	Modern Plastic Bag Factory	67.2	0		\N	\N	\N	\N
2221	CID769	CAT012	ITM049	25.5	25.5	0	0	22	110	38	96.52	96.52	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		54.1	20		\N	\N	\N	\N
2222	CID1148	CAT003	ITM019	9+9+26	26	9	9	18	45	16	40.64	40.64	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.1	30		\N	\N	\N	\N
2223	CID1148	CAT003	ITM020	10+10+31	31	10	10	20	50	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.9	30		\N	\N	\N	\N
2224	CID1149	CAT008	ITM044	42	42	0	0	30	150	0	59	59	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		74.3	0		\N	\N	\N	\N
2225	CID1149	CAT008	ITM056	53.5	53.5	0	0	35	175	0	68	68	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		127.3	0		\N	\N	\N	\N
2226	CID1149	CAT009	ITM045	42	42	0	0	30	150	24	60.96	60.96	LLDPE	MAS045	TRUE	Kg.	1	20K/Bag	None		76.8	0		\N	\N	\N	\N
2227	CID1149	CAT009	ITM045	53.5	53.5	0	0	35	175	28	71.12	71.12	LLDPE	MAS045	TRUE	Kg.	1	20K/Bag	None		133.2	0		\N	\N	\N	\N
2228	CID1150	CAT004	ITM029	10+10+60	60	10	10	35	87	26	66.04	66.04	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		91.9	0		\N	\N	\N	\N
2229	CID224	CAT005	ITM033	9+9+32	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None		11	0		\N	\N	\N	\N
2230	CID1151	CAT004	ITM027	29	29	0	0	12	60	12	30.48	30.48	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		10.6	20		\N	\N	\N	\N
2231	CID1151	CAT003	ITM020	10+10+30	30	10	10	20	50	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.4	30		\N	\N	\N	\N
2232	CID1151	CAT003	ITM021	14+14+43	43	14	14	20	50	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		50.5	30		\N	\N	\N	\N
2233	CID561	CAT005	ITM033	9+9+32	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	11	0		\N	\N	\N	\N
2234	CID404	CAT008	ITM056	65	65	0	0	25	125	0	84	84	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		136.5	0		\N	\N	\N	\N
2235	CID412	CAT002	ITM014	0	0	0	0	14	70	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2236	CID412	CAT002	ITM015	0	0	0	0	14	70	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2237	CID412	CAT002	ITM016	0	0	0	0	14	70	0	0	0	Regrind	MAS004	FALSE	Roll	1	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2238	CID412	CAT002	ITM017	0	0	0	0	14	70	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2239	CID1052	CAT003	ITM022	10+10+41	41	10	10	17	42	26	66.04	66.04	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		33.8	0		\N	\N	\N	\N
2240	CID1054	CAT003	ITM020	10+10+32	32	10	10	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		21.1	0		\N	\N	\N	\N
2241	CID1152	CAT004	ITM028	10+10+35	35	10	10	40	100	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		55.9	20		\N	\N	\N	\N
2242	CID1152	CAT004	ITM029	10+10+50	50	10	10	45	112	32	81.28	81.28	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		127.4	20		\N	\N	\N	\N
2243	CID1153	CAT003	ITM020	10+10+30	30	10	10	15	37	20	50.8	50.8	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.8	30		\N	\N	\N	\N
2244	CID1153	CAT003	ITM021	10+10+32	32	10	10	16	40	24	60.96	60.96	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.4	30		\N	\N	\N	\N
2245	CID1153	CAT006	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS055	TRUE	Roll	1	20K/Bag	None		44	0		\N	\N	\N	\N
2246	CID1154	CAT010	ITM046	41	41	0	0	13	65	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.2	20		\N	\N	\N	\N
2247	CID1802	CAT012	ITM049	7+7+25	25	7	7	30	75	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		23.8	20		\N	\N	\N	\N
2248	CID1156	CAT004	ITM027	23	23	0	0	20	100	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		14	20		\N	\N	\N	\N
2249	CID1156	CAT004	ITM028	26	26	0	0	20	100	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		18.5	20		\N	\N	\N	\N
2250	CID1156	CAT004	ITM029	31	31	0	0	20	100	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		25.2	20		\N	\N	\N	\N
2251	CID1157	CAT003	ITM020	9+9+31	31	9	9	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		17.4	30		\N	\N	\N	\N
2252	CID1157	CAT003	ITM021	11+11+40	40	11	11	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		28	30		\N	\N	\N	\N
2253	CID1158	CAT010	ITM046	60	60	0	0	12	60	34	86.36	86.36	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		62.2	0		\N	\N	\N	\N
2254	CID025	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2255	CID025	CAT002	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS029	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2256	CID1159	CAT004	ITM027	6+6+25	25	6	6	30	75	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		19.7	20		\N	\N	\N	\N
2257	CID1159	CAT004	ITM028	10+10+30	30	10	10	30	75	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		34.3	20		\N	\N	\N	\N
2258	CID1159	CAT004	ITM029	12+12+41	41	12	12	30	75	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		64.4	20		\N	\N	\N	\N
2259	CID1160	CAT003	ITM019	8+8+30	30	8	8	20	50	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		21	30		\N	\N	\N	\N
2260	CID864	CAT012	ITM060	7+7+28	28	7	7	60	150	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		70.4	20		\N	\N	\N	\N
2261	CID1161	CAT006	ITM036	50	50	0	0	8	40	20	100	100	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	40	0		\N	\N	\N	\N
2262	CID1162	CAT003	ITM019	8+8+25	25	8	8	25	62	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		23.2	30		\N	\N	\N	\N
2263	CID1145	CAT003	ITM020	10+10+31	31	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	2oKg/Bag	T-Shirt		15.5	30		\N	\N	\N	\N
2264	CID1163	CAT004	ITM028	7+7+30	30	7	7	25	62	16	40.64	40.64	LLDPE	MAS048	TRUE	Kg.	1	20K/Bag	Banana		22.2	20		\N	\N	\N	\N
2265	CID1164	CAT003	ITM019	6+6+22	22	6	6	19	47	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.4	30		\N	\N	\N	\N
2266	CID1164	CAT003	ITM020	10+10+30	30	10	10	19	47	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23.9	30		\N	\N	\N	\N
2267	CID1165	CAT003	ITM021	12+12+37	37	12	12	15	37	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		29.8	30		\N	\N	\N	\N
2268	CID1165	CAT003	ITM022	15+15+46	46	15	15	16	40	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		49.4	30		\N	\N	\N	\N
2269	CID1166	CAT003	ITM019	8+8+28	28	8	8	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		14.3	30		\N	\N	\N	\N
2270	CID1166	CAT003	ITM021	10+10+31	31	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		23	30		\N	\N	\N	\N
2271	CID1167	CAT004	ITM028	9+9+31	31	9	9	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		43.3	20		\N	\N	\N	\N
2272	CID1168	CAT004	ITM028	9+9+33	33	9	9	40	100	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		51.8	0		\N	\N	\N	\N
2273	CID1169	CAT004	ITM027	5+5+22	22	5	5	25	62	12	30.48	30.48	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12.1	20		\N	\N	\N	\N
2274	CID1169	CAT004	ITM028	7+7+27	27	7	7	25	62	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		20.7	20		\N	\N	\N	\N
2275	CID1169	CAT003	ITM021	10+10+35	35	10	10	20	50	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		30.7	30		\N	\N	\N	\N
2276	CID1169	CAT006	ITM037	55	55	0	0	6	30	22	110	110	HDPE	MAS005	TRUE	Packet	1	20K/Bag	None	Plain	36.3	0		\N	\N	\N	\N
2277	CID900	CAT004	ITM030	9+9+58	58	9	9	36	90	28	71.12	71.12	LLDPE	MAS025	TRUE	Kg.	1	20K/Bag	Banana		97.3	20		\N	\N	\N	\N
2278	CID1170	CAT004	ITM028	6+6+34	34	6	6	25	62	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		26.1	20		\N	\N	\N	\N
2279	CID1170	CAT004	ITM029	9+9+40	40	9	9	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		36.5	20		\N	\N	\N	\N
2280	CID903	CAT004	ITM031	13+13+70	70	13	13	38	95	32	81.28	81.28	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		148.3	20		\N	\N	\N	\N
2281	CID1171	CAT003	ITM020	0	0	0	0	0	0	0	0	0	HDPE	MAS077	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
2282	CID1171	CAT003	ITM021	0	0	0	0	0	0	0	0	0	HDPE	MAS077	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
2283	CID1171	CAT003	ITM022	0	0	0	0	0	0	0	0	0	HDPE	MAS077	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
2284	CID1172	CAT003	ITM021	8+8+30	30	8	8	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		22.4	0		\N	\N	\N	\N
2285	CID1172	CAT003	ITM022	10+10+40	40	10	10	20	50	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		39.6	0		\N	\N	\N	\N
2286	CID1172	CAT006	ITM038	60	60	0	0	8	40	16	120	120	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	57.6	0		\N	\N	\N	\N
2287	CID1027	CAT003	ITM020	10+10+30	30	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.8	30		\N	\N	\N	\N
2288	CID820	CAT006	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS005	TRUE	Roll w/Core	1	20K/Bag	None	Plain	44	0		\N	\N	\N	\N
2289	CID1173	CAT006	ITM036	55	55	0	0	7	35	8	100	100	HDPE	MAS005	TRUE	Roll w/Core	1	20K/Bag	None	Plain	38.5	0		\N	\N	\N	\N
2290	CID476	CAT002	ITM053	0	0	0	0	0	0	0	110	110	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2291	CID341	CAT009	ITM075	36	36	0	0	25	125	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		50.3	0		\N	\N	\N	\N
2292	CID1174	CAT004	ITM030	40+7+7	40	7	7	42	105	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		63.4	20		\N	\N	\N	\N
3793	CID1688	CAT008	ITM043	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2293	CID1174	CAT004	ITM031	55+9+9	55	9	9	45	112	32	81.28	81.28	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		132.9	20		\N	\N	\N	\N
2294	CID1174	CAT004	ITM032	70+14+14	70	14	14	46	115	39	99.06	99.06	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		223.3	20		\N	\N	\N	\N
2295	CID1175	CAT003	ITM019	7+7+24	24	7	7	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		9.9	30		\N	\N	\N	\N
2296	CID1175	CAT003	ITM020	10+10+30	30	10	10	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		17.8	30		\N	\N	\N	\N
2297	CID1175	CAT003	ITM021	10+10+32	32	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		23.5	30		\N	\N	\N	\N
2298	CID1176	CAT003	ITM021	33+11+11	33	11	11	18	45	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		25.1	30		\N	\N	\N	\N
2299	CID864	CAT012	ITM100	5+5+28	28	5	5	60	150	20	50.8	50.8	LLDPE	MAS058	TRUE	Kg.	1	20K/Bag	Banana		57.9	20		\N	\N	\N	\N
2300	CID1177	CAT004	ITM027	6+6+36	36	6	6	36	90	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		39.5	20		\N	\N	\N	\N
2301	CID1177	CAT004	ITM028	8+8+40	40	8	8	40	100	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		56.9	20		\N	\N	\N	\N
2302	CID1177	CAT004	ITM029	10+10+42	42	10	10	40	100	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		75.6	20		\N	\N	\N	\N
2303	CID1168	CAT004	ITM029	10+10+40	40	10	10	40	100	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		73.2	20		\N	\N	\N	\N
2304	CID480	CAT004	ITM027	8+8+34	34	8	8	30	75	16	40.64	40.64	LLDPE	MAS001	TRUE	Box	1	350/Box	Banana		30.5	20	27.5G/P	\N	\N	\N	\N
2305	CID480	CAT004	ITM028	10+10+58	58	10	10	32	80	24	60.96	60.96	LLDPE	MAS001	TRUE	Box	1	150/Box	Banana		76.1	20	68.5 G/P	\N	\N	\N	\N
2306	CID480	CAT004	ITM029	15+15+65	65	15	15	36	90	30	76.2	76.2	LLDPE	MAS001	TRUE	Box	1	70Pcs/Box	Banana		130.3	20	119/Pc	\N	\N	\N	\N
2307	CID404	CAT008	ITM057	45	45	0	0	20	100	0	80	80	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		72	0		\N	\N	\N	\N
2308	CID1178	CAT003	ITM020	10+10+30	30	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		18.8	0		\N	\N	\N	\N
2309	CID1877	CAT012	ITM049	27	27	0	0	35	175	32	81.28	81.28	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	None		76.8	0		\N	\N	\N	\N
2310	CID1179	CAT004	ITM029	10+10+40	40	10	10	40	100	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		73.2	20		\N	\N	\N	\N
2311	CID864	CAT012	ITM045	19	19	0	0	35	175	30	76.2	76.2	LLDPE	MAS063	TRUE	Kg.	1	20K/Bag	None		50.7	0		\N	\N	\N	\N
2312	CID864	CAT004	ITM075	19	19	0	0	35	175	28	71.12	71.12	LLDPE	MAS077	TRUE	Kg.	1	20K/Bag	None		47.3	0		\N	\N	\N	\N
2313	CID864	CAT012	ITM052	25	25	0	0	35	175	36	91.44	91.44	LLDPE	MAS077	TRUE	Kg.	1	20K/Bag	None		80	0		\N	\N	\N	\N
2314	CID791	CAT003	ITM019	8+8+26	26	8	8	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		15.4	30		\N	\N	\N	\N
2315	CID791	CAT003	ITM020	9+9+30	30	9	9	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		19.5	30		\N	\N	\N	\N
2316	CID791	CAT003	ITM021	10+10+32	32	10	10	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		26.6	30		\N	\N	\N	\N
2317	CID791	CAT003	ITM022	11+11+39	39	11	11	18	45	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		39	30		\N	\N	\N	\N
2318	CID137	CAT007	ITM055	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	5Kg/Box	None		0	0		\N	\N	\N	\N
2319	CID364	CAT004	ITM027	5.5+5.5+28	28	5.5	5.5	17	42	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		13.3	20		\N	\N	\N	\N
2320	CID1178	CAT003	ITM019	8+8+25	25	8	8	15	37	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		12.3	30		\N	\N	\N	\N
2321	CID931	CAT004	ITM028	10+10+30	30	10	10	24	60	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		33.5	20		\N	\N	\N	\N
2322	CID004	CAT001	ITM009	18+18+60	60	18	18	11	27	0	110	110	LLDPE	MAS001	FALSE	Packet	2.6	5P/Bag	None	Plain	57	0		\N	\N	\N	\N
2323	CID404	CAT008	ITM058	31	31	0	0	25	125	0	50	50	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		38.8	0		\N	\N	\N	\N
2324	CID1180	CAT004	ITM029	11+11+50	50	11	11	30	75	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		65.8	0		\N	\N	\N	\N
2325	CID1181	CAT003	ITM019	6+6+22	22	6	6	15	37	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	15Kg/Bag	T-Shirt w/Hook		10.2	30		\N	\N	\N	\N
2326	CID1181	CAT003	ITM020	8+8+25	25	8	8	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	15Kg/Bag	T-Shirt w/Hook		13.9	30		\N	\N	\N	\N
2327	CID1181	CAT003	ITM021	10+10+33	33	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	15Kg/Bag	T-Shirt w/Hook		19.9	30		\N	\N	\N	\N
2328	CID358	CAT004	ITM027	31	31	0	0	12	60	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		15.1	20		\N	\N	\N	\N
2329	CID1182	CAT006	ITM036	50	50	0	0	4	20	0	100	100	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None		20	0		\N	\N	\N	\N
2330	CID503	CAT002	ITM053	0	0	0	0	13	65	0	110	110	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2331	CID1183	CAT003	ITM019	8+8+23	23	8	8	15	37	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		11.7	30		\N	\N	\N	\N
2332	CID1183	CAT003	ITM020	10+10+31	31	10	10	18	45	20	50.8	50.8	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt		23.3	30		\N	\N	\N	\N
2333	CID1184	CAT008	ITM044	20	20	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.1	0		\N	\N	\N	\N
2334	CID1185	CAT004	ITM027	20	20	0	0	10	50	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		6.1	20		\N	\N	\N	\N
2335	CID1173	CAT003	ITM020	10+10+31	31	10	10	28	70	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		36.3	30		\N	\N	\N	\N
2336	CID1182	CAT003	ITM020	11+11+34	34	11	11	16	40	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		25	30		\N	\N	\N	\N
2337	CID1186	CAT003	ITM021	14+14+40	40	14	14	15	37	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		33.2	30		\N	\N	\N	\N
2338	CID1186	CAT003	ITM022	15+15+47	47	15	15	15	37	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		40.5	30		\N	\N	\N	\N
2339	CID1187	CAT004	ITM029	8+8+50	50	8	8	25	62	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		49.9	20		\N	\N	\N	\N
2340	CID1187	CAT004	ITM030	12+12+63	63	12	12	32	80	30	76.2	76.2	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		106.1	20		\N	\N	\N	\N
2341	CID1187	CAT004	ITM031	16+16+71	71	16	16	32	80	36	91.44	91.44	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		150.7	20		\N	\N	\N	\N
2342	CID1188	CAT004	ITM028	8+8+35	35	8	8	37	92	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		42.9	20		\N	\N	\N	\N
2343	CID1189	CAT003	ITM018	7+7+21	21	7	7	8	20	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		5.7	30		\N	\N	\N	\N
2344	CID1189	CAT003	ITM020	10+10+30	30	10	10	10	25	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		14	30		\N	\N	\N	\N
2345	CID1189	CAT003	ITM021	11+11+32	32	11	11	12	30	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		19.8	30		\N	\N	\N	\N
2346	CID1190	CAT003	ITM019	0	0	0	0	0	0	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2347	CID1190	CAT003	ITM020	0	0	0	0	0	0	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2348	CID1190	CAT003	ITM021	0	0	0	0	0	0	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2349	CID1191	CAT004	ITM027	0	0	0	0	0	0	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2350	CID1191	CAT004	ITM028	0	0	0	0	0	0	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2351	CID339	CAT003	ITM024	15+15+53	53	15	15	20	50	36	91.44	91.44	HDPE	MAS024	TRUE	Kg.	1	20K/Bag	T-Shirt		75.9	30		\N	\N	\N	\N
2352	CID1145	CAT003	ITM018	8+8+25	25	8	8	12	30	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	2oKg/Bag	T-Shirt		8.7	30		\N	\N	\N	\N
2353	CID1877	CAT012	ITM049	10+10+40	40	10	10	0	0	28	71.12	71.12	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
2354	CID1192	CAT004	ITM019	10+10+28	28	10	10	24	60	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		23.4	20		\N	\N	\N	\N
2355	CID1192	CAT004	ITM020	10+10+32	32	10	10	24	60	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		28.5	20		\N	\N	\N	\N
2356	CID1193	CAT003	ITM019	8+8+27	27	8	8	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		15.7	30		\N	\N	\N	\N
2357	CID1193	CAT003	ITM026	7+7+20	20	7	7	16	40	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		9.7	30		\N	\N	\N	\N
2358	CID1194	CAT003	ITM019	8+8+25	25	8	8	16	40	18	45.72	45.72	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt		15	30		\N	\N	\N	\N
2359	CID1194	CAT003	ITM020	10+10+35	35	10	10	16	40	20	50.8	50.8	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	T-Shirt		22.4	30		\N	\N	\N	\N
2360	CID1195	CAT003	ITM020	10+10+32	32	10	10	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		17.6	30	Bahrin	\N	\N	\N	\N
2361	CID1197	CAT004	ITM021	9+9+33	33	9	9	32	80	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		37.3	20		\N	\N	\N	\N
2362	CID1197	CAT004	ITM022	14+14+46	46	14	14	32	80	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		72.2	20		\N	\N	\N	\N
2363	CID1197	CAT004	ITM023	18+18+64	64	18	18	32	80	30	76.2	76.2	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		121.9	20		\N	\N	\N	\N
2364	CID1199	CAT004	ITM019	20	20	0	0	16	80	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.8	20		\N	\N	\N	\N
2365	CID1199	CAT004	ITM021	30	30	0	0	16	80	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		17.1	20		\N	\N	\N	\N
2366	CID1200	CAT004	ITM021	13+13+38	38	13	13	0	0	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	20	20K/Bag	Banana		0	20		\N	\N	\N	\N
2367	CID1201	CAT003	ITM019	8+8+26	26	8	8	15	37	16	40.64	40.64	HDPE	MAS004	TRUE	Kg.	20	20K/Bag	T-Shirt		12.6	30		\N	\N	\N	\N
2368	CID1201	CAT003	ITM020	10+10+30	30	10	10	17	42	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	20	20K/Bag	T-Shirt		21.3	30		\N	\N	\N	\N
2369	CID1201	CAT003	ITM021	12+12+33	33	12	12	20	50	24	60.96	60.96	HDPE	MAS004	TRUE	Kg.	20	20K/Bag	T-Shirt		34.7	30		\N	\N	\N	\N
2370	CID1201	CAT007	ITM040	16	16	0	0	12	60	10	25.4	25.4	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		4.9	0		\N	\N	\N	\N
2371	CID1201	CAT007	ITM041	22	22	0	0	12	60	14	35.56	35.56	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		9.4	0		\N	\N	\N	\N
2372	CID1201	CAT007	ITM042	28	28	0	0	15	75	16	40.64	40.64	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		17.1	0		\N	\N	\N	\N
2373	CID1201	CAT007	ITM043	30	30	0	0	18	90	18	45.72	45.72	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		24.7	0		\N	\N	\N	\N
2374	CID1202	CAT004	ITM020	13+13+37	37	13	13	40	100	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		64	20		\N	\N	\N	\N
2375	CID1202	CAT004	ITM021	15+15+47	47	15	15	40	100	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		86.1	20		\N	\N	\N	\N
2376	CID1203	CAT004	ITM019	30	30	0	0	0	0	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
2377	CID1203	CAT004	ITM020	42	42	0	0	0	0	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
2378	CID1203	CAT004	ITM021	55	55	0	0	0	0	26	66.04	66.04	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
2379	CID897	CAT004	ITM029	10+10+40	40	10	10	36	90	20	50.8	50.8	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		54.9	20		\N	\N	\N	\N
2380	CID1204	CAT004	ITM027	27+6+6	27	6	6	45	112	14	35.56	35.56	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		31.1	20		\N	\N	\N	\N
2381	CID1210	CAT008	ITM044	14	14	0	0	14	70	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		8	0		\N	\N	\N	\N
2382	CID897	CAT004	ITM029	5+5+25	25	5	5	30	75	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		21.3	0		\N	\N	\N	\N
2383	CID1212	CAT003	ITM019	6+6+22	22	6	6	14	35	16	40.64	40.64	HDPE	MAS004	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		9.7	30		\N	\N	\N	\N
2384	CID1212	CAT003	ITM021	9+9+32	32	9	9	15	37	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		18.8	30		\N	\N	\N	\N
2385	CID1212	CAT003	ITM022	11+11+40	40	11	11	16	40	24	60.96	60.96	HDPE	MAS004	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		30.2	30		\N	\N	\N	\N
2386	CID1177	CAT004	ITM027	6+6+27	27	6	6	40	100	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		27.7	20		\N	\N	\N	\N
2387	CID1877	CAT012	ITM049	5+5+30	30	5	5	47	117	20	50.8	50.8	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		47.5	20		\N	\N	\N	\N
2388	CID1213	CAT009	ITM045	49	49	0	0	17	85	28	71.12	71.12	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		59.2	20		\N	\N	\N	\N
2389	CID1182	CAT003	ITM019	7+7+27	27	7	7	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		15	0		\N	\N	\N	\N
2390	CID142	CAT010	ITM046	80+27.5+27.5	80	27.5	27.5	11	27	0	0	0	HDPE	MAS056	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2391	CID142	CAT010	ITM046	80+27.5+27.5	80	27.5	27.5	11	27	0	0	0	HDPE	MAS077	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2392	CID1214	CAT003	ITM020	12+12+33	33	12	12	36	90	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		57.3	30	53grams/piece	\N	\N	\N	\N
2393	CID1214	CAT003	ITM021	15+15+40	40	15	15	36	90	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		83.2	30	76grams/piece	\N	\N	\N	\N
2394	CID1216	CAT003	ITM020	9+9+28	28	9	9	10	25	18	45.72	45.72	HDPE	MAS087	TRUE	Kg.	1	20K/Bag	None		10.5	0		\N	\N	\N	\N
2395	CID1216	CAT003	ITM021	13+13+37	37	13	13	12	30	24	60.96	60.96	HDPE	MAS087	TRUE	Kg.	1	20K/Bag	None		23	0		\N	\N	\N	\N
2396	CID1216	CAT003	ITM022	13+13+44	44	13	13	14	35	32	81.28	81.28	HDPE	MAS087	TRUE	Kg.	1	20K/Bag	None		39.8	0		\N	\N	\N	\N
2397	CID1217	CAT008	ITM045	10+10+32	32	10	10	40	100	0	55	55	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		57.2	0		\N	\N	\N	\N
2398	CID1218	CAT004	ITM028	13+13+37	37	13	13	40	100	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		64	20		\N	\N	\N	\N
2399	CID1219	CAT003	ITM020	8.5+8.5+26.5	26.5	8.5	8.5	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	15Kg/Bag	T-Shirt w/Hook	Printed	14.7	30		\N	\N	\N	\N
2400	CID1220	CAT005	ITM033	0	0	0	0	4	20	0	110	110	HDPE	MAS005	TRUE	5 Roll	0.7	(5Rx10)/Bag	None	Tawuniya	0	0		\N	\N	\N	\N
2401	CID1221	CAT003	ITM019	7+7+25	25	7	7	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		10.1	30		\N	\N	\N	\N
2402	CID1221	CAT003	ITM020	10+10+31	31	10	10	13	32	20	50.8	50.8	HDPE	MAS089	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.6	30		\N	\N	\N	\N
2403	CID1221	CAT003	ITM021	12+12+35	35	12	12	16	40	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		26.4	30		\N	\N	\N	\N
2404	CID1221	CAT005	ITM033	9+9+32	32	9	9	4	10	0	110	110	HDPE	MAS089	TRUE	Roll	1	20K/Bag	None	Plain	11	0		\N	\N	\N	\N
2405	CID919	CAT004	ITM032	10+10+70	70	10	10	26	65	39	99.06	99.06	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	Banana		115.9	20		\N	\N	\N	\N
2406	CID038	CAT002	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.8	10R/Bag	None	Ahmad Saad (Busaad Plastic)	0	0		\N	\N	\N	\N
2407	CID038	CAT002	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.8	10R/Bag	None	Ahmad Saad (Busaad Plastic)	0	0		\N	\N	\N	\N
2408	CID1147	CAT004	ITM028	7+7+31	31	7	7	25	62	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		22.7	20		\N	\N	\N	\N
2409	CID1222	CAT006	ITM036	50	50	0	0	6	30	20	50.8	50.8	HDPE	MAS005	TRUE	Box	10	1Kg/P x 10P/Box	None		15.2	0		\N	\N	\N	\N
2410	CID149	CAT003	ITM019	9+9+30	30	9	9	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.2	30		\N	\N	\N	\N
2411	CID038	CAT006	ITM037	55	55	0	0	4.5	22	0	110	110	HDPE	MAS055	TRUE	Roll	0.8	8R/Bag	None	Ahmad Saad (Busaad Plastic)	26.6	0		\N	\N	\N	\N
2412	CID1223	CAT003	ITM019	6+6+22	22	6	6	16	40	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		11.1	30		\N	\N	\N	\N
2413	CID1223	CAT003	ITM020	8+8+25	25	8	8	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		15	30		\N	\N	\N	\N
2414	CID1223	CAT003	ITM021	9+9+32	32	9	9	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		20.3	30		\N	\N	\N	\N
2415	CID1224	CAT004	ITM027	22	22	0	0	8	40	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		5.4	0		\N	\N	\N	\N
2416	CID438	CAT004	ITM032	15+15+60	60	15	15	40	100	39	99.06	99.06	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		178.3	20		\N	\N	\N	\N
2417	CID1224	CAT004	ITM028	35	35	0	0	10	50	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		14.2	0		\N	\N	\N	\N
2418	CID1224	CAT004	ITM029	4+4+45	45	4	4	24	60	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		35.5	0		\N	\N	\N	\N
2419	CID1225	CAT003	ITM019	9+9+30	30	9	9	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.2	30		\N	\N	\N	\N
2420	CID1225	CAT003	ITM020	9+9+30	30	9	9	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18	30		\N	\N	\N	\N
2421	CID1225	CAT003	ITM021	12+12+42	42	12	12	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		33.8	30		\N	\N	\N	\N
2422	CID1226	CAT003	ITM019	6+6+21	21	6	6	15	37	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		9.9	30		\N	\N	\N	\N
2423	CID1226	CAT003	ITM020	7+7+26	26	7	7	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.5	30		\N	\N	\N	\N
2424	CID1226	CAT003	ITM021	10+10+30	30	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.6	30		\N	\N	\N	\N
2425	CID1227	CAT003	ITM019	8+8+28	28	8	8	25	62	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.2	30		\N	\N	\N	\N
2426	CID1227	CAT003	ITM020	10+10+30	30	10	10	28	70	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		35.6	30		\N	\N	\N	\N
2427	CID1227	CAT003	ITM021	13+13+39	39	13	13	35	87	30	76.2	76.2	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		86.2	30		\N	\N	\N	\N
2428	CID650	CAT004	ITM027	25.5	25.5	0	0	12	60	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		10.9	20		\N	\N	\N	\N
2429	CID650	CAT004	ITM028	40.5	40.5	0	0	16	80	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		32.9	20		\N	\N	\N	\N
2430	CID978	CAT004	ITM099	46	46	0	0	20	100	24	60.96	60.96	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		56.1	20		\N	\N	\N	\N
2431	CID860	CAT004	ITM030	45+9+9	45	9	9	27	67	28	71.12	71.12	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		60	20		\N	\N	\N	\N
2432	CID574	CAT004	ITM032	69+18+18	69	18	18	28	70	39	100	100	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		147	20		\N	\N	\N	\N
2433	CID1228	CAT008	ITM044	28	28	0	0	14	70	0	56	56	LLDPE	MAS001	FALSE	Packet	1	20K/Bag	None	Plain	22	0		\N	\N	\N	\N
2434	CID1229	CAT003	ITM020	10+10+32	32	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		15.8	30		\N	\N	\N	\N
2435	CID1229	CAT003	ITM021	10+10+33	33	10	10	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		22.6	30		\N	\N	\N	\N
2436	CID1191	CAT008	ITM044	25	25	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		8.9	0		\N	\N	\N	\N
2437	CID860	CAT004	ITM032	19+19+70	70	19	19	30	75	0	100	100	HDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		162	20		\N	\N	\N	\N
2438	CID1230	CAT004	ITM028	13+13+37	37	13	13	40	100	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		64	20		\N	\N	\N	\N
2439	CID1230	CAT004	ITM029	15+15+47	47	15	15	40	100	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		86.1	20		\N	\N	\N	\N
2440	CID1231	CAT004	ITM028	13+13+37	37	13	13	32	80	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		51.2	20		\N	\N	\N	\N
2441	CID1232	CAT004	ITM029	53.5	53.5	0	0	30	150	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		97.8	20		\N	\N	\N	\N
2442	CID240	CAT004	ITM028	5.5+5.5+30	30	5.5	5.5	20	50	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		16.7	20		\N	\N	\N	\N
2443	CID240	CAT003	ITM021	10+10+40	40	10	10	25	62	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		41.6	30		\N	\N	\N	\N
2444	CID779	CAT008	ITM071	14+14+50	50	14	14	20	50	0	87	87	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		67.9	0		\N	\N	\N	\N
2445	CID1233	CAT012	ITM051	6+6+25	25	6	6	60	150	20	50.8	50.8	LLDPE	MAS081	TRUE	Kg.	1	20K/Bag	Banana		56.4	20		\N	\N	\N	\N
2446	CID1234	CAT004	ITM027	7+7+25	25	7	7	38	95	18	45.72	45.72	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		33.9	20		\N	\N	\N	\N
2447	CID1234	CAT004	ITM028	8+8+33	33	8	8	38	95	20	50.8	50.8	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		47.3	20		\N	\N	\N	\N
2448	CID1234	CAT004	ITM029	8+8+40	40	8	8	38	95	24	60.96	60.96	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		64.9	20		\N	\N	\N	\N
2449	CID1219	CAT003	ITM022	10.5+10.5+34	34	10.5	10.5	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		26.8	30		\N	\N	\N	\N
2450	CID1235	CAT003	ITM021	9+9+32	32	9	9	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		17.8	30		\N	\N	\N	\N
2451	CID1236	CAT004	ITM028	6+6+30	30	6	6	28	70	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		26.9	20		\N	\N	\N	\N
2452	CID1236	CAT004	ITM029	7+7+40	40	7	7	28	70	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		46.1	20		\N	\N	\N	\N
2453	CID1237	CAT003	ITM021	12+12+37	37	12	12	19	47	24	60.96	60.96	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt		35	30		\N	\N	\N	\N
2454	CID978	CAT012	ITM027	4+4+20	20	4	4	40	100	14	35.56	35.56	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	Banana		19.9	20		\N	\N	\N	\N
2455	CID1238	CAT003	ITM022	11+11+38	38	11	11	18	45	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		35.7	30		\N	\N	\N	\N
2456	CID1238	CAT003	ITM023	14+14+54	54	14	14	20	50	39	99.06	99.06	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		81.2	30		\N	\N	\N	\N
2457	CID1238	CAT003	ITM024	20+20+80	80	20	20	20	50	24	120	120	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		144	30		\N	\N	\N	\N
2458	CID864	CAT012	ITM049	7+7+30	30	7	7	55	137	22	55.88	55.88	LLDPE	MAS104	TRUE	Kg.	1	20K/Bag	Banana		67.4	20		\N	\N	\N	\N
2459	CID1877	CAT012	ITM049	10+10+35	35	10	10	50	125	24	60.96	60.96	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		83.8	20		\N	\N	\N	\N
2460	CID1877	CAT012	ITM049	10+10+35	35	10	10	50	125	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		83.8	20		\N	\N	\N	\N
2461	CID1877	CAT012	ITM049	5+5+22	22	5	5	60	150	16	40.64	40.64	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		39	20		\N	\N	\N	\N
2462	CID513	CAT009	ITM044	30	30	0	0	20	100	0	50	50	LLDPE	MAS001	FALSE	Packet	1	20K/Bag	None		30	0		\N	\N	\N	\N
2463	CID513	CAT009	ITM056	62	62	0	0	15	75	0	102	102	LLDPE	MAS001	FALSE	Packet	1	20K/Bag	None		94.9	0		\N	\N	\N	\N
2464	CID513	CAT009	ITM057	0	0	0	0	0	0	0	0	0	LLDPE	MAS001	FALSE	Packet	1	20K/Bag	None		0	0		\N	\N	\N	\N
2465	CID1239	CAT004	ITM028	13+13+37	37	13	13	40	100	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		64	20		\N	\N	\N	\N
2466	CID1239	CAT004	ITM029	15+15+47	47	15	15	40	100	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		86.1	20		\N	\N	\N	\N
2467	CID1240	CAT003	ITM019	6+6+22	22	6	6	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		9.7	30		\N	\N	\N	\N
2468	CID1240	CAT003	ITM020	8+8+25	25	8	8	14	35	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		13.1	30		\N	\N	\N	\N
2469	CID1240	CAT003	ITM021	9+9+32	32	9	9	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		17.8	30		\N	\N	\N	\N
2470	CID1326	CAT003	ITM023	12+12+43	43	12	12	15	37	24	60.96	60.96	HDPE	MAS060	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		30.2	30		\N	\N	\N	\N
2471	CID1233	CAT012	ITM052	6+6+26	26	6	6	50	125	24	60.96	60.96	LLDPE	MAS014	TRUE	Kg.	1	20K/Bag	Banana		57.9	20		\N	\N	\N	\N
2472	CID503	CAT007	ITM054	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	4	200G/P x 20P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2473	CID1241	CAT009	ITM045	60	60	0	0	30	150	39	99.06	99.06	LLDPE	MAS005	TRUE	Roll	10	10P/Bag	None		178.3	0		\N	\N	\N	\N
2474	CID1242	CAT003	ITM022	11+11+44	44	11	11	23	57	32	81.28	81.28	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		61.2	30		\N	\N	\N	\N
2475	CID1242	CAT003	ITM023	13+13+61	61	13	13	28	70	39	99.06	99.06	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		120.7	30		\N	\N	\N	\N
2476	CID1205	CAT004	ITM027	23	23	0	0	24	120	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		19.6	20		\N	\N	\N	\N
2477	CID1205	CAT004	ITM028	34	34	0	0	24	120	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		37.3	20		\N	\N	\N	\N
2478	CID1205	CAT004	ITM029	4+4+40	40	4	4	30	75	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		40.2	20		\N	\N	\N	\N
2479	CID1243	CAT004	ITM028	9+9+33	33	9	9	20	50	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		25.9	20		\N	\N	\N	\N
2480	CID1245	CAT011	ITM047	41	41	0	0	20	100	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		50	0		\N	\N	\N	\N
2481	CID1246	CAT012	ITM049	5+5+24	24	5	5	55	137	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		37.9	20		\N	\N	\N	\N
2482	CID1246	CAT012	ITM051	5+5+25	25	5	5	55	137	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		43.8	20		\N	\N	\N	\N
2483	CID1246	CAT012	ITM052	6+6+25	25	6	6	55	137	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		61.8	20		\N	\N	\N	\N
2484	CID1247	CAT004	ITM028	9+9+37	37	9	9	40	100	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		55.9	20		\N	\N	\N	\N
2485	CID1247	CAT004	ITM029	15+15+47	47	15	15	40	100	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		86.1	20		\N	\N	\N	\N
2486	CID1247	CAT008	ITM041	20	20	0	0	10	50	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		8.1	20		\N	\N	\N	\N
2487	CID1247	CAT008	ITM042	25.5	25.5	0	0	10	50	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		11.7	0		\N	\N	\N	\N
2488	CID1248	CAT004	ITM027	25	25	0	0	20	100	12	30.48	30.48	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		15.2	20		\N	\N	\N	\N
2489	CID1249	CAT004	ITM027	25	25	0	0	20	100	12	30.48	30.48	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		15.2	20		\N	\N	\N	\N
2490	CID1250	CAT004	ITM028	8+8+24	24	8	8	25	62	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		17.6	20		\N	\N	\N	\N
2491	CID1250	CAT004	ITM029	9+9+27	27	9	9	25	62	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		25.5	20		\N	\N	\N	\N
2492	CID1251	CAT003	ITM019	7+7+21	21	7	7	10	25	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		7.1	30		\N	\N	\N	\N
2493	CID1251	CAT003	ITM020	9+9+27	27	9	9	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.3	30		\N	\N	\N	\N
2494	CID1251	CAT003	ITM021	8+8+29	29	8	8	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		19.2	30		\N	\N	\N	\N
2495	CID1252	CAT004	ITM027	6+6+36	36	6	6	22	55	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		24.1	20		\N	\N	\N	\N
2496	CID1252	CAT004	ITM028	8+8+40	40	8	8	22	55	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		31.3	20		\N	\N	\N	\N
2497	CID1252	CAT004	ITM029	10+10+42	42	10	10	22	55	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		41.6	20		\N	\N	\N	\N
2498	CID1253	CAT003	ITM019	8+8+22	22	8	8	10	25	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		7.7	30		\N	\N	\N	\N
2499	CID1253	CAT003	ITM020	10+10+31	31	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		19.2	30		\N	\N	\N	\N
2500	CID1253	CAT003	ITM021	11+11+34	34	11	11	15	37	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		29.5	30		\N	\N	\N	\N
2502	CID1254	CAT003	ITM020	10+10+35	35	10	10	16	40	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		24.6	30		\N	\N	\N	\N
2503	CID1255	CAT003	ITM020	9+9+30	30	9	9	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		30.2	30		\N	\N	\N	\N
2504	CID1255	CAT003	ITM021	12+12+40	40	12	12	25	62	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		56.4	30		\N	\N	\N	\N
2505	CID1255	CAT003	ITM022	15+15+51	51	15	15	25	62	34	86.36	86.36	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		86.7	30		\N	\N	\N	\N
2506	CID1255	CAT008	ITM044	20	20	0	0	10	50	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		6.1	0		\N	\N	\N	\N
2507	CID1256	CAT004	ITM028	13+13+37	37	13	13	28	70	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		44.8	20		\N	\N	\N	\N
2508	CID1256	CAT004	ITM029	15+15+47	47	15	15	28	70	22	55.88	55.88	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		60.2	20		\N	\N	\N	\N
2509	CID1257	CAT004	ITM051	6+6+25	25	6	6	60	150	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		62	20		\N	\N	\N	\N
2510	CID1257	CAT012	ITM052	6+6+26	26	6	6	60	150	26	66.04	66.04	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		75.3	20		\N	\N	\N	\N
2511	CID1172	CAT003	ITM020	8+8+30	30	8	8	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		18.7	30		\N	\N	\N	\N
2512	CID1258	CAT004	ITM028	8+8+39	39	8	8	35	87	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		48.6	20		\N	\N	\N	\N
2513	CID1258	CAT004	ITM029	12+12+48	48	12	12	35	87	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		76.4	20		\N	\N	\N	\N
2514	CID1228	CAT008	ITM056	18+18+78	78	18	18	22	55	0	60	60	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		75.2	0		\N	\N	\N	\N
2515	CID847	CAT003	ITM020	7+7+27	27	7	7	12	30	0	50	50	HDPE	MAS079	FALSE	Kg.	1	20K/Bag	T-Shirt		12.3	30		\N	\N	\N	\N
2516	CID1259	CAT001	ITM006	15+15+50	50	15	15	8	20	0	90	90	Regrind	MAS003	FALSE	Packet	1	20K/Bag	None	Senta Lena	28.8	0		\N	\N	\N	\N
2517	CID1163	CAT004	ITM029	8+8+40	40	8	8	30	75	20	50.8	50.8	LLDPE	MAS048	TRUE	Kg.	1	20K/Bag	Banana		42.7	20		\N	\N	\N	\N
2518	CID1260	CAT012	ITM049	6+6+23	23	6	6	50	125	16	40.64	40.64	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		35.6	20		\N	\N	\N	\N
2519	CID1260	CAT012	ITM051	6+6+25	25	6	6	60	150	20	50.8	50.8	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		56.4	20		\N	\N	\N	\N
2520	CID1167	CAT004	ITM027	25	25	0	0	16	80	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		14.2	20		\N	\N	\N	\N
2521	CID1261	CAT004	ITM028	13+13+40	40	13	13	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		41.6	20		\N	\N	\N	\N
2522	CID1262	CAT005	ITM033	10+10+35	35	10	10	4	10	20	110	110	HDPE	MAS005	TRUE	Box	3	600G/Roll x 5R/Box	None	Tawos Al-Janah Super Market	12.1	0		\N	\N	\N	\N
2523	CID1262	CAT006	ITM038	60	60	0	0	7	35	20	140	140	LLDPE	MAS005	TRUE	Roll	2.5	4R/Bag	None	Tawos Al-Janah Super Market	58.8	0		\N	\N	\N	\N
2524	CID1263	CAT004	ITM026	22.5	22.5	0	0	17	85	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		11.7	20		\N	\N	\N	\N
2525	CID1263	CAT004	ITM027	5+5+24	24	5	5	42	105	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		29	20		\N	\N	\N	\N
2526	CID1264	CAT003	ITM020	9+9+31	31	9	9	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		18.4	30		\N	\N	\N	\N
2527	CID1264	CAT003	ITM021	13+13+37	37	13	13	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		30.7	30		\N	\N	\N	\N
2528	CID1264	CAT003	ITM022	13+13+44	44	13	13	18	45	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		51.2	30		\N	\N	\N	\N
2529	CID1265	CAT003	ITM020	9+9+30	30	9	9	14	35	18	45.72	45.72	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook	5	15.4	30		\N	\N	\N	\N
2530	CID1266	CAT003	ITM019	6+6+23	23	6	6	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	8.5	30		\N	\N	\N	\N
2531	CID1266	CAT003	ITM020	8+8+28	28	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		12.1	30		\N	\N	\N	\N
2532	CID1266	CAT003	ITM021	9+9+32	32	9	9	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		17.8	30		\N	\N	\N	\N
2533	CID1266	CAT003	ITM023	11+11+40	40	11	11	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		26.5	30		\N	\N	\N	\N
2534	CID1267	CAT003	ITM019	7+7+26	26	7	7	15	37	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	15Kg/Bag	T-Shirt w/Hook		12	30		\N	\N	\N	\N
2535	CID1268	CAT003	ITM020	9+9+28	28	9	9	10	25	18	45.72	45.72	HDPE	MAS094	TRUE	Kg.	1	20K/Bag	T-Shirt		10.5	30		\N	\N	\N	\N
2536	CID1268	CAT003	ITM021	13+13+37	37	13	13	12	30	24	60.96	60.96	HDPE	MAS094	TRUE	Kg.	1	20K/Bag	T-Shirt		23	30		\N	\N	\N	\N
2537	CID1268	CAT003	ITM022	13+13+44	44	13	13	14	35	32	81.28	81.28	HDPE	MAS094	TRUE	Kg.	1	20K/Bag	T-Shirt		39.8	30		\N	\N	\N	\N
2538	CID202	CAT008	ITM095	8+8+43	43	8	8	40	100	0	59	59	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		69.6	0		\N	\N	\N	\N
2539	CID202	CAT008	ITM096	10+10+37	37	10	10	40	100	0	71	71	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		80.9	0		\N	\N	\N	\N
2540	CID202	CAT007	ITM089	7+7+32	32	7	7	40	100	0	69	69	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		63.5	0		\N	\N	\N	\N
2541	CID202	CAT008	ITM081	9+9+37	37	9	9	40	100	0	89	89	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		97.9	0		\N	\N	\N	\N
2542	CID202	CAT007	ITM085	6+6+33	33	6	6	40	100	0	61	61	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		54.9	0		\N	\N	\N	\N
2543	CID402	CAT008	ITM044	12	12	0	0	10	50	0	18	18	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		2.2	0		\N	\N	\N	\N
2544	CID402	CAT008	ITM056	12	12	0	0	10	50	0	19	19	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		2.3	0		\N	\N	\N	\N
2545	CID402	CAT008	ITM057	11	11	0	0	10	50	0	18	18	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		2	0		\N	\N	\N	\N
2546	CID1269	CAT003	ITM021	10+10+32	32	10	10	12	30	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		19	30		\N	\N	\N	\N
2547	CID1934	CAT012	ITM049	6+6+22	22	6	6	50	125	16	40.64	40.64	LLDPE	MAS024	TRUE	Kg.	1	20K/Bag	Banana		34.5	20		\N	\N	\N	\N
2548	CID1270	CAT003	ITM019	9+9+27	27	9	9	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		15.2	30		\N	\N	\N	\N
2549	CID1270	CAT003	ITM020	10+10+31	31	10	10	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		20.7	30		\N	\N	\N	\N
2550	CID1270	CAT003	ITM021	11+11+33	33	11	11	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		30.2	30		\N	\N	\N	\N
2551	CID1270	CAT003	ITM022	12+12+44	44	12	12	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		55.3	30		\N	\N	\N	\N
2552	CID1189	CAT003	ITM019	7+7+29	29	7	7	10	25	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		10.9	30		\N	\N	\N	\N
2553	CID1271	CAT004	ITM028	5+5+30	30	5	5	44	110	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.8	20		\N	\N	\N	\N
2554	CID1272	CAT003	ITM020	8+8+27	27	8	8	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		16.2	0		\N	\N	\N	\N
2555	CID1272	CAT003	ITM021	12+12+36	36	12	12	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		32.9	0		\N	\N	\N	\N
2556	CID1272	CAT003	ITM022	9+9+40	40	9	9	20	50	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		41.2	0		\N	\N	\N	\N
2557	CID1272	CAT003	ITM023	14+14+46	46	14	14	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		60.1	0		\N	\N	\N	\N
2558	CID004	CAT001	ITM006	15+15+50	50	15	15	10	25	0	90	90	Regrind	MAS004	FALSE	Packet	1.5	10P/Bag	None	Plain	36	0		\N	\N	\N	\N
2559	CID1219	CAT003	ITM019	8+8+23.5	23.5	8	8	15	37	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		11.9	30		\N	\N	\N	\N
2560	CID1186	CAT003	ITM023	14+14+55	55	14	14	15	37	39	99.06	99.06	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		60.8	30		\N	\N	\N	\N
2561	CID1273	CAT003	ITM020	8+8+30	30	8	8	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		18.7	30		\N	\N	\N	\N
2562	CID1273	CAT003	ITM021	8+8+30	30	8	8	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		22.4	30		\N	\N	\N	\N
2563	CID1273	CAT003	ITM022	10+10+40	40	10	10	20	50	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		39.6	30		\N	\N	\N	\N
2564	CID1273	CAT006	ITM038	60	60	0	0	8	40	0	120	120	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None		57.6	0		\N	\N	\N	\N
2565	CID1274	CAT003	ITM019	9+9+29	29	9	9	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.9	30		\N	\N	\N	\N
2566	CID1274	CAT003	ITM020	10.5+10.5+34.5	34.5	10.5	10.5	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		20.9	30		\N	\N	\N	\N
2567	CID1275	CAT004	ITM027	25	25	0	0	17	85	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		13	20		\N	\N	\N	\N
2568	CID1004	CAT001	ITM003	0	0	0	0	4	20	0	0	0	HDPE	MAS079	FALSE	Box	2.5	17P/Box	None	Plain	0	0		\N	\N	\N	\N
2569	CID1245	CAT011	ITM078	47	47	0	0	28	140	30	76.2	76.2	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		100.3	0		\N	\N	\N	\N
2570	CID690	CAT001	ITM009	17+17+58	58	17	17	36	90	0	112	112	HDPE	MAS005	FALSE	Packet	2	10P/Bag	None	Plain	185.5	0		\N	\N	\N	\N
2571	CID1276	CAT004	ITM027	25	25	0	0	30	150	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		26.7	20		\N	\N	\N	\N
2572	CID1277	CAT004	ITM028	9+9+30	30	9	9	25	62	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		27.2	20		\N	\N	\N	\N
2573	CID1277	CAT004	ITM029	12+12+46	46	12	12	35	87	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		68.1	20		\N	\N	\N	\N
2574	CID1277	CAT004	ITM030	13+13+60	60	13	13	35	87	32	81.28	81.28	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		121.6	20		\N	\N	\N	\N
2575	CID1278	CAT004	ITM028	7+7+40	40	7	7	40	100	20	50.8	50.8	HDPE	MAS087	TRUE	Kg.	1	20K/Bag	Banana		54.9	20		\N	\N	\N	\N
2576	CID1279	CAT004	ITM028	10+10+40	40	10	10	35	87	20	50.8	50.8	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		53	20		\N	\N	\N	\N
2577	CID1279	CAT004	ITM029	10+10+50	50	10	10	35	87	24	60.96	60.96	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		74.2	20		\N	\N	\N	\N
2578	CID004	CAT001	ITM003	12+12+30	30	12	12	12	30	0	70	70	HDPE	MAS003	FALSE	Packet	1	1K/P x 20P/Bag	None	Plain	22.7	0		\N	\N	\N	\N
2579	CID004	CAT001	ITM006	15+15+50	50	15	15	10	25	0	90	90	Regrind	MAS003	FALSE	Packet	1.5	1.5/P x 5P/Bag	None	Plain	36	0		\N	\N	\N	\N
2580	CID423	CAT006	ITM036	50	50	0	0	8	40	0	110	110	LLDPE	MAS093	FALSE	Roll	1.8	10R/Bag	None		44	0		\N	\N	\N	\N
2581	CID423	CAT006	ITM036	50	50	0	0	8	40	0	110	110	LLDPE	MAS092	FALSE	Roll	1.8	10R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
2582	CID1280	CAT004	ITM029	14+14+42	42	14	14	40	100	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		85.3	20		\N	\N	\N	\N
2583	CID1281	CAT003	ITM019	7+7+22	22	7	7	12	30	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		7.7	30		\N	\N	\N	\N
2584	CID1281	CAT003	ITM020	9+9+27	27	9	9	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.3	30		\N	\N	\N	\N
2585	CID1281	CAT003	ITM021	11+11+32	32	11	11	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		23	30		\N	\N	\N	\N
2586	CID1282	CAT004	ITM028	9+9+31	31	9	9	22	55	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		21.9	20		\N	\N	\N	\N
2587	CID1283	CAT004	ITM028	8+8+39	39	8	8	35	87	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		48.6	20		\N	\N	\N	\N
2588	CID1284	CAT008	ITM045	5+5+22.5	22.5	5	5	18	45	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		14.9	0		\N	\N	\N	\N
2589	CID1207	CAT003	ITM020	8+8+28	28	8	8	18	45	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		20.1	30		\N	\N	\N	\N
2590	CID1285	CAT003	ITM019	10+10+30	30	10	10	24	60	16	40.64	40.64	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	T-Shirt		24.4	30		\N	\N	\N	\N
2591	CID1285	CAT003	ITM020	11+11+37	37	11	11	24	60	20	50.8	50.8	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	T-Shirt		36	30		\N	\N	\N	\N
2592	CID1285	CAT003	ITM021	13+13+44	44	13	13	24	60	24	60.96	60.96	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	T-Shirt		51.2	30		\N	\N	\N	\N
2593	CID1239	CAT004	ITM027	11+11+40	40	11	11	40	100	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		50.4	20		\N	\N	\N	\N
2594	CID1239	CAT004	ITM031	21+21+83	83	21	21	40	100	38	96.52	96.52	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		241.3	20		\N	\N	\N	\N
2595	CID202	CAT008	ITM079	11+11+30	30	11	11	40	100	0	76	76	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		79	0		\N	\N	\N	\N
2596	CID683	CAT003	ITM023	14+14+50	50	14	14	20	50	34	86.36	86.36	HDPE	MAS077	TRUE	Kg.	1	20K/Bag	T-Shirt		67.4	30		\N	\N	\N	\N
2597	CID1286	CAT004	ITM028	9+9+40	40	9	9	35	87	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		51.3	20		\N	\N	\N	\N
2598	CID1287	CAT004	ITM027	5+5+22	22	5	5	22	55	12	30.48	30.48	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		10.7	20		\N	\N	\N	\N
2599	CID1287	CAT004	ITM020	8+8+28	28	8	8	22	55	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		22.1	20		\N	\N	\N	\N
2600	CID1288	CAT004	ITM027	9+9+33	33	9	9	32	80	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		33.2	20		\N	\N	\N	\N
2601	CID1288	CAT004	ITM028	9+9+33	33	9	9	32	80	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		41.5	20		\N	\N	\N	\N
2602	CID1288	CAT004	ITM029	11+11+40	40	11	11	32	80	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		60.5	20		\N	\N	\N	\N
2603	CID1288	CAT004	ITM030	9+9+42	42	9	9	32	80	28	71.12	71.12	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		68.3	20		\N	\N	\N	\N
2604	CID1289	CAT008	ITM044	17	17	0	0	16	80	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		6.9	0		\N	\N	\N	\N
2605	CID004	CAT005	ITM033	0	0	0	0	4	20	0	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2606	CID1206	CAT004	ITM027	20	20	0	0	16	80	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.8	20		\N	\N	\N	\N
2607	CID1206	CAT004	ITM028	30	30	0	0	16	80	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		17.1	20		\N	\N	\N	\N
2608	CID1282	CAT004	ITM027	7+7+29	29	7	7	20	50	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.5	20		\N	\N	\N	\N
2609	CID649	CAT001	ITM007	18+18+50	50	18	18	13	32	0	100	100	Regrind	MAS003	FALSE	Packet	1.4	10P/Bag	None	We One Shopping Center	55	0		\N	\N	\N	\N
2610	CID1033	CAT004	ITM031	59+15+15	59	15	15	38	95	0	79	79	LLDPE	MAS055	FALSE	Kg.	1	20K/Bag	Banana		133.6	20		\N	\N	\N	\N
2611	CID1207	CAT003	ITM021	10+10+31	31	10	10	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		28	30		\N	\N	\N	\N
2612	CID1934	CAT012	ITM049	10+10+36	36	10	10	50	125	24	60.96	60.96	LLDPE	MAS024	TRUE	Kg.	1	20K/Bag	Banana		85.3	20		\N	\N	\N	\N
2613	CID1934	CAT012	ITM049	30	30	0	0	50	250	32	81.28	81.28	LLDPE	MAS024	TRUE	Kg.	1	20K/Bag	None		121.9	0		\N	\N	\N	\N
2614	CID1290	CAT003	ITM019	7+7+21	21	7	7	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		8.5	30		\N	\N	\N	\N
2615	CID1290	CAT003	ITM020	10+10+31	31	10	10	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.6	30		\N	\N	\N	\N
2616	CID1290	CAT003	ITM021	12+12+35	35	12	12	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23	30		\N	\N	\N	\N
2617	CID1934	CAT012	ITM049	36	36	0	0	35	175	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		76.8	0		\N	\N	\N	\N
2618	CID1291	CAT003	ITM020	9+9+33	33	9	9	20	50	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.9	30		\N	\N	\N	\N
2619	CID1292	CAT008	ITM044	25.5	25.5	0	0	15	75	0	45	45	LLDPE	MAS001	FALSE	Packet	1	20K/Bag	None	Plain	17.2	0		\N	\N	\N	\N
2620	CID1293	CAT003	ITM019	6+6+22	22	6	6	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	8.3	30		\N	\N	\N	\N
2621	CID1293	CAT003	ITM020	8+8+25	25	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	11.2	30		\N	\N	\N	\N
2622	CID1293	CAT003	ITM021	9+9+32	32	9	9	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	15.2	30		\N	\N	\N	\N
2623	CID1293	CAT003	ITM022	9+9+32	32	9	9	12	30	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	18.3	30		\N	\N	\N	\N
2624	CID1294	CAT004	ITM029	5+5+50	50	5	5	50	125	24	60.96	60.96	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		91.4	20		\N	\N	\N	\N
2625	CID1295	CAT004	ITM027	25.5	25.5	0	0	18	90	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		16.3	20		\N	\N	\N	\N
2626	CID1296	CAT004	ITM029	15+15+47	47	15	15	40	100	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		86.1	20		\N	\N	\N	\N
2627	CID1297	CAT008	ITM055	40.6	40.6	0	0	10	50	28	71.12	71.12	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		28.9	0		\N	\N	\N	\N
2628	CID1274	CAT009	ITM045	18	18	0	0	10	50	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		6.4	0		\N	\N	\N	\N
2629	CID1274	CAT009	ITM075	18	18	0	0	10	50	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		6.4	0		\N	\N	\N	\N
2630	CID1274	CAT009	ITM076	18	18	0	0	10	50	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		6.4	0		\N	\N	\N	\N
2631	CID1274	CAT009	ITM080	18	18	0	0	10	50	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		6.4	0		\N	\N	\N	\N
2632	CID1298	CAT003	ITM019	10+10+27	27	10	10	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.9	30		\N	\N	\N	\N
2633	CID1298	CAT003	ITM020	10+10+34	34	10	10	12	30	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.1	30		\N	\N	\N	\N
2634	CID1298	CAT003	ITM021	11+11+40	40	11	11	15	37	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		30.3	30		\N	\N	\N	\N
2635	CID1299	CAT003	ITM020	9+9+30	30	9	9	20	50	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.9	30		\N	\N	\N	\N
2636	CID1300	CAT003	ITM020	11+11+31	31	11	11	15	37	22	55.88	55.88	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.9	30		\N	\N	\N	\N
2637	CID1300	CAT003	ITM022	12+12+40	40	12	12	25	62	28	71.12	71.12	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		56.4	30		\N	\N	\N	\N
2638	CID1300	CAT005	ITM035	9+9+32	32	9	9	6	15	0	110	110	HDPE	MAS066	TRUE	Roll	1	20K/Bag	None	Plain	16.5	0		\N	\N	\N	\N
2639	CID1301	CAT004	ITM027	25	25	0	0	10	50	12	30.48	30.48	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		7.6	20		\N	\N	\N	\N
2640	CID1301	CAT004	ITM028	30	30	0	0	10	50	16	40.64	40.64	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		12.2	20		\N	\N	\N	\N
2641	CID1301	CAT004	ITM029	8+8+45	45	8	8	40	100	18	45.72	45.72	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		55.8	20		\N	\N	\N	\N
2642	CID1302	CAT004	ITM028	32	32	0	0	30	150	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		43.9	20		\N	\N	\N	\N
2643	CID1302	CAT004	ITM029	45	45	0	0	30	150	22	55.88	55.88	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		75.4	20		\N	\N	\N	\N
2644	CID1303	CAT003	ITM020	0	0	0	0	0	0	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
2645	CID1303	CAT003	ITM021	0	0	0	0	0	0	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
2646	CID1303	CAT003	ITM022	0	0	0	0	0	0	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
2653	CID202	CAT008	ITM082	12.5+12.5+43	43	12.5	12.5	40	100	0	73	73	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		99.3	0		\N	\N	\N	\N
2654	CID1305	CAT003	ITM019	10+10+25	25	10	10	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.2	30		\N	\N	\N	\N
2655	CID1305	CAT003	ITM020	10+10+35	35	10	10	15	37	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.7	30		\N	\N	\N	\N
2656	CID1306	CAT005	ITM035	12+12+32	32	12	12	9	22	0	140	140	HDPE	MAS078	FALSE	Roll	0.5	40R/Bag	None	Plain	34.5	0		\N	\N	\N	\N
2657	CID1306	CAT005	ITM035	12+12+30	30	12	12	9	22	22	120	120	HDPE	MAS078	TRUE	5 Roll	1	15Pcs/R x 5R/P	None	Plain	28.5	0		\N	\N	\N	\N
2658	CID1307	CAT004	ITM046	64	64	0	0	9	50	0	0	0	HDPE	MAS001	FALSE	Kg.	1	Roll	None		54.4	0		\N	\N	\N	\N
2659	CID1308	CAT004	ITM020	9+9+30	30	9	9	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.2	30		\N	\N	\N	\N
2660	CID1308	CAT004	ITM021	8+8+30	30	8	8	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		22.4	30		\N	\N	\N	\N
2661	CID1308	CAT004	ITM022	10+10+40	40	10	10	20	50	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		39.6	30		\N	\N	\N	\N
2662	CID1877	CAT012	ITM049	10+10+35	35	10	10	50	125	24	60.96	60.96	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		83.8	20	PT-180008	\N	\N	\N	\N
2663	CID1310	CAT004	ITM045	53	53	0	0	10	50	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2664	CID1311	CAT004	ITM019	6+6+22	22	6	6	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		9.7	30		\N	\N	\N	\N
2665	CID1311	CAT004	ITM020	9+9+30	30	9	9	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		30.2	30		\N	\N	\N	\N
2649	CID1304	CAT005	ITM035	31+7+7	31	7	7	3.5	8.75	20	51	110	HDPE	MAS005	TRUE	ROLL	0.8	15Pcs/R x 8P/Bag	None	Best	40.16	0	814Grams	8	6.40	\N	\N
2651	CID1304	CAT001	ITM006	50+12+12	50	12	12	10	25	0	95	95	Regrind	MAS003	No	Packet	0.8	25Pcs/P x 8P/Bag	None	Best	351.50	0	800 Grams	8	6.40	\N	\N
2652	CID1304	CAT001	ITM007	50+12+12	50	12	12	10	25	0	105	105	Regrind	MAS004	No	Packet	0.9	25Pcs/P x 8P/Bag	None	Best	388.50	0	900 Grams	8	7.20	\N	\N
2666	CID1311	CAT004	ITM021	11+11+34	34	11	11	18	45	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		28.2	30		\N	\N	\N	\N
2667	CID1278	CAT004	ITM027	5.5+5.5+30	30	5.5	5.5	20	50	16	40.64	40.64	HDPE	MAS087	TRUE	Kg.	1	20K/Bag	Banana		16.7	20		\N	\N	\N	\N
2668	CID1278	CAT004	ITM028	13+13+40	40	13	13	20	50	20	50.8	50.8	HDPE	MAS087	TRUE	Kg.	1	20K/Bag	Banana		33.5	20		\N	\N	\N	\N
2669	CID1312	CAT004	ITM020	10+10+30	30	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.2	30		\N	\N	\N	\N
2670	CID1312	CAT004	ITM021	11+11+37	37	11	11	19	47	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		33.8	30		\N	\N	\N	\N
2671	CID1312	CAT004	ITM036	50	50	0	0	6	30	20	100	100	LLDPE	MAS005	TRUE	Packet	1	20K/Bag	None	Plain	30	0		\N	\N	\N	\N
2672	CID038	CAT004	ITM037	55	55	0	0	4.5	22	0	110	110	HDPE	MAS005	TRUE	Roll	0.8	30Pcs/R x 8R/Bag	None	Ahmad Saad (Busaad Plastic)	26.6	0		\N	\N	\N	\N
2673	CID1313	CAT004	ITM027	8+8+28	28	8	8	20	50	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		20.1	20		\N	\N	\N	\N
2674	CID1314	CAT004	ITM019	9+9+28	28	9	9	16	40	18	45.72	45.72	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.8	30		\N	\N	\N	\N
2675	CID1314	CAT004	ITM020	10+10+30	30	10	10	17	42	22	55.88	55.88	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23.5	30		\N	\N	\N	\N
2676	CID1314	CAT004	ITM021	11+11+30	30	11	11	17	42	24	60.96	60.96	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		26.6	30		\N	\N	\N	\N
2677	CID1315	CAT004	ITM028	5+5+34	34	5	5	32	80	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		28.6	20		\N	\N	\N	\N
2678	CID1315	CAT004	ITM029	15+15+40	40	15	15	32	80	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		62.6	20		\N	\N	\N	\N
2679	CID1316	CAT004	ITM028	8+8+41	41	8	8	40	100	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		57.9	20		\N	\N	\N	\N
2680	CID1316	CAT004	ITM029	5+5+50	50	5	5	40	100	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		73.2	20		\N	\N	\N	\N
2681	CID848	CAT004	ITM021	10+10+35	35	10	10	23	57	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		38.2	30		\N	\N	\N	\N
2682	CID1317	CAT004	ITM028	7+7+37	37	7	7	40	100	20	50.8	50.8	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		51.8	20		\N	\N	\N	\N
2683	CID1317	CAT004	ITM029	15+15+46	46	15	15	40	100	24	60.96	60.96	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		92.7	20		\N	\N	\N	\N
2684	CID1300	CAT004	ITM021	11+11+34	34	11	11	23	57	24	60.96	60.96	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		38.9	30		\N	\N	\N	\N
2685	CID038	CAT004	ITM038	60	60	0	0	8	40	0	120	120	LLDPE	MAS005	TRUE	Roll	2	8R/Bag	None	Ahmad Saad (Busaad Plastic)	57.6	0		\N	\N	\N	\N
2686	CID038	CAT004	ITM037	55	55	0	0	4.5	22	0	110	110	HDPE	MAS005	TRUE	Roll	0.8	30Pcs/R x 8R/Bag	None	Ahmad Saad (Busaad Plastic)	26.6	0		\N	\N	\N	\N
2687	CID1318	CAT004	ITM027	10+10+30	30	10	10	20	50	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		22.9	20		\N	\N	\N	\N
2688	CID900	CAT004	ITM019	8+8+27	27	8	8	24	60	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		23.6	30		\N	\N	\N	\N
2689	CID900	CAT004	ITM020	10+10+30	30	10	10	24	60	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		30.5	30		\N	\N	\N	\N
2690	CID900	CAT004	ITM021	12+12+36	36	12	12	26	65	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		47.5	30		\N	\N	\N	\N
2691	CID900	CAT004	ITM022	15+15+46	46	15	15	26	65	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		70.3	30		\N	\N	\N	\N
2692	CID1319	CAT004	ITM028	5+5+28	28	5	5	40	100	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		34.7	20		\N	\N	\N	\N
2693	CID1320	CAT004	ITM027	8+8+28	28	8	8	30	75	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		30.2	20		\N	\N	\N	\N
2694	CID1320	CAT004	ITM028	8+8+38	38	8	8	30	75	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		41.1	20		\N	\N	\N	\N
2695	CID1320	CAT004	ITM029	8+8+45	45	8	8	30	75	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		51.1	20		\N	\N	\N	\N
2696	CID1320	CAT004	ITM022	13+13+40	40	13	13	22	55	30	76.2	76.2	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		55.3	30		\N	\N	\N	\N
2697	CID1321	CAT004	ITM028	10+10+45	45	10	10	36	90	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		59.4	20		\N	\N	\N	\N
2698	CID1321	CAT004	ITM029	15+15+65	65	15	15	36	90	30	76.2	76.2	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		130.3	20		\N	\N	\N	\N
2699	CID1322	CAT004	ITM036	50	50	0	0	8	40	0	0	0	LLDPE	MAS004	FALSE	Roll w/Core	0.5	20K/Bag	None	Shat Al-Arab	0	0		\N	\N	\N	\N
2700	CID617	CAT004	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS005	TRUE	Roll w/Core	1.8	10R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
2701	CID617	CAT004	ITM038	60	60	0	0	8	40	0	140	140	HDPE	MAS005	TRUE	Roll	1.8	10R/Bag	None	Modern Plastic Bag Factory	67.2	0		\N	\N	\N	\N
2702	CID1877	CAT012	ITM049	10+10+35	35	10	10	50	125	24	60.96	60.96	LLDPE	MAS052	TRUE	Kg.	1	20K/Bag	Banana		83.8	20		\N	\N	\N	\N
2703	CID1323	CAT004	ITM027	7+7+25	25	7	7	16	40	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		11.1	20		\N	\N	\N	\N
2704	CID1324	CAT004	ITM027	25	25	0	0	55	275	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		55.9	20		\N	\N	\N	\N
2705	CID1325	CAT004	ITM020	9+9+26	26	9	9	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	2oKg/Bag	T-Shirt w/Hook		12.5	30		\N	\N	\N	\N
2706	CID1325	CAT004	ITM021	11+11+35	35	11	11	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		24.3	30		\N	\N	\N	\N
2707	CID1325	CAT004	ITM022	13+13+45	45	13	13	14	35	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		40.4	30		\N	\N	\N	\N
2708	CID1326	CAT004	ITM019	6+6+24	24	6	6	15	37	14	35.56	35.56	HDPE	MAS060	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		9.5	30		\N	\N	\N	\N
2709	CID1326	CAT004	ITM020	8+8+26	26	8	8	15	37	16	40.64	40.64	HDPE	MAS060	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		12.6	30		\N	\N	\N	\N
2710	CID1326	CAT004	ITM021	12.5+12.5+35	35	12.5	12.5	15	37	20	50.8	50.8	HDPE	MAS060	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		22.6	30		\N	\N	\N	\N
2711	CID1326	CAT004	ITM022	11+11+36	36	11	11	15	37	24	60.96	60.96	HDPE	MAS060	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		26.2	30		\N	\N	\N	\N
2712	CID1327	CAT004	ITM019	8+8+22	22	8	8	15	37	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		11.4	30		\N	\N	\N	\N
2713	CID1327	CAT004	ITM020	10+10+25	25	10	10	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		15.2	30		\N	\N	\N	\N
2714	CID029	CAT005	ITM111	0	0	0	0	4	20	0	100	100	HDPE	MAS004	TRUE	6 Roll	1	20K/Bag	None	Modern Center Textiles	0	0		\N	\N	\N	\N
2715	CID1328	CAT004	ITM028	8+8+32	32	8	8	25	62	16	40.64	40.64	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		24.2	20		\N	\N	\N	\N
2716	CID1328	CAT004	ITM029	8+8+45	45	8	8	25	62	20	50.8	50.8	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		38.4	20		\N	\N	\N	\N
2717	CID142	CAT004	ITM045	10	10	0	0	10	50	0	0	0	LLDPE	MAS036	FALSE	Roll	5	5Kg/Box	None		0	0		\N	\N	\N	\N
2718	CID1329	CAT004	ITM027	6+6+25	25	6	6	20	50	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		13.2	20		\N	\N	\N	\N
2719	CID1329	CAT004	ITM028	9+9+33	33	9	9	20	50	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		25.9	20		\N	\N	\N	\N
2720	CID1330	CAT004	ITM027	6+6+25	25	6	6	20	50	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		13.2	20		\N	\N	\N	\N
2721	CID1331	CAT004	ITM029	59	59	0	0	18	90	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		64.7	20		\N	\N	\N	\N
2722	CID1332	CAT004	ITM027	8+8+28	28	8	8	17	42	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		13.1	20		\N	\N	\N	\N
2723	CID1332	CAT004	ITM028	10+10+35	35	10	10	17	42	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		21.1	20		\N	\N	\N	\N
2724	CID083	CAT004	ITM044	21	21	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.5	0		\N	\N	\N	\N
2725	CID1333	CAT004	ITM033	9+9+32	32	9	9	4	10	0	110	110	HDPE	MAS005	TRUE	Roll	350	20K/Bag	None	Eiffel	11	0		\N	\N	\N	\N
2726	CID1334	CAT004	ITM027	24	24	0	0	18	90	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		13.2	20		\N	\N	\N	\N
2727	CID1335	CAT004	ITM027	16	16	0	0	12	60	10	25.4	25.4	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		4.9	20		\N	\N	\N	\N
2728	CID1336	CAT004	ITM019	9+9+27	27	9	9	15	37	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.2	30		\N	\N	\N	\N
2729	CID1336	CAT004	ITM020	10+10+31	31	10	10	16	40	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		24.9	30		\N	\N	\N	\N
2730	CID004	CAT004	ITM053	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
2731	CID1337	CAT004	ITM013	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2732	CID1337	CAT004	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2733	CID1337	CAT004	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2734	CID1337	CAT004	ITM036	50	50	0	0	8	40	0	0	0	HDPE	MAS004	TRUE	Roll w/Core	3	5R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2735	CID1143	CAT004	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS005	TRUE	Roll w/Core	1.8	10R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
2736	CID1143	CAT004	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS004	TRUE	Roll w/Core	3	5R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
2737	CID1143	CAT004	ITM033	0	0	0	0	4	20	0	0	0	HDPE	MAS004	TRUE	6 Roll	1	(20Px6R)/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2738	CID1143	CAT004	ITM033	0	0	0	0	4	20	0	0	0	HDPE	MAS004	TRUE	Roll	1	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2739	CID1143	CAT004	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2740	CID1143	CAT004	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2741	CID1143	CAT004	ITM013	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2742	CID1143	CAT004	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2743	CID1143	CAT004	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2744	CID1143	CAT004	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2745	CID1143	CAT004	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2746	CID1143	CAT004	ITM053	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
2747	CID1338	CAT004	ITM028	8+8+30	30	8	8	35	87	16	40.64	40.64	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		32.5	20		\N	\N	\N	\N
2748	CID1339	CAT004	ITM027	7+7+31	31	7	7	38	95	16	40.64	40.64	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		34.7	20		\N	\N	\N	\N
2749	CID1339	CAT004	ITM028	9+9+35	35	9	9	38	95	18	45.72	45.72	LLDPE	MAS009	TRUE	Kg.	1	20K/Bag	Banana		46	20		\N	\N	\N	\N
2750	CID800	CAT004	ITM022	15+15+43	43	15	15	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		59.3	30		\N	\N	\N	\N
2751	CID1340	CAT004	ITM019	7+7+21	21	7	7	11	27	16	40.64	40.64	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		7.7	30		\N	\N	\N	\N
2752	CID1340	CAT004	ITM020	10+10+27	27	10	10	16	40	18	45.72	45.72	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		17.2	30		\N	\N	\N	\N
2753	CID800	CAT004	ITM044	21	21	0	0	8	40	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2754	CID800	CAT004	ITM056	26	26	0	0	8	40	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		8.5	0		\N	\N	\N	\N
2755	CID1341	CAT004	ITM021	15+15+40	40	15	15	30	75	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		69.3	30		\N	\N	\N	\N
2756	CID1342	CAT004	ITM019	5+5+24	24	5	5	9	22	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		6.1	30		\N	\N	\N	\N
2757	CID1342	CAT004	ITM020	9+9+33	33	9	9	12	30	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		18.7	30		\N	\N	\N	\N
2758	CID1342	CAT004	ITM021	10+10+41	41	10	10	14	35	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		28.2	30		\N	\N	\N	\N
2759	CID202	CAT004	ITM086	6+6+43	43	6	6	40	100	0	52	52	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		57.2	0		\N	\N	\N	\N
2760	CID202	CAT004	ITM087	8+8+30	30	8	8	40	100	0	63	63	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		58	0		\N	\N	\N	\N
2761	CID1343	CAT004	ITM028	6+6+31	31	6	6	25	62	18	45.72	45.72	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		24.4	20		\N	\N	\N	\N
2762	CID1343	CAT004	ITM029	8+8+40	40	8	8	25	62	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		35.3	20		\N	\N	\N	\N
2763	CID1343	CAT004	ITM030	9+9+42	42	9	9	27	67	24	60.96	60.96	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		49	20		\N	\N	\N	\N
2767	CID1044	CAT004	ITM059	14	14	0	0	12	60	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		4.3	0		\N	\N	\N	\N
2768	CID1044	CAT004	ITM067	16.5	16.5	0	0	11	55	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		4.6	0		\N	\N	\N	\N
2769	CID925	CAT005	ITM111	8+8+34	34	8	8	16	40	0	110	110	LLDPE	MAS004	FALSE	Roll	0.5	24R/Bag	None	BIN HUMDA ELECTRONIC	44	0		\N	\N	\N	\N
2770	CID1345	CAT004	ITM029	62	62	0	0	20	100	26	66.04	66.04	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		81.9	0		\N	\N	\N	\N
2771	CID1346	CAT004	ITM019	8+8+25	25	8	8	15	37	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		12.3	30		\N	\N	\N	\N
2772	CID1347	CAT004	ITM019	9+9+28	28	9	9	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		13.5	30		\N	\N	\N	\N
2773	CID1347	CAT004	ITM020	10+10+32	32	10	10	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		18.5	30		\N	\N	\N	\N
2774	CID1347	CAT004	ITM021	14+14+38	38	14	14	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		36.2	30		\N	\N	\N	\N
2775	CID1348	CAT004	ITM044	10.5	10.5	0	0	18	90	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		6.7	0		\N	\N	\N	\N
2776	CID1348	CAT004	ITM056	15.5	15.5	0	0	18	90	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9.9	0		\N	\N	\N	\N
2777	CID1348	CAT004	ITM057	16	16	0	0	18	90	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.3	0		\N	\N	\N	\N
2778	CID1348	CAT004	ITM058	20	20	0	0	18	90	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		11	0		\N	\N	\N	\N
2779	CID1349	CAT004	ITM020	8+8+25	25	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.2	30		\N	\N	\N	\N
2780	CID1349	CAT004	ITM023	11+11+40	40	11	11	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		26.5	30		\N	\N	\N	\N
2781	CID1350	CAT004	ITM019	6+6+23	23	6	6	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	8.5	30		\N	\N	\N	\N
2782	CID1350	CAT004	ITM020	8+8+26	26	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	11.5	30		\N	\N	\N	\N
2783	CID1350	CAT004	ITM021	9+9+34	34	9	9	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	16.9	30		\N	\N	\N	\N
2784	CID1350	CAT004	ITM022	9+9+32	32	9	9	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	19.5	30		\N	\N	\N	\N
2785	CID1350	CAT004	ITM023	11+11+38	38	11	11	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	25.6	30		\N	\N	\N	\N
2786	CID1351	CAT004	ITM044	26	26	0	0	20	100	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		21.1	0		\N	\N	\N	\N
2765	CID1344	CAT003	ITM020	38+13+13	38	13	13	14	35	24	61	60.96	HDPE	MAS005	Yes	Kg.	1	20K/Bag	T-Shirt w/Hook		273.28	30		20	20.00	\N	\N
2766	CID1344	CAT003	ITM021	46+14+14	46	14	14	16	40	28	71	71.12	HDPE	MAS005	No	Kg.	1	20K/Bag	T-Shirt w/Hook		420.32	30		20	20.00	\N	\N
2787	CID1352	CAT004	ITM028	5.5+5.5+35.5	35.5	5.5	5.5	22	55	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		23.4	20		\N	\N	\N	\N
2788	CID705	CAT004	ITM028	8+8+35	35	8	8	35	87	18	45.72	45.72	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		40.6	20		\N	\N	\N	\N
2789	CID1325	CAT004	ITM011	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
2790	CID1325	CAT004	ITM012	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
2791	CID1325	CAT004	ITM013	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
2792	CID1325	CAT004	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
2793	CID1325	CAT004	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
2794	CID1325	CAT004	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
2795	CID1325	CAT004	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
2796	CID1325	CAT004	ITM053	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
2797	CID1325	CAT004	ITM040	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	4	20K/Bag	None		0	0		\N	\N	\N	\N
2798	CID1325	CAT004	ITM041	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	4	20K/Bag	None		0	0		\N	\N	\N	\N
2799	CID1325	CAT004	ITM042	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	4	20K/Bag	None		0	0		\N	\N	\N	\N
2800	CID1325	CAT004	ITM043	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Box	4	20K/Bag	None		0	0		\N	\N	\N	\N
2801	CID626	CAT004	ITM053	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.5	30R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2802	CID1353	CAT004	ITM046	56	56	0	0	10	50	34	86.36	86.36	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		48.4	0		\N	\N	\N	\N
2803	CID1356	CAT004	ITM021	13+13+36	36	13	13	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		31.7	30		\N	\N	\N	\N
2804	CID1356	CAT004	ITM022	13+13+46	46	13	13	17	42	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		49.2	30		\N	\N	\N	\N
2805	CID1355	CAT004	ITM022	13+13+45	45	13	13	18	45	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		51.9	30		\N	\N	\N	\N
2806	CID1354	CAT004	ITM019	8+8+24	24	8	8	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		9.8	30		\N	\N	\N	\N
2807	CID1354	CAT004	ITM020	10+10+28	28	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		18	30		\N	\N	\N	\N
2808	CID1354	CAT004	ITM021	13+13+36	36	13	13	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		31.7	30		\N	\N	\N	\N
2809	CID1354	CAT004	ITM022	13+13+46	46	13	13	18	45	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		52.7	30		\N	\N	\N	\N
2810	CID1357	CAT004	ITM020	10+10+30	30	10	10	15	37	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		20.7	30		\N	\N	\N	\N
2811	CID1357	CAT004	ITM021	13+13+38	38	13	13	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		28.9	30		\N	\N	\N	\N
2812	CID1357	CAT004	ITM022	13+13+45	45	13	13	17	42	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		48.5	30		\N	\N	\N	\N
2813	CID1358	CAT004	ITM028	7+7+30	30	7	7	25	62	16	40.64	40.64	HDPE	MAS077	TRUE	Kg.	1	20K/Bag	Banana		22.2	20		\N	\N	\N	\N
2814	CID1358	CAT004	ITM029	8+8+36	36	8	8	25	62	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		29.5	20		\N	\N	\N	\N
2815	CID1359	CAT004	ITM028	6+6+29	29	6	6	22	55	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		20.6	20		\N	\N	\N	\N
2816	CID1164	CAT004	ITM003	35+13+13	35	13	13	39	97	28	71.12	71.12	LLDPE	MAS029	TRUE	Packet	2	10P/Bag	None		84.2	0		\N	\N	\N	\N
2817	CID1164	CAT004	ITM007	13+13+55	55	13	13	42	105	39	99.06	99.06	LLDPE	MAS029	TRUE	Packet	2	10P/Bag	None		168.5	0		\N	\N	\N	\N
2818	CID1360	CAT004	ITM020	8+8+28	28	8	8	15	37	18	45.72	45.72	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		14.9	30		\N	\N	\N	\N
2819	CID1360	CAT004	ITM021	10+10+31	31	10	10	15	37	24	60.96	60.96	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23	30		\N	\N	\N	\N
2820	CID1360	CAT004	ITM039	45	45	0	0	4	20	0	90	90	HDPE	MAS055	TRUE	Roll	1	20K/Bag	None	Plain	16.2	0		\N	\N	\N	\N
2821	CID1361	CAT004	ITM019	8+8+20	20	8	8	18	45	16	40.64	40.64	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.2	30		\N	\N	\N	\N
2822	CID1362	CAT004	ITM020	8+8+28	28	8	8	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.9	30		\N	\N	\N	\N
2823	CID1362	CAT004	ITM021	10+10+31	31	10	10	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		19.9	30		\N	\N	\N	\N
2824	CID1362	CAT004	ITM039	45	45	0	0	3	15	14	90	90	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	12.2	0		\N	\N	\N	\N
2825	CID1363	CAT004	ITM019	8+8+26	26	8	8	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		11.9	30		\N	\N	\N	\N
2826	CID1363	CAT004	ITM020	10+10+30	30	10	10	14	35	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		19.6	0		\N	\N	\N	\N
2827	CID1363	CAT004	ITM021	12+12+38	38	12	12	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		30.2	30		\N	\N	\N	\N
2828	CID1363	CAT004	ITM023	13+13+50	50	13	13	18	45	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		55.6	30		\N	\N	\N	\N
2829	CID150	CAT004	ITM029	35	35	0	0	25	125	18	45.72	45.72	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	Banana		40	20		\N	\N	\N	\N
2830	CID1364	CAT004	ITM020	10+10+32	32	10	10	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.1	30		\N	\N	\N	\N
2831	CID1364	CAT004	ITM021	10+10+32	32	10	10	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		25.4	0		\N	\N	\N	\N
2832	CID1364	CAT004	ITM022	12+12+43	43	12	12	20	50	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		47.7	30		\N	\N	\N	\N
2833	CID1365	CAT004	ITM046	48.5	48.5	0	0	21	105	30	76.2	76.2	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	None		77.6	0		\N	\N	\N	\N
2834	CID909	CAT004	ITM009	16+16+60	60	16	16	30	75	0	137	137	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None	Plain	189.1	0		\N	\N	\N	\N
2835	CID1231	CAT004	ITM027	8+8+30	30	8	8	25	62	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		20.3	20		\N	\N	\N	\N
2836	CID1364	CAT004	ITM033	0	0	0	0	4	20	0	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2837	CID1366	CAT004	ITM020	10+10+30	30	10	10	17	42	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.3	30		\N	\N	\N	\N
2838	CID1366	CAT004	ITM021	11+11+32	32	11	11	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		27.7	30		\N	\N	\N	\N
2839	CID769	CAT004	ITM023	13+13+55	55	13	13	20	50	28	71.12	71.12	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		57.6	30		\N	\N	\N	\N
2840	CID1367	CAT004	ITM009	20+20+60	60	20	20	11	27	0	114	114	Regrind	MAS003	FALSE	Packet	2.6	5P/Bag	None	Plain	61.6	0		\N	\N	\N	\N
2841	CID1368	CAT004	ITM044	19	19	0	0	9	45	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		5.2	0		\N	\N	\N	\N
2842	CID1368	CAT004	ITM056	20	20	0	0	9	45	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		6.4	0		\N	\N	\N	\N
2843	CID1368	CAT004	ITM057	29	29	0	0	12	60	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		15.9	0		\N	\N	\N	\N
2844	CID1368	CAT004	ITM019	7+7+25	25	7	7	15	37	14	35.56	35.56	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		10.3	30		\N	\N	\N	\N
2846	CID1368	CAT004	ITM020	10+10+30	30	10	10	15	37	18	45.72	45.72	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.9	30		\N	\N	\N	\N
2847	CID1368	CAT004	ITM021	11+11+35	35	11	11	17	42	24	60.96	60.96	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		29.2	30		\N	\N	\N	\N
2848	CID1368	CAT004	ITM022	11+11+38	38	11	11	17	42	28	71.12	71.12	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	None		35.8	0		\N	\N	\N	\N
2849	CID1370	CAT004	ITM019	6+6+23.5	23.5	6	6	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	10.1	30		\N	\N	\N	\N
2850	CID1370	CAT004	ITM020	6+6+25	25	6	6	14	35	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	11.8	30		\N	\N	\N	\N
2851	CID1370	CAT004	ITM021	9+9+33.5	33.5	9	9	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	18.3	30		\N	\N	\N	\N
2852	CID1370	CAT004	ITM023	11+11+40	40	11	11	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	26.5	30		\N	\N	\N	\N
2853	CID1371	CAT004	ITM020	8+8+25	25	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		11.2	30		\N	\N	\N	\N
2854	CID1371	CAT004	ITM021	9+9+32	32	9	9	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	15.2	30		\N	\N	\N	\N
2855	CID1371	CAT004	ITM022	9+9+32	32	9	9	12	30	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	18.3	30		\N	\N	\N	\N
2856	CID1372	CAT004	ITM019	6+6+22	22	6	6	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	8.8	30		\N	\N	\N	\N
2857	CID1372	CAT004	ITM020	8+8+25	25	8	8	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	12	30		\N	\N	\N	\N
2858	CID1372	CAT004	ITM021	9+9+32	32	9	9	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	17.8	30		\N	\N	\N	\N
2859	CID1771	CAT005	ITM111	10+10+35	35	10	10	6	15	0	110	110	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None	Plain	18.2	0		\N	\N	\N	\N
2860	CID1373	CAT004	ITM028	13+13+44	44	13	13	30	75	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		48	20		\N	\N	\N	\N
2861	CID1373	CAT004	ITM029	5+5+50	50	5	5	30	75	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		54.9	20		\N	\N	\N	\N
2862	CID1374	CAT004	ITM019	6+6+23.5	23.5	6	6	12	30	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	7.6	30		\N	\N	\N	\N
2863	CID1375	CAT004	ITM019	7+7+25	25	7	7	20	50	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.8	30		\N	\N	\N	\N
2864	CID1375	CAT004	ITM020	9+9+29	29	9	9	20	50	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23.9	30		\N	\N	\N	\N
2865	CID1376	CAT004	ITM020	8+8+27	27	8	8	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.1	30		\N	\N	\N	\N
2866	CID1376	CAT004	ITM021	11+11+33	33	11	11	14	35	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.7	30		\N	\N	\N	\N
2867	CID1376	CAT004	ITM037	55	55	0	0	6	30	0	90	90	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	29.7	0		\N	\N	\N	\N
2868	CID025	CAT004	ITM005	15+15+40	40	15	15	8	20	0	80	80	HDPE	MAS095	FALSE	Packet	1	50Pcs/P x 10P/Bag	None	Plain	22.4	0		\N	\N	\N	\N
2869	CID1377	CAT004	ITM019	6+6+22	22	6	6	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		8.3	30		\N	\N	\N	\N
2870	CID1377	CAT004	ITM020	8+8+25	25	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		11.2	30		\N	\N	\N	\N
2871	CID1377	CAT004	ITM021	9+9+32	32	9	9	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		15.2	30		\N	\N	\N	\N
2872	CID1377	CAT004	ITM022	9+9+32	32	9	9	12	30	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		18.3	30		\N	\N	\N	\N
2873	CID1377	CAT004	ITM023	11+11+40	40	11	11	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		26.5	30		\N	\N	\N	\N
2874	CID1378	CAT004	ITM027	31.5	31.5	0	0	15	75	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		14.4	20		\N	\N	\N	\N
2875	CID1379	CAT004	ITM052	6.5+6.5+27	27	6.5	6.5	60	150	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		73.2	20		\N	\N	\N	\N
2876	CID025	CAT004	ITM010	18+18+64	64	18	18	18	45	0	126	126	LLDPE	MAS003	FALSE	Packet	4.8	50Pcs/P x 3P/Bag	None	Plain	113.4	0		\N	\N	\N	\N
2877	CID202	CAT004	ITM090	11.5+11.5+24	24	11.5	11.5	40	100	0	62	62	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		58.3	0		\N	\N	\N	\N
2878	CID1380	CAT004	ITM091	35	35	0	0	26	130	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		41.6	0		\N	\N	\N	\N
2879	CID1380	CAT004	ITM092	41.5	41.5	0	0	25	125	0	0	0	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2880	CID404	CAT004	ITM009	18+18+60	60	18	18	27	67	0	110	110	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		141.5	0		\N	\N	\N	\N
2881	CID1381	CAT004	ITM021	12+12+38	38	12	12	25	62	24	60.96	60.96	HDPE	MAS023	TRUE	Kg.	1	20K/Bag	T-Shirt		46.9	30		\N	\N	\N	\N
2882	CID1381	CAT004	ITM022	14+14+42	42	14	14	28	70	28	71.12	71.12	HDPE	MAS028	TRUE	Kg.	1	20K/Bag	T-Shirt		69.7	30		\N	\N	\N	\N
2883	CID1382	CAT004	ITM027	6+6+25	25	6	6	23	57	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		15	20		\N	\N	\N	\N
2884	CID1382	CAT004	ITM028	7+7+30	30	7	7	23	57	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		20.4	20		\N	\N	\N	\N
2885	CID1382	CAT004	ITM029	8+8+35	35	8	8	23	57	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		26.6	20		\N	\N	\N	\N
2886	CID1383	CAT004	ITM019	7+7+22	22	7	7	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		10.2	30		\N	\N	\N	\N
2887	CID1383	CAT004	ITM020	9+9+30	30	9	9	15	37	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		19.8	30		\N	\N	\N	\N
2888	CID1383	CAT004	ITM027	26	26	0	0	30	150	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	Banana		27.7	20		\N	\N	\N	\N
2889	CID202	CAT004	ITM093	13+13+36	36	13	13	44	110	0	74	74	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		100.9	0		\N	\N	\N	\N
2890	CID1323	CAT004	ITM026	20	20	0	0	13	65	10	25.4	25.4	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		6.6	20		\N	\N	\N	\N
2891	CID1384	CAT004	ITM027	6+6+25	25	6	6	30	75	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		19.7	20		\N	\N	\N	\N
2892	CID1384	CAT004	ITM029	8+8+33	33	8	8	30	75	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana	9	37.3	20		\N	\N	\N	\N
2893	CID1325	CAT004	ITM033	0	0	0	0	4	20	0	0	0	HDPE	MAS005	TRUE	3 Roll	0.5	30P/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2894	CID1325	CAT004	ITM033	0	0	0	0	4	20	0	110	110	HDPE	MAS005	TRUE	6 Roll	1	6R/P x 20P/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
2895	CID1358	CAT004	ITM022	9+9+52	52	9	9	35	87	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		74.2	30		\N	\N	\N	\N
2896	CID009	CAT004	ITM056	15	15	0	0	12	60	8	20.32	20.32	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		3.7	0		\N	\N	\N	\N
2897	CID009	CAT004	ITM057	21	21	0	0	13	65	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		6.9	0		\N	\N	\N	\N
2898	CID1385	CAT004	ITM020	9+9+30	30	9	9	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		14	0		\N	\N	\N	\N
2899	CID900	CAT004	ITM018	7+7+26	26	7	7	20	50	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		18.3	30		\N	\N	\N	\N
2900	CID1393	CAT004	ITM003	11+11+30	30	11	11	45	112	20	50.8	50.8	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		59.2	0		\N	\N	\N	\N
2901	CID1393	CAT004	ITM005	16+16+40	40	16	16	45	112	32	81.28	81.28	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		131.1	0		\N	\N	\N	\N
2902	CID1393	CAT004	ITM006	18+18+44	44	18	18	45	112	39	99.06	99.06	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		177.5	0		\N	\N	\N	\N
2903	CID900	CAT004	ITM023	60+15+15	60	15	15	28	70	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
2904	CID1386	CAT004	ITM022	9+9+32	32	9	9	12	30	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		18.3	30		\N	\N	\N	\N
2905	CID323	CAT004	ITM084	12	12	0	0	10	50	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		6.1	0		\N	\N	\N	\N
2906	CID323	CAT004	ITM084	14	14	0	0	10	50	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		6.4	0		\N	\N	\N	\N
2907	CID323	CAT004	ITM084	18	18	0	0	10	50	28	71.12	71.12	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		12.8	0		\N	\N	\N	\N
2908	CID1387	CAT004	ITM046	10+10+32	32	10	10	40	100	16	40.64	40.64	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		42.3	20		\N	\N	\N	\N
2909	CID864	CAT004	ITM080	19	19	0	0	35	175	30	76.2	76.2	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		50.7	0		\N	\N	\N	\N
2910	CID864	CAT004	ITM094	19	19	0	0	35	175	30	76.2	76.2	LLDPE	MAS091	TRUE	Kg.	1	20K/Bag	None		50.7	0		\N	\N	\N	\N
2911	CID978	CAT004	ITM075	5+5+30	30	5	5	32	80	20	50.8	50.8	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		32.5	20		\N	\N	\N	\N
2912	CID978	CAT004	ITM076	5+5+40	40	5	5	50	125	24	60.96	60.96	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		76.2	20		\N	\N	\N	\N
2913	CID1379	CAT004	ITM051	4+4+26	26	4	4	60	150	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		51.8	20		\N	\N	\N	\N
2914	CID1388	CAT004	ITM019	6+6+22	22	6	6	15	37	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		10.2	30		\N	\N	\N	\N
2915	CID1388	CAT004	ITM020	9+9+30	30	9	9	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.2	30		\N	\N	\N	\N
2916	CID1388	CAT004	ITM021	10+10+35	35	10	10	15	37	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.7	30		\N	\N	\N	\N
2917	CID1388	CAT004	ITM044	20.5	20.5	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.3	0		\N	\N	\N	\N
2918	CID1389	CAT004	ITM020	9+9+28	28	9	9	14	35	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		14.7	30		\N	\N	\N	\N
2919	CID1389	CAT004	ITM021	11+11+31	31	11	11	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		22.6	30		\N	\N	\N	\N
2920	CID1390	CAT004	ITM046	47	47	0	0	20	100	30	76.2	76.2	HDPE	MAS096	TRUE	Kg.	1	20K/Bag	None		71.6	0		\N	\N	\N	\N
2921	CID1391	CAT004	ITM044	26	26	0	0	11	55	0	45	45	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		12.9	0	Double sealing	\N	\N	\N	\N
2922	CID305	CAT004	ITM007	11+11+61	61	11	11	18	45	20	100	100	LLDPE	MAS041	TRUE	Kg.	1	20K/Bag	None		74.7	0		\N	\N	\N	\N
2923	CID1392	CAT004	ITM020	10+10+30	30	10	10	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		17.8	30		\N	\N	\N	\N
2924	CID1392	CAT004	ITM021	13+13+38	38	13	13	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		31.2	30		\N	\N	\N	\N
2925	CID1224	CAT004	ITM027	22	22	0	0	8	40	12	30.48	30.48	LLDPE	MAS064	TRUE	Kg.	1	20K/Bag	Banana		5.4	20		\N	\N	\N	\N
2926	CID1224	CAT004	ITM027	22	22	0	0	8	40	12	30.48	30.48	LLDPE	MAS024	TRUE	Kg.	1	20K/Bag	Banana		5.4	20		\N	\N	\N	\N
2927	CID1382	CAT004	ITM022	10+10+70	70	10	10	32	80	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		95.1	30		\N	\N	\N	\N
2928	CID1394	CAT004	ITM020	11+11+31	31	11	11	20	50	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		26.9	30		\N	\N	\N	\N
2929	CID1196	CAT004	ITM019	8+8+27	27	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.8	30		\N	\N	\N	\N
2930	CID1196	CAT004	ITM021	9+9+38	38	9	9	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.8	30		\N	\N	\N	\N
2931	CID1196	CAT004	ITM037	55	55	0	0	4	20	0	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	24.2	0		\N	\N	\N	\N
2932	CID1395	CAT004	ITM051	4+4+26	26	4	4	40	100	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		34.5	20		\N	\N	\N	\N
2933	CID1395	CAT004	ITM052	6.5+6.5+30	30	6.5	6.5	40	100	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		48.1	20		\N	\N	\N	\N
2934	CID1260	CAT004	ITM046	60	60	0	0	10	50	0	0	0	HDPE	MAS001	FALSE	Roll w/Core	20	20K/Bag	None		0	0		\N	\N	\N	\N
2935	CID1363	CAT004	ITM022	13+13+42	42	13	13	17	42	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		40.6	30		\N	\N	\N	\N
2936	CID1396	CAT004	ITM027	6+6+26	26	6	6	23	57	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		15.4	20		\N	\N	\N	\N
2937	CID1396	CAT004	ITM028	7+7+30	30	7	7	23	57	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		20.4	20		\N	\N	\N	\N
2938	CID1396	CAT004	ITM029	8+8+35	35	8	8	23	57	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		26.6	20		\N	\N	\N	\N
2939	CID1396	CAT004	ITM030	9+9+41	41	9	9	23	57	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		34.2	20		\N	\N	\N	\N
2940	CID1396	CAT004	ITM022	14+14+46	46	14	14	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		60.1	30		\N	\N	\N	\N
2941	CID1396	CAT004	ITM023	14+14+55	55	14	14	23	57	39	99.06	99.06	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		93.7	20		\N	\N	\N	\N
2942	CID142	CAT004	ITM045	10	10	0	0	10	50	0	0	0	LLDPE	MAS079	FALSE	Roll	5	5Kg/Box	None		0	0		\N	\N	\N	\N
2943	CID1397	CAT004	ITM027	31+10.5+10.5	31	10.5	10.5	35	87	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		50.6	20		\N	\N	\N	\N
2944	CID1397	CAT004	ITM028	42+11+11	42	11	11	35	87	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		62.2	20		\N	\N	\N	\N
2945	CID323	CAT004	ITM033	9+9+27	27	9	9	4	10	0	80	80	HDPE	MAS005	TRUE	6 Roll	1	30Pcs x 6R x 30Pckt	None		7.2	0		\N	\N	\N	\N
2946	CID1317	CAT004	ITM027	8+8+27	27	8	8	40	100	16	40.64	40.64	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		35	20		\N	\N	\N	\N
2947	CID1424	CAT004	ITM021	11+11+33	33	11	11	22	55	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		36.9	30		\N	\N	\N	\N
2948	CID1425	CAT004	ITM022	12+12+43	43	12	12	22	55	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		59.9	30		\N	\N	\N	\N
2949	CID1425	CAT004	ITM021	10+10+33	33	10	10	20	50	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		32.3	30		\N	\N	\N	\N
2950	CID1407	CAT004	ITM019	8+8+27	27	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.8	30		\N	\N	\N	\N
2951	CID1407	CAT004	ITM023	13+13+55	55	13	13	20	50	28	71.12	71.12	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		57.6	30		\N	\N	\N	\N
2952	CID1426	CAT004	ITM028	8+8+27	27	8	8	22	55	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		21.6	20		\N	\N	\N	\N
2954	CID1427	CAT004	ITM011	10+10+28	28	10	10	12	30	0	50	50	HDPE	MAS005	FALSE	Roll	0.4	30R/Bag	None	Nozha	14.4	0		\N	\N	\N	\N
2955	CID1427	CAT004	ITM012	11+11+29	29	11	11	12	30	0	55	55	HDPE	MAS029	FALSE	Roll	0.4	30R/Bag	None	Nozha	16.8	0		\N	\N	\N	\N
2956	CID1427	CAT004	ITM013	11+11+29	29	11	11	12	30	0	60	60	HDPE	MAS079	FALSE	Roll	0.4	30R/Bag	None	Nozha	18.4	0		\N	\N	\N	\N
2957	CID1429	CAT004	ITM020	9+9+32	32	9	9	17	42	16	40.64	40.64	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		17.1	30		\N	\N	\N	\N
2958	CID1429	CAT004	ITM021	9+9+33	33	9	9	18	45	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		28	30		\N	\N	\N	\N
2959	CID1429	CAT004	ITM022	13+13+48	48	13	13	20	50	28	71.12	71.12	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		52.6	30		\N	\N	\N	\N
2960	CID1429	CAT004	ITM023	12+12+45	45	12	12	20	50	36	91.44	91.44	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		63.1	30		\N	\N	\N	\N
2961	CID1429	CAT004	ITM044	26	26	0	0	14	70	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		11.1	0		\N	\N	\N	\N
2962	CID1429	CAT004	ITM056	38	38	0	0	20	100	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		38.6	0		\N	\N	\N	\N
2963	CID1402	CAT004	ITM027	8+8+28	28	8	8	20	50	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		15.6	20		\N	\N	\N	\N
2964	CID1402	CAT004	ITM028	11+11+32	32	11	11	30	75	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		37	20		\N	\N	\N	\N
2965	CID1428	CAT004	ITM028	8+8+30	30	8	8	40	100	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		37.4	20		\N	\N	\N	\N
2966	CID1430	CAT004	ITM044	20	20	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.1	0		\N	\N	\N	\N
2967	CID1432	CAT004	ITM020	8+8+27	27	8	8	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.7	30		\N	\N	\N	\N
2968	CID1414	CAT004	ITM027	22	22	0	0	18	90	0	30	30	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		11.9	20		\N	\N	\N	\N
2969	CID1414	CAT004	ITM029	10+10+40	40	10	10	36	90	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		65.8	20		\N	\N	\N	\N
2970	CID1414	CAT004	ITM031	12+12+56	56	12	12	38	95	30	76.2	76.2	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		115.8	20		\N	\N	\N	\N
2971	CID1414	CAT004	ITM032	14+14+75	75	14	14	38	95	39	99.06	99.06	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		193.9	20		\N	\N	\N	\N
2972	CID1433	CAT004	ITM029	8+8+40	40	8	8	28	70	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		39.8	20		\N	\N	\N	\N
2973	CID1433	CAT004	ITM031	13+13+53	53	13	13	30	75	28	71.12	71.12	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		84.3	20		\N	\N	\N	\N
2974	CID1433	CAT004	ITM032	20+20+60	60	20	20	30	75	39	99.06	99.06	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		148.6	20		\N	\N	\N	\N
2975	CID1434	CAT004	ITM027	3+3+29	29	3	3	17	42	14	35.56	35.56	LLDPE	MAS005	TRUE	Box	10	100P/Bag	Banana		10.5	20		\N	\N	\N	\N
2976	CID1435	CAT004	ITM019	6+6+22	22	6	6	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		8.3	30		\N	\N	\N	\N
2977	CID1435	CAT004	ITM020	8+8+25	25	8	8	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		12	30		\N	\N	\N	\N
2978	CID1435	CAT004	ITM021	9+9+32	32	9	9	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		16.3	30		\N	\N	\N	\N
2979	CID1436	CAT004	ITM019	25+7+7	25	7	7	14	35	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		12.5	30		\N	\N	\N	\N
2980	CID1436	CAT004	ITM020	32+10+10	32	10	10	15	37	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		21.5	30		\N	\N	\N	\N
2981	CID1436	CAT004	ITM021	35+10+10	35	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		24.8	30		\N	\N	\N	\N
2982	CID1438	CAT004	ITM027	5+5+25	25	5	5	25	62	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		13.2	20		\N	\N	\N	\N
2983	CID1438	CAT004	ITM028	5+5+27	27	5	5	25	62	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		16.3	20		\N	\N	\N	\N
2984	CID1128	CAT004	ITM027	30	30	0	0	16	80	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.1	20		\N	\N	\N	\N
2986	CID729	CAT004	ITM036	50	50	0	0	10	50	0	0	0	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
2987	CID1439	CAT004	ITM019	8+8+25	25	8	8	10	25	16	40.64	40.64	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		8.3	30		\N	\N	\N	\N
2988	CID1439	CAT004	ITM020	10+10+30	30	10	10	11	27	20	50.8	50.8	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt		13.7	30		\N	\N	\N	\N
2989	CID1439	CAT004	ITM021	10+10+30	30	10	10	11	27	24	60.96	60.96	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt		16.5	30		\N	\N	\N	\N
2990	CID1439	CAT004	ITM022	13+13+41	41	13	13	13	32	28	71.12	71.12	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt		30.5	30		\N	\N	\N	\N
2991	CID1439	CAT004	ITM023	14+14+50	50	14	14	15	37	32	81.28	81.28	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	None		46.9	0		\N	\N	\N	\N
2992	CID1440	CAT004	ITM021	10+10+32	32	10	10	16	40	24	60.96	60.96	HDPE	MAS097	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.4	30		\N	\N	\N	\N
2993	CID1440	CAT004	ITM022	11+11+48	48	11	11	16	40	32	81.28	81.28	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		45.5	30		\N	\N	\N	\N
2994	CID1441	CAT004	ITM028	6+6+30	30	6	6	22	55	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		18.8	20		\N	\N	\N	\N
2995	CID1442	CAT004	ITM027	3+3+20	20	3	3	32	80	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12.7	20		\N	\N	\N	\N
2997	CID1445	CAT004	ITM027	22.5	22.5	0	0	18	90	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12.3	20		\N	\N	\N	\N
2998	CID1446	CAT004	ITM028	10+10+37	37	10	10	40	100	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		57.9	20		\N	\N	\N	\N
2999	CID1446	CAT004	ITM029	10+10+42	42	10	10	40	100	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		75.6	20		\N	\N	\N	\N
3000	CID1446	CAT004	ITM030	13+13+46	46	13	13	40	100	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		102.4	20		\N	\N	\N	\N
3001	CID1446	CAT004	ITM031	13+13+50	50	13	13	32	80	39	99.06	99.06	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		120.5	20		\N	\N	\N	\N
3002	CID1447	CAT004	ITM045	9+9+60	60	9	9	20	50	0	0	0	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3003	CID582	CAT004	ITM055	41	41	0	0	10	50	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		25	0		\N	\N	\N	\N
3004	CID582	CAT004	ITM065	51	51	0	0	10	50	34	86.36	86.36	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		44	0		\N	\N	\N	\N
3005	CID1448	CAT004	ITM028	8+8+27	27	8	8	22	55	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	10P/Bag	Banana		19.2	20		\N	\N	\N	\N
3006	CID1448	CAT004	ITM029	12+12+39	39	12	12	22	55	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	10P/Bag	Banana		28.2	20		\N	\N	\N	\N
3007	CID1449	CAT004	ITM028	7+7+35	35	7	7	22	55	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	10P/Bag	Banana		24.6	20		\N	\N	\N	\N
3008	CID1450	CAT004	ITM019	6+6+22	22	6	6	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		8.3	30		\N	\N	\N	\N
3009	CID1450	CAT004	ITM020	8+8+25	25	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		11.2	30		\N	\N	\N	\N
3010	CID1450	CAT004	ITM021	9+9+32	32	9	9	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		15.2	30		\N	\N	\N	\N
3011	CID1442	CAT004	ITM028	4+4+25	25	4	4	32	80	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		21.5	20		\N	\N	\N	\N
3012	CID1442	CAT004	ITM029	5+5+30	30	5	5	32	80	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		29.3	20		\N	\N	\N	\N
3013	CID1408	CAT004	ITM019	7+7+22	22	7	7	32	80	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23.4	30		\N	\N	\N	\N
3014	CID1408	CAT004	ITM020	10+10+36	36	10	10	32	80	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		45.5	30		\N	\N	\N	\N
3015	CID1451	CAT004	ITM020	10+10+30	30	10	10	16	40	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.4	30		\N	\N	\N	\N
3016	CID1453	CAT004	ITM028	5+5+28	28	5	5	18	45	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		15.6	20		\N	\N	\N	\N
3017	CID1453	CAT004	ITM036	50	50	0	0	8	40	0	110	110	LLDPE	MAS005	TRUE	Roll	1	20K/Bag	None		44	0		\N	\N	\N	\N
3018	CID1454	CAT004	ITM020	10+10+30	30	10	10	20	50	22	55.88	55.88	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		27.9	30		\N	\N	\N	\N
3019	CID1455	CAT004	ITM027	20	20	0	0	25	125	12	30.48	30.48	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		15.2	20		\N	\N	\N	\N
3020	CID1455	CAT004	ITM028	7+7+26	26	7	7	50	125	14	35.56	35.56	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		35.6	20		\N	\N	\N	\N
3021	CID1451	CAT004	ITM019	7.5+7.5+23	23	7.5	7.5	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		9.9	30		\N	\N	\N	\N
3022	CID1452	CAT004	ITM027	7+7+28	28	7	7	25	62	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		18.5	20		\N	\N	\N	\N
3023	CID1452	CAT004	ITM028	7+7+30	30	7	7	25	62	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		22.2	20		\N	\N	\N	\N
3024	CID1452	CAT004	ITM029	9+9+40	40	9	9	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		36.5	20		\N	\N	\N	\N
3025	CID1422	CAT004	ITM020	8+8+28	28	8	8	16	40	18	45.72	45.72	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.1	30		\N	\N	\N	\N
3026	CID1456	CAT004	ITM027	22	22	0	0	12	60	12	30.48	30.48	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		8	20		\N	\N	\N	\N
3028	CID1457	CAT004	ITM027	8+8+27	27	8	8	40	100	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35	20		\N	\N	\N	\N
3029	CID1457	CAT004	ITM028	11+11+37	37	11	11	40	100	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		59.9	20		\N	\N	\N	\N
3030	CID1423	CAT004	ITM036	50	50	0	0	8	40	0	110	110	LLDPE	MAS055	TRUE	Packet	1	20K/Bag	None		44	0		\N	\N	\N	\N
3031	CID1423	CAT004	ITM033	9+9+32	32	9	9	4	10	0	0	0	HDPE	MAS093	TRUE	Roll	1	20K/Bag	None		0	0		\N	\N	\N	\N
3032	CID1439	CAT004	ITM033	0	0	0	0	4	20	0	100	100	HDPE	MAS005	TRUE	6 Roll	1	6R/P x 20P/Bag	None	Amazing World	0	0		\N	\N	\N	\N
3033	CID1439	CAT004	ITM033	0	0	0	0	4	20	0	110	110	HDPE	MAS005	TRUE	Roll	0.5	40R/Bag	None	Amazing World	0	0		\N	\N	\N	\N
3034	CID1439	CAT004	ITM033	0	0	0	0	4	20	0	110	110	HDPE	MAS005	TRUE	Roll	0.9	20K/Bag	None	Amazing World	0	0		\N	\N	\N	\N
3035	CID1458	CAT004	ITM019	5.5+5.5+21	21	5.5	5.5	12	30	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		6.8	30		\N	\N	\N	\N
3036	CID1458	CAT004	ITM020	9+9+26	26	9	9	12	30	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		10.7	30		\N	\N	\N	\N
3037	CID1459	CAT004	ITM027	8+8+27	27	8	8	22	55	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	10P/Bag	Banana		19.2	20		\N	\N	\N	\N
3038	CID1459	CAT004	ITM029	12+12+50	50	12	12	35	87	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	Banana		78.5	20		\N	\N	\N	\N
3039	CID1459	CAT004	ITM030	15+15+70	70	15	15	35	87	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	Banana	Modern Plastic Bag Factory	141.4	20		\N	\N	\N	\N
3040	CID1460	CAT004	ITM019	10+10+28	28	10	10	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.2	30		\N	\N	\N	\N
3041	CID1460	CAT004	ITM021	10+10+36	36	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.3	30		\N	\N	\N	\N
3042	CID1461	CAT004	ITM110	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3043	CID1462	CAT004	ITM044	43	43	0	0	45	225	30	76.2	76.2	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		147.4	20		\N	\N	\N	\N
3044	CID1463	CAT004	ITM028	5+5+35	35	5	5	45	112	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		46.1	20		\N	\N	\N	\N
3045	CID507	CAT004	ITM020	10+10+36	36	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.1	30		\N	\N	\N	\N
3046	CID1464	CAT004	ITM027	6+6+26	26	6	6	38	95	14	35.56	35.56	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		25.7	20		\N	\N	\N	\N
3047	CID1352	CAT004	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	100 pes/roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
3048	CID1465	CAT004	ITM028	8+8+33	33	8	8	16	40	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.9	20		\N	\N	\N	\N
3049	CID1203	CAT004	ITM021	10+10+45	45	10	10	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		27.7	30		\N	\N	\N	\N
3050	CID1203	CAT004	ITM022	10+10+55	55	10	10	15	37	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		45.1	30		\N	\N	\N	\N
3051	CID1466	CAT004	ITM044	20	20	0	0	20	100	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		12.2	0		\N	\N	\N	\N
3052	CID1467	CAT004	ITM044	20	20	0	0	20	100	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		12.2	0		\N	\N	\N	\N
3054	CID1139	CAT004	ITM060	5+5+28	28	5	5	55	137	20	50.8	50.8	LLDPE	MAS058	TRUE	Kg.	1	20K/Bag	Banana		52.9	20		\N	\N	\N	\N
3055	CID1139	CAT004	ITM070	8+8+38	38	8	8	60	150	24	60.96	60.96	LLDPE	MAS058	TRUE	Kg.	1	20K/Bag	Banana		98.8	20		\N	\N	\N	\N
3056	CID1469	CAT004	ITM020	9+9+28	28	9	9	15	37	18	45.72	45.72	HDPE	MAS094	TRUE	Kg.	1	20K/Bag	T-Shirt		15.6	30		\N	\N	\N	\N
3057	CID1469	CAT004	ITM021	13+13+37	37	13	13	16	40	24	60.96	60.96	HDPE	MAS094	TRUE	Kg.	1	20K/Bag	T-Shirt		30.7	30		\N	\N	\N	\N
3058	CID1469	CAT004	ITM022	13+13+44	44	13	13	18	45	32	81.28	81.28	HDPE	MAS094	TRUE	Kg.	1	20K/Bag	T-Shirt		51.2	30		\N	\N	\N	\N
3059	CID1470	CAT004	ITM028	10+10+45	45	10	10	23	57	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		37.6	20		\N	\N	\N	\N
3060	CID1470	CAT004	ITM029	10+10+45	45	10	10	23	57	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		48.9	20		\N	\N	\N	\N
3061	CID1471	CAT004	ITM028	10+10+40	40	10	10	40	100	22	55.88	55.88	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		67.1	20		\N	\N	\N	\N
3062	CID1429	CAT004	ITM057	45	45	0	0	30	150	32	81.28	81.28	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		109.7	0		\N	\N	\N	\N
3063	CID305	CAT004	ITM007	15+15+49	49	15	15	40	100	20	100	100	LLDPE	MAS077	TRUE	Packet	3.5	25Pcs/Px3P/Bag	None		158	0		\N	\N	\N	\N
3064	CID1472	CAT004	ITM019	10+10+25	25	10	10	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.3	30		\N	\N	\N	\N
3065	CID1473	CAT004	ITM027	3+3+18	18	3	3	30	75	10	25.4	25.4	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.1	20		\N	\N	\N	\N
3066	CID1473	CAT004	ITM028	7+7+30	30	7	7	35	87	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		31.1	20		\N	\N	\N	\N
3067	CID423	CAT004	ITM046	80	80	0	0	20	100	0	100	100	HDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		160	0		\N	\N	\N	\N
3068	CID1422	CAT004	ITM039	45	45	0	0	4	20	0	90	90	HDPE	MAS055	TRUE	Roll	1	20K/Bag	None	Plain	16.2	0		\N	\N	\N	\N
3069	CID1474	CAT004	ITM020	9+9+27	27	9	9	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.2	30		\N	\N	\N	\N
3070	CID1474	CAT004	ITM021	11+11+30	30	11	11	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.4	30		\N	\N	\N	\N
3071	CID1475	CAT004	ITM040	0	0	0	0	12	60	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3072	CID1475	CAT004	ITM041	21	21	0	0	13	65	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9.7	0		\N	\N	\N	\N
3073	CID1475	CAT004	ITM042	25	25	0	0	13	65	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		13.2	0		\N	\N	\N	\N
3074	CID1475	CAT004	ITM043	31	31	0	0	13	65	22	55.88	55.88	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		22.5	0		\N	\N	\N	\N
3075	CID202	CAT004	ITM095	9+9+46	46	9	9	40	100	0	60	60	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		76.8	0		\N	\N	\N	\N
3076	CID1359	CAT004	ITM027	7+7+26	26	7	7	20	50	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		14.2	20		\N	\N	\N	\N
3077	CID1476	CAT004	ITM027	7+7+27	27	7	7	15	37	12	30.48	30.48	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		9.2	20		\N	\N	\N	\N
3078	CID1476	CAT004	ITM028	10+10+30	30	10	10	20	50	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		22.9	20		\N	\N	\N	\N
3079	CID1476	CAT004	ITM029	6+6+40	40	6	6	24	60	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		28.5	20		\N	\N	\N	\N
3080	CID1477	CAT004	ITM028	8+8+28	28	8	8	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		16.1	20		\N	\N	\N	\N
3081	CID1400	CAT004	ITM019	8+8+23	23	8	8	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		9.5	30		\N	\N	\N	\N
3082	CID1400	CAT004	ITM020	9+9+31	31	9	9	14	35	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		19.2	30		\N	\N	\N	\N
3083	CID1400	CAT004	ITM021	15+15+50	50	15	15	20	50	34	86.36	86.36	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		69.1	30		\N	\N	\N	\N
3084	CID1404	CAT004	ITM027	6+6+25	25	6	6	22	55	14	35.56	35.56	HDPE	MAS093	TRUE	Kg.	1	20K/Bag	Banana		14.5	20		\N	\N	\N	\N
3085	CID1404	CAT004	ITM026	27	27	0	0	12	60	12	30.48	30.48	HDPE	MAS093	TRUE	Kg.	1	20K/Bag	Banana		9.9	20		\N	\N	\N	\N
3086	CID1404	CAT004	ITM028	8+8+38	38	8	8	24	60	18	45.72	45.72	HDPE	MAS093	TRUE	Kg.	1	20K/Bag	Banana		29.6	20		\N	\N	\N	\N
3087	CID1479	CAT004	ITM029	51	51	0	0	14	70	20	50.8	50.8	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		36.3	20		\N	\N	\N	\N
3088	CID1480	CAT004	ITM028	7+7+30	30	7	7	35	87	18	45.72	45.72	LLDPE	MAS098	TRUE	Kg.	1	20K/Bag	Banana		35	20		\N	\N	\N	\N
3089	CID1481	CAT004	ITM028	6+6+30	30	6	6	50	125	18	45.72	45.72	LLDPE	MAS099	TRUE	Kg.	1	20K/Bag	Banana		48	20		\N	\N	\N	\N
3090	CID1482	CAT004	ITM028	9+9+30	30	9	9	24	60	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		23.4	20		\N	\N	\N	\N
3091	CID1482	CAT004	ITM027	9+9+27	27	9	9	18	45	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		16.5	20		\N	\N	\N	\N
3092	CID2113	CAT005	ITM111	9+9+32	32	9	9	3	7	0	100	100	HDPE	MAS004	FALSE	Roll	0.8	20K/Bag	None	Hana	7	0		\N	\N	\N	\N
3093	CID678	CAT010	ITM046	12.5+12.5+100	100	12.5	12.5	22	55	12	150	150	HDPE	MAS025	TRUE	Kg.	1	20K/Bag	None		206.3	0		\N	\N	\N	\N
3094	CID914	CAT010	ITM046	18.5+18.5+40	40	18.5	18.5	28	70	0	93	93	HDPE	MAS025	FALSE	Kg.	20	20K/Bag	None		100.3	0		\N	\N	\N	\N
3095	CID934	CAT010	ITM046	16+16+100	100	16	16	27	67	0	94	94	HDPE	MAS005	FALSE	Kg.	20	20K/Bag	None		166.3	0		\N	\N	\N	\N
3096	CID1432	CAT004	ITM021	10+10+30	30	10	10	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		24.4	30		\N	\N	\N	\N
3097	CID1475	CAT004	ITM020	9+9+30	30	9	9	14	35	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		18.8	30		\N	\N	\N	\N
3098	CID1483	CAT004	ITM019	10+10+30	30	10	10	18	45	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		20.6	30		\N	\N	\N	\N
3099	CID1483	CAT004	ITM020	11+11+32	32	11	11	18	45	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		27.2	30		\N	\N	\N	\N
3100	CID1475	CAT004	ITM011	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3101	CID1475	CAT004	ITM012	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3102	CID1475	CAT004	ITM013	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3103	CID1475	CAT004	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3104	CID1475	CAT004	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3105	CID1475	CAT004	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3106	CID1475	CAT004	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3107	CID1475	CAT004	ITM053	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3108	CID1475	CAT004	ITM033	0	0	0	0	0	0	0	110	110	HDPE	MAS005	TRUE	5 Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
3109	CID1475	CAT004	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS005	TRUE	Roll w/Core	1.8	10R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
3110	CID1475	CAT004	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS005	TRUE	Roll w/Core	3	5Roll/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
3111	CID1475	CAT004	ITM037	55	55	0	0	6	30	0	0	0	HDPE	MAS005	TRUE	Roll	0.8	15Roll/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
3027	CID1456	CAT010	ITM046	57	57	0	0	8	20	34	86	86.36	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		39.4	0		\N	\N	\N	\N
3112	CID1475	CAT004	ITM038	60	60	0	0	8	40	0	140	140	HDPE	MAS005	TRUE	Roll	1.8	10R/Bag	None	Modern Plastic Bag Factory	67.2	0		\N	\N	\N	\N
3113	CID1484	CAT004	ITM028	8+8+36	36	8	8	17	42	20	50.8	50.8	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		22.2	20		\N	\N	\N	\N
3114	CID1485	CAT004	ITM027	8+8+33	33	8	8	25	62	18	45.72	45.72	HDPE	MAS080	TRUE	Kg.	1	20K/Bag	Banana		27.8	20		\N	\N	\N	\N
3115	CID1485	CAT004	ITM028	9+9+41	41	9	9	25	62	22	55.88	55.88	HDPE	MAS080	TRUE	Kg.	1	20K/Bag	Banana		40.9	20		\N	\N	\N	\N
3116	CID1486	CAT004	ITM027	7+7+27	27	7	7	40	100	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		33.3	20		\N	\N	\N	\N
3117	CID1443	CAT004	ITM022	11+11+41	41	11	11	18	45	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		37.4	30		\N	\N	\N	\N
3118	CID1443	CAT004	ITM023	14+14+53	53	14	14	18	45	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		59.3	30		\N	\N	\N	\N
3119	CID423	CAT004	ITM027	50	50	0	0	30	150	0	45	45	LLDPE	MAS001	FALSE	Kg.	1	10P/Bag	Banana		67.5	20		\N	\N	\N	\N
3120	CID423	CAT004	ITM029	50	50	0	0	35	175	0	70	70	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	Banana		122.5	20		\N	\N	\N	\N
3121	CID142	CAT004	ITM045	10	10	0	0	10	50	0	0	0	LLDPE	MAS003	FALSE	Roll	5	5Kg/Box	None		0	0		\N	\N	\N	\N
3122	CID1487	CAT004	ITM027	0	0	0	0	0	0	0	0	0	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
3123	CID1487	CAT004	ITM028	0	0	0	0	20	100	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
3124	CID1487	CAT004	ITM029	0	0	0	0	20	100	0	0	0	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
3125	CID1488	CAT004	ITM045	12+12+52	52	12	12	25	62	0	143	143	LLDPE	MAS100	FALSE	Kg.	1	20K/Bag	None		134.8	0		\N	\N	\N	\N
3126	CID1489	CAT004	ITM027	5+5+21	21	5	5	45	112	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		21.2	20		\N	\N	\N	\N
3127	CID1489	CAT004	ITM028	31	31	0	0	20	100	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		25.2	20		\N	\N	\N	\N
3128	CID1444	CAT004	ITM020	9+9+30	30	9	9	20	50	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		24.4	20		\N	\N	\N	\N
3129	CID1475	CAT004	ITM021	12+12+40	40	12	12	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		27.3	30		\N	\N	\N	\N
3130	CID1490	CAT004	ITM020	8+8+25	25	8	8	13	32	18	45.72	45.72	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		12	0		\N	\N	\N	\N
3131	CID1490	CAT004	ITM021	9+9+32	32	9	9	13	32	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		16.3	0		\N	\N	\N	\N
3132	CID942	CAT010	ITM046	60	60	0	0	25	125	36	91.44	91.44	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		137.2	0		\N	\N	\N	\N
3133	CID1474	CAT004	ITM027	22	22	0	0	10	50	12	30.48	30.48	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		6.7	20		\N	\N	\N	\N
3134	CID1491	CAT004	ITM018	7+7+23	23	7	7	13	32	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		8.4	30		\N	\N	\N	\N
3135	CID1491	CAT004	ITM020	10+10+32	32	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		19.5	30		\N	\N	\N	\N
3136	CID1491	CAT004	ITM037	55	55	0	0	4	20	16	100	100	HDPE	MAS001	TRUE	Roll	1	20K/Bag	None	Plain	22	0		\N	\N	\N	\N
3137	CID1416	CAT004	ITM027	7+7+28	28	7	7	40	100	14	35.56	35.56	LLDPE	MAS048	TRUE	Kg.	1	20K/Bag	Banana		29.9	20		\N	\N	\N	\N
3138	CID1492	CAT004	ITM027	26	26	0	0	20	100	16	40.64	40.64	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		21.1	20		\N	\N	\N	\N
3139	CID1492	CAT004	ITM028	7+7+37	37	7	7	40	100	20	50.8	50.8	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		51.8	20		\N	\N	\N	\N
3140	CID1492	CAT004	ITM029	8+8+45	45	8	8	40	100	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		68.2	20		\N	\N	\N	\N
3141	CID1423	CAT004	ITM009	15+15+51	51	15	15	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3142	CID1493	CAT004	ITM027	25	25	0	0	18	90	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		16	20		\N	\N	\N	\N
3143	CID404	CAT004	ITM083	25+25+70	70	25	25	12	30	0	130	130	Regrind	MAS003	FALSE	Packet	2.8	5P/Bag	None		93.6	0		\N	\N	\N	\N
3144	CID137	CAT004	ITM037	55	55	0	0	6	30	0	0	0	HDPE	MAS004	FALSE	Roll	0.8	20K/Bag	None		0	0		\N	\N	\N	\N
3145	CID1439	CAT004	ITM011	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3146	CID1439	CAT004	ITM012	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3147	CID1439	CAT004	ITM013	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3148	CID1439	CAT004	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3149	CID1439	CAT004	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3150	CID1439	CAT004	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3151	CID1439	CAT004	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3152	CID1439	CAT004	ITM053	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3153	CID1488	CAT004	ITM008	15+15+50	50	15	15	18	45	0	125	125	HDPE	MAS081	FALSE	Packet	2	10P/Bag	None		90	0		\N	\N	\N	\N
3154	CID1494	CAT004	ITM027	26	26	0	0	10	50	14	35	35	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		9.1	20		\N	\N	\N	\N
3155	CID1471	CAT004	ITM027	10+10+33	33	10	10	40	100	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		43.1	20		\N	\N	\N	\N
3156	CID1474	CAT004	ITM022	12+12+44	44	12	12	20	50	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		48.4	30		\N	\N	\N	\N
3157	CID1364	CAT004	ITM019	7+7+25	25	7	7	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		9.5	30		\N	\N	\N	\N
3158	CID1495	CAT004	ITM028	12+12+45	45	12	12	35	87	36	91.44	91.44	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		109.8	20		\N	\N	\N	\N
3159	CID1495	CAT004	ITM029	20+20+59	59	20	20	35	87	39	99.06	99.06	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		170.6	20		\N	\N	\N	\N
3160	CID720	CAT004	ITM003	12+12+35	35	12	12	40	100	24	60.96	60.96	LLDPE	MAS080	TRUE	Packet	2	10P/Bag	None		71.9	0		\N	\N	\N	\N
3161	CID720	CAT004	ITM005	18+18+46	46	18	18	45	112	36	91.44	91.44	LLDPE	MAS080	TRUE	Packet	3	5P/Bag	None		168	0		\N	\N	\N	\N
3162	CID720	CAT004	ITM006	18+18+48	48	18	18	50	125	39	99.06	99.06	LLDPE	MAS080	TRUE	Packet	4	5P/Bag	None		208	0		\N	\N	\N	\N
3163	CID1496	CAT004	ITM027	9+9+27	27	9	9	14	35	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		12.8	20		\N	\N	\N	\N
3164	CID1496	CAT004	ITM029	13+13+35	35	13	13	40	100	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		62	20		\N	\N	\N	\N
3165	CID1497	CAT004	ITM028	6.5+6.5+33	33	6.5	6.5	28	70	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		26.2	20		\N	\N	\N	\N
3166	CID1254	CAT004	ITM028	8+8+28	28	8	8	38	95	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		38.2	20		\N	\N	\N	\N
3167	CID575	CAT004	ITM027	19.5	19.5	0	0	15	75	10	25.4	25.4	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		7.4	20		\N	\N	\N	\N
3168	CID1498	CAT004	ITM028	9+9+36	36	9	9	17	42	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		20.7	20		\N	\N	\N	\N
3169	CID1359	CAT004	ITM027	8+8+30	30	8	8	19	47	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		17.6	20		\N	\N	\N	\N
3170	CID1359	CAT004	ITM029	8+8+34	34	8	8	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		31.5	20		\N	\N	\N	\N
3171	CID1500	CAT004	ITM019	7+7+21	21	7	7	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		10	30		\N	\N	\N	\N
3172	CID1500	CAT004	ITM020	9+9+26	26	9	9	14	35	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		14.1	30		\N	\N	\N	\N
3173	CID1500	CAT004	ITM021	10+10+32	32	10	10	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.5	30		\N	\N	\N	\N
3174	CID1500	CAT004	ITM022	13+13+43	43	13	13	20	50	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		42.1	30		\N	\N	\N	\N
3175	CID1499	CAT004	ITM044	30	30	0	0	14	70	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		19.2	0		\N	\N	\N	\N
3176	CID1499	CAT004	ITM056	23	23	0	0	8	40	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.5	0		\N	\N	\N	\N
3177	CID1499	CAT004	ITM019	10+10+28	28	10	10	22	55	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		24.1	30		\N	\N	\N	\N
3178	CID1499	CAT004	ITM021	10+10+30	30	10	10	27	67	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		40.8	30		\N	\N	\N	\N
3179	CID1020	CAT004	ITM021	11+11+36	36	11	11	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.9	30		\N	\N	\N	\N
3180	CID1034	CAT004	ITM021	10+10+40	40	10	10	20	50	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		33.5	30		\N	\N	\N	\N
3181	CID1501	CAT004	ITM075	35	35	0	0	25	125	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		35.6	0		\N	\N	\N	\N
3182	CID1501	CAT004	ITM045	17	17	0	0	25	125	0	27	27	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		11.5	0		\N	\N	\N	\N
3183	CID1325	CAT004	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS004	TRUE	Roll	0.9	15R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
3184	CID1325	CAT004	ITM037	55	55	0	0	6	30	0	110	110	HDPE	MAS004	TRUE	Roll	0.8	15R/Bag	None	Modern Plastic Bag Factory	36.3	0		\N	\N	\N	\N
3185	CID1325	CAT004	ITM038	60	60	0	0	8	40	0	140	140	HDPE	MAS004	TRUE	Roll	1.8	10R/Bag	None	Modern Plastic Bag Factory	67.2	0		\N	\N	\N	\N
3186	CID1502	CAT004	ITM020	9+9+30	30	9	9	14	35	22	55.88	55.88	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.8	30		\N	\N	\N	\N
3187	CID1503	CAT004	ITM019	8+8+27	27	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.8	30		\N	\N	\N	\N
3188	CID1504	CAT004	ITM027	8+8+30	30	8	8	35	87	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		32.5	20		\N	\N	\N	\N
3189	CID1504	CAT004	ITM029	13+13+36	36	13	13	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		54.8	20		\N	\N	\N	\N
3190	CID1046	CAT004	ITM028	10+10+33	33	10	10	35	87	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		42.2	20		\N	\N	\N	\N
3191	CID1046	CAT004	ITM029	9+9+50	50	9	9	40	100	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		96.7	20		\N	\N	\N	\N
3192	CID1505	CAT004	ITM027	8+8+27	27	8	8	40	100	16	40.64	40.64	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		35	20		\N	\N	\N	\N
3193	CID1505	CAT004	ITM028	7+7+37	37	7	7	40	100	20	50.8	50.8	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		51.8	20		\N	\N	\N	\N
3194	CID1443	CAT004	ITM020	10+10+32	32	10	10	17	42	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.2	30		\N	\N	\N	\N
3195	CID1443	CAT004	ITM021	10+10+37	37	10	10	17	42	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		29.2	30		\N	\N	\N	\N
3196	CID1506	CAT004	ITM028	9+9+33	33	9	9	38	95	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		49.2	20		\N	\N	\N	\N
3197	CID1507	CAT004	ITM027	4+4+25	25	4	4	0	0	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
3198	CID1306	CAT004	ITM019	9+9+26	26	9	9	10	25	16	40.64	40.64	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		8.9	30		\N	\N	\N	\N
3199	CID1306	CAT004	ITM020	11+11+32	32	11	11	10	25	20	50.8	50.8	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.7	30		\N	\N	\N	\N
3200	CID1306	CAT004	ITM021	11+11+34	34	11	11	14	35	24	60.96	60.96	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23.9	30		\N	\N	\N	\N
3201	CID1508	CAT004	ITM027	7+7+30	30	7	7	25	62	16	40.64	40.64	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		22.2	20		\N	\N	\N	\N
3202	CID1508	CAT004	ITM029	10+10+40	40	10	10	30	75	20	50.8	50.8	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		45.7	20		\N	\N	\N	\N
3203	CID086	CAT004	ITM020	10+10+32	32	10	10	15	37	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.5	30		\N	\N	\N	\N
3204	CID086	CAT004	ITM021	10+10+35	35	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		24.8	30		\N	\N	\N	\N
3205	CID942	CAT010	ITM046	45	45	0	0	25	125	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		68.6	0		\N	\N	\N	\N
3206	CID864	CAT004	ITM051	5+5+28	28	5	5	55	137	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		52.9	20		\N	\N	\N	\N
3207	CID1509	CAT004	ITM046	30	30	0	0	8	40	0	0	0	HDPE	MAS021	FALSE	Roll	25	25Kg/Roll	None		0	0		\N	\N	\N	\N
3208	CID1510	CAT004	ITM028	9+9+31	31	9	9	26	65	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		32.4	20		\N	\N	\N	\N
3209	CID1313	CAT004	ITM028	10+10+36	36	10	10	30	75	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		42.7	20		\N	\N	\N	\N
3210	CID1499	CAT004	ITM057	20	20	0	0	15	75	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		10.7	0		\N	\N	\N	\N
3211	CID1232	CAT004	ITM028	40	40	0	0	30	150	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		61	20		\N	\N	\N	\N
3212	CID864	CAT004	ITM064	0	0	0	0	11	55	0	70	70	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3213	CID864	CAT004	ITM065	0	0	0	0	10	50	0	90	90	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3214	CID1511	CAT004	ITM020	8+8+30	30	8	8	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12	30		\N	\N	\N	\N
3215	CID1511	CAT004	ITM021	8+8+30	30	8	8	13	32	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.5	30		\N	\N	\N	\N
3216	CID967	CAT004	ITM019	7.5+7.5+22	22	7.5	7.5	18	45	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.8	30		\N	\N	\N	\N
3217	CID967	CAT004	ITM020	9+9+26	26	9	9	18	45	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.1	30		\N	\N	\N	\N
3218	CID1512	CAT004	ITM028	9+9+36	36	9	9	24	60	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		32.9	20		\N	\N	\N	\N
3219	CID1513	CAT004	ITM028	8+8+32	32	8	8	28	70	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		27.3	20		\N	\N	\N	\N
3220	CID1513	CAT004	ITM029	14+14+40	40	14	14	28	70	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		48.4	20		\N	\N	\N	\N
3221	CID1359	CAT004	ITM030	10+10+41	41	10	10	25	62	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		42.3	20		\N	\N	\N	\N
3222	CID1514	CAT004	ITM021	10+10+40	40	10	10	18	45	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		30.2	30		\N	\N	\N	\N
3223	CID1476	CAT004	ITM027	8+8+34	34	8	8	30	75	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		30.5	20		\N	\N	\N	\N
3224	CID1515	CAT004	ITM019	7+7+23	23	7	7	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		9.6	30		\N	\N	\N	\N
4906	CID2129	CAT008	ITM054	35	35	0	0	12	30	20	50	50	LLDPE	MAS001	True	Kg.	1	20K/Bag			0			\N	\N	\N	\N
3225	CID1516	CAT004	ITM028	8+8+32	32	8	8	50	125	18	45.72	45.72	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		54.9	20		\N	\N	\N	\N
3226	CID1516	CAT004	ITM029	10+10+45	45	10	10	50	125	22	55.88	55.88	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		90.8	20		\N	\N	\N	\N
3227	CID1429	CAT004	ITM019	9+9+27	27	9	9	16	40	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.5	30		\N	\N	\N	\N
3228	CID1429	CAT004	ITM021	12+12+40	40	12	12	20	50	26	66.04	66.04	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		42.3	30		\N	\N	\N	\N
3229	CID1419	CAT004	ITM019	9+9+25	25	9	9	11	27	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		9.4	30		\N	\N	\N	\N
3230	CID1419	CAT004	ITM020	10+10+34	34	10	10	12	30	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.5	30		\N	\N	\N	\N
3231	CID1515	CAT004	ITM020	6+6+27	27	6	6	14	35	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		12.5	30		\N	\N	\N	\N
3232	CID1515	CAT004	ITM021	9+9+40	40	9	9	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		20.6	30		\N	\N	\N	\N
3233	CID1515	CAT004	ITM023	11+11+40	40	11	11	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		28	30		\N	\N	\N	\N
3234	CID1517	CAT004	ITM020	10+10+30	30	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.8	30		\N	\N	\N	\N
3235	CID1517	CAT004	ITM021	13+13+38	38	13	13	15	37	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		31.3	30		\N	\N	\N	\N
3236	CID1518	CAT004	ITM044	20	20	0	0	8	40	14	35.56	35.56	LLDPE	MAS001	TRUE	Box	5	1K/P x 5P/Box	None	Plain	5.7	0		\N	\N	\N	\N
3237	CID1518	CAT004	ITM056	25	25	0	0	9	45	16	40.64	40.64	LLDPE	MAS001	TRUE	Box	5	1K/P x 5P/Box	None	Plain	9.1	0		\N	\N	\N	\N
3238	CID1518	CAT004	ITM057	30	30	0	0	10	50	18	45.72	45.72	LLDPE	MAS001	TRUE	Box	5	1K/P x 5P/Box	None		13.7	0		\N	\N	\N	\N
3239	CID1487	CAT004	ITM028	8+8+36	36	8	8	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		19	20		\N	\N	\N	\N
3240	CID1250	CAT004	ITM027	4+4+20	20	4	4	25	62	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		10.6	20		\N	\N	\N	\N
3241	CID1423	CAT004	ITM020	10+10+29	29	10	10	14	35	20	50.8	50.8	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		17.4	30		\N	\N	\N	\N
3242	CID1519	CAT004	ITM027	7+7+26	26	7	7	20	50	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		16.3	20		\N	\N	\N	\N
3243	CID1519	CAT004	ITM020	10+10+31	31	10	10	20	50	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.9	30		\N	\N	\N	\N
3244	CID1519	CAT004	ITM022	15+15+45	45	15	15	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		61	30		\N	\N	\N	\N
3245	CID1520	CAT004	ITM020	10+10+31	31	10	10	20	50	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.9	30		\N	\N	\N	\N
3246	CID1520	CAT004	ITM022	15+15+45	45	15	15	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		61	30		\N	\N	\N	\N
3247	CID038	CAT004	ITM020	10+10+28	28	10	10	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.6	30		\N	\N	\N	\N
3248	CID1418	CAT004	ITM019	9+9+26	26	9	9	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.4	30		\N	\N	\N	\N
3249	CID1418	CAT004	ITM020	11+11+30	30	11	11	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.9	30		\N	\N	\N	\N
3250	CID1521	CAT004	ITM028	8+8+34	34	8	8	44	110	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		50.3	20		\N	\N	\N	\N
3251	CID1522	CAT004	ITM019	9+9+26	26	9	9	18	45	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		14.1	30		\N	\N	\N	\N
3252	CID1522	CAT004	ITM020	10+10+31	31	10	10	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		28	30		\N	\N	\N	\N
3253	CID1522	CAT004	ITM021	12+12+41	41	12	12	18	45	30	76.2	76.2	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		44.6	30		\N	\N	\N	\N
3254	CID1523	CAT004	ITM027	7+7+28	28	7	7	25	62	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		18.5	20		\N	\N	\N	\N
3255	CID1523	CAT004	ITM028	7+7+30	30	7	7	25	62	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		22.2	20		\N	\N	\N	\N
3256	CID1523	CAT004	ITM029	9+9+40	40	9	9	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		36.5	20		\N	\N	\N	\N
3257	CID1524	CAT004	ITM021	11+11+33	33	11	11	30	75	24	60.96	60.96	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		50.3	30	Dark Blue	\N	\N	\N	\N
3258	CID1524	CAT004	ITM022	15+15+43	43	15	15	30	75	32	81.28	81.28	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		89	30		\N	\N	\N	\N
3259	CID1390	CAT004	ITM062	47	47	0	0	20	100	30	76.2	76.2	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		71.6	0		\N	\N	\N	\N
3260	CID1390	CAT004	ITM063	47	47	0	0	20	100	30	76.2	76.2	HDPE	MAS080	TRUE	Kg.	1	20K/Bag	None		71.6	0		\N	\N	\N	\N
3261	CID1525	CAT004	ITM019	7+7+25	25	7	7	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		9.5	30		\N	\N	\N	\N
3262	CID1525	CAT004	ITM020	9+9+30	30	9	9	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.2	30		\N	\N	\N	\N
3263	CID1525	CAT004	ITM021	10+10+35	35	10	10	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		19.6	30		\N	\N	\N	\N
3264	CID1525	CAT004	ITM022	13+13+40	40	13	13	18	45	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		33.2	30		\N	\N	\N	\N
3265	CID1526	CAT004	ITM028	30	30	0	0	20	100	16	40.64	40.64	LLDPE	MAS001	TRUE	Box	1	20K/Bag	None		24.4	0		\N	\N	\N	\N
3266	CID1527	CAT004	ITM028	10+10+30	30	10	10	25	62	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		25.2	20		\N	\N	\N	\N
3267	CID1527	CAT004	ITM036	50	50	0	0	8	40	20	100	100	LLDPE	MAS005	TRUE	Packet	1	20K/Bag	None	Plain	40	0		\N	\N	\N	\N
3268	CID038	CAT004	ITM033	11+11+33	33	11	11	5	12	0	110	110	HDPE	MAS005	TRUE	5 Roll	0.8	4P/Box	None	Ahmad Saad (Busaad Plastic)	14.5	0		\N	\N	\N	\N
3269	CID038	CAT004	ITM034	13+13+34	34	13	13	7	17	0	120	120	HDPE	MAS005	TRUE	Roll	0.8	4R/Box	None	Ahmad Saad (Busaad Plastic)	24.5	0		\N	\N	\N	\N
3270	CID1507	CAT004	ITM028	40	40	0	0	30	150	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		61	20		\N	\N	\N	\N
3271	CID1414	CAT004	ITM028	8+8+37	37	8	8	36	90	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		43.6	20		\N	\N	\N	\N
3272	CID1453	CAT004	ITM029	11+11+34	34	11	11	20	50	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		25.6	20		\N	\N	\N	\N
3273	CID1640	CAT004	ITM020	9+9+28	28	9	9	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		13.5	0		\N	\N	\N	\N
3274	CID1640	CAT004	ITM021	13+13+37	37	13	13	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		28.4	0		\N	\N	\N	\N
3275	CID1640	CAT004	ITM022	13+13+44	44	13	13	16	40	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		45.5	0		\N	\N	\N	\N
3276	CID1529	CAT004	ITM027	25	25	0	0	10	50	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		10.2	20		\N	\N	\N	\N
3277	CID1530	CAT004	ITM021	11+11+33	33	11	11	20	50	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		33.5	30		\N	\N	\N	\N
3278	CID1530	CAT004	ITM036	50	50	0	0	8	40	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		16.3	0		\N	\N	\N	\N
3279	CID1531	CAT004	ITM021	11+11+40	40	11	11	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		34	30		\N	\N	\N	\N
3280	CID1429	CAT004	ITM058	39.5	39.5	0	0	12	60	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		16.9	0		\N	\N	\N	\N
3281	CID1532	CAT004	ITM046	40	40	0	0	11	55	0	0	0	HDPE	MAS005	TRUE	Roll	25	25Kg/Roll	None		0	0		\N	\N	\N	\N
3282	CID1533	CAT004	ITM020	10+10+30	30	10	10	18	45	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.9	30		\N	\N	\N	\N
3283	CID1533	CAT004	ITM021	12+12+36	36	12	12	18	45	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		35.7	30		\N	\N	\N	\N
3284	CID1122	CAT004	ITM029	6+6+30	30	6	6	25	62	18	45.72	45.72	LLDPE	MAS005	TRUE	Box	10	10P/Bag	Banana		23.8	20		\N	\N	\N	\N
3285	CID1040	CAT004	ITM031	10+10+56	56	10	10	45	112	0	81	81	LLDPE	MAS101	FALSE	Kg.	1	20K/Bag	Banana		137.9	20		\N	\N	\N	\N
3286	CID1040	CAT004	ITM032	11+11+70	70	11	11	50	125	0	85	85	LLDPE	MAS055	FALSE	Kg.	1	20K/Bag	Banana		195.5	20		\N	\N	\N	\N
3287	CID1398	CAT004	ITM028	6+6+32	32	6	6	25	62	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		24.9	20		\N	\N	\N	\N
3288	CID1534	CAT004	ITM019	9+9+25	25	9	9	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.2	30		\N	\N	\N	\N
3289	CID1534	CAT004	ITM020	10+10+30	30	10	10	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		14.6	30		\N	\N	\N	\N
3290	CID1534	CAT004	ITM021	10+10+32	32	10	10	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		20.3	30		\N	\N	\N	\N
3291	CID1534	CAT004	ITM040	15.5	15.5	0	0	9	45	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		4.3	0		\N	\N	\N	\N
3292	CID1534	CAT004	ITM056	21	21	0	0	15	75	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9.6	0		\N	\N	\N	\N
3293	CID1535	CAT004	ITM028	7+7+36	36	7	7	35	87	18	45.72	45.72	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		39.8	20		\N	\N	\N	\N
3294	CID1535	CAT004	ITM029	11+11+42	42	11	11	36	90	22	55.88	55.88	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		64.4	20		\N	\N	\N	\N
3295	CID1536	CAT004	ITM028	9.5+9.5+41	41	9.5	9.5	35	87	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		53	20		\N	\N	\N	\N
3296	CID1537	CAT004	ITM021	9+9+32	32	9	9	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		15.2	30		\N	\N	\N	\N
3297	CID1414	CAT004	ITM032	10+10+70	70	10	10	21	52	28	71.12	71.12	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		66.6	20		\N	\N	\N	\N
3298	CID1414	CAT004	ITM036	50	50	0	0	8	40	0	110	110	LLDPE	MAS078	TRUE	Roll	1	20K/Bag	None	Plain	44	0		\N	\N	\N	\N
3299	CID649	CAT004	ITM053	0	0	0	0	13	65	0	110	110	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
3300	CID1410	CAT004	ITM028	10+10+33	33	10	10	33	82	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		35.3	20		\N	\N	\N	\N
3301	CID1410	CAT004	ITM029	10+10+38	38	10	10	36	90	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		53	20		\N	\N	\N	\N
3302	CID1601	CAT004	ITM027	8+8+30	30	8	8	20	50	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		18.7	20		\N	\N	\N	\N
3303	CID1498	CAT004	ITM029	13+13+37	37	13	13	17	42	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
3304	CID1538	CAT004	ITM020	10+10+31	31	10	10	18	45	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21	30		\N	\N	\N	\N
3305	CID769	CAT004	ITM058	35	35	0	0	25	125	0	40	40	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		35	0		\N	\N	\N	\N
3306	CID769	CAT004	ITM075	35	35	0	0	25	125	0	40	40	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		35	0		\N	\N	\N	\N
3307	CID1539	CAT004	ITM027	6+6+22	22	6	6	22	55	12	30.48	30.48	LLDPE	MAS066	TRUE	Kg.	1	20K/Bag	Banana		11.4	20		\N	\N	\N	\N
3308	CID1539	CAT004	ITM028	9+9+35	35	9	9	23	57	18	45.72	45.72	LLDPE	MAS066	TRUE	Kg.	1	20K/Bag	Banana		27.6	20		\N	\N	\N	\N
3309	CID1102	CAT004	ITM023	11.5+11.5+41	41	11.5	11.5	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	31.2	30		\N	\N	\N	\N
3310	CID1405	CAT004	ITM028	9+9+35	35	9	9	20	50	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		24.2	0		\N	\N	\N	\N
3311	CID1488	CAT004	ITM046	25+25+65	65	25	25	18	45	0	123	123	HDPE	MAS004	FALSE	Packet	2	10P/Bag	None	Plain	127.3	0		\N	\N	\N	\N
3312	CID1540	CAT004	ITM045	50	50	0	0	47	235	28	71.12	71.12	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		167.1	0		\N	\N	\N	\N
3313	CID943	CAT010	ITM046	12.5	12.5	0	0	5	25	0	36	36	HDPE	MAS001	FALSE	Kg.	20	20K/Bag	None		2.3	0		\N	\N	\N	\N
3314	CID1541	CAT004	ITM029	10+10+40	40	10	10	35	87	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		53	20		\N	\N	\N	\N
3315	CID1542	CAT004	ITM019	8+8+24	24	8	8	0	0	12	30.48	30.48	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
3316	CID1542	CAT004	ITM021	10+10+51	51	10	10	0	0	26	66.04	66.04	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
3317	CID1542	CAT004	ITM040	0	0	0	0	10	50	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3318	CID1472	CAT004	ITM020	9+9+32	32	9	9	12	30	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.7	30		\N	\N	\N	\N
3319	CID1543	CAT004	ITM028	10+10+30	30	10	10	22	55	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		27.9	20		\N	\N	\N	\N
3320	CID1455	CAT004	ITM029	5+5+40	40	5	5	45	112	20	50.8	50.8	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		56.9	20		\N	\N	\N	\N
3321	CID1411	CAT004	ITM028	6+6+35	35	6	6	45	112	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		53.5	20		\N	\N	\N	\N
3322	CID1544	CAT004	ITM027	20	20	0	0	9	45	12	30.48	30.48	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		5.5	20		\N	\N	\N	\N
3323	CID1544	CAT004	ITM028	3.5+3.5+25	25	3.5	3.5	18	45	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		10.2	20		\N	\N	\N	\N
3324	CID1555	CAT004	ITM019	5+5+25	25	5	5	15	37	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		9.2	30		\N	\N	\N	\N
3325	CID1545	CAT004	ITM019	6+6+22	22	6	6	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	8.8	30		\N	\N	\N	\N
3326	CID1545	CAT004	ITM028	8+8+32	32	8	8	22	55	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	Banana	Modern Plastic Bag Factory	24.1	20		\N	\N	\N	\N
3379	CID1568	CAT004	ITM012	0	0	0	0	12	60	0	0	0	HDPE	MAS029	FALSE	Roll	0.9	20K/Bag	None	Relam	0	0		\N	\N	\N	\N
3327	CID1545	CAT004	ITM029	7+7+38	38	7	7	22	55	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	Banana	Modern Plastic Bag Factory	32	20		\N	\N	\N	\N
3328	CID1408	CAT004	ITM021	13+13+40	40	13	13	32	80	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		64.4	30		\N	\N	\N	\N
3329	CID1274	CAT004	ITM027	10+10+38	38	10	10	18	45	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		23.9	20		\N	\N	\N	\N
3330	CID1274	CAT004	ITM028	9+9+35	35	9	9	18	45	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		24.2	20		\N	\N	\N	\N
3331	CID1546	CAT004	ITM019	10+10+30	30	10	10	18	45	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		20.6	30		\N	\N	\N	\N
3332	CID1546	CAT004	ITM020	10+10+30	30	10	10	18	45	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		25.1	30		\N	\N	\N	\N
3333	CID1443	CAT004	ITM019	8+8+26	26	8	8	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		10.2	0		\N	\N	\N	\N
3334	CID1547	CAT004	ITM045	50	50	0	0	47	235	28	71.12	71.12	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		167.1	0		\N	\N	\N	\N
3335	CID943	CAT010	ITM046	17.5	17.5	0	0	4	20	0	23	23	HDPE	MAS001	FALSE	Kg.	20	20K/Bag	None		1.6	0		\N	\N	\N	\N
3336	CID1549	CAT004	ITM028	6+6+30	30	6	6	38	95	18	45.72	45.72	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	None		36.5	0		\N	\N	\N	\N
3337	CID1550	CAT004	ITM027	25	25	0	0	15	75	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		13.3	0		\N	\N	\N	\N
3338	CID1551	CAT004	ITM028	10+10+30	30	10	10	20	50	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		22.9	20		\N	\N	\N	\N
3339	CID1552	CAT004	ITM028	30	30	0	0	21	105	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		25.6	20		\N	\N	\N	\N
3340	CID423	CAT004	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS005	FALSE	Roll	1.8	10R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
3341	CID1239	CAT004	ITM030	12+12+50	50	12	12	40	100	34	86.36	86.36	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		127.8	20		\N	\N	\N	\N
3342	CID1553	CAT004	ITM020	10+10+32	32	10	10	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.1	30		\N	\N	\N	\N
3343	CID1554	CAT004	ITM019	8+8+28	28	8	8	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.4	30		\N	\N	\N	\N
3344	CID1554	CAT004	ITM020	9+9+30	30	9	9	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		17.1	30		\N	\N	\N	\N
3345	CID1554	CAT004	ITM021	10+10+45	45	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		29.3	30		\N	\N	\N	\N
3346	CID1097	CAT010	ITM046	56	56	0	0	12	60	0	0	0	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3347	CID486	CAT004	ITM033	0	0	0	0	4	20	0	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
3348	CID486	CAT004	ITM035	34+8+8	34	8	8	15	37	0	110	110	LLDPE	MAS004	TRUE	Roll	0.5	30R/Bag	None	Modern Plastic Bag Factory	40.7	0		\N	\N	\N	\N
3349	CID1556	CAT004	ITM044	7.5	7.5	0	0	17	85	16	40.64	40.64	LLDPE	MAS001	TRUE	Roll	5	5Kg/Box	None		5.2	0		\N	\N	\N	\N
3350	CID1557	CAT004	ITM028	7+7+35	35	7	7	22	55	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		24.6	20		\N	\N	\N	\N
3351	CID1269	CAT010	ITM046	51	51	0	0	15	75	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		46.6	0		\N	\N	\N	\N
3352	CID1559	CAT004	ITM110	80	80	0	0	15	75	0	0	0	LLDPE	MAS001	TRUE	Roll	10	10P/Bag	None	Plain	0	0		\N	\N	\N	\N
3353	CID038	CAT004	ITM021	9+9+34	34	9	9	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.2	30		\N	\N	\N	\N
3354	CID038	CAT004	ITM022	11+11+40	40	11	11	22	55	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		48.5	30		\N	\N	\N	\N
3355	CID1560	CAT004	ITM001	0	0	0	0	3	15	0	0	0	HDPE	MAS005	FALSE	Box	2.6	30Pcs/Px25P/Box	None		0	0		\N	\N	\N	\N
3356	CID1560	CAT004	ITM002	0	0	0	0	3	15	0	0	0	HDPE	MAS005	FALSE	Box	2.85	30Pcs/Px21P/Box	None		0	0		\N	\N	\N	\N
3357	CID1560	CAT004	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS005	FALSE	Box	3.25	30Pcs/Px18P/Box	None		0	0		\N	\N	\N	\N
3358	CID1881	CAT010	ITM046	60	60	0	0	12	60	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		51.2	0		\N	\N	\N	\N
3359	CID1887	CAT010	ITM046	60	60	0	0	12	60	34	86.36	86.36	HDPE	MAS001	TRUE	Roll	20	20K/Bag	None		62.2	0		\N	\N	\N	\N
3360	CID1561	CAT004	ITM027	9+9+30	30	9	9	30	75	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		25.6	20		\N	\N	\N	\N
3361	CID1561	CAT004	ITM028	8+8+33	33	8	8	30	75	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		33.6	20		\N	\N	\N	\N
3362	CID1562	CAT004	ITM028	10+10+30	30	10	10	22	55	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		25.1	20		\N	\N	\N	\N
3363	CID1563	CAT004	ITM027	30	30	0	0	13	65	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		15.8	20		\N	\N	\N	\N
3364	CID1564	CAT004	ITM084	30	30	0	0	12	60	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		16.5	0	15Grams/Pc.	\N	\N	\N	\N
3365	CID1564	CAT004	ITM001	10+10+28	28	10	10	3	7	0	48	48	HDPE	MAS005	FALSE	Box	2.9	30Pc/Px25P/Box	None	Enet	3.2	0		\N	\N	\N	\N
3366	CID1564	CAT004	ITM002	11+11+28	28	11	11	3	7	0	53	53	HDPE	MAS005	FALSE	Box	2.9	30Pc/Px21P/Box	None	Enet	3.7	0		\N	\N	\N	\N
3367	CID1564	CAT004	ITM003	12+12+30	30	12	12	3	7	0	58	58	HDPE	MAS005	FALSE	Box	2.9	30Pc/Px18P/Box	None	Enet	4.4	0		\N	\N	\N	\N
3368	CID1488	CAT010	ITM046	60	60	0	0	16	80	0	150	150	HDPE	MAS029	FALSE	Kg.	1	20K/Bag	None		144	0		\N	\N	\N	\N
3369	CID1564	CAT004	ITM036	50	50	0	0	8	40	0	110	110	LLDPE	MAS004	FALSE	Roll	1	10R/Bag	None	Enet	44	0		\N	\N	\N	\N
3370	CID1565	CAT004	ITM020	10+10+30	30	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.8	30		\N	\N	\N	\N
3371	CID1565	CAT004	ITM036	50	50	0	0	4	20	0	100	100	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	20	0		\N	\N	\N	\N
3373	CID1566	CAT004	ITM036	50	50	0	0	8	40	0	110	110	LLDPE	MAS004	FALSE	Roll w/Core	1.5	10R/Bag	None	Aseel	44	0		\N	\N	\N	\N
3374	CID1566	CAT004	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS004	TRUE	Roll w/Core	1.5	10R/Bag	None	Aseel	44	0		\N	\N	\N	\N
3375	CID1567	CAT004	ITM027	4+4+22	22	4	4	32	80	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		19.5	20		\N	\N	\N	\N
3376	CID1568	CAT004	ITM036	50	50	0	0	8	40	0	110	110	LLDPE	MAS004	TRUE	Roll w/Core	1.5	10R/Bag	None	Relam	44	0		\N	\N	\N	\N
3377	CID1568	CAT004	ITM033	0	0	0	0	4	20	0	110	110	HDPE	MAS005	TRUE	6 Roll	1	20K/Bag	None	Relam	0	0		\N	\N	\N	\N
3378	CID1568	CAT004	ITM011	0	0	0	0	12	60	0	0	0	HDPE	MAS005	FALSE	Roll	0.9	20K/Bag	None	Relam	0	0		\N	\N	\N	\N
3380	CID1568	CAT004	ITM013	0	0	0	0	12	60	0	0	0	HDPE	MAS038	FALSE	Roll	0.9	20K/Bag	None	Relam	0	0		\N	\N	\N	\N
3381	CID1568	CAT004	ITM014	0	0	0	0	12	60	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Relam	0	0		\N	\N	\N	\N
3382	CID1568	CAT004	ITM015	0	0	0	0	12	60	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Relam	0	0		\N	\N	\N	\N
3383	CID1568	CAT004	ITM016	0	0	0	0	12	60	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Relam	0	0		\N	\N	\N	\N
3384	CID1568	CAT004	ITM017	0	0	0	0	12	60	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Relam	0	0		\N	\N	\N	\N
3385	CID1742	CAT010	ITM046	70	70	0	0	12	60	36	91.44	91.44	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		76.8	0		\N	\N	\N	\N
3386	CID202	CAT004	ITM101	7+7+40.5	40.5	7	7	40	100	0	82	82	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		89.4	0		\N	\N	\N	\N
3387	CID1569	CAT004	ITM020	10+10+30	30	10	10	19	47	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		23.9	30		\N	\N	\N	\N
3388	CID1569	CAT004	ITM021	11+11+32	32	11	11	19	47	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		30.9	30		\N	\N	\N	\N
3389	CID1569	CAT004	ITM022	10+10+50	50	10	10	17	42	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		47.8	30		\N	\N	\N	\N
3390	CID1423	CAT004	ITM021	11+11+33	33	11	11	14	35	24	60.96	60.96	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23.5	30		\N	\N	\N	\N
3391	CID1570	CAT004	ITM019	10+10+29	29	10	10	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.6	30		\N	\N	\N	\N
3392	CID1570	CAT004	ITM020	13+13+38	38	13	13	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		35.1	30		\N	\N	\N	\N
3393	CID1571	CAT004	ITM027	10+10+32	32	10	10	24	60	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		28.5	20		\N	\N	\N	\N
3394	CID1571	CAT004	ITM028	12+12+34	34	12	12	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		36.5	20		\N	\N	\N	\N
3395	CID1571	CAT004	ITM029	14+14+38	38	14	14	27	67	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		53.9	20		\N	\N	\N	\N
3396	CID1571	CAT004	ITM009	17+17+58	58	17	17	36	90	0	112	112	HDPE	MAS005	FALSE	Packet	2	10P/Bag	None	Plain	185.5	0		\N	\N	\N	\N
3397	CID1572	CAT004	ITM028	9+9+33	33	9	9	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		45.1	20		\N	\N	\N	\N
3398	CID1573	CAT004	ITM020	9+9+28	28	9	9	15	37	18	45.72	45.72	HDPE	MAS077	TRUE	Kg.	1	20K/Bag	T-Shirt		15.6	30		\N	\N	\N	\N
3399	CID1573	CAT004	ITM021	13+13+37	37	13	13	16	40	24	60.96	60.96	HDPE	MAS077	TRUE	Kg.	1	20K/Bag	T-Shirt		30.7	30		\N	\N	\N	\N
3400	CID1573	CAT004	ITM022	13+13+44	44	13	13	18	45	32	81.28	81.28	HDPE	MAS077	TRUE	Kg.	1	20K/Bag	T-Shirt		51.2	30		\N	\N	\N	\N
3401	CID1574	CAT004	ITM019	8+8+27	27	8	8	14	35	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		13.8	30		\N	\N	\N	\N
3402	CID1574	CAT004	ITM020	9+9+32	32	9	9	15	37	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		20.7	30		\N	\N	\N	\N
3403	CID1574	CAT004	ITM021	9+9+36	36	9	9	16	40	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		28.5	30		\N	\N	\N	\N
3404	CID1488	CAT004	ITM035	8+8+34	34	8	8	15	37	0	110	110	LLDPE	MAS004	FALSE	Roll	0.5	30R/Bag	None		40.7	0		\N	\N	\N	\N
3405	CID1575	CAT004	ITM028	9+9+31	31	9	9	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		43.3	20		\N	\N	\N	\N
3406	CID1576	CAT004	ITM029	8+8+45	45	8	8	20	50	22	55.88	55.88	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		34.1	20		\N	\N	\N	\N
3407	CID1440	CAT004	ITM020	9+9+28	28	9	9	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.7	30		\N	\N	\N	\N
3408	CID1423	CAT004	ITM019	8+8+29	29	8	8	14	35	16	40.64	40.64	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.8	30		\N	\N	\N	\N
3409	CID1577	CAT004	ITM020	9+9+31	31	9	9	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.6	30		\N	\N	\N	\N
3410	CID1577	CAT004	ITM021	10+10+35	35	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		24.8	30		\N	\N	\N	\N
3411	CID1577	CAT004	ITM022	13+13+40	40	13	13	24	60	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		56.3	30		\N	\N	\N	\N
3413	CID1578	CAT004	ITM028	37+9+9	37	9	9	25	62	20	50.8	50.8	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		34.6	20		\N	\N	\N	\N
3414	CID1578	CAT004	ITM029	44+9+9	44	9	9	27	67	22	55.88	55.88	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		46.4	20		\N	\N	\N	\N
3415	CID1578	CAT004	ITM030	45+9+9	45	9	9	27	67	28	71.12	71.12	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		60	20		\N	\N	\N	\N
3416	CID1579	CAT004	ITM027	22	22	0	0	15	75	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana	Modern Plastic Bag Factory	10.1	20		\N	\N	\N	\N
3417	CID1579	CAT004	ITM028	6.5+6.5+26.5	26.5	6.5	6.5	30	75	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana	Modern Plastic Bag Factory	24.1	20		\N	\N	\N	\N
3418	CID1580	CAT004	ITM027	6+6+28	28	6	6	45	112	14	35.56	35.56	LLDPE	MAS101	TRUE	Kg.	1	20K/Bag	Banana		31.9	20		\N	\N	\N	\N
3419	CID1581	CAT004	ITM046	57	57	0	0	8	40	0	80	80	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		36.5	0		\N	\N	\N	\N
3420	CID1581	CAT004	ITM062	57	57	0	0	8	40	0	0	0	HDPE	MAS001	FALSE	Roll	10	10P/Bag	None		0	0		\N	\N	\N	\N
3421	CID1582	CAT004	ITM046	57	57	0	0	7	35	0	87	87	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		34.7	0		\N	\N	\N	\N
3422	CID1583	CAT004	ITM027	23	23	0	0	20	100	13	33.02	33.02	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		15.2	20		\N	\N	\N	\N
3423	CID1584	CAT004	ITM027	20	20	0	0	13	65	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		7.9	20		\N	\N	\N	\N
3424	CID1585	CAT004	ITM028	8+8+33	33	8	8	16	40	18	45.72	45.72	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		17.9	20		\N	\N	\N	\N
3425	CID1586	CAT004	ITM028	5+5+23	23	5	5	32	80	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		21.5	20		\N	\N	\N	\N
3426	CID1586	CAT006	ITM036	50	50	0	0	8	40	0	100	100	HDPE	MAS001	TRUE	Roll	1	20K/Bag	None	Plain	40	0		\N	\N	\N	\N
3427	CID1587	CAT003	ITM020	10+10+30	30	10	10	20	50	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		27.9	30		\N	\N	\N	\N
3428	CID1587	CAT007	ITM040	16	16	0	0	9	45	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		4.4	0		\N	\N	\N	\N
3429	CID1587	CAT007	ITM041	22	22	0	0	11	55	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		8.6	0		\N	\N	\N	\N
3430	CID1497	CAT004	ITM027	8+8+26	26	8	8	28	70	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.9	20		\N	\N	\N	\N
3431	CID1419	CAT008	ITM044	18	18	0	0	17	85	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9.3	0		\N	\N	\N	\N
3432	CID1588	CAT004	ITM028	5+5+24	24	5	5	22	55	16	40.64	40.64	HDPE	MAS001	TRUE	Box	10	10P/Bag	Banana		15.2	20		\N	\N	\N	\N
3433	CID1588	CAT004	ITM029	8.5+8.5+37	37	8.5	8.5	25	62	18	45.72	45.72	HDPE	MAS001	TRUE	Box	10	10P/Bag	Banana		30.6	20		\N	\N	\N	\N
3434	CID1589	CAT008	ITM055	40.5	40.5	0	0	10	50	0	23	23	LLDPE	MAS001	FALSE	Packet	1	20K/Bag	None		9.3	0		\N	\N	\N	\N
3435	CID1590	CAT003	ITM020	11+11+31	31	11	11	20	50	22	55.88	55.88	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		29.6	30		\N	\N	\N	\N
3436	CID1591	CAT004	ITM028	6.5+6.5+33	33	6.5	6.5	28	70	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		26.2	20		\N	\N	\N	\N
3438	CID961	CAT003	ITM019	9+9+27	27	9	9	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.2	30		\N	\N	\N	\N
3439	CID961	CAT003	ITM021	10+10+32	32	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23.5	30		\N	\N	\N	\N
3440	CID1607	CAT010	ITM046	60	60	0	0	6	30	0	0	0	HDPE	MAS001	FALSE	Roll	20	20K/Bag	None	Plain	0	0		\N	\N	\N	\N
3441	CID2083	CAT010	ITM046	60	60	0	0	6	30	0	0	0	HDPE	MAS001	FALSE	Roll	20	20K/Bag	None		0	0		\N	\N	\N	\N
3442	CID1592	CAT006	ITM035	45	45	0	0	9	45	0	90	90	LLDPE	MAS005	TRUE	Packet	1	20K/Bag	None	Plain	36.5	0		\N	\N	\N	\N
3443	CID1594	CAT004	ITM028	10+10+30	30	10	10	23	57	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		26.1	20		\N	\N	\N	\N
3444	CID1593	CAT004	ITM027	4+4+24	24	4	4	20	50	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		11.4	20		\N	\N	\N	\N
3445	CID1593	CAT004	ITM028	13+13+35	35	13	13	20	50	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		27.9	20		\N	\N	\N	\N
3446	CID1444	CAT004	ITM029	11+11+40	40	11	11	20	50	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		34.6	20		\N	\N	\N	\N
3447	CID1595	CAT004	ITM028	9+9+34	34	9	9	30	75	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		35.7	20		\N	\N	\N	\N
3448	CID1595	CAT004	ITM029	11.5+11.5+40	40	11.5	11.5	30	75	22	55.88	55.88	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		52.8	20		\N	\N	\N	\N
3449	CID004	CAT001	ITM006	50+18+18	50	18	18	14	35	0	100	100	Regrind	MAS004	FALSE	Packet	2.5	10P/Bag	None	Plain	60.2	0		\N	\N	\N	\N
3450	CID555	CAT003	ITM019	10+10+29	29	10	10	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.4	30		\N	\N	\N	\N
3451	CID555	CAT003	ITM021	12+12+39	39	12	12	15	37	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		33.2	30		\N	\N	\N	\N
3452	CID1596	CAT003	ITM020	11+11+35	35	11	11	13	32	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		20.4	30		\N	\N	\N	\N
3453	CID1596	CAT003	ITM021	12+12+43	43	12	12	15	37	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		35.3	30		\N	\N	\N	\N
3454	CID1596	CAT003	ITM022	13+13+47	47	13	13	16	40	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		47.5	30		\N	\N	\N	\N
3455	CID1597	CAT003	ITM021	10+10+35	35	10	10	15	37	24	60.96	60.96	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		24.8	30		\N	\N	\N	\N
3456	CID1598	CAT004	ITM027	6+6+36	36	6	6	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		16.2	20		\N	\N	\N	\N
3457	CID1598	CAT004	ITM028	8+8+40	40	8	8	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		21.1	20		\N	\N	\N	\N
3458	CID1598	CAT004	ITM029	10+10+42	42	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		28	20		\N	\N	\N	\N
3459	CID1599	CAT004	ITM028	10+10+30	30	10	10	20	50	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		22.9	20		\N	\N	\N	\N
3460	CID1600	CAT003	ITM021	12+12+38	38	12	12	16	40	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		35.3	30		\N	\N	\N	\N
3461	CID1600	CAT003	ITM022	14+14+49	49	14	14	16	40	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		50.1	30		\N	\N	\N	\N
3462	CID1600	CAT003	ITM020	35+10+10	35	10	10	14	35	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		0	30		\N	\N	\N	\N
3463	CID1566	CAT005	ITM035	8+8+34	34	8	8	15	37	0	110	110	LLDPE	MAS004	FALSE	Roll	0.8	20K/Bag	None	Aseel	40.7	0		\N	\N	\N	\N
3464	CID1269	CAT003	ITM020	10+10+30	30	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.2	30		\N	\N	\N	\N
3465	CID754	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS038	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
3466	CID1602	CAT004	ITM028	8+8+33	33	8	8	16	40	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.9	20		\N	\N	\N	\N
3471	CID1428	CAT004	ITM029	13+13+35	35	13	13	40	100	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		62	20		\N	\N	\N	\N
3472	CID004	CAT001	ITM005	15+15+40	40	15	15	9	22	0	80	80	Regrind	MAS003	FALSE	Packet	1.2	10P/Bag	None	Modern Plastic Bag Factory	24.6	0		\N	\N	\N	\N
3473	CID1603	CAT004	ITM028	8+8+31	31	8	8	35	87	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		33.2	20		\N	\N	\N	\N
3474	CID1604	CAT003	ITM021	10+10+32	32	10	10	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.2	30		\N	\N	\N	\N
3475	CID1605	CAT004	ITM029	13+13+42	42	13	13	25	62	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		47.1	20		\N	\N	\N	\N
3476	CID1606	CAT006	ITM037	55	55	0	0	10	50	0	110	110	LLDPE	MAS005	TRUE	Roll	1	20K/Bag	None		60.5	0		\N	\N	\N	\N
3477	CID649	CAT005	ITM033	14+14+34	34	14	14	4	10	0	125	125	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	We One Shopping Center	15.5	0		\N	\N	\N	\N
3478	CID1419	CAT008	ITM056	28	28	0	0	15	75	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		21.3	0		\N	\N	\N	\N
3479	CID1566	CAT005	ITM033	9+9+32	32	9	9	3.5	8	0	110	110	HDPE	MAS004	FALSE	5 Roll	0.9	20K/Bag	None	Aseel	8.8	0		\N	\N	\N	\N
3480	CID004	CAT001	ITM007	15+15+60	60	15	15	15	37	0	110	110	Regrind	MAS003	FALSE	Packet	1.6	25Pc/P x 5P/Bag	None	Plain	73.3	0		\N	\N	\N	\N
3481	CID1439	CAT006	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS005	TRUE	Roll w/Core	2	20K/Bag	None	Amazing World	44	0		\N	\N	\N	\N
3482	CID1577	CAT006	ITM035	55	55	0	0	8	40	0	110	110	LLDPE	MAS005	TRUE	Roll	0.6	20K/Bag	None	Sufra Fast Food	48.4	0		\N	\N	\N	\N
3483	CID1607	CAT010	ITM062	60	60	0	0	9	45	0	85	85	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		45.9	0		\N	\N	\N	\N
3484	CID1608	CAT009	ITM020	10+10+30	30	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.8	30		\N	\N	\N	\N
3485	CID1608	CAT006	ITM036	51	51	0	0	6	30	0	100	100	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		30.6	0		\N	\N	\N	\N
3486	CID1609	CAT004	ITM027	5+5+30	30	5	5	35	87	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		28.3	20		\N	\N	\N	\N
3487	CID366	CAT004	ITM028	9+9+33	33	9	9	35	87	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		45.1	20		\N	\N	\N	\N
3488	CID366	CAT004	ITM029	8+8+40	40	8	8	35	87	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		49.5	20		\N	\N	\N	\N
3489	CID1608	CAT003	ITM021	10+10+38	38	10	10	15	37	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		24	30		\N	\N	\N	\N
3490	CID1610	CAT004	ITM027	9+9+32	32	9	9	35	87	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		39.8	20		\N	\N	\N	\N
3491	CID1610	CAT004	ITM028	9+9+40	40	9	9	35	87	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		46.1	20		\N	\N	\N	\N
3492	CID1610	CAT004	ITM029	11+11+52	52	11	11	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		65.4	20		\N	\N	\N	\N
3493	CID1611	CAT004	ITM029	47	47	0	0	22	110	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		63	20		\N	\N	\N	\N
3494	CID1612	CAT004	ITM028	10+10+30	30	10	10	25	62	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		28.3	20		\N	\N	\N	\N
3495	CID2083	CAT010	ITM046	60	60	0	0	6	30	0	85	85	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		30.6	0		\N	\N	\N	\N
3496	CID1614	CAT003	ITM020	8+8+28	28	8	8	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.9	30		\N	\N	\N	\N
3497	CID1614	CAT003	ITM022	11+11+39	39	11	11	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23.8	30		\N	\N	\N	\N
3498	CID2092	CAT010	ITM046	60	60	0	0	9	45	34	170	170	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	None		91.8	0		\N	\N	\N	\N
3499	CID1615	CAT004	ITM027	20	20	0	0	13	65	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		7.9	20		\N	\N	\N	\N
3500	CID1615	CAT004	ITM028	8+8+24	24	8	8	25	62	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		17.6	20		\N	\N	\N	\N
3501	CID1616	CAT004	ITM029	6+6+41	41	6	6	40	100	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		59.2	20		\N	\N	\N	\N
3502	CID1617	CAT004	ITM027	8+8+24	24	8	8	25	62	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		17.6	20		\N	\N	\N	\N
3503	CID1618	CAT003	ITM019	8+8+27	27	8	8	14	35	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		13.8	30		\N	\N	\N	\N
3504	CID1618	CAT003	ITM020	9+9+32	32	9	9	15	37	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		20.7	30		\N	\N	\N	\N
3505	CID1618	CAT003	ITM021	9+9+36	36	9	9	16	40	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		28.5	30		\N	\N	\N	\N
3506	CID1619	CAT004	ITM028	8+8+33	33	8	8	16	40	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.9	20		\N	\N	\N	\N
3470	CID1304	CAT005	ITM035	50+5+5	50	5	5	14	35	0	110	110	HDPE	MAS005	Yes	Roll w/Core	1.4	30Pcs/R x 8R/Bag	None	Best	462.00	0	47 grms/pc	8	11.20	\N	\N
3437	CID1304	CAT005	ITM106	34+8+8	34	8	8	15	37.5	0	110	110	LLDPE	MAS004	No	ROLL	0.5	24R/Bag	None	Best	412.50	0		24	12.00	\N	\N
3467	CID1304	CAT002	ITM012	0	0	0	0	0	0	0	0	0	HDPE	MAS029	No	Roll	0.45	24R/Bag	None	Best	0	0		24	10.80	\N	\N
3507	CID1619	CAT004	ITM029	10+10+44	44	10	10	0	0	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
3508	CID1620	CAT003	ITM019	6.5+6.5+24	24	6.5	6.5	15	37	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.1	30		\N	\N	\N	\N
3509	CID1620	CAT003	ITM020	8+8+26	26	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.5	30		\N	\N	\N	\N
3510	CID1621	CAT004	ITM027	24	24	0	0	10	50	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		8.5	0		\N	\N	\N	\N
3511	CID1621	CAT003	ITM020	9+9+28	28	9	9	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.1	30		\N	\N	\N	\N
3512	CID1621	CAT003	ITM021	10+10+30	30	10	10	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.3	30		\N	\N	\N	\N
3513	CID1622	CAT004	ITM028	8+8+35	35	8	8	40	100	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		46.6	20		\N	\N	\N	\N
3514	CID226	CAT005	ITM033	14+14+34	34	14	14	6	15	0	125	125	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Modern Plastic Bag Factory	23.3	0		\N	\N	\N	\N
3515	CID1623	CAT003	ITM021	9+9+34.5	34.5	9	9	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		19.7	30		\N	\N	\N	\N
3516	CID1623	CAT003	ITM023	11+11+39	39	11	11	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		27.5	30		\N	\N	\N	\N
3517	CID1250	CAT001	ITM001	30+9+9	30	9	9	4	10	0	48	48	HDPE	MAS005	FALSE	Packet	0.4	90Pc/P x 10P/Box	None	Plain	4.6	0	4.3G/Pc.	\N	\N	\N	\N
3518	CID1250	CAT001	ITM006	14+14+50	50	14	14	9	22	0	93	93	HDPE	MAS003	FALSE	Packet	1.5	50Pcs/Packet	None	Plain	31.9	0	30G/Pc.	\N	\N	\N	\N
3519	CID1250	CAT001	ITM006	10+10+52	52	10	10	60	150	28	71.12	71.12	LLDPE	MAS080	TRUE	Kg.	2	10P/Bag	None	Plain	153.6	0		\N	\N	\N	\N
3520	CID252	CAT004	ITM028	9+9+30.5	30.5	9	9	36	90	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		44.3	20		\N	\N	\N	\N
3521	CID252	CAT004	ITM029	11.5+11.5+44.5	44.5	11.5	11.5	36	90	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		80.2	20		\N	\N	\N	\N
3522	CID555	CAT003	ITM020	11+11+31	31	11	11	13	32	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		19	30		\N	\N	\N	\N
3523	CID1624	CAT004	ITM027	8+8+25	25	8	8	25	62	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		18.1	20		\N	\N	\N	\N
3524	CID1624	CAT004	ITM028	13+13+35	35	13	13	25	62	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		38.4	20		\N	\N	\N	\N
3525	CID1625	CAT003	ITM019	7+7+24	24	7	7	15	37	16	40.64	40.64	HDPE	MAS029	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		11.4	30		\N	\N	\N	\N
3526	CID1625	CAT003	ITM020	8+8+27.5	27.5	8	8	15	37	18	45.72	45.72	HDPE	MAS029	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		14.7	30		\N	\N	\N	\N
3527	CID1625	CAT003	ITM022	11+11+37	37	11	11	15	37	24	60.96	60.96	HDPE	MAS029	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		26.6	30		\N	\N	\N	\N
3528	CID1577	CAT006	ITM037	55	55	0	0	6	30	0	110	110	LLDPE	MAS005	TRUE	Roll	0.4	20K/Bag	None	Sufra Fast Food	36.3	0		\N	\N	\N	\N
3529	CID1626	CAT003	ITM019	9+9+28	28	9	9	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.5	30		\N	\N	\N	\N
3530	CID1626	CAT003	ITM020	10+10+32	32	10	10	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.5	30		\N	\N	\N	\N
3531	CID403	CAT008	ITM044	19	19	0	0	12	60	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		6.9	0		\N	\N	\N	\N
3532	CID1250	CAT001	ITM007	12+12+53	53	12	12	60	150	22	110	110	LLDPE	MAS091	TRUE	Kg.	1	10P/Bag	None		254.1	0		\N	\N	\N	\N
3533	CID1627	CAT004	ITM027	30	30	0	0	18	90	16	40.64	40.64	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		21.9	20		\N	\N	\N	\N
3534	CID1628	CAT004	ITM028	9+9+33	33	9	9	20	50	18	45.72	45.72	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		23.3	20		\N	\N	\N	\N
3535	CID1479	CAT004	ITM030	10+10+46	46	10	10	28	70	32	81.28	81.28	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		75.1	20		\N	\N	\N	\N
3536	CID1514	CAT006	ITM036	50	50	0	0	6	30	0	100	100	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	30	0		\N	\N	\N	\N
3537	CID1629	CAT004	ITM027	6+6+32	32	6	6	30	75	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		26.8	20		\N	\N	\N	\N
3538	CID1629	CAT004	ITM028	9+9+40	40	9	9	20	50	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.4	20		\N	\N	\N	\N
3539	CID1629	CAT004	ITM029	12+12+55	55	12	12	20	50	32	81.28	81.28	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		64.2	20		\N	\N	\N	\N
3540	CID1629	CAT004	ITM022	17+17+74	74	17	17	30	75	39	99.06	99.06	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		160.5	20		\N	\N	\N	\N
3541	CID405	CAT003	ITM022	45+13+13	45	13	13	18	45	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	t-shirt		51.9	30		\N	\N	\N	\N
3542	CID405	CAT008	ITM040	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3543	CID405	CAT008	ITM041	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3544	CID1597	CAT004	ITM027	8+8+27	27	8	8	15	37	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		14.5	20		\N	\N	\N	\N
3545	CID1630	CAT003	ITM020	11+11+38	38	11	11	16	40	20	50.8	50.8	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		24.4	30		\N	\N	\N	\N
3546	CID1630	CAT006	ITM035	45	45	0	0	5	25	20	100	100	LLDPE	MAS055	TRUE	Packet	1	20K/Bag	None	Plain	22.5	0		\N	\N	\N	\N
3547	CID1488	CAT009	ITM045	60	60	0	0	25	125	0	160	160	LLDPE	MAS086	FALSE	Packet	2	10P/Bag	None		240	0		\N	\N	\N	\N
3548	CID914	CAT009	ITM045	60	60	0	0	43	215	0	100	100	LLDPE	MAS029	FALSE	Kg.	20	20K/Bag	None		258	0		\N	\N	\N	\N
3549	CID918	CAT009	ITM045	14.5	14.5	0	0	10	50	8	20.32	20.32	LLDPE	MAS001	TRUE	Kg.	20	20K/Bag	None		2.9	0		\N	\N	\N	\N
3550	CID1632	CAT015	ITM110	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3551	CID1632	CAT004	ITM029	12+12+46	46	12	12	30	75	23	58.42	58.42	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		61.3	20		\N	\N	\N	\N
3552	CID1633	CAT004	ITM019	7+7+32	32	7	7	18	45	18	45.72	45.72	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.9	30		\N	\N	\N	\N
3553	CID1633	CAT004	ITM029	9+9+48	48	9	9	20	50	18	45.72	45.72	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		30.2	20		\N	\N	\N	\N
3554	CID1634	CAT004	ITM027	20	20	0	0	12	60	10	25.4	25.4	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		6.1	20		\N	\N	\N	\N
3555	CID568	CAT004	ITM027	27	27	0	0	13	65	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12.5	20		\N	\N	\N	\N
3556	CID1635	CAT004	ITM027	8+8+24	24	8	8	32	80	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		22.8	20		\N	\N	\N	\N
3557	CID1635	CAT004	ITM028	9+9+31	31	9	9	32	80	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.8	20		\N	\N	\N	\N
3558	CID918	CAT009	ITM045	14.5	14.5	0	0	11	55	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	20	20K/Bag	None		4.1	0		\N	\N	\N	\N
3559	CID1637	CAT003	ITM019	8+8+23	23	8	8	9	22	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		6.1	30		\N	\N	\N	\N
3560	CID1637	CAT003	ITM020	10+10+27	27	10	10	9	22	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		9.5	30		\N	\N	\N	\N
3561	CID1637	CAT003	ITM021	11+11+31	31	11	11	11	27	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16	30		\N	\N	\N	\N
3562	CID1638	CAT004	ITM028	10+10+32	32	10	10	30	75	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		35.7	20		\N	\N	\N	\N
3563	CID1250	CAT009	ITM045	10+10+40	40	10	10	38	95	0	69	69	LLDPE	MAS036	FALSE	Packet	2	10P/Bag	None		78.7	0		\N	\N	\N	\N
3564	CID1250	CAT009	ITM075	15+15+55	55	15	15	43	107	0	100	100	LLDPE	MAS036	FALSE	Packet	2	10P/Bag	None		181.9	0		\N	\N	\N	\N
3565	CID1638	CAT004	ITM029	14+14+40	40	14	14	30	75	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		51.8	20		\N	\N	\N	\N
3566	CID1399	CAT004	ITM028	6+6+26	26	6	6	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		23.9	0		\N	\N	\N	\N
3567	CID1399	CAT004	ITM029	10+10+50	50	10	10	25	62	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		52.9	0		\N	\N	\N	\N
3568	CID1641	CAT007	ITM011	14	14	0	0	11	55	16	40.64	40.64	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		6.3	0		\N	\N	\N	\N
3569	CID1641	CAT007	ITM012	14	14	0	0	11	55	16	40.64	40.64	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		6.3	0		\N	\N	\N	\N
3570	CID1641	CAT007	ITM013	14	14	0	0	11	55	16	40.64	40.64	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		6.3	0		\N	\N	\N	\N
3571	CID1641	CAT007	ITM014	14	14	0	0	11	55	20	50.8	50.8	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		7.8	0		\N	\N	\N	\N
3572	CID1641	CAT007	ITM015	14	14	0	0	11	55	20	50.8	50.8	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		7.8	0		\N	\N	\N	\N
3573	CID1641	CAT007	ITM016	11	11	0	0	11	55	24	60.96	60.96	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		7.4	0		\N	\N	\N	\N
3574	CID1641	CAT007	ITM017	11	11	0	0	11	55	24	60.96	60.96	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		7.4	0		\N	\N	\N	\N
3575	CID1641	CAT007	ITM053	11	11	0	0	11	55	28	71.12	71.12	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		8.6	0		\N	\N	\N	\N
3576	CID1641	CAT007	ITM037	11	11	0	0	11	55	24	60.96	60.96	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		7.4	0		\N	\N	\N	\N
3577	CID1641	CAT007	ITM038	14	14	0	0	11	55	28	71.12	71.12	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		11	0		\N	\N	\N	\N
3578	CID004	CAT001	ITM006	50+15+15	50	15	15	9	22	0	100	100	Regrind	MAS003	FALSE	Packet	1.8	10P/Bag	None		35.2	0		\N	\N	\N	\N
3579	CID1566	CAT001	ITM006	12+12+50	50	12	12	8	20	0	90	90	Regrind	MAS004	FALSE	Packet	0.8	25P/Bag	None	Aseel	26.6	0		\N	\N	\N	\N
3581	CID404	CAT010	ITM020	10+10+30	30	10	10	12	30	0	53	53	HDPE	MAS001	FALSE	Box	5	5Kg/Box	None		15.9	0		\N	\N	\N	\N
3582	CID1642	CAT005	ITM033	15+15+32	32	15	15	7	17	0	125	125	HDPE	MAS005	TRUE	Roll	0.33	10R/Bag	None	Sufrah Taam	26.4	0		\N	\N	\N	\N
3583	CID1642	CAT005	ITM033	15+15+32	32	15	15	7	17	0	125	125	HDPE	MAS005	TRUE	Roll	0.33	12R/Box	None	Sufrah Taam	26.4	0		\N	\N	\N	\N
3584	CID1642	CAT005	ITM033	15+15+32	32	15	15	7	17	0	125	125	HDPE	MAS005	TRUE	Roll	1	4R/Box	None	Sufrah Taam	26.4	0		\N	\N	\N	\N
3585	CID1642	CAT005	ITM033	15+15+32	32	15	15	7	17	0	125	125	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Sufrah Taam	26.4	0		\N	\N	\N	\N
3586	CID1406	CAT004	ITM028	8+8+27	27	8	8	18	45	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	20	20K/Bag	Banana		15.7	20		\N	\N	\N	\N
3587	CID1643	CAT009	ITM019	18.5	18.5	0	0	20	100	8	20.32	20.32	LLDPE	MAS005	TRUE	Kg.	20	20K/Bag	None		7.5	0		\N	\N	\N	\N
3588	CID1644	CAT004	ITM020	6+6+28	28	6	6	50	125	14	35.56	35.56	LLDPE	MAS009	TRUE	Kg.	20	20K/Bag	Banana		35.6	20		\N	\N	\N	\N
3589	CID1645	CAT009	ITM015	40	40	0	0	20	100	0	75	75	LLDPE	MAS001	FALSE	Kg.	20	20K/Bag	None		60	0		\N	\N	\N	\N
3590	CID1514	CAT003	ITM028	10+10+30	30	10	10	18	45	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		20.6	30		\N	\N	\N	\N
3591	CID1167	CAT004	ITM028	9+9+31	31	9	9	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		43.3	20		\N	\N	\N	\N
3592	CID1167	CAT004	ITM028	9+9+31	31	9	9	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		43.3	20		\N	\N	\N	\N
3593	CID1502	CAT004	ITM028	9+9+31	31	9	9	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		43.3	20		\N	\N	\N	\N
3594	CID1646	CAT003	ITM020	8+8+26	26	8	8	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt w/Hook		15.4	30		\N	\N	\N	\N
3595	CID1399	CAT004	ITM027	30	30	0	0	13	65	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		13.9	0		\N	\N	\N	\N
3596	CID1647	CAT004	ITM027	20	20	0	0	19	95	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		11.6	20		\N	\N	\N	\N
3597	CID1647	CAT004	ITM028	8+8+26	26	8	8	38	95	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		28.4	20		\N	\N	\N	\N
3598	CID1647	CAT004	ITM029	8+8+40	40	8	8	50	125	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		71.1	20		\N	\N	\N	\N
3599	CID1647	CAT004	ITM030	10+10+50	50	10	10	50	125	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	20	20K/Bag	Banana		106.7	20		\N	\N	\N	\N
3600	CID1566	CAT001	ITM009	60+18+18	60	18	18	9	22	0	110	110	Regrind	MAS003	FALSE	Packet	0.8	25P/bag	None	Aseel	46.5	0		\N	\N	\N	\N
3601	CID1566	CAT005	ITM033	9+9+32	32	9	9	3.5	8	0	100	100	HDPE	MAS004	TRUE	100 pes/roll	0.9	20K/Bag	None	Aseel	8	0		\N	\N	\N	\N
3602	CID1566	CAT001	ITM007	50+15+15	50	15	15	9	22	0	100	100	Regrind	MAS002	FALSE	Packet	0.8	25P/Bag	None	Aseel	35.2	0		\N	\N	\N	\N
3603	CID1566	CAT002	ITM011	10+10+28	28	10	10	10	25	0	50	50	HDPE	MAS005	FALSE	Roll	0.4	40R/Bag	None	Aseel	12	0	60-65 Pcs./Roll	\N	\N	\N	\N
3604	CID1566	CAT002	ITM012	11+11+28	28	11	11	10	25	0	60	60	HDPE	MAS029	FALSE	Roll	0.4	40R/Bag	None	Aseel	15	0	50-55 Pcs./Roll	\N	\N	\N	\N
3605	CID1566	CAT002	ITM013	12+12+30	30	12	12	10	25	0	70	70	HDPE	MAS038	FALSE	Roll	0.4	40R/Bag	None	Aseel	18.9	0	38-40 Pcs./Roll	\N	\N	\N	\N
3606	CID1648	CAT003	ITM019	7+7+28	28	7	7	12	30	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	20	20K/Bag	T-Shirt w/Hook		11.5	30		\N	\N	\N	\N
3607	CID1648	CAT003	ITM021	9+9+32	32	9	9	13	32	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	20	20K/Bag	T-Shirt w/Hook		17.9	30		\N	\N	\N	\N
3608	CID1597	CAT003	ITM022	12+12+46	46	12	12	17	42	28	71.12	71.12	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		41.8	30		\N	\N	\N	\N
3609	CID1649	CAT003	ITM019	6+6+23	23	6	6	0	0	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
3610	CID1649	CAT003	ITM020	10+10+32	32	10	10	0	0	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
3611	CID1649	CAT003	ITM021	10+10+38	38	10	10	0	0	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
3612	CID1631	CAT001	ITM006	23+23+50	50	23	23	25	62	0	107	107	LLDPE	MAS003	FALSE	Packet	1	10P/Bag	None	Plain	127.4	0		\N	\N	\N	\N
3613	CID923	CAT009	ITM045	52	52	0	0	30	150	36	91.44	91.44	LLDPE	MAS001	TRUE	Kg.	20	20K/Bag	None		142.6	0		\N	\N	\N	\N
3614	CID1650	CAT004	ITM028	8+8+28	28	8	8	24	60	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	20	20K/Bag	Banana		24.1	20		\N	\N	\N	\N
3615	CID1609	CAT004	ITM026	23	23	0	0	15	75	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12.3	20		\N	\N	\N	\N
3616	CID1543	CAT004	ITM028	10+10+30	30	10	10	30	75	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		38.1	20		\N	\N	\N	\N
3617	CID1651	CAT004	ITM028	8+8+35	35	8	8	14	35	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		16.3	20		\N	\N	\N	\N
3618	CID1564	CAT001	ITM006	17+17+50	50	17	17	11	27	0	110	110	LLDPE	MAS003	FALSE	Packet	0.5	20K/Bag	None	Enet	49.9	0		\N	\N	\N	\N
3619	CID1564	CAT001	ITM006	17+17+50	50	17	17	11	27	0	103	103	LLDPE	MAS003	FALSE	Packet	0.5	20K/Bag	None	Enet	46.7	0		\N	\N	\N	\N
3620	CID1566	CAT001	ITM007	50+18+18	50	18	18	9	22	0	100	100	HDPE	MAS003	FALSE	Packet	0.8	25P/bag	None	Aseel	37.8	0		\N	\N	\N	\N
3621	CID1566	CAT005	ITM033	9+9+32	32	9	9	4	10	0	110	110	HDPE	MAS004	FALSE	3 Roll	400	40P/Bag	None	Aseel	11	0		\N	\N	\N	\N
3622	CID1652	CAT004	ITM028	9+9+31	31	9	9	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		43.3	20		\N	\N	\N	\N
3623	CID1653	CAT004	ITM027	5+5+30	30	5	5	35	87	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		28.3	20		\N	\N	\N	\N
3624	CID1653	CAT004	ITM028	9+9+35	35	9	9	35	87	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		46.8	20		\N	\N	\N	\N
3625	CID1654	CAT004	ITM027	4+4+20	20	4	4	40	100	12	30.48	30.48	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		17.1	20		\N	\N	\N	\N
3626	CID1654	CAT004	ITM028	8+8+31	31	8	8	40	100	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		38.2	20		\N	\N	\N	\N
3627	CID1654	CAT004	ITM029	9+9+32	32	9	9	40	100	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		50.8	20		\N	\N	\N	\N
3628	CID1655	CAT004	ITM020	34	34	0	0	14	70	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		21.8	20		\N	\N	\N	\N
3629	CID925	CAT006	ITM037	55	55	0	0	6	30	0	120	120	HDPE	MAS005	TRUE	Roll	0.8	20K/Bag	None	BIN HUMDA ELECTRONIC	39.6	0		\N	\N	\N	\N
3630	CID925	CAT002	ITM013	13+13+30	30	13	13	12	30	0	70	70	HDPE	MAS038	FALSE	Roll	0.8	20K/Bag	None	BIN HUMDA ELECTRONIC	23.5	0	38-40 Pcs./Roll	\N	\N	\N	\N
3631	CID925	CAT005	ITM033	9+9+32	32	9	9	4	10	0	110	110	HDPE	MAS004	TRUE	5 Roll	0.8	20K/Bag	None	BIN HUMDA ELECTRONIC	11	0		\N	\N	\N	\N
3632	CID923	CAT009	ITM045	55	55	0	0	30	150	36	91.44	91.44	LLDPE	MAS001	TRUE	Kg.	20	20K/Bag	None		150.9	0		\N	\N	\N	\N
3633	CID1656	CAT004	ITM027	5+5+23	23	5	5	22	55	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12.9	20		\N	\N	\N	\N
3634	CID431	CAT009	ITM045	20	20	0	0	18	90	0	30	30	LLDPE	MAS001	FALSE	Pcs.	1	1x50	None		10.8	0		\N	\N	\N	\N
3635	CID1657	CAT004	ITM020	8+8+27	27	8	8	30	75	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		26.2	20		\N	\N	\N	\N
3636	CID1164	CAT001	ITM006	10+10+52	52	10	10	65	162	0	70	70	LLDPE	MAS038	FALSE	Kg.	2	10P/Bag	None	Plain	163.3	0		\N	\N	\N	\N
3637	CID431	CAT009	ITM045	26	26	0	0	18	90	0	40	40	LLDPE	MAS001	FALSE	Pcs.	1	1x50	None		18.7	0		\N	\N	\N	\N
3638	CID864	CAT012	ITM102	8+8+38	38	8	8	60	150	24	60.96	60.96	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		98.8	20		\N	\N	\N	\N
3639	CID864	CAT012	ITM100	5+5+28	28	5	5	55	137	20	50.8	50.8	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		52.9	20		\N	\N	\N	\N
3640	CID1659	CAT004	ITM024	20+20+70	70	20	20	35	87	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		126.4	20		\N	\N	\N	\N
3641	CID1660	CAT003	ITM019	8+8+23	23	8	8	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.1	30		\N	\N	\N	\N
3642	CID1660	CAT003	ITM020	7+7+25	25	7	7	14	35	18	45.72	45.72	HDPE	MAS093	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.5	30		\N	\N	\N	\N
3643	CID1660	CAT003	ITM021	10+10+30	30	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.8	30		\N	\N	\N	\N
3644	CID1660	CAT003	ITM022	8+8+23	23	8	8	17	42	24	60.96	60.96	HDPE	MAS093	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		20	30		\N	\N	\N	\N
3645	CID1660	CAT008	ITM045	15	15	0	0	10	50	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		4.6	0		\N	\N	\N	\N
3646	CID1660	CAT008	ITM056	20	20	0	0	10	50	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		8.1	0		\N	\N	\N	\N
3647	CID1660	CAT008	ITM057	25	25	0	0	10	50	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		10.2	0		\N	\N	\N	\N
3648	CID1660	CAT008	ITM058	30	30	0	0	10	50	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		15.2	0		\N	\N	\N	\N
3649	CID1661	CAT004	ITM027	8+8+28	28	8	8	30	75	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		30.2	20		\N	\N	\N	\N
3650	CID1661	CAT004	ITM028	11+11+33	33	11	11	30	75	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		46.1	20		\N	\N	\N	\N
3651	CID1661	CAT004	ITM029	13+13+42	42	13	13	30	75	26	66.04	66.04	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		67.4	20		\N	\N	\N	\N
3652	CID1662	CAT004	ITM028	7+7+27	27	7	7	25	62	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		23.2	20		\N	\N	\N	\N
3653	CID1663	CAT004	ITM028	9+9+29	29	9	9	15	37	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		12.4	20		\N	\N	\N	\N
3654	CID1664	CAT003	ITM021	14+14+35	35	14	14	13	32	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		26.6	30		\N	\N	\N	\N
3655	CID1665	CAT004	ITM019	5+5+25	25	5	5	30	75	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		18.7	20		\N	\N	\N	\N
3656	CID1665	CAT004	ITM020	6+6+35	35	6	6	30	75	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		32.2	20		\N	\N	\N	\N
3657	CID1666	CAT003	ITM019	9+9+33	33	9	9	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.7	30		\N	\N	\N	\N
3658	CID1666	CAT003	ITM020	10+10+40	40	10	10	15	37	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		24.8	30		\N	\N	\N	\N
3659	CID431	CAT009	ITM045	30	30	0	0	18	90	0	53	53	LLDPE	MAS001	FALSE	Pcs.	1	1x50	None		28.6	0		\N	\N	\N	\N
3660	CID1667	CAT003	ITM019	27+8+8	27	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.8	30		\N	\N	\N	\N
3661	CID1667	CAT003	ITM023	13+13+55	55	13	13	20	50	28	71.12	71.12	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		57.6	30		\N	\N	\N	\N
3662	CID1667	CAT003	ITM020	8+8+30	30	8	8	12	30	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.4	30		\N	\N	\N	\N
3663	CID1498	CAT004	ITM029	11+11+34	34	11	11	17	42	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		23.9	20		\N	\N	\N	\N
3664	CID323	CAT001	ITM007	20+20+44	44	20	20	12	30	0	105	105	HDPE	MAS003	FALSE	Packet	1	25pcs/pkt	None		52.9	0		\N	\N	\N	\N
3665	CID1393	CAT001	ITM007	20+20+50	50	20	20	22	55	39	99.06	99.06	LLDPE	MAS078	TRUE	Packet	5	50pes/pkt	None	plain	98.1	0		\N	\N	\N	\N
3666	CID1646	CAT003	ITM020	8+8+26	26	8	8	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	20	20K/Bag	T-Shirt w/Hook		12.3	30		\N	\N	\N	\N
3667	CID1583	CAT004	ITM028	7+7+28	28	7	7	25	62	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		21.2	20		\N	\N	\N	\N
3668	CID1583	CAT004	ITM029	10+10+33	33	10	10	25	62	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		33.4	20		\N	\N	\N	\N
3669	CID1646	CAT008	ITM043	31	31	0	0	10	50	22	55.88	55.88	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		17.3	0		\N	\N	\N	\N
3671	CID1668	CAT004	ITM027	7+7+26	26	7	7	30	75	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		18.3	20		\N	\N	\N	\N
3672	CID1542	CAT003	ITM020	9+9+30	30	9	9	0	0	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
3673	CID1542	CAT004	ITM045	21	21	0	0	25	125	12	30.48	30.48	LLDPE	MAS003	TRUE	Kg.	1	10P/Bag	None		16	0		\N	\N	\N	\N
3674	CID1542	CAT004	ITM075	15	15	0	0	25	125	8	20.32	20.32	LLDPE	MAS003	TRUE	Kg.	1	10P/Bag	None		7.6	0		\N	\N	\N	\N
3675	CID1531	CAT003	ITM021	11+11+40	40	11	11	35	87	24	60.96	60.96	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	T-Shirt		65.8	30		\N	\N	\N	\N
3676	CID1670	CAT004	ITM028	10+10+30	30	10	10	30	75	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		38.1	20		\N	\N	\N	\N
3677	CID1671	CAT004	ITM020	8+8+31	31	8	8	38	95	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		36.3	20		\N	\N	\N	\N
3678	CID1673	CAT008	ITM044	35	35	0	0	10	50	22	112	112	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		39.2	0		\N	\N	\N	\N
3679	CID1674	CAT009	ITM044	70	70	0	0	8	40	0	70	70	LLDPE	MAS005	FALSE	Packet	1	10pes/pkt	None		39.2	0		\N	\N	\N	\N
3680	CID1674	CAT009	ITM044	70	70	0	0	8	40	0	70	70	LLDPE	MAS029	FALSE	Packet	1	10pes/pkt	None		39.2	0		\N	\N	\N	\N
3681	CID1674	CAT009	ITM044	70	70	0	0	8	40	0	70	70	LLDPE	MAS098	FALSE	Packet	1	10pes/pkt	None		39.2	0		\N	\N	\N	\N
3682	CID1674	CAT009	ITM044	70	70	0	0	8	40	0	70	70	LLDPE	MAS041	FALSE	Packet	1	10pes/pkt	None		39.2	0		\N	\N	\N	\N
3683	CID1675	CAT010	ITM046	15	15	0	0	18	90	12	30.48	30.48	HDPE	MAS001	TRUE	Kg.	1	10P/Bag	None		8.2	0		\N	\N	\N	\N
3684	CID1676	CAT003	ITM019	9+9+26	26	9	9	12	30	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		10.7	30		\N	\N	\N	\N
3685	CID1676	CAT003	ITM021	10+10+31	31	10	10	14	35	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		19.9	30		\N	\N	\N	\N
3686	CID1672	CAT009	ITM044	50	50	0	0	16	80	30	76.2	76.2	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		61	0		\N	\N	\N	\N
3687	CID1672	CAT009	ITM056	55	55	0	0	16	80	39	99.06	99.06	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		87.2	0		\N	\N	\N	\N
3688	CID1672	CAT009	ITM057	13+13+55	55	13	13	22	55	0	130	130	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		115.8	0		\N	\N	\N	\N
3689	CID1592	CAT008	ITM044	9+9+40	40	9	9	20	50	0	50	50	LLDPE	MAS001	FALSE	Packet	1	20K/Bag	None	Plain	29	0		\N	\N	\N	\N
3690	CID1677	CAT003	ITM019	6+6+23	23	6	6	16	40	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.4	30		\N	\N	\N	\N
3691	CID1677	CAT003	ITM020	11+11+31	31	11	11	16	40	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23.7	30		\N	\N	\N	\N
3692	CID1512	CAT004	ITM019	7+7+26	26	7	7	18	45	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12.8	20		\N	\N	\N	\N
3693	CID1512	CAT004	ITM028	9+9+35	35	9	9	18	45	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		24.2	20		\N	\N	\N	\N
3694	CID1679	CAT004	ITM020	9+9+29	29	9	9	15	37	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		12.4	20		\N	\N	\N	\N
3695	CID1680	CAT004	ITM027	7+7+28	28	7	7	23	57	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		19.5	20		\N	\N	\N	\N
3696	CID1680	CAT004	ITM028	9+9+30	30	9	9	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		30.2	20		\N	\N	\N	\N
3697	CID1680	CAT004	ITM029	10+10+50	50	10	10	50	125	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		106.7	20		\N	\N	\N	\N
3698	CID1155	CAT009	ITM045	25	25	0	0	20	100	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		20.3	20		\N	\N	\N	\N
3699	CID1155	CAT009	ITM045	25	25	0	0	20	100	16	40.64	40.64	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	Banana		20.3	20		\N	\N	\N	\N
3700	CID925	CAT003	ITM001	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Roll	0.5	10R/Bag	None	BIN HUMDA ELECTRONIC	0	0		\N	\N	\N	\N
3701	CID925	CAT005	ITM033	9+9+32	32	9	9	4	10	0	110	110	HDPE	MAS005	TRUE	Roll	0.3	20K/Bag	None	BIN HUMDA ELECTRONIC	11	0		\N	\N	\N	\N
3702	CID741	CAT005	ITM033	9+9+32	32	9	9	4	10	20	110	110	HDPE	MAS005	TRUE	3 Roll	0.4	3R/P x 20P/Bag	None	Manal	11	0		\N	\N	\N	\N
3703	CID741	CAT006	ITM038	5+5+50	50	5	5	12	30	0	110	110	HDPE	MAS005	TRUE	Roll w/Core	1	10R/Bag	None	Manal	39.6	0		\N	\N	\N	\N
3704	CID1681	CAT004	ITM029	9+9+41	41	9	9	33	82	22	55.88	55.88	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		54.1	20		\N	\N	\N	\N
3705	CID1284	CAT003	ITM019	9+9+30	30	9	9	30	75	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		36.6	30		\N	\N	\N	\N
3706	CID1284	CAT003	ITM020	10+10+42	42	10	10	30	75	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		56.7	30		\N	\N	\N	\N
3707	CID1284	CAT003	ITM021	11+11+42	42	11	11	30	75	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		78	30		\N	\N	\N	\N
3708	CID1682	CAT004	ITM026	20	20	0	0	12	60	10	25.4	25.4	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		6.1	20		\N	\N	\N	\N
3709	CID1683	CAT004	ITM019	8+8+30	30	8	8	32	80	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		26.2	20		\N	\N	\N	\N
3710	CID1683	CAT004	ITM020	10+10+40	40	10	10	32	80	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		48.8	20		\N	\N	\N	\N
3711	CID1684	CAT004	ITM028	14+14+39	39	14	14	30	75	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		51.1	20		\N	\N	\N	\N
3712	CID1131	CAT004	ITM027	6+6+25	25	6	6	32	80	14	35.56	35.56	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		21.1	20		\N	\N	\N	\N
3713	CID1131	CAT004	ITM026	21	21	0	0	16	80	10	25.4	25.4	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		8.5	20		\N	\N	\N	\N
3714	CID1685	CAT004	ITM021	10+10+55	55	10	10	35	87	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		79.6	20		\N	\N	\N	\N
3715	CID1393	CAT001	ITM005	13+13+45	45	13	13	20	50	32	81.28	81.28	LLDPE	MAS078	TRUE	Packet	2.5	50pes/pkt	None	plain	57.7	0		\N	\N	\N	\N
3716	CID1614	CAT003	ITM019	8+8+24	24	8	8	12	30	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		8.5	30		\N	\N	\N	\N
3717	CID1614	CAT003	ITM021	10+10+36	36	10	10	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.2	30		\N	\N	\N	\N
3718	CID1686	CAT004	ITM027	7+7+25	25	7	7	15	37	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		10.3	20		\N	\N	\N	\N
3719	CID1686	CAT004	ITM028	10+10+30	30	10	10	15	37	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		15	20		\N	\N	\N	\N
3720	CID1686	CAT004	ITM029	11+11+38	38	11	11	20	50	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		30.5	20		\N	\N	\N	\N
3721	CID1687	CAT004	ITM027	6+6+26	26	6	6	45	112	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		30.3	20		\N	\N	\N	\N
3722	CID1688	CAT003	ITM019	7+7+24	24	7	7	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		10.4	30		\N	\N	\N	\N
3723	CID1688	CAT003	ITM020	9+9+30	30	9	9	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		14.6	30		\N	\N	\N	\N
3724	CID1688	CAT003	ITM019	10+10+35	35	10	10	12	30	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		20.1	30		\N	\N	\N	\N
3725	CID1664	CAT008	ITM042	26	26	0	0	12	60	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		12.7	0		\N	\N	\N	\N
3726	CID1689	CAT003	ITM020	9+9+30	30	9	9	35	87	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		50.9	30		\N	\N	\N	\N
3727	CID1689	CAT003	ITM021	14+14+54	54	14	14	35	87	36	91.44	91.44	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		130.5	30		\N	\N	\N	\N
3728	CID1690	CAT004	ITM018	20	20	0	0	30	150	10	25.4	25.4	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		15.2	20		\N	\N	\N	\N
3729	CID1690	CAT004	ITM019	24	24	0	0	30	150	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		25.6	20		\N	\N	\N	\N
3730	CID1691	CAT003	ITM020	8+8+28	28	8	8	13	32	18	45.72	45.72	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.9	30		\N	\N	\N	\N
3731	CID1691	CAT003	ITM021	10+10+31	31	10	10	13	32	24	60.96	60.96	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		19.9	30		\N	\N	\N	\N
3732	CID1692	CAT003	ITM019	7+7+22	22	7	7	14	35	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		9	30		\N	\N	\N	\N
3733	CID1692	CAT003	ITM020	9+9+27	27	9	9	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.2	30		\N	\N	\N	\N
3734	CID1692	CAT003	ITM021	12+12+42	42	12	12	16	40	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		37.6	30		\N	\N	\N	\N
3735	CID1419	CAT003	ITM021	11+11+34	34	11	11	12	30	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.2	30		\N	\N	\N	\N
3736	CID1693	CAT004	ITM019	9+9+30	30	9	9	32	80	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.1	20		\N	\N	\N	\N
3737	CID1693	CAT004	ITM021	13+13+40	40	13	13	32	80	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		59	20		\N	\N	\N	\N
3738	CID1694	CAT003	ITM021	15+15+33	33	15	15	20	50	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		38.4	30		\N	\N	\N	\N
3739	CID1408	CAT004	ITM027	7+7+24	24	7	7	32	80	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		24.7	20		\N	\N	\N	\N
3740	CID1408	CAT004	ITM028	10+10+36	36	10	10	32	80	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		45.5	20		\N	\N	\N	\N
3741	CID1408	CAT004	ITM029	13+13+40	40	13	13	32	80	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		64.4	20		\N	\N	\N	\N
3742	CID1695	CAT010	ITM046	55	55	0	0	10	50	0	85	85	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		46.8	0		\N	\N	\N	\N
3743	CID1695	CAT010	ITM046	55	55	0	0	10	50	0	65	65	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		35.8	0		\N	\N	\N	\N
3744	CID1695	CAT010	ITM046	55	55	0	0	10	50	0	0	0	HDPE	MAS001	FALSE	Kg.	25	Roll	None		0	0		\N	\N	\N	\N
3745	CID1696	CAT003	ITM020	9+9+26	26	9	9	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.5	30		\N	\N	\N	\N
3746	CID1696	CAT003	ITM021	37+13+13	37	13	13	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		30.7	0		\N	\N	\N	\N
3747	CID1696	CAT003	ITM022	13+13+44	44	13	13	18	45	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		51.2	0		\N	\N	\N	\N
3748	CID1317	CAT004	ITM028	7+7+37	37	7	7	35	87	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		45.1	20		\N	\N	\N	\N
3749	CID1317	CAT004	ITM029	9+9+46	46	9	9	37	92	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		65.8	20		\N	\N	\N	\N
3750	CID1317	CAT004	ITM027	8+8+27	27	8	8	35	87	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		30.4	20		\N	\N	\N	\N
3751	CID1697	CAT004	ITM031	14+14+52	52	14	14	40	100	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		89.4	20		\N	\N	\N	\N
3752	CID1697	CAT004	ITM032	18+18+60	60	18	18	40	100	26	66.04	66.04	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		126.8	20		\N	\N	\N	\N
3753	CID1698	CAT003	ITM019	7+7+23	23	7	7	13	32	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	8.4	30		\N	\N	\N	\N
3754	CID1698	CAT003	ITM020	9+9+25	25	9	9	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	12.6	30		\N	\N	\N	\N
3755	CID1698	CAT003	ITM021	10+10+33	33	10	10	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	17.2	30		\N	\N	\N	\N
3756	CID1698	CAT003	ITM022	10+10+33	33	10	10	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	22.6	30		\N	\N	\N	\N
3757	CID1698	CAT003	ITM023	11+11+45	45	11	11	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	28.6	30		\N	\N	\N	\N
3758	CID1699	CAT003	ITM019	7+7+23	23	7	7	13	32	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	8.4	30		\N	\N	\N	\N
3759	CID1699	CAT003	ITM020	9+9+26	26	9	9	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	12.9	30		\N	\N	\N	\N
3760	CID1572	CAT004	ITM027	11+11+33	33	11	11	17	42	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		18.8	20		\N	\N	\N	\N
3761	CID1572	CAT004	ITM028	11+11+33	33	11	11	17	42	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		23.5	20		\N	\N	\N	\N
3762	CID1700	CAT004	ITM029	6+6+35	35	6	6	40	100	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		47.8	20		\N	\N	\N	\N
3763	CID1700	CAT004	ITM028	8+8+30	30	8	8	40	100	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		37.4	20		\N	\N	\N	\N
3764	CID1700	CAT004	ITM027	25	25	0	0	15	75	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		13.3	20		\N	\N	\N	\N
3765	CID1393	CAT001	ITM006	18+18+52	52	18	18	22	55	36	91.44	91.44	LLDPE	MAS078	TRUE	Packet	4.6	50pes/pkt	None	plain	88.5	0		\N	\N	\N	\N
3766	CID1701	CAT003	ITM020	7+7+25	25	7	7	11	27	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		9.6	30		\N	\N	\N	\N
3767	CID1701	CAT003	ITM021	10+10+33	33	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		16.2	30		\N	\N	\N	\N
3768	CID1604	CAT003	ITM020	9+9+29	29	9	9	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.8	30		\N	\N	\N	\N
3769	CID1663	CAT004	ITM020	9+9+29	29	9	9	15	37	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		12.4	20		\N	\N	\N	\N
3770	CID1702	CAT004	ITM020	9+9+29	29	9	9	15	37	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		12.4	20		\N	\N	\N	\N
3771	CID1703	CAT004	ITM026	20	20	0	0	13	65	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	10P/Bag	Banana		7.9	20	bahrain	\N	\N	\N	\N
3772	CID1446	CAT004	ITM028	9+9+30	30	9	9	16	40	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		19.5	20		\N	\N	\N	\N
3773	CID1446	CAT004	ITM030	15+15+70	70	15	15	22	55	34	86.36	86.36	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		95	20		\N	\N	\N	\N
3774	CID1446	CAT004	ITM029	10+10+42	42	10	10	22	55	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		41.6	20		\N	\N	\N	\N
3775	CID1446	CAT004	ITM031	16+16+64	64	16	16	30	75	38	96.52	96.52	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		139	20		\N	\N	\N	\N
3776	CID1704	CAT003	ITM019	6+6+23	23	6	6	11	27	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		6.7	30		\N	\N	\N	\N
3777	CID1704	CAT003	ITM020	8+8+25	25	8	8	11	27	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		10.1	30		\N	\N	\N	\N
3778	CID1705	CAT004	ITM028	4+4+22.5	22.5	4	4	28	70	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.4	20		\N	\N	\N	\N
3779	CID1707	CAT004	ITM028	4+4+22.5	22.5	4	4	28	70	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.4	20		\N	\N	\N	\N
3780	CID1546	CAT004	ITM028	4+4+22.5	22.5	4	4	28	70	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.4	20		\N	\N	\N	\N
3781	CID1708	CAT010	ITM046	7+7+23	23	7	7	9	22	0	40	40	HDPE	MAS005	FALSE	Roll	0.5	20K/Bag	None		6.5	0		\N	\N	\N	\N
3782	CID1709	CAT004	ITM020	7+7+25	25	7	7	15	37	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		10.3	20		\N	\N	\N	\N
3783	CID1710	CAT004	ITM029	10+10+40	40	10	10	28	70	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		34.1	20		\N	\N	\N	\N
3784	CID1596	CAT007	ITM040	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Packet	0.2	60P/Bag	None	Great Area Discount	0	0		\N	\N	\N	\N
3785	CID1596	CAT007	ITM041	0	0	0	0	10	50	0	0	0	HDPE	MAS004	FALSE	Packet	0.2	60P/Bag	None	Great Area Discount	0	0		\N	\N	\N	\N
3786	CID1596	CAT007	ITM042	0	0	0	0	10	50	0	0	0	HDPE	MAS004	FALSE	Packet	0.2	60P/Bag	None	Great Area Discount	0	0		\N	\N	\N	\N
3787	CID1596	CAT007	ITM043	0	0	0	0	10	50	0	0	0	HDPE	MAS004	FALSE	Packet	0.2	60P/Bag	None	Great Area Discount	0	0		\N	\N	\N	\N
3788	CID1596	CAT007	ITM054	0	0	0	0	10	50	0	0	0	HDPE	MAS004	FALSE	Packet	0.2	60P/Bag	None	Great Area Discount	0	0		\N	\N	\N	\N
3789	CID1706	CAT004	ITM029	4+4+44	44	4	4	20	50	28	71.12	71.12	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		37	20		\N	\N	\N	\N
3790	CID1711	CAT004	ITM029	49.5	49.5	0	0	25	125	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		69.2	20		\N	\N	\N	\N
3794	CID1393	CAT001	ITM006	18+18+52	52	18	18	45	112	36	91.44	91.44	LLDPE	MAS078	TRUE	Kg.	8.1	45Pcs/ Packet	None		180.2	0	180g/Pc	\N	\N	\N	\N
3795	CID1712	CAT004	ITM027	28+7+7	28	7	7	18	45	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		13.4	20		\N	\N	\N	\N
3796	CID1712	CAT004	ITM028	9+9+41	41	9	9	18	45	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		27	20		\N	\N	\N	\N
3797	CID1712	CAT004	ITM029	10+10+45	45	10	10	18	45	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.7	20		\N	\N	\N	\N
3798	CID1712	CAT006	ITM036	50	50	0	0	4	20	16	120	120	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None	Plain	24	0		\N	\N	\N	\N
3799	CID1713	CAT003	ITM019	7+7+21	21	7	7	10	25	16	40.64	40.64	HDPE	MAS094	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		7.1	30		\N	\N	\N	\N
3800	CID1713	CAT003	ITM020	10+10+27	27	10	10	16	40	18	45.72	45.72	HDPE	MAS094	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		17.2	30		\N	\N	\N	\N
3801	CID1713	CAT003	ITM021	13+13+33	33	13	13	17	42	24	60.96	60.96	HDPE	MAS094	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		30.2	30		\N	\N	\N	\N
3802	CID1714	CAT004	ITM028	9+9+30	30	9	9	20	50	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		21.9	20		\N	\N	\N	\N
3803	CID476	CAT008	ITM054	0	0	0	0	12	60	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3804	CID1155	CAT009	ITM045	10+10+32	32	10	10	45	112	0	54	54	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		62.9	0		\N	\N	\N	\N
3805	CID1715	CAT004	ITM029	10+10+40	40	10	10	30	75	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		50.3	20		\N	\N	\N	\N
3806	CID632	CAT004	ITM029	10+10+38	38	10	10	17	42	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		34.6	20		\N	\N	\N	\N
3807	CID1716	CAT004	ITM028	8+8+40	40	8	8	33	82	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		46.7	20		\N	\N	\N	\N
3808	CID1717	CAT010	ITM046	60	60	0	0	9	45	32	80	80	HDPE	MAS001	TRUE	Roll	15	15Kg/Roll	None	Plain	43.2	0		\N	\N	\N	\N
3809	CID1718	CAT003	ITM018	6+6+21	21	6	6	15	37	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		9.9	30		\N	\N	\N	\N
3810	CID1718	CAT003	ITM019	7+7+26	26	7	7	15	37	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.5	30		\N	\N	\N	\N
3811	CID1718	CAT003	ITM021	10+10+30	30	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.6	30		\N	\N	\N	\N
3812	CID1164	CAT001	ITM006	13+13+50	50	13	13	20	50	0	80	80	LLDPE	MAS003	FALSE	Packet	1	20K/Bag	None	Plain	60.8	0		\N	\N	\N	\N
3813	CID1719	CAT002	ITM013	15+15+31	31	15	15	6	15	0	59	59	HDPE	MAS079	FALSE	Roll	0.3	30Pcs/R x 20R/Bag	None	Plain	10.8	0	10grms/Pc.	\N	\N	\N	\N
3814	CID1719	CAT001	ITM009	30+30+70	70	30	30	14	35	0	90	90	LLDPE	MAS021	FALSE	Packet	1.5	20Pcs/P x 10P/Bag	None	Plain	81.9	0	75grms/Pc	\N	\N	\N	\N
3815	CID1720	CAT004	ITM028	4+4+22	22	4	4	28	70	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.1	20		\N	\N	\N	\N
3816	CID1721	CAT004	ITM028	8+8+28	28	8	8	35	87	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35	20		\N	\N	\N	\N
3817	CID1722	CAT004	ITM028	9+9+30	30	9	9	22	55	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		21.5	20		\N	\N	\N	\N
3818	CID1723	CAT004	ITM029	12+12+60	60	12	12	40	100	30	76.2	76.2	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		128	20		\N	\N	\N	\N
3819	CID1724	CAT005	ITM035	8+8+34	34	8	8	7	17	0	120	120	HDPE	MAS005	TRUE	3 Roll	0.8	3R x 20P	None	MHD Adhuhan	20.4	0		\N	\N	\N	\N
3820	CID1724	CAT005	ITM035	8+8+34	34	8	8	7	17	0	120	120	HDPE	MAS055	TRUE	3 Roll	0.8	3R x 20P	None	MHD Adhuhan	20.4	0		\N	\N	\N	\N
3821	CID1721	CAT004	ITM029	14+14+46	46	14	14	35	87	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		72	20		\N	\N	\N	\N
3822	CID1725	CAT004	ITM027	9+9+25	25	9	9	21	52	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		18.2	20		\N	\N	\N	\N
3823	CID1725	CAT004	ITM028	13+13+41	41	13	13	21	52	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		35.4	20		\N	\N	\N	\N
3824	CID1726	CAT004	ITM027	20	20	0	0	10	50	10	25.4	25.4	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		5.1	20		\N	\N	\N	\N
3825	CID1727	CAT005	ITM033	9+9+32	32	9	9	3	7	0	100	100	HDPE	MAS004	FALSE	5 Roll	0.7	20K/Bag	None	Mona Bahrain	7	0		\N	\N	\N	\N
3826	CID1727	CAT005	ITM033	9+9+32	32	9	9	3	7	0	110	110	HDPE	MAS004	FALSE	Roll	0.5	20K/Bag	None	Mona Bahrain	7.7	0		\N	\N	\N	\N
3827	CID1727	CAT005	ITM033	9+9+32	32	9	9	4	10	0	110	110	HDPE	MAS004	FALSE	5 Roll	0.8	20K/Bag	None	Mona Bahrain	11	0		\N	\N	\N	\N
3828	CID1728	CAT004	ITM028	41+8+8	41	8	8	35	87	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		50.4	20		\N	\N	\N	\N
3829	CID1729	CAT004	ITM028	8+8+35	35	8	8	37	92	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		42.9	20		\N	\N	\N	\N
3830	CID1730	CAT004	ITM029	12+12+40	40	12	12	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		31.2	20		\N	\N	\N	\N
3831	CID1730	CAT004	ITM030	12+12+60	60	12	12	16	40	34	86.36	86.36	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		58	20		\N	\N	\N	\N
3832	CID1731	CAT003	ITM020	9+9+28	28	9	9	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		13.5	30		\N	\N	\N	\N
3833	CID1731	CAT003	ITM021	13+13+37	37	13	13	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		28.4	30		\N	\N	\N	\N
3834	CID1731	CAT003	ITM022	13+13+44	44	13	13	16	40	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		45.5	30		\N	\N	\N	\N
3835	CID1732	CAT005	ITM033	9+9+32	32	9	9	4	10	0	110	110	HDPE	MAS005	TRUE	3 Roll	0.45	30P/Bag	None	Amasina Trading Corporation	11	0		\N	\N	\N	\N
3836	CID1733	CAT004	ITM028	8+8+30	30	8	8	30	75	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		31.5	20		\N	\N	\N	\N
3837	CID1487	CAT006	ITM039	50	50	0	0	5	25	20	100	100	HDPE	MAS005	TRUE	Packet	1	20K/Bag	None		25	0		\N	\N	\N	\N
3838	CID1735	CAT004	ITM027	6+6+36	36	6	6	37	92	18	45.72	45.72	LLDPE	MAS041	TRUE	Kg.	1	20K/Bag	Banana		40.4	20		\N	\N	\N	\N
3839	CID1735	CAT004	ITM028	8+8+40	40	8	8	37	92	22	55.88	55.88	LLDPE	MAS102	TRUE	Kg.	1	20K/Bag	Banana		57.6	20		\N	\N	\N	\N
3840	CID1736	CAT004	ITM029	15+15+40	40	15	15	30	75	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		64	20		\N	\N	\N	\N
3841	CID741	CAT002	ITM011	10+10+28	28	10	10	8	20	0	50	50	HDPE	MAS005	FALSE	Roll	0.4	20K/Bag	None	Manal	9.6	0		\N	\N	\N	\N
3842	CID741	CAT002	ITM012	11+11+28	28	11	11	8	20	0	60	60	HDPE	MAS029	FALSE	Roll	0.4	20K/Bag	None	Manal	12	0		\N	\N	\N	\N
3843	CID741	CAT002	ITM013	13+13+30	30	13	13	8	20	0	70	70	HDPE	MAS038	FALSE	Roll	0.4	20K/Bag	None	Manal	15.7	0		\N	\N	\N	\N
3844	CID1737	CAT005	ITM033	9+9+32	32	9	9	4	10	0	110	110	HDPE	MAS005	TRUE	5 Roll	0.8	10P/Bag	None	Lozo	11	0		\N	\N	\N	\N
3845	CID1737	CAT006	ITM036	50	50	0	0	8	40	0	110	110	HDPE	MAS005	TRUE	Roll	1	6R/Bag	None	Lozo	44	0		\N	\N	\N	\N
3846	CID1737	CAT001	ITM005	16+16+40	40	16	16	14	35	0	80	80	Regrind	MAS003	FALSE	Packet	2	12P/Bag	None	Lozo	40.3	0		\N	\N	\N	\N
3847	CID1737	CAT001	ITM006	18+18+44	44	18	18	14	35	0	90	90	Regrind	MAS003	FALSE	Packet	2	12P/Bag	None	Lozo	50.4	0		\N	\N	\N	\N
3848	CID1737	CAT001	ITM007	20+20+50	50	20	20	14	35	0	100	100	Regrind	MAS003	FALSE	Packet	2	10P/Bag	None	Lozo	63	0		\N	\N	\N	\N
3849	CID1737	CAT001	ITM009	18+18+60	60	18	18	14	35	0	110	110	Regrind	MAS003	FALSE	Packet	2	10P/Bag	None	Lozo	73.9	0		\N	\N	\N	\N
3850	CID1732	CAT008	ITM084	28	28	0	0	11	55	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		18.8	0		\N	\N	\N	\N
3851	CID1732	CAT008	ITM045	10+10+52	52	10	10	33	82	0	56	56	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		66.1	0		\N	\N	\N	\N
3852	CID1738	CAT003	ITM020	9+9+30	30	9	9	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.6	30		\N	\N	\N	\N
3853	CID1875	CAT008	ITM066	61	61	0	0	8	40	0	0	0	LLDPE	MAS001	FALSE	Roll	39	20K/Bag	None		0	0	Not more than 40kg/Roll	\N	\N	\N	\N
3854	CID1739	CAT001	ITM006	18+18+44	44	18	18	10	25	0	90	90	Regrind	MAS003	FALSE	Packet	1.6	50Pcs/P x 10P/Bag	None	Plain	36	0		\N	\N	\N	\N
3855	CID1739	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS038	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
3856	CID1740	CAT004	ITM028	9+9+41	41	9	9	32	80	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		48	0		\N	\N	\N	\N
3857	CID1741	CAT004	ITM028	9+9+31	31	9	9	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		43.3	20		\N	\N	\N	\N
3858	CID1750	CAT004	ITM026	15.5	15.5	0	0	10	50	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		7.9	20		\N	\N	\N	\N
3859	CID1750	CAT004	ITM027	23	23	0	0	9	45	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		7.4	20		\N	\N	\N	\N
3860	CID1750	CAT004	ITM029	0	0	0	0	0	0	0	0	0	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3861	CID1750	CAT004	ITM029	10+10+30	30	10	10	20	50	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		22.9	20		\N	\N	\N	\N
3862	CID741	CAT002	ITM014	0	0	0	0	14	70	0	70	70	Regrind	MAS003	FALSE	Roll	0.9	15R/Bag	None	Manal	0	0		\N	\N	\N	\N
3863	CID741	CAT002	ITM015	0	0	0	0	0	0	0	80	80	Regrind	MAS004	FALSE	Roll	0.9	16R/Bag	None	Manal	0	0		\N	\N	\N	\N
3864	CID741	CAT002	ITM016	0	0	0	0	0	0	0	90	90	Regrind	MAS004	FALSE	Roll	0.9	15R/Bag	None	Manal	0	0		\N	\N	\N	\N
3865	CID741	CAT002	ITM017	0	0	0	0	0	0	0	100	100	Regrind	MAS004	FALSE	Roll	0.9	15R/Bag	None	Manal	0	0		\N	\N	\N	\N
3866	CID741	CAT002	ITM053	0	0	0	0	0	0	0	110	110	Regrind	MAS004	FALSE	Roll	0.9	15R/Bag	None	Manal	0	0		\N	\N	\N	\N
3867	CID1678	CAT003	ITM021	9+9+33	33	9	9	14	35	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	15Kg/Bag	T-Shirt w/Hook		18.1	30		\N	\N	\N	\N
3868	CID1751	CAT004	ITM027	25	25	0	0	12	60	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana	Modern Plastic Bag Factory	9.1	20		\N	\N	\N	\N
3869	CID1752	CAT004	ITM027	25	25	0	0	15	75	12	30.48	30.48	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana	Modern Plastic Bag Factory	11.4	20		\N	\N	\N	\N
3870	CID1706	CAT004	ITM028	3.5+3.5+35	35	3.5	3.5	21	52	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		20	20		\N	\N	\N	\N
3871	CID1753	CAT004	ITM028	10+10+36	36	10	10	21	52	22	55.88	55.88	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		32.5	20		\N	\N	\N	\N
3872	CID1596	CAT005	ITM033	9+9+32	32	9	9	4	10	0	110	110	HDPE	MAS005	TRUE	6 Roll	1	20K/Bag	None	Great Area Discount	11	0		\N	\N	\N	\N
3873	CID1596	CAT006	ITM037	55	55	0	0	6	30	0	110	110	HDPE	MAS005	TRUE	Roll	0.8	15R/Bag	None	Modern Plastic Bag Factory	36.3	0		\N	\N	\N	\N
3874	CID1596	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
3875	CID1596	CAT002	ITM012	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
3876	CID1596	CAT002	ITM013	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
3877	CID1596	CAT002	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3878	CID1596	CAT002	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3879	CID1596	CAT002	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3880	CID1596	CAT002	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3881	CID1596	CAT002	ITM053	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3882	CID1664	CAT008	ITM072	20	20	0	0	12	60	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		8.5	0		\N	\N	\N	\N
3883	CID1754	CAT003	ITM019	7.5+7.5+23	23	7.5	7.5	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		9.9	30		\N	\N	\N	\N
3884	CID1755	CAT004	ITM027	20	20	0	0	15	75	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.1	20		\N	\N	\N	\N
3885	CID1755	CAT004	ITM028	5+5+30	30	5	5	30	75	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		27.4	20		\N	\N	\N	\N
3886	CID1756	CAT001	ITM007	21+21+46	46	21	21	16	40	20	100	100	LLDPE	MAS003	TRUE	Packet	3.2	46Pcs/Packet	None	Plain	70.4	0		\N	\N	\N	\N
3887	CID1527	CAT004	ITM029	10+10+40	40	10	10	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		37.8	20		\N	\N	\N	\N
3888	CID1757	CAT003	ITM020	11+11+32	32	11	11	18	45	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		27.2	30		\N	\N	\N	\N
3889	CID1757	CAT004	ITM029	10+10+40	40	10	10	30	75	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		50.3	20		\N	\N	\N	\N
3890	CID1732	CAT008	ITM084	29	29	0	0	10	50	28	71.12	71.12	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		20.6	0		\N	\N	\N	\N
3891	CID1758	CAT004	ITM027	20	20	0	0	25	125	10	25.4	25.4	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	Banana		12.7	20		\N	\N	\N	\N
3892	CID1758	CAT004	ITM028	7+7+30	30	7	7	45	112	16	40.64	40.64	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		40.1	20		\N	\N	\N	\N
3893	CID1759	CAT004	ITM028	13+13+40	40	13	13	16	40	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		26.8	20		\N	\N	\N	\N
3894	CID1760	CAT004	ITM028	8+8+40	40	8	8	30	75	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		46.9	20		\N	\N	\N	\N
3895	CID1760	CAT004	ITM029	15+15+47	47	15	15	30	75	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		70.4	20		\N	\N	\N	\N
3896	CID1734	CAT004	ITM028	6+6+44	44	6	6	40	100	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		56.9	20		\N	\N	\N	\N
3897	CID1761	CAT004	ITM028	12+12+35	35	12	12	40	100	22	55.88	55.88	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		65.9	20		\N	\N	\N	\N
3898	CID1761	CAT004	ITM029	12+12+35	35	12	12	40	100	26	66.04	66.04	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		77.9	20		\N	\N	\N	\N
3899	CID1488	CAT004	ITM027	4+4+23	23	4	4	20	50	0	41	41	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	Banana		12.7	20		\N	\N	\N	\N
3900	CID1488	CAT004	ITM028	8+8+25	25	8	8	20	50	0	40	40	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	Banana		16.4	20		\N	\N	\N	\N
3901	CID1763	CAT008	ITM044	15	15	0	0	10	50	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		4.6	0		\N	\N	\N	\N
3902	CID1763	CAT008	ITM056	20	20	0	0	10	50	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		6.1	0		\N	\N	\N	\N
3903	CID1750	CAT015	ITM110	16	16	0	0	8	40	0	32	32	LLDPE	MAS001	FALSE	Packet	1	20K/Bag	None		4.1	0		\N	\N	\N	\N
3904	CID445	CAT004	ITM028	9+9+32	32	9	9	21	52	18	45.72	45.72	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		23.8	20		\N	\N	\N	\N
3905	CID1764	CAT004	ITM028	10+10+30	30	10	10	20	50	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		22.9	20		\N	\N	\N	\N
3906	CID1765	CAT004	ITM027	7+7+22	22	7	7	22	55	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	15Kg/Bag	Banana	Yassir Trading Establishment	14.1	20		\N	\N	\N	\N
3907	CID1765	CAT004	ITM028	7+7+34	34	7	7	22	55	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	15Kg/Bag	Banana	Yassir Trading Establishment	18.8	20		\N	\N	\N	\N
3908	CID1766	CAT004	ITM027	30	30	0	0	8	40	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		8.5	20		\N	\N	\N	\N
3909	CID1766	CAT004	ITM028	9+9+35	35	9	9	32	80	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		38.8	20		\N	\N	\N	\N
3910	CID1756	CAT009	ITM007	19+19+51	51	19	19	20	50	34	86	86	LLDPE	MAS001	TRUE	Kg.	1	25Pc/P x 10P/Bag	None	Plain	76.5	0		\N	\N	\N	\N
3911	CID1767	CAT004	ITM027	25	25	0	0	15	75	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		15.2	20		\N	\N	\N	\N
3912	CID1768	CAT003	ITM020	10+10+31	31	10	10	19	47	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.9	30		\N	\N	\N	\N
3913	CID1768	CAT003	ITM021	12+12+42	42	12	12	20	50	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		46.9	30		\N	\N	\N	\N
3914	CID1769	CAT003	ITM019	8+8+28	28	8	8	20	50	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.6	30		\N	\N	\N	\N
3915	CID1059	CAT004	ITM027	7+7+23	23	7	7	16	40	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		10.5	20		\N	\N	\N	\N
3916	CID1059	CAT004	ITM028	9+9+29	29	9	9	20	50	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		19.1	20		\N	\N	\N	\N
3917	CID1059	CAT004	ITM029	10+10+34	34	10	10	22	55	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		33.2	20		\N	\N	\N	\N
3918	CID1059	CAT004	ITM030	11+11+44	44	11	11	20	50	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		36.9	20		\N	\N	\N	\N
3919	CID1631	CAT009	ITM045	20.5	20.5	0	0	14	70	0	27	27	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		7.7	0		\N	\N	\N	\N
3920	CID1769	CAT003	ITM021	10+10+35	35	10	10	20	50	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		33.5	30		\N	\N	\N	\N
3921	CID1769	CAT006	ITM036	50	50	0	0	8	40	16	120	120	LLDPE	MAS005	TRUE	Packet	1	20K/Bag	None	Plain	48	0		\N	\N	\N	\N
3922	CID1770	CAT003	ITM019	8+8+28	28	8	8	20	50	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		20.1	30		\N	\N	\N	\N
3923	CID1770	CAT006	ITM036	50	50	0	0	8	40	14	105	105	LLDPE	MAS005	TRUE	Packet	1	20K/Bag	None	Plain	42	0		\N	\N	\N	\N
3924	CID1771	CAT003	ITM020	13+13+35	35	13	13	24	60	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		33.5	30		\N	\N	\N	\N
3925	CID1488	CAT009	ITM045	16+16+58	58	16	16	8	20	0	0	0	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3926	CID1772	CAT004	ITM028	8+8+36	36	8	8	40	100	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		42.3	20		\N	\N	\N	\N
3927	CID1772	CAT004	ITM029	12+12+36	36	12	12	40	100	26	66.04	66.04	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		79.2	20		\N	\N	\N	\N
3928	CID1773	CAT003	ITM019	6+6+25	25	6	6	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		10.1	30		\N	\N	\N	\N
3929	CID1773	CAT003	ITM020	9+9+28	28	9	9	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		14	30		\N	\N	\N	\N
3930	CID1773	CAT003	ITM021	11+11+33	33	11	11	14	35	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.5	30		\N	\N	\N	\N
3931	CID1773	CAT003	ITM022	12+12+35	35	12	12	16	40	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		33.6	30		\N	\N	\N	\N
3932	CID741	CAT001	ITM006	15+15+48	48	15	15	12	30	0	100	100	LLDPE	MAS003	FALSE	Packet	1	23Pcs/P x 10P/Bag	None	Manal	46.8	0		\N	\N	\N	\N
3933	CID1774	CAT004	ITM027	6+6+28	28	6	6	45	112	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		31.9	20		\N	\N	\N	\N
3934	CID1775	CAT004	ITM027	5+5+20	20	5	5	25	62	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		13.2	20		\N	\N	\N	\N
3935	CID1775	CAT004	ITM029	11+11+30	30	11	11	25	62	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		29.5	20		\N	\N	\N	\N
3936	CID1592	CAT008	ITM056	5+5+40	40	5	5	20	50	0	56	56	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		28	0		\N	\N	\N	\N
3937	CID1776	CAT004	ITM029	5+5+44	44	5	5	40	100	20	50.8	50.8	HDPE	MAS103	TRUE	Kg.	1	20K/Bag	Banana		54.9	20		\N	\N	\N	\N
3938	CID004	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS005	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
3939	CID1777	CAT009	ITM045	18.5	18.5	0	0	16	80	0	0	0	LLDPE	MAS058	FALSE	Roll	15	15Kg/Roll	None		0	0		\N	\N	\N	\N
3940	CID1777	CAT009	ITM075	26	26	0	0	10	50	0	100	100	LLDPE	MAS058	FALSE	Kg.	1	20K/Bag	None		26	0		\N	\N	\N	\N
3941	CID1777	CAT009	ITM076	32.5	32.5	0	0	10	50	0	100	100	LLDPE	MAS058	FALSE	Kg.	1	20K/Bag	None		32.5	0		\N	\N	\N	\N
3942	CID1778	CAT003	ITM019	7+7+27	27	7	7	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		12	30		\N	\N	\N	\N
3943	CID1778	CAT003	ITM021	0	0	0	0	15	75	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
3944	CID1779	CAT003	ITM019	0	0	0	0	0	0	0	0	0	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
3945	CID1779	CAT003	ITM020	0	0	0	0	0	0	0	0	0	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
3946	CID1779	CAT003	ITM022	0	0	0	0	0	0	0	0	0	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
3947	CID1779	CAT003	ITM023	0	0	0	0	0	0	0	0	0	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
3948	CID1780	CAT004	ITM028	40	40	0	0	0	0	22	55.88	55.88	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
3949	CID1780	CAT004	ITM029	5+5+40	40	5	5	0	0	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
3950	CID1781	CAT003	ITM019	9+9+27	27	9	9	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		13.2	30		\N	\N	\N	\N
3951	CID1781	CAT003	ITM021	10+10+32	32	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		23.5	30		\N	\N	\N	\N
3952	CID1475	CAT005	ITM033	14+14+34	34	14	14	4	10	0	125	125	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None	Modern Plastic Bag Factory	15.5	0		\N	\N	\N	\N
3953	CID1782	CAT003	ITM021	10+10+30	30	10	10	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		24.4	30		\N	\N	\N	\N
3954	CID1782	CAT006	ITM036	50	50	0	0	7	35	0	0	0	LLDPE	MAS005	TRUE	Roll	1	20K/Bag	None		0	0		\N	\N	\N	\N
3955	CID1783	CAT003	ITM019	9+9+27	27	9	9	13	32	20	50.8	50.8	HDPE	MAS093	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		14.6	30		\N	\N	\N	\N
3956	CID1783	CAT003	ITM021	10+10+33	33	10	10	13	32	24	60.96	60.96	HDPE	MAS093	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		20.7	30		\N	\N	\N	\N
3958	CID1488	CAT005	ITM033	9+9+32	32	9	9	4	10	0	110	110	HDPE	MAS004	FALSE	3 Roll	0.5	30P/Bag	None	Modern Plastic Bag Factory	11	0		\N	\N	\N	\N
3960	CID1475	CAT005	ITM033	0	0	0	0	4	20	0	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
3965	CID1600	CAT003	ITM019	9+9+28	28	9	9	13	32	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3966	CID1784	CAT003	ITM020	0	0	0	0	13	65	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
3967	CID1784	CAT003	ITM021	13+13+37	37	13	13	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		28.4	30		\N	\N	\N	\N
3968	CID1784	CAT003	ITM022	13+13+44	44	13	13	16	40	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		45.5	30		\N	\N	\N	\N
3969	CID1785	CAT005	ITM033	9+9+32	32	9	9	4	10	0	110	110	HDPE	MAS005	TRUE	6 Roll	1	20K/Bag	None	Modern Plastic Bag Factory	11	0		\N	\N	\N	\N
3970	CID1785	CAT002	ITM011	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
3971	CID1785	CAT002	ITM012	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Roll	0.9	20K/Bag	None		0	0		\N	\N	\N	\N
3972	CID1785	CAT002	ITM013	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3973	CID1785	CAT002	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3974	CID1785	CAT002	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3975	CID1785	CAT002	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3976	CID1785	CAT002	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3977	CID1785	CAT002	ITM053	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3978	CID226	CAT008	ITM040	16	16	0	0	13	65	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3979	CID226	CAT007	ITM042	26	26	0	0	13	65	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		13.7	0		\N	\N	\N	\N
3980	CID226	CAT007	ITM043	31	31	0	0	14	70	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
3981	CID1786	CAT003	ITM019	9+9+27	27	9	9	11	27	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.1	30		\N	\N	\N	\N
3982	CID1786	CAT003	ITM022	13+13+54	54	13	13	18	45	28	71.12	71.12	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	T-Shirt		51.2	30		\N	\N	\N	\N
3983	CID1787	CAT004	ITM027	5+5+25	25	5	5	0	0	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
3984	CID1788	CAT004	ITM028	10+10+35	35	10	10	14	35	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.6	20		\N	\N	\N	\N
3985	CID1789	CAT004	ITM028	6+6+29	29	6	6	26	65	16	40.64	40.64	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	Banana		21.7	20		\N	\N	\N	\N
3986	CID1790	CAT004	ITM029	44	44	0	0	20	100	20	50.8	50.8	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		44.7	20		\N	\N	\N	\N
3961	CID1180	CAT005	ITM033	32+9+9	32	9	9	3.5	8.75	\N	\N	110	HDPE	MAS108	No	ROLL	0.8	20K/Bag	None	Baity	0	0		20	16.00	\N	\N
3962	CID1180	CAT001	ITM005	40+12+12	40	12	12	8	20	\N	\N	80	Regrind	MAS003	No	PKT	0.8	25P/Bag	None	Baity	204.8	0		25	20.00	\N	\N
3963	CID1180	CAT001	ITM006	50+12+12	50	12	12	8	20	\N	\N	90	Regrind	MAS003	No	Packet	0.8	25P/Bag	None	Baity	266.4	0		25	20.00	\N	\N
3964	CID1180	CAT001	ITM009	60+18+18	60	18	18	9	22.5	\N	\N	110	Regrind	MAS003	No	Packet	0.8	25P/Bag	None	Baity	464.64	0		25	20.00	\N	\N
3987	CID1740	CAT004	ITM027	30	30	0	0	20	100	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		24.4	20		\N	\N	\N	\N
3988	CID1789	CAT004	ITM027	3+3+18	18	3	3	26	65	12	30.48	30.48	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	Banana		9.5	20		\N	\N	\N	\N
3989	CID1762	CAT004	ITM027	5+5+30	30	5	5	30	75	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		24.4	20		\N	\N	\N	\N
3990	CID1762	CAT004	ITM028	9+9+35	35	9	9	34	85	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		45.8	20		\N	\N	\N	\N
3991	CID1759	CAT007	ITM044	8+8+50	50	8	8	19	47	24	60.96	60.96	LLDPE	MAS005	TRUE	Roll	10	10P/Bag	None		37.8	0		\N	\N	\N	\N
3992	CID1792	CAT004	ITM029	10+10+60	60	10	10	35	87	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		84.9	20		\N	\N	\N	\N
3993	CID1793	CAT003	ITM020	11+11+35	35	11	11	15	37	22	55.88	55.88	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		23.6	30		\N	\N	\N	\N
3994	CID1793	CAT003	ITM022	13+13+43	43	13	13	16	40	28	71.12	71.12	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	T-Shirt		39.3	30		\N	\N	\N	\N
3995	CID1863	CAT009	ITM045	21	21	0	0	22	110	12	30.48	30.48	LLDPE	MAS005	TRUE	Box	15	15Kg/Box	None		14.1	0		\N	\N	\N	\N
3996	CID1794	CAT004	ITM028	5+5+31	31	5	5	36	90	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		33.7	20		\N	\N	\N	\N
3997	CID1795	CAT003	ITM020	9+9+28	28	9	9	15	37	18	45.72	45.72	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt		15.6	30		\N	\N	\N	\N
3998	CID1795	CAT003	ITM021	13+13+37	37	13	13	16	40	24	60.96	60.96	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt		30.7	30		\N	\N	\N	\N
3999	CID1795	CAT003	ITM022	13+13+44	44	13	13	18	45	32	81.28	81.28	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt		51.2	30		\N	\N	\N	\N
4000	CID1419	CAT008	ITM057	20	20	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.1	0		\N	\N	\N	\N
4001	CID1475	CAT001	ITM005	16+16+40	40	16	16	10	25	0	80	80	Regrind	MAS003	FALSE	Packet	1.2	10P/Bag	None	Modern Plastic Bag Factory	28.8	0		\N	\N	\N	\N
4002	CID1475	CAT001	ITM006	15+15+50	50	15	15	10	25	0	90	90	Regrind	MAS003	FALSE	Packet	1.5	10P/Bag	None	Modern Plastic Bag Factory	36	0		\N	\N	\N	\N
4003	CID1796	CAT003	ITM019	7+7+23	23	7	7	9	22	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		6.6	30		\N	\N	\N	\N
4004	CID1796	CAT003	ITM021	11+11+35	35	11	11	27	67	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		38.8	30		\N	\N	\N	\N
4005	CID1797	CAT003	ITM021	11+11+32	32	11	11	15	37	22	55.88	55.88	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.3	30		\N	\N	\N	\N
4006	CID1798	CAT008	ITM044	30	30	0	0	12	60	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		18.3	0		\N	\N	\N	\N
4007	CID1799	CAT004	ITM027	9+9+30	30	9	9	30	75	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		29.3	20		\N	\N	\N	\N
4008	CID1799	CAT004	ITM029	20+20+50	50	20	20	30	75	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		82.3	20		\N	\N	\N	\N
4009	CID1800	CAT004	ITM027	29	29	0	0	9	45	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.3	20		\N	\N	\N	\N
4010	CID1800	CAT004	ITM021	38	38	0	0	9	45	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		17.4	20		\N	\N	\N	\N
4011	CID1801	CAT009	ITM045	13	13	0	0	15	75	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		5.9	20		\N	\N	\N	\N
4012	CID1801	CAT009	ITM075	3+3+13	13	3	3	25	62	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		7.2	0		\N	\N	\N	\N
4013	CID1801	CAT009	ITM076	35.5	35.5	0	0	10	50	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		21.6	0		\N	\N	\N	\N
4014	CID1801	CAT001	ITM006	15+15+50	50	15	15	26	65	32	81.28	81.28	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		84.5	0		\N	\N	\N	\N
4015	CID1778	CAT010	ITM046	8+8+26	26	8	8	9	22	0	46	46	HDPE	MAS004	FALSE	Roll	1	20K/Bag	None	Plain	8.5	0		\N	\N	\N	\N
4017	CID1215	CAT009	ITM045	65	65	0	0	20	100	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4018	CID1803	CAT004	ITM027	20	20	0	0	12	60	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		9.8	20		\N	\N	\N	\N
4019	CID1595	CAT015	ITM110	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4020	CID1804	CAT004	ITM028	8+8+38	38	8	8	18	45	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		24.7	20		\N	\N	\N	\N
4021	CID1805	CAT004	ITM028	38	38	0	0	15	75	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		29	20		\N	\N	\N	\N
4022	CID776	CAT003	ITM019	8+8+27	27	8	8	20	50	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		30.6	30		\N	\N	\N	\N
4023	CID776	CAT003	ITM021	10+10+32	32	10	10	20	50	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		31.7	30		\N	\N	\N	\N
4024	CID746	CAT003	ITM019	8+8+25	25	8	8	30	75	0	45	45	HDPE	MAS060	FALSE	Kg.	1	13Kg/Bag	T-Shirt		27.7	30		\N	\N	\N	\N
4025	CID746	CAT003	ITM020	9+9+30	30	9	9	30	75	0	53	53	HDPE	MAS007	FALSE	Kg.	1	13Kg/Bag	T-Shirt		38.2	30		\N	\N	\N	\N
4026	CID746	CAT003	ITM021	11+11+33	33	11	11	30	75	0	61	61	HDPE	MAS030	FALSE	Kg.	1	13Kg/Bag	T-Shirt		50.3	30		\N	\N	\N	\N
4027	CID1806	CAT004	ITM027	7+7+31	31	7	7	28	70	16	40.64	40.64	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		25.6	20		\N	\N	\N	\N
4028	CID1806	CAT004	ITM028	8+8+43	43	8	8	28	70	20	50.8	50.8	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		42	20		\N	\N	\N	\N
4029	CID1806	CAT004	ITM029	10+10+50	50	10	10	28	70	24	60.96	60.96	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		59.7	20		\N	\N	\N	\N
4030	CID1807	CAT004	ITM028	10+10+38	38	10	10	35	87	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		46.1	20		\N	\N	\N	\N
4031	CID1807	CAT004	ITM029	12+12+46	46	12	12	35	87	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		68.1	20		\N	\N	\N	\N
4032	CID1607	CAT010	ITM063	60	60	0	0	6	30	0	85	85	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		30.6	0		\N	\N	\N	\N
4033	CID1744	CAT004	ITM028	9+9+30	30	9	9	30	75	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		29.3	20		\N	\N	\N	\N
4034	CID1808	CAT004	ITM028	9+9+38	38	9	9	30	75	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		42.7	20		\N	\N	\N	\N
4035	CID1809	CAT004	ITM027	8+8+36	36	8	8	20	50	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		21.1	20		\N	\N	\N	\N
4036	CID1809	CAT004	ITM029	10+10+39	39	10	10	20	50	26	66.04	66.04	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		39	20		\N	\N	\N	\N
4037	CID746	CAT001	ITM007	20+20+50	50	20	20	13	32	0	98	98	LLDPE	MAS003	FALSE	Packet	2.7	46 Pcs/P	None	Plain	56.4	0	58gr/pc	\N	\N	\N	\N
4038	CID746	CAT004	ITM028	7+7+31	31	7	7	32	80	0	46	46	LLDPE	MAS005	FALSE	Box	4.5	4.5Kg/Box	Banana		33.1	20	34gr/pc	\N	\N	\N	\N
4039	CID746	CAT015	ITM110	42	42	0	0	13	65	0	0	0	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4040	CID1810	CAT004	ITM028	7+7+30	30	7	7	35	87	16	40.64	40.64	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	None		31.1	0		\N	\N	\N	\N
4041	CID1626	CAT003	ITM021	14+14+34	34	14	14	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		30.2	30		\N	\N	\N	\N
4042	CID1811	CAT004	ITM027	26	26	0	0	14	70	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		12.9	20		\N	\N	\N	\N
4043	CID1457	CAT004	ITM027	8+8+30	30	8	8	26	65	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		24.3	20		\N	\N	\N	\N
4044	CID1812	CAT004	ITM027	8+8+36	36	8	8	35	87	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		36.8	20		\N	\N	\N	\N
4045	CID1812	CAT003	ITM021	10+10+43	43	10	10	35	87	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		66.8	30		\N	\N	\N	\N
4046	CID1813	CAT003	ITM019	7+7+27	27	7	7	0	0	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		0	30		\N	\N	\N	\N
4047	CID1813	CAT003	ITM020	11+11+31	31	11	11	16	40	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		23.7	30		\N	\N	\N	\N
4048	CID1488	CAT009	ITM045	17+17+55	55	17	17	20	50	0	44	44	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		39.2	0		\N	\N	\N	\N
4049	CID1807	CAT004	ITM027	7+7+29	29	7	7	27	67	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		26.3	20		\N	\N	\N	\N
4050	CID1814	CAT004	ITM027	23.5	23.5	0	0	11	55	12	30.48	30.48	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		7.9	20		\N	\N	\N	\N
4051	CID1814	CAT004	ITM028	8+8+30	30	8	8	24	60	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		22.4	20		\N	\N	\N	\N
4052	CID746	CAT001	ITM009	18+18+60	60	18	18	15	37	0	110	110	HDPE	MAS004	FALSE	Packet	4	50Pcs./Pckt	None	Plain	78.1	0		\N	\N	\N	\N
4053	CID1815	CAT004	ITM027	5+5+30	30	5	5	32	80	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		26	20		\N	\N	\N	\N
4054	CID1815	CAT004	ITM028	8+8+41	41	8	8	32	80	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		46.3	20		\N	\N	\N	\N
4055	CID1816	CAT003	ITM019	7+7+23	23	7	7	9	22	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		6.6	30		\N	\N	\N	\N
4056	CID1816	CAT003	ITM020	10+10+30	30	10	10	10	25	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		14	30		\N	\N	\N	\N
4057	CID1816	CAT003	ITM021	11+11+32	32	11	11	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.1	30		\N	\N	\N	\N
4058	CID1817	CAT008	ITM044	42	42	0	0	30	150	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		51.2	0		\N	\N	\N	\N
4059	CID746	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS005	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
4060	CID746	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS080	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
4061	CID746	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS003	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
4062	CID1812	CAT009	ITM045	31	31	0	0	10	50	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		14.2	0		\N	\N	\N	\N
4063	CID1164	CAT001	ITM007	15+15+51	51	15	15	21	52	0	100	100	LLDPE	MAS003	FALSE	Packet	2	10P/Bag	None	Plain	84.2	0		\N	\N	\N	\N
4064	CID1818	CAT009	ITM045	85	85	0	0	12	60	0	130	130	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		132.6	0		\N	\N	\N	\N
4065	CID1819	CAT008	ITM066	61	61	0	0	8	40	0	0	0	LLDPE	MAS001	FALSE	Roll	39	38 to 40/Roll	None		0	0		\N	\N	\N	\N
4066	CID746	CAT001	ITM007	20+20+55	55	20	20	12	30	0	106	106	Regrind	MAS003	FALSE	Packet	2.4	46Pcs/P x 5P	None	Plain	60.4	0		\N	\N	\N	\N
4068	CID1820	CAT004	ITM027	7+7+30	30	7	7	25	62	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		22.2	20		\N	\N	\N	\N
4069	CID1820	CAT004	ITM028	10+10+34	34	10	10	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		34	20		\N	\N	\N	\N
4070	CID1820	CAT004	ITM029	10+10+42	42	10	10	25	62	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		46.9	20		\N	\N	\N	\N
4071	CID1821	CAT004	ITM027	7+7+30	30	7	7	25	62	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		22.2	20		\N	\N	\N	\N
4072	CID1821	CAT004	ITM028	10+10+34	34	10	10	25	62	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		34	20		\N	\N	\N	\N
4073	CID1821	CAT004	ITM029	10+10+42	42	10	10	25	62	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		46.9	20		\N	\N	\N	\N
4074	CID1822	CAT003	ITM021	9+9+33	33	9	9	17	42	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Bahrain	21.8	30		\N	\N	\N	\N
4075	CID1823	CAT008	ITM044	15	15	0	0	10	50	8	20.32	20.32	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		3	0		\N	\N	\N	\N
4076	CID1823	CAT008	ITM056	15	15	0	0	10	50	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		3.8	0		\N	\N	\N	\N
4077	CID837	CAT003	ITM021	10+10+50	50	10	10	35	87	0	81	81	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	T-Shirt		98.7	30		\N	\N	\N	\N
4078	CID1824	CAT004	ITM028	6+6+31	31	6	6	40	100	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		35	20		\N	\N	\N	\N
4079	CID1825	CAT001	ITM009	20+20+60	60	20	20	26	65	14	109	109	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		141.7	0		\N	\N	\N	\N
4080	CID1825	CAT001	ITM010	25+25+60	60	25	25	29	72	0	115	115	LLDPE	MAS004	FALSE	Kg.	0	20K/Bag	None		182.2	0		\N	\N	\N	\N
4081	CID1826	CAT004	ITM028	9+9+32	32	9	9	45	112	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		45.5	20		\N	\N	\N	\N
4082	CID1827	CAT003	ITM021	13+13+42	42	13	13	27	67	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		55.5	30		\N	\N	\N	\N
4083	CID1827	CAT003	ITM022	10+10+51	51	10	10	27	67	32	81.28	81.28	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		77.3	30		\N	\N	\N	\N
4084	CID1828	CAT004	ITM028	13+13+41	41	13	13	21	52	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.4	20		\N	\N	\N	\N
4085	CID1829	CAT003	ITM019	8+8+23	23	8	8	12	30	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		9.5	30		\N	\N	\N	\N
4086	CID1829	CAT003	ITM020	9+9+27	27	9	9	12	30	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.7	30		\N	\N	\N	\N
4087	CID1830	CAT004	ITM028	9+9+31	31	9	9	30	75	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		33.6	20		\N	\N	\N	\N
4088	CID083	CAT008	ITM056	17	17	0	0	12	60	0	26	26	LLDPE	MAS001	FALSE	Pcs.	0.005	100P/Bag	None	Plain	5.3	0	5grams/pc	\N	\N	\N	\N
4089	CID1410	CAT004	ITM027	4+4+25	25	4	4	30	75	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.6	20		\N	\N	\N	\N
4090	CID1831	CAT004	ITM028	5+5+30	30	5	5	30	75	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		24.4	20		\N	\N	\N	\N
4091	CID1832	CAT004	ITM028	9+9+26	26	9	9	22	55	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		19.7	20		\N	\N	\N	\N
4092	CID1832	CAT004	ITM029	12+12+36	36	12	12	22	55	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		40.2	20		\N	\N	\N	\N
4093	CID1833	CAT004	ITM029	14+14+40	40	14	14	35	87	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		48.1	20		\N	\N	\N	\N
4094	CID1166	CAT006	ITM036	45	45	0	0	5	25	0	90	90	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None		20.3	0		\N	\N	\N	\N
4095	CID1834	CAT015	ITM110	57	57	0	0	8	40	0	0	0	HDPE	MAS001	FALSE	Roll	15	15Kg/Roll	None	Plain	0	0		\N	\N	\N	\N
4096	CID1566	CAT007	ITM041	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Packet	0.4	45P/Bag	None	Aseel	0	0		\N	\N	\N	\N
4097	CID1566	CAT007	ITM042	0	0	0	0	10	50	0	0	0	HDPE	MAS004	FALSE	Packet	0.4	45P/Bag	None	Aseel	0	0		\N	\N	\N	\N
4098	CID1566	CAT007	ITM043	0	0	0	0	10	50	0	0	0	HDPE	MAS004	FALSE	Packet	0.4	45P/Bag	None	Aseel	0	0		\N	\N	\N	\N
4099	CID1835	CAT004	ITM027	8+8+30	30	8	8	21	52	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		21.9	20		\N	\N	\N	\N
4100	CID1835	CAT004	ITM028	11+11+46	46	11	11	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		60.1	20		\N	\N	\N	\N
4101	CID1833	CAT004	ITM027	3+3+23	23	3	3	35	87	12	30.48	30.48	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		15.4	20		\N	\N	\N	\N
4102	CID1836	CAT001	ITM007	23+23+50	50	23	23	40	100	0	0	0	LLDPE	MAS091	TRUE	Kg.	1	10Pcs/Px10P/Bag	None		0	0		\N	\N	\N	\N
4103	CID861	CAT004	ITM030	11+11+45	45	11	11	38	95	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		77.6	20		\N	\N	\N	\N
4104	CID1837	CAT004	ITM027	7+7+24	24	7	7	14	35	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		9.5	20		\N	\N	\N	\N
4105	CID1837	CAT004	ITM028	8+8+30	30	8	8	14	35	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		14.7	20		\N	\N	\N	\N
4106	CID1837	CAT004	ITM029	10+10+35	35	10	10	16	40	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		22.4	20		\N	\N	\N	\N
4107	CID1837	CAT005	ITM035	32+9+9	32	9	9	6	15	0	130	130	HDPE	MAS001	TRUE	Roll	1	20K/Bag	None	Plain	19.5	0		\N	\N	\N	\N
4108	CID1837	CAT006	ITM036	50	50	0	0	4	20	0	190	190	HDPE	MAS001	TRUE	Roll	2	10R/Bag	None	Plain	38	0		\N	\N	\N	\N
4109	CID1838	CAT004	ITM027	3+3+25	25	3	3	20	50	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		12.6	20		\N	\N	\N	\N
4110	CID1838	CAT004	ITM028	6+6+35	35	6	6	20	50	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		21.5	20		\N	\N	\N	\N
4111	CID1839	CAT004	ITM028	7+7+30	30	7	7	30	75	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		26.8	20		\N	\N	\N	\N
4112	CID1839	CAT004	ITM029	5+5+40	40	5	5	30	75	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		38.1	20		\N	\N	\N	\N
4113	CID1840	CAT003	ITM019	7+7+21	21	7	7	12	30	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		7.5	30		\N	\N	\N	\N
4114	CID1840	CAT003	ITM020	10+10+30	30	10	10	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		17.8	30		\N	\N	\N	\N
4115	CID1840	CAT005	ITM033	9+9+32	32	9	9	10	25	0	100	100	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	25	0		\N	\N	\N	\N
4116	CID2060	CAT009	ITM045	65	65	0	0	15	75	0	0	0	LLDPE	MAS001	FALSE	Roll	9	9Kg/Roll	None		0	0		\N	\N	\N	\N
4117	CID1842	CAT004	ITM029	10+10+40	40	10	10	48	120	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		73.2	20		\N	\N	\N	\N
4118	CID1843	CAT004	ITM027	3+3+20	20	3	3	25	62	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.8	20		\N	\N	\N	\N
4119	CID1843	CAT004	ITM028	8+8+28	28	8	8	25	62	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		24.9	20		\N	\N	\N	\N
4120	CID1843	CAT004	ITM029	8+8+35	35	8	8	27	67	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		41.7	0		\N	\N	\N	\N
4121	CID1676	CAT003	ITM018	7+7+21	21	7	7	10	25	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		6.2	30		\N	\N	\N	\N
4122	CID1676	CAT003	ITM020	8+8+28	28	8	8	12	30	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.4	30		\N	\N	\N	\N
4123	CID1844	CAT004	ITM029	55	55	0	0	20	100	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		67.1	20		\N	\N	\N	\N
4124	CID1488	CAT001	ITM007	20+20+50	50	20	20	9.5	23	0	98	98	LLDPE	MAS003	FALSE	Pcs.	1	50Pcs./P	None	Plain	40.6	0		\N	\N	\N	\N
4125	CID1846	CAT004	ITM027	9+9+26	26	9	9	26	65	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		23.2	20		\N	\N	\N	\N
4126	CID423	CAT001	ITM007	20+20+50	50	20	20	11	27	0	98	98	LLDPE	MAS003	FALSE	Packet	1	50Pcs/P	None	Plain	47.6	0		\N	\N	\N	\N
4127	CID1847	CAT004	ITM028	5+5+33	33	5	5	35	87	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		30.4	20		\N	\N	\N	\N
4128	CID2089	CAT009	ITM045	70	70	0	0	15	75	0	0	0	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4129	CID1848	CAT004	ITM027	7+7+30	30	7	7	30	75	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		26.8	20		\N	\N	\N	\N
4130	CID1848	CAT004	ITM029	14+14+45	45	14	14	35	87	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		64.5	20		\N	\N	\N	\N
4131	CID1849	CAT004	ITM029	7+7+40	40	7	7	38	95	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		52.1	20		\N	\N	\N	\N
4132	CID1850	CAT004	ITM028	9+9+31	31	9	9	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		43.3	20		\N	\N	\N	\N
4133	CID1851	CAT010	ITM046	60	60	0	0	9	45	34	86.36	86.36	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		46.6	0		\N	\N	\N	\N
4134	CID1771	CAT003	ITM021	14+14+40	40	14	14	28	70	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		58	0		\N	\N	\N	\N
4135	CID1756	CAT001	ITM009	22+22+51	51	22	22	57	142	39	100	100	LLDPE	MAS077	TRUE	Pcs.	0.26	28Pcs/Pckt	None	Plain	269.8	0	261 grams/pc	\N	\N	\N	\N
4136	CID1059	CAT003	ITM021	10+10+32	32	10	10	14	35	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		20.3	30		\N	\N	\N	\N
4137	CID1852	CAT008	ITM103	26	26	0	0	18	90	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		16.6	0		\N	\N	\N	\N
4138	CID1853	CAT003	ITM021	12+12+32	32	12	12	20	50	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		34.1	30		\N	\N	\N	\N
4139	CID1853	CAT004	ITM030	5+5+60	60	5	5	20	50	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		32	20		\N	\N	\N	\N
4140	CID1854	CAT004	ITM026	20	20	0	0	16	80	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.8	20		\N	\N	\N	\N
4141	CID1854	CAT004	ITM027	7+7+25	25	7	7	35	87	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		24.1	20		\N	\N	\N	\N
4142	CID1854	CAT004	ITM028	8+8+30	30	8	8	35	87	0	0	0	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
4143	CID1854	CAT004	ITM029	9+9+35	35	9	9	35	87	0	0	0	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
4144	CID1852	CAT008	ITM104	26	26	0	0	18	90	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		16.6	0		\N	\N	\N	\N
4145	CID1852	CAT008	ITM105	26	26	0	0	18	90	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		16.6	0		\N	\N	\N	\N
4146	CID1855	CAT003	ITM020	11+11+32	32	11	11	12	30	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.1	30		\N	\N	\N	\N
4147	CID1856	CAT004	ITM028	6+6+30	30	6	6	30	75	0	0	0	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
4148	CID1856	CAT004	ITM029	10+10+42	42	10	10	30	75	0	0	0	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
4149	CID1274	CAT004	ITM026	7+7+26	26	7	7	18	45	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		12.8	20		\N	\N	\N	\N
4150	CID1488	CAT015	ITM110	58	58	0	0	10	50	0	0	0	HDPE	MAS001	FALSE	Roll	30	30Kg/Roll	None	Plain	0	0		\N	\N	\N	\N
4151	CID1861	CAT008	ITM058	26	26	0	0	18	90	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		16.6	0	Wedge	\N	\N	\N	\N
4152	CID1857	CAT003	ITM019	9+9+27	27	9	9	16	40	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.5	30		\N	\N	\N	\N
4153	CID1857	CAT003	ITM020	9+9+33	33	9	9	18	45	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		28	30		\N	\N	\N	\N
4154	CID1858	CAT008	ITM044	56	56	0	0	8	40	0	86	86	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		38.5	0		\N	\N	\N	\N
4155	CID1859	CAT004	ITM028	10+10+31	31	10	10	24	60	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		28	20		\N	\N	\N	\N
4156	CID1859	CAT004	ITM029	13+13+35	35	13	13	24	60	22	55.88	55.88	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		40.9	20		\N	\N	\N	\N
4157	CID1860	CAT004	ITM028	8+8+30	30	8	8	30	75	16	40.64	40.64	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana	Modern Plastic Bag Factory	28	20	Company SASO logo fo Bahrain	\N	\N	\N	\N
4158	CID1852	CAT015	ITM110	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4159	CID784	CAT006	ITM112	50	50	0	0	8	40	0	110	110	LLDPE	MAS005	TRUE	Roll	1.8	10R/Bag	None	Moon Light	44	0		\N	\N	\N	\N
4160	CID933	CAT006	ITM112	52	52	0	0	6	30	14	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	plain	34.3	0		\N	\N	\N	\N
4161	CID1775	CAT003	ITM021	11+11+30	30	11	11	25	62	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		32.8	30		\N	\N	\N	\N
4162	CID1864	CAT004	ITM027	8+8+28	28	8	8	30	75	0	34	34	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	Banana		22.4	20		\N	\N	\N	\N
4163	CID1865	CAT001	ITM009	20+20+55	55	20	20	60	150	0	0	0	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4164	CID1817	CAT008	ITM056	45	45	0	0	30	150	32	81.28	81.28	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		109.7	0		\N	\N	\N	\N
4165	CID1866	CAT004	ITM028	8+8+40	40	8	8	21	52	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		20.7	20		\N	\N	\N	\N
4166	CID1867	CAT004	ITM027	25	25	0	0	15	75	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana	Modern Plastic Bag Factory	13.3	20		\N	\N	\N	\N
4167	CID1676	CAT008	ITM044	20	20	0	0	7	35	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		5	0		\N	\N	\N	\N
4168	CID1868	CAT004	ITM027	8+8+28	28	8	8	40	100	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.8	20		\N	\N	\N	\N
4169	CID1868	CAT004	ITM028	7+7+37	37	7	7	40	100	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		51.8	20		\N	\N	\N	\N
4170	CID1615	CAT004	ITM029	8+8+40	40	8	8	25	62	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.3	20		\N	\N	\N	\N
4171	CID1869	CAT004	ITM027	5+5+30	30	5	5	30	75	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		24.4	20		\N	\N	\N	\N
4172	CID1869	CAT004	ITM028	9+9+35	35	9	9	30	75	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		40.4	20		\N	\N	\N	\N
4173	CID1869	CAT008	ITM041	20	20	0	0	10	50	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4174	CID1869	CAT008	ITM042	25	25	0	0	10	50	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4175	CID1869	CAT008	ITM043	30	30	0	0	10	50	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4176	CID1869	CAT008	ITM055	41	41	0	0	10	50	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4177	CID1870	CAT004	ITM027	8+8+25	25	8	8	21	52	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.3	20		\N	\N	\N	\N
4178	CID1870	CAT004	ITM028	10+10+35	35	10	10	23	57	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		31.9	20		\N	\N	\N	\N
4179	CID1488	CAT008	ITM055	21+21+60	60	21	21	44	110	0	0	0	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4180	CID1871	CAT004	ITM027	5+5+25	25	5	5	25	62	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		17.6	0		\N	\N	\N	\N
4181	CID1872	CAT004	ITM027	23	23	0	0	10	50	12	30.48	30.48	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		7	20		\N	\N	\N	\N
4182	CID1872	CAT004	ITM028	8+8+25	25	8	8	30	75	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		25	20		\N	\N	\N	\N
4183	CID1872	CAT004	ITM029	9+9+30	30	9	9	30	75	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		36.6	20		\N	\N	\N	\N
4184	CID1325	CAT004	ITM026	20	20	0	0	20	100	0	25	25	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		10	20		\N	\N	\N	\N
4185	CID1325	CAT004	ITM027	25	25	0	0	20	100	0	30	30	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		15	20		\N	\N	\N	\N
4186	CID1325	CAT004	ITM028	25	25	0	0	20	100	0	35	35	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		17.5	20		\N	\N	\N	\N
4187	CID1325	CAT004	ITM029	35	35	0	0	25	125	0	60	60	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		52.5	20		\N	\N	\N	\N
4188	CID1873	CAT003	ITM020	7+7+27	27	7	7	14	35	20	50.8	50.8	HDPE	MAS063	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		14.6	30		\N	\N	\N	\N
4189	CID1873	CAT003	ITM021	10+10+33	33	10	10	16	40	24	60.96	60.96	HDPE	MAS063	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.8	30		\N	\N	\N	\N
4190	CID1873	CAT003	ITM022	13+13+46	46	13	13	16	40	28	71.12	71.12	HDPE	MAS063	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		41	30		\N	\N	\N	\N
4191	CID1873	CAT008	ITM041	20	20	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.1	0		\N	\N	\N	\N
4192	CID1873	CAT008	ITM042	26	26	0	0	10	50	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		10.6	0		\N	\N	\N	\N
4193	CID1873	CAT008	ITM043	31	31	0	0	10	50	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		15.7	0		\N	\N	\N	\N
4194	CID1873	CAT008	ITM054	36	36	0	0	10	50	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		21.9	0		\N	\N	\N	\N
4195	CID1874	CAT004	ITM028	10+10+38	38	10	10	20	50	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		32.4	20		\N	\N	\N	\N
4196	CID1488	CAT006	ITM038	40	40	0	0	6	30	0	30000	30000	HDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		7200	0		\N	\N	\N	\N
4197	CID1607	CAT010	ITM077	60	60	0	0	9	45	0	0	0	HDPE	MAS001	FALSE	Roll	20	20K/Bag	None		0	0		\N	\N	\N	\N
4198	CID174	CAT006	ITM112	50	50	0	0	6	30	0	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	plain	33	0		\N	\N	\N	\N
4199	CID1876	CAT004	ITM028	8+8+36	36	8	8	42	105	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		49.9	20		\N	\N	\N	\N
4200	CID1164	CAT001	ITM003	13+13+30	30	13	13	22	55	0	70	70	LLDPE	MAS003	FALSE	Packet	1	10P/Bag	None	Plain	43.1	0		\N	\N	\N	\N
4201	CID1164	CAT001	ITM005	15+15+40	40	15	15	22	55	0	80	80	LLDPE	MAS003	FALSE	Packet	1	10P/Bag	None	Plain	61.6	0		\N	\N	\N	\N
4202	CID1877	CAT012	ITM060	25	25	0	0	35	175	32	81.28	81.28	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	None		71.1	0		\N	\N	\N	\N
4203	CID1145	CAT006	ITM112	45	45	0	0	6	30	18	90	90	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	24.3	0		\N	\N	\N	\N
4204	CID1178	CAT006	ITM112	45	45	0	0	7	35	16	80	80	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None		25.2	0		\N	\N	\N	\N
4205	CID1878	CAT004	ITM027	8.5+8.5+25.5	25.5	8.5	8.5	22	55	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		16.6	20		\N	\N	\N	\N
4206	CID1879	CAT004	ITM027	9+9+30	30	9	9	32	80	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		31.2	20		\N	\N	\N	\N
4207	CID1880	CAT003	ITM020	10+10+30	30	10	10	15	37	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		18.8	30		\N	\N	\N	\N
4208	CID1880	CAT004	ITM029	13+13+37	37	13	13	21	52	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		36.6	20		\N	\N	\N	\N
4209	CID1880	CAT008	ITM041	20	20	0	0	10	50	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4210	CID1880	CAT004	ITM042	25	25	0	0	10	50	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4211	CID1290	CAT006	ITM112	45	45	0	0	4	20	0	100	100	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	18	0		\N	\N	\N	\N
4212	CID1866	CAT004	ITM029	7+7+43	43	7	7	21	52	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		27.1	20		\N	\N	\N	\N
4213	CID1879	CAT004	ITM028	9+9+34	34	9	9	32	80	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		38	20		\N	\N	\N	\N
4214	CID1879	CAT004	ITM029	10+10+45	45	10	10	32	80	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		63.4	20		\N	\N	\N	\N
4215	CID1882	CAT015	ITM108	25	25	0	0	18	90	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		16	0		\N	\N	\N	\N
4216	CID1882	CAT015	ITM109	25	25	0	0	18	90	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		16	0		\N	\N	\N	\N
4217	CID1145	CAT006	ITM112	35	35	0	0	6	30	14	70	70	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	14.7	0		\N	\N	\N	\N
4218	CID1883	CAT003	ITM020	10+10+30	30	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.8	30		\N	\N	\N	\N
4219	CID1883	CAT003	ITM021	11+11+32	32	11	11	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		24.4	30		\N	\N	\N	\N
4220	CID1883	CAT003	ITM022	13+13+44	44	13	13	16	40	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		45.5	30		\N	\N	\N	\N
4221	CID1884	CAT008	ITM005	28	28	0	0	11	55	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		18.8	0		\N	\N	\N	\N
4222	CID1884	CAT008	ITM006	28	28	0	0	11	55	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		18.8	0		\N	\N	\N	\N
4223	CID1884	CAT008	ITM007	29	29	0	0	11	55	28	71.12	71.12	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		22.7	0		\N	\N	\N	\N
4224	CID1884	CAT008	ITM009	29	29	0	0	11	55	28	71.12	71.12	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		22.7	0		\N	\N	\N	\N
4225	CID1614	CAT006	ITM112	9+9+32	32	9	9	4	10	0	100	100	HDPE	MAS005	FALSE	Roll	1	20K/Bag	None	Plain	10	0		\N	\N	\N	\N
4226	CID1656	CAT006	ITM112	40	40	0	0	6	30	16	80	80	LLDPE	MAS005	TRUE	Kg.	1	pkt not roll	None		19.2	0		\N	\N	\N	\N
4227	CID1885	CAT001	ITM009	17+17+58	58	17	17	18	45	0	110	110	HDPE	MAS005	FALSE	Pcs.	0.084	25pcs/P x 10P/Bag	None	Plain	91.1	0		\N	\N	\N	\N
4228	CID746	CAT003	ITM022	13+13+41	41	13	13	30	75	0	75	75	HDPE	MAS060	FALSE	Kg.	1	13Kg/Bag	T-Shirt		75.4	30		\N	\N	\N	\N
4229	CID1886	CAT003	ITM020	7+7+27	27	7	7	12	30	20	50.8	50.8	HDPE	MAS063	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.5	30		\N	\N	\N	\N
4230	CID1886	CAT003	ITM021	10+10+30	30	10	10	16	40	22	55.88	55.88	HDPE	MAS063	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.4	30		\N	\N	\N	\N
4231	CID1886	CAT003	ITM022	13+13+43	43	13	13	16	40	28	71.12	71.12	HDPE	MAS063	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		39.3	30		\N	\N	\N	\N
4232	CID1886	CAT008	ITM041	20	20	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.1	0		\N	\N	\N	\N
4233	CID1886	CAT008	ITM042	26	26	0	0	10	50	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		10.6	0		\N	\N	\N	\N
4234	CID1886	CAT008	ITM043	30	30	0	0	10	50	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		15.2	0		\N	\N	\N	\N
4235	CID1886	CAT008	ITM054	36	36	0	0	11	55	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		24.1	0		\N	\N	\N	\N
4236	CID1886	CAT007	ITM055	40	40	0	0	13	65	27	68.58	68.58	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		35.7	0		\N	\N	\N	\N
4237	CID1885	CAT001	ITM009	17+17+58	58	17	17	18	45	0	110	110	HDPE	MAS041	FALSE	Pcs.	0.084	25Pcs/P x 10P	None	Plain	91.1	0	84 grams/pc	\N	\N	\N	\N
4238	CID1885	CAT001	ITM009	17+17+58	58	17	17	18	45	0	110	110	HDPE	MAS036	FALSE	Pcs.	0.084	25Pcs/P x 10P/Bag	None	Plain	91.1	0		\N	\N	\N	\N
4239	CID1225	CAT006	ITM112	60	60	0	0	8	40	0	140	140	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		67.2	0		\N	\N	\N	\N
4240	CID1110	CAT003	ITM023	11+11+40	40	11	11	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Modern Plastic Bag Factory	26.5	30		\N	\N	\N	\N
4241	CID1888	CAT003	ITM019	6+6+24	24	6	6	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		8.8	30		\N	\N	\N	\N
4242	CID1888	CAT003	ITM020	8+8+26	26	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		11.5	30		\N	\N	\N	\N
4243	CID1888	CAT003	ITM022	10+10+36	36	10	10	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		23.9	30		\N	\N	\N	\N
4244	CID1443	CAT008	ITM057	30	30	0	0	19	95	17	43.18	43.18	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		24.6	0		\N	\N	\N	\N
4245	CID1666	CAT006	ITM112	45	45	0	0	8	40	18	45.72	45.72	LLDPE	MAS005	TRUE	Packet	1	10P/Bag	None		16.5	0		\N	\N	\N	\N
4246	CID1672	CAT006	ITM112	60	60	0	0	25	125	0	160	160	LLDPE	MAS060	FALSE	Kg.	1	20K/Bag	None		240	0		\N	\N	\N	\N
4247	CID1672	CAT006	ITM112	60	60	0	0	25	125	0	160	160	LLDPE	MAS051	FALSE	Kg.	1	20K/Bag	None		240	0		\N	\N	\N	\N
4248	CID1059	CAT006	ITM112	45	45	0	0	4	20	8	90	90	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None		16.2	0		\N	\N	\N	\N
4249	CID1623	CAT006	ITM112	45	45	0	0	6	30	0	90	90	LLDPE	MAS005	TRUE	Packet	1	10P/Bag	None	Plain	24.3	0		\N	\N	\N	\N
4250	CID1534	CAT008	ITM057	30	30	0	0	17	85	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		25.9	0		\N	\N	\N	\N
4251	CID1889	CAT003	ITM019	9+9+24	24	9	9	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		10.2	0		\N	\N	\N	\N
4252	CID1889	CAT003	ITM020	10+10+30	30	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		15.2	0		\N	\N	\N	\N
4253	CID1889	CAT003	ITM021	12+12+33	33	12	12	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		24.3	0		\N	\N	\N	\N
4254	CID1889	CAT007	ITM044	20	20	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Packet	1	20K/Bag	None		0	0		\N	\N	\N	\N
4255	CID1889	CAT008	ITM056	76	76	0	0	16	80	0	123	123	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		149.6	0		\N	\N	\N	\N
4256	CID1890	CAT004	ITM027	6+6+26	26	6	6	44	110	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		29.7	20		\N	\N	\N	\N
4257	CID1891	CAT003	ITM020	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4258	CID1891	CAT003	ITM022	0	0	0	0	0	0	0	0	0	HDPE	MAS005	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4259	CID1891	CAT002	ITM011	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4260	CID1891	CAT002	ITM012	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4261	CID1891	CAT002	ITM013	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4262	CID1891	CAT002	ITM014	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4263	CID1891	CAT002	ITM015	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4264	CID1891	CAT002	ITM016	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4265	CID1891	CAT002	ITM017	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4266	CID1891	CAT002	ITM009	0	0	0	0	0	0	0	0	0	Regrind	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4267	CID1892	CAT003	ITM020	10+10+31	31	10	10	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.1	30		\N	\N	\N	\N
4268	CID1892	CAT006	ITM036	50	50	0	0	4	20	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		10.2	0		\N	\N	\N	\N
4269	CID1893	CAT004	ITM027	8+8+27	27	8	8	16	40	12	30.48	30.48	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		10.5	20		\N	\N	\N	\N
4270	CID1893	CAT004	ITM028	10+10+30	30	10	10	16	40	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		18.3	20		\N	\N	\N	\N
4271	CID1894	CAT003	ITM021	10+10+30	30	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.6	30		\N	\N	\N	\N
4272	CID1668	CAT003	ITM020	9+9+30	30	9	9	34	85	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		37.3	30		\N	\N	\N	\N
4273	CID131	CAT003	ITM022	12+12+42	42	12	12	16	40	28	71.12	71.12	HDPE	MAS028	TRUE	Kg.	1	20K/Bag	T-Shirt		37.6	30		\N	\N	\N	\N
4274	CID1269	CAT003	ITM022	12+12+40	40	12	12	16	40	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		36.4	30		\N	\N	\N	\N
4275	CID1864	CAT004	ITM028	5+5+36	36	5	5	30	75	0	43	43	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	Banana		29.7	20		\N	\N	\N	\N
4276	CID1895	CAT003	ITM019	8+8+28	28	8	8	14	35	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		11	30		\N	\N	\N	\N
4277	CID1895	CAT003	ITM020	10+10+32	32	10	10	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		18.5	30		\N	\N	\N	\N
4278	CID1814	CAT003	ITM021	12+12+35	35	12	12	16	40	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		31.2	30		\N	\N	\N	\N
4279	CID1896	CAT004	ITM028	10+10+29	29	10	10	24	60	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		23.9	20		\N	\N	\N	\N
4280	CID1488	CAT006	ITM112	45	45	0	0	10	50	0	5000	5000	HDPE	MAS033	FALSE	Roll	1	20K/Bag	None		2250	0		\N	\N	\N	\N
4281	CID1756	CAT001	ITM007	19+19+51	51	19	19	16	40	20	100	100	LLDPE	MAS003	TRUE	Pcs.	0.066	47Pcs/Packet	None		71.2	0		\N	\N	\N	\N
4282	CID1897	CAT004	ITM027	18	18	0	0	20	100	10	25.4	25.4	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		9.1	20		\N	\N	\N	\N
4283	CID1898	CAT015	ITM110	9	9	0	0	30	150	0	0	0	LLDPE	MAS001	FALSE	Roll	1	20K/Bag	None		0	0	25grams/Meter	\N	\N	\N	\N
4284	CID1899	CAT004	ITM025	17	17	0	0	15	75	0	25	25	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		6.4	20		\N	\N	\N	\N
4285	CID1899	CAT004	ITM026	20	20	0	0	18	90	0	30	30	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		10.8	20		\N	\N	\N	\N
4286	CID1899	CAT004	ITM027	25	25	0	0	25	125	0	35	35	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		21.9	20		\N	\N	\N	\N
4287	CID1899	CAT004	ITM028	30	30	0	0	25	125	0	40	40	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		30	20		\N	\N	\N	\N
4288	CID1899	CAT004	ITM029	35	35	0	0	25	125	0	45	45	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		39.4	20		\N	\N	\N	\N
4289	CID1899	CAT004	ITM030	40	40	0	0	26	130	0	50	50	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		52	20		\N	\N	\N	\N
4290	CID1899	CAT004	ITM031	50	50	0	0	28	140	0	60	60	LLDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		84	20		\N	\N	\N	\N
4291	CID1664	CAT003	ITM020	10+10+32	32	10	10	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		16.9	30		\N	\N	\N	\N
4292	CID1908	CAT006	ITM112	45	45	0	0	6	30	0	0	0	HDPE	MAS055	TRUE	Roll	1	20K/Bag	None	Plain	0	0		\N	\N	\N	\N
4296	CID1901	CAT004	ITM028	9+9+31	31	9	9	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		43.3	20		\N	\N	\N	\N
4297	CID412	CAT002	ITM053	0	0	0	0	0	0	0	0	0	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
4298	CID1902	CAT004	ITM027	30	30	0	0	20	100	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		21.3	20		\N	\N	\N	\N
4299	CID1902	CAT004	ITM028	5+5+30	30	5	5	40	100	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		36.6	20		\N	\N	\N	\N
4300	CID1903	CAT004	ITM027	6+6+25	25	6	6	35	87	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		22.9	20		\N	\N	\N	\N
4301	CID1903	CAT004	ITM028	7+7+30	30	7	7	40	100	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		35.8	20		\N	\N	\N	\N
4302	CID1903	CAT004	ITM027	6+6+25	25	6	6	35	87	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		22.9	20		\N	\N	\N	\N
4303	CID1903	CAT004	ITM028	7+7+30	30	7	7	40	100	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		35.8	20		\N	\N	\N	\N
4304	CID1904	CAT004	ITM027	6+6+26	26	6	6	44	110	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		29.7	20		\N	\N	\N	\N
4305	CID1904	CAT004	ITM027	6+6+26	26	6	6	44	110	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		29.7	20		\N	\N	\N	\N
4307	CID1905	CAT004	ITM028	6+6+36	36	6	6	35	87	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		38.2	20		\N	\N	\N	\N
4308	CID1906	CAT004	ITM028	11.5+11.5+35	35	11.5	11.5	20	50	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		26.5	20		\N	\N	\N	\N
4309	CID1907	CAT015	ITM110	30	30	0	0	9	45	12	30.48	30.48	LLDPE	MAS005	TRUE	Roll	20	20K/Bag	None		8.2	0	One Side Open	\N	\N	\N	\N
4310	CID1908	CAT015	ITM110	10+10+40	40	10	10	16	40	20	50.8	50.8	HDPE	MAS055	TRUE	Kg.	1	20K/Bag	None		24.4	0		\N	\N	\N	\N
4311	CID004	CAT006	ITM038	60	60	0	0	8	40	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4312	CID1968	CAT006	ITM112	45	45	0	0	6	30	0	90	90	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None	Plain	24.3	0		\N	\N	\N	\N
4313	CID1910	CAT003	ITM020	9+9+32	32	9	9	15	37	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		20.7	30		\N	\N	\N	\N
4314	CID1910	CAT003	ITM021	13+13+37	37	13	13	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		30.7	30		\N	\N	\N	\N
4315	CID1910	CAT003	ITM022	11+11+39	39	11	11	18	45	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		39	30		\N	\N	\N	\N
4316	CID1910	CAT008	ITM044	22	22	0	0	13	65	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		10.2	0		\N	\N	\N	\N
4317	CID1895	CAT004	ITM027	7+7+26	26	7	7	18	45	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		14.6	20		\N	\N	\N	\N
4318	CID1911	CAT004	ITM028	9+9+37	37	9	9	24	60	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		26.8	20		\N	\N	\N	\N
4319	CID1973	CAT006	ITM112	45	45	0	0	6	30	0	110	110	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	29.7	0		\N	\N	\N	\N
4320	CID1885	CAT001	ITM009	18+18+60	60	18	18	18	45	0	110	110	Regrind	MAS003	FALSE	Pcs.	0.086	25Pcs/P x 10P/Bag	None	Sedress	95	0	2.150Kg/Packet	\N	\N	\N	\N
4321	CID1885	CAT002	ITM013	11+11+30	30	11	11	8	20	0	60	60	HDPE	MAS005	FALSE	Pcs.	0.012	30Pcs/Roll x 10R/Bag	None	Sedress	12.5	0	12grams/pc	\N	\N	\N	\N
4905	CID2129	CAT008	ITM042	26	26	0	0	12	30	16	40	40	LLDPE	MAS001	True	Kg.	1	20K/Bag			0			\N	\N	\N	\N
4322	CID1885	CAT001	ITM005	15+15+40	40	15	15	18	45	0	80	80	HDPE	MAS005	FALSE	Pcs.	0.047	25Pcs/P x 10P/Bag	None	Plain	50.4	0	47grms/Pc	\N	\N	\N	\N
4323	CID1885	CAT001	ITM005	15+15+40	40	15	15	18	45	0	80	80	HDPE	MAS036	FALSE	Pcs.	0.047	25Pcs/P x 10P/Bag	None	Plain	50.4	0		\N	\N	\N	\N
4324	CID1885	CAT001	ITM007	18+18+50	50	18	18	18	45	0	106	106	Regrind	MAS003	FALSE	Pcs.	0.075	25Pcs/P x 10P/Bag	None	Plain	82	0	19Kg/Bag	\N	\N	\N	\N
4325	CID1885	CAT001	ITM008	15+15+58	58	15	15	18	45	0	110	110	HDPE	MAS003	FALSE	Pcs.	0.08	25Pcs/P x 10P/Bag	None	Plain	87.1	0	80grms/Pc	\N	\N	\N	\N
4326	CID1885	CAT001	ITM010	25+25+70	70	25	25	18	45	0	130	130	Regrind	MAS003	FALSE	Pcs.	0.13	25Pcs/P x 5P/Bag	None	Sedress	140.4	0	128grms/Pc	\N	\N	\N	\N
4294	CID1900	CAT003	ITM020	30+9+9	30	9	9	60	150	20	51	50.8	LLDPE	MAS005	No	Kg.	1	20K/Bag	T-Shirt		734.4	30		20	20.00	\N	\N
4293	CID1900	CAT003	ITM019	25+9+9	25	9	9	60	150	18	46	45.72	LLDPE	MAS005	Yes	Kg.	1	20K/Bag	T-Shirt		593.4	30		20	20.00	\N	\N
4306	CID1927	CAT006	ITM112	45	45	0	0	4	10	12	30	90	HDPE	MAS001	Yes	PKT	1	20K/Bag	None		16.2	0	\N	20	20.00	\N	\N
4327	CID1912	CAT003	ITM022	12+12+40	40	12	12	17	42	24	60.96	60.96	HDPE	MAS062	TRUE	Kg.	1	20K/Bag	T-Shirt		32.8	30		\N	\N	\N	\N
4328	CID1912	CAT003	ITM023	15+15+60	60	15	15	19	47	32	81.28	81.28	HDPE	MAS062	TRUE	Kg.	1	20K/Bag	T-Shirt		68.8	30		\N	\N	\N	\N
4329	CID1031	CAT003	ITM019	10+10+29	29	10	10	14	35	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.7	30		\N	\N	\N	\N
4330	CID1031	CAT003	ITM020	10+10+31	31	10	10	14	35	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.1	30		\N	\N	\N	\N
4331	CID1913	CAT004	ITM027	5+5+27	27	5	5	40	100	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		26.3	20		\N	\N	\N	\N
4332	CID1913	CAT004	ITM028	10+10+40	40	10	10	100	250	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		182.9	20		\N	\N	\N	\N
4333	CID1913	CAT004	ITM029	10+10+60	60	10	10	100	250	28	71.12	71.12	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		284.5	20		\N	\N	\N	\N
4334	CID1914	CAT004	ITM027	5+5+20	20	5	5	30	75	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		16	20		\N	\N	\N	\N
4335	CID1914	CAT004	ITM028	9+9+28	28	9	9	30	75	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		31.5	20		\N	\N	\N	\N
4336	CID1915	CAT003	ITM022	13+13+45	45	13	13	22	55	28	71.12	71.12	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	T-Shirt		55.5	30		\N	\N	\N	\N
4337	CID2034	CAT006	ITM112	45	45	0	0	5	25	0	95	95	LLDPE	MAS005	TRUE	Roll	1	20K/Bag	None		21.4	0		\N	\N	\N	\N
4338	CID1797	CAT003	ITM022	15+15+49	49	15	15	21	52	0	0	0	HDPE	MAS066	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4339	CID1916	CAT003	ITM019	6.5+6.5+24	24	6.5	6.5	15	37	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Yasser Bahrain	11.1	30		\N	\N	\N	\N
4340	CID1916	CAT003	ITM020	8+8+26	26	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook	Yasser Bahrain	11.5	30		\N	\N	\N	\N
4341	CID1754	CAT003	ITM020	10+10+30	30	10	10	16	40	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.4	30		\N	\N	\N	\N
4342	CID1917	CAT004	ITM027	8+8+25	25	8	8	25	62	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		20.7	20		\N	\N	\N	\N
4343	CID1917	CAT004	ITM028	14+14+45	45	14	14	25	62	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		46	20		\N	\N	\N	\N
4344	CID1872	CAT003	ITM022	10+10+40	40	10	10	18	45	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		30.2	30		\N	\N	\N	\N
4345	CID2063	CAT006	ITM112	45	45	0	0	4	20	18	90	90	HDPE	MAS005	TRUE	Packet	1	20K/Bag	None	Plain	16.2	0		\N	\N	\N	\N
4346	CID1919	CAT004	ITM027	7+7+21	21	7	7	24	60	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.1	20		\N	\N	\N	\N
4347	CID1919	CAT004	ITM028	10+10+34	34	10	10	25	62	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		34	20		\N	\N	\N	\N
4348	CID1919	CAT004	ITM029	13+13+41	41	13	13	23	57	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		46.6	20		\N	\N	\N	\N
4349	CID1920	CAT004	ITM026	20.5	20.5	0	0	9	45	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		5.6	20		\N	\N	\N	\N
4350	CID1920	CAT004	ITM027	30	30	0	0	9	45	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.6	20		\N	\N	\N	\N
4351	CID1920	CAT004	ITM028	10+10+30	30	10	10	33	82	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		37.5	20		\N	\N	\N	\N
4352	CID1920	CAT004	ITM029	10+10+38	38	10	10	36	90	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		53	20		\N	\N	\N	\N
4353	CID1910	CAT003	ITM019	8+8+26	26	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		11.5	30		\N	\N	\N	\N
4354	CID1921	CAT004	ITM027	20	20	0	0	16	80	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.8	20		\N	\N	\N	\N
4355	CID1648	CAT006	ITM112	40	40	0	0	6	30	0	130	130	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	31.2	0		\N	\N	\N	\N
4356	CID1922	CAT004	ITM028	8+8+30	30	8	8	16	40	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		15	20		\N	\N	\N	\N
4357	CID1923	CAT004	ITM027	7+7+24	24	7	7	16	40	14	35.56	35.56	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		10.8	20		\N	\N	\N	\N
4358	CID1923	CAT004	ITM028	8+8+36	36	8	8	16	40	18	45.72	45.72	HDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		19	20		\N	\N	\N	\N
4359	CID1923	CAT003	ITM022	12+12+43	43	12	12	18	45	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		42.9	30		\N	\N	\N	\N
4360	CID1924	CAT003	ITM019	9+9+24	24	9	9	14	35	16	41	41	HDPE	MAS060	TRUE	Kg.	1	20K/Bag	T-Shirt		12.1	30		\N	\N	\N	\N
4361	CID1924	CAT003	ITM020	10+10+31	31	10	10	16	40	20	51	51	HDPE	MAS060	TRUE	Kg.	1	20K/Bag	T-Shirt		20.8	30		\N	\N	\N	\N
4362	CID1924	CAT006	ITM036	50	50	0	0	6	30	16	100	100	HDPE	MAS060	TRUE	Kg.	1	20K/Bag	None		30	0		\N	\N	\N	\N
4363	CID1884	CAT005	ITM033	9+9+32	32	9	9	4	10	0	110	110	HDPE	MAS005	TRUE	3 Roll	0.45	30P/Bag	None	Nights And Roses	11	0		\N	\N	\N	\N
4364	CID1453	CAT004	ITM028	11+11+32	32	11	11	18	45	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		22.2	20		\N	\N	\N	\N
4365	CID1453	CAT004	ITM029	14+14+38	38	14	14	18	45	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		27.2	20		\N	\N	\N	\N
4366	CID1453	CAT006	ITM036	50	50	0	0	6	30	0	110	110	LLDPE	MAS005	TRUE	Roll	1	20K/Bag	None		33	0		\N	\N	\N	\N
4367	CID1925	CAT003	ITM020	8+8+30	30	8	8	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		13.5	30		\N	\N	\N	\N
4368	CID1925	CAT003	ITM021	10+10+30	30	10	10	14	35	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		19.6	30		\N	\N	\N	\N
4369	CID1925	CAT008	ITM026	4+4+15	15	4	4	17	42	0	45	45	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		8.7	0		\N	\N	\N	\N
4370	CID1925	CAT008	ITM028	30	30	0	0	8	40	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		11	0		\N	\N	\N	\N
4371	CID1925	CAT001	ITM006	24	24	0	0	0	0	0	0	0	LLDPE	MAS003	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4372	CID1926	CAT004	ITM028	10+10+30	30	10	10	16	40	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		18.3	20		\N	\N	\N	\N
4904	CID2129	CAT008	ITM041	20	20	0	0	12	30	14	36	36	LLDPE	MAS001	True	Kg.	1	20K/Bag			0			\N	\N	\N	\N
4373	CID1927	CAT004	ITM027	11+11+32	32	11	11	20	50	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		21.9	20		\N	\N	\N	\N
4374	CID2085	CAT006	ITM112	45	45	0	0	4	20	10	100	100	HDPE	MAS081	TRUE	Packet	1	20K/Bag	None	Plain	18	0		\N	\N	\N	\N
4375	CID886	CAT003	ITM024	16+16+60	60	16	16	24	60	39	99.06	99.06	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		109.4	30		\N	\N	\N	\N
4376	CID1472	CAT004	ITM028	9+9+33	33	9	9	22	55	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		25.6	20		\N	\N	\N	\N
4377	CID1419	CAT003	ITM019	9+9+31	31	9	9	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.4	30		\N	\N	\N	\N
4378	CID1928	CAT008	ITM059	60	60	0	0	8	40	14	35.56	35.56	LLDPE	MAS004	TRUE	Roll w/Core	5	20K/Bag	None		17.1	0		\N	\N	\N	\N
4379	CID1929	CAT003	ITM019	21+7+7	21	7	7	10	25	16	40.64	40.64	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		7.1	30		\N	\N	\N	\N
4380	CID1929	CAT003	ITM020	27+10+10	27	10	10	16	40	18	45.72	45.72	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		17.2	30		\N	\N	\N	\N
4381	CID1929	CAT003	ITM021	33+13+13	33	13	13	17	42	24	60.96	60.96	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		30.2	30		\N	\N	\N	\N
4382	CID513	CAT009	ITM059	20+20+60	60	20	20	40	100	0	124	124	LLDPE	MAS001	FALSE	Packet	1	20K/Bag	None		248	0		\N	\N	\N	\N
4383	CID954	CAT004	ITM028	22	22	0	0	0	0	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
4384	CID1931	CAT004	ITM028	10+10+31	31	10	10	30	75	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		31.1	20		\N	\N	\N	\N
4385	CID1932	CAT004	ITM028	10+10+40	40	10	10	25	62	22	55.88	55.88	HDPE	MAS057	TRUE	Kg.	1	20K/Bag	Banana		41.6	20		\N	\N	\N	\N
4386	CID1820	CAT003	ITM027	7+7+30	30	7	7	20	50	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		20.1	30		\N	\N	\N	\N
4387	CID1820	CAT003	ITM028	10+10+34	34	10	10	20	50	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		32.9	30		\N	\N	\N	\N
4388	CID1820	CAT003	ITM029	10+10+42	42	10	10	20	50	30	76.2	76.2	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		47.2	30		\N	\N	\N	\N
4389	CID1925	CAT009	ITM056	16	16	0	0	7	35	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		3.4	0		\N	\N	\N	\N
4390	CID1925	CAT009	ITM057	20	20	0	0	7	35	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		4.3	0		\N	\N	\N	\N
4391	CID1925	CAT009	ITM058	13+13+54	54	13	13	18	45	0	75	75	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		54	0		\N	\N	\N	\N
4392	CID1933	CAT004	ITM028	8+8+28	28	8	8	20	50	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.9	20		\N	\N	\N	\N
4393	CID339	CAT007	ITM040	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Packet	0.2	100P/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
4394	CID1756	CAT001	ITM006	20+20+46	46	20	20	17	42	0	98	98	LLDPE	MAS005	FALSE	Packet	3.2	47Pcs/Pckt	None		70.8	0	72grams/Pc	\N	\N	\N	\N
4395	CID1488	CAT001	ITM006	26+26+82	82	26	26	14	35	0	91	91	LLDPE	MAS024	FALSE	Pcs.	0.078	20K/Bag	None		85.4	0		\N	\N	\N	\N
4396	CID1250	CAT001	ITM006	30	30	0	0	7	35	24	60.96	60.96	HDPE	MAS078	TRUE	Packet	1	20K/Bag	None	Plain	12.8	0		\N	\N	\N	\N
4397	CID1927	CAT004	ITM029	14+14+43	43	14	14	25	62	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		44.7	20		\N	\N	\N	\N
4398	CID1927	CAT004	ITM028	12+12+35	35	12	12	22	55	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		29.7	20		\N	\N	\N	\N
4399	CID1935	CAT004	ITM028	9+9+27	27	9	9	30	75	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		27.4	20		\N	\N	\N	\N
4400	CID1935	CAT004	ITM029	9+9+38	38	9	9	32	80	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		45.5	20		\N	\N	\N	\N
4401	CID1725	CAT004	ITM027	9+9+25	25	9	9	21	52	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		18.2	20		\N	\N	\N	\N
4402	CID1725	CAT004	ITM028	13+13+41	41	13	13	21	52	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		35.4	20		\N	\N	\N	\N
4403	CID1936	CAT003	ITM019	7+7+22	22	7	7	15	37	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	t-Shirt		9.5	30		\N	\N	\N	\N
4404	CID1936	CAT003	ITM020	10+10+29	29	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		18.4	30		\N	\N	\N	\N
4405	CID1937	CAT015	ITM110	60	60	0	0	9	45	34	86.36	86.36	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		46.6	0		\N	\N	\N	\N
4406	CID1938	CAT003	ITM019	10+10+27	27	10	10	19	47	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		20.2	30		\N	\N	\N	\N
4407	CID1938	CAT008	ITM044	20	20	0	0	9	45	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.3	0		\N	\N	\N	\N
4408	CID1947	CAT004	ITM027	5+5+23	23	5	5	23	57	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		13.4	20		\N	\N	\N	\N
4409	CID1948	CAT003	ITM020	10+10+30	30	10	10	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.2	30		\N	\N	\N	\N
4410	CID1948	CAT003	ITM021	10+10+35	35	10	10	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.5	30		\N	\N	\N	\N
4411	CID746	CAT003	ITM023	18+18+51	51	18	18	30	75	0	89	89	HDPE	MAS010	FALSE	Kg.	1	13Kg/Bag	T-Shirt		116.1	30		\N	\N	\N	\N
4412	CID1950	CAT009	ITM045	60	60	0	0	15	75	0	0	0	LLDPE	MAS001	FALSE	Roll	10	10P/Bag	None	Plain	0	0		\N	\N	\N	\N
4413	CID1950	CAT009	ITM075	60	60	0	0	30	150	0	90	90	LLDPE	MAS001	FALSE	Box	10	10P/Bag	None		162	0		\N	\N	\N	\N
4414	CID1951	CAT003	ITM020	10+10+31	31	10	10	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.6	30		\N	\N	\N	\N
4415	CID1951	CAT003	ITM021	13+13+37	37	13	13	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		26.9	30		\N	\N	\N	\N
4416	CID1952	CAT003	ITM019	8+8+27	27	8	8	14	35	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.8	30		\N	\N	\N	\N
4417	CID1952	CAT003	ITM020	10+10+30	30	10	10	14	35	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		17.8	30		\N	\N	\N	\N
4418	CID1952	CAT003	ITM021	11+11+32	32	11	11	14	35	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23	30		\N	\N	\N	\N
4419	CID1953	CAT012	ITM052	6.5+6.5+28	28	6.5	6.5	49	122	24	60	60	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		60	20		\N	\N	\N	\N
4421	CID1180	CAT007	ITM042	25	25	0	0	10	25	\N	\N	35	LLDPE	MAS001	No	PKT	0.4	40P/Bag	None	Baity	0	0		40	16.00	\N	\N
4423	CID800	CAT004	ITM027	18	18	0	0	18	90	10	25.4	25.4	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		8.2	20		\N	\N	\N	\N
4424	CID1946	CAT003	ITM019	7+7+22	22	7	7	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		10.5	30		\N	\N	\N	\N
4425	CID1946	CAT003	ITM020	8+8+30	30	8	8	16	40	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.7	30		\N	\N	\N	\N
4426	CID1946	CAT003	ITM021	10+10+34	34	10	10	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		26.3	30		\N	\N	\N	\N
4427	CID1718	CAT003	ITM020	12+12+32	32	12	12	15	37	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23.2	30		\N	\N	\N	\N
4428	CID1938	CAT003	ITM021	10+10+30	30	10	10	24	60	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		36.6	30		\N	\N	\N	\N
4429	CID1954	CAT008	ITM044	35	35	0	0	30	150	0	47	47	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		49.4	0		\N	\N	\N	\N
4430	CID1631	CAT002	ITM006	12+12+28	28	12	12	6	15	0	65	65	HDPE	MAS005	FALSE	Roll	1	30p/roll*17/box	None		10.1	0		\N	\N	\N	\N
4431	CID1122	CAT001	ITM003	13+13+30	30	13	13	32	80	0	60	60	HDPE	MAS005	FALSE	Kg.	1	20K/Bag	None	Plain	53.8	0		\N	\N	\N	\N
4432	CID142	CAT009	ITM045	10	10	0	0	10	50	0	0	0	LLDPE	MAS081	FALSE	Roll	5	5Kg/Box	None		0	0		\N	\N	\N	\N
4433	CID1955	CAT004	ITM027	20	20	0	0	18	90	12	30.48	30.48	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		11	20		\N	\N	\N	\N
4434	CID1956	CAT004	ITM028	10+10+30	30	10	10	28	70	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		32	20		\N	\N	\N	\N
4435	CID1956	CAT004	ITM029	11.5+11.5+40	40	11.5	11.5	30	75	22	55.88	55.88	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		52.8	20		\N	\N	\N	\N
4436	CID1957	CAT004	ITM027	10+10+29	29	10	10	30	75	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		29.9	20		\N	\N	\N	\N
4437	CID1958	CAT004	ITM028	8+8+36	36	8	8	38	95	18	45.72	45.72	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	Banana		45.2	20		\N	\N	\N	\N
4438	CID1959	CAT003	ITM019	7+7+21	21	7	7	11	27	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		7.7	30		\N	\N	\N	\N
4439	CID1959	CAT003	ITM020	9+9+27	27	9	9	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.3	30		\N	\N	\N	\N
4440	CID1960	CAT003	ITM019	8+8+28	28	8	8	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.9	30		\N	\N	\N	\N
4441	CID1960	CAT003	ITM020	10+10+37	37	10	10	14	35	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		22.3	30		\N	\N	\N	\N
4442	CID1960	CAT003	ITM021	12+12+41	41	12	12	15	37	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		34.2	30		\N	\N	\N	\N
4443	CID1961	CAT003	ITM020	10+10+30	30	10	10	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.3	30		\N	\N	\N	\N
4444	CID1961	CAT003	ITM021	11+11+37	37	11	11	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23	30		\N	\N	\N	\N
4445	CID1961	CAT003	ITM022	13+13+41	41	13	13	24	60	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		49	30		\N	\N	\N	\N
4446	CID1962	CAT004	ITM028	10+10+31	31	10	10	26	65	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		26.9	20		\N	\N	\N	\N
4447	CID1962	CAT006	ITM036	50	50	0	0	5	25	14	100	100	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None		25	0		\N	\N	\N	\N
4448	CID2113	CAT014	ITM106	8+8+34	34	8	8	15	37	0	110	110	LLDPE	MAS004	FALSE	Roll	0.8	20K/Bag	None	Hana	40.7	0		\N	\N	\N	\N
4449	CID1963	CAT003	ITM019	8+8+24	24	8	8	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.4	30		\N	\N	\N	\N
4450	CID1963	CAT003	ITM020	9+9+30	30	9	9	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		17.1	30		\N	\N	\N	\N
4451	CID1963	CAT003	ITM021	10+10+40	40	10	10	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		27.1	30		\N	\N	\N	\N
4452	CID2093	CAT004	ITM028	10+10+30	30	10	10	15	37	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		15	20		\N	\N	\N	\N
4453	CID184	CAT006	ITM036	50	50	0	0	8	40	0	0	0	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4454	CID1835	CAT004	ITM029	12+12+49	49	12	12	35	87	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		58.1	20		\N	\N	\N	\N
4455	CID1965	CAT003	ITM019	10+10+27	27	10	10	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		13.8	30		\N	\N	\N	\N
4456	CID1965	CAT003	ITM021	11+11+32	32	11	11	15	37	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		24.4	0		\N	\N	\N	\N
4457	CID1744	CAT004	ITM027	8+8+27	27	8	8	26	65	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		22.7	20		\N	\N	\N	\N
4458	CID1966	CAT003	ITM019	7+7+26	26	7	7	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.4	30		\N	\N	\N	\N
4459	CID1966	CAT003	ITM020	9+9+28	28	9	9	14	35	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		14.7	30		\N	\N	\N	\N
4460	CID1967	CAT006	ITM036	50	50	0	0	6	30	0	100	100	HDPE	MAS005	TRUE	Roll	1	20K/Bag	None	Plain	30	0		\N	\N	\N	\N
4461	CID1968	CAT003	ITM019	7+7+27	27	7	7	13	32	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12	30		\N	\N	\N	\N
4462	CID1968	CAT004	ITM029	8+8+40	40	8	8	18	45	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		23	20		\N	\N	\N	\N
4463	CID657	CAT008	ITM044	18	18	0	0	10	50	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		8.2	0		\N	\N	\N	\N
4464	CID1969	CAT003	ITM020	9+9+28	28	9	9	11	27	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.6	30		\N	\N	\N	\N
4465	CID1969	CAT003	ITM021	9+9+30	30	9	9	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.7	30		\N	\N	\N	\N
4466	CID1970	CAT004	ITM028	9+9+31	31	9	9	35	87	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		43.3	20		\N	\N	\N	\N
4467	CID1970	CAT004	ITM029	8+8+27	27	8	8	28	70	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		33.6	20		\N	\N	\N	\N
4468	CID1971	CAT004	ITM027	5+5+23	23	5	5	22	55	12	30.48	30.48	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		11.1	20		\N	\N	\N	\N
4469	CID1971	CAT004	ITM028	7+7+36	36	7	7	37	92	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		42.1	20		\N	\N	\N	\N
4470	CID1971	CAT004	ITM029	12+12+49	49	12	12	35	87	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		58.1	20		\N	\N	\N	\N
4471	CID1972	CAT010	ITM046	19+19+45	45	19	19	13	32	0	74	74	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		39.3	0		\N	\N	\N	\N
4472	CID1973	CAT003	ITM020	8+8+26	26	8	8	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.7	30		\N	\N	\N	\N
4473	CID1974	CAT004	ITM027	7+7+28	28	7	7	18	45	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		13.4	20		\N	\N	\N	\N
4474	CID1975	CAT003	ITM019	9+9+30	30	9	9	15	37	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.2	30		\N	\N	\N	\N
4475	CID1975	CAT003	ITM021	10+10+32	32	10	10	16	40	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.4	30		\N	\N	\N	\N
4476	CID1976	CAT003	ITM020	8+8+30	30	8	8	12	30	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		14	30		\N	\N	\N	\N
4477	CID1976	CAT004	ITM027	34	34	0	0	14	70	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		21.8	20		\N	\N	\N	\N
4478	CID1976	CAT004	ITM029	9+9+35	35	9	9	28	70	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		37.7	20		\N	\N	\N	\N
4479	CID1878	CAT004	ITM028	12+12+37.5	37.5	12	12	22	55	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		30.9	20		\N	\N	\N	\N
4480	CID1977	CAT010	ITM046	55	55	0	0	11	55	34	86.36	86.36	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		52.2	0		\N	\N	\N	\N
4481	CID464	CAT003	ITM019	7+7+23	23	7	7	16	40	16	40.64	40.64	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12	30		\N	\N	\N	\N
4482	CID1978	CAT001	ITM009	18+18+60	60	18	18	28	70	0	110	110	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None	Plain	147.8	0		\N	\N	\N	\N
4483	CID1100	CAT008	ITM057	21	21	0	0	10	50	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.5	0		\N	\N	\N	\N
4484	CID1979	CAT004	ITM028	10+10+30	30	10	10	24	60	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		27.4	20		\N	\N	\N	\N
4485	CID1979	CAT006	ITM036	50	50	0	0	4	20	0	0	0	HDPE	MAS004	TRUE	Roll	1	20K/Bag	None	Plain	0	0		\N	\N	\N	\N
4486	CID1980	CAT004	ITM027	8+8+28	28	8	8	30	75	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		26.8	20		\N	\N	\N	\N
4487	CID1981	CAT004	ITM019	8+8+31	31	8	8	36	90	18	45.72	45.72	LLDPE	MAS105	TRUE	Kg.	1	20K/Bag	Banana		38.7	20		\N	\N	\N	\N
4488	CID1981	CAT004	ITM028	8+8+37	37	8	8	36	90	20	50.8	50.8	LLDPE	MAS105	TRUE	Kg.	1	20K/Bag	Banana		48.5	20		\N	\N	\N	\N
4489	CID1944	CAT003	ITM020	10+10+27	27	10	10	16	40	18	45.72	45.72	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		17.2	30		\N	\N	\N	\N
4490	CID1944	CAT003	ITM021	13+13+33	33	13	13	17	42	24	60.96	60.96	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		30.2	30		\N	\N	\N	\N
4491	CID1982	CAT004	ITM028	7+7+40	40	7	7	33	82	20	50.8	50.8	HDPE	MAS058	TRUE	Kg.	1	20K/Bag	Banana		45	20		\N	\N	\N	\N
4492	CID1983	CAT004	ITM028	8+8+28	28	8	8	30	75	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		30.2	20		\N	\N	\N	\N
4493	CID1935	CAT004	ITM027	6+6+25	25	6	6	22	55	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		14.5	20		\N	\N	\N	\N
4494	CID1944	CAT003	ITM019	7+7+23	23	7	7	16	40	16	40.64	40.64	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12	30		\N	\N	\N	\N
4495	CID1984	CAT004	ITM027	21	21	0	0	18	90	12	30.48	30.48	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	None		11.5	0		\N	\N	\N	\N
4496	CID1985	CAT004	ITM028	8+8+28	28	8	8	30	75	0	0	0	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
4497	CID1986	CAT004	ITM027	6+6+25	25	6	6	22	55	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		16.5	20		\N	\N	\N	\N
4498	CID1855	CAT003	ITM019	7+7+23	23	7	7	10	25	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		7.5	30		\N	\N	\N	\N
4499	CID226	CAT006	ITM036	50	50	0	0	8	40	0	110	110	LLDPE	MAS005	TRUE	Roll	1.5	10R/Bag	None	Modern Plastic Bag Factory	44	0		\N	\N	\N	\N
4500	CID1987	CAT003	ITM019	8+8+27	27	8	8	11	27	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		10.6	30		\N	\N	\N	\N
4501	CID1987	CAT006	ITM036	50	50	0	0	4	20	0	100	100	HDPE	MAS001	TRUE	Roll	1	20K/Bag	None	Plain	20	0		\N	\N	\N	\N
4502	CID1988	CAT003	ITM019	7+7+25	25	7	7	13	32	16	40.64	40.64	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		10.1	30		\N	\N	\N	\N
4503	CID1988	CAT004	ITM028	8+8+29	29	8	8	39	97	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		39.9	20		\N	\N	\N	\N
4504	CID1676	CAT008	ITM056	26	26	0	0	8	40	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		8.5	0		\N	\N	\N	\N
4505	CID1923	CAT003	ITM024	50+14+14	50	14	14	20	50	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		63.4	30		\N	\N	\N	\N
4506	CID1923	CAT004	ITM026	20	20	0	0	20	100	12	30.48	30.48	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		12.2	20		\N	\N	\N	\N
4507	CID1989	CAT004	ITM028	8+8+30	30	8	8	30	75	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		28	20		\N	\N	\N	\N
4508	CID1989	CAT004	ITM029	6+6+41	41	6	6	36	90	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		48.5	20		\N	\N	\N	\N
4509	CID1943	CAT004	ITM028	6+6+41	41	6	6	36	90	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		48.5	20		\N	\N	\N	\N
4510	CID1990	CAT003	ITM020	10+10+30	30	10	10	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		17.8	30		\N	\N	\N	\N
4511	CID1991	CAT004	ITM027	20	20	0	0	15	75	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.1	20		\N	\N	\N	\N
4512	CID1991	CAT004	ITM028	28	28	0	0	12	60	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		11.9	20		\N	\N	\N	\N
4513	CID1991	CAT004	ITM029	6+6+38	38	6	6	22	55	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		27.9	20		\N	\N	\N	\N
4514	CID1992	CAT004	ITM027	32	32	0	0	14	70	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		15.9	20		\N	\N	\N	\N
4515	CID1250	CAT009	ITM076	15+15+55	55	15	15	43	107	0	80	80	LLDPE	MAS038	FALSE	Packet	2	10P/Bag	None	Plain	145.5	0		\N	\N	\N	\N
4516	CID1443	CAT008	ITM056	25	25	0	0	14	70	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		12.4	0		\N	\N	\N	\N
4517	CID1833	CAT004	ITM028	9+9+28	28	9	9	35	87	20	50	50	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		40	20		\N	\N	\N	\N
4518	CID657	CAT008	ITM044	13	13	0	0	10	50	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		5.3	0		\N	\N	\N	\N
4519	CID1344	CAT003	ITM018	7+7+22	22	7	7	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		10.2	30		\N	\N	\N	\N
4520	CID1994	CAT003	ITM019	7+7+25	25	7	7	13	32	16	40.64	40.64	HDPE	MAS060	TRUE	Kg.	1	20K/Bag	T-Shirt		10.1	30		\N	\N	\N	\N
4521	CID1994	CAT003	ITM020	11+11+35	35	11	11	14	35	22	55.88	55.88	HDPE	MAS060	TRUE	Kg.	1	20K/Bag	T-Shirt		22.3	30		\N	\N	\N	\N
4522	CID1994	CAT003	ITM021	40+12+12	40	12	12	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		31.2	30		\N	\N	\N	\N
4523	CID744	CAT008	ITM044	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4524	CID1996	CAT003	ITM018	7+7+21	21	7	7	11	27	16	40.64	40.64	HDPE	MAS058	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		7.7	30		\N	\N	\N	\N
4525	CID1996	CAT003	ITM019	10+10+27	27	10	10	15	37	18	45.72	45.72	HDPE	MAS058	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		15.9	30		\N	\N	\N	\N
4526	CID1996	CAT003	ITM021	13+13+33	33	13	13	16	40	24	60.96	60.96	HDPE	MAS058	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		28.8	30		\N	\N	\N	\N
4527	CID914	CAT008	ITM044	60	60	0	0	43	215	0	100	100	LLDPE	MAS001	FALSE	Kg.	20	20K/Bag	None		258	0		\N	\N	\N	\N
4528	CID1997	CAT004	ITM027	8+8+38	38	8	8	25	62	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		27.2	20		\N	\N	\N	\N
4529	CID1997	CAT004	ITM029	10+10+50	50	10	10	20	50	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		35.6	20		\N	\N	\N	\N
4530	CID1935	CAT004	ITM028	9+9+30	30	9	9	24	60	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		23.4	20		\N	\N	\N	\N
4531	CID1998	CAT004	ITM028	9+9+37	37	9	9	25	62	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		31.2	20		\N	\N	\N	\N
4532	CID914	CAT008	ITM044	5+5+39	39	5	5	36	90	26	66.04	66.04	LLDPE	MAS001	TRUE	Kg.	20	20K/Bag	Banana		58.2	20		\N	\N	\N	\N
4533	CID1993	CAT003	ITM019	8+8+21	21	8	8	11	27	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		7.1	30		\N	\N	\N	\N
4534	CID1993	CAT003	ITM021	31+10+10	31	10	10	14	35	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.8	30		\N	\N	\N	\N
4535	CID1993	CAT003	ITM022	14+14+48	48	14	14	20	50	32	81.28	81.28	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		61.8	30		\N	\N	\N	\N
4536	CID1721	CAT004	ITM028	8+8+28	28	8	8	35	87	18	45.72	45.72	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	Banana		35	20		\N	\N	\N	\N
4537	CID1721	CAT004	ITM029	14+14+46	46	14	14	35	87	22	55.88	55.88	LLDPE	MAS029	TRUE	Kg.	1	20K/Bag	Banana		72	20		\N	\N	\N	\N
4538	CID723	CAT008	ITM044	32	32	0	0	8	40	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		10.4	0		\N	\N	\N	\N
4539	CID1986	CAT004	ITM028	10+10+35	35	10	10	23	57	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		31.9	20		\N	\N	\N	\N
4540	CID1986	CAT004	ITM029	11+11+41	41	11	11	23	57	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		43.8	0		\N	\N	\N	\N
4541	CID1967	CAT003	ITM020	8+8+28	28	8	8	12	30	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.4	30		\N	\N	\N	\N
4542	CID1999	CAT001	ITM006	20+20+50	50	20	20	11	27	0	98	98	LLDPE	MAS003	FALSE	Packet	1	50Pcs/Px10P/Bag	None		47.6	0		\N	\N	\N	\N
4543	CID2000	CAT004	ITM028	9+9+28	28	9	9	30	75	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		31.5	0		\N	\N	\N	\N
4544	CID1972	CAT010	ITM062	18+18+44	44	18	18	29	72	0	90	90	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		103.7	0		\N	\N	\N	\N
4545	CID1972	CAT009	ITM044	4+4+20	20	4	4	23	57	0	54	54	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	Banana		17.2	20	Special	\N	\N	\N	\N
4546	CID1972	CAT009	ITM056	4+4+40	40	4	4	27	67	0	57	57	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		36.7	0	Specialo	\N	\N	\N	\N
4547	CID1972	CAT009	ITM057	4+4+40	40	4	4	39	97	0	81	81	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		75.4	0	Special	\N	\N	\N	\N
4548	CID2001	CAT003	ITM019	8+8+22	22	8	8	16	40	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.4	30		\N	\N	\N	\N
4549	CID2001	CAT003	ITM020	9+9+26	26	9	9	24	60	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		24.1	30		\N	\N	\N	\N
4550	CID2001	CAT003	ITM021	10+10+34	34	10	10	27	67	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		44.1	30		\N	\N	\N	\N
4551	CID2002	CAT004	ITM027	41	41	0	0	12	60	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		17.5	0		\N	\N	\N	\N
4552	CID2002	CAT004	ITM029	52	52	0	0	14	70	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		29.6	0		\N	\N	\N	\N
4553	CID1122	CAT001	ITM005	40+15+15	40	15	15	60	150	16	80	80	LLDPE	MAS029	TRUE	Kg.	1.8	10P/Bag	None	Plain	168	0		\N	\N	\N	\N
4554	CID2003	CAT004	ITM028	5+5+27	27	5	5	35	87	14	35.56	35.56	LLDPE	MAS010	TRUE	Kg.	1	20K/Bag	Banana		22.9	20		\N	\N	\N	\N
4555	CID2004	CAT004	ITM027	7+7+24	24	7	7	24	60	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		18.5	20		\N	\N	\N	\N
4556	CID2005	CAT004	ITM027	30	30	0	0	9	45	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.6	20		\N	\N	\N	\N
4557	CID2005	CAT004	ITM020	34	34	0	0	9	45	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		15.5	20		\N	\N	\N	\N
4558	CID2006	CAT004	ITM027	25	25	0	0	15	75	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		13.3	20		\N	\N	\N	\N
4559	CID2007	CAT003	ITM020	12+12+33	33	12	12	36	90	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		57.3	30		\N	\N	\N	\N
4560	CID2007	CAT003	ITM021	15+15+40	40	15	15	36	90	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		83.2	30		\N	\N	\N	\N
4561	CID2009	CAT003	ITM020	9+9+26	26	9	9	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		12.5	30		\N	\N	\N	\N
4562	CID2009	CAT003	ITM021	11+11+35	35	11	11	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		27.8	30		\N	\N	\N	\N
4563	CID2009	CAT003	ITM022	13+13+45	45	13	13	17	42	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		48.5	30		\N	\N	\N	\N
4564	CID2010	CAT008	ITM044	16	16	0	0	12	60	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		5.9	0		\N	\N	\N	\N
4565	CID2010	CAT008	ITM056	21	21	0	0	12	60	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9	0		\N	\N	\N	\N
4566	CID2010	CAT008	ITM057	25	25	0	0	12	60	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		12.2	0		\N	\N	\N	\N
4567	CID1837	CAT004	ITM030	14+14+44	44	14	14	23	57	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		41.7	20		\N	\N	\N	\N
4568	CID2011	CAT003	ITM019	7.5+7.5+22	22	7.5	7.5	11	27	15	38.1	38.1	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		7.6	30		\N	\N	\N	\N
4569	CID2011	CAT003	ITM020	8+8+27	27	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.8	30		\N	\N	\N	\N
4570	CID2011	CAT003	ITM021	10+10+31	31	10	10	12	30	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.7	30		\N	\N	\N	\N
4571	CID1570	CAT015	ITM110	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4572	CID1570	CAT015	ITM110	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4573	CID1837	CAT008	ITM044	17+17+55	55	17	17	19	47	22	55	55	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		46	0		\N	\N	\N	\N
4574	CID1410	CAT004	ITM029	10+10+31	31	10	10	30	75	22	55.88	55.88	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		42.7	20		\N	\N	\N	\N
4575	CID1313	CAT004	ITM026	4+4+26	26	4	4	24	60	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		14.5	20		\N	\N	\N	\N
4576	CID2012	CAT004	ITM027	6+6+27.5	27.5	6	6	29	72	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		14.4	20		\N	\N	\N	\N
4577	CID1942	CAT004	ITM028	12+12+34	34	12	12	18	45	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		21.2	20		\N	\N	\N	\N
4578	CID2013	CAT004	ITM028	9+9+28	28	9	9	30	75	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		38.6	20		\N	\N	\N	\N
4579	CID2013	CAT004	ITM029	11+11+38	38	11	11	30	75	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		50.3	20		\N	\N	\N	\N
4580	CID1250	CAT001	ITM006	11+11+52	52	11	11	60	150	28	71.12	71.12	LLDPE	MAS041	TRUE	Kg.	2	10P/Bag	None	Plain	157.9	0		\N	\N	\N	\N
4581	CID939	CAT008	ITM044	20	20	0	0	15	75	0	32	32	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		9.6	0		\N	\N	\N	\N
4582	CID1423	CAT001	ITM010	23+23+60	60	23	23	23	57	0	116	116	LLDPE	MAS081	FALSE	Packet	2	10P/Bag	None	Plain	140.2	0		\N	\N	\N	\N
4583	CID844	CAT004	ITM029	10+10+35	35	10	10	22	55	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		30.7	20		\N	\N	\N	\N
4584	CID754	CAT005	ITM033	9+9+32	32	9	9	3.5	8	0	110	110	HDPE	MAS005	TRUE	Box	2.5	25Pcs x 10Roll	None	Plain	8.8	0		\N	\N	\N	\N
4585	CID2014	CAT004	ITM028	7+7+30	30	7	7	23	57	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		22.9	20		\N	\N	\N	\N
4586	CID2015	CAT004	ITM027	9+9+28	28	9	9	22	55	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		20.6	20		\N	\N	\N	\N
4587	CID2016	CAT001	ITM006	11+11+50	50	11	11	7.5	18	0	88	88	HDPE	MAS081	FALSE	Packet	2	10P/Bag	None	Plain	22.8	0		\N	\N	\N	\N
4588	CID1877	CAT012	ITM050	6+6+27	27	6	6	41	102	20	50.8	50.8	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		40.4	20		\N	\N	\N	\N
4589	CID1877	CAT012	ITM060	9+9+36	36	9	9	41	102	24	60.96	60.96	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		67.2	20		\N	\N	\N	\N
4590	CID723	CAT008	ITM044	15	15	0	0	10	50	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		6.1	0		\N	\N	\N	\N
4591	CID1892	CAT003	ITM019	7+7+22	22	7	7	11	27	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		6.9	30		\N	\N	\N	\N
4592	CID1499	CAT008	ITM058	26	26	0	0	9	45	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9.5	0		\N	\N	\N	\N
4593	CID1885	CAT002	ITM013	11+11+30	30	11	11	8	20	0	60	60	HDPE	MAS005	FALSE	Pcs.	0.012	30Pcs/Roll x 10R/Bag	None	Sedress	12.5	0	12grams/pc	\N	\N	\N	\N
4594	CID1885	CAT001	ITM006	50+15+15	50	15	15	18	45	0	98	98	Regrind	MAS003	FALSE	Pcs.	0.065	25Pcs/P x 10P/Bag	None	Sedress	70.6	0	17Kg/Bag	\N	\N	\N	\N
4595	CID2017	CAT004	ITM027	28	28	0	0	13	65	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		12.9	20		\N	\N	\N	\N
4596	CID2017	CAT004	ITM028	8+8+30	30	8	8	26	65	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		27.3	20		\N	\N	\N	\N
4597	CID2018	CAT004	ITM027	5+5+25	25	5	5	17	42	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		10.5	20		\N	\N	\N	\N
4598	CID1885	CAT002	ITM014	34+14+14	34	14	14	14	35	0	70	70	Regrind	MAS003	FALSE	Pcs.	0.03	30Pcs./R x 16R/Bag	None	Sedress	30.4	0	900grams/Roll	\N	\N	\N	\N
4599	CID1885	CAT002	ITM014	34+14+14	34	14	14	14	35	0	70	70	HDPE	MAS005	FALSE	Pcs.	0.03	30Pcs/R x 16R/Bag	None	Sedress	30.4	0	900grmas/Roll	\N	\N	\N	\N
4600	CID896	CAT004	ITM027	7+7+26	26	7	7	22	55	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		17.9	20		\N	\N	\N	\N
4601	CID896	CAT004	ITM028	10+10+31	31	10	10	22	55	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		28.5	20		\N	\N	\N	\N
4602	CID2019	CAT003	ITM019	7+7+23	23	7	7	14	35	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		10.5	30		\N	\N	\N	\N
4603	CID1972	CAT009	ITM058	4+4+35	35	4	4	27	67	0	58	58	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	Banana		33.4	20		\N	\N	\N	\N
4604	CID2020	CAT004	ITM028	13+13+36	36	13	13	33	82	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		51.7	20		\N	\N	\N	\N
4605	CID1972	CAT009	ITM059	4+4+36	36	4	4	27	67	0	81	81	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	Banana		47.8	20		\N	\N	\N	\N
4606	CID754	CAT007	ITM040	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	5	500Grams x 10Packet	None	Plain	0	0		\N	\N	\N	\N
4607	CID1596	CAT005	ITM033	9+9+32	32	9	9	4	10	0	110	110	HDPE	MAS005	TRUE	4 Roll	0.5	30P/Bag	None	Great Area Discount	11	0		\N	\N	\N	\N
4608	CID2022	CAT004	ITM028	10+10+32	32	10	10	31	77	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		36.6	20		\N	\N	\N	\N
4609	CID2022	CAT008	ITM044	70	70	0	0	9	45	39	99.06	99.06	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		62.4	0		\N	\N	\N	\N
4610	CID2023	CAT008	ITM044	25	25	0	0	10	50	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		7.6	0		\N	\N	\N	\N
4611	CID2023	CAT008	ITM056	12	12	0	0	7	35	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		2.1	0		\N	\N	\N	\N
4612	CID2023	CAT008	ITM057	12	12	0	0	7	35	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		2.1	0		\N	\N	\N	\N
4613	CID2023	CAT008	ITM058	12	12	0	0	7	35	10	25.4	25.4	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		2.1	0		\N	\N	\N	\N
4614	CID2024	CAT004	ITM027	7+7+25	25	7	7	15	37	12	30.48	30.48	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		8.8	20		\N	\N	\N	\N
4615	CID1877	CAT012	ITM052	27	27	0	0	35	175	34	86.36	86.36	LLDPE	MAS081	TRUE	Kg.	1	20K/Bag	None		81.6	0		\N	\N	\N	\N
4616	CID2025	CAT008	ITM044	15	15	0	0	18	90	0	60	60	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		16.2	0		\N	\N	\N	\N
4617	CID2025	CAT008	ITM056	15	15	0	0	18	90	0	90	90	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		24.3	0		\N	\N	\N	\N
4618	CID2025	CAT008	ITM057	25	25	0	0	18	90	0	120	120	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		54	0		\N	\N	\N	\N
4619	CID1635	CAT004	ITM026	20	20	0	0	16	80	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.8	20		\N	\N	\N	\N
4620	CID2026	CAT004	ITM029	9+9+37	37	9	9	24	60	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		33.5	20		\N	\N	\N	\N
4621	CID2027	CAT004	ITM026	20.5	20.5	0	0	9	45	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		5.6	20		\N	\N	\N	\N
4622	CID2027	CAT004	ITM027	30	30	0	0	9	45	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		9.6	20		\N	\N	\N	\N
4623	CID2027	CAT004	ITM028	10+10+30	30	10	10	32	80	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		36.6	20		\N	\N	\N	\N
4624	CID2027	CAT004	ITM029	10+10+38	38	10	10	35	87	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		51.3	20		\N	\N	\N	\N
4625	CID2029	CAT004	ITM028	6+6+35	35	6	6	14	35	22	55.88	55.88	HDPE	MAS106	TRUE	Kg.	1	20K/Bag	Banana		18.4	20		\N	\N	\N	\N
4626	CID2028	CAT004	ITM028	8+8+35	35	8	8	38	95	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		44.3	20		\N	\N	\N	\N
4627	CID2028	CAT004	ITM029	8+8+41	41	8	8	38	95	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		55	20		\N	\N	\N	\N
4628	CID2030	CAT004	ITM028	7+7+34	34	7	7	22	55	16	40.64	40.64	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		21.5	20		\N	\N	\N	\N
4629	CID2031	CAT008	ITM044	60+20+60	60	20	20	40	100	0	160	160	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		448	0		\N	\N	\N	\N
4630	CID2032	CAT004	ITM027	28	28	0	0	12	60	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		11.9	20		\N	\N	\N	\N
4631	CID2033	CAT003	ITM023	16+16+52	52	16	16	24	60	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4632	CID2033	CAT004	ITM028	6+6+36	36	6	6	35	87	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		38.2	20		\N	\N	\N	\N
4633	CID2034	CAT003	ITM020	11+11+35	35	11	11	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.4	30		\N	\N	\N	\N
4634	CID1096	CAT008	ITM044	51	51	0	0	9	45	34	86.36	86.36	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		39.6	0		\N	\N	\N	\N
4635	CID2035	CAT003	ITM022	14+14+46	46	14	14	40	100	32	81.28	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		120.3	30		\N	\N	\N	\N
4636	CID2036	CAT008	ITM044	53	53	0	0	35	175	28	71.12	71.12	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		131.9	0		\N	\N	\N	\N
4637	CID2037	CAT004	ITM028	11+11+33	33	11	11	27	67	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		37.4	20		\N	\N	\N	\N
4638	CID1911	CAT004	ITM029	8+8+43	43	8	8	24	60	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		36	20		\N	\N	\N	\N
4639	CID2038	CAT004	ITM028	10+10+34	34	10	10	30	75	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		37	20		\N	\N	\N	\N
4640	CID2038	CAT003	ITM021	11+11+37	37	11	11	24	60	24	60.96	60.96	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		43.2	30		\N	\N	\N	\N
4641	CID2038	CAT003	ITM022	13+13+39	39	13	13	25	62	28	71.12	71.12	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt		57.3	30		\N	\N	\N	\N
4642	CID2039	CAT004	ITM028	7+7+36	36	7	7	43	107	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		48.9	20		\N	\N	\N	\N
4643	CID1768	CAT003	ITM022	14+14+45	45	14	14	20	50	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		51.9	30		\N	\N	\N	\N
4644	CID1316	CAT004	ITM028	10+10+33	33	10	10	31	77	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		37.3	20		\N	\N	\N	\N
4645	CID1316	CAT004	ITM030	12+12+50	50	12	12	31	77	28	71.12	71.12	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		81	20		\N	\N	\N	\N
4646	CID2035	CAT003	ITM021	11+11+35	35	11	11	40	100	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		69.5	30		\N	\N	\N	\N
4647	CID2040	CAT004	ITM027	5+5+25	25	5	5	18	45	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		11.2	20		\N	\N	\N	\N
4648	CID2041	CAT003	ITM020	10+10+34	34	10	10	20	50	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		30.2	30		\N	\N	\N	\N
4649	CID2041	CAT003	ITM021	13+13+43	43	13	13	20	50	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		49.1	30		\N	\N	\N	\N
4650	CID746	CAT001	ITM083	28+28+82	82	28	28	27	67	0	140	140	Regrind	MAS003	FALSE	Packet	3	5P/Bag	None	Plain	258.9	0		\N	\N	\N	\N
4651	CID2029	CAT004	ITM027	6+6+26	26	6	6	14	35	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		12.2	20		\N	\N	\N	\N
4652	CID2042	CAT004	ITM027	5+5+25	25	5	5	17	42	14	35.56	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		10.5	20		\N	\N	\N	\N
4653	CID844	CAT004	ITM027	21+7+7	21	7	7	22	55	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		15.6	20		\N	\N	\N	\N
4654	CID844	CAT004	ITM028	10+10+31	31	10	10	22	55	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		25.6	20		\N	\N	\N	\N
4655	CID1756	CAT001	ITM009	22+22+51	51	22	22	57	142	39	99.06	99.06	LLDPE	MAS078	TRUE	Pcs.	0.26	30Pcs/Pckt	None	Plain	267.3	0		\N	\N	\N	\N
4656	CID2032	CAT004	ITM029	9+9+31	31	9	9	25	62	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		27.8	20		\N	\N	\N	\N
4657	CID1621	CAT004	ITM026	15	15	0	0	13	65	0	25	25	HDPE	MAS005	FALSE	Kg.	1	20K/Bag	Banana		4.9	20		\N	\N	\N	\N
4658	CID2043	CAT004	ITM027	9+9+30	30	9	9	20	50	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		24.4	20		\N	\N	\N	\N
4659	CID2043	CAT004	ITM028	11+11+37	37	11	11	26	65	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		46.8	20		\N	\N	\N	\N
4660	CID2044	CAT003	ITM020	7+7+28	28	7	7	13	32	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.7	30		\N	\N	\N	\N
4661	CID2044	CAT003	ITM021	11+11+37	37	11	11	13	32	24	60.96	60.96	HDPE	MAS089	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23	30		\N	\N	\N	\N
4662	CID2045	CAT004	ITM027	5+5+25	25	5	5	20	50	12	30.48	30.48	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		10.7	20		\N	\N	\N	\N
4663	CID2045	CAT004	ITM028	7+7+33	33	7	7	20	50	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		19.1	20		\N	\N	\N	\N
4664	CID2046	CAT004	ITM028	10+10+40	40	10	10	26	65	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		39.6	20		\N	\N	\N	\N
4665	CID1953	CAT012	ITM051	9+9+31	31	9	9	45	112	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		55.8	20		\N	\N	\N	\N
4666	CID2047	CAT004	ITM027	7+7+26	26	7	7	24	60	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		19.5	20		\N	\N	\N	\N
4667	CID2047	CAT004	ITM028	9+9+42	42	9	9	25	62	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		37.8	20		\N	\N	\N	\N
4668	CID1860	CAT004	ITM029	10+10+40	40	10	10	30	75	20	50.8	50.8	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		45.7	20		\N	\N	\N	\N
4669	CID2048	CAT004	ITM027	10+10+29	29	10	10	24	60	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None	Modern Plastic Bag Factory	23.9	0		\N	\N	\N	\N
4670	CID083	CAT001	ITM009	60+18+18	60	18	18	30	75	0	110	110	Regrind	MAS003	FALSE	Packet	7.25	50Pcs/Pckt	None	Plain	158.4	0		\N	\N	\N	\N
4671	CID1797	CAT003	ITM019	8+8+25	25	8	8	13	32	16	40.64	40.64	HDPE	MAS078	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		10.7	30		\N	\N	\N	\N
4672	CID2049	CAT004	ITM028	9+9+33	33	9	9	29	72	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		33.6	20		\N	\N	\N	\N
4673	CID2050	CAT008	ITM044	13	13	0	0	7	35	0	35	35	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		3.2	0		\N	\N	\N	\N
4674	CID2050	CAT008	ITM056	18	18	0	0	7	35	0	32	32	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		4	0		\N	\N	\N	\N
4675	CID741	CAT005	ITM033	9+9+32	32	9	9	4	10	0	110	110	HDPE	MAS005	FALSE	3 Roll	0.4	20K/Bag	None	Manal	11	0		\N	\N	\N	\N
4676	CID2051	CAT003	ITM019	10+10+29	29	10	10	18	45	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		20.2	0		\N	\N	\N	\N
4677	CID2051	CAT003	ITM020	10+10+30	30	10	10	18	45	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		25.1	0		\N	\N	\N	\N
4678	CID2052	CAT004	ITM028	10+10+31	31	10	10	36	90	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		46.6	20		\N	\N	\N	\N
4679	CID2053	CAT004	ITM028	7+7+30	30	7	7	39	97	16	40.64	40.64	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		34.7	20		\N	\N	\N	\N
4680	CID2053	CAT004	ITM029	8+8+40	40	8	8	39	97	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		55.2	20		\N	\N	\N	\N
4681	CID789	CAT008	ITM044	53	53	0	0	13	65	36	91.44	91.44	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		63	0		\N	\N	\N	\N
4682	CID411	CAT008	ITM044	23	23	0	0	7	35	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		4.9	0	Tray #18	\N	\N	\N	\N
4683	CID1967	CAT003	ITM021	11+11+34	34	11	11	22	55	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		37.6	30		\N	\N	\N	\N
4684	CID2055	CAT004	ITM027	6+6+25	25	6	6	24	60	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		18	20		\N	\N	\N	\N
4685	CID2056	CAT003	ITM019	9+9+34	34	9	9	30	75	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		39.6	30		\N	\N	\N	\N
4686	CID2056	CAT003	ITM021	11+11+40	40	11	11	36	90	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		68	0		\N	\N	\N	\N
4687	CID1488	CAT001	ITM006	14+14+50	50	14	14	8	20	0	90	90	Regrind	MAS003	FALSE	Packet	1.3	50Pcs/Pckt x 10P/Bag	None	Plain	28.1	0		\N	\N	\N	\N
4688	CID423	CAT007	ITM040	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	4	.2Kg/Pckt x 20P/Box	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
4689	CID423	CAT007	ITM041	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	4	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
4690	CID423	CAT007	ITM042	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	4	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
4691	CID423	CAT007	ITM043	0	0	0	0	10	50	0	0	0	LLDPE	MAS001	FALSE	Box	4	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
4692	CID307	CAT008	ITM044	14+14+50	50	14	14	20	50	0	88	88	LLDPE	MAS001	FALSE	Kg.	1	18Kg/Bag	None		68.6	0		\N	\N	\N	\N
4693	CID2057	CAT001	ITM003	0	0	0	0	3	15	0	0	0	HDPE	MAS038	FALSE	Box	2.5	20K/Bag	None		0	0		\N	\N	\N	\N
4694	CID2057	CAT001	ITM006	13+13+46	46	13	13	8	20	0	89	89	Regrind	MAS003	FALSE	Packet	1.3	10P/Bag	None	Plain	25.6	0		\N	\N	\N	\N
4695	CID2058	CAT003	ITM020	7+7+27	27	7	7	29	72	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		30	30		\N	\N	\N	\N
4696	CID2058	CAT003	ITM021	11+11+37	37	11	11	29	72	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		51.8	30		\N	\N	\N	\N
4697	CID1383	CAT003	ITM021	10+10+36	36	10	10	15	37	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		27.4	30		\N	\N	\N	\N
4698	CID2059	CAT003	ITM028	10+10+30	30	10	10	25	62	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.2	30		\N	\N	\N	\N
4699	CID2058	CAT003	ITM021	0	0	0	0	0	0	0	0	0	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		0	30		\N	\N	\N	\N
4700	CID1909	CAT004	ITM027	40	40	0	0	18	90	20	50.8	50.8	LLDPE	MAS048	TRUE	Kg.	1	20K/Bag	Banana		36.6	20		\N	\N	\N	\N
4701	CID1488	CAT015	ITM110	65	65	0	0	8	40	0	0	0	LLDPE	MAS001	FALSE	Roll	25	25Kg/Roll	None		0	0		\N	\N	\N	\N
4702	CID1488	CAT006	ITM037	55	55	0	0	6	30	0	0	0	HDPE	MAS005	TRUE	Roll	0.8	15R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
4703	CID1488	CAT006	ITM038	60	60	0	0	8	40	0	0	0	HDPE	MAS005	TRUE	Roll	1.8	10R/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
4704	CID1631	CAT008	ITM044	15	15	0	0	12	60	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		5.5	0		\N	\N	\N	\N
4705	CID2061	CAT003	ITM019	10+10+28	28	10	10	22	55	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		24.1	30		\N	\N	\N	\N
4706	CID2061	CAT003	ITM021	10+10+30	30	10	10	22	55	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		33.5	30		\N	\N	\N	\N
4707	CID2061	CAT008	ITM044	23	23	0	0	9	45	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		8.4	0		\N	\N	\N	\N
4708	CID2061	CAT008	ITM056	26	26	0	0	9	45	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9.5	0		\N	\N	\N	\N
4709	CID2062	CAT004	ITM029	13+13+60	60	13	13	35	87	36	91.44	91.44	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		136.8	20		\N	\N	\N	\N
4710	CID2062	CAT004	ITM030	14+14+70	70	14	14	35	87	39	99.06	99.06	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		168.9	20		\N	\N	\N	\N
4711	CID1891	CAT007	ITM040	0	0	0	0	10	50	0	30	30	LLDPE	MAS001	FALSE	Packet	0.2	60P/Bag	None	Price House (Al-Shamel)	0	0		\N	\N	\N	\N
4712	CID1891	CAT007	ITM041	0	0	0	0	10	50	0	35	35	LLDPE	MAS001	FALSE	Packet	0.2	60P/Bag	None	Price House (Al-Shamel)	0	0		\N	\N	\N	\N
4713	CID1891	CAT007	ITM042	0	0	0	0	10	50	0	40	40	LLDPE	MAS001	FALSE	Packet	0.2	60P/Bag	None	Price House (Al-Shamel)	0	0		\N	\N	\N	\N
4714	CID1891	CAT007	ITM043	0	0	0	0	10	50	0	50	50	LLDPE	MAS001	FALSE	Packet	0.2	60P/Bag	None	Price House (Al-Shamel)	0	0		\N	\N	\N	\N
4715	CID741	CAT002	ITM014	0	0	0	0	14	70	0	0	0	HDPE	MAS038	FALSE	Roll	0.9	15R/Bag	None	Manal	0	0		\N	\N	\N	\N
4716	CID2063	CAT004	ITM027	10+10+30	30	10	10	26	65	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		26.4	20		\N	\N	\N	\N
4717	CID1636	CAT008	ITM044	8+8+54	54	8	8	20	50	0	0	0	LLDPE	MAS001	FALSE	Roll	20	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
4718	CID2060	CAT008	ITM056	70	70	0	0	15	75	0	0	0	LLDPE	MAS001	FALSE	Roll	25	25Kg/Roll	None		0	0		\N	\N	\N	\N
4719	CID2064	CAT004	ITM027	7+7+26	26	7	7	30	75	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		21.3	20		\N	\N	\N	\N
4720	CID2064	CAT004	ITM028	11+11+33	33	11	11	35	87	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		48.6	20		\N	\N	\N	\N
4721	CID2064	CAT006	ITM036	50	50	0	0	8	40	20	100	100	LLDPE	MAS055	TRUE	Packet	1	20K/Bag	None	Plain	40	0		\N	\N	\N	\N
4722	CID984	CAT003	ITM020	10+10+33	33	10	10	13	32	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		19	30		\N	\N	\N	\N
4723	CID984	CAT003	ITM021	10+10+36	36	10	10	14	35	26	66.04	66.04	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.9	30		\N	\N	\N	\N
4724	CID2065	CAT004	ITM028	10+10+30	30	10	10	30	75	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		34.3	20		\N	\N	\N	\N
4725	CID1938	CAT008	ITM056	26	26	0	0	9	45	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9.5	0		\N	\N	\N	\N
4726	CID741	CAT007	ITM040	0	0	0	0	10	50	0	30	30	LLDPE	MAS001	FALSE	Packet	0.2	20K/Bag	None	Manal	0	0		\N	\N	\N	\N
4727	CID741	CAT007	ITM041	0	0	0	0	10	50	0	35	35	LLDPE	MAS001	FALSE	Packet	0.2	20K/Bag	None	Manal	0	0		\N	\N	\N	\N
4728	CID741	CAT007	ITM042	0	0	0	0	10	50	0	40	40	LLDPE	MAS001	FALSE	Packet	0.2	20K/Bag	None	Manal	0	0		\N	\N	\N	\N
4729	CID741	CAT007	ITM043	0	0	0	0	10	50	0	50	50	LLDPE	MAS001	FALSE	Packet	0.2	20K/Bag	None	Manal	0	0		\N	\N	\N	\N
4730	CID2066	CAT004	ITM027	6+6+22	22	6	6	15	37	0	35	35	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	Banana		8.8	20		\N	\N	\N	\N
4731	CID2066	CAT004	ITM028	9+9+28	28	9	9	22	55	0	40	40	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	Banana		20.2	20		\N	\N	\N	\N
4732	CID2066	CAT004	ITM029	12+12+33	33	12	12	34	85	0	45	45	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	Banana		43.6	20		\N	\N	\N	\N
4733	CID2067	CAT004	ITM028	11+11+33	33	11	11	35	87	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		48.6	20		\N	\N	\N	\N
4734	CID2074	CAT001	ITM005	15+15+40	40	15	15	10	25	0	80	80	Regrind	MAS002	FALSE	Packet	0.8	10P/Bag	None	Modern Sources Company	28	0		\N	\N	\N	\N
4787	CID2084	CAT003	ITM019	7+7+23	23	7	7	11	27	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		8.1	30		\N	\N	\N	\N
4735	CID2074	CAT001	ITM006	15+15+50	50	15	15	10	25	0	90	90	Regrind	MAS002	FALSE	Packet	0.8	10P/Bag	None	Modern Sources Company	36	0		\N	\N	\N	\N
4736	CID2074	CAT001	ITM007	18+18+50	50	18	18	10	25	0	100	100	Regrind	MAS002	FALSE	Packet	0.8	10P/Bag	None	Modern Sources Company	43	0		\N	\N	\N	\N
4737	CID2074	CAT001	ITM009	18+18+60	60	18	18	10	25	0	110	110	HDPE	MAS002	FALSE	Packet	0.8	10P/Bag	None	Modern Sources Company	52.8	0		\N	\N	\N	\N
4739	CID2068	CAT015	ITM110	0	0	0	0	0	0	0	0	0	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4740	CID2069	CAT003	ITM019	8+8+23	23	8	8	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		9.5	30		\N	\N	\N	\N
4741	CID2069	CAT003	ITM021	9+9+27	27	9	9	12	30	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		13.7	30		\N	\N	\N	\N
4742	CID2070	CAT003	ITM020	9+9+29	29	9	9	14	35	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		16.7	30		\N	\N	\N	\N
4743	CID2070	CAT003	ITM021	10+10+30	30	10	10	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		21.3	30		\N	\N	\N	\N
4744	CID004	CAT003	ITM020	10+10+32	32	10	10	14	35	0	50	50	HDPE	MAS066	FALSE	Box	5	5Kg/Box	T-Shirt w/Hook		18.2	30		\N	\N	\N	\N
4745	CID2071	CAT004	ITM028	7+7+30	30	7	7	40	100	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		35.8	20		\N	\N	\N	\N
4746	CID2072	CAT004	ITM027	7+7+26	26	7	7	20	50	12	30.48	30.48	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	Banana		12.2	20		\N	\N	\N	\N
4747	CID2072	CAT004	ITM028	9+9+28	28	9	9	25	62	18	45.72	45.72	HDPE	MAS029	TRUE	Kg.	1	20K/Bag	Banana		26.1	20		\N	\N	\N	\N
4748	CID2073	CAT004	ITM027	28	28	0	0	17	85	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		16.9	20		\N	\N	\N	\N
4749	CID2073	CAT004	ITM029	10+10+37	37	10	10	35	87	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		50.4	20		\N	\N	\N	\N
4750	CID2074	CAT005	ITM035	8+8+34	34	8	8	15	37	0	110	110	LLDPE	MAS004	FALSE	Roll	0.4	20K/Bag	None	Modern Sources Company	40.7	0		\N	\N	\N	\N
4751	CID2074	CAT005	ITM035	8+8+34	34	8	8	15	37	0	110	110	LLDPE	MAS004	FALSE	Roll	0.8	10R/Bag	None	Modern Sources Company	40.7	0		\N	\N	\N	\N
4752	CID2075	CAT001	ITM009	17+17+60	60	17	17	22	55	0	125	125	HDPE	MAS005	FALSE	Packet	2	10P/Bag	None	Plain	129.3	0		\N	\N	\N	\N
4753	CID2075	CAT001	ITM009	17+17+60	60	17	17	22	55	0	125	125	HDPE	MAS006	FALSE	Packet	2	10P/Bag	None	Plain	129.3	0		\N	\N	\N	\N
4754	CID2076	CAT003	ITM019	9+9+27	27	9	9	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12.3	30		\N	\N	\N	\N
4755	CID2076	CAT003	ITM020	10+10+31	31	10	10	12	30	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		17.1	30		\N	\N	\N	\N
4756	CID2076	CAT003	ITM021	10+10+35	35	10	10	12	30	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		20.1	30		\N	\N	\N	\N
4757	CID2075	CAT001	ITM009	17+17+60	60	17	17	22	55	0	125	125	HDPE	MAS041	FALSE	Packet	2	10P/Bag	None	Plain	129.3	0		\N	\N	\N	\N
4758	CID754	CAT001	ITM003	0	0	0	0	4	20	0	0	0	HDPE	MAS079	FALSE	Box	4	4Kg/Box	None	Plain	0	0		\N	\N	\N	\N
4759	CID2077	CAT004	ITM027	5+5+25	25	5	5	32	80	14	35.56	35.56	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		19.9	20		\N	\N	\N	\N
4760	CID2077	CAT004	ITM028	10+10+40	40	10	10	36	90	22	55.88	55.88	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		60.4	20		\N	\N	\N	\N
4761	CID2077	CAT004	ITM029	10+10+55	55	10	10	40	100	26	66.04	66.04	LLDPE	MAS004	TRUE	Kg.	1	20K/Bag	Banana		99.1	20		\N	\N	\N	\N
4762	CID2078	CAT001	ITM003	11+11+33	33	11	11	60	150	26	66.04	66.04	LLDPE	MAS004	TRUE	Packet	2	10P/Bag	None	Plain	109	0		\N	\N	\N	\N
4763	CID1967	CAT005	ITM033	0	0	0	0	4	20	0	110	110	HDPE	MAS024	FALSE	5 Roll	0.9	20K/Bag	None	Plain	0	0		\N	\N	\N	\N
4764	CID2079	CAT003	ITM020	10+10+30	30	10	10	18	45	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.1	30		\N	\N	\N	\N
4765	CID1845	CAT008	ITM044	63	63	0	0	6	30	0	0	0	LLDPE	MAS001	FALSE	Roll	20	20K/Bag	None	Modern Plastic Bag Factory	0	0		\N	\N	\N	\N
4766	CID2080	CAT004	ITM027	8+8+28	28	8	8	19	47	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		18.9	20		\N	\N	\N	\N
4767	CID1862	CAT008	ITM044	18	18	0	0	26	130	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		14.3	0		\N	\N	\N	\N
4768	CID1898	CAT008	ITM044	70+25+25	70	25	25	24	60	0	154	154	LLDPE	MAS001	FALSE	Pcs.	0.205	10Pcs/P	None		221.8	0	205 grams/Pc	\N	\N	\N	\N
4769	CID1748	CAT008	ITM044	22	22	0	0	12	60	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		8	0		\N	\N	\N	\N
4770	CID1918	CAT008	ITM044	31	31	0	0	10	50	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		15.7	0		\N	\N	\N	\N
4771	CID1872	CAT008	ITM044	22	22	0	0	8	40	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		5.4	0		\N	\N	\N	\N
4772	CID1269	CAT008	ITM044	26	26	0	0	9	45	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		9.5	0		\N	\N	\N	\N
4773	CID1423	CAT008	ITM044	15	15	0	0	6	30	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		2.7	0		\N	\N	\N	\N
4774	CID2081	CAT008	ITM044	10	10	0	0	9	45	14	35.56	35.56	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		3.2	0		\N	\N	\N	\N
4775	CID2081	CAT008	ITM044	10	10	0	0	9	45	16	40.64	40.64	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		3.7	0		\N	\N	\N	\N
4776	CID2081	CAT008	ITM044	10	10	0	0	9	45	14	35.56	35.56	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		3.2	0		\N	\N	\N	\N
4777	CID2081	CAT008	ITM044	25	25	0	0	9	45	16	40.64	40.64	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		9.1	0		\N	\N	\N	\N
4778	CID2082	CAT008	ITM044	16	16	0	0	15	75	0	10	10	LLDPE	MAS003	FALSE	Pcs.	0.0025	20K/Bag	None	Plain	2.4	0		\N	\N	\N	\N
4779	CID2082	CAT008	ITM056	15	15	0	0	15	75	0	23	23	LLDPE	MAS003	FALSE	Pcs.	0.005	20K/Bag	None	Plain	5.2	0		\N	\N	\N	\N
4780	CID2082	CAT008	ITM057	18	18	0	0	15	75	0	26	26	LLDPE	MAS003	FALSE	Pcs.	0.0071	20K/Bag	None	Plain	7	0		\N	\N	\N	\N
4781	CID2082	CAT008	ITM058	20	20	0	0	15	75	0	31	31	LLDPE	MAS003	FALSE	Pcs.	0.009	20K/Bag	None	Plain	9.3	0		\N	\N	\N	\N
4782	CID2082	CAT008	ITM059	26	26	0	0	15	75	0	39	39	LLDPE	MAS003	FALSE	Pcs.	0.014	20K/Bag	None	Plain	15.2	0		\N	\N	\N	\N
4783	CID2082	CAT008	ITM067	30	30	0	0	15	75	0	43	43	LLDPE	MAS003	FALSE	Pcs.	0.018	20K/Bag	None	Plain	19.4	0		\N	\N	\N	\N
4784	CID2082	CAT008	ITM071	45	45	0	0	15	75	0	61	61	LLDPE	MAS003	FALSE	Pcs.	0.038	20K/Bag	None	Plain	41.2	0		\N	\N	\N	\N
4785	CID2081	CAT008	ITM044	25	25	0	0	9	45	16	40.64	40.64	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		9.1	0		\N	\N	\N	\N
4786	CID2081	CAT008	ITM044	0	0	0	0	0	0	0	0	0	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		0	0		\N	\N	\N	\N
4788	CID2084	CAT003	ITM020	11+11+32	32	11	11	12	30	22	55.88	55.88	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		18.1	30		\N	\N	\N	\N
4789	CID2084	CAT003	ITM021	12+12+38	38	12	12	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		24.2	30		\N	\N	\N	\N
4790	CID2085	CAT004	ITM027	7+7+21	21	7	7	16	40	16	40.64	40.64	HDPE	MAS081	TRUE	Kg.	1	20K/Bag	Banana		11.4	20		\N	\N	\N	\N
4791	CID2085	CAT004	ITM028	10+10+31	31	10	10	16	40	18	45.72	45.72	HDPE	MAS081	TRUE	Kg.	1	20K/Bag	Banana		18.7	20		\N	\N	\N	\N
4792	CID2085	CAT004	ITM029	10+10+35	35	10	10	16	40	20	50.8	50.8	HDPE	MAS081	TRUE	Kg.	1	20K/Bag	Banana		22.4	20		\N	\N	\N	\N
4793	CID2081	CAT008	ITM044	25	25	0	0	9	45	22	55.88	55.88	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		12.6	0		\N	\N	\N	\N
4794	CID2086	CAT003	ITM021	10+10+40	40	10	10	35	87	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		63.6	30		\N	\N	\N	\N
4795	CID2086	CAT003	ITM022	12+12+45	45	12	12	35	87	28	71.12	71.12	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		85.4	30		\N	\N	\N	\N
4796	CID2087	CAT004	ITM029	47	47	0	0	33	165	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		94.5	20		\N	\N	\N	\N
4797	CID2088	CAT003	ITM019	10+10+29	29	10	10	18	45	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		20.2	30		\N	\N	\N	\N
4798	CID1488	CAT015	ITM110	7	7	0	0	16	80	0	0	0	LLDPE	MAS001	FALSE	Roll	1	20K/Bag	None		0	0		\N	\N	\N	\N
4799	CID716	CAT015	ITM110	21	21	0	0	18	90	0	0	0	LLDPE	MAS001	FALSE	Roll	1	20K/Bag	None		0	0		\N	\N	\N	\N
4800	CID2089	CAT004	ITM028	8+8+40	40	8	8	35	87	24	60.96	60.96	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		59.4	20		\N	\N	\N	\N
4801	CID2090	CAT004	ITM027	5+5+28	28	5	5	30	75	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		26.1	20		\N	\N	\N	\N
4802	CID2090	CAT004	ITM028	9+9+35	35	9	9	30	75	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		40.4	20		\N	\N	\N	\N
4803	CID1726	CAT015	ITM110	60	60	0	0	8	40	34	86.36	86.36	HDPE	MAS001	TRUE	Packet	1	20K/Bag	None		41.5	0		\N	\N	\N	\N
4804	CID2091	CAT004	ITM028	10+10+30	30	10	10	26	65	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		26.4	20		\N	\N	\N	\N
4805	CID2091	CAT004	ITM029	8+8+36	36	8	8	28	70	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		33.3	20		\N	\N	\N	\N
4806	CID2091	CAT005	ITM035	10+10+35	35	10	10	16	40	22	115	115	HDPE	MAS001	TRUE	Roll	15	20K/Bag	None		50.6	0	Roll 15 TC	\N	\N	\N	\N
4807	CID579	CAT004	ITM020	31+10+10	31	10	10	25	62	18	45.72	45.72	LLDPE	MAS050	TRUE	Kg.	1	20K/Bag	None		28.9	0		\N	\N	\N	\N
4808	CID1307	CAT010	ITM046	64	64	0	0	9	30	0	85	85	HDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		32.6	0		\N	\N	\N	\N
4809	CID1939	CAT004	ITM028	30	30	0	0	20	100	16	40.64	40.64	LLDPE	MAS055	TRUE	Kg.	1	20K/Bag	Banana		24.4	20		\N	\N	\N	\N
4810	CID1939	CAT004	ITM027	20	20	0	0	20	100	12	30.48	30.48	LLDPE	MAS048	TRUE	Kg.	1	20K/Bag	Banana		12.2	20		\N	\N	\N	\N
4811	CID2081	CAT008	ITM044	0	0	0	0	9	45	14	35.56	35.56	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		0	0		\N	\N	\N	\N
4812	CID2044	CAT006	ITM036	50	50	0	0	5	25	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		15.2	0		\N	\N	\N	\N
4813	CID1964	CAT004	ITM028	10+10+30	30	10	10	15	37	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		15	20		\N	\N	\N	\N
4814	CID2093	CAT004	ITM029	12+12+38	38	12	12	15	37	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		28	20		\N	\N	\N	\N
4815	CID2093	CAT006	ITM036	50	50	0	0	5	25	24	60.96	60.96	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		15.2	0		\N	\N	\N	\N
4816	CID2094	CAT003	ITM019	27+7+7	27	7	7	14	35	20	50.8	50.8	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		14.6	30	Master Batch Mixing:\n   Ivory/21260 ---- 1100 Grams\n   Yellow/21259 ---100 Grams\n400Grams Mixed Per Bag	\N	\N	\N	\N
4817	CID2094	CAT003	ITM020	30+10+10	30	10	10	16	40	22	55.88	55.88	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		22.4	30	Master Batch Mixing:\n   Ivory/21260 ---- 1100 Grams\n   Yellow/21259 ---100 Grams\n400Grams Mixed Per Bag	\N	\N	\N	\N
4818	CID2094	CAT003	ITM021	12+12+35	35	12	12	16	40	24	60.96	60.96	HDPE	MAS004	TRUE	Kg.	1	20K/Bag	T-Shirt		28.8	30	Master Batch Mixing:\n   Ivory/21260 ---- 1100 Grams\n   Yellow/21259 ---100 Grams\n400Grams Mixed Per Bag	\N	\N	\N	\N
4819	CID579	CAT004	ITM028	36+6+6	36	6	6	45	112	16	40.64	40.64	HDPE	MAS010	TRUE	Kg.	1	20K/Bag	None		43.7	0		\N	\N	\N	\N
4820	CID579	CAT004	ITM029	41+6+6	41	6	6	45	112	20	50.8	50.8	HDPE	MAS024	TRUE	Kg.	1	20K/Bag	None		60.3	0		\N	\N	\N	\N
4821	CID2095	CAT004	ITM027	8+8+35	35	8	8	34	85	18	45.72	45.72	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		39.6	20		\N	\N	\N	\N
4822	CID2096	CAT004	ITM029	15+15+45	45	15	15	20	50	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana	Modern Plastic Bag Factory	38.1	20		\N	\N	\N	\N
4823	CID2096	CAT004	ITM028	10+10+30	30	10	10	20	50	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana	Modern Plastic Bag Factory	22.9	20		\N	\N	\N	\N
4824	CID2096	CAT004	ITM027	7+7+25	25	7	7	20	50	14	35.56	35.56	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana	Modern Plastic Bag Factory	13.9	20		\N	\N	\N	\N
4825	CID2096	CAT006	ITM039	35	35	0	0	10	50	0	110	110	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None	Modern Plastic Bag Factory	38.5	0		\N	\N	\N	\N
4826	CID2082	CAT008	ITM072	23	23	0	0	15	75	0	32	32	LLDPE	MAS003	FALSE	Pcs.	0.01	20K/Bag	None	Plain	11	0		\N	\N	\N	\N
4827	CID2081	CAT008	ITM044	10	10	0	0	9	45	16	40.64	40.64	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		3.7	0		\N	\N	\N	\N
4828	CID2089	CAT004	ITM028	8+8+40	40	8	8	45	112	24	60.96	60.96	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		76.5	20		\N	\N	\N	\N
4829	CID984	CAT003	ITM019	8+8+27	27	8	8	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		11.8	30		\N	\N	\N	\N
4830	CID2081	CAT008	ITM044	10	10	0	0	9	45	12	30.48	30.48	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		2.7	0		\N	\N	\N	\N
4831	CID2098	CAT004	ITM027	26	26	0	0	15	75	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		15.8	20		\N	\N	\N	\N
4832	CID2099	CAT003	ITM019	7+7+25	25	7	7	12	30	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		10.7	30		\N	\N	\N	\N
4833	CID2028	CAT004	ITM027	7+7+33	33	7	7	20	50	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		19.1	20		\N	\N	\N	\N
4834	CID1770	CAT003	ITM021	10+10+35	35	10	10	20	50	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		33.5	30		\N	\N	\N	\N
4835	CID2047	CAT004	ITM026	5+5+22	22	5	5	24	60	12	30.48	30.48	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		11.7	20		\N	\N	\N	\N
4836	CID226	CAT003	ITM021	12+12+41	41	12	12	13	32	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.4	30		\N	\N	\N	\N
4837	CID004	CAT001	ITM003	32+11+11	32	11	11	0	0	26	66.04	66.04	LLDPE	MAS004	TRUE	Kg.	2	10P/Bag	None	Plain	0	0		\N	\N	\N	\N
4838	CID2100	CAT004	ITM027	9+9+28	28	9	9	28	70	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		29.4	20		\N	\N	\N	\N
4839	CID1269	CAT003	ITM019	7+7+22	22	7	7	12	30	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		8.8	30		\N	\N	\N	\N
4840	CID909	CAT001	ITM083	28+28+82	82	28	28	20	50	0	140	140	Regrind	MAS003	FALSE	Packet	3	5P/Bag	None	Plain	193.2	0		\N	\N	\N	\N
4841	CID2101	CAT004	ITM027	9+9+28	28	9	9	30	75	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		31.5	20		\N	\N	\N	\N
4842	CID2102	CAT004	ITM027	10+10+30	30	10	10	18	45	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		18.3	20		\N	\N	\N	\N
4843	CID2102	CAT004	ITM029	10+10+40	40	10	10	18	45	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		27.4	20		\N	\N	\N	\N
4844	CID2103	CAT004	ITM027	8+8+31	31	8	8	0	0	16	40.64	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		0	20		\N	\N	\N	\N
4845	CID2104	CAT003	ITM019	7+7+27	27	7	7	13	32	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		12	30		\N	\N	\N	\N
4846	CID2105	CAT004	ITM027	22	22	0	0	10	50	12	30.48	30.48	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		6.7	20		\N	\N	\N	\N
4847	CID2105	CAT003	ITM020	10+10+27	27	10	10	16	40	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		17.2	30		\N	\N	\N	\N
4848	CID2105	CAT003	ITM021	11+11+30	30	11	11	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.4	30		\N	\N	\N	\N
4849	CID2105	CAT003	ITM022	13+13+45	45	13	13	20	50	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		50.5	30		\N	\N	\N	\N
4850	CID2106	CAT004	ITM027	7+7+26	26	7	7	20	50	12	30.48	30.48	HDPE	MAS081	TRUE	Kg.	1	20K/Bag	Banana		12.2	20		\N	\N	\N	\N
4851	CID2106	CAT004	ITM029	11+11+34	34	11	11	17	42	20	50.8	50.8	HDPE	MAS081	TRUE	Kg.	1	20K/Bag	Banana		23.9	20		\N	\N	\N	\N
4852	CID2107	CAT004	ITM027	6.5+6.5+26	26	6.5	6.5	24	60	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		19	20		\N	\N	\N	\N
4853	CID2108	CAT004	ITM027	7+7+35	35	7	7	30	75	16	40.64	40.64	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		29.9	20		\N	\N	\N	\N
4854	CID2108	CAT004	ITM029	10+10+40	40	10	10	30	75	20	50.8	50.8	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		45.7	20		\N	\N	\N	\N
4855	CID2109	CAT015	ITM110	15	15	0	0	10	50	0	75	75	LLDPE	MAS001	FALSE	Kg.	1	20K/Bag	None		11.3	0		\N	\N	\N	\N
4856	CID1891	CAT015	ITM110	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4857	CID2110	CAT004	ITM028	10+10+36	36	10	10	35	87	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		35.4	20		\N	\N	\N	\N
4858	CID2110	CAT006	ITM036	50	50	0	0	7	35	0	100	100	LLDPE	MAS005	TRUE	Packet	2	10P/Bag	None	Plain	35	0		\N	\N	\N	\N
4860	CID2111	CAT004	ITM027	5+5+27	27	5	5	30	75	14	35.56	35.56	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		19.7	20		\N	\N	\N	\N
4861	CID2111	CAT004	ITM028	8+8+30	30	8	8	30	75	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		31.5	20		\N	\N	\N	\N
4862	CID2112	CAT004	ITM027	16	16	0	0	12	60	20	50.8	50.8	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		9.8	20		\N	\N	\N	\N
4863	CID2112	CAT004	ITM020	6+6+35	35	6	6	22	55	18	45.72	45.72	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		23.6	20		\N	\N	\N	\N
4864	CID2112	CAT004	ITM029	13+13+44	44	13	13	22	55	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		46.9	20		\N	\N	\N	\N
4865	CID1815	CAT008	ITM044	31	31	0	0	12	60	16	40.64	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		15.1	0		\N	\N	\N	\N
4866	CID2113	CAT005	ITM033	9+9+32	32	9	9	3.5	8	0	110	110	HDPE	MAS004	FALSE	5 Roll	0.8	20K/Bag	None	Hana	8.8	0		\N	\N	\N	\N
4867	CID2081	CAT008	ITM044	10	10	0	0	9	45	12	30.48	30.48	LLDPE	MAS001	TRUE	Roll	1	20K/Bag	None		2.7	0		\N	\N	\N	\N
4868	CID278	CAT003	ITM020	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4869	CID2113	CAT014	ITM036	50	50	0	0	8	40	0	110	110	LLDPE	MAS004	FALSE	Roll w/Core	1.5	10R/Bag	None	Hana	44	0		\N	\N	\N	\N
4870	CID2113	CAT001	ITM005	16+16+40	40	16	16	10	25	0	80	80	Regrind	MAS003	FALSE	Packet	0.8	20K/Bag	None	hana	28.8	0		\N	\N	\N	\N
4871	CID2113	CAT001	ITM006	15+15+50	50	15	15	10	25	0	90	90	Regrind	MAS003	FALSE	Packet	0.8	20K/Bag	None	hana	36	0		\N	\N	\N	\N
4872	CID2113	CAT001	ITM007	18+18+50	50	18	18	10	25	0	100	100	Regrind	MAS003	FALSE	Packet	0.8	20K/Bag	None	hana	43	0		\N	\N	\N	\N
4873	CID2113	CAT001	ITM009	23+23+50	50	23	23	10	25	0	110	110	Regrind	MAS003	FALSE	Packet	0.8	20K/Bag	None	hana	52.8	0		\N	\N	\N	\N
4874	CID2114	CAT003	ITM020	8+8+27	27	8	8	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		16.2	30		\N	\N	\N	\N
4875	CID2114	CAT003	ITM021	10+10+32	32	10	10	16	40	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		25.4	30		\N	\N	\N	\N
4876	CID2115	CAT004	ITM028	9+9+33	33	9	9	22	55	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		25.6	20		\N	\N	\N	\N
4877	CID1488	CAT001	ITM007	20+20+50	50	20	20	9.5	23	0	100	100	LLDPE	MAS003	FALSE	Packet	2	10P/Bag	None	Plain	41.4	0		\N	\N	\N	\N
4878	CID1817	CAT003	ITM021	10+10+33	33	10	10	15	37	24	60.96	60.96	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		23.9	30		\N	\N	\N	\N
4879	CID2116	CAT004	ITM027	7+7+24	24	7	7	15	37	14	35.56	35.56	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		10	20		\N	\N	\N	\N
4880	CID2116	CAT004	ITM028	9+9+33	33	9	9	20	50	18	45.72	45.72	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		23.3	20		\N	\N	\N	\N
4881	CID2116	CAT004	ITM029	16+16+46	46	16	16	25	62	20	50.8	50.8	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		49.1	20		\N	\N	\N	\N
4882	CID2013	CAT004	ITM027	9+9+28	28	9	9	15	37	16	40.64	40.64	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	Banana		13.8	20		\N	\N	\N	\N
4883	CID576	CAT003	ITM020	0	0	0	0	0	0	0	0	0	HDPE	MAS004	FALSE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4884	CID2118	CAT004	ITM027	10+10+34	34	10	10	30	75	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		37	0		\N	\N	\N	\N
4885	CID2118	CAT004	ITM028	11+11+37	37	11	11	32	80	20	50.8	50.8	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		48	0		\N	\N	\N	\N
4886	CID2118	CAT004	ITM029	13+13+40	40	13	13	32	80	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		59	0		\N	\N	\N	\N
4887	CID2118	CAT006	ITM036	45	45	0	0	5	25	0	0	0	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		0	0		\N	\N	\N	\N
4888	CID2119	CAT004	ITM027	30	30	0	0	35	175	18	45.72	45.72	LLDPE	MAS078	TRUE	Kg.	1	20K/Bag	None		48	0		\N	\N	\N	\N
4889	CID2119	CAT004	ITM028	40	40	0	0	35	175	22	55.88	55.88	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		78.2	0		\N	\N	\N	\N
4890	CID2120	CAT003	ITM019	9+9+28	28	9	9	14	35	18	45.72	45.72	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		14.7	0		\N	\N	\N	\N
4891	CID2120	CAT003	ITM020	10+10+33	33	10	10	14	35	24	60.96	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		22.6	0		\N	\N	\N	\N
4892	CID2121	CAT004	ITM028	9+9+37	37	9	9	40	100	18	45.72	45.72	LLDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		50.3	0		\N	\N	\N	\N
4893	CID2122	CAT003	ITM019	7+7+25	25	7	7	13	32	16	40.64	40.64	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		10.1	0		\N	\N	\N	\N
4894	CID2122	CAT003	ITM020	10+10+32	32	10	10	15	37	20	50.8	50.8	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		19.5	0		\N	\N	\N	\N
4895	CID2122	CAT003	ITM022	11+11+39	39	11	11	18	45	28	71.12	71.12	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	None		39	0		\N	\N	\N	\N
4897	CID2124	CAT006	ITM038	60	60	0	0	8	20	0	120	120	HDPE	MAS018	False	Roll	4	4KG/ROLL	None	Plain	0	0	Bahrain	\N	\N	\N	\N
4898	CID2124	CAT006	ITM039	45	60	0	0	8	20	0	0	0	HDPE	MAS018	False	Core	10	10KG/ROLL	None	Plain	0	0	Bahrain	\N	\N	\N	\N
4899	CID2125	CAT009	ITM045	78	78	0	0	8	40	0	96	96	LDPE	MAS001	False	Kg.	1	20K/Bag	None	Plain	0			\N	\N	\N	\N
4900	CID226	CAT003	ITM021	32+10+10	32	10	10	14	35	20	50	50	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.4	30		\N	\N	\N	\N
4901	CID226	CAT003	ITM020	32+10+10	32	10	10	14	35	20	50	50	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		25.4	30		\N	\N	\N	\N
2845	CID423	CAT002	ITM053	18+18+60	60	18	18	13	32	0	110	110	Regrind	MAS003	FALSE	Roll	0.9	20K/Bag	None	Modern Plastic Bag Factory	67.6	0	15-16 Pcs/Roll	\N	\N	\N	\N
226	CID423	CAT003	ITM021	35+10+10	35	10	10	17	42	24	60.96	60.96	HDPE	MB001	TRUE	Box	5	20K/Bag	T-Shirt w/Hook		28.2	30		\N	\N	\N	\N
4738	CID2074	CAT005	ITM033	8+8+30	30	8	8	8	20	20	100	100	HDPE	MAS005	TRUE	ROLL	0.2	10PKT	None	Modern Sources Company	11	0		\N	\N	\N	\N
4896	CID2074	CAT005	ITM033	8+8+30	30	9	9	8	20	20	100	100	HDPE	MAS005	TRUE	ROLL	0.2	10PKT	None	Modern Sources Company	11	0		\N	\N	\N	\N
223	CID423	CAT003	ITM018	21+6+6	21	6	6	10	25	16	40.64	40.64	HDPE	MB001	TRUE	Kg.	1	20K/Bag	 T-Shirt Bags		0	0		\N	\N	\N	\N
4903	CID2128	CAT010	ITM062	60	60	\N	\N	9	22.5	34	86	0	HDPE	MAS001	TRUE	ROLL	1	ROLL	None		0		with filler	\N	\N	\N	\N
4913	CID2132	CAT003	ITM021	43+12+12	43	12	12	16	40	30	76	81.28	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		407.36	30		\N	\N	\N	\N
4909	CID2131	CAT004	ITM028	30+11+11	30	11	11	24	60	16	41	41	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		255.84		Printing Silver	\N	\N	\N	\N
4910	CID2131	CAT004	ITM028	30+11+11	30	11	11	24	60	16	41	41	LLDPE	MAS003	TRUE	Kg.	1	20K/Bag	Banana		255.84		Printing Gold	\N	\N	\N	\N
4933	CID2138	CAT004	ITM028	37+8+8	37	8	8	30	75	22	56	\N	HDPE	\N	TRUE	Kg.	1	20Kg/Bag	Banana		445.20			\N	\N	\N	\N
4916	CID2134	CAT003	ITM020	30+10+10	30	10	10	14	35	18	46	46	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		161.00	30		\N	\N	\N	\N
4920	CID2135	CAT004	ITM028	30+5.5+5.5	30	5.5	5.5	35	87.5	16	41	\N		MB001	TRUE	Kg.	1	20K/Bag	T-Shirt		294.18			\N	\N	\N	\N
4938	CID2139	CAT012	ITM051	24	24	\N	\N	32	80	34	86	41	LLDPE	MAS019	TRUE	Kg.	1	20K/Bag	Banana		203.36		colour as sample 	\N	\N	\N	\N
4925	CID2136	CAT004	ITM029	49+10+10	49	10	10	35	87.5	22	56	\N	LLDPE	MB001	TRUE	Kg.	\N	20K/Bag	Banana		676.20			\N	\N	\N	\N
4930	CID2126	CAT003	ITM020	33+11+11	33	11	11	18	45	20	51	50	HDPE	MB001	TRUE	Kg.	1	20Kg/Bag	T-Shirt w/Hook		252.45			\N	\N	\N	\N
4929	CID2127	CAT003	ITM021	36+13+13	36	13	13	20	50	24	61	60	HDPE	MB001	TRUE	Kg.	1	20Kg/Bag	T-Shirt w/Hook		378.20			\N	\N	\N	\N
4928	CID2127	CAT003	ITM019	33+11+11	33	11	11	18	45	20	51	50	HDPE	MB001	TRUE	Kg.	1		T-Shirt w/Hook		252.45			\N	\N	\N	\N
4918	CID741	CAT005	ITM033	32+9+9	32	9	9	4	10	20	51	110	HDPE	MAS005	TRUE	ROLL	0.6	10Roll/Bag	None	Manal	51.00	0		\N	\N	\N	\N
4919	CID2135	CAT004	ITM027	21+5.5+5.5	21	5.5	5.5	35	87.5	16	41	\N		MB001	TRUE	Kg.	1	20K/Bag	T-Shirt		229.60			\N	\N	\N	\N
4931	CID2126	CAT003	ITM021	36+13+13	36	13	13	20	50	24	61	60	HDPE	MB001	TRUE	Kg.	1	20Kg/Bag	T-Shirt w/Hook		378.20			\N	\N	\N	\N
4915	CID2134	CAT003	ITM019	27+9+9	27	9	9	14	35	16	41	41	HDPE	MAS005	TRUE	Kg.	1	10P/Bag	T-Shirt w/Hook		129.15	30		\N	\N	\N	\N
4935	CID2139	CAT012	ITM049	29	29	0	0	32	80	16	41	41	LLDPE	MAS019	TRUE	Kg.	1	20K/Bag	Banana		203.36		colour as sample 	\N	\N	\N	\N
4914	CID2133	CAT004	ITM028	30+10+10	30	10	10	15	37.5	16	41	40.64	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		153.75	20		\N	\N	\N	\N
4936	CID2139	CAT012	ITM050	21	21	0	0	32	80	30	76	99	LLDPE	MAS019	TRUE	Kg.	1	20K/Bag	Banana		1457.28			\N	\N	\N	\N
4927	CID2098	CAT004	ITM028	25+7+7	25	7	7	32	80	18	46	\N	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		287.04			\N	\N	\N	\N
4924	CID2136	CAT004	ITM028	34+8+8	34	8	8	30	75	18	46	\N	LLDPE	MB001	TRUE	Kg.	\N	20K/Bag	Banana		345.00			\N	\N	\N	\N
4911	CID423	CAT003	ITM020	30+10+10	30	10	10	16	40	20	51	51	HDPE	MB001	TRUE	Kg.	1	20K/Bag	T-Shirt w/Hook		204.00			\N	\N	\N	\N
4921	CID2135	CAT004	ITM029	40+13+13	40	13	13	35	87.5	24	61	\N		MB001	TRUE	Kg.	1	20K/Bag	T-Shirt		704.55			\N	\N	\N	\N
4923	CID2136	CAT004	ITM027	25+7+7	25	7	7	35	87.5	14	36	\N	LLDPE	MB001	TRUE	Kg.	\N	20K/Bag	Banana		245.70			\N	\N	\N	\N
4926	CID1815	CAT008	ITM056	31	31	\N	\N	12	30	16	41	40.64	LLDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		15.1	0	Printing Qadsiah	\N	\N	\N	\N
4917	CID1456	CAT010	ITM062	57	57	\N	\N	8	20	34	86	0	HDPE	MAS001	TRUE	ROLL	25	ROLL	None		39.4	0	ROLL	\N	\N	\N	\N
2996	CID1304	CAT001	ITM006	50+12+12	50	12	12	10	25	0	95	95	Regrind	MAS004	No	PKT	1.6	50Pcs/P x 5P/Bag	None	Best	351.50	0	1600 Grams	5	8.00	\N	\N
3670	CID1304	CAT001	ITM009	50+23+23	50	23	23	9	22.5	0	110	110	Regrind	MAS003	No	PKT	1.08	25Pcs/P x 8P/Bag	None	Best	475.20	0		8	8.64	\N	\N
4016	CID1304	CAT002	ITM011	0	0	0	0	0	0	0	0	0	HDPE	MAS005	No	Roll	0.45	24R/Bag	None	Best	0	0		24	10.80	\N	\N
3468	CID1304	CAT002	ITM013	0	0	0	0	0	0	0	0	0	HDPE	MAS079	No	Roll	0.45	24R/Bag	None	Best	0	0		24	10.80	\N	\N
2647	CID1304	CAT005	ITM035	31+7+7	31	7	7	3.5	8.75	20	51	110	HDPE	MAS005	Yes	ROLL	0.4	15Pcs/R x 20P/Bag	None	Best	40.16	0	407Grams/P	20	8.00	\N	\N
3959	CID1304	CAT005	ITM106	34+8+8	34	8	8	15	37.5	0	110	110	LLDPE	MAS004	No	ROLL	1.05	12P/Bag	None	Best	412.50	0		12	12.60	\N	\N
2648	CID1304	CAT005	ITM035	31+7+7	31	7	7	3.5	8.75	20	51	110	HDPE	MAS005	TRUE	ROLL	0.55	15Pcs/R x 12P/Bag	None	Best	40.16	0	542 Grams/P	12	6.60	\N	\N
2650	CID1304	CAT001	ITM005	40+12+12	40	12	12	10	25	0	85	85	Regrind	MAS003	FALSE	PKT	0.65	25Pcs/P x 8P/Bag	None	Best	272.00	0	620 Grams	8	5.20	\N	\N
4902	CID2128	CAT010	ITM046	60	60	0	0	9	22.5	34	86	85	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	None		0		with filler	\N	\N	\N	\N
4922	CID2040	CAT004	ITM028	28+8+8	28	8	8	18	45	18	46	35.56	HDPE	MAS001	TRUE	Kg.	1	20K/Bag	Banana		182.16	20		\N	\N	\N	\N
3412	CID1995	CAT010	ITM046	60	60	0	0	25	62.5	36	91	91.44	HDPE	MB001	TRUE	Kg.	1	20K/Bag	None		137.2	0		\N	\N	\N	\N
3053	CID2054	CAT005	ITM111	30+10+10	30	10	10	3.5	8.75	\N	\N	110	HDPE	MAS005	No	PKT	0.88	90Pcs/6ROLL  x 18P	None	ALKARAM	96.25	0		18	15.84	\N	\N
4912	CID2132	CAT003	ITM020	33+10+10	33	10	10	16	40	24	61	60.96	HDPE	MAS005	TRUE	Kg.	1	20K/Bag	T-Shirt		258.64	30	Green Printing 	\N	\N	\N	\N
4932	CID2126	CAT005	ITM111	30+10+10	30	10	10	12	30	14	36	110	HDPE	MB001	TRUE	ROLL	1	20R/Bag	None	Plain	108.00			\N	\N	\N	\N
3469	CID1304	CAT006	ITM036	50	50	0	0	7	17.5	0	110	110	HDPE	MAS005	No	ROLL	1.1	30Pcs/R x 12R/Bag	None	Best	38.5	0	39 grms/Pc.	12	13.20	\N	\N
4939	CID2074	CAT005	ITM034	45+8+8	45	8	8	14	35	\N	\N	\N	HDPE	MAS108	No	ROLL	4	ROLL	None		85.40			1	4.00	\N	\N
4940	CID2074	CAT005	ITM035	45+8+8	45	8	8	14	35	\N	\N	0	HDPE	MAS108	No	ROLL	4		None		0			1	4.00	\N	\N
4942	CID2140	CAT008	ITM072	22	22	\N	\N	12	30	14	36	\N	LLDPE	MAS001	Yes	Kg.	1	20K/Bag			51.84			\N	\N	\N	\N
4943	CID2074	CAT002	ITM011	1+1+1	1	1	1	10	25	\N	\N	1	HDPE	MAS003	No	ROLL	1	10PKT		\N	\N	\N	\N	10	10.00	\N	\N
4944	CID2142	CAT001	ITM006	50+18+18	50	18	18	11	27.5	\N	\N	100	Regrind	MAS003	No	PKT	1.6	10P/Bag	None		379.26	0		10	16.00	\N	\N
4945	CID1596	CAT003	ITM019	28+9+9	28	9	9	13	32.5	18	46	46	HDPE	MAS005	Yes	Kg.	1	20K/Bag	T-Shirt	\N	137.54	0	\N	20	20.00	\N	\N
2764	CID1344	CAT003	ITM019	29+9+9	29	9	9	14	35	18	46	45.72	HDPE	MAS005	Yes	Kg.	1	20K/Bag	T-Shirt w/Hook		151.34	30		20	20.00	\N	\N
2985	CID1344	CAT006	ITM036	50	50	0	0	5	12.5	20	51	100	HDPE	MAS005	Yes	Kg.	1	20K/Bag	None		25	0		20	20.00	\N	\N
4947	CID2143	CAT004	ITM027	27+8+8	27	8	8	35	87.5	18	46	46	LLDPE	MAS001	Yes	Kg.	1	20K/Bag	Banana	\N	346.15	\N	\N	20	20.00	\N	\N
4948	CID2144	CAT006	ITM037	55	55	0	0	8	20	\N	\N	110	HDPE	MB001	Yes	ROLL	1	ROLL	None	\N	\N	\N	\N	20	20.00	\N	\N
4949	CID2145	CAT004	ITM028	31+10+10	31	10	10	20	50	20	51	51	HDPE	MB001	No	Kg.	1	20K/Bag	T-Shirt	\N	260.1	\N	\N	20	20.00	\N	\N
3957	CID1180	CAT005	ITM033	32+9+9	32	9	9	3.5	8.75	20	51	110	HDPE	MAS108	Yes	PKT	0.8	20K/Bag	None	Baity	44.63	0	5 ROLL	20	16.00	\N	\N
4420	CID1180	CAT007	ITM041	20	20	0	0	10	25	\N	\N	27	LLDPE	MAS001	No	PKT	0.4	40P/Bag	None	Baity	0	0		40	16.00	\N	\N
4422	CID1180	CAT007	ITM043	30	30	0	0	10	25	\N	\N	45	LLDPE	MAS001	No	PKT	0.4	40P/Bag	None	Baity	0	0		38	15.20	\N	\N
4950	CID1180	CAT001	ITM007	50+15+15	50	15	15	9	22.5	\N	\N	100	Regrind	MAS002	No	PKT	0.8	25P/Bag	None	baity	\N			25	20.00	\N	\N
3372	CID1566	CAT005	ITM033	32+9+9	32	9	9	3.5	8.75	20	51	110	HDPE	MAS005	Yes	PKT	0.8	12PKT/Bag	None	Assel	44.63	0		12	9.60	\N	\N
3580	CID1566	CAT001	ITM005	40+12+12	40	12	12	8	20	\N	\N	80	Regrind	MAS003	No	PKT	0.8	12P/Bag	None	Aseel	204.8	0		12	9.60	\N	\N
4951	CID423	CAT002	ITM053	50+23+23	50	23	23	13	32.5	\N	\N	109	Regrind	MAS003	No	Kg.	0.9	20K/Bag	None	Modern Plastic Bag Factory	675.84	0	15-16 Pcs/Roll	20	18.00	\N	\N
4952	CID2146	CAT004	ITM028	36+9+9	36	9	9	30	75	18	46	45	HDPE	MAS001	Yes	Kg.	1	20K/Bag	Banana	\N	372.6	\N	\N	20	20.00	\N	\N
4953	CID969	CAT002	ITM011	28+10+10	28	10	10	13	32.5	\N	\N	70	HDPE	MB001	No	ROLL	0.9	\N	None	\N	\N	\N	\N	20	18.00	\N	\N
4954	CID969	CAT003	ITM020	20	20	0	0	10	25	20	51	100	HDPE	MB001	Yes	Kg.	1	20Kg/Bag	None	\N	\N	\N	\N	20	20.00	\N	\N
4968	CID2152	CAT009	ITM045	35	35	0	0	40	100	\N	\N	133	LLDPE	MAS001	No	Kg.	1	20K/Bag	None	\N	\N	\N	\N	20	20.00	\N	\N
4956	CID2148	CAT010	ITM046	52+16+16	52	16	16	24	60	\N	\N	120	HDPE	MB001	No		1	20K/Bag	None	\N	\N	\N	\N	20	20.00	\N	\N
4957	CID2148	CAT010	ITM046	52+16+16	52	16	16	24	60	\N	\N	120	HDPE	MAS018	No		1	20K/Bag	None	\N	\N	\N	\N	20	20.00	\N	\N
4958	CID2148	CAT010	ITM046	52+16+16	52	16	16	24	60	\N	\N	120	HDPE	MAS022	No		1	20K/Bag	None	\N	\N	\N	\N	20	20.00	\N	\N
4969	CID1474	CAT004	ITM026	24	24	0	0	10	25	16	41	41	LLDPE	MAS001	Yes	Kg.	1	20K/Bag	Banana	\N	6.7	20	\N	20	20.00	\N	\N
4959	CID2149	CAT003	ITM019	26+9+9	26	9	9	20	50	18	46	0	HDPE	MAS003	Yes	Kg.	1	20K/Bag	T-Shirt w/Hook		202.4			20	20.00	\N	\N
4962	CID2149	CAT003	ITM021	33+12+12	33	12	12	20	50	22	56	0	HDPE	MAS003	Yes	Kg.	1	20K/Bag	T-Shirt w/Hook	\N	319.2	\N	\N	20	20.00	\N	\N
4963	CID2150	CAT004	ITM029	35+10+10	35	10	10	32	80	20	51	50	LLDPE	MAS001	Yes	Kg.	1	20K/Bag	Banana		448.8			20	20.00	\N	\N
4964	CID486	CAT003	ITM018	20+7+7	20	7	7	12	30	16	41	41	HDPE	MAS005	Yes	Kg.	1	20K/Bag	None	\N	83.64	0	\N	20	20.00	\N	\N
4965	CID2139	CAT012	ITM051	19	19	0	0	32	80	\N	\N	79	HDPE	MAS001	No	Kg.	1	20K/Bag	None	\N	1457.28	\N	\N	20	20.00	\N	\N
4955	CID2147	CAT008	ITM044	50+15+15	50	15	15	50	125	39	99	100	LLDPE	MAS034	Yes	Peace	0.22	50peice/bag	None		1980		Film Color As Sample And Printing Color As Sample Check  Office لون الطباعة ولون الفلم مثل العينات 	50	11.00	\N	\N
4966	CID2151	CAT003	ITM021	30+11+11	30	11	11	15	37.5	24	61	60	HDPE	MB001	Yes	Kg.	1	20Kg/Bag	T-Shirt w/Hook	\N	237.9	\N	\N	20	20.00	\N	\N
4967	CID2151	CAT006	ITM036	50	50	0	0	7	17.5	20	51	140	HDPE	MB001	Yes	Kg.	1	20Kg/Bag	None	\N	187.57	\N	\N	20	20.00	\N	\N
4067	CID886	CAT004	ITM029	35+9+9	35	9	9	22	55	18	46	45.72	HDPE	MAS005	Yes	Kg.	1	20K/Bag	Banana		268.18	20		20	20.00	\N	\N
2953	CID2054	CAT005	ITM111	30+10+10	30	10	10	3.5	8.75	\N	\N	110	HDPE	MAS005	Yes	PKT	0.6	65Pcs/4ROLL x 20P	None	ALKARAM	96.25	0		20	12.00	\N	\N
4970	CID2155	CAT003	ITM020	27+9+9	27	9	9	14	35	20	51	51	HDPE	MB001	Yes	Kg.	1	20K/Bag	T-Shirt w/Hook	\N	160.65	\N	\N	20	20.00	\N	\N
4972	CID2157	CAT003	ITM020	30+11+11	30	11	11	30	75	20	51	70	LLDPE	MAS001	Yes	Kg.	1	20K/Bag	Banana	\N	397.8	\N	\N	20	20.00	\N	\N
4973	CID2158	CAT004	ITM028	30+8+8	30	8	8	33	82.5	18	46	46	HDPE	MAS001	Yes	Kg.	1	20K/Bag	Banana	\N	349.14	\N	\N	20	20.00	\N	\N
4974	CID2159	CAT004	ITM029	44+15+15	44	15	15	30	75	18	46	46	LLDPE	MAS001	Yes	Kg.	1	20K/Bag	Banana	\N	510.6	\N	\N	20	20.00	\N	\N
4975	CID2160	CAT003	ITM021	44+15+15	44	15	15	30	75	18	46	46	LLDPE	MAS001	Yes	Kg.	1	20K/Bag	Banana	\N	510.6	\N	\N	1	1.00	\N	\N
4295	CID1900	CAT003	ITM023	40+13+13	40	13	13	60	150	28	71	71.12	LLDPE	MAS005	Yes	Kg.	1	20K/Bag	T-Shirt		1405.8	30		20	20.00	\N	\N
4976	CID1900	CAT003	ITM024	45+14+14	45	14	14	60	150	32	81	71.12	LLDPE	MAS005	Yes	Kg.	1	20K/Bag	T-Shirt		1773.9	30		20	20.00	\N	\N
4977	CID2161	CAT003	ITM018	20	20	0	0	12	30	8	20	30	HDPE	MAS001	Yes	Kg.	1	20K/Bag	Banana	ALKARAM	\N	0	0	20	20.00	\N	\N
4978	CID2161	CAT003	ITM019	26.5	26.5	0	0	12	30	14	36	35	HDPE	\N	No	Kg.	1	20K/Bag	Banana	ALKARAM	\N	\N	\N	1	1.00	\N	\N
4859	CID1927	CAT003	ITM020	32+11+11	32	11	11	15	37.5	20	51	51	HDPE	MAS001	Yes	Kg.	1	20K/Bag	T-Shirt w/Hook		206.55	30	\N	20	20.00	\N	\N
4980	CID2163	CAT004	ITM021	40+10+10	40	10	10	22	55	24	61	61	HDPE	MAS001	Yes	Kg.	1	20K/Bag	Banana		402.6	\N	\N	1	1.00	/assets/cliche-front-1753162708031.jpg	/assets/cliche-back-1753162708600.jpg
4982	CID2163	CAT004	ITM027	22+7+7	22	7	7	21	52.5	16	41	41	HDPE	MAS001	Yes	Kg.	1	20K/Bag	Banana	ALKARAM	154.98	\N	\N	20	20.00	\N	\N
4983	CID2164	CAT004	ITM027	24+8+8	24	8	8	13	32.5	16	41	41	HDPE	MB001	Yes	Kg.	10	10	T-Shirt w/Hook	\N	106.6	\N	\N	1	10.00	\N	\N
4984	CID2165	CAT010	ITM046	60	60	0	0	9	22.5	\N	\N	0	HDPE	MAS001	No	ROLL	20	ROLL	None	\N	\N	\N	MORE FILLER	1	20.00	\N	\N
4985	CID2166	CAT010	ITM046	60	60	0	0	9	22.5	36	91	90	HDPE	MAS001	Yes	Kg.	1	20K/Bag	None	\N	\N	\N	MORE FILLER	20	20.00	\N	\N
4986	CID2166	CAT010	ITM062	60	60	0	0	9	22.5	36	91	90	HDPE	MAS001	Yes	ROLL	20	ROLL	None	\N	\N	\N	MORE FILLER	1	20.00	\N	\N
4979	CID2153	CAT003	ITM021	10	10	\N	\N	10	25	\N	\N	51	HDPE	MB001	No	Kg.	1	20K/Bag	T-Shirt		\N	\N	\N	20	20.00	/assets/cliche-front-1753126330371.pdf	/assets/cliche-back-1753126271168.png
4981	CID2163	CAT004	ITM028	35+10+10	35	10	10	22	55	20	51	51	HDPE	MAS001	Yes	Kg.	1	20K/Bag	Banana		308.55	\N	\N	20	20.00	/assets/cliche-front-1753161679787.jpg	/assets/cliche-back-1753162011384.jpg
4907	CID2130	CAT009	ITM028	30	30	\N	\N	12	30	14	36	35	LLDPE	MAS064	No	Kg.	1	20K/Bag			0	\N	\N	\N	\N	\N	\N
4987	CID2130	CAT009	ITM075	36+10+10	36	10	10	25	62.5	16	41	41	LLDPE	MAS001	Yes		20	10	Banana	\N	287	\N	\N	1	20.00	\N	\N
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customers (id, name, code, name_ar, user_id, plate_drawer_code) FROM stdin;
CID001	2000 Center	CID001	مركز 2000	0U38	A-30
CID002	Safi Trading Establishment	CID002	مؤسسة صافي التجارية	0U38	B-61
CID003	Saae Carwash	CID003	Saae غسيل السيارات	0U38	F-17
CID004	Quraish	CID004	قريش	0U26	null
CID005	Qutbah Charcoal	CID005	قطبة فحم	0U38	E-8
CID006	Moon Light	CID006	ضوء القمر	0U38	A-44
CID007	3S Shoes	CID007	أحذية 3S	0U38	B-11
CID008	621 Shopping Center	CID008	621 مركز تسوق	0U38	E-43
CID009	A.A. Aqeel Trading Center (ATE)	CID009	مركز عقيل التجاري (ATE)	0U38	B-47
CID010	A. Ghani Hauti Couture	CID010	أ. غني هوتي كوتور	0U38	B-30
CID011	Abayat	CID011	عبايات	0U38	B-22
CID012	Abayat Al-Hijhab Al-Aswad	CID012	عباية الحجاب الأسود	0U38	D-35
CID013	Abayat Al-Manae	CID013	عبايات المناعي	0U38	A-66
CID014	Abayat Al-Namer	CID014	عبايات النمر	0U38	A-26
CID015	Abayat Al-Nemra	CID015	عبايات النمرة	0U38	A-62
CID016	Abayat Anmol	CID016	عبايات عنمول	0U38	null
CID017	Abayat Remas	CID017	عبايات رماس	0U38	B-22
CID018	Abdul Hamid Zainal Trading Est.	CID018	مؤسسة عبد الحميد زينل التجارية	0U38	D-34
CID019	Abdul Khaliq Est.	CID019	مؤسسة عبد الخالق	0U38	B-24
CID020	Abdul Salam	CID020	عبد السلام	0U38	null
CID021	Abdullah Fauad Pharmacy	CID021	صيدلية عبدالله فؤاد	0U38	B-25
CID022	Abdullah Saleh Trading Est.	CID022	مؤسسة عبدالله صالح التجارية	0U38	B-46
CID023	Abna Al-Deera	CID023	أبنة الديرة	0U38	D-0
CID024	Abood Ahmad Baasem	CID024	عبود أحمد باعم	0U38	A-34
CID025	Abu Al-Noor	CID025	أبو النور	0U38	B-4
CID026	Abu Al-Saud Al-Ahab	CID026	أبو السعود الأهب	0U38	E-35
CID027	Abu Al-Saud For Electrical Materials	CID027	أبو السعود للمواد الكهربائية	0U38	D-0
CID028	Abusrau	CID028	أبو سرو	0U38	A-72
CID029	ADANAN	CID029	أدنان	0U38	C-34
CID030	Adawliah	CID030	عدولية	0U38	A-50
CID031	ADCO	CID031	أدكو	0U38	F-6
CID032	Adel Al-Ghareeb	CID032	عادل الغريب	0U38	B-26
CID033	Adnok Carwash (AD)	CID033	أدنوك لغسيل السيارات (AD)	0U38	E-16
CID034	AFI	CID034	AFI	0U38	A-60
CID035	Afrahiya Lil-Jalabiyat	CID035	أفراحية ليل جلبيات	0U38	A-66
CID036	Ahlya Remosh	CID036	الأهلية ريموش	0U38	B-66
CID037	Ahmad G. Al-Ghamdi (AGG)	CID037	أحمد غ. الغامدي (AGG)	0U38	A-28
CID038	Ahmad Saad (Busaad Plastic)	CID038	أحمد سعد (بوسعد بلاستيك)	0U38	D-3
CID039	Ahmed Libnani	CID039	أحمد لبناني	0U38	A-60
CID040	Ahram	CID040	الأهرام	0U26	D-11
CID041	Ahzia Shoes	CID041	أحذية اهزيا	0U38	B-57
CID042	Aitha S. Al-Seaari Trading	CID042	آيثاء صالح السعيري للتجارة	0U38	E-20
CID043	Ajami Restaurant	CID043	مطعم عجمي	0U38	B-10
CID044	Alam Al-Jadeed Exchange	CID044	عالم الجديد للصرافة	0U38	A-66
CID045	Alam Al-Tawfeer	CID045	عالم التوفير	0U38	B-9
CID046	Alam Atha	CID046	عالم آثا	0U38	C-22
CID047	Alam Mazaya	CID047	عالم مزايا	0U38	C-13
CID048	ALAMCO (Malaz Brand)	CID048	ألامكو (ماركة الملاز)	0U38	B-60
CID049	Alfanater Hospital	CID049	مستشفى الفناتر	0U38	A-49
CID050	Alfar	CID050	الفار	0U38	B-17
CID051	Ali Fashions	CID051	أزياء علي	0U38	E-44
CID052	Ali Saad Ali Qahtani	CID052	علي سعد علي القحطاني	0U38	C-24
CID053	Alia Restaurant	CID053	مطعم علياء	0U38	B-26
CID054	Alibaba Restaurant	CID054	مطعم علي بابا	0U38	B-19
CID055	Alins Coffee	CID055	قهوة ألينس	0U38	A-77
CID056	Almira Optics	CID056	الميرا للبصريات	0U38	B-5
CID057		CID057		0U38	E-33
CID058	Alukaizoom Al-Namoodiya	CID058	العقيزوم النامودية	0U38	A-78
CID059		CID059		0U38	E-46
CID060	Ameen Center	CID060	مركز أمين	0U38	B-18
CID061	Ameri Center	CID061	المركز العامري	0U38	B-18
CID062	Amrou Al-Atour Ferfumes	CID062	عمرو العطور Ferfumes	0U38	D-28
CID063	Annual Charity Run	CID063	السباق الخيري السنوي	0U38	A-20
CID064	Hezaa	CID064	هزاع	0U38	B-20
CID065	Bazar	CID065	بازار	0U38	B-27
CID066	Anwar Al-Basim Shoes	CID066	أحذية أنور البسم	0U26	D-25
CID067	Anwar Al-Fahad	CID067	أنور الفهد	0U38	A-18
CID068	Anwar Al-Safeer	CID068	أنور السفير	0U38	A-6
CID069	Anowar Al-Tahany	CID069	أنوار الطحاني	0U26	E-5
CID070	Anyah	CID070	أنيا	0U38	A-16
CID071	Apex Auto Parts1	CID071	قطع غيار السيارات أبيكس1	0U38	B-4
CID072	Apple	CID072	تفاح	0U38	B-66
CID073	Arab National Bank	CID073	البنك العربي الوطني	0U38	B-12
CID074	Arabian Center	CID074	المركز العربي	0U38	D-15
CID075	Arabian Food Supply	CID075	التوريد الغذائي العربي	0U38	A-14
CID076	Arabic Readymade Textiles	CID076	المنسوجات العربية الجاهزة	0U38	C-21
CID077	Arab Trading Company	CID077	الشركة العربية للتجارة	0U38	E-24
CID078	Aran	CID078	اران	0U38	B-35
CID079	Arif Center	CID079	مركز عارف	0U38	E-1
CID080	Armed Forces Hospital	CID080	مستشفى القوات المسلحة	0U38	F-8
CID081	Arusha Restaurant	CID081	مطعم أروشا	0U38	D-25
CID082	Asawer Al-Sharq	CID082	أساوير الشرق	0U38	F-8
CID083	ASDAF	CID083	أصداف	0U38	E-2
CID084	Asef	CID084	آصف	0U38	A-10
CID085	ASH First Shoes	CID085	حذاء ASH فيرست	0U38	D-4
CID086	ASK Varied Foods	CID086	اسأل الأطعمة المتنوعة	0U38	A-6
CID087	ASMA	CID087	أسماء	0U38	D-5
CID088	Assamar Charcoal	CID088	فحم أسمر	0U38	A-67
CID089	Assel Exhibition	CID089	معرض أسيل	0U38	D-4
CID090	Assel Textiles	CID090	أسيل للمنسوجات	0U38	A-44
CID091	Assorte	CID091	متنوعة	0U38	B-17
CID092	Astoon	CID092	أستون	0U38	B-8
CID093	Aswar Al-Mandi	CID093	أسوار المندي	0U38	A-29
CID094	ATC	CID094	ATC	0U38	B-46
CID095	ATE	CID095	اكلت	0U38	B-47
CID096	Athwaq	CID096	أثواق	0U38	B-18
CID097	Atlantic Systems	CID097	أنظمة الأطلسي	0U38	B-69
CID098	Atwi Trading Est.	CID098	مؤسسة عطوي للتجارة	0U38	F-6
CID099	Atyaf Dubai Center	CID099	أطياف دبي سنتر	0U38	B-10
CID100	Awad	CID100	عوض	0U38	B-26
CID1000	Chandeliers	CID1000	الثريات	0U39	null
CID1001	Enarat	CID1001	إينارات	0U39	null
CID1002	Ten Over Ten	CID1002	عشرة على عشرة	0U26	F-19
CID1003	Rise Crome	CID1003	رايز كروم	0U38	E-12
CID1004	IPA	CID1004	IPA	0U38	null
CID1005	Awali For Foodstuff W.L.L.	CID1005	شركة أولي للمواد الغذائية ذ.م.م	0U38	F-20
CID1006	Biomet	CID1006	بيوميت	0U26	F-26
CID1007	Baba Nor	CID1007	بابا نور	0U26	F-43
CID1008	Levis Jeans	CID1008	ليفيس جينز	0U38	E-13
CID1009	Elegant Wave Trading Est. Br.	CID1009	مؤسسة الموجات الأنيقة للتجارة Br.	0U26	F-43
CID101	Awael Ebayat (First Shoe)	CID101	عوائل عبيات (الحذاء الأول)	0U38	F-26
CID1010	Chili Restaurant	CID1010	مطعم تشيلي	0U26	F-15
CID1011	Shark Center	CID1011	مركز القرش	0U26	D-17
CID1012	Bayuni Center	CID1012	مركز بيوني	0U26	F-43
CID1013	K-12	CID1013	ك -12	0U26	A-73
CID1014	Faham Al-Bahoor	CID1014	فهام الباهور	00U2	A-42
CID1015	Ferruci	CID1015	فيروسي	00U8	D-34
CID1016	Atheeb	CID1016	عذيب	0U26	F-43
CID1017	Golden Janadriah Est.	CID1017	مؤسسة الجنادرية الذهبية.	0U38	F-43
CID1018	Kono Pizza	CID1018	بيتزا كونو	0U38	A-73
CID1019	Cam4Sell	CID1019	Cam4Sell	0U39	F-43
CID102	Awal Plastic Factory	CID102	مصنع أوال للبلاستيك	0U38	E-15
CID1020	Jinoob Perfume	CID1020	عطر جنوب	0U26	B-53
CID1021	Romaizan Diamond	CID1021	رميزان دايموند	0U38	F-42
CID1022	Safeena	CID1022	صفينا	0U38	D-18
CID1023	Hyper Top	CID1023	هايبر توب	0U26	F-43
CID1024	Nukbah Selection	CID1024	اختيار النكبة	00U8	F-40
CID1025	Beef O Bradys	CID1025	لحم بقري أو براديس	0U26	E-13
CID1026	Asmai Bookstore	CID1026	مكتبة أسماي	0U39	F-40
CID1027	Jouz Sweets	CID1027	حلويات جوز	0U26	F-18
CID1028	Atlas Capco	CID1028	أطلس كابكو	0U26	F-20
CID1029	Awal Pharmacy	CID1029	صيدلية أوال	0U38	B-25
CID103	Awaridh Liltajmeel	CID103	عوريد ليلتاجميل	0U38	A-40
CID1030	City Style	CID1030	ستايل المدينة	00U8	A-25
CID1031	Elia Restaurant	CID1031	مطعم إيليا	0U26	B-26
CID1032	Wardo Kabab	CID1032	وردو كباب	0U38	null
CID1033	Saad Commercial	CID1033	سعد التجاري	0U38	F-38
CID1034	Mulhim	CID1034	موليم	0U26	A-34
CID1035	Top Bags	CID1035	أعلى الحقائب	0U38	F-40
CID1036	Frederic M	CID1036	فريدريك م	0U39	F-40
CID1037	Papa Mojanati Restaurants	CID1037	مطاعم بابا موجاناتي	0U39	F-40
CID1038	Mona	CID1038	مونا	0U38	A-34
CID1039	Shams Al-Madina Trad. Est.	CID1039	شمس المدينة طراد. مؤسسه.	00U8	A-38
CID104	Awael Al-Itor	CID104	عائل العطور	0U38	A-17
CID1040	Chantek	CID1040	شانتيك	00U8	F-38
CID1041	Luluat Al-Rafidin Restaurant	CID1041	مطعم لولوات الرافدين	0U38	A-62
CID1042	Bab Al-Khaer	CID1042	باب الخير	00U8	null
CID1043	My Home & I	CID1043	بيتي وأنا	00U8	null
CID1044	Gulf Nuts and Sweets Center	CID1044	مركز الخليج للمكسرات والحلويات	00U8	F-46
CID1045	Chocolate	CID1045	شكولاته	00U8	F-48
CID1046	Siddiq	CID1046	صديق	0U38	F-39
CID1047	Black Star	CID1047	النجم الأسود	0U38	F-14
CID1048	Rafghad	CID1048	رفغد	0U26	null
CID1049	Cyber City	CID1049	سايبر سيتي	0U26	D-34
CID105	Ayshana Foods	CID105	عائشانا للأغذية	0U38	A-79
CID1050	Scholl	CID1050	شول	00U8	F-42
CID1051	Munif Trading Center	CID1051	مركز منيف التجاري	00U8	F-42
CID1052	TRAD	CID1052	طراد	00U8	F-42
CID1053	Najoom Paris Perfume	CID1053	عطر نجوم باريس	00U8	null
CID1054	Ali A. Al-Hashim Trading Est.	CID1054	مؤسسة علي عبدالرحمن الهاشم التجارية.	00U8	F-42
CID1055	Sea Meal	CID1055	وجبة البحر	00U8	A-79
CID1056	Parts World Est.	CID1056	مؤسسة بارتس وورلد	00U8	null
CID1057	RT Sports	CID1057	RT الرياضة	00U8	F-14
CID1058	Magistic Pillow	CID1058	وسادة ماجيستيك	0U38	null
CID1059	Cateus	CID1059	كاتيوس	00U8	D-28
CID106	Azizia (VMC)	CID106	عزيزية (VMC)	0U38	B-20
CID1060	Taiba Center	CID1060	طيبة سنتر	0U26	B-74
CID1061	Nahda Restaurant	CID1061	مطعم النهدة	0U39	F-45
CID1062	Afghani	CID1062	أفغاني	0U26	null
CID1063	Naeem Pastry & Grill	CID1063	نعيم المعجنات والمشاوي	0U38	F-35
CID1064	Khaled A. Al-Mulhim & Bros Co.	CID1064	شركة خالد عبدالرحمن الملحم وإخوانه	00U8	F-45
CID1065	V VIV	CID1065	في فيف	0U39	null
CID1066	Luluat	CID1066	اللؤلوات	0U38	A-66
CID1067	Alwan Baraka	CID1067	ألوان بركة	0U26	B-10
CID1068	Awany Al-Nawraj	CID1068	عواني النوراج	0U38	F-37
CID1069	Ahali Sandwiches	CID1069	سندويتشات الأهالي	0U38	F-35
CID107	Baby Bancy	CID107	بيبي بانسي	0U38	B-31
CID1070	Burger House	CID1070	برجر هاوس	0U39	A-51
CID1071	Badeel	CID1071	بديل	00U8	null
CID1072	Masala Restaurant	CID1072	مطعم ماسالا	0U38	F-15
CID1073	Jubail Guest Palace Restaurant	CID1073	مطعم جبيل جيست بالاس	0U38	null
CID1074	Zaiyan	CID1074	زيان	0U26	null
CID1075	Hailah Mushabab Lejhar Trad. Center	CID1075	هيلة مشباب لجار طراد. مركز	0U26	F-35
CID1076	Zainabia	CID1076	زينبيا	00U2	null
CID1077	Sweet Village	CID1077	القرية الحلوة	0U38	F-35
CID1078	Gourmet Bakers & Sweets	CID1078	جورميه بيكرز آند سويتس	0U26	F-18
CID1079	Diamond Soft Tissue	CID1079	المناديل الناعمة الماسية	0U38	D-28
CID108	Badariya Charcoal	CID108	فحم البدارية	0U38	E-8
CID1080	Radan	CID1080	رادان	00U8	F-38
CID1081	Charleys Grilled Subs	CID1081	تشارليز جوبس مشوي	0U38	F-37
CID1082	Sultan Grill	CID1082	سلطان جريل	0U38	F-37
CID1083	Little Caesars	CID1083	القياصرة الصغار	0U38	F-37
CID1084	My House	CID1084	منزلي	0U38	F-37
CID1085	Cherokee	CID1085	شيروكي	0U26	A-23
CID1086	DFC	CID1086	DFC	0U26	null
CID1087	Rav	CID1087	راف	00U8	A-20
CID1088	BNB	CID1088	BNB	0U26	null
CID1089	Joker	CID1089	جوكر	00U8	A-21
CID109	Badeea Charcoal	CID109	باديع فحم	0U38	E-8
CID1090	Arabian Expert	CID1090	الخبير العربي	0U38	F-45
CID1091	Abu Al-Ainen	CID1091	أبو العينين	0U38	B-37
CID1092	Basmati	CID1092	بسمتي	0U38	B-8
CID1093	Haseer Restaurant	CID1093	مطعم حصير	0U38	F-37
CID1094	Injee Restaurant	CID1094	مطعم إنجي	0U38	F-19
CID1095	Barwaz	CID1095	برواز	0U38	F-45
CID1096	Good Morning Sunrise	CID1096	صباح الخير شروق الشمس	0U26	D-0
CID1097	Jinan Car Wash	CID1097	جينان غسيل السيارات	0U38	B-21
CID1098	Handor Abdullah Al-Asmari Trading Est.	CID1098	مؤسسة هاندور عبدالله الأسمري التجارية	0U26	null
CID1099	Jazeera World	CID1099	عالم الجزيرة	0U38	D-28
CID110	Badghaish	CID110	بادغيش	0U38	A-5
CID1100	Cake And Bake	CID1100	كيك اند بيك	0U38	F-42
CID1101	Flaafel Time	CID1101	وقت فلافل	0U38	null
CID1102	Shoala Restaurant	CID1102	مطعم شعلة	0U38	F-45
CID1103	Nelly Restaurant	CID1103	مطعم نيللي	0U38	F-35
CID1104	Dewany Restaurant	CID1104	مطعم ديواني	0U38	B-65
CID1105	Tasnee	CID1105	التصنيع	0U38	E-2
CID1106	Trath Al-Sharq	CID1106	تراث الشرق	0U26	A-66
CID1107	Qalet Al-Anod Restaurant	CID1107	مطعم قلعة العنود	00U8	F-39
CID1108	Azhar Al-Rabi Co. 8	CID1108	شركة أزهر الربيع 8	00U8	A-39
CID1109	Saeed Fakher Trading Co.	CID1109	شركة سعيد فاخر التجارية	0U38	E-30
CID111	Bahrain Center	CID111	مركز البحرين	0U38	E-18
CID1110	Adam Broasted	CID1110	آدم بروست	0U38	F-37
CID1111	Lebanese Oven	CID1111	فرن لبناني	0U38	A-1
CID1112	Kemya	CID1112	كيميا	0U26	E-2
CID1113	Fatyat	CID1113	فتيات	0U38	B-12
CID1114	Gozor Al-Tabeyah	CID1114	جذور الطابية	0U26	B-65
CID1115	Basamat Dental Clinics	CID1115	عيادات بسامات لطب الأسنان	0U26	null
CID1116	Ahmad Shisha	CID1116	أحمد الشيشة	00U8	null
CID1117	Qassar Al-Thaqfidhat	CID1117	قصار الثقفيذات	0U26	F-47
CID1118	Jazeera Bakery	CID1118	مخبز الجزيرة	0U38	F-36
CID1119	Talabiat Metal Surface Treatment Factory	CID1119	مصنع طلبات معالجة الأسطح المعدنية	0U26	null
CID112	Baidan Mutton Cubes	CID112	مكعبات لحم ضأن بيدان	0U38	A-77
CID1120	Shehab	CID1120	شهاب	0U38	null
CID1121	Lilac Restaurant	CID1121	مطعم ليلك	0U38	F-37
CID1122	Gama Hospital	CID1122	مستشفى جاما	0U26	B-8
CID1124	Tamrya	CID1124	تامريا	0U38	F-37
CID1125	Aradi Supermarket	CID1125	أرادي سوبر ماركت	00U2	null
CID1126	Shawate Al-Khaleej	CID1126	شوات الخليج	0U38	F-36
CID1127	Tamayouz	CID1127	التميز	0U38	null
CID1128	Protesto	CID1128	بروتستو	0U38	F-37
CID1129	Jamalalbuyoot	CID1129	جمال البويوت	0U38	E-17
CID113	baihagi Bank Alikbar	CID113	بنك البيهاجي الإكبار	0U38	D-36
CID1130	Khusheim Industrial Equipment Co.	CID1130	شركة خوشيم للمعدات الصناعية	0U26	E-34
CID1131	Kalemat	CID1131	كلمات	00U8	F-38
CID1132	Future For Toys	CID1132	مستقبل للألعاب	0U39	F-46
CID1133	Apple Phone	CID1133	هاتف أبل	00U8	B-21
CID1134	Nadera	CID1134	ناديرا	0U38	D-18
CID1135	Optical City	CID1135	المدينة البصرية	0U38	F-35
CID1136	Misbah Trading Est.	CID1136	مؤسسة مصباح للتجارة	0U26	F-48
CID1137	Granite Powder	CID1137	مسحوق الجرانيت	0U39	null
CID1138	Shima	CID1138	شيما	0U38	D-18
CID1139	Kifahi Est.	CID1139	مؤسسة كفاحي	00U2	F-51
CID114	Baith Al-Asaar	CID114	بيت العصار	0U38	A-68
CID1140	Milas Restaurant	CID1140	مطعم ميلاس	0U38	F-36
CID1141	Hamazan Restaurant	CID1141	مطعم همزان	00U8	F-49
CID1142	Joory Toys	CID1142	ألعاب جوري	0U38	D-1
CID1143	Layan Hyper	CID1143	ليان هايبر	00U2	F-50
CID1144	Needle And Thread	CID1144	إبرة وخيط	0U38	F-49
CID1145	Fakhre	CID1145	فخري	0U38	D-22
CID1146	Steam Star	CID1146	ستيم ستار	0U38	F-34
CID1147	Tayeb Pharmacy	CID1147	صيدلية الطيب	0U38	null
CID1148	Wasail	CID1148	وسيل	00U2	F-35
CID1149	Blue Birds	CID1149	الطيور الزرقاء	0U38	B-79
CID115	Bakhaswain	CID115	باخاسوين	0U38	A-12
CID1150	Experts	CID1150	الخبراء	0U38	D-0
CID1151	Nariyah Medical	CID1151	نارية الطبية	0U39	F-30
CID1152	Oriental Antique	CID1152	العتيقة الشرقية	0U39	F-40
CID1153	Dhooq Restaurant	CID1153	مطعم ذوق	0U38	F-36
CID1154	Riyadh Trading Center	CID1154	مركز الرياض التجاري	0U38	D-24
CID1155	Daloob	CID1155	دلوب	0U38	B-20
CID1156	Friends	CID1156	اصدقاء	0U38	null
CID1157	Crispy WoW	CID1157	كرسبي واو	00U8	null
CID1158	Jowan Car Wash	CID1158	جوان غسيل السيارات	0U38	B-21
CID1159	Nogosh	CID1159	نوقوش	0U38	D-16
CID116	Baladi	CID116	بلدي	0U38	A-77
CID1160	Violinista	CID1160	عازف الكمان	0U39	F-36
CID1161	Donuts Place	CID1161	دوناتس بليس	0U38	null
CID1162	Attia Trading Est.	CID1162	مؤسسة عطية للتجارة	0U38	B-78
CID1163	BS - Beauty Secret Cosmetics	CID1163	بكالوريوس - مستحضرات التجميل السرية	0U39	F-42
CID1164	Dammam National Dispensary	CID1164	مستوصف الدمام الوطني	0U38	B-75
CID1165	HomWare	CID1165	هوم وير	0U26	null
CID1166	Alam Bahariyat Restaurant	CID1166	مطعم علم بهاريات	0U39	F-40
CID1167	Fit House	CID1167	فيت هاوس	0U38	F-51
CID1168	Casa Cofee	CID1168	كازا كوفي	0U39	F-39
CID1169	Dallah Kersar	CID1169	دله كرسار	0U38	F-50
CID117	Baowabat Al-Hayat Plaza	CID117	باوابات الحياة بلازا	0U38	E-26
CID1170	Elegance	CID1170	الاناقه	00U8	F-46
CID1171	Price Touches	CID1171	لمسات السعر	0U26	F-19
CID1172	Avnos Restaurant	CID1172	مطعم أفنوس	0U38	F-51
CID1173	Guest Palace Restaurant	CID1173	مطعم جيست بالاس	0U38	A-39
CID1174	Kingdom Carpet	CID1174	سجادة المملكة	0U38	D-0
CID1175	Fawar	CID1175	فوار	0U39	F-36
CID1176	A-1 Products	CID1176	منتجات A-1	0U38	F-50
CID1177	New Ten	CID1177	نيو تن	0U26	F-26
CID1178	Abu Safar	CID1178	أبو سفر	0U38	F-52
CID1179	Glossy	CID1179	لامعه	0U38	F-52
CID118	Bar Bar Restaurant	CID118	بار بار مطعم	0U38	A-8
CID1180	Baity	CID1180	بيتي	0U38	F-30
CID1181	Ameer Restaurant	CID1181	مطعم أمير	0U38	F-34
CID1182	Saraya Restaurant	CID1182	مطعم سرايا	0U38	F-34
CID1183	Cabalen Restaurant	CID1183	مطعم كابالين	0U39	F-40
CID1184	Naval Coldstore	CID1184	كولدستور البحرية	0U38	null
CID1185	Adel Al-Mountazar	CID1185	عادل المنتزار	0U38	A-69
CID1186	Safanah	CID1186	صفانة	0U38	F-39
CID1187	Elap wa Taalam	CID1187	إيلاب وعلم	0U38	D-36
CID1188	Estilo	CID1188	إستيلو	0U38	F-33
CID1189	Happy Land	CID1189	هابي لاند	00U8	F-34
CID119	Barary Charcoal	CID119	فحم باراري	0U38	E-8
CID1190	Tamur Waratib Tayeb	CID1190	تامور وراتيب الطيب	0U26	F-22
CID1191	Saffron Island Restaurant	CID1191	مطعم جزيرة الزعفران	0U26	F-33
CID1192	Tasty and Crispy	CID1192	لذيذ ومقرمش	00U8	F-33
CID1193	Olive Village	CID1193	قرية الزيتون	0U26	F-33
CID1194	Handasah Alhazem	CID1194	هنداسة الحازم	0U38	F-34
CID1195	Yonis Burger	CID1195	يونس برجر	0U38	A-70
CID1196	Bab KhoKha	CID1196	باب خوخا	0U38	F-34
CID1197	Be Sport	CID1197	كن رياضيا	0U38	F-32
CID1198	Shike sayaden	CID1198	شيك سايادن	00U8	null
CID1199	Razi clinec	CID1199	رازي كلاينك	0U38	null
CID120	Baras Electric Corporation	CID120	شركة باراس للكهرباء	0U38	A-60
CID1200	Little Doll	CID1200	دمية صغيرة	0U38	null
CID1201	Dulaijan	CID1201	دليجان	0U39	F-35
CID1202	Rawabi Sweet	CID1202	روابي سويت	0U38	F-30
CID1203	Flying Horse	CID1203	الحصان الطائر	0U26	F-30
CID1204	Japanishi	CID1204	يابانيشي	0U38	B-19
CID1206	Arrazi Clinics	CID1206	عيادات الرازي	0U38	F-33
CID1207	Bortokan	CID1207	بورتوكان	0U38	F-33
CID1208	Shaikh Al-Sayadin	CID1208	الشيخ الصيادين	0U38	F-33
CID1209	Zad Al-Diwanyya	CID1209	زاد الديوانية	0U38	F-32
CID121	Bashri (B)	CID121	بشري (ب)	0U38	A-13
CID1210	Sambosa	CID1210	سمبوسة	0U38	null
CID1211	Nasma AL-Jazeera Restaurant	CID1211	مطعم نسمة الجزيرة	0U38	F-32
CID1212	Adliya Gate	CID1212	بوابة العدلية	0U38	F-32
CID1213	Howard Johnson	CID1213	هوارد جونسون	0U38	E-12
CID1214	Zamil	CID1214	الزامل	0U38	F-31
CID1215	GHL (Gulf House Lab.)	CID1215	GHL (مختبر بيت الخليج)	0U38	F-30, D-0
CID1216	Rawaea Jeddah	CID1216	راويع جدة	0U26	F-25
CID1217	Danoob	CID1217	دانوب	0U38	null
CID1218	Patonia	CID1218	باتونيا	0U38	F-31
CID1219	Middle East Restaurant	CID1219	مطعم الشرق الأوسط	0U38	F-31
CID122	Basim	CID122	باسم	0U38	E-41
CID1220	Tawania	CID1220	توانية	0U38	D-18
CID1221	Alyoum Alsayed Restaurant	CID1221	مطعم اليوم السيد	0U38	F-31
CID1222	Alazaem Restaurants	CID1222	مطاعم العظام	00U8	B-14
CID1223	Pastries And Pies Egyptian Star	CID1223	المعجنات والفطائر المصرية ستار	0U38	F-33
CID1224	Health and Life Polyclinic	CID1224	عيادة الصحة والحياة	0U38	F-1
CID1225	Raeya AlMashuyat Restaurant	CID1225	مطعم راية المشويات	0U26	F-32
CID1226	Ilonggos	CID1226	إيلونغوس	00U8	A-64
CID1227	Bin Hydara Trading Est.	CID1227	مؤسسة بن حيدرة للتجارة	0U38	F-29
CID1228	Zayer	CID1228	زاير	0U39	null
CID1229	Bandhari Saudia	CID1229	بانداري السعودية	00U2	F-28
CID123	Basrah Restaurant	CID123	مطعم البصرة	0U38	A-15
CID1230	Mary Bake and Cake	CID1230	ماري بيك آند كيك	0U38	A-56
CID1231	Madhaq Hawa	CID1231	مدحاق حواء	0U38	A-56
CID1232	Ibrahim M. Al-Najran Ext.	CID1232	إبراهيم محمد النجران تحويلة	0U38	D-0
CID1233	Natural Mashawi Charcoal	CID1233	فحم مشوي طبيعي	0U38	F-28
CID1234	Sugar And Flour	CID1234	السكر والدقيق	0U26	null
CID1235	Umm Aziz	CID1235	أم عزيز	0U38	F-27
CID1236	Maaref Bookstore	CID1236	مكتبة معارف	0U38	F-28
CID1237	Wahab Al-Khayer	CID1237	وهاب الخير	0U38	F-28
CID1238	Lamsa For Toys	CID1238	لمسة للألعاب	0U38	F-28
CID1239	Hamasat (Whisper)	CID1239	حماسات (همس)	0U38	F-28
CID124	Bassam Zeena Bakhruji Trading	CID124	بسام زينة بخروجي للتجارة	0U38	A-78
CID1240	Falafel Time	CID1240	وقت الفلافل	0U38	F-28
CID1241	Libanet KSA	CID1241	لبنت السعودية	0U38	D-25
CID1242	Future Toys	CID1242	ألعاب المستقبل	0U38	F-27
CID1243	Balah Al-Sham	CID1243	بلاح الشام	0U38	F-27
CID1244	Samboosa Al-Arabiyah	CID1244	سمبوسة العربية	0U38	B-20
CID1245	Gardens	CID1245	حدائق	0U38	D-26
CID1246	Faham Joud	CID1246	فهام جود	0U26	E-17
CID1247	Asseel House	CID1247	بيت أصيل	0U38	E-37
CID1248	Roma World Optical	CID1248	روما وورلد للبصريات	0U38	B-30
CID1249	Aqua Eyes Optical	CID1249	أكوا آيز بصرية	0U38	B-30
CID125	Bayroni	CID125	بيروني	0U38	A-23
CID1250	Alahli	CID1250	الأهلي	0U38	F-6
CID1251	Reem Broasted	CID1251	ريم بروستد	00U2	B-27
CID1252	Sarikh Corner	CID1252	ركن الصريخ	0U38	A-66
CID1253	Madina Centre	CID1253	مركز المدينة	0U26	null
CID1254	Abeer Alaryaf	CID1254	عبير العرف	00U8	A-59
CID1255	Wallnut Forest	CID1255	غابة الجوز	0U38	D-26
CID1256	Ballons Magic	CID1256	البالونات السحرية	0U38	B-55
CID1257	Sahil	CID1257	سهل	0U38	E-17
CID1258	Neqsa Huluh	CID1258	نقصة حلوح	0U38	E-18
CID1259	Senta Lena	CID1259	سينتا لينا	0U38	null
CID126	Bashrawi Shopping Center	CID126	مركز تسوق بشراوي	0U38	B-2
CID1260	Talal	CID1260	طلال	0U38	null
CID1261	Garden Of Pastries	CID1261	حديقة المعجنات	0U38	D-36
CID1262	Tawos Al-Janah Super Market	CID1262	تاووس الجناح سوبر ماركت	0U38	A-59, D-0
CID1263	Mohammad Dossary Hospital	CID1263	مستشفى محمد دوسري	0U38	B-69
CID1264	Bawaba Al-Tawfir	CID1264	بوباء التوفير	0U26	F-19
CID1265	Shawarma Ramy	CID1265	شاورما رامي	0U26	B-58
CID1266	Mudeef Restaurant	CID1266	مطعم المديف	0U38	F-29
CID1267	Ameer Pasta	CID1267	باستا أمير	0U38	F-34
CID1268	Consumer World (Dammam)	CID1268	عالم المستهلك (الدمام)	0U26	F-40
CID1269	Samlex	CID1269	سامليكس	0U38	B-28
CID127	BB2	CID127	BB2	0U38	C-27
CID1270	Ardh Al-Tawfeer	CID1270	أرض التوفير	0U26	F-47
CID1271	Hokail Medical Laboratory	CID1271	مختبر الحقيل الطبي	0U38	E-15
CID1272	Zeenath Al-Buyoth	CID1272	زينات البيوت	00U2	E-17
CID1273	Swah Restaurant	CID1273	مطعم سواح	0U38	null
CID1274	Sambosa Al-Shef	CID1274	سمبوسة الشيف	0U38	F-48
CID1275	Almas Dental Lab	CID1275	مختبر الماس لطب الأسنان	0U38	B-64
CID1276	Jawal Al-Jubail Telecom	CID1276	جوال الجبيل للإتصالات	0U38	B-64
CID1277	Red Bunny	CID1277	الأرنب الأحمر	00U8	E-13
CID1278	Choco Spell	CID1278	شوكو سبيل	0U38	E-37
CID1279	Nada Rose	CID1279	ندى روز	0U38	F-14
CID128	Bayouni Trading	CID128	بيوني للتجارة	0U38	A-24
CID1280	Orntal Pastries & Sweets	CID1280	المعجنات والحلويات المزخرفة	0U38	F-14
CID1281	Janain Al-Wahaa Est.	CID1281	مؤسسة جنين الوحة	0U26	null
CID1282	Zaffranh	CID1282	زعفرانة	0U38	A-58
CID1283	AM-PM Snacks	CID1283	الوجبات الخفيفة صباحا إلى مساء	0U38	E-17
CID1284	Shaikh International Group	CID1284	مجموعة الشيخ الدولية	0U38	B-20
CID1285	Ghozn Allawz	CID1285	غزن علوز	0U38	A-23
CID1286	Sweet Thing	CID1286	شيء حلو	0U38	F-4
CID1287	Shawermaya	CID1287	شاورمايا	0U38	A-23
CID1288	Green House Flowers	CID1288	زهور البيت الأخضر	0U38	D-19
CID1289	SGP	CID1289	SGP	0U26	null
CID129	Aymeen Exhibition	CID129	معرض أيمين	0U38	B-22
CID1290	Lamar Restaurant	CID1290	مطعم لمار	00U8	A-39
CID1291	Afandim For Fresh Grill	CID1291	أفنديم للشواية الطازجة	0U38	A-19
CID1292	Ajiyad	CID1292	أجياد	0U38	null
CID1293	Golden Chicken Restaurant	CID1293	مطعم جولدن تشيكن	0U38	F-10
CID1294	Talent Studio	CID1294	استوديو المواهب	0U38	F-10
CID1295	Honey And More	CID1295	العسل والمزيد	0U38	null
CID1296	Surprise	CID1296	فاجأ	0U38	F-10
CID1297	Ahla Bahla AL-Sham	CID1297	أهلى بهلة الشام	0U38	B-58
CID1298	Swear Restaurant	CID1298	مطعم سوير	0U38	A-76
CID1299	Freij Aqaibin Restaurant	CID1299	مطعم فريج عقيبين	0U38	B-14
CID130	Abeer	CID130	عبير	0U38	E-30
CID1300	Noqaza Restaurant	CID1300	مطعم نوقظة	0U38	A-22
CID1301	Nawaem Dubai Abayat	CID1301	نواعم دبي عبيات	0U38	E-16
CID1302	GTA	CID1302	جي تي إيه	0U38	E-18
CID1303	True of Saving	CID1303	صحيح في الادخار	0U38	A-35
CID1304	Best	CID1304	أفضل	0U38	E-11
CID1305	Falafel NBA Al-Sham	CID1305	فلافل الدوري الاميركي للمحترفين الشام	0U38	null
CID1306	Awamiya Modern Restaurant	CID1306	مطعم العوامية الحديث	0U38	D-27
CID1307	Car Wash	CID1307	غسيل السيارات	0U38	null
CID1308	Rayhant Al-Sham Restaurant	CID1308	مطعم ريحان الشام	0U38	A-32
CID1309	Moasisat Al-Fatr Al-Mahir	CID1309	مشاركات الفطر المهير	0U38	null
CID131	Best Friends Toys	CID131	أفضل ألعاب الأصدقاء	0U38	D-0
CID1310	Crown Pillows	CID1310	وسائد التاج	0U38	null
CID1311	Figs and Almonds	CID1311	التين واللوز	0U38	F-22
CID1312	Dar Al-Aqbar Restaurant	CID1312	مطعم دار الأقصى	0U38	F-22
CID1314	Amri Coffee	CID1314	قهوة عمري	0U38	A-12
CID1315	Dalin Sweets and Coffee	CID1315	حلويات دالين والقهوة	0U38	A-27
CID1316	Tethkar Al-Sharq	CID1316	تاثر الشرق	0U38	A-34
CID1317	Iron Nutrition	CID1317	تغذية الحديد	0U38	E-36
CID1318	Medmac Fastfood	CID1318	ميدماك للوجبات السريعة	0U38	A-28
CID1319	Food Station	CID1319	محطة طعام	0U38	A-20
CID132	Beint Al-Arab Exchange	CID132	بينت العرب للصرافة	0U38	B-23
CID1320	Baowabat Tabuk	CID1320	باوابات تبوك	0U26	E-26
CID1321	Camella	CID1321	كاميلا	0U38	A-27
CID1322	Shat Al-Arab	CID1322	شط العرب	0U38	D-18
CID1323	Salamatek Medical Center	CID1323	مركز سالاماتك الطبي	0U38	B-55
CID1324	Press Land	CID1324	الصحافة الأرض	0U38	E-17
CID1325	Hussain	CID1325	حسين	0U26	D-13
CID1326	Naeem Grills	CID1326	مشاوي نعيم	0U38	F-24
CID1327	Balad Mashuy	CID1327	بلد مشوي	0U38	A-34
CID1328	Gharib	CID1328	غريب	0U38	A-31
CID1329	Shula Al-Shamiyah	CID1329	شعلة الشامية	0U38	A-28
CID133	Beirut Tailor	CID133	بيروت خياط	0U38	A-55
CID1330	Maratebb	CID1330	ماراتب	0U38	A-66
CID1331	My Signature	CID1331	توقيعي	00U8	B-14
CID1332	Serat Al-Sham	CID1332	سرت الشام	0U38	null
CID1333	Eiffel	CID1333	ايفل	0U38	D-18
CID1334	Natural Product	CID1334	منتج طبيعي	0U38	null
CID1335	Sabeel Group	CID1335	مجموعة سبيل	0U38	A-24
CID1336	Sufrah Restaurant	CID1336	مطعم صفرة	0U38	A-28
CID1337	Dawood	CID1337	داود	0U38	null
CID1338	Crestal	CID1338	كريستال	0U26	B-14
CID1339	Sarah And Sirrah	CID1339	سارة وسيرة	0U26	A-62
CID134	Beyroty	CID134	بيروتي	0U38	B-42
CID1340	Shahbas Yadgar	CID1340	شهباس يادغار	0U26	null
CID1341	NASCO Global	CID1341	ناسكو جلوبال	0U38	D-22
CID1342	Ishteaq	CID1342	اشتاق	0U38	E-3
CID1343	Ba Warith	CID1343	با واريث	0U38	F-4
CID1344	Grillo	CID1344	جريلو	0U38	F-1
CID1345	Pink Box	CID1345	الصندوق الوردي	0U38	A-28
CID1346	Abu Romana	CID1346	أبو رمانة	0U38	B-35
CID1347	Annapoorna Restaurant	CID1347	مطعم أنابورنا	0U26	B-54
CID1348	Liberty	CID1348	الحريه	0U26	B-58
CID1349	4 Friends Restaurant	CID1349	مطعم 4 فريندز	0U38	F-3
CID135	Big World	CID135	عالم كبير	0U26	E-47
CID1350	Syl Sayed	CID1350	سيل سيد	0U38	F-3
CID1351	Alam Sahari Trading	CID1351	عالم سحاري للتجارة	00U8	A-70
CID1352	Fanar Coffee	CID1352	قهوة الفنار	0U38	F-1
CID1353	We Wash	CID1353	نحن نغسل	0U38	E-18
CID1354	Sun City	CID1354	صن سيتي	0U38	E-35
CID1355	Elegant Wave Trading Est.	CID1355	مؤسسة الموجات الأنيقة للتجارة	0U38	null
CID1356	Shams Al-Madina	CID1356	شمس المدينة المنورة	0U38	E-35
CID1357	Basta Al-Tawfir	CID1357	بسطا التوفير	0U38	F-24
CID1358	Ali Saad Al-Horaizi Trad. Est.	CID1358	علي سعد الحريزي طراد. مؤسسه.	0U38	A-67
CID1359	Shehri Shops	CID1359	محلات شهري	0U38	F-23
CID136	Bin Afeef Center	CID136	مركز بن عفيف	0U38	F-16
CID1360	Asar Al-Bukhary Restaurant	CID1360	مطعم عصر البخاري	0U38	F-23
CID1361	Nabeel Al-Awadhi	CID1361	نبيل العوضي	0U38	A-25
CID1362	Asar Al-Hadeth Restaurant	CID1362	مطعم عصر الحديث	0U38	F-23
CID1363	Shamel Saving	CID1363	الشامل للتوفير	00U8	F-23
CID1364	Taba Gardens Restaurant	CID1364	مطعم طابا جاردنز	00U8	F-3
CID1365	Dalia Fertilizer	CID1365	دالية سماد	0U38	F-15
CID1366	Mezbaan Darbar Restaurant	CID1366	مطعم مزبان دربار	0U26	A-12
CID1367	Amiantek	CID1367	أميانتيك	0U26	null
CID1368	Diwaniya	CID1368	الديوانية	00U8	A-35
CID1369	Oriental Palace	CID1369	القصر الشرقي	0U38	D-0
CID137	Bin Sabt Trading Establishment	CID137	مؤسسة بن سبت التجارية	0U26	F-6
CID1370	Turkish Mazaya Pastry	CID1370	معجنات مزايا التركية	0U38	F-29
CID1371	Shubra	CID1371	شبرا	0U38	F-42
CID1372	Show Piece Grill	CID1372	عرض قطعة الشواية	0U38	F-41
CID1373	House Ware	CID1373	أدوات منزلية	0U38	D-11
CID1374	Mashtan Caféteria	CID1374	كافيتريا مشتان	0U38	A-54
CID1375	Jar Alqamar	CID1375	جار القمر	0U38	A-59
CID1376	Chef Al-Hadramy	CID1376	الشيف الحضرمي	0U38	B-53
CID1377	Sameeh Pastry and Restaurant	CID1377	سميح للحلويات والمطعم	0U38	F-9
CID1378	Saudi Railways Organization	CID1378	الهيئة العامة للسكك الحديدية	0U26	B-31
CID1379	Sahra Charcoal	CID1379	فحم صحراء	0U38	A-12
CID138	Beint Al-Arab Exhibition	CID138	معرض بينت العرب	0U38	B-23
CID1380	Muslim Bori Nursery	CID1380	حضانة مسلم بوري	0U38	D-29
CID1381	Fouad Ali Bin Moh. Alhmla Est.	CID1381	فؤاد علي بن موح. مؤسسة الحملا	0U26	B-28
CID1382	Blue Bird	CID1382	بلو بيرد	0U26	E-40
CID1383	Shahad Al-Zafran Roasty	CID1383	شهد الزعفران روستي	0U38	E-40
CID1384	Dana Al-Maarif	CID1384	دانة المعارف	0U38	E-40
CID1385	Sallati	CID1385	سلاتي	0U38	F-2
CID1386	Emmawash Restaurant	CID1386	مطعم Emmawash	0U38	null
CID1387	Ramisis Kennel	CID1387	بيت راميسيس	0U38	E-45
CID1388	Alkyaf Nuts	CID1388	المكسرات الألكاف	0U38	E-17
CID1389	Lena Mart	CID1389	لينا مارت	0U26	B-62
CID139	Bint Al-Khaleej	CID139	بنت الخليج	0U38	B-1
CID1390	The Farm	CID1390	المزرعة	0U38	A-27
CID1391	Sugar	CID1391	سكر	0U38	null
CID1392	Sun City For Nuts	CID1392	صن سيتي للمكسرات	0U38	E-35
CID1393	Faraby Medical Center	CID1393	مركز فارابي الطبي	0U26	E-43
CID1394	Turath AL-Sharq	CID1394	تراث الشرق	0U26	E-42
CID1395	Phoenex Charcoal	CID1395	فحم فينيكس	0U38	A-12
CID1396	Gwazween Trading Est.	CID1396	مؤسسة غوزوين للتجارة	0U26	null
CID1397	PM	CID1397	رئيس الوزراء	0U38	null
CID1398	Mento	CID1398	مينتو	0U38	F-2
CID1399	Hometale	CID1399	حكاية منزلية	0U38	F-2
CID140	Bio-Hazard	CID140	الخطر الحيوي	0U38	E-51
CID1400	Hassan Hassan Al-Dahan	CID1400	حسن حسن الدهان	0U38	F-2
CID1401	Ehraz Advertizing Agency	CID1401	وكالة إحراز للإعلان	0U38	F-2
CID1402	Strawberry Corner	CID1402	ركن الفراولة	0U38	F-44
CID1403	Khamis Uniforms	CID1403	زي خميس	0U38	F-2
CID1404	Bashair Gifts	CID1404	هدايا بشير	0U38	F-3
CID1405	Gourmandise Burger	CID1405	جورمانديز برجر	0U38	F-9
CID1406	Choco Crepe	CID1406	كريب شوكو	0U38	F-7
CID1407	Alam Al-Kaeef	CID1407	عالم الكيف	0U38	F-7
CID1408	Wasan Sweet	CID1408	وسان سويت	0U38	F-7
CID1409	Prestige Image	CID1409	صورة برستيج	0U38	null
CID141	Bismi Foods	CID141	باسمي فودز	0U38	B-44
CID1410	Prime Muscles	CID1410	العضلات الرئيسية	0U38	E-40
CID1411	Lab Coat Uniform	CID1411	معطف المختبر الزي الرسمي	0U38	E-16
CID1412	Nukhbt Al Ghand	CID1412	نخبة الغند	0U38	F-8
CID1413	AGH Warehouse	CID1413	مستودع AGH	0U38	B-69
CID1414	Dally Molodk	CID1414	دالي مولودك	0U38	E-18
CID1415	Kaku	CID1415	كاكو	0U38	E-18
CID1416	Dior Perfumes And Cosmetics	CID1416	ديور للعطور ومستحضرات التجميل	0U38	B-25
CID1417	Reef Al Sukar	CID1417	ريف السكر	0U38	E-18
CID1418	Mokhtar Pastry	CID1418	معجنات المختار	0U38	E-42
CID1419	Samah Mills	CID1419	مطاحن سماح	0U38	D-29
CID142	B+K	CID142	ب + ك	0U38	null
CID1420	Hikayath Taami	CID1420	حكايات تامي	0U38	B-35
CID1421	Kaltat Al Doctora	CID1421	كلتات الدكتورة	0U38	A-75
CID1422	Madukoth Al Yemen	CID1422	مدوكوث اليمن	0U38	F-23
CID1424	Addoha	CID1424	أدوها	0U38	E-40
CID1425	Hazzaz Al-Khobar	CID1425	هزاز الخبر	0U38	E-8
CID1426	Ajar Al-Tanoor	CID1426	أجار التنور	0U38	E-40
CID1427	Nozha	CID1427	النزهة	0U38	null
CID1428	La Panière	CID1428	لا بانيير	0U38	B-78
CID1429	Mosaba	CID1429	موسابة	0U38	A-78
CID143	Bombay Fashion	CID143	أزياء بومباي	0U38	B-34
CID1430	Lulu Sharqiya	CID1430	لولو الشرقية	0U38	B-19
CID1431	Safat Restaurant	CID1431	مطعم الصفاة	0U38	F-16
CID1432	Baabek	CID1432	بعبك	0U38	A-13
CID1433	Home Corner Furneture	CID1433	ركن المنزل Furneture	0U38	null
CID1434	Mawani	CID1434	مواني	0U38	B-19
CID1435	Istanbul House Restaurant	CID1435	مطعم اسطنبول هاوس	0U38	F-44
CID1436	Fresh Meat	CID1436	اللحوم الطازجة	0U38	A-72
CID1437	Nada Perfume	CID1437	عطر ندى	0U38	B-19
CID1438	Faraby Pharmacy	CID1438	صيدلية فاربي	0U26	B-54
CID1439	Amazing World	CID1439	عالم مذهل	0U26	E-47
CID144	Bulbul Fashions	CID144	أزياء بلبل	0U38	F-20
CID1440	Mosabah	CID1440	مصبح	0U38	A-62
CID1441	La Pasta	CID1441	لا باستا	0U38	A-28
CID1442	Mouwasat Hospital	CID1442	مستشفى المواساة	0U38	A-65
CID1443	Janah Sweets	CID1443	حلويات جنة	0U38	A-72
CID1444	Fator Shamy	CID1444	فاتور شامي	0U26	A-71
CID1445	Dar As Sihha Medical Center	CID1445	مركز دار السحة الطبي	0U26	B-56
CID1446	Majed	CID1446	ماجد	0U38	D-8
CID1447	Maundry	CID1447	ماوندري	0U38	A-51
CID1448	Bait Al-Baranda	CID1448	بيت البرندة	0U38	E-19
CID1449	Noahs Ark	CID1449	سفينة نوح	0U38	D-20
CID145	Bundoo Khan Restaurant	CID145	مطعم بندو خان	0U38	B-50
CID1530	Fan Kabsah	CID1530	فان كبسة	0U38	E-39
CID1450	Istanbul House Restaurant 2	CID1450	مطعم اسطنبول هاوس 2	0U38	null
CID1451	Fatosh	CID1451	فتوش	0U38	B-12
CID1452	Blue Sky	CID1452	السماء الزرقاء	0U38	F-10
CID1453	Rice And Saffron	CID1453	أرز و زعفران	0U38	E-49
CID1454	Matam Baith Al-Manasaf	CID1454	متام بيث المناسف	0U38	null
CID1455	AS	CID1455	مثل	0U38	B-12
CID1457	Perfect Body	CID1457	جسم مثالي	0U38	E-36
CID1458	Marja Juices	CID1458	عصائر مارجا	0U38	B-12
CID1459	Gülhane	CID1459	جولهان	0U38	D-20, D-0
CID146	Buraiki Shopping Center	CID146	مركز البريكي للتسوق	0U38	A-1
CID1460	Hunger Moments	CID1460	لحظات الجوع	0U38	E-13
CID1461	Bait AL-Mansaf	CID1461	بيت المنصاف	0U38	null
CID1462	World Wrap	CID1462	التفاف العالم	0U38	D-20
CID1463	Sultanh	CID1463	سلطانة	0U26	B-12
CID1464	Bakhat Perfume	CID1464	عطر بخات	0U38	E-28
CID1465	Tempo Shawarma	CID1465	تمبو شاورما	0U38	B-22
CID1466	Eagle	CID1466	نسر	0U38	null
CID1467	Mamas Curry Powder	CID1467	ماماز مسحوق كاري	0U38	E-28
CID1468	Black Walnut Charcoal	CID1468	فحم الجوز الأسود	0U38	B-25
CID1469	Consumer World (Hassa)	CID1469	عالم المستهلك (الأحصاء)	0U26	F-40
CID147	Buy and Save	CID147	الشراء والحفظ	0U38	B-49
CID1470	My Vintage Home	CID1470	منزلي القديم	0U26	E-8
CID1471	Loulia Café	CID1471	مقهى لوليا	0U26	E-28
CID1473	Secret	CID1473	سر	0U38	A-31
CID1474	Malaz Bookstore	CID1474	مكتبة الملز	0U38	E-46
CID1475	Sharq Al-Madina	CID1475	شرق المدينة المنورة	0U38	F-23
CID1476	Ousha	CID1476	عوشة	0U38	A-22
CID1477	Sandwicher	CID1477	ساندويشر	0U38	A-50
CID1478	Bayt Bukhari	CID1478	بيت بخاري	0U38	null
CID1479	Fashion Salem	CID1479	أزياء سالم	00U8	E-9
CID148	Canary Meadows	CID148	كناري ميدوز	0U38	E-21
CID1480	Aroos Qatif	CID1480	عروس قطيف	00U8	B-19
CID1481	Abu Al-Saud For Cloth	CID1481	أبو السعود للقماش	00U8	B-54
CID1482	Shawerma X	CID1482	شاورما X	0U38	A-5
CID1483	Kimalah	CID1483	كيمالا	0U38	A-35
CID1484	Azel	CID1484	أزيل	0U38	E-16
CID1485	Nawaf	CID1485	نواف	0U38	E-31
CID1486	Spices Fresh	CID1486	بهارات طازجة	0U38	A-29
CID1487	Feiruz Al-Sharq	CID1487	فيروز الشرق	0U38	F-18
CID1488	Office	CID1488	مكتب	0U38	null
CID1489	Shahat Al-Nahal	CID1489	شحات النحال	0U38	A-62
CID149	Casa Grill	CID149	كازا جريل	0U38	B-6
CID1490	Vins	CID1490	فينز	0U38	E-14
CID1492	Turath	CID1492	تراث	0U38	D-21
CID1493	Twareat Medical Centre	CID1493	مركز توريات الطبي	0U38	B-16
CID1494	The Cuts	CID1494	التخفيضات	0U38	B-16
CID1495	Rodat Al-Khobar	CID1495	رودات الخبر	0U38	D-20
CID1496	Waraq Enab Station	CID1496	محطة وراق عنب	0U38	F-5
CID1497	Creepe Roll	CID1497	لفة الزاحف	0U38	A-9
CID1498	Sharq Restaurant	CID1498	مطعم شرق	0U38	A-9
CID1499	Thahab Al-Jazeera	CID1499	ذهب الجزيرة	0U38	B-21
CID150	Casa Juice	CID150	عصير كازا	0U38	A-7
CID1500	Ward Al-Reda Restaurant	CID1500	مطعم ورد الرضا	0U38	E-42
CID1501	Marka Musajala	CID1501	ماركا مساجالة	0U38	null
CID1502	Shahed Sweets	CID1502	حلويات شاهد	0U38	A-69
CID1503	Morooj	CID1503	مروج	0U26	B-65
CID1504	Coffee Time	CID1504	وقت القهوة	0U38	A-25
CID1505	Supplement Store	CID1505	متجر المكملات الغذائية	0U38	F-1
CID1506	Dar Rawi	CID1506	دار راوي	0U38	null
CID1507	Creative United Company	CID1507	شركة الإبداع المتحدة	0U26	A-1
CID1508	Tmor Mwasim Zasim	CID1508	تمور مواسيم زاسم	0U38	A-28
CID1509	Alumena	CID1509	الخريج	0U38	null
CID151	Casual Jeans	CID151	جينز كاجوال	0U38	A-58
CID1510	Siwan	CID1510	سيوان	0U38	null
CID1511	Raey Broasted	CID1511	راي بروست	0U38	A-77
CID1512	Karama	CID1512	كرامة	0U38	E-42
CID1513	Lechef Sweets	CID1513	حلويات ليشيف	0U38	F-5
CID1514	Sea Food	CID1514	مأكولات بحرية	0U38	A-79
CID1515	Shemadan	CID1515	شيمادان	0U38	A-2
CID1516	Alroosy	CID1516	الروسي	0U38	E-23
CID1517	Green Shopping Center	CID1517	مركز تسوق جرين	0U38	B-22
CID1518	Qimat Al-Halwayath	CID1518	قمات الحلوياث	0U38	B-57
CID1519	Skin Care Center	CID1519	مركز العناية بالبشرة	0U38	D-14
CID152	Charour Restaurant	CID152	مطعم شارور	0U38	E-48
CID1520	Arif Trading For Skin Care Co.	CID1520	شركة عارف للتجارة للعناية بالبشرة	0U38	D-14
CID1521	Rayed Al-Naseej	CID1521	رائد النسيج	0U38	A-1
CID1522	Khusheim Corporation	CID1522	شركة خوشيم	0U38	E-34
CID1523	Weekend	CID1523	نهاية الأسبوع	0U38	A-15
CID1524	Kacmazlar	CID1524	كاتشازلار	0U38	null
CID1525	Khair Zad	CID1525	خير زاد	0U38	D-18, D-0
CID1526	PSMMC	CID1526	بي إس إم إم سي	0U38	A-1
CID1527	Kabsah Art	CID1527	فن الكبسة	0U38	E-8
CID1528	Dubai For Saving	CID1528	دبي للتوفير	0U38	F-38
CID1529	Jazirah Pharmacy	CID1529	صيدلية الجزيرة	0U38	E-8
CID153	Chicken Spicy	CID153	دجاج حار	0U38	D-5
CID1456	Lamaa Carwash	CID1456	لمعة لغسيل السيارات	0U38	E-16
CID1491	Sad Mareb	CID1491	سد مارب	0U38	E-28
CID1531	Online SuperMarket	CID1531	سوبر ماركت على الإنترنت	0U38	B-12
CID1532	WAW	CID1532	واو	0U38	B-23
CID1533	Nabeel Perfume	CID1533	عطر نبيل	0U26	A-1
CID1534	Jamea Trad Est	CID1534	مؤسسة جامع طراد	0U38	A-32
CID1535	Salt Sweet	CID1535	ملح حلو	0U38	null
CID1536	Velvet Rose	CID1536	مخمل روز	0U38	B-65
CID1537	Green Apple	CID1537	تفاح أخضر	0U38	B-65
CID1538	Atarah Wa Akthar	CID1538	عطارة وأكثار	0U38	B-65
CID1539	Zaman Al-Barakh	CID1539	زمان البراخ	0U38	null
CID154	Childs World	CID154	عالم الأطفال	0U38	B-40
CID1540	Aces	CID1540	اسات	0U38	E-19
CID1541	Khabbaz For Shoes	CID1541	خباز للأحذية	0U38	E-45
CID1542	Simple Solutions	CID1542	حلول بسيطة	0U38	E-49
CID1543	Trenjh	CID1543	ترينج	0U38	B-75
CID1544	King Fahad Specialist Hospital	CID1544	مستشفى الملك فهد التخصصي	0U38	B-65
CID1545	Marof	CID1545	مروف	0U38	A-70
CID1546	FRNAG	CID1546	فرناج	0U38	B-31
CID1547	ASDCO	CID1547	أسدكو	0U38	D-0
CID1548	Jupiter	CID1548	مشتري	0U38	null
CID1549	Butterfly	CID1549	فراشة	0U38	null
CID155	Chocolatry	CID155	شوكولاتة	0U38	B-37
CID1550	Dukhan Store	CID1550	متجر دخان	0U38	B-19
CID1551	Grill and More	CID1551	شواية والمزيد	0U38	null
CID1552	Etihad Specialized	CID1552	الاتحاد للطيران التخصصية	0U38	null
CID1553	Shawarma Saad	CID1553	شاورما سعد	0U38	B-65
CID1554	Sultan Bakeries and Sweets	CID1554	مخابز وحلويات سلطان	0U38	F-18
CID1555	Abqaiq Islamic Center	CID1555	مركز بقيق الإسلامي	0U38	B-22
CID1556	Prime Food Products	CID1556	برايم للمنتجات الغذائية	0U38	A-20
CID1557	Kisa Dress	CID1557	فستان كيسا	0U38	A-35
CID1558	Baladiya Ein Dar	CID1558	بلدية عين دار	0U38	B-73
CID1559	Sara International Factory	CID1559	مصنع سارة الدولي	0U38	D-0
CID156	Chowking	CID156	تشوكينغ	0U38	B-59
CID1560	Najeem	CID1560	نجيم	0U38	null
CID1561	Tilal Alamal Trading Est.	CID1561	مؤسسة تلال الأمل التجارية	0U38	B-37
CID1562	Mashwee Ya Akhtar	CID1562	مشوي يا أختر	0U38	A-26
CID1563	Mr. PC	CID1563	السيد PC	0U38	B-28
CID1564	Enet	CID1564	إينت	0U38	B-40
CID1565	Kwatim Al-Khaleej Restaurant	CID1565	مطعم كواتيم الخليج	0U38	B-61
CID1566	Aseel	CID1566	أصيل	0U38	B-79
CID1567	Juice Plus	CID1567	جوس بلس	0U38	A-64
CID1568	Relam	CID1568	ريلام	0U38	D-15
CID1569	Shahery Sweets Center	CID1569	مركز حلويات الشهري	0U26	F-1
CID157	Chubs	CID157	تشوبس	0U38	B-38
CID1570	Grillo Butcher	CID1570	جريلو بوتشر	0U38	F-1
CID1571	Nahawand Al-Sharq Restaurant	CID1571	مطعم نهاوند الشرق	0U38	A-18
CID1572	The Low Fat	CID1572	قليل الدسم	0U38	A-32
CID1573	Dubai For Saving (Jubail)	CID1573	دبي للادخار (الجبيل)	0U38	null
CID1574	Cabalen Supermarket	CID1574	Cabalen سوبر ماركت	0U26	A-72
CID1575	Fresh House	CID1575	فريش هاوس	0U38	B-11
CID1576	Bu Khamseen	CID1576	بو خمسين	0U38	E-19
CID1577	Sufra Fast Food	CID1577	سفرة للوجبات السريعة	0U38	A-34
CID1578	Discount Twenty	CID1578	خصم عشرون	0U26	E-45
CID1579	Vape World	CID1579	عالم السجائر الإلكترونية	0U38	A-17
CID158	Sinderilla Ladies Center	CID158	مركز سينديريلا للسيدات	0U38	D-18
CID1580	Jeefinshee	CID1580	جيفينشي	0U38	A-13
CID1581	Faris	CID1581	فارس	0U38	null
CID1582	Jaafar	CID1582	جعفر	0U38	null
CID1583	Dana Pharmacy	CID1583	صيدلية دانة	0U38	A-23
CID1584	Secret Smile	CID1584	ابتسامة سرية	0U38	A-23
CID1585	Jood Roastery	CID1585	جود محمصة	0U38	A-23
CID1586	Rosto Steak and Burger	CID1586	روستو ستيك اند برجر	0U38	A-35
CID1587	Matahin AL-Maha	CID1587	مطحين المها	0U38	B-67
CID1588	Frutella	CID1588	فروتيلا	0U38	A-71
CID1589	Modern Steel Factory	CID1589	مصنع الصلب الحديث	0U26	null
CID159	City Sweet	CID159	سيتي سويت	0U38	A-36
CID1590	Majurin	CID1590	ماجورين	0U38	B-67
CID1591	Meal House	CID1591	ميكل هاوس	0U38	null
CID1592	Maglopa Express	CID1592	ماجلوبا إكسبريس	0U38	D-0
CID1593	Habra Restaurant	CID1593	مطعم حبرا	0U38	E-43
CID1594	Rooster	CID1594	ديك	0U38	A-24
CID1595	Aker Sweets	CID1595	حلويات آكر	0U38	E-14
CID1597	Shater Hassan	CID1597	شاطر حسن	0U38	B-11
CID1598	Rose Flower	CID1598	زهرة الورد	0U38	E-4
CID1599	Enabji	CID1599	إنابجي	0U38	B-11
CID160	Cloth Center	CID160	مركز القماش	0U38	F-15
CID1600	Family Choice (FC)	CID1600	اختيار العائلة (FC)	0U26	D-21
CID1601	Choco Café	CID1601	شوكو كافيه	0U38	F-7
CID1602	Flavor	CID1602	نكهه	0U38	E-4
CID1603	Bahar Al-Athoor	CID1603	بحر الآثور	0U38	E-6
CID1604	QassQouss Bakery and Sweets	CID1604	مخبز وققس والحلويات	0U38	E-5
CID1605	Asawer Sweet	CID1605	أساور سويت	0U38	B-38
CID1606	Bombai Ryani	CID1606	بومباي رياني	0U38	D-20
CID1607	Extreme Carwash	CID1607	غسيل السيارات الشديد	0U38	null
CID1608	Majibos Restaurant	CID1608	مطعم ماجيبوس	0U38	E-4
CID1609	Leo Mobile Phone Shop	CID1609	متجر ليو للهواتف المحمولة	0U38	E-16
CID161	Collection	CID161	مجموعة	0U38	B-1
CID1610	Sweet Dama Rose	CID1610	سويت داما روز	0U38	A-20
CID1611	Coral Jubail Hotel	CID1611	فندق كورال الجبيل	0U38	B-66
CID1612	Passion Fruit	CID1612	فاكهة العاطفة	0U38	A-37
CID1613	Global Insignia for Technical Services	CID1613	شارة عالمية للخدمات الفنية	0U38	E-5
CID1614	Mandy Al-Reef	CID1614	ماندي الريف	0U38	A-21
CID1615	Dr. AlNaamy Specialist Hospital (ASH)	CID1615	مستشفى الدكتور النعامي التخصصي (ASH)	0U38	B-19
CID1616	First Choice	CID1616	الخيار الأول	0U38	D-22
CID1617	Tarteel Perfumes	CID1617	عطور تارتيل	0U38	B-24
CID1618	Pinoy Supermarket	CID1618	Pinoy سوبر ماركت	0U38	E-37
CID1619	Falafel	CID1619	فلافل	0U38	B-11
CID162	Collection Center	CID162	مركز التحصيل	0U38	C-19
CID1620	Muallem Falafel	CID1620	المعلم فلافل	0U38	F-37
CID1621	Madlouh	CID1621	مدلوح	0U38	D-31
CID1622	Rayhan	CID1622	ريحان	0U38	null
CID1623	Mayada Restaurant	CID1623	مطعم Mayada	0U38	F-43
CID1624	Golden Leaf	CID1624	الورقة الذهبية	0U38	B-51
CID1625	The Egyptian World Foods	CID1625	ذا ميجيجي وورلد فودز	0U38	F-18
CID1626	The Grill Hut	CID1626	ذا جريل هت	0U26	F-16
CID1627	Raed Telecom	CID1627	رائد للإتصالات	0U38	A-24
CID1628	Shabi Restaurant	CID1628	مطعم شابي	0U38	E-42
CID1629	Modhesh	CID1629	مدهش	0U38	D-30
CID163	Cool Jeans	CID163	جينز بارد	0U38	A-58
CID1630	Kabsah Hasawiah	CID1630	كبسة حساوية	0U38	A-76
CID1631	Faraby	CID1631	فاربي	0U26	null
CID1632	Flower Store	CID1632	محل الزهور	0U38	F-46
CID1633	Mandi Express	CID1633	ماندي اكسبريس	0U38	A-67
CID1634	Flower Foam Car Care	CID1634	زهرة رغوة العناية بالسيارات	0U38	A-73
CID1635	Saudi German Hospital	CID1635	المستشفى السعودي الألماني	0U38	A-49
CID1636	Brite Laundry	CID1636	غسيل برايت	0U38	null
CID1637	Zainuddin	CID1637	زين الدين	0U38	A-60
CID1638	Milh wa Qablah	CID1638	مالح وقبلة	0U38	F-47
CID1639	Reef Janob	CID1639	ريف جانوب	00U8	F-47
CID164	Corniche Shopping Center	CID164	مركز تسوق الكورنيش	0U38	B-14
CID1640	Bariqah Shariqa	CID1640	بارقة شارقة	0U38	F-13
CID1641	Covers	CID1641	يغطي	0U38	null
CID1643	Naklah	CID1643	نكلة	0U38	B-29
CID1644	Layan Place	CID1644	ليان بليس	0U38	B-27
CID1645	Fish Bags	CID1645	أكياس السمك	0U38	null
CID1646	Spical Bakery	CID1646	مخبز Spical	0U38	A-62
CID1647	Warid	CID1647	وارد	0U38	D-1
CID1648	Vitamin Palace	CID1648	قصر فيتامين	00U2	A-54
CID1649	Kasra Khoboz	CID1649	كسرى خبوز	0U38	A-62
CID165	Crispy Meal	CID165	وجبة كرسبي	0U38	A-61
CID1650	Bubbles	CID1650	الفقاقيع	0U38	A-71
CID1651	Spicy Fried	CID1651	سبايسي فرايد	0U38	F-47
CID1652	Scale	CID1652	مِيزَان	0U38	B-60
CID1653	AlSafron	CID1653	الصفرون	0U38	null
CID1654	Alshasha phone	CID1654	هاتف الشاشة	0U38	B-24
CID1655	Raneem Phone	CID1655	هاتف رنيم	0U38	null
CID1656	Kibdah Hijazi	CID1656	كبدة حجازي	0U38	A-67
CID1657	Masoob	CID1657	معصوب	0U38	A-8
CID1658	Mohammed Mabyoq	CID1658	محمد مبيوق	0U38	null
CID1659	Melt Chocolate	CID1659	تذوب الشوكولاتة	0U38	D-1
CID166	Crystalat	CID166	كريستال	0U38	C-2
CID1660	Taam Coffee	CID1660	قهوة تام	0U38	A-64
CID1661	Makan Store	CID1661	متجر مكان	0U38	A-74
CID1662	Zero Three Resturant	CID1662	مطعم زيرو ثري	0U38	A-71
CID1663	Shateraty	CID1663	شاطراتي	0U38	D-21
CID1664	Brother Taest	CID1664	الأخ تاست	0U38	E-7
CID1665	Fanar Medical Center	CID1665	مركز الفنار الطبي	0U38	A-65
CID1666	Nathree Resturant	CID1666	مطعم ناثري	0U38	B-29
CID1667	Layali Keef	CID1667	ليالي كيف	00U8	A-63
CID1668	Shakir Restrant	CID1668	شاكر ريسترانت	0U38	B-20
CID1669	Arzaq Online	CID1669	أرزاق أون لاين	0U38	null
CID167	Dahan Shopping Center	CID167	مركز دهان للتسوق	0U38	A-80
CID1670	Locast Oil	CID1670	زيت لوكاست	0U38	B-77
CID1671	Romoz Phone	CID1671	هاتف Romoz	0U38	B-24
CID1672	Sharq Wool Factory	CID1672	مصنع شرق للصوف	0U38	D-1
CID1673	Lavender	CID1673	اللافندر	0U38	B-60
CID1674	T-shirt bag	CID1674	حقيبة تي شيرت	0U38	null
CID1675	Pre-Choice	CID1675	الاختيار المسبق	0U38	null
CID1677	Falafel In and Out	CID1677	فلافل داخل وخارج	0U38	B-27
CID1678	Almaedah	CID1678	المائدة	0U38	null
CID1679	Burger Nook	CID1679	برجر نوك	0U38	B-27
CID168	Dahiya Eastern Shopping Center	CID168	مركز الضاحية الشرقي للتسوق	0U38	B-67
CID1680	Khayal Bookstore	CID1680	مكتبة خيال	0U38	D-5
CID1681	Baba Hammad	CID1681	بابا حماد	0U38	A-63
CID1682	Clean Car	CID1682	سيارة نظيفة	0U38	B-23
CID1683	Wadi Maysan	CID1683	وادي ميسان	0U38	A-63
CID1684	Naqsa Holo Malih	CID1684	نقصا حلو مليح	0U38	A-63
CID1685	Rose Avenu	CID1685	روز أفينو	0U38	null
CID1686	Tag Resturant	CID1686	مطعم العلامة	0U38	F-47
CID1687	Victoria	CID1687	فيكتوريا	0U38	B-29
CID1688	Sama Bahrain	CID1688	سما البحرين	0U38	A-60
CID1642	Sufrah Taam	CID1642	سفرة طعام	0U38	B-80
CID1689	Arzaq	CID1689	أرزاق	0U38	B-65
CID169	Daiji Shopping Center	CID169	مركز دايجي للتسوق	0U38	A-2
CID1690	Vaporz Lounge	CID1690	فابروز لاونج	0U38	B-29
CID1691	Turath Al-Hadramy Resturant	CID1691	مطعم تراث الحضرمي	0U38	A-60
CID1692	Falafe Demashq	CID1692	فلافي دمشق	0U38	A-6
CID1693	Jalsat Dar	CID1693	جلسات دار	0U38	A-74
CID1694	Beano Bake House	CID1694	بينو بيك هاوس	0U38	B-29
CID1695	Mazaya Car Wash	CID1695	مزايا غسيل السيارات	0U38	null
CID1696	Dragon Vilage	CID1696	التنين فيلاج	0U38	D-1
CID1697	Florate	CID1697	فلورات	0U38	D-21
CID1698	Bahrain plain	CID1698	سهل البحرين	0U38	null
CID1699	Mawalstar Restaurant	CID1699	مطعم موالستار	0U38	A-70
CID170	Dammam Clothes and Shoes	CID170	الدمام للملابس والأحذية	0U38	F-5
CID1700	Daliya Perfume	CID1700	عطر الداليا	0U38	F-44
CID1701	mashawi Hamawyah	CID1701	مشوي حماوية	0U38	A-70
CID1702	Hermony Resurant	CID1702	هيرموني ريسورانت	0U38	null
CID1703	Stanford Medical	CID1703	ستانفورد الطبية	0U38	A-70
CID1704	Mr.Sandwich (Bahrain)	CID1704	مستر ساندويتش (البحرين)	0U38	B-28
CID1705	Signature Factory	CID1705	مصنع سيجنتشر	0U38	B-69
CID1706	Classy Gallery	CID1706	معرض أنيق	0U38	B-49
CID1707	Juice Factory	CID1707	مصنع العصائر	0U38	B-31
CID1708	Mulhim Plas	CID1708	موليم بلاس	0U38	null
CID1709	Kharob Bashs	CID1709	خروب باشس	0U38	A-74
CID171	Dammam Palace Hotel	CID171	فندق قصر الدمام	0U38	A-50
CID1710	Nafza Lak	CID1710	نفزة لاك	0U38	B-69
CID1711	Samer Al-Ali Trading Est.	CID1711	مؤسسة سامر العلي التجارية	0U38	D-18
CID1712	Nahar Dijla	CID1712	نهار دجلة	0U38	F-1
CID1713	Salman Sweets	CID1713	حلويات سلمان	0U26	A-22
CID1714	Pista	CID1714	بيستا	0U38	B-30
CID1715	Jumla Online	CID1715	جملة أون لاين	0U38	B-28
CID1716	Sarah Sweet	CID1716	سارة سويت	0U38	B-68
CID1717	Suhail Carwash	CID1717	سهيل لغسيل السيارات	0U38	E-16
CID1718	Waseem Restaurant	CID1718	مطعم وسيم	00U8	A-64
CID1719	Jubail	CID1719	الجبيل	0U38	null
CID172	Dammam Shopping Center	CID172	مركز تسوق الدمام	0U38	B-25
CID1720	Sweet Juice	CID1720	عصير حلو	0U38	A-77
CID1721	House Of Supllements	CID1721	بيت السوبليمنتس	0U38	F-1
CID1722	Dr. Drink	CID1722	دكتور درينك	0U38	B-28
CID1723	Dukkan Laila	CID1723	دكان ليلى	0U38	null
CID1724	MHD Adhuhan	CID1724	MHD Adhuhan	0U38	B-80
CID1725	Dolma	CID1725	دولما	0U38	A-63
CID1726	Reef Carwash	CID1726	ريف كارواش	0U38	B-23
CID1727	Mona Bahrain	CID1727	منى البحرين	0U38	B-80
CID1728	Abaya Bushiah	CID1728	عباية بوشية	0U38	A-29
CID1729	ZM	CID1729	ZM	0U38	B-59
CID173	Damond	CID173	داموند	0U38	B-44
CID1730	Sweet Home	CID1730	سويت هوم	0U38	E-40
CID1731	Dubai Discount Palace (Dammam)	CID1731	قصر دبي ديسكونت (الدمام)	0U38	F-38
CID1732	Amasina Trading Corporation	CID1732	شركة أماسينا التجارية	0U38	B-78
CID1733	You Me	CID1733	أنت أنا	0U38	A-29
CID1734	Karaca Home	CID1734	كاراجا هوم	0U38	E-12
CID1735	Rasasi	CID1735	الرصاصي	0U38	A-36
CID1736	Family Sweets	CID1736	حلويات عائلية	0U38	F-14
CID1737	Lozo	CID1737	لوزو	0U38	F-6
CID1738	Golden Chicken	CID1738	دجاج ذهبي	0U38	B-34
CID1739	Dessert Hub Trading	CID1739	حلويات هب للتجارة	0U26	null
CID174	Al-Dana Resturant	CID174	مطعم الدانة	0U38	D-6
CID1740	Smile Candy	CID1740	ابتسامة كاندي	0U38	B-33
CID1741	Healthy Style	CID1741	أسلوب صحي	0U38	B-25
CID1742	Markaz Riyadh (RMN)	CID1742	مركز الرياض (RMN)	0U38	F-1
CID1743	Harmony Food	CID1743	هارموني فود	0U38	A-8
CID1744	Mesob Engineering	CID1744	هندسة ميسوب	0U38	A-8
CID1745	Moamal Pharmacy	CID1745	صيدلية مؤمل	0U38	A-8
CID1746	Zainab Muabber	CID1746	زينب معبر	0U38	A-8
CID1747	Nessma Corner Trading	CID1747	ركن نسمة للتجارة	0U38	A-8
CID1748	Nawal Coldstore	CID1748	نوال كولدستور	0U38	A-8
CID1749	Thouq	CID1749	ثوق	0U38	A-8
CID175	Danger	CID175	خطر	0U38	F-17
CID1750	Lahza Restaurant	CID1750	مطعم لحظة	0U38	A-14
CID1751	Smoke House	CID1751	بيت الدخان	0U38	B-32
CID1752	Platinum	CID1752	بلاتين	0U38	B-32
CID1753	Bent Al-Nor	CID1753	بنت النور	0U38	B-32
CID1754	Hatam	CID1754	حاتم	0U38	B-12
CID1755	Mowasir Center	CID1755	مركز الواسر	0U38	A-14
CID1756	Rocon Trading	CID1756	روكون للتجارة	0U26	B-32
CID1757	Ghanam Va Ghanam	CID1757	غنام فا غنام	0U38	B-33
CID1758	Smart Application	CID1758	تطبيق ذكي	0U38	A-14
CID1759	Life Laundry	CID1759	غسيل الحياة	0U38	A-14
CID176	Dar Restaurant	CID176	مطعم دار	0U38	B-51
CID1760	Watco	CID1760	واتكو	0U38	A-74
CID1761	Violeta	CID1761	فيوليتا	0U38	A-14
CID1762	Saffron House	CID1762	بيت الزعفران	0U38	B-34
CID1763	Banana Band	CID1763	فرقة الموز	0U38	A-14
CID1764	Malhamath Fares	CID1764	مالهاماث فارس	0U38	A-17
CID1765	Pawn Coffee	CID1765	قهوة بيدق	0U38	A-18
CID1766	Mesk Health Pharmacy	CID1766	صيدلية مسك الصحية	0U38	A-14
CID1767	Oxygen	CID1767	أكسجين	0U38	A-18
CID1768	Mulhim Auto	CID1768	مولهيم أوتو	0U39	A-13
CID1769	Gasal Restaurant (Red)	CID1769	مطعم جسال (أحمر)	0U38	E-41
CID177	Darul Khaleej	CID177	دار الخليج	0U38	B-41
CID1770	Gazzal Restaurant (Green)	CID1770	مطعم غزال (أخضر)	0U38	E-41
CID1771	Hussain Kitchen	CID1771	مطبخ حسين	0U38	A-15
CID1772	Fateratak	CID1772	فطراتك	0U38	E-36
CID1773	Malak For Birds	CID1773	ملك للطيور	0U38	E-38
CID1774	Andalus For Make-up	CID1774	الأندلس للمكياج	0U38	A-18
CID1775	Matnokh	CID1775	متنوخ	0U38	A-50
CID1776	Kadehm	CID1776	كاظم	0U38	F-46
CID1777	Salim	CID1777	سالم	0U38	null
CID1778	Day And Night Supermarket	CID1778	سوبر ماركت ليلا ونهارا	0U38	E-36
CID1779	Bait Al Shamel	CID1779	بيت الشامل	0U26	null
CID178	Desert Designs	CID178	تصاميم الصحراء	0U38	B-69
CID1780	Ctrl P	CID1780	Ctrl P	0U38	E-36
CID1781	Barakat Supermarket	CID1781	بركات سوبر ماركت	0U38	A-18
CID1782	Khaleeji Restaurant	CID1782	مطعم الخليجي	0U38	B-49
CID1783	Technology Bakeries	CID1783	مخابز التكنولوجيا	0U38	B-52
CID1784	Family Imprint Discounts	CID1784	خصومات البصمة العائلية	0U38	F-4
CID1785	Silat Al-Tawfeer	CID1785	سيلة التوفير	0U26	null
CID1786	Nukbah	CID1786	النكبة	00U8	B-64
CID1787	Rawnaq Medical Center	CID1787	مركز رونق الطبي	0U38	A-28
CID1788	Sushi Gallery	CID1788	معرض السوشي	0U38	D-20
CID1789	Moltea Cookies	CID1789	بسكويت مولتيا	0U38	B-64
CID179	Desert Mall	CID179	ديزرت مول	0U38	A-21
CID1790	Nadeen Fashion	CID1790	أزياء نادين	0U38	A-4
CID1791	Family And Friends	CID1791	العائلة والأصدقاء	0U38	null
CID1792	La Vallee	CID1792	لا فالي	0U38	B-51
CID1793	Barakat Malabis	CID1793	بركات ملابس	0U38	E-16
CID1794	Specialist Juice	CID1794	عصير متخصص	0U38	B-14
CID1795	Noon	CID1795	الظهيرة	0U38	F-43
CID1796	International Colors	CID1796	ألوان عالمية	0U38	null
CID1797	Tahifah	CID1797	الطهيفة	0U38	D-27
CID1798	Sobya King	CID1798	سوبيا كينج	0U38	A-4
CID1799	East Sweets	CID1799	حلويات الشرق	0U38	D-0
CID180	Dharan Pharmacy	CID180	صيدلية داران	0U38	B-25
CID1800	Manarat Al-Nader Medical Pharmacy	CID1800	صيدلية منارة النادر الطبية	0U38	D-0
CID1801	Amana Al Sharkiah	CID1801	أمانة الشركية	0U38	A-46
CID1802	Lord Charcoal	CID1802	اللورد فحم	0U38	A-9
CID1803	Shake Sushi	CID1803	شيك سوشي	0U38	A-4
CID1804	Ghadah Exchange	CID1804	غادة للصرافة	0U38	null
CID1805	Millennialeer	CID1805	جيل الألفية	0U38	A-4
CID1806	Fursan Al-Fakhama	CID1806	فرسان الفخمة	0U38	B-50
CID1807	Star Sweet	CID1807	ستار سويت	0U38	A-53
CID1808	Nawals Kitchen	CID1808	مطبخ نوالس	0U38	B-51
CID1809	Bogsha Visitor	CID1809	زائر بوغشا	0U38	E-20
CID181	DH Plaza	CID181	دي إتش بلازا	0U26	D-24
CID1810	Bader Style	CID1810	أسلوب بدر	0U38	null
CID1811	Vape City	CID1811	مدينة فيب	0U38	B-77
CID1812	Khyrat	CID1812	خيرات	0U38	F-3
CID1813	Fish Basket	CID1813	سلة السمك	0U26	A-49
CID1814	Wahat Al-Quds Pharmacy	CID1814	صيدلية واحة القدس	0U38	E-20
CID1815	OFFSIDE	CID1815	تسلل	0U38	A-48
CID1816	Nakhat Broasted	CID1816	نخت بروستد	00U8	B-53
CID1817	Abduljaleel Al-Musabeh Nuts	CID1817	عبدالجليل المصبح مكسرات	0U38	F-3
CID1818	Chinese	CID1818	الصينية	0U26	null
CID1819	Enabi Grill Restaurant	CID1819	مطعم عنابي جريل	0U26	null
CID182	Dinar	CID182	دينار	0U38	A-36
CID1820	East Lights	CID1820	الأضواء الشرقية	0U38	E-30
CID1821	Shear Tawfir	CID1821	القص التوفير	0U38	E-30
CID1822	Kaaf Humanitarian	CID1822	كاف للخدمات الإنسانية	0U38	B-9
CID1823	Sharq Al Wadi Trading Establishment	CID1823	مؤسسة شرق الوادي التجارية	0U38	B-51
CID1824	Sikkat Karak	CID1824	سكات كرك	0U38	B-64
CID1825	Operation and Maintenance Management in Taif	CID1825	إدارة التشغيل والصيانة في الطائف	0U38	null
CID1826	SAF	CID1826	SAF	0U38	A-43
CID1827	ITS	CID1827	الآيات	0U38	E-1
CID1828	X-Ray	CID1828	الأشعة السينية	0U38	E-30
CID1829	Dukhan Falafel	CID1829	دخان فلافل	0U38	B-34
CID183	Discount Center	CID183	مركز الخصم	0U38	A-38
CID1830	Book Sweet Book	CID1830	Book Sweet Book	0U38	E-3
CID1831	SOL	CID1831	سول	0U38	E-1
CID1832	Grape Leaves And More	CID1832	ورق العنب والمزيد	0U38	E-1
CID1833	Zankil	CID1833	زنكيل	0U38	A-49
CID1834	Dawood Al Najar	CID1834	داوود النجار	0U38	null
CID1835	Hala Majles	CID1835	مجلس هلا	0U38	A-49
CID1836	Ear Techno	CID1836	تكنو الأذن	0U38	null
CID1837	Ayam Zaman	CID1837	أيام زمان	0U38	E-41
CID1838	Candy Shop	CID1838	متجر الحلوى	0U38	E-1
CID1839	Top Shoes	CID1839	توب شوز	0U38	E-1
CID184	Divakaran International Group of Companies	CID184	مجموعة شركات ديفاكاران الدولية	0U38	null
CID1840	Egyptian Bread	CID1840	خبز مصري	0U38	A-2
CID1841	AM Al-Khalifa	CID1841	عبد اللطيف آل خليفة	0U38	D-26
CID1842	White Line	CID1842	الخط الأبيض	0U38	A-48
CID1843	Care Line Pharmacy	CID1843	صيدلية كير لاين	0U38	A-43
CID1844	ABA	CID1844	ابا	0U26	D-0
CID1845	Magic Clean	CID1845	ماجيك كلين	0U38	null
CID1846	Otto Care	CID1846	أوتو كير	0U38	A-3
CID1847	Nana Jiuce	CID1847	نانا جيوسي	0U26	A-2
CID1848	Avon Café	CID1848	مقهى أفون	0U38	A-48
CID1849	Color of Life	CID1849	لون الحياة	0U38	A-3
CID185	Diafa Broasted	CID185	ديافا بروستد	0U38	B-54
CID1850	Dr. Health	CID1850	دكتور هيلث	0U38	A-2
CID1851	Best Touch Car Wash	CID1851	أفضل غسيل سيارات يعمل باللمس	0U38	A-43
CID1852	Tile Clips	CID1852	مقاطع البلاط	0U38	A-41
CID1853	Red Wings	CID1853	أجنحة حمراء	0U38	E-1
CID1854	Charity Neighborhood Pharmacy	CID1854	صيدلية الحي الخيري	0U38	A-3
CID1855	Baba	CID1855	بابا	00U8	A-2
CID1856	Gardenias Hokail	CID1856	جاردينياس هوكيل	0U38	A-3
CID1857	Arif	CID1857	عارف	0U38	E-30
CID1858	Swedan	CID1858	السويد	0U38	null
CID1859	Le Lieu	CID1859	لو ليو	0U38	A-9
CID186	Dossary Al-Darwesh Bakery	CID186	مخبز دوسري الدرويش	0U38	B-60
CID1860	Elikee	CID1860	إليكي	0U38	A-48
CID1861	Wedge	CID1861	اسفين	0U38	A-41
CID1862	Adjustable Pliers	CID1862	كماشة قابلة للتعديل	0U38	A-41
CID1863	Milma	CID1863	ميلما	0U38	A-42
CID1864	Fuel Juice	CID1864	عصير الوقود	0U38	null
CID1865	Naemi	CID1865	النعيمي	0U26	null
CID1866	Boshiah and Sala	CID1866	بوشيا وسالا	0U38	A-3
CID1867	Williams And Tobacco	CID1867	ويليامز والتبغ	0U38	A-48
CID1868	Big Best	CID1868	بيج بيست	0U38	A-43
CID1869	Bazuriyah	CID1869	الزورية	0U38	E-2
CID187	Dossary Food Stuff	CID187	دوساري المواد الغذائية	0U38	B-60
CID1870	Yummy Cookies	CID1870	ملفات تعريف الارتباط اللذيذة	0U38	A-8
CID1871	Rashaqa Market	CID1871	سوق رشقة	0U38	A-51
CID1872	Nahj Al Qalam Stationary Library	CID1872	مكتبة نهج القلم القرطاسية	0U38	Box 2
CID1874	Beverly Dunots	CID1874	بيفرلي دونوتس	0U38	null
CID1875	Diamond Grills	CID1875	المشاوي الماسية	0U26	null
CID1876	AHK	CID1876	AHK	0U38	Box 3
CID1877	Faham Noor	CID1877	فهام نور	0U38	B-10
CID1878	Venus Café	CID1878	فينوس كافيه	0U38	Box 1
CID1879	Marsa AlBalad	CID1879	مرسى البلد	0U38	Box 4
CID188	Dream Meal	CID188	وجبة الأحلام	0U38	B-20
CID1880	Jinan Sweet	CID1880	جينان سويت	0U38	D-17
CID1881	Nabisaleh	CID1881	نبيصالح	0U38	D-0
CID1882	Perfect Level Master	CID1882	مستوى مثالي	0U38	Box - 3
CID1883	Markas Al-Arif	CID1883	ماركاس العارف	00U8	null
CID1884	Nights And Roses	CID1884	ليالي وورود	0U38	B-33
CID1886	Muthain Fakher Dubai	CID1886	مثين فاخر دبي	00U8	A-44
CID1887	Wafi Carwash	CID1887	وافي للغسيل	0U38	null
CID1888	The Egyptian World Food	CID1888	الغذاء العالمي المصري	0U38	F-18
CID1889	Tarouti	CID1889	الطروطي	0U38	B-29
CID189	Dream World	CID189	عالم الأحلام	0U38	B-19
CID1890	Victoria Perfumes And Cosmetics	CID1890	فيكتوريا للعطور ومستحضرات التجميل	0U38	null
CID1891	Price House (Al-Shamel)	CID1891	برايس هاوس (الشامل)	0U38	null
CID1892	Ankawa Iraqi	CID1892	عنكاوا العراقية	0U38	Box 3
CID1893	Shrimpy	CID1893	جمبري	0U38	A-14
CID1894	Sallat Jerash	CID1894	صلات جرش	0U38	A-29
CID1895	HAC	CID1895	HAC	0U38	B-14
CID1896	Eighty Eight Sweets And Juices	CID1896	ثمانية وثمانون حلويات وعصائر	0U38	A-48
CID1897	Aroos Al-Bahrain Jewellery	CID1897	مجوهرات عروس البحرين	0U38	null
CID1898	ACIC	CID1898	ACIC	0U38	null
CID1899	Raei Pharmacy	CID1899	صيدلية الرعي	0U38	null
CID190	DT	CID190	دي تي	0U38	A-72
CID1900	Saudi Deisel Equipment	CID1900	معدات ديزل السعودية	0U26	E-38
CID1901	Healthy Food	CID1901	طعام صحي	0U38	null
CID1902	Anwar Al-Botor	CID1902	أنور البتور	0U38	Box 3
CID1903	Mobile Store	CID1903	متجر الجوال	0U38	B-53
CID1904	Kokoro	CID1904	كوكورو	0U38	A-29
CID1905	Moon Shadow	CID1905	ظل القمر	0U38	B-61
CID1906	Shawarma 5	CID1906	شاورما 5	0U38	B-64
CID1907	BKS	CID1907	BKS	0U26	A-30
CID1908	Jawda Restaurant	CID1908	مطعم جودة	0U38	A-30
CID1909	Seema Fashion	CID1909	سيما فاشون	0U26	Box-1
CID191	Dudu Fashion	CID191	دودو فاشون	0U38	A-36
CID1910	Madad Shopping Center	CID1910	مركز مدد للتسوق	0U38	A-33
CID1911	Khan Ryhan	CID1911	خان ريحان	0U38	Box - 1
CID1912	Mayar Supermarket	CID1912	ميار سوبر ماركت	0U38	null
CID1913	Crystal Paper	CID1913	ورق كريستال	0U26	null
CID1914	Shawarma Madena	CID1914	شاورما مدينة	00U8	A-30
CID1915	Sollér	CID1915	سولير	0U38	Box - 1
CID1916	Wadi Al-Siraj	CID1916	وادي السراج	0U38	A-31
CID1917	Mezzah	CID1917	مزة	0U38	A-30
CID1918	Shahi Chicken	CID1918	شاهي دجاج	00U2	null
CID1919	Raey Samak	CID1919	راي سماك	00U8	null
CID192	East n West Restaurant	CID192	مطعم إيست إن ويست	0U38	B-55
CID1920	Manaret Al-Haramain Pharmacy	CID1920	صيدلية منارة الحرمين	0U26	E-23
CID1921	Dental Eastern Smiles Lab	CID1921	مختبر الابتسامات الشرقية لطب الأسنان	0U38	null
CID1922	Renewed	CID1922	مجدد	0U38	null
CID1923	Fanoos	CID1923	فانوس	0U26	Box - 1
CID1873	Mohamiz Coffee	CID1873	قهوة محمص	00U8	A-44
CID1924	Asida And Maraq	CID1924	أسيدا ومرق	0U38	Box 2
CID1925	Taib Tazaj New	CID1925	طيب تزاج جديد	0U38	null
CID1927	Qufa Resturant	CID1927	مطعم قوفا	0U38	B-53
CID1928	Boudl Hotels	CID1928	فنادق بودل	0U38	Box - 3
CID1929	Pinjab Sweet	CID1929	بنجاب سويت	0U26	null
CID193	Eastern Gulf Factory	CID193	مصنع الخليج الشرقي	0U38	B-75
CID1930	Ibn Zohir Clince	CID1930	ابن زهير كلينس	0U38	null
CID1931	the Palm Coffe	CID1931	قهوة النخيل	0U38	A-36
CID1932	Ayar Flower	CID1932	زهرة عيار	0U38	null
CID1933	Detective Store	CID1933	متجر المباحث	0U38	A-33
CID1934	Noor Charcoal New	CID1934	نور فحم جديد	0U38	null
CID1935	Farooj AbuAbed	CID1935	فروج أبو عابد	0U39	A-66
CID1936	Fatheerath Shawarma	CID1936	شاورما فتحات	0U38	A-18
CID1937	The Big Boss	CID1937	الزعيم الكبير	0U38	A-33
CID1938	Ezz Trading Establishment	CID1938	مؤسسة عز التجارية	0U38	Box 2
CID1939	Mahafil Al Mesk	CID1939	مهافيل المسك	0U38	F-16
CID194	Eastern Pillow	CID194	وسادة شرقية	0U38	D-29
CID1940	Tripper Inn	CID1940	تريبر إن	0U38	D-20
CID1941	Makhtaba AlMugtama	CID1941	مختبى المغتمى	0U38	E-38
CID1942	Choco Crepe And Coffee	CID1942	كريب شوكو و قهوة	0U38	A-33
CID1943	Asatir AlFarah	CID1943	أساطير الفرح	0U38	A-33
CID1944	Punjab Sweets	CID1944	حلويات البنجاب	0U38	A-36
CID1945	Taxi Shawarma	CID1945	تاكسي شاورما	00U8	A-36
CID1946	Zaitoon	CID1946	زيتون	0U26	A-38
CID1947	Bofiya Nasayim Harref	CID1947	بوفية نسيم حريف	00U8	B-55
CID1948	Bandary Al-Khaleej Supermarket	CID1948	باندري الخليج سوبر ماركت	00U2	B-56
CID1949	0.25	CID1949	0.25	0U38	Box - 1
CID195	Eat n Pack Restaurant	CID195	مطعم ايت اند باك	0U38	A-23
CID1950	Lamsah Hand	CID1950	لمسة هاند	0U38	null
CID1951	AHL Al Zainabiya Grocery	CID1951	بقالة AHL الزينبية	00U2	E-10
CID1952	Maiz	CID1952	ميز	0U38	Box 1
CID1953	Star Charcoal	CID1953	نجمة الفحم	0U38	Box 3
CID1954	Madadi	CID1954	مدادي	0U26	null
CID1955	Shine Dental Lab	CID1955	مختبر شاين لطب الأسنان	0U38	null
CID1956	Sanabel Al-Shouk Bakery	CID1956	مخبز سنابل الشوك	0U38	Box 4
CID1957	Gosto De Café	CID1957	جوستو دي كافيه	0U39	Box 1
CID1958	Abaya Althuraya	CID1958	عباية الثريا	0U38	B-8
CID196	Ekhtiar Hadaek	CID196	إختيار هدائق	0U38	A-68
CID1961	Roma Castle	CID1961	قلعة روما	00U2	null
CID1962	Kabsa wa Ibdam	CID1962	كبسة وعبدام	0U39	Box 1
CID1963	Shawarma Mama	CID1963	شاورما ماما	0U38	null
CID1964	Modawir Cafeteria	CID1964	كافيتريا مدوار	0U38	Box 1
CID1965	Nahar Markets	CID1965	أسواق النهار	0U38	Box 2
CID1966	Shalimar Restaurant	CID1966	مطعم شاليمار	0U38	B-67
CID1968	Rivan Restaurant	CID1968	مطعم ريفان	0U38	null
CID1969	Beach Gate Grocery	CID1969	بقالة بيتش جيت	0U38	Box 1
CID197	Electronovation	CID197	التجديد الكهربائي	0U38	E-4
CID1970	Healthy Yard	CID1970	ساحة صحية	0U38	Box - 1
CID1971	Baking Time	CID1971	وقت الخبز	0U26	Box 4
CID1972	FAL Paper	CID1972	ورق FAL	0U26	null
CID1973	The Green Coral	CID1973	المرجان الأخضر	0U38	Box 1
CID1974	Grapeleaf	CID1974	العنب	0U38	Box - 2
CID1975	Qaisoom	CID1975	قيسوم	0U38	Box 3
CID1976	Fit Food Restaurant	CID1976	مطعم فيت فود	00U2	Box 1
CID1977	Eighty Eight Car Wash	CID1977	ثمانية وثمانون غسيل سيارات	0U38	Box 4
CID1978	Jamal	CID1978	جمال	0U38	null
CID1979	O Café	CID1979	أو مقهى	0U38	Box 1
CID198	Elegenc Corner	CID198	ركن إليجنك	0U38	F-8
CID1980	Sif World Pastry	CID1980	سيف وورلد المعجنات	0U38	Box 2
CID1982	Echarp	CID1982	إتشارب	0U38	Box 4
CID1983	Carpet	CID1983	سجادة	0U38	Box 1
CID1984	Vape Smog	CID1984	الضباب الدخاني	0U38	Box 1
CID1985	Crep House	CID1985	كريب هاوس	0U38	Box 1
CID1986	Rai Samak	CID1986	راي سماك	0U38	Box 2
CID1987	Anseef Restaurant	CID1987	مطعم أنصيف	0U40	Box - 3
CID1988	Hakuna Matata	CID1988	هاكونا ماتاتا	0U38	Box 2
CID1989	Dar Zaina	CID1989	دار زينة	0U38	Box 4
CID199	Elmia Bookstore	CID199	مكتبة الميا	0U38	D-27
CID1990	Shawarma Dolma	CID1990	شاورما دولما	0U38	Box 2
CID1991	We Care Hospirtal	CID1991	نحن نهتم بالمستنقف	00U8	B-62
CID1992	Maaliq	CID1992	المالك	0U39	Box - 1
CID1993	Hodhod World	CID1993	عالم هدهد	0U38	Box 4
CID1994	Set AlSham	CID1994	ست الشام	00U8	Box 4
CID1995	Gulf Bridge Laboratory	CID1995	مختبر جسر الخليج	0U26	D-30
CID1996	Baba Bakers Sweets	CID1996	حلويات بابا بيكرز	0U26	Box 3
CID1997	Cavolo	CID1997	كافولو	0U40	Box 3
CID1998	Reyooq Café	CID1998	مقهى ريوق	0U40	Box 4
CID1999	Khafji	CID1999	الخفجي	0U38	null
CID200	Elya	CID200	إيليا	0U38	B-11
CID2000	Seeds Salad	CID2000	سلطة البذور	0U38	Box 3
CID208	Faham Sanadiyan	CID208	فهام سنديان	0U38	B-41
CID1926	Hazora Shawerma	CID1926	شاورما حزورة	0U38	A-31
CID1967	Fajr Saihat	CID1967	فجر سيهات	0U38	Box - 3
CID1960	Cebu Market	CID1960	سيبو ماركت	0U26	Box 4
CID2001	Almadi Trading Company	CID2001	شركة المادي التجارية	0U38	Box 4
CID2002	Muscle Food	CID2002	طعام العضلات	0U40	null
CID2003	Five Zero Five Connection	CID2003	اتصال خمسة زيرو فايف	0U38	Box - 1
CID2004	Tune Café	CID2004	مقهى تيون	0U39	Box - 1
CID2005	Manar AlHaya Pharmacy	CID2005	صيدلية منار الحياة	0U38	null
CID2006	Cosz Burger	CID2006	كوز برجر	0U39	Box 3
CID2007	Zamil Supply	CID2007	الزامل للتوريد	0U38	Box 4
CID2008	Rowad Al Madar Maintenance Company	CID2008	شركة رواد المدار للصيانة	0U38	Box 2
CID2009	Savings Hall	CID2009	صالة التوفير	0U38	Box 4
CID201	Eman	CID201	إيمان	0U38	B-37
CID2010	Bayda Food Stuff	CID2010	بيضة للمواد الغذائية	00U2	B-41
CID2011	Maimona Restaurant	CID2011	مطعم ميمونة	0U26	Box - 1
CID2012	WAG	CID2012	هز	0U38	null
CID2014	Hayba	CID2014	هيبة	0U39	Box - 3
CID2015	Taka Shawarma	CID2015	تاكا شاورما	0U38	Box - 1
CID2016	Alfa Alkhaleej	CID2016	ألفا الخليج	0U26	null
CID2017	Skeek	CID2017	سكيك	0U39	Box - 1
CID2018	Samoli Bar	CID2018	سامولي بار	0U38	Box - 1
CID2019	Kees Falafel	CID2019	كيس فلافل	0U38	null
CID202	Envelopes and Paper Bag Factory	CID202	مصنع المغلفات والأكياس الورقية	0U38	null
CID2020	Riccis Bakery	CID2020	مخبز ريتشيس	0U38	Box 3
CID2021	Ruwad Al-Madar Maintenance Company	CID2021	شركة رواد مدار للصيانة	0U26	Box 4
CID2022	Litore	CID2022	ليتور	0U38	Box - 3
CID2023	Eva Company for Food Products	CID2023	شركة إيفا للمنتجات الغذائية	0U38	B-72
CID2024	Kareem Restaurant	CID2024	مطعم كريم	0U38	Box - 1
CID2025	Feasible Solutions	CID2025	حلول مجدية	0U38	null
CID2026	Healthy Box	CID2026	صندوق صحي	0U40	Box - 3
CID2027	Naba Alsaha  Pharmacy	CID2027	صيدلية نبأ الساحة	0U38	Box - 1
CID2028	Mohsin	CID2028	محسن	0U38	Box - 3
CID2029	Orjwan Flower	CID2029	زهرة أورجوان	0U38	Box - 1
CID203	ESM Al-Raqui	CID203	ESM الراقي	0U38	B-7
CID2030	Le Chef	CID2030	لو شيف	0U38	Box - 3
CID2031	Shams Al-Zohoor	CID2031	شمس الزهور	0U38	null
CID2032	Sherpa	CID2032	شيربا	0U39	Box - 1
CID2033	Ahyan Fashion	CID2033	أهيان فاشون	0U38	Box - 3, D - 0
CID2034	Bokhari Mobahar (MB)	CID2034	بخاري مبحر (MB)	00U8	Box - 3
CID2035	Sheep #1	CID2035	الأغنام # 1	0U38	null
CID2036	Khaldi	CID2036	الخالدي	0U38	Box - 3
CID2037	Kojo	CID2037	كوجو	00U8	Box - 3
CID2038	Ladna Restaurant And Café	CID2038	مطعم ومقهى لدنا	0U38	Box - 3
CID2039	Mummy	CID2039	مومياء	0U38	Box - 3
CID204	Exhibition	CID204	معرض	0U38	A-78
CID2040	Madah	CID2040	مداح	0U38	Box - 1
CID2041	Bakhshuwan	CID2041	بخشوان	0U38	null
CID2042	Piccolo	CID2042	بيكولو	0U39	Box - 1
CID2043	Taybat Al-Khair	CID2043	طيبة الخير	0U40	null
CID2044	Rumanah Restaurant	CID2044	مطعم رمانة	0U38	null
CID2045	Pharmacy Dose	CID2045	جرعة الصيدلية	0U38	Box 3
CID2046	Donut Corner	CID2046	ركن الدونات	0U40	null
CID2047	Sambosati	CID2047	سامبوستي	0U39	Box - 1
CID2048	Alnoor	CID2048	النور	0U38	Box 1
CID2049	Eclipse	CID2049	كسوف	0U38	Box 1
CID205	Eyadath Al-Haya Al-Sakaniyah (JAC)	CID205	إيياد الحياة السكانية (JAC)	0U38	A-67
CID2050	Moasisat Qamar	CID2050	مشاركات قمر	0U38	null
CID2051	KO Brosted	CID2051	كو بروستد	0U39	Box 1
CID2052	Diet Plan	CID2052	خطة النظام الغذائي	0U39	Box - 3
CID2053	Supplement Time	CID2053	وقت الملحق	0U38	null
CID2054	ALKARAM	CID2054	الكرم	0U38	null
CID2055	Jazz	CID2055	جاز	0U39	Box 1
CID2056	Quma Al-Lahmo	CID2056	قومة اللحمو	00U8	null
CID2057	Rawnd Hotel	CID2057	فندق Rawnd	00U8	E-16
CID2058	Koshari Hend	CID2058	كوشاري هند	0U38	Box-1
CID2059	6 Pack Way	CID2059	6 حزمة طريقة	0U38	Box-1
CID206	F (Marinze)	CID206	F (Marinze)	0U38	C-35
CID2060	MN Trading	CID2060	MN للتجارة	0U38	null
CID2061	Hilal Al-Sharqi	CID2061	هلال الشرقي	0U38	Box - 3
CID2062	Plant	CID2062	نبات	0U38	D-0
CID2063	Nasthi Zero	CID2063	ناشثي زيرو	00U8	Box - 1
CID2064	ASL Al-Bukhari	CID2064	أهل البخاري	0U39	null
CID2065	Razizati	CID2065	رازيزتي	0U39	null
CID2066	Moasisat Al-Aqeel	CID2066	مشاركات العقيل	0U38	null
CID2067	Eileen	CID2067	ايلين	0U39	B-64
CID2068	Wash N Go	CID2068	غسل N Go	0U38	F-10
CID207	Fahad Supplies	CID207	توريدات فهد	0U38	A-18
CID2070	Locate Market	CID2070	تحديد موقع السوق	0U38	Box - 3
CID2071	Bar Code	CID2071	الباركود	00U8	Box - 3
CID2072	Shawarma Barrel	CID2072	شاورما برميل	0U38	Box - 1
CID2073	Century Wedding Center	CID2073	مركز زفاف القرن	0U38	Box - 1
CID2074	Modern Sources Company	CID2074	شركة المصادر الحديثة	0U38	null
CID2075	Legabo	CID2075	ليجابو	0U26	null
CID2076	Siyhad Foodstuff Company	CID2076	شركة سيهاد للمواد الغذائية	0U39	Box - 1
CID2077	Genetic Group	CID2077	المجموعة الوراثية	0U38	Box - 3
CID2078	Tadawi Hospital	CID2078	مستشفى التداوي	0U26	null
CID2079	Natfah	CID2079	نتفاة	0U39	B-49
CID2013	Faroj Al Akabir	CID2013	فروج الاكابر	0U38	Box 4
CID2080	Diet Mix	CID2080	دايت ميكس	0U38	null
CID2081	Falawath Plastic	CID2081	فلواث بلاستيك	0U38	null
CID2082	CDI Products	CID2082	منتجات CDI	0U38	null
CID2083	Turquoise Carwash	CID2083	غسيل السيارات الفيروزي	0U38	null
CID2084	Talat Jabal	CID2084	طلعت جبل	00U8	null
CID2085	Chicken Express	CID2085	دجاج اكسبرس	00U8	null
CID2086	Senparts	CID2086	Senparts	0U38	null
CID2087	Lightech	CID2087	لايتيك	0U38	null
CID2088	Grand Darbar	CID2088	جراند دربار	0U39	null
CID2089	Sixty-Three Auto Spare Parts	CID2089	ثلاثة وستون قطع غيار سيارات	0U38	null
CID209	Faique Fashion	CID209	فايق فاشون	0U38	E-15
CID2090	Mataam Gamar	CID2090	متام جمار	0U38	null
CID2091	Hospitality Palace	CID2091	قصر الضيافة	0U38	null
CID2092	Fariq	CID2092	فارق	00U8	null
CID2093	Shubak Omdah	CID2093	شوبك أمدة	0U38	null
CID2094	Zad AL Bahrain	CID2094	زاد البحرين	0U38	null
CID2095	Dakah Sport	CID2095	دكة سبورت	0U38	null
CID2096	Takyah Sheef	CID2096	تقية شيف	00U8	null
CID2097	Khobs Masah Matwe	CID2097	خوبس ماساه ماتوي	0U38	null
CID2098	Toasters	CID2098	المحامص	0U38	null
CID2099	Sowailah	CID2099	سويلة	0U38	null
CID210	Fairmart Supermarket	CID210	فيرمارت سوبر ماركت	0U38	A-11
CID2100	Mr. Diet	CID2100	السيد دايت	0U39	null
CID2101	Sikka	CID2101	سكة	0U38	null
CID2102	Riyaah Alsalam Restaurant	CID2102	مطعم رياة السلام	0U38	null
CID2103	Lechy	CID2103	ليتشي	0U39	null
CID2104	Shamel Falafil	CID2104	شامل فلافل	00U8	null
CID2105	Tharaa Bookstore	CID2105	مكتبة ثراء	0U39	null
CID2106	Farooj One	CID2106	فروج ون	0U38	null
CID2107	Jaz	CID2107	جاز	0U39	Box - 1
CID2108	Textile Fabrics	CID2108	أقمشة النسيج	0U38	null
CID2109	Hayat Al-Waraq Factory	CID2109	مصنع حياة الوراق	0U38	null
CID211	Fajar Al-Ebayat	CID211	فجر العبيات	0U38	B-12
CID2110	Bahryat Express	CID2110	البحريات اكسبريس	0U38	null
CID2111	Hala Elhelw	CID2111	هالة الحلو	0U38	null
CID2112	Atyaf Al-Nakhat	CID2112	أطياف النخط	0U38	null
CID2113	Hana	CID2113	هناء	0U38	null
CID2114	Mashtal Al-Ghadeer	CID2114	مشتل الغدير	0U39	null
CID2115	Shawarma Hazwra	CID2115	شاورما هزورا	0U38	null
CID2116	ONS Sweet	CID2116	ONS حلو	0U38	null
CID2117	Grams	CID2117	غرام	0U38	null
CID2118	Multaqa AlRafidain	CID2118	ملتقى الرافدين	0U38	null
CID2119	Salwa	CID2119	سلوى	0U38	null
CID212	Fajar Al-Inara	CID212	فجر العنارا	0U38	B-12
CID2120	Wahat AlHuzr	CID2120	واحات الحصر	0U38	null
CID2121	Khalifa	CID2121	خليفه	0U38	null
CID2122	Expertise	CID2122	الخبره	0U38	null
CID213	Fakhera	CID213	فاخرة	0U38	B-44
CID214	Falah Marketing	CID214	فلاح للتسويق	0U38	A-62
CID215	Family Center	CID215	مركز العائلة	0U38	D-19
CID216	Family Supplies	CID216	مستلزمات الأسرة	0U38	F-18
CID217	Faraj Coldstore	CID217	فرج كولدستور	0U38	B-62
CID218	Fares	CID218	فارس	0U38	E-25
CID219	Fascino	CID219	فاسينو	0U38	C-14
CID220	Fashion On Baseel	CID220	أزياء على بازيل	0U38	E-43
CID221	Fashion Shop (FS)	CID221	متجر الأزياء (FS)	0U38	A-37
CID222	Fast Call (FC)	CID222	مكالمة سريعة (FC)	0U38	B-35
CID223	Fatina	CID223	فاتينا	0U38	D-12
CID224	Fawaz Restaurant	CID224	مطعم فواز	0U38	B-33
CID225	Fawaz Haleej	CID225	فواز حليج	0U38	C-22
CID227	Fayez Al-Qamber Trading Establishment	CID227	مؤسسة فايز القمبر التجارية	0U38	B-60
CID228	Fayum Center	CID228	مركز الفيوم	0U38	F-14
CID229	Feum	CID229	فيم	0U38	D-36
CID230	Fillfilah	CID230	الفيلفيلة	0U38	B-16
CID231	Fionka	CID231	فيونكا	0U38	A-23
CID232	Fire Brigade 998	CID232	فرقة الإطفاء 998	0U38	D-11
CID233	First Lady	CID233	السيدة الأولى	0U38	E-21
CID234	First Shoes (ASH)	CID234	الأحذية الأولى (ASH)	0U38	D-4
CID235	Firuzy Restaurant	CID235	مطعم فيروزي	0U38	B-19
CID236	Five Circle	CID236	خمس دوائل	0U38	F-13
CID237	Five, Ten, Fifteen	CID237	خمسة ، عشرة ، خمسة عشر	0U38	A-68
CID238	Biofood	CID238	الأغذية الحيوية	0U38	A-5
CID239	Four Seasons	CID239	فورسيزونز	0U38	A-70
CID240	Fozan (Hardware)	CID240	فوزان (الأجهزة)	0U38	E-9
CID241	Fozan (Electrical)	CID241	فوزان (كهربائي)	0U38	E-9
CID242	France Scarf (FS)	CID242	وشاح فرنسا (FS)	0U38	B-11
CID243	Free Home Delivery	CID243	توصيل مجاني للمنازل	0U38	B-35
CID244	French Designer	CID244	مصمم فرنسي	0U38	E-15
CID245	Fresh Samboosah	CID245	سمبوسة طازجة	0U38	A-79
CID246	Funel	CID246	فونيل	0U38	F-18
CID247	Fursan Sweets and Nuts	CID247	فرسان حلويات ومكسرات	0U38	F-6
CID248	Future Digital Solutions	CID248	حلول المستقبل الرقمية	0U38	A-50
CID249	Future Science for Electronics	CID249	علم المستقبل للإلكترونيات	0U38	A-19
CID250	Gahwa Al-Arabia (Arabian Coffee)	CID250	قهوة العربية (قهوة عربية)	0U38	F-25
CID251	Ghada (KS)	CID251	غادة (كانساس)	0U38	A-28
CID252	GCC Olayan	CID252	العليان الخليجي	0U38	E-15
CID2123	Test	CID2123	اختبار	null	
CID253	General Dynamics	CID253	الديناميات العامة	0U38	C-27
CID254	General Store	CID254	المتجر العام	0U38	D-0
CID255	Ghader	CID255	غدير	0U38	B-59
CID256	Ghali Yarkhaslak	CID256	غالي يرخسلك	0U38	A-3
CID257	Giant Store	CID257	متجر عملاق	0U38	D-30 & 31
CID258	Gift	CID258	هدية	0U38	F-13
CID259	Gifts Door	CID259	باب الهدايا	0U38	E-44
CID260	Gift House	CID260	بيت الهدايا	0U38	D-0
CID261	Gift World	CID261	عالم الهدايا	0U38	E-16
CID262	Good Morning USA	CID262	صباح الخير الولايات المتحدة الأمريكية	0U26	D-0
CID263	Golden Carwash	CID263	غسيل السيارات الذهبي	0U38	A-24
CID264	Golden Crown	CID264	التاج الذهبي	0U38	A-4
CID265	Golden Fertilizer	CID265	سماد ذهبي	0U38	E-24
CID266	Gosaibi Services	CID266	خدمات القصيبي	0U38	B-47
CID267	Green Fields Fertilzer	CID267	جرين فيلدز فرتيلزر	0U38	D-22
CID268	Green Tea	CID268	شاي أخضر	0U38	A-52
CID269	Green Wings	CID269	أجنحة خضراء	0U38	B-63
CID270	Gulf Metro	CID270	مترو الخليج	0U38	C-0
CID271	Gulf Samposa	CID271	سمبوسا الخليج	0U38	B-75
CID272	Gulf Uniform	CID272	الزي الخليجي	0U38	B-18
CID273	Hababah Fashions	CID273	أزياء حبابة	0U38	E-4
CID274	Hadded TSD	CID274	TSD مدرج	0U38	E-3
CID275	Ramzi Al-Khabaz Pharmacy	CID275	صيدلية رمزي الخباز	0U38	B-7
CID276	Hadiyah for Dates	CID276	هدية للتمور	0U38	F-18
CID277	Hali Restaurant	CID277	مطعم هالي	0U38	D-18
CID278	Ahlan Wa Sallan (Gahwa Al-Arabia)	CID278	أهلا وسلان (قهوة العربية)	0U38	F-25
CID279	Hamad Trading	CID279	حمد للتجارة	0U38	F-6
CID280	Hana Chicken	CID280	هانا دجاج	0U38	B-52
CID281	Happy Night	CID281	ليلة سعيدة	0U38	D-12
CID282	Harees	CID282	الهريس	0U38	C-28
CID283	Hassan A.S. Al-Khadar	CID283	حسن عبدالصمد الخضر	0U38	B-75
CID284	Hassan Food Center	CID284	مركز حسن للمأكولات	0U38	D-18
CID285	Hayat	CID285	حياة	0U38	F-13
CID286	Hayil Shopping Center	CID286	مركز هايل للتسوق	0U38	A-55
CID287	Hazana	CID287	حزانة	0U38	A-26
CID288	Hadiya	CID288	هدية	0U38	A-58
CID289	Heat Establishment	CID289	مؤسسة الحرارة	0U38	C-33
CID290	Hempel	CID290	همبل	0U38	A-22
CID291	Hina Abu Al-Ez	CID291	حنا أبو العز	0U38	F-17
CID292	Homestyle	CID292	هوم ستايل	0U38	E-17
CID293	Horia Trading Establishment	CID293	مؤسسة حورية التجارية	0U38	A-74
CID294	Hot Meals	CID294	وجبات ساخنة	0U38	B-13
CID295	Humrani	CID295	حمراني	0U38	null
CID296	Husaiki	CID296	هوسايكي	0U38	E-16
CID297	Husain Al-Tahir Trading Establisment	CID297	حسين الطاهر للتأسيس التجاري	0U38	D-27
CID298	Hussain Al-Tahir Al-Qattan	CID298	حسين الطاهر القطان	0U38	B-28
CID299	Huya	CID299	هويا	0U38	E-42
CID300	Huzam Special Gifts	CID300	هدايا هزام الخاصة	0U38	A-75
CID301	Hydeah	CID301	هيديه	0U38	B-15
CID302	Ibn Sina	CID302	ابن سينا	0U38	E-2
CID303	Ibrahim Engineering Consultant	CID303	إبراهيم للاستشارات الهندسية	0U38	B-13
CID304	Ibrahim Trading	CID304	إبراهيم للتجارة	0U38	A-39
CID305	Infected Waste	CID305	النفايات المصابة	0U38	E-51
CID306	Infectious Medical Waste	CID306	النفايات الطبية المعدية	0U38	E-51
CID307	Intercontinental Hotel	CID307	فندق إنتركونتيننتال	0U38	B-5
CID308	International Paints	CID308	الدهانات الدولية	0U38	null
CID309	Iram Palace	CID309	قصر إرم	0U38	A-20
CID310	Iranian and Arabic Food	CID310	مأكولات إيرانية وعربية	0U38	B-19
CID311	Isam O. Al-Ali Establishment	CID311	مؤسسة عصام بن عبدالعلي	0U38	E-44
CID312	ISCOL	CID312	إيسكول	0U38	F-5
CID313	Isolation Linen	CID313	بياضات العزل	0U38	E-51
CID314	Issah Al-Dossary	CID314	عيسى الدوسري	0U38	null
CID315	Italian Rose	CID315	الورد الإيطالي	0U38	B-75
CID316	Jabr Trading	CID316	جبر للتجارة	0U38	null
CID317	Jameel Exhibition	CID317	معرض جميل	0U38	B-21
CID318	Janat Al-Ahram	CID318	جنة الأهرام	0U38	A-66
CID319	Janob Charcoal	CID319	فحم جانوب	0U38	B-9
CID320	Jarash	CID320	جرش	0U38	B-71
CID321	Jawad Al-Moghanni Establishment	CID321	مؤسسة جواد المغاني	0U38	C-2
CID322	Jawharah Center	CID322	مركز جوهرة	0U38	E-32
CID323	Jawhareat Hajer Complex	CID323	مجمع جوهرات هاجر	0U38	B-62
CID324	Jawharia Coal	CID324	الفحم جوهريا	0U38	E-8
CID325	Jazeera Lil Jalabiyat	CID325	الجزيرة ليل جلابيات	0U38	E-21
CID326	Jazeera Restaurant	CID326	مطعم الجزيرة	00U8	E-35
CID327	Jazim	CID327	جازيم	0U38	B-57
CID328	Jazirah Arabia	CID328	الجزيرة العربية	0U38	A-26
CID329	Jazeera Al-Binaa Trading Establishment	CID329	مؤسسة الجزيرة البناء التجارية	0U38	D-28
CID330	Jeans Apparel	CID330	ملابس الجينز	0U38	A-58
CID331	Jeans Kemp	CID331	جينز كيمب	0U38	B-63
CID332	Jeel Branch	CID332	فرع جيل	0U38	B-3
CID333	Jinah Al-Akhder	CID333	جناح الأخضر	0U38	B-63
CID334	Jnoub Shopping Center	CID334	مركز تسوق جنوب	0U38	B-58
CID335	JP Center	CID335	مركز جي بي	0U38	D-24
CID336	Jubail Coldstore	CID336	الجبيل كولدستور	0U38	null
CID337	Juhairan Shopping Center	CID337	مركز جهيران للتسوق	0U38	A-1
CID338	Joory Palace	CID338	جوري بالاس	0U26	A-53
CID339	KA	CID339	كا	0U38	E-44
CID340	Kabayan Supermarket	CID340	Kabayan سوبر ماركت	0U38	F-17
CID341	KAFA	CID341	كفى	0U38	E-43
CID342	Kaldi	CID342	كالدي	0U38	C-31
CID343	Kan Zaman Restaurant	CID343	مطعم كان زمان	0U38	C-34
CID344	Kanari	CID344	كناري	0U38	B-23
CID345	Karbala	CID345	كربلاء	0U38	A-23
CID346	Kareem Trading Establishment	CID346	مؤسسة كريم التجارية	0U38	F-6
CID347	Katwati	CID347	كاتواتي	0U38	A-56
CID348	kawkab Al-Ard	CID348	كوكب الأرض	0U38	B-78
CID349	Kayed	CID349	كايد	0U38	D-12
CID350	Kenzy	CID350	كينزي	0U38	F-6
CID351	Khafji Joint Operation	CID351	عملية الخفجي المشتركة	0U38	A-34
CID352	Khaial	CID352	خيال	0U38	D-5
CID353	Khair	CID353	الخير	0U38	A-17
CID354	Khaldon Al-Emerini	CID354	خلدون الامريني	0U38	B-23
CID355	Khaleed S. Al-Sana Establishment	CID355	مؤسسة خالد بن صالح الصنعاء	0U38	A-15
CID356	Khaleej Restaurant	CID356	مطعم الخليج	0U38	F-30
CID357	Khatif Al-Adwa	CID357	خطاب العدوة	0U38	B-66
CID358	Khayam Studio	CID358	استوديو الخيام	0U38	F-51
CID359	Khobar Discount Center	CID359	مركز الخبر للخصم	0U38	A-38
CID360	Khobar Plastic	CID360	الخبر بلاستيك	0U38	E-31
CID361	Khonaini Supermarket	CID361	خونيني سوبر ماركت	0U38	A-52
CID362	Kulsum	CID362	كلسوم	0U38	B-51
CID363	Kwatim Hadramoth	CID363	كواتيم هادراموت	0U38	B-63
CID364	La Poire	CID364	لا بوار	0U38	D-2
CID365	La Sani	CID365	لا ساني	0U38	E-19
CID366	Lamsat Shahad	CID366	لمسات شهد	0U38	E-49
CID367	Last Over	CID367	آخر	0U38	A-62
CID368	Lateefa Hamed Al-Dossary Ladies Tailoring	CID368	لطيفة حامد الدوسري للخياطة النسائية	0U38	F-18
CID369	Latif	CID369	لطيف	0U38	A-76
CID370	Laundry Bag	CID370	حقيبة غسيل	0U38	C-7
CID371	Lewan Restaurant	CID371	مطعم ليوان	0U38	A-54
CID372	Lias	CID372	لياس	0U38	C-11
CID373	Libanon Green Restaurant	CID373	مطعم ليبانون جرين	0U38	A-63
CID374	Lights Trading Establishment	CID374	مؤسسة الأضواء التجارية	0U38	C-36
CID375	Lilas	CID375	ليلاس	0U38	E-21
CID376	Lily	CID376	زنبق	0U38	C-14
CID377	501 Shoppe	CID377	501 شوبي	0U38	A-58
CID378	Lolo	CID378	لولو	0U38	A-22
CID379	Lora Saleh Qatani	CID379	ليرة صالح قطاني	0U38	A-47
CID380	Lord	CID380	رب	0U38	B-20
CID381	Lucky Center	CID381	مركز الحظ	0U38	B-40
CID382	Luluat Al-Ferdos Pharmacy	CID382	صيدلية لولوات الفردوس	0U38	E-7
CID383	Lulu Al-Mazara	CID383	لولو المزارة	0U38	E-18
CID384	Lulu Ladies Center	CID384	مركز اللولو للسيدات	0U38	D-35
CID385	Madyafix	CID385	ماديافيكس	0U38	C-25
CID386	Mafares Sufra	CID386	مفارس سفرة	0U38	A-60
CID387	Mahdi Al-Hutaili	CID387	مهدي الحطيلي	0U38	F-6
CID388	Mahdi Al-Hutaila Establishment	CID388	مؤسسة مهدي الحطيلة	0U38	F-6
CID389	Mais AL-Rim	CID389	ميس الريم	0U38	A-62
CID390	Majdi House Needset	CID390	مجدي هاوس نيدستيت	0U38	A-65
CID391	Majed Fashion	CID391	ماجد فاشون	0U38	A-6
CID392	Majid Toys	CID392	ألعاب ماجد	0U38	A-65
CID393	Makati Shopping Center	CID393	مركز ماكاتي للتسوق	0U38	A-11
CID394	Malaki	CID394	ملاكي	0U38	D-11
CID395	Malallah	CID395	ملله	0U38	B-20
CID396	Malaz International	CID396	ملاذ الدولية	0U38	E-46
CID397	Malboosath Arkan	CID397	مالبوساث أركان	0U38	A-75
CID398	Malbusati	CID398	مالبوستي	0U38	A-56
CID399	Malki	CID399	المالكي	0U38	A-7
CID400	Manakhel	CID400	مناخيل	0U38	D-27
CID401	Manameen	CID401	المنامين	0U38	null
CID402	Manara Electric Co. Ltd.	CID402	شركة المنارة الكهربائية المحدودة	0U38	F-24
CID403	Manhali Shopping Center	CID403	مركز منهالي للتسوق	0U38	A-68
CID404	Mani	CID404	ماني	0U38	null
CID405	Manila	CID405	مانيلا	0U38	A-11
CID406	Mansoor Pharmacy	CID406	صيدلية منصور	0U38	A-53
CID407	Markaz Al-Faizal Meat	CID407	مركز الفيصل للحوم	0U38	B-41
CID408	Marosh	CID408	مروش	0U38	B-2
CID409	Mashwi Corner	CID409	ركن مشوي	0U38	D-5
CID410	Mazaya Al-Asaar	CID410	مزايا العصار	0U38	B-10
CID411	Mazaya Food	CID411	مزايا فود	0U38	D-8, 9 & 10
CID412	Multipurpose Cooperative (MCS)	CID412	تعاونية متعددة الأغراض (MCS)	00U2	E-17
CID413	Sabic Medical Clinic Services	CID413	خدمات عيادة سابك الطبية	0U38	E-2
CID414	Metro Center	CID414	مركز المترو	0U38	B-23
CID415	Midhal Hotel	CID415	فندق ميدهال	0U38	E-34
CID416	Millenium	CID416	الالفيه	0U38	B-63
CID417	Mina Center	CID417	مركز مينا	0U38	B-34
CID418	Mira Center	CID418	مركز ميرا	0U38	B-29
CID419	Mirage Studio	CID419	استوديو ميراج	0U38	F-5
CID420	Maharaja Palace Hotel	CID420	فندق مهراجا بالاس	0U38	B-39
CID421	Mama	CID421	ماما	0U38	B-39
CID422	Modern Center Textiles	CID422	المنسوجات المركزية الحديثة	0U38	A-35
CID423	Modern Plastic Bag Factory	CID423	مصنع الأكياس البلاستيكية الحديثة	0U38	F-11 & F-12
CID424	Modiest Fashion	CID424	مودست موضة	0U38	B-39
CID425	Modka Sweets	CID425	حلويات مودكا	0U38	D-36
CID426	Mohammed Shihab	CID426	محمد شهاب	0U38	A-76
CID427	Mohammad Mubarak	CID427	محمد مبارك	0U38	A-20
CID428	Mohammed Al-Sodair Trading Establishment	CID428	مؤسسة محمد السدير للتجارة	0U38	E-6
CID429	Shaqsiyah Al-Momiaza	CID429	شقية الموميازة	0U26	A-16
CID430	Moulood	CID430	مولود	0U38	E-19
CID431	Mozaini Trading	CID431	مزيني للتجارة	0U38	C-9
CID432	Mukhaizeem Shopping Center	CID432	مركز مخيزيم للتسوق	0U38	B-61
CID433	Muhktara Trading	CID433	مختارة للتجارة	0U38	D-15
CID434	Mulaiki Fashion (MF)	CID434	مولايكي فاشون (MF)	0U38	D-21
CID435	Mulif Food Stuff	CID435	موليف للمواد الغذائية	0U38	B-15
CID436	Mumaiza	CID436	معيزة	0U38	B-41
CID437	Muthana	CID437	مثنى	0U38	A-5
CID438	Mutref	CID438	مطرف	0U38	B-43
CID439	MVC	CID439	MVC	0U38	A-30 & 31
CID440	My Aqar. Com	CID440	عقاري كوم	0U38	A-47
CID441	My Baby	CID441	حبيبي	0U38	B-29
CID442	My Game	CID442	لعبتي	0U38	B-27
CID443	Naemah	CID443	نعمة	0U38	A-64
CID444	Nahed Trading Establishment	CID444	مؤسسة ناهض التجارية	0U38	A-53
CID445	Mijana Restaurant	CID445	مطعم ميجانا	0U38	E-48
CID446	Naher Al-Kerat	CID446	ناهر الكرات	0U38	B-77
CID447	Naji Building Materials Supply	CID447	ناجي لتوريد مواد البناء	0U38	E-5
CID448	Najma Al-Shawq Fashion	CID448	نجمة الشوق للأزياء	0U38	A-37
CID449	Najma Al-Fadhiya	CID449	نجمة الفاضية	0U26	B-13
CID450	Namer	CID450	نامر	0U38	A-22
CID451	Naseym Gulf	CID451	نسيم الخليج	0U38	B-37
CID452	Nashwa	CID452	نشوى	0U38	B-37
CID453	Nasser M. Hasson Al-Ghamdi Establishment	CID453	مؤسسة ناصر محمد حسون الغامدي	0U38	F-20
CID454	National Lighting	CID454	الإضاءة الوطنية	0U38	A-21
CID455	National Market Company	CID455	شركة السوق الوطني	0U38	C-33
CID456	National Methanol Company	CID456	الشركة الوطنية للميثانول	0U38	C-21
CID457	Nectar	CID457	رحيق	0U38	A-21
CID458	Nesrin Tailoring	CID458	نسرين للخياطة	0U38	A-47
CID459	New Boy	CID459	فتى جديد	0U38	A-10
CID460	New Style	CID460	نمط جديد	0U38	D-5
CID461	New Time Fashion	CID461	أزياء الوقت الجديد	0U38	A-14
CID462	New Look	CID462	مظهر جديد	0U38	B-75
CID463	Niklah Al-Khaleej Trading	CID463	شركة نقله الخليج للتجارة	0U38	C-28
CID464	Nirala Sweets	CID464	حلويات نيرالا	0U38	A-22
CID465	Njood	CID465	نجود	0U38	A-64
CID466	No Limit Trading Establishment	CID466	مؤسسة تجارة بلا حدود	0U38	D-7
CID467	Noor	CID467	نور	0U38	D-32
CID468	Noora	CID468	نورا	0U38	F-20
CID469	Odaini	CID469	أودايني	0U38	A-4
CID470	Okaz Commercial	CID470	عكاظ التجارية	0U38	F-6
CID471	Omrania Trading	CID471	العمرانية للتجارة	0U38	D-30
CID472	One Style	CID472	نمط واحد	0U38	B-47
CID473	Open Day	CID473	يوم مفتوح	0U38	D-36
CID474	Orchid	CID474	السحلب	0U38	A-60
CID475	Nokia Ringtone	CID475	نغمة رنين نوكيا	0U38	B-23
CID476	OOJ Coldstore	CID476	OOJ كولدستور	0U38	B-47
CID477	Oriental Shopping Center (OSC)	CID477	مركز التسوق الشرقي (OSC)	0U38	A-79
CID478	Palestine Corner	CID478	ركن فلسطين	0U38	B-3
CID479	Panasonic	CID479	باناسونيك	0U38	F-24
CID480	Paper Moon	CID480	القمر الورقي	0U38	D-0
CID481	Pasta Hot	CID481	باستا هوت	0U38	A-50
CID482	Peacock Carpet Center	CID482	مركز الطاووس للسجاد	0U38	E-32
CID483	PETROKEMYA (KEMYA)	CID483	بتروكيميا (كيميا)	0U38	E-2
CID484	Picnic	CID484	نزهه	0U38	D-25
CID485	Power Trading Establishment	CID485	مؤسسة تجارة الطاقة	0U38	E-28
CID486	Price House	CID486	برايس هاوس	0U26	D-13
CID487	Prima Ware	CID487	بريما وير	0U38	B-56
CID488	Project Fertilizer	CID488	مشروع الأسمدة	0U38	E-24
CID489	Qamber	CID489	قمبر	0U38	B-24
CID490	Qanbar Dywidag	CID490	قنبر ديويداغ	0U38	E-46
CID491	Quba Center	CID491	مركز قباء	0U38	B-21
CID492	Quds	CID492	القدس	0U38	A-19
CID493	Quds Food Supplier	CID493	مورد قدس للأغذية	0U38	B-56
CID494	Rabie Shopping Center	CID494	مركز ربيع للتسوق	0U38	F-6
CID495	Rabieya Charcoal	CID495	فحم الربيع	0U38	A-67
CID496	Radi Al-Khosah	CID496	راضي الخشة	0U38	A-17
CID497	Rafath	CID497	رأفة	0U38	A-59
CID498	Rahma	CID498	رحمة	0U38	C-52
CID499	Raid Store	CID499	متجر غارة	0U38	C-28
CID500	Railways Organization	CID500	منظمة السكك الحديدية	0U38	A-36
CID501	Rakan Thamez	CID501	راكان ثاميز	0U38	D-11
CID502	Ramada Hotels and Suites	CID502	فنادق وأجنحة رمادا	0U38	E-12
CID503	Ramez Group	CID503	مجموعة رامز	0U26	D-20 & 21
CID504	Ramz Al-Tawfeer	CID504	رمز التوفير	0U38	A-57
CID505	Ramz Al-Thakfidat	CID505	رمز الذكفيدات	0U38	A-49
CID506	Rashed Mall	CID506	راشد مول	0U26	null
CID507	Rassan Copy Center	CID507	مركز راسان للنسخ	0U38	B-72
CID508	Rawaa Rawan	CID508	رواء روان	0U38	A-19
CID509	Rawabi Al-Sham	CID509	روابي الشام	0U38	B-14
CID510	Rawaea Al-Tahany	CID510	راوية الطحاني	0U38	E-5
CID511	Rayan (Mazaya Foods)	CID511	ريان (مزايا للأغذية)	0U38	D-10
CID512	Raybal Sweet House	CID512	ريبال سويت هاوس	0U38	B-53
CID513	Razi	CID513	رازي	0U38	E-2
CID514	Red Cap	CID514	غطاء أحمر	0U38	F-17
CID515	Red Carpet	CID515	السجادة الحمراء	0U38	C-35
CID516	Reem Sweet	CID516	ريم سويت	0U38	A-19
CID517	Rehab Pharmacy	CID517	صيدلية رحاب	0U38	E-23
CID518	Rawan (RF)	CID518	روان (RF)	0U38	D-18
CID519	Rhona	CID519	رونا	0U38	C-30
CID520	Riaya Hospital	CID520	مستشفى رياية	0U38	A-27
CID521	Riyadh Coldstore	CID521	كولدستور الرياض	0U38	B-22
CID522	Riyan	CID522	ريان	0U38	D-20
CID523	Roaa	CID523	رؤى	0U38	A-75
CID524	Romansiah	CID524	رومانسيا	0U38	A-13
CID525	Roshna Center	CID525	مركز روشنا	0U38	B-16
CID526	Royal Commission on Health Program	CID526	برنامج الهيئة الملكية للصحة	0U38	B-14
CID527	Ruwad Al-Arab Factory	CID527	مصنع رواد العرب	0U38	B-51
CID528	Saad Specialist Hospital	CID528	مستشفى سعد التخصصي	0U38	E-45
CID529	Sabic Terminal Services Medical Clinic	CID529	عيادة سابك للخدمات الطبية	0U38	E-2
CID530	SADAF	CID530	صدف	0U38	E-3
CID531	Saeed B. Balhaddad	CID531	سعيد بن عبدالحداد	0U38	C-33
CID532	Saer Al-Insab	CID532	ساير الإنسب	0U38	A-75
CID533	Saer Al-Mukhafad	CID533	ساير المخابرات	0U38	A-73
CID534	Safa Foods	CID534	صفا للأغذية	0U38	B-44
CID535	Safar Fashion	CID535	سفر فاشون	0U38	D-35
CID536	SAFCO	CID536	سافكو	0U38	A-23
CID537	Royal Carpet	CID537	رويال كارت	0U38	D-15
CID538	Sahara Petrochemicals	CID538	الصحراء للبتروكيماويات	0U38	null
CID539	Sahdi Meats	CID539	اللحوم السهدية	0U38	F-6
CID540	Saihati Grocery	CID540	بقالة سيهاتي	0U38	A-79
CID541	Salahudin Pastry	CID541	معجنات صلاح الدين	0U38	F-7
CID542	Saleh Saghyer Trading Establishment	CID542	مؤسسة صالح الصغير للتجارة	0U38	A-74
CID543	Saline Water Conversion Corporation	CID543	شركة تحلية المياه المالحة	0U38	B-36
CID544	Salman Exhibition	CID544	معرض سلمان	0U38	F-16
CID545	SAM Computer	CID545	سام للكمبيوتر	0U38	A-33
CID546	Sameh	CID546	سامح	0U38	A-19
CID547	Safsaf Restaurant	CID547	مطعم صفسف	0U38	B-26
CID548	Saiadiah Restaurant	CID548	مطعم السيادية	0U38	B-24
CID549	Samel Trading Center	CID549	مركز سامل التجاري	0U38	B-74
CID550	Sameway Shopping Center	CID550	مركز تسوق Sameway	0U38	C-3
CID551	Samhan	CID551	سمحان	0U38	D-19
CID552	Samir Al-Nassirin	CID552	سمير الناصرين	0U38	B-24
CID553	Samposa Peladi	CID553	سامبوسا بيلادي	0U38	F-6
CID554	Sanabel Al-Kher	CID554	سنابل الخير	0U38	C-27
CID555	Sanabel Al-Sharq	CID555	سنابل الشرق	0U38	B -73
CID556	Sanabil Al-Jnoub (AJS)	CID556	سنابل الجنوب (AJS)	0U38	B-73
CID557	Sara Studio	CID557	سارة ستوديو	0U38	E-4
CID558	Sarekh Hassa	CID558	ساريخ أسا	0U38	B-76
CID559	Saudi Arabic Store	CID559	متجر عربي سعودي	0U38	E-22
CID560	Saudi Aramco	CID560	أرامكو السعودية	0U38	C-21
CID561	Saudi Broasted	CID561	بروست سعودي	0U38	B-54
CID562	Saudi Cattering	CID562	التموين السعودي	0U38	null
CID563	Saudi Holladi Bank	CID563	بنك الهولادي السعودي	0U38	B-11
CID564	Saudi Methanol Company	CID564	الشركة السعودية للميثانول	0U38	D-29
CID565	Saudi Textiles Thuqbah	CID565	المنسوجات السعودية الثقبة	0U38	F-22
CID566	Sayadine	CID566	سيادين	0U38	A-61
CID567	Sayary Ice Factory	CID567	مصنع ساياري للثلج	0U38	A-29
CID568	S-Chem Clinic	CID568	عيادة إس كيم	0U26	A-59
CID569	Sea and Shore Restaurant	CID569	مطعم سي اند شور	0U38	B-70
CID570	Sehaiban Fashion	CID570	أزياء سهايبان	0U38	A-6
CID571	Seventy Five (75)	CID571	خمسة وسبعون (75)	0U38	A-9
CID572	Shahe	CID572	شاه	0U38	B-35
CID573	Shamayil Al-Rabie Shopping Center	CID573	مركز الشمايل الربيع للتسوق	0U38	A-78
CID574	Shamel Group	CID574	مجموعة شامل	0U38	A-15
CID575	Sharif Pharmacy	CID575	صيدلية شريف	0U38	E-36
CID576	Sharour Restaurant	CID576	مطعم شرور	0U38	E-48
CID577	Shawaia	CID577	الشواية	0U38	A-9
CID578	Shehri Center Ya Balash	CID578	مركز شهري يا بلاش	0U38	E-19
CID579	Shehri Plaza	CID579	شهري بلازا	0U38	E-39
CID580	Shihac Supply	CID580	توريد Shihac	0U38	E-43
CID581	Shimal Charcoal	CID581	فحم شمال	0U38	B-9
CID582	Shiyuk Coffee	CID582	قهوة شيوك	00U8	F-25
CID583	Shkoor Trading Establishment	CID583	مؤسسة شكور التجارية	0U38	A-44
CID584	Shroq Factory	CID584	مصنع شروق	0U38	null
CID585	Sidra Fashion	CID585	سدرة فاشون	0U38	F-22
CID586	Silky	CID586	حريري	0U38	C-1
CID587	Silver Needle	CID587	إبرة فضية	0U38	B-3
CID588	Sinaa Center	CID588	مركز سيناء	0U38	E-34
CID589	Sanam Naifat Center	CID589	مركز سنام نائفات	0U38	A-71
CID590	SIPCHEM	CID590	سيبكيم	0U38	A-4
CID591	Soft Touch	CID591	لمسة ناعمة	0U38	A-23
CID592	Soudier Store	CID592	متجر سودير	0U38	E-6
CID593	Souq Fashion	CID593	سوق فاشون	0U38	A-37
CID594	Small Millionaire	CID594	المليونير الصغير	0U38	B-38
CID595	Star	CID595	نجم	0U38	A-7
CID596	Star Roaster	CID596	ستار روستر	0U38	A-7
CID597	Star Center	CID597	مركز النجوم	0U38	A-69
CID598	Star Nut	CID598	ستار الجوز	0U38	A-7
CID599	Star Shopping Center	CID599	مركز تسوق ستار	0U38	A-7
CID600	Studio Banat	CID600	استوديو بنات	0U38	B-16
CID601	Suelah Charcoal	CID601	سويلا فحم	0U38	A-68
CID602	Suhaili	CID602	سهيلي	0U38	A-35
CID603	Sumaiyah	CID603	سمية	0U38	B-26
CID604	Sun Sweet	CID604	صن سويت	0U38	B-59
CID605	Sunset Beach Supemarket	CID605	صن سيت بيتش سوبي ماركت	0U38	A-59
CID606	Super Corner	CID606	سوبر كورنر	0U38	F-5
CID607	Super Corner (Jamalak)	CID607	سوبر كورنر (جملك)	0U38	A-29
CID608	Supplies	CID608	مؤن	0U38	E-4
CID609	Surprice	CID609	سوربرايس	0U38	E-48
CID610	Sweet Corner	CID610	سويت كورنر	0U38	F-13
CID611	Tabbaq Tabbaq Restaurant	CID611	مطعم طبق	0U38	E-21
CID612	Tafaneen	CID612	تافنين	0U38	A-25
CID613	Taj Al-Awael	CID613	تاج الأوائل	0U38	E-20
CID614	Taj Al-Khaleej Trading Establishment	CID614	مؤسسة تاج الخليج التجارية	0U38	D-32
CID615	Tala Al-Khalij Trading Est.	CID615	مؤسسة تالا الخليج التجارية	0U38	F-18
CID616	Tannour Bakery	CID616	مخبز تنور	0U38	B-55
CID617	Taqs	CID617	Taqs	0U38	F-23
CID618	Taslya Al-Watania Trading Establishment	CID618	مؤسسة تسلية الوطنية التجارية	0U38	D-32
CID619	Taybah	CID619	طيبة	0U38	B-74
CID620	Tekno Your Shop	CID620	تكنو متجرك	0U38	B-29
CID621	Thoraya Telecom	CID621	ثريا للإتصالات	0U38	B-21
CID622	Thoufeer	CID622	ثوفر	0U38	E-19
CID623	Thuqbah Cloth Center (TCC)	CID623	مركز الثقبة للأقمشة (TCC)	0U38	F-15
CID624	Tifel Al-Radia	CID624	تيفل الراضية	0U38	F-16
CID625	Top Ten	CID625	العشرة الأوائل	0U38	B-32
CID626	Top World	CID626	أعلى العالم	0U38	D-17
CID627	Tous Sweet	CID627	توس سويت	0U38	B-64
CID628	Towfu (Tokwa)	CID628	توفو (توكوا)	0U38	F-6
CID629	Towline	CID629	حبل السحب	0U38	B-40
CID630	Technical Home	CID630	الصفحة الرئيسية الفنية	0U38	B-6
CID631	Toys Corner	CID631	ركن الألعاب	0U38	A-10
CID632	Toys Planet	CID632	تويز بلانيت	0U38	D-15
CID633	Twaigera Group	CID633	مجموعة تويجيرا	0U38	A-67
CID634	Um-Alsahik Al-Ahliya Pharmacy	CID634	صيدلية أم الساحق الأهلية	0U38	A-10
CID635	United Company Clinic	CID635	عيادة الشركة المتحدة	0U38	C-36
CID636	Uzam Health Medecine Clinic	CID636	عيادة أوزام الصحية للطب	0U38	D-35
CID637	Vita Food Company	CID637	شركة فيتا للأغذية	0U38	E-1
CID638	Vogue	CID638	رائج	0U38	C-27
CID639	Wafed (AF)	CID639	وافد (AF)	0U38	A-22
CID640	Waha Charcoal	CID640	واحة فحم	0U38	E-8
CID641	Wahat Al-Ahram	CID641	واحة الأهرام	0U38	B-10
CID642	Wahat Al-Andalus	CID642	واحة الأندلس	0U38	A-14
CID643	Wahat Al-Asaar	CID643	واحة العصار	0U38	B-65
CID644	Waraa Center	CID644	مركز وراء	0U38	null
CID645	Warq	CID645	وراق	0U38	A-54
CID646	Washa	CID646	وشا	0U38	E-18
CID647	Wassil Paper Product Company	CID647	شركة الواصل للمنتجات الورقية	0U38	A-77
CID648	Wazzan Restaurant	CID648	مطعم وزان	0U38	D-28
CID649	We One Shopping Center	CID649	مركز تسوق وي ون	0U38	B-71
CID650	Welcome	CID650	أهلًا وسهلًا	0U38	E-31
CID651	Weraq Studio Service	CID651	خدمة استوديو وراق	0U38	A-50
CID652	Wessam Hotel	CID652	فندق وسام	0U38	B-25
CID653	Wessam Sweets	CID653	حلويات وسام	0U38	A-5
CID654	Wisam	CID654	وسام	0U38	E-40
CID655	Wlaim Charcoal	CID655	فحم اللايم	00U2	B-58
CID656	World Dessert	CID656	حلوى العالم	0U38	B-70
CID657	World of Savings	CID657	عالم الادخار	0U38	E-38
CID658	Yafae Jewelry	CID658	مجوهرات يافاء	0U38	A-9
CID659	Yassir Trading Establishment	CID659	مؤسسة ياسر التجارية	0U38	A-78
CID660	Your Choice	CID660	اختيارك	0U38	D-4
CID661	Yousif Pharmacy	CID661	صيدلية يوسف	0U38	A-53
CID662	Yousuf Karam Sufra	CID662	يوسف كرم سفرة	0U38	A-60
CID663	Z	CID663	Z	0U38	A-8
CID664	Zalzale	CID664	زالزال	0U38	B-6
CID665	Z Power	CID665	Z باور	0U38	B-15
CID666	Zahrani Trading	CID666	الزهراني للتجارة	0U38	F-21
CID667	Zamal Manahi	CID667	زمال مناحي	0U38	A-26
CID668	Zanobbia Style	CID668	أسلوب زانوبيا	0U38	A-56
CID669	Zarah Al-Mulwana	CID669	زارة الملوانية	0U38	A-19
CID670	Zohoor Pizza	CID670	بيتزا زهور	0U38	B-64
CID671	Asil Charcoal	CID671	فحم أصيل	0U38	A-48
CID672	Cytotoxic Waste	CID672	النفايات السامة للخلايا	0U38	C-9
CID673	Aqee (Sharbal)	CID673	عقي (شاربل)	0U38	E-10
CID674	Best Friends	CID674	أعز الأصدقاء	0U38	E-34
CID675	Taxi	CID675	تاكسي	0U38	A-53
CID676	Masal Al-Reem	CID676	مسال الريم	0U38	A-56
CID677	Ajaeb Al-Jazzera	CID677	عجيب الجزيرا	0U38	B-36
CID678	Amwaj Al-Seef	CID678	أمواج السيف	0U38	B-23
CID679	Safir Restaurant	CID679	مطعم سفير	0U38	A-47
CID680	Sandellas Flat Bread	CID680	خبز سانديلاس مسطح	0U38	A-47
CID681	2000 Telecom	CID681	2000 للاتصالات	0U38	A-48
CID682	King Star Shopping Mall	CID682	مركز كينج ستار للتسوق	0U38	A-12
CID683	Wesam Al-Tawfeer	CID683	وسام التوفير	0U38	A-45
CID684	Anaqah Al-Saudia	CID684	عناقة السعودية	0U38	A-16
CID685	Hanii Mobile	CID685	هاني موبايل	0U38	B-52
CID686	Samarain Charcoal	CID686	فحم سامارين	0U38	A-67
CID687	Mishab Trading Establishment	CID687	مؤسسة مشاب التجارية	0U38	B-45
CID688	Natharat Fee (NF)	CID688	نثارات فاي (NF)	0U38	A-46
CID689	Kifah	CID689	كفاح	0U38	A-51
CID690	Eastern Gate Restaurant	CID690	مطعم البوابة الشرقية	0U38	A-51
CID691	Najmat Al-Tawfeer	CID691	نجمت التوفير	0U38	D-12
CID692	Gamat Al-Hassa	CID692	جامع الأحساء	0U38	A-46
CID693	Jamalak	CID693	جمال	0U38	A-18
CID694	Wahit Kawatim	CID694	وهيت كواتيم	0U38	B-61
CID695	Mazaya Al-Haram	CID695	مزايا الهرم	0U38	B-48
CID696	Plastic Recycling	CID696	إعادة تدوير البلاستيك	0U38	C-9
CID697	Shawarma Webass	CID697	شاورما ويب	0U38	B-8
CID698	Sharq Al-Awsat	CID698	شرق الأوسط	0U38	D-4
CID699	Rashaqa Waljamal (Citraria)	CID699	رشقة والجمال (سيتريا)	0U38	B-7
CID700	Muntazah	CID700	منتزه	0U38	D-35
CID701	Ghawar Restaurant	CID701	مطعم الغوار	0U38	B-43
CID702	Silk House	CID702	بيت الحرير	0U38	A-46
CID703	Planet Fashion	CID703	أزياء الكوكب	0U38	A-54
CID704	Unique Perfumes	CID704	عطور فريدة من نوعها	0U38	B-38
CID705	Dar Perfumes	CID705	دار للعطور	0U38	A-25
CID706	Mouda	CID706	مودى	0U38	A-21
CID707	Judh Restaurant	CID707	مطعم جود	0U38	A-63
CID708	Fashion Point	CID708	نقطة الموضة	0U38	A-28
CID709	Ataa	CID709	عطاء	0U38	C-21
CID710	Sanabis	CID710	السنابس	0U38	D-18
CID711	Ashrakt Al-Sharqiyah	CID711	أشراكت الشرقية	0U38	A-62
CID712	Zain City	CID712	مدينة زين	0U38	A-57
CID713	Jubail University College	CID713	كلية الجبيل الجامعية	0U38	B-55
CID714	Najimat Shoes	CID714	أحذية نجمات	0U38	B-52
CID715	Dorob	CID715	دوروب	0U38	B-52
CID716	Pakistani	CID716	باكستاني	0U38	null
CID717	Abanamy Hospital	CID717	مستشفى أبانامي	0U26	F-26
CID718	Fertilizer Project	CID718	مشروع الأسمدة	0U38	E-24
CID719	Mushiri	CID719	مشيري	0U26	B-29
CID720	Raqwani	CID720	الرقواني	0U26	E-50
CID721	Penshoppe	CID721	Penshoppe	0U26	D-31
CID722	Masloum Codstore	CID722	Masloum Codstore	00U8	F-26
CID723	Special Bread	CID723	خبز خاص	0U38	E-37
CID724	Darlyn	CID724	دارلين	0U38	B-66
CID725	Reem Pizza	CID725	بيتزا ريم	0U38	A-16
CID726	Maha	CID726	مها	00U8	E-22
CID727	Barkat Super Market	CID727	سوبر ماركت بركات	0U26	A-64
CID728	Saving Corner Center	CID728	مركز ركن التوفير	0U26	A-64
CID729	Bait Al-Robyan	CID729	بيت الربيان	0U38	D-11
CID730	Bait Al-Musthalik	CID730	بيت المستقبل	0U38	F-5
CID731	Fugro-Suhaimi	CID731	فوغرو سحيمي	0U26	F-26
CID732	Neven	CID732	نيفين	00U8	E-22
CID733	Royal Pillow	CID733	وسادة رويال	0U38	D-31
CID734	My Home	CID734	بيتي	0U38	A-27
CID735	Faisal	CID735	فيصل	0U38	E-25
CID736	TravelMate	CID736	ترافل ميت	0U38	B-68
CID737	Delta Modern Bakeries	CID737	مخابز دلتا الحديثة	0U26	A-60
CID738	Huthaili Establishment	CID738	مؤسسة حذيلي	0U38	F-6
CID739	Fish House	CID739	بيت السمك	0U26	A-60
CID740	Wadi Al-Hejaz Charcoal	CID740	وادي الحجاز فحم	0U38	D-26
CID741	Manal	CID741	منال	0U26	D-23
CID742	Amri Plaza	CID742	عمري بلازا	00U8	F-41
CID743	Amri Plus for Textiles	CID743	عمري بلس للمنسوجات	00U8	F-41
CID744	Jibneys	CID744	جيبنيس	0U38	E-13
CID745	Ziyad	CID745	زياد	0U38	null
CID747	Bait Jeddy	CID747	بيت جدي	00U8	B-61
CID748	Mizan Natural	CID748	ميزان طبيعي	0U26	null
CID749	Master Point	CID749	ماستر بوينت	0U38	E-32
CID750	Opple	CID750	أوبل	0U26	F-49
CID751	Malaz Gulf Establishment	CID751	مؤسسة ملاذ الخليج	0U38	E-46
CID752	Essa	CID752	عيسي	0U38	A-48
CID753	Seasons	CID753	مواسم	0U38	B-55
CID754	Tamimi Co. LTD.	CID754	شركة التميمي المحدودة	0U26	F-8
CID755	Sewing Accessories	CID755	اكسسوارات الخياطة	0U26	A-25
CID756	Faizal Al-Ansari	CID756	فيصل الأنصاري	0U38	null
CID757	Noor Charcoal	CID757	نور فحم	0U38	D-26
CID758	Tiger	CID758	نمر	0U38	D-14
CID759	Markaz Flash	CID759	"مركز فلاش"	0U38	A-63
CID760	Fahad Specialist Hospital	CID760	مستشفى فهد التخصصي	0U38	A-27
CID761	Fon Fon	CID761	فون فون	0U38	E-31
CID762	Kabas	CID762	قباس	0U38	B-57
CID763	New Born Baby Gate	CID763	بوابة الطفل حديث الولادة	0U38	B-29
CID764	Saf Saf Restaurant	CID764	مطعم صف صاف	00U2	B-26
CID765	Sharq Hotel	CID765	فندق شرق	0U38	B-68
CID766	Abdullah Al-Ghunaim Trading Establishment	CID766	مؤسسة عبدالله الغنيم التجارية	0U38	A-29
CID767	EPO	CID767	المكتب الأوروبي للبراءات	0U38	B-75
CID768	Amoudi	CID768	العمودي	0U38	B-27
CID769	Jokar	CID769	جوكار	00U8	A-21
CID770	Toufeer Al-Mathali	CID770	توفير المطعلي	0U38	A-21
CID771	SWCC Employees	CID771	موظفو المؤسسة العامة لمجلس النواحي	0U38	A-68
CID772	ATT Group	CID772	مجموعة ATT	0U38	A-19
CID773	Red Onion	CID773	بصل أحمر	0U38	A-64
CID774	Huraith Tailor	CID774	خياط حريث	0U38	B-23
CID775	Nassej Shahaba	CID775	ناسيج شهابا	0U38	D-24
CID776	Maghlouth Store	CID776	متجر مغلوث	0U38	E-52
CID777	ACT	CID777	فعل	0U38	null
CID778	Mohammed Salim Al-Rashed	CID778	محمد سالم الراشد	0U38	null
CID779	Tayeb Al-Tazaj	CID779	طيب التزج	0U26	B-68
CID780	Yahya Spare Parts	CID780	قطع غيار يحيى	0U38	F-7
CID781	Shamsi	CID781	شمسي	0U38	A-61
CID782	Advance	CID782	ترقى	0U38	null
CID783	Prestige	CID783	هيبه	0U26	A-32
CID784	Misk Al-Jenan	CID784	مسك الجنان	0U38	null
CID785	Golden Tulip Resort	CID785	منتجع جولدن توليب	0U38	E-32
CID786	Crown Plaza	CID786	كراون بلازا	0U38	null
CID787	KSFH	CID787	KSFH	0U38	null
CID788	Lebanes Bakery	CID788	مخبز لبنان	0U38	null
CID789	Jazeerat Al-Salam Trading Est.	CID789	مؤسسة جزيرة السلام التجارية	0U38	D-14
CID790	Eastern Cement Employee Cooperative	CID790	تعاونية موظفي الأسمنت الشرقية	0U38	B-19
CID791	Good Morning	CID791	صباح الخير	0U26	F-17
CID792	Ahmad Abdullah Al-Dawood Est.	CID792	مؤسسة أحمد عبدالله الداود	0U38	null
CID793	Fakher Charcoal	CID793	فحم فاخر	0U38	C-19
CID794	WESCOSA	CID794	ويسكوزا	0U26	null
CID795	Taj Restaurant	CID795	مطعم تاج	0U38	F-8
CID796	Burger Stop	CID796	برجر ستوب	0U38	A-39
CID797	Royal Chicken	CID797	دجاج رويال	00U2	null
CID798	Barq	CID798	برق	0U26	B-3
CID799	Lulu Al-Khaleej	CID799	لولو الخليج	0U26	B-29
CID800	Onasa	CID800	أوناسا	00U8	A-75
CID801	Dento Plast Center	CID801	مركز دينتو بلاست	00U8	E-51
CID802	Gulf Hygenic	CID802	الخليج للصحة	0U26	null
CID803	Discount Village	CID803	قرية الخصم	00U8	B-78
CID804	Tawasul Center	CID804	مركز تواصل	0U38	null
CID805	Bani Hashem Qanber	CID805	بني هاشم قنبر	0U26	B-24
CID806	Shawermat	CID806	شاورمات	0U26	A-60
CID807	Yahyah Parts Center	CID807	مركز قطع غيار يحيى	0U38	null
CID808	Rose Restaurant	CID808	مطعم روز	0U26	B-59
CID809	Mabshoor House	CID809	بيت مبشور	0U38	B-58
CID810	Gulf Fasterners Company	CID810	شركة جلف فاستنر	0U26	B-72
CID811	Super Royal	CID811	سوبر رويال	0U26	D-31
CID812	Classic Charcoal	CID812	الفحم الكلاسيكي	00U8	B-76
CID813	Hamra Perfumes	CID813	حمرا للعطور	0U38	D-27
CID814	Hello Romance	CID814	مرحبا الرومانسية	0U38	A-58
CID815	Wedad Kitchen	CID815	مطبخ وداد	0U38	A-76
CID816	Ahmad Ice Plant	CID816	مصنع أحمد للثلج	0U38	B-74
CID817	Mulla Engineering And Consulting Office	CID817	مكتب الملا للهندسة والاستشارات	0U38	E-32
CID818	Al Bin Humda Electronics	CID818	بن حمدة للإلكترونيات	0U26	A-75
CID819	Computer Bags	CID819	حقائب الكمبيوتر	0U26	B-40
CID820	Dana Cattering Services	CID820	دانة لخدمات التموين	0U38	F-8
CID821	Saad Trading	CID821	سعد للتجارة	0U26	null
CID822	Alam Al-Thakfidat	CID822	عالم الذكفيدات	0U26	B-57
CID823	Mas Trading	CID823	ماس للتجارة	0U38	null
CID824	Costa Juice	CID824	عصير كوستا	0U38	E-4
CID825	Nawashit Restaurant	CID825	مطعم نواشيت	0U38	A-43
CID826	Hamdani	CID826	حمداني	0U26	F-7
CID827	Lawamea	CID827	لواعمية	0U38	B-28
CID828	Ashab Al-Khissa	CID828	أصحاب الخصة	0U38	E-30
CID829	Annaba Shoes Center	CID829	مركز أحذية عنابة	0U38	A-42
CID830	Raiaana Shoes	CID830	أحذية ريانا	0U38	A-42
CID831	Tabuk Shoes & Miss Shoes	CID831	أحذية تبوك وأحذية ملكة جمال	0U38	A-42
CID832	Fiber Ball Pillow	CID832	وسادة الكرة الليفية	0U26	D-14
CID833	Diameters World for Trading	CID833	أقطار العالم للتجارة	0U38	A-9
CID834	Infectious/Biohazardous Waste	CID834	النفايات المعدية / الخطرة بيولوجيا	0U38	C-9
CID835	Infectious Waste/Biohardous Waste	CID835	النفايات المعدية / النفايات الحيوية الصلبة	0U38	C-9
CID836	Bakhour Charcoal	CID836	فحم البخور	0U38	A-42
CID837	Sabic	CID837	سابك	0U26	E-2
CID838	ChiCkoos	CID838	تشيكوس	0U38	A-50
CID839	KKMC Hospital	CID839	مستشفى KKMC	0U26	A-26
CID840	Hillal	CID840	هلال	0U26	A-78
CID841	Juton Paints	CID841	دهانات جوتون	0U26	null
CID842	Abeer 2	CID842	عبير 2	0U26	E-26
CID843	Mashriq Al-Khaleej	CID843	مشرق الخليج	0U38	B-79
CID844	Seafoods Restaurant	CID844	مطعم المأكولات البحرية	00U8	A-79
CID845	Jamiyah Safwa	CID845	جامع الصفوة	0U38	null
CID846	Japjapa	CID846	جابجابا	0U26	D-14
CID847	Jasim	CID847	جاسم	0U38	null
CID848	Matco	CID848	ماتكو	0U26	A-39
CID849	Wajaha	CID849	وجاهة	0U26	A-16
CID850	Mohammad Al-Aradi	CID850	محمد العرادي	0U38	null
CID851	Azhar Al-Rabi Co. 5	CID851	شركة أزهر الربيع 5	00U8	A-39
CID852	Azhar Al-Rabi Co. 3	CID852	شركة أزهر الربيع 3	00U8	A-39
CID853	Sharq International School	CID853	مدرسة شرق الدولية	00U8	null
CID854	EZ Restaurant	CID854	مطعم EZ	0U38	B-58
CID855	Keyboard For Computer	CID855	لوحة مفاتيح للكمبيوتر	0U38	A-37
CID856	East Central	CID856	إيست سنترال	0U38	null
CID857	Ryan Supermarket	CID857	ريان سوبر ماركت	00U8	B-79
CID858	Munjif	CID858	منجف	0U38	null
CID859	Platinum Casual	CID859	بلاتينيوم كاجوال	0U26	B-56
CID860	Shamel Plaza	CID860	شامل بلازا	0U26	D-5
CID861	Steinike Hall (SH)	CID861	قاعة شتاينيك (SH)	0U26	F-8
CID862	Banoosh Foodstuff Est.	CID862	مؤسسة بانوش للمواد الغذائية	0U38	B-40
CID863	Shamasi	CID863	شماسي	0U26	null
CID864	Shabba Trading Est.	CID864	مؤسسة شبا للتجارة	00U2	F-51
CID865	Red Ribbons	CID865	شرائط حمراء	0U26	D-1
CID866	Ali Al-Dossary	CID866	علي الدوسري	0U26	null
CID867	Rehmani	CID867	رحماني	0U26	null
CID868	Rashid Plaza	CID868	راشد بلازا	0U26	B-22
CID869	Elegant Palace	CID869	القصر الأنيق	0U26	B-22
CID870	Sabaya Cosmetics	CID870	صبايا لمستحضرات التجميل	0U26	B-53
CID871	Bin Qadeem Stores Trading	CID871	تجارة مخازن بن قديم	00U8	A-47
CID872	Bader	CID872	بدر	0U26	B-41
CID873	Adnan	CID873	عدنان	0U26	B-51
CID874	Karzakan	CID874	كرزكان	0U38	D-18
CID875	Karana	CID875	كارانا	0U38	D-18
CID876	Amary	CID876	عامري	00U8	A-47
CID877	Sharqia	CID877	الشرقية	00U8	A-47
CID878	Umkhalid	CID878	أمخاليد	0U26	B-36
CID879	Fakhamah	CID879	فخمة	0U26	B-57
CID880	Soroor	CID880	سورور	0U38	F-10
CID881	General Store 2	CID881	المتجر العام 2	0U26	B-60
CID882	Rashad Center	CID882	مركز رشاد	0U26	E-46
CID883	Well Done	CID883	أحسنت	0U38	E-48
CID884	Dijla Poultry Farm	CID884	مزرعة دواجن دجلة	0U38	A-52
CID885	Sarekh Dammam	CID885	سارخ الدمام	0U26	B-76
CID886	S & S Sima	CID886	س آند إس سيما	00U8	E-21
CID887	Layan Auto Parts	CID887	ليان قطع غيار السيارات	0U38	B-53
CID888	White Rose	CID888	الوردة البيضاء	0U26	F-21
CID889	Baby Dream	CID889	بيبي دريم	0U26	A-10
CID890	Jamrat Hajar	CID890	جمرات حجر	0U26	E-17
CID891	Kawser	CID891	كوثر	0U26	null
CID892	Industrial Trading House (ITH)	CID892	بيت التجارة الصناعي (ITH)	0U38	E-14
CID893	Tahir Group	CID893	مجموعة الطاهر	0U26	D-36
CID894	Mohammed Al-Tamimi	CID894	محمد التميمي	0U38	null
CID895	Ekhtiyar Al-Mustahlaq Super Market	CID895	سوبر ماركت إختيار المستقل.	0U38	E-12
CID896	Crispy and Spicy	CID896	كرسبي آند سبايسي	00U8	E-14
CID897	Beauty Scarf	CID897	وشاح الجمال	0U26	E-14
CID898	Shifa AL-Jubail Pharmacy	CID898	صيدلية شفاء الجبيل	0U38	E-13
CID899	Falak	CID899	فلك	0U26	E-37
CID900	Adwa Al-Ekhtiyar Center	CID900	مركز عدوى التخصص	0U26	E-13
CID901	Ayoop	CID901	أيوب	0U26	null
CID902	Abayat Al-Hasna	CID902	عباية الحسناء	0U26	null
CID903	DEBAJ AL-RAKI CENTER	CID903	مركز ديباج الراكي	0U26	E-5
CID904	Thabeay Restaurant	CID904	مطعم ذبيع	0U26	E-9
CID905	roshna	CID905	روشنا	0U38	null
CID906	Rafa Pharmacy	CID906	صيدلية رافا	0U38	E-36
CID907	SARAYA CENTER	CID907	مركز سرايا	0U26	F-37
CID908	DAR AL-TOFOLAH	CID908	دار الطفولة	0U38	E-11
CID909	MUKHTARAH	CID909	مختارة	0U26	D-15
CID910	NASSER TRADING CENTER	CID910	مركز ناصر التجاري	00U8	E-12
CID911	Health Pillow	CID911	وسادة صحية	0U38	D-0
CID912	K.F.S.H.D.	CID912	ك.ف.س.ح.د.	0U26	E-36
CID913	Khobar Cooperative Clinic	CID913	عيادة الخبر التعاونية	0U38	E-36
CID914	RADI HALAL	CID914	راضي حلال	0U26	null
CID915	ALAM AL-TAKHFIDAT CENTER	CID915	مركز علم التخصصات	0U26	null
CID916	AL-JAWKER	CID916	الجوكر	00U8	null
CID917	DIWAN AL-MASHAWI RESTURANT	CID917	مطعم ديوان المشوي	0U38	E-14
CID918	Tanveer	CID918	تنفير	0U26	null
CID919	Serbal	CID919	سربال	0U26	E-10
CID920	WAHAT AL-SHAMIL PLAZA	CID920	واحة الشمال بلازا	0U26	null
CID921	SEA FOOD RESTURANT	CID921	مطعم المأكولات البحرية	00U8	null
CID922	Shirimpy International	CID922	شيريمبي الدولية	0U26	E-12
CID923	JAZERAT AL-SALAM FACTORY	CID923	مصنع جزيرة السلام	0U38	D-14
CID924	WAFA PALACE	CID924	قصر الوفاء	0U26	E-9
CID925	BIN HUMDA ELECTRONIC	CID925	بن حمدة الإلكترونية	0U26	A-75
CID926	ALAHRAM CENTER	CID926	مركز الأهرام	0U26	null
CID927	Pillow	CID927	مخدة	0U38	D-0
CID928	TECHNICAL CENTER TURKISH	CID928	المركز التقني التركي	0U38	E-14
CID929	Ustun Ray	CID929	أوستون راي	0U38	E-14
CID930	JERAIF RESTURANT	CID930	مطعم جريف	0U38	E-37
CID931	HILAL PHARMACY	CID931	صيدلية الهلال	0U26	A-58
CID932	COLGATE	CID932	كولجيت	0U26	E-11
CID933	MOZON RESTURANT	CID933	مطعم موزون	0U39	A-32
CID934	HABIB AL-RAHMAN	CID934	حبيب الرحمن	0U26	null
CID935	PIZZA REEM	CID935	بيتزا ريم	0U26	null
CID936	KAWATIM RESTURANT/BASAM	CID936	مطعم كاواتيم / بسام	0U39	E-37
CID937	ALI M. BU SALEH TRADING & CONT.EST	CID937	علي محمد بو صالح للتجارة والاستمرار مؤسسه	0U38	E-12
CID938	ANAQAT AL-MAHA	CID938	قنوات المها	00U8	null
CID939	MASS TRADING	CID939	التداول الجماعي	0U26	null
CID940	KWATIM RESTURANT	CID940	مطعم كوتيم	0U39	E-37
CID941	ALQIMAH CENTER(TOP)	CID941	مركز القمة(أعلى)	0U39	E-37
CID942	INTERNATIONAL AGENT EST.	CID942	مؤسسة الوكيل الدولي	0U38	F-4
CID943	Bread World	CID943	عالم الخبز	0U26	E-13
CID944	HARAT RAHAL BAKERIES & SWEETS	CID944	مخابز وحلويات حارة رحال	0U39	E-11
CID945	SAMBOSA MOON	CID945	قمر سامبوسا	0U38	E-13
CID946	BRAVO	CID946	عفارم	0U38	F-15
CID947	CRISPY KING	CID947	كرسبي كينج	0U38	E-37
CID948	PARIS CENTER	CID948	مركز باريس	0U39	E-37
CID949	MALTA	CID949	مالطا	0U26	null
CID950	OLAYAN FOR ABAYAT	CID950	أوليان للعبايات	0U26	null
CID951	Seven Star	CID951	سبع نجوم	0U38	D-0
CID952	AL-JAMAL WAL KAMAL EST.	CID952	مؤسسة الجمل والكمال	00U8	null
CID953	Thalatha Al-Kwakib Est.	CID953	مؤسسة ثلاثا الكواكب.	00U8	E-22
CID954	Ibn Zahr Clinic	CID954	عيادة ابن زهر	0U26	E-2
CID955	Qabban	CID955	قبان	0U38	E-21
CID956	Alwani Trading Center	CID956	مركز اللواني التجاري	0U38	F-16
CID957	Persian Carpet Center	CID957	مركز السجاد الفارسي	0U38	F-22
CID958	Konfti Sweets	CID958	حلويات كونفتي	0U38	null
CID959	Jabri Fashion & Textiles	CID959	جابري للأزياء والمنسوجات	0U38	F-9
CID960	Doha Star For Electronic	CID960	نجمة الدوحة للإلكترونيات	0U38	null
CID961	Consumer Oasis	CID961	واحة المستهلك	0U38	A-49
CID962	Mansoor Rabiyah Sayed (MRS)	CID962	منصور رابعة سيد (MRS)	0U38	F-6
CID963	Matbah Al-Mashra Restaurant	CID963	مطعم مطبة المشرى	0U38	F-9
CID964	One, Two and More	CID964	واحد واثنان وأكثر	0U38	F-9
CID965	Moh. Abd. Al-Hajire Trading Est.	CID965	الوزاره. مؤسسة عبد الهاجير التجارية	0U38	null
CID966	Abu Traika Rice	CID966	أرز أبو طريقة	0U38	D-16
CID967	Mubaraka	CID967	مباركة	0U38	F-7
CID968	Ruqee	CID968	رقي	0U38	F-7
CID969	Ribbons Pastries and Bakeshope	CID969	شرائط المعجنات والخبز	0U38	D-16
CID970	Vichy Laboratories	CID970	مختبرات فيشي	0U38	F-26
CID971	Gulf Waves	CID971	أمواج الخليج	0U26	null
CID973	Kahramana (KS) + View Aqua	CID973	كهرمانا (كانساس) + عرض أكوا	0U38	B-14
CID974	Shawarma Gina	CID974	شاورما جينا	00U8	E-29
CID975	Medical Uniform	CID975	الزي الطبي	0U39	F-19
CID976	Sam Mathew	CID976	سام ماثيو	0U38	E-28
CID977	Qamma Al-Baraka	CID977	قماء البركة	0U38	F-4
CID978	Meshkhal Charcoal	CID978	مشخال فحم	0U26	E-29
CID979	Jood Baby	CID979	جود بيبي	0U26	F-4
CID980	Heaven Sweets & Nuts	CID980	حلويات السماء والمكسرات	00U8	E-11
CID981	Haji Markets W.L.L.	CID981	أسواق حاجي ذ.م.م	0U38	E-29
CID982	Laeonha Est.	CID982	مؤسسة ليونها	0U38	E-29
CID983	Bin Afif (Arda Trading Corp.)	CID983	بن عفيف (شركة أرض التجارية)	0U38	F-18
CID984	Kadiwa Shopping Center	CID984	مركز كاديوا للتسوق	0U38	E-14
CID985	Sama Sama Shopping Center	CID985	مركز سما للتسوق	0U38	E-14
CID986	Fouzan Food Supplies	CID986	فوزان للإمدادات الغذائية	0U38	E-14
CID987	Dahareez Toys	CID987	ألعاب الظهريز	0U39	F-19
CID988	Plastic Marketing	CID988	تسويق البلاستيك	0U26	null
CID989	Islamic Cultural Center	CID989	المركز الثقافي الإسلامي	0U38	F-4
CID990	Nabel	CID990	نابل	0U26	F-4
CID991	Senbel Agriculture & Veterenary Mat Est.	CID991	مؤسسة سنبل للزراعة والبيطرية	0U38	null
CID992	Tabaqat	CID992	طبقات	0U38	E-14
CID993	Knife	CID993	سكين	0U26	null
CID994	United (RC Jubail)	CID994	يونايتد (RC الجبيل)	0U26	E-2
CID995	Nemar Trading Est.	CID995	مؤسسة نمار التجارية	0U38	null
CID996	Jory Fashion	CID996	أزياء جوري	0U26	F-19
CID997	Khonaini Pharmacies	CID997	صيدليات خونيني	0U26	F-19
CID998	Abu Haitem Turkey Restaurant	CID998	مطعم أبو حطتم تركيا	0U38	E-48
CID999	Lights	CID999	اضواء	0U38	null
CID2124	Kadim Bahrain	CID2124	كاظم البحرين	0U38	
CID2125	Advanced Textile Factory	CID2125	مصنع الانسجة المتطورة	00U1	
CID226	Anud Cold Store	CID226	ثلاجة العنود	0U38	B-47
CID1472	Mashwa AlBalad	CID1472	مشوي البلد	0U26	B-19
CID2069	Salat Bit Al-Falafel	CID2069	سلة بيت الفلافل	0U39	Box - 1
CID1981	Rathath Al-Sharq	CID1981	رذاذ الشرق	00U8	Box 1
CID1423	Heritage Village	CID1423	قرية الشعبية	0U38	E-35, D-0
CID1123	Kanayon Supermarket	CID1123	سوبر ماركت كنيان	0U26	F-17
CID972	Ghader Nuts	CID972	مكسرات غدير	0U38	E-14
CID746	Ladin	CID746	لادن	0U38	null
CID1676	Hot and Spicy	CID1676	ساخن وحار	0U38	B-24
CID2128	Best Car Wash	CID2128	مغسلة أفضل سيارات	00U4	
CID2129	Betna Spices	CID2129	بهارات بيتنا 	00U4	
CID2130	Hawilo	CID2130	هويلو	00U4	
CID2131	Heart Life	CID2131	حياة القلوب	00U1	
CID2132	Hazaz Saudia	CID2132	هزاز السعودية	00U1	
CID1596	Great Area Discount	CID1596	تخفيضات الساحة الكبرى	0U26	D-12
CID1205	Bench	CID1205	مائدة	0U38	F-33
CID2133	Shafaq Cafeteria	CID2133	كفتيريا شفق	0U39	
CID2134	Mudeef Restaurant Hid	CID2134	مطعم المضيف الحد	0U38	
CID1313	Mr. Gambary	CID1313	مستر جمبري	0U38	A-27
CID2135	Rabee Flowers	CID2135	زهرة الربيع	\N	
CID2136	Al Dawa	CID2136	الدواء	\N	
CID2137	High End Services Contractig	CID2137	موسسة الخدمات 	\N	
CID1959	Fatera Sakhena	CID1959	الفطيرة الساخنة	00U2	Box 1
CID2138	House Of Spices	CID2138	بيت التوابل	\N	
CID1885	Sedress	CID1885	سيدرس	0U26	B-72
CID2139	Reef Charcoal	CID2139	فحم جبل الريف	0U38	
CID2142	Upper Class	CID2142	الطبقة العليا	0U38	
CID2146	Coffee Baskets company	CID2146	موسسة سلال البن 	0U39	
CID2149	Al-Munnjif	CID2149	المنجف	\N	
CID2147	Awafi Medical 	CID2147	عوافي الطبية	00U1	
CID2152	SANEEL Contracting 	CID2152	سنيل للمقاولات	00U1	
CID2151	Durat Hadramawt Restaurant	CID2151	مطعم درة حضرموت	0U32	
CID2143	melonation	CID2143	ميلونيشن	0U38	
CID2144	Sultan Resturant	CID2144	مطعم السلطان	\N	
CID2140	Ayat	CID2140	آيات	00U2	
CID2126	WG	CID2126	دبليو جي	\N	
CID2127	SR	CID2127	إس آر	\N	
CID2153	Test	CID2153	تجربة	00U0	
CID2154	Yale	CID2154	المعجل يال	0U38	
CID2155	DIAMOND RESTURANT	CID2155	مطعم رضا	0U38	
CID2157	aaaa	CID2157	هشام	\N	
CID2160	Nazim Restaurant	CID2160	مطعم بيت ناظم	0U38	
CID2158	HEALTHY	CID2158	صحي	0U38	
CID2161	Wi Se	CID2161	وي سي	0U38	
CID2145	Shawarma M	CID2145	شاورما إم	0U40	
CID2150	Sprouts	CID2150	سبراوتس	0U38	
CID2148	So care	CID2148	سوكير مصري	0U38	
CID2159	Fatah Snopar	CID2159	فتة وصنوبر	0U32	
CID2163	DAR MUBARAK	CID2163	دار مبارك	0U32	
CID2164	GATE	CID2164	بوابه	00U2	
CID2165	Terqwaz Car Wash	CID2165	مغسلة تركواز	0U38	
CID2166	MODERN CARWASH	CID2166	مغسلة المصنع	0U38	
CUS911599	شركة النور	C1599	\N	\N	\N
\.


--
-- Data for Name: document_approvals; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.document_approvals (id, document_id, approver_id, approval_status, approval_date, comments, created_at) FROM stdin;
\.


--
-- Data for Name: document_comments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.document_comments (id, document_id, comment_text, commented_by, parent_comment_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: document_subscriptions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.document_subscriptions (id, document_id, user_id, subscription_type, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: document_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.document_templates (id, template_name, document_type, template_content, description, is_default, created_by, created_at, updated_at, template_variables, is_active, version, parent_template_id, category, department, access_level, usage_count, last_used_at) FROM stdin;
\.


--
-- Data for Name: document_views; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.document_views (id, document_id, viewed_by, viewed_at, ip_address, user_agent, device_type, view_duration) FROM stdin;
5	1	00U1	2025-07-21 14:25:46.914	\N	\N	desktop	0
6	1	00U1	2025-07-21 14:29:04.584	\N	\N	desktop	0
7	1	00U1	2025-07-21 16:17:38.816	\N	\N	desktop	0
8	1	00U1	2025-07-21 16:39:09.335	\N	\N	desktop	0
9	1	00U1	2025-07-21 17:21:14.526	\N	\N	desktop	0
10	1	00U1	2025-07-21 17:29:29.316	\N	\N	desktop	0
11	1	00U1	2025-07-21 17:36:09.009	\N	\N	desktop	0
12	1	00U1	2025-07-21 17:41:43.834	\N	\N	desktop	0
13	1	00U1	2025-07-21 19:24:27.453	\N	\N	desktop	0
14	1	00U1	2025-07-22 00:37:25.426	\N	\N	desktop	0
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.documents (id, document_number, document_type, title, content, status, priority, created_by, created_at, updated_at, effective_date, expiry_date, category, tags, view_count, is_archived, archived_at, archived_by, archive_reason, template_id, version, parent_document_id, authorized_by, authorized_at, recipient_ids, section_ids, is_public, attachments, document_references, download_count, last_viewed_at, reviewed_by, approved_by, published_by, review_date, department, access_level, approval_workflow, is_template, is_active, compliance_required, audit_trail, reviewed_at, approved_at, published_at, requires_approval) FROM stdin;
1	INS2025-0001	instruction	New MPBF Production System	We Create new production web application to input production data , this application well be helpful to all MPBF employees to use.\n\nUnderstanding the benefits of this application is important manner, it we help management to evaluate and monitor company strength and weakness points.\n\nalso it will help evaluating operators performance, that will lead to accurate decisions about , bounces and other payments.	active	high	00U1	2025-07-17 02:15:46.853837	2025-07-17 02:15:46.733	2025-07-01	\N		{}	10	f	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	f	\N	\N	0	2025-07-22 00:37:25.666	\N	\N	\N	\N	\N	standard	{}	f	t	f	[]	\N	\N	\N	f
\.


--
-- Data for Name: employee_of_month; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.employee_of_month (id, user_id, month, year, obligation_points, quality_score, attendance_score, productivity_score, total_score, rank, reward, reward_amount, notes, created_at) FROM stdin;
1	0U50	6	2025	100	100	100	100	100	\N	1000000	100000	phenomenal	2025-06-10 07:34:49.863732
\.


--
-- Data for Name: final_products; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.final_products (id, job_order_id, quantity, completed_date, status) FROM stdin;
\.


--
-- Data for Name: geofences; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.geofences (id, name, description, center_latitude, center_longitude, radius, is_active, created_at, updated_at, geofence_type, section_ids) FROM stdin;
9	Factory	\N	26.40117760	50.06950400	300	f	2025-07-14 10:26:36.506095	2025-07-14 10:26:36.506095	factory	{}
10	Factory	26.453673212108068, 50.04855469004882	26.45367321	50.04855469	300	f	2025-07-15 05:00:14.309417	2025-07-15 05:00:14.309417	Factory	{}
12	Factory		26.44049920	50.04984320	300	f	2025-07-21 14:14:43.7667	2025-07-21 14:14:43.7667	factory	{}
11	Home		26.45566637	50.08812719	100	f	2025-07-21 01:09:29.585646	2025-07-21 01:09:29.585646	factory	{}
13	Factory		26.45360594	50.04861533	100	t	2025-07-22 01:08:43.811651	2025-07-22 01:08:43.811651	factory	{}
\.


--
-- Data for Name: hr_complaints; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hr_complaints (id, complainant_id, against_user_id, complaint_type, priority, title, description, desired_outcome, is_anonymous, status, created_at, updated_at, submitted_date, assigned_to) FROM stdin;
\.


--
-- Data for Name: hr_violations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hr_violations (id, violation_number, user_id, reported_by, violation_type, violation_subtype, severity, title, description, previous_violation_count, is_repeat_offense, related_violation_ids, action_taken, action_details, disciplinary_points, estimated_cost, actual_cost, cost_recovered, status, resolution_date, resolution_notes, evidence_files, witness_ids, follow_up_required, follow_up_date, follow_up_notes, incident_date, report_date, created_at, updated_at) FROM stdin;
4	VIO-2025-0001	00U9	0U16	production	wrong_specifications	critical	000	000000000000000000	0	f	{}	warning	\N	0	0	0	f	open	\N	\N	\N	{}	f	\N	\N	2025-07-01 07:09:00	2025-07-01 07:09:34.718546	2025-07-01 07:09:34.718546	2025-07-01 07:09:34.718546
5	VIO-2025-0011	0U13	00U1	policy	dress_code	critical	لم يلتزم بالخلط	لم يلتزم بالخلط	0	f	{}	written_warning	\N	0	0	0	f	open	\N	\N	\N	{}	f	\N	\N	2025-07-03 05:03:00	2025-07-03 05:04:18.716669	2025-07-03 05:04:18.716669	2025-07-03 05:04:18.716669
\.


--
-- Data for Name: iot_alerts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.iot_alerts (id, sensor_id, alert_type, severity, message, current_value, threshold_value, is_active, acknowledged_by, acknowledged_at, resolved_by, resolved_at, created_at) FROM stdin;
1	SENSOR001	threshold_exceeded	warning	Extruder A Temperature Warning	87.3	85	t	\N	\N	\N	\N	2025-06-03 13:26:15.447317
2	SENSOR002	threshold_exceeded	warning	Extruder A Pressure Warning	125.8	120	t	\N	\N	\N	\N	2025-06-03 13:26:15.447317
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.items (id, category_id, name, full_name) FROM stdin;
ITM001	CAT001	5GP	5GP
ITM002	CAT001	8GP	8GP
ITM003	CAT001	10GP	10GP
ITM004	CAT001	20GP	20GP
ITM005	CAT001	30GP	30GP
ITM006	CAT001	50GP	50GP
ITM007	CAT001	55GP	55GP
ITM008	CAT001	60GP	60GP
ITM009	CAT001	70GP	70GP
ITM010	CAT001	80GP	80GP
ITM011	CAT002	5GR	5GR
ITM012	CAT002	8GR	8GR
ITM013	CAT002	10GR	10GR
ITM014	CAT002	20GR	20GR
ITM015	CAT002	30GR	30GR
ITM016	CAT002	50GR	50GR
ITM017	CAT002	55GR	55GR
ITM018	CAT003	SS-TSB	SS-TSB
ITM019	CAT003	S-TSB	S-TSB
ITM020	CAT003	M-TSB	M-TSB
ITM021	CAT003	L-TSB	L-TSB
ITM022	CAT003	XL-TSB	XL-TSB
ITM023	CAT003	XXL-TSB	XXL-TSB
ITM024	CAT003	XXXL-TSB	XXXL-TSB
ITM025	CAT004	SSS-CB	SSS-CB
ITM026	CAT004	SS-CB	SS-CB
ITM027	CAT004	S-CB	S-CB
ITM028	CAT004	M-CB	M-CB
ITM029	CAT004	L-CB	L-CB
ITM030	CAT004	XL-CB	XL-CB
ITM031	CAT004	XXL-CB	XXL-CB
ITM032	CAT004	XXXL-CB	XXXL-CB
ITM033	CAT005	4M-FTC	4M-FTC
ITM034	CAT005	6M-FTC	6M-FTC
ITM035	CAT005	Samp-FTC	Samp-FTC
ITM036	CAT006	50CM-NFTC	50CM-NFTC
ITM037	CAT006	55CM-NFTC	55CM-NFTC
ITM038	CAT006	60CM-NFTC	60CM-NFTC
ITM039	CAT006	Samp-NFTC	Samp-NFTC
ITM040	CAT007	#6 NylFact	#6 NylFact
ITM041	CAT007	#8 NylFact	#8 NylFact
ITM042	CAT007	#10NylFact	#10NylFact
ITM043	CAT007	#12NylFact	#12NylFact
ITM044	CAT008	Nyl#1	Nyl#1
ITM045	CAT009	LD#1	LD#1
ITM046	CAT010	HD#1	HD#1
ITM047	CAT011	30L-FB	30L-FB
ITM048	CAT011	50L-FB	50L-FB
ITM049	CAT012	1K-CHB	1K-CHB
ITM050	CAT012	1.5K-CHB	1.5K-CHB
ITM051	CAT012	2K-CHB	2K-CHB
ITM052	CAT012	4K-CHB	4K-CHB
ITM053	CAT002	70GR	70GR
ITM054	CAT007	#14NylFact	#14NylFact
ITM055	CAT007	#16NylFact	#16NylFact
ITM056	CAT008	Nyl#2	Nyl#2
ITM057	CAT008	Nyl#3	Nyl#3
ITM058	CAT008	Nyl#4	Nyl#4
ITM059	CAT008	Nyl#5	Nyl#5
ITM060	CAT012	3K-CHB	3K-CHB
ITM061	CAT012	6K-CHB	6K-CHB
ITM062	CAT010	HD#2	HD#2
ITM063	CAT010	HD#3	HD#3
ITM064	CAT007	#18NylFact	#18NylFact
ITM065	CAT007	#20NylFact	#20NylFact
ITM066	CAT007	#24NylFact	#24NylFact
ITM067	CAT008	Nyl#6	Nyl#6
ITM068	CAT012	9K-CHB	9K-CHB
ITM069	CAT012	5.5K-CHB	5.5K-CHB
ITM070	CAT012	5K-CHB	5K-CHB
ITM071	CAT008	Nyl#7	Nyl#7
ITM072	CAT008	Nyl#8	Nyl#8
ITM073	CAT012	20K-CHB	20K-CHB
ITM074	CAT008	Nyl#9	Nyl#9
ITM075	CAT009	LD#2	LD#2
ITM076	CAT009	LD#3	LD#3
ITM077	CAT010	HD#4	HD#4
ITM078	CAT011	60L-FB	60L-FB
ITM079	CAT009	No.5 - 10Kg	No.5 - 10Kg
ITM080	CAT009	LD#4	LD#4
ITM081	CAT009	No.10 - 10Kg	No.10 - 10Kg
ITM082	CAT009	No.20 - 10Kg	No.20 - 10Kg
ITM083	CAT001	100GP	100GP
ITM084	CAT010	cover	cover
ITM085	CAT009	No.1 - 5Kg	No.1 - 5Kg
ITM086	CAT009	No.2 - 5Kg	No.2 - 5Kg
ITM087	CAT009	No.3 - 5Kg	No.3 - 5Kg
ITM088	CAT010	HD#5	HD#5
ITM089	CAT009	No.5 - 5Kg	No.5 - 5Kg
ITM090	CAT009	No.4 - 5Kg	No.4 - 5Kg
ITM091	CAT011	5K - FB	5K - FB
ITM092	CAT011	10K - FB	10K - FB
ITM093	CAT009	No.40 - 30-10Kg	No.40 - 30-10Kg
ITM094	CAT009	LD#5	LD#5
ITM095	CAT009	No.3 - 10Kg	No.3 - 10Kg
ITM096	CAT009	No.4 - 10Kg	No.4 - 10Kg
ITM097	CAT004	0.7K-CB	0.7K-CB
ITM098	CAT004	1.2K-CB	1.2K-CB
ITM099	CAT004	2.8K-CB	2.8K-CB
ITM100	CAT004	1.250K-CB	1.250K-CB
ITM101	CAT009	No.1&2-10Kg	No.1&2-10Kg
ITM102	CAT004	2.750K-CB	2.750K-CB
ITM103	CAT009	1MM	1MM
ITM104	CAT009	1.5MM	1.5MM
ITM105	CAT009	2MM	2MM
ITM106	CAT005	Rub-FTC	Rub-FTC
ITM107	CAT005	Rub-NFTC	Rub-NFTC
ITM108	CAT009	C100	C100
ITM109	CAT009	W100	W100
ITM110	CAT015	UC	UC
ITM111	CAT005	FTC	FTC
ITM112	CAT006	NFTC	NFTC
\.


--
-- Data for Name: jo_mix_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.jo_mix_items (id, jo_mix_id, job_order_id, quantity, created_at) FROM stdin;
120	62	487	300.00	2025-07-22 07:22:04.698553
121	62	486	300.00	2025-07-22 07:22:04.93079
122	62	485	480.00	2025-07-22 07:22:05.159227
123	62	484	480.00	2025-07-22 07:22:05.388388
124	63	487	153.85	2025-07-22 07:22:06.766746
125	63	486	153.85	2025-07-22 07:22:06.995429
126	63	485	246.15	2025-07-22 07:22:07.224731
127	63	484	246.15	2025-07-22 07:22:07.453676
128	64	487	146.15	2025-07-22 07:22:08.839793
129	64	486	146.15	2025-07-22 07:22:09.06875
130	64	485	233.85	2025-07-22 07:22:09.300917
131	64	484	233.85	2025-07-22 07:22:09.535674
\.


--
-- Data for Name: jo_mix_materials; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.jo_mix_materials (id, jo_mix_id, material_id, quantity, created_at, percentage) FROM stdin;
179	62	1	150.00	2025-07-22 07:22:05.618224	40
180	62	2	150.00	2025-07-22 07:22:05.850863	40
181	62	7	75.00	2025-07-22 07:22:06.080274	20
182	63	1	125.00	2025-07-22 07:22:07.683788	20
183	63	2	50.00	2025-07-22 07:22:07.912835	10
184	63	7	425.00	2025-07-22 07:22:08.141565	70
185	64	1	125.00	2025-07-22 07:22:09.764607	20
186	64	2	50.00	2025-07-22 07:22:09.993536	10
187	64	7	400.00	2025-07-22 07:22:10.223086	70
\.


--
-- Data for Name: jo_mixes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.jo_mixes (id, aba_formula_id, mix_number, total_quantity, screw_type, status, created_by, created_at, completed_at) FROM stdin;
62	6	MIX20250722001	390.00	A	pending	00U1	2025-07-22 07:22:04.462711	\N
63	6	MIX20250722002	600.00	B	pending	00U1	2025-07-22 07:22:06.538006	\N
64	6	MIX20250722003	570.00	B	pending	00U1	2025-07-22 07:22:08.61064	\N
\.


--
-- Data for Name: job_order_updates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.job_order_updates (id, job_order_id, update_type, title, message, priority, metadata, created_by, created_at) FROM stdin;
11	371	status_change	Job Order Status Updated	Job Order #371 status changed from pending to in_progress	medium	{"changedBy": "system", "newStatus": "in_progress", "oldStatus": "pending"}	0U55	2025-07-12 07:17:18.066556
12	372	priority_change	High Priority Job Order	Job Order #372 priority escalated to urgent due to customer requirements	urgent	{"reason": "customer_requirements", "newPriority": "urgent", "oldPriority": "medium"}	0U55	2025-07-12 07:17:18.066556
\.


--
-- Data for Name: job_orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.job_orders (id, order_id, customer_product_id, quantity, status, customer_id, finished_qty, received_qty, receive_date, received_by) FROM stdin;
371	186	1358	330	pending	\N	0	0	\N	\N
372	186	1359	330	pending	\N	0	0	\N	\N
515	270	4907	105	pending	\N	0	0	\N	\N
516	270	4987	163.9	pending	\N	0	0	\N	\N
485	251	3464	480	in_progress	\N	0	0	\N	\N
486	251	2546	300	in_progress	\N	0	0	\N	\N
517	272	4984	2100	pending	\N	0	0	\N	\N
391	197	929	600	pending	\N	0	0	\N	\N
392	197	930	960	pending	\N	0	0	\N	\N
393	197	931	960	pending	\N	0	0	\N	\N
519	274	4983	300	pending	\N	0	0	\N	\N
484	251	4839	480	in_progress	\N	0	0	\N	\N
412	210	3841	210	pending	\N	0	0	\N	\N
413	210	3842	210	pending	\N	0	0	\N	\N
414	210	3843	210	pending	\N	0	0	\N	\N
415	210	4726	210	pending	\N	0	0	\N	\N
416	210	4728	210	pending	\N	0	0	\N	\N
417	210	78	840	pending	\N	0	0	\N	\N
418	210	79	472.5	pending	\N	0	0	\N	\N
419	210	3866	393.75	pending	\N	0	0	\N	\N
472	245	4536	275	pending	\N	0	0	\N	\N
473	245	4537	495	pending	\N	0	0	\N	\N
480	248	3455	360	pending	\N	0	0	\N	\N
481	248	3608	360	pending	\N	0	0	\N	\N
487	251	4274	300	pending	\N	0	0	\N	\N
514	269	4501	315	pending	\N	0	0	\N	\N
512	267	2996	2101.05	in_progress	\N	0	0	\N	\N
518	273	4985	840	pending	\N	0	0	\N	\N
498	259	4859	360	pending	\N	0	0	\N	\N
499	259	4306	420	pending	\N	0	0	\N	\N
504	263	4531	330	pending	\N	0	0	\N	\N
508	265	4982	1100	pending	\N	0	0	\N	\N
509	265	4981	1100	pending	\N	0	0	\N	\N
510	265	4980	1100	pending	\N	0	0	\N	\N
\.


--
-- Data for Name: leave_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.leave_requests (id, user_id, leave_type, start_date, end_date, days_requested, reason, status, approved_by, approved_at, notes, created_at, updated_at, total_days, rejection_reason, attachments, requested_at) FROM stdin;
\.


--
-- Data for Name: machine_machine_parts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.machine_machine_parts (id, machine_id, machine_part_id, created_at) FROM stdin;
\.


--
-- Data for Name: machine_parts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.machine_parts (id, machine_name, section_id, part_type, name, code, serial_number, size, size_unit, size_value, note, last_maintenance_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: machine_sensors; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.machine_sensors (id, machine_id, sensor_type, name, unit, min_value, max_value, warning_threshold, critical_threshold, is_active, calibration_date, next_calibration_date) FROM stdin;
SENSOR001	MCH001	temperature	Extruder A Temperature Sensor	°C	\N	\N	85	95	t	\N	\N
SENSOR002	MCH001	pressure	Extruder A Hydraulic Pressure	bar	\N	\N	120	140	t	\N	\N
SENSOR003	MCH002	speed	Extruder B Motor Speed	rpm	\N	\N	1800	2000	t	\N	\N
SENSOR004	MCH002	vibration	Extruder B Vibration Monitor	Hz	\N	\N	50	75	t	\N	\N
SENSOR005	MCH007	energy	Extruder F Power Monitor	kW	\N	\N	80	100	t	\N	\N
\.


--
-- Data for Name: machines; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.machines (id, name, section_id, is_active, serial_number, supplier, date_of_manufacturing, model_number) FROM stdin;
MCH002	Extruder "B" 	SEC004	t	\N	\N	\N	\N
MCH007	Extruder "F" 	SEC004	t	\N	\N	\N	\N
MCH001	Extruder "A" 	SEC004	t	\N	\N	\N	\N
MCH004	Extruder "D" 	SEC004	t	\N	\N	\N	\N
MCH008	Extruder "G" 	SEC004	t	\N	\N	\N	\N
MCH010	Extruder "M" 	SEC004	t	\N	\N	\N	\N
MCH003	Extruder "C" 	SEC004	t	\N	\N	\N	\N
MCH015	Printing "D" 	SEC005	t	\N	\N	\N	\N
MCH014	Printing "C" 	SEC005	t	\N	\N	\N	\N
MCH017	Printing "F" Inline 	SEC005	t	\N	\N	\N	\N
MCH012	Printing "A" 	SEC005	t	\N	\N	\N	\N
MCH005	Extruder "E" 	SEC004	t	\N	\N	\N	\N
MCH013	Printing "B" 	SEC005	t	\N	\N	\N	\N
MCH016	Printing "E" Inline 	SEC005	t	\N	\N	\N	\N
MCH009	Extruder "H" 	SEC004	t	\N	\N	\N	\N
MCH011	Extruder "N" 	SEC004	t	\N	\N	\N	\N
MCH018	Printing "G" Inline 	SEC005	t	\N	\N	\N	\N
MCH021	Cutting Roll Machin	SEC006	t	\N	\N	\N	\N
MCH022	Cutting TC Machine HM	SEC006	t	\N	\N	\N	\N
MCH023	Cutting T-Shirt Fast A	SEC006	t	\N	\N	\N	\N
MCH024	Cutting T-Shirt Fast B	SEC006	t	\N	\N	\N	\N
MCH025	Cutting LD Machine	SEC006	t	\N	\N	\N	\N
MCH026	Cutting Roll Manuel	SEC006	t	\N	\N	\N	\N
MCH027	Cutting TC Core Machine	SEC006	t	\N	\N	\N	\N
MCH028	Cutting PKT Machine	SEC006	t	\N	\N	\N	\N
MCH029	High Speed T-Shirt	SEC006	t	\N	\N	\N	\N
MCH030	One line Cutting Machine A	SEC006	t	\N	\N	\N	\N
MCH019	Mixer "A" 	SEC004	t	\N	\N	\N	\N
MCH020	Mixer "B"	SEC004	t	\N	\N	\N	\N
\.


--
-- Data for Name: maintenance_actions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.maintenance_actions (id, request_id, machine_id, action_date, action_type, part_replaced, part_id, description, performed_by, hours, cost, status, machine_part_id) FROM stdin;
\.


--
-- Data for Name: maintenance_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.maintenance_requests (id, request_number, machine_id, description, status, priority, requested_by, created_at, assigned_to, completed_at, notes, damage_type, severity, estimated_repair_time, actual_repair_time, reported_by) FROM stdin;
\.


--
-- Data for Name: maintenance_schedule; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.maintenance_schedule (id, machine_id, maintenance_type, description, frequency, last_completed, next_due, assigned_to, priority, estimated_hours, instructions, status, created_by, task_name) FROM stdin;
\.


--
-- Data for Name: master_batches; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.master_batches (id, name) FROM stdin;
MB001	White EP11105W
MAS001	Clear  MP00000
MAS002	Black  EP82001
MAS003	Black
MAS005	White  EP11105W
MAS006	Dark Blue  EP41323
MAS007	Lt. Ivory  EP21260
MAS008	Or. Yellow  EP21262
MAS009	Pink  EP31328
MAS010	Ivory  EP21263
MAS011	White
MAS012	D. Orange
MAS013	Ivory
MAS014	D. Orange  EP31045
MAS015	Clear
MAS016	Dp Orange
MAS017	Mix. Green  MP10000
MAS018	Red
MAS019	Yellow
MAS020	Beige
MAS021	Light Blue  PT-140006
MAS022	Mint Green 2  EP51186
MAS023	Peach Pink  EP31314
MAS024	Light Blue  EP41307
MAS025	Cream  EP21270
MAS026	Light Green  MP11000
MAS027	Pink
MAS028	Pink  PT-180068
MAS029	Yellow  EP21259
MAS030	Lt. Ivory  5045
MAS031	Baby Pink
MAS032	Peach Pink
MAS033	Dark Green  EP51285
MAS034	Blue
MAS035	Dp Orange  EP31368
MAS036	Gray  EP71004
MAS037	Cream
MAS038	Blue  EP41237
MAS039	Light Beige
MAS040	Or. Yellow
MAS041	Red  EP31324
MAS042	Dark Blue
MAS043	Sky Blue  EP41307
MAS044	Ivory (Dark)  EP21263
MAS045	Indigo  EP41336
MAS046	Pinkish Red  EP31005
MAS047	Med Blue  EP41290
MAS048	Silver  EP91031
MAS049	Tom Red  EP31469
MAS050	Light Grey  PT-170005
MAS051	Light Blue  PT-140022
MAS052	Lt. Orange  EP31311
MAS053	Parrot Green  PT-150052
MAS054	Radiant Gold  EP991193
MAS055	Ivory  PT-120009
MAS056	Leaf Green  EP51364
MAS057	Turq Green  EP51282
MAS058	Gold  EP991184G
MAS059	Mnt Green 2  EP51186
MAS060	Light Ivory  PT-120008
MAS061	Baby Pink  EP31009
MAS062	Dark Red  EP31323
MAS063	Choco Brown  EP61021
MAS064	Mango Yellow  EP21264
MAS065	Coffee Brown  EP61020
MAS066	Yellow Ivory  Mixed
MAS067	cream18156
MAS068	cream 18156
MAS069	Light Beige  EP61158
MAS070	Light Blue  sample
MAS071	Yellow  12837
MAS072	cream 18155
MAS073	yellow 12837
MAS074	pink  sample
MAS075	light blue
MAS076	green
MAS077	Yellow  PT-130001
MAS078	Sample  00000
MAS079	Dark Blue  PT-140017
MAS080	Yellow  PT-130002
MAS081	Orange
MAS082	Blue  PT-140017
MAS083	Light Green  /Mixed
MAS084	Mint Green  EP51284
MAS085	Lime Yellow  EP21097
MAS086	Beige  EP61007
MAS087	Light Green  PT-15005
MAS088	Med Ivory  PT-120051
MAS089	Wheat Beige  EP61067
MAS090	Ivory  EP21260
MAS091	Red  PT-180080
MAS092	Pink  PT-180180
MAS093	Ivory  5044
MAS094	Pista Green  PT-150080
MAS095	Dark Orange  PT-180143
MAS096	Grayish Blue  Sample
MAS097	Baby Blue  PT-140032
MAS098	Green  EP51365
MAS099	Beige  PT-1200013
MAS100	Violet  PT-140010
MAS101	Pink  PT-180160
MAS102	Red  PT-180168
MAS103	Light Green  PT-150005
MAS104	Violet  EP41017
MAS105	Dark Gray  PT-170004
MAS106	Baby Pink  EP180179
MAS108	MIX Colors
MAS004	Not Selected
\.


--
-- Data for Name: mix_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.mix_items (id, mix_id, raw_material_id, quantity, percentage) FROM stdin;
750	304	4	100	16.666666
751	304	2	100	16.666666
752	304	1	200	33.333332
753	304	7	200	33.333332
777	314	1	75	48.387096
778	314	2	50	32.258064
754	305	1	150	50
755	305	2	50	16.666666
756	305	5	50	16.666666
757	305	7	50	16.666666
779	314	7	25	16.129032
780	314	8	5	3.2258065
758	306	3	50	9.090909
759	306	1	100	18.181818
760	306	5	50	9.090909
761	306	7	350	63.636364
762	309	4	200	33.333332
763	309	1	200	33.333332
764	309	7	200	33.333332
765	310	1	225	42.857143
766	310	7	225	42.857143
767	310	5	75	14.285714
781	315	1	100	18.518518
782	315	2	75	13.888889
783	315	7	350	64.81481
768	311	1	150	42.857143
769	311	5	50	14.285714
770	311	7	150	42.857143
784	315	8	15	2.7777777
771	312	1	150	42.857143
772	312	5	50	14.285714
773	312	7	150	42.857143
774	313	1	150	42.857143
775	313	5	50	14.285714
776	313	7	150	42.857143
785	316	1	150	42.857143
786	316	2	50	14.285714
787	316	7	150	42.857143
\.


--
-- Data for Name: mix_machines; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.mix_machines (id, mix_id, machine_id) FROM stdin;
\.


--
-- Data for Name: mix_materials; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.mix_materials (id, created_at, order_id, mix_date, mix_person, total_quantity, mix_screw) FROM stdin;
304	2025-07-22 15:03:42.526484	\N	2025-07-22 15:03:40.603	0U19	600	A
305	2025-07-22 15:10:44.947823	\N	2025-07-22 15:10:43.037	0U27	300	A
306	2025-07-22 15:11:36.359225	\N	2025-07-22 15:11:34.471	0U27	550	B
307	2025-07-22 15:12:19.954158	\N	2025-07-22 15:12:18.041	0U27	675	A
308	2025-07-22 15:12:47.550939	\N	2025-07-22 15:12:45.659	0U27	675	A
309	2025-07-22 21:07:21.299226	\N	2025-07-22 21:07:21.041	0U31	600	A
310	2025-07-22 21:22:06.475381	\N	2025-07-22 21:22:06.23	0U31	525	A
311	2025-07-22 21:24:38.471395	\N	2025-07-22 21:24:38.216	0U31	350	A
312	2025-07-22 21:25:10.872425	\N	2025-07-22 21:25:10.605	0U31	350	A
313	2025-07-22 21:25:18.926505	\N	2025-07-22 21:25:18.624	0U31	350	A
314	2025-07-22 21:43:25.009236	\N	2025-07-22 21:43:24.494	0U31	155	A
315	2025-07-22 21:44:48.371411	\N	2025-07-22 21:44:48.109	0U31	540	B
316	2025-07-22 21:46:56.999976	\N	2025-07-22 21:46:56.423	0U31	350	B
\.


--
-- Data for Name: mobile_devices; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.mobile_devices (id, user_id, device_name, device_type, device_model, app_version, os_version, push_token, is_active, last_active, registered_at) FROM stdin;
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.modules (id, name, display_name, description, category, route, icon, is_active, created_at, updated_at) FROM stdin;
1	Categories	Categories	Manage product categories	setup	/setup/categories	FolderOpen	t	2025-06-08 04:39:08.166177	2025-06-08 04:39:08.166177
2	Products	Products	Manage products	setup	/setup/products	Package	t	2025-06-08 04:39:08.166177	2025-06-08 04:39:08.166177
3	Customers	Customers	Manage customers	setup	/setup/customers	Users	t	2025-06-08 04:39:08.166177	2025-06-08 04:39:08.166177
4	Items	Items	Manage items	setup	/setup/items	Box	t	2025-06-08 04:39:08.166177	2025-06-08 04:39:08.166177
5	Sections	Sections	Manage factory sections	setup	/setup/sections	Building2	t	2025-06-08 04:39:08.166177	2025-06-08 04:39:08.166177
6	Machines	Machines	Manage machines	setup	/setup/machines	Cog	t	2025-06-08 04:39:08.166177	2025-06-08 04:39:08.166177
7	Users	Users	Manage users	setup	/setup/users	UserPlus	t	2025-06-08 04:39:08.166177	2025-06-08 04:39:08.166177
8	Orders	Orders	Manage orders	production	/orders	ClipboardList	t	2025-06-08 04:39:08.166177	2025-06-08 04:39:08.166177
9	Workflow	Workflow	Production workflow	production	/production/workflow	GitBranch	t	2025-06-08 04:39:08.166177	2025-06-08 04:39:08.166177
10	Mix Materials	Mix Materials	Material mixing	production	/production/mix-materials	Beaker	t	2025-06-08 04:39:08.166177	2025-06-08 04:39:08.166177
11	Bottleneck Monitor	Bottleneck Monitor	Monitor bottlenecks	production	/production/bottleneck	AlertTriangle	t	2025-06-08 04:39:08.166177	2025-06-08 04:39:08.166177
12	Production Metrics	Production Metrics	Production metrics	production	/production/metrics	BarChart3	t	2025-06-08 04:39:08.166177	2025-06-08 04:39:08.166177
13	IoT Monitor	IoT Monitor	IoT monitoring	production	/production/iot	Wifi	t	2025-06-08 04:39:08.166177	2025-06-08 04:39:08.166177
14	Raw Materials	Raw Materials	Manage raw materials	warehouse	/warehouse/raw-materials	Package2	t	2025-06-08 04:39:23.480451	2025-06-08 04:39:23.480451
15	Final Products	Final Products	Manage final products	warehouse	/warehouse/final-products	PackageCheck	t	2025-06-08 04:39:23.480451	2025-06-08 04:39:23.480451
16	Unified Dashboard	Quality Dashboard	Quality control dashboard	quality	/quality/unified-dashboard	Shield	t	2025-06-08 04:39:23.480451	2025-06-08 04:39:23.480451
17	Time Attendance	Time Attendance	Employee attendance	hr	/hr/time-attendance	Clock	t	2025-06-08 04:39:23.480451	2025-06-08 04:39:23.480451
18	Employee of the Month	Employee of the Month	Employee recognition	hr	/hr/employee-of-month	Award	t	2025-06-08 04:39:23.480451	2025-06-08 04:39:23.480451
19	Violation and Complaint	Violations & Complaints	HR violations and complaints	hr	/hr/violations	AlertCircle	t	2025-06-08 04:39:23.480451	2025-06-08 04:39:23.480451
20	Maintenance Requests	Maintenance Requests	Maintenance requests	maintenance	/maintenance/requests	Wrench	t	2025-06-08 04:39:23.480451	2025-06-08 04:39:23.480451
21	Maintenance Actions	Maintenance Actions	Maintenance actions	maintenance	/maintenance/actions	Settings	t	2025-06-08 04:39:23.480451	2025-06-08 04:39:23.480451
22	Maintenance Schedule	Maintenance Schedule	Maintenance scheduling	maintenance	/maintenance/schedule	Calendar	t	2025-06-08 04:39:23.480451	2025-06-08 04:39:23.480451
23	Dashboard	Dashboard	Mobile dashboard	mobile	/mobile/dashboard	Smartphone	t	2025-06-08 04:39:23.480451	2025-06-08 04:39:23.480451
24	Operator Tasks	Operator Tasks	Operator task management	mobile	/mobile/tasks	CheckSquare	t	2025-06-08 04:39:23.480451	2025-06-08 04:39:23.480451
25	Quick Updates	Quick Updates	Quick status updates	mobile	/mobile/updates	MessageSquare	t	2025-06-08 04:39:23.480451	2025-06-08 04:39:23.480451
26	Device Management	Device Management	Mobile device management	mobile	/mobile/devices	Tablet	t	2025-06-08 04:39:23.480451	2025-06-08 04:39:23.480451
27	My Dashboard	My Dashboard	Personal dashboard	mobile	/mobile/my-dashboard	User	t	2025-06-08 04:39:23.480451	2025-06-08 04:39:23.480451
28	Reports	Reports	System reports	reports	/reports	FileText	t	2025-06-08 04:39:37.380216	2025-06-08 04:39:37.380216
29	Bag Weight Calculator	Bag Weight Calculator	Calculate bag weights	tools	/tools/bag-weight	Calculator	t	2025-06-08 04:39:37.380216	2025-06-08 04:39:37.380216
30	Ink Consumption	Ink Consumption	Track ink consumption	tools	/tools/ink-consumption	Droplets	t	2025-06-08 04:39:37.380216	2025-06-08 04:39:37.380216
31	Mix Colors	Mix Colors	Color mixing tools	tools	/tools/mix-colors	Palette	t	2025-06-08 04:39:37.380216	2025-06-08 04:39:37.380216
32	Utility Tools	Utility Tools	Various utility tools	tools	/tools/utilities	Wrench	t	2025-06-08 04:39:37.380216	2025-06-08 04:39:37.380216
33	Cost	Cost Calculator	Cost calculations	tools	/tools/cost	DollarSign	t	2025-06-08 04:39:37.380216	2025-06-08 04:39:37.380216
34	Cliches	Cliches	Manage cliches	tools	/tools/cliches	Image	t	2025-06-08 04:39:37.380216	2025-06-08 04:39:37.380216
35	Database	Database	Database management	system	/system/database	Database	t	2025-06-08 04:39:37.380216	2025-06-08 04:39:37.380216
36	Permissions	Permissions	Permission management	system	/system/permissions	Lock	t	2025-06-08 04:39:37.380216	2025-06-08 04:39:37.380216
37	Import & Export	Import & Export	Data import/export	system	/system/import-export	Download	t	2025-06-08 04:39:37.380216	2025-06-08 04:39:37.380216
38	SMS Management	SMS Management	SMS system management	system	/system/sms	MessageCircle	t	2025-06-08 04:39:37.380216	2025-06-08 04:39:37.380216
39	Server Management	Server Management	Server management	system	/system/server	Server	t	2025-06-08 04:39:37.380216	2025-06-08 04:39:37.380216
40	Order Design	Order Design	Professional product customization wizard for packaging solutions	Tools	/tools/order-design	Package	t	2025-06-14 18:43:55.733524	2025-06-14 18:43:55.733524
41	Training	Training	\N	hr	/hr/training	GraduationCap	t	2025-06-15 02:11:32.209513	2025-06-15 02:11:32.209513
42	Certificates	Certificates	Generate and manage training completion certificates	hr	/hr/certificates	Award	t	2025-06-15 02:39:47.474446	2025-06-15 02:39:47.474446
62	Enhanced Attendance	Enhanced Attendance	Smart attendance tracking with geofencing	hr	/hr/enhanced-attendance	Clock	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
63	Employee Management	Employee Management	Comprehensive employee profiles and management	hr	/hr/employee-management	Users	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
64	Employee Ranks	Employee Ranks	Manage employee hierarchy and salary scales	hr	/hr/employee-ranks	Award	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
65	Overtime & Leave	Overtime & Leave	Overtime and leave management	hr	/hr/overtime-leave	CalendarDays	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
66	Geofence Management	Geofence Management	Configure factory geofencing areas	hr	/hr/geofences	MapPin	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
67	Violation Trends	Violation Trends	Track and analyze violation patterns	hr	/hr/violation-trends	TrendingUp	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
68	HR	HR	Human Resources management overview	hr	/hr	Users	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
69	Check Types	Check Types	Define quality check procedures	quality	/quality/check-types	Settings	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
70	Checks	Quality Checks	Perform quality inspections	quality	/quality/checks	CheckCircle	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
71	Violations	Quality Violations	Track quality violations	quality	/quality/violations	AlertTriangle	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
72	Corrective Actions	Corrective Actions	Manage quality improvements	quality	/quality/corrective-actions	Tool	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
73	Penalties	Quality Penalties	Manage quality penalties	quality	/quality/penalties	Ban	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
74	Quality	Quality	Quality management overview	quality	/quality	Shield	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
75	Maintenance	Maintenance	Maintenance management overview	maintenance	/maintenance	Wrench	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
76	Maintenance Dashboard	Maintenance Dashboard	Maintenance performance dashboard	maintenance	/maintenance/dashboard	BarChart3	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
77	Production	Production	Production management overview	production	/production	Factory	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
78	Warehouse	Warehouse	Warehouse management overview	warehouse	/warehouse	Warehouse	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
79	System Settings	System Settings	System administration	system	/system	Settings	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
80	Email Configuration	Email Configuration	Configure email settings	system	/system/email-config	Mail	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
81	Notifications	Notifications	System notifications	system	/notifications	Bell	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
82	Cost Calculator	Cost Calculator	Calculate production costs	tools	/tools/cost-calculator	Calculator	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
83	Tools	Tools	Utility tools overview	tools	/tools	Wrench	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
84	Operator Dashboard	Operator Dashboard	Mobile operator dashboard	mobile	/mobile/operator-dashboard	Smartphone	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
85	Performance Metrics	Performance Metrics	Performance analytics	reports	/reports/performance	TrendingUp	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
86	Production Reports	Production Reports	Production reports	reports	/reports/production	FileText	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
87	Warehouse Reports	Warehouse Reports	Warehouse reports	reports	/reports/warehouse	Package	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
88	Quality Reports	Quality Reports	Quality reports	reports	/reports/quality	Shield	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
89	Workflow Reports	Workflow Reports	Workflow reports	reports	/reports/workflow	GitBranch	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
90	Setup	Setup	System setup and configuration	setup	/setup	Settings	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
91	Employee Dashboard	Employee Dashboard	Employee personal dashboard	hr	/employee-dashboard	User	t	2025-06-17 03:50:49.398497	2025-06-17 03:50:49.398497
92	Machine Parts	Machine Parts	Manage machine parts inventory and specifications	Setup	/setup/machine-parts	settings	t	2025-07-20 02:06:25.589494	2025-07-20 02:06:25.589494
\.


--
-- Data for Name: notification_center; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notification_center (id, title, message, type, priority, category, source, is_read, action_required, action_url, recipient_id, recipient_role, metadata, created_at, read_at, expires_at, user_id, user_role, is_archived, is_dismissed, action_data, updated_at, dismissed_at) FROM stdin;
\.


--
-- Data for Name: notification_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notification_templates (id, name, title, message, type, category, priority, is_active, created_by, trigger_event, conditions, action_required, action_url, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: operator_tasks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.operator_tasks (id, assigned_to, task_type, title, description, priority, status, due_date, related_job_order_id, related_machine_id, related_roll_id, assigned_by, started_at, completed_at, estimated_duration, actual_duration, notes, attachments, gps_location, created_at) FROM stdin;
\.


--
-- Data for Name: operator_updates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.operator_updates (id, operator_id, update_type, title, message, related_job_order_id, related_machine_id, related_roll_id, priority, status, photos, gps_location, acknowledged_by, acknowledged_at, created_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.orders (id, date, status, customer_id, user_id, note) FROM stdin;
186	2025-07-03 05:35:45.855446	pending	CID275	\N	
267	2025-07-21 17:02:44.468593	processing	CID1304	\N	
265	2025-07-21 06:45:02.080252	processing	CID2163	\N	
251	2025-07-17 06:29:00.187557	processing	CID1269	\N	
270	2025-07-22 11:52:08.252008	pending	CID2130	\N	
273	2025-07-22 15:54:35.05342	processing	CID2166	\N	
197	2025-07-03 06:35:10.048368	pending	CID723	\N	
272	2025-07-22 15:52:47.39271	processing	CID2165	\N	
274	2025-07-22 15:56:59.789194	processing	CID2164	\N	
269	2025-07-22 11:42:48.656015	processing	CID1987	\N	
263	2025-07-19 13:38:49.412749	processing	CID1998	\N	New Rubber
259	2025-07-19 05:06:38.15512	processing	CID1927	\N	
210	2025-07-06 07:09:55.520869	pending	CID741	\N	Urgent:\n 70G Roll = 10 Bundle \nNylon #10 - 50 \n50G PKT Repaking 
245	2025-07-16 06:13:26.818101	pending	CID1721	\N	Check design before starting
248	2025-07-16 06:25:19.63899	pending	CID1597	\N	
\.


--
-- Data for Name: overtime_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.overtime_requests (id, user_id, date, requested_hours, reason, status, approved_by, approved_at, notes, created_at, updated_at, approved_hours, rejection_reason, actual_hours, requested_at) FROM stdin;
\.


--
-- Data for Name: payroll_records; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payroll_records (id, user_id, pay_period_start, pay_period_end, base_hours, overtime_hours, base_pay, overtime_pay, bonuses, deductions, gross_pay, net_pay, status, processed_by, processed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: performance_reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.performance_reviews (id, user_id, reviewer_id, review_period_start, review_period_end, attendance_score, quality_score, productivity_score, teamwork_score, overall_rating, goals, achievements, areas_for_improvement, manager_comments, employee_comments, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.permissions (id, section_id, module_id, can_view, can_create, can_edit, can_delete, is_active, created_at, updated_at) FROM stdin;
2070	SEC001	1	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2071	SEC001	2	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2072	SEC001	3	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2073	SEC001	4	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2074	SEC001	5	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2075	SEC001	6	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2076	SEC001	7	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2077	SEC001	8	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2078	SEC001	9	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2079	SEC001	10	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2080	SEC001	11	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2081	SEC001	12	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2082	SEC001	13	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2083	SEC001	14	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2084	SEC001	15	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2085	SEC001	16	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2086	SEC001	17	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2087	SEC001	18	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2088	SEC001	19	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2089	SEC001	20	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2090	SEC001	21	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2091	SEC001	22	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2092	SEC001	23	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2093	SEC001	24	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2094	SEC001	25	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2095	SEC001	26	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2096	SEC001	27	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2097	SEC001	28	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2098	SEC001	29	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2099	SEC001	30	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2100	SEC001	31	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2101	SEC001	32	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2102	SEC001	33	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2103	SEC001	34	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2104	SEC001	35	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2105	SEC001	36	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2106	SEC001	37	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2107	SEC001	38	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2108	SEC001	39	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2109	SEC002	8	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2112	SEC002	12	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2117	SEC002	25	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2130	SEC004	24	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2132	SEC005	8	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2133	SEC005	9	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2134	SEC005	12	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2135	SEC005	14	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2136	SEC005	23	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2137	SEC005	24	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2138	SEC005	25	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2139	SEC005	30	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2141	SEC006	8	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2142	SEC006	9	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2143	SEC006	12	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2144	SEC006	15	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2145	SEC006	23	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2146	SEC006	24	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2147	SEC006	25	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2150	SEC007	20	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2157	SEC008	14	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2158	SEC008	15	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2160	SEC008	29	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2126	SEC004	9	t	t	t	t	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2128	SEC004	14	t	f	f	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2164	SEC004	20	t	t	f	f	t	2025-06-14 18:15:09.176569	2025-06-14 18:15:09.176569
2125	SEC004	8	t	f	f	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2166	SEC005	20	t	t	f	f	t	2025-06-14 18:21:17.382888	2025-06-14 18:21:17.382888
2167	SEC006	20	t	t	f	f	t	2025-06-14 18:21:23.388709	2025-06-14 18:21:23.388709
2168	SEC001	40	t	t	t	t	t	2025-06-14 22:59:55.80906	2025-06-14 22:59:55.80906
2170	SEC005	27	t	t	f	f	t	2025-06-15 02:05:53.86307	2025-06-15 02:05:53.86307
2171	SEC006	27	t	t	f	f	t	2025-06-15 02:05:57.871797	2025-06-15 02:05:57.871797
2172	SEC006	31	t	t	f	f	t	2025-06-15 02:06:19.243749	2025-06-15 02:06:19.243749
2140	SEC005	31	t	t	f	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2173	SEC004	31	t	t	f	f	t	2025-06-15 02:06:32.275336	2025-06-15 02:06:32.275336
2174	SEC004	29	t	t	f	f	t	2025-06-15 02:06:49.453975	2025-06-15 02:06:49.453975
2175	SEC005	29	t	t	f	f	t	2025-06-15 02:06:54.952969	2025-06-15 02:06:54.952969
2176	SEC006	29	t	t	f	f	t	2025-06-15 02:07:00.892984	2025-06-15 02:07:00.892984
2177	SEC006	17	t	t	f	f	t	2025-06-15 02:07:16.157997	2025-06-15 02:07:16.157997
2178	SEC005	17	t	t	f	f	t	2025-06-15 02:07:20.622238	2025-06-15 02:07:20.622238
2179	SEC004	17	t	t	f	f	t	2025-06-15 02:07:24.739355	2025-06-15 02:07:24.739355
2152	SEC007	22	t	t	f	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2154	SEC008	1	t	f	f	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2169	SEC004	27	t	t	f	f	t	2025-06-15 02:05:49.795852	2025-06-15 02:05:49.795852
2127	SEC004	12	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2155	SEC008	4	t	f	f	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2156	SEC008	8	t	f	f	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2159	SEC008	28	t	f	f	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2123	SEC003	16	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2110	SEC002	9	t	t	f	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2124	SEC003	28	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2122	SEC003	8	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2114	SEC002	15	t	f	f	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2115	SEC002	17	t	t	f	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2113	SEC002	14	t	f	f	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2116	SEC002	24	t	t	f	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2148	SEC007	6	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2149	SEC007	13	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2153	SEC007	26	t	t	t	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2165	SEC004	10	t	t	t	t	t	2025-06-14 18:15:40.553693	2025-06-14 18:15:40.553693
2151	SEC007	21	t	t	f	f	t	2025-06-14 11:07:05.109766	2025-06-14 11:07:05.109766
2180	SEC007	27	t	t	f	f	t	2025-06-15 02:08:19.912092	2025-06-15 02:08:19.912092
2181	SEC007	17	t	t	f	f	t	2025-06-15 02:08:33.046805	2025-06-15 02:08:33.046805
2182	SEC007	19	t	t	f	f	t	2025-06-15 02:09:13.45011	2025-06-15 02:09:13.45011
2183	SEC004	16	t	t	f	f	t	2025-06-15 02:17:27.046657	2025-06-15 02:17:27.046657
2184	SEC008	17	t	t	f	f	t	2025-06-15 02:22:36.832803	2025-06-15 02:22:36.832803
2185	SEC008	20	t	t	f	f	t	2025-06-15 02:22:45.628275	2025-06-15 02:22:45.628275
2186	SEC008	27	t	t	f	f	t	2025-06-15 02:22:56.252737	2025-06-15 02:22:56.252737
2187	SEC003	29	t	t	f	f	t	2025-06-15 02:24:02.877164	2025-06-15 02:24:02.877164
2188	SEC003	31	t	t	f	f	t	2025-06-15 02:24:08.251164	2025-06-15 02:24:08.251164
2189	SEC003	33	t	t	f	f	t	2025-06-15 02:24:14.668701	2025-06-15 02:24:14.668701
2190	SEC003	34	t	t	f	f	t	2025-06-15 02:24:19.198904	2025-06-15 02:24:19.198904
2191	SEC003	40	t	t	f	f	t	2025-06-15 02:24:27.201217	2025-06-15 02:24:27.201217
2192	SEC003	24	t	t	f	f	t	2025-06-15 02:24:45.868524	2025-06-15 02:24:45.868524
2193	SEC003	25	t	t	f	f	t	2025-06-15 02:24:50.280034	2025-06-15 02:24:50.280034
2194	SEC003	3	t	t	f	f	t	2025-06-15 02:26:00.095457	2025-06-15 02:26:00.095457
2195	SEC003	2	t	t	f	f	t	2025-06-15 02:26:17.916533	2025-06-15 02:26:17.916533
2197	SEC002	34	t	t	f	f	t	2025-06-15 02:30:48.002564	2025-06-15 02:30:48.002564
2198	SEC002	31	t	t	f	f	t	2025-06-15 02:30:53.46657	2025-06-15 02:30:53.46657
2199	SEC002	29	t	t	f	f	t	2025-06-15 02:30:58.427716	2025-06-15 02:30:58.427716
2200	SEC002	28	t	t	f	f	t	2025-06-15 02:31:03.11638	2025-06-15 02:31:03.11638
2201	SEC002	27	t	t	f	f	t	2025-06-15 02:31:06.875901	2025-06-15 02:31:06.875901
2202	SEC002	23	t	t	f	f	t	2025-06-15 02:31:15.556771	2025-06-15 02:31:15.556771
2203	SEC002	20	t	t	f	f	t	2025-06-15 02:31:23.149944	2025-06-15 02:31:23.149944
2204	SEC002	16	t	t	f	f	t	2025-06-15 02:31:39.361633	2025-06-15 02:31:39.361633
2205	SEC002	10	t	f	f	f	t	2025-06-15 02:31:50.897411	2025-06-15 02:31:50.897411
2206	SEC002	2	t	t	f	f	t	2025-06-15 02:32:02.207337	2025-06-15 02:32:02.207337
2207	SEC002	19	t	t	f	f	t	2025-06-15 02:32:11.373376	2025-06-15 02:32:11.373376
2208	SEC002	21	t	f	f	f	t	2025-06-15 02:32:21.659378	2025-06-15 02:32:21.659378
2209	SEC002	22	t	f	f	f	t	2025-06-15 02:32:26.487811	2025-06-15 02:32:26.487811
2210	SEC002	41	t	t	f	f	t	2025-06-15 02:32:51.616453	2025-06-15 02:32:51.616453
2212	SEC005	41	t	f	f	f	t	2025-06-15 02:33:25.61098	2025-06-15 02:33:25.61098
2213	SEC006	41	t	f	f	f	t	2025-06-15 02:33:28.998846	2025-06-15 02:33:28.998846
2214	SEC008	41	t	f	f	f	t	2025-06-15 02:33:33.001633	2025-06-15 02:33:33.001633
2215	SEC003	41	t	f	f	f	t	2025-06-15 02:33:39.153303	2025-06-15 02:33:39.153303
2216	SEC001	41	t	t	t	t	t	2025-06-15 02:36:32.696364	2025-06-15 02:36:32.696364
2218	SEC007	42	t	t	t	t	t	2025-06-15 02:39:56.034065	2025-06-15 02:39:56.034065
2219	SEC001	42	t	t	t	t	t	2025-06-15 02:39:56.034065	2025-06-15 02:39:56.034065
2220	SEC002	42	t	t	t	t	t	2025-06-15 02:39:56.034065	2025-06-15 02:39:56.034065
2221	SEC006	42	t	t	t	t	t	2025-06-15 02:39:56.034065	2025-06-15 02:39:56.034065
2222	SEC008	42	t	t	t	t	t	2025-06-15 02:39:56.034065	2025-06-15 02:39:56.034065
2223	SEC005	42	t	t	t	t	t	2025-06-15 02:39:56.034065	2025-06-15 02:39:56.034065
2224	SEC004	42	t	t	t	t	t	2025-06-15 02:39:56.034065	2025-06-15 02:39:56.034065
2225	SEC003	42	t	t	t	t	t	2025-06-15 02:39:56.034065	2025-06-15 02:39:56.034065
2211	SEC004	41	t	f	t	f	t	2025-06-15 02:33:22.001309	2025-06-15 02:33:22.001309
2226	SEC002	82	t	t	t	t	t	2025-06-17 03:56:23.891537	2025-06-17 03:56:23.891537
2227	SEC002	91	t	t	t	f	t	2025-06-17 03:56:39.852772	2025-06-17 03:56:39.852772
2228	SEC002	68	t	t	t	f	t	2025-06-17 03:56:52.586098	2025-06-17 03:56:52.586098
2196	SEC002	40	t	t	t	f	t	2025-06-15 02:30:41.416068	2025-06-15 02:30:41.416068
2229	SEC002	62	t	t	t	f	t	2025-06-17 03:57:08.786783	2025-06-17 03:57:08.786783
2217	SEC007	41	t	t	t	f	t	2025-06-15 02:36:41.75628	2025-06-15 02:36:41.75628
2230	SEC005	68	t	t	t	f	t	2025-06-19 03:44:31.417698	2025-06-19 03:44:31.417698
2231	SEC001	92	t	t	t	t	t	2025-07-20 02:06:59.451719	2025-07-20 02:06:59.451719
\.


--
-- Data for Name: plate_calculations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.plate_calculations (id, customer_id, width, height, colors, area, plate_type, calculated_price, created_at, created_by, thickness, base_price_per_unit, color_multiplier, thickness_multiplier, customer_discount, notes, created_by_id) FROM stdin;
1	CID001	15	12	3	180	premium	0	2025-06-21 01:29:31.030585	\N	0.8	\N	\N	\N	\N	Test calculation	\N
4	\N	100	50	1	5000	standard	0	2025-06-21 01:32:39.909296	\N	\N	\N	\N	\N	\N	\N	\N
5	\N	100	50	1	5000	standard	0	2025-06-21 01:32:56.162914	\N	\N	\N	\N	\N	\N		00U1
6	\N	100	50	2	5000	standard	0	2025-06-21 01:34:01.857584	\N	\N	\N	\N	\N	\N		00U1
\.


--
-- Data for Name: plate_pricing_parameters; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.plate_pricing_parameters (id, name, value, description, type, is_active, last_updated) FROM stdin;
3	Thickness	1		thickness_multiplier	t	2025-05-17 10:10:17.370785
2	No. of Colors	2		color_multiplier	t	2025-05-17 10:10:07.784513
1	Price\\Cm2	0.25		base_price	t	2025-05-17 10:07:24.082838
\.


--
-- Data for Name: quality_check_types; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.quality_check_types (id, name, type, category, stage, description, is_active, target_stage, checklist_items, parameters) FROM stdin;
QCT-1750392316586-znj8dn	Film	\N	\N	\N	Film  Strength Should be Not Easily Broken , Color Should be Mixed Will , Skin Should be Smooth and shiny.	t	production	{Strength,Color,Skin}	{Material,"Master Bach",Shiny}
QCT-1750392667574-kaiqld	Printing	\N	\N	\N	Printing , Should be Clean , Correct, Aligned, Concentration	t	production	{Clarity,Cleanliness,"Ink Concentration"}	{No.Colors,No.Sides,"Color Code:","Color Code:","Color Code:","Color Code:"}
QCT-1750392918655-d3wzg9	Biodegradable	\N	\N	\N	Cover Should be Newly Date , not exceed 12 months from production date , Should mention materials type , DOP, DOE, Storage Condition.	t	packaging	{"SASO Logo","Validation Period","Storage Condition"}	{"Validation Period (M)","License Type"}
QCT-1750393086256-h08nmz	Qty of Extrusion	\N	\N	\N	Extruded Qty Should not exceed 15% or be less than 5% of Job order Qty	t	quality_control	{"Extrusion Qty"}	{"Ordered Qty","Waste Qty","Received Qty","Different Qty"}
QCT-1750386027548-w055hv	Film Size	\N	\N	\N	Film Widths and Side Folding should not exceed 0.5+\\- from Job Order Size	t	production	{"Width cm","Right Folding cm","Left Folding cm"}	{"Different mm","Size cm"}
\.


--
-- Data for Name: quality_checks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.quality_checks (id, roll_id, job_order_id, check_type_id, status, result, notes, checked_by, checked_at, created_at) FROM stdin;
\.


--
-- Data for Name: raw_materials; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.raw_materials (id, name, type, quantity, unit, last_updated) FROM stdin;
9	Black	Masterbatch	9986	kg	2025-07-22 00:04:19.759
5	LDPE Jumbo	Polymer	8625	kg	2025-07-22 21:25:20.384
8	White	Masterbatch	9837	kg	2025-07-22 21:44:51.87
1	HDPE SABIC	Raw Material	93700	Kg	2025-07-22 21:46:57.701
2	LLDPE SABIC	Polymer	98225	kg	2025-07-22 21:46:58.515
7	Filler	Masterbatch	92275	kg	2025-07-22 21:46:59.779
6	Recycled	Polymer	50	kg	2025-07-21 16:06:49.084
3	LDPE SABIC	Polymer	6775	kg	2025-07-22 15:11:36.94
4	LLDPE Jumbo	Polymer	8125	kg	2025-07-22 21:07:21.98
\.


--
-- Data for Name: rolls; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.rolls (id, job_order_id, roll_serial, created_at, status, extruding_qty, printing_qty, cutting_qty, extruded_at, printed_at, cut_at, length_meters, raw_material, master_batch_id, current_stage, waste_qty, waste_percentage, created_by_id, printed_by_id, cut_by_id) FROM stdin;
EX-0485-005	485	005	2025-07-22 15:05:20.323	pending	100	100	0	\N	2025-07-22 15:05:24.85	\N	\N	\N	\N	printing	0	0	0U27	\N	\N
EX-0485-004	485	004	2025-07-22 15:05:14.166	pending	95	95	0	\N	2025-07-22 15:05:27.018	\N	\N	\N	\N	printing	0	0	0U27	\N	\N
EX-0485-003	485	003	2025-07-22 15:05:09.878	pending	92	92	0	\N	2025-07-22 15:05:28.435	\N	\N	\N	\N	printing	0	0	0U27	\N	\N
EX-0485-002	485	002	2025-07-22 15:05:04.251	pending	96	96	0	\N	2025-07-22 15:05:31.399	\N	\N	\N	\N	printing	0	0	0U27	\N	\N
EX-0485-001	485	001	2025-07-22 15:04:58.319	pending	100	100	0	\N	2025-07-22 15:05:32.947	\N	\N	\N	\N	printing	0	0	0U27	\N	\N
EX-0512-005	512	005	2025-07-22 15:08:58.758	pending	82	82	0	\N	2025-07-22 15:09:10.968	\N	\N	\N	\N	printing	0	0	0U27	\N	\N
EX-0512-004	512	004	2025-07-22 15:08:45.919	pending	86	86	0	\N	2025-07-22 15:09:13.09	\N	\N	\N	\N	printing	0	0	0U27	\N	\N
EX-0512-003	512	003	2025-07-22 15:08:41.752	pending	101	101	0	\N	2025-07-22 15:09:14.891	\N	\N	\N	\N	printing	0	0	0U27	\N	\N
EX-0512-002	512	002	2025-07-22 15:08:35.498	pending	86	86	0	\N	2025-07-22 15:09:16.191	\N	\N	\N	\N	printing	0	0	0U27	\N	\N
EX-0512-001	512	001	2025-07-22 15:08:27.31	pending	99	99	0	\N	2025-07-22 15:09:18.766	\N	\N	\N	\N	printing	0	0	0U27	\N	\N
EX-0486-001	486	001	2025-07-22 15:06:15.494	pending	93	93	0	\N	2025-07-22 15:09:20.322	\N	\N	\N	\N	printing	0	0	0U27	\N	\N
EX-0512-006	512	006	2025-07-22 15:59:01.114	pending	91	91	0	\N	2025-07-22 15:59:05.152	\N	\N	\N	\N	printing	0	0	0U27	\N	\N
EX-0486-002	486	002	2025-07-22 22:11:14.312	pending	109	109	0	\N	2025-07-22 22:11:33.763	\N	\N	\N	\N	printing	0	0	0U31	\N	\N
EX-0486-003	486	003	2025-07-22 22:11:24.081	pending	94	94	0	\N	2025-07-22 22:11:38.03	\N	\N	\N	\N	printing	0	0	0U31	\N	\N
EX-0512-007	512	007	2025-07-22 23:49:15.241	pending	71	71	0	\N	2025-07-22 23:50:58.129	\N	\N	\N	\N	printing	0	0	0U31	\N	\N
EX-0512-008	512	008	2025-07-22 23:49:25.326	pending	84	84	0	\N	2025-07-22 23:51:01.156	\N	\N	\N	\N	printing	0	0	0U31	\N	\N
EX-0512-009	512	009	2025-07-22 23:49:36.999	pending	83	83	0	\N	2025-07-22 23:51:05.365	\N	\N	\N	\N	printing	0	0	0U31	\N	\N
EX-0512-010	512	010	2025-07-22 23:49:47.178	pending	84	84	0	\N	2025-07-22 23:51:07.81	\N	\N	\N	\N	printing	0	0	0U31	\N	\N
EX-0512-011	512	011	2025-07-22 23:49:59.053	pending	78	78	0	\N	2025-07-22 23:51:10.304	\N	\N	\N	\N	printing	0	0	0U31	\N	\N
EX-0512-012	512	012	2025-07-22 23:50:11.082	pending	86	86	0	\N	2025-07-22 23:51:16.232	\N	\N	\N	\N	printing	0	0	0U31	\N	\N
EX-0484-001	484	001	2025-07-22 23:51:53.116	pending	76	76	0	\N	2025-07-22 23:52:51.766	\N	\N	\N	\N	printing	0	0	0U31	\N	\N
EX-0484-002	484	002	2025-07-22 23:52:01.733	pending	73	73	0	\N	2025-07-22 23:52:54.635	\N	\N	\N	\N	printing	0	0	0U31	\N	\N
EX-0484-004	484	004	2025-07-22 23:52:19.821	pending	63	63	0	\N	2025-07-22 23:53:02.168	\N	\N	\N	\N	printing	0	0	0U31	\N	\N
EX-0484-005	484	005	2025-07-22 23:52:31.37	pending	73	73	0	\N	2025-07-22 23:53:05.871	\N	\N	\N	\N	printing	0	0	0U31	\N	\N
EX-0484-003	484	003	2025-07-22 23:52:10.534	pending	73	73	0	\N	2025-07-22 23:53:08.515	\N	\N	\N	\N	printing	0	0	0U31	\N	\N
\.


--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sections (id, name) FROM stdin;
SEC001	Management
SEC002	Supervisor
SEC003	Sales
SEC004	Extruding
SEC005	Printing
SEC006	Cutting
SEC007	Maintenance
SEC008	Warehouse
\.


--
-- Data for Name: sensor_data; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sensor_data (id, sensor_id, value, "timestamp", status, metadata) FROM stdin;
1	SENSOR001	78.5	2025-06-03 13:25:54.558571	normal	\N
2	SENSOR001	82.1	2025-06-03 13:25:54.558571	normal	\N
3	SENSOR001	87.3	2025-06-03 13:25:54.558571	warning	\N
4	SENSOR002	115.2	2025-06-03 13:25:54.558571	normal	\N
5	SENSOR002	125.8	2025-06-03 13:25:54.558571	warning	\N
6	SENSOR003	1750	2025-06-03 13:25:54.558571	normal	\N
7	SENSOR004	45.2	2025-06-03 13:25:54.558571	normal	\N
8	SENSOR005	75.8	2025-06-03 13:25:54.558571	normal	\N
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sessions (sid, sess, expire) FROM stdin;
vF48wbJLH4kZV5ddeSG1foSnhZXVGsyJ	{"cookie":{"originalMaxAge":604800000,"expires":"2025-07-23T13:46:17.674Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"00U1"}}	2025-07-26 18:51:10
ZtUH5fJtRILjU8qxAJcLtZ9SeLOmmiSA	{"cookie":{"originalMaxAge":604800000,"expires":"2025-07-22T05:13:12.628Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"00U1"}}	2025-07-29 09:03:23
TXJ2Mn4kcsAGi2TYR1rJh4i3pRlkiD9e	{"cookie":{"originalMaxAge":604800000,"expires":"2025-07-26T05:03:35.775Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"0U28"}}	2025-07-26 05:04:16
uzYYi_BKc-Sx3OAHra0bpuCdmkOS95MN	{"cookie":{"originalMaxAge":604800000,"expires":"2025-07-23T05:08:27.585Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"0U31"}}	2025-07-29 23:53:15
tEvqwe4y5rLr4bB4amDPdnjcXygYaSBW	{"cookie":{"originalMaxAge":604800000,"expires":"2025-07-27T13:06:57.698Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"00U1"}}	2025-07-29 03:36:48
GSVeRQ8r5v9yhWdz2ADddnnkQi_uwVr1	{"cookie":{"originalMaxAge":604800000,"expires":"2025-07-26T18:53:18.758Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"00U1"}}	2025-07-26 18:56:36
Ud0d_a3IXolnNXRvJdOG9ZFkuw1tGzM_	{"cookie":{"originalMaxAge":604800000,"expires":"2025-07-23T20:53:37.420Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"0U18"}}	2025-07-29 19:43:02
HcpXewH5xoNzgzKUnWFV_X69qhNp9oPB	{"cookie":{"originalMaxAge":604800000,"expires":"2025-07-28T16:58:01.946Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"0U41"}}	2025-07-29 15:27:40
gMxZbCLmY2jDH83-bVSrCl0RUjuv0Jz7	{"cookie":{"originalMaxAge":604800000,"expires":"2025-07-23T04:55:00.003Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"0U31"}}	2025-07-23 05:37:29
J7MJAyHFEU5R1Jc9M44hLkeZLewosFEA	{"cookie":{"originalMaxAge":604799991,"expires":"2025-07-19T07:16:02.051Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"00U1"}}	2025-07-29 07:23:30
zBsBZjdFv06nOQ11q25PSRR_ODxFUkPO	{"cookie":{"originalMaxAge":604799999,"expires":"2025-07-20T15:53:02.218Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"0U27"}}	2025-07-29 16:00:26
afUb_B-bODOelMQGfrCDoTkKKmbpzkGB	{"cookie":{"originalMaxAge":604800000,"expires":"2025-07-20T02:49:55.134Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"00U1"}}	2025-07-26 19:19:23
lNgKg4qSE1INa03Xrp_V72iwJDPY0P0j	{"cookie":{"originalMaxAge":604799999,"expires":"2025-07-21T06:24:25.979Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"0U19"}}	2025-07-29 15:54:39
X7ynTg7I01W_831zQwYeYoMmbHOKkV38	{"cookie":{"originalMaxAge":604800000,"expires":"2025-07-21T03:45:22.359Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"0U14"}}	2025-07-29 16:05:58
5QtftcybskPMRZoIuU-aLaklAu9YGWYj	{"cookie":{"originalMaxAge":604800000,"expires":"2025-07-21T05:27:06.048Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"0U21"}}	2025-07-28 15:39:45
EKa5pFGAVetMB6odQ9WU_7a52yFd9Akp	{"cookie":{"originalMaxAge":604800000,"expires":"2025-07-20T19:01:00.073Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"0U24"}}	2025-07-29 03:14:08
KWcwhiSzwjxt5YGH23bg4_2CT9c5tjsV	{"cookie":{"originalMaxAge":604800000,"expires":"2025-07-20T19:47:59.093Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"0U34"}}	2025-07-29 07:34:06
_MV_ClPW3RjNNeT_cof7KUXzvlO8zLX-	{"cookie":{"originalMaxAge":604799999,"expires":"2025-07-20T10:17:37.431Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"0U29"}}	2025-07-29 17:19:34
61VuVZ9_oD9cTzhu2WysjD0zVcULu09J	{"cookie":{"originalMaxAge":604799967,"expires":"2025-07-21T10:03:06.037Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"0U16"}}	2025-07-30 01:09:15
pxh3shfyB0eJXLAruZL-mqproI16Sudr	{"cookie":{"originalMaxAge":604799999,"expires":"2025-07-21T08:47:14.878Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"0U10"}}	2025-07-29 16:39:40
lDIswsKjIQm1Ou5Zc4LBTalbWxDscMcl	{"cookie":{"originalMaxAge":604799952,"expires":"2025-07-21T02:45:27.127Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":"00U1"}}	2025-07-30 01:09:16
\.


--
-- Data for Name: sms_messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sms_messages (id, message, status, recipient_phone, recipient_name, customer_id, order_id, job_order_id, sent_by, sent_at, delivered_at, message_type, twilio_message_id, error_message, priority, category, template_id, failed_at, retry_count, last_retry_at, is_scheduled, scheduled_for, metadata) FROM stdin;
\.


--
-- Data for Name: sms_notification_rules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sms_notification_rules (id, name, trigger_event, template_id, recipient_roles, is_active, priority, cooldown_minutes, working_hours_only, created_at, updated_at, conditions, recipient_users, created_by) FROM stdin;
\.


--
-- Data for Name: sms_provider_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sms_provider_settings (id, primary_provider, fallback_provider, retry_attempts, retry_delay, is_active, last_updated, updated_by) FROM stdin;
1	taqnyat	twilio	3	5000	t	2025-06-02 02:59:39.348161	system
\.


--
-- Data for Name: sms_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sms_templates (id, name, category, message_type, template, variables, is_active, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: spare_parts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.spare_parts (id, part_name, part_number, barcode, serial_number, machine_id, category, type, manufacturer, supplier, purchase_date, price, quantity, min_quantity, location, notes, last_used) FROM stdin;
\.


--
-- Data for Name: time_attendance; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.time_attendance (id, user_id, date, check_in_time, check_out_time, break_start_time, break_end_time, working_hours, overtime_hours, location, status, is_auto_checked_out, notes, created_at, scheduled_start_time, scheduled_end_time, break_duration, check_in_location, check_out_location, auto_check_out_reason, overtime_approved, overtime_approved_by, break_start_location, break_end_location) FROM stdin;
\.


--
-- Data for Name: training_certificates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.training_certificates (id, training_id, certificate_number, template_id, custom_design, issued_date, valid_until, issuer_name, issuer_title, company_name, logo_url, status, created_at) FROM stdin;
5	12	CERT-12-1752657869204	modern	{"layout": "modern", "includeQR": true, "fontFamily": "Arial, sans-serif", "accentColor": "#f59e0b", "borderStyle": "elegant", "primaryColor": "#065f46", "secondaryColor": "#10b981"}	2025-07-16 09:24:29.275571	2025-07-16 00:00:00	AbuKhalid 	Training Supervisor	Production Management Factory	\N	active	2025-07-16 09:24:29.275571
\.


--
-- Data for Name: training_evaluations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.training_evaluations (id, training_id, training_point_id, status, notes, evaluated_at, evaluated_by, created_at) FROM stdin;
39	12	4	pass	\N	2025-07-16 07:30:13.573	\N	2025-07-16 07:30:13.592124
40	12	2	pass	\N	2025-07-16 07:30:16.388	\N	2025-07-16 07:30:16.407628
41	12	3	pass	\N	2025-07-16 07:30:19.523	\N	2025-07-16 07:30:19.542611
\.


--
-- Data for Name: training_field_evaluations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.training_field_evaluations (id, training_id, training_field, status, notes, evaluated_at, evaluated_by, created_at) FROM stdin;
\.


--
-- Data for Name: training_points; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.training_points (id, name, category, is_active, created_at) FROM stdin;
1	Prepare Machine	machine_operation	t	2025-06-15 02:03:06.839663
2	Run Machine	machine_operation	t	2025-06-15 02:03:06.839663
3	Set up roll	setup	t	2025-06-15 02:03:06.839663
4	Adjust Size	setup	t	2025-06-15 02:03:06.839663
5	Set up cylinders	setup	t	2025-06-15 02:03:06.839663
6	Set up Cliché	setup	t	2025-06-15 02:03:06.839663
7	Using fire Extinguisher	safety	t	2025-06-15 02:03:06.839663
8	First Aid	safety	t	2025-06-15 02:03:06.839663
9	Emergency evacuation	safety	t	2025-06-15 02:03:06.839663
\.


--
-- Data for Name: trainings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.trainings (id, training_id, date, trainee_id, training_section, number_of_days, supervisor_id, supervisor_signature, report, status, created_at, updated_at, title, description, instructor, location, scheduled_date, duration, max_participants, category, priority, certification_required, quality_check_types, equipment_ids, prerequisites, learning_objectives, type, training_category, training_fields, notes) FROM stdin;
12	TRN-001	2025-04-01 00:00:00	0U23	cutting	5	0U33	\N	تم تدريب العامل على طريقة تشغيل الماكينة واعدادها للتشغيل - مع المشغل عاشق قرنق	completed	2025-07-16 07:29:24.298012	2025-07-16 07:30:25.3	\N	\N	\N	\N	\N	\N	\N	\N	medium	f	{}	{}	{}	{}	general	\N	{}	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, password, name, email, phone, is_active, section_id, created_at, updated_at, first_name, last_name, bio, profile_image_url, is_admin, "position", hire_date, contract_type, work_schedule, emergency_contact, bank_details, allowances) FROM stdin;
0U25	2421011327	Ibr@haj1	ARSLAN  TANVEER	\N	\N	t	SEC005	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	ARSLAN  TANVEER	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U30	2470985199	Ibr@haj1	SALMEEN ABDUL  SALAM	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	SALMEEN ABDUL  SALAM	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U32	2501133405	Ibr@haj1	ABDULLAH AL MASHJARI	\N	\N	t	SEC003	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	ABDULLAH AL MASHJARI	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U33	2510566017	Ibr@haj1	WASIM  TANVEER	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	WASIM  TANVEER	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U42	2397698479	Ibr@haj1	Mohammed Ali	\N	\N	t	SEC005	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	Mohammed Ali	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
00U0	Test	Test	Test	\N	\N	t	SEC004	2025-05-13 23:25:46.954	2025-06-08 07:28:40.213	Test	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U35	2531977409	Ibr@haj1	ASHISH   SURESH	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	ASHISH   SURESH	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
00U3	2025179223	Ibr@haj1	ABDUL KHARIM   HASAINAR	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	ABDUL KHARIM HASAINAR	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
00U7	2141122362	Ibr@haj1	ALLULAPPIL   NASAR	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	ALLULAPPIL   NASAR	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
00U6	2115078541	Ibr@haj1	SHAJAHAN - - HANEEFA	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	SHAJAHAN - - HANEEFA	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
00U5	2066654043	Ibr@haj1	MANIYAN   DHARAN	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	MANIYAN   DHARAN	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U37	2579878220	Ibr@haj1	NAJIM DEEN MOHAMMED	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	NAJIM DEEN MOHAMMED	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U31	2500097627	Ibr@haj1	WADEE MOHAMMED	\N	\N	t	SEC004	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	WADEE MOHAMMED	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U34	2531977110	Ibr@haj1	SUJITH   RENGANATHAN	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	SUJITH   RENGANATHAN	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U10	2181237716	Ibr@haj1	NAZAR - - PUTHIYAPURAYIL	\N	\N	t	SEC005	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	NAZAR - - PUTHIYAPURAYIL	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
00U4	2052646771	Ibr@haj1	AbuKhalid A	Modplast83@gmail.com	+966550609050	t	SEC001	2025-05-13 18:09:54.683712	2025-06-19 15:41:12.48	Ibrahem	Nasser	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U55	Reem	3	Princess Reem	\N	\N	t	SEC001	2025-06-27 14:10:36.499982	2025-06-27 14:10:36.499982	Princess Reem	\N	\N	\N	t	\N	\N	full_time	\N	\N	\N	\N
0U11	2182973103	Ibr@haj1	DENAKREN - - MANEIN	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	DENAKREN - - MANEIN	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U12	2189684497	Ibr@haj1	SHAKEEL - - AHMAD	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	SHAKEEL - - AHMAD	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
00U1	admin	Ibr@haj1	AbuKhalid	\N	\N	t	SEC001	2025-05-13 12:31:46.544	2025-06-08 07:31:47.882	AbuKhalid	\N	\N	\N	t	\N	2025-06-19 00:00:00	full_time	{"endTime": "17:00", "startTime": "08:00", "workingDays": ["monday", "tuesday", "wednesday", "thursday", "friday"], "breakDuration": 1}	\N	\N	{"food": 0, "other": 0, "housing": 0, "transport": 0}
0U50	Osama	Ibr@haj1	Eng.Osama	\N	\N	t	SEC001	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	Eng.Osama	\N	\N	\N	t	\N	\N	full_time	\N	\N	\N	\N
0U13	2216265823	Ibr@haj1	REBERTO - - BERINA	\N	\N	t	SEC004	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	REBERTO - - BERINA	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U18	2271041317	Ibr@haj1	AMEEN FAISAL	\N	\N	t	SEC005	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	AMEEN FAISAL	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U38	2050052901	Ibr@haj1	OFFICE	\N	\N	t	SEC003	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	OFFICE	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
00U2	2020941601	Ibr@haj1	CHELATH - - DIVAKARAN	\N	\N	t	SEC003	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	CHELATH - - DIVAKARAN	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U27	2462702768	Ibr@haj1	JABRAN  FAZAL	\N	\N	t	SEC004	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	JABRAN  FAZAL	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U20	2273415675	Ibr@haj1	OMANAKUTTAN - APPU KUTTAN	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	OMANAKUTTAN - APPU KUTTAN	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U28	2467335747	Ibr@haj1	MALIK NOMAN	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	MALIK NOMAN	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U21	2284724032	Ibr@haj1	JALAL MOKHTAR	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	JALAL MOKHTAR	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U29	2470985165	Ibr@haj1	LAIJU  GOPI	\N	\N	t	SEC004	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	LAIJU  GOPI	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U19	2271041457	123456	ABDULLAH DOMAN	\N	\N	t	SEC004	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	ABDULLAH DOMAN	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U22	2410884114	Ibr@haj1	NAZIM ABBAS  HUSSAIN	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	NAZIM ABBAS  HUSSAIN	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U26	2116433919	Ibr@haj1	TANVEER	\N	\N	t	SEC003	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	TANVEER	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U41	2271041276	Ibr@haj1	HESHAM FAISAL	\N	\N	t	SEC002	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	HESHAM FAISAL	\N	\N	\N	t	\N	\N	full_time	\N	\N	\N	\N
0U17	2271041176	2271041176	HESHAM FAISAL	\N	\N	t	SEC002	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	HESHAM FAISAL	\N	\N	\N	t	\N	\N	full_time	\N	\N	\N	\N
0U40	1000000000	Ibr@haj1	NABEL	\N	\N	t	SEC003	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	NABEL	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U36	2555449947	usama	USAMA SHAMEER  AHMED	\N	\N	t	SEC004	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	USAMA SHAMEER  AHMED	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
00U8	2164776052	Ibr@haj1	ABDULSALAM	\N	\N	t	SEC003	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	ABDULSALAM	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U15	2216266441	0552808102	ZOILO SANTOS  PADILLA	\N	\N	t	SEC007	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	ZOILO SANTOS  PADILLA	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U23	2417186547	2417186547	ASHIK   GURUNG	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	ASHIK   GURUNG	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U39	2143139083	2143139083	BASSAM	\N	\N	t	SEC003	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	BASSAM	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U24	2417186661	2417186661	ROSAN ROSAN  WAIBA	\N	\N	t	SEC004	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	ROSAN ROSAN  WAIBA	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U14	2216266029	2216266029	ROSBERT   ROPERO	\N	\N	t	SEC005	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	ROSBERT   ROPERO	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
00U9	2172159366	Ibr@haj1	ARSHAD   HAJI ALLAH	\N	\N	t	SEC006	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	ARSHAD   HAJI ALLAH	\N	\N	\N	f	\N	\N	full_time	\N	\N	\N	\N
0U00	1021761489	1021761489	SALMEEN - GM	\N	\N	t	SEC001	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	SALMEEN - GM	\N	\N	\N	t	\N	\N	full_time	\N	\N	\N	\N
0U16	2228022014	2014	JIMMY RAYOSO  SAYCON	\N	\N	t	SEC002	2025-05-13 18:09:54.683712	2025-05-13 18:09:54.683712	JIMMY RAYOSO  SAYCON	\N	\N	\N	t	\N	\N	full_time	\N	\N	\N	\N
\.


--
-- Name: aba_formula_materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.aba_formula_materials_id_seq', 60, true);


--
-- Name: aba_formulas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.aba_formulas_id_seq', 8, true);


--
-- Name: corrective_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.corrective_actions_id_seq', 7, true);


--
-- Name: customer_information_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.customer_information_id_seq', 6, true);


--
-- Name: customer_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.customer_products_id_seq', 4987, true);


--
-- Name: document_approvals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.document_approvals_id_seq', 1, false);


--
-- Name: document_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.document_comments_id_seq', 1, false);


--
-- Name: document_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.document_subscriptions_id_seq', 1, false);


--
-- Name: document_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.document_templates_id_seq', 1, false);


--
-- Name: document_views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.document_views_id_seq', 14, true);


--
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.documents_id_seq', 7, true);


--
-- Name: employee_of_month_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.employee_of_month_id_seq', 1, true);


--
-- Name: final_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.final_products_id_seq', 127, true);


--
-- Name: geofences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.geofences_id_seq', 13, true);


--
-- Name: hr_complaints_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.hr_complaints_id_seq', 1, false);


--
-- Name: hr_violations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.hr_violations_id_seq', 5, true);


--
-- Name: iot_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.iot_alerts_id_seq', 2, true);


--
-- Name: jo_mix_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.jo_mix_items_id_seq', 131, true);


--
-- Name: jo_mix_materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.jo_mix_materials_id_seq', 187, true);


--
-- Name: jo_mixes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.jo_mixes_id_seq', 64, true);


--
-- Name: job_order_updates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.job_order_updates_id_seq', 15, true);


--
-- Name: job_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.job_orders_id_seq', 519, true);


--
-- Name: leave_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.leave_requests_id_seq', 1, false);


--
-- Name: machine_machine_parts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.machine_machine_parts_id_seq', 1, false);


--
-- Name: machine_parts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.machine_parts_id_seq', 3, true);


--
-- Name: maintenance_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.maintenance_actions_id_seq', 32, true);


--
-- Name: maintenance_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.maintenance_requests_id_seq', 21, true);


--
-- Name: maintenance_schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.maintenance_schedule_id_seq', 481, true);


--
-- Name: mix_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.mix_items_id_seq', 787, true);


--
-- Name: mix_machines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.mix_machines_id_seq', 1, false);


--
-- Name: mix_materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.mix_materials_id_seq', 316, true);


--
-- Name: modules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.modules_id_seq', 92, true);


--
-- Name: notification_center_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notification_center_id_seq', 5, true);


--
-- Name: operator_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.operator_tasks_id_seq', 3, true);


--
-- Name: operator_updates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.operator_updates_id_seq', 2, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.orders_id_seq', 274, true);


--
-- Name: overtime_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.overtime_requests_id_seq', 1, false);


--
-- Name: payroll_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.payroll_records_id_seq', 1, false);


--
-- Name: performance_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.performance_reviews_id_seq', 1, false);


--
-- Name: permissions_new_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.permissions_new_id_seq', 2231, true);


--
-- Name: plate_calculations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.plate_calculations_id_seq', 6, true);


--
-- Name: plate_pricing_parameters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.plate_pricing_parameters_id_seq', 3, true);


--
-- Name: quality_checks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.quality_checks_id_seq', 27, true);


--
-- Name: raw_materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.raw_materials_id_seq', 1, true);


--
-- Name: sensor_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.sensor_data_id_seq', 8, true);


--
-- Name: sms_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.sms_messages_id_seq', 706, true);


--
-- Name: sms_notification_rules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.sms_notification_rules_id_seq', 1153, true);


--
-- Name: sms_provider_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.sms_provider_settings_id_seq', 1, true);


--
-- Name: spare_parts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.spare_parts_id_seq', 1, false);


--
-- Name: time_attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.time_attendance_id_seq', 31, true);


--
-- Name: training_certificates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.training_certificates_id_seq', 5, true);


--
-- Name: training_evaluations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.training_evaluations_id_seq', 41, true);


--
-- Name: training_field_evaluations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.training_field_evaluations_id_seq', 1, false);


--
-- Name: training_points_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.training_points_id_seq', 9, true);


--
-- Name: trainings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.trainings_id_seq', 12, true);


--
-- Name: aba_formula_materials aba_formula_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.aba_formula_materials
    ADD CONSTRAINT aba_formula_materials_pkey PRIMARY KEY (id);


--
-- Name: aba_formulas aba_formulas_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.aba_formulas
    ADD CONSTRAINT aba_formulas_pkey PRIMARY KEY (id);


--
-- Name: categories categories_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_code_key UNIQUE (code);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: corrective_actions corrective_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.corrective_actions
    ADD CONSTRAINT corrective_actions_pkey PRIMARY KEY (id);


--
-- Name: customer_information customer_information_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_information
    ADD CONSTRAINT customer_information_pkey PRIMARY KEY (id);


--
-- Name: customer_products customer_products_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_products
    ADD CONSTRAINT customer_products_pkey PRIMARY KEY (id);


--
-- Name: customers customers_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_code_key UNIQUE (code);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: document_approvals document_approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.document_approvals
    ADD CONSTRAINT document_approvals_pkey PRIMARY KEY (id);


--
-- Name: document_comments document_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.document_comments
    ADD CONSTRAINT document_comments_pkey PRIMARY KEY (id);


--
-- Name: document_subscriptions document_subscriptions_document_id_user_id_subscription_typ_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.document_subscriptions
    ADD CONSTRAINT document_subscriptions_document_id_user_id_subscription_typ_key UNIQUE (document_id, user_id, subscription_type);


--
-- Name: document_subscriptions document_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.document_subscriptions
    ADD CONSTRAINT document_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: document_templates document_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.document_templates
    ADD CONSTRAINT document_templates_pkey PRIMARY KEY (id);


--
-- Name: document_views document_views_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.document_views
    ADD CONSTRAINT document_views_pkey PRIMARY KEY (id);


--
-- Name: documents documents_document_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_document_number_key UNIQUE (document_number);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: employee_of_month employee_of_month_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.employee_of_month
    ADD CONSTRAINT employee_of_month_pkey PRIMARY KEY (id);


--
-- Name: employee_of_month employee_of_month_user_id_month_year_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.employee_of_month
    ADD CONSTRAINT employee_of_month_user_id_month_year_key UNIQUE (user_id, month, year);


--
-- Name: final_products final_products_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.final_products
    ADD CONSTRAINT final_products_pkey PRIMARY KEY (id);


--
-- Name: geofences geofences_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.geofences
    ADD CONSTRAINT geofences_pkey PRIMARY KEY (id);


--
-- Name: hr_complaints hr_complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hr_complaints
    ADD CONSTRAINT hr_complaints_pkey PRIMARY KEY (id);


--
-- Name: hr_violations hr_violations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hr_violations
    ADD CONSTRAINT hr_violations_pkey PRIMARY KEY (id);


--
-- Name: hr_violations hr_violations_violation_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hr_violations
    ADD CONSTRAINT hr_violations_violation_number_key UNIQUE (violation_number);


--
-- Name: iot_alerts iot_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.iot_alerts
    ADD CONSTRAINT iot_alerts_pkey PRIMARY KEY (id);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: jo_mix_items jo_mix_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jo_mix_items
    ADD CONSTRAINT jo_mix_items_pkey PRIMARY KEY (id);


--
-- Name: jo_mix_materials jo_mix_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jo_mix_materials
    ADD CONSTRAINT jo_mix_materials_pkey PRIMARY KEY (id);


--
-- Name: jo_mixes jo_mixes_mix_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jo_mixes
    ADD CONSTRAINT jo_mixes_mix_number_key UNIQUE (mix_number);


--
-- Name: jo_mixes jo_mixes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jo_mixes
    ADD CONSTRAINT jo_mixes_pkey PRIMARY KEY (id);


--
-- Name: job_order_updates job_order_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_order_updates
    ADD CONSTRAINT job_order_updates_pkey PRIMARY KEY (id);


--
-- Name: job_orders job_orders_order_id_customer_product_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_orders
    ADD CONSTRAINT job_orders_order_id_customer_product_id_key UNIQUE (order_id, customer_product_id);


--
-- Name: job_orders job_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_orders
    ADD CONSTRAINT job_orders_pkey PRIMARY KEY (id);


--
-- Name: leave_requests leave_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_pkey PRIMARY KEY (id);


--
-- Name: machine_machine_parts machine_machine_parts_machine_id_machine_part_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.machine_machine_parts
    ADD CONSTRAINT machine_machine_parts_machine_id_machine_part_id_key UNIQUE (machine_id, machine_part_id);


--
-- Name: machine_machine_parts machine_machine_parts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.machine_machine_parts
    ADD CONSTRAINT machine_machine_parts_pkey PRIMARY KEY (id);


--
-- Name: machine_parts machine_parts_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.machine_parts
    ADD CONSTRAINT machine_parts_code_key UNIQUE (code);


--
-- Name: machine_parts machine_parts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.machine_parts
    ADD CONSTRAINT machine_parts_pkey PRIMARY KEY (id);


--
-- Name: machine_sensors machine_sensors_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.machine_sensors
    ADD CONSTRAINT machine_sensors_pkey PRIMARY KEY (id);


--
-- Name: machines machines_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.machines
    ADD CONSTRAINT machines_pkey PRIMARY KEY (id);


--
-- Name: maintenance_actions maintenance_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_actions
    ADD CONSTRAINT maintenance_actions_pkey PRIMARY KEY (id);


--
-- Name: maintenance_requests maintenance_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_requests
    ADD CONSTRAINT maintenance_requests_pkey PRIMARY KEY (id);


--
-- Name: maintenance_schedule maintenance_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_schedule
    ADD CONSTRAINT maintenance_schedule_pkey PRIMARY KEY (id);


--
-- Name: master_batches master_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.master_batches
    ADD CONSTRAINT master_batches_pkey PRIMARY KEY (id);


--
-- Name: mix_items mix_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mix_items
    ADD CONSTRAINT mix_items_pkey PRIMARY KEY (id);


--
-- Name: mix_machines mix_machines_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mix_machines
    ADD CONSTRAINT mix_machines_pkey PRIMARY KEY (id);


--
-- Name: mix_materials mix_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mix_materials
    ADD CONSTRAINT mix_materials_pkey PRIMARY KEY (id);


--
-- Name: mobile_devices mobile_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mobile_devices
    ADD CONSTRAINT mobile_devices_pkey PRIMARY KEY (id);


--
-- Name: modules modules_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_name_key UNIQUE (name);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: notification_center notification_center_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_center
    ADD CONSTRAINT notification_center_pkey PRIMARY KEY (id);


--
-- Name: notification_templates notification_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_templates
    ADD CONSTRAINT notification_templates_pkey PRIMARY KEY (id);


--
-- Name: operator_tasks operator_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.operator_tasks
    ADD CONSTRAINT operator_tasks_pkey PRIMARY KEY (id);


--
-- Name: operator_updates operator_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.operator_updates
    ADD CONSTRAINT operator_updates_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: overtime_requests overtime_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.overtime_requests
    ADD CONSTRAINT overtime_requests_pkey PRIMARY KEY (id);


--
-- Name: payroll_records payroll_records_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_records
    ADD CONSTRAINT payroll_records_pkey PRIMARY KEY (id);


--
-- Name: performance_reviews performance_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.performance_reviews
    ADD CONSTRAINT performance_reviews_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_new_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_new_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_section_module_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_section_module_unique UNIQUE (section_id, module_id);


--
-- Name: plate_calculations plate_calculations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plate_calculations
    ADD CONSTRAINT plate_calculations_pkey PRIMARY KEY (id);


--
-- Name: plate_pricing_parameters plate_pricing_parameters_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plate_pricing_parameters
    ADD CONSTRAINT plate_pricing_parameters_pkey PRIMARY KEY (id);


--
-- Name: quality_check_types quality_check_types_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quality_check_types
    ADD CONSTRAINT quality_check_types_pkey PRIMARY KEY (id);


--
-- Name: quality_checks quality_checks_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quality_checks
    ADD CONSTRAINT quality_checks_pkey PRIMARY KEY (id);


--
-- Name: raw_materials raw_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.raw_materials
    ADD CONSTRAINT raw_materials_pkey PRIMARY KEY (id);


--
-- Name: rolls rolls_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rolls
    ADD CONSTRAINT rolls_pkey PRIMARY KEY (id);


--
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- Name: sensor_data sensor_data_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sensor_data
    ADD CONSTRAINT sensor_data_pkey PRIMARY KEY (id);


--
-- Name: sessions session_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: sms_messages sms_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sms_messages
    ADD CONSTRAINT sms_messages_pkey PRIMARY KEY (id);


--
-- Name: sms_notification_rules sms_notification_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sms_notification_rules
    ADD CONSTRAINT sms_notification_rules_pkey PRIMARY KEY (id);


--
-- Name: sms_provider_settings sms_provider_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sms_provider_settings
    ADD CONSTRAINT sms_provider_settings_pkey PRIMARY KEY (id);


--
-- Name: sms_templates sms_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sms_templates
    ADD CONSTRAINT sms_templates_pkey PRIMARY KEY (id);


--
-- Name: spare_parts spare_parts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.spare_parts
    ADD CONSTRAINT spare_parts_pkey PRIMARY KEY (id);


--
-- Name: time_attendance time_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.time_attendance
    ADD CONSTRAINT time_attendance_pkey PRIMARY KEY (id);


--
-- Name: training_certificates training_certificates_certificate_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_certificates
    ADD CONSTRAINT training_certificates_certificate_number_key UNIQUE (certificate_number);


--
-- Name: training_certificates training_certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_certificates
    ADD CONSTRAINT training_certificates_pkey PRIMARY KEY (id);


--
-- Name: training_evaluations training_evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_evaluations
    ADD CONSTRAINT training_evaluations_pkey PRIMARY KEY (id);


--
-- Name: training_evaluations training_evaluations_training_id_training_point_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_evaluations
    ADD CONSTRAINT training_evaluations_training_id_training_point_id_key UNIQUE (training_id, training_point_id);


--
-- Name: training_field_evaluations training_field_evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_field_evaluations
    ADD CONSTRAINT training_field_evaluations_pkey PRIMARY KEY (id);


--
-- Name: training_field_evaluations training_field_evaluations_training_id_training_field_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_field_evaluations
    ADD CONSTRAINT training_field_evaluations_training_id_training_field_key UNIQUE (training_id, training_field);


--
-- Name: training_points training_points_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_points
    ADD CONSTRAINT training_points_pkey PRIMARY KEY (id);


--
-- Name: trainings trainings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_pkey PRIMARY KEY (id);


--
-- Name: trainings trainings_training_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_training_id_key UNIQUE (training_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: maintenance_actions_request_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX maintenance_actions_request_idx ON public.maintenance_actions USING btree (request_id);


--
-- Name: maintenance_requests_machine_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX maintenance_requests_machine_idx ON public.maintenance_requests USING btree (machine_id);


--
-- Name: maintenance_requests_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX maintenance_requests_status_idx ON public.maintenance_requests USING btree (status);


--
-- Name: maintenance_schedule_machine_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX maintenance_schedule_machine_idx ON public.maintenance_schedule USING btree (machine_id);


--
-- Name: maintenance_schedule_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX maintenance_schedule_status_idx ON public.maintenance_schedule USING btree (status);


--
-- Name: spare_parts_machine_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX spare_parts_machine_idx ON public.spare_parts USING btree (machine_id);


--
-- Name: aba_formula_materials aba_formula_materials_formula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.aba_formula_materials
    ADD CONSTRAINT aba_formula_materials_formula_id_fkey FOREIGN KEY (formula_id) REFERENCES public.aba_formulas(id) ON DELETE CASCADE;


--
-- Name: aba_formula_materials aba_formula_materials_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.aba_formula_materials
    ADD CONSTRAINT aba_formula_materials_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.raw_materials(id);


--
-- Name: aba_formulas aba_formulas_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.aba_formulas
    ADD CONSTRAINT aba_formulas_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: corrective_actions corrective_actions_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.corrective_actions
    ADD CONSTRAINT corrective_actions_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: corrective_actions corrective_actions_completed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.corrective_actions
    ADD CONSTRAINT corrective_actions_completed_by_fkey FOREIGN KEY (completed_by) REFERENCES public.users(id);


--
-- Name: corrective_actions corrective_actions_implemented_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.corrective_actions
    ADD CONSTRAINT corrective_actions_implemented_by_fkey FOREIGN KEY (implemented_by) REFERENCES public.users(id);


--
-- Name: corrective_actions corrective_actions_quality_check_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.corrective_actions
    ADD CONSTRAINT corrective_actions_quality_check_id_fkey FOREIGN KEY (quality_check_id) REFERENCES public.quality_checks(id);


--
-- Name: corrective_actions corrective_actions_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.corrective_actions
    ADD CONSTRAINT corrective_actions_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id);


--
-- Name: document_approvals document_approvals_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.document_approvals
    ADD CONSTRAINT document_approvals_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- Name: document_comments document_comments_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.document_comments
    ADD CONSTRAINT document_comments_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- Name: document_comments document_comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.document_comments
    ADD CONSTRAINT document_comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.document_comments(id) ON DELETE CASCADE;


--
-- Name: document_subscriptions document_subscriptions_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.document_subscriptions
    ADD CONSTRAINT document_subscriptions_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- Name: document_views document_views_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.document_views
    ADD CONSTRAINT document_views_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- Name: documents documents_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: documents documents_published_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_published_by_fkey FOREIGN KEY (published_by) REFERENCES public.users(id);


--
-- Name: documents documents_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id);


--
-- Name: employee_of_month employee_of_month_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.employee_of_month
    ADD CONSTRAINT employee_of_month_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: final_products final_products_job_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.final_products
    ADD CONSTRAINT final_products_job_order_id_fkey FOREIGN KEY (job_order_id) REFERENCES public.job_orders(id);


--
-- Name: plate_calculations fk_plate_calculations_customer; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plate_calculations
    ADD CONSTRAINT fk_plate_calculations_customer FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: plate_calculations fk_plate_calculations_user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plate_calculations
    ADD CONSTRAINT fk_plate_calculations_user FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: hr_complaints hr_complaints_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hr_complaints
    ADD CONSTRAINT hr_complaints_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: hr_violations hr_violations_reported_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hr_violations
    ADD CONSTRAINT hr_violations_reported_by_fkey FOREIGN KEY (reported_by) REFERENCES public.users(id);


--
-- Name: hr_violations hr_violations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hr_violations
    ADD CONSTRAINT hr_violations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: iot_alerts iot_alerts_acknowledged_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.iot_alerts
    ADD CONSTRAINT iot_alerts_acknowledged_by_fkey FOREIGN KEY (acknowledged_by) REFERENCES public.users(id);


--
-- Name: iot_alerts iot_alerts_resolved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.iot_alerts
    ADD CONSTRAINT iot_alerts_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES public.users(id);


--
-- Name: iot_alerts iot_alerts_sensor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.iot_alerts
    ADD CONSTRAINT iot_alerts_sensor_id_fkey FOREIGN KEY (sensor_id) REFERENCES public.machine_sensors(id);


--
-- Name: items items_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: jo_mix_items jo_mix_items_jo_mix_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jo_mix_items
    ADD CONSTRAINT jo_mix_items_jo_mix_id_fkey FOREIGN KEY (jo_mix_id) REFERENCES public.jo_mixes(id) ON DELETE CASCADE;


--
-- Name: jo_mix_materials jo_mix_materials_jo_mix_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jo_mix_materials
    ADD CONSTRAINT jo_mix_materials_jo_mix_id_fkey FOREIGN KEY (jo_mix_id) REFERENCES public.jo_mixes(id) ON DELETE CASCADE;


--
-- Name: jo_mixes jo_mixes_aba_formula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jo_mixes
    ADD CONSTRAINT jo_mixes_aba_formula_id_fkey FOREIGN KEY (aba_formula_id) REFERENCES public.aba_formulas(id);


--
-- Name: job_order_updates job_order_updates_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_order_updates
    ADD CONSTRAINT job_order_updates_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: job_order_updates job_order_updates_job_order_id_job_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_order_updates
    ADD CONSTRAINT job_order_updates_job_order_id_job_orders_id_fk FOREIGN KEY (job_order_id) REFERENCES public.job_orders(id) ON DELETE CASCADE;


--
-- Name: job_orders job_orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_orders
    ADD CONSTRAINT job_orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: job_orders job_orders_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_orders
    ADD CONSTRAINT job_orders_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: job_orders job_orders_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_orders
    ADD CONSTRAINT job_orders_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: job_orders job_orders_received_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_orders
    ADD CONSTRAINT job_orders_received_by_fkey FOREIGN KEY (received_by) REFERENCES public.users(id);


--
-- Name: leave_requests leave_requests_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: leave_requests leave_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: machine_machine_parts machine_machine_parts_machine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.machine_machine_parts
    ADD CONSTRAINT machine_machine_parts_machine_id_fkey FOREIGN KEY (machine_id) REFERENCES public.machines(id);


--
-- Name: machine_machine_parts machine_machine_parts_machine_part_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.machine_machine_parts
    ADD CONSTRAINT machine_machine_parts_machine_part_id_fkey FOREIGN KEY (machine_part_id) REFERENCES public.machine_parts(id);


--
-- Name: machine_parts machine_parts_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.machine_parts
    ADD CONSTRAINT machine_parts_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id);


--
-- Name: machine_sensors machine_sensors_machine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.machine_sensors
    ADD CONSTRAINT machine_sensors_machine_id_fkey FOREIGN KEY (machine_id) REFERENCES public.machines(id);


--
-- Name: machines machines_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.machines
    ADD CONSTRAINT machines_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id);


--
-- Name: maintenance_actions maintenance_actions_machine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_actions
    ADD CONSTRAINT maintenance_actions_machine_id_fkey FOREIGN KEY (machine_id) REFERENCES public.machines(id) ON DELETE CASCADE;


--
-- Name: maintenance_actions maintenance_actions_machine_part_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_actions
    ADD CONSTRAINT maintenance_actions_machine_part_id_fkey FOREIGN KEY (machine_part_id) REFERENCES public.machine_parts(id);


--
-- Name: maintenance_actions maintenance_actions_part_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_actions
    ADD CONSTRAINT maintenance_actions_part_id_fkey FOREIGN KEY (part_id) REFERENCES public.spare_parts(id) ON DELETE SET NULL;


--
-- Name: maintenance_actions maintenance_actions_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_actions
    ADD CONSTRAINT maintenance_actions_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.maintenance_requests(id) ON DELETE CASCADE;


--
-- Name: maintenance_requests maintenance_requests_machine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_requests
    ADD CONSTRAINT maintenance_requests_machine_id_fkey FOREIGN KEY (machine_id) REFERENCES public.machines(id) ON DELETE CASCADE;


--
-- Name: maintenance_requests maintenance_requests_reported_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_requests
    ADD CONSTRAINT maintenance_requests_reported_by_fkey FOREIGN KEY (reported_by) REFERENCES public.users(id);


--
-- Name: maintenance_schedule maintenance_schedule_machine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.maintenance_schedule
    ADD CONSTRAINT maintenance_schedule_machine_id_fkey FOREIGN KEY (machine_id) REFERENCES public.machines(id) ON DELETE CASCADE;


--
-- Name: mix_items mix_items_mix_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mix_items
    ADD CONSTRAINT mix_items_mix_id_fkey FOREIGN KEY (mix_id) REFERENCES public.mix_materials(id) ON DELETE CASCADE;


--
-- Name: mix_items mix_items_raw_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mix_items
    ADD CONSTRAINT mix_items_raw_material_id_fkey FOREIGN KEY (raw_material_id) REFERENCES public.raw_materials(id);


--
-- Name: mix_machines mix_machines_machine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mix_machines
    ADD CONSTRAINT mix_machines_machine_id_fkey FOREIGN KEY (machine_id) REFERENCES public.machines(id);


--
-- Name: mix_machines mix_machines_mix_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mix_machines
    ADD CONSTRAINT mix_machines_mix_id_fkey FOREIGN KEY (mix_id) REFERENCES public.mix_materials(id);


--
-- Name: mix_materials mix_materials_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mix_materials
    ADD CONSTRAINT mix_materials_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: mobile_devices mobile_devices_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mobile_devices
    ADD CONSTRAINT mobile_devices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: operator_tasks operator_tasks_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.operator_tasks
    ADD CONSTRAINT operator_tasks_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id);


--
-- Name: operator_tasks operator_tasks_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.operator_tasks
    ADD CONSTRAINT operator_tasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: operator_tasks operator_tasks_related_job_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.operator_tasks
    ADD CONSTRAINT operator_tasks_related_job_order_id_fkey FOREIGN KEY (related_job_order_id) REFERENCES public.job_orders(id);


--
-- Name: operator_tasks operator_tasks_related_machine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.operator_tasks
    ADD CONSTRAINT operator_tasks_related_machine_id_fkey FOREIGN KEY (related_machine_id) REFERENCES public.machines(id);


--
-- Name: operator_tasks operator_tasks_related_roll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.operator_tasks
    ADD CONSTRAINT operator_tasks_related_roll_id_fkey FOREIGN KEY (related_roll_id) REFERENCES public.rolls(id);


--
-- Name: operator_updates operator_updates_acknowledged_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.operator_updates
    ADD CONSTRAINT operator_updates_acknowledged_by_fkey FOREIGN KEY (acknowledged_by) REFERENCES public.users(id);


--
-- Name: operator_updates operator_updates_operator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.operator_updates
    ADD CONSTRAINT operator_updates_operator_id_fkey FOREIGN KEY (operator_id) REFERENCES public.users(id);


--
-- Name: operator_updates operator_updates_related_job_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.operator_updates
    ADD CONSTRAINT operator_updates_related_job_order_id_fkey FOREIGN KEY (related_job_order_id) REFERENCES public.job_orders(id);


--
-- Name: operator_updates operator_updates_related_machine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.operator_updates
    ADD CONSTRAINT operator_updates_related_machine_id_fkey FOREIGN KEY (related_machine_id) REFERENCES public.machines(id);


--
-- Name: operator_updates operator_updates_related_roll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.operator_updates
    ADD CONSTRAINT operator_updates_related_roll_id_fkey FOREIGN KEY (related_roll_id) REFERENCES public.rolls(id);


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: overtime_requests overtime_requests_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.overtime_requests
    ADD CONSTRAINT overtime_requests_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: overtime_requests overtime_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.overtime_requests
    ADD CONSTRAINT overtime_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payroll_records payroll_records_processed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_records
    ADD CONSTRAINT payroll_records_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.users(id);


--
-- Name: payroll_records payroll_records_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_records
    ADD CONSTRAINT payroll_records_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: performance_reviews performance_reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.performance_reviews
    ADD CONSTRAINT performance_reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(id);


--
-- Name: performance_reviews performance_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.performance_reviews
    ADD CONSTRAINT performance_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: permissions permissions_new_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_new_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id);


--
-- Name: permissions permissions_new_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_new_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id);


--
-- Name: plate_calculations plate_calculations_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plate_calculations
    ADD CONSTRAINT plate_calculations_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: quality_checks quality_checks_check_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quality_checks
    ADD CONSTRAINT quality_checks_check_type_id_fkey FOREIGN KEY (check_type_id) REFERENCES public.quality_check_types(id);


--
-- Name: quality_checks quality_checks_checked_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quality_checks
    ADD CONSTRAINT quality_checks_checked_by_fkey FOREIGN KEY (checked_by) REFERENCES public.users(id);


--
-- Name: quality_checks quality_checks_job_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quality_checks
    ADD CONSTRAINT quality_checks_job_order_id_fkey FOREIGN KEY (job_order_id) REFERENCES public.job_orders(id) ON DELETE CASCADE;


--
-- Name: quality_checks quality_checks_roll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quality_checks
    ADD CONSTRAINT quality_checks_roll_id_fkey FOREIGN KEY (roll_id) REFERENCES public.rolls(id) ON DELETE CASCADE;


--
-- Name: rolls rolls_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rolls
    ADD CONSTRAINT rolls_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: rolls rolls_cut_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rolls
    ADD CONSTRAINT rolls_cut_by_id_fkey FOREIGN KEY (cut_by_id) REFERENCES public.users(id);


--
-- Name: rolls rolls_job_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rolls
    ADD CONSTRAINT rolls_job_order_id_fkey FOREIGN KEY (job_order_id) REFERENCES public.job_orders(id) ON DELETE CASCADE;


--
-- Name: rolls rolls_job_order_id_job_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rolls
    ADD CONSTRAINT rolls_job_order_id_job_orders_id_fk FOREIGN KEY (job_order_id) REFERENCES public.job_orders(id) ON DELETE CASCADE;


--
-- Name: rolls rolls_master_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rolls
    ADD CONSTRAINT rolls_master_batch_id_fkey FOREIGN KEY (master_batch_id) REFERENCES public.master_batches(id);


--
-- Name: rolls rolls_printed_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rolls
    ADD CONSTRAINT rolls_printed_by_id_fkey FOREIGN KEY (printed_by_id) REFERENCES public.users(id);


--
-- Name: sensor_data sensor_data_sensor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sensor_data
    ADD CONSTRAINT sensor_data_sensor_id_fkey FOREIGN KEY (sensor_id) REFERENCES public.machine_sensors(id);


--
-- Name: sms_messages sms_messages_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sms_messages
    ADD CONSTRAINT sms_messages_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: sms_messages sms_messages_job_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sms_messages
    ADD CONSTRAINT sms_messages_job_order_id_fkey FOREIGN KEY (job_order_id) REFERENCES public.job_orders(id);


--
-- Name: sms_messages sms_messages_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sms_messages
    ADD CONSTRAINT sms_messages_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: sms_notification_rules sms_notification_rules_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sms_notification_rules
    ADD CONSTRAINT sms_notification_rules_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: sms_notification_rules sms_notification_rules_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sms_notification_rules
    ADD CONSTRAINT sms_notification_rules_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.sms_templates(id);


--
-- Name: spare_parts spare_parts_machine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.spare_parts
    ADD CONSTRAINT spare_parts_machine_id_fkey FOREIGN KEY (machine_id) REFERENCES public.machines(id) ON DELETE SET NULL;


--
-- Name: time_attendance time_attendance_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.time_attendance
    ADD CONSTRAINT time_attendance_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: training_certificates training_certificates_training_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_certificates
    ADD CONSTRAINT training_certificates_training_id_fkey FOREIGN KEY (training_id) REFERENCES public.trainings(id) ON DELETE CASCADE;


--
-- Name: training_evaluations training_evaluations_evaluated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_evaluations
    ADD CONSTRAINT training_evaluations_evaluated_by_fkey FOREIGN KEY (evaluated_by) REFERENCES public.users(id);


--
-- Name: training_evaluations training_evaluations_training_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_evaluations
    ADD CONSTRAINT training_evaluations_training_id_fkey FOREIGN KEY (training_id) REFERENCES public.trainings(id) ON DELETE CASCADE;


--
-- Name: training_evaluations training_evaluations_training_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_evaluations
    ADD CONSTRAINT training_evaluations_training_point_id_fkey FOREIGN KEY (training_point_id) REFERENCES public.training_points(id);


--
-- Name: training_field_evaluations training_field_evaluations_evaluated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_field_evaluations
    ADD CONSTRAINT training_field_evaluations_evaluated_by_fkey FOREIGN KEY (evaluated_by) REFERENCES public.users(id);


--
-- Name: training_field_evaluations training_field_evaluations_training_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_field_evaluations
    ADD CONSTRAINT training_field_evaluations_training_id_fkey FOREIGN KEY (training_id) REFERENCES public.trainings(id) ON DELETE CASCADE;


--
-- Name: trainings trainings_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.users(id);


--
-- Name: trainings trainings_trainee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_trainee_id_fkey FOREIGN KEY (trainee_id) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

