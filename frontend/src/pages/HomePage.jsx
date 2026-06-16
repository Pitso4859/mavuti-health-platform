import { Link } from 'react-router-dom';
import {
  IconStethoscope, IconHeartPulse, IconFlask, IconBrain,
  IconSyringe, IconPill, IconPhone, IconClock,
  IconCalendar, IconChevronRight, IconShield, IconUsers,
  IconCheckCircle,
} from '../components/Icons';

/* ─── SVG Illustrations derived from the uploaded images ─── */

/* Campus building — from img11.jpg (VUT building exterior) */
const CampusSVG = () => (
    <svg viewBox="0 0 520 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Sky */}
      <rect width="520" height="320" fill="#dce8f7"/>
      <ellipse cx="420" cy="60" rx="80" ry="40" fill="white" opacity="0.7"/>
      <ellipse cx="100" cy="80" rx="60" ry="28" fill="white" opacity="0.5"/>
      {/* Ground */}
      <rect y="240" width="520" height="80" fill="#b8c9a0"/>
      <rect y="255" width="520" height="65" fill="#a8ba8a"/>
      {/* Main building body */}
      <rect x="60" y="100" width="400" height="155" rx="4" fill="#c8b89a"/>
      <rect x="60" y="100" width="400" height="155" fill="url(#brickPat)" opacity="0.3"/>
      {/* Curved top parapet */}
      <path d="M60 100 Q260 55 460 100" stroke="#b0a080" strokeWidth="3" fill="#d4c4a0"/>
      <path d="M60 100 Q260 65 460 100 L460 115 Q260 75 60 115Z" fill="#d4c4a0"/>
      {/* VUT sign band */}
      <rect x="170" y="115" width="180" height="22" rx="3" fill="#0033a0"/>
      <text x="260" y="131" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="system-ui">VUT</text>
      {/* Columns */}
      {[100,155,210,265,320,375,420].map((x,i) => (
          <rect key={i} x={x} y="145" width="18" height="110" rx="2" fill="#bfaa88" opacity="0.9"/>
      ))}
      {/* Windows upper */}
      {[85,145,205,265,325,385].map((x,i) => (
          <rect key={i} x={x} y="155" width="35" height="28" rx="2" fill="#8badd4" opacity="0.8"/>
      ))}
      {/* Windows lower */}
      {[85,145,205,265,325,385].map((x,i) => (
          <rect key={i} x={x} y="198" width="35" height="28" rx="2" fill="#8badd4" opacity="0.8"/>
      ))}
      {/* VUT crest */}
      <circle cx="440" cy="108" r="18" fill="white" opacity="0.9"/>
      <circle cx="100" cy="108" r="18" fill="white" opacity="0.9"/>
      {/* Entrance */}
      <rect x="220" y="208" width="80" height="47" rx="3" fill="#7a9bc2" opacity="0.8"/>
      <line x1="260" y1="208" x2="260" y2="255" stroke="#5a7ba0" strokeWidth="2"/>
      {/* Trees */}
      <ellipse cx="30" cy="230" rx="22" ry="30" fill="#5a8a3a"/>
      <rect x="27" y="248" width="6" height="18" fill="#6b4a1e"/>
      <ellipse cx="490" cy="225" rx="22" ry="32" fill="#4a7a2a"/>
      <rect x="487" y="246" width="6" height="19" fill="#6b4a1e"/>
      {/* Walkway */}
      <path d="M200 255 L320 255 L340 280 L180 280Z" fill="#ccc0a0" opacity="0.7"/>
      {/* "Vaal University of Technology" text on building */}
      <text x="260" y="94" textAnchor="middle" fill="#0033a0" fontSize="9" fontWeight="600" fontFamily="system-ui" opacity="0.8">Vaal University of Technology</text>
      <defs>
        <pattern id="brickPat" patternUnits="userSpaceOnUse" width="20" height="10">
          <rect width="20" height="10" fill="none" stroke="#a09070" strokeWidth="0.4"/>
        </pattern>
      </defs>
    </svg>
);

