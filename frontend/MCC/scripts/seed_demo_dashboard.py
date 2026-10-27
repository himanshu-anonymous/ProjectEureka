#!/usr/bin/env python3
"""Project EUREKA / DGIPR Command Center: Deterministic Demo Dashboard Seeder.

Seeds:
1. District Positions: 10 per district (1 Minister, 1 MP, 3 MLAs, 1 Collector, 1 SP, 1 ZP CEO, 1 Municipal Commissioner, 1 DIO)
   Total: 360 fictional governance leadership entries across 36 districts.
2. Scheme Hoardings: 3 field publicity hoardings per district with coordinates. Total: 108 hoardings.
3. Media Monitoring Records:
   - 4 Print Clippings per district (144 total)
   - 4 Social Posts per district (144 total)
   - 2 TV Clips per district (72 total)
4. Statewide Live News Ticker: 12 curated broadcast items (Headlines, Announcements, Alerts).

All sample data tagged strictly with provenance="synthetic" and strictly fictional names.
Deterministic execution with fixed random seed (42).
"""

import os
import sys
import random
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Add backend/src to path
ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_SRC = ROOT_DIR / "backend" / "src"
if str(BACKEND_SRC) not in sys.path:
    sys.path.insert(0, str(BACKEND_SRC))

from sqlalchemy import create_engine, select, func
from sqlalchemy.orm import sessionmaker

from eureka.core.reference_data import DISTRICTS, DIVISIONS
from eureka.models.orm import (
    Base,
    DistrictPosition,
    SchemeHoarding,
    Clipping,
    SocialPost,
    TvClip,
    TickerItem,
)
from eureka.models.enums import PositionCategory, TickerKind

# Fictional Name Components for Synthetic Leadership
FIRST_NAMES_M = [
    "Anand", "Ramesh", "Vikram", "Sunil", "Suresh", "Prakash", "Sachin", "Vijay",
    "Nitin", "Mahesh", "Ganesh", "Ashok", "Sanjay", "Dattatray", "Pradeep", "Hemant",
]
FIRST_NAMES_F = [
    "Pooja", "Snehal", "Anita", "Sunita", "Swati", "Rashmi", "Kavita", "Archana",
    "Meena", "Shilpa", "Deepali", "Neeta", "Manasi", "Pradnya", "Supriya", "Vidya",
]
LAST_NAMES = [
    "Deshmukh", "Patil", "Kadam", "Shinde", "Jadhav", "More", "Pawar", "Chavan",
    "Gaikwad", "Thorat", "Bhosale", "Kulkarni", "Deshpande", "Salunkhe", "Mane", "Wagh",
]

# Coordinate reference map for 36 districts (lat, lon)
DISTRICT_COORDS = {
    "MH-01": (18.96, 72.82), # Mumbai City
    "MH-02": (19.08, 72.88), # Mumbai Suburban
    "MH-03": (19.70, 72.77), # Palghar
    "MH-04": (19.20, 72.97), # Thane
    "MH-05": (18.64, 72.88), # Raigad
    "MH-06": (16.99, 73.30), # Ratnagiri
    "MH-07": (18.52, 73.86), # Pune
    "MH-08": (17.68, 74.02), # Satara
    "MH-09": (17.66, 75.91), # Solapur
    "MH-10": (16.70, 74.24), # Kolhapur
    "MH-11": (16.85, 74.57), # Sangli
    "MH-12": (16.01, 73.69), # Sindhudurg
    "MH-13": (18.40, 76.58), # Latur
    "MH-14": (18.18, 76.04), # Dharashiv
    "MH-15": (19.15, 77.32), # Nanded
    "MH-16": (19.72, 77.15), # Hingoli
    "MH-17": (19.88, 75.34), # Chhatrapati Sambhajinagar
    "MH-18": (19.84, 75.88), # Jalna
    "MH-19": (19.27, 76.77), # Parbhani
    "MH-20": (18.99, 75.76), # Beed
    "MH-21": (20.00, 73.79), # Nashik
    "MH-22": (21.00, 75.57), # Jalgaon
    "MH-23": (20.90, 74.77), # Dhule
    "MH-24": (21.37, 74.24), # Nandurbar
    "MH-25": (19.09, 74.74), # Ahilyanagar
    "MH-26": (20.93, 77.75), # Amravati
    "MH-27": (20.53, 76.18), # Buldhana
    "MH-28": (20.11, 77.13), # Washim
    "MH-29": (20.39, 78.12), # Yavatmal
    "MH-30": (20.71, 77.00), # Akola
    "MH-31": (21.15, 79.09), # Nagpur
    "MH-32": (20.74, 78.60), # Wardha
    "MH-33": (21.17, 79.65), # Bhandara
    "MH-34": (21.46, 80.19), # Gondia
    "MH-35": (20.18, 80.00), # Gadchiroli
    "MH-36": (19.96, 79.30), # Chandrapur
}

