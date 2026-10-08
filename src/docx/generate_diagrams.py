import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

output_dir = r"d:\Downloads\crime-nova\src\docx\figures"
os.makedirs(output_dir, exist_ok=True)

plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'

def draw_box(ax, x, y, w, h, text, color='#2563eb', bg_color='#eff6ff', fontsize=10, bold=False):
    rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.2",
                                  edgecolor=color, facecolor=bg_color, linewidth=1.8)
    ax.add_patch(rect)
    weight = 'bold' if bold else 'normal'
    ax.text(x + w/2, y + h/2, text, ha='center', va='center', fontsize=fontsize,
            color='#1e293b', weight=weight, multialignment='center')

def draw_arrow(ax, x1, y1, x2, y2, label=None, label_pos=0.5, offset_y=0.2, color='#475569'):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="->", color=color, lw=1.6, shrinkA=5, shrinkB=5))
    if label:
        lx = x1 + (x2 - x1) * label_pos
        ly = y1 + (y2 - y1) * label_pos + offset_y
        ax.text(lx, ly, label, ha='center', va='center', fontsize=8, color='#334155',
                backgroundcolor='white', bbox=dict(boxstyle='round,pad=0.2', facecolor='white', edgecolor='#cbd5e1', lw=0.8))

# -------------------------------------------------------------
# 1. Figure 1.1: System Overview
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6)
ax.axis('off')

draw_box(ax, 0.5, 4.2, 2.2, 1.2, "Citizen / Public\n• Real-Time Heatmaps\n• View Crime Analytics\n• 1-Tap SOS Dispatch", '#0284c7', '#e0f2fe', 8.5, True)
draw_box(ax, 0.5, 2.4, 2.2, 1.2, "Law Enforcement\n• Hotspot Predictions\n• Patrol Route Guidance\n• Live SOS Monitoring", '#7c3aed', '#f5f3ff', 8.5, True)
draw_box(ax, 0.5, 0.6, 2.2, 1.2, "System Admin\n• Dataset Ingestion\n• Incident Auditing\n• Dispatch Resolution", '#059669', '#ecfdf5', 8.5, True)

draw_box(ax, 3.8, 1.8, 2.5, 2.8, "CRIME NOVA PLATFORM\n\n• React 19 Frontend\n• Leaflet Geospatial Heatmap\n• Chart.js Visualizer\n• ML Predictive Engine\n• GPS Geolocation Service", '#1d4ed8', '#dbeafe', 9.5, True)

draw_box(ax, 7.3, 4.2, 2.2, 1.2, "Firebase Auth\n• JWT Token Issuance\n• Google OAuth 2.0\n• Role-Based ACL", '#ea580c', '#fff7ed', 8.5, True)
draw_box(ax, 7.3, 2.4, 2.2, 1.2, "Cloud Firestore\n• Real-Time Crime Logs\n• Active SOS Queue\n• Geospatial Datasets", '#d97706', '#fef3c7', 8.5, True)
draw_box(ax, 7.3, 0.6, 2.2, 1.2, "Emergency Services\n• Police Dispatch (100)\n• Ambulance Unit (108)\n• Helplines (1091/101)", '#dc2626', '#fef2f2', 8.5, True)

draw_arrow(ax, 2.7, 4.8, 3.8, 3.8, "Search & Alerts")
draw_arrow(ax, 2.7, 3.0, 3.8, 3.2, "Patrol Requests")
draw_arrow(ax, 2.7, 1.2, 3.8, 2.6, "Manage Data")

draw_arrow(ax, 6.3, 3.8, 7.3, 4.8, "Auth Token")
draw_arrow(ax, 6.3, 3.2, 7.3, 3.0, "Sync Live Data")
draw_arrow(ax, 6.3, 2.6, 7.3, 1.2, "Dispatch Signal")

plt.tight_layout()
plt.savefig(os.path.join(output_dir, "fig1_1_system_overview.png"), bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# 2. Figure 4.1: Level 0 DFD (Context Diagram)
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(9, 5), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6)
ax.axis('off')