/* Health fair / wellness event — from event images */
const HealthFairSVG = () => (
    <svg viewBox="0 0 480 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Sky/background */}
      <rect width="480" height="300" fill="#e8f4e8"/>
      <rect y="220" width="480" height="80" fill="#8ab870"/>
      <rect y="238" width="480" height="62" fill="#7aa860"/>
      {/* Tent 1 — blue VUT tent */}
      <polygon points="30,80 160,80 175,150 15,150" fill="#0033a0"/>
      <polygon points="30,80 160,80 155,88 35,88" fill="#001f62"/>
      <rect x="15" y="150" width="160" height="70" fill="#e8f0ff"/>
      <rect x="25" y="155" width="140" height="60" fill="#d0dcf8"/>
      {/* VUT banner on tent */}
      <rect x="35" y="90" width="110" height="18" fill="white" opacity="0.9"/>
      <text x="90" y="103" textAnchor="middle" fill="#0033a0" fontSize="8" fontWeight="bold" fontFamily="system-ui">VUT CAMPUS CLINIC</text>
      {/* Tent 2 — gold/yellow */}
      <polygon points="180,90 290,90 300,150 170,150" fill="#FFD100"/>
      <polygon points="180,90 290,90 285,98 185,98" fill="#c9a600"/>
      <rect x="170" y="150" width="130" height="70" fill="#fffbdd"/>
      {/* "HEALTH PROMOTION" sign */}
      <rect x="180" y="100" width="100" height="16" fill="white" opacity="0.9"/>
      <text x="230" y="112" textAnchor="middle" fill="#c9a600" fontSize="7.5" fontWeight="bold" fontFamily="system-ui">HEALTH PROMOTION</text>
      {/* Tent 3 — purple */}
      <polygon points="310,85 420,85 430,150 300,150" fill="#7c3aed"/>
      <polygon points="310,85 420,85 415,93 315,93" fill="#5b21b6"/>
      <rect x="300" y="150" width="130" height="70" fill="#f3f0ff"/>
      <rect x="310" y="96" width="100" height="16" fill="white" opacity="0.9"/>
      <text x="360" y="108" textAnchor="middle" fill="#7c3aed" fontSize="7" fontWeight="bold" fontFamily="system-ui">HEALTH COUNSELLING</text>
      {/* Tables */}
      <rect x="30" y="185" width="130" height="8" rx="1" fill="#8b7355"/>
      <rect x="185" y="185" width="100" height="8" rx="1" fill="#8b7355"/>
      <rect x="310" y="185" width="100" height="8" rx="1" fill="#8b7355"/>
      {/* People silhouettes */}
      {/* Person 1 */}
      <circle cx="75" cy="168" r="9" fill="#8b6040"/>
      <rect x="68" y="177" width="14" height="20" rx="3" fill="#ff6b35"/>
      {/* Person 2 */}
      <circle cx="110" cy="165" r="9" fill="#6b4020"/>
      <rect x="103" y="174" width="14" height="20" rx="3" fill="#0033a0"/>
      {/* Person 3 */}
      <circle cx="230" cy="167" r="9" fill="#8b5030"/>
      <rect x="223" y="176" width="14" height="22" rx="3" fill="#FFD100"/>
      {/* Person 4 — health worker */}
      <circle cx="265" cy="163" r="9" fill="#7a4520"/>
      <rect x="258" y="172" width="14" height="22" rx="3" fill="#0033a0"/>
      {/* Cross/plus on health worker */}
      <text x="265" y="183" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">+</text>
      {/* Person 5 */}
      <circle cx="355" cy="165" r="9" fill="#9b6040"/>
      <rect x="348" y="174" width="14" height="22" rx="3" fill="#dcfce7"/>
      {/* Balloons/signage */}
      <circle cx="455" cy="70" r="18" fill="#ef4444" opacity="0.8"/>
      <line x1="455" y1="88" x2="458" y2="115" stroke="#ef4444" strokeWidth="1.5"/>
      <circle cx="20" cy="65" r="14" fill="#22c55e" opacity="0.8"/>
      <line x1="20" y1="79" x2="22" y2="105" stroke="#22c55e" strokeWidth="1.5"/>
      {/* Trees in bg */}
      <ellipse cx="445" cy="155" rx="18" ry="22" fill="#4a8a2a" opacity="0.7"/>
      <ellipse cx="8" cy="150" rx="15" ry="20" fill="#5a8a3a" opacity="0.7"/>
      {/* "078 005" counselling number sign */}
      <rect x="320" y="68" width="80" height="14" rx="2" fill="#7c3aed" opacity="0.9"/>
      <text x="360" y="79" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="system-ui">078 005 XXXX</text>
    </svg>
);