SCHEMES = [
    {
        "en": "Mukhyamantri Majhi Ladki Bahin Yojana",
        "mr": "मुख्यमंत्री माझी लाडकी बहीण योजना",
        "dept": "WCD",
        "ann_en": "Monthly financial assistance of ₹1,500 transferred directly to eligible women beneficiaries across Maharashtra.",
        "ann_mr": "महाराष्ट्रातील पात्र महिलांच्या आधार लिंक बँक खात्यात दरमहा ₹१,५०० थेट आर्थिक साहाय्य जमा.",
    },
    {
        "en": "Maha Agri Solar Feeder Scheme (Mukhyamantri Saur Krushi Vahini 2.0)",
        "mr": "मुख्यमंत्री सौर कृषी वाहिनी योजना २.०",
        "dept": "ENERGY",
        "ann_en": "Daytime reliable solar power for agricultural water pumps; empowering Maharashtra farmers with green energy.",
        "ann_mr": "शेतकऱ्यांना दिवसा खात्रीशीर वीजपुरवठा; सौर ऊर्जेवर आधारित कृषी पंपांचे जाळे राज्यभर विस्तारत.",
    },
    {
        "en": "Hinduthriday Samrat Balasaheb Thackeray Aapla Davakhana",
        "mr": "हिंदूहृदयसम्राट बाळासाहेब ठाकरे आपला दवाखाना",
        "dept": "HEALTH",
        "ann_en": "Free medical consultations, essential diagnostic tests, and generic medicines near your doorstep.",
        "ann_mr": "नागरिकांना घराशेजारी मोफत वैद्यकीय तपासणी, मूलभूत निदान चाचण्या आणि औषधोपचार उपलब्ध.",
    },
    {
        "en": "Jalyukt Shivar Abhiyan 2.0",
        "mr": "जलयुक्त शिवार अभियान २.०",
        "dept": "WATER",
        "ann_en": "Decentralized water conservation and groundwater recharge works across drought-prone villages.",
        "ann_mr": "टंचाईमुक्त महाराष्ट्रासाठी विकेंद्रित जलसंधारण आणि भूजल पुनर्भरण कामांना गती.",
    },
    {
        "en": "Lek Ladki Yojana (Empowering the Girl Child)",
        "mr": "लेक लाडकी योजना (मुलींचे सक्षमीकरण)",
        "dept": "WCD",
        "ann_en": "Financial support at birth, school admissions, and upon reaching 18 years to promote girl education.",
        "ann_mr": "मुलींच्या जन्मापासून ते वयाच्या १८ व्या वर्षापर्यंत टप्प्याटप्प्याने आर्थिक अनुदान व शिक्षण प्रोत्साहन.",
    },
]

NEWSPAPERS = ["Lokmat", "Sakal", "Maharashtra Times", "Pudhari", "Loksatta", "Divya Marathi"]
CHANNELS = ["ABP Majha", "Zee 24 Taas", "TV9 Marathi", "News18 Lokmat", "Saam TV"]
PROGRAMMES = ["Maha News Bulletin", "Maharashtra Desh", "Jilhyacha Aawaj", "Vishesh Khabar", "Ground Report 360"]


def get_target_engine():
    """Resolves database engine: PostgreSQL if available, else SQLite."""
    from eureka.core.config import get_settings
    settings = get_settings()

    try:
        from eureka.core.database import sync_engine
        with sync_engine.connect() as conn:
            conn.execute(func.now().select() if hasattr(func.now(), 'select') else "SELECT 1")
        print("Connected to PostgreSQL datastore.")
        return sync_engine, "postgresql"
    except Exception as exc:
        sqlite_path = ROOT_DIR / "backend" / "eureka.db"
        print(f"PostgreSQL not reachable ({exc}). Using SQLite datastore at: {sqlite_path}")
        engine = create_engine(f"sqlite:///{sqlite_path.as_posix()}", echo=False)
        return engine, "sqlite"