# Core process (Circle / rounded box)
draw_box(ax, 3.7, 2.0, 2.6, 2.0, "0.0\nCRIME NOVA\nINTELLIGENCE\nSYSTEM", '#1e40af', '#dbeafe', 10, True)

# External Entities
draw_box(ax, 0.5, 4.0, 1.8, 1.2, "Citizen /\nPublic User", '#0284c7', '#f0f9ff', 9, True)
draw_box(ax, 0.5, 0.8, 1.8, 1.2, "Law Enforcement\n/ Police", '#7c3aed', '#faf5ff', 9, True)
draw_box(ax, 7.7, 4.0, 1.8, 1.2, "System\nAdministrator", '#059669', '#f0fdf4', 9, True)
draw_box(ax, 7.7, 0.8, 1.8, 1.2, "Emergency\nServices / CAD", '#dc2626', '#fef2f2', 9, True)

draw_arrow(ax, 2.3, 4.8, 3.7, 3.6, "SOS Request, GPS Coords")
draw_arrow(ax, 3.7, 3.1, 2.3, 4.3, "Heatmap & Crime Stats")

draw_arrow(ax, 2.3, 1.4, 3.7, 2.4, "Patrol Route Queries")
draw_arrow(ax, 3.7, 2.1, 2.3, 1.1, "Hotspot Risk Predictions")

draw_arrow(ax, 7.7, 4.8, 6.3, 3.6, "Dataset CSV & Moderation")
draw_arrow(ax, 6.3, 3.1, 7.7, 4.3, "System Logs & Audit")

draw_arrow(ax, 6.3, 2.4, 7.7, 1.4, "Real-time Distress Alerts")
draw_arrow(ax, 7.7, 1.1, 6.3, 2.1, "Response & Unit Status")

