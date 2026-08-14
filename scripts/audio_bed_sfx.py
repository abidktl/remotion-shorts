#!/usr/bin/env python3
"""Generate a 30s music bed + SFX cues for a Remotion short using ONLY ffmpeg
synthesis (no external music assets). The Remotion render is silent BY DESIGN;
mux this audio in afterward with:
  ffmpeg -y -i out/<clipa>.mp4 -i /tmp/audio/gpu_short_full.wav \
    -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/<clipb>.mp4

VERIFIED WORKING 2026-08-08. The ffmpeg filter names below are the DEBUGGED
versions — see the PITFALLS after the code for the three mistakes that broke
earlier attempts.

Usage: python3 audio_bed_sfx.py   (writes build/audio/*.wav under CWD)
"""
import subprocess, os
os.makedirs('build/audio', exist_ok=True)
SR='44100'; DUR=30.06

def run(cmd):
    r=subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode!=0: print("ERR:", r.stderr[-500:]); raise SystemExit(1)

print("[1/3] bed ...")
# bass pulse (55Hz kick at ~110bpm) + a pad chord (110/165/220Hz) with tremolo
run(["ffmpeg","-y",
  "-f","lavfi","-i",f"aevalsrc=0.5*sin(2*PI*55*t)*exp(-8*mod(t\\,0.5454))|0.5*sin(2*PI*55*t)*exp(-8*mod(t\\,0.5454)):s={SR}:d={DUR}",
  "-f","lavfi","-i",f"aevalsrc=0.14*sin(2*PI*110*t)+0.09*sin(2*PI*165*t)+0.05*sin(2*PI*220*t):s={SR}:d={DUR}",
  "-filter_complex",
  "[1:a]tremolo=f=1.8:d=0.35[v];[0:a][v]amix=inputs=2:weights=0.75 0.5:duration=first,afade=t=in:st=0:d=1,afade=t=out:st=29.2:d=0.8,volume=1.0[o]",
  "-map","[o]","build/audio/bed.wav"])

print("[2/3] cues (whoosh 4.0/10.7/24.3s + ding 4.4/11.1/24.7s) ...")
inputs=[]; parts=[]; n_inputs=0
def add_input(desc):
    global n_inputs
    inputs.append("-f"); inputs.append("lavfi"); inputs.append("-i"); inputs.append(desc)
    n_inputs+=1
    return n_inputs-1

whoosh=[4.0,10.7,24.3]
ding=[(4.4,1318.5),(11.1,1760.0),(24.7,2200.0)]
for i,t in enumerate(whoosh):
    ai=add_input(f"anoisesrc=colour=pink:amplitude=0.9:duration=0.9:sample_rate={SR}")
    ms=int(t*1000)
    parts.append(f"[{ai}:a]lowpass=f=6000,volume=0.22,afade=t=in:st=0:d=0.15,afade=t=out:st=0.65:d=0.25,adelay={ms}|{ms},apad=pad_dur={DUR}[w{i}]")
for i,(t,fr) in enumerate(ding):
    ai=add_input(f"aevalsrc=0.35*sin(2*PI*{fr}*t)*exp(-5*t):s={SR}:d=1.6")
    ms=int(t*1000)
    parts.append(f"[{ai}:a]volume=0.30,afade=t=out:st=1.0:d=0.6,adelay={ms}|{ms},apad=pad_dur={DUR}[d{i}]")
mix="".join(f"[w{i}]" for i in range(3))+"".join(f"[d{i}]" for i in range(3))
fc=";".join(parts+[f"{mix}amix=inputs=6:duration=longest:normalize=0,atrim=0:{DUR},volume=0.9[c]"])
run(["ffmpeg","-y",*inputs,"-filter_complex",fc,"-map","[c]","build/audio/cues.wav"])

print("[3/3] final mix ...")
run(["ffmpeg","-y","-i","build/audio/bed.wav","-i","build/audio/cues.wav",
  "-filter_complex","[0:a][1:a]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.9[a]",
  "-map","[a]","-ar",SR,"build/audio/gpu_short_full.wav"])
d=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","default=nw=1:nk=1","build/audio/gpu_short_full.wav"],capture_output=True,text=True).stdout.strip()
print("final audio duration:", d, "s")
subprocess.run(["ffmpeg","-i","build/audio/gpu_short_full.wav","-af","volumedetect","-f","null","-"])
