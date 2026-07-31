#!/usr/bin/env bash
# Batch-render Shorts from the data-driven template.
# Usage: ./render_all.sh [niche]
set -e
cd "$(dirname "$0")"

mkdir -p out

render_one() {
  local id="$1"
  local data="$2"
  echo "▶ Rendering $id..."
  npx remotion render src/index.ts DataShorts "out/$id.mp4" \
    --props="{\"data\": $data}" 2>&1 | tail -2
}

SOLAR='{"hook":"☀️ Solar Lagao","hookSub":"PM Surya Ghar Yojana","bg1":"#0b8a8a","rows":[{"label":"1 kW","value":"₹30,000"},{"label":"2 kW","value":"₹60,000"},{"label":"3 kW+","value":"₹78,000 CAP"}],"rowsBg":"#0f172a","cta":"Compare Now →","ctaSub":"Link in bio","bg3":"#d8108c"}'

PENSION='{"hook":"🧓 Pension Pao","hookSub":"Aasara Yojana — Telangana","bg1":"#0b8a8a","rows":[{"label":"Old Age","value":"₹2,016/mo"},{"label":"Widow","value":"₹2,016/mo"},{"label":"Disabled","value":"₹3,016/mo"}],"rowsBg":"#0f172a","cta":"Check Eligibility →","ctaSub":"Link in bio","bg3":"#d8108c"}'

KALYANA='{"hook":"💍 Shaadi Grant","hookSub":"Kalyana Lakshmi — Telangana","bg1":"#7c3aed","rows":[{"label":"SC/ST/BC Brides","value":"₹1,00,116"},{"label":"Minority Brides","value":"₹1,00,116"},{"label":"Before Marriage","value":"One-time"}],"rowsBg":"#0f172a","cta":"Apply Help →","ctaSub":"Link in bio","bg3":"#d8108c"}'

GPU='{"hook":"⚡ H100 vs H200","hookSub":"Cloud GPU Prices 2026","bg1":"#0b8a8a","rows":[{"label":"H100","value":"$2.50/hr"},{"label":"H200","value":"$2.80/hr"},{"label":"A100","value":"$1.67/hr"}],"rowsBg":"#0f172a","cta":"Compare Providers →","ctaSub":"Link in bio","bg3":"#d8108c"}'

case "${1:-all}" in
  solar)   render_one "solar-short"    "$SOLAR" ;;
  pension) render_one "pension-short"  "$PENSION" ;;
  kalyana) render_one "kalyana-short"  "$KALYANA" ;;
  gpu)     render_one "gpu-short"      "$GPU" ;;
  all)
    render_one "solar-short"   "$SOLAR"
    render_one "pension-short" "$PENSION"
    render_one "kalyana-short" "$KALYANA"
    render_one "gpu-short"     "$GPU"
    ;;
esac

echo "✅ Done — out/:"
ls -la out/*.mp4