plt.tight_layout()
plt.savefig(os.path.join(output_dir, "fig4_1_dfd_level0.png"), bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# 3. Figure 4.2: Level 1 DFD (Platform Workflow)
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
ax.set_xlim(0, 11)
ax.set_ylim(0, 8)
ax.axis('off')

# Processes
draw_box(ax, 0.6, 5.8, 2.2, 1.2, "1.0\nAuthentication\n& Authorization", '#2563eb', '#eff6ff', 8.5, True)
draw_box(ax, 4.4, 5.8, 2.2, 1.2, "2.0\nGeospatial Crime\nMapping Engine", '#0284c7', '#e0f2fe', 8.5, True)
draw_box(ax, 8.2, 5.8, 2.2, 1.2, "3.0\nAnalytics &\nTrend Visualizer", '#0d9488', '#ccfbf1', 8.5, True)

draw_box(ax, 0.6, 1.8, 2.2, 1.2, "4.0\nEmergency SOS\nDispatcher", '#dc2626', '#fef2f2', 8.5, True)
draw_box(ax, 4.4, 1.8, 2.2, 1.2, "5.0\nML Hotspot &\nRisk Prediction", '#7c3aed', '#f5f3ff', 8.5, True)
draw_box(ax, 8.2, 1.8, 2.2, 1.2, "6.0\nIncident & Dataset\nAdministration", '#ea580c', '#fff7ed', 8.5, True)

# Data Stores
draw_box(ax, 1.5, 3.8, 2.0, 0.9, "D1: Users & Roles\n(Firestore)", '#475569', '#f8fafc', 8, True)
draw_box(ax, 4.5, 3.8, 2.0, 0.9, "D2: Crime Records\n(Firestore)", '#475569', '#f8fafc', 8, True)
draw_box(ax, 7.5, 3.8, 2.0, 0.9, "D3: SOS Queue\n(Firestore)", '#475569', '#f8fafc', 8, True)

# Flows
draw_arrow(ax, 1.7, 5.8, 2.0, 4.7, "User Token")
draw_arrow(ax, 2.8, 6.4, 4.4, 6.4, "Auth Context")
draw_arrow(ax, 5.5, 5.8, 5.5, 4.7, "Read Incidents")
draw_arrow(ax, 6.6, 6.4, 8.2, 6.4, "Filtered Data")
draw_arrow(ax, 5.5, 3.8, 5.5, 3.0, "Historical Incidents")
draw_arrow(ax, 1.7, 3.0, 1.7, 3.8, "Verify User")
draw_arrow(ax, 2.8, 2.4, 4.4, 2.4, "Trigger Alerts")
draw_arrow(ax, 2.8, 1.8, 7.5, 3.8, "Log SOS Event")
draw_arrow(ax, 6.6, 2.4, 8.2, 2.4, "Risk Scores")
draw_arrow(ax, 8.5, 3.8, 8.5, 3.0, "Update Status")

plt.tight_layout()
plt.savefig(os.path.join(output_dir, "fig4_2_dfd_level1.png"), bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# 4. Figure 4.3: System Architecture (Multi-Tier Cloud)
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 7)
ax.axis('off')

# Tier 1: Presentation
draw_box(ax, 0.5, 4.8, 9.0, 1.8, "TIER 1: PRESENTATION LAYER (Single Page Application)\n\n• React 19.2 + Vite Bundler   • React-Leaflet & OpenStreetMap Tiles   • Chart.js & React-Chartjs-2\n• Lucide-React Iconography    • Glassmorphic CSS Design System          • Responsive Desktop/Mobile", '#2563eb', '#eff6ff', 9, True)

# Tier 2: Application / Services
draw_box(ax, 0.5, 2.6, 9.0, 1.8, "TIER 2: APPLICATION & CLOUD SERVICES LAYER\n\n• Firebase Authentication (Stateless JWT / Google OAuth 2.0 / Role Provider)\n• HTML5 W3C Geolocation API & Coordinate Normalization Engine\n• ML Crime Risk Predictor & Kernel Density Estimation Heatmap Generator\n• Firebase Cloud Functions (Background Triggers & Real-time Alert Notifier)", '#7c3aed', '#f5f3ff', 9, True)

# Tier 3: Data Tier
draw_box(ax, 0.5, 0.4, 9.0, 1.8, "TIER 3: DATA & PERSISTENCE LAYER (Google Cloud Firestore & Storage)\n\n• Cloud Firestore NoSQL Database (Real-time collections: 'users', 'crimes', 'sos_alerts', 'predictions')\n• Firebase Cloud Storage (Dataset CSV repositories, Incident evidence media)\n• Firebase Security Rules (Client-side Row-Level ACL & RBAC Enforcement)", '#059669', '#ecfdf5', 9, True)

draw_arrow(ax, 5.0, 4.8, 5.0, 4.4, "HTTPS / WSS (Real-time Firestore Subscriptions & REST Calls)")
draw_arrow(ax, 5.0, 2.6, 5.0, 2.2, "Encrypted gRPC / TLS Persistence Operations")

plt.tight_layout()
plt.savefig(os.path.join(output_dir, "fig4_3_system_architecture.png"), bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# 5. Figure 4.4: Use Case Diagram
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 5.5), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6.5)
ax.axis('off')

draw_box(ax, 0.4, 3.8, 2.0, 1.4, "Citizen / Public\n(Authenticated / Guest)", '#0284c7', '#e0f2fe', 9, True)

draw_box(ax, 3.6, 5.2, 2.8, 0.8, "UC-01: View Heatmap & Filter Crime", '#1e293b', '#ffffff', 8.5)
draw_box(ax, 3.6, 4.2, 2.8, 0.8, "UC-02: Inspect Analytics & Charts", '#1e293b', '#ffffff', 8.5)
draw_box(ax, 3.6, 3.2, 2.8, 0.8, "UC-03: Query Predicted Peak Hours", '#1e293b', '#ffffff', 8.5)
draw_box(ax, 3.6, 2.2, 2.8, 0.8, "UC-04: Trigger 1-Tap Emergency SOS", '#dc2626', '#fef2f2', 8.5, True)
draw_box(ax, 3.6, 1.2, 2.8, 0.8, "UC-05: Register / Login with Google", '#1e293b', '#ffffff', 8.5)