/* Medical consultation SVG — from WhatsApp clinic photo */
const ConsultationSVG = () => (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Room background */}
      <rect width="400" height="300" fill="#f0f4f8"/>
      <rect y="240" width="400" height="60" fill="#dde4ed"/>
      {/* Examination table */}
      <rect x="60" y="190" width="280" height="18" rx="4" fill="#b0bec5"/>
      <rect x="80" y="208" width="240" height="55" rx="2" fill="#90a4ae"/>
      {/* Patient sitting on table */}
      <circle cx="160" cy="165" r="22" fill="#8b5030"/>
      <rect x="135" y="187" width="50" height="45" rx="5" fill="#4a90d9"/>
      {/* Health worker / doctor */}
      <circle cx="270" cy="155" r="22" fill="#7a4020"/>
      <rect x="245" y="177" width="50" height="50" rx="5" fill="#0033a0"/>
      {/* White coat */}
      <rect x="248" y="177" width="44" height="48" rx="4" fill="white" opacity="0.4"/>
      {/* Stethoscope */}
      <path d="M268 200 Q280 210 285 225" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="285" cy="228" r="5" fill="#555" stroke="#333" strokeWidth="1"/>
      {/* Clipboard */}
      <rect x="290" y="170" width="35" height="45" rx="3" fill="white"/>
      <rect x="293" y="177" width="29" height="2" fill="#9baac4"/>
      <rect x="293" y="183" width="29" height="2" fill="#9baac4"/>
      <rect x="293" y="189" width="22" height="2" fill="#9baac4"/>
      <rect x="293" y="195" width="25" height="2" fill="#9baac4"/>
      <rect x="293" y="201" width="20" height="2" fill="#9baac4"/>
      {/* Dialogue/speech indication */}
      <path d="M190 155 Q220 140 250 155" stroke="#FFD100" strokeWidth="2" fill="none" strokeDasharray="4,3"/>
      {/* Medical cross on wall */}
      <rect x="195" y="60" width="10" height="30" rx="2" fill="#dc2626" opacity="0.7"/>
      <rect x="188" y="67" width="24" height="10" rx="2" fill="#dc2626" opacity="0.7"/>
      {/* Window */}
      <rect x="290" y="50" width="80" height="70" rx="3" fill="#dce8f7"/>
      <line x1="330" y1="50" x2="330" y2="120" stroke="#9baac4" strokeWidth="1.5"/>
      <line x1="290" y1="85" x2="370" y2="85" stroke="#9baac4" strokeWidth="1.5"/>
      {/* VUT sign on wall */}
      <rect x="30" y="55" width="120" height="24" rx="3" fill="#0033a0"/>
      <text x="90" y="72" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="system-ui">MAVUTI CLINIC</text>
      {/* Floor line */}
      <line x1="0" y1="255" x2="400" y2="255" stroke="#c8d4e0" strokeWidth="2"/>
      {/* Chair */}
      <rect x="60" y="220" width="35" height="5" rx="1" fill="#78909c"/>
      <rect x="65" y="225" width="5" height="30" fill="#78909c"/>
      <rect x="85" y="225" width="5" height="30" fill="#78909c"/>
    </svg>
);

/* Health talk event poster style SVG — from event1.jpg */
const HealthTalkSVG = () => (
    <svg viewBox="0 0 360 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="360" height="240" fill="#0033a0"/>
      {/* Wave pattern top */}
      <path d="M0 0 Q90 30 180 15 Q270 0 360 20 L360 0Z" fill="#001f62"/>
      {/* Gold banner */}
      <rect y="55" width="360" height="40" fill="#FFD100"/>
      <text x="180" y="80" textAnchor="middle" fill="#001f62" fontSize="13" fontWeight="900" fontFamily="system-ui">HEALTH TALK</text>
      {/* Heart icon made of circles */}
      <circle cx="90" cy="155" r="40" fill="rgba(255,255,255,0.08)"/>
      <circle cx="90" cy="155" r="28" fill="rgba(255,255,255,0.1)"/>
      <circle cx="90" cy="155" r="18" fill="rgba(255,209,0,0.2)"/>
      {/* Heartbeat line */}
      <path d="M25 155 L55 155 L65 130 L75 175 L85 120 L95 175 L105 140 L115 160 L140 160 L155 155 L200 155"
            stroke="#FFD100" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Cross icon */}
      <rect x="73" y="143" width="34" height="10" rx="3" fill="white" opacity="0.9"/>
      <rect x="83" y="133" width="14" height="30" rx="3" fill="white" opacity="0.9"/>
      {/* Text content */}
      <text x="230" y="115" fill="white" fontSize="9" fontFamily="system-ui" opacity="0.9">GUEST SPEAKERS:</text>
      <text x="230" y="130" fill="#FFD100" fontSize="8.5" fontFamily="system-ui">Dr Maduna</text>
      <text x="230" y="143" fill="rgba(255,255,255,0.7)" fontSize="7.5" fontFamily="system-ui" fontStyle="italic">Campus Medical Doctor</text>
      <text x="230" y="158" fill="#FFD100" fontSize="8.5" fontFamily="system-ui">Dr Mathe</text>
      <text x="230" y="171" fill="rgba(255,255,255,0.7)" fontSize="7.5" fontFamily="system-ui" fontStyle="italic">HIV/AIDS Specialist</text>
      <text x="230" y="186" fill="#FFD100" fontSize="8.5" fontFamily="system-ui">Ms Betty Pheto</text>
      <text x="230" y="199" fill="rgba(255,255,255,0.7)" fontSize="7.5" fontFamily="system-ui" fontStyle="italic">Dietician</text>
      {/* Date */}
      <rect x="25" y="190" width="170" height="36" rx="4" fill="rgba(255,255,255,0.1)"/>
      <text x="35" y="206" fill="#FFD100" fontSize="10" fontWeight="bold" fontFamily="system-ui">25 OCTOBER 2024</text>
      <text x="35" y="221" fill="white" fontSize="9" fontFamily="system-ui">09:00–12:30 · Amphitheatre</text>
      {/* White particles */}
      {[40,80,200,300,320,60,260].map((x,i)=>(
          <circle key={i} cx={x} cy={[30,20,40,25,45,48,35][i]} r="2" fill="white" opacity="0.4"/>
      ))}
    </svg>
);