def seed_demo_data(force: bool = False):
    """Deterministic seeder for 36 districts, positions, hoardings, clippings, social, tv, and ticker."""
    random.seed(42)
    engine, dialect = get_target_engine()

    # Ensure all tables exist in target engine
    Base.metadata.create_all(bind=engine, checkfirst=True)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        pos_count = session.query(DistrictPosition).count()
        if pos_count >= 360 and not force:
            print(f"Data already seeded ({pos_count} positions present). Pass force=True to reseed.")
            return

        if force:
            print("Force reseed enabled. Clearing existing synthetic foundation tables...")
            session.query(DistrictPosition).delete()
            session.query(SchemeHoarding).delete()
            session.query(Clipping).delete()
            session.query(SocialPost).delete()
            session.query(TvClip).delete()
            session.query(TickerItem).delete()
            session.commit()

        print(f"Seeding demo data for all 36 Maharashtra districts (seed=42)...")
        now = datetime.now(timezone.utc)

        # 1. District Positions (10 per district x 36 = 360 positions)
        positions = []
        for d_code, div_code, name_en, name_mr, alt in DISTRICTS:
            code_num = int(d_code.split("-")[1])
            # Deterministic generator
            rand = random.Random(code_num * 100)

            # 1. Guardian Minister
            fn = rand.choice(FIRST_NAMES_M)
            ln = rand.choice(LAST_NAMES)
            positions.append(DistrictPosition(
                id=f"POS-{d_code}-MIN",
                district_code=d_code,
                category=PositionCategory.MINISTER.value,
                designation_en=f"Guardian Minister ({name_en})",
                designation_mr=f"पालकमंत्री ({name_mr})",
                person_name=f"{fn} {ln}",
                responsibilities_en="Chairing District Planning Committee (DPC), state welfare scheme oversight, disaster relief coordination.",
                responsibilities_mr="जिल्हा नियोजन समिती (DPC) चे अध्यक्षपद, शासकीय कल्याणकारी योजनांचा आढावा, आपत्कालीन मदत व पुनर्वसन समन्वय.",
                phone=f"+91 22 2202 {rand.randint(1000, 9999)}",
                email=f"guardian.minister.{d_code.lower()}@sample-maha.gov.in",
                provenance="synthetic",
                created_at=now - timedelta(days=60),
            ))

            # 2. Member of Parliament (MP)
            fn = rand.choice(FIRST_NAMES_M + FIRST_NAMES_F)
            ln = rand.choice(LAST_NAMES)
            positions.append(DistrictPosition(
                id=f"POS-{d_code}-MP",
                district_code=d_code,
                category=PositionCategory.MP.value,
                designation_en=f"Member of Parliament (Lok Sabha - {name_en})",
                designation_mr=f"खासदार (लोकसभा - {name_mr})",
                person_name=f"{fn} {ln}",
                responsibilities_en="Parliamentary constituency representation, DISHA committee co-chair, central infrastructure oversight.",
                responsibilities_mr="मतदारसंघाचे संसदेत प्रतिनिधित्व, दिशा (DISHA) समिती समन्वय, केंद्र पुरस्कृत योजनांचे संनियंत्रण.",
                phone=f"+91 11 2301 {rand.randint(1000, 9999)}",
                email=f"mp.{d_code.lower()}@sample-sansad.nic.in",
                provenance="synthetic",
                created_at=now - timedelta(days=60),
            ))

            # 3, 4, 5. Three MLAs
            mla_areas = [("North / City", "उत्तर / शहर"), ("Central / Rural", "मध्य / ग्रामीण"), ("South / East", "दक्षिण / पूर्व")]
            for idx, (area_en, area_mr) in enumerate(mla_areas, start=1):
                fn = rand.choice(FIRST_NAMES_M + FIRST_NAMES_F)
                ln = rand.choice(LAST_NAMES)
                positions.append(DistrictPosition(
                    id=f"POS-{d_code}-MLA{idx}",
                    district_code=d_code,
                    category=PositionCategory.MLA.value,
                    designation_en=f"Member of Legislative Assembly ({name_en} {area_en})",
                    designation_mr=f"आमदार (विधानसभा - {name_mr} {area_mr})",
                    person_name=f"{fn} {ln}",
                    responsibilities_en="Legislative representation, constituency development funds (MLA-LAD), public grievances redressing.",
                    responsibilities_mr="विधानसभेत प्रतिनिधित्व, स्थानिक विकास निधी (आमदार निधी), लोकगाऱ्हाणी निवारण.",
                    phone=f"+91 22 2281 {rand.randint(1000, 9999)}",
                    email=f"mla{idx}.{d_code.lower()}@sample-maha.gov.in",
                    provenance="synthetic",
                    created_at=now - timedelta(days=60),
                ))

            # 6. District Collector
            fn = rand.choice(FIRST_NAMES_M + FIRST_NAMES_F)
            ln = rand.choice(LAST_NAMES)
            positions.append(DistrictPosition(
                id=f"POS-{d_code}-COL",
                district_code=d_code,
                category=PositionCategory.COLLECTOR.value,
                designation_en=f"District Collector & District Magistrate ({name_en})",
                designation_mr=f"जिल्हाधिकारी तथा जिल्हा दंडाधिकारी ({name_mr})",
                person_name=f"Dr. {fn} {ln}, IAS",
                responsibilities_en="Executive district administration, revenue management, statutory law & order, 90-min crisis SLA sign-off.",
                responsibilities_mr="जिल्हा प्रशासन, महसूल नियंत्रण, कायदा व सुव्यवस्था, ९०-मिनिटे संकट निवारण स्वाक्षरी प्राधिकारी.",
                phone=f"+91 {rand.randint(20, 26)} {rand.randint(220000, 229999)}",
                email=f"collector.{d_code.lower()}@sample-maha.gov.in",
                provenance="synthetic",
                created_at=now - timedelta(days=60),
            ))

            # 7. Superintendent of Police (SP)
            fn = rand.choice(FIRST_NAMES_M + FIRST_NAMES_F)
            ln = rand.choice(LAST_NAMES)
            positions.append(DistrictPosition(
                id=f"POS-{d_code}-SP",
                district_code=d_code,
                category=PositionCategory.SP.value,
                designation_en=f"Superintendent of Police ({name_en})",
                designation_mr=f"पोलीस अधीक्षक ({name_mr})",
                person_name=f"{fn} {ln}, IPS",
                responsibilities_en="District policing, cyber cell oversight, communal harmony maintenance, disinformation deterrence.",
                responsibilities_mr="जिल्ह्यातील कायदा व सुव्यवस्था, सायबर सेल संनियंत्रण, शांतता रक्षण, अफवा नियंत्रण.",
                phone=f"+91 {rand.randint(20, 26)} {rand.randint(230000, 239999)}",
                email=f"sp.{d_code.lower()}@sample-mahapolice.gov.in",
                provenance="synthetic",
                created_at=now - timedelta(days=60),
            ))

            # 8. Zilla Parishad CEO
            fn = rand.choice(FIRST_NAMES_M + FIRST_NAMES_F)
            ln = rand.choice(LAST_NAMES)
            positions.append(DistrictPosition(
                id=f"POS-{d_code}-ZP",
                district_code=d_code,
                category=PositionCategory.ZP_CEO.value,
                designation_en=f"Chief Executive Officer, Zilla Parishad ({name_en})",
                designation_mr=f"मुख्य कार्यकारी अधिकारी, जिल्हा परिषद ({name_mr})",
                person_name=f"{fn} {ln}, IAS",
                responsibilities_en="Rural administration, primary health centers (PHC), ZP school education, rural water & sanitation.",
                responsibilities_mr="ग्रामीण विकास, प्राथमिक आरोग्य केंद्र, जिल्हा परिषद शिक्षण, ग्रामीण पाणीपुरवठा व स्वच्छता.",
                phone=f"+91 {rand.randint(20, 26)} {rand.randint(240000, 249999)}",
                email=f"ceo.zp.{d_code.lower()}@sample-maha.gov.in",
                provenance="synthetic",
                created_at=now - timedelta(days=60),
            ))

            # 9. Municipal Commissioner
            fn = rand.choice(FIRST_NAMES_M + FIRST_NAMES_F)
            ln = rand.choice(LAST_NAMES)
            positions.append(DistrictPosition(
                id=f"POS-{d_code}-MC",
                district_code=d_code,
                category=PositionCategory.MUNICIPAL.value,
                designation_en=f"Municipal Commissioner ({name_en} Municipal Corporation)",
                designation_mr=f"महानगरपालिका आयुक्त ({name_mr} महापालिका)",
                person_name=f"{fn} {ln}, IAS",
                responsibilities_en="Urban civic governance, sanitation drives, municipal planning, town roads and drainage works.",
                responsibilities_mr="नागरी प्रशासन, शहर स्वच्छता मोहीम, नगर रचना, रस्ते व जलनिस्सारण कामे.",
                phone=f"+91 {rand.randint(20, 26)} {rand.randint(250000, 259999)}",
                email=f"commissioner.mc.{d_code.lower()}@sample-maha.gov.in",
                provenance="synthetic",
                created_at=now - timedelta(days=60),
            ))

            # 10. District Information Officer (DIO)
            fn = rand.choice(FIRST_NAMES_M + FIRST_NAMES_F)
            ln = rand.choice(LAST_NAMES)
            positions.append(DistrictPosition(
                id=f"POS-{d_code}-DIO",
                district_code=d_code,
                category=PositionCategory.DIO.value,
                designation_en=f"District Information Officer ({name_en})",
                designation_mr=f"जिल्हा माहिती अधिकारी ({name_mr})",
                person_name=f"{fn} {ln}",
                responsibilities_en="DGIPR district bureau head, press releases, media monitoring, rumor rebuttal dissemination.",
                responsibilities_mr="माहिती व जनसंपर्क महासंचालनालय जिल्हा प्रमुख, शासकीय प्रसिद्धीपत्रके, माध्यम संनियंत्रण, अफवा खंडन प्रसिद्धी.",
                phone=f"+91 {rand.randint(20, 26)} {rand.randint(260000, 269999)}",
                email=f"dio.{d_code.lower()}@sample-dgipr.gov.in",
                provenance="synthetic",
                created_at=now - timedelta(days=60),
            ))

        session.add_all(positions)
        print(f"Added {len(positions)} district positions.")

        # 2. Scheme Hoardings (3 per district x 36 = 108 hoardings)
        hoardings = []
        sizes = ["20x10 ft", "30x15 ft", "40x20 ft"]
        landmarks = [
            ("Zilla Parishad Chowk, Main Boulevard", "जिल्हा परिषद चौक, मुख्य मार्ग"),
            ("Central Bus Station Complex, Station Road", "मध्यवर्ती बस स्थानक परिसर, स्टेशन रोड"),
            ("Collectorate Bypass Circle, Ring Road", "जिल्हाधिकारी कार्यालय बायपास सर्कल, रिंग रोड"),
        ]

        for d_code, div_code, name_en, name_mr, alt in DISTRICTS:
            c_lat, c_lon = DISTRICT_COORDS.get(d_code, (19.0, 74.0))
            code_num = int(d_code.split("-")[1])
            rand = random.Random(code_num * 200)

            for h_idx in range(1, 4):
                scheme = SCHEMES[(code_num + h_idx) % len(SCHEMES)]
                # Slight lat/lon jitter within ~5km
                offset_lat = round(rand.uniform(-0.04, 0.04), 4)
                offset_lon = round(rand.uniform(-0.04, 0.04), 4)
                lm_en, lm_mr = landmarks[h_idx - 1]

                installed = (now - timedelta(days=rand.randint(30, 180))).strftime("%Y-%m-%d")
                expires = (now + timedelta(days=rand.randint(90, 270))).strftime("%Y-%m-%d")

                h_id = f"HOARD-{d_code}-{h_idx:03d}"
                hoardings.append(SchemeHoarding(
                    id=h_id,
                    district_code=d_code,
                    scheme_name_en=scheme["en"],
                    scheme_name_mr=scheme["mr"],
                    department_code=scheme["dept"],
                    lat=c_lat + offset_lat,
                    lon=c_lon + offset_lon,
                    address=f"{lm_en}, {name_en} ({lm_mr})",
                    size=sizes[h_idx - 1],
                    installed_on=installed,
                    expires_on=expires,
                    status="ACTIVE",
                    announcement_en=scheme["ann_en"],
                    announcement_mr=scheme["ann_mr"],
                    image_url=f"/images/hoardings/sample-hoarding-{(code_num % 3) + 1}.jpg",
                    provenance="synthetic",
                    created_at=now - timedelta(days=rand.randint(10, 40)),
                ))

        session.add_all(hoardings)
        print(f"Added {len(hoardings)} scheme hoardings.")

        # 3. Print Clippings (4 per district x 36 = 144 clippings)
        clippings = []
        clipping_topics = [
            ("शेतकऱ्यांसाठी सौर कृषी पंप योजनेचा लाभ थेट खात्यात", "Solar pump subsidies distributed smoothly to farmers in {} district."),
            ("जिल्हा रुग्णालयात मोफत आरोग्य तपासणी शिबिरास उत्स्फूर्त प्रतिसाद", "Over 2,500 citizens screened in free mega health camp at {} civil hospital."),
            ("लाडकी बहीण योजनेच्या हप्त्यांचे यशस्वी वितरण पूर्ण", "Majhi Ladki Bahin Yojana monthly disbursement successfully reaches beneficiaries in {}."),
            ("रस्ते व जलसंधारण कामांना गती देण्याचे जिल्हाधिकाऱ्यांचे निर्देश", "District administration reviews monsoon preparedness and watershed structures in {}."),
        ]

        for d_code, div_code, name_en, name_mr, alt in DISTRICTS:
            code_num = int(d_code.split("-")[1])
            rand = random.Random(code_num * 300)

            for c_idx in range(1, 5):
                topic_mr, topic_en = clipping_topics[c_idx - 1]
                outlet = rand.choice(NEWSPAPERS)
                pub_time = now - timedelta(days=rand.randint(1, 14), hours=rand.randint(1, 12))
                c_id = f"CLIP-{d_code}-{c_idx:03d}"

                clippings.append(Clipping(
                    id=c_id,
                    district_code=d_code,
                    headline=f"{name_mr}: {topic_mr}",
                    outlet=outlet,
                    language="mr",
                    published_at=pub_time,
                    source_url=f"/sources/clipping/{c_id}",
                    clipping_image_url=f"/images/clippings/sample-clipping-{(c_idx % 2) + 1}.jpg",
                    summary=topic_en.format(name_en),
                    provenance="synthetic",
                    created_at=pub_time,
                ))

        session.add_all(clippings)
        print(f"Added {len(clippings)} news clippings.")

        # 4. Social Posts (4 per district x 36 = 144 posts)
        social_posts = []
        platforms = ["X", "Facebook", "Instagram", "X"]
        for d_code, div_code, name_en, name_mr, alt in DISTRICTS:
            code_num = int(d_code.split("-")[1])
            rand = random.Random(code_num * 400)

            for s_idx in range(1, 5):
                plat = platforms[s_idx - 1]
                handle = f"@Collector_{name_en.replace(' ', '')}" if s_idx % 2 == 1 else f"@MahaDGIPR_{name_en.replace(' ', '')}"
                post_time = now - timedelta(days=rand.randint(0, 5), hours=rand.randint(1, 20))
                s_id = f"SOC-{d_code}-{s_idx:03d}"

                sample_text = (
                    f"जिल्हाधिकारी कार्यालयात {name_mr} जिल्ह्यातील विकासकामांचा आढावा संपन्न. "
                    f"सर्व शासकीय योजनांचा लाभ सर्वसामान्य नागरिकांपर्यंत पारदर्शकपणे पोहोचवण्याचे निर्देश. #MahaGov #{name_en}"
                )

                social_posts.append(SocialPost(
                    id=s_id,
                    district_code=d_code,
                    platform=plat,
                    handle=handle,
                    post_url=f"/sources/social/{s_id}",
                    text=sample_text,
                    posted_at=post_time,
                    engagement=rand.randint(450, 4800),
                    provenance="synthetic",
                    created_at=post_time,
                ))

        session.add_all(social_posts)
        print(f"Added {len(social_posts)} social media posts.")

        # 5. TV Clips (2 per district x 36 = 72 clips)
        tv_clips = []
        for d_code, div_code, name_en, name_mr, alt in DISTRICTS:
            code_num = int(d_code.split("-")[1])
            rand = random.Random(code_num * 500)

            for t_idx in range(1, 3):
                channel = rand.choice(CHANNELS)
                prog = rand.choice(PROGRAMMES)
                air_time = now - timedelta(days=rand.randint(1, 8), hours=rand.randint(2, 18))
                t_id = f"TV-{d_code}-{t_idx:03d}"

                tv_clips.append(TvClip(
                    id=t_id,
                    district_code=d_code,
                    channel=channel,
                    programme=prog,
                    clip_url=f"/sources/tv/{t_id}",
                    aired_at=air_time,
                    start_offset_sec=rand.randint(30, 420),
                    transcript_text=f"{name_mr} येथून थेट वार्तांकन: जिल्ह्यातील पाणीपुरवठा व आरोग्य सुविधांचा सविस्तर आढावा आणि शासकीय योजनांचा प्रत्यक्ष प्रभाव.",
                    provenance="synthetic",
                    created_at=air_time,
                ))

        session.add_all(tv_clips)
        print(f"Added {len(tv_clips)} broadcast TV monitoring clips.")

        # 6. Statewide Ticker Items (12 items)
        ticker_items = [
            TickerItem(
                id="TCK-001",
                kind=TickerKind.ALERT.value,
                text_en="WEATHER ADVISORY: IMD issues yellow alert for Konkan & Vidarbha districts; Disaster Management teams placed on standby.",
                text_mr="हवामान इशारा: कोकण व विदर्भ जिल्ह्यांना 'येलो अलर्ट'; आपत्ती व्यवस्थापन यंत्रणा दक्ष.",
                link_url="/sources/clipping/CLIP-MH04-001",
                created_at=now - timedelta(minutes=25),
                expires_at=now + timedelta(hours=24),
                provenance="synthetic",
            ),
            TickerItem(
                id="TCK-002",
                kind=TickerKind.HEADLINE.value,
                text_en="Majhi Ladki Bahin Yojana: Over 1.85 crore women receive direct financial transfer across 36 Maharashtra districts.",
                text_mr="मुख्यमंत्री माझी लाडकी बहीण योजना: राज्यातील १.८५ कोटींहून अधिक भगिनींच्या खात्यात थेट अनुदान हस्तांतरित.",
                link_url="/sources/clipping/CLIP-MH01-001",
                created_at=now - timedelta(hours=1),
                expires_at=now + timedelta(hours=48),
                provenance="synthetic",
            ),
            TickerItem(
                id="TCK-003",
                kind=TickerKind.ANNOUNCEMENT.value,
                text_en="DGIPR Command Center activates 24x7 fact-check desk to counter election and policy misinformation in real time.",
                text_mr="माहिती व जनसंपर्क महासंचालनालयाचे २४x७ फॅक्ट-चेक नियंत्रण कक्ष कार्यान्वित; अफवांचे तत्काळ खंडन.",
                link_url="/sources/social/SOC-MH07-001",
                created_at=now - timedelta(hours=2),
                expires_at=now + timedelta(hours=72),
                provenance="synthetic",
            ),
            TickerItem(
                id="TCK-004",
                kind=TickerKind.HEADLINE.value,
                text_en="Thane district achieves 95.45 composite index, ranking #1 in state governance & public service delivery.",
                text_mr="ठाणे जिल्हा ९५.४५ गुणांसह राज्यात प्रथम क्रमांकावर; उत्कृष्ट संनियंत्रण कामगिरी.",
                link_url="/sources/clipping/CLIP-MH04-002",
                created_at=now - timedelta(hours=3),
                expires_at=now + timedelta(hours=24),
                provenance="synthetic",
            ),
            TickerItem(
                id="TCK-005",
                kind=TickerKind.ALERT.value,
                text_en="FACT-CHECK: Clarification issued regarding stamp duty rumours; official portal guidelines remain unchanged.",
                text_mr="सत्यता पडताळणी: मुद्रांक शुल्काबाबत समाजमाध्यमांवरील संदेश दिशाभूल करणारे; अधिकृत पोर्टलवरील नियम कायम.",
                link_url="/sources/social/SOC-MH02-001",
                created_at=now - timedelta(hours=4),
                expires_at=now + timedelta(hours=18),
                provenance="synthetic",
            ),
            TickerItem(
                id="TCK-006",
                kind=TickerKind.ANNOUNCEMENT.value,
                text_en="Maha Agri Solar Feeder 2.0 crosses 7,000 MW capacity benchmark for daytime agricultural power supply.",
                text_mr="सौर कृषी वाहिनी २.०: शेतकऱ्यांना दिवसा अखंड वीजपुरवठ्यासाठी ७,००० मेगावॅटचे उद्दिष्ट दृष्टिक्षेपात.",
                link_url="/sources/clipping/CLIP-MH21-001",
                created_at=now - timedelta(hours=5),
                expires_at=now + timedelta(hours=36),
                provenance="synthetic",
            ),
            TickerItem(
                id="TCK-007",
                kind=TickerKind.HEADLINE.value,
                text_en="Hinduhridaysamrat Balasaheb Thackeray Aapla Davakhana serves over 25 lakh citizens free of cost.",
                text_mr="आपला दवाखाना: राज्यातील २५ लाखांहून अधिक नागरिकांना घराजवळ मोफत वैद्यकीय उपचार व औषधे उपलब्ध.",
                link_url="/sources/tv/TV-MH01-001",
                created_at=now - timedelta(hours=6),
                expires_at=now + timedelta(hours=48),
                provenance="synthetic",
            ),
            TickerItem(
                id="TCK-008",
                kind=TickerKind.ALERT.value,
                text_en="CRISIS SLA AUDIT: 100% of high-priority disinformation tickets verified within statutory 90-minute window today.",
                text_mr="संकट निवारण एसएलए: आज प्राप्त सर्व महत्त्वाच्या अफवांचे ९० मिनिटांच्या आत यशस्वी खंडन व निरसन.",
                link_url="/sources/social/SOC-MH04-001",
                created_at=now - timedelta(hours=7),
                expires_at=now + timedelta(hours=12),
                provenance="synthetic",
            ),
            TickerItem(
                id="TCK-009",
                kind=TickerKind.ANNOUNCEMENT.value,
                text_en="Jalyukt Shivar Abhiyan 2.0 sanctions 5,400 village water recharge structures for summer resilience.",
                text_mr="जलयुक्त शिवार २.०: आगामी उन्हाळ्याच्या पार्श्वभूमीवर ५,४०० गावांमधील जलसंधारण कामांना प्रशासकीय मंजुरी.",
                link_url="/sources/clipping/CLIP-MH17-001",
                created_at=now - timedelta(hours=8),
                expires_at=now + timedelta(hours=48),
                provenance="synthetic",
            ),
            TickerItem(
                id="TCK-010",
                kind=TickerKind.HEADLINE.value,
                text_en="State IT & Cyber Cell coordinates with DGIPR to monitor cross-platform deepfake content.",
                text_mr="माहिती तंत्रज्ञान व सायबर सेलचे महासंचालनालयासोबत समन्वय; डीपफेक व खोट्या चित्रफितींवर करडी नजर.",
                link_url="/sources/tv/TV-MH07-001",
                created_at=now - timedelta(hours=9),
                expires_at=now + timedelta(hours=36),
                provenance="synthetic",
            ),
            TickerItem(
                id="TCK-011",
                kind=TickerKind.ANNOUNCEMENT.value,
                text_en="Lek Ladki Scheme enrolment camps initiated in all Zilla Parishad schools across Marathwada.",
                text_mr="लेक लाडकी योजना: मराठवाड्यातील सर्व जिल्हा परिषद शाळांमध्ये विशेष नोंदणी शिबिरांना सुरुवात.",
                link_url="/sources/clipping/CLIP-MH13-001",
                created_at=now - timedelta(hours=10),
                expires_at=now + timedelta(hours=60),
                provenance="synthetic",
            ),
            TickerItem(
                id="TCK-012",
                kind=TickerKind.HEADLINE.value,
                text_en="Chief Secretary reviews district governance dashboards; commends rapid public grievance redressal.",
                text_mr="मुख्य सचिवांकडून जिल्हा संनियंत्रण डॅशबोर्डचा आढावा; गतिमान प्रशासनासाठी सूचना.",
                link_url="/sources/clipping/CLIP-MH05-001",
                created_at=now - timedelta(hours=11),
                expires_at=now + timedelta(hours=48),
                provenance="synthetic",
            ),
        ]

        session.add_all(ticker_items)
        print(f"Added {len(ticker_items)} statewide live news ticker items.")

        session.commit()
        print("Demo dashboard data successfully seeded into database.")

    except Exception as exc:
        session.rollback()
        print(f"Error during seeding: {exc}")
        raise
    finally:
        session.close()


if __name__ == "__main__":
    force_seed = "--force" in sys.argv
    seed_demo_data(force=force_seed)