draw_box(ax, 7.6, 2.2, 2.0, 1.4, "System Admin /\nPolice Dispatcher", '#059669', '#ecfdf5', 9, True)

draw_box(ax, 3.6, 0.2, 2.8, 0.8, "UC-06: Dispatch & Resolve SOS", '#059669', '#ecfdf5', 8.5)
draw_box(ax, 7.2, 4.8, 2.5, 0.8, "UC-07: Ingest Crime Dataset CSV", '#1e293b', '#ffffff', 8.5)
draw_box(ax, 7.2, 3.8, 2.5, 0.8, "UC-08: Audit Incident Records", '#1e293b', '#ffffff', 8.5)

draw_arrow(ax, 2.4, 4.5, 3.6, 5.6)
draw_arrow(ax, 2.4, 4.5, 3.6, 4.6)
draw_arrow(ax, 2.4, 4.5, 3.6, 3.6)
draw_arrow(ax, 2.4, 4.5, 3.6, 2.6)
draw_arrow(ax, 2.4, 4.5, 3.6, 1.6)

draw_arrow(ax, 7.6, 2.9, 6.4, 2.6)
draw_arrow(ax, 7.6, 2.9, 6.4, 0.6)
draw_arrow(ax, 8.6, 3.6, 8.6, 4.8)
draw_arrow(ax, 8.6, 3.6, 8.6, 3.8)

plt.tight_layout()
plt.savefig(os.path.join(output_dir, "fig4_4_use_case_diagram.png"), bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# 6. Figure 4.6: Entity-Relationship Diagram (Firestore Schema)
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 7)
ax.axis('off')

draw_box(ax, 0.5, 3.8, 2.6, 2.6, "USERS COLLECTION\n\n• uid (PK, String)\n• displayName (String)\n• email (String, Unique)\n• role (user | admin | police)\n• phone (String)\n• emergencyContact (String)\n• createdAt (Timestamp)", '#2563eb', '#eff6ff', 8, True)

draw_box(ax, 4.0, 3.8, 2.6, 2.6, "CRIMES COLLECTION\n\n• crimeId (PK, String)\n• type (Theft | Robbery | Assault)\n• severity (high | med | low)\n• lat (Double)\n• lng (Double)\n• area (String, City/State)\n• incidentDate (Date)\n• reportedBy (FK -> uid)", '#0284c7', '#e0f2fe', 8, True)

draw_box(ax, 7.2, 3.8, 2.6, 2.6, "SOS_ALERTS COLLECTION\n\n• alertId (PK, String)\n• userId (FK -> uid)\n• victimName (String)\n• phone (String)\n• lat (Double)\n• lng (Double)\n• status (active|responded|resolved)\n• responderType (Police|Ambulance)\n• triggeredAt (Timestamp)", '#dc2626', '#fef2f2', 8, True)

draw_box(ax, 0.5, 0.6, 2.6, 2.4, "PREDICTIONS COLLECTION\n\n• predId (PK, String)\n• city (String)\n• riskScore (Integer 0-100)\n• dominantType (String)\n• trend (increasing|decreasing)\n• predictedCrimes (Integer)\n• generatedAt (Timestamp)", '#7c3aed', '#f5f3ff', 8, True)

draw_box(ax, 4.0, 0.6, 2.6, 2.4, "HOTSPOTS COLLECTION\n\n• hotspotId (PK, String)\n• areaName (String)\n• centerLat (Double)\n• centerLng (Double)\n• radiusMeters (Double)\n• riskIndex (Float)\n• peakHourRange (String)", '#d97706', '#fef3c7', 8, True)

draw_box(ax, 7.2, 0.6, 2.6, 2.4, "AUDIT_LOGS COLLECTION\n\n• logId (PK, String)\n• adminId (FK -> uid)\n• action (upload | status_update)\n• targetCollection (String)\n• metadata (JSON Object)\n• timestamp (Timestamp)", '#059669', '#ecfdf5', 8, True)