/* Vaccination campaign SVG */
const VaccinationSVG = () => (
    <svg viewBox="0 0 360 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="360" height="240" fill="#ccf0ee"/>
      {/* Background gradient feel */}
      <ellipse cx="300" cy="60" rx="120" ry="120" fill="rgba(0,200,190,0.15)"/>
      <ellipse cx="60" cy="200" rx="100" ry="100" fill="rgba(0,51,160,0.08)"/>
      {/* Title */}
      <text x="20" y="38" fill="#0033a0" fontSize="9" fontWeight="bold" fontFamily="system-ui" letterSpacing="2">MASS</text>
      <text x="15" y="72" fill="#0033a0" fontSize="22" fontWeight="900" fontFamily="system-ui">INFLU</text>
      <text x="110" y="72" fill="#001f62" fontSize="22" fontWeight="900" fontFamily="system-ui">ENZA</text>
      <text x="15" y="98" fill="#0033a0" fontSize="22" fontWeight="900" fontFamily="system-ui">VACCINATION</text>
      {/* Date strip */}
      <rect x="15" y="108" width="140" height="22" rx="3" fill="#FFD100"/>
      <text x="85" y="123" textAnchor="middle" fill="#001f62" fontSize="10" fontWeight="bold" fontFamily="system-ui">23 MAY 2024</text>
      {/* Tags */}
      <rect x="15" y="136" width="50" height="16" rx="2" fill="#0033a0" opacity="0.9"/>
      <text x="40" y="148" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="system-ui">STUDENT</text>
      <rect x="72" y="136" width="45" height="16" rx="2" fill="#0033a0" opacity="0.7"/>
      <text x="94" y="148" textAnchor="middle" fill="white" fontSize="8" fontFamily="system-ui">STAFF</text>
      {/* Syringe illustration */}
      <g transform="translate(195,50) rotate(30)">
        {/* Gloved hand */}
        <ellipse cx="55" cy="150" rx="28" ry="20" fill="#4fc3d4" opacity="0.9"/>
        <rect x="35" y="130" width="40" height="22" rx="8" fill="#4fc3d4" opacity="0.9"/>
        {/* Syringe body */}
        <rect x="45" y="30" width="20" height="100" rx="4" fill="rgba(255,255,255,0.9)"/>
        <rect x="47" y="32" width="16" height="96" rx="3" fill="rgba(200,240,255,0.9)"/>
        {/* Graduation marks */}
        {[20,35,50,65,80].map((y,i)=>(
            <line key={i} x1="48" y1={32+y} x2="53" y2={32+y} stroke="#9baac4" strokeWidth="1"/>
        ))}
        {/* Plunger */}
        <rect x="43" y="28" width="24" height="8" rx="2" fill="#9baac4"/>
        <rect x="50" y="18" width="10" height="12" rx="2" fill="#9baac4"/>
        {/* Needle */}
        <rect x="53" y="128" width="4" height="28" fill="#9baac4"/>
        <polygon points="53,156 57,156 55,168" fill="#9baac4"/>
        {/* Liquid */}
        <rect x="48" y="80" width="14" height="46" rx="2" fill="#4fc3d4" opacity="0.5"/>
      </g>
      {/* Virus particles */}
      {[[30,170,18],[310,50,14],[330,180,10],[280,210,12],[25,100,10]].map(([x,y,r],i)=>(
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill="rgba(220,50,50,0.7)" opacity="0.5"/>
            {[0,60,120,180,240,300].map((deg,j)=>(
                <line key={j}
                      x1={x + Math.cos(deg*Math.PI/180)*r}
                      y1={y + Math.sin(deg*Math.PI/180)*r}
                      x2={x + Math.cos(deg*Math.PI/180)*(r+5)}
                      y2={y + Math.sin(deg*Math.PI/180)*(r+5)}
                      stroke="rgba(220,50,50,0.6)" strokeWidth="1.5" opacity="0.5"/>
            ))}
          </g>
      ))}
      {/* Campus Clinic stamp */}
      <rect x="200" y="175" width="140" height="50" rx="6" fill="rgba(0,51,160,0.08)" stroke="#0033a0" strokeWidth="1" strokeDasharray="3,3"/>
      <text x="270" y="196" textAnchor="middle" fill="#0033a0" fontSize="8" fontWeight="bold" fontFamily="system-ui">CAMPUS CLINIC</text>
      <text x="270" y="210" textAnchor="middle" fill="#0033a0" fontSize="7.5" fontFamily="system-ui">In collaboration with IHAU</text>
      <text x="270" y="222" textAnchor="middle" fill="#9baac4" fontSize="7" fontFamily="system-ui">Victim Empowerment Centre</text>
    </svg>
);

