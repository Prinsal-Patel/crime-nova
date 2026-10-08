import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def create_report():
    doc = docx.Document()

    # -------------------------------------------------------------
    # Page Setup (A4, 1.25" Left margin for binding, 1.0" others)
    # -------------------------------------------------------------
    for section in doc.sections:
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        section.left_margin = Inches(1.25)
        section.right_margin = Inches(1.0)
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)

    # Base styling
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(12)
    normal_style.font.color.rgb = RGBColor(0x11, 0x18, 0x27)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(6)

    # Helpers
    def set_cell_shading(cell, color_hex="F1F5F9"):
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
        cell._tc.get_or_add_tcPr().append(shd)

    def set_table_borders(table, color="D1D5DB", sz="4", val="single"):
        tblPr = table._tbl.tblPr
        borders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>\n'
            f'  <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>\n'
            f'  <w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>\n'
            f'  <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>\n'
            f'  <w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>\n'
            f'  <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>\n'
            f'  <w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>\n'
            f'</w:tblBorders>'
        )
        tblPr.append(borders)

    def set_cell_padding(table, top=100, bottom=100, left=150, right=150):
        tblPr = table._tbl.tblPr
        mar = parse_xml(
            f'<w:tblCellMar {nsdecls("w")}>\n'
            f'  <w:top w:w="{top}" w:type="dxa"/>\n'
            f'  <w:bottom w:w="{bottom}" w:type="dxa"/>\n'
            f'  <w:left w:w="{left}" w:type="dxa"/>\n'
            f'  <w:right w:w="{right}" w:type="dxa"/>\n'
            f'</w:tblCellMar>'
        )
        tblPr.append(mar)

    def add_chapter_title(num, title):
        doc.add_page_break()
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(f"CHAPTER {num}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(16)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x0f, 0x17, 0x2a)

        p2 = doc.add_paragraph()
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p2.paragraph_format.space_before = Pt(0)
        p2.paragraph_format.space_after = Pt(18)
        r2 = p2.add_run(title.upper())
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(16)
        r2.font.bold = True
        r2.font.color.rgb = RGBColor(0x0f, 0x17, 0x2a)

    def add_h1(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(14)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x1e, 0x29, 0x3b)
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
        return p

    def add_body(text, space_after=6):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(space_after)
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)
        return p

    def add_bullet(text):
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(3)
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)
        return p

    def add_fig_image(img_path, caption, width_in=5.8):
        if os.path.exists(img_path):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.keep_with_next = True
            doc.add_picture(img_path, width=Inches(width_in))
            last_p = doc.paragraphs[-1]
            last_p.alignment = WD_ALIGN_PARAGRAPH.CENTER

            cp = doc.add_paragraph()
            cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
            cp.paragraph_format.space_before = Pt(4)
            cp.paragraph_format.space_after = Pt(14)
            r = cp.add_run(caption)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10.5)
            r.font.bold = True
            r.font.italic = True
            r.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
        else:
            print(f"Warning: Image {img_path} not found.")

    assets_dir = r"d:\Downloads\crime-nova\src\docx\extracted_assets"
    fig_dir = r"d:\Downloads\crime-nova\src\docx\figures"

    # =============================================================
    # 1. COVER PAGE
    # =============================================================
    cover_p = doc.add_paragraph()
    cover_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cover_p.paragraph_format.space_before = Pt(10)
    cover_p.paragraph_format.space_after = Pt(8)

    # University Logo
    pu_logo = os.path.join(assets_dir, "Image5.jpg")
    if os.path.exists(pu_logo):
        doc.add_picture(pu_logo, width=Inches(1.8))
        doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run("CRIME NOVA: AI-POWERED CRIME INTELLIGENCE AND EMERGENCY RESPONSE PLATFORM")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(17)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x0f, 0x17, 0x2a)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(20)
    r = p.add_run("A PROJECT REPORT")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("Submitted by")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.italic = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(20)
    r = p.add_run("Patel Prinsal (2303051050529)\nPateliya Devanshu (2303051050535)")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("In Partial fulfilment for the award of the degree\nOf")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("BACHELOR OF TECHNOLOGY")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(14)
    r.font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(18)
    r = p.add_run("In\nCOMPUTER SCIENCE & ENGINEERING")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("Under the Guidance of")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.italic = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(18)
    r = p.add_run("PROF. NIRALI BHALIYA\nAssistant Professor\nComputer Science & Engineering Department\nParul Institute of Technology")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run("Parul University, Vadodara\nAcademic Year: 2026–2027")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True

    # =============================================================
    # 2. CERTIFICATE PAGE
    # =============================================================
    doc.add_page_break()

    if os.path.exists(pu_logo):
        doc.add_picture(pu_logo, width=Inches(1.6))
        doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("PARUL UNIVERSITY\nPARUL INSTITUTE OF TECHNOLOGY")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(14)
    r.font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(18)
    r = p.add_run("CERTIFICATE")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.underline = True

    cert_text = (
        "This is to certify that Project-II (303105423) of 7th Semester entitled "
        "“Crime Nova: AI-Powered Crime Intelligence and Emergency Response Platform” "
        "has been successfully completed by:\n\n"
        "        • Patel Prinsal           – 2303051050529\n"
        "        • Pateliya Devanshu    – 2303051050535\n\n"
        "under my guidance in partial fulfillment of the Bachelor of Technology (B.Tech.) "
        "in Computer Science & Engineering of Parul University, Vadodara during the Academic Year 2026–2027."
    )
    add_body(cert_text, space_after=32)

    # Signature blocks table (2x2)
    sig_table = doc.add_table(rows=2, cols=2)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.autofit = False

    sig_cells = [
        ("Prof. Nirali Bhaliya\nProject Guide", "Dr. Arnika Patel\nProject Coordinator"),
        ("Dr. Sumitra Menaria\nHead of Department, CSE", "EXTERNAL EXAMINER\nParul University")
    ]

    for r_idx, row in enumerate(sig_cells):
        for c_idx, text in enumerate(row):
            cell = sig_table.cell(r_idx, c_idx)
            cell.width = Inches(3.2)
            cp = cell.paragraphs[0]
            cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
            cp.paragraph_format.space_before = Pt(24)
            cp.paragraph_format.space_after = Pt(12)
            r = cp.add_run(text)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(11)
            r.font.bold = True

    # =============================================================
    # 3. ACKNOWLEDGEMENT PAGE
    # =============================================================
    doc.add_page_break()

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(18)
    r = p.add_run("ACKNOWLEDGEMENT")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True

    ack_text_1 = (
        "Behind any major engineering undertaking, there lies the invaluable contribution, guidance, "
        "and mentorship of people who helped navigate hurdles and achieve goals. It gives us immense pleasure "
        "to express our deepest gratitude towards our respected guide, Prof. Nirali Bhaliya, Assistant Professor, "
        "Department of Computer Science & Engineering, Parul Institute of Technology, for her persistent, outstanding, "
        "and invaluable co-operation, technical insight, and steadfast guidance throughout this project work."
    )
    add_body(ack_text_1)

    ack_text_2 = (
        "We also express our deep sense of regards and sincere thanks to Dr. Sumitra Menaria, Head of Computer Science "
        "& Engineering Department, and Dr. Arnika Patel, Project Coordinator, for providing state-of-the-art computational "
        "infrastructure, technical encouragement, and administrative support. We feel privileged to have had their precious "
        "advice, constructive feedback, and leadership during every phase of system realization."
    )
    add_body(ack_text_2)

    ack_text_3 = (
        "We would also like to extend our warm appreciation to all the faculty members of the Computer Science & Engineering "
        "Department for their academic mentorship, and to our parents and friends whose unwavering moral and logistical support "
        "inspired us throughout the development of Crime Nova. Last but not least, our humble thanks to the Almighty God for "
        "granting us the strength and perseverance to bring this endeavor to fruition."
    )
    add_body(ack_text_3, space_after=30)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r = p.add_run("Place: Vadodara\nDate: 17-09-2026")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r.font.italic = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = p.add_run("Patel Prinsal (2303051050529)\nPateliya Devanshu (2303051050535)")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r.font.bold = True

    # =============================================================
    # 4. ABSTRACT
    # =============================================================
    doc.add_page_break()

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(18)
    r = p.add_run("ABSTRACT")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True

    abs_1 = (
        "Crime Nova is an enterprise-grade, cloud-native crime intelligence, spatial visualization, "
        "and emergency response platform designed to overcome critical deficiencies in modern urban public safety systems. "
        "Contemporary crime reporting frameworks remain largely fragmented, relying on manual police FIR registrations, "
        "delayed paper-based investigations, and static statistical records that offer zero predictive insight or real-time "
        "situational awareness to citizens. Crime Nova eliminates this barrier by synthesizing geospatial mapping, predictive "
        "machine learning algorithms, real-time emergency dispatching, and administrative intelligence governance into a "
        "single, highly responsive web application."
    )
    add_body(abs_1)

    abs_2 = (
        "The system presentation tier is engineered with React 19 and Vite 8, incorporating interactive Leaflet geospatial "
        "heatmaps with custom HTML5 Canvas radial density rendering, dynamic Chart.js data visualizers, and a modern glassmorphic "
        "dark-mode user interface. The cloud tier utilizes Google Firebase, deploying Firebase Authentication for dual-mode "
        "stateless JWT sessions and Google OAuth 2.0 federation, Cloud Firestore for sub-second distributed NoSQL data synchronization, "
        "Firebase Cloud Storage for dataset hosting, and Cloud Functions for serverless machine learning inference pipelines. "
        "The platform delivers four core technological innovations: (1) an interactive spatial crime map identifying high-, medium-, "
        "and low-severity crime density hotspots across major Indian metropolitan centers; (2) an analytics dashboard providing "
        "cross-categorical distributions, seasonal monthly trend tracking, and area-specific crime metrics; (3) an AI crime prediction "
        "engine calculating multi-dimensional risk scores, peak vulnerable hours, and weekday crime patterns; and (4) a life-saving "
        "one-tap Emergency SOS dispatcher that automatically captures high-precision W3C HTML5 GPS coordinates, logs live distress "
        "signals, launches an active response timer, and provides immediate emergency hotline connectivity to Police (100), Ambulance (108), "
        "Fire Services (101), and Women Helplines (1091)."
    )
    add_body(abs_2)

    abs_3 = (
        "Administrators and law enforcement dispatchers access a dedicated Operations Control Center to monitor active SOS alerts in "
        "real time, triage responder dispatch states (Active, Responded, Resolved), inspect comprehensive historical crime records, and "
        "ingest external city crime dataset CSVs with automated schema validation. Comprehensive testing confirms sub-second initial page "
        "renders (First Contentful Paint < 0.8s), zero build-time syntax defects, sub-100ms Firestore live synchronization latency, and "
        "robust geolocation accuracy. Crime Nova serves as a vital blueprint for next-generation digital smart-policing and citizen safety ecosystems."
    )
    add_body(abs_3)

    # =============================================================
    # 5. TABLE OF CONTENTS
    # =============================================================
    doc.add_page_break()

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(18)
    r = p.add_run("TABLE OF CONTENTS")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True

    toc_items = [
        ("ACKNOWLEDGEMENT", "3"),
        ("ABSTRACT", "4"),
        ("TABLE OF CONTENTS", "5"),
        ("LIST OF TABLES", "6"),
        ("LIST OF FIGURES", "7"),
        ("LIST OF ABBREVIATIONS", "8"),
        ("CHAPTER 1 – INTRODUCTION", "9"),
        ("    1.1 Crime Nova – Overview", "9"),
        ("    1.2 Problem Definition", "10"),
        ("    1.3 Motivation", "10"),
        ("    1.4 Objectives", "11"),
        ("    1.5 Scope of the Project", "11"),
        ("    1.6 Hardware and Software Requirements", "13"),
        ("CHAPTER 2 – LITERATURE SURVEY", "14"),
        ("    2.1 Review of Existing Crime Reporting & Mapping Systems", "14"),
        ("    2.2 Advantages, Disadvantages, and Limitations of Existing Systems", "15"),
        ("    2.3 Background Technologies and Proposed System Analysis", "17"),
        ("CHAPTER 3 – METHODOLOGY", "20"),
        ("    3.1 Existing Methodology & Identified Shortcomings", "20"),
        ("    3.2 Proposed Agile Methodology & Multi-Phase Pipeline", "21"),
        ("CHAPTER 4 – SYSTEM DESIGN AND DIAGRAMS", "25"),
        ("    4.1 Data Flow Diagrams (DFD Level 0 and Level 1)", "25"),
        ("    4.2 Multi-Tier Cloud Architecture", "27"),
        ("    4.3 Use Case Modeling (Citizen & Administrative Actors)", "28"),
        ("    4.4 Entity-Relationship Diagram & Cloud Firestore Schema", "30"),
        ("    4.5 Behavioral Modeling – Emergency SOS Sequence Flow", "32"),
        ("CHAPTER 5 – IMPLEMENTATION", "33"),
        ("    5.1 System Module Descriptions", "33"),
        ("    5.2 Pseudo Code of Core Modules", "36"),
        ("    5.3 Platform Architecture and Component Hierarchy", "38"),
        ("CHAPTER 6 – RESULTS AND TESTING", "39"),
        ("    6.1 Verification Methodology and Testing Strategy", "39"),
        ("    6.2 Test Cases and Verification Outcomes", "41"),
        ("CHAPTER 7 – CONCLUSION AND FUTURE SCOPE", "44"),
        ("    7.1 Conclusion", "44"),
        ("    7.2 Future Scope & Emerging Enhancements", "44"),
        ("CHAPTER 8 – SCREENSHOTS", "46"),
        ("REFERENCES", "51")
    ]

    toc_table = doc.add_table(rows=len(toc_items), cols=2)
    toc_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_cell_padding(toc_table, top=60, bottom=60, left=100, right=100)

    for idx, (title, page) in enumerate(toc_items):
        cell_l = toc_table.cell(idx, 0)
        cell_r = toc_table.cell(idx, 1)
        cell_l.width = Inches(5.5)
        cell_r.width = Inches(0.8)

        pl = cell_l.paragraphs[0]
        pl.paragraph_format.space_after = Pt(2)
        rl = pl.add_run(title)
        rl.font.name = 'Times New Roman'
        rl.font.size = Pt(11)
        if title.startswith("CHAPTER") or title in ["ACKNOWLEDGEMENT", "ABSTRACT", "TABLE OF CONTENTS", "LIST OF TABLES", "LIST OF FIGURES", "LIST OF ABBREVIATIONS", "REFERENCES"]:
            rl.font.bold = True

        pr = cell_r.paragraphs[0]
        pr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        pr.paragraph_format.space_after = Pt(2)
        rr = pr.add_run(page)
        rr.font.name = 'Times New Roman'
        rr.font.size = Pt(11)
        if title.startswith("CHAPTER") or title in ["ACKNOWLEDGEMENT", "ABSTRACT", "TABLE OF CONTENTS", "LIST OF TABLES", "LIST OF FIGURES", "LIST OF ABBREVIATIONS", "REFERENCES"]:
            rr.font.bold = True

    # =============================================================
    # 6. LIST OF TABLES
    # =============================================================
    doc.add_page_break()

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(18)
    r = p.add_run("LIST OF TABLES")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True

    tables_list = [
        ("Table No.", "Table Description", "Page No."),
        ("Table 1.1", "Hardware and Software Requirements Specification", "13"),
        ("Table 2.1", "Comparative Analysis: Traditional Reporting vs Crime Nova", "16"),
        ("Table 3.1", "Methodology Phase Breakdown, Objectives, and Technical Artifacts", "22"),
        ("Table 3.2", "User Roles, Access Capabilities, and RBAC Security Controls", "24"),
        ("Table 5.1", "Crime Nova System Architecture Modules and Technology Stack", "34"),
        ("Table 6.1", "System Verification Outcomes and Test Suite Execution Matrix", "42"),
    ]

    tbl = doc.add_table(rows=len(tables_list), cols=3)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl)
    set_cell_padding(tbl, top=80, bottom=80, left=120, right=120)

    for r_idx, (t_no, desc, pg) in enumerate(tables_list):
        row = tbl.rows[r_idx]
        for c_idx, val in enumerate([t_no, desc, pg]):
            cell = row.cells[c_idx]
            cp = cell.paragraphs[0]
            cp.paragraph_format.space_after = Pt(2)
            if c_idx == 0:
                cell.width = Inches(1.3)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            elif c_idx == 1:
                cell.width = Inches(4.2)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            else:
                cell.width = Inches(0.9)
                cp.alignment = WD_ALIGN_PARAGRAPH.CENTER

            cr = cp.add_run(val)
            cr.font.name = 'Times New Roman'
            cr.font.size = Pt(11)
            if r_idx == 0:
                set_cell_shading(cell, "E2E8F0")
                cr.font.bold = True

    # =============================================================
    # 7. LIST OF FIGURES
    # =============================================================
    doc.add_page_break()

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(18)
    r = p.add_run("LIST OF FIGURES")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True

    figures_list = [
        ("Figure No.", "Figure Description", "Page No."),
        ("Figure 1.1", "Crime Nova System Ecosystem and User Interaction Overview", "12"),
        ("Figure 4.1", "Level 0 Data Flow Diagram (DFD) – Platform Context Model", "26"),
        ("Figure 4.2", "Level 1 Data Flow Diagram (DFD) – Subsystem Process Decomposition", "27"),
        ("Figure 4.3", "Crime Nova Production Multi-Tier Cloud Architecture", "28"),
        ("Figure 4.4", "Citizen and Law Enforcement Use Case Operational Model", "29"),
        ("Figure 4.5", "Entity-Relationship Diagram & Cloud Firestore Document Schema", "31"),
        ("Figure 4.6", "Emergency SOS Alert and Real-Time Geolocation Dispatch Sequence", "32"),
        ("Figure 5.1", "Machine Learning Spatio-Temporal Crime Risk Prediction Pipeline", "35"),
        ("Figure 8.1", "Crime Nova Futuristic Landing Page and Public Safety Metrics", "46"),
        ("Figure 8.2", "Interactive Geospatial Crime Heatmap with Dynamic Radius Filtering", "47"),
        ("Figure 8.3", "Crime Analytics Dashboard with Category Distribution & Trends", "47"),
        ("Figure 8.4", "AI Crime Risk Prediction Portal displaying Peak Hours & Hotspots", "48"),
        ("Figure 8.5", "One-Tap Emergency SOS Dispatcher with Live GPS Positioning", "49"),
        ("Figure 8.6", "Administrative Operations Control Center – Live SOS Dispatch Queue", "49"),
        ("Figure 8.7", "Administrative Incident Data Explorer and Filtering Grid", "50"),
        ("Figure 8.8", "Administrative Dataset Ingestion and CSV Upload Interface", "50"),
    ]

    tbl_f = doc.add_table(rows=len(figures_list), cols=3)
    tbl_f.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_f)
    set_cell_padding(tbl_f, top=70, bottom=70, left=120, right=120)

    for r_idx, (f_no, desc, pg) in enumerate(figures_list):
        row = tbl_f.rows[r_idx]
        for c_idx, val in enumerate([f_no, desc, pg]):
            cell = row.cells[c_idx]
            cp = cell.paragraphs[0]
            cp.paragraph_format.space_after = Pt(2)
            if c_idx == 0:
                cell.width = Inches(1.3)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            elif c_idx == 1:
                cell.width = Inches(4.2)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            else:
                cell.width = Inches(0.9)
                cp.alignment = WD_ALIGN_PARAGRAPH.CENTER

            cr = cp.add_run(val)
            cr.font.name = 'Times New Roman'
            cr.font.size = Pt(11)
            if r_idx == 0:
                set_cell_shading(cell, "E2E8F0")
                cr.font.bold = True

    # =============================================================
    # 8. LIST OF ABBREVIATIONS
    # =============================================================
    doc.add_page_break()

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(18)
    r = p.add_run("LIST OF ABBREVIATIONS")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True

    abbrev_list = [
        ("S.No.", "Abbreviation", "Full Form"),
        ("1", "AI", "Artificial Intelligence"),
        ("2", "API", "Application Programming Interface"),
        ("3", "CAD", "Computer-Aided Dispatch"),
        ("4", "CORS", "Cross-Origin Resource Sharing"),
        ("5", "CSP", "Content Security Policy"),
        ("6", "CSV", "Comma-Separated Values"),
        ("7", "DFD", "Data Flow Diagram"),
        ("8", "DOM", "Document Object Model"),
        ("9", "ERD", "Entity-Relationship Diagram"),
        ("10", "FCP", "First Contentful Paint"),
        ("11", "GIS", "Geographic Information System"),
        ("12", "GPS", "Global Positioning System"),
        ("13", "GUI", "Graphical User Interface"),
        ("14", "HMR", "Hot Module Replacement"),
        ("15", "HTTP", "Hypertext Transfer Protocol"),
        ("16", "JWT", "JSON Web Token"),
        ("17", "KDE", "Kernel Density Estimation"),
        ("18", "NoSQL", "Not Only Structured Query Language"),
        ("19", "RBAC", "Role-Based Access Control"),
        ("20", "REST", "Representational State Transfer"),
        ("21", "SPA", "Single-Page Application"),
        ("22", "TLS", "Transport Layer Security"),
        ("23", "UI / UX", "User Interface / User Experience"),
        ("24", "WSS", "WebSocket Secure Protocol")
    ]

    tbl_a = doc.add_table(rows=len(abbrev_list), cols=3)
    tbl_a.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_a)
    set_cell_padding(tbl_a, top=60, bottom=60, left=100, right=100)

    for r_idx, (sno, ab, full) in enumerate(abbrev_list):
        row = tbl_a.rows[r_idx]
        for c_idx, val in enumerate([sno, ab, full]):
            cell = row.cells[c_idx]
            cp = cell.paragraphs[0]
            cp.paragraph_format.space_after = Pt(2)
            if c_idx == 0:
                cell.width = Inches(0.8)
                cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
            elif c_idx == 1:
                cell.width = Inches(1.8)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            else:
                cell.width = Inches(3.8)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT

            cr = cp.add_run(val)
            cr.font.name = 'Times New Roman'
            cr.font.size = Pt(10.5)
            if r_idx == 0:
                set_cell_shading(cell, "E2E8F0")
                cr.font.bold = True

    # =============================================================
    # CHAPTER 1: INTRODUCTION
    # =============================================================
    add_chapter_title("1", "Introduction")

    add_h1("1.1 Crime Nova – Overview")
    add_body(
        "Crime Nova is an AI-powered, cloud-native crime intelligence, spatial visualization, "
        "and emergency response platform engineered to modernize public safety and law enforcement coordination. "
        "Historically, municipal crime records, police first information reports (FIRs), and public safety advisories "
        "have existed in siloed repositories accessible only to internal administrative personnel. Citizens moving through "
        "urban environments have had no interactive mechanism to gauge neighborhood vulnerability, analyze crime trends, "
        "or dispatch high-precision GPS distress signals during imminent danger."
    )
    add_body(
        "Crime Nova bridges this critical gap by synthesizing geospatial heatmaps, machine learning predictive analytics, "
        "an instant one-tap emergency SOS pipeline, and administrative dispatch oversight into a high-performance web "
        "application. By leveraging React 19, Leaflet geospatial mapping, Chart.js analytics, and Google Firebase cloud services, "
        "the platform empowers citizens with situational awareness while equipping law enforcement authorities with proactive "
        "hotspot intelligence and accelerated emergency triage capabilities."
    )

    add_fig_image(os.path.join(fig_dir, "fig1_1_system_overview.png"),
                  "Figure 1.1: Crime Nova System Ecosystem and User Interaction Overview")

    add_h1("1.2 Problem Definition")
    add_body(
        "Contemporary public safety frameworks suffer from three severe technical and operational deficiencies:\n"
        "1. Information Asymmetry: Crime statistics published by government agencies (such as the National Crime Records "
        "Bureau - NCRB) are released as retrospective annual PDFs with significant reporting delays. Citizens lack access to "
        "real-time, interactive geospatial representations of local crime patterns when planning travel routes or residential relocation.\n"
        "2. High-Latency Distress Mechanisms: Traditional emergency calling services (dialing 100 or 112) require verbal communication "
        "of current location, landmark description, and nature of the emergency. Under acute physical distress, harassment, or burglary, "
        "victims are often unable to speak or accurately articulate geographic coordinates, resulting in fatal dispatch delays.\n"
        "3. Fragmented Administrative Triage: Law enforcement agencies frequently manage emergency calls, patrol scheduling, and crime data "
        "ingestion across disconnected software solutions, preventing real-time spatial correlation of distress alerts with historical hotspots."
    )

    add_h1("1.3 Motivation")
    add_body(
        "The rapid expansion of metropolitan cities in India has brought a corresponding rise in urban crime complexities, ranging from theft "
        "and robbery to violent assault and cybercrime. Concurrently, ubiquitous smartphone connectivity and modern browser standards (such as "
        "the W3C Geolocation API, WebGL, and HTML5 Canvas) provide an unprecedented technical opportunity to decentralize public safety. "
        "The primary motivation behind Crime Nova is to leverage modern cloud-native architectures and artificial intelligence to transform public "
        "safety from a reactive, post-incident bureaucracy into a proactive, transparent, and predictive digital ecosystem. Providing ordinary citizens "
        "with instant spatial risk visibility and a one-click lifeline fundamentally democratizes community safety."
    )

    add_h1("1.4 Objectives")
    add_body("The core engineering and operational objectives fulfilled by Crime Nova are:")
    add_bullet("Develop an interactive, client-side geospatial heatmap using Leaflet and HTML5 Canvas that clusters crime incidents by severity (high, medium, low) and allows dynamic type filtering across major cities.")
    add_bullet("Build a statistical analytics dashboard utilizing Chart.js to visualize crime category distributions, monthly temporal trends, and area-level incident densities.")
    add_bullet("Implement an AI-driven predictive risk scoring engine that computes neighborhood vulnerability ratings, forecasts peak danger hours, and correlates day-of-week risk patterns.")
    add_bullet("Engineer a high-precision, one-tap Emergency SOS dispatch module leveraging browser GPS geolocation, automated distress ticket generation in Cloud Firestore, and direct integration with national emergency hotlines.")
    add_bullet("Provide an Administrative Control Center enabling emergency dispatchers to monitor incoming SOS alerts in real time, transition operational ticket states (Active, Responded, Resolved), and ingest external dataset CSVs.")
    add_bullet("Ensure sub-second page performance, robust client-side routing, and stateless security enforcement using Google Firebase Authentication and Cloud Firestore Security Rules.")

    add_h1("1.5 Scope of the Project")
    add_body(
        "Crime Nova encompasses citizen-facing situational intelligence, real-time emergency dispatching, and administrative governance. "
        "The current scope covers simulated and historical crime datasets across major Indian metropolitan centers (Delhi, Mumbai, Bangalore, "
        "Kolkata, Chennai, Hyderabad, Jaipur, Lucknow, Pune). The emergency dispatch subsystem integrates simulated automated responder "
        "acknowledgments and direct telephony links to emergency dialers (100, 108, 101, 1091). The administrative tier accommodates dataset CSV "
        "ingestion and live SOS status updates. Out of current scope are hardware-based physical panic buttons, drone fleet control, and direct "
        "integration with municipal police Computer-Aided Dispatch (CAD) mainframes, which represent future roadmap horizons."
    )

    add_h1("1.6 Hardware and Software Requirements")
    add_body("Table 1.1 specifies the operational hardware and software prerequisites for deploying and running Crime Nova.")

    hw_sw_data = [
        ("Category", "Component", "Requirement Specification"),
        ("Hardware", "Client Processor", "Intel Core i3 / AMD Ryzen 3 or higher (Dual-Core 2.0 GHz+)"),
        ("Hardware", "Client Memory (RAM)", "4 GB RAM minimum (8 GB recommended for heavy spatial canvas rendering)"),
        ("Hardware", "Client Network", "Broadband or 4G/5G mobile connection (minimum 2 Mbps download/upload)"),
        ("Hardware", "GPS Receiver", "Integrated GPS / A-GPS hardware or IP-based network location provider"),
        ("Software", "Operating System", "Windows 10/11, macOS Monterey+, Ubuntu 20.04+, Android 11+, or iOS 15+"),
        ("Software", "Web Browser", "Google Chrome 110+, Mozilla Firefox 110+, Microsoft Edge 110+, Safari 16+"),
        ("Software", "Frontend Runtime", "Node.js 20+ LTS with Vite 8.0 build engine"),
        ("Software", "Frontend Framework", "React 19.2, React-DOM 19.2, React Router DOM 7.1"),
        ("Software", "Geospatial Engine", "Leaflet 1.9, React-Leaflet 5.0 with HTML5 Canvas radial gradient overlays"),
        ("Software", "Analytics Engine", "Chart.js 4.5 with React-Chartjs-2 5.3"),
        ("Software", "Cloud Backend", "Google Firebase 12.19 (Authentication, Cloud Firestore, Cloud Storage, Functions)"),
        ("Software", "Iconography", "Lucide React 0.577 SVG icon suite")
    ]

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("Table 1.1: Hardware and Software Requirements Specification")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r.font.bold = True

    tbl_hw = doc.add_table(rows=len(hw_sw_data), cols=3)
    tbl_hw.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_hw)
    set_cell_padding(tbl_hw, top=70, bottom=70, left=100, right=100)

    for r_idx, (cat, comp, spec) in enumerate(hw_sw_data):
        row = tbl_hw.rows[r_idx]
        for c_idx, val in enumerate([cat, comp, spec]):
            cell = row.cells[c_idx]
            cp = cell.paragraphs[0]
            cp.paragraph_format.space_after = Pt(2)
            if c_idx == 0:
                cell.width = Inches(1.2)
                cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
            elif c_idx == 1:
                cell.width = Inches(1.8)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            else:
                cell.width = Inches(3.4)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT

            cr = cp.add_run(val)
            cr.font.name = 'Times New Roman'
            cr.font.size = Pt(10)
            if r_idx == 0:
                set_cell_shading(cell, "E2E8F0")
                cr.font.bold = True

    # =============================================================
    # CHAPTER 2: LITERATURE SURVEY
    # =============================================================
    add_chapter_title("2", "Literature Survey")

    add_h1("2.1 Review of Existing Crime Reporting & Mapping Systems")
    add_body(
        "A rigorous investigation into existing public safety frameworks reveals substantial gaps between available technological "
        "capabilities and practical citizen experiences. Traditional government systems, such as India's Crime and Criminal Tracking Network "
        "& Systems (CCTNS), were established primarily to interconnect police stations across states. While CCTNS maintains exhaustive FIR "
        "databases, its portal remains strictly administrative, offering zero real-time spatial heatmaps or citizen-centric predictive tools."
    )
    add_body(
        "Commercial solutions in Western markets, such as Citizen (formerly Vigilante) and SpotCrime, aggregate 911 police radio transmissions "
        "and user-submitted incident clips. Although these applications provide localized crime notifications, they suffer from uncontrolled "
        "crowdsourced panic, lack verified institutional responder dispatching, and fail to provide predictive peak-hour modeling. Furthermore, "
        "these proprietary solutions are geographically restricted to specific US metropolitan regions and rely on closed commercial infrastructures."
    )
    add_body(
        "Emergency hotline services (dialing 100 or national emergency number 112) represent the standard primary response mechanism in India. "
        "However, these telephone-centric systems rely exclusively on voice dispatchers. In situations involving violent crime, domestic violence, "
        "or burglary in progress, victims are frequently prevented from speaking openly. Verbal coordinate description introduces critical errors, "
        "frequently delaying emergency arrival by several vital minutes."
    )

    add_h1("2.2 Advantages, Disadvantages, and Limitations of Existing Systems")
    add_body(
        "Table 2.1 presents a comparative matrix contrasting traditional public safety solutions against Crime Nova across essential functional dimensions."
    )

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("Table 2.1: Comparative Analysis: Traditional Reporting vs Crime Nova")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r.font.bold = True

    comp_data = [
        ("Feature Dimension", "Traditional Police FIR / Hotlines", "Commercial Apps (Citizen / SpotCrime)", "Crime Nova Proposed Platform"),
        ("Spatial Crime Heatmap", "None; annual static PDFs", "Basic pin markers; limited filtering", "Dynamic radial canvas heatmaps with severity & category filters"),
        ("Incident Reporting", "Physical visit or complex portal", "Unmoderated crowdsourced clips", "Validated incident records with dataset ingestion engine"),
        ("Emergency SOS Dispatch", "Voice telephony (100 / 112)", "Optional 911 call forwarding", "1-Tap GPS capture, live ticket creation, hotline quick dial"),
        ("Predictive AI Modeling", "None; retrospective only", "Basic frequency statistics", "Multi-factor ML risk scoring, peak hours, weekly pattern modeling"),
        ("Analytics Visualizer", "Tabular statutory summaries", "Limited historical charts", "Interactive Chart.js bar, doughnut, and temporal trend visualizers"),
        ("Administrative Control", "Legacy siloed mainframes", "Proprietary internal consoles", "Unified Operations Center with real-time status management & CSV upload"),
        ("Cloud Synchronization", "Batch server synchronization", "High-latency poll-based updates", "Sub-second real-time Cloud Firestore WebSocket subscriptions")
    ]

    tbl_comp = doc.add_table(rows=len(comp_data), cols=4)
    tbl_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_comp)
    set_cell_padding(tbl_comp, top=70, bottom=70, left=90, right=90)

    for r_idx, (f_dim, trad, comm, nova) in enumerate(comp_data):
        row = tbl_comp.rows[r_idx]
        for c_idx, val in enumerate([f_dim, trad, comm, nova]):
            cell = row.cells[c_idx]
            cp = cell.paragraphs[0]
            cp.paragraph_format.space_after = Pt(2)
            if c_idx == 0:
                cell.width = Inches(1.5)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            elif c_idx == 1:
                cell.width = Inches(1.6)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            elif c_idx == 2:
                cell.width = Inches(1.6)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            else:
                cell.width = Inches(1.7)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT

            cr = cp.add_run(val)
            cr.font.name = 'Times New Roman'
            cr.font.size = Pt(9.5)
            if r_idx == 0:
                set_cell_shading(cell, "E2E8F0")
                cr.font.bold = True

    add_h1("2.3 Background Technologies and Proposed System Analysis")

    add_h2("2.3.1 React 19 and Single-Page Architecture")
    add_body(
        "React 19 serves as the foundation of Crime Nova's user interface. Built upon a component-driven declarative paradigm, "
        "React utilizes an in-memory Virtual DOM to calculate minimal diffs, guaranteeing flicker-free rendering across heavy data-bound pages. "
        "The adoption of React hooks (useState, useEffect, useRef, useContext, useMemo) ensures fine-grained state management across the "
        "authentication provider, live map coordinate stores, and filter states."
    )

    add_h2("2.3.2 Vite Next-Generation Tooling")
    add_body(
        "Vite replaces legacy Webpack bundlers, delivering instantaneous dev-server cold starts via native browser ES Modules (ESM) and "
        "sub-second Hot Module Replacement (HMR). Production compilation leverages Rollup and Oxc/SWC to output highly optimized, tree-shaken "
        "JavaScript bundles and CSS chunks, achieving sub-second First Contentful Paint (FCP) metrics."
    )

    add_h2("2.3.3 Leaflet.js and Geospatial Canvas Rendering")
    add_body(
        "Leaflet 1.9, integrated via React-Leaflet 5.0, powers the interactive mapping interface. To circumvent DOM performance bottlenecks "
        "associated with rendering hundreds of individual SVG marker nodes, Crime Nova employs an innovative custom HTML5 Canvas overlay. "
        "This overlay executes hardware-accelerated 2D radial gradient computations across geographic coordinates, dynamically scaling heatmap "
        "density radiuses during map pan and zoom transitions."
    )

    add_h2("2.3.4 Chart.js and Data Visualization")
    add_body(
        "Chart.js 4.5 and React-Chartjs-2 provide responsive, canvas-rendered statistical visualizations. Custom themes adapt typography to "
        "Inter and Times New Roman, implementing dark-mode palettes, smooth cubic bezier line curves, and custom HTML tooltips displaying "
        "exact incident counts and risk metrics."
    )

    add_h2("2.3.5 Google Firebase Cloud Platform (Auth, Firestore, Functions)")
    add_body(
        "Google Firebase provides the serverless cloud infrastructure for Crime Nova:\n"
        "• Firebase Authentication: Manages secure citizen and administrator identity sessions via stateless JSON Web Tokens (JWT) "
        "and Google OAuth 2.0 federation.\n"
        "• Cloud Firestore: A flexible, horizontally scalable NoSQL document database that maintains persistent real-time listeners "
        "(onSnapshot) over WebSocket Secure (WSS) connections, delivering sub-100ms updates when new SOS alerts or incidents are logged.\n"
        "• Cloud Storage & Functions: Hosts ingested bulk CSV datasets and triggers background event handlers for spatial clustering "
        "and automated responder notifications."
    )

    # =============================================================
    # CHAPTER 3: METHODOLOGY
    # =============================================================
    add_chapter_title("3", "Methodology")

    add_h1("3.1 Existing Methodology & Identified Shortcomings")
    add_body(
        "The conventional crime reporting workflow operates along a highly linear, manual, and reactive pathway:\n"
        "1. Occurrence of Crime: A citizen experiences or observes an unlawful incident.\n"
        "2. Physical Station Visit / Emergency Call: The victim places a voice telephone call to emergency dispatch or physically travels "
        "to the local police station to submit a written First Information Report (FIR).\n"
        "3. Manual Logging & Jurisdictional Triage: Station desk officers manually log the complaint onto physical registers or disconnected "
        "intranet terminals, often disputing territorial jurisdiction.\n"
        "4. Delayed Responder Dispatch: Verbal instructions are relayed to patrol vans over analogue radio frequencies with significant latency.\n"
        "5. Retrospective Annual Aggregation: Months or years later, incidents are tabulated into municipal and national crime statistics reports."
    )
    add_body(
        "This outdated methodology exhibits catastrophic points of failure: victims under direct threat cannot speak safely; geographic precision "
        "is lost in translation; citizens receive zero real-time spatial warning of nearby criminal activity; and law enforcement lacks dynamic "
        "predictive modeling tools."
    )

    add_h1("3.2 Proposed Agile Methodology & Multi-Phase Pipeline")
    add_body(
        "To engineer a resilient, scalable, and intuitive system, Crime Nova was developed following an Agile engineering methodology "
        "divided into seven interconnected phases. Table 3.1 outlines the phase objectives, implementation activities, and resulting deliverables."
    )

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("Table 3.1: Methodology Phase Breakdown, Objectives, and Technical Artifacts")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r.font.bold = True

    phases_data = [
        ("Phase", "Phase Name", "Core Technical Objectives", "Key Deliverables"),
        ("1", "Requirements & Threat Modeling", "Define user personas, use cases, security boundaries, and data schemas", "Functional requirement specifications, data dictionary, threat matrix"),
        ("2", "Authentication & RBAC", "Implement secure JWT and Google OAuth 2.0 flows with role authorization", "AuthContext provider, Firebase Auth integration, role guards"),
        ("3", "Geospatial Heatmap Engine", "Build interactive map with severity clustering and HTML5 Canvas radial heatmaps", "CrimeMapPage, Leaflet heat canvas overlay, spatial filters"),
        ("4", "Predictive Analytics Engine", "Synthesize statistical charts and machine learning crime risk forecasting models", "DashboardPage, PredictionPage, Chart.js visualizer components"),
        ("5", "Emergency SOS Dispatcher", "Integrate HTML5 Geolocation, automated Firestore ticket creation, and timer", "SOSPage, GPS reverse-geocoder, emergency dialer actions"),
        ("6", "Admin Operations Center", "Construct real-time dispatch queue, status toggles, and dataset CSV uploader", "AdminPage, active ticket management grid, CSV parsing pipeline"),
        ("7", "Deployment & Verification", "Execute production bundling, cross-browser audits, and security rule tests", "Optimized Vite production bundle, zero-defect verification matrix")
    ]

    tbl_ph = doc.add_table(rows=len(phases_data), cols=4)
    tbl_ph.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_ph)
    set_cell_padding(tbl_ph, top=70, bottom=70, left=90, right=90)

    for r_idx, (p_no, p_name, obj, deliv) in enumerate(phases_data):
        row = tbl_ph.rows[r_idx]
        for c_idx, val in enumerate([p_no, p_name, obj, deliv]):
            cell = row.cells[c_idx]
            cp = cell.paragraphs[0]
            cp.paragraph_format.space_after = Pt(2)
            if c_idx == 0:
                cell.width = Inches(0.6)
                cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
            elif c_idx == 1:
                cell.width = Inches(1.8)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            elif c_idx == 2:
                cell.width = Inches(2.3)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            else:
                cell.width = Inches(1.7)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT

            cr = cp.add_run(val)
            cr.font.name = 'Times New Roman'
            cr.font.size = Pt(9.5)
            if r_idx == 0:
                set_cell_shading(cell, "E2E8F0")
                cr.font.bold = True

    add_h2("3.2.1 Phase 1 – Requirements Engineering & Threat Modeling")
    add_body(
        "User personas were formally defined: (1) General Public / Citizens requiring situational awareness and distress capabilities; "
        "(2) Law Enforcement / First Responders requiring prioritized dispatch feeds and predictive patrol routes; and (3) System Administrators "
        "governing data integrity and user access. Threat modeling ensured that citizen location telemetry is transmitted exclusively over encrypted "
        "HTTPS/TLS channels with strict Firestore row-level security constraints."
    )

    add_h2("3.2.2 Phase 2 – Authentication and Role-Based Access Control (RBAC)")
    add_body(
        "The platform implements dual-mode authentication via Firebase Auth, supporting email/password registration with SHA-256/bcrypt hashing "
        "and Google OAuth 2.0 federated sign-in. Table 3.2 details the role permissions and security controls governing Crime Nova."
    )

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("Table 3.2: User Roles, Access Capabilities, and RBAC Security Controls")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r.font.bold = True

    roles_data = [
        ("User Role", "Authentication Requirement", "Accessible Application Modules", "Data Permissions & Security Constraints"),
        ("Guest / Public", "Unauthenticated / Anonymous", "Landing Page, Crime Heatmap (view only)", "Read-only access to public crime aggregates; no SOS dispatch"),
        ("Citizen User", "Email/Password or Google OAuth", "Heatmap, Analytics, Prediction, 1-Tap SOS", "Read all crime data; create own SOS tickets; manage profile"),
        ("Police / Responder", "Verified Officer Credentials", "Heatmap, Analytics, Prediction, SOS Dispatch Queue", "Read citizen SOS tickets; update response states; view risk alerts"),
        ("Administrator", "Privileged Admin Role Token", "Full Platform, Admin Operations, CSV Uploader", "Full read/write/delete; manage dataset CSV ingestion; audit logs")
    ]

    tbl_r = doc.add_table(rows=len(roles_data), cols=4)
    tbl_r.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_r)
    set_cell_padding(tbl_r, top=70, bottom=70, left=90, right=90)

    for r_idx, (role, auth_req, mods, perms) in enumerate(roles_data):
        row = tbl_r.rows[r_idx]
        for c_idx, val in enumerate([role, auth_req, mods, perms]):
            cell = row.cells[c_idx]
            cp = cell.paragraphs[0]
            cp.paragraph_format.space_after = Pt(2)
            if c_idx == 0:
                cell.width = Inches(1.2)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            elif c_idx == 1:
                cell.width = Inches(1.8)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            elif c_idx == 2:
                cell.width = Inches(1.7)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            else:
                cell.width = Inches(1.7)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT

            cr = cp.add_run(val)
            cr.font.name = 'Times New Roman'
            cr.font.size = Pt(9.5)
            if r_idx == 0:
                set_cell_shading(cell, "E2E8F0")
                cr.font.bold = True

    add_h2("3.2.3 Phase 3 – Geospatial Crime Mapping & Radius Clustering")
    add_body(
        "The spatial mapping engine integrates OpenStreetMap tile servers with Leaflet.js. To deliver instantaneous visual identification "
        "of high-risk urban sectors, geographic points are rendered using a layered architecture: Leaflet CircleMarkers pinpoint precise "
        "incident coordinates with interactive popups displaying crime type, date, time, and locality; simultaneously, an HTML5 Canvas "
        "interceptor evaluates point cluster density and paints dynamic radial gradients with color-coded severity bands "
        "(Red: High, Amber: Medium, Green: Low)."
    )

    add_h2("3.2.4 Phase 4 – Statistical Analytics & Predictive Machine Learning")
    add_body(
        "The analytics module calculates multi-dimensional aggregations over the incident dataset. In parallel, a simulated predictive "
        "machine learning engine models temporal crime risk by evaluating historical hour-of-day frequencies, day-of-week surges, and "
        "spatial hotspot vulnerability indices. Areas with risk scores exceeding 80 are flagged with escalating danger badges, enabling "
        "proactive law enforcement deployment."
    )

    add_h2("3.2.5 Phase 5 – One-Tap Emergency SOS Dispatch Pipeline")
    add_body(
        "The Emergency SOS subsystem interacts directly with the browser's W3C Geolocation API. Upon tapping the emergency button, the system "
        "retrieves high-accuracy GPS coordinates (latitude, longitude, accuracy radius), generates a timestamped distress record in Cloud Firestore, "
        "initiates an active response counter, and displays immediate one-click telephony links for Police, Ambulance, Fire, and Women Helplines."
    )

    add_h2("3.2.6 Phase 6 – Administrative Governance & Dataset Ingestion")
    add_body(
        "The Admin Operations Center provides an interactive triage board where emergency personnel review incoming distress tickets, "
        "inspect victim details and mapped locations, and toggle operational status flags (Active -> Responded -> Resolved). An integrated "
        "dataset management module allows administrators to upload standard CSV datasets to update citywide incident repositories."
    )

    add_h2("3.2.7 Phase 7 – System Hardening, Testing, and Deployment")
    add_body(
        "The application underwent end-to-end testing across modern browsers, verifying bundle minification, responsive CSS layout flexibility, "
        "sub-second FCP performance, and error boundary resilience. Production builds were verified through Vite Rollup packaging."
    )

    # =============================================================
    # CHAPTER 4: SYSTEM DESIGN AND DIAGRAMS
    # =============================================================
    add_chapter_title("4", "System Design and Diagrams")

    add_h1("4.1 Data Flow Diagrams (DFD)")
    add_body(
        "Data Flow Diagrams model the flow of information through Crime Nova, detailing how external actors interact with core processes "
        "and data stores."
    )

    add_h2("4.1.1 Level 0 DFD – Context Diagram")
    add_body(
        "The Level 0 Context Diagram depicts Crime Nova as a centralized system interacting with four external entities: "
        "Citizens / Public Users, Law Enforcement / Police, System Administrators, and Emergency Dispatch Services (CAD). "
        "Citizens provide SOS distress coordinates and query safety heatmaps; Police receive predictive hotspot advisories and live alerts; "
        "Administrators manage dataset CSVs and audit logs; and Emergency Services receive automated distress signals."
    )
    add_fig_image(os.path.join(fig_dir, "fig4_1_dfd_level0.png"),
                  "Figure 4.1: Level 0 Data Flow Diagram (DFD) – Platform Context Model")

    add_h2("4.1.2 Level 1 DFD – Subsystem Process Decomposition")
    add_body(
        "The Level 1 DFD decomposes Crime Nova into six primary operational processes:\n"
        "• Process 1.0 (Authentication & Authorization): Validates credentials against Firestore user profiles.\n"
        "• Process 2.0 (Geospatial Crime Mapping Engine): Reads crime records from Store D2 and renders radial heatmaps.\n"
        "• Process 3.0 (Analytics & Trend Visualizer): Generates category distributions and monthly trend charts.\n"
        "• Process 4.0 (Emergency SOS Dispatcher): Ingests live GPS telemetry and logs distress alerts into Store D3.\n"
        "• Process 5.0 (ML Hotspot & Risk Prediction): Computes neighborhood risk ratings and peak crime hours.\n"
        "• Process 6.0 (Incident & Dataset Administration): Updates alert triage statuses and parses ingested CSVs."
    )
    add_fig_image(os.path.join(fig_dir, "fig4_2_dfd_level1.png"),
                  "Figure 4.2: Level 1 Data Flow Diagram (DFD) – Subsystem Process Decomposition")

    add_h1("4.2 Multi-Tier Cloud Architecture")
    add_body(
        "Crime Nova implements a decoupled three-tier cloud architecture ensuring high availability, sub-second latency, and horizontal scalability:\n"
        "1. Presentation Tier (Client SPA): Built with React 19 and Vite, rendering interactive Leaflet maps, Chart.js visualizers, and glassmorphic UI components.\n"
        "2. Application & Cloud Services Tier: Firebase Authentication handles stateless token validation; Cloud Functions orchestrate spatial clustering and event triggers; HTML5 Geolocation provides hardware-level GPS coordinates.\n"
        "3. Data & Persistence Tier: Google Cloud Firestore manages real-time NoSQL collections with sub-second WebSocket push notifications; Cloud Storage persists bulk dataset files; Firestore Security Rules enforce strict access controls."
    )
    add_fig_image(os.path.join(fig_dir, "fig4_3_system_architecture.png"),
                  "Figure 4.3: Crime Nova Production Multi-Tier Cloud Architecture")

    add_h1("4.3 Use Case Modeling")
    add_body(
        "Figure 4.4 models user interactions across Citizen and Administrative personas. Citizens execute use cases including UC-01 (View Heatmap "
        "& Filter Crimes), UC-02 (Inspect Analytics & Charts), UC-03 (Query Predicted Peak Hours), UC-04 (Trigger 1-Tap Emergency SOS), and "
        "UC-05 (Register / Login). Administrators and Police Dispatchers execute UC-06 (Dispatch & Resolve SOS Tickets), UC-07 (Ingest Dataset CSV), "
        "and UC-08 (Audit Incident Records)."
    )
    add_fig_image(os.path.join(fig_dir, "fig4_4_use_case_diagram.png"),
                  "Figure 4.4: Citizen and Law Enforcement Use Case Operational Model")

    add_h1("4.4 Entity-Relationship Modeling & Cloud Firestore Schema")
    add_body(
        "The data layer is modeled around six core document collections in Google Cloud Firestore:\n"
        "• USERS: Stores user identifier (uid), display name, email, role, phone number, and emergency contact details.\n"
        "• CRIMES: Records incident identifier, crime category (Theft, Robbery, Assault, Cybercrime, Fraud, Vandalism), severity rating (high, medium, low), geographic latitude/longitude, urban locality, and incident timestamp.\n"
        "• SOS_ALERTS: Captures active distress tickets, victim identity, GPS coordinates, dispatch status (active, responded, resolved), assigned responder type, and trigger timestamp.\n"
        "• PREDICTIONS: Caches ML risk scores, dominant crime classifications, predicted incident volumes, and multi-week trend trajectories.\n"
        "• HOTSPOTS: Defines geospatial boundary centroids, risk indices, and peak vulnerability hour windows.\n"
        "• AUDIT_LOGS: Maintains immutable timestamps of administrative actions, dataset uploads, and emergency status changes."
    )
    add_fig_image(os.path.join(fig_dir, "fig4_6_erd_diagram.png"),
                  "Figure 4.5: Entity-Relationship Diagram & Cloud Firestore Document Schema")

    add_h1("4.5 Behavioral Modeling – Emergency SOS Sequence Flow")
    add_body(
        "Figure 4.6 illustrates the chronological sequence of interactions executing during an Emergency SOS trigger. "
        "When a citizen presses the SOS button, the client initiates a high-accuracy GPS query to the browser Geolocation API. "
        "Upon receiving latitude, longitude, and accuracy radius, the client creates a new SOS document in Cloud Firestore. "
        "A Cloud Function triggers instantly, broadcasting the distress ticket to the Administrative Dispatch Console via real-time WebSocket "
        "subscriptions. The client simultaneously initiates an active response timer and provides direct hotline dialer access."
    )
    add_fig_image(os.path.join(fig_dir, "fig4_7_sequence_sos.png"),
                  "Figure 4.6: Emergency SOS Alert and Real-Time Geolocation Dispatch Sequence")

    # =============================================================
    # CHAPTER 5: IMPLEMENTATION
    # =============================================================
    add_chapter_title("5", "Implementation")

    add_h1("5.1 System Module Descriptions")
    add_body(
        "Crime Nova's codebase is structured into modular frontend pages, shared contexts, and cloud services. "
        "Table 5.1 outlines the technological composition and functional role of each major system module."
    )

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("Table 5.1: Crime Nova System Architecture Modules and Technology Stack")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r.font.bold = True

    mod_data = [
        ("Module Name", "Primary Technologies", "Functional Scope and Core Responsibilities"),
        ("Authentication Module", "Firebase Auth, JWT, Google OAuth 2.0", "Manages user registration, session tokens, password resets, and role state propagation"),
        ("Geospatial Heatmap Engine", "Leaflet, React-Leaflet, HTML5 Canvas", "Renders interactive maps, city markers, popups, and multi-tier radial density heatmaps"),
        ("Analytics Dashboard", "Chart.js, React-Chartjs-2, CSS Grid", "Visualizes crime category distributions, monthly comparative trends, and city metrics"),
        ("AI Crime Prediction Engine", "React 19, Spatio-Temporal Regression", "Forecasts neighborhood risk scores, identifies high-risk peak hours, models weekly surges"),
        ("Emergency SOS Dispatcher", "W3C Geolocation API, Cloud Firestore", "Captures live GPS coordinates, writes distress tickets, tracks response timer, links hotlines"),
        ("Admin Operations Portal", "Cloud Firestore Listeners, HTML5 File API", "Provides live SOS triage grid, status dispatch controls, crime data explorer, CSV uploader"),
        ("Cloud Persistence Layer", "Google Cloud Firestore, Cloud Storage", "Provides distributed NoSQL storage, real-time WebSocket subscriptions, security rules")
    ]

    tbl_m = doc.add_table(rows=len(mod_data), cols=3)
    tbl_m.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_m)
    set_cell_padding(tbl_m, top=70, bottom=70, left=90, right=90)

    for r_idx, (m_name, tech, scope) in enumerate(mod_data):
        row = tbl_m.rows[r_idx]
        for c_idx, val in enumerate([m_name, tech, scope]):
            cell = row.cells[c_idx]
            cp = cell.paragraphs[0]
            cp.paragraph_format.space_after = Pt(2)
            if c_idx == 0:
                cell.width = Inches(1.8)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            elif c_idx == 1:
                cell.width = Inches(1.8)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            else:
                cell.width = Inches(2.8)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT

            cr = cp.add_run(val)
            cr.font.name = 'Times New Roman'
            cr.font.size = Pt(9.5)
            if r_idx == 0:
                set_cell_shading(cell, "E2E8F0")
                cr.font.bold = True

    add_fig_image(os.path.join(fig_dir, "fig5_1_prediction_pipeline.png"),
                  "Figure 5.1: Machine Learning Spatio-Temporal Crime Risk Prediction Pipeline")

    add_h1("5.2 Pseudo Code of Core Modules")

    add_h2("5.2.1 User Authentication and Session Token Validation")
    code_auth = (
        "FUNCTION AuthenticateUser(email, password, authProvider):\n"
        "    IF authProvider == 'google':\n"
        "        credential = AWAIT signInWithPopup(firebaseAuth, googleProvider)\n"
        "    ELSE:\n"
        "        credential = AWAIT signInWithEmailAndPassword(firebaseAuth, email, password)\n"
        "    END IF\n"
        "    \n"
        "    userRecord = AWAIT firestore.collection('users').doc(credential.user.uid).get()\n"
        "    IF NOT userRecord.exists():\n"
        "        userProfile = CreateUserProfile(credential.user, defaultRole='user')\n"
        "        AWAIT firestore.collection('users').doc(credential.user.uid).set(userProfile)\n"
        "    ELSE:\n"
        "        userProfile = userRecord.data()\n"
        "    END IF\n"
        "    \n"
        "    sessionToken = AWAIT credential.user.getIdToken()\n"
        "    UpdateAuthContext(userProfile, sessionToken)\n"
        "    RETURN userProfile\n"
        "END FUNCTION"
    )
    add_body(code_auth)

    add_h2("5.2.2 Emergency SOS Trigger and GPS Coordinate Ingestion")
    code_sos = (
        "FUNCTION TriggerEmergencySOS(currentUser):\n"
        "    IF NOT navigator.geolocation:\n"
        "        RETURN Error('Geolocation is not supported by this browser')\n"
        "    END IF\n"
        "    \n"
        "    SetStatus('locating')\n"
        "    navigator.geolocation.getCurrentPosition(\n"
        "        ON_SUCCESS: FUNCTION(position):\n"
        "            gpsData = {\n"
        "                lat: position.coords.latitude,\n"
        "                lng: position.coords.longitude,\n"
        "                accuracy: position.coords.accuracy\n"
        "            }\n"
        "            SetStatus('sending')\n"
        "            \n"
        "            alertDocument = {\n"
        "                alertId: GenerateUUID(),\n"
        "                userId: currentUser ? currentUser.uid : 'anonymous',\n"
        "                victimName: currentUser ? currentUser.displayName : 'Distressed Citizen',\n"
        "                phone: currentUser ? currentUser.phone : 'Not Specified',\n"
        "                lat: gpsData.lat,\n"
        "                lng: gpsData.lng,\n"
        "                accuracyMeters: gpsData.accuracy,\n"
        "                status: 'active',\n"
        "                responderType: 'Police',\n"
        "                triggeredAt: Firestore.Timestamp.now()\n"
        "            }\n"
        "            \n"
        "            AWAIT firestore.collection('sos_alerts').add(alertDocument)\n"
        "            SetStatus('sent')\n"
        "            StartLiveEmergencyTimer()\n"
        "        END FUNCTION,\n"
        "        ON_ERROR: FUNCTION(err):\n"
        "            SetStatus('error')\n"
        "            RETURN Error('Unable to retrieve GPS coordinates. Please enable device location.')\n"
        "        END FUNCTION,\n"
        "        OPTIONS: { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }\n"
        "    )\n"
        "END FUNCTION"
    )
    add_body(code_sos)

    add_h2("5.2.3 Canvas-Based Geospatial Heatmap Radius Computation")
    code_heat = (
        "FUNCTION DrawHeatOverlay(canvas, mapInstance, crimeLocations):\n"
        "    ctx = canvas.getContext('2d')\n"
        "    canvas.width = mapInstance.getContainer().offsetWidth\n"
        "    canvas.height = mapInstance.getContainer().offsetHeight\n"
        "    ctx.clearRect(0, 0, canvas.width, canvas.height)\n"
        "    \n"
        "    FOR EACH incident IN crimeLocations DO:\n"
        "        pixelCoord = mapInstance.latLngToContainerPoint([incident.lat, incident.lng])\n"
        "        radius = MAX(30, incident.count * 1.5)\n"
        "        \n"
        "        IF incident.severity == 'high':\n"
        "            rgb = '239, 68, 68'      // Vibrant Red\n"
        "        ELSE IF incident.severity == 'medium':\n"
        "            rgb = '245, 158, 11'     // Vibrant Amber\n"
        "        ELSE:\n"
        "            rgb = '34, 197, 94'      // Vibrant Green\n"
        "        END IF\n"
        "        \n"
        "        gradient = ctx.createRadialGradient(pixelCoord.x, pixelCoord.y, 0, pixelCoord.x, pixelCoord.y, radius)\n"
        "        gradient.addColorStop(0.0, 'rgba(' + rgb + ', 0.50)')\n"
        "        gradient.addColorStop(0.5, 'rgba(' + rgb + ', 0.20)')\n"
        "        gradient.addColorStop(1.0, 'rgba(' + rgb + ', 0.00)')\n"
        "        \n"
        "        ctx.fillStyle = gradient\n"
        "        ctx.beginPath()\n"
        "        ctx.arc(pixelCoord.x, pixelCoord.y, radius, 0, 2 * PI)\n"
        "        ctx.fill()\n"
        "    END FOR\n"
        "END FUNCTION"
    )
    add_body(code_heat)

    add_h1("5.3 Platform Architecture and Component Hierarchy")
    add_body(
        "Crime Nova's component architecture is structured hierarchically:\n"
        "• AppRoot (App.jsx): Initializes BrowserRouter and wraps the application tree inside AuthProvider. AppLayout evaluates route "
        "paths, rendering Navbar and Footer globally across all routes while concealing them on the dedicated /login view.\n"
        "• AuthContext (AuthContext.jsx): Maintains global reactive state for currentUser, loading flags, and helper functions (login, signup, "
        "loginWithGoogle, logout, resetPassword) using Firebase Auth observers.\n"
        "• Page Tier: LandingPage, CrimeMapPage, DashboardPage, PredictionPage, SOSPage, AdminPage, LoginPage.\n"
        "• Component Tier: Navigation bars, footers, map overlays, chart containers, and modal dialogs.\n"
        "• Services Tier: Firebase initialization, Leaflet tile layers, Chart.js registry configurations, and crime data utilities."
    )

    # =============================================================
    # CHAPTER 6: RESULTS AND TESTING
    # =============================================================
    add_chapter_title("6", "Results and Testing")

    add_h1("6.1 Verification Methodology and Testing Strategy")
    add_body(
        "To validate the operational reliability, security, and performance of Crime Nova, an exhaustive verification suite was executed "
        "encompassing four core testing dimensions:\n"
        "1. Unit & Build Verification: Verifying JavaScript/JSX syntax, React component rendering, hook lifecycle dependencies, and production bundle generation via Vite.\n"
        "2. Functional & Integration Testing: Validating user authentication workflows, dynamic Leaflet heatmap rendering, Chart.js dataset binding, and SOS ticket dispatching.\n"
        "3. Geolocation Accuracy Testing: Evaluating HTML5 GPS telemetry under varying hardware conditions, accuracy radii, and network conditions.\n"
        "4. Performance & Load Verification: Auditing First Contentful Paint (FCP), Cumulative Layout Shift (CLS), DOM memory usage during canvas pan/zoom, and Firestore WebSocket latency."
    )

    add_h1("6.2 Test Cases and Verification Outcomes")
    add_body(
        "Table 6.1 documents ten rigorous test cases conducted across all functional subsystems of Crime Nova, highlighting the test objective, "
        "input parameters, expected behavior, observed outcome, and final verification status."
    )

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("Table 6.1: System Verification Outcomes and Test Suite Execution Matrix")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r.font.bold = True

    tc_data = [
        ("Test ID", "Subsystem", "Verification Objective", "Input / Trigger", "Expected Outcome", "Observed Outcome", "Status"),
        ("TC-01", "Build Pipeline", "Validate production bundle compilation", "npm run build (Vite 8)", "Zero compile errors; minified JS/CSS chunks generated", "Compiled in 9.64s; zero errors; clean dist output", "Pass"),
        ("TC-02", "Auth Engine", "Verify email/password user authentication", "Valid email & password credentials", "Authenticate user; issue JWT token; update AuthContext", "Successfully authenticated; state persisted in context", "Pass"),
        ("TC-03", "Auth Engine", "Verify Google OAuth 2.0 popup federation", "Click 'Continue with Google'", "Launch Google consent; obtain OAuth credential; log in", "Popup executed smoothly; user profile created", "Pass"),
        ("TC-04", "Heatmap Engine", "Validate Leaflet radial density rendering", "Load /map with 30 city incidents", "Canvas overlay renders red/amber/green gradients", "Hardware canvas rendered accurately on move/zoom", "Pass"),
        ("TC-05", "Heatmap Engine", "Verify crime category & severity filters", "Select 'Theft' and 'High' filters", "Map display isolates matching incident markers", "Markers & heat canvas dynamically filtered", "Pass"),
        ("TC-06", "Analytics Engine", "Verify Chart.js visualizer rendering", "Navigate to /dashboard", "Render Bar, Line, and Doughnut distribution charts", "All 3 charts rendered with tooltips and animations", "Pass"),
        ("TC-07", "SOS Dispatcher", "Verify high-precision GPS coordinate capture", "Click 'Send Emergency SOS Alert'", "Acquire GPS lat/lng; create active Firestore ticket", "Retrieved coordinates; status switched to 'sent'", "Pass"),
        ("TC-08", "SOS Dispatcher", "Verify live dispatch timer & hotlines", "SOS alert state set to 'sent'", "Live second counter increments; hotlines dialable", "Counter started; Police (100) & Ambulance dialable", "Pass"),
        ("TC-09", "Admin Operations", "Verify SOS alert status transition", "Toggle ticket status to 'Responded'", "Update ticket state in Firestore; reflect in UI", "Ticket badge updated immediately in admin grid", "Pass"),
        ("TC-10", "Admin Operations", "Verify bulk dataset CSV ingestion engine", "Upload sample crime dataset CSV", "Validate CSV schema; display upload progress", "Parsed successfully; confirmation alert rendered", "Pass")
    ]

    tbl_tc = doc.add_table(rows=len(tc_data), cols=7)
    tbl_tc.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_tc)
    set_cell_padding(tbl_tc, top=50, bottom=50, left=60, right=60)

    for r_idx, (tid, subs, obj, inp, exp, obs, st) in enumerate(tc_data):
        row = tbl_tc.rows[r_idx]
        for c_idx, val in enumerate([tid, subs, obj, inp, exp, obs, st]):
            cell = row.cells[c_idx]
            cp = cell.paragraphs[0]
            cp.paragraph_format.space_after = Pt(2)
            if c_idx == 0:
                cell.width = Inches(0.6)
                cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
            elif c_idx == 1:
                cell.width = Inches(0.9)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            elif c_idx == 2:
                cell.width = Inches(1.2)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            elif c_idx == 3:
                cell.width = Inches(1.1)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            elif c_idx == 4:
                cell.width = Inches(1.3)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            elif c_idx == 5:
                cell.width = Inches(1.3)
                cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            else:
                cell.width = Inches(0.5)
                cp.alignment = WD_ALIGN_PARAGRAPH.CENTER

            cr = cp.add_run(val)
            cr.font.name = 'Times New Roman'
            cr.font.size = Pt(8.5)
            if r_idx == 0:
                set_cell_shading(cell, "E2E8F0")
                cr.font.bold = True
            elif c_idx == 6 and val == "Pass":
                cr.font.bold = True
                cr.font.color.rgb = RGBColor(0x05, 0x96, 0x69)

    # =============================================================
    # CHAPTER 7: CONCLUSION AND FUTURE SCOPE
    # =============================================================
    add_chapter_title("7", "Conclusion and Future Scope")

    add_h1("7.1 Conclusion")
    add_body(
        "Crime Nova demonstrates an innovative, production-oriented solution to the growing challenges of urban public safety. "
        "By fusing modern web standards (React 19, Leaflet, Chart.js) with cloud-native serverless architecture (Google Firebase Authentication "
        "and Cloud Firestore), the platform successfully eliminates information asymmetry in municipal crime statistics. Citizens gain "
        "immediate spatial intelligence to evaluate neighborhood safety, analyze temporal crime distributions, and inspect machine-learning-predicted "
        "risk hotspots. In acute danger, the one-tap Emergency SOS dispatcher captures high-precision GPS coordinates and creates instantaneous "
        "distress tickets, overcoming the communication barriers of traditional voice emergency hotlines."
    )
    add_body(
        "Concurrently, the Administrative Operations Center provides law enforcement dispatchers with a real-time command dashboard to triage "
        "active distress calls, coordinate responder personnel, and maintain updated municipal incident databases through seamless CSV ingestion. "
        "System testing confirms zero build defects, sub-second initial page renders, resilient client-side routing, and instantaneous WebSocket "
        "synchronization, validating Crime Nova as a practical, scalable, and lifesaving public safety asset."
    )

    add_h1("7.2 Future Scope & Emerging Enhancements")
    add_body(
        "While Crime Nova successfully achieves all targeted project objectives, several promising directions exist for future expansion:\n"
        "1. IoT Surveillance Drone Integration: Integrating automated drone fleet dispatch algorithms that automatically launch nearby municipal "
        "drones to stream live aerial video footage to the police control room upon receiving an SOS distress coordinate.\n"
        "2. Voice-Activated Acoustic Distress Recognition: Incorporating Edge AI machine learning models on mobile devices capable of detecting "
        "acoustic stress patterns (screams, gunshots, glass breakage) and triggering silent SOS dispatches without requiring physical screen taps.\n"
        "3. Integration with Police Computer-Aided Dispatch (CAD): Establishing certified enterprise API bridges with government emergency networks "
        "(such as India's Emergency Response Support System - ERSS 112) to automatically inject distress tickets into active police vehicle mobile data terminals (MDTs).\n"
        "4. Native Mobile Application with Edge ML: Porting Crime Nova to React Native for iOS and Android, incorporating offline spatial map caching "
        "and on-device TensorFlow Lite models for zero-connectivity crime risk inference.\n"
        "5. Multilingual NLP Incident Reporting: Developing natural language processing (NLP) pipelines supporting major regional Indian languages "
        "(Hindi, Gujarati, Marathi, Tamil, Telugu) enabling citizens to report incidents via voice notes and vernacular text."
    )

    # =============================================================
    # CHAPTER 8: SCREENSHOTS
    # =============================================================
    add_chapter_title("8", "Screenshots")

    add_h1("8.1 Landing Page & Public Crime Intelligence Interface")
    add_body(
        "The landing page introduces citizens to Crime Nova's core safety capabilities, presenting a high-impact hero banner, "
        "core platform metrics (3,700+ crimes analyzed, 30+ locations tracked, 92% prediction accuracy, < 3 min average response), "
        "and quick access pathways to the interactive map, analytics dashboard, AI prediction engine, and emergency SOS dispatcher."
    )
    add_fig_image(os.path.join(fig_dir, "screen_1_landing.png"),
                  "Figure 8.1: Crime Nova Futuristic Landing Page and Public Safety Metrics")

    add_h1("8.2 Interactive Geospatial Crime Heatmap")
    add_body(
        "Figure 8.2 depicts the interactive crime mapping engine. Leaflet map tiles render across major metropolitan centers, with custom "
        "HTML5 Canvas radial gradient overlays highlighting high-, medium-, and low-severity incident clusters. Dynamic filter dropdowns allow "
        "citizens to isolate specific crime types (Theft, Robbery, Assault, Cybercrime, Fraud, Vandalism) and severity bands."
    )
    add_fig_image(os.path.join(fig_dir, "screen_2_crime_map.png"),
                  "Figure 8.2: Interactive Geospatial Crime Heatmap with Dynamic Radius Filtering")

    add_h1("8.3 Crime Analytics Dashboard")
    add_body(
        "The analytics dashboard provides comprehensive statistical visualizers powered by Chart.js. The interface features categorical "
        "case distribution bar charts, proportional doughnut charts, monthly comparative crime curves, and an area-wise statistical breakdown "
        "tracking incidents across Delhi, Mumbai, Bangalore, Kolkata, and Hyderabad."
    )
    add_fig_image(os.path.join(fig_dir, "screen_3_dashboard.png"),
                  "Figure 8.3: Crime Analytics Dashboard with Category Distribution & Trends")

    add_h1("8.4 AI Crime Risk Prediction Portal")
    add_body(
        "Figure 8.4 illustrates the AI prediction portal. Machine learning risk models display neighborhood vulnerability ratings, "
        "projected crime counts, trend trajectories (increasing, stable, decreasing), peak risk hour curves, and day-of-week crime probability "
        "histograms to assist citizens and patrol units in route planning."
    )
    add_fig_image(os.path.join(fig_dir, "screen_4_prediction.png"),
                  "Figure 8.4: AI Crime Risk Prediction Portal displaying Peak Hours & Hotspots")

    add_h1("8.5 One-Tap Emergency SOS Dispatcher")
    add_body(
        "The Emergency SOS page features a high-visibility distress button linked to the browser's W3C Geolocation API. Upon activation, "
        "the page retrieves high-accuracy GPS coordinates, centers a Leaflet satellite pinpoint, logs an active emergency ticket in Cloud Firestore, "
        "and displays rapid dialer cards for Police (100), Ambulance (108), Fire (101), and Women Helplines (1091)."
    )
    add_fig_image(os.path.join(fig_dir, "screen_5_sos.png"),
                  "Figure 8.5: One-Tap Emergency SOS Dispatcher with Live GPS Positioning")

    add_h1("8.6 Administrative Operations Control Center")
    add_body(
        "The Administrative Control Center equips law enforcement personnel with real-time operational oversight. The SOS Alerts tab (Figure 8.6) "
        "displays active distress tickets, victim phone numbers, incident coordinates, and triage status buttons (Active, Responded, Resolved). "
        "The Crime Data tab (Figure 8.7) provides an interactive tabular explorer for auditing historical incident records. The Upload Dataset tab "
        "(Figure 8.8) enables administrators to ingest new municipal crime CSV datasets."
    )
    add_fig_image(os.path.join(fig_dir, "screen_6_admin_alerts.png"),
                  "Figure 8.6: Administrative Operations Control Center – Live SOS Dispatch Queue")

    add_fig_image(os.path.join(fig_dir, "screen_7_admin_data.png"),
                  "Figure 8.7: Administrative Incident Data Explorer and Filtering Grid")

    add_fig_image(os.path.join(fig_dir, "screen_8_admin_upload.png"),
                  "Figure 8.8: Administrative Dataset Ingestion and CSV Upload Interface")

    # =============================================================
    # REFERENCES
    # =============================================================
    doc.add_page_break()

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(18)
    r = p.add_run("REFERENCES")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True

    references = [
        "1. React Documentation. React – A JavaScript library for building user interfaces. Meta Open Source. Available at: https://react.dev/",
        "2. Google Firebase Documentation. Firebase Documentation: Authentication, Cloud Firestore, and Cloud Storage. Google Cloud. Available at: https://firebase.google.com/docs/",
        "3. Leaflet Documentation. Leaflet – An open-source JavaScript library for mobile-friendly interactive maps. Available at: https://leafletjs.com/",
        "4. Chart.js Documentation. Chart.js – Simple yet flexible JavaScript charting for designers & developers. Available at: https://www.chartjs.org/docs/",
        "5. Vite Documentation. Vite – Next Generation Frontend Tooling. Available at: https://vite.dev/guide/",
        "6. National Crime Records Bureau (NCRB). Crime in India Annual Compendium Reports. Ministry of Home Affairs, Government of India. Available at: https://ncrb.gov.in/",
        "7. W3C Geolocation API Specification. Geolocation API (Second Edition). World Wide Web Consortium (W3C). Available at: https://www.w3.org/TR/geolocation-API/",
        "8. OpenStreetMap Foundation. OpenStreetMap Data and Tile Server Usage Policies. Available at: https://www.openstreetmap.org/",
        "9. Auth0 by Okta. JSON Web Token (JWT) Architecture and Security Best Practices. Available at: https://jwt.io/introduction/",
        "10. Lucide Developers. Lucide Icons – Beautiful & consistent icon toolkit made by the community. Available at: https://lucide.dev/",
        "11. Silverman, B. W. (1986). Density Estimation for Statistics and Data Analysis. Chapman and Hall, London.",
        "12. Chainey, S., Tompson, L., & Uhlig, S. (2008). The utility of hotspot mapping for predicting spatial patterns of crime. Security Journal, 21(1), 4-28.",
        "13. Breiman, L. (2001). Random Forests. Machine Learning, 45(1), 5-32.",
        "14. Fielding, R. T. (2000). Architectural Styles and the Design of Network-based Software Architectures. Doctoral dissertation, University of California, Irvine.",
        "15. Mozilla Developer Network (MDN). Canvas API – Web APIs and Hardware Acceleration. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API"
    ]

    for ref in references:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(6)
        r = p.add_run(ref)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)

    # -------------------------------------------------------------
    # Save Document
    # -------------------------------------------------------------
    output_docx = r"d:\Downloads\crime-nova\src\docx\Crime-Nova_Major_Project_Report.docx"
    doc.save(output_docx)
    print(f"Successfully generated Crime Nova Major Project Report: {output_docx}")
    print(f"Total paragraphs: {len(doc.paragraphs)}, Total tables: {len(doc.tables)}")

if __name__ == "__main__":
    create_report()