draw_arrow(ax, 3.1, 5.1, 4.0, 5.1, "1 : N (Reports)")
draw_arrow(ax, 3.1, 4.5, 7.2, 4.5, "1 : N (Triggers)")
draw_arrow(ax, 3.1, 4.0, 7.2, 1.8, "1 : N (Performs)")
draw_arrow(ax, 5.3, 3.8, 5.3, 3.0, "Aggregates to")

plt.tight_layout()
plt.savefig(os.path.join(output_dir, "fig4_6_erd_diagram.png"), bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# 7. Figure 4.7: Emergency SOS Sequence Flow
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 5.5), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 7)
ax.axis('off')

draw_box(ax, 0.4, 6.0, 1.6, 0.7, "Victim / Citizen", '#0284c7', '#e0f2fe', 8.5, True)
draw_box(ax, 2.7, 6.0, 1.6, 0.7, "Crime Nova Client", '#2563eb', '#eff6ff', 8.5, True)
draw_box(ax, 5.0, 6.0, 1.6, 0.7, "HTML5 GPS API", '#0d9488', '#ccfbf1', 8.5, True)
draw_box(ax, 7.3, 6.0, 1.6, 0.7, "Firestore & Functions", '#ea580c', '#fff7ed', 8.5, True)

for x in [1.2, 3.5, 5.8, 8.1]:
    ax.plot([x, x], [0.8, 6.0], linestyle='--', color='#94a3b8', lw=1.2)

draw_arrow(ax, 1.2, 5.2, 3.5, 5.2, "1. Press 'Send SOS Alert'")
draw_arrow(ax, 3.5, 4.6, 5.8, 4.6, "2. Request navigator.geolocation")
draw_arrow(ax, 5.8, 4.0, 3.5, 4.0, "3. Return (lat, lng, accuracy)")
draw_arrow(ax, 3.5, 3.4, 8.1, 3.4, "4. Create SOSAlert doc in Firestore")
draw_arrow(ax, 8.1, 2.8, 8.1, 2.3, "5. Trigger Cloud Function")
draw_arrow(ax, 8.1, 2.3, 3.5, 2.3, "6. Broadcast to Dispatch Board")
draw_arrow(ax, 3.5, 1.6, 1.2, 1.6, "7. Confirm Alert Sent + Live Timer")

plt.tight_layout()
plt.savefig(os.path.join(output_dir, "fig4_7_sequence_sos.png"), bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# 8. Figure 5.1: ML Prediction & Risk Scoring Pipeline
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 5)
ax.axis('off')

draw_box(ax, 0.4, 2.0, 1.6, 1.4, "Historical Crime\nDataset Ingestion\n(CSV / Firestore)", '#475569', '#f8fafc', 8, True)
draw_box(ax, 2.3, 2.0, 1.6, 1.4, "Spatio-Temporal\nFeature Extraction\n(Hour, Day, Area)", '#0284c7', '#e0f2fe', 8, True)
draw_box(ax, 4.2, 2.0, 1.6, 1.4, "Kernel Density &\nRandom Forest\nRisk Regression", '#7c3aed', '#f5f3ff', 8, True)
draw_box(ax, 6.1, 2.0, 1.6, 1.4, "Hotspot Ranking &\nPeak Hour Risk\nCalculation", '#ea580c', '#fff7ed', 8, True)
draw_box(ax, 8.0, 2.0, 1.6, 1.4, "Interactive UI\nVisualizations\n(Charts & Map)", '#059669', '#ecfdf5', 8, True)

draw_arrow(ax, 2.0, 2.7, 2.3, 2.7)
draw_arrow(ax, 3.9, 2.7, 4.2, 2.7)
draw_arrow(ax, 5.8, 2.7, 6.1, 2.7)
draw_arrow(ax, 7.7, 2.7, 8.0, 2.7)

plt.tight_layout()
plt.savefig(os.path.join(output_dir, "fig5_1_prediction_pipeline.png"), bbox_inches='tight')
plt.close()

print("All 8 high-resolution diagram figures successfully generated in:", output_dir)