/* Mental health SVG */
const MentalHealthSVG = () => (
    <svg viewBox="0 0 360 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Background */}
      <rect width="360" height="240" fill="#1e2a4a"/>
      {/* Gradient rectangle behind brain */}
      <rect x="60" y="10" width="240" height="160" rx="8" fill="#2a3560" opacity="0.8"/>
      {/* Brain illustration (stylised) */}
      <g transform="translate(100, 20)">
        {/* Brain outline */}
        <path d="M80 20 Q120 0 140 30 Q170 10 175 50 Q200 55 195 85 Q210 110 185 125 Q180 150 150 145 Q130 165 100 150 Q70 165 55 145 Q25 145 20 115 Q-5 100 5 70 Q0 40 30 30 Q40 0 80 20Z"
              fill="#c8a090" stroke="#a08070" strokeWidth="1.5"/>
        {/* Brain folds left hemisphere */}
        <path d="M45 60 Q60 50 70 65 Q80 55 90 68" stroke="#a08070" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M30 90 Q50 80 65 92 Q78 82 88 95" stroke="#a08070" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M40 120 Q58 108 70 120 Q82 110 92 122" stroke="#a08070" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Brain folds right hemisphere */}
        <path d="M110 55 Q125 45 138 58 Q148 48 158 60" stroke="#a08070" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M105 85 Q122 75 136 88 Q148 78 160 90" stroke="#a08070" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M108 115 Q124 105 138 116 Q150 107 162 118" stroke="#a08070" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Centre divide */}
        <line x1="97" y1="25" x2="100" y2="148" stroke="#a08070" strokeWidth="1.5" strokeDasharray="4,3"/>
      </g>
      {/* "Mental Health." text */}
      <text x="25" y="175" fill="#c8a090" fontSize="24" fontWeight="900" fontFamily="system-ui">Mental</text>
      <text x="25" y="205" fill="#c8a090" fontSize="24" fontWeight="900" fontFamily="system-ui">Health.</text>
      {/* Hashtag */}
      <text x="200" y="205" fill="#c8a090" fontSize="18" fontWeight="900" fontFamily="system-ui" opacity="0.85">#Let'stalk</text>
      {/* Neural connections */}
      {[[290,50],[310,90],[280,130],[320,155],[340,80]].map(([x,y],i)=>(
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="#c8a090" opacity="0.5"/>
            <line x1={x} y1={y} x2={[310,280,320,340,290][i]} y2={[90,130,155,80,50][i]}
                  stroke="#c8a090" strokeWidth="1" opacity="0.3"/>
          </g>
      ))}
      {/* Soft glow */}
      <ellipse cx="180" cy="100" rx="100" ry="80" fill="rgba(200,160,144,0.06)"/>
    </svg>
);

/* ─── Data ─────────────────────────────────────────────── */
const SERVICES_PREVIEW = [
  { icon: IconStethoscope, title: 'General Consultation', desc: 'Comprehensive assessments and treatment of common illnesses and health conditions.' },
  { icon: IconHeartPulse,  title: 'Health Screening',     desc: 'Blood pressure, cholesterol, glucose, BMI and vision checks for all members.' },
  { icon: IconBrain,       title: 'Mental Health',        desc: 'Confidential counselling for stress, anxiety, depression and student wellness.' },
  { icon: IconFlask,       title: 'Lab Tests',            desc: 'On-site STI, pregnancy and allergy diagnostic testing with fast results.' },
  { icon: IconSyringe,     title: 'Immunization',         desc: 'Flu vaccines, HIV testing, ARV initiation and mass vaccination campaigns.' },
  { icon: IconPill,        title: 'Pharmacy',             desc: 'Dispensing prescribed medication for registered students and staff.' },
];

const HOURS = [
  { day: 'Monday',    time: '08:00 – 17:00' },
  { day: 'Tuesday',   time: '08:00 – 17:00' },
  { day: 'Wednesday', time: '08:00 – 17:00' },
  { day: 'Thursday',  time: '08:00 – 17:00' },
  { day: 'Friday',    time: '08:00 – 16:00' },
  { day: 'Saturday',  time: '09:00 – 12:00' },
  { day: 'Sunday',    time: 'Closed' },
];

const TRUST_POINTS = [
  'Confidential health records',
  'Qualified medical staff',
  'Free for registered VUT students',
  'Covered by most medical aids',
];

const EVENTS = [
  {
    SVG: HealthTalkSVG,
    tag: 'Event',
    tagColor: '#0033a0',
    title: 'Health Talk',
    desc: 'Information on health conditions and preventative measures. All staff and students welcome.',
    date: '25 Oct 2024',
    location: 'Amphitheatre',
  },
  {
    SVG: VaccinationSVG,
    tag: 'Campaign',
    tagColor: '#16a34a',
    title: 'Mass Influenza Vaccination',
    desc: 'Annual flu vaccination drive for all students and staff in collaboration with IHAU Campus Clinic.',
    date: '23 May 2024',
    location: 'Victim Empowerment Centre',
  },
  {
    SVG: MentalHealthSVG,
    tag: 'Awareness',
    tagColor: '#7c3aed',
    title: 'Mental Health Awareness',
    desc: "Breaking stigma around mental health on campus. #Let'stalk — open sessions, counselling walk-ins welcome.",
    date: 'Ongoing',
    location: 'Counselling Centre',
  },
];

/* ─── HomePage ──────────────────────────────────────────── */
export default function HomePage() {
  const today = new Date().toLocaleDateString('en-ZA', { weekday: 'long' });

  return (
      <div>

        {/* ══════════════════════════════════════════════
          HERO — split: copy left, campus SVG right
          ══════════════════════════════════════════════ */}
        <section style={{
          background: 'linear-gradient(135deg, #001f62 0%, #0033a0 60%, #0a4fd4 100%)',
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: 0,
        }}>
          {/* Diagonal gold accent */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '42%', height: '100%',
            background: 'linear-gradient(160deg, rgba(255,209,0,0.10) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}/>
          {/* Dotted grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            pointerEvents: 'none',
          }}/>

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--s12)',
              alignItems: 'center',
            }}>
              {/* Left copy */}
              <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,209,0,0.15)',
                border: '1px solid rgba(255,209,0,0.35)',
                borderRadius: 'var(--radius-full)',
                padding: '5px 14px',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                color: '#FFD100',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                marginBottom: 'var(--s6)',
              }}>
                <IconShield size={12} style={{ color: '#FFD100' }} />
                Vaal University of Technology · Est. 1966
              </span>

                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
                  fontWeight: 900,
                  color: 'white',
                  lineHeight: 1.12,
                  marginBottom: 'var(--s6)',
                }}>
                  Your health,<br />
                  our <span style={{ color: '#FFD100' }}>priority</span>.
                </h1>

                <p style={{
                  color: 'rgba(255,255,255,0.72)',
                  fontSize: 'var(--text-lg)',
                  lineHeight: 1.7,
                  marginBottom: 'var(--s8)',
                  maxWidth: 480,
                }}>
                  The Mavuti Health Clinic provides comprehensive medical services
                  to over 50,000 VUT students and staff — from consultations
                  to mental health support, all in one place.
                </p>

                <div style={{ display: 'flex', gap: 'var(--s4)', flexWrap: 'wrap', marginBottom: 'var(--s10)' }}>
                  <Link to="/appointment" className="btn btn-gold btn-lg">
                    <IconCalendar size={18} />
                    Book Appointment
                  </Link>
                  <Link to="/services" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '13px 24px', borderRadius: 'var(--radius-md)',
                    border: '2px solid rgba(255,255,255,0.35)',
                    color: 'white', fontWeight: 600, fontSize: 'var(--text-base)',
                    transition: 'border-color var(--t-fast), background var(--t-fast)',
                  }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor='white'; e.currentTarget.style.background='rgba(255,255,255,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.35)'; e.currentTarget.style.background='transparent'; }}>
                    View All Services
                    <IconChevronRight size={18} />
                  </Link>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 'var(--s8)' }}>
                  {[
                    { value: '50K+', label: 'Community served' },
                    { value: '6',    label: 'Specialist services' },
                    { value: '60',   label: 'Years of VUT excellence' },
                  ].map(({ value, label }) => (
                      <div key={label}>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFD100', lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                          {value}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.55)', marginTop: 4, fontWeight: 500 }}>
                          {label}
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              {/* Right — Campus SVG */}
              <div style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
                border: '2px solid rgba(255,255,255,0.12)',
                aspectRatio: '16/10',
              }}>
                <CampusSVG />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
          TRUST BAR
          ══════════════════════════════════════════════ */}
        <div style={{ background: '#FFD100', padding: '14px 0' }}>
          <div className="container" style={{
            display: 'flex', justifyContent: 'center',
            gap: 'var(--s8)', flexWrap: 'wrap',
          }}>
            {TRUST_POINTS.map(p => (
                <span key={p} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 'var(--text-sm)', fontWeight: 600, color: '#001f62',
                }}>
              <IconCheckCircle size={16} />{p}
            </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
          HEALTH FAIR SECTION — full-width visual
          ══════════════════════════════════════════════ */}
        <section style={{ padding: 'var(--s20) 0', background: 'var(--gray-50)' }}>
          <div className="container">
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 'var(--s12)', alignItems: 'center',
            }}>
              {/* Left — illustration */}
              <div style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                aspectRatio: '16/10',
                border: '2px solid var(--gray-200)',
              }}>
                <HealthFairSVG />
              </div>
              {/* Right — copy */}
              <div>
              <span style={{
                display: 'inline-block',
                fontSize: 'var(--text-xs)', fontWeight: 700,
                color: '#0033a0', letterSpacing: '0.1em',
                textTransform: 'uppercase', marginBottom: 'var(--s3)',
                borderBottom: '2px solid #FFD100', paddingBottom: 2,
              }}>Campus Health Events</span>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                  fontWeight: 800, color: 'var(--gray-800)',
                  lineHeight: 1.2, marginBottom: 'var(--s5)',
                }}>
                  Bringing healthcare<br />to your campus.
                </h2>
                <p style={{
                  color: 'var(--gray-500)', fontSize: 'var(--text-lg)',
                  lineHeight: 1.7, marginBottom: 'var(--s6)',
                }}>
                  From mass flu vaccinations to HIV testing and wellness fairs,
                  the Mavuti Health Clinic brings free services directly onto campus
                  grounds — reaching every student and staff member where they are.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
                  {['Free health screenings on campus', 'HIV counselling & testing drives', 'Wellness blitz campaigns', 'Mental health awareness events'].map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: '#FFD100', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <IconCheckCircle size={13} style={{ color: '#001f62' }} />
                    </span>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-700)', fontWeight: 500 }}>{item}</span>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
          SERVICES GRID
          ══════════════════════════════════════════════ */}
        <section className="section" style={{ background: 'white' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 'var(--s12)' }}>
            <span style={{
              display: 'inline-block', fontSize: 'var(--text-xs)', fontWeight: 700,
              color: '#0033a0', letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: 'var(--s3)', borderBottom: '2px solid #FFD100', paddingBottom: 2,
            }}>What we offer</span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 800, color: 'var(--gray-800)', marginBottom: 'var(--s4)',
              }}>Medical Services</h2>
              <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-lg)', maxWidth: 520, margin: '0 auto' }}>
                Six specialised service areas designed around the unique health needs of the VUT campus community.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s6)' }}>
              {SERVICES_PREVIEW.map(({ icon: Icon, title, desc }) => (
                  <div key={title} style={{
                    background: 'white',
                    border: '1.5px solid var(--gray-200)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--s6)',
                    display: 'flex', flexDirection: 'column', gap: 'var(--s3)',
                    transition: 'box-shadow var(--t-mid), transform var(--t-mid), border-color var(--t-mid)',
                    cursor: 'default',
                  }}
                       onMouseEnter={e => {
                         e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                         e.currentTarget.style.transform = 'translateY(-4px)';
                         e.currentTarget.style.borderColor = '#0033a0';
                       }}
                       onMouseLeave={e => {
                         e.currentTarget.style.boxShadow = 'none';
                         e.currentTarget.style.transform = 'translateY(0)';
                         e.currentTarget.style.borderColor = 'var(--gray-200)';
                       }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 'var(--radius-md)',
                      background: 'var(--vut-navy-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={26} style={{ color: '#0033a0' }} />
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--gray-800)',
                    }}>{title}</h3>
                    <p style={{
                      color: 'var(--gray-500)', fontSize: 'var(--text-sm)',
                      lineHeight: 1.65, flex: 1,
                    }}>{desc}</p>
                  </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 'var(--s10)' }}>
              <Link to="/services" className="btn btn-primary btn-lg">
                Explore All Services <IconChevronRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
          CONSULTATION SECTION
          ══════════════════════════════════════════════ */}
        <section style={{ padding: 'var(--s20) 0', background: '#001f62' }}>
          <div className="container">
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 'var(--s12)', alignItems: 'center',
            }}>
              {/* Left copy */}
              <div>
              <span style={{
                display: 'inline-block',
                fontSize: 'var(--text-xs)', fontWeight: 700,
                color: '#FFD100', letterSpacing: '0.1em',
                textTransform: 'uppercase', marginBottom: 'var(--s3)',
                borderBottom: '2px solid #FFD100', paddingBottom: 2,
              }}>Personalised Care</span>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                  fontWeight: 800, color: 'white',
                  lineHeight: 1.2, marginBottom: 'var(--s5)',
                }}>
                  One-on-one<br />with our doctors.
                </h2>
                <p style={{
                  color: 'rgba(255,255,255,0.68)', fontSize: 'var(--text-lg)',
                  lineHeight: 1.7, marginBottom: 'var(--s8)',
                }}>
                  Our qualified medical team provides personalised consultations
                  in a confidential, judgement-free environment. Book online in
                  minutes and see a doctor the same day.
                </p>
                <Link to="/appointment" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px', borderRadius: 'var(--radius-md)',
                  background: '#FFD100', color: '#001f62',
                  fontWeight: 700, fontSize: 'var(--text-base)',
                  textDecoration: 'none',
                }}>
                  <IconCalendar size={18} /> Book Now
                </Link>
              </div>
              {/* Right — illustration */}
              <div style={{
                borderRadius: 'var(--radius-xl)', overflow: 'hidden',
                boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
                border: '2px solid rgba(255,255,255,0.1)',
                aspectRatio: '4/3',
              }}>
                <ConsultationSVG />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
          EVENTS — 3 cards with SVG covers
          ══════════════════════════════════════════════ */}
        <section className="section" style={{ background: 'var(--gray-50)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 'var(--s12)' }}>
            <span style={{
              display: 'inline-block', fontSize: 'var(--text-xs)', fontWeight: 700,
              color: '#0033a0', letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: 'var(--s3)', borderBottom: '2px solid #FFD100', paddingBottom: 2,
            }}>VUT Clinic Events</span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 800, color: 'var(--gray-800)',
              }}>Health Campaigns &amp; Awareness</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s6)' }}>
              {EVENTS.map(({ SVG, tag, tagColor, title, desc, date, location }) => (
                  <article key={title} style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    border: '1.5px solid var(--gray-200)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform var(--t-mid), box-shadow var(--t-mid)',
                  }}
                           onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-xl)'; }}
                           onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
                    {/* SVG cover */}
                    <div style={{ aspectRatio: '3/2', overflow: 'hidden' }}>
                      <SVG />
                    </div>
                    {/* Card body */}
                    <div style={{ padding: 'var(--s5)' }}>
                  <span style={{
                    display: 'inline-block', fontSize: 11, fontWeight: 700,
                    color: 'white', background: tagColor,
                    borderRadius: 'var(--radius-full)',
                    padding: '3px 10px', marginBottom: 'var(--s3)',
                  }}>{tag}</span>
                      <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-base)', fontWeight: 700,
                        color: 'var(--gray-800)', marginBottom: 'var(--s2)',
                      }}>{title}</h3>
                      <p style={{
                        color: 'var(--gray-500)', fontSize: 'var(--text-sm)',
                        lineHeight: 1.6, marginBottom: 'var(--s4)',
                      }}>{desc}</p>
                      <div style={{
                        display: 'flex', gap: 'var(--s4)',
                        fontSize: 'var(--text-xs)', color: 'var(--gray-400)',
                        borderTop: '1px solid var(--gray-100)', paddingTop: 'var(--s3)',
                      }}>
                        <span><IconCalendar size={11} style={{ display: 'inline', marginRight: 3 }} />{date}</span>
                        <span><IconShield size={11} style={{ display: 'inline', marginRight: 3 }} />{location}</span>
                      </div>
                    </div>
                  </article>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
          HOURS + EMERGENCY
          ══════════════════════════════════════════════ */}
        <section className="section section--navy">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 'var(--s12)' }}>
            <span style={{
              display: 'inline-block', fontSize: 'var(--text-xs)', fontWeight: 700,
              color: '#FFD100', letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: 'var(--s3)', borderBottom: '2px solid #FFD100', paddingBottom: 2,
            }}>When we're open</span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 800, color: 'white',
              }}>Clinic Hours</h2>
            </div>

            <div className="grid grid-2" style={{ gap: 'var(--s8)' }}>
              <div style={{
                background: 'rgba(255,255,255,0.07)', borderRadius: 'var(--radius-lg)',
                padding: 'var(--s8)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', marginBottom: 'var(--s6)' }}>
                  <IconClock size={22} style={{ color: '#FFD100' }} />
                  <h3 style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Regular Hours</h3>
                </div>
                {HOURS.map(({ day, time }) => (
                    <div key={day} className={`hours-row ${day === today ? 'today' : ''}`}>
                      <span className="day">{day}</span>
                      <span className="time" style={{ color: time === 'Closed' ? 'rgba(255,255,255,0.3)' : 'white' }}>{time}</span>
                    </div>
                ))}
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.07)', borderRadius: 'var(--radius-lg)',
                padding: 'var(--s8)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', marginBottom: 'var(--s6)' }}>
                  <IconPhone size={22} style={{ color: '#FFD100' }} />
                  <h3 style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Emergency Contact</h3>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'var(--text-sm)', marginBottom: 'var(--s5)' }}>
                  For after-hours emergencies, call our 24/7 line immediately.
                </p>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFD100', fontFamily: 'var(--font-display)' }}>
                  (016) 950-9111
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'var(--text-xs)', marginTop: 4, marginBottom: 'var(--s6)' }}>
                  24/7 Clinic Emergency
                </p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 'var(--s5)' }}>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'var(--text-sm)', marginBottom: 'var(--s3)' }}>
                    Life-threatening emergency:
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--s8)', flexWrap: 'wrap', marginBottom: 'var(--s5)' }}>
                    <div>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: 'var(--text-xl)' }}>112</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'var(--text-xs)' }}>National Emergency</div>
                    </div>
                    <div>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: 'var(--text-base)' }}>(016) 931-5000</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'var(--text-xs)' }}>Vanderbijlpark Medi-Clinic</div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 'var(--s4)' }}>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--text-xs)', marginBottom: 4 }}>Mental health support (free):</div>
                    <div style={{ color: '#FFD100', fontWeight: 700, fontSize: 'var(--text-lg)' }}>0800 567 567</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'var(--text-xs)' }}>SA Depression & Anxiety Helpline</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
          CTA
          ══════════════════════════════════════════════ */}
        <section className="section" style={{ background: 'var(--vut-navy-light)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <span style={{
            display: 'inline-block', fontSize: 'var(--text-xs)', fontWeight: 700,
            color: '#0033a0', letterSpacing: '0.1em', textTransform: 'uppercase',
            marginBottom: 'var(--s3)', borderBottom: '2px solid #FFD100', paddingBottom: 2,
          }}>Ready to get started?</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 800, color: '#0033a0',
              marginBottom: 'var(--s4)',
            }}>
              Take care of your health today
            </h2>
            <p style={{
              color: 'var(--gray-500)', fontSize: 'var(--text-lg)',
              marginBottom: 'var(--s8)',
            }}>
              Book an appointment in minutes. Free for all registered VUT students.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--s4)', flexWrap: 'wrap' }}>
              <Link to="/appointment" className="btn btn-primary btn-lg">
                <IconCalendar size={18} /> Book Now
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                <IconUsers size={18} /> Create Account
              </Link>
            </div>
          </div>
        </section>
      </div>
  );
}